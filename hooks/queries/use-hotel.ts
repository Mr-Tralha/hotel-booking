import { useQuery } from '@tanstack/react-query'
import { fetchHotelById } from '@/lib/api'

export function useHotel(id: number) {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: () => fetchHotelById(id),
    enabled: id > 0,
    gcTime: 10 * 60 * 1000, // keep hotel data 10 min for back navigation
  })
}
