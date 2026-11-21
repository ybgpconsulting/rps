import '@fontsource-variable/fraunces'
import '@fontsource-variable/manrope'
import '@fontsource/noto-serif-devanagari/500.css'
import '@fontsource/noto-serif-devanagari/600.css'
import '@fontsource/noto-serif-devanagari/700.css'
import '@fontsource/noto-sans-devanagari/400.css'
import '@fontsource/noto-sans-devanagari/500.css'
import '@fontsource/noto-sans-devanagari/600.css'
import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LanguageProvider } from './i18n'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('The application root element was not found.')

createRoot(rootElement).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener(
    'load',
    () => {
      void navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((error: unknown) => {
        console.error('Unable to register the offline support service worker.', error)
      })
    },
    { once: true },
  )
}
