import { Icon } from './Icon'
import type { Localized } from '../i18n'
import { useLanguage } from '../i18n'

export function Faq({
  items,
}: {
  items: { q: Localized; a: Localized }[]
}) {
  const { tl } = useLanguage()

  return (
    <div className="divide-y divide-royal/10 border-y border-royal/10">
      {items.map((item) => (
        <details key={item.q.en} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
            <span className="font-display text-[17px] leading-snug text-royal sm:text-[19px]">
              {tl(item.q)}
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-royal/15 text-royal/60 transition duration-300 group-open:rotate-180 group-open:border-gold group-open:text-gold-deep">
              <Icon name="chevronDown" className="h-4 w-4" />
            </span>
          </summary>
          <p className="max-w-2xl pb-6 pr-10 text-[14px] leading-relaxed text-ink/65">{tl(item.a)}</p>
        </details>
      ))}
    </div>
  )
}
