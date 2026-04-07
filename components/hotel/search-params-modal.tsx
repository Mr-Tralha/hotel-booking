'use client'

import { useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DateRangePicker } from '@/components/search/date-range-picker'
import { GuestSelector } from '@/components/search/guest-selector'
import { Button } from '@/components/ui/button'
import { BaseModal } from '@/components/ui/base-modal'
import { useBookingStore } from '@/stores/booking-store'
import { useTranslations } from '@/lib/i18n'

function createDatesGuestsSchema(tv: (key: string) => string) {
  return z
    .object({
      checkIn: z.string().min(1, tv('checkInRequired')),
      checkOut: z.string().min(1, tv('checkOutRequired')),
      adults: z.number().min(1, tv('adultsMin')).max(10),
      children: z.number().min(0).max(6),
      rooms: z.number().min(1).max(5),
    })
    .refine(
      (data) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return new Date(data.checkIn + 'T00:00:00') >= today
      },
      { message: tv('checkInPast'), path: ['checkIn'] }
    )
    .refine(
      (data) => {
        const diff =
          new Date(data.checkOut + 'T00:00:00').getTime() -
          new Date(data.checkIn + 'T00:00:00').getTime()
        return diff / (1000 * 60 * 60 * 24) >= 1
      },
      { message: tv('checkOutMinDays'), path: ['checkOut'] }
    )
    .refine(
      (data) => {
        const diff =
          new Date(data.checkOut + 'T00:00:00').getTime() -
          new Date(data.checkIn + 'T00:00:00').getTime()
        return diff / (1000 * 60 * 60 * 24) <= 30
      },
      { message: tv('maxStay'), path: ['checkOut'] }
    )
}

type DatesGuestsForm = z.infer<ReturnType<typeof createDatesGuestsSchema>>

interface SearchParamsModalProps {
  onClose: () => void
}

export function SearchParamsModal({ onClose }: SearchParamsModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const setSearchParams = useBookingStore((s) => s.setSearchParams)
  const tv = useTranslations('validation')
  const t = useTranslations('hotel')
  const tc = useTranslations('common')
  const schema = useMemo(() => createDatesGuestsSchema(tv), [tv])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DatesGuestsForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      checkIn: '',
      checkOut: '',
      adults: 2,
      children: 0,
      rooms: 1,
    },
  })

  function onCancel() {
    router.back()
  }

  function onSubmit(data: DatesGuestsForm) {
    setSearchParams({
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      adults: data.adults,
      children: data.children,
      rooms: data.rooms,
    })

    const params = new URLSearchParams(searchParams.toString())
    params.set('checkIn', data.checkIn)
    params.set('checkOut', data.checkOut)
    params.set('adults', String(data.adults))
    params.set('children', String(data.children))
    params.set('rooms', String(data.rooms))

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    onClose()
  }

  return (
    <BaseModal
      isOpen
      onClose={onCancel}
      closeOnBackdropClick={false}
      ariaLabel={t('informDatesAndGuests')}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {t('informDatesAndGuests')}
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {t('informDatesDescription')}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="ml-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label={tc('close')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>

          {/* Date range picker */}
          <Controller
            name="checkIn"
            control={control}
            render={({ field: checkInField }) => (
              <Controller
                name="checkOut"
                control={control}
                render={({ field: checkOutField }) => (
                  <DateRangePicker
                    checkIn={checkInField.value}
                    checkOut={checkOutField.value}
                    onCheckInChange={checkInField.onChange}
                    onCheckOutChange={checkOutField.onChange}
                    checkInError={errors.checkIn?.message}
                    checkOutError={errors.checkOut?.message}
                  />
                )}
              />
            )}
          />

          {/* Guest selector (dropdown) */}
          <Controller
            name="adults"
            control={control}
            render={({ field: adultsField }) => (
              <Controller
                name="children"
                control={control}
                render={({ field: childrenField }) => (
                  <Controller
                    name="rooms"
                    control={control}
                    render={({ field: roomsField }) => (
                      <GuestSelector
                        adults={adultsField.value}
                        childGuests={childrenField.value}
                        rooms={roomsField.value}
                        onAdultsChange={adultsField.onChange}
                        onChildrenChange={childrenField.onChange}
                        onRoomsChange={roomsField.onChange}
                      />
                    )}
                  />
                )}
              />
            )}
          />

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
              {tc('cancel')}
            </Button>
            <Button type="submit" className="flex-1">
              {tc('confirm')}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  )
}
