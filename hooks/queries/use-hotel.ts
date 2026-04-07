import { useQuery } from '@tanstack/react-query'
import { fetchHotelById } from '@/lib/api'

export function useHotel(id: number) {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: () => fetchHotelById(id),
    enabled: id > 0,
  })
}
