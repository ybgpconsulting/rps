import { EnquiryForm } from '../components/EnquiryForm'
import { Icon } from '../components/Icon'
import { Page } from '../components/Page'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { contactCopy, school, whatsappUrl } from '../data'
import { useLanguage } from '../i18n'
import { usePageSeo } from '../lib/seo'

export default function Contact() {
  const { tl, t } = useLanguage()
  usePageSeo('/contact')

  return (
    <Page>
      <PageHeader
        eyebrow={contactCopy.eyebrow}
        title={contactCopy.title}
        description={contactCopy.lead}
        image="school-gate"
        crumb={{ en: 'Contact Us', hi: 'संपर्क करें' }}
      />

      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x">
          <div className="grid gap-5 md:grid-cols-3">
            <Reveal>
              <a
                href={school.phoneHref}
                className="card-surface group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-royal text-gold">
                  <Icon name="phone" className="h-5 w-5" />
                </span>
                <p className="mt-5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-royal/45">
                  {tl(contactCopy.callTitle)}
                </p>
                <p className="mt-1.5 font-display text-xl text-royal">{school.phoneDisplay}</p>
                <p className="mt-3 text-[12px] leading-relaxed text-ink/55">{tl(contactCopy.callBody)}</p>
                <span className="link-underline mt-5">
                  {t('common.callNow')}
                  <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.06}>
              <a
                href={school.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-surface group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-royal text-gold">
                  <Icon name="pin" className="h-5 w-5" />
                </span>
                <p className="mt-5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-royal/45">
                  {tl(contactCopy.visitTitle)}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-royal/80">{tl(school.address)}</p>
                <p className="mt-3 text-[12px] leading-relaxed text-ink/55">{tl(contactCopy.visitBody)}</p>
                <span className="link-underline mt-5">
                  {t('common.directions')}
                  <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="card-surface flex h-full flex-col p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-royal text-gold">
                  <Icon name="clock" className="h-5 w-5" />
                </span>
                <p className="mt-5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-royal/45">
                  {t('common.schoolHours')}
                </p>
                <p className="mt-1.5 font-display text-lg leading-snug text-royal">
                  {t('common.callForTimings')}
                </p>
                <p className="mt-3 text-[12px] leading-relaxed text-ink/55">
                  {tl({
                    en: 'We publish timings only after they are confirmed with the school office.',
                    hi: 'हम समय केवल स्कूल कार्यालय से पुष्टि के बाद प्रकाशित करते हैं।',
                  })}
                </p>
                <a
                  href={whatsappUrl(
                    'Hello Royal Public School, I would like to ask about school timings and a campus visit.',
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline mt-5"
                >
                  {t('common.whatsapp')}
                  <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
                </a>
              </div>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-start">
            <Reveal>
              <div className="relative overflow-hidden rounded-[24px] border border-royal/10 bg-white shadow-soft">
                <iframe
                  src={school.mapsEmbed}
                  title={`${school.name.en} location map`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[380px] w-full border-0 sm:h-[460px]"
                />
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-royal/10 bg-white px-5 py-4">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-royal/40">
                      {tl(contactCopy.mapTitle)}
                    </p>
                    <p className="mt-1 text-[12px] text-royal/70">{tl(school.locality)}</p>
                  </div>
                  <a
                    href={school.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-navy !px-4 !py-2.5 !text-[9.5px]"
                  >
                    {t('common.openMap')}
                    <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </Reveal>

            <div>
              <SectionHeading
                eyebrow={{ en: 'Enquiry', hi: 'पूछताछ' }}
                title={contactCopy.formTitle}
                lead={contactCopy.formBody}
              />
              <Reveal delay={0.1}>
                <div className="mt-7">
                  <EnquiryForm />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}
