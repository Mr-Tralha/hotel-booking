'use client'

import type { Hotel } from '@/types/mock-db'
import { HotelCard } from './hotel-card'
import { HotelCardSkeleton } from './hotel-card-skeleton'

interface HotelListProps {
  hotels?: Hotel[]
  isLoading?: boolean
  skeletonCount?: number
  emptyMessage?: string
  columns?: 2 | 3
}

export function HotelList({
  hotels,
  isLoading,
  skeletonCount = 4,
  emptyMessage = 'Nenhum hotel encontrado.',
  columns = 3,
}: HotelListProps) {
  const gridCols =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  if (isLoading) {
    return (
      <div className={`grid gap-6 ${gridCols}`}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <HotelCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`grid gap-6 ${gridCols}`}>
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  )
}
