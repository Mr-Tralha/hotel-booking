import { useQuery } from '@tanstack/react-query'
import { fetchHotels } from '@/lib/api'
import type { HotelSearchParams } from '@/types/mock-db'

export function useHotels(params: HotelSearchParams) {
  return useQuery({
    queryKey: ['hotels', params],
    queryFn: () => fetchHotels(params),
    enabled: !!params.destination,
  })
}
