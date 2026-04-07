'use client'

import Link from 'next/link'
import { useTranslations } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

export default function BookingNotFound() {
  const t = useTranslations('notFound')

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-300">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{t('bookingTitle')}</h1>
        <p className="mt-2 text-sm text-gray-500">{t('bookingDescription')}</p>
        <Link href="/" className="mt-6 inline-block">
          <Button>{t('backToHome') as string}</Button>
        </Link>
      </div>
    </main>
  )
}
