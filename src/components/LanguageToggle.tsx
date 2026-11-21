import type { Lang } from '../i18n'
import { useLanguage } from '../i18n'
import { cn } from '../lib/cn'

const LANGS: { id: Lang; short: string; label: string }[] = [
  { id: 'en', short: 'EN', label: 'English' },
  { id: 'hi', short: 'हिं', label: 'हिंदी' },
]

export function LanguageToggle({
  tone = 'dark',
  className,
}: {
  tone?: 'light' | 'dark'
  className?: string
}) {
  const { lang, setLang, t } = useLanguage()

  return (
    <div
      role="group"
      aria-label={t('a11y.toggleLanguage')}
      className={cn(
        'relative grid grid-cols-2 rounded-full border p-[3px] transition-colors',
        tone === 'dark' ? 'border-royal/15 bg-royal/[0.04]' : 'border-white/25 bg-white/10',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-y-[3px] left-[3px] w-[calc(50%-3px)] rounded-full bg-gold shadow-[0_2px_10px_rgba(214,173,85,0.45)] transition-transform duration-300 ease-out',
          lang === 'hi' && 'translate-x-full',
        )}
      />
      {LANGS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setLang(item.id)}
          aria-pressed={lang === item.id}
          aria-label={item.label}
          className={cn(
            'relative z-10 rounded-full px-2.5 py-[5px] text-[10.5px] font-bold uppercase tracking-[0.14em] transition-colors duration-300',
            lang === item.id
              ? 'text-royal-deep'
              : tone === 'dark'
                ? 'text-royal/55 hover:text-royal'
                : 'text-white/65 hover:text-white',
          )}
        >
          {item.short}
        </button>
      ))}
    </div>
  )
}
