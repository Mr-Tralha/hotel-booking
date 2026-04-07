'use client'

import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { ROOM_AMENITY_LABELS, BED_TYPE_LABELS } from '@/lib/labels'
import { useBookingStore } from '@/stores/booking-store'
import { BaseModal } from '@/components/ui/base-modal'
import { AmenitiesDropdown } from '@/components/ui/amenities-dropdown'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Room } from '@/types/mock-db'

interface RoomDetailModalProps {
  room: Room
  hotelId: number
  onClose: () => void
  onOpenLightbox: (images: string[], index: number) => void
}

export function RoomDetailModal({
  room,
  hotelId,
  onClose,
  onOpenLightbox,
}: RoomDetailModalProps) {
  const selectedRooms = useBookingStore((s) => s.selectedRooms)
  const toggleRoom = useBookingStore((s) => s.toggleRoom)
  const isSelected = selectedRooms.some((r) => r.id === room.id)

  function handleToggle() {
    toggleRoom(
      { id: room.id, name: room.name, pricePerNight: room.pricePerNight },
      hotelId
    )
  }

  const bedsDescription = room.beds
    .map((b) => `${b.quantity} ${BED_TYPE_LABELS[b.type]}`)
    .join(' + ')

  return (
    <BaseModal
      isOpen
      onClose={onClose}
      closeOnBackdropClick
      ariaLabel={`Detalhes do quarto: ${room.name}`}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
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

          {/* Room amenities — collapsible dropdown matching hotel style */}
          <AmenitiesDropdown
            amenities={room.amenities}
            labels={ROOM_AMENITY_LABELS}
            title="Comodidades do quarto"
          />

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
    </BaseModal>
  )
}

/* ─── Icons ─── */

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18" /><path d="M6 6l12 12" />
    </svg>
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
