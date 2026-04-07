'use client'

import { useRouter } from 'next/navigation'
import { useHistoryStore, type RecentSearch } from '@/stores/history-store'
import { HotelCard } from '@/components/hotels/hotel-card'
import { formatDate } from '@/lib/utils'
import { useTranslations, useLocale } from '@/lib/i18n'

export function RecentSearches() {
  const router = useRouter()
  const recentSearches = useHistoryStore((s) => s.recentSearches)
  const recentHotels = useHistoryStore((s) => s.recentHotels)
  const t = useTranslations('search')
  const tc = useTranslations('common')
  const locale = useLocale()

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

  const hasSearches = recentSearches.length > 0
  const hasHotels = recentHotels.length > 0
  const showSubtitles = hasSearches && hasHotels

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 space-y-8">
      {hasSearches && (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {showSubtitles ? t('recentSearches') : t('lastSearches')}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{t('recentSearchSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recentSearches.slice(0, 4).map((search, i) => (
              <button
                key={`search-${i}`}
                type="button"
                onClick={() => navigateToSearch(search)}
                className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md cursor-pointer"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <SearchIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 truncate text-sm leading-tight">
                    {search.destination}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                    {formatDate(new Date(search.checkIn), locale)} → {formatDate(new Date(search.checkOut), locale)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {tc('adultCount', { count: search.adults })}
                    {search.children > 0 && `, ${tc('childCount', { count: search.children })}`}
                    {' · '}{tc('roomCount', { count: search.rooms })}
                  </p>
                </div>
                <ArrowIcon />
              </button>
            ))}
          </div>
        </div>
      )}

      {hasHotels && (
        <div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentHotels.slice(0, 6).map((hotel) => (
              <HotelCard
                key={`hotel-${hotel.id}`}
                hotel={{
                  id: hotel.id,
                  name: hotel.name,
                  destination: hotel.destination,
                  thumbnail: hotel.thumbnail,
                  rating: hotel.rating,
                  reviewCount: hotel.reviewCount,
                  pricePerNight: hotel.pricePerNight,
                  propertyType: hotel.propertyType,
                  amenities: hotel.amenities,
                  cancellationPolicy: hotel.cancellationPolicy,
                  availableRooms: hotel.availableRooms,
                  slug: '',
                  description: '',
                  currency: 'BRL',
                  address: '',
                  latitude: 0,
                  longitude: 0,
                  images: [],
                  checkInTime: '',
                  checkOutTime: '',
                  featured: false,
                }}
                hrefOverride={`/hotel/${hotel.id}${hotel.queryString ? `?${hotel.queryString}` : ''}`}
              />
            ))}
          </div>
        </div>
      )}
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

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-gray-300 group-hover:text-blue-400 transition-colors" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

