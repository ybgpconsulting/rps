import {
  applySiteContent,
  collectUploadedMediaKeys,
  createContentSnapshot,
  createDefaultContentSnapshot,
  migrateSiteContent,
  validateSiteContent,
  type SiteContent,
} from './content-model'
import { cleanupUnreferencedMedia } from './media'

const localContentKey = 'rps-admin-local-content'
const previewContentPrefix = 'rps-admin-preview:'
let siteContentInitialization: Promise<boolean> | undefined

function isJsonResponse(response: Response) {
  return response.headers.get('content-type')?.includes('application/json') === true
}

function applyContentAndNotify(content: unknown) {
  applySiteContent(content)
  window.dispatchEvent(new Event('rps:site-content-updated'))
}

function readLocalContent() {
  try {
    const stored = window.localStorage.getItem(localContentKey)
    if (!stored) return null
    const content = migrateSiteContent(JSON.parse(stored))
    return validateSiteContent(content) ? null : content
  } catch (error) {
    console.error('Unable to read locally saved site content.', error)
    return null
  }
}

function applyPreviewContent() {
  const previewId = new URLSearchParams(window.location.search).get('preview')
  if (!previewId || !/^[a-zA-Z0-9-]{1,80}$/.test(previewId)) return false

  try {
    const stored = window.localStorage.getItem(`${previewContentPrefix}${previewId}`)
    if (!stored) return false
    const preview: { content?: unknown; expiresAt?: number } = JSON.parse(stored)
    if (!preview.expiresAt || preview.expiresAt < Date.now()) {
      window.localStorage.removeItem(`${previewContentPrefix}${previewId}`)
      return false
    }
    const migratedContent = migrateSiteContent(preview.content)
    const error = validateSiteContent(migratedContent)
    if (error) {
      console.error(`The preview content is invalid: ${error}`)
      return false
    }
    applyContentAndNotify(migratedContent)
    return true
  } catch (error) {
    console.error('Unable to load the content preview.', error)
    return false
  }
}

export function initializeSiteContent() {
  if (!siteContentInitialization) siteContentInitialization = loadSiteContent()
  return siteContentInitialization
}

async function loadSiteContent(): Promise<boolean> {
  if (applyPreviewContent()) return true

  if (import.meta.env.DEV) {
    const localContent = readLocalContent()
    if (localContent) {
      applyContentAndNotify(localContent)
    }
    return true
  }

  try {
    const response = await fetch('/api/content', { cache: 'no-store' })
    if (!isJsonResponse(response)) {
      throw new Error('The site content endpoint returned an unexpected response.')
    }
    if (!response.ok) throw new Error(`The site content endpoint returned ${response.status}.`)

    const content = migrateSiteContent(await response.json())
    const validationError = validateSiteContent(content)
    if (validationError) throw new Error(`The published site content is invalid: ${validationError}`)
    applyContentAndNotify(content)
    return true
  } catch (error) {
    console.error('Unable to load published school content; the built-in content will be shown.', error)
    return false
  }
}

export async function getAdminSession(): Promise<{ email: string; localOnly: boolean }> {
  if (import.meta.env.DEV) return { email: 'Local development', localOnly: true }

  const response = await fetch('/api/admin/session', { cache: 'no-store' })
  if (!isJsonResponse(response)) {
    throw new Error('The admin authentication endpoint returned an unexpected response.')
  }
  const result = (await response.json()) as { authenticated?: boolean; email?: string; error?: string }
  if (!response.ok || !result.authenticated || !result.email) {
    throw new Error(result.error ?? 'You are not authenticated as an administrator.')
  }
  return { email: result.email, localOnly: false }
}

export async function publishSiteContent(content: SiteContent) {
  const validationError = validateSiteContent(content)
  if (validationError) throw new Error(validationError)
  const previousMediaKeys = new Set(collectUploadedMediaKeys(createContentSnapshot()))
  const nextMediaKeys = new Set(collectUploadedMediaKeys(content))
  const removedMediaUrls = [...previousMediaKeys]
    .filter((key) => !nextMediaKeys.has(key))
    .map((key) => `/media/${key}`)

  if (import.meta.env.DEV) {
    window.localStorage.setItem(localContentKey, JSON.stringify(content))
    applyContentAndNotify(content)
    return { localOnly: true, cleanupWarning: null }
  }

  const response = await fetch('/api/admin/content', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  })
  if (!isJsonResponse(response)) {
    throw new Error('The admin publishing endpoint returned an unexpected response.')
  }

  const result = (await response.json()) as {
    content?: unknown
    updatedAt?: string
    error?: string
  }
  if (!response.ok || !result.content) {
    throw new Error(result.error ?? `Publishing failed with status ${response.status}.`)
  }

  applyContentAndNotify(result.content)
  const cleanupWarning = await cleanupUnreferencedMedia(removedMediaUrls)
  return { localOnly: false, updatedAt: result.updatedAt, cleanupWarning }
}

export function getCurrentSiteContent() {
  return createContentSnapshot()
}

export function getDefaultSiteContent() {
  return createDefaultContentSnapshot()
}

export function savePreviewContent(content: SiteContent) {
  const error = validateSiteContent(content)
  if (error) throw new Error(error)

  const previewId = crypto.randomUUID()
  window.localStorage.setItem(
    `${previewContentPrefix}${previewId}`,
    JSON.stringify({ content, expiresAt: Date.now() + 30 * 60 * 1000 }),
  )
  return `/?preview=${encodeURIComponent(previewId)}`
}
