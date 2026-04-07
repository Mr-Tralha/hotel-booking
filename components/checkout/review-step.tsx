'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createReviewSchema, type ReviewForm } from '@/lib/validations/checkout'
import type { PersonalDataForm, PaymentForm } from '@/lib/validations/checkout'
import { useBookingStore, type SelectedRoom } from '@/stores/booking-store'
import { formatCurrency, formatDate, calculateNights, calculateTotal } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useTranslations, useLocale } from '@/lib/i18n'

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
  const t = useTranslations('checkout')
  const tc = useTranslations('common')
  const tv = useTranslations('validation')
  const locale = useLocale()
  const schema = useMemo(() => createReviewSchema(tv), [tv])

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
    resolver: zodResolver(schema),
    defaultValues: { acceptTerms: undefined as unknown as true },
  })

  function onSubmit() {
    onConfirm()
  }

  const maskedCard = paymentData.cardNumber.replace(/\d(?=.{4})/g, '•')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <h2 className="text-lg font-semibold text-gray-900">{t('reviewTitle')}</h2>

      {/* Hotel + Room summary */}
      <section className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">{t('accommodation')}</h3>
        {hotel && (
          <p className="text-sm text-gray-900 font-medium">{hotel.name}</p>
        )}
        {checkIn && checkOut && (
          <p className="text-sm text-gray-600">
            {formatDate(new Date(checkIn), locale)} → {formatDate(new Date(checkOut), locale)}
            <span className="ml-1 text-gray-400">
              ({tc('nightCount', { count: nights })})
            </span>
          </p>
        )}
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{tc('adultCount', { count: adults })}</span>
          {children > 0 && (
            <span>, {tc('childCount', { count: children })}</span>
          )}
        </p>
        <ul className="space-y-1">
          {selectedRooms.map((room) => (
            <li key={room.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{room.name}</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(room.pricePerNight, locale)}
                <span className="text-xs text-gray-400">{tc('perNight')}</span>
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
        locale={locale}
        tc={tc}
        t={t}
      />

      {/* Personal data summary */}
      <section className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">{t('personalDataSection')}</h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm [&_dd]:min-w-0">
          <dt className="text-gray-500">{t('nameLabel')}</dt>
          <dd className="truncate text-gray-900">{personalData.fullName}</dd>
          <dt className="text-gray-500">{t('emailLabel')}</dt>
          <dd className="truncate text-gray-900" title={personalData.email}>{personalData.email}</dd>
          <dt className="text-gray-500">{t('phoneLabel')}</dt>
          <dd className="text-gray-900">{personalData.phone}</dd>
          <dt className="text-gray-500">{t('cpfLabel')}</dt>
          <dd className="text-gray-900">{personalData.cpf}</dd>
        </dl>
      </section>

      {/* Payment summary */}
      <section className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">{t('paymentSection')}</h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt className="text-gray-500">{t('cardLabel')}</dt>
          <dd className="text-gray-900 font-mono text-xs">{maskedCard}</dd>
          <dt className="text-gray-500">{t('holderLabel')}</dt>
          <dd className="text-gray-900">{paymentData.cardHolder}</dd>
          <dt className="text-gray-500">{t('expiryLabel')}</dt>
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
            {t('termsCheckbox')}{' '}
            <button
              type="button"
              className="text-blue-600 underline hover:text-blue-700"
              onClick={() => setShowTerms(true)}
            >
              {t('termsLink')}
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
          aria-label={t('termsTitle')}
        >
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-gray-900">{t('termsTitle')}</h3>
            <div className="text-sm text-gray-600 space-y-3">
              <p>{t('termsContent1')}</p>
              <p>{t('termsContent2')}</p>
              <p>{t('termsContent3')}</p>
              <p>{t('termsContent4')}</p>
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={() => setShowTerms(false)}>
                {t('understood')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Button type="button" variant="secondary" size="lg" onClick={onBack}>
          {tc('back')}
        </Button>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? t('processing') : t('confirmBooking')}
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
  locale,
  tc,
  t,
}: {
  rooms: SelectedRoom[]
  nights: number
  subtotal: number
  taxes: number
  total: number
  locale: string
  tc: (key: string, params?: Record<string, string | number>) => string
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">{t('priceBreakdown')}</h3>

      <div className="space-y-1 text-sm">
        {rooms.map((room) => (
          <div key={room.id} className="flex justify-between text-gray-600">
            <span>
              {room.name} × {tc('nightCount', { count: nights })}
            </span>
            <span>{formatCurrency(room.pricePerNight * nights, locale)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-2 space-y-1 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>{tc('subtotal')}</span>
          <span>{formatCurrency(subtotal, locale)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{tc('taxes')}</span>
          <span>{formatCurrency(taxes, locale)}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-2 flex justify-between">
        <span className="text-base font-semibold text-gray-900">{tc('total')}</span>
        <span className="text-xl font-bold text-gray-900">{formatCurrency(total, locale)}</span>
      </div>
    </section>
  )
}
