import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { school } from '../data'
import { useLanguage } from '../i18n'
import { usePrefersReducedMotion } from '../lib/hooks'
import { Crest } from './Brand'
import { LanguageToggle } from './LanguageToggle'

const PRELOAD_IMAGES = [
  '/images/hero-campus-1600.webp',
  '/images/hero-campus-1000.webp',
  '/images/class-group-1000.webp',
  '/images/school-building-1000.webp',
]

export function Preloader({ onDone }: { onDone: () => void }) {
  const { t, tl } = useLanguage()
  const reduced = usePrefersReducedMotion()
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const readyRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    const minimumTime = new Promise<void>((resolve) => window.setTimeout(resolve, 1200))
    const images = PRELOAD_IMAGES.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new Image()
          image.onload = () => resolve()
          image.onerror = () => resolve()
          image.src = src
        }),
    )
    const fonts = document.fonts?.ready ?? Promise.resolve()

    Promise.all([...images, fonts, minimumTime]).then(() => {
      if (!cancelled) readyRef.current = true
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) return 100
        const ceiling = readyRef.current ? 100 : 86
        const step = readyRef.current
          ? Math.max(1.8, (100 - current) * 0.18)
          : Math.max(0.2, (86 - current) * 0.045)
        return Math.min(ceiling, current + step)
      })
    }, 55)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress < 100) return
    const reveal = window.setTimeout(() => setExiting(true), 350)
    const finish = window.setTimeout(onDone, 1100)
    return () => {
      window.clearTimeout(reveal)
      window.clearTimeout(finish)
    }
  }, [progress, onDone])

  const percentage = Math.min(100, Math.round(progress))

  return (
    <motion.div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
      aria-label={t('loader.preparing')}
      className="noise fixed inset-0 z-[100] flex flex-col overflow-hidden bg-royal-deep text-white"
      initial={false}
      animate={exiting ? { y: '-100%' } : { y: '0%' }}
      transition={{ duration: reduced ? 0.01 : 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,173,85,0.16),transparent_65%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gold/60" />

      <motion.div
        className="relative flex h-full flex-col px-5 py-6 sm:px-8 sm:py-8"
        animate={exiting ? { opacity: 0, y: -18 } : { opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0.01 : 0.5 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Crest className="h-10 w-10" />
            <div className="leading-none">
              <p className="font-display text-[15px] text-white">{tl(school.name)}</p>
              <p className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.26em] text-gold">
                Tatiri · Baghpat
              </p>
            </div>
          </div>
          <LanguageToggle tone="light" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative mb-10 flex h-28 w-28 items-center justify-center">
            <span className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-gold/35" />
            <span className="absolute -inset-4 rounded-full border border-gold/10" />
            <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_18px_rgba(214,173,85,0.9)]" />
            <Crest className="h-16 w-16" />
          </div>

          <div className="flex items-start leading-none">
            <span className="font-display text-[clamp(4.5rem,16vw,8.5rem)] font-normal tabular-nums text-white">
              {percentage}
            </span>
            <span className="mt-3 font-display text-2xl text-gold sm:mt-5 sm:text-3xl">%</span>
          </div>

          <p className="mt-5 text-[10.5px] font-semibold uppercase tracking-mega text-white/45">
            {percentage >= 100 ? t('loader.welcome') : t('loader.preparing')}
          </p>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="h-px w-full overflow-hidden bg-white/12">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-deep via-gold to-gold-light"
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.25, ease: 'linear' }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.24em] text-white/35">
            <span>{tl(school.locality)}</span>
            <span className="text-gold/70">{tl(school.curriculum)}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
