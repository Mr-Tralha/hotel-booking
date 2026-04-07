'use client'

import { useBookingStore } from '@/stores/booking-store'
import { formatCurrency, formatDate, calculateNights, calculateTotal } from '@/lib/utils'

const TAX_RATE = 0.12

export function CheckoutSummary() {
  const hotel = useBookingStore((s) => s.hotel)
  const selectedRooms = useBookingStore((s) => s.selectedRooms)
  const checkIn = useBookingStore((s) => s.checkIn)
  const checkOut = useBookingStore((s) => s.checkOut)
  const adults = useBookingStore((s) => s.adults)
  const children = useBookingStore((s) => s.children)

  if (!hotel) return null

  const nights =
    checkIn && checkOut
      ? calculateNights(new Date(checkIn), new Date(checkOut))
      : 0

  const subtotal = calculateTotal(selectedRooms, nights)
  const taxes = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = subtotal + taxes

  return (
    <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-semibold text-gray-900">Resumo da reserva</h2>

      {/* Hotel info */}
      <div className="space-y-1">
        <p className="font-medium text-gray-900">{hotel.name}</p>
        <p className="text-sm text-gray-500">{hotel.address}</p>
      </div>

      {/* Dates */}
      {checkIn && checkOut && nights > 0 && (
        <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600 border border-gray-100">
          <span className="font-medium text-gray-900">
            {formatDate(new Date(checkIn))}
          </span>
          {' → '}
          <span className="font-medium text-gray-900">
            {formatDate(new Date(checkOut))}
          </span>
          <span className="ml-1 text-gray-400">
            ({nights} {nights === 1 ? 'noite' : 'noites'})
          </span>
        </div>
      )}

      {/* Guests */}
      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-900">{adults} {adults === 1 ? 'adulto' : 'adultos'}</span>
        {children > 0 && (
          <span>, {children} {children === 1 ? 'criança' : 'crianças'}</span>
        )}
      </p>

      {/* Rooms */}
      <div className="space-y-1.5">
        {selectedRooms.map((room) => (
          <div key={room.id} className="flex justify-between text-sm">
            <span className="text-gray-600">{room.name}</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(room.pricePerNight)}
              <span className="text-xs text-gray-400">/noite</span>
            </span>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      {nights > 0 && (
        <div className="border-t border-gray-200 pt-3 space-y-1.5 text-sm">
          {selectedRooms.map((room) => (
            <div key={room.id} className="flex justify-between text-gray-500">
              <span>
                {room.name} × {nights}n
              </span>
              <span>{formatCurrency(room.pricePerNight * nights)}</span>
            </div>
          ))}
          <div className="flex justify-between text-gray-500">
            <span>Taxas (12%)</span>
            <span>{formatCurrency(taxes)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-2">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      )}
    </aside>
  )
}
