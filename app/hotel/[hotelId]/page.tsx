'use client'

import { use, useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname, notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useHotel } from '@/hooks/queries/use-hotel'
import { useBookingStore, type SelectedRoom } from '@/stores/booking-store'
import { useHistoryStore } from '@/stores/history-store'
import { Breadcrumb } from '@/components/hotel/breadcrumb'
import { HotelGallery } from '@/components/hotel/hotel-gallery'
import { HotelInfo } from '@/components/hotel/hotel-info'
import { RoomList } from '@/components/hotel/room-list'
import { HotelDetailSkeleton } from '@/components/hotel/hotel-detail-skeleton'
import { SectionNav } from '@/components/hotel/section-nav'
import { BookingSummary } from '@/components/hotel/booking-summary'


const HotelReviews = dynamic(
  () => import('@/components/hotel/hotel-reviews').then((m) => m.HotelReviews),
)
const SearchParamsModal = dynamic(
  () => import('@/components/hotel/search-params-modal').then((m) => m.SearchParamsModal),
  { ssr: false }
)
const FeaturedHotels = dynamic(
  () => import('@/components/hotels/featured-hotels').then((m) => m.FeaturedHotels),
)

/**
 * Syncs selected rooms between URL (source of truth) and Zustand store.
 * - On mount: hydrates store from URL `rooms` param
 * - On store change: updates URL `rooms` param with debounce
 * - On unmount / hotelId change: clears selected rooms (isolation)
 */
function useRoomUrlSync(hotelId: number, hotelRooms: { id: number; name: string; pricePerNight: number }[]) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const selectedRooms = useBookingStore((s) => s.selectedRooms)
  const selectedHotelId = useBookingStore((s) => s.selectedHotelId)
  const setSelectedRooms = useBookingStore((s) => s.setSelectedRooms)
  const clearRooms = useBookingStore((s) => s.clearRooms)
  const hydrated = useRef(false)

  // Clear rooms if navigating to a different hotel
  useEffect(() => {
    if (selectedHotelId !== null && selectedHotelId !== hotelId) {
      clearRooms()
    }
  }, [hotelId, selectedHotelId, clearRooms])

  // Hydrate store from URL on mount
  useEffect(() => {
    const roomsParam = searchParams.get('roomIds')
    if (!roomsParam) {
      hydrated.current = true
      return
    }

    const ids = roomsParam
      .split(',')
      .map(Number)
      .filter((n) => !Number.isNaN(n) && n > 0)

    const rooms: SelectedRoom[] = ids
      .map((id) => hotelRooms.find((r) => r.id === id))
      .filter((r): r is SelectedRoom => r != null)

    if (rooms.length > 0) {
      setSelectedRooms(rooms, hotelId)
    }
    hydrated.current = true
    // Run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync store → URL (debounced)
  useEffect(() => {
    if (!hydrated.current) return

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (selectedRooms.length > 0) {
        params.set('roomIds', selectedRooms.map((r) => r.id).join(','))
      } else {
        params.delete('roomIds')
      }

      const newUrl = `${pathname}?${params.toString()}`
      const currentUrl = `${pathname}?${searchParams.toString()}`
      if (newUrl !== currentUrl) {
        router.replace(newUrl, { scroll: false })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [selectedRooms, searchParams, router, pathname])
}

function HotelDetailContent({ hotelId }: { hotelId: number }) {
  const { data: hotel, isLoading, error } = useHotel(hotelId)

  if (isLoading) return <HotelDetailSkeleton />

  if (error || !hotel) {
    notFound()
  }

  return <HotelDetailLoaded hotel={hotel} />
}

function HotelDetailLoaded({ hotel }: { hotel: NonNullable<ReturnType<typeof useHotel>['data']> }) {
  const searchParams = useSearchParams()
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const missingParams = !checkIn || !checkOut
  const [modalDismissed, setModalDismissed] = useState(false)
  const showModal = missingParams && !modalDismissed
  const addRecentHotel = useHistoryStore((s) => s.addRecentHotel)

  // Track hotel view in history
  useEffect(() => {
    addRecentHotel({
      id: hotel.id,
      name: hotel.name,
      destination: hotel.destination,
      thumbnail: hotel.thumbnail,
      rating: hotel.rating,
      reviewCount: hotel.reviewCount,
      pricePerNight: hotel.pricePerNight,
      propertyType: hotel.propertyType,
      amenities: hotel.amenities,
      cancellationPolicy: hotel.cancellationPolicy,
      availableRooms: hotel.availableRooms,
      queryString: searchParams.toString(),
      visitedAt: new Date().toISOString(),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel.id])

  // Sync rooms between URL ↔ store (isolated per hotel)
  useRoomUrlSync(
    hotel.id,
    hotel.rooms.map((r) => ({ id: r.id, name: r.name, pricePerNight: r.pricePerNight }))
  )

  return (
    <>
      {showModal && (
        <SearchParamsModal onClose={() => setModalDismissed(true)} />
      )}

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8" id="sobre">
        {/* Breadcrumb */}
        <Breadcrumb hotelName={hotel.name} destination={hotel.destination} />

        {/* Gallery */}
        <HotelGallery images={hotel.images} hotelName={hotel.name} availableRooms={hotel.availableRooms} />
      </div>

      {/* Section navigation */}
      <SectionNav hasRooms={hotel.rooms.length > 0} hasReviews={hotel.reviewCount > 0} />

      <div className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Hotel info */}
            <section >
              <HotelInfo hotel={hotel} />
            </section>

            {/* Rooms */}
            {hotel.rooms.length > 0 && (
              <RoomList hotel={hotel} rooms={hotel.rooms} />
            )}

            {/* Reviews */}
            {hotel.reviewCount > 0 && (
              <Suspense fallback={<ReviewsSkeleton />}>
                <HotelReviews hotelId={hotel.id} />
              </Suspense>
            )}

          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <BookingSummary hotel={hotel} />
            </div>
          </div>
        </div>

        {/* Mobile sticky bottom */}
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 p-4 backdrop-blur lg:hidden">
          <BookingSummary hotel={hotel} />
        </div>
      </div>

      <FeaturedHotels recommended />
    </>
  )
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
            <div className="space-y-1.5">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  )
}

export default function HotelDetailPage({
  params,
}: {
  params: Promise<{ hotelId: string }>
}) {
  const { hotelId } = use(params)
  const id = Number(hotelId)

  if (Number.isNaN(id) || id <= 0) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <HotelDetailContent hotelId={id} />
    </main>
  )
}
