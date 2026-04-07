import type { Locale } from './config'
import type { Messages } from './messages'

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

/**
 * Server-side translation function — works without React context.
 * Use in Server Components where useTranslations() is not available.
 */
export function getServerTranslations<NS extends keyof Messages>(
  messages: Messages,
  locale: Locale,
  namespace: NS,
) {
  const ns = messages[namespace]

  return function t(key: string, params?: Record<string, string | number>): string {
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
  }
}
