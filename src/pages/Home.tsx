import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  acFeature,
  academicStages,
  academicsCopy,
  admissionsCopy,
  contactCopy,
  galleryItems,
  facilityItems,
  hero,
  principal,
  school,
  transport,
  welcome,
  why,
} from '../data'
import { listPublicUpdates } from '../lib/updates'
import { UPDATE_CATEGORY_LABELS, type SchoolUpdate } from '../lib/updates-model'
import { useLanguage } from '../i18n'
import { usePageSeo } from '../lib/seo'
import { Crest } from '../components/Brand'
import { Icon } from '../components/Icon'
import { InstagramSection } from '../components/InstagramSection'
import { Page } from '../components/Page'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { SmartImage } from '../components/SmartImage'
import { TiltCard } from '../components/TiltCard'

function Hero() {
  const { t, tl } = useLanguage()
  const photoNames = ['school-building', 'hero-campus', 'class-group', 'school-gate']
  const photoTrack = useRef<HTMLDivElement>(null)
  const photoSlides = useRef<Array<HTMLDivElement | null>>([])
  const [activePhoto, setActivePhoto] = useState(0)

  function scrollToPhoto(index: number) {
    const track = photoTrack.current
    const slide = photoSlides.current[index]
    if (!track || !slide) return

    const left = track.scrollLeft + slide.getBoundingClientRect().left - track.getBoundingClientRect().left
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    track.scrollTo({ left, behavior })
  }

  function updateActivePhoto() {
    const track = photoTrack.current
    if (!track) return

    const trackLeft = track.getBoundingClientRect().left
    const nextPhoto = photoSlides.current.reduce(
      (nearest, slide, index) => {
        if (!slide) return nearest
        const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft)
        return distance < nearest.distance ? { index, distance } : nearest
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    ).index

    setActivePhoto((current) => (current === nextPhoto ? current : nextPhoto))
  }

  return (
    <section className="overflow-hidden bg-royal-deep pb-7 pt-5 text-white sm:pb-9 sm:pt-7">
      <h1 className="sr-only">
        {tl(school.name)} — {tl(hero.badge)} and {t('hero.fullyAcTransportation')}
      </h1>
      <div className="container-x">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-center sm:gap-3">
          <div className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold-light/70 bg-gold px-2.5 py-2 text-royal-deep shadow-gold sm:min-w-[220px] sm:px-4">
            <Icon name="snowflake" className="h-4 w-4 shrink-0" />
            <span className="text-center text-[9px] font-bold uppercase leading-tight tracking-[0.04em] sm:text-[10px]">
              {tl(hero.badge)}
            </span>
          </div>
          <div className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold-light/70 bg-gold px-2.5 py-2 text-royal-deep shadow-gold sm:min-w-[220px] sm:px-4">
            <Icon name="bus" className="h-4 w-4 shrink-0" />
            <span className="text-center text-[9px] font-bold uppercase leading-tight tracking-[0.04em] sm:text-[10px]">
              {t('hero.fullyAcTransportation')}
            </span>
          </div>
        </div>
      </div>

      <div className="container-x mt-3 sm:mt-4">
        <div className="relative">
          <div
            ref={photoTrack}
            role="region"
            aria-label={t('hero.photos')}
            tabIndex={0}
            onScroll={updateActivePhoto}
            className="no-scrollbar flex h-[52svh] min-h-[340px] max-h-[540px] snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-gold"
          >
            {photoNames.map((name, index) => {
              const photo = galleryLookup(name)
              return (
                <div
                  key={name}
                  ref={(node: HTMLDivElement | null) => {
                    photoSlides.current[index] = node
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${photoNames.length}: ${tl(photo.title)}`}
                  className="relative h-full min-w-[88%] shrink-0 snap-start overflow-hidden rounded-[28px] bg-royal/20 sm:min-w-[70%] lg:min-w-[48%]"
                >
                  <SmartImage
                    name={name}
                    alt={tl(photo.alt)}
                    priority={index === 0}
                    sizes="(max-width: 640px) 86vw, (max-width: 1024px) 70vw, 48vw"
                    imgClassName="h-full w-full object-cover"
                  />
                </div>
              )
            })}
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-white/20 bg-royal-deep/85 p-1 backdrop-blur-md sm:bottom-4 sm:right-4">
            <button
              type="button"
              aria-label={t('hero.previousPhoto')}
              onClick={() => scrollToPhoto((activePhoto - 1 + photoNames.length) % photoNames.length)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
            </button>
            <span aria-hidden="true" className="min-w-10 text-center text-[10px] font-semibold tabular-nums text-gold-light">
              {activePhoto + 1} / {photoNames.length}
            </span>
            <button
              type="button"
              aria-label={t('hero.nextPhoto')}
              onClick={() => scrollToPhoto((activePhoto + 1) % photoNames.length)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              <Icon name="chevronRight" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Welcome() {
  const { tl, t } = useLanguage()

  return (
    <section id="welcome" className="relative overflow-hidden bg-cream py-20 sm:py-28">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-8 select-none font-display text-[20vw] leading-none text-royal/[0.035]"
      >
        Royal
      </span>

      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={welcome.eyebrow} title={welcome.title} />
          <Reveal delay={0.16}>
            <p className="mt-6 text-[14.5px] leading-[1.85] text-ink/70">{tl(welcome.body1)}</p>
            <p className="mt-4 text-[14.5px] leading-[1.85] text-ink/70">{tl(welcome.body2)}</p>
          </Reveal>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {welcome.points.map((point, index) => (
              <Reveal key={point.en} delay={0.2 + index * 0.04}>
                <li className="flex items-start gap-2.5 text-[13px] font-medium text-royal/80">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                    <Icon name="check" className="h-3 w-3" />
                  </span>
                  {tl(point)}
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.4}>
            <Link to="/about" className="link-underline mt-9">
              {t('common.learnMore')}
              <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>

        <div className="relative lg:col-span-7 lg:pl-6">
          <Reveal>
            <TiltCard className="relative z-10 overflow-hidden rounded-[26px] border border-royal/10 shadow-soft" max={5}>
              <div className="aspect-[4/3]">
                <SmartImage
                  name="class-group"
                  alt="Students of Royal Public School in winter uniform, seated for a class photograph"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
              <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/20 bg-royal-deep/75 px-4 py-2 backdrop-blur-md">
                <Icon name="snowflake" className="h-3.5 w-3.5 text-gold" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/85">
                  {tl(welcome.badge)}
                </span>
              </div>
            </TiltCard>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="absolute -bottom-10 -left-2 z-20 hidden w-44 rotate-[-4deg] overflow-hidden rounded-2xl border-[5px] border-cream shadow-lift sm:block lg:-left-8 lg:w-52">
              <div className="aspect-square">
                <SmartImage
                  name="school-building"
                  alt="The Royal Public School building across the checkered courtyard"
                  sizes="220px"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          <div className="absolute -right-2 -top-6 z-20 hidden animate-floaty sm:block">
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold text-royal-deep shadow-gold ring-4 ring-cream">
              <Icon name="snowflake" className="h-5 w-5" />
              <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em]">Fully AC</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  const { tl, t } = useLanguage()

  return (
    <section className="relative bg-white py-20 sm:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={why.eyebrow}
            title={why.title}
            lead={why.lead}
            wide
            className="min-w-0 flex-1"
          />
          <Reveal delay={0.2}>
            <span className="chip shrink-0">
              <Icon name="sparkles" className="h-3.5 w-3.5 text-gold-deep" />
              {t('footer.tagline')}
            </span>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {why.items.map((item, index) => (
            <Reveal key={item.title.en} delay={(index % 3) * 0.06}>
              <TiltCard className="h-full">
                <article className="card-surface relative h-full overflow-hidden p-7 transition-shadow duration-300 hover:shadow-lift">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-6 top-3 font-display text-[64px] leading-none text-royal/[0.045]"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-royal text-gold shadow-soft">
                    <Icon name={item.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="display-card mt-6 max-w-[85%] text-royal">{tl(item.title)}</h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink/60">{tl(item.body)}</p>
                  <span
                    aria-hidden="true"
                    className="mt-6 block h-px w-full bg-gradient-to-r from-gold/60 via-gold/20 to-transparent"
                  />
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function AirConditionedFeature() {
  const { tl, t } = useLanguage()

  return (
    <section className="noise relative overflow-hidden bg-royal-deep py-20 text-white sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 hidden h-[600px] w-[600px] -translate-y-1/2 rounded-full border border-gold/15 lg:block"
      >
        <span className="absolute inset-10 animate-spin-slow rounded-full border border-dashed border-gold/20" />
        <span className="absolute inset-24 rounded-full border border-gold/10" />
      </div>

      <div className="container-x relative grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <p className="eyebrow-light">{tl(acFeature.eyebrow)}</p>
          <Reveal>
            <h2 className="display-section mt-5 text-balance text-white">
              {tl(acFeature.titleA)}{' '}
              <span className="italic text-gold">{tl(acFeature.titleB)}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-[14.5px] leading-[1.85] text-white/60">
              {tl(acFeature.body)}
            </p>
          </Reveal>

          <div className="mt-9 space-y-5">
            {acFeature.points.map((point, index) => (
              <Reveal key={point.title.en} delay={0.15 + index * 0.07}>
                <div className="flex gap-4 border-t border-white/10 pt-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                    <Icon
                      name={index === 0 ? 'snowflake' : index === 1 ? 'sparkles' : 'star'}
                      className="h-4 w-4"
                    />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-gold-pale">
                      {tl(point.title)}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-white/50">{tl(point.body)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/facilities" className="btn-gold">
                {t('nav.facilities')}
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <a href={school.phoneHref} className="btn-outline-light">
                <Icon name="phone" className="h-4 w-4" />
                {school.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[30px] border border-gold/25 sm:-inset-4"
            />
            <TiltCard className="relative overflow-hidden rounded-[24px] shadow-lift" max={5}>
              <div className="aspect-[4/5] sm:aspect-[5/5]">
                <SmartImage
                  name="school-building"
                  alt="The Royal Public School building, home to fully air-conditioned classrooms"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/70 via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3 rounded-full border border-white/20 bg-royal-deep/60 px-5 py-3 backdrop-blur-md">
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-pale">
                  {tl(acFeature.badge)}
                </span>
                <Icon name="snowflake" className="h-4 w-4 text-gold" />
              </div>
            </TiltCard>
            <div className="absolute -left-4 top-6 hidden items-center gap-2 rounded-full bg-cream px-4 py-2 shadow-lift sm:flex">
              <Icon name="snowflake" className="h-3.5 w-3.5 text-gold-deep" />
              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-royal">
                {tl(acFeature.imageCaption)}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function AcademicsPreview() {
  const { tl, t } = useLanguage()

  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={academicsCopy.eyebrow}
            title={academicsCopy.title}
            lead={academicsCopy.lead}
            wide
            className="min-w-0 flex-1"
          />
          <Reveal delay={0.2}>
            <Link to="/academics" className="link-underline shrink-0">
              {t('common.viewAll')}
              <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>

        <div className="no-scrollbar -mx-5 mt-12 flex snap-x-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
          {academicStages.map((stage, index) => (
            <Reveal
              key={stage.title.en}
              delay={index * 0.07}
              className="min-w-[84%] snap-start sm:min-w-0"
            >
              <TiltCard className="h-full" max={4}>
                <article className="card-surface h-full overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <SmartImage
                      name={stage.image}
                      alt={tl(stage.title)}
                      sizes="(max-width: 640px) 84vw, 33vw"
                      imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/50 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-pale">
                      {tl(stage.tag)}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="display-card text-royal">{tl(stage.title)}</h3>
                      <span aria-hidden="true" className="font-display text-2xl text-royal/15">
                        {stage.no}
                      </span>
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-ink/60">{tl(stage.body)}</p>
                    <Link to="/academics" className="link-underline mt-6">
                      {t('common.learnMore')}
                      <Icon name="arrowRight" className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-8 flex items-start gap-2 text-[11px] leading-relaxed text-ink/45">
            <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" />
            {tl(academicsCopy.note)}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function FacilitiesPreview() {
  const { tl, t } = useLanguage()
  const tiles = facilityItems
    .filter((item) => item.image)
    .slice(0, 4)
    .map((item, index) => ({
      item,
      className: index === 0 ? 'col-span-2 md:row-span-2' : index === 1 ? 'md:col-span-2' : '',
    }))

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={{ en: 'Campus', hi: 'परिसर' }}
            title={{ en: 'Spaces made for the school day.', hi: 'स्कूल दिवस के लिए बने स्थान।' }}
            lead={facilityPreviewLead}
            wide
            className="min-w-0 flex-1"
          />
          <Reveal delay={0.2}>
            <Link to="/facilities" className="link-underline shrink-0">
              {t('nav.facilities')}
              <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] md:grid-cols-4 md:grid-rows-2">
          {tiles.map(({ item, className }, index) => (
            <Reveal key={item.title.en} delay={index * 0.06} className={className}>
              <Link
                to="/facilities"
                className="group relative block h-full overflow-hidden rounded-[20px] bg-royal-mist"
              >
                <SmartImage
                  name={item.image!}
                  alt={tl(item.title)}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  imgClassName="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/85 via-royal-deep/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <span className="text-[8.5px] font-semibold uppercase tracking-[0.18em] text-gold">
                    {tl(item.tag)}
                  </span>
                  <p className="mt-1 font-display text-[15px] leading-tight text-white sm:text-[17px]">
                    {tl(item.title)}
                  </p>
                </div>
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-royal-deep/40 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                  <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-6 flex items-start gap-2 text-[11px] leading-relaxed text-ink/45">
            <Icon name="shield" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" />
            {tl(facilityItems[0].body)}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

const facilityPreviewLead = {
  en: 'Air-conditioned classrooms at the centre, surrounded by spaces for science, reading, sport, and creativity.',
  hi: 'केंद्र में वातानुकूलित कक्षाएँ, और उनके आसपास विज्ञान, वाचन, खेल और रचनात्मकता के स्थान।',
} as const

function PrincipalSection() {
  const { tl } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-cream py-20 sm:py-28">
      <div className="container-x">
        <div className="card-surface grid overflow-hidden lg:grid-cols-[0.8fr_1.6fr]">
          <div className="relative min-h-[300px] overflow-hidden bg-royal-deep lg:min-h-full">
            <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-40" />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gold/25"
            />
            <div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
              <Crest className="h-24 w-24 opacity-80" />
              <p className="mt-5 font-display text-xl text-white">{tl(principal.signoff)}</p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-gold/70">
                {tl(school.name)}
              </p>
              <span className="mt-5 rounded-full border border-white/15 px-3 py-1.5 text-[8.5px] uppercase tracking-[0.14em] text-white/40">
                {tl({ en: 'Photograph to be added', hi: 'चित्र जोड़ा जाना है' })}
              </span>
            </div>
          </div>

          <div className="relative p-7 sm:p-10 lg:p-12">
            <Icon name="quote" className="h-8 w-8 text-gold" />
            <p className="eyebrow mt-5">{tl(principal.eyebrow)}</p>
            <Reveal>
              <h2 className="display-section mt-4 text-balance text-royal">{tl(principal.title)}</h2>
            </Reveal>
            <div className="mt-6 space-y-4">
              {principal.paragraphs.map((paragraph, index) => (
                <Reveal key={paragraph.en} delay={index * 0.06}>
                  <p className="max-w-2xl text-[14px] leading-[1.85] text-ink/65">{tl(paragraph)}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-royal/10 pt-5">
                <p className="text-[11px] italic text-ink/35">{tl(principal.note)}</p>
                <Link to="/about" className="link-underline">
                  {tl({ en: 'About the school', hi: 'स्कूल के बारे में' })}
                  <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function GalleryPreview() {
  const { tl, t } = useLanguage()
  const picks = ['hero-campus', 'class-group', 'school-building', 'assembly-ground', 'janmashtami']

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={{ en: 'Gallery', hi: 'गैलरी' }}
            title={{ en: 'A glimpse of everyday life.', hi: 'दैनिक जीवन की एक झलक।' }}
            lead={{
              en: 'The courtyard, the field, the stage — the places where school life happens.',
              hi: 'प्रांगण, मैदान, मंच — वे स्थान जहाँ स्कूल जीवन बनता है।',
            }}
          />
          <Reveal delay={0.2}>
            <Link to="/gallery" className="link-underline shrink-0">
              {t('common.viewGallery')}
              <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[200px] md:grid-cols-4">
          {picks.map((name, index) => {
            const item = galleryLookup(name)
            return (
              <Reveal
                key={name}
                delay={index * 0.05}
                className={index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 md:col-span-1'}
              >
                <Link
                  to="/gallery"
                  className="group relative block h-full overflow-hidden rounded-[20px] bg-royal-mist"
                  aria-label={`${t('common.viewGallery')} — ${tl(item.title)}`}
                >
                  <SmartImage
                    name={name}
                    alt={tl(item.alt)}
                    imageUrl={item.imageUrl}
                    sizes={index === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                    imgClassName="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/90 via-royal-deep/25 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                  <p className="absolute inset-x-0 bottom-0 p-4 font-display text-[15px] leading-tight text-white">
                    {tl(item.title)}
                  </p>
                </Link>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-royal/10 bg-cream px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-royal/50">
            <Icon name="camera" className="h-3.5 w-3.5 text-gold-deep" />
            {t('common.representative')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function galleryLookup(name: string) {
  return galleryItems.find((item) => item.name === name) ?? galleryItems[0]
}

function AdmissionsBand() {
  const { tl, t } = useLanguage()

  return (
    <section className="relative isolate overflow-hidden bg-royal py-20 text-white sm:py-24">
      <div className="absolute inset-0 -z-10">
        <SmartImage
          name="class-group"
          alt=""
          sizes="100vw"
          imgClassName="h-full w-full object-cover"
          className="opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-royal-deep via-royal-deep/95 to-royal/60" />
      </div>

      <div className="container-x relative grid gap-12 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
        <div>
          <p className="eyebrow-light">{tl(admissionsCopy.eyebrow)}</p>
          <Reveal>
            <h2 className="display-section mt-5 max-w-2xl text-balance text-white">
              {tl(admissionsCopy.ctaTitle)}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-[14.5px] leading-[1.85] text-white/60">
              {tl(admissionsCopy.ctaBody)}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/admissions" className="btn-gold">
                {t('nav.enquire')}
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <a href={school.phoneHref} className="btn-outline-light">
                <Icon name="phone" className="h-4 w-4" />
                {t('common.call')}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="rounded-[24px] border border-white/15 bg-white/[0.04] p-6 backdrop-blur-md sm:p-7">
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-gold">
              {tl(admissionsCopy.stepsTitle)}
            </p>
            <ol className="mt-5 space-y-4">
              {admissionsCopy.steps.slice(0, 3).map((step) => (
                <li key={step.no} className="flex gap-4">
                  <span className="font-display text-sm text-gold/60">{step.no}</span>
                  <div>
                    <p className="font-display text-[17px] text-white">{tl(step.title)}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-white/50">{tl(step.body)}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link
              to="/admissions"
              className="mt-6 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-gold hover:text-gold-light"
            >
              {t('common.viewAll')}
              <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ContactStrip() {
  const { tl, t } = useLanguage()

  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="container-x grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
        <SectionHeading
          eyebrow={contactCopy.eyebrow}
          title={contactCopy.title}
          lead={contactCopy.lead}
          className="max-w-none"
        />
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal>
              <a
                href={school.phoneHref}
                className="card-surface group flex h-full flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-royal text-gold">
                  <Icon name="phone" className="h-4 w-4" />
                </span>
                <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-royal/45">
                  {t('common.phone')}
                </span>
                <span className="font-display text-[17px] text-royal">{school.phoneDisplay}</span>
              </a>
            </Reveal>
            <Reveal delay={0.06}>
              <a
                href={school.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-surface group flex h-full flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-royal text-gold">
                  <Icon name="pin" className="h-4 w-4" />
                </span>
                <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-royal/45">
                  {t('common.address')}
                </span>
                <span className="text-[12.5px] leading-relaxed text-royal/75">{tl(school.address)}</span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function HomeUpdates() {
  const { lang } = useLanguage()
  const [updates, setUpdates] = useState<{ pinned: SchoolUpdate[]; latest: SchoolUpdate[] } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    void Promise.all([
      listPublicUpdates({ pinnedOnly: true, limit: 1 }),
      listPublicUpdates({ excludePinned: true, limit: 3 }),
    ]).then(
      ([pinned, latest]) => {
        if (active) setUpdates({ pinned: pinned.updates, latest: latest.updates })
      },
      (reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'School updates could not be loaded.')
      },
    )
    return () => { active = false }
  }, [])

  const formatDate = (value: string) => new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))

  return (
    <section className="bg-[#f7f9fc] py-14 sm:py-18">
      <div className="container-x">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#92742e]">For parents</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#10264a]">
              {lang === 'hi' ? 'स्कूल की नवीनतम सूचनाएँ' : 'Latest school updates'}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              {lang === 'hi' ? 'छुट्टियों और ज़रूरी सूचनाओं की जानकारी सीधे यहाँ देखें।' : 'Find holidays and important information from the school here.'}
            </p>
          </div>
          <Link to="/updates" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#10264a] px-5 text-sm font-semibold text-white hover:bg-[#183866]">
            {lang === 'hi' ? 'सभी स्कूल सूचनाएँ देखें' : 'View All School Updates'}
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>

        {updates?.pinned.map((update) => (
          <Link key={update.id} to={`/updates/${update.slug}`} className="mt-6 flex flex-col gap-2 rounded-2xl border border-amber-300 bg-amber-50 p-5 hover:bg-amber-100 sm:flex-row sm:items-center sm:justify-between">
            <span className="min-w-0">
              <span className="mb-2 inline-flex rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-950">Important notice</span>
              <span className="block text-lg font-bold text-[#10264a]">{update.title}</span>
              <span className="mt-1 block text-sm leading-6 text-slate-700">{update.summary}</span>
            </span>
            <span className="shrink-0 text-sm font-semibold text-[#274a78]">Read notice <Icon name="arrowRight" className="inline h-4 w-4" /></span>
          </Link>
        ))}

        {error && <p role="status" className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950">School updates are temporarily unavailable. Please try again later.</p>}
        {!error && updates && updates.latest.length === 0 && updates.pinned.length === 0 && (
          <p className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">There are no current announcements.</p>
        )}
        {updates && updates.latest.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {updates.latest.map((update) => (
              <article key={update.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${update.category === 'holiday' ? 'bg-amber-100 text-amber-950' : 'bg-blue-50 text-blue-900'}`}>
                    {UPDATE_CATEGORY_LABELS[update.category][lang]}
                  </span>
                  <time className="text-xs text-slate-500" dateTime={update.publishedAt}>{formatDate(update.publishedAt)}</time>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug text-[#10264a]">
                  <Link to={`/updates/${update.slug}`} className="hover:underline">{update.title}</Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{update.summary}</p>
                <Link to={`/updates/${update.slug}`} className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#274a78] hover:underline">
                  Read more <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function TransportFeature() {
  const { tl, t } = useLanguage()

  return (
    <section className="bg-[#f7f9fc] py-16 sm:py-20">
      <div className="container-x grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#92742e]">School transport</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#10264a]">{tl(transport.title)}</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">{tl(transport.body)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#10264a]">
              <Icon name="bus" className="h-4 w-4 text-[#92742e]" /> Every school bus is fully air-conditioned
            </span>
            <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#10264a]">
              <Icon name="map" className="h-4 w-4 text-[#92742e]" /> Tatiri and Baghpat city
            </span>
          </div>
          <a href={school.phoneHref} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#10264a] px-5 text-sm font-semibold text-[#10264a] hover:bg-white">
            <Icon name="phone" className="h-4 w-4" /> {t('common.call')}
          </a>
        </div>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {transport.photoUrl ? (
            <SmartImage
              name="school-transport"
              imageUrl={transport.photoUrl}
              alt="Royal Public School transport"
              sizes="(max-width: 1024px) 100vw, 50vw"
              imgClassName="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] flex-col items-center justify-center bg-[#eaf0f8] px-6 text-center">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-white text-[#10264a] shadow-sm">
                <Icon name="bus" className="h-10 w-10" />
              </span>
              <p className="mt-5 max-w-sm text-sm leading-6 text-slate-600">
                Add a real school transport photo in the admin panel when one is available.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  usePageSeo('/')

  return (
    <Page>
      <Hero />
      <HomeUpdates />
      <Welcome />
      <WhySection />
      <AirConditionedFeature />
      <TransportFeature />
      <AcademicsPreview />
      <FacilitiesPreview />
      <PrincipalSection />
      <GalleryPreview />
      <InstagramSection />
      <AdmissionsBand />
      <ContactStrip />
    </Page>
  )
}
