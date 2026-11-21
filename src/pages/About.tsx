import { Link } from 'react-router-dom'
import { AdmissionsCta } from '../components/AdmissionsCta'
import { Icon } from '../components/Icon'
import { Page } from '../components/Page'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { SmartImage } from '../components/SmartImage'
import { TiltCard } from '../components/TiltCard'
import { aboutCopy, principal, school } from '../data'
import { useLanguage } from '../i18n'
import { usePageSeo } from '../lib/seo'

export default function About() {
  const { tl, t } = useLanguage()
  usePageSeo('/about')

  return (
    <Page>
      <PageHeader
        eyebrow={aboutCopy.eyebrow}
        title={aboutCopy.title}
        description={aboutCopy.lead}
        image="school-gate"
        crumb={{ en: 'About Us', hi: 'हमारे बारे में' }}
      />

      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <SectionHeading
              eyebrow={{ en: 'Our story', hi: 'हमारी कहानी' }}
              title={{ en: 'A neighbourhood school with a clear purpose.', hi: 'स्पष्ट उद्देश्य वाला पड़ोसी विद्यालय।' }}
            />
            <div className="mt-6 space-y-4">
              {aboutCopy.story.map((paragraph, index) => (
                <Reveal key={paragraph.en} delay={index * 0.06}>
                  <p className="text-[14.5px] leading-[1.85] text-ink/70">{tl(paragraph)}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/vision-mission" className="btn-navy">
                  {t('nav.vision')}
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="btn-outline">
                  {t('common.visit')}
                  <Icon name="pin" className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="relative">
              <div aria-hidden="true" className="absolute -inset-3 rounded-[30px] border border-gold/30" />
              <TiltCard className="relative overflow-hidden rounded-[24px] shadow-soft" max={5}>
                <div className="aspect-[4/5]">
                  <SmartImage
                    name="school-building"
                    alt="The Royal Public School building across the checkered courtyard"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    imgClassName="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/60 via-transparent to-transparent" />
                <p className="absolute inset-x-0 bottom-0 p-5 font-display text-lg text-white">
                  {tl(school.locality)}
                </p>
              </TiltCard>
              <div className="absolute -bottom-6 -left-4 hidden items-center gap-2 rounded-full bg-cream px-4 py-2 shadow-lift sm:flex">
                <Icon name="snowflake" className="h-3.5 w-3.5 text-gold-deep" />
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-royal">
                  {t('footer.tagline')}
                </span>
              </div>
            </div>
            <p className="mt-9 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-ink/35">
              <Icon name="camera" className="h-3.5 w-3.5 text-gold-deep" />
              {t('common.representative')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow={{ en: 'Our approach', hi: 'हमारा तरीका' }}
            title={aboutCopy.approachTitle}
            lead={{
              en: 'Three ideas guide the way we run the school — and the way we treat every child who walks in.',
              hi: 'तीन विचार हमारे स्कूल के संचालन और अंदर आने वाले हर बच्चे के साथ व्यवहार का मार्गदर्शन करते हैं।',
            }}
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {aboutCopy.approach.map((item, index) => (
              <Reveal key={item.title.en} delay={index * 0.07}>
                <TiltCard className="h-full">
                  <article className="card-surface h-full p-7">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-royal text-gold">
                      <Icon name={item.icon} className="h-6 w-6" />
                    </span>
                    <h3 className="display-card mt-6 text-royal">{tl(item.title)}</h3>
                    <p className="mt-3 text-[13.5px] leading-relaxed text-ink/60">{tl(item.body)}</p>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="noise relative overflow-hidden bg-royal-deep py-20 text-white sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-25" />
        <div className="container-x relative">
          <SectionHeading
            eyebrow={{ en: 'Our values', hi: 'हमारे मूल्य' }}
            title={aboutCopy.valuesTitle}
            tone="light"
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-[22px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {aboutCopy.values.map((value, index) => (
              <Reveal key={value.title.en} delay={index * 0.06}>
                <div className="h-full bg-royal-deep p-7">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-gold/60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-white">{tl(value.title)}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/50">{tl(value.body)}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="mt-10 grid gap-px overflow-hidden rounded-[22px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {aboutCopy.glance.map((item) => (
                <div key={item.label.en} className="bg-royal-deep p-6">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    {tl(item.label)}
                  </p>
                  <p className="mt-2 font-display text-lg text-gold-pale">{tl(item.value)}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x">
          <div className="card-surface relative overflow-hidden p-7 sm:p-10">
            <Icon name="quote" className="h-8 w-8 text-gold" />
            <p className="eyebrow mt-5">{tl(principal.eyebrow)}</p>
            <h2 className="display-section mt-4 max-w-3xl text-royal">{tl(principal.title)}</h2>
            <p className="mt-5 max-w-3xl text-[14.5px] leading-[1.85] text-ink/65">
              {tl(principal.paragraphs[0])}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-royal/10 pt-5">
              <div>
                <p className="font-display text-lg text-royal">{tl(principal.signoff)}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-royal/40">{tl(school.name)}</p>
              </div>
              <p className="max-w-sm text-[10.5px] italic leading-relaxed text-ink/35">
                {tl(principal.note)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <AdmissionsCta />
    </Page>
  )
}
