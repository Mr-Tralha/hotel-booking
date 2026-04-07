import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Amenity } from '@/types/mock-db'

export interface RecentHotel {
  id: number
  name: string
  destination: string
  thumbnail: string
  rating: number
  reviewCount: number
  pricePerNight: number
  propertyType: 'hotel' | 'pousada' | 'resort'
  amenities: Amenity[]
  cancellationPolicy: 'free' | 'moderate' | 'strict'
  availableRooms: number
  /** Full query string that was active when viewing this hotel */
  queryString: string
  visitedAt: string
}

export interface RecentSearch {
  destination: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  rooms: number
  /** Extra filter params serialized */
  filters: string
  searchedAt: string
}

const MAX_RECENT_HOTELS = 5
const MAX_RECENT_SEARCHES = 5

interface HistoryState {
  recentHotels: RecentHotel[]
  recentSearches: RecentSearch[]
  addRecentHotel: (hotel: RecentHotel) => void
  addRecentSearch: (search: RecentSearch) => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      recentHotels: [],
      recentSearches: [],

      addRecentHotel: (hotel) =>
        set((state) => {
          const filtered = state.recentHotels.filter((h) => h.id !== hotel.id)
          return {
            recentHotels: [hotel, ...filtered].slice(0, MAX_RECENT_HOTELS),
          }
        }),

      addRecentSearch: (search) =>
        set((state) => {
          // Dedupe by destination+dates
          const key = `${search.destination}|${search.checkIn}|${search.checkOut}`
          const filtered = state.recentSearches.filter(
            (s) => `${s.destination}|${s.checkIn}|${s.checkOut}` !== key
          )
          return {
            recentSearches: [search, ...filtered].slice(0, MAX_RECENT_SEARCHES),
          }
        }),
    }),
    { name: 'history', skipHydration: true }
  )
)
