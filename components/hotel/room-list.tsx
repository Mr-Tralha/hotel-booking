'use client'

import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { ROOM_AMENITY_LABELS, BED_TYPE_LABELS } from '@/lib/labels'
import { useBookingStore } from '@/stores/booking-store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Hotel, Room } from '@/types/mock-db'

interface RoomListProps {
  hotel: Hotel
  rooms: Room[]
}

export function RoomList({ hotel, rooms }: RoomListProps) {
  return (
    <section id="quartos">
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Quartos Disponíveis
      </h2>
      <div className="mt-4 space-y-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} hotel={hotel} room={room} />
        ))}
      </div>
    </section>
  )
}

function RoomCard({ hotel, room }: { hotel: Hotel; room: Room }) {
  const selectedRooms = useBookingStore((s) => s.selectedRooms)
  const toggleRoom = useBookingStore((s) => s.toggleRoom)

  const isSelected = selectedRooms.some((r) => r.id === room.id)

  function handleToggle() {
    toggleRoom({
      id: room.id,
      name: room.name,
      pricePerNight: room.pricePerNight,
    })
  }

  const bedsDescription = room.beds
    .map((b) => `${b.quantity} ${BED_TYPE_LABELS[b.type]}`)
    .join(' + ')

  return (
    <div className={cn(
      'flex flex-col overflow-hidden rounded-xl border shadow-sm transition-colors sm:flex-row',
      isSelected
        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
        : 'border-gray-200 bg-white'
    )}>
      {/* Room image */}
      {room.images[0] && (
        <div className="relative aspect-[16/10] w-full flex-shrink-0 bg-gray-100 sm:aspect-auto sm:w-64">
          <Image
            src={room.images[0]}
            alt={room.name}
            fill
            sizes="(max-width: 640px) 100vw, 256px"
            className="object-cover"
          />
        </div>
      )}

      {/* Room info */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>

            {/* Room details */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <AreaIcon />
                {room.size} m²
              </span>
              <span className="flex items-center gap-1">
                <BedIcon />
                {bedsDescription}
              </span>
              <span className="flex items-center gap-1">
                <GuestsIcon />
                Até {room.maxGuests} hóspedes
              </span>
            </div>

            {/* Room amenities */}
            <div className="flex flex-wrap gap-1.5">
              {room.amenities.slice(0, 5).map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  {ROOM_AMENITY_LABELS[amenity]}
                </span>
              ))}
              {room.amenities.length > 5 && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  +{room.amenities.length - 5}
                </span>
              )}
            </div>
          </div>

          {/* Price + action */}
          <div className="flex flex-row items-end justify-between gap-3 border-t border-gray-100 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 sm:pl-4">
            <div className="flex-row flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(room.pricePerNight)}
              </span>
              <span className="text-xs text-gray-500 block">/noite</span>
            </div>

            {/* Availability */}
            {room.available <= 3 && room.available > 0 && (
              <p className="text-xs font-medium text-red-600">
                {room.available === 1
                  ? 'Último disponível!'
                  : `Apenas ${room.available} disponíveis!`}
              </p>
            )}

            <Button
              onClick={handleToggle}
              disabled={room.available === 0}
              variant={isSelected ? 'secondary' : 'primary'}
              size="md"
              className={isSelected ? 'border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100' : undefined}
            >
              {room.available === 0
                ? 'Indisponível'
                : isSelected
                  ? '✓ Selecionado'
                  : 'Selecionar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AreaIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  )
}

function BedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
      <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />
    </svg>
  )
}

function GuestsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
