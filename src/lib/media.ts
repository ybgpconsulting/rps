import { collectUploadedMediaKeys } from './content-model'

export async function cleanupUnreferencedMedia(urls: string[]) {
  if (import.meta.env.DEV) return null

  const keys = [...new Set(urls.flatMap(collectUploadedMediaKeys))]
  let retained = false
  const errors: string[] = []
  for (const key of keys) {
    try {
      const response = await fetch(`/api/admin/media?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
        cache: 'no-store',
      })
      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('The media cleanup endpoint returned an unexpected response.')
      }
      const result = (await response.json()) as { deleted?: boolean; error?: string }
      if (response.status === 409) {
        retained = true
        continue
      }
      if (!response.ok || !result.deleted) {
        throw new Error(result.error ?? `Media cleanup failed with status ${response.status}.`)
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'A media file could not be cleaned up.')
    }
  }

  const warnings = [...errors]
  if (retained) warnings.push('Some removed files remain stored because published content or another announcement still uses them.')
  return warnings.length ? warnings.join(' ') : null
}
