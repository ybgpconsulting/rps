import { Link } from 'react-router-dom'
import { AdmissionsCta } from '../components/AdmissionsCta'
import { Icon } from '../components/Icon'
import { Page } from '../components/Page'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { useLanguage } from '../i18n'
import { school, transport, whatsappUrl } from '../data'
import { usePageSeo } from '../lib/seo'

const serviceAreas = [
  { en: 'Tatiri', hi: 'ततिरी' },
  { en: 'Baghpat city', hi: 'बागपत शहर' },
]

const transportFaqs = [
  {
    question: { en: 'Are the school buses air-conditioned?', hi: 'क्या स्कूल की बसें वातानुकूलित हैं?' },
    answer: {
      en: 'The school information states that all school-owned buses on every route are fully air-conditioned.',
      hi: 'स्कूल की जानकारी के अनुसार हर मार्ग पर स्कूल के स्वामित्व वाली सभी बसें पूर्णतः वातानुकूलित हैं।',
    },
  },
  {
    question: { en: 'Which areas are listed for transport?', hi: 'परिवहन के लिए कौन-से क्षेत्र बताए गए हैं?' },
    answer: {
      en: 'Tatiri and Baghpat city are the areas currently listed. Please contact the school to confirm a specific pickup point.',
      hi: 'वर्तमान में ततिरी और बागपत शहर का उल्लेख है। किसी विशेष पिकअप स्थान की पुष्टि के लिए स्कूल से संपर्क करें।',
    },
  },
  {
    question: { en: 'Does the school bus stop in my village?', hi: 'क्या स्कूल बस मेरे गाँव में रुकती है?' },
    answer: {
      en: 'Village-level routes and stops have not been published as confirmed. Call the school office to ask about your location.',
      hi: 'गाँव-स्तर के मार्गों और स्टॉप की पुष्टि प्रकाशित नहीं है। अपने स्थान के बारे में स्कूल कार्यालय को कॉल करें।',
    },
  },
  {
    question: { en: 'How can I confirm timings and availability?', hi: 'समय और उपलब्धता की पुष्टि कैसे करें?' },
    answer: {
      en: 'Call or WhatsApp the school. Route availability, pickup points, and schedules should be confirmed directly with the office.',
      hi: 'स्कूल को कॉल या व्हाट्सऐप करें। मार्ग, पिकअप स्थान और समय-सारणी की पुष्टि सीधे कार्यालय से करें।',
    },
  },
]

export default function Transport() {
  const { t, tl } = useLanguage()
  usePageSeo('/transport')

  return (
    <Page>
      <PageHeader
        eyebrow={{ en: 'School transport', hi: 'स्कूल परिवहन' }}
        title={{ en: 'A more comfortable school journey.', hi: 'स्कूल तक अधिक आरामदायक सफ़र।' }}
        description={transport.title}
        image="school-building"
        crumb={{ en: 'Transport', hi: 'परिवहन' }}
      />

      <section className="bg-cream py-16 sm:py-20">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <article className="h-full rounded-[28px] bg-royal-deep p-7 text-white shadow-soft sm:p-10">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-gold/25 bg-gold/10 text-gold">
                  <Icon name="snowflake" className="h-6 w-6" />
                </span>
                <p className="eyebrow-light mt-7">{tl({ en: 'Comfort on the way to school', hi: 'स्कूल के रास्ते में आराम' })}</p>
                <h2 className="display-section mt-3 text-white">{tl(transport.title)}</h2>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70">{tl(transport.body)}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href={school.phoneHref} className="btn-gold">
                    <Icon name="phone" className="h-4 w-4" />
                    {t('common.callNow')}
                  </a>
                  <a
                    href={whatsappUrl('Hello, I would like to enquire about school transport availability and pickup points.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-light"
                  >
                    {t('common.whatsapp')}
                    <Icon name="arrowUpRight" className="h-4 w-4" />
                  </a>
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="h-full rounded-[28px] border border-royal/10 bg-white p-7 shadow-soft sm:p-10">
                <p className="eyebrow">{tl({ en: 'Transport overview', hi: 'परिवहन का परिचय' })}</p>
                <h2 className="mt-3 font-display text-3xl leading-tight text-royal">
                  {tl({ en: 'School-owned and fully air-conditioned.', hi: 'स्कूल के स्वामित्व वाली और पूर्णतः वातानुकूलित।' })}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink/65">
                  {tl({
                    en: 'The school lists transport availability in Tatiri and Baghpat city. Exact routes, stops, schedules, and availability for a particular address are confirmed by the school office.',
                    hi: 'स्कूल ततिरी और बागपत शहर में परिवहन उपलब्धता बताता है। किसी पते के लिए सटीक मार्ग, स्टॉप, समय और उपलब्धता की पुष्टि स्कूल कार्यालय करता है।',
                  })}
                </p>
                <ul className="mt-7 space-y-3">
                  {[
                    { icon: 'bus' as const, label: { en: 'School-owned buses', hi: 'स्कूल के स्वामित्व वाली बसें' } },
                    { icon: 'snowflake' as const, label: { en: 'Fully air-conditioned transport', hi: 'पूर्णतः वातानुकूलित परिवहन' } },
                  ].map((item) => (
                    <li key={item.icon} className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3 text-sm font-semibold text-royal">
                      <Icon name={item.icon} className="h-5 w-5 shrink-0 text-gold-deep" />
                      {tl(item.label)}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow={{ en: 'Coverage information', hi: 'सेवा क्षेत्र की जानकारी' }}
            title={{ en: 'Check your pickup point with the school.', hi: 'अपने पिकअप स्थान की स्कूल से पुष्टि करें।' }}
            lead={{
              en: 'The currently published service areas are Tatiri and Baghpat city. Nearby village names and stops are not presented as confirmed bus routes unless the school verifies them.',
              hi: 'वर्तमान में प्रकाशित सेवा क्षेत्र ततिरी और बागपत शहर हैं। स्कूल की पुष्टि के बिना आसपास के गाँवों और स्टॉप को बस मार्ग के रूप में नहीं दिखाया जाता।',
            }}
          />

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {serviceAreas.map((area) => (
              <article key={area.en} className="rounded-2xl border border-royal/10 bg-cream p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-royal-deep text-gold">
                    <Icon name="pin" className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-royal">{tl(area)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink/65">
                      {tl({ en: 'Enquire to confirm the nearest pickup point and current availability.', hi: 'निकटतम पिकअप स्थान और वर्तमान उपलब्धता की पुष्टि के लिए पूछताछ करें।' })}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-gold/25 bg-gold/[0.07] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Icon name="map" className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" />
              <p className="max-w-3xl text-sm leading-relaxed text-ink/70">
                {tl({
                  en: 'For a nearby village or a specific address, ask the school before relying on transport availability. The school location is available on Google Maps.',
                  hi: 'किसी आसपास के गाँव या पते के लिए परिवहन पर भरोसा करने से पहले स्कूल से पूछें। स्कूल का स्थान गूगल मैप्स पर उपलब्ध है।',
                })}
              </p>
            </div>
            <a href={school.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline shrink-0">
              {t('common.openMap')}
              <Icon name="arrowUpRight" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow={{ en: 'Parent FAQs', hi: 'अभिभावकों के प्रश्न' }}
            title={{ en: 'Transport questions, answered clearly.', hi: 'परिवहन से जुड़े प्रश्नों के स्पष्ट उत्तर।' }}
          />
          <dl className="mt-8 grid gap-4 md:grid-cols-2">
            {transportFaqs.map((faq) => (
              <div key={faq.question.en} className="rounded-2xl border border-royal/10 bg-white p-6">
                <dt className="font-display text-lg text-royal">{tl(faq.question)}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink/65">{tl(faq.answer)}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 text-center">
            <Link to="/admissions#enquiry" className="btn-gold">
              {t('common.enquireNow')}
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <AdmissionsCta />
    </Page>
  )
}
