/**
 * Types para a API de Hotel Booking
 * 
 * Uso:
 * import { Hotel, Room, Review, Suggestion } from '@/types/api'
 */

export interface Suggestion {
  id: number
  name: string
  type: 'city' | 'beach' | 'island' | 'nature'
  country: string
}

export interface Hotel {
  id: number
  name: string
  slug: string
  destination: string
  description: string
  rating: number
  reviewCount: number
  pricePerNight: number
  currency: 'BRL'
  propertyType: 'hotel' | 'pousada' | 'resort'
  address: string
  latitude: number
  longitude: number
  images: string[]
  thumbnail: string
  amenities: Amenity[]
  checkInTime: string
  checkOutTime: string
  cancellationPolicy: 'free' | 'moderate' | 'strict'
  availableRooms: number
  featured: boolean
}

export interface Room {
  id: number
  hotelId: number
  name: string
  description: string
  size: number
  maxGuests: number
  beds: Bed[]
  pricePerNight: number
  amenities: RoomAmenity[]
  images: string[]
  available: number
}

export interface Bed {
  type: 'single' | 'double' | 'queen' | 'king' | 'twin' | 'sofa_bed'
  quantity: number
}

export interface Review {
  id: number
  hotelId: number
  guestName: string
  guestAvatar: string
  rating: number
  title: string
  comment: string
  date: string
  helpful: number
  verified: boolean
}

export type Amenity = 
  | 'wifi'
  | 'pool'
  | 'spa'
  | 'restaurant'
  | 'gym'
  | 'parking'
  | 'bar'
  | 'room_service'
  | 'beach_access'
  | 'kids_club'
  | 'business_center'
  | 'concierge'
  | 'valet'
  | 'lounge_access'

export type RoomAmenity =
  | 'ocean_view'
  | 'city_view'
  | 'garden_view'
  | 'balcony'
  | 'terrace'
  | 'bathtub'
  | 'minibar'
  | 'safe'
  | 'aircon'
  | 'desk'
  | 'kitchen'
  | 'living_room'
  | 'sound_system'
  | 'butler'
  | 'pool_access'
  | 'garden'

// API Response types
export interface HotelSearchParams {
  destination?: string
  pricePerNight_gte?: number
  pricePerNight_lte?: number
  rating_gte?: number
  propertyType?: Hotel['propertyType'] | string
  featured?: boolean
  _sort?: keyof Hotel
  _order?: 'asc' | 'desc'
  _page?: number
  _limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Form types para checkout
export interface GuestData {
  firstName: string
  lastName: string
  email: string
  phone: string
  cpf: string
  // Adicione campos extras conforme necessário
}

export interface BookingData {
  hotel: Hotel
  room: Room
  checkIn: Date
  checkOut: Date
  guests: GuestData[]
  totalPrice: number
}

// Utility types
export type HotelWithRooms = Hotel & {
  rooms: Room[]
}

export type HotelWithReviews = Hotel & {
  reviews: Review[]
}

export type HotelComplete = Hotel & {
  rooms: Room[]
  reviews: Review[]
}
