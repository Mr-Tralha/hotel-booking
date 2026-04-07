'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { RoomCard } from '@/components/room/room-card'
import { useBookingStore } from '@/stores/booking-store'
import type { Hotel, Room } from '@/types/mock-db'

// Lazy load modals — only needed on user interaction
const RoomDetailModal = dynamic(
  () => import('@/components/room/room-detail-modal').then((m) => ({ default: m.RoomDetailModal })),
  { ssr: false }
)
const ImageLightbox = dynamic(
  () => import('@/components/ui/image-lightbox').then((m) => ({ default: m.ImageLightbox })),
  { ssr: false }
)

interface RoomListProps {
  hotel: Hotel
  rooms: Room[]
}

export function RoomList({ hotel, rooms }: RoomListProps) {
  const [modalRoom, setModalRoom] = useState<Room | null>(null)
  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const searchParams = useSearchParams()
  const adults = Number(searchParams.get('adults')) || 2
  const children = Number(searchParams.get('children')) || 0
  const totalGuests = adults + children
  const roomsNeeded = Number(searchParams.get('rooms')) || 1

  // Sum of available units across all room types in this hotel
  const totalAvailable = rooms.reduce((sum, r) => sum + r.available, 0)
  const notEnoughRooms = totalAvailable < roomsNeeded

  const selectedRooms = useBookingStore((s) => s.selectedRooms)
  const setSelectedRooms = useBookingStore((s) => s.setSelectedRooms)

  // Auto-deselect rooms that can't accommodate the current guest count
  useEffect(() => {
    if (!rooms.length || !selectedRooms.length) return
    const roomCapacityMap = new Map(rooms.map((r) => [r.id, r.maxGuests]))
    const valid = selectedRooms.filter((sr) => {
      const maxGuests = roomCapacityMap.get(sr.id)
      return maxGuests === undefined || maxGuests >= totalGuests
    })
    if (valid.length !== selectedRooms.length) {
      setSelectedRooms(valid, hotel.id)
    }
  }, [rooms, totalGuests]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="quartos">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Quartos Disponíveis
        </h2>
        {roomsNeeded > 1 && (
          <span className="text-sm text-gray-500">
            {selectedRooms.length}/{roomsNeeded} quartos selecionados
          </span>
        )}
      </div>

      {notEnoughRooms && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <WarningIcon />
          <span>
            Este hotel tem apenas <strong>{totalAvailable}</strong> {totalAvailable === 1 ? 'unidade disponível' : 'unidades disponíveis'} no total,
            mas sua busca solicitou <strong>{roomsNeeded}</strong> quartos.
          </span>
        </div>
      )}
      <div className="mt-4 space-y-4">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            hotelId={hotel.id}
            totalGuests={totalGuests}
            onOpenModal={() => setModalRoom(room)}
            onOpenLightbox={(images, index) => {
              setLightboxImages(images)
              setLightboxIndex(index)
            }}
          />
        ))}
      </div>

      {/* Room detail modal */}
      {modalRoom && (
        <RoomDetailModal
          room={modalRoom}
          hotelId={hotel.id}
          onClose={() => setModalRoom(null)}
          onOpenLightbox={(images, index) => {
            setLightboxImages(images)
            setLightboxIndex(index)
          }}
        />
      )}

      {/* Image lightbox */}
      {lightboxImages && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxImages(null)}
        />
      )}
    </section>
  )
}

function WarningIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}
