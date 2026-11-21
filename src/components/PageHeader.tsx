import type { Localized } from '../i18n'
import { useLanguage } from '../i18n'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { SmartImage } from './SmartImage'

export function PageHeader({
  eyebrow,
  title,
  description,
  image,
  crumb,
}: {
  eyebrow: Localized
  title: Localized
  description?: Localized
  image: string
  crumb?: Localized
}) {
  const { tl } = useLanguage()

  return (
    <section className="noise relative isolate overflow-hidden bg-royal-deep text-white">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          name={image}
          alt=""
          priority
          sizes="100vw"
          imgClassName="h-full w-full scale-105 object-cover"
          className="opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-royal-deep via-royal-deep/92 to-royal/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-royal-deep via-transparent to-royal-deep/50" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-dashed border-gold/20 lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-1/2 hidden h-[300px] w-[300px] -translate-y-1/2 rounded-full border border-gold/15 lg:block"
      />

      <div className="container-x relative pb-16 pt-16 sm:pb-20 sm:pt-20">
        {crumb && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-white/65">
              <li>
                <Link to="/" className="transition-colors hover:text-gold-light">
                  {tl({ en: 'Home', hi: 'होम' })}
                </Link>
              </li>
              <li aria-hidden="true">
                <Icon name="chevronRight" className="h-3 w-3" />
              </li>
              <li aria-current="page" className="font-semibold text-gold-pale">
                {tl(crumb)}
              </li>
            </ol>
          </nav>
        )}
        <p className="eyebrow-light">{tl(eyebrow)}</p>
        <h1 className="display-hero mt-5 max-w-4xl text-balance text-white">{tl(title)}</h1>
        {description && (
          <p className="mt-6 max-w-2xl text-[15.5px] leading-[1.8] text-white/65">{tl(description)}</p>
        )}
      </div>
    </section>
  )
}
