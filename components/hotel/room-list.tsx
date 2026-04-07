'use client'

import { useState } from 'react'
import { RoomCard } from '@/components/room/room-card'
import { RoomDetailModal } from '@/components/room/room-detail-modal'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import type { Hotel, Room } from '@/types/mock-db'

interface RoomListProps {
  hotel: Hotel
  rooms: Room[]
}

export function RoomList({ hotel, rooms }: RoomListProps) {
  const [modalRoom, setModalRoom] = useState<Room | null>(null)
  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  return (
    <section id="quartos">
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Quartos Disponíveis
      </h2>
      <div className="mt-4 space-y-4">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            hotelId={hotel.id}
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
