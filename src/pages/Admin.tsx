import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Icon } from '../components/Icon'
import {
  collectUploadedMediaKeys,
  validateSiteContent,
  type SiteContent,
} from '../lib/content-model'
import { cleanupUnreferencedMedia } from '../lib/media'
import {
  getAdminSession,
  getCurrentSiteContent,
  initializeSiteContent,
  publishSiteContent,
  savePreviewContent,
} from '../lib/site-content'
import {
  deleteSchoolUpdate,
  listAdminUpdates,
  saveSchoolUpdate,
  uploadUpdateAttachment,
} from '../lib/updates'
import {
  UPDATE_CATEGORIES,
  UPDATE_CATEGORY_LABELS,
  type SchoolUpdate,
  type SchoolUpdateInput,
  type UpdateAttachment,
  type UpdateCategory,
  type UpdateStatus,
} from '../lib/updates-model'

type PanelId = 'school' | 'homepage' | 'gallery' | 'links' | 'updates'
type ContentPath = (string | number)[]
type GalleryPhoto = {
  name: string
  imageUrl: string
  title: { en: string; hi: string }
  alt: { en: string; hi: string }
  category: 'campus' | 'classrooms' | 'events'
  tall?: boolean
}

const panels: { id: PanelId; label: string; icon: 'home' | 'image' | 'map' | 'star' | 'message' }[] = [
  { id: 'school', label: 'School details', icon: 'home' },
  { id: 'homepage', label: 'Homepage', icon: 'image' },
  { id: 'gallery', label: 'Gallery photos', icon: 'image' },
  { id: 'links', label: 'Social & Google links', icon: 'map' },
  { id: 'updates', label: 'School updates', icon: 'message' },
]

type UpdateForm = {
  id?: string
  title: string
  slug: string
  category: UpdateCategory
  summary: string
  body: string
  publishedAt: string
  effectiveAt: string
  reopeningAt: string
  expiresAt: string
  schoolClosed: boolean
  pinned: boolean
  status: UpdateStatus
  attachments: UpdateAttachment[]
}

function toISTInput(value: string) {
  if (!value) return ''
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return ''
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`
}

function fromISTInput(value: string) {
  return value ? new Date(`${value}:00+05:30`).toISOString() : ''
}

function newUpdateForm(): UpdateForm {
  return {
    title: '',
    slug: '',
    category: 'notice',
    summary: '',
    body: '',
    publishedAt: toISTInput(new Date().toISOString()),
    effectiveAt: '',
    reopeningAt: '',
    expiresAt: '',
    schoolClosed: true,
    pinned: false,
    status: 'draft',
    attachments: [],
  }
}

function formFromUpdate(update: SchoolUpdate): UpdateForm {
  return {
    id: update.id,
    title: update.title,
    slug: update.slug,
    category: update.category,
    summary: update.summary,
    body: update.body,
    publishedAt: toISTInput(update.publishedAt),
    effectiveAt: toISTInput(update.effectiveAt ?? ''),
    reopeningAt: toISTInput(update.reopeningAt ?? ''),
    expiresAt: toISTInput(update.expiresAt ?? ''),
    schoolClosed: update.schoolClosed ?? true,
    pinned: update.pinned,
    status: update.status,
    attachments: update.attachments,
  }
}

function slugFromTitle(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isGalleryPhoto(value: unknown): value is GalleryPhoto {
  if (!isRecord(value) || !isRecord(value.title) || !isRecord(value.alt)) return false
  return (
    typeof value.name === 'string' &&
    typeof value.imageUrl === 'string' &&
    typeof value.title.en === 'string' &&
    typeof value.title.hi === 'string' &&
    typeof value.alt.en === 'string' &&
    typeof value.alt.hi === 'string' &&
    ['campus', 'classrooms', 'events'].includes(String(value.category)) &&
    (value.tall === undefined || typeof value.tall === 'boolean')
  )
}

function updateAtPath(value: unknown, path: ContentPath, nextValue: unknown): unknown {
  if (!path.length) return nextValue
  const [key, ...remainingPath] = path
  if (Array.isArray(value) && typeof key === 'number') {
    return value.map((item, index) =>
      index === key ? updateAtPath(item, remainingPath, nextValue) : item,
    )
  }
  if (isRecord(value) && typeof key === 'string') {
    return { ...value, [key]: updateAtPath(value[key], remainingPath, nextValue) }
  }
  throw new Error('This detail could not be updated.')
}

function getPhotos(content: SiteContent): GalleryPhoto[] {
  if (!Array.isArray(content.galleryItems)) return []
  return content.galleryItems.filter(isGalleryPhoto)
}

function TextField({
  label,
  value,
  onChange,
  multiline = false,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  type?: string
  placeholder?: string
}) {
  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#315b93] focus:ring-2 focus:ring-blue-100'
  return (
    <label className="block min-w-0 text-sm font-medium text-slate-700">
      {label}
      {multiline ? (
        <textarea
          value={value}
          rows={2}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${inputClass} mt-1.5 resize-y`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${inputClass} mt-1.5 min-h-11`}
        />
      )}
    </label>
  )
}

export default function Admin() {
  const [session, setSession] = useState<{ email: string; localOnly: boolean } | null>(null)
  const [sessionError, setSessionError] = useState('')
  const [content, setContent] = useState<SiteContent>(() => getCurrentSiteContent())
  const [siteContentReady, setSiteContentReady] = useState(false)
  const [siteContentError, setSiteContentError] = useState('')
  const [selectedPanel, setSelectedPanel] = useState<PanelId>('school')
  const [isPublishing, setIsPublishing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [notice, setNotice] = useState('')
  const [publishError, setPublishError] = useState('')
  const [updates, setUpdates] = useState<SchoolUpdate[]>([])
  const [updateForm, setUpdateForm] = useState<UpdateForm>(newUpdateForm)
  const [updatesLoading, setUpdatesLoading] = useState(true)
  const [updateSaving, setUpdateSaving] = useState(false)
  const [attachmentUpload, setAttachmentUpload] = useState(false)
  const [showUpdatePreview, setShowUpdatePreview] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const [updateNotice, setUpdateNotice] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)
  const attachmentInput = useRef<HTMLInputElement>(null)
  const hasUnsavedContent = useRef(false)
  const photos = getPhotos(content)
  const school = isRecord(content.school) ? content.school : {}
  const schoolName = isRecord(school.name) ? school.name : {}
  const address = isRecord(school.address) ? school.address : {}
  const hero = isRecord(content.hero) ? content.hero : {}
  const heroAccent = isRecord(hero.titleAccent) ? hero.titleAccent : {}
  const transport = isRecord(content.transport) ? content.transport : {}
  const instagram = isRecord(content.instagram) ? content.instagram : {}
  const socialLinks = isRecord(content.socialLinks) ? content.socialLinks : {}

  useEffect(() => {
    const handleContentUpdate = () => {
      if (!hasUnsavedContent.current) setContent(getCurrentSiteContent())
    }
    window.addEventListener('rps:site-content-updated', handleContentUpdate)
    return () => window.removeEventListener('rps:site-content-updated', handleContentUpdate)
  }, [])

  useEffect(() => {
    let active = true
    void initializeSiteContent().then((loaded) => {
      if (!active) return
      setContent(getCurrentSiteContent())
      setSiteContentReady(true)
      if (!loaded) {
        setSiteContentError(
          'Published website details could not be loaded. Editing is disabled to prevent overwriting existing content.',
        )
      }
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    void getAdminSession().then(
      (result) => {
        if (active) setSession(result)
      },
      (error: unknown) => {
        if (active) {
          setSessionError(error instanceof Error ? error.message : 'Admin access could not be verified.')
        }
      },
    )
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!session) return
    let active = true
    void listAdminUpdates().then(
      (items) => {
        if (active) {
          setUpdates(items)
          setUpdateError('')
        }
      },
      (error: unknown) => {
        if (active) setUpdateError(error instanceof Error ? error.message : 'Announcements could not be loaded.')
      },
    ).finally(() => {
      if (active) setUpdatesLoading(false)
    })
    return () => {
      active = false
    }
  }, [session])

  function updateField(path: ContentPath, value: unknown) {
    const updated = updateAtPath(content, path, value)
    if (!isRecord(updated)) throw new Error('The website details are invalid.')
    hasUnsavedContent.current = true
    setContent(updated)
    setNotice('')
    setPublishError('')
  }

  function updatePhone(value: string) {
    let updated = updateAtPath(content, ['school', 'phoneDisplay'], value)
    updated = updateAtPath(updated, ['school', 'phoneHref'], `tel:${value.replace(/\D/g, '')}`)
    if (!isRecord(updated)) throw new Error('The school phone number could not be updated.')
    hasUnsavedContent.current = true
    setContent(updated)
    setNotice('')
    setPublishError('')
  }

  function updatePhotoTitle(index: number, language: 'en' | 'hi', value: string) {
    let updated = updateAtPath(content, ['galleryItems', index, 'title', language], value)
    updated = updateAtPath(updated, ['galleryItems', index, 'alt', language], value)
    if (!isRecord(updated)) throw new Error('The photo title could not be updated.')
    hasUnsavedContent.current = true
    setContent(updated)
    setNotice('')
    setPublishError('')
  }

  async function uploadPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    setUploadError('')
    setNotice('')
    if (files.length === 0) return
    if (session?.localOnly) {
      setUploadError('Photo uploads need the Cloudflare Pages project and R2 storage configured. They are unavailable in local-only mode.')
      return
    }
    if (photos.length + files.length > 40) {
      setUploadError('The gallery can contain up to 40 photos.')
      return
    }

    const additions: GalleryPhoto[] = []
    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index]
        setUploadStatus(`Uploading photo ${index + 1} of ${files.length}…`)
        const response = await fetch('/api/admin/media', {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        })
        const result = (await response.json()) as { url?: string; error?: string }
        if (!response.ok || !result.url) {
          throw new Error(result.error ?? `Photo upload failed (${response.status}).`)
        }

        const title = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
        const id = result.url.split('/').pop()?.replace(/\.[^.]+$/, '') ?? crypto.randomUUID()
        additions.push({
          name: `uploaded-${id}`,
          imageUrl: result.url,
          title: { en: title, hi: title },
          alt: { en: title, hi: title },
          category: 'events',
        })
      }

      const updated = { ...content, galleryItems: [...photos, ...additions] }
      const validationError = validateSiteContent(updated)
      if (validationError) throw new Error(validationError)
      hasUnsavedContent.current = true
      setContent(updated)
      setNotice(`${additions.length} photo${additions.length === 1 ? '' : 's'} added to the gallery. Publish to make them live.`)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'The selected photos could not be uploaded.')
    } finally {
      setUploadStatus('')
    }
  }

  function changeUpdateForm<K extends keyof UpdateForm>(key: K, value: UpdateForm[K]) {
    setUpdateForm((current) => {
      const updated = { ...current, [key]: value }
      if (key === 'title' && !current.id && typeof value === 'string') {
        updated.slug = slugFromTitle(value)
      }
      return updated
    })
    setUpdateError('')
    setUpdateNotice('')
  }

  function startNewUpdate() {
    setUpdateForm(newUpdateForm())
    setUpdateError('')
    setUpdateNotice('')
  }

  async function uploadUpdateFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    setUpdateError('')
    if (!files.length) return
    if (updateForm.attachments.length + files.length > 5) {
      setUpdateError('An announcement can include up to five attachments.')
      return
    }
    if (session?.localOnly) {
      setUpdateError('File attachments need the deployed Cloudflare Pages project and R2 storage.')
      return
    }

    setAttachmentUpload(true)
    try {
      const additions: UpdateAttachment[] = []
      for (const file of files) {
        const validType = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type)
        const maxSize = file.type === 'application/pdf' ? 15 : 8
        if (!validType || file.size > maxSize * 1024 * 1024) {
          throw new Error(`Choose a PDF, JPG, PNG, or WebP file no larger than ${maxSize} MB.`)
        }
        additions.push(await uploadUpdateAttachment(file))
      }
      changeUpdateForm('attachments', [...updateForm.attachments, ...additions])
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'The attachment could not be uploaded.')
    } finally {
      setAttachmentUpload(false)
    }
  }

  async function saveUpdate() {
    setUpdateSaving(true)
    setUpdateError('')
    setUpdateNotice('')
    try {
      const input: SchoolUpdateInput = {
        slug: updateForm.slug,
        title: updateForm.title,
        category: updateForm.category,
        summary: updateForm.summary,
        body: updateForm.body,
        publishedAt: fromISTInput(updateForm.publishedAt),
        effectiveAt: fromISTInput(updateForm.effectiveAt) || null,
        reopeningAt: fromISTInput(updateForm.reopeningAt) || null,
        schoolClosed: updateForm.category === 'holiday' ? updateForm.schoolClosed : null,
        expiresAt: fromISTInput(updateForm.expiresAt) || null,
        status: updateForm.status,
        pinned: updateForm.pinned,
        attachments: updateForm.attachments,
      }
      const previousAttachments = updates.find((update) => update.id === updateForm.id)?.attachments ?? []
      const previousMediaKeys = new Set(collectUploadedMediaKeys(previousAttachments))
      const nextMediaKeys = new Set(collectUploadedMediaKeys(input.attachments))
      const saved = await saveSchoolUpdate(input, updateForm.id)
      setUpdates((current) => [saved, ...current.filter((item) => item.id !== saved.id)])
      setUpdateForm(formFromUpdate(saved))
      const cleanupWarning = await cleanupUnreferencedMedia(
        [...previousMediaKeys]
          .filter((key) => !nextMediaKeys.has(key))
          .map((key) => `/media/${key}`),
      )
      const savedNotice =
        saved.status === 'draft'
          ? 'Draft saved. It is not visible to parents.'
          : saved.status === 'scheduled'
            ? 'Announcement scheduled. It will appear automatically at the selected IST time.'
            : saved.status === 'archived'
              ? 'Announcement archived.'
              : 'Announcement published and now available to parents.'
      setUpdateNotice(
        cleanupWarning ? `${savedNotice} ${cleanupWarning}` : savedNotice,
      )
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'The announcement could not be saved.')
    } finally {
      setUpdateSaving(false)
    }
  }

  async function removeUpdate(update: SchoolUpdate) {
    if (!window.confirm(`Delete "${update.title}" permanently?`)) return
    setUpdateError('')
    setUpdateNotice('')
    try {
      await deleteSchoolUpdate(update.id)
      setUpdates((current) => current.filter((item) => item.id !== update.id))
      if (updateForm.id === update.id) startNewUpdate()
      const cleanupWarning = await cleanupUnreferencedMedia(
        collectUploadedMediaKeys(update.attachments).map((key) => `/media/${key}`),
      )
      setUpdateNotice(
        cleanupWarning ? `Announcement deleted. ${cleanupWarning}` : 'Announcement deleted.',
      )
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'The announcement could not be deleted.')
    }
  }

  function removePhoto(index: number) {
    hasUnsavedContent.current = true
    setContent({ ...content, galleryItems: photos.filter((_, photoIndex) => photoIndex !== index) })
    setNotice('Photo removed from the gallery. Publish to update the live website.')
  }

  async function publish() {
    if (isPublishing) return
    const validationError = validateSiteContent(content)
    if (validationError) {
      setPublishError(validationError)
      return
    }
    if (!window.confirm('Publish these changes for all visitors to the school website?')) return

    setIsPublishing(true)
    setPublishError('')
    setNotice('')
    try {
      const result = await publishSiteContent(content)
      hasUnsavedContent.current = false
      setSession((current) => current && { ...current, localOnly: result.localOnly })
      setNotice(
        result.localOnly
          ? 'Saved on this browser only. Configure Cloudflare to publish for everyone.'
          : result.cleanupWarning
            ? `Published successfully. Visitors will now see these changes. ${result.cleanupWarning}`
            : 'Published successfully. Visitors will now see these changes.',
      )
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : 'The content could not be published.')
    } finally {
      setIsPublishing(false)
    }
  }

  function preview() {
    try {
      window.open(savePreviewContent(content), '_blank', 'noopener,noreferrer')
      setNotice('A private preview has opened in a new tab.')
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : 'The preview could not be opened.')
    }
  }

  if (sessionError) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-[#f4f6f9] px-5 py-12 text-[#17263e]">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Administrator access</p>
          <h1 className="mt-4 font-display text-3xl font-semibold">This area is protected.</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">{sessionError}</p>
          <a className="mt-7 inline-flex min-h-11 items-center rounded-full bg-[#10264a] px-6 text-sm font-semibold text-white" href="/admin">
            Check access again
          </a>
        </section>
      </main>
    )
  }

  if (!siteContentReady) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-[#f4f6f9] px-5 text-[#17263e]">
        <p role="status" className="text-sm font-medium text-slate-600">Loading saved website details…</p>
      </main>
    )
  }

  if (siteContentError) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-[#f4f6f9] px-5 py-12 text-[#17263e]">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Website content</p>
          <h1 className="mt-4 font-display text-3xl font-semibold">Editing is temporarily unavailable.</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">{siteContentError}</p>
          <button
            type="button"
            className="mt-7 inline-flex min-h-11 items-center rounded-full bg-[#10264a] px-6 text-sm font-semibold text-white"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </section>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-[#f4f6f9] px-5 text-[#17263e]">
        <p role="status" className="text-sm font-medium text-slate-600">Verifying administrator access…</p>
      </main>
    )
  }

  return (
    <main className="min-h-svh bg-[#f4f6f9] text-[#17263e]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-3 rounded-lg" aria-label="Royal Public School home">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#d6ad55] bg-[#10264a] font-display text-lg font-bold text-[#e2bd69]">R</span>
            <span>
              <span className="block text-sm font-bold">Royal Public School</span>
              <span className="mt-0.5 block text-xs text-slate-500">Website editor</span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">{session.email}</span>
            <a href="/cdn-cgi/access/logout" className="inline-flex min-h-10 items-center rounded-full border border-slate-300 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Sign out
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-10">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Content management</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">School website</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Update the key details, photos, and links visitors need.</p>
        </div>

        {session.localOnly && (
          <p className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950">
            <strong>Local preview:</strong> edits save only in this browser. Photo uploads need Cloudflare R2.
          </p>
        )}

        <nav aria-label="Admin sections" className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2 sm:grid-cols-5">
          {panels.map((panel) => (
            <button
              type="button"
              key={panel.id}
              aria-pressed={selectedPanel === panel.id}
              onClick={() => setSelectedPanel(panel.id)}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${
                selectedPanel === panel.id ? 'bg-[#10264a] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon name={panel.icon} className="h-4 w-4" />
              {panel.label}
            </button>
          ))}
        </nav>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          {selectedPanel === 'school' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold">School details</h2>
                <p className="mt-1 text-sm text-slate-500">The name, address, and contact visitors see.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="School name (English)" value={String(schoolName.en ?? '')} onChange={(value) => updateField(['school', 'name', 'en'], value)} />
                <TextField label="School name (Hindi)" value={String(schoolName.hi ?? '')} onChange={(value) => updateField(['school', 'name', 'hi'], value)} />
                <TextField label="Address (English)" value={String(address.en ?? '')} onChange={(value) => updateField(['school', 'address', 'en'], value)} multiline />
                <TextField label="Address (Hindi)" value={String(address.hi ?? '')} onChange={(value) => updateField(['school', 'address', 'hi'], value)} multiline />
                <TextField label="Phone number" value={String(school.phoneDisplay ?? '')} onChange={updatePhone} />
                <TextField label="WhatsApp number (country code first)" value={String(school.whatsapp ?? '')} onChange={(value) => updateField(['school', 'whatsapp'], value)} />
              </div>
            </div>
          )}

          {selectedPanel === 'homepage' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold">Homepage heading</h2>
                <p className="mt-1 text-sm text-slate-500">Change the main message at the top of the homepage.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Highlighted words (English)" value={String(heroAccent.en ?? '')} onChange={(value) => updateField(['hero', 'titleAccent', 'en'], value)} />
                <TextField label="Highlighted words (Hindi)" value={String(heroAccent.hi ?? '')} onChange={(value) => updateField(['hero', 'titleAccent', 'hi'], value)} />
                <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                  School transport photo (optional)
                  <select
                    value={String(transport.photoUrl ?? '')}
                    onChange={(event) => updateField(['transport', 'photoUrl'], event.target.value)}
                    className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#315b93] focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">No transport photo uploaded</option>
                    {photos.map((photo) => (
                      <option key={photo.name} value={photo.imageUrl || `/images/${photo.name}-1600.webp`}>
                        {photo.title.en}
                      </option>
                    ))}
                  </select>
                  <span className="mt-1 block text-xs font-normal text-slate-500">
                    Choose a real school bus photo after uploading it to the gallery. No bus photo is currently available.
                  </span>
                </label>
              </div>
            </div>
          )}

          {selectedPanel === 'gallery' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">Gallery photos</h2>
                  <p className="mt-1 text-sm text-slate-500">Upload school photos and choose where they appear.</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  disabled={Boolean(uploadStatus)}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#10264a] px-5 text-sm font-semibold text-white transition hover:bg-[#183866] disabled:opacity-60"
                >
                  {uploadStatus || '+ Upload photos'}
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="sr-only"
                  aria-label="Upload gallery photos"
                  onChange={(event) => void uploadPhotos(event)}
                />
              </div>
              <p className="text-xs text-slate-500">JPG, PNG, or WebP · Up to 8 MB each · Maximum 40 photos</p>
              {uploadError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{uploadError}</p>}
              {photos.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">No gallery photos yet. Upload a few to get started.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {photos.map((photo, index) => (
                    <article key={`${photo.name}-${index}`} className="overflow-hidden rounded-xl border border-slate-200">
                      <img
                        src={photo.imageUrl || `/images/${photo.name}-640.webp`}
                        alt={photo.title.en}
                        className="aspect-[4/3] w-full bg-slate-100 object-cover"
                      />
                      <div className="space-y-3 p-3">
                        <TextField label="Photo title (English)" value={photo.title.en} onChange={(value) => updatePhotoTitle(index, 'en', value)} />
                        <TextField label="Photo title (Hindi)" value={photo.title.hi} onChange={(value) => updatePhotoTitle(index, 'hi', value)} />
                        <label className="block text-sm font-medium text-slate-700">
                          Show under
                          <select
                            value={photo.category}
                            onChange={(event) => updateField(['galleryItems', index, 'category'], event.target.value)}
                            className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#315b93] focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="events">Events</option>
                            <option value="campus">Campus</option>
                            <option value="classrooms">Classrooms</option>
                          </select>
                        </label>
                        <button type="button" onClick={() => removePhoto(index)} className="min-h-9 rounded-full px-3 text-xs font-semibold text-red-700 hover:bg-red-50">
                          Remove from gallery
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedPanel === 'links' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold">Social & Google links</h2>
                <p className="mt-1 text-sm text-slate-500">Add the official pages visitors can follow or review.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Instagram profile" value={String(instagram.url ?? '')} onChange={(value) => updateField(['instagram', 'url'], value)} placeholder="https://instagram.com/…" />
                <TextField label="Instagram handle" value={String(instagram.handle ?? '')} onChange={(value) => updateField(['instagram', 'handle'], value)} placeholder="@schoolname" />
                <TextField label="Facebook page" value={String(socialLinks.facebookUrl ?? '')} onChange={(value) => updateField(['socialLinks', 'facebookUrl'], value)} placeholder="https://facebook.com/…" />
                <TextField label="Google Maps location" value={String(school.mapsUrl ?? '')} onChange={(value) => updateField(['school', 'mapsUrl'], value)} placeholder="https://maps.google.com/…" />
                <TextField label="Google reviews" value={String(socialLinks.googleReviewsUrl ?? '')} onChange={(value) => updateField(['socialLinks', 'googleReviewsUrl'], value)} placeholder="https://g.page/r/…/review" />
              </div>
              <p className="rounded-xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
                Google Maps opens your location. Add the direct Google review link to let visitors leave a rating; the site will not display an unverified star score.
              </p>
            </div>
          )}

          {selectedPanel === 'updates' && (
            <div className="space-y-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">School updates</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Write a short notice. Parents can read published updates without signing in.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startNewUpdate}
                  className="min-h-10 rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  + New announcement
                </button>
              </div>

              <div className="grid gap-5 lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.5fr)]">
                <aside className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700">Saved announcements</h3>
                  {updatesLoading && <p role="status" className="text-sm text-slate-500">Loading announcements…</p>}
                  {!updatesLoading && updates.length === 0 && (
                    <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
                      No announcements yet. Create the first one when the school is ready.
                    </p>
                  )}
                  {updates.map((update) => (
                    <article key={update.id} className="rounded-xl border border-slate-200 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">{update.title}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {UPDATE_CATEGORY_LABELS[update.category].en} · {update.status}
                          </p>
                        </div>
                        {update.pinned && <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-900">Pinned</span>}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setUpdateForm(formFromUpdate(update))
                            setUpdateError('')
                            setUpdateNotice('')
                            setShowUpdatePreview(false)
                          }}
                          className="min-h-9 rounded-full border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeUpdate(update)}
                          className="min-h-9 rounded-full px-3 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                        {['published', 'scheduled'].includes(update.status) && (
                          <a
                            href={`/updates/${update.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-9 items-center rounded-full px-3 text-xs font-semibold text-[#274a78] hover:bg-blue-50"
                          >
                            View public link
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </aside>

                <div className="space-y-4 rounded-2xl bg-slate-50 p-4 sm:p-5">
                  <h3 className="text-base font-bold">{updateForm.id ? 'Edit announcement' : 'New announcement'}</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                      label="Announcement title"
                      value={updateForm.title}
                      onChange={(value) => changeUpdateForm('title', value)}
                      placeholder="Example: School holiday on 26 January"
                    />
                    <label className="block text-sm font-medium text-slate-700">
                      Category
                      <select
                        value={updateForm.category}
                        onChange={(event) => changeUpdateForm('category', event.target.value as UpdateCategory)}
                        className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#315b93] focus:ring-2 focus:ring-blue-100"
                      >
                        {UPDATE_CATEGORIES.map((category) => (
                          <option key={category} value={category}>{UPDATE_CATEGORY_LABELS[category].en}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <TextField
                    label="Shareable page link"
                    value={updateForm.slug}
                    onChange={(value) => changeUpdateForm('slug', slugFromTitle(value))}
                    placeholder="school-holiday-notice"
                  />
                  <TextField
                    label="Short description"
                    value={updateForm.summary}
                    onChange={(value) => changeUpdateForm('summary', value)}
                    multiline
                    placeholder="One or two clear sentences for the announcement list."
                  />
                  <TextField
                    label="Full announcement"
                    value={updateForm.body}
                    onChange={(value) => changeUpdateForm('body', value)}
                    multiline
                    placeholder="Write the details in simple language for parents."
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                      label="Publish date and time (IST)"
                      type="datetime-local"
                      value={updateForm.publishedAt}
                      onChange={(value) => changeUpdateForm('publishedAt', value)}
                    />
                    <label className="block text-sm font-medium text-slate-700">
                      Status
                      <select
                        value={updateForm.status}
                        onChange={(event) => changeUpdateForm('status', event.target.value as UpdateStatus)}
                        className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#315b93] focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="draft">Save as draft</option>
                        <option value="published">Publish</option>
                        <option value="scheduled">Schedule</option>
                        <option value="archived">Archive</option>
                      </select>
                    </label>
                    <TextField
                      label={updateForm.category === 'holiday' ? 'Holiday date (IST)' : 'Event / effective date (IST)'}
                      type="datetime-local"
                      value={updateForm.effectiveAt}
                      onChange={(value) => changeUpdateForm('effectiveAt', value)}
                    />
                    <TextField
                      label="Expiry date (optional, IST)"
                      type="datetime-local"
                      value={updateForm.expiresAt}
                      onChange={(value) => changeUpdateForm('expiresAt', value)}
                    />
                    {updateForm.category === 'holiday' && (
                      <>
                        <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-slate-700">
                          <input type="checkbox" checked={updateForm.schoolClosed} onChange={(event) => changeUpdateForm('schoolClosed', event.target.checked)} className="h-4 w-4 accent-[#10264a]" />
                          School will remain closed
                        </label>
                        <TextField
                          label="School reopening date (optional, IST)"
                          type="datetime-local"
                          value={updateForm.reopeningAt}
                          onChange={(value) => changeUpdateForm('reopeningAt', value)}
                        />
                      </>
                    )}
                  </div>

                  <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-slate-700">
                    <input type="checkbox" checked={updateForm.pinned} onChange={(event) => changeUpdateForm('pinned', event.target.checked)} className="h-4 w-4 accent-[#10264a]" />
                    Pin this important notice on the homepage
                  </label>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Attachments</p>
                        <p className="text-xs text-slate-500">PDF, JPG, PNG, or WebP · Up to 5 files</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => attachmentInput.current?.click()}
                        disabled={attachmentUpload || updateForm.attachments.length >= 5}
                        className="min-h-9 rounded-full border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 disabled:opacity-50"
                      >
                        {attachmentUpload ? 'Uploading…' : 'Add attachment'}
                      </button>
                      <input ref={attachmentInput} type="file" accept="application/pdf,image/jpeg,image/png,image/webp" multiple className="sr-only" aria-label="Add announcement attachments" onChange={(event) => void uploadUpdateFiles(event)} />
                    </div>
                    {updateForm.attachments.map((attachment, index) => (
                      <div key={attachment.url} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm">
                        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="truncate text-[#274a78] underline underline-offset-2">{attachment.name}</a>
                        <button type="button" onClick={() => changeUpdateForm('attachments', updateForm.attachments.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove ${attachment.name}`} className="min-h-8 rounded-full px-2 text-xs font-semibold text-red-700 hover:bg-red-50">Remove</button>
                      </div>
                    ))}
                  </div>

                  {showUpdatePreview && (
                    <article className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {UPDATE_CATEGORY_LABELS[updateForm.category].en} · Preview
                      </p>
                      <h4 className="text-lg font-bold text-[#10264a]">{updateForm.title || 'Announcement title'}</h4>
                      <p className="text-sm text-slate-600">{updateForm.summary || 'Short description preview.'}</p>
                      <p className="whitespace-pre-line text-sm leading-6 text-slate-700">{updateForm.body || 'Full announcement preview.'}</p>
                    </article>
                  )}
                  {updateError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{updateError}</p>}
                  {updateNotice && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{updateNotice}</p>}
                  <div className="flex flex-wrap justify-end gap-2">
                    <button type="button" onClick={() => setShowUpdatePreview((current) => !current)} className="min-h-10 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      {showUpdatePreview ? 'Hide preview' : 'Preview'}
                    </button>
                    <button type="button" onClick={() => void saveUpdate()} disabled={updateSaving || attachmentUpload} className="min-h-10 rounded-full bg-[#10264a] px-5 text-sm font-semibold text-white hover:bg-[#183866] disabled:opacity-50">
                      {updateSaving ? 'Saving…' : updateForm.status === 'published' ? 'Save & publish' : updateForm.status === 'scheduled' ? 'Schedule announcement' : updateForm.status === 'archived' ? 'Save to archive' : 'Save draft'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {publishError && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{publishError}</p>}
        {notice && <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</p>}

        {selectedPanel !== 'updates' && <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <span className="text-xs text-slate-500">{photos.length} gallery photos</span>
          <div className="flex gap-2">
            <button type="button" onClick={preview} className="min-h-10 rounded-full border border-slate-300 px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Preview
            </button>
            <button type="button" onClick={() => void publish()} disabled={isPublishing} className="min-h-10 rounded-full bg-[#10264a] px-5 text-xs font-semibold text-white hover:bg-[#183866] disabled:opacity-50">
              {isPublishing ? 'Publishing…' : 'Publish changes'}
            </button>
          </div>
        </footer>}
      </div>
    </main>
  )
}
