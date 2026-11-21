export const UPDATE_CATEGORIES = [
  'holiday',
  'notice',
  'news',
  'examination',
  'event',
  'admission',
  'parent-information',
] as const

export type UpdateCategory = (typeof UPDATE_CATEGORIES)[number]
export type UpdateStatus = 'draft' | 'scheduled' | 'published' | 'archived'

export type UpdateAttachment = {
  url: string
  name: string
  type: 'application/pdf' | 'image/jpeg' | 'image/png' | 'image/webp'
}

export type SchoolUpdate = {
  id: string
  slug: string
  title: string
  category: UpdateCategory
  summary: string
  body: string
  publishedAt: string
  effectiveAt: string | null
  reopeningAt: string | null
  schoolClosed: boolean | null
  expiresAt: string | null
  status: UpdateStatus
  everPublished: boolean
  pinned: boolean
  attachments: UpdateAttachment[]
  updatedAt: string
}

export type SchoolUpdateInput = Omit<SchoolUpdate, 'id' | 'updatedAt' | 'everPublished'>

export const UPDATE_CATEGORY_LABELS: Record<UpdateCategory, { en: string; hi: string }> = {
  holiday: { en: 'Holiday announcements', hi: 'छुट्टी की घोषणाएँ' },
  notice: { en: 'Important notices', hi: 'महत्वपूर्ण सूचनाएँ' },
  news: { en: 'School news', hi: 'स्कूल समाचार' },
  examination: { en: 'Examination & results', hi: 'परीक्षा और परिणाम' },
  event: { en: 'Events & activities', hi: 'कार्यक्रम और गतिविधियाँ' },
  admission: { en: 'Admission updates', hi: 'प्रवेश समाचार' },
  'parent-information': { en: 'Parent information', hi: 'अभिभावक जानकारी' },
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isValidDate = (value: unknown): value is string =>
  typeof value === 'string' && Number.isFinite(Date.parse(value))

export function validateSchoolUpdate(value: unknown): string | null {
  if (!isRecord(value)) return 'Enter announcement details.'
  if (typeof value.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug) || value.slug.length > 100) {
    return 'Use a simple URL name with lowercase letters, numbers, and hyphens.'
  }
  if (typeof value.title !== 'string' || !value.title.trim() || value.title.length > 140) {
    return 'Enter a title of 1–140 characters.'
  }
  if (typeof value.category !== 'string' || !UPDATE_CATEGORIES.includes(value.category as UpdateCategory)) {
    return 'Choose one of the listed announcement categories.'
  }
  if (typeof value.summary !== 'string' || !value.summary.trim() || value.summary.length > 400) {
    return 'Enter a short summary of up to 400 characters.'
  }
  if (typeof value.body !== 'string' || !value.body.trim() || value.body.length > 20000) {
    return 'Enter announcement details of up to 20,000 characters.'
  }
  if (!isValidDate(value.publishedAt)) return 'Choose a valid publication date and time.'
  for (const [field, label] of [
    ['effectiveAt', 'effective date'],
    ['reopeningAt', 'reopening date'],
    ['expiresAt', 'expiry date'],
  ] as const) {
    if (value[field] !== null && value[field] !== '' && !isValidDate(value[field])) {
      return `Choose a valid ${label}.`
    }
  }
  if (typeof value.status !== 'string' || !['draft', 'scheduled', 'published', 'archived'].includes(value.status)) {
    return 'Choose draft, scheduled, published, or archived status.'
  }
  const publicationTime = Date.parse(value.publishedAt)
  if (value.status === 'scheduled' && publicationTime <= Date.now()) {
    return 'Choose a future publication time for a scheduled announcement.'
  }
  if (value.status === 'published' && publicationTime > Date.now()) {
    return 'Choose a current or past publication time, or schedule this announcement.'
  }
  if (typeof value.pinned !== 'boolean') return 'Choose whether this announcement is pinned.'
  if (value.schoolClosed !== null && typeof value.schoolClosed !== 'boolean') {
    return 'Choose whether school will remain closed.'
  }
  if (value.category === 'holiday' && (!value.effectiveAt || typeof value.schoolClosed !== 'boolean')) {
    return 'Add the holiday date and whether school will remain closed.'
  }
  if (!Array.isArray(value.attachments) || value.attachments.length > 5) {
    return 'An announcement can include up to five attachments.'
  }
  for (const attachment of value.attachments) {
    if (
      !isRecord(attachment) ||
      typeof attachment.url !== 'string' ||
      !/^\/media\/[0-9a-f-]{36}\.(?:jpg|png|webp|pdf)$/i.test(attachment.url) ||
      typeof attachment.name !== 'string' ||
      !attachment.name.trim() ||
      attachment.name.length > 160 ||
      !['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(String(attachment.type))
    ) {
      return 'One of the attachments is not valid. Upload a PDF, JPG, PNG, or WebP file.'
    }
  }
  if (value.effectiveAt && value.reopeningAt && Date.parse(String(value.reopeningAt)) <= Date.parse(String(value.effectiveAt))) {
    return 'The reopening date must be after the holiday date.'
  }
  if (value.expiresAt && Date.parse(String(value.expiresAt)) <= publicationTime) {
    return 'The expiry date must be after the publication date.'
  }
  return null
}

export function toSchoolUpdate(row: Record<string, unknown>): SchoolUpdate | null {
  let attachments: unknown
  try {
    attachments = JSON.parse(String(row.attachments_json))
  } catch {
    return null
  }
  const update: SchoolUpdate = {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    category: row.category as UpdateCategory,
    summary: String(row.summary),
    body: String(row.body),
    publishedAt: String(row.published_at),
    effectiveAt: row.effective_at === null ? null : String(row.effective_at),
    reopeningAt: row.reopening_at === null ? null : String(row.reopening_at),
    schoolClosed: row.school_closed === null ? null : Number(row.school_closed) === 1,
    expiresAt: row.expires_at === null ? null : String(row.expires_at),
    status: row.status as UpdateStatus,
    everPublished: Number(row.ever_published) === 1,
    pinned: Number(row.pinned) === 1,
    attachments: Array.isArray(attachments) ? attachments as UpdateAttachment[] : [],
    updatedAt: String(row.updated_at),
  }
  return validateSchoolUpdate(update) ? null : update
}
