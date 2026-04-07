import { HotelDetailSkeleton } from '@/components/hotel/hotel-detail-skeleton'

export default function HotelLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HotelDetailSkeleton />
    </main>
  )
}
