import { Link } from 'react-router-dom'
import { admissionsCopy, school } from '../data'
import { useLanguage } from '../i18n'
import { Icon } from './Icon'
import { SmartImage } from './SmartImage'

export function AdmissionsCta() {
  const { tl, t } = useLanguage()

  return (
    <section className="relative isolate overflow-hidden bg-royal-deep py-16 text-white sm:py-20">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          name="celebration-rps"
          alt=""
          sizes="100vw"
          imgClassName="h-full w-full object-cover"
          className="opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-royal-deep via-royal-deep/95 to-royal-deep/70" />
      </div>

      <div className="container-x flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow-light">{tl(admissionsCopy.eyebrow)}</p>
          <h2 className="display-section mt-4 text-balance text-white">
            {tl(admissionsCopy.ctaTitle)}
          </h2>
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/60">
            {tl(admissionsCopy.ctaBody)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link to="/admissions#enquiry" className="btn-gold">
            {t('common.enquireNow')}
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
          <a href={school.phoneHref} className="btn-outline-light">
            <Icon name="phone" className="h-4 w-4" />
            {school.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  )
}
