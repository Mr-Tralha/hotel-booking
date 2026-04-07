import db from '@/mocks/db.json'
import {
  Suggestion,
  Hotel,
  Room,
  Review,
  HotelSearchParams,
  PaginatedResponse,
} from '@/types/mock-db'

/**
 * Returns destination suggestions optionally filtered by a search query.
 * Matches against `name` and `country` fields (case-insensitive, partial match).
 * When `query` is omitted, the full suggestions list is returned.
 *
 * @param query - Optional search string to filter suggestions
 * @returns Array of {@link Suggestion} matching the query
 */
export function getSuggestions(query?: string): Suggestion[] {
  if (!query) {
    return db.suggestions as Suggestion[]
  }

  const lowerQuery = query.toLowerCase()
  return (db.suggestions as Suggestion[]).filter(
    (suggestion) =>
      suggestion.name.toLowerCase().includes(lowerQuery) ||
      suggestion.country.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Returns a paginated, filtered and optionally sorted list of hotels.
 *
 * Supported filters: `destination` (partial, case-insensitive), `pricePerNight_gte`,
 * `pricePerNight_lte`, `rating_gte`, `propertyType`, `featured`.
 * Sorting is controlled by `_sort` (any `Hotel` key) and `_order` (`asc` | `desc`).
 * Pagination is controlled by `_page` (1-based, default `1`) and `_limit` (default `10`).
 *
 * @param filters - Search, filter, sort and pagination parameters
 * @returns Paginated response containing matched {@link Hotel} records
 */
export function getHotels(filters: HotelSearchParams): PaginatedResponse<Hotel> {
  let results = [...(db.hotels as Hotel[])]

  // Filter by destination
  if (filters.destination) {
    const lowerDest = filters.destination.toLowerCase()
    results = results.filter((hotel) =>
      hotel.destination.toLowerCase().includes(lowerDest)
    )
  }

  // Filter by price range
  if (filters.pricePerNight_gte !== undefined) {
    results = results.filter((hotel) => hotel.pricePerNight >= filters.pricePerNight_gte!)
  }
  if (filters.pricePerNight_lte !== undefined) {
    results = results.filter((hotel) => hotel.pricePerNight <= filters.pricePerNight_lte!)
  }

  // Filter by rating
  if (filters.rating_gte !== undefined) {
    results = results.filter((hotel) => hotel.rating >= filters.rating_gte!)
  }

  // Filter by property type (supports comma-separated for multi-select)
  if (filters.propertyType) {
    const types = filters.propertyType.split(',') as Hotel['propertyType'][]
    results = results.filter((hotel) => types.includes(hotel.propertyType))
  }

  // Filter by featured
  if (filters.featured !== undefined) {
    results = results.filter((hotel) => hotel.featured === filters.featured)
  }

  // Sorting
  if (filters._sort) {
    const sortOrder = filters._order === 'desc' ? -1 : 1
    results.sort((a, b) => {
      const aValue = a[filters._sort!]
      const bValue = b[filters._sort!]
      if (aValue < bValue) return -1 * sortOrder
      if (aValue > bValue) return 1 * sortOrder
      return 0
    })
  }

  // Pagination
  const page = filters._page ?? 1
  const limit = filters._limit ?? 10
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = results.slice(startIndex, endIndex)

  return {
    data: paginatedData,
    total: results.length,
    page,
    limit,
  }
}

/**
 * Retrieves a single hotel by its numeric ID, including all associated rooms
 * joined by `room.hotelId === hotel.id`.
 *
 * @param id - Hotel primary key
 * @returns Hotel with an embedded `rooms` array, or `null` if not found
 */
export function getHotelById(id: number): (Hotel & { rooms: Room[] }) | null {
  const hotel = (db.hotels as Hotel[]).find((h) => h.id === id)
  if (!hotel) return null

  const rooms = (db.rooms as Room[]).filter((room) => room.hotelId === id)

  return {
    ...hotel,
    rooms,
  }
}

/**
 * Returns paginated reviews for a given hotel, sorted by date descending (most recent first).
 *
 * @param hotelId - ID of the hotel to fetch reviews for
 * @param page    - 1-based page number (default `1`)
 * @param limit   - Maximum records per page (default `5`)
 * @returns Paginated response containing matched {@link Review} records
 */
export function getHotelReviews(
  hotelId: number,
  page: number = 1,
  limit: number = 5
): PaginatedResponse<Review> {
  const allReviews = (db.reviews as Review[]).filter((review) => review.hotelId === hotelId)

  // Sort by most recent first
  const sortedReviews = allReviews.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = sortedReviews.slice(startIndex, endIndex)

  return {
    data: paginatedData,
    total: allReviews.length,
    page,
    limit,
  }
}

