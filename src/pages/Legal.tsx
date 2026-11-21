import { Icon } from '../components/Icon'
import { Page } from '../components/Page'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { legalCopy, school } from '../data'
import { useLanguage } from '../i18n'
import { usePageSeo } from '../lib/seo'

function LegalLayout({ kind }: { kind: 'privacy' | 'terms' }) {
  const { tl } = useLanguage()
  usePageSeo(kind === 'privacy' ? '/privacy' : '/terms')

  const title = kind === 'privacy' ? legalCopy.privacyTitle : legalCopy.termsTitle
  const intro = kind === 'privacy' ? legalCopy.privacyIntro : legalCopy.termsIntro
  const sections = kind === 'privacy' ? legalCopy.privacySections : legalCopy.termsSections

  return (
    <Page>
      <PageHeader
        eyebrow={{ en: 'Legal', hi: 'कानूनी' }}
        title={title}
        description={intro}
        image="school-building"
        crumb={title}
      />

      <section className="bg-cream py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[220px_1fr] lg:items-start">
          <aside className="lg:sticky lg:top-28">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-royal/40">
              {tl(legalCopy.updated)}
            </p>
            <div className="mt-5 rounded-2xl border border-royal/10 bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold-deep">
                {tl({ en: 'School office', hi: 'स्कूल कार्यालय' })}
              </p>
              <a
                href={school.phoneHref}
                className="mt-2 block font-display text-lg text-royal hover:text-gold-deep"
              >
                {school.phoneDisplay}
              </a>
              <a
                href={school.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-ink/55 hover:text-royal"
              >
                <Icon name="pin" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" />
                {tl(school.address)}
              </a>
            </div>
          </aside>

          <div className="prose-legal max-w-3xl rounded-[24px] border border-royal/10 bg-white p-7 sm:p-10">
            {sections.map((section, index) => (
              <Reveal key={section.heading.en} delay={index * 0.04}>
                <section>
                  <h2 className={index === 0 ? '!mt-0' : undefined}>{tl(section.heading)}</h2>
                  <p>{tl(section.body)}</p>
                </section>
              </Reveal>
            ))}
            <p className="!mb-0 mt-10 rounded-xl border border-gold/25 bg-gold/[0.06] p-4 text-[12px] text-royal/70">
              {tl({
                en: 'This policy is written for clarity, not legal complexity. For any question, please contact the school office directly.',
                hi: 'यह नीति स्पष्टता के लिए लिखी गई है, कानूनी जटिलता के लिए नहीं। किसी भी प्रश्न के लिए कृपया सीधे स्कूल कार्यालय से संपर्क करें।',
              })}
            </p>
          </div>
        </div>
      </section>
    </Page>
  )
}

export function Privacy() {
  return <LegalLayout kind="privacy" />
}

export function Terms() {
  return <LegalLayout kind="terms" />
}
