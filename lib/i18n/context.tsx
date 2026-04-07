'use client'

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import type { Locale } from './config'
import type { Messages } from './messages'

interface I18nContextValue {
  locale: Locale
  messages: Messages
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale
  messages: Messages
  children: ReactNode
}) {
  const value = useMemo(() => ({ locale, messages }), [locale, messages])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export function useLocale(): Locale {
  return useI18n().locale
}

function resolveNested(obj: unknown, key: string): unknown {
  let current = obj
  for (const part of key.split('.')) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }
  return current
}

export function useTranslations<NS extends keyof Messages>(namespace: NS) {
  const { messages, locale } = useI18n()
  const ns = messages[namespace]

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let resolvedKey = key

      if (params && typeof params.count === 'number') {
        const rule = new Intl.PluralRules(locale).select(params.count)
        const pluralKey = `${key}_${rule}`
        if (resolveNested(ns, pluralKey) !== undefined) {
          resolvedKey = pluralKey
        } else if (rule !== 'other') {
          const fallbackKey = `${key}_other`
          if (resolveNested(ns, fallbackKey) !== undefined) {
            resolvedKey = fallbackKey
          }
        }
      }

      const value = resolveNested(ns, resolvedKey)
      if (typeof value !== 'string') return key

      let result = value
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          result = result.replaceAll(`{${k}}`, String(v))
        }
      }
      return result
    },
    [ns, locale],
  )

  return t
}
