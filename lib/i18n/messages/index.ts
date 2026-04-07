import type { Locale } from '../config'
import { ptBR } from './pt-BR'
import { en } from './en'

type DeepStringify<T> = T extends string
  ? string
  : { readonly [K in keyof T]: DeepStringify<T[K]> }

export type Messages = DeepStringify<typeof ptBR>

// Compile-time check: en must match pt-BR shape
const _typeCheck: Messages = en
void _typeCheck

const allMessages: Record<Locale, Messages> = {
  'pt-BR': ptBR,
  en,
}

export function getMessages(locale: Locale): Messages {
  return allMessages[locale]
}
