import { useState } from 'react'
import { EnquiryForm } from '../components/EnquiryForm'
import { Faq } from '../components/Faq'
import { Icon } from '../components/Icon'
import { Page } from '../components/Page'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { admissionsCopy, faqs, school, whatsappUrl } from '../data'
import { useLanguage } from '../i18n'
import { usePageSeo } from '../lib/seo'

export default function Admissions() {
  const { tl, t } = useLanguage()
  usePageSeo('/admissions')
  const [waHref] = useState(() =>
    whatsappUrl('Hello Royal Public School, I would like to enquire about admission.'),
  )

  return (
    <Page>
      <PageHeader
        eyebrow={admissionsCopy.eyebrow}
        title={admissionsCopy.title}
        description={admissionsCopy.lead}
        image="gate-daylight"
        crumb={{ en: 'Admissions', hi: 'प्रवेश' }}
      />

      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow={{ en: 'The process', hi: 'प्रक्रिया' }}
            title={admissionsCopy.stepsTitle}
            lead={{
              en: 'No long forms, no pressure. Start with a conversation and take it one step at a time.',
              hi: 'लंबे फ़ॉर्म नहीं, कोई दबाव नहीं। बातचीत से शुरुआत करें और एक-एक कदम आगे बढ़ें।',
            }}
          />

          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {admissionsCopy.steps.map((step, index) => (
              <Reveal key={step.no} delay={index * 0.06}>
                <li className="relative h-full overflow-hidden rounded-[22px] border border-royal/10 bg-white p-6">
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-gold to-gold/10" />
                  <span className="font-display text-3xl text-gold/60">{step.no}</span>
                  <h3 className="mt-3 font-display text-xl text-royal">{tl(step.title)}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-ink/60">{tl(step.body)}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.2}>
            <p className="mt-8 flex items-start gap-2 rounded-2xl border border-royal/10 bg-white px-5 py-4 text-[11.5px] leading-relaxed text-ink/50">
              <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
              {tl(admissionsCopy.note)}
            </p>
          </Reveal>
        </div>
      </section>

      <section id="enquiry" className="scroll-mt-28 bg-white py-20 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.08fr] lg:items-start lg:gap-16">
          <div>
            <p className="eyebrow">{t('nav.enquire')}</p>
            <Reveal>
              <h2 className="display-section mt-4 text-balance text-royal">{tl(admissionsCopy.formTitle)}</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-ink/65">
                {tl(admissionsCopy.formBody)}
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-8 rounded-[22px] border border-gold/30 bg-gold/[0.06] p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-deep">
                  {tl(admissionsCopy.documentsTitle)}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {admissionsCopy.documents.map((doc) => (
                    <li key={doc.en} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-royal/75">
                      <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" />
                      {tl(doc)}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={school.phoneHref} className="btn-navy">
                <Icon name="phone" className="h-4 w-4" />
                {school.phoneDisplay}
              </a>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <Icon name="whatsapp" className="h-4 w-4" />
                {t('common.whatsapp')}
              </a>
            </div>
          </div>

          <Reveal delay={0.1}>
            <EnquiryForm />
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <SectionHeading
              eyebrow={{ en: 'Questions', hi: 'प्रश्न' }}
              title={{ en: 'Before you apply.', hi: 'आवेदन से पहले।' }}
              lead={{
                en: 'A few answers that parents usually ask for. If your question is not here, call the office.',
                hi: 'अभिभावकों के कुछ सामान्य प्रश्नों के उत्तर। यदि आपका प्रश्न यहाँ नहीं है, तो कार्यालय को कॉल करें।',
              }}
            />
            <Reveal delay={0.15}>
              <a href={school.phoneHref} className="mt-7 inline-flex items-center gap-2 text-[13px] font-semibold text-royal hover:text-gold-deep">
                <Icon name="phone" className="h-4 w-4" />
                {school.phoneDisplay}
              </a>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Faq items={faqs} />
          </Reveal>
        </div>
      </section>
    </Page>
  )
}
