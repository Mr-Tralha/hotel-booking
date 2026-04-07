'use client'

import { Suspense } from 'react'
import { useHotels } from '@/hooks/queries/use-hotels'
import { useSearchFilters } from '@/hooks/use-search-filters'
import { SearchForm } from '@/components/search/search-form'
import { HotelList } from '@/components/hotels/hotel-list'
import { FeaturedHotels } from '@/components/hotels/featured-hotels'
import { SortSelector } from '@/components/search/sort-selector'
import { Pagination } from '@/components/ui/pagination'

function SearchResults() {
  const {
    destination,
    checkIn,
    checkOut,
    adults,
    children,
    rooms,
    priceMin,
    priceMax,
    ratingMin,
    propertyType,
    sort,
    page,
    apiParams,
    setParams,
  } = useSearchFilters()

  const { data, isLoading } = useHotels(apiParams)

  const total = data?.total ?? 0
  const limit = data?.limit ?? 9

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
      {/* Search form — same component as home, pre-filled from URL */}
      <div className="mb-8">
        <SearchForm
          defaultValues={{
            destination,
            checkIn,
            checkOut,
            adults: Number(adults),
            children: Number(children),
            rooms: Number(rooms),
            priceMin,
            priceMax,
            ratingMin,
            propertyType,
            sort,
          }}
        />
      </div>

      {/* Results header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {destination
              ? `Hotéis em ${destination}`
              : 'Resultados da busca'}
          </h1>
          {data && (
            <p className="mt-0.5 text-sm text-gray-500">
              {isLoading ? 'Carregando...' : total === 0 ? 'Nenhum hotel encontrado' : total === 1 ? '1 hotel encontrado' : `${total} hotéis encontrados`}
            </p>
          )}
        </div>
        <SortSelector
          value={sort}
          onChange={(v) => setParams({ sort: v })}
        />
      </div>

      {/* Hotel grid */}
      <HotelList
        hotels={data?.data}
        isLoading={isLoading}
        skeletonCount={6}
        emptyMessage="Nenhum hotel encontrado para os filtros selecionados. Tente ajustar os critérios de busca."
        columns={3}
      />

      {/* Show featured hotels when no results */}
      {!isLoading && data && data.data.length === 0 && (
        <FeaturedHotels />
      )}

      {/* Pagination */}
      {!isLoading && total > 0 && (
        <div className="mt-8">
          <Pagination
            page={page}
            total={total}
            limit={limit}
            onPageChange={(p) => setParams({ page: String(p) })}
          />
        </div>
      )}
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
          <div className="mb-8">
            <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
          </div>
          <div className="mb-4">
            <div className="h-7 w-56 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-36 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  )
}
