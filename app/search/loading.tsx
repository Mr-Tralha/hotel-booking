import { HotelCardSkeleton } from '@/components/hotels/hotel-card-skeleton'

export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        {/* Search form skeleton */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>

        {/* Results skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <HotelCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  )
}
