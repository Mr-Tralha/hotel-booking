'use client'

import { Suspense } from 'react'
import { useHotels } from '@/hooks/queries/use-hotels'
import { useSearchFilters } from '@/hooks/use-search-filters'
import { NAVBAR_HEIGHT_PX } from '@/lib/constants'
import { SearchForm } from '@/components/search/search-form'
import { SearchFilters } from '@/components/search/search-filters'
import { HotelList } from '@/components/hotels/hotel-list'
import { FeaturedHotels } from '@/components/hotels/featured-hotels'
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
    amenities,
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
            amenities,
            sort,
          }}
          onAfterSubmit={() => {
            // Defer layout read to next frame to avoid forced reflow
            requestAnimationFrame(() => {
              const el = document.getElementById('hotel-results')
              if (!el) return
              const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT_PX
              window.scrollTo({ top, behavior: 'smooth' })
            })
          }}
        />
      </div>

      <div className="flex gap-6">

        {/* Results */}
        <div id="hotel-results" className="min-w-0 flex-1">
          {/* Results header */}
          <div className="mb-4">
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

          {/* Hotel grid */}
          <HotelList
            hotels={data?.data}
            isLoading={isLoading}
            skeletonCount={6}
            emptyMessage="Nenhum hotel encontrado para os filtros selecionados. Tente ajustar os critérios de busca."
            columns={3}
            priorityCount={3}
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
        </div>
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
          {/* Search form skeleton */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-lg sm:p-6 md:gap-5">
              {/* Destination */}
              <div className="flex flex-col gap-1">
                <div className="h-4 w-14 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
              </div>
              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                </div>
              </div>
              {/* Guests */}
              <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
              {/* Submit button */}
              <div className="h-11 w-full animate-pulse rounded-lg bg-blue-200" />
            </div>
          </div>
          {/* Results header */}
          <div className="mb-4">
            <div className="h-7 w-56 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-36 animate-pulse rounded bg-gray-200" />
          </div>
          {/* Hotel grid skeleton */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="aspect-[16/10] w-full animate-pulse bg-gray-200" />
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                  </div>
                  <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="flex gap-1.5">
                    <div className="h-5 w-14 animate-pulse rounded-full bg-gray-200" />
                    <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
                    <div className="h-5 w-10 animate-pulse rounded-full bg-gray-200" />
                  </div>
                  <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-2">
                    <div className="h-6 w-28 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  )
}
