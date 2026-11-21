export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

let deferredInstallPrompt: InstallPromptEvent | null = null
const installPromptListeners = new Set<(event: InstallPromptEvent) => void>()

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    const installEvent = event as InstallPromptEvent
    deferredInstallPrompt = installEvent
    installPromptListeners.forEach((listener) => listener(installEvent))
  })

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null
    window.dispatchEvent(new Event('rps-appinstalled'))
  })
}

export function subscribeToInstallPrompt(listener: (event: InstallPromptEvent) => void) {
  installPromptListeners.add(listener)
  if (deferredInstallPrompt) listener(deferredInstallPrompt)
  return () => {
    installPromptListeners.delete(listener)
  }
}

export function clearInstallPrompt(event: InstallPromptEvent) {
  if (deferredInstallPrompt === event) deferredInstallPrompt = null
}
