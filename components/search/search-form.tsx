'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { searchSchema, type SearchFormData } from '@/lib/validations/search'
import { useBookingStore } from '@/stores/booking-store'
import { useHistoryStore } from '@/stores/history-store'
import { cn } from '@/lib/utils'
import { AMENITY_LABELS } from '@/lib/labels'
import type { Amenity } from '@/types/mock-db'
import { DestinationAutocomplete } from './destination-autocomplete'
import { DateRangePicker } from './date-range-picker'
import { GuestSelector } from './guest-selector'
import { Button } from '@/components/ui/button'

const PROPERTY_TYPES = [
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

const SORT_OPTIONS = [
  { value: '', label: 'Relevância' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'rating_desc', label: 'Melhor avaliação' },
  { value: 'popular', label: 'Mais popular' },
]

const FILTER_AMENITIES: Amenity[] = [
  'wifi', 'pool', 'parking', 'gym', 'restaurant', 'spa',
  'bar', 'breakfast', 'room_service', 'beach_access',
]

const PRICE_MIN = 0
const PRICE_MAX = 2000
const PRICE_STEP = 50

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
    amenities?: string
    sort?: string
  }
}

export function SearchForm({ defaultValues }: SearchFormProps) {
  const router = useRouter()
  const setSearchParams = useBookingStore((s) => s.setSearchParams)
  const addRecentSearch = useHistoryStore((s) => s.addRecentSearch)
  const [showFilters, setShowFilters] = useState(
    !!(defaultValues?.priceMin || defaultValues?.priceMax || defaultValues?.ratingMin || defaultValues?.propertyType || defaultValues?.amenities)
  )
  const [priceMin, setPriceMin] = useState(defaultValues?.priceMin ?? '')
  const [priceMax, setPriceMax] = useState(defaultValues?.priceMax ?? '')
  const [ratingMin, setRatingMin] = useState(defaultValues?.ratingMin ?? '')
  const [propertyType, setPropertyType] = useState(defaultValues?.propertyType ?? '')
  const [amenities, setAmenities] = useState(defaultValues?.amenities ?? '')
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
    if (amenities) params.set('amenities', amenities)
    if (sort) params.set('sort', sort)

    // Save search to history
    const filterParts: string[] = []
    if (priceMin) filterParts.push(`priceMin=${priceMin}`)
    if (priceMax) filterParts.push(`priceMax=${priceMax}`)
    if (ratingMin) filterParts.push(`ratingMin=${ratingMin}`)
    if (propertyType) filterParts.push(`propertyType=${propertyType}`)
    if (amenities) filterParts.push(`amenities=${amenities}`)
    if (sort) filterParts.push(`sort=${sort}`)

    addRecentSearch({
      destination: data.destination,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      adults: data.adults,
      children: data.children,
      rooms: data.rooms,
      filters: filterParts.join('&'),
      searchedAt: new Date().toISOString(),
    })

    router.push(`/search?${params.toString()}`)
  }

  const hasActiveFilters = !!(priceMin || priceMax || ratingMin || propertyType || amenities)

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
            {[priceMin, priceMax, ratingMin, propertyType, amenities].filter(Boolean).length}
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
          {/* Price range slider */}
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-gray-700">
              Preço por noite (R$)
            </legend>
            <div className="flex items-center justify-between text-sm text-gray-900 font-medium">
              <span>R$ {priceMin ? Number(priceMin) : PRICE_MIN}</span>
              <span>R$ {priceMax ? Number(priceMax) : PRICE_MAX}</span>
            </div>
            <div className="relative h-6 flex items-center">
              <div className="absolute inset-x-0 h-1.5 rounded-full bg-gray-200" />
              <div
                className="absolute h-1.5 rounded-full bg-blue-500"
                style={{
                  left: `${(((priceMin ? Number(priceMin) : PRICE_MIN) - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                  right: `${100 - (((priceMax ? Number(priceMax) : PRICE_MAX) - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                }}
              />
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={PRICE_STEP}
                value={priceMin ? Number(priceMin) : PRICE_MIN}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  const maxV = priceMax ? Number(priceMax) : PRICE_MAX
                  if (v <= maxV) setPriceMin(v === PRICE_MIN ? '' : String(v))
                }}
                className="pointer-events-none absolute inset-x-0 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                aria-label="Preço mínimo"
              />
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={PRICE_STEP}
                value={priceMax ? Number(priceMax) : PRICE_MAX}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  const minV = priceMin ? Number(priceMin) : PRICE_MIN
                  if (v >= minV) setPriceMax(v === PRICE_MAX ? '' : String(v))
                }}
                className="pointer-events-none absolute inset-x-0 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                aria-label="Preço máximo"
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

          {/* Tipo de propriedade — multi-select */}
          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm font-medium text-gray-700">
              Tipo de propriedade
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {PROPERTY_TYPES.map((opt) => {
                const selectedTypes = propertyType ? propertyType.split(',') : []
                const checked = selectedTypes.includes(opt.value)
                return (
                  <label
                    key={opt.value}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors border',
                      checked
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded-full border-2 flex-shrink-0 transition-colors',
                        checked ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      )}
                    >
                      {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = checked
                          ? selectedTypes.filter((t) => t !== opt.value)
                          : [...selectedTypes, opt.value]
                        setPropertyType(next.join(','))
                      }}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                )
              })}
            </div>
          </fieldset>

          {/* Comodidades — multi-select */}
          {(() => {
            const selectedAmenities = amenities ? amenities.split(',') : []
            return (
              <fieldset className="flex flex-col gap-1.5">
                <legend className="text-sm font-medium text-gray-700">
                  Comodidades
                </legend>
                <div className="flex flex-wrap gap-1.5">
                  {FILTER_AMENITIES.map((amenity) => {
                    const checked = selectedAmenities.includes(amenity)
                    return (
                      <Button
                        key={amenity}
                        type="button"
                        variant={checked ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => {
                          const next = checked
                            ? selectedAmenities.filter((a) => a !== amenity)
                            : [...selectedAmenities, amenity]
                          setAmenities(next.join(','))
                        }}
                      >
                        {AMENITY_LABELS[amenity]}
                      </Button>
                    )
                  })}
                </div>
              </fieldset>
            )
          })()}

          {/* Ordenação */}
          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm font-medium text-gray-700">
              Ordenar por
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {SORT_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={sort === opt.value ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSort(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </fieldset>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setPriceMin('')
                setPriceMax('')
                setRatingMin('')
                setPropertyType('')
                setAmenities('')
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
