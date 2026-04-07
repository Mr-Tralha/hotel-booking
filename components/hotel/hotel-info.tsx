'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import {
  AMENITY_LABELS,
  PROPERTY_TYPE_LABELS,
  CANCELLATION_LABELS,
  CANCELLATION_DESCRIPTIONS,
} from '@/lib/labels'
import { AmenitiesDropdown } from '@/components/ui/amenities-dropdown'
import type { HotelWithRooms } from '@/types/mock-db'

interface HotelInfoProps {
  hotel: HotelWithRooms
}

export function HotelInfo({ hotel }: HotelInfoProps) {
  const searchParams = useSearchParams()
  const dateCheckIn = searchParams.get('checkIn')
  const dateCheckOut = searchParams.get('checkOut')
  const adults = Number(searchParams.get('adults')) || 2
  const children = Number(searchParams.get('children')) || 0
  const cancellation = CANCELLATION_LABELS[hotel.cancellationPolicy]
  const [policyOpen, setPolicyOpen] = useState(false)
  const totalGuests = adults + children


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            {PROPERTY_TYPE_LABELS[hotel.propertyType]}
          </span>
          <span className={`text-xs font-medium ${cancellation.color}`}>
            {cancellation.label}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {hotel.name}
        </h1>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <p className="text-sm text-gray-500">{hotel.address}</p>
          <a
            href={
              hotel.latitude && hotel.longitude
                ? `https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}`
                : `https://www.google.com/maps/search/${encodeURIComponent(hotel.address)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
          >
            <PinIcon />
            Ver no mapa
          </a>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-sm font-bold text-white">
          <StarIcon />
          {hotel.rating.toFixed(1)}
        </span>
        <span className="text-sm text-gray-500">
          {hotel.reviewCount.toLocaleString('pt-BR')} avaliações
        </span>
      </div>

      {/* Price highlight */}
      <div className="flex items-baseline gap-1">
        <span className="text-sm text-gray-500">A partir de</span>
        <span className="text-2xl font-bold text-gray-900">
          {formatCurrency(hotel.pricePerNight)}
        </span>
        <span className="text-sm text-gray-500">/noite</span>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Sobre</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {hotel.description}
        </p>
      </div>

      {/* Guest count */}
      {totalGuests > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5">
          <GuestsInfoIcon />
          <span className="text-sm font-medium text-blue-700">
            {adults} {adults === 1 ? 'adulto' : 'adultos'}
            {children > 0 &&
              `, ${children} ${children === 1 ? 'criança' : 'crianças'}`}
          </span>
        </div>
      )}

      {/* Check-in/Check-out */}
      <div className="flex items-stretch gap-0 rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex-1 p-4">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-in</span>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {hotel.checkInTime} - {dateCheckIn ? formatDate(new Date(dateCheckIn)) : ''}
          </p>
        </div>
        <div className="w-px bg-gray-200" />
        <div className="flex-1 p-4">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-out</span>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {hotel.checkOutTime} - {dateCheckOut ? formatDate(new Date(dateCheckOut)) : ''}
          </p>
        </div>
      </div>

      {/* Amenities — collapsible */}
      <AmenitiesDropdown
        amenities={hotel.amenities}
        labels={AMENITY_LABELS}
        title="Comodidades do estabelecimento"
      />

      {/* Cancellation policy — collapsible */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
        <button
          type="button"
          onClick={() => setPolicyOpen((v) => !v)}
          className="flex w-full items-center justify-between p-4 text-left cursor-pointer"
          aria-expanded={policyOpen}
        >
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Política de Cancelamento</h3>
            <p className={`mt-0.5 text-sm font-medium ${cancellation.color}`}>
              {cancellation.label}
            </p>
          </div>
          <svg
            className={cn('h-5 w-5 text-gray-400 transition-transform', policyOpen && 'rotate-180')}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
        {policyOpen && (
          <div className="border-t border-gray-200 px-4 pb-4 pt-2">
            <p className="text-xs text-gray-500">
              {CANCELLATION_DESCRIPTIONS[hotel.cancellationPolicy]}
            </p>
          </div>
        )}
      </div>

      {/* Availability indicator */}
      {hotel.availableRooms <= 5 && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-medium text-red-700">
            {hotel.availableRooms === 1
              ? 'Apenas 1 quarto disponível!'
              : `Apenas ${hotel.availableRooms} quartos disponíveis!`}
          </span>
        </div>
      )}
    </div>
  )
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function GuestsInfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
