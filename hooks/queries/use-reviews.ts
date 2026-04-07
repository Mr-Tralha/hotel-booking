import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchReviews } from '@/lib/api'

export function useReviews(hotelId: number, page = 1, limit = 5) {
  return useQuery({
    queryKey: ['reviews', hotelId, page, limit],
    queryFn: () => fetchReviews(hotelId, page, limit),
    enabled: hotelId > 0,
    placeholderData: keepPreviousData,
  })
}
