import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SelectedRoom } from '@/stores/booking-store'

export interface SavedBooking {
  id: string
  hotelName: string
  hotelAddress: string
  hotelThumbnail: string
  rooms: SelectedRoom[]
  checkIn: string
  checkOut: string
  adults: number
  children: number
  total: number
  createdAt: string
}

interface ReservationsState {
  bookings: SavedBooking[]
  addBooking: (booking: SavedBooking) => void
}

export const useReservationsStore = create<ReservationsState>()(
  persist(
    (set) => ({
      bookings: [],
      addBooking: (booking) =>
        set((state) => ({
          bookings: [booking, ...state.bookings],
        })),
    }),
    { name: 'reservations', skipHydration: true }
  )
)
