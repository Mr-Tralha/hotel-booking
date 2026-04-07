'use client'

import { useRouter } from 'next/navigation'
import { useHistoryStore, type RecentSearch, type RecentHotel } from '@/stores/history-store'
import { formatDate } from '@/lib/utils'

export function RecentSearches() {
  const router = useRouter()
  const recentSearches = useHistoryStore((s) => s.recentSearches)
  const recentHotels = useHistoryStore((s) => s.recentHotels)

  if (recentSearches.length === 0 && recentHotels.length === 0) return null

  function navigateToSearch(search: RecentSearch) {
    const params = new URLSearchParams({
      destination: search.destination,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adults: String(search.adults),
      children: String(search.children),
      rooms: String(search.rooms),
    })
    if (search.filters) {
      for (const part of search.filters.split('&')) {
        const [key, val] = part.split('=')
        if (key && val) params.set(key, val)
      }
    }
    router.push(`/search?${params.toString()}`)
  }

  function navigateToHotel(hotel: RecentHotel) {
    const url = `/hotel/${hotel.id}${hotel.queryString ? `?${hotel.queryString}` : ''}`
    router.push(url)
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Últimas pesquisas
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Retome de onde parou
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recentSearches.map((search, i) => (
          <button
            key={`search-${i}`}
            type="button"
            onClick={() => navigateToSearch(search)}
            className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-gray-300 hover:shadow-md cursor-pointer"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <SearchIcon />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {search.destination}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(new Date(search.checkIn))} → {formatDate(new Date(search.checkOut))}
                {' · '}
                {search.adults} {search.adults === 1 ? 'adulto' : 'adultos'}
                {search.children > 0 && `, ${search.children} crianças`}
              </p>
            </div>
          </button>
        ))}

        {recentHotels.map((hotel) => (
          <button
            key={`hotel-${hotel.id}`}
            type="button"
            onClick={() => navigateToHotel(hotel)}
            className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-gray-300 hover:shadow-md cursor-pointer"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50">
              <HotelIcon />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {hotel.name}
              </p>
              <p className="text-xs text-gray-500">{hotel.destination}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function HotelIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600" aria-hidden="true">
      <path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" />
      <path d="M9 9h1" /><path d="M9 13h1" /><path d="M9 17h1" />
    </svg>
  )
}
