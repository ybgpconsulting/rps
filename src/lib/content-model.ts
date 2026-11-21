import * as data from '../data'
import { dictionary } from '../translations'

export type SiteContent = Record<string, unknown>

export const contentKeys = [
  'school',
  'transport',
  'instagram',
  'socialLinks',
  'instagramPosts',
  'navItems',
  'footerLinks',
  'marquee',
  'hero',
  'welcome',
  'why',
  'acFeature',
  'academicStages',
  'academicsCopy',
  'facilityItems',
  'facilitiesCopy',
  'campusItems',
  'campusCopy',
  'principal',
  'galleryItems',
  'galleryCopy',
  'admissionsCopy',
  'classOptions',
  'faqs',
  'contactCopy',
  'aboutCopy',
  'visionCopy',
  'seo',
  'legalCopy',
] as const

export const contentSections = [
  { id: 'school', label: 'School & contact', keys: ['school', 'instagram'] },
  { id: 'home', label: 'Homepage', keys: ['marquee', 'hero', 'welcome', 'why', 'acFeature', 'principal'] },
  { id: 'academics', label: 'Academics', keys: ['academicStages', 'academicsCopy'] },
  {
    id: 'campus',
    label: 'Facilities & campus',
    keys: ['facilityItems', 'facilitiesCopy', 'campusItems', 'campusCopy'],
  },
  { id: 'about', label: 'About & vision', keys: ['aboutCopy', 'visionCopy'] },
  { id: 'admissions', label: 'Admissions', keys: ['admissionsCopy', 'classOptions', 'faqs'] },
  { id: 'gallery', label: 'Gallery & social', keys: ['galleryItems', 'galleryCopy', 'instagramPosts'] },
  { id: 'contact', label: 'Contact & legal', keys: ['contactCopy', 'legalCopy'] },
  { id: 'navigation', label: 'Navigation', keys: ['navItems', 'footerLinks'] },
  { id: 'seo', label: 'Search & SEO', keys: ['seo'] },
  { id: 'translations', label: 'Interface translations', keys: ['dictionary'] },
] as const

const mutableContent: SiteContent = Object.fromEntries([
  ...contentKeys.map((key) => [key, data[key]]),
  ['dictionary', dictionary],
])
const defaultContent = structuredClone(mutableContent)

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export function migrateSiteContent(value: unknown): unknown {
  if (!isRecord(value)) return value

  const migrated = structuredClone(value)
  if (!('socialLinks' in migrated)) migrated.socialLinks = structuredClone(defaultContent.socialLinks)
  if (!('transport' in migrated)) migrated.transport = structuredClone(defaultContent.transport)
  if (Array.isArray(migrated.navItems) && !migrated.navItems.some((item) => isRecord(item) && item.to === '/updates')) {
    const updatesLink = data.navItems.find((item) => item.to === '/updates')
    if (updatesLink) migrated.navItems.splice(1, 0, structuredClone(updatesLink))
  }
  if (isRecord(migrated.footerLinks) && Array.isArray(migrated.footerLinks.quick) &&
      !migrated.footerLinks.quick.some((item) => isRecord(item) && item.to === '/updates')) {
    const updatesLink = data.footerLinks.quick.find((item) => item.to === '/updates')
    if (updatesLink) migrated.footerLinks.quick.unshift(structuredClone(updatesLink))
  }
  if (isRecord(migrated.seo) && !('/updates' in migrated.seo)) {
    migrated.seo['/updates'] = structuredClone(data.seo['/updates'])
  }
  if (isRecord(migrated.dictionary)) {
    delete migrated.dictionary['footer.note']
    for (const [key, translation] of Object.entries(dictionary)) {
      if (!(key in migrated.dictionary)) migrated.dictionary[key] = structuredClone(translation)
    }
  }
  if (Array.isArray(migrated.galleryItems)) {
    migrated.galleryItems = migrated.galleryItems.map((item) =>
      isRecord(item) && !('imageUrl' in item) ? { ...item, imageUrl: '' } : item,
    )
  }
  if (isRecord(migrated.why) && Array.isArray(migrated.why.items)) {
    const firstItem = migrated.why.items[0]
    if (isRecord(firstItem) && isRecord(firstItem.title) && firstItem.title.en === 'Fully Air-Conditioned School') {
      firstItem.title = structuredClone(data.why.items[0].title)
      if (
        isRecord(firstItem.body) &&
        firstItem.body.en === 'A comfortable learning environment throughout the school day, in every classroom.'
      ) {
        firstItem.body = structuredClone(data.why.items[0].body)
      }
    }
  }
  if (isRecord(migrated.hero) && isRecord(migrated.hero.badge)) {
    if (
      migrated.hero.badge.en === "Baghpat's Only Fully AC School" ||
      migrated.hero.badge.en === 'Fully Air-Conditioned Classrooms' ||
      migrated.hero.badge.en === 'Fully AC Classrooms'
    ) {
      migrated.hero.badge = structuredClone(data.hero.badge)
    }
    if (Array.isArray(migrated.hero.meta)) {
      const lastMeta = migrated.hero.meta[migrated.hero.meta.length - 1]
      if (
        isRecord(lastMeta) &&
        (lastMeta.en === 'Fully air-conditioned' ||
          lastMeta.en === 'Fully AC school-owned transport')
      ) {
        migrated.hero.meta[migrated.hero.meta.length - 1] = structuredClone(data.hero.meta[2])
      }
    }
  }
  if (
    isRecord(migrated.dictionary) &&
    isRecord(migrated.dictionary['hero.fullyAcTransportation']) &&
    migrated.dictionary['hero.fullyAcTransportation'].en === 'Fully AC Transportation'
  ) {
    migrated.dictionary['hero.fullyAcTransportation'] = structuredClone(
      dictionary['hero.fullyAcTransportation'],
    )
  }
  if (isRecord(migrated.acFeature) && isRecord(migrated.acFeature.titleA)) {
    if (migrated.acFeature.titleA.en === "Baghpat's only fully") {
      migrated.acFeature.titleA = structuredClone(data.acFeature.titleA)
      migrated.acFeature.titleB = structuredClone(data.acFeature.titleB)
    }
  }
  if (isRecord(migrated.seo) && isRecord(migrated.seo['/']) && isRecord(migrated.seo['/'].description)) {
    if (migrated.seo['/'].description.hi === 'रॉयल पब्लिक स्कूल, ततिरी, बागपत — बागपत का एकमात्र पूर्ण वातानुकूलित विद्यालय। आरामदायक, विद्यार्थी-केंद्रित अधिगम वातावरण। प्रवेश पूछताछ: +91 99973 20389।') {
      migrated.seo['/'].description.hi = data.seo['/'].description.hi
    }
  }
  if (isRecord(migrated.dictionary) && isRecord(migrated.dictionary['footer.tagline'])) {
    if (
      migrated.dictionary['footer.tagline'].en === "Baghpat's Only Fully AC School" ||
      migrated.dictionary['footer.tagline'].en === 'Fully Air-Conditioned School'
    ) {
      migrated.dictionary['footer.tagline'] = structuredClone(dictionary['footer.tagline'])
    }
  }
  return migrated
}

function shapeError(template: unknown, value: unknown, path: string): string | null {
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) return `${path} must be an array.`
    if (template.length === 0) return null

    for (let index = 0; index < value.length; index += 1) {
      const item = value[index]
      const errors = template
        .map((sample) => shapeError(sample, item, `${path}[${index}]`))
        .filter((error): error is string => error !== null)
      if (errors.length === template.length) return errors[0]
    }
    return null
  }

  if (isRecord(template)) {
    if (!isRecord(value)) return `${path} must be an object.`
    const unexpectedKey = Object.keys(value).find((key) => !(key in template))
    if (unexpectedKey) return `${path}.${unexpectedKey} is not an editable field.`
    const missingKey = Object.keys(template).find((key) => !(key in value))
    if (missingKey) return `${path}.${missingKey} is required.`
    for (const [key, childTemplate] of Object.entries(template)) {
      const error = shapeError(childTemplate, value[key], `${path}.${key}`)
      if (error) return error
    }
    return null
  }

  if (typeof template !== typeof value) return `${path} has an unexpected value type.`
  if (typeof value === 'string' && value.length > 20000) return `${path} is too long.`
  return null
}

function safeValueError(value: unknown, path = 'content'): string | null {
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const error = safeValueError(value[index], `${path}[${index}]`)
      if (error) return error
    }
    return null
  }
  if (!isRecord(value)) return null

  for (const [key, child] of Object.entries(value)) {
    if (typeof child === 'string') {
      const normalizedKey = key.toLowerCase()
      if (normalizedKey === 'to' && (!child.startsWith('/') || child.startsWith('//'))) {
        return `${path}.${key} must be a same-site path.`
      }
      if (normalizedKey === 'phonehref' && !child.startsWith('tel:')) {
        return `${path}.${key} must use a telephone link.`
      }
      if (
        ['url', 'mapsurl', 'mapsembed', 'facebookurl', 'googlereviewsurl'].includes(normalizedKey) &&
        child !== '' &&
        !child.startsWith('https://')
      ) {
        return `${path}.${key} must be an HTTPS URL.`
      }
      if (
        ['imageurl', 'photourl'].includes(normalizedKey) &&
        child !== '' &&
        !child.startsWith('https://') &&
        !/^\/(?:media\/[0-9a-f-]{36}\.(?:jpg|png|webp)|images\/[A-Za-z0-9._/-]+)$/.test(child)
      ) {
        return `${path}.${key} must be an uploaded image or HTTPS URL.`
      }
      if (['image', 'avatar'].includes(normalizedKey)) {
        const safeImagePath =
          child.startsWith('/images/') ||
          /^[A-Za-z0-9._/-]+$/.test(child) && !child.includes('..')
        if (!safeImagePath && !child.startsWith('https://')) {
          return `${path}.${key} must be a safe image path or HTTPS URL.`
        }
      }
    } else {
      const error = safeValueError(child, `${path}.${key}`)
      if (error) return error
    }
  }
  return null
}

export function validateSiteContent(value: unknown): string | null {
  const shapeIssue = shapeError(defaultContent, value, 'content')
  if (shapeIssue) return shapeIssue
  return safeValueError(value)
}

export function createDefaultContentSnapshot(): SiteContent {
  return structuredClone(defaultContent)
}

export function createContentSnapshot(): SiteContent {
  return structuredClone(mutableContent)
}

function synchronizeValue(target: unknown, source: unknown): unknown {
  if (Array.isArray(target) && Array.isArray(source)) {
    target.splice(0, target.length, ...source.map((item) => structuredClone(item)))
    return target
  }
  if (isRecord(target) && isRecord(source)) {
    for (const key of Object.keys(target)) {
      if (!(key in source)) delete target[key]
    }
    for (const [key, value] of Object.entries(source)) {
      target[key] = synchronizeValue(target[key], value)
    }
    return target
  }
  return structuredClone(source)
}

export function applySiteContent(value: unknown) {
  const error = validateSiteContent(value)
  if (error) throw new Error(error)
  synchronizeValue(mutableContent, value)
}
