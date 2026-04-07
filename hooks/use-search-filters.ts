'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import type { HotelSearchParams } from '@/types/mock-db'

/**
 * Hook that syncs hotel search/filter state with URL search params.
 * URL is the single source of truth.
 */
export function useSearchFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const destination = searchParams.get('destination') ?? ''
  const checkIn = searchParams.get('checkIn') ?? ''
  const checkOut = searchParams.get('checkOut') ?? ''
  const adults = searchParams.get('adults') ?? '2'
  const children = searchParams.get('children') ?? '0'
  const rooms = searchParams.get('rooms') ?? '1'

  // Filters
  const priceMin = searchParams.get('priceMin') ?? ''
  const priceMax = searchParams.get('priceMax') ?? ''
  const ratingMin = searchParams.get('ratingMin') ?? ''
  const propertyType = searchParams.get('propertyType') ?? ''
  const amenities = searchParams.get('amenities') ?? ''
  const sort = searchParams.get('sort') ?? ''
  const page = Number(searchParams.get('page') ?? '1')

  const setParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      // Reset page when filters change (unless page itself is being set)
      if (!('page' in updates)) {
        params.delete('page')
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, router, pathname]
  )

  // Build HotelSearchParams for the API
  const apiParams: HotelSearchParams = {
    destination: destination || undefined,
    pricePerNight_gte: priceMin ? Number(priceMin) : undefined,
    pricePerNight_lte: priceMax ? Number(priceMax) : undefined,
    rating_gte: ratingMin ? Number(ratingMin) : undefined,
    propertyType: (propertyType as HotelSearchParams['propertyType']) || undefined,
    amenities: amenities || undefined,
    _page: page,
    _limit: 9,
  }

  // Sorting
  if (sort === 'price_asc') {
    apiParams._sort = 'pricePerNight'
    apiParams._order = 'asc'
  } else if (sort === 'price_desc') {
    apiParams._sort = 'pricePerNight'
    apiParams._order = 'desc'
  } else if (sort === 'rating_desc') {
    apiParams._sort = 'rating'
    apiParams._order = 'desc'
  } else if (sort === 'popular') {
    apiParams._sort = 'featured'
    apiParams._order = 'desc'
  }

  return {
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
  }
}
