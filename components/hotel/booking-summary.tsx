'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useBookingStore } from '@/stores/booking-store'
import { formatCurrency, formatDate, calculateNights, calculateTotal } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ShareButton } from '@/components/hotel/share-button'
import { useTranslations, useLocale } from '@/lib/i18n'
import type { Hotel } from '@/types/mock-db'

interface BookingSummaryProps {
  hotel: Hotel
}

export function BookingSummary({ hotel }: BookingSummaryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedRooms = useBookingStore((s) => s.selectedRooms)
  const setHotel = useBookingStore((s) => s.setHotel)
  const setSearchParams = useBookingStore((s) => s.setSearchParams)
  const t = useTranslations('hotel')
  const tc = useTranslations('common')
  const locale = useLocale()

  // URL uses camelCase (checkIn/checkOut) — must match use-search-filters
  const checkIn = searchParams.get('checkIn') ?? ''
  const checkOut = searchParams.get('checkOut') ?? ''
  const adults = Number(searchParams.get('adults')) || 2
  const children = Number(searchParams.get('children')) || 0
  const roomsCount = Number(searchParams.get('rooms')) || 1

  const hasRooms = selectedRooms.length > 0
  const hasDates = checkIn !== '' && checkOut !== ''
  const isSingle = selectedRooms.length === 1
  const isMultiple = selectedRooms.length > 1
  const roomsSelected = selectedRooms.length
  const roomsStillNeeded = Math.max(0, roomsCount - roomsSelected)
  const hasEnoughRooms = roomsSelected >= roomsCount

  const nights = hasDates
    ? calculateNights(new Date(checkIn), new Date(checkOut))
    : 0

  const total = hasRooms && nights > 0
    ? calculateTotal(selectedRooms, nights)
    : 0

  function handleCheckout() {
    setHotel(hotel)
    if (checkIn && checkOut) {
      setSearchParams({
        checkIn,
        checkOut,
        adults: Number(searchParams.get('adults')) || 2,
        children: Number(searchParams.get('children')) || 0,
        rooms: Number(searchParams.get('rooms')) || 1,
      })
    }
    router.push('/checkout')
  }

  return (
    <aside className="space-y-4">
      <div className="sticky top-16 rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        {/* Rating + Share — always visible, same row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-sm font-bold text-blue-700">
              <StarIcon />
              {hotel.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">
              {tc('reviewCount', { count: hotel.reviewCount })}
            </span>
          </div>
          <ShareButton hotelName={hotel.name} />
        </div>

        {hasRooms ? (
          <div className="space-y-3">
            {/* Single room */}
            {isSingle && (
              <div>
                <span className="text-sm text-gray-500">{selectedRooms[0].name}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedRooms[0].pricePerNight, locale)}
                  </span>
                  <span className="text-sm text-gray-500">{tc('perNight')}</span>
                </div>
              </div>
            )}

            {/* Multiple rooms */}
            {isMultiple && (
              <>
                <div className="rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                  {t('roomsSelectedBadge', { count: selectedRooms.length })}
                </div>
                <ul className="space-y-1.5 text-sm">
                  {selectedRooms.map((room) => (
                    <li key={room.id} className="flex items-center justify-between text-gray-600">
                      <span className="truncate pr-2">{room.name}</span>
                      <span className="flex-shrink-0 font-medium text-gray-900">
                        {formatCurrency(room.pricePerNight, locale)}
                        <span className="text-xs font-normal text-gray-400">{tc('perNight')}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <li className="flex items-center justify-between text-gray-600">
                  <span className="truncate pr-2">{t('totalValue')}</span>
                  <span className="flex text-2xl -shrink-0 font-bold text-gray-900">
                    {formatCurrency(total, locale)}
                  </span>
                </li>
              </>
            )}

            {/* Date range */}
            {hasDates && nights > 0 && (
              <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600 border border-gray-100">
                <span className="font-medium text-gray-900">{formatDate(new Date(checkIn), locale)}</span>
                {' → '}
                <span className="font-medium text-gray-900">{formatDate(new Date(checkOut), locale)}</span>
                <span className="ml-1 text-gray-400">({tc('nightCount', { count: nights })})</span>
              </div>
            )}

            {/* Guests */}
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <GuestIcon />
              <span>
                <span className="font-medium text-gray-900">{tc('adultCount', { count: adults })}</span>
                {children > 0 && (
                  <span>, {tc('childCount', { count: children })}</span>
                )}
                <span className="text-gray-400"> · {tc('roomCount', { count: roomsCount })}</span>
              </span>
            </div>

            {/* Total */}
            {total > 0 && (
              <div className="flex items-baseline justify-between border-t border-gray-200 pt-3">
                <span className="text-sm font-medium text-gray-700">{tc('total')}</span>
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(total, locale)}</span>
              </div>
            )}

            {roomsCount > 1 && !hasEnoughRooms && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                {t('selectMoreRoomsMessage', { count: roomsStillNeeded })}
              </p>
            )}

            <Button
              onClick={handleCheckout}
              className="w-full"
              size="md"
              disabled={!hasEnoughRooms}
            >
              {hasEnoughRooms ? t('goToCheckout') : t('selectMoreRooms', { count: roomsStillNeeded })}
            </Button>
          </div>
        ) : (
          <a
            href="#quartos"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            {t('viewAvailableRooms')}
          </a>
        )}
      </div>
    </aside>
  )
}

function GuestIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
