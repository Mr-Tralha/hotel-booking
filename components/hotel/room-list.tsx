'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
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
            hotel={hotel}
            room={room}
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
          hotel={hotel}
          room={modalRoom}
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

function RoomCard({
  hotel,
  room,
  onOpenModal,
  onOpenLightbox,
}: {
  hotel: Hotel
  room: Room
  onOpenModal: () => void
  onOpenLightbox: (images: string[], index: number) => void
}) {
  const selectedRooms = useBookingStore((s) => s.selectedRooms)
  const toggleRoom = useBookingStore((s) => s.toggleRoom)

  const isSelected = selectedRooms.some((r) => r.id === room.id)

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    toggleRoom(
      { id: room.id, name: room.name, pricePerNight: room.pricePerNight },
      hotel.id
    )
  }

  const bedsDescription = room.beds
    .map((b) => `${b.quantity} ${BED_TYPE_LABELS[b.type]}`)
    .join(' + ')

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpenModal}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenModal() } }}
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border shadow-sm transition-colors cursor-pointer sm:flex-row',
        isSelected
          ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      )}
    >
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
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onOpenLightbox(room.images, 0) }}
            className="absolute inset-0 flex items-end justify-end p-2 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity"
            aria-label="Ampliar imagem"
          >
            <span className="rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
              <ExpandIcon />
            </span>
          </button>

          {/* Scarcity badge on room image */}
          {room.available <= 3 && room.available > 0 && (
            <span className="absolute right-2 top-2 rounded-md bg-red-500/90 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
              {room.available === 1
                ? 'Último disponível!'
                : `Apenas ${room.available} disponíveis!`}
            </span>
          )}
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

/* ─── Room Detail Modal ─── */

function RoomDetailModal({
  hotel,
  room,
  onClose,
  onOpenLightbox,
}: {
  hotel: Hotel
  room: Room
  onClose: () => void
  onOpenLightbox: (images: string[], index: number) => void
}) {
  const selectedRooms = useBookingStore((s) => s.selectedRooms)
  const toggleRoom = useBookingStore((s) => s.toggleRoom)
  const isSelected = selectedRooms.some((r) => r.id === room.id)

  function handleToggle() {
    toggleRoom(
      { id: room.id, name: room.name, pricePerNight: room.pricePerNight },
      hotel.id
    )
  }

  const bedsDescription = room.beds
    .map((b) => `${b.quantity} ${BED_TYPE_LABELS[b.type]}`)
    .join(' + ')

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes do quarto: ${room.name}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1.5 text-gray-500 shadow-sm hover:bg-gray-100 transition-colors"
          aria-label="Fechar"
        >
          <CloseIcon />
        </button>

        {/* Room images */}
        {room.images.length > 0 && (
          <div className="relative aspect-[16/9] w-full bg-gray-100">
            <Image
              src={room.images[0]}
              alt={room.name}
              fill
              sizes="(max-width: 672px) 100vw, 672px"
              className="object-cover cursor-pointer"
              onClick={() => onOpenLightbox(room.images, 0)}
            />
            {room.images.length > 1 && (
              <div className="absolute bottom-3 right-3 flex gap-1.5">
                {room.images.slice(1, 4).map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => onOpenLightbox(room.images, i + 1)}
                    className="relative h-12 w-16 overflow-hidden rounded-md border-2 border-white shadow-sm"
                  >
                    <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                    {i === 2 && room.images.length > 4 && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-semibold text-white">
                        +{room.images.length - 4}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Scarcity badge */}
            {room.available <= 3 && room.available > 0 && (
              <span className="absolute left-3 top-3 rounded-md bg-red-500/90 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                {room.available === 1
                  ? 'Último disponível!'
                  : `Apenas ${room.available} disponíveis!`}
              </span>
            )}
          </div>
        )}

        {/* Modal content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{room.name}</h2>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center gap-1"><AreaIcon />{room.size} m²</span>
                <span className="flex items-center gap-1"><BedIcon />{bedsDescription}</span>
                <span className="flex items-center gap-1"><GuestsIcon />Até {room.maxGuests} hóspedes</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 flex-shrink-0">
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(room.pricePerNight)}</span>
              <span className="text-sm text-gray-500">/noite</span>
            </div>
          </div>

          {/* Full description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Descrição</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{room.description}</p>
          </div>

          {/* All amenities */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Comodidades do quarto</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {room.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  <CheckIcon />
                  {ROOM_AMENITY_LABELS[amenity]}
                </div>
              ))}
            </div>
          </div>

          {/* Beds detail */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Camas</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {room.beds.map((bed, i) => (
                <span key={i} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  {bed.quantity}× {BED_TYPE_LABELS[bed.type]}
                </span>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
            <Button
              onClick={handleToggle}
              disabled={room.available === 0}
              variant={isSelected ? 'secondary' : 'primary'}
              size="md"
              className={cn('flex-1', isSelected && 'border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100')}
            >
              {room.available === 0
                ? 'Indisponível'
                : isSelected
                  ? '✓ Selecionado'
                  : 'Selecionar quarto'}
            </Button>
            <Button variant="secondary" size="md" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Image Lightbox (shared) ─── */

function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[]
  initialIndex: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(initialIndex)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const goTo = useCallback(
    (i: number) => setIndex((i + images.length) % images.length),
    [images.length]
  )

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goTo(index - 1)
      if (e.key === 'ArrowRight') goTo(index + 1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [index, goTo, onClose])

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX)
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return
    const diff = e.changedTouches[0].clientX - touchStart
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? index - 1 : index + 1)
    }
    setTouchStart(null)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label="Visualizar imagem"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
        aria-label="Fechar"
      >
        <CloseIcon />
      </button>

      <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm">
        {index + 1} / {images.length}
      </span>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
            aria-label="Próxima"
          >
            <ChevronRightIcon />
          </button>
        </>
      )}

      <div className="relative mx-16 h-[80vh] w-full max-w-5xl">
        <Image
          src={images[index]}
          alt={`Imagem ${index + 1}`}
          fill
          sizes="90vw"
          className="object-contain"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 overflow-x-auto rounded-xl bg-black/50 p-2 backdrop-blur-sm">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                'relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-md transition-opacity',
                i === index ? 'ring-2 ring-white opacity-100' : 'opacity-60 hover:opacity-100'
              )}
              aria-label={`Ver imagem ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Icons ─── */

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

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-blue-500 flex-shrink-0">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18" /><path d="M6 6l12 12" />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="inline">
      <path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}
