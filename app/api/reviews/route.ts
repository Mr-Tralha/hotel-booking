import type { NextRequest } from 'next/server'
import { getHotelReviews } from '@/lib/mock-db'

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const hotelIdParam = sp.get('hotelId')

  if (!hotelIdParam) {
    return Response.json({ error: 'hotelId is required' }, { status: 400 })
  }

  const hotelId = Number(hotelIdParam)
  if (Number.isNaN(hotelId)) {
    return Response.json({ error: 'hotelId must be a number' }, { status: 400 })
  }

  const page = sp.has('page') ? Number(sp.get('page')) : undefined
  const limit = sp.has('limit') ? Number(sp.get('limit')) : undefined

  const data = getHotelReviews(hotelId, page, limit)

  return Response.json(data)
}
