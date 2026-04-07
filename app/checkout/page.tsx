'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { formatDate, calculateNights } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  const roomsParam = searchParams.get('rooms') ?? ''
  const checkin = searchParams.get('checkIn') ?? ''
  const checkout = searchParams.get('checkOut') ?? ''
  const destination = searchParams.get('destination') ?? ''

  // Parse room IDs from URL — names/prices will be shown from the URL
  // In a real app we'd fetch hotel data, but for now we display IDs
  const roomIds = roomsParam
    .split(',')
    .map(Number)
    .filter((n) => !Number.isNaN(n) && n > 0)

  useEffect(() => {
    if (roomIds.length === 0) {
      router.replace('/search')
      return
    }
    setReady(true)
  }, [roomIds.length, router])

  if (!ready) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
          <p className="text-sm text-gray-500">Redirecionando...</p>
        </div>
      </main>
    )
  }

  const hasDates = checkin !== '' && checkout !== ''
  const nights = hasDates ? calculateNights(new Date(checkin), new Date(checkout)) : 0

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Checkout</h1>
        <p className="mt-1 text-sm text-gray-500">Revise sua seleção antes de continuar.</p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
          {/* Destination */}
          {destination && (
            <div>
              <h2 className="text-sm font-medium text-gray-500">Destino</h2>
              <p className="text-lg font-semibold text-gray-900">{destination}</p>
            </div>
          )}

          {/* Dates */}
          {hasDates && nights > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Check-in</h2>
                <p className="font-semibold text-gray-900">{formatDate(new Date(checkin))}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Check-out</h2>
                <p className="font-semibold text-gray-900">{formatDate(new Date(checkout))}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Noites</h2>
                <p className="font-semibold text-gray-900">{nights}</p>
              </div>
            </div>
          )}

          {/* Selected rooms */}
          <div>
            <h2 className="text-sm font-medium text-gray-500">
              {roomIds.length} {roomIds.length === 1 ? 'quarto selecionado' : 'quartos selecionados'}
            </h2>
            <ul className="mt-2 divide-y divide-gray-100">
              {roomIds.map((id) => (
                <li key={id} className="py-2 text-sm text-gray-700">
                  Quarto #{id}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          A continuação do checkout (formulário de dados pessoais,
          pagamento simulado e confirmação) será implementada nas próximas etapas.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link href="/search">
            <Button variant="secondary">Voltar para busca</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-center px-4 py-20">
          <p className="text-sm text-gray-500">Carregando...</p>
        </div>
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
