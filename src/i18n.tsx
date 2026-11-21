import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { dictionary } from './translations'

export type Lang = 'en' | 'hi'
export type Localized = { en: string; hi: string }

export type DictionaryKey = keyof typeof dictionary

type LanguageValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
  t: (key: DictionaryKey) => string
  tl: (value: Localized) => string
}

const LanguageContext = createContext<LanguageValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = window.localStorage.getItem('rps-lang')
      if (stored === 'en' || stored === 'hi') return stored
    } catch {
      /* storage unavailable */
    }
    return 'en'
  })

  const setLang = useCallback((next: Lang) => setLangState(next), [])

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      window.localStorage.setItem('rps-lang', lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang])

  const value = useMemo<LanguageValue>(
    () => ({
      lang,
      setLang,
      toggle: () => setLangState((current) => (current === 'en' ? 'hi' : 'en')),
      t: (key) => dictionary[key][lang],
      tl: (text) => text[lang],
    }),
    [lang, setLang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}
