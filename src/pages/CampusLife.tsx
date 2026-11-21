import { Link } from 'react-router-dom'
import { AdmissionsCta } from '../components/AdmissionsCta'
import { Icon } from '../components/Icon'
import { Page } from '../components/Page'
import { PageHeader } from '../components/PageHeader'
import { PhotoFallback } from '../components/PhotoFallback'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { SmartImage } from '../components/SmartImage'
import { TiltCard } from '../components/TiltCard'
import { campusCopy, campusItems } from '../data'
import { useLanguage } from '../i18n'
import { usePageSeo } from '../lib/seo'

export default function CampusLife() {
  const { tl, t } = useLanguage()
  usePageSeo('/campus-life')

  return (
    <Page>
      <PageHeader
        eyebrow={campusCopy.eyebrow}
        title={campusCopy.title}
        description={campusCopy.lead}
        image="celebration-rps"
        crumb={{ en: 'Campus Life', hi: 'परिसर जीवन' }}
      />

      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
            <div>
              <SectionHeading
                eyebrow={{ en: 'Beyond lessons', hi: 'पाठों से आगे' }}
                title={{ en: 'Confidence is built by taking part.', hi: 'आत्मविश्वास भाग लेने से बनता है।' }}
                lead={{
                  en: 'Sport, performance, celebration, and service give students ways to discover what they enjoy — and what they can do.',
                  hi: 'खेल, प्रस्तुति, उत्सव और सेवा विद्यार्थियों को यह खोजने के रास्ते देते हैं कि उन्हें क्या पसंद है — और वे क्या कर सकते हैं।',
                }}
              />
              <Reveal delay={0.15}>
                <p className="mt-6 text-[14.5px] leading-[1.85] text-ink/70">{tl(campusCopy.lead)}</p>
                <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-ink/45">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" />
                  {tl(campusCopy.note)}
                </p>
                <Link to="/gallery" className="link-underline mt-7">
                  {t('common.viewGallery')}
                  <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </Link>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="relative">
                <div aria-hidden="true" className="absolute -inset-3 rounded-[30px] border border-gold/30" />
                <TiltCard className="relative overflow-hidden rounded-[24px] shadow-soft" max={5}>
                  <div className="aspect-[4/3]">
                    <SmartImage
                      name="assembly-ground"
                      alt="Students in white uniform during the morning drill on the school ground"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                      imgClassName="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/65 via-transparent to-transparent" />
                  <div className="absolute inset-x-5 bottom-5 flex items-center justify-between">
                    <span className="rounded-full border border-white/20 bg-royal-deep/50 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-pale backdrop-blur-sm">
                      {tl({ en: 'On the field', hi: 'मैदान पर' })}
                    </span>
                    <Icon name="trophy" className="h-5 w-5 text-gold" />
                  </div>
                </TiltCard>
              </div>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {campusItems.map((item, index) => (
              <Reveal key={item.title.en} delay={(index % 3) * 0.06}>
                <TiltCard className="h-full" max={4}>
                  <article className="group card-surface h-full overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden bg-royal-deep">
                      {item.image ? (
                        <>
                          <SmartImage
                            name={item.image}
                            alt={tl(item.title)}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/70 via-royal-deep/5 to-transparent" />
                          <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-royal-deep/40 text-gold backdrop-blur-sm">
                            <Icon name={item.icon} className="h-4 w-4" />
                          </span>
                        </>
                      ) : (
                        <PhotoFallback icon={item.icon} />
                      )}
                      <h3 className="absolute inset-x-0 bottom-0 p-5 font-display text-xl leading-tight text-white">
                        {tl(item.title)}
                      </h3>
                    </div>
                    <p className="p-6 text-[13px] leading-relaxed text-ink/60">{tl(item.body)}</p>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-royal/10 bg-white px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-royal/45">
              <Icon name="camera" className="h-3.5 w-3.5 text-gold-deep" />
              {t('common.representativeNote')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x">
          <div className="flex flex-col items-start gap-6 rounded-[24px] border border-royal/10 bg-cream p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div className="max-w-xl">
              <Icon name="users" className="h-7 w-7 text-gold-deep" />
              <h2 className="display-section mt-4 text-royal">
                {tl({ en: 'Encouraged to participate.', hi: 'भाग लेने के लिए प्रोत्साहित।' })}
              </h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink/60">
                {tl({
                  en: 'Not every child is loud or naturally confident. We create space for quieter students to find their moment — on stage, in a group, or in front of the class.',
                  hi: 'हर बच्चा मुखर या स्वाभाविक रूप से आत्मविश्वासी नहीं होता। हम शांत विद्यार्थियों के लिए अपना क्षण खोजने की जगह बनाते हैं — मंच पर, समूह में या कक्षा के सामने।',
                })}
              </p>
            </div>
            <Link to="/contact" className="btn-navy shrink-0">
              {t('common.visit')}
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <AdmissionsCta />
    </Page>
  )
}
