import { Link } from 'react-router-dom'
import { Crest } from '../components/Brand'
import { Icon } from '../components/Icon'
import { Page } from '../components/Page'
import { useLanguage } from '../i18n'
import { useNotFoundSeo } from '../lib/seo'

export default function NotFound() {
  const { t, tl } = useLanguage()
  useNotFoundSeo()

  return (
    <Page>
      <section className="noise relative flex min-h-[70svh] items-center overflow-hidden bg-royal-deep py-24 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-25" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full border border-dashed border-gold/20"
        />
        <div className="container-x relative">
          <Crest className="h-14 w-14" />
          <p className="mt-8 font-display text-[clamp(5rem,18vw,11rem)] leading-none text-gold/25">404</p>
          <h1 className="display-section mt-2 max-w-xl text-white">{t('notfound.title')}</h1>
          <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-white/55">{t('notfound.body')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className="btn-gold">
              <Icon name="home" className="h-4 w-4" />
              {t('common.backHome')}
            </Link>
            <Link to="/admissions" className="btn-outline-light">
              {t('nav.enquire')}
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-10 text-[9px] uppercase tracking-[0.2em] text-white/30">
            {tl({ en: 'Tatiri · Baghpat · Uttar Pradesh', hi: 'ततिरी · बागपत · उत्तर प्रदेश' })}
          </p>
        </div>
      </section>
    </Page>
  )
}
