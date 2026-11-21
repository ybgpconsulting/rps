import { Link } from 'react-router-dom'
import { instagram, footerLinks, school, socialLinks, whatsappUrl } from '../data'
import { useLanguage } from '../i18n'
import { Brand } from './Brand'
import { Icon } from './Icon'

const YEAR = new Date().getFullYear()

export function Footer() {
  const { t, tl } = useLanguage()

  return (
    <footer className="noise relative overflow-hidden bg-royal-deep text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full border border-dashed border-gold/15"
      />
      <div className="container-x relative pb-28 pt-16 lg:pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <Brand tone="light" />
            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-white/55">
              {t('footer.intro')}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold">
              <Icon name="snowflake" className="h-3.5 w-3.5" />
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h2 className="text-[10.5px] font-semibold uppercase tracking-mega text-gold">
              {t('footer.quickLinks')}
            </h2>
            <ul className="mt-5 space-y-3">
              <li>
                <Link to="/" className="text-[13px] text-white/60 transition-colors hover:text-gold-light">
                  {t('nav.home')}
                </Link>
              </li>
              {footerLinks.quick.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[13px] text-white/60 transition-colors hover:text-gold-light"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[10.5px] font-semibold uppercase tracking-mega text-gold">
              {t('footer.explore')}
            </h2>
            <ul className="mt-5 space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[13px] text-white/60 transition-colors hover:text-gold-light"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[10.5px] font-semibold uppercase tracking-mega text-gold">
              {t('footer.contact')}
            </h2>
            <div className="mt-5 space-y-4 text-[13px] text-white/60">
              <a
                href={school.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-3 leading-relaxed transition hover:border-gold/30 hover:bg-white/[0.06] hover:text-gold-light"
                aria-label="Open Royal Public School location in Google Maps"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold/20 bg-white/[0.06] text-gold">
                  <Icon name="pin" className="h-4 w-4" />
                </span>
                <span>{tl(school.address)}</span>
                <Icon name="arrowUpRight" className="ml-auto h-3.5 w-3.5 shrink-0 text-gold/70" />
              </a>
              <a
                href={school.phoneHref}
                className="group flex items-center gap-3 rounded-xl px-3 py-1.5 transition-colors hover:text-gold-light"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold/20 bg-white/[0.06] text-gold">
                  <Icon name="phone" className="h-4 w-4" />
                </span>
                {school.phoneDisplay}
                <Icon name="arrowUpRight" className="ml-auto h-3.5 w-3.5 text-gold/60" />
              </a>
              <a
                href={school.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl px-1 py-1.5 transition-colors hover:text-gold-light"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-[#4285F4]">
                  <Icon name="google" className="h-[18px] w-[18px]" />
                </span>
                {t('common.directions')}
                <Icon name="arrowUpRight" className="ml-auto h-3.5 w-3.5 text-gold/60" />
              </a>
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t('a11y.instagram')}`}
                className="group flex items-center gap-3 rounded-xl px-1 py-1.5 transition-colors hover:text-gold-light"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-instagram text-white shadow-[0_4px_16px_rgba(193,53,132,0.22)]">
                  <Icon name="instagram" className="h-[18px] w-[18px]" />
                </span>
                <span>{instagram.handle}</span>
                <Icon name="arrowUpRight" className="ml-auto h-3.5 w-3.5 text-gold/60" />
              </a>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl px-1 py-1.5 transition-colors hover:text-gold-light"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.18)]">
                  <Icon name="whatsapp" className="h-[18px] w-[18px]" />
                </span>
                WhatsApp
                <Icon name="arrowUpRight" className="ml-auto h-3.5 w-3.5 text-gold/60" />
              </a>
              {socialLinks.facebookUrl && (
                <a
                  href={socialLinks.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl px-1 py-1.5 transition-colors hover:text-gold-light"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#1877F2] text-white">
                    <Icon name="facebook" className="h-[18px] w-[18px]" />
                  </span>
                  Facebook
                  <Icon name="arrowUpRight" className="ml-auto h-3.5 w-3.5 text-gold/60" />
                </a>
              )}
              {socialLinks.googleReviewsUrl && (
                <a
                  href={socialLinks.googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl px-1 py-1.5 transition-colors hover:text-gold-light"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-[#4285F4]">
                    <Icon name="google" className="h-[18px] w-[18px]" />
                  </span>
                  Google reviews
                  <Icon name="arrowUpRight" className="ml-auto h-3.5 w-3.5 text-gold/60" />
                </a>
              )}
            </div>
            <Link
              to="/admissions"
              className="btn-gold mt-6 !px-5 !py-3 !text-[10px]"
            >
              {t('common.enquireNow')}
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-[10.5px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <p>
              © {YEAR} {tl(school.name)}. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-5">
              <Link to="/privacy" className="transition-colors hover:text-gold">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms" className="transition-colors hover:text-gold">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
          <a
            href="https://ybgp.in"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Looking to grow your business? Visit YBGP"
            className="ml-auto flex w-full items-center justify-between gap-5 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left shadow-sm transition hover:border-gold/40 hover:bg-white/[0.09] sm:w-auto sm:min-w-[330px]"
          >
            <span>
              <span className="block text-[12px] font-semibold text-white">Looking to grow your business?</span>
              <span className="mt-1 block text-[11px] text-gold-pale/75">Designed and developed by YBGP</span>
            </span>
            <span className="grid h-12 w-24 shrink-0 place-items-center rounded-lg bg-white px-2">
              <img
                src="/images/ybgp-logo.png"
                alt="YBGP"
                width={96}
                height={48}
                loading="lazy"
                decoding="async"
                className="max-h-9 w-auto max-w-full object-contain"
              />
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
