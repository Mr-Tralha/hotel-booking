'use client'

import { useTranslations } from '@/lib/i18n'

interface SortSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function SortSelector({ value, onChange }: SortSelectorProps) {
  const t = useTranslations('search')

  const SORT_OPTIONS = [
    { value: '', label: t('sortRelevance') },
    { value: 'price_asc', label: t('sortLowestPrice') },
    { value: 'price_desc', label: t('sortHighestPrice') },
    { value: 'rating_desc', label: t('sortBestRating') },
  ]

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
        {t('sortBy')}:
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
