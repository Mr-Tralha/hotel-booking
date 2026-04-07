'use client'

import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { useBookingStore } from '@/stores/booking-store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Room } from '@/types/mock-db'
import { useTranslations, useLocale } from '@/lib/i18n'

interface RoomCardProps {
  room: Room
  hotelId: number
  totalGuests?: number
  onOpenModal: () => void
  onOpenLightbox: (images: string[], index: number) => void
}

export function RoomCard({ room, hotelId, totalGuests = 0, onOpenModal, onOpenLightbox }: RoomCardProps) {
  const selectedRooms = useBookingStore((s) => s.selectedRooms)
  const toggleRoom = useBookingStore((s) => s.toggleRoom)
  const isSelected = selectedRooms.some((r) => r.id === room.id)
  const exceedsCapacity = totalGuests > 0 && totalGuests > room.maxGuests
  const t = useTranslations('hotel')
  const tc = useTranslations('common')
  const tl = useTranslations('labels')
  const locale = useLocale()

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    toggleRoom(
      { id: room.id, name: room.name, pricePerNight: room.pricePerNight },
      hotelId
    )
  }

  const bedsDescription = room.beds
    .map((b) => `${b.quantity} ${tl('bedType.' + b.type)}`)
    .join(' + ')

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={!exceedsCapacity ? onOpenModal : () => { }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (!exceedsCapacity) {
            onOpenModal()
          }
        }
      }}
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border shadow-sm transition-colors sm:flex-row',
        exceedsCapacity
          ? 'border-gray-200 bg-gray-50 opacity-70 cursor-default'
          : isSelected
            ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500 cursor-pointer'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md cursor-pointer'
      )}
    >
      {/* Room image */}
      <RoomImage
        room={room}
        onOpenLightbox={!exceedsCapacity ? onOpenLightbox : () => { }}
        t={t}
      />

      {/* Room info */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="flex-1 space-y-2">
            <RoomHeader room={room} bedsDescription={bedsDescription} exceedsCapacity={exceedsCapacity} totalGuests={totalGuests} t={t} />
            <RoomAmenities amenities={room.amenities} tl={tl} />
          </div>

          {/* Price + action */}
          <RoomPrice
            pricePerNight={room.pricePerNight}
            available={room.available}
            isSelected={isSelected}
            onToggle={!exceedsCapacity ? handleToggle : () => { }}
            disabled={exceedsCapacity}
            t={t}
            tc={tc}
            locale={locale}
          />
        </div>
      </div>
    </div>
  )
}

/* ─── Sub-components ─── */

function RoomImage({
  room,
  onOpenLightbox,
  t,
}: {
  room: Room
  onOpenLightbox: (images: string[], index: number) => void
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  if (!room.images[0]) return null

  return (
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
        onClick={(e) => {
          e.stopPropagation()
          onOpenLightbox(room.images, 0)
        }}
        className="absolute inset-0 flex items-end justify-end p-2 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity"
        aria-label={t('enlargeImage')}
      >
        <span className="rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
          <ExpandIcon />
        </span>
      </button>

      {room.available <= 3 && room.available > 0 && (
        <span className="absolute right-2 top-2 rounded-md bg-red-500/90 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
          {room.available === 1
            ? t('lastAvailable')
            : t('onlyAvailable', { count: room.available })}
        </span>
      )}
    </div>
  )
}

function RoomHeader({ room, bedsDescription, exceedsCapacity, totalGuests, t }: { room: Room; bedsDescription: string; exceedsCapacity: boolean; totalGuests: number; t: (key: string, params?: Record<string, string | number>) => string }) {
  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <AreaIcon />
          {t('squareMeters', { size: room.size })}
        </span>
        <span className="flex items-center gap-1">
          <BedIcon />
          {bedsDescription}
        </span>
        <span className={cn('flex items-center gap-1', exceedsCapacity && 'text-red-600 font-medium')}>
          <GuestsIcon />
          {t('maxGuests', { count: room.maxGuests })}
        </span>
      </div>
      {exceedsCapacity && (
        <p className="text-xs font-medium text-red-600">
          {t('capacityInsufficient', { count: totalGuests })}
        </p>
      )}
    </>
  )
}

export function RoomAmenities({ amenities, tl }: { amenities: Room['amenities']; maxVisible?: number; tl?: (key: string) => string }) {
  const maxVisible = 5
  const displayAmenities = amenities.slice(0, maxVisible)
  const extraCount = amenities.length - displayAmenities.length
  const defaultTl = useTranslations('labels')
  const translate = tl || defaultTl

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayAmenities.map((amenity) => (
        <span
          key={amenity}
          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
        >
          {translate('roomAmenity.' + amenity)}
        </span>
      ))}
      {extraCount > 0 && (
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
          +{extraCount}
        </span>
      )}
    </div>
  )
}

function RoomPrice({
  pricePerNight,
  available,
  isSelected,
  onToggle,
  disabled,
  t,
  tc,
  locale,
}: {
  pricePerNight: number
  available: number
  isSelected: boolean
  onToggle: (e: React.MouseEvent) => void
  disabled?: boolean
  t: (key: string, params?: Record<string, string | number>) => string
  tc: (key: string, params?: Record<string, string | number>) => string
  locale: string
}) {
  return (
    <div className="flex flex-row items-end justify-between gap-3 border-t border-gray-100 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 sm:pl-4">
      <div className="flex-row flex items-baseline gap-1">
        <span className="text-xl font-bold text-gray-900">
          {formatCurrency(pricePerNight, locale)}
        </span>
        <span className="text-xs text-gray-500 block">{tc('perNight')}</span>
      </div>

      <Button
        onClick={onToggle}
        disabled={available === 0 || disabled}
        variant={isSelected ? 'secondary' : 'primary'}
        size="md"
        className={
          isSelected
            ? 'border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100'
            : undefined
        }
      >
        {available === 0
          ? t('unavailable')
          : isSelected
            ? t('selectedRoom')
            : t('selectRoom')}
      </Button>
    </div>
  )
}

/* ─── Icons ─── */

function ExpandIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="inline">
      <path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" />
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
