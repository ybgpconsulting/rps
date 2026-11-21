import {
  validateSchoolUpdate,
  type SchoolUpdate,
  type SchoolUpdateInput,
  type UpdateAttachment,
  type UpdateCategory,
} from './updates-model'

const localUpdatesKey = 'rps-admin-local-updates'

export type UpdateListResult = {
  updates: SchoolUpdate[]
  total: number
  limit: number
  offset: number
}

function isJsonResponse(response: Response) {
  return response.headers.get('content-type')?.includes('application/json') === true
}

function readLocalUpdates(): SchoolUpdate[] {
  const saved = window.localStorage.getItem(localUpdatesKey)
  if (!saved) return []
  const updates: unknown = JSON.parse(saved)
  if (!Array.isArray(updates)) throw new Error('Locally saved announcements could not be read.')
  return updates as SchoolUpdate[]
}

async function readJson<T>(response: Response): Promise<T> {
  if (!isJsonResponse(response)) throw new Error('The announcements service returned an unexpected response.')
  const result = await response.json() as T & { error?: string }
  if (!response.ok) throw new Error(result.error ?? `The announcements service returned ${response.status}.`)
  return result
}

export async function listAdminUpdates(): Promise<SchoolUpdate[]> {
  if (import.meta.env.DEV) return readLocalUpdates()
  const result = await readJson<{ updates: SchoolUpdate[] }>(
    await fetch('/api/admin/updates', { cache: 'no-store' }),
  )
  return result.updates
}

export async function listPublicUpdates(options: {
  category?: UpdateCategory | ''
  archive?: boolean
  search?: string
  pinnedOnly?: boolean
  excludePinned?: boolean
  limit?: number
  offset?: number
} = {}): Promise<UpdateListResult> {
  const limit = options.limit ?? 8
  const offset = options.offset ?? 0
  if (import.meta.env.DEV) {
    const now = Date.now()
    const search = options.search?.trim().toLowerCase() ?? ''
    const filtered = readLocalUpdates()
      .filter((update) => {
        const published = ['published', 'scheduled'].includes(update.status) &&
          Date.parse(update.publishedAt) <= now &&
          (!update.expiresAt || Date.parse(update.expiresAt) > now)
        const archived = (update.status === 'archived' && update.everPublished) ||
          (['published', 'scheduled'].includes(update.status) && Boolean(update.expiresAt) && Date.parse(update.expiresAt!) <= now)
        return (options.archive ? archived : published) &&
          (!options.category || update.category === options.category) &&
          (!options.pinnedOnly || update.pinned) &&
          (!options.excludePinned || !update.pinned) &&
          (!search || `${update.title} ${update.summary} ${update.body}`.toLowerCase().includes(search))
      })
      .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt))
    return { updates: filtered.slice(offset, offset + limit), total: filtered.length, limit, offset }
  }

  const query = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  if (options.category) query.set('category', options.category)
  if (options.archive) query.set('archive', '1')
  if (options.search?.trim()) query.set('q', options.search.trim())
  if (options.pinnedOnly) query.set('pinned', '1')
  if (options.excludePinned) query.set('excludePinned', '1')
  return readJson<UpdateListResult>(
    await fetch(`/api/updates?${query}`, { cache: 'no-store' }),
  )
}

export async function getPublicUpdate(slug: string): Promise<SchoolUpdate> {
  if (import.meta.env.DEV) {
    const now = Date.now()
    const update = readLocalUpdates().find(
      (item) =>
        item.slug === slug &&
        Date.parse(item.publishedAt) <= now &&
        (        (item.status === 'archived' && item.everPublished) ||
          (['published', 'scheduled'].includes(item.status) &&
            (!item.expiresAt || Date.parse(item.expiresAt) > now))),
    )
    if (!update) throw new Error('This announcement is not available.')
    return update
  }
  const result = await readJson<{ update: SchoolUpdate }>(
    await fetch(`/api/updates/${encodeURIComponent(slug)}`, { cache: 'no-store' }),
  )
  return result.update
}

export async function saveSchoolUpdate(input: SchoolUpdateInput, id?: string): Promise<SchoolUpdate> {
  const issue = validateSchoolUpdate(input)
  if (issue) throw new Error(issue)

  if (import.meta.env.DEV) {
    const updates = readLocalUpdates()
    const existing = updates.find((update) => update.id === id)
    const now = Date.now()
    const hadBeenPublished = Boolean(existing?.everPublished) ||
      Boolean(existing && ['published', 'scheduled'].includes(existing.status) && Date.parse(existing.publishedAt) <= now)
    const isPublicNow = ['published', 'scheduled'].includes(input.status) && Date.parse(input.publishedAt) <= now
    const saved: SchoolUpdate = {
      ...input,
      id: id ?? crypto.randomUUID(),
      everPublished: hadBeenPublished || isPublicNow,
      updatedAt: new Date().toISOString(),
    }
    const existingIndex = updates.findIndex((update) => update.id === saved.id)
    if (existingIndex < 0) updates.push(saved)
    else updates[existingIndex] = saved
    window.localStorage.setItem(localUpdatesKey, JSON.stringify(updates))
    return saved
  }

  const response = await fetch(id ? `/api/admin/updates/${encodeURIComponent(id)}` : '/api/admin/updates', {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const result = await readJson<{ update: SchoolUpdate }>(response)
  return result.update
}

export async function deleteSchoolUpdate(id: string): Promise<void> {
  if (import.meta.env.DEV) {
    window.localStorage.setItem(localUpdatesKey, JSON.stringify(readLocalUpdates().filter((update) => update.id !== id)))
    return
  }
  await readJson<{ deleted: boolean }>(
    await fetch(`/api/admin/updates/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  )
}

export async function uploadUpdateAttachment(file: File): Promise<UpdateAttachment> {
  if (import.meta.env.DEV) throw new Error('File attachments need the deployed Cloudflare Pages project and R2 storage.')
  const response = await fetch('/api/admin/update-attachments', {
    method: 'POST',
    headers: {
      'Content-Type': file.type,
      'X-File-Name': encodeURIComponent(file.name),
    },
    body: file,
  })
  return readJson<UpdateAttachment>(response)
}
