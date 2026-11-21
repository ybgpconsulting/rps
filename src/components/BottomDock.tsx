import { NavLink } from 'react-router-dom'
import { useLanguage } from '../i18n'
import { cn } from '../lib/cn'
import type { DictionaryKey } from '../i18n'
import type { IconName } from './Icon'
import { Icon } from './Icon'

const tabs: { to: string; key: DictionaryKey; icon: IconName }[] = [
  { to: '/', key: 'nav.home', icon: 'home' },
  { to: '/admissions', key: 'nav.admissions', icon: 'cap' },
  { to: '/updates', key: 'nav.updates', icon: 'news' },
  { to: '/gallery', key: 'nav.gallery', icon: 'image' },
  { to: '/contact', key: 'nav.contact', icon: 'phone' },
]

export function BottomDock() {
  const { t } = useLanguage()

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-3 bottom-3 z-40 lg:hidden"
    >
      <div className="safe-bottom rounded-[24px] border border-royal/10 bg-cream/95 shadow-[0_24px_60px_-20px_rgba(10,27,51,0.5)] backdrop-blur-xl">
        <ul className="grid h-[68px] grid-cols-[0.85fr_0.95fr_1.35fr_0.85fr_0.85fr] items-stretch px-1">
          {tabs.map((tab) => {
            const isFeatured = tab.to === '/updates'
            return (
              <li key={tab.to} className="relative flex">
                <NavLink
                  to={tab.to}
                  end={tab.to === '/'}
                  className={cn(
                    'group flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-gold-deep',
                    isFeatured ? 'relative' : '',
                  )}
                >
                  {({ isActive }) => (
                    <>
                      {isFeatured ? (
                        <span
                          className={cn(
                            'flex h-[46px] w-[46px] items-center justify-center rounded-full bg-royal-deep text-gold-light shadow-[0_5px_16px_-4px_rgba(10,27,51,0.55)] ring-[3px] ring-cream transition-transform duration-200',
                            isActive ? 'outline outline-2 outline-gold/70' : '',
                            'group-active:scale-95',
                          )}
                        >
                          <Icon name={tab.icon} className="h-[22px] w-[22px]" />
                        </span>
                      ) : (
                        <Icon
                          name={tab.icon}
                          className={cn(
                            'h-[21px] w-[21px] transition-colors',
                            isActive ? 'text-royal-deep' : 'text-royal/55',
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          'max-w-full truncate text-[9px] font-semibold leading-none transition-colors',
                          isFeatured
                            ? 'whitespace-nowrap text-[10px] tracking-[-0.03em]'
                            : 'uppercase tracking-[0.04em]',
                          isActive ? 'text-royal-deep' : 'text-royal/60',
                        )}
                      >
                        {tab.to === '/admissions' ? t('common.enquireNow') : t(tab.key)}
                      </span>
                      {!isFeatured && (
                        <span
                          aria-hidden="true"
                          className={cn(
                            'absolute bottom-1.5 h-1 w-1 rounded-full bg-gold-deep transition-opacity',
                            isActive ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
