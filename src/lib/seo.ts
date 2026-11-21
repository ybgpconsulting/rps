import { useEffect } from 'react'
import { SITE_URL, seo, type SeoPath } from '../data'
import { useLanguage } from '../i18n'

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export function useNotFoundSeo() {
  const { lang } = useLanguage()

  useEffect(() => {
    document.title =
      lang === 'hi' ? 'पृष्ठ नहीं मिला | रॉयल पब्लिक स्कूल' : 'Page Not Found | Royal Public School'
    setMeta(
      'name',
      'description',
      lang === 'hi'
        ? 'यह पृष्ठ नहीं मिला। रॉयल पब्लिक स्कूल, ततिरी, बागपत के होम पेज पर लौटें।'
        : 'This page could not be found. Return to the Royal Public School, Tatiri, Baghpat homepage.',
    )
    setMeta('name', 'robots', 'noindex, follow')
    document.head.querySelector('link[rel="canonical"]')?.remove()

    return () => setMeta('name', 'robots', 'index, follow')
  }, [lang])
}

export function usePageSeo(path: SeoPath) {
  const { lang } = useLanguage()

  useEffect(() => {
    const entry = seo[path]
    const title = entry.title[lang]
    const description = entry.description[lang]
    const url = `${SITE_URL}${path === '/' ? '/' : path}`
    const image = `${SITE_URL}/images/og-royal-public-school.jpg`

    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', image)
    setMeta('property', 'og:locale', lang === 'hi' ? 'hi_IN' : 'en_IN')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', image)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [path, lang])
}
