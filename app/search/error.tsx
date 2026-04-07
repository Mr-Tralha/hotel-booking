'use client'

import { useTranslations } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

export default function SearchError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error')

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-sm text-gray-500">{t('description')}</p>
        <div className="mt-6">
          <Button onClick={reset}>{t('tryAgain')}</Button>
        </div>
      </div>
    </main>
  )
}
