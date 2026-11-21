import { Link } from 'react-router-dom'
import { AdmissionsCta } from '../components/AdmissionsCta'
import { Icon } from '../components/Icon'
import { Page } from '../components/Page'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { SmartImage } from '../components/SmartImage'
import { TiltCard } from '../components/TiltCard'
import { academicStages, academicsCopy, school } from '../data'
import { useLanguage } from '../i18n'
import { usePageSeo } from '../lib/seo'

export default function Academics() {
  const { tl, t } = useLanguage()
  usePageSeo('/academics')

  return (
    <Page>
      <PageHeader
        eyebrow={academicsCopy.eyebrow}
        title={academicsCopy.title}
        description={academicsCopy.lead}
        image="class-group"
        crumb={{ en: 'Academics', hi: 'शैक्षणिक' }}
      />

      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.4fr] lg:gap-20">
            <div>
              <SectionHeading
                eyebrow={{ en: 'Curriculum', hi: 'पाठ्यक्रम' }}
                title={{ en: 'A CBSE curriculum, taught with care.', hi: 'देखभाल के साथ पढ़ाया जाने वाला सीबीएसई पाठ्यक्रम।' }}
              />
              <p className="mt-6 text-[14.5px] leading-[1.85] text-ink/70">
                {tl({
                  en: 'We follow the CBSE curriculum and focus on understanding rather than rote learning. Students are encouraged to ask questions, explain their thinking, and build habits that last beyond the exam.',
                  hi: 'हम सीबीएसई पाठ्यक्रम का पालन करते हैं और रटने की बजाय समझ पर ध्यान देते हैं। विद्यार्थियों को प्रश्न पूछने, अपनी सोच समझाने और परीक्षा से आगे टिकने वाली आदतें बनाने के लिए प्रोत्साहित किया जाता है।',
                })}
              </p>
              <div className="mt-7 rounded-2xl border border-gold/30 bg-gold/[0.07] p-5">
                <p className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-royal/75">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
                  {tl(academicsCopy.note)}
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={school.phoneHref} className="btn-navy">
                  <Icon name="phone" className="h-4 w-4" />
                  {t('common.call')}
                </a>
                <Link to="/admissions" className="btn-outline">
                  {t('nav.admissions')}
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="space-y-5">
              {academicStages.map((stage, index) => (
                <Reveal key={stage.title.en} delay={index * 0.07}>
                  <article className="card-surface group grid overflow-hidden sm:grid-cols-[220px_1fr]">
                    <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:h-full">
                      <SmartImage
                        name={stage.image}
                        alt={tl(stage.title)}
                        sizes="(max-width: 640px) 100vw, 220px"
                        imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-royal-deep/70 px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-gold-pale backdrop-blur-sm">
                        {tl(stage.tag)}
                      </span>
                    </div>
                    <div className="relative p-6">
                      <span aria-hidden="true" className="absolute right-5 top-4 font-display text-3xl text-royal/10">
                        {stage.no}
                      </span>
                      <h3 className="display-card text-royal">{tl(stage.title)}</h3>
                      <p className="mt-2.5 text-[13px] leading-relaxed text-ink/60">{tl(stage.body)}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow={{ en: 'Inside the classroom', hi: 'कक्षा के भीतर' }}
            title={{ en: 'How our teaching works.', hi: 'हमारा शिक्षण कैसे काम करता है।' }}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {academicsCopy.approach.map((item, index) => (
              <Reveal key={item.title.en} delay={index * 0.06}>
                <TiltCard className="h-full" max={5}>
                  <article className="h-full rounded-[22px] border border-royal/10 bg-cream p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-royal text-gold">
                      <Icon name={item.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 font-display text-[19px] text-royal">{tl(item.title)}</h3>
                    <p className="mt-2.5 text-[13px] leading-relaxed text-ink/60">{tl(item.body)}</p>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <div className="container-x">
          <Reveal>
            <div className="grid gap-8 rounded-[24px] border border-royal/10 bg-white p-7 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <div>
                <p className="eyebrow">{tl({ en: 'A note for parents', hi: 'अभिभावकों के लिए' })}</p>
                <h2 className="display-section mt-4 text-royal">
                  {tl({ en: 'Every child learns at their own pace.', hi: 'हर बच्चा अपनी गति से सीखता है।' })}
                </h2>
                <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-ink/65">
                  {tl({
                    en: 'If your child needs extra support or more challenge, we want to hear about it. Talk to the school office and we will work out the right approach together.',
                    hi: 'यदि आपके बच्चे को अतिरिक्त सहयोग या अधिक चुनौती चाहिए, तो हमें बताएँ। स्कूल कार्यालय से बात करें और हम मिलकर सही तरीका तय करेंगे।',
                  })}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a href={school.phoneHref} className="btn-navy w-full">
                  <Icon name="phone" className="h-4 w-4" />
                  {school.phoneDisplay}
                </a>
                <Link to="/admissions#enquiry" className="btn-gold w-full">
                  {t('common.enquireNow')}
                  <Icon name="arrowRight" className="h-4 w-4" />
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
