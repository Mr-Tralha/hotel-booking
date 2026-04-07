'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchFiltersProps {
  priceMin: string
  priceMax: string
  ratingMin: string
  propertyType: string
  onFilterChange: (updates: Record<string, string | undefined>) => void
}

const PROPERTY_TYPES = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'pousada', label: 'Pousada' },
  { value: 'resort', label: 'Resort' },
]

const RATING_OPTIONS = [
  { value: '', label: 'Qualquer' },
  { value: '3', label: '3+ estrelas' },
  { value: '4', label: '4+ estrelas' },
  { value: '4.5', label: '4.5+ estrelas' },
]

const PRICE_MIN = 0
const PRICE_MAX = 2000
const PRICE_STEP = 50

export function SearchFilters({
  priceMin,
  priceMax,
  ratingMin,
  propertyType,
  onFilterChange,
}: SearchFiltersProps) {
  const hasActiveFilters = !!(priceMin || priceMax || ratingMin || propertyType)

  const minVal = priceMin ? Number(priceMin) : PRICE_MIN
  const maxVal = priceMax ? Number(priceMax) : PRICE_MAX

  // Parse multi-select property types (comma-separated)
  const selectedTypes = propertyType ? propertyType.split(',') : []

  function togglePropertyType(value: string) {
    const next = selectedTypes.includes(value)
      ? selectedTypes.filter((t) => t !== value)
      : [...selectedTypes, value]
    onFilterChange({ propertyType: next.length > 0 ? next.join(',') : undefined })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() =>
              onFilterChange({
                priceMin: undefined,
                priceMax: undefined,
                ratingMin: undefined,
                propertyType: undefined,
              })
            }
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Price range slider */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-gray-700">
          Preço por noite
        </legend>
        <div className="flex items-center justify-between text-sm text-gray-900 font-medium">
          <span>R$ {minVal}</span>
          <span>R$ {maxVal}</span>
        </div>
        <div className="relative h-6 flex items-center">
          {/* Track background */}
          <div className="absolute inset-x-0 h-1.5 rounded-full bg-gray-200" />
          {/* Active track */}
          <div
            className="absolute h-1.5 rounded-full bg-blue-500"
            style={{
              left: `${((minVal - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
              right: `${100 - ((maxVal - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
            }}
          />
          {/* Min thumb */}
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={minVal}
            onChange={(e) => {
              const v = Number(e.target.value)
              if (v <= maxVal) {
                onFilterChange({ priceMin: v === PRICE_MIN ? undefined : String(v) })
              }
            }}
            className="pointer-events-none absolute inset-x-0 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
            aria-label="Preço mínimo"
          />
          {/* Max thumb */}
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={maxVal}
            onChange={(e) => {
              const v = Number(e.target.value)
              if (v >= minVal) {
                onFilterChange({ priceMax: v === PRICE_MAX ? undefined : String(v) })
              }
            }}
            className="pointer-events-none absolute inset-x-0 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
            aria-label="Preço máximo"
          />
        </div>
      </fieldset>

      {/* Avaliação mínima */}
      <fieldset className="flex flex-col gap-2">
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
              onClick={() => onFilterChange({ ratingMin: opt.value })}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </fieldset>

      {/* Property type — multi-select with radio visual */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-gray-700">
          Tipo de propriedade
        </legend>
        <div className="flex flex-col gap-1.5">
          {PROPERTY_TYPES.map((opt) => {
            const checked = selectedTypes.includes(opt.value)
            return (
              <label
                key={opt.value}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors border',
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
                  {checked && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => togglePropertyType(opt.value)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}
