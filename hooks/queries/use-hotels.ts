import { useQuery } from '@tanstack/react-query'
import { fetchHotels } from '@/lib/api'
import type { HotelSearchParams } from '@/types/mock-db'

export function useHotels(
  params: HotelSearchParams,
  options?: { enabled?: boolean }
) {
  const hasFilter =
    !!params.destination ||
    params.featured !== undefined ||
    params.propertyType !== undefined ||
    params.rating_gte !== undefined ||
    params.pricePerNight_gte !== undefined ||
    params.pricePerNight_lte !== undefined

  return useQuery({
    queryKey: ['hotels', params],
    queryFn: () => fetchHotels(params),
    enabled: options?.enabled ?? hasFilter,
  })
}
