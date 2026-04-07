'use client'

import { cn } from '@/lib/utils'
import { toDateInputValue } from '@/lib/utils'

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

interface DateRangePickerProps {
  checkIn: string
  checkOut: string
  onCheckInChange: (value: string) => void
  onCheckOutChange: (value: string) => void
  checkInError?: string
  checkOutError?: string
}

export function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  checkInError,
  checkOutError,
}: DateRangePickerProps) {
  const today = toDateInputValue(new Date())

  // Min check-out: check-in + 1 dia
  const minCheckOut = checkIn
    ? toDateInputValue(
      new Date(new Date(checkIn + 'T00:00:00').getTime() + 86400000)
    )
    : today

  // Max check-out: check-in + 30 dias
  const maxCheckOut = checkIn
    ? toDateInputValue(
      new Date(
        new Date(checkIn + 'T00:00:00').getTime() + 30 * 86400000
      )
    )
    : undefined

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="check-in"
          className="text-sm font-medium text-gray-700"
        >
          Check-in
        </label>
        <div className="relative">
          <input
            id="check-in"
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => {
              onCheckInChange(e.target.value)
              // Reset check-out se ficou antes do novo check-in
              if (checkOut && e.target.value >= checkOut) {
                onCheckOutChange('')
              }
            }}
            aria-invalid={!!checkInError}
            aria-describedby={checkInError ? 'checkin-error' : undefined}
            className={cn(
              'w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              checkIn ? 'text-gray-900' : 'text-transparent',
              checkInError &&
              'border-red-400 focus:border-red-500 focus:ring-red-500/20'
            )}
          />
          {!checkIn && (
            <span className="pointer-events-none absolute inset-0 flex items-center gap-1.5 px-3 text-sm text-gray-400">
              <CalendarIcon />
              dd/mm/aaaa
            </span>
          )}
        </div>
        {checkInError && (
          <p id="checkin-error" className="text-xs text-red-500" role="alert">
            {checkInError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="check-out"
          className="text-sm font-medium text-gray-700"
        >
          Check-out
        </label>
        <div className="relative">
          <input
            id="check-out"
            type="date"
            min={minCheckOut}
            max={maxCheckOut}
            value={checkOut}
            onChange={(e) => onCheckOutChange(e.target.value)}
            disabled={!checkIn}
            aria-invalid={!!checkOutError}
            aria-describedby={checkOutError ? 'checkout-error' : undefined}
            className={cn(
              'w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50',
              checkOut ? 'text-gray-900' : 'text-transparent',
              checkOutError &&
              'border-red-400 focus:border-red-500 focus:ring-red-500/20'
            )}
          />
          {!checkOut && (
            <span className="pointer-events-none absolute inset-0 flex items-center gap-1.5 px-3 text-sm text-gray-400">
              <CalendarIcon />
              dd/mm/aaaa
            </span>
          )}
        </div>
        {checkOutError && (
          <p id="checkout-error" className="text-xs text-red-500" role="alert">
            {checkOutError}
          </p>
        )}
      </div>
    </div>
  )
}
