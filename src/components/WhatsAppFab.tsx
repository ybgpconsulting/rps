import { school, whatsappUrl } from '../data'
import { useLanguage } from '../i18n'
import { Icon } from './Icon'

export function WhatsAppFab() {
  const { t } = useLanguage()
  const href = whatsappUrl(
    `Hello ${school.name.en}, I would like to know more about admissions at your Tatiri campus.`,
  )

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${t('common.whatsapp')} — ${school.name.en}`}
      className="group fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-royal text-gold shadow-lift ring-1 ring-gold/50 transition-all duration-300 hover:-translate-y-1 hover:bg-royal-soft lg:flex"
    >
      <Icon name="whatsapp" className="h-6 w-6" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full border border-royal/10 bg-cream px-3.5 py-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-royal opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100">
        {t('common.whatsapp')}
      </span>
    </a>
  )
}
