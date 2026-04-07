'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface AmenitiesDropdownProps<T extends string> {
  amenities: T[]
  labels: Record<T, string>
  title: string
}

/**
 * Collapsible amenities list used for both hotel and room amenities.
 * Generic over the amenity type for type-safe label lookup.
 */
export function AmenitiesDropdown<T extends string>({
  amenities,
  labels,
  title,
}: AmenitiesDropdownProps<T>) {
  const [open, setOpen] = useState(false)

  if (amenities.length === 0) return null

  return (
    <div className="rounded-lg border border-gray-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
        aria-expanded={open}
      >
        <h3 className="text-lg font-semibold text-gray-900">
          {title} ({amenities.length})
        </h3>
        <svg
          className={cn(
            'h-5 w-5 text-gray-500 transition-transform duration-200',
            open && 'rotate-180'
          )}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={cn(
          'grid overflow-hidden transition-all duration-200 ease-in-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-2 gap-2 px-4 pb-4 sm:grid-cols-3">
            {amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                <CheckIcon />
                {labels[amenity]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckIcon() {
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
      className="text-blue-500 flex-shrink-0"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
