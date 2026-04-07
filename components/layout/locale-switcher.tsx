'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from '@/lib/i18n'
import { LOCALE_COOKIE, locales } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'

const LOCALE_DISPLAY: Record<Locale, string> = {
  'pt-BR': 'PT',
  en: 'EN',
}

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()

  function handleChange(newLocale: Locale) {
    if (newLocale === locale) return
    document.cookie = `${LOCALE_COOKIE}=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`
    router.refresh()
  }

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => handleChange(loc)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${locale === loc
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          {LOCALE_DISPLAY[loc]}
        </button>
      ))}
    </div>
  )
}
