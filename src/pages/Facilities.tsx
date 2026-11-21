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
import { acFeature, facilitiesCopy, facilityItems, school, transport } from '../data'
import { useLanguage } from '../i18n'
import { usePageSeo } from '../lib/seo'

export default function Facilities() {
  const { tl, t } = useLanguage()
  usePageSeo('/facilities')

  return (
    <Page>
      <PageHeader
        eyebrow={facilitiesCopy.eyebrow}
        title={facilitiesCopy.title}
        description={facilitiesCopy.lead}
        image="hero-campus"
        crumb={{ en: 'Facilities', hi: 'सुविधाएँ' }}
      />

      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <div className="relative">
              <div aria-hidden="true" className="absolute -inset-3 rounded-[30px] border border-gold/30" />
              <TiltCard className="relative overflow-hidden rounded-[24px] shadow-soft" max={5}>
                <div className="aspect-[4/3]">
                  <SmartImage
                    name="class-group"
                    alt="Students of Royal Public School"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    imgClassName="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/60 via-transparent to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-full border border-white/20 bg-royal-deep/60 px-5 py-2.5 backdrop-blur-md">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-pale">
                    {tl(acFeature.badge)}
                  </span>
                  <Icon name="snowflake" className="h-4 w-4 text-gold" />
                </div>
              </TiltCard>
            </div>
          </Reveal>

          <div>
            <p className="eyebrow">{tl(acFeature.eyebrow)}</p>
            <Reveal>
              <h2 className="display-section mt-5 text-balance text-royal">
                {tl(acFeature.titleA)}{' '}
                <span className="italic text-gold-deep">{tl(acFeature.titleB)}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-[14.5px] leading-[1.85] text-ink/70">{tl(acFeature.body)}</p>
            </Reveal>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {acFeature.points.map((point, index) => (
                <Reveal key={point.title.en} delay={0.14 + index * 0.05}>
                  <div className="rounded-2xl border border-royal/10 bg-white p-4">
                    <Icon
                      name={index === 0 ? 'snowflake' : index === 1 ? 'sparkles' : 'star'}
                      className="h-4 w-4 text-gold-deep"
                    />
                    <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.08em] text-royal">
                      {tl(point.title)}
                    </p>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink/55">{tl(point.body)}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow={{ en: 'On campus', hi: 'परिसर में' }}
              title={{ en: 'Spaces for the whole school day.', hi: 'पूरे स्कूल दिवस के लिए स्थान।' }}
              lead={facilitiesCopy.lead}
            />
            <Reveal delay={0.2}>
              <span className="chip shrink-0">
                <Icon name="shield" className="h-3.5 w-3.5 text-gold-deep" />
                {t('common.callForTimings')}
              </span>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {facilityItems.map((item, index) => (
              <Reveal key={item.title.en} delay={(index % 3) * 0.06}>
                <TiltCard className="h-full" max={4}>
                  <article className="card-surface group h-full overflow-hidden">
                    <div className="relative aspect-[16/10] overflow-hidden bg-royal-deep">
                      {item.image ? (
                        <>
                          <SmartImage
                            name={item.image}
                            alt={tl(item.title)}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/60 via-transparent to-transparent" />
                        </>
                      ) : (
                        <PhotoFallback icon={item.icon} />
                      )}
                      <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-royal-deep/50 px-3 py-1 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-gold-pale backdrop-blur-sm">
                        {tl(item.tag)}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 text-gold-deep">
                          <Icon name={item.icon} className="h-4 w-4" />
                        </span>
                        <h3 className="font-display text-[19px] leading-tight text-royal">
                          {tl(item.title)}
                        </h3>
                      </div>
                      <p className="mt-3 text-[13px] leading-relaxed text-ink/60">{tl(item.body)}</p>
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="mt-10 rounded-[22px] border border-gold/25 bg-gold/[0.06] p-6 sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                {tl(facilitiesCopy.amenitiesTitle)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {facilitiesCopy.amenities.map((item) => (
                  <span
                    key={item.en}
                    className="inline-flex items-center gap-2 rounded-full border border-royal/10 bg-white px-3.5 py-1.5 text-[11px] font-medium text-royal/70"
                  >
                    <Icon name="check" className="h-3 w-3 text-gold-deep" />
                    {tl(item)}
                  </span>
                ))}
              </div>
              <p className="mt-4 max-w-3xl text-[11px] leading-relaxed text-ink/45">
                {tl(facilitiesCopy.note)}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-6 flex flex-col gap-5 rounded-[22px] border border-royal/10 bg-royal-deep p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="max-w-3xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                  {tl({ en: 'School transport', hi: 'स्कूल परिवहन' })}
                </p>
                <h3 className="mt-2 font-display text-2xl leading-tight">
                  {tl(transport.title)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{tl(transport.body)}</p>
              </div>
              <Link to="/transport" className="btn-gold shrink-0">
                {tl({ en: 'Explore transport', hi: 'परिवहन देखें' })}
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="noise relative overflow-hidden bg-royal-deep py-16 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-25" />
        <div className="container-x relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow-light">{tl({ en: 'Visit the campus', hi: 'परिसर पर आएँ' })}</p>
            <h2 className="display-section mt-4 text-white">
              {tl({ en: 'The best way to understand a school is to see it.', hi: 'स्कूल को समझने का सबसे अच्छा तरीका उसे देखना है।' })}
            </h2>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a href={school.phoneHref} className="btn-gold">
              <Icon name="phone" className="h-4 w-4" />
              {t('common.callNow')}
            </a>
            <a href={school.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-light">
              <Icon name="map" className="h-4 w-4" />
              {t('common.directions')}
            </a>
          </div>
        </div>
      </section>

      <AdmissionsCta />
    </Page>
  )
}
