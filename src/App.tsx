import { AnimatePresence } from 'framer-motion'
import { Suspense, lazy, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { BottomDock } from './components/BottomDock'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { InstallPrompt } from './components/InstallPrompt'
import { Preloader } from './components/Preloader'
import { ScrollProgress } from './components/ScrollProgress'
import { WhatsAppFab } from './components/WhatsAppFab'
import { useLanguage } from './i18n'
import { useLockBodyScroll } from './lib/hooks'
const Admin = lazy(() => import('./pages/Admin'))
const About = lazy(() => import('./pages/About'))
const Academics = lazy(() => import('./pages/Academics'))
const Admissions = lazy(() => import('./pages/Admissions'))
const CampusLife = lazy(() => import('./pages/CampusLife'))
const Contact = lazy(() => import('./pages/Contact'))
const Facilities = lazy(() => import('./pages/Facilities'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Home = lazy(() => import('./pages/Home'))
const Privacy = lazy(() => import('./pages/Legal').then(({ Privacy }) => ({ default: Privacy })))
const Terms = lazy(() => import('./pages/Legal').then(({ Terms }) => ({ default: Terms })))
const NotFound = lazy(() => import('./pages/NotFound'))
const VisionMission = lazy(() => import('./pages/VisionMission'))
const Updates = lazy(() => import('./pages/Updates'))

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const timer = window.setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 520)
    return () => window.clearTimeout(timer)
  }, [pathname, hash])

  return null
}

export default function App() {
  const { t } = useLanguage()
  const location = useLocation()
  const [booting, setBooting] = useState(true)
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isPreview = new URLSearchParams(location.search).has('preview')
  useLockBodyScroll(booting && !isAdminRoute)

  if (isAdminRoute) {
    return (
      <Suspense fallback={<p role="status" className="px-5 py-16 text-center text-slate-600">Loading admin panel…</p>}>
        <Admin />
      </Suspense>
    )
  }

  return (
    <div className="relative min-h-svh bg-cream">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-[10px] focus:font-bold focus:uppercase focus:tracking-[0.16em] focus:text-royal-deep"
      >
        {t('a11y.skip')}
      </a>

      {booting && <Preloader onDone={() => setBooting(false)} />}
      {isPreview && (
        <aside className="relative z-[130] flex flex-wrap items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-center text-xs font-semibold text-amber-950">
          <span>Private draft preview — this content has not been published.</span>
          <a
            href={location.pathname}
            className="rounded-full underline decoration-amber-700 underline-offset-2 hover:text-amber-800"
          >
            Exit preview
          </a>
        </aside>
      )}
      <InstallPrompt ready={!booting} />

      <ScrollProgress />
      <ScrollManager />
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <AnimatePresence mode="wait" initial={false}>
          <Suspense fallback={<p role="status" className="container-x py-16 text-slate-600">Loading page…</p>}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/vision-mission" element={<VisionMission />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/campus-life" element={<CampusLife />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/updates" element={<Updates />} />
              <Route path="/updates/:slug" element={<Updates />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>

      <Footer />
      <BottomDock />
      <WhatsAppFab />
    </div>
  )
}
