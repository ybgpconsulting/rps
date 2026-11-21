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
import { initializeSiteContent } from './lib/site-content'

async function startApplication() {
  await initializeSiteContent()
  const root = document.getElementById('root')
  if (!root) throw new Error('The application root element was not found.')

  createRoot(root).render(
    <StrictMode>
      <LanguageProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LanguageProvider>
    </StrictMode>,
  )
}

void startApplication()
