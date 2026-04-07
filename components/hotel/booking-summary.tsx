'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useBookingStore } from '@/stores/booking-store'
import { formatCurrency, formatDate, calculateNights, calculateTotal } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ShareButton } from '@/components/hotel/share-button'
import type { Hotel } from '@/types/mock-db'

interface BookingSummaryProps {
  hotel: Hotel
}

export function BookingSummary({ hotel }: BookingSummaryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedRooms = useBookingStore((s) => s.selectedRooms)

  const checkin = searchParams.get('checkin') ?? ''
  const checkout = searchParams.get('checkout') ?? ''

  const hasRooms = selectedRooms.length > 0
  const hasDates = checkin !== '' && checkout !== ''

  const nights = hasDates
    ? calculateNights(new Date(checkin), new Date(checkout))
    : 0

  const total = hasRooms && nights > 0
    ? calculateTotal(selectedRooms, nights)
    : 0

  function handleCheckout() {
    const params = new URLSearchParams(searchParams.toString())
    // Ensure rooms param is current
    params.set('rooms', selectedRooms.map((r) => r.id).join(','))
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <aside className="space-y-4">
      <div className="sticky top-16 rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        {/* Base price */}
        <div>
          <span className="text-sm text-gray-500">A partir de</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(hotel.pricePerNight)}
            </span>
            <span className="text-sm text-gray-500">/noite</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-sm font-bold text-blue-700">
            <StarIcon />
            {hotel.rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400">
            {hotel.reviewCount.toLocaleString('pt-BR')} avaliações
          </span>
        </div>

        {/* Selection summary OR CTA */}
        {hasRooms ? (
          <div className="space-y-3">
            {/* Badge */}
            <div className="rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
              {selectedRooms.length} {selectedRooms.length === 1 ? 'quarto selecionado' : 'quartos selecionados'}
            </div>

            {/* Room list */}
            <ul className="space-y-1 text-sm text-gray-700">
              {selectedRooms.map((room) => (
                <li key={room.id} className="flex items-center justify-between">
                  <span className="truncate pr-2">{room.name}</span>
                  <span className="flex-shrink-0 font-medium">{formatCurrency(room.pricePerNight)}/n</span>
                </li>
              ))}
            </ul>

            {/* Dates and nights */}
            {hasDates && nights > 0 && (
              <div className="space-y-1 border-t border-gray-100 pt-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Check-in</span>
                  <span className="font-medium text-gray-900">{formatDate(new Date(checkin))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out</span>
                  <span className="font-medium text-gray-900">{formatDate(new Date(checkout))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Noites</span>
                  <span className="font-medium text-gray-900">{nights}</span>
                </div>
              </div>
            )}

            {/* Total */}
            {total > 0 && (
              <div className="flex items-baseline justify-between border-t border-gray-100 pt-3">
                <span className="text-sm font-medium text-gray-700">Total</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(total)}</span>
              </div>
            )}

            {/* Checkout button */}
            <Button onClick={handleCheckout} className="w-full" size="md">
              Ir para checkout
            </Button>
          </div>
        ) : (
          <a
            href="#quartos"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Ver quartos disponíveis
          </a>
        )}

        <ShareButton hotelName={hotel.name} />
      </div>
    </aside>
  )
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
