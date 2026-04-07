'use client'

import { useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DateRangePicker } from '@/components/search/date-range-picker'
import { GuestSelector } from '@/components/search/guest-selector'
import { Button } from '@/components/ui/button'
import { useBookingStore } from '@/stores/booking-store'

const datesGuestsSchema = z
  .object({
    checkIn: z.string().min(1, 'Selecione a data de check-in'),
    checkOut: z.string().min(1, 'Selecione a data de check-out'),
    adults: z.number().min(1, 'Mínimo 1 adulto').max(10),
    children: z.number().min(0).max(6),
    rooms: z.number().min(1).max(5),
  })
  .refine(
    (data) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return new Date(data.checkIn + 'T00:00:00') >= today
    },
    { message: 'Check-in não pode ser no passado', path: ['checkIn'] }
  )
  .refine(
    (data) => {
      const diff =
        new Date(data.checkOut + 'T00:00:00').getTime() -
        new Date(data.checkIn + 'T00:00:00').getTime()
      return diff / (1000 * 60 * 60 * 24) >= 1
    },
    { message: 'Check-out deve ser ao menos 1 dia após check-in', path: ['checkOut'] }
  )
  .refine(
    (data) => {
      const diff =
        new Date(data.checkOut + 'T00:00:00').getTime() -
        new Date(data.checkIn + 'T00:00:00').getTime()
      return diff / (1000 * 60 * 60 * 24) <= 30
    },
    { message: 'Estadia máxima de 30 dias', path: ['checkOut'] }
  )

type DatesGuestsForm = z.infer<typeof datesGuestsSchema>

interface SearchParamsModalProps {
  onClose: () => void
}

export function SearchParamsModal({ onClose }: SearchParamsModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const setSearchParams = useBookingStore((s) => s.setSearchParams)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DatesGuestsForm>({
    resolver: zodResolver(datesGuestsSchema),
    defaultValues: {
      checkIn: '',
      checkOut: '',
      adults: 2,
      children: 0,
      rooms: 1,
    },
  })

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Informar datas e hóspedes"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Informe as datas e hóspedes
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Necessário para ver disponibilidade e preços.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="ml-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Fechar"
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
                        children={childrenField.value}
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
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Confirmar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
