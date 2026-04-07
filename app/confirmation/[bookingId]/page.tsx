'use client'

import { use, useEffect, useState } from 'react'
import { useBookingStore } from '@/stores/booking-store'
import { formatCurrency, formatDate, calculateNights, calculateTotal } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Hotel } from '@/types/mock-db'
import type { SelectedRoom } from '@/stores/booking-store'

interface BookingSnapshot {
  hotel: Hotel
  selectedRooms: SelectedRoom[]
  checkIn: string
  checkOut: string
  adults: number
  children: number
}

const TAX_RATE = 0.12

export default function ConfirmationPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = use(params)
  const hotel = useBookingStore((s) => s.hotel)
  const selectedRooms = useBookingStore((s) => s.selectedRooms)
  const checkIn = useBookingStore((s) => s.checkIn)
  const checkOut = useBookingStore((s) => s.checkOut)
  const adults = useBookingStore((s) => s.adults)
  const children = useBookingStore((s) => s.children)
  const reset = useBookingStore((s) => s.reset)

  const [snapshot, setSnapshot] = useState<BookingSnapshot | null>(null)

  // Capture store data on mount (before reset clears it)
  useEffect(() => {
    if (hotel && selectedRooms.length > 0 && checkIn && checkOut) {
      setSnapshot({ hotel, selectedRooms, checkIn, checkOut, adults, children })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const data = snapshot
  const nights =
    data?.checkIn && data?.checkOut
      ? calculateNights(new Date(data.checkIn), new Date(data.checkOut))
      : 0
  const subtotal = data ? calculateTotal(data.selectedRooms, nights) : 0
  const taxes = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = subtotal + taxes

  function handleNewSearch() {
    reset()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>

        <h1 className="mt-6 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Reserva confirmada!
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Sua reserva foi realizada com sucesso. Guarde o número abaixo.
        </p>

        {/* Booking ID */}
        <div className="mt-6 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-blue-600">
            Número da reserva
          </p>
          <p className="mt-1 text-lg font-bold text-blue-900 font-mono break-all sm:text-xl">
            {bookingId}
          </p>
        </div>

        {/* Booking details */}
        {data && (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="font-semibold text-gray-900">Detalhes da reserva</h2>

            {/* Hotel */}
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Hotel</p>
              <p className="font-medium text-gray-900">{data.hotel.name}</p>
              <p className="text-sm text-gray-500">{data.hotel.address}</p>
            </div>

            {/* Dates & guests */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Check-in</p>
                <p className="font-medium text-gray-900">
                  {formatDate(new Date(data.checkIn))}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Check-out</p>
                <p className="font-medium text-gray-900">
                  {formatDate(new Date(data.checkOut))}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Noites</p>
                <p className="font-medium text-gray-900">{nights}</p>
              </div>
              <div>
                <p className="text-gray-500">Hóspedes</p>
                <p className="font-medium text-gray-900">
                  {data.adults} {data.adults === 1 ? 'adulto' : 'adultos'}
                  {data.children > 0 &&
                    `, ${data.children} ${data.children === 1 ? 'criança' : 'crianças'}`}
                </p>
              </div>
            </div>

            {/* Rooms */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                {data.selectedRooms.length}{' '}
                {data.selectedRooms.length === 1 ? 'quarto' : 'quartos'}
              </p>
              {data.selectedRooms.map((room) => (
                <div key={room.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{room.name}</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(room.pricePerNight * nights)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Taxas e impostos (12%)</span>
                <span>{formatCurrency(taxes)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2">
                <span className="font-semibold text-gray-900">Total pago</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        )}

        {!data && (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
            Os detalhes da reserva não estão mais disponíveis nesta sessão.
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <Link href="/" onClick={handleNewSearch}>
            <Button size="lg">Fazer nova busca</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
