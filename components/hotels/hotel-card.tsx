'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn, formatCurrency } from '@/lib/utils'
import { AMENITY_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/labels'
import type { Hotel } from '@/types/mock-db'

interface HotelCardProps {
  hotel: Hotel
}

export function HotelCard({ hotel }: HotelCardProps) {
  const displayAmenities = hotel.amenities.slice(0, 4)
  const extraCount = hotel.amenities.length - displayAmenities.length

  return (
    <Link
      href={`/hotel/${hotel.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <Image
          src={hotel.thumbnail}
          alt={hotel.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-700 backdrop-blur-sm">
          {PROPERTY_TYPE_LABELS[hotel.propertyType]}
        </span>
        {hotel.availableRooms <= 3 && (
          <span className="absolute right-3 top-3 rounded-md bg-red-500/90 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
            {hotel.availableRooms === 1
              ? 'Último quarto!'
              : `Apenas ${hotel.availableRooms} disponíveis!`}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Header */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {hotel.name}
          </h3>
          <p className="mt-0.5 text-sm text-gray-500">{hotel.destination}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-0.5 rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-semibold text-blue-700">
            <StarIcon />
            {hotel.rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400">
            ({hotel.reviewCount.toLocaleString('pt-BR')} avaliações)
          </span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5">
          {displayAmenities.map((amenity) => (
            <span
              key={amenity}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              {AMENITY_LABELS[amenity]}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              +{extraCount}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(hotel.pricePerNight)}
            </span>
            <span className="text-xs text-gray-500"> /noite</span>
          </div>
          {hotel.cancellationPolicy === 'free' && (
            <span className="text-xs font-medium text-green-600">
              Cancelamento grátis
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
