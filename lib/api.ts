import type {
  Suggestion,
  HotelSearchParams,
  PaginatedResponse,
  Hotel,
  HotelWithRooms,
  Review,
} from '@/types/mock-db'

const BASE_URL = '/api'

export async function fetchSuggestions(query: string): Promise<Suggestion[]> {
  const res = await fetch(
    `${BASE_URL}/suggestions?q=${encodeURIComponent(query)}`
  )
  if (!res.ok) throw new Error('Falha ao buscar sugestões')
  return res.json()
}

export async function fetchHotels(
  params: HotelSearchParams
): Promise<PaginatedResponse<Hotel>> {
  const searchParams = new URLSearchParams()

  if (params.destination) searchParams.set('destination', params.destination)
  if (params.pricePerNight_gte !== undefined)
    searchParams.set('pricePerNight_gte', String(params.pricePerNight_gte))
  if (params.pricePerNight_lte !== undefined)
    searchParams.set('pricePerNight_lte', String(params.pricePerNight_lte))
  if (params.rating_gte !== undefined)
    searchParams.set('rating_gte', String(params.rating_gte))
  if (params.propertyType)
    searchParams.set('propertyType', params.propertyType)
  if (params.featured !== undefined)
    searchParams.set('featured', String(params.featured))
  if (params._sort) searchParams.set('_sort', params._sort)
  if (params._order) searchParams.set('_order', params._order)
  if (params._page !== undefined)
    searchParams.set('_page', String(params._page))
  if (params._limit !== undefined)
    searchParams.set('_limit', String(params._limit))

  const res = await fetch(`${BASE_URL}/hotels?${searchParams.toString()}`)
  if (!res.ok) throw new Error('Falha ao buscar hotéis')
  return res.json()
}

export async function fetchHotelById(id: number): Promise<HotelWithRooms> {
  const res = await fetch(`${BASE_URL}/hotels/${id}`)
  if (!res.ok) throw new Error('Falha ao buscar hotel')
  return res.json()
}

export async function fetchReviews(
  hotelId: number,
  page = 1,
  limit = 5
): Promise<PaginatedResponse<Review>> {
  const params = new URLSearchParams({
    hotelId: String(hotelId),
    page: String(page),
    limit: String(limit),
  })
  const res = await fetch(`${BASE_URL}/reviews?${params.toString()}`)
  if (!res.ok) throw new Error('Falha ao buscar avaliações')
  return res.json()
}
