import type { NextRequest } from 'next/server'
import { getHotels } from '@/lib/mock-db'
import type { HotelSearchParams } from '@/types/mock-db'

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams

  const filters: HotelSearchParams = {
    destination: sp.get('destination') ?? undefined,
    pricePerNight_gte: sp.has('pricePerNight_gte')
      ? Number(sp.get('pricePerNight_gte'))
      : undefined,
    pricePerNight_lte: sp.has('pricePerNight_lte')
      ? Number(sp.get('pricePerNight_lte'))
      : undefined,
    rating_gte: sp.has('rating_gte') ? Number(sp.get('rating_gte')) : undefined,
    propertyType: (sp.get('propertyType') as HotelSearchParams['propertyType']) ?? undefined,
    amenities: sp.get('amenities') ?? undefined,
    featured: sp.has('featured') ? sp.get('featured') === 'true' : undefined,
    _sort: (sp.get('_sort') as HotelSearchParams['_sort']) ?? undefined,
    _order: (sp.get('_order') as HotelSearchParams['_order']) ?? undefined,
    _page: sp.has('_page') ? Number(sp.get('_page')) : undefined,
    _limit: sp.has('_limit') ? Number(sp.get('_limit')) : undefined,
  }

  const data = getHotels(filters)

  return Response.json(data)
}
