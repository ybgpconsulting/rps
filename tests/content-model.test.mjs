import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createDefaultContentSnapshot,
  migrateSiteContent,
  validateSiteContent,
} from '../src/lib/content-model.ts'

test('default site content passes the production validator', () => {
  assert.equal(validateSiteContent(createDefaultContentSnapshot()), null)
})

test('migration adds transport navigation and metadata to existing content', () => {
  const content = createDefaultContentSnapshot()
  content.navItems = content.navItems.filter((item) => item.to !== '/transport')
  content.footerLinks.explore = content.footerLinks.explore.filter((item) => item.to !== '/transport')
  delete content.seo['/transport']

  const migrated = migrateSiteContent(content)

  assert.ok(migrated.navItems.some((item) => item.to === '/transport'))
  assert.ok(migrated.footerLinks.explore.some((item) => item.to === '/transport'))
  assert.ok(migrated.seo['/transport'])
  assert.equal(validateSiteContent(migrated), null)
})

test('validation rejects content with unsafe executable URLs', () => {
  const content = createDefaultContentSnapshot()
  content.school.mapsUrl = 'javascript:alert(1)'

  assert.match(validateSiteContent(content), /HTTPS URL/)
})
