import assert from 'node:assert/strict'
import test from 'node:test'
import { toSchoolUpdate, validateSchoolUpdate } from '../src/lib/updates-model.ts'

function update(overrides = {}) {
  const publishedAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
  return {
    slug: 'school-notice',
    title: 'School notice',
    category: 'notice',
    summary: 'A short school notice.',
    body: 'Full notice details.',
    publishedAt,
    effectiveAt: null,
    reopeningAt: null,
    schoolClosed: null,
    expiresAt: null,
    status: 'scheduled',
    pinned: false,
    attachments: [],
    ...overrides,
  }
}

test('accepts a future scheduled notice and rejects a past scheduled time', () => {
  assert.equal(validateSchoolUpdate(update()), null)
  assert.match(
    validateSchoolUpdate(update({ publishedAt: new Date(Date.now() - 60_000).toISOString() })),
    /future publication time/,
  )
})

test('treats a due scheduled database row as published', () => {
  const publishedAt = new Date(Date.now() - 60_000).toISOString()
  const update = toSchoolUpdate({
    id: 'notice-id',
    slug: 'school-notice',
    title: 'School notice',
    category: 'notice',
    summary: 'A short school notice.',
    body: 'Full notice details.',
    published_at: publishedAt,
    effective_at: null,
    reopening_at: null,
    school_closed: null,
    expires_at: null,
    status: 'scheduled',
    ever_published: 0,
    pinned: 0,
    attachments_json: '[]',
    updated_at: publishedAt,
  })

  assert.equal(update?.status, 'published')
  assert.equal(update?.everPublished, true)
})

test('rejects publishing a notice before its publication time', () => {
  assert.match(validateSchoolUpdate(update({ status: 'published' })), /current or past publication/)
})

test('requires complete closure details for holiday notices', () => {
  assert.match(validateSchoolUpdate(update({ category: 'holiday' })), /holiday date/)
})

test('rejects attachment URLs outside the managed media namespace', () => {
  assert.match(
    validateSchoolUpdate(
      update({
        attachments: [{ url: 'https://example.invalid/file.pdf', name: 'file.pdf', type: 'application/pdf' }],
      }),
    ),
    /attachments? is not valid/,
  )
})

test('requires expiry to follow publication', () => {
  const publishedAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString()
  assert.match(validateSchoolUpdate(update({ publishedAt, expiresAt })), /expiry date must be after/)
})
