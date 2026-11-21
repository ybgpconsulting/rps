import { Link } from 'react-router-dom'
import { school } from '../data'
import { useLanguage } from '../i18n'
import { cn } from '../lib/cn'

export function Crest({ className = 'h-11 w-11' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <path
        d="M32 3 57 11v22c0 14-11 24-25 28C18 57 7 47 7 33V11z"
        fill="#142D59"
        stroke="#D6AD55"
        strokeWidth="2.2"
      />
      <path
        d="M32 9.5 51.5 15.6V33c0 10.8-8.1 19.2-19.5 23C20.6 52.2 12.5 43.8 12.5 33V15.6z"
        fill="none"
        stroke="#D6AD55"
        strokeWidth="0.9"
        opacity="0.55"
      />
      <text
        x="32"
        y="41.5"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="25"
        fill="#D6AD55"
      >
        R
      </text>
      <circle cx="32" cy="16.5" r="1.5" fill="#D6AD55" />
    </svg>
  )
}

export function Brand({
  tone = 'dark',
  className,
}: {
  tone?: 'dark' | 'light'
  className?: string
}) {
  const { tl } = useLanguage()
  return (
    <Link
      to="/"
      aria-label={`${school.name.en} — Home`}
      className={cn('group flex items-center gap-3', className)}
    >
      <Crest className="h-10 w-10 shrink-0 transition-transform duration-500 group-hover:-rotate-3 sm:h-11 sm:w-11" />
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            'whitespace-nowrap font-display text-[15px] font-semibold tracking-[0.005em] sm:text-[18px]',
            tone === 'dark' ? 'text-royal' : 'text-white',
          )}
        >
          {tl(school.name)}
        </span>
        <span
          className={cn(
            'mt-1.5 text-[8px] font-semibold uppercase tracking-[0.26em] sm:text-[8.5px]',
            tone === 'dark' ? 'text-gold-deep' : 'text-gold',
          )}
        >
          Tatiri · Baghpat
        </span>
      </span>
    </Link>
  )
}
