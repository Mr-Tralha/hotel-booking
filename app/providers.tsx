'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect, type ReactNode } from 'react'
import { I18nProvider } from '@/lib/i18n'
import type { Locale, Messages } from '@/lib/i18n'
import { useHistoryStore } from '@/stores/history-store'
import { useReservationsStore } from '@/stores/reservations-store'
import { useUserStore } from '@/stores/user-store'

interface ProvidersProps {
  children: ReactNode
  locale: Locale
  messages: Messages
}

function StoreHydrator() {
  useEffect(() => {
    useHistoryStore.persist.rehydrate()
    useReservationsStore.persist.rehydrate()
    useUserStore.persist.rehydrate()
  }, [])
  return null
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
      <QueryClientProvider client={queryClient}>
        <StoreHydrator />
        {children}
      </QueryClientProvider>
    </I18nProvider>
  )
}
