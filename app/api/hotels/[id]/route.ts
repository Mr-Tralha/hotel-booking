import type { NextRequest } from 'next/server'
import { getHotelById } from '@/lib/mock-db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = Number(rawId)

  if (Number.isNaN(id)) {
    return Response.json({ error: 'Invalid id' }, { status: 400 })
  }

  const hotel = getHotelById(id)

  if (!hotel) {
    return Response.json({ error: 'Hotel not found' }, { status: 404 })
  }

  return Response.json(hotel)
}
