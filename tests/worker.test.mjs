import assert from 'node:assert/strict'
import { webcrypto } from 'node:crypto'
import test from 'node:test'
import { createDefaultContentSnapshot } from '../src/lib/content-model.ts'
import worker from '../worker/index.ts'


if (typeof globalThis.crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
  });
}

const issuer = 'https://school.cloudflareaccess.com'
const audience = 'school-admin-audience'
const adminEmail = 'admin@example.com'
const keyId = 'test-access-key'
const signingPair = await webcrypto.subtle.generateKey(
  {
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  },
  true,
  ['sign', 'verify'],
)
const wrongSigningPair = await webcrypto.subtle.generateKey(
  {
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  },
  true,
  ['sign', 'verify'],
)
const publicJwk = { ...(await webcrypto.subtle.exportKey('jwk', signingPair.publicKey)), kid: keyId }

globalThis.fetch = async () =>
  Response.json({ keys: [publicJwk] }, { headers: { 'Content-Type': 'application/json' } })

function base64Url(value) {
  return Buffer.from(value).toString('base64url')
}

async function createToken(overrides = {}, privateKey = signingPair.privateKey) {
  const header = base64Url(JSON.stringify({ alg: 'RS256', kid: keyId }))
  const now = Math.floor(Date.now() / 1000)
  const claims = {
    aud: audience,
    email: adminEmail,
    exp: now + 300,
    iss: issuer,
    ...overrides,
  }
  const payload = base64Url(JSON.stringify(claims))
  const signed = `${header}.${payload}`
  const signature = await webcrypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(signed),
  )
  return `${signed}.${base64Url(signature)}`
}

function env(overrides = {}) {
  return {
    ASSETS: { fetch: async () => new Response('<!doctype html><html><head></head><body></body></html>') },
    ACCESS_TEAM_DOMAIN: 'school.cloudflareaccess.com',
    ACCESS_AUD: audience,
    ADMIN_EMAIL: adminEmail,
    ...overrides,
  }
}

async function request(path, { method = 'GET', token, origin, body, headers = {} } = {}, bindings = env()) {
  const requestHeaders = new Headers(headers)
  if (token) requestHeaders.set('Cf-Access-Jwt-Assertion', token)
  if (origin) requestHeaders.set('Origin', origin)
  return worker.fetch(new Request(`https://school.test${path}`, { method, headers: requestHeaders, body }), bindings)
}

function createUpdatesDatabase() {
  const records = new Map()

  function toRow(values) {
    const [
      id,
      slug,
      title,
      category,
      summary,
      body,
      publishedAt,
      effectiveAt,
      reopeningAt,
      schoolClosed,
      expiresAt,
      status,
      everPublished,
      pinned,
      attachmentsJson,
      createdAt,
      updatedAt,
    ] = values
    return {
      id,
      slug,
      title,
      category,
      summary,
      body,
      published_at: publishedAt,
      effective_at: effectiveAt,
      reopening_at: reopeningAt,
      school_closed: schoolClosed,
      expires_at: expiresAt,
      status,
      ever_published: everPublished,
      pinned,
      attachments_json: attachmentsJson,
      created_at: createdAt,
      updated_at: updatedAt,
    }
  }

  function publicRows(values, archive) {
    const now = Date.parse(values[0])
    return [...records.values()].filter((row) => {
      const published = Date.parse(row.published_at) <= now
      if (archive) {
        return published && (
          (row.status === 'archived' && row.ever_published === 1) ||
          (['published', 'scheduled'].includes(row.status) &&
            row.expires_at !== null &&
            Date.parse(row.expires_at) <= now)
        )
      }
      return published &&
        ['published', 'scheduled'].includes(row.status) &&
        (row.expires_at === null || Date.parse(row.expires_at) > now)
    })
  }

  return {
    prepare(sql) {
      return {
        bind(...values) {
          return {
            async first() {
              if (sql.startsWith('SELECT id FROM school_updates WHERE slug')) {
                const [slug, excludedId] = values
                const row = [...records.values()].find((item) => item.slug === slug && item.id !== excludedId)
                return row ? { id: row.id } : null
              }
              if (sql.startsWith('SELECT status, published_at, ever_published')) {
                const row = records.get(values[0])
                return row
                  ? { status: row.status, published_at: row.published_at, ever_published: row.ever_published }
                  : null
              }
              if (sql.startsWith('SELECT COUNT(*)')) {
                return { count: publicRows(values, sql.includes("status = 'archived'")).length }
              }
              if (sql.includes('WHERE slug = ?')) {
                const [slug, now] = values
                const row = [...records.values()].find((item) => item.slug === slug)
                if (!row || Date.parse(row.published_at) > Date.parse(now)) return null
                return row.status === 'archived' && row.ever_published === 1 ||
                  ['published', 'scheduled'].includes(row.status)
                  ? row
                  : null
              }
              if (sql.includes('WHERE id = ?')) return records.get(values[0]) ?? null
              return null
            },
            async all() {
              if (sql.includes('LIMIT ? OFFSET ?')) {
                const rows = publicRows(values, sql.includes("status = 'archived'"))
                const limit = Number(values.at(-2))
                const offset = Number(values.at(-1))
                return { results: rows.slice(offset, offset + limit) }
              }
              return { results: [] }
            },
            async run() {
              if (sql.startsWith('INSERT INTO school_updates')) {
                const row = toRow(values)
                records.set(row.id, row)
                return { meta: { changes: 1 } }
              }
              if (sql.startsWith('UPDATE school_updates SET')) {
                const [
                  slug,
                  title,
                  category,
                  summary,
                  body,
                  publishedAt,
                  effectiveAt,
                  reopeningAt,
                  schoolClosed,
                  expiresAt,
                  status,
                  everPublished,
                  pinned,
                  attachmentsJson,
                  updatedAt,
                  _updatedBy,
                  id,
                ] = values
                const current = records.get(id)
                if (!current) return { meta: { changes: 0 } }
                records.set(id, {
                  ...current,
                  slug,
                  title,
                  category,
                  summary,
                  body,
                  published_at: publishedAt,
                  effective_at: effectiveAt,
                  reopening_at: reopeningAt,
                  school_closed: schoolClosed,
                  expires_at: expiresAt,
                  status,
                  ever_published: everPublished,
                  pinned,
                  attachments_json: attachmentsJson,
                  updated_at: updatedAt,
                })
                return { meta: { changes: 1 } }
              }
              if (sql.startsWith('DELETE FROM school_updates')) {
                return { meta: { changes: Number(records.delete(values[0])) } }
              }
              return { meta: { changes: 0 } }
            },
          }
        },
        async all() {
          return { results: [...records.values()] }
        },
      }
    },
    async batch(statements) {
      const results = []
      for (const statement of statements) results.push(await statement.run())
      return results
    },
  }
}

function createMediaCleanupBindings({ content, attachments = [], referencedByLedger = false } = {}) {
  const key = 'b7d6a5c4-e3f2-4a1b-8c9d-0e1f2a3b4c5d.jpg'
  const cleanupLocks = new Set()
  const deletedKeys = []
  let deleteFails = false
  const database = {
    prepare(sql) {
      const statement = (values = []) => ({
        bind: (...boundValues) => statement(boundValues),
        async first() {
          if (sql.startsWith('SELECT content_json')) {
            return content ? { content_json: JSON.stringify(content) } : null
          }
          return null
        },
        async all() {
          if (sql.startsWith('SELECT attachments_json FROM school_updates')) {
            return { results: attachments.map((entry) => ({ attachments_json: JSON.stringify(entry) })) }
          }
          return { results: [] }
        },
        async run() {
          if (sql.startsWith('DELETE FROM media_cleanup_locks')) {
            return { meta: { changes: Number(cleanupLocks.delete(values[0])) } }
          }
          if (sql.startsWith('INSERT INTO media_cleanup_locks')) {
            if (referencedByLedger || cleanupLocks.has(values[0])) {
              return { meta: { changes: 0 } }
            }
            cleanupLocks.add(values[0])
            return { meta: { changes: 1 } }
          }
          return { meta: { changes: 0 } }
        },
      })
      return statement()
    },
  }
  const storage = {
    head: async () => ({ key }),
    delete: async (target) => {
      if (deleteFails) throw new Error('R2 deletion failed.')
      deletedKeys.push(target)
    },
  }
  return {
    bindings: env({ SITE_CONTENT: database, SITE_MEDIA: storage }),
    key,
    deletedKeys,
    cleanupLocks,
    setDeleteFails: (value) => { deleteFails = value },
  }
}

test('rejects unauthenticated admin data requests', async () => {
  const response = await request('/api/admin/updates', {}, env())
  assert.equal(response.status, 401)
})

test('rejects Cloudflare Access JWTs with invalid signatures', async () => {
  const token = await createToken({}, wrongSigningPair.privateKey)
  const response = await request('/api/admin/session', { token })
  assert.equal(response.status, 401)
})

test('rejects expired, wrong-issuer, wrong-audience, and unauthorized-email JWTs', async () => {
  const now = Math.floor(Date.now() / 1000)
  const cases = [
    [{ exp: now - 1 }, 401],
    [{ iss: 'https://attacker.example' }, 401],
    [{ aud: 'another-access-app' }, 403],
    [{ email: 'visitor@example.com' }, 403],
  ]

  for (const [claims, status] of cases) {
    const token = await createToken(claims)
    const response = await request('/api/admin/session', { token })
    assert.equal(response.status, status)
  }
})

test('authenticates the configured administrator', async () => {
  const token = await createToken()
  const response = await request('/api/admin/session', { token })
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { authenticated: true, email: adminEmail })
})

test('rejects cross-origin admin mutations before processing the request', async () => {
  const token = await createToken()
  const response = await request(
    '/api/admin/content',
    { method: 'PUT', token, origin: 'https://attacker.example', body: '{}' },
  )
  assert.equal(response.status, 403)
})

test('publishes validated content only after administrator authentication', async () => {
  let savedContent = null
  const database = {
    prepare: (sql) => ({
      bind: (...values) => ({
        run: async () => {
          if (sql.startsWith('INSERT INTO published_content')) {
            const contentJson = values.find(
            (value) =>
            typeof value === 'string' &&
            value.trim().startsWith('{')
            );

            assert.ok(contentJson, 'Published content JSON must be present');
            savedContent = JSON.parse(contentJson);
          }
          return { success: true, meta: { changes: 1 } }
        },
      }),
    }),
    batch: async (statements) => {
      const results = []
      for (const statement of statements) results.push(await statement.run())
      return results
    },
  }
  const content = createDefaultContentSnapshot()
  const token = await createToken()
  const response = await request(
    '/api/admin/content',
    {
      method: 'PUT',
      token,
      origin: 'https://school.test',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    },
    env({ SITE_CONTENT: database }),
  )

  assert.equal(response.status, 200)
  assert.equal(savedContent.school.name.en, 'Royal Public School')
})

test('serves built-in content when no published D1 row exists', async () => {
  const database = { prepare: () => ({ first: async () => null }) }
  const response = await request('/api/content', {}, env({ SITE_CONTENT: database }))
  const content = await response.json()

  assert.equal(response.status, 200)
  assert.equal(content.school.name.en, 'Royal Public School')
})

test('returns route-specific canonical and social metadata for public pages', async () => {
  const html = `<!doctype html><html><head>
    <title>Royal Public School</title>
    <link rel="canonical" href="https://theroyalpublicschool.in/" />
    <meta name="description" content="Home" />
    <meta name="robots" content="index, follow" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Home" />
    <meta property="og:description" content="Home" />
    <meta property="og:url" content="https://theroyalpublicschool.in/" />
    <meta property="og:image" content="https://theroyalpublicschool.in/image.jpg" />
    <meta name="twitter:title" content="Home" />
    <meta name="twitter:description" content="Home" />
    <meta name="twitter:image" content="https://theroyalpublicschool.in/image.jpg" />
  </head><body></body></html>`
  const response = await request(
    '/transport',
    {},
    env({
      ASSETS: { fetch: async () => new Response(html, { headers: { 'Content-Type': 'text/html' } }) },
    }),
  )
  const body = await response.text()

  assert.equal(response.status, 200)
  assert.match(body, /<title>School Transport in Tatiri &amp; Baghpat \| Royal Public School<\/title>/)
  assert.match(body, /rel="canonical" href="https:\/\/theroyalpublicschool\.in\/transport"/)
  assert.match(body, /og:url" content="https:\/\/theroyalpublicschool\.in\/transport"/)
})

test('marks the admin page noindex and prevents browser caching', async () => {
  const response = await request(
    '/admin',
    {},
    env({
      ASSETS: {
        fetch: async () =>
          new Response('<html><head><meta name="robots" content="index, follow" /></head></html>'),
      },
    }),
  )
  const body = await response.text()

  assert.equal(response.status, 200)
  assert.match(body, /noindex, nofollow/)
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow')
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
})

test('bounds public announcement pagination and parameterizes search', async () => {
  let query = ''
  let bindings = []
  const database = {
    prepare: (sql) => {
      query = sql
      return {
        bind: (...values) => {
          bindings = values
          return {
            first: async () => ({ count: 0 }),
            all: async () => ({ results: [] }),
          }
        },
      }
    },
  }
  const response = await request(
    '/api/updates?limit=500&offset=-2&q=%25_',
    {},
    env({ SITE_CONTENT: database }),
  )
  const result = await response.json()

  assert.equal(response.status, 200)
  assert.equal(result.limit, 20)
  assert.equal(result.offset, 0)
  assert.match(query, /LIKE \? ESCAPE/)
  assert.equal(bindings.at(-1), 0)
  assert.equal(bindings.at(-2), 20)
  assert.equal(bindings.at(-3), bindings.at(-4))
  assert.equal(bindings.at(-4), bindings.at(-5))
})

test('keeps scheduled, expired, archived, direct, and deleted announcements consistent', async () => {
  const database = createUpdatesDatabase()
  const bindings = env({ SITE_CONTENT: database })
  const token = await createToken()
  const future = new Date(Date.now() + 60 * 60 * 1000).toISOString()
  const draft = {
    slug: 'term-holiday-notice',
    title: 'Term holiday notice',
    category: 'notice',
    summary: 'A school notice.',
    body: 'Full school notice details.',
    publishedAt: future,
    effectiveAt: null,
    reopeningAt: null,
    schoolClosed: null,
    expiresAt: null,
    status: 'scheduled',
    pinned: false,
    attachments: [],
  }
  const createdResponse = await request(
    '/api/admin/updates',
    {
      method: 'POST',
      token,
      origin: 'https://school.test',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    },
    bindings,
  )
  const created = await createdResponse.json()
  assert.equal(createdResponse.status, 200)
  assert.equal(created.update.status, 'scheduled')
  assert.equal(created.update.everPublished, false)

  const publishedAt = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  const expiresAt = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  const expired = { ...draft, status: 'published', publishedAt, expiresAt }
  const publishResponse = await request(
    `/api/admin/updates/${created.update.id}`,
    {
      method: 'PUT',
      token,
      origin: 'https://school.test',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expired),
    },
    bindings,
  )
  const published = await publishResponse.json()
  assert.equal(publishResponse.status, 200)
  assert.equal(published.update.everPublished, true)

  const currentList = await request('/api/updates?limit=20', {}, bindings)
  const archiveList = await request('/api/updates?archive=1&limit=20', {}, bindings)
  assert.equal((await currentList.json()).total, 0)
  assert.equal((await archiveList.json()).total, 1)
  assert.equal((await request('/api/updates/term-holiday-notice', {}, bindings)).status, 200)

  const archived = await request(
    `/api/admin/updates/${created.update.id}`,
    {
      method: 'PUT',
      token,
      origin: 'https://school.test',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...expired, status: 'archived' }),
    },
    bindings,
  )
  assert.equal((await archived.json()).update.status, 'archived')
  assert.equal((await request('/api/updates/term-holiday-notice', {}, bindings)).status, 200)

  const deleted = await request(
    `/api/admin/updates/${created.update.id}`,
    { method: 'DELETE', token, origin: 'https://school.test' },
    bindings,
  )
  assert.equal(deleted.status, 200)
  assert.equal((await request('/api/updates/term-holiday-notice', {}, bindings)).status, 404)
})

test('rejects unsupported upload MIME types and mismatched file signatures', async () => {
  const token = await createToken()
  const storage = { put: async () => assert.fail('invalid uploads must not be stored') }
  const bindings = env({ SITE_MEDIA: storage })
  const unsupported = await request(
    '/api/admin/media',
    {
      method: 'POST',
      token,
      origin: 'https://school.test',
      headers: { 'Content-Type': 'text/html' },
      body: '<script>bad</script>',
    },
    bindings,
  )
  const mismatched = await request(
    '/api/admin/media',
    {
      method: 'POST',
      token,
      origin: 'https://school.test',
      headers: { 'Content-Type': 'image/png' },
      body: new Uint8Array(16),
    },
    bindings,
  )

  assert.equal(unsupported.status, 415)
  assert.equal(mismatched.status, 415)
})

test('rejects uploads larger than the configured streaming limit', async () => {
  const token = await createToken()
  const storage = { put: async () => assert.fail('oversized uploads must not be stored') }
  const response = await request(
    '/api/admin/media',
    {
      method: 'POST',
      token,
      origin: 'https://school.test',
      headers: { 'Content-Type': 'image/png' },
      body: new Uint8Array(8 * 1024 * 1024 + 1),
    },
    env({ SITE_MEDIA: storage }),
  )

  assert.equal(response.status, 413)
})

test('accepts a signed PNG upload and stores it under an opaque name', async () => {
  const token = await createToken()
  let storedKey = ''
  const storage = {
    put: async (key) => {
      storedKey = key
    },
  }
  const bytes = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jXioAAAAASUVORK5CYII=',
    'base64',
  )
  const response = await request(
    '/api/admin/media',
    {
      method: 'POST',
      token,
      origin: 'https://school.test',
      headers: { 'Content-Type': 'image/png', 'X-File-Name': 'campus.png' },
      body: bytes,
    },
    env({ SITE_MEDIA: storage }),
  )
  const result = await response.json()

  assert.equal(response.status, 200)
  assert.match(storedKey, /^[0-9a-f-]{36}\.png$/i)
  assert.equal(result.url, `/media/${storedKey}`)
})

test('refuses to delete media referenced by published content or announcements', async () => {
  const token = await createToken()
  const mediaUrl = '/media/b7d6a5c4-e3f2-4a1b-8c9d-0e1f2a3b4c5d.jpg'
  const referencedCases = [
    createMediaCleanupBindings({ content: { galleryItems: [{ imageUrl: mediaUrl }] } }),
    createMediaCleanupBindings({
      content: {},
      attachments: [[{ url: mediaUrl, name: 'notice.jpg', type: 'image/jpeg' }]],
    }),
    createMediaCleanupBindings({ content: {}, referencedByLedger: true }),
  ]

  for (const { bindings, key, deletedKeys } of referencedCases) {
    const response = await request(
      `/api/admin/media?key=${encodeURIComponent(key)}`,
      { method: 'DELETE', token, origin: 'https://school.test' },
      bindings,
    )
    assert.equal(response.status, 409)
    assert.deepEqual(deletedKeys, [])
  }
})

test('deletes an unreferenced media object only after recording a cleanup lock', async () => {
  const token = await createToken()
  const { bindings, key, deletedKeys } = createMediaCleanupBindings({ content: {} })
  const response = await request(
    `/api/admin/media?key=${encodeURIComponent(key)}`,
    { method: 'DELETE', token, origin: 'https://school.test' },
    bindings,
  )

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { deleted: true })
  assert.deepEqual(deletedKeys, [key])
})

test('releases the cleanup lock when R2 deletion fails and the object remains', async () => {
  const token = await createToken()
  const { bindings, key, cleanupLocks, setDeleteFails } = createMediaCleanupBindings({ content: {} })
  setDeleteFails(true)
  const path = `/api/admin/media?key=${encodeURIComponent(key)}`
  const options = { method: 'DELETE', token, origin: 'https://school.test' }

  const failed = await request(path, options, bindings)
  assert.equal(failed.status, 500)
  assert.equal(cleanupLocks.size, 0)

  setDeleteFails(false)
  const retried = await request(path, options, bindings)
  assert.equal(retried.status, 200)
})
