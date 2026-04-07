'use client'

import { useHotels } from '@/hooks/queries/use-hotels'
import { HotelList } from './hotel-list'

export function FeaturedHotels() {
  const { data, isLoading } = useHotels({
    featured: true,
    _sort: 'rating',
    _order: 'desc',
    _limit: 6,
  })

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Hotéis em destaque
        </h2>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Selecionados pela qualidade e avaliações dos hóspedes
        </p>
      </div>

      <HotelList
        hotels={data?.data}
        isLoading={isLoading}
        skeletonCount={6}
        emptyMessage="Nenhum hotel em destaque no momento."
      />
    </section>
  )
}
