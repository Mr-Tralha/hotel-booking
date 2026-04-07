'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { I18nProvider } from '@/lib/i18n'
import type { Locale, Messages } from '@/lib/i18n'

interface ProvidersProps {
  children: ReactNode
  locale: Locale
  messages: Messages
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <I18nProvider locale={locale} messages={messages}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </I18nProvider>
  )
}
