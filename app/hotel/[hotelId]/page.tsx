'use client'

import { use, Suspense } from 'react'
import { useHotel } from '@/hooks/queries/use-hotel'
import { Breadcrumb } from '@/components/hotel/breadcrumb'
import { HotelGallery } from '@/components/hotel/hotel-gallery'
import { HotelInfo } from '@/components/hotel/hotel-info'
import { RoomList } from '@/components/hotel/room-list'
import { HotelReviews } from '@/components/hotel/hotel-reviews'
import { HotelDetailSkeleton } from '@/components/hotel/hotel-detail-skeleton'
import { ShareButton } from '@/components/hotel/share-button'
import { SectionNav } from '@/components/hotel/section-nav'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
          <aside className="space-y-4">
            {/* Quick book card */}
            <div className="sticky top-16 rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <div>
                <span className="text-sm text-gray-500">A partir de</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(hotel.pricePerNight)}
                  </span>
                  <span className="text-sm text-gray-500">/noite</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-sm font-bold text-blue-700">
                  <StarIcon />
                  {hotel.rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">
                  {hotel.reviewCount.toLocaleString('pt-BR')} avaliações
                </span>
              </div>

              <a
                href="#quartos"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Ver quartos disponíveis
              </a>

              <ShareButton hotelName={hotel.name} />
            </div>
          </aside>
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

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
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
