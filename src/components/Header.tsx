import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { instagram, navItems, school } from '../data'
import { useLanguage } from '../i18n'
import { cn } from '../lib/cn'
import { useEscapeKey, useLockBodyScroll, useScrolled } from '../lib/hooks'
import { Brand, Crest } from './Brand'
import { Icon } from './Icon'
import { LanguageToggle } from './LanguageToggle'
import { listPublicUpdates } from '../lib/updates'
import type { SchoolUpdate } from '../lib/updates-model'

function LiveAnnouncement() {
  const { lang } = useLanguage()
  const [announcement, setAnnouncement] = useState<SchoolUpdate | null>(null)

  useEffect(() => {
    let active = true
    void listPublicUpdates({ pinnedOnly: true, limit: 1 }).then(
      async (pinned) => {
        if (!active) return
        if (pinned.updates[0]) {
          setAnnouncement(pinned.updates[0])
          return
        }
        const latest = await listPublicUpdates({ limit: 1 })
        if (active) setAnnouncement(latest.updates[0] ?? null)
      },
      () => {
        if (active) setAnnouncement(null)
      },
    )
    return () => {
      active = false
    }
  }, [])

  if (!announcement) return null

  return (
    <Link
      to={`/updates/${announcement.slug}`}
      className="flex min-h-[68px] w-full items-center justify-center bg-[#f8b62d] px-3 py-3 text-[#10264a] shadow-[0_3px_16px_rgba(10,27,51,0.18)] sm:min-h-[64px] sm:px-5"
      aria-label={`${lang === 'hi' ? 'जीवित घोषणा' : 'Live announcement'}: ${announcement.title}`}
    >
      <span className="flex w-full items-center justify-center gap-3 text-left sm:gap-4 sm:text-center">
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10264a] text-white">
          <span className="absolute h-8 w-8 animate-ping rounded-full border border-[#10264a]/40" aria-hidden="true" />
          <Icon name="message" className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[#10264a]/70">
            {lang === 'hi' ? 'लाइव घोषणा' : 'Live Announcement'}
          </span>
          <span className="mt-0.5 block text-[13.5px] font-bold leading-snug sm:text-[16px]">
            {announcement.title}
          </span>
        </span>
        <span className="hidden items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] sm:flex">
          {lang === 'hi' ? 'पूरा पढ़ें' : 'Read now'}
          <Icon name="arrowRight" className="h-4 w-4" />
        </span>
      </span>
    </Link>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, tl } = useLanguage()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useLockBodyScroll(open)
  useEscapeKey(onClose, open)

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const timer = window.setTimeout(() => closeRef.current?.focus(), 80)
    return () => {
      window.clearTimeout(timer)
      opener?.focus?.()
    }
  }, [open])

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    )
    if (!focusables?.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.menu')}
          onKeyDown={onKeyDown}
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="noise fixed inset-0 z-[90] flex flex-col overflow-y-auto overflow-x-hidden bg-royal-deep text-white xl:hidden"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-25" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full border border-dashed border-gold/20"
          />

          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <Crest className="h-9 w-9" />
              <span className="font-display text-[16px]">{tl(school.name)}</span>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t('a11y.closeMenu')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-gold hover:text-gold"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label="Mobile" className="relative flex-1 px-5 py-6 sm:px-8">
            <ul className="flex flex-col">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.04, duration: 0.4 }}
                  className="border-b border-white/10"
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between py-3.5 font-display text-[26px] transition-colors sm:text-[30px]',
                        isActive ? 'text-gold' : 'text-white hover:text-gold-light',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span>{t(item.key)}</span>
                        <span className="flex items-center gap-3">
                          <span className="text-[10px] font-sans tracking-[0.2em] text-white/25">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          {isActive ? (
                            <Icon name="star" className="h-4 w-4 text-gold" />
                          ) : (
                            <Icon name="arrowUpRight" className="h-4 w-4 text-white/30" />
                          )}
                        </span>
                      </>
                    )}
                  </NavLink>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <NavLink
                  to="/vision-mission"
                  onClick={onClose}
                  className="flex items-center justify-between py-3.5 font-display text-[26px] text-white/70 transition-colors hover:text-gold-light sm:text-[30px]"
                >
                  {t('nav.vision')}
                  <Icon name="arrowUpRight" className="h-4 w-4 text-white/30" />
                </NavLink>
              </motion.li>
            </ul>

            <div className="mt-8 flex flex-col gap-4">
              <Link to="/admissions" onClick={onClose} className="btn-gold w-full">
                {t('common.enquireNow')}
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <a href={school.phoneHref} className="btn-outline-light w-full">
                <Icon name="phone" className="h-4 w-4" />
                {school.phoneDisplay}
              </a>
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('a11y.instagram')}
                className="inline-flex items-center justify-center gap-2.5 py-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/45 transition-colors hover:text-gold"
              >
                <img
                  src={instagram.avatar}
                  alt=""
                  width={28}
                  height={28}
                  loading="lazy"
                  decoding="async"
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-white/20"
                />
                {instagram.handle}
                <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
              </a>
            </div>
          </nav>

          <div className="relative border-t border-white/10 px-5 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <p className="max-w-[220px] text-[11px] leading-relaxed text-white/45">
                {tl(school.address)}
              </p>
              <LanguageToggle tone="light" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Header() {
  const { t } = useLanguage()
  const scrolled = useScrolled(8)
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [lastPath, setLastPath] = useState(location.pathname)

  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50">
        <LiveAnnouncement />

        <div
          className={cn(
            'border-b bg-cream/90 backdrop-blur-xl transition-shadow duration-300',
            scrolled ? 'border-royal/10 shadow-[0_14px_40px_-24px_rgba(10,27,51,0.45)]' : 'border-royal/5',
          )}
        >
          <div className="flex h-[64px] w-full items-center justify-between gap-3 px-3 sm:px-5 lg:h-[76px] lg:px-6">
            <Brand className="shrink-0" />

            <nav aria-label="Main" className="hidden items-center 2xl:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative whitespace-nowrap rounded-full px-2.5 py-2 text-[10.5px] font-semibold uppercase tracking-[0.07em] transition-colors',
                      isActive ? 'text-royal' : 'text-ink/55 hover:text-royal',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {t(item.key)}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute -bottom-0.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gold transition-all duration-300',
                          isActive ? 'w-5 opacity-100' : 'w-0 opacity-0',
                        )}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <LanguageToggle className="hidden sm:flex" />
              <Link
                to="/admissions"
                className="btn-gold hidden !px-5 !py-3 !text-[10.5px] lg:inline-flex xl:ml-1"
              >
                {t('nav.enquire')}
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={t('a11y.openMenu')}
                aria-expanded={menuOpen}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-royal/15 text-royal transition hover:border-gold hover:text-gold-deep 2xl:hidden"
              >
                <Icon name="menu" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
