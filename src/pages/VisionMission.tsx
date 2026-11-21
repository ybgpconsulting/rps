import { Link } from 'react-router-dom'
import { AdmissionsCta } from '../components/AdmissionsCta'
import { Icon } from '../components/Icon'
import { Page } from '../components/Page'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { visionCopy } from '../data'
import { useLanguage } from '../i18n'
import { usePageSeo } from '../lib/seo'

export default function VisionMission() {
  const { tl, t } = useLanguage()
  usePageSeo('/vision-mission')

  return (
    <Page>
      <PageHeader
        eyebrow={visionCopy.eyebrow}
        title={visionCopy.title}
        description={visionCopy.lead}
        image="hero-campus"
        crumb={{ en: 'Vision & Mission', hi: 'दृष्टि एवं मिशन' }}
      />

      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <div className="noise relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] bg-royal-deep p-8 text-white sm:p-10">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-25" />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-dashed border-gold/20"
              />
              <div className="relative">
                <Icon name="quote" className="h-9 w-9 text-gold" />
                <p className="mt-6 text-[10px] font-semibold uppercase tracking-mega text-gold">
                  {tl(visionCopy.visionLabel)}
                </p>
                <p className="mt-5 font-display text-[clamp(1.55rem,2.8vw,2.3rem)] leading-[1.35] text-white">
                  {tl(visionCopy.vision)}
                </p>
              </div>
              <div className="relative mt-10 flex items-center gap-3 text-[9.5px] uppercase tracking-[0.18em] text-white/40">
                <span className="h-px w-10 bg-gold/50" />
                {tl({ en: 'Royal Public School', hi: 'रॉयल पब्लिक स्कूल' })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card-surface h-full p-8 sm:p-10">
              <p className="eyebrow">{tl(visionCopy.missionLabel)}</p>
              <h2 className="display-section mt-4 text-royal">
                {tl({ en: 'What we do every day.', hi: 'हम हर दिन क्या करते हैं।' })}
              </h2>
              <ul className="mt-7 space-y-5">
                {visionCopy.mission.map((item, index) => (
                  <li key={item.en} className="flex gap-4 border-t border-royal/10 pt-5 first:border-0 first:pt-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-[10px] font-bold text-gold-deep">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[14px] leading-relaxed text-ink/70">{tl(item)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow={{ en: 'Our principles', hi: 'हमारे सिद्धांत' }}
            title={visionCopy.principlesTitle}
            lead={{
              en: 'Four beliefs that shape decisions, big and small, across the school.',
              hi: 'चार विश्वास जो स्कूल के छोटे-बड़े निर्णयों को आकार देते हैं।',
            }}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {visionCopy.principles.map((item, index) => (
              <Reveal key={item.no} delay={index * 0.06}>
                <article className="group relative h-full overflow-hidden rounded-[22px] border border-royal/10 bg-cream p-7 transition-colors duration-300 hover:border-gold/40 sm:p-8">
                  <span className="absolute right-6 top-4 font-display text-5xl text-royal/[0.06]">
                    {item.no}
                  </span>
                  <h3 className="display-card max-w-[85%] text-royal">{tl(item.title)}</h3>
                  <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-ink/60">{tl(item.body)}</p>
                  <span className="mt-6 block h-px w-full bg-gradient-to-r from-gold/60 to-transparent" />
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-royal/10 bg-cream px-6 py-5">
              <p className="text-[13px] text-ink/60">
                {tl({
                  en: 'Want to see how these ideas look in practice? Visit the campus.',
                  hi: 'देखना चाहते हैं कि ये विचार व्यवहार में कैसे दिखते हैं? परिसर आएँ।',
                })}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/about" className="btn-outline">
                  {t('nav.about')}
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="btn-navy">
                  {t('common.visit')}
                  <Icon name="pin" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <AdmissionsCta />
    </Page>
  )
}
