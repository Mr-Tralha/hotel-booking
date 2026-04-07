'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reviewSchema, type ReviewForm } from '@/lib/validations/checkout'
import type { PersonalDataForm, PaymentForm } from '@/lib/validations/checkout'
import { useBookingStore, type SelectedRoom } from '@/stores/booking-store'
import { formatCurrency, formatDate, calculateNights, calculateTotal } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface ReviewStepProps {
  personalData: PersonalDataForm
  paymentData: PaymentForm
  onConfirm: () => void
  onBack: () => void
  isSubmitting: boolean
}

const TAX_RATE = 0.12

export function ReviewStep({
  personalData,
  paymentData,
  onConfirm,
  onBack,
  isSubmitting,
}: ReviewStepProps) {
  const hotel = useBookingStore((s) => s.hotel)
  const selectedRooms = useBookingStore((s) => s.selectedRooms)
  const checkIn = useBookingStore((s) => s.checkIn)
  const checkOut = useBookingStore((s) => s.checkOut)
  const adults = useBookingStore((s) => s.adults)
  const children = useBookingStore((s) => s.children)
  const [showTerms, setShowTerms] = useState(false)

  const nights =
    checkIn && checkOut
      ? calculateNights(new Date(checkIn), new Date(checkOut))
      : 0

  const subtotal = calculateTotal(selectedRooms, nights)
  const taxes = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = subtotal + taxes

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { acceptTerms: undefined as unknown as true },
  })

  function onSubmit() {
    onConfirm()
  }

  const maskedCard = paymentData.cardNumber.replace(/\d(?=.{4})/g, '•')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <h2 className="text-lg font-semibold text-gray-900">Revisão da Reserva</h2>

      {/* Hotel + Room summary */}
      <section className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Hospedagem</h3>
        {hotel && (
          <p className="text-sm text-gray-900 font-medium">{hotel.name}</p>
        )}
        {checkIn && checkOut && (
          <p className="text-sm text-gray-600">
            {formatDate(new Date(checkIn))} → {formatDate(new Date(checkOut))}
            <span className="ml-1 text-gray-400">
              ({nights} {nights === 1 ? 'noite' : 'noites'})
            </span>
          </p>
        )}
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{adults} {adults === 1 ? 'adulto' : 'adultos'}</span>
          {children > 0 && (
            <span>, {children} {children === 1 ? 'criança' : 'crianças'}</span>
          )}
        </p>
        <ul className="space-y-1">
          {selectedRooms.map((room) => (
            <li key={room.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{room.name}</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(room.pricePerNight)}
                <span className="text-xs text-gray-400">/noite</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Price breakdown */}
      <PriceBreakdown
        rooms={selectedRooms}
        nights={nights}
        subtotal={subtotal}
        taxes={taxes}
        total={total}
      />

      {/* Personal data summary */}
      <section className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Dados Pessoais</h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt className="text-gray-500">Nome</dt>
          <dd className="text-gray-900">{personalData.fullName}</dd>
          <dt className="text-gray-500">E-mail</dt>
          <dd className="text-gray-900">{personalData.email}</dd>
          <dt className="text-gray-500">Telefone</dt>
          <dd className="text-gray-900">{personalData.phone}</dd>
          <dt className="text-gray-500">CPF</dt>
          <dd className="text-gray-900">{personalData.cpf}</dd>
        </dl>
      </section>

      {/* Payment summary */}
      <section className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Pagamento</h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt className="text-gray-500">Cartão</dt>
          <dd className="text-gray-900 font-mono text-xs">{maskedCard}</dd>
          <dt className="text-gray-500">Titular</dt>
          <dd className="text-gray-900">{paymentData.cardHolder}</dd>
          <dt className="text-gray-500">Validade</dt>
          <dd className="text-gray-900">{paymentData.expiry}</dd>
        </dl>
      </section>

      {/* Terms and conditions */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="acceptTerms"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            {...register('acceptTerms')}
          />
          <label htmlFor="acceptTerms" className="text-sm text-gray-600">
            Li e aceito os{' '}
            <button
              type="button"
              className="text-blue-600 underline hover:text-blue-700"
              onClick={() => setShowTerms(true)}
            >
              termos e condições
            </button>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-xs text-red-500" role="alert">
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      {/* Terms modal */}
      {showTerms && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Termos e condições"
        >
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Termos e Condições</h3>
            <div className="text-sm text-gray-600 space-y-3">
              <p>
                Ao confirmar esta reserva, você concorda que os dados fornecidos são
                verdadeiros e que autoriza a cobrança do valor total indicado.
              </p>
              <p>
                A reserva está sujeita à disponibilidade e à política de cancelamento
                do hotel. Cancelamentos fora do prazo previsto podem gerar cobranças
                conforme a política do estabelecimento.
              </p>
              <p>
                Seus dados pessoais serão utilizados exclusivamente para a realização
                desta reserva e não serão compartilhados com terceiros sem seu
                consentimento, conforme a Lei Geral de Proteção de Dados (LGPD).
              </p>
              <p>
                Em caso de divergência entre as informações exibidas no momento da
                reserva e as condições do hotel, prevalece o que for comunicado
                diretamente pelo estabelecimento ao hóspede.
              </p>
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={() => setShowTerms(false)}>
                Entendi
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Button type="button" variant="secondary" size="lg" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Processando...' : 'Confirmar reserva'}
        </Button>
      </div>
    </form>
  )
}

function PriceBreakdown({
  rooms,
  nights,
  subtotal,
  taxes,
  total,
}: {
  rooms: SelectedRoom[]
  nights: number
  subtotal: number
  taxes: number
  total: number
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Detalhamento do preço</h3>

      <div className="space-y-1 text-sm">
        {rooms.map((room) => (
          <div key={room.id} className="flex justify-between text-gray-600">
            <span>
              {room.name} × {nights} {nights === 1 ? 'noite' : 'noites'}
            </span>
            <span>{formatCurrency(room.pricePerNight * nights)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-2 space-y-1 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Taxas e impostos (12%)</span>
          <span>{formatCurrency(taxes)}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-2 flex justify-between">
        <span className="text-base font-semibold text-gray-900">Total</span>
        <span className="text-xl font-bold text-gray-900">{formatCurrency(total)}</span>
      </div>
    </section>
  )
}
