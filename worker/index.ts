import {
  createDefaultContentSnapshot,
  migrateSiteContent,
  validateSiteContent,
} from '../src/lib/content-model'
import {
  UPDATE_CATEGORIES,
  validateSchoolUpdate,
  toSchoolUpdate,
  type SchoolUpdateInput,
} from '../src/lib/updates-model'

type Env = Cloudflare.Env & {
  ASSETS: { fetch: typeof fetch }
  ACCESS_TEAM_DOMAIN?: string
  ACCESS_AUD?: string
  ADMIN_EMAIL?: string
}

interface AccessClaims {
  aud?: string | string[]
  email?: string
  exp?: number
  iat?: number
  iss?: string
}

interface AccessJwk extends JsonWebKey {
  kid?: string
}

interface AccessCertificateSet {
  keys: AccessJwk[]
}

interface CachedCertificates {
  issuer: string
  expiresAt: number
  keys: AccessJwk[]
}

let cachedCertificates: CachedCertificates | undefined

const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'SAMEORIGIN',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  })

function decodeBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binary = atob(padded)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)
  return buffer
}

function decodeJsonPart<T>(value: string): T {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(value))) as T
}

async function getCertificates(issuer: string): Promise<AccessJwk[]> {
  if (cachedCertificates && cachedCertificates.issuer === issuer && cachedCertificates.expiresAt > Date.now()) {
    return cachedCertificates.keys
  }

  const response = await fetch(`${issuer}/cdn-cgi/access/certs`, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error(`Cloudflare Access certificate lookup failed (${response.status}).`)
  const certificateSet = (await response.json()) as AccessCertificateSet
  if (!Array.isArray(certificateSet.keys) || certificateSet.keys.length === 0) {
    throw new Error('Cloudflare Access returned no verification keys.')
  }

  cachedCertificates = {
    issuer,
    expiresAt: Date.now() + 10 * 60 * 1000,
    keys: certificateSet.keys,
  }
  return certificateSet.keys
}

async function authenticateAdmin(
  request: Request,
  env: Env,
): Promise<{ email: string } | { error: string; status: number }> {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD || !env.ADMIN_EMAIL) {
    return { error: 'Cloudflare Access admin settings are not configured.', status: 503 }
  }

  const token = request.headers.get('Cf-Access-Jwt-Assertion')
  if (!token) return { error: 'Sign in through Cloudflare Access to continue.', status: 401 }

  let header: { alg?: string; kid?: string }
  let claims: AccessClaims
  let signedBytes: ArrayBuffer
  let signature: ArrayBuffer
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return { error: 'The Cloudflare Access token is invalid.', status: 401 }
    header = decodeJsonPart(parts[0])
    claims = decodeJsonPart(parts[1])
    signedBytes = toArrayBuffer(new TextEncoder().encode(`${parts[0]}.${parts[1]}`))
    signature = toArrayBuffer(decodeBase64Url(parts[2]))
  } catch {
    return { error: 'The Cloudflare Access token is invalid.', status: 401 }
  }

  const configuredDomain = env.ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//, '').replace(/\/+$/, '')
  const issuer = `https://${configuredDomain}`
  if (
    header.alg !== 'RS256' ||
    !header.kid ||
    claims.iss !== issuer ||
    !claims.exp ||
    claims.exp <= Math.floor(Date.now() / 1000) ||
    (claims.iat && claims.iat > Math.floor(Date.now() / 1000) + 60)
  ) {
    return { error: 'The Cloudflare Access token is invalid or expired.', status: 401 }
  }

  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud]
  if (!audiences.includes(env.ACCESS_AUD)) {
    return { error: 'This Cloudflare Access application is not authorized for the admin panel.', status: 403 }
  }

  let keys: AccessJwk[]
  try {
    keys = await getCertificates(issuer)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cloudflare Access verification is unavailable.'
    return { error: message, status: 503 }
  }
  const jwk = keys.find((key) => key.kid === header.kid)
  if (!jwk) return { error: 'The Cloudflare Access signing key was not recognized.', status: 401 }

  let verified = false
  try {
    const publicKey = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    )
    verified = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      signature,
      signedBytes,
    )
  } catch {
    return { error: 'The Cloudflare Access token signature could not be verified.', status: 401 }
  }
  if (!verified) return { error: 'The Cloudflare Access token signature is invalid.', status: 401 }

  const email = claims.email?.trim().toLowerCase()
  if (!email || email !== env.ADMIN_EMAIL.trim().toLowerCase()) {
    return { error: 'This email address is not an approved school administrator.', status: 403 }
  }
  return { email }
}

function errorResponse(result: { error: string; status: number }) {
  return json({ error: result.error }, result.status)
}

async function handleContentRead(env: Env) {
  if (!env.SITE_CONTENT) return json({ error: 'The site content database is not configured.' }, 503)

  const row = await env.SITE_CONTENT.prepare(
    "SELECT content_json FROM published_content WHERE id = 'main'",
  ).first<{ content_json: string }>()
  if (!row) return json(createDefaultContentSnapshot())

  let content: unknown
  try {
    content = JSON.parse(row.content_json)
  } catch {
    return json({ error: 'The published content record could not be decoded.' }, 500)
  }
  content = migrateSiteContent(content)
  const validationError = validateSiteContent(content)
  if (validationError) return json({ error: `The published content is invalid: ${validationError}` }, 500)
  return json(content)
}

async function handleContentPublish(request: Request, env: Env, email: string) {
  if (!env.SITE_CONTENT) return json({ error: 'The site content database is not configured.' }, 503)

  const body = await request.arrayBuffer()
  if (body.byteLength > 250_000) return json({ error: 'The content document exceeds the 250 KB limit.' }, 413)

  let content: unknown
  try {
    content = JSON.parse(new TextDecoder().decode(body))
  } catch {
    return json({ error: 'The request body must be valid JSON.' }, 400)
  }
  const validationError = validateSiteContent(content)
  if (validationError) return json({ error: validationError }, 400)

  const serialized = JSON.stringify(content)
  await env.SITE_CONTENT.prepare(
    `INSERT INTO published_content (id, content_json, updated_at, updated_by)
     VALUES ('main', ?, datetime('now'), ?)
     ON CONFLICT(id) DO UPDATE SET
       content_json = excluded.content_json,
       updated_at = excluded.updated_at,
       updated_by = excluded.updated_by`,
  )
    .bind(serialized, email)
    .run()

  return json({ content, updatedAt: new Date().toISOString() })
}

const mediaTypes = new Map([
  ['image/jpeg', { extension: 'jpg', maxBytes: 8 * 1024 * 1024, signature: (bytes: Uint8Array) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff }],
  ['image/png', { extension: 'png', maxBytes: 8 * 1024 * 1024, signature: (bytes: Uint8Array) => bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 }],
  ['image/webp', { extension: 'webp', maxBytes: 8 * 1024 * 1024, signature: (bytes: Uint8Array) => bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50 }],
  ['application/pdf', { extension: 'pdf', maxBytes: 15 * 1024 * 1024, signature: (bytes: Uint8Array) => bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d }],
])

async function handleMediaUpload(request: Request, env: Env, allowPdf = false) {
  if (!env.SITE_MEDIA) return json({ error: 'Photo storage is not configured for this site.' }, 503)

  const contentType = request.headers.get('Content-Type')?.split(';', 1)[0].trim().toLowerCase() ?? ''
  const mediaType = mediaTypes.get(contentType)
  if (!mediaType || (!allowPdf && contentType === 'application/pdf')) {
    return json({ error: allowPdf ? 'Choose a PDF, JPG, PNG, or WebP file.' : 'Choose a JPG, PNG, or WebP photo.' }, 415)
  }

  const declaredLength = Number(request.headers.get('Content-Length') ?? 0)
  if (declaredLength > mediaType.maxBytes) {
    return json({ error: `This file must be ${mediaType.maxBytes / (1024 * 1024)} MB or smaller.` }, 413)
  }

  const body = await request.arrayBuffer()
  if (body.byteLength === 0) return json({ error: 'The selected photo is empty.' }, 400)
  if (body.byteLength > mediaType.maxBytes) {
    return json({ error: `This file must be ${mediaType.maxBytes / (1024 * 1024)} MB or smaller.` }, 413)
  }

  const bytes = new Uint8Array(body)
  if (bytes.length < (contentType === 'application/pdf' ? 5 : 12) || !mediaType.signature(bytes)) {
    return json({ error: 'The file contents do not match the selected image type.' }, 415)
  }

  const key = `${crypto.randomUUID()}.${mediaType.extension}`
  await env.SITE_MEDIA.put(key, body, {
    httpMetadata: {
      contentType,
      cacheControl: 'public, max-age=31536000, immutable',
      contentDisposition: contentType === 'application/pdf' ? 'inline' : 'inline',
    },
  })
  const rawName = request.headers.get('X-File-Name') ?? `school-photo.${mediaType.extension}`
  let name = `school-photo.${mediaType.extension}`
  try {
    name = decodeURIComponent(rawName).replace(/[\\/\p{Cc}]/gu, ' ').trim().slice(0, 160) || name
  } catch {
    return json({ error: 'The attachment filename is invalid.' }, 400)
  }
  return json({ url: `/media/${key}`, name, type: contentType })
}

async function handleMediaRead(request: Request, env: Env, key: string) {
  if (request.method !== 'GET' || !env.SITE_MEDIA) {
    return json({ error: 'Photo storage is not available.' }, 404)
  }
  if (!/^[0-9a-f-]{36}\.(?:jpg|png|webp|pdf)$/i.test(key)) {
    return json({ error: 'Photo not found.' }, 404)
  }

  const object = await env.SITE_MEDIA.get(key)
  if (!object) return json({ error: 'Photo not found.' }, 404)
  return new Response(object.body, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': object.httpMetadata?.contentType ?? 'application/octet-stream',
      'Content-Disposition': 'inline',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'SAMEORIGIN',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  })
}

type UpdateRow = Record<string, unknown>

function parseUpdateRows(rows: UpdateRow[]) {
  const updates = rows.map(toSchoolUpdate)
  if (updates.some((update) => update === null)) {
    throw new Error('A school update record in D1 is invalid.')
  }
  return updates
}

async function handlePublicUpdates(url: URL, env: Env) {
  const limit = Math.min(20, Math.max(1, Number.parseInt(url.searchParams.get('limit') ?? '10', 10) || 10))
  const parsedOffset = Number.parseInt(url.searchParams.get('offset') ?? '0', 10)
  const offset = Number.isFinite(parsedOffset) ? Math.min(100_000, Math.max(0, parsedOffset)) : 0
  const category = url.searchParams.get('category')
  const search = (url.searchParams.get('q') ?? '').trim().slice(0, 100)
  const pinnedOnly = url.searchParams.get('pinned') === '1'
  const excludePinned = !pinnedOnly && url.searchParams.get('excludePinned') === '1'
  if (category && !UPDATE_CATEGORIES.includes(category as (typeof UPDATE_CATEGORIES)[number])) {
    return json({ error: 'The selected announcement category is not valid.' }, 400)
  }

  const now = new Date().toISOString()
  const archive = url.searchParams.get('archive') === '1'
  const conditions = archive
    ? "((status = 'archived' AND ever_published = 1 AND published_at <= ?) OR (status IN ('published', 'scheduled') AND published_at <= ? AND expires_at IS NOT NULL AND expires_at <= ?))"
    : "status IN ('published', 'scheduled') AND published_at <= ? AND (expires_at IS NULL OR expires_at > ?)"
  const values: (string | number | null)[] = archive ? [now, now, now] : [now, now]
  if (category) values.push(category)
  if (pinnedOnly || excludePinned) values.push(pinnedOnly ? 1 : 0)
  if (search) values.push(`%${search.toLowerCase().replace(/[\\%_]/g, '\\$&')}%`)
  const categoryClause = category ? ' AND category = ?' : ''
  const pinnedClause = pinnedOnly || excludePinned ? ' AND pinned = ?' : ''
  const searchClause = search
    ? " AND (LOWER(title) LIKE ? ESCAPE '\\' OR LOWER(summary) LIKE ? ESCAPE '\\' OR LOWER(body) LIKE ? ESCAPE '\\')"
    : ''
  if (search) {
    const pattern = values[values.length - 1]
    values.push(pattern, pattern)
  }
  if (!env.SITE_CONTENT) return json({ error: 'The site content database is not configured.' }, 503)

  const count = await env.SITE_CONTENT.prepare(
    `SELECT COUNT(*) AS count FROM school_updates WHERE ${conditions}${categoryClause}${pinnedClause}${searchClause}`,
  )
    .bind(...values)
    .first<{ count: number }>()
  const result = await env.SITE_CONTENT.prepare(
    `SELECT id, slug, title, category, summary, body, published_at, effective_at, reopening_at,
      school_closed, expires_at, status, ever_published, pinned, attachments_json, updated_at
     FROM school_updates WHERE ${conditions}${categoryClause}${pinnedClause}${searchClause}
     ORDER BY published_at DESC LIMIT ? OFFSET ?`,
  )
    .bind(...values, limit, offset)
    .all<UpdateRow>()
  const updates = parseUpdateRows(result.results)
  return json({ updates, total: Number(count?.count ?? 0), limit, offset })
}

async function handlePublicUpdate(slug: string, env: Env) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return json({ error: 'Announcement not found.' }, 404)
  if (!env.SITE_CONTENT) return json({ error: 'The site content database is not configured.' }, 503)

  const now = new Date().toISOString()
  const row = await env.SITE_CONTENT.prepare(
    `SELECT id, slug, title, category, summary, body, published_at, effective_at, reopening_at,
      school_closed, expires_at, status, ever_published, pinned, attachments_json, updated_at
     FROM school_updates
     WHERE slug = ? AND ((status IN ('published', 'scheduled') AND published_at <= ?)
       OR (status = 'archived' AND ever_published = 1 AND published_at <= ?))
     LIMIT 1`,
  )
    .bind(slug, now, now)
    .first<UpdateRow>()

  if (!row) return json({ error: 'Announcement not found.' }, 404)
  const update = toSchoolUpdate(row)
  return update ? json({ update }) : json({ error: 'The announcement record is invalid.' }, 500)
}

async function handleAdminUpdates(env: Env) {
  if (!env.SITE_CONTENT) return json({ error: 'The site content database is not configured.' }, 503)
  const result = await env.SITE_CONTENT.prepare(
    `SELECT id, slug, title, category, summary, body, published_at, effective_at, reopening_at,
      school_closed, expires_at, status, ever_published, pinned, attachments_json, updated_at
     FROM school_updates ORDER BY updated_at DESC`,
  ).all<UpdateRow>()
  return json({ updates: parseUpdateRows(result.results) })
}

async function readUpdateInput(request: Request): Promise<SchoolUpdateInput | Response> {
  const body = await request.arrayBuffer()
  if (body.byteLength > 50_000) return json({ error: 'Announcement details exceed the 50 KB limit.' }, 413)

  let input: unknown
  try {
    input = JSON.parse(new TextDecoder().decode(body))
  } catch {
    return json({ error: 'Enter valid announcement details.' }, 400)
  }
  const issue = validateSchoolUpdate(input)
  if (issue) return json({ error: issue }, 400)
  return input as SchoolUpdateInput
}

async function handleSaveUpdate(
  request: Request,
  env: Env,
  email: string,
  id: string | null,
) {
  if (!env.SITE_CONTENT) return json({ error: 'The site content database is not configured.' }, 503)
  const input = await readUpdateInput(request)
  if (input instanceof Response) return input

  const duplicate = await env.SITE_CONTENT.prepare(
    'SELECT id FROM school_updates WHERE slug = ? AND id != ? LIMIT 1',
  )
    .bind(input.slug, id ?? '')
    .first<{ id: string }>()
  if (duplicate) return json({ error: 'That announcement link is already in use. Choose another URL name.' }, 409)

  const now = new Date().toISOString()
  let everPublished = false
  if (id) {
    const existing = await env.SITE_CONTENT.prepare(
      'SELECT status, published_at, ever_published FROM school_updates WHERE id = ? LIMIT 1',
    )
      .bind(id)
      .first<{ status: string; published_at: string; ever_published: number }>()
    if (!existing) return json({ error: 'This announcement no longer exists.' }, 404)
    everPublished =
      Number(existing.ever_published) === 1 ||
      (['published', 'scheduled'].includes(existing.status) && Date.parse(existing.published_at) <= Date.parse(now))
  }
  everPublished ||= ['published', 'scheduled'].includes(input.status) && Date.parse(input.publishedAt) <= Date.parse(now)

  const updateId = id ?? crypto.randomUUID()
  const values: (string | number | null)[] = [
    updateId,
    input.slug,
    input.title.trim(),
    input.category,
    input.summary.trim(),
    input.body.trim(),
    input.publishedAt,
    input.effectiveAt || null,
    input.reopeningAt || null,
    input.schoolClosed === null ? null : Number(input.schoolClosed),
    input.expiresAt || null,
    input.status,
    Number(everPublished),
    Number(input.pinned),
    JSON.stringify(input.attachments),
    now,
    email,
  ]

  if (id) {
    await env.SITE_CONTENT.prepare(
      `UPDATE school_updates SET slug = ?, title = ?, category = ?, summary = ?, body = ?,
        published_at = ?, effective_at = ?, reopening_at = ?, school_closed = ?, expires_at = ?,
        status = ?, ever_published = ?, pinned = ?, attachments_json = ?, updated_at = ?, updated_by = ? WHERE id = ?`,
    )
      .bind(...values.slice(1, 16), email, id)
      .run()
  } else {
    await env.SITE_CONTENT.prepare(
      `INSERT INTO school_updates
       (id, slug, title, category, summary, body, published_at, effective_at, reopening_at,
        school_closed, expires_at, status, ever_published, pinned, attachments_json, created_at, updated_at, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(...values.slice(0, 15), now, now, email)
      .run()
  }

  const row = await env.SITE_CONTENT.prepare(
    `SELECT id, slug, title, category, summary, body, published_at, effective_at, reopening_at,
      school_closed, expires_at, status, ever_published, pinned, attachments_json, updated_at
     FROM school_updates WHERE id = ?`,
  )
    .bind(updateId)
    .first<UpdateRow>()
  const saved = row ? toSchoolUpdate(row) : null
  return saved ? json({ update: saved }) : json({ error: 'The saved announcement could not be loaded.' }, 500)
}

async function handleDeleteUpdate(id: string, env: Env) {
  if (!env.SITE_CONTENT) return json({ error: 'The site content database is not configured.' }, 503)
  const result = await env.SITE_CONTENT.prepare('DELETE FROM school_updates WHERE id = ?')
    .bind(id)
    .run()
  if (!result.meta.changes) return json({ error: 'This announcement no longer exists.' }, 404)
  return json({ deleted: true })
}

async function handleSitemap(request: Request, env: Env) {
  const response = await env.ASSETS.fetch(request)
  if (!response.ok || !env.SITE_CONTENT) return response
  const xml = await response.text()
  if (!xml.includes('</urlset>')) return new Response(xml, response)
  const now = new Date().toISOString()
  const rows = await env.SITE_CONTENT.prepare(
    `SELECT slug, updated_at FROM school_updates
     WHERE (status IN ('published', 'scheduled') OR (status = 'archived' AND ever_published = 1))
       AND published_at <= ?
     ORDER BY updated_at DESC`,
  )
    .bind(now)
    .all<{ slug: string; updated_at: string }>()
  const baseUrl = new URL(request.url).origin
  const updateUrls = rows.results
    .filter((row) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug))
    .map(
      (row) =>
        `  <url><loc>${baseUrl}/updates/${row.slug}</loc><lastmod>${row.updated_at.slice(0, 10)}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
    )
    .join('\n')
  const headers = new Headers(response.headers)
  headers.delete('Content-Length')
  return new Response(xml.replace('</urlset>', `${updateUrls}\n</urlset>`), {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]!)
}

function replaceMetaTag(html: string, attribute: 'name' | 'property', key: string, content: string) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const matcher = new RegExp(`<meta\\s+${attribute}="${escapedKey}"[^>]*>`, 'i')
  return html.replace(matcher, `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`)
}

function removeHomepageImagePreload(html: string) {
  return html.replace(/<link\b(?=[^>]*\brel="preload")(?=[^>]*\bas="image")[^>]*>/i, '')
}

async function handleUpdatesIndexPage(request: Request, env: Env) {
  const response = await env.ASSETS.fetch(request)
  if (!response.ok) return response
  const origin = new URL(request.url).origin
  const title = 'School Updates & Notices | Royal Public School, Baghpat'
  const description =
    'Check the latest school holidays, important notices, exam information, events, admissions and parent updates from Royal Public School, Tatiri, Baghpat.'
  let html = await response.text()
  html = removeHomepageImagePreload(html)
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${origin}/updates" />`)
  html = replaceMetaTag(html, 'name', 'description', description)
  html = replaceMetaTag(html, 'property', 'og:type', 'website')
  html = replaceMetaTag(html, 'property', 'og:title', title)
  html = replaceMetaTag(html, 'property', 'og:description', description)
  html = replaceMetaTag(html, 'property', 'og:url', `${origin}/updates`)
  html = replaceMetaTag(html, 'name', 'twitter:title', title)
  html = replaceMetaTag(html, 'name', 'twitter:description', description)
  const headers = new Headers(response.headers)
  headers.delete('Content-Length')
  headers.delete('ETag')
  headers.set('Cache-Control', 'no-store')
  return new Response(html, { status: response.status, statusText: response.statusText, headers })
}

async function handleUpdatePage(request: Request, env: Env, slug: string) {
  const response = await env.ASSETS.fetch(request)
  if (!response.ok || !env.SITE_CONTENT) return response

  const now = new Date().toISOString()
  const row = await env.SITE_CONTENT.prepare(
    `SELECT id, slug, title, category, summary, body, published_at, effective_at, reopening_at,
      school_closed, expires_at, status, ever_published, pinned, attachments_json, updated_at
     FROM school_updates
     WHERE slug = ? AND ((status IN ('published', 'scheduled') AND published_at <= ?)
       OR (status = 'archived' AND ever_published = 1 AND published_at <= ?))
     LIMIT 1`,
  )
    .bind(slug, now, now)
    .first<UpdateRow>()
  const update = row ? toSchoolUpdate(row) : null
  if (!update) return response

  const canonicalUrl = `${new URL(request.url).origin}/updates/${update.slug}`
  const htmlDescription = update.summary.slice(0, 300)
  let html = await response.text()
  html = removeHomepageImagePreload(html)
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(update.title)} | Royal Public School</title>`)
  html = html.replace(
    /<link\s+rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
  )
  html = replaceMetaTag(html, 'name', 'description', htmlDescription)
  html = replaceMetaTag(html, 'property', 'og:type', 'article')
  html = replaceMetaTag(html, 'property', 'og:title', update.title)
  html = replaceMetaTag(html, 'property', 'og:description', htmlDescription)
  html = replaceMetaTag(html, 'property', 'og:url', canonicalUrl)
  html = replaceMetaTag(html, 'name', 'twitter:title', update.title)
  html = replaceMetaTag(html, 'name', 'twitter:description', htmlDescription)
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: update.title,
    description: update.summary,
    datePublished: update.publishedAt,
    dateModified: update.updatedAt,
    mainEntityOfPage: canonicalUrl,
    publisher: { '@type': 'Organization', name: 'Royal Public School', url: new URL(request.url).origin },
  }).replace(/</g, '\\u003c')
  html = html.replace('</head>', `<script type="application/ld+json">${structuredData}</script></head>`)

  const headers = new Headers(response.headers)
  headers.delete('Content-Length')
  headers.delete('ETag')
  headers.set('Cache-Control', 'no-store')
  return new Response(html, { status: response.status, statusText: response.statusText, headers })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/admin/media' && request.method === 'POST') {
      const auth = await authenticateAdmin(request, env)
      if (!('email' in auth)) return errorResponse(auth)
      try {
        return await handleMediaUpload(request, env)
      } catch (error) {
        console.error('Unable to upload school gallery photo.', error)
        return json({ error: 'The photo could not be uploaded.' }, 500)
      }
    }

    if (url.pathname === '/api/admin/update-attachments' && request.method === 'POST') {
      const auth = await authenticateAdmin(request, env)
      if (!('email' in auth)) return errorResponse(auth)
      try {
        return await handleMediaUpload(request, env, true)
      } catch (error) {
        console.error('Unable to upload school update attachment.', error)
        return json({ error: 'The attachment could not be uploaded.' }, 500)
      }
    }

    if (url.pathname.startsWith('/media/')) {
      try {
        return await handleMediaRead(request, env, url.pathname.slice('/media/'.length))
      } catch (error) {
        console.error('Unable to load school gallery photo.', error)
        return json({ error: 'The photo could not be loaded.' }, 500)
      }
    }

    if (url.pathname === '/api/updates' && request.method === 'GET') {
      try {
        return await handlePublicUpdates(url, env)
      } catch (error) {
        console.error('Unable to load public school updates.', error)
        return json({ error: 'School updates could not be loaded.' }, 500)
      }
    }

    if (url.pathname.startsWith('/api/updates/') && request.method === 'GET') {
      try {
        return await handlePublicUpdate(url.pathname.slice('/api/updates/'.length), env)
      } catch (error) {
        console.error('Unable to load public school update.', error)
        return json({ error: 'The school update could not be loaded.' }, 500)
      }
    }

    if (url.pathname === '/api/admin/updates' && request.method === 'GET') {
      const auth = await authenticateAdmin(request, env)
      if (!('email' in auth)) return errorResponse(auth)
      try {
        return await handleAdminUpdates(env)
      } catch (error) {
        console.error('Unable to load admin school updates.', error)
        return json({ error: 'School updates could not be loaded.' }, 500)
      }
    }

    if (url.pathname === '/api/admin/updates' && request.method === 'POST') {
      const auth = await authenticateAdmin(request, env)
      if (!('email' in auth)) return errorResponse(auth)
      try {
        return await handleSaveUpdate(request, env, auth.email, null)
      } catch (error) {
        console.error('Unable to create school update.', error)
        return json({ error: 'The school update could not be saved.' }, 500)
      }
    }

    const adminUpdateMatch = url.pathname.match(/^\/api\/admin\/updates\/([0-9a-f-]{36})$/i)
    if (adminUpdateMatch && request.method === 'PUT') {
      const auth = await authenticateAdmin(request, env)
      if (!('email' in auth)) return errorResponse(auth)
      try {
        return await handleSaveUpdate(request, env, auth.email, adminUpdateMatch[1])
      } catch (error) {
        console.error('Unable to update school announcement.', error)
        return json({ error: 'The school update could not be saved.' }, 500)
      }
    }

    if (adminUpdateMatch && request.method === 'DELETE') {
      const auth = await authenticateAdmin(request, env)
      if (!('email' in auth)) return errorResponse(auth)
      try {
        return await handleDeleteUpdate(adminUpdateMatch[1], env)
      } catch (error) {
        console.error('Unable to delete school update.', error)
        return json({ error: 'The school update could not be deleted.' }, 500)
      }
    }

    if (url.pathname === '/sitemap.xml' && request.method === 'GET') {
      try {
        return await handleSitemap(request, env)
      } catch (error) {
        console.error('Unable to add school updates to the sitemap.', error)
        return env.ASSETS.fetch(request)
      }
    }

    if (url.pathname === '/updates' && request.method === 'GET') {
      try {
        return await handleUpdatesIndexPage(request, env)
      } catch (error) {
        console.error('Unable to render school updates page metadata.', error)
        return env.ASSETS.fetch(request)
      }
    }

    const updatePageMatch = url.pathname.match(/^\/updates\/([a-z0-9]+(?:-[a-z0-9]+)*)$/)
    if (updatePageMatch && request.method === 'GET') {
      try {
        return await handleUpdatePage(request, env, updatePageMatch[1])
      } catch (error) {
        console.error('Unable to render school update metadata.', error)
        return env.ASSETS.fetch(request)
      }
    }

    if (url.pathname === '/api/content' && request.method === 'GET') {
      try {
        return await handleContentRead(env)
      } catch (error) {
        console.error('Unable to load published school content.', error)
        return json({ error: 'The published school content could not be loaded.' }, 500)
      }
    }

    if (url.pathname === '/api/admin/session' && request.method === 'GET') {
      const auth = await authenticateAdmin(request, env)
      return 'email' in auth ? json({ authenticated: true, email: auth.email }) : errorResponse(auth)
    }

    if (url.pathname === '/api/admin/content' && request.method === 'PUT') {
      const auth = await authenticateAdmin(request, env)
      if (!('email' in auth)) return errorResponse(auth)
      try {
        return await handleContentPublish(request, env, auth.email)
      } catch (error) {
        console.error('Unable to publish school content.', error)
        return json({ error: 'The content could not be published to the database.' }, 500)
      }
    }

    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
      return env.ASSETS.fetch(request)
    }

    if (url.pathname.startsWith('/api/')) return json({ error: 'API route not found.' }, 404)
    return env.ASSETS.fetch(request)
  },
}
