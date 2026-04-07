import { useBookingStore, type SelectedRoom } from '@/stores/booking-store'

// Reset store before each test
beforeEach(() => {
  useBookingStore.getState().reset()
})

const mockRoom1: SelectedRoom = { id: 1, name: 'Standard', pricePerNight: 200 }
const mockRoom2: SelectedRoom = { id: 2, name: 'Deluxe', pricePerNight: 400 }

describe('booking-store', () => {
  describe('initial state', () => {
    it('has null hotel and empty rooms', () => {
      const state = useBookingStore.getState()
      expect(state.hotel).toBeNull()
      expect(state.room).toBeNull()
      expect(state.selectedRooms).toEqual([])
      expect(state.selectedHotelId).toBeNull()
    })

    it('has default guest counts', () => {
      const state = useBookingStore.getState()
      expect(state.adults).toBe(2)
      expect(state.children).toBe(0)
      expect(state.rooms).toBe(1)
    })
  })

  describe('setSearchParams', () => {
    it('updates check-in, check-out, and guest params', () => {
      useBookingStore.getState().setSearchParams({
        checkIn: '2025-06-01',
        checkOut: '2025-06-05',
        adults: 3,
        children: 1,
        rooms: 2,
      })

      const state = useBookingStore.getState()
      expect(state.checkIn).toBe('2025-06-01')
      expect(state.checkOut).toBe('2025-06-05')
      expect(state.adults).toBe(3)
      expect(state.children).toBe(1)
      expect(state.rooms).toBe(2)
    })
  })

  describe('toggleRoom', () => {
    it('adds a room when not selected', () => {
      useBookingStore.getState().toggleRoom(mockRoom1, 10)
      const state = useBookingStore.getState()
      expect(state.selectedRooms).toEqual([mockRoom1])
      expect(state.selectedHotelId).toBe(10)
    })

    it('removes a room when already selected (toggle off)', () => {
      useBookingStore.getState().toggleRoom(mockRoom1, 10)
      useBookingStore.getState().toggleRoom(mockRoom1, 10)
      expect(useBookingStore.getState().selectedRooms).toEqual([])
    })

    it('supports multiple rooms for the same hotel', () => {
      useBookingStore.getState().toggleRoom(mockRoom1, 10)
      useBookingStore.getState().toggleRoom(mockRoom2, 10)
      expect(useBookingStore.getState().selectedRooms).toEqual([mockRoom1, mockRoom2])
    })

    it('clears previous rooms when switching to a different hotel', () => {
      useBookingStore.getState().toggleRoom(mockRoom1, 10)
      useBookingStore.getState().toggleRoom(mockRoom2, 10)

      // Switch to hotel 20
      const newRoom: SelectedRoom = { id: 3, name: 'Suite', pricePerNight: 600 }
      useBookingStore.getState().toggleRoom(newRoom, 20)

      const state = useBookingStore.getState()
      expect(state.selectedRooms).toEqual([newRoom])
      expect(state.selectedHotelId).toBe(20)
    })
  })

  describe('setSelectedRooms', () => {
    it('replaces all rooms at once', () => {
      useBookingStore.getState().setSelectedRooms([mockRoom1, mockRoom2], 10)
      const state = useBookingStore.getState()
      expect(state.selectedRooms).toEqual([mockRoom1, mockRoom2])
      expect(state.selectedHotelId).toBe(10)
    })
  })

  describe('clearRooms', () => {
    it('clears selected rooms and hotel id', () => {
      useBookingStore.getState().toggleRoom(mockRoom1, 10)
      useBookingStore.getState().clearRooms()

      const state = useBookingStore.getState()
      expect(state.selectedRooms).toEqual([])
      expect(state.selectedHotelId).toBeNull()
    })
  })

  describe('reset', () => {
    it('restores the entire initial state', () => {
      // Mutate everything
      useBookingStore.getState().setSearchParams({
        checkIn: '2025-06-01',
        checkOut: '2025-06-05',
        adults: 3,
        children: 1,
        rooms: 2,
      })
      useBookingStore.getState().toggleRoom(mockRoom1, 10)

      // Reset
      useBookingStore.getState().reset()

      const state = useBookingStore.getState()
      expect(state.hotel).toBeNull()
      expect(state.room).toBeNull()
      expect(state.selectedRooms).toEqual([])
      expect(state.selectedHotelId).toBeNull()
      expect(state.checkIn).toBeNull()
      expect(state.checkOut).toBeNull()
      expect(state.adults).toBe(2)
      expect(state.children).toBe(0)
      expect(state.rooms).toBe(1)
    })
  })
})
