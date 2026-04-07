'use client'

import { use, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useHotel } from '@/hooks/queries/use-hotel'
import { useBookingStore, type SelectedRoom } from '@/stores/booking-store'
import { Breadcrumb } from '@/components/hotel/breadcrumb'
import { HotelGallery } from '@/components/hotel/hotel-gallery'
import { HotelInfo } from '@/components/hotel/hotel-info'
import { RoomList } from '@/components/hotel/room-list'
import { HotelReviews } from '@/components/hotel/hotel-reviews'
import { HotelDetailSkeleton } from '@/components/hotel/hotel-detail-skeleton'
import { SectionNav } from '@/components/hotel/section-nav'
import { BookingSummary } from '@/components/hotel/booking-summary'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/**
 * Syncs selected rooms between URL (source of truth) and Zustand store.
 * - On mount: hydrates store from URL `rooms` param
 * - On store change: updates URL `rooms` param with debounce
 */
function useRoomUrlSync(hotelRooms: { id: number; name: string; pricePerNight: number }[]) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const selectedRooms = useBookingStore((s) => s.selectedRooms)
  const setSelectedRooms = useBookingStore((s) => s.setSelectedRooms)
  const hydrated = useRef(false)

  // Hydrate store from URL on mount
  useEffect(() => {
    const roomsParam = searchParams.get('rooms')
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
      setSelectedRooms(rooms)
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
        params.set('rooms', selectedRooms.map((r) => r.id).join(','))
      } else {
        params.delete('rooms')
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
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Hotel não encontrado</h1>
        <p className="mt-2 text-sm text-gray-500">
          O hotel que você procura não existe ou foi removido.
        </p>
        <Link href="/search" className="mt-6">
          <Button>Voltar para busca</Button>
        </Link>
      </div>
    )
  }

  return <HotelDetailLoaded hotel={hotel} />
}

function HotelDetailLoaded({ hotel }: { hotel: NonNullable<ReturnType<typeof useHotel>['data']> }) {
  // Sync rooms between URL ↔ store
  useRoomUrlSync(
    hotel.rooms.map((r) => ({ id: r.id, name: r.name, pricePerNight: r.pricePerNight }))
  )

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <Breadcrumb hotelName={hotel.name} destination={hotel.destination} />

        {/* Gallery */}
        <HotelGallery images={hotel.images} hotelName={hotel.name} />
      </div>

      {/* Section navigation */}
      <SectionNav hasRooms={hotel.rooms.length > 0} hasReviews={hotel.reviewCount > 0} />

      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Hotel info */}
            <section id="sobre">
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
          <BookingSummary hotel={hotel} />
        </div>
      </div>
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
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">ID inválido</h1>
        <p className="mt-2 text-sm text-gray-500">O identificador do hotel é inválido.</p>
        <Link href="/search" className="mt-6">
          <Button>Voltar para busca</Button>
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <HotelDetailContent hotelId={id} />
    </main>
  )
}
