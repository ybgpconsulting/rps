import type { Localized } from '../i18n'
import { useLanguage } from '../i18n'
import { cn } from '../lib/cn'
import { Reveal } from './Reveal'

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'dark',
  wide = false,
  className,
  id,
}: {
  eyebrow: Localized
  title: Localized
  lead?: Localized
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  wide?: boolean
  className?: string
  id?: string
}) {
  const { tl } = useLanguage()
  const centered = align === 'center'

  return (
    <div
      className={cn(
        wide
          ? 'grid w-full max-w-none gap-x-8 gap-y-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end'
          : 'max-w-3xl',
        centered && 'mx-auto text-center',
        className,
      )}
    >
      <div>
        <Reveal>
          <p className={cn(tone === 'light' ? 'eyebrow-light' : 'eyebrow', centered && 'justify-center')}>
            {tl(eyebrow)}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            id={id}
            className={cn(
              'display-section mt-5 text-balance',
              tone === 'light' ? 'text-white' : 'text-royal',
            )}
          >
            {tl(title)}
          </h2>
        </Reveal>
      </div>
      {lead && (
        <Reveal delay={0.16} className={cn(wide && 'lg:col-start-2')}>
          <p
            className={cn(
              'mt-5 max-w-2xl text-[15.5px] leading-[1.8]',
              tone === 'light' ? 'text-white/65' : 'text-ink/70',
              centered && 'mx-auto',
              wide && 'lg:mt-0 lg:max-w-[65ch]',
            )}
          >
            {tl(lead)}
          </p>
        </Reveal>
      )}
    </div>
  )
}
