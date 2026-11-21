import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n'
import { clearInstallPrompt, subscribeToInstallPrompt, type InstallPromptEvent } from '../lib/pwa-install'
import { Icon } from './Icon'

function isRunningAsInstalledApp() {
  const standaloneDisplay = window.matchMedia('(display-mode: standalone)').matches
  const iosStandalone =
    'standalone' in navigator &&
    (navigator as Navigator & { standalone?: boolean }).standalone === true

  return standaloneDisplay || iosStandalone
}

function isIosDevice() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

export function InstallPrompt({ ready }: { ready: boolean }) {
  const { t } = useLanguage()
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(
    () => typeof window !== 'undefined' && isRunningAsInstalledApp(),
  )
  const [isDismissed, setIsDismissed] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [error, setError] = useState('')
  const [isIos] = useState(() => typeof navigator !== 'undefined' && isIosDevice())

  useEffect(() => {
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setInstallEvent(null)
    }

    const unsubscribe = subscribeToInstallPrompt(setInstallEvent)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      unsubscribe()
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  async function handleInstall() {
    if (!installEvent) {
      if (isIos || showInstructions) {
        setIsDismissed(true)
      } else {
        setShowInstructions(true)
      }
      return
    }

    try {
      await installEvent.prompt()
      const choice = await installEvent.userChoice
      clearInstallPrompt(installEvent)
      setInstallEvent(null)
      if (choice.outcome === 'accepted') {
        setIsInstalled(true)
      } else {
        setShowInstructions(true)
      }
    } catch {
      clearInstallPrompt(installEvent)
      setInstallEvent(null)
      setError(t('install.error'))
    }
  }

  if (!ready || isInstalled || isDismissed) return null

  const instructions = isIos
    ? t('install.iosInstructions')
    : t('install.browserInstructions')

  return (
    <aside
      aria-label={t('install.title')}
      className="fixed inset-x-3 bottom-32 z-[110] sm:left-auto sm:right-5 sm:w-[416px] lg:bottom-24"
    >
      <div className="flex items-center gap-2 rounded-2xl border border-gold/35 bg-cream p-2 shadow-[0_18px_48px_-16px_rgba(10,27,51,0.55)]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-royal-deep text-gold-light">
          <Icon name="download" className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-xs font-semibold text-royal-deep">
            {t('install.title')}
          </p>
          <p className="mt-0.5 text-[10px] leading-tight text-royal/75">
            {isIos || showInstructions ? instructions : t('install.description')}
          </p>
          {error && (
            <p role="alert" className="mt-1 text-[10px] font-medium text-red-700">
              {error}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleInstall}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-gold px-2.5 text-[10px] font-bold text-royal-deep transition-colors hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
        >
          {installEvent
            ? t('install.action')
            : isIos || showInstructions
              ? t('install.done')
              : t('install.howTo')}
        </button>
        <button
          type="button"
          aria-label={t('install.dismiss')}
          onClick={() => setIsDismissed(true)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-royal/60 transition-colors hover:bg-royal/5 hover:text-royal-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-deep"
        >
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}
