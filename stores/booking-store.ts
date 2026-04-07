import { create } from 'zustand'
import type { Hotel, Room } from '@/types/mock-db'

interface BookingState {
  hotel: Hotel | null
  room: Room | null
  checkIn: string | null
  checkOut: string | null
  adults: number
  children: number
  rooms: number

  setSearchParams: (params: {
    checkIn: string
    checkOut: string
    adults: number
    children: number
    rooms: number
  }) => void
  selectRoom: (hotel: Hotel, room: Room) => void
  reset: () => void
}

const initialState = {
  hotel: null,
  room: null,
  checkIn: null,
  checkOut: null,
  adults: 2,
  children: 0,
  rooms: 1,
}

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,

  setSearchParams: (params) => set(params),

  selectRoom: (hotel, room) => set({ hotel, room }),

  reset: () => set(initialState),
}))
