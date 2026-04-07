'use client'

import { useHotels } from '@/hooks/queries/use-hotels'
import { HotelList } from './hotel-list'

interface FeaturedHotelsProps {
  recommended?: boolean
}

export function FeaturedHotels({ recommended }: FeaturedHotelsProps) {
  const variant = recommended ? 'recommended' : 'featured'

  const config = {
    featured: {
      title: 'Hotéis em destaque',
      description: 'Selecionados pela qualidade e avaliações dos hóspedes',
      py: 'py-12 sm:py-16',
    },
    recommended: {
      title: 'Recomendados para você',
      description: 'Baseado nas suas preferências e tendências',
      py: 'py-6 sm:py-8',
    },
  }[variant]

  const { data, isLoading } = useHotels({
    featured: true,
    _sort: 'rating',
    _order: 'desc',
    _limit: 6,
  })

  return (
    <section className={`mx-auto w-full max-w-6xl px-4 ${config.py}`}>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {config.title}
        </h2>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          {config.description}
        </p>
      </div>

      <HotelList
        hotels={data?.data}
        isLoading={isLoading}
        skeletonCount={6}
        emptyMessage="Nenhum hotel disponível no momento."
      />
    </section>
  )
}