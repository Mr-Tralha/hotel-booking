'use client'

import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { searchSchema, type SearchFormData } from '@/lib/validations/search'
import { useBookingStore } from '@/stores/booking-store'
import { DestinationAutocomplete } from './destination-autocomplete'
import { DateRangePicker } from './date-range-picker'
import { GuestSelector } from './guest-selector'
import { Button } from '@/components/ui/button'

export function SearchForm() {
  const router = useRouter()
  const setSearchParams = useBookingStore((s) => s.setSearchParams)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      destination: '',
      checkIn: '',
      checkOut: '',
      adults: 2,
      children: 0,
      rooms: 1,
    },
  })

  function onSubmit(data: SearchFormData) {
    setSearchParams({
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      adults: data.adults,
      children: data.children,
      rooms: data.rooms,
    })

    const params = new URLSearchParams({
      destination: data.destination,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      adults: String(data.adults),
      children: String(data.children),
      rooms: String(data.rooms),
    })

    router.push(`/search?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-lg sm:p-6 md:gap-5"
      noValidate
    >
      {/* Destino */}
      <Controller
        name="destination"
        control={control}
        render={({ field }) => (
          <DestinationAutocomplete
            value={field.value}
            onChange={field.onChange}
            error={errors.destination?.message}
          />
        )}
      />

      {/* Datas */}
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

      {/* Hóspedes e Quartos */}
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

      {/* Botão */}
      <Button type="submit" size="lg" className="w-full mt-1">
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
        Buscar hotéis
      </Button>
    </form>
  )
}
