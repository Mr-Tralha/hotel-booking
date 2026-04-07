'use client'

import { Button } from '@/components/ui/button'

interface SearchFiltersProps {
  priceMin: string
  priceMax: string
  ratingMin: string
  propertyType: string
  onFilterChange: (updates: Record<string, string | undefined>) => void
}

const PROPERTY_TYPES = [
  { value: '', label: 'Todos' },
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

export function SearchFilters({
  priceMin,
  priceMax,
  ratingMin,
  propertyType,
  onFilterChange,
}: SearchFiltersProps) {
  const hasActiveFilters = !!(priceMin || priceMax || ratingMin || propertyType)

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

      {/* Faixa de preço */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-gray-700">
          Preço por noite
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="price-min" className="sr-only">
              Preço mínimo
            </label>
            <input
              id="price-min"
              type="number"
              min="0"
              placeholder="Mín"
              value={priceMin}
              onChange={(e) => onFilterChange({ priceMin: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label htmlFor="price-max" className="sr-only">
              Preço máximo
            </label>
            <input
              id="price-max"
              type="number"
              min="0"
              placeholder="Máx"
              value={priceMax}
              onChange={(e) => onFilterChange({ priceMax: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
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

      {/* Tipo de propriedade */}
      <fieldset className="flex flex-col gap-2">
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
              onClick={() => onFilterChange({ propertyType: opt.value })}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
