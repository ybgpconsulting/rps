import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { galleryCopy, galleryItems, type GalleryCategory } from '../data'
import { useLanguage } from '../i18n'
import { cn } from '../lib/cn'
import { useEscapeKey, useLockBodyScroll } from '../lib/hooks'
import { Icon } from './Icon'
import { SmartImage } from './SmartImage'

type Filter = 'all' | GalleryCategory

export function GalleryGrid({ limit }: { limit?: number }) {
  const { t, tl } = useLanguage()
  const [filter, setFilter] = useState<Filter>('all')
  const [active, setActive] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const items = useMemo(() => {
    const filtered =
      filter === 'all' ? galleryItems : galleryItems.filter((item) => item.category === filter)
    return limit ? filtered.slice(0, limit) : filtered
  }, [filter, limit])

  const close = () => setActive(null)
  useLockBodyScroll(active !== null)
  useEscapeKey(close, active !== null)

  useEffect(() => {
    if (active !== null) closeRef.current?.focus()
  }, [active])

  useEffect(() => {
    if (active === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setActive((current) => (current === null ? 0 : (current + 1) % items.length))
      }
      if (event.key === 'ArrowLeft') {
        setActive((current) =>
          current === null ? 0 : (current - 1 + items.length) % items.length,
        )
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, items.length])

  const current = active !== null ? items[active] : null

  return (
    <div>
      {!limit && (
        <div className="mb-10 flex flex-wrap items-center gap-2" role="group" aria-label="Gallery filters">
          {galleryCopy.categories.map((category) => {
            const isActive = filter === category.id
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setFilter(category.id)}
                aria-pressed={isActive}
                className={cn(
                  'rounded-full border px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.13em] transition-all duration-300',
                  isActive
                    ? 'border-royal bg-royal text-white shadow-soft'
                    : 'border-royal/12 bg-white/60 text-royal/60 hover:border-gold hover:text-royal',
                )}
              >
                {tl(category.label)}
              </button>
            )
          })}
        </div>
      )}

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((item, index) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`${t('gallery.open')}: ${tl(item.title)}`}
            className="group relative block w-full break-inside-avoid overflow-hidden rounded-[20px] bg-royal-mist text-left focus-visible:outline-offset-4"
          >
            <div className={cn('relative w-full', item.tall ? 'aspect-[3/4]' : 'aspect-[4/3]')}>
              <SmartImage
                name={item.name}
                alt={tl(item.alt)}
                imageUrl={item.imageUrl}
                imgClassName="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/80 via-royal-deep/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
              <span className="absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full border border-white/30 bg-royal-deep/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold">
                  {tl(
                    galleryCopy.categories.find((category) => category.id === item.category)!.label,
                  )}
                </span>
                <p className="mt-1 font-display text-[17px] leading-tight text-white">
                  {tl(item.title)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={tl(current.title)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[95] flex flex-col bg-royal-ink/95 backdrop-blur-md"
            onClick={close}
          >
            <div className="flex items-center justify-between px-5 py-4 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                {active !== null ? String(active + 1).padStart(2, '0') : '00'} /{' '}
                {String(items.length).padStart(2, '0')}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label={t('gallery.close')}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-gold hover:text-gold"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div
              className="relative flex flex-1 items-center justify-center px-4 pb-2"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label={t('gallery.previous')}
                onClick={() =>
                  setActive((value) =>
                    value === null ? 0 : (value - 1 + items.length) % items.length,
                  )
                }
                className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-royal-deep/50 text-white transition hover:border-gold hover:text-gold sm:left-6"
              >
                <Icon name="chevronLeft" className="h-5 w-5" />
              </button>

              <motion.figure
                key={current.name}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="max-h-full"
              >
                <img
                  src={current.imageUrl || `/images/${current.name}-1600.webp`}
                  srcSet={
                    current.imageUrl
                      ? undefined
                      : `/images/${current.name}-1000.webp 1000w, /images/${current.name}-1600.webp 1600w`
                  }
                  sizes={current.imageUrl ? undefined : '(max-width: 1024px) 100vw, 1100px'}
                  alt={tl(current.alt)}
                  className="mx-auto max-h-[72svh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                />
                <figcaption className="mx-auto mt-4 max-w-2xl text-center">
                  <p className="font-display text-lg text-white">{tl(current.title)}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/35">
                    {t('common.representative')}
                  </p>
                </figcaption>
              </motion.figure>

              <button
                type="button"
                aria-label={t('gallery.next')}
                onClick={() =>
                  setActive((value) => (value === null ? 0 : (value + 1) % items.length))
                }
                className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-royal-deep/50 text-white transition hover:border-gold hover:text-gold sm:right-6"
              >
                <Icon name="chevronRight" className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
