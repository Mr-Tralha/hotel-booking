import { create } from 'zustand'
import type { Hotel, Room } from '@/types/mock-db'

export interface SelectedRoom {
  id: number
  name: string
  pricePerNight: number
}

interface BookingState {
  hotel: Hotel | null
  room: Room | null
  selectedRooms: SelectedRoom[]
  /** hotelId that owns the current selectedRooms — used for isolation */
  selectedHotelId: number | null
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
  setHotel: (hotel: Hotel) => void
  selectRoom: (hotel: Hotel, room: Room) => void
  toggleRoom: (room: SelectedRoom, hotelId: number) => void
  setSelectedRooms: (rooms: SelectedRoom[], hotelId: number) => void
  clearRooms: () => void
  reset: () => void
}

const initialState = {
  hotel: null,
  room: null,
  selectedRooms: [] as SelectedRoom[],
  selectedHotelId: null as number | null,
  checkIn: null,
  checkOut: null,
  adults: 2,
  children: 0,
  rooms: 1,
}

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,

  setSearchParams: (params) => set(params),

  setHotel: (hotel) => set({ hotel }),

  selectRoom: (hotel, room) => set({ hotel, room }),

  toggleRoom: (room, hotelId) =>
    set((state) => {
      // If switching hotels, start fresh with only this room
      if (state.selectedHotelId !== null && state.selectedHotelId !== hotelId) {
        return { selectedRooms: [room], selectedHotelId: hotelId }
      }
      const exists = state.selectedRooms.some((r) => r.id === room.id)
      return {
        selectedRooms: exists
          ? state.selectedRooms.filter((r) => r.id !== room.id)
          : [...state.selectedRooms, room],
        selectedHotelId: hotelId,
      }
    }),

  setSelectedRooms: (rooms, hotelId) => set({ selectedRooms: rooms, selectedHotelId: hotelId }),

  clearRooms: () => set({ selectedRooms: [], selectedHotelId: null }),

  reset: () => set(initialState),
}))
