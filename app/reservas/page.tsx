'use client'

import { useReservationsStore } from '@/stores/reservations-store'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useTranslations, useLocale } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ReservasPage() {
  const bookings = useReservationsStore((s) => s.bookings)
  const t = useTranslations('reservations')
  const tc = useTranslations('common')
  const locale = useLocale()

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        {t('title')}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {t('subtitle')}
      </p>

      {bookings.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <CalendarIcon />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            {t('empty')}
          </p>
          <Link href="/" className="mt-4">
            <Button>{t('searchHotels')}</Button>
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <h2 className="font-semibold text-gray-900">
                    {booking.hotelName}
                  </h2>
                  <p className="text-sm text-gray-500">{booking.hotelAddress}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 self-start">
                  {t('confirmed')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div>
                  <p className="text-gray-500">{t('checkIn')}</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(new Date(booking.checkIn), locale)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">{t('checkOut')}</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(new Date(booking.checkOut), locale)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">{t('guests')}</p>
                  <p className="font-medium text-gray-900">
                    {tc('adultCount', { count: booking.adults })}
                    {booking.children > 0 &&
                      `, ${tc('childCount', { count: booking.children })}`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">{t('total')}</p>
                  <p className="font-bold text-gray-900">
                    {formatCurrency(booking.total, locale)}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-400">
                  {t('bookingId', { id: booking.id.slice(0, 8) })}... &middot;{' '}
                  {formatDate(new Date(booking.createdAt), locale)}
                </p>
                <p className="text-xs text-gray-500">
                  {tc('roomCount', { count: booking.rooms.length })}:{' '}
                  {booking.rooms.map((r) => r.name).join(', ')}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
