import type { Locale } from '../config'
import { ptBR } from './pt-BR'

type DeepStringify<T> = T extends string
  ? string
  : { readonly [K in keyof T]: DeepStringify<T[K]> }

export type Messages = DeepStringify<typeof ptBR>

/**
 * Returns messages for the given locale.
 * The default locale (pt-BR) is statically bundled.
 * Other locales are loaded on demand via dynamic import (~27KB saved from initial bundle).
 */
export async function getMessages(locale: Locale): Promise<Messages> {
  if (locale === 'pt-BR') return ptBR

  const { en } = await import('./en')
  // Compile-time shape check — TS ensures en satisfies Messages
  const _typeCheck: Messages = en
  void _typeCheck
  return en
}
