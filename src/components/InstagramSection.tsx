import { instagram, instagramPosts } from '../data'
import { useLanguage } from '../i18n'
import { Icon } from './Icon'
import { Reveal } from './Reveal'

export function InstagramSection() {
  const { t, tl } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-cream py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full border border-dashed border-royal/10"
      />
      <div className="container-x relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow">{t('instagram.eyebrow')}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="display-section mt-5 text-balance text-royal">
                {t('instagram.title')}
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="body-lede mt-5">{t('instagram.lead')}</p>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t('instagram.follow')} — ${instagram.handle} (${t('a11y.newTab')})`}
              className="group inline-flex items-center gap-3 rounded-full border border-royal/10 bg-white p-2 pr-4 shadow-[0_14px_35px_-24px_rgba(10,27,51,0.45)] transition duration-300 hover:border-gold hover:shadow-[0_18px_40px_-22px_rgba(10,27,51,0.5)]"
            >
              <img
                src={instagram.avatar}
                alt=""
                width={44}
                height={44}
                loading="lazy"
                decoding="async"
                className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-royal/10"
              />
              <span className="flex flex-col leading-tight">
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-royal/45">
                  {t('footer.instagram')}
                </span>
                <span className="text-[13px] font-semibold text-royal transition-colors group-hover:text-gold-deep">
                  {instagram.handle}
                </span>
              </span>
              <span className="ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-instagram text-white">
                <Icon name="instagram" className="h-4 w-4" />
              </span>
              <Icon
                name="arrowUpRight"
                className="h-4 w-4 text-royal/35 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-deep"
              />
            </a>
          </Reveal>
        </div>

        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {instagramPosts.map((post, index) => (
            <Reveal
              key={post.url}
              delay={index * 0.08}
              className="w-[78%] shrink-0 snap-start sm:w-[52%] md:w-auto"
            >
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t('instagram.view')} — ${tl(post.date)} (${t('a11y.newTab')})`}
                className="group relative block aspect-[9/16] overflow-hidden rounded-[24px] bg-royal-deep"
              >
                <img
                  src={`/images/instagram/${post.image}.webp`}
                  alt={tl(post.alt)}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-royal-deep/85 via-royal-deep/5 to-royal-deep/35"
                />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur">
                    <Icon name="play" className="h-3 w-3 text-gold" />
                    {t('instagram.reel')}
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-instagram text-white shadow-lg">
                    <Icon name="instagram" className="h-4 w-4" />
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-display text-[17px] leading-tight text-white">
                    {tl(post.date)}
                  </p>
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-gold-light">
                    {t('instagram.view')}
                    <Icon
                      name="arrowUpRight"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-4 inline-flex items-start gap-2 text-[11px] leading-relaxed text-ink/50">
            <Icon name="instagram" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" />
            {t('instagram.note')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
