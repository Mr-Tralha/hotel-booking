import type { NextRequest } from 'next/server'
import { getSuggestions } from '@/lib/mock-db'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') ?? undefined
  const data = getSuggestions(query)

  return Response.json(data)
}
