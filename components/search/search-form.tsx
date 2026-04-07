'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { searchSchema, type SearchFormData } from '@/lib/validations/search'
import { useBookingStore } from '@/stores/booking-store'
import { cn } from '@/lib/utils'
import { DestinationAutocomplete } from './destination-autocomplete'
import { DateRangePicker } from './date-range-picker'
import { GuestSelector } from './guest-selector'
import { Button } from '@/components/ui/button'

const PROPERTY_TYPES = [
  { value: '', label: 'Todos' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'pousada', label: 'Pousada' },
  { value: 'resort', label: 'Resort' },
]

const RATING_OPTIONS = [
  { value: '', label: 'Qualquer' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '4.5', label: '4.5+' },
]

interface SearchFormProps {
  defaultValues?: {
    destination?: string
    checkIn?: string
    checkOut?: string
    adults?: number
    children?: number
    rooms?: number
    priceMin?: string
    priceMax?: string
    ratingMin?: string
    propertyType?: string
    sort?: string
  }
}

export function SearchForm({ defaultValues }: SearchFormProps) {
  const router = useRouter()
  const setSearchParams = useBookingStore((s) => s.setSearchParams)
  const [showFilters, setShowFilters] = useState(
    !!(defaultValues?.priceMin || defaultValues?.priceMax || defaultValues?.ratingMin || defaultValues?.propertyType)
  )
  const [priceMin, setPriceMin] = useState(defaultValues?.priceMin ?? '')
  const [priceMax, setPriceMax] = useState(defaultValues?.priceMax ?? '')
  const [ratingMin, setRatingMin] = useState(defaultValues?.ratingMin ?? '')
  const [propertyType, setPropertyType] = useState(defaultValues?.propertyType ?? '')
  const [sort, setSort] = useState(defaultValues?.sort ?? '')

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      destination: defaultValues?.destination ?? '',
      checkIn: defaultValues?.checkIn ?? '',
      checkOut: defaultValues?.checkOut ?? '',
      adults: defaultValues?.adults ?? 2,
      children: defaultValues?.children ?? 0,
      rooms: defaultValues?.rooms ?? 1,
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

    if (priceMin) params.set('priceMin', priceMin)
    if (priceMax) params.set('priceMax', priceMax)
    if (ratingMin) params.set('ratingMin', ratingMin)
    if (propertyType) params.set('propertyType', propertyType)
    if (sort) params.set('sort', sort)

    router.push(`/search?${params.toString()}`)
  }

  const hasActiveFilters = !!(priceMin || priceMax || ratingMin || propertyType)

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

      {/* Mais filtros toggle */}
      <button
        type="button"
        onClick={() => setShowFilters((v) => !v)}
        className="flex items-center gap-2 self-start text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        <FilterIcon />
        Mais filtros
        {hasActiveFilters && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
            {[priceMin, priceMax, ratingMin, propertyType].filter(Boolean).length}
          </span>
        )}
        <svg
          className={cn('h-4 w-4 transition-transform', showFilters && 'rotate-180')}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Filtros colapsáveis */}
      {showFilters && (
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          {/* Faixa de preço */}
          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm font-medium text-gray-700">
              Preço por noite (R$)
            </legend>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min="0"
                placeholder="Mínimo"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <input
                type="number"
                min="0"
                placeholder="Máximo"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </fieldset>

          {/* Avaliação mínima */}
          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm font-medium text-gray-700">
              Avaliação mínima
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {RATING_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={ratingMin === opt.value ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setRatingMin(opt.value)}
                >
                  {opt.value && '★ '}{opt.label}
                </Button>
              ))}
            </div>
          </fieldset>

          {/* Tipo de propriedade */}
          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm font-medium text-gray-700">
              Tipo de propriedade
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {PROPERTY_TYPES.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={propertyType === opt.value ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setPropertyType(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </fieldset>

          {/* Ordenação */}
          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm font-medium text-gray-700">
              Ordenar por
            </legend>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Relevância</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
              <option value="rating_desc">Melhor avaliação</option>
            </select>
          </fieldset>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setPriceMin('')
                setPriceMax('')
                setRatingMin('')
                setPropertyType('')
              }}
              className="self-start text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

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

function FilterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}
