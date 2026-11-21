import { AdmissionsCta } from '../components/AdmissionsCta'
import { GalleryGrid } from '../components/GalleryGrid'
import { Icon } from '../components/Icon'
import { Page } from '../components/Page'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { galleryCopy } from '../data'
import { useLanguage } from '../i18n'
import { usePageSeo } from '../lib/seo'

export default function Gallery() {
  const { tl, t } = useLanguage()
  usePageSeo('/gallery')

  return (
    <Page>
      <PageHeader
        eyebrow={galleryCopy.eyebrow}
        title={galleryCopy.title}
        description={galleryCopy.lead}
        image="hero-campus"
        crumb={{ en: 'Gallery', hi: 'गैलरी' }}
      />

      <section className="bg-cream py-16 sm:py-20">
        <div className="container-x">
          <Reveal>
            <div className="mb-10 flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/[0.07] px-5 py-4">
              <Icon name="camera" className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-deep">
                  {t('common.representative')}
                </p>
                <p className="mt-1 max-w-3xl text-[12px] leading-relaxed text-royal/65">
                  {t('common.representativeNote')}
                </p>
              </div>
            </div>
          </Reveal>

          <GalleryGrid />

          <p className="mt-10 flex items-start gap-2 text-[11px] leading-relaxed text-ink/40">
            <Icon name="pin" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" />
            {tl({
              en: 'Want to see the campus in person? Call the school office to arrange a visit.',
              hi: 'परिसर स्वयं देखना चाहते हैं? विज़िट तय करने के लिए स्कूल कार्यालय को कॉल करें।',
            })}
          </p>
        </div>
      </section>

      <AdmissionsCta />
    </Page>
  )
}
