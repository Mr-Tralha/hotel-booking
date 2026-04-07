import { useQuery } from '@tanstack/react-query'
import { fetchSuggestions } from '@/lib/api'

export function useSuggestions(query: string) {
  return useQuery({
    queryKey: ['suggestions', query],
    queryFn: () => fetchSuggestions(query),
    enabled: query.length >= 2,
    placeholderData: (prev) => prev,
  })
}
