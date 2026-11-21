import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { AdmissionsCta } from '../components/AdmissionsCta'
import { Icon } from '../components/Icon'
import { Page } from '../components/Page'
import { UPDATE_CATEGORIES, UPDATE_CATEGORY_LABELS, type SchoolUpdate, type UpdateCategory } from '../lib/updates-model'
import { getPublicUpdate, listPublicUpdates } from '../lib/updates'
import { useLanguage } from '../i18n'
import { SITE_URL } from '../data'
import { usePageSeo } from '../lib/seo'

const indianDate = (value: string | null, lang: 'en' | 'hi', includeTime = false) => {
  if (!value) return ''
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return ''
  return new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(includeTime ? { hour: 'numeric', minute: '2-digit', hour12: true } : {}),
  }).format(date)
}

function categoryName(category: UpdateCategory, lang: 'en' | 'hi') {
  return UPDATE_CATEGORY_LABELS[category][lang]
}

function meta(name: string, value: string) {
  let node = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!node) {
    node = document.createElement('meta')
    node.name = name
    document.head.appendChild(node)
  }
  node.content = value
}

function UpdateCard({ update, lang }: { update: SchoolUpdate; lang: 'en' | 'hi' }) {
  const isHoliday = update.category === 'holiday'
  return (
    <article className={`rounded-2xl border bg-white p-5 shadow-sm ${isHoliday ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isHoliday ? 'bg-amber-100 text-amber-950' : 'bg-blue-50 text-blue-900'}`}>
          {categoryName(update.category, lang)}
        </span>
        {update.pinned && <span className="rounded-full bg-royal/10 px-3 py-1 text-xs font-semibold text-royal">Important</span>}
        <time className="text-xs text-slate-500" dateTime={update.publishedAt}>
          {indianDate(update.publishedAt, lang)}
        </time>
      </div>
      <h2 className="mt-4 text-xl font-bold leading-snug text-[#10264a]">
        <Link to={`/updates/${update.slug}`} className="rounded-sm hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
          {update.title}
        </Link>
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{update.summary}</p>
      {isHoliday && update.effectiveAt && (
        <div className="mt-3 space-y-1 text-sm font-semibold text-amber-950">
          <p>Holiday date: {indianDate(update.effectiveAt, lang)}</p>
          {typeof update.schoolClosed === 'boolean' && <p>School status: {update.schoolClosed ? 'Closed' : 'Open'}</p>}
          {update.reopeningAt && <p>School reopens: {indianDate(update.reopeningAt, lang)}</p>}
        </div>
      )}
      <Link to={`/updates/${update.slug}`} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#10264a] px-4 text-sm font-semibold text-white hover:bg-[#183866]">
        Read more <Icon name="arrowRight" className="h-4 w-4" />
      </Link>
    </article>
  )
}

function UpdatesIndex() {
  usePageSeo('/updates')
  const { lang } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const category = UPDATE_CATEGORIES.find((item) => item === categoryParam) ?? null
  const archive = searchParams.get('archive') === '1'
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [query, setQuery] = useState(search)
  const [updates, setUpdates] = useState<SchoolUpdate[]>([])
  const [total, setTotal] = useState(0)
  const [loadedKey, setLoadedKey] = useState('')
  const [loadingMoreKey, setLoadingMoreKey] = useState('')
  const [error, setError] = useState('')
  const requestId = useRef(0)
  const pageSize = 8
  const queryKey = JSON.stringify([category, archive, query])
  const loading = loadedKey !== queryKey
  const loadingMore = loadingMoreKey === queryKey

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), 250)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const runId = ++requestId.current
    void listPublicUpdates({ category: category ?? '', archive, search: query, limit: pageSize, offset: 0 }).then(
      (result) => {
        if (runId !== requestId.current) return
        setUpdates(result.updates)
        setTotal(result.total)
        setError('')
        setLoadedKey(queryKey)
      },
      (reason: unknown) => {
        if (runId === requestId.current) {
          setError(reason instanceof Error ? reason.message : 'School updates could not be loaded.')
          setLoadedKey(queryKey)
        }
      },
    )
  }, [category, archive, query, queryKey])

  function setFilter(nextCategory: string, nextArchive = archive) {
    const next = new URLSearchParams(searchParams)
    if (nextCategory) next.set('category', nextCategory)
    else next.delete('category')
    if (nextArchive) next.set('archive', '1')
    else next.delete('archive')
    setSearchParams(next, { replace: true })
  }

  async function loadMore() {
    const requestAtStart = requestId.current
    const loadKey = queryKey
    setLoadingMoreKey(loadKey)
    setError('')
    try {
      const result = await listPublicUpdates({
        category: category ?? '',
        archive,
        search: query,
        limit: pageSize,
        offset: updates.length,
      })
      if (requestAtStart === requestId.current) {
        setUpdates((current) => [...current, ...result.updates])
        setTotal(result.total)
      }
    } catch (reason) {
      if (requestAtStart === requestId.current) {
        setError(reason instanceof Error ? reason.message : 'More school updates could not be loaded.')
      }
    } finally {
      if (requestAtStart === requestId.current) setLoadingMoreKey('')
    }
  }

  return (
    <Page>
      <section className="border-b border-slate-200 bg-[#f7f9fc] py-10 sm:py-14">
        <div className="container-x">
          <Link to="/" className="text-sm font-medium text-[#274a78] hover:underline">Home</Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#10264a] sm:text-4xl">
            {lang === 'hi' ? 'स्कूल समाचार और सूचनाएँ' : 'School updates'}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            {lang === 'hi'
              ? 'छुट्टियों, स्कूल सूचनाओं, परीक्षाओं और कार्यक्रमों की नवीनतम जानकारी यहाँ देखें।'
              : 'Check the latest school holidays, notices, exam information and events here.'}
          </p>
        </div>
      </section>

      <section className="container-x py-8 sm:py-10">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px]">
          <label className="block text-sm font-semibold text-slate-700">
            Search school updates
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search holidays, exams, events…"
              className="mt-1.5 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Category
            <select
              value={category ?? ''}
              onChange={(event) => setFilter(event.target.value)}
              className="mt-1.5 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All updates</option>
              {UPDATE_CATEGORIES.map((item) => <option key={item} value={item}>{categoryName(item, lang)}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setFilter(category ?? '', !archive)}
            aria-pressed={archive}
            className="min-h-10 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {archive ? 'View current announcements' : 'View older announcements'}
          </button>
          <p aria-live="polite" className="text-sm text-slate-500">
            {loading ? 'Loading updates…' : `${total} ${archive ? 'archived' : 'current'} announcement${total === 1 ? '' : 's'}`}
          </p>
        </div>

        {!loading && error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        {!loading && !error && updates.length === 0 && (
          <p className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-slate-600">
            {archive ? 'There are no older announcements in this archive.' : 'There are no current announcements.'}
          </p>
        )}
        {!loading && updates.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {updates.map((update) => <UpdateCard key={update.id} update={update} lang={lang} />)}
          </div>
        )}
        {updates.length < total && (
          <div className="mt-7 text-center">
            <button type="button" onClick={() => void loadMore()} disabled={loadingMore || loading} className="min-h-12 rounded-full border border-[#10264a] px-6 text-sm font-semibold text-[#10264a] hover:bg-blue-50 disabled:opacity-50">
              {loadingMore ? 'Loading…' : 'Load more updates'}
            </button>
          </div>
        )}
      </section>
      <AdmissionsCta />
    </Page>
  )
}

function UpdateDetail({ slug }: { slug: string }) {
  const { lang } = useLanguage()
  const [result, setResult] = useState<{ slug: string; update: SchoolUpdate | null; error: string } | null>(null)

  useEffect(() => {
    let active = true
    void getPublicUpdate(slug).then(
      (update) => { if (active) setResult({ slug, update, error: '' }) },
      (reason: unknown) => {
        if (active) setResult({
          slug,
          update: null,
          error: reason instanceof Error ? reason.message : 'This announcement is not available.',
        })
      },
    )
    return () => { active = false }
  }, [slug])
  const currentResult = result?.slug === slug ? result : null
  const update = currentResult?.update ?? null
  const error = currentResult?.error ?? ''

  useEffect(() => {
    if (!update) return
    const canonicalUrl = `${SITE_URL}/updates/${update.slug}`
    document.title = `${update.title} | Royal Public School`
    meta('description', update.summary.slice(0, 300))
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    const structuredData = document.createElement('script')
    structuredData.type = 'application/ld+json'
    structuredData.dataset.schoolUpdate = 'true'
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: update.title,
      description: update.summary,
      datePublished: update.publishedAt,
      dateModified: update.updatedAt,
      mainEntityOfPage: canonicalUrl,
      publisher: { '@type': 'Organization', name: 'Royal Public School', url: SITE_URL },
    })
    document.head.querySelector('script[data-school-update]')?.remove()
    document.head.appendChild(structuredData)
    return () => { structuredData.remove() }
  }, [update])

  if (error) {
    return (
      <Page>
        <section className="container-x py-16">
          <h1 className="text-2xl font-bold text-[#10264a]">Announcement not available</h1>
          <p className="mt-3 text-slate-600">{error}</p>
          <Link to="/updates" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#10264a] px-5 text-sm font-semibold text-white">View school updates</Link>
        </section>
      </Page>
    )
  }
  if (!update) {
    return <p role="status" className="container-x py-16 text-slate-600">Loading announcement…</p>
  }

  const holiday = update.category === 'holiday'
  const shareUrl = typeof window === 'undefined' ? `${SITE_URL}/updates/${update.slug}` : window.location.href
  const shareText = encodeURIComponent(`${update.title}\n${shareUrl}`)
  const whatsappUrl = `https://wa.me/?text=${shareText}`

  return (
    <Page>
      <article className="container-x max-w-4xl py-8 sm:py-12">
        <Link to="/updates" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#274a78] hover:underline">
          <Icon name="chevronLeft" className="h-4 w-4" /> All school updates
        </Link>
        <header className="mt-6 border-b border-slate-200 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${holiday ? 'bg-amber-100 text-amber-950' : 'bg-blue-50 text-blue-900'}`}>
              {categoryName(update.category, lang)}
            </span>
            {update.pinned && <span className="rounded-full bg-royal/10 px-3 py-1 text-xs font-semibold text-royal">Important notice</span>}
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#10264a] sm:text-4xl">{update.title}</h1>
          <p className="mt-4 text-lg leading-7 text-slate-600">{update.summary}</p>
          <p className="mt-4 text-sm text-slate-500">
            Published <time dateTime={update.publishedAt}>{indianDate(update.publishedAt, lang, true)} IST</time>
          </p>
        </header>

        {holiday && (
          <section aria-label="Holiday details" className="mt-6 space-y-3 rounded-2xl border border-amber-300 bg-amber-50 p-5">
            <h2 className="text-lg font-bold text-amber-950">Holiday information</h2>
            {update.effectiveAt && <p className="text-sm text-amber-950"><strong>Holiday date:</strong> {indianDate(update.effectiveAt, lang, true)} IST</p>}
            <p className="text-sm text-amber-950"><strong>School status:</strong> {update.schoolClosed === false ? 'School will be open.' : 'School will remain closed.'}</p>
            {update.reopeningAt && <p className="text-sm text-amber-950"><strong>School reopens:</strong> {indianDate(update.reopeningAt, lang, true)} IST</p>}
          </section>
        )}

        {update.effectiveAt && !holiday && (
          <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <strong>Event / effective date:</strong> {indianDate(update.effectiveAt, lang, true)} IST
          </p>
        )}
        <section className="mt-7">
          <h2 className="text-lg font-bold text-[#10264a]">{holiday ? 'Additional instructions' : 'Details'}</h2>
          <div className="mt-2 whitespace-pre-line text-base leading-8 text-slate-800">{update.body}</div>
        </section>

        {update.attachments.length > 0 && (
          <section className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-[#10264a]">Attachments</h2>
            <ul className="mt-3 space-y-3">
              {update.attachments.map((attachment) => (
                <li key={attachment.url}>
                  {attachment.type.startsWith('image/') ? (
                    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="block max-w-xl">
                      <img src={attachment.url} alt={attachment.name} className="max-h-[28rem] rounded-xl border border-slate-200 object-contain" />
                      <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#274a78] underline">
                        {attachment.name} <Icon name="arrowUpRight" className="h-4 w-4" />
                      </span>
                    </a>
                  ) : (
                    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#274a78] hover:bg-blue-50">
                      <Icon name="book" className="h-5 w-5" /> Open PDF: {attachment.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#128c4a] px-5 text-sm font-semibold text-white hover:bg-[#0d713b]">
            <Icon name="whatsapp" className="h-4 w-4" /> Share on WhatsApp
          </a>
          <Link to="/updates" className="inline-flex min-h-11 items-center rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            More updates
          </Link>
        </div>
      </article>
    </Page>
  )
}

export default function Updates() {
  const { slug } = useParams()
  return slug ? <UpdateDetail slug={slug} /> : <UpdatesIndex />
}
