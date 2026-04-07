'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { toDateInputValue } from '@/lib/utils'
import { useTranslations, useLocale } from '@/lib/i18n'

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

function formatShortDate(value: string, locale: string): string {
  if (!value) return ''
  const date = new Date(value + 'T00:00:00')
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(date)
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
  const checkInRef = useRef<HTMLInputElement>(null)
  const checkOutRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('search')
  const locale = useLocale()
  const today = toDateInputValue(new Date())
  const minCheckOut = checkIn
    ? toDateInputValue(new Date(new Date(checkIn + 'T00:00:00').getTime() + 86400000))
    : today
  const maxCheckOut = checkIn
    ? toDateInputValue(new Date(new Date(checkIn + 'T00:00:00').getTime() + 30 * 86400000))
    : undefined

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          'flex overflow-hidden rounded-xl border',
          checkInError || checkOutError ? 'border-red-400' : 'border-gray-300'
        )}
      >
        {/* Check-in side */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => checkInRef.current?.showPicker?.()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') checkInRef.current?.showPicker?.()
          }}
          className="relative flex flex-1 cursor-pointer flex-col px-4 py-3 select-none hover:bg-gray-50 transition-colors"
          aria-label={t('selectCheckIn')}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t('checkIn')}
          </span>
          <div className="mt-1 flex items-center gap-1.5">
            <CalendarIcon />
            <span className={cn('text-sm font-medium', checkIn ? 'text-gray-900' : 'text-gray-400')}>
              {checkIn ? formatShortDate(checkIn, locale) : t('selectDate')}
            </span>
          </div>
          <input
            ref={checkInRef}
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => {
              onCheckInChange(e.target.value)
              if (checkOut && e.target.value >= checkOut) onCheckOutChange('')
            }}
            aria-label={t('checkInDate')}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>

        {/* Vertical divider */}
        <div className="w-px self-stretch bg-gray-200" />

        {/* Check-out side */}
        <div
          role="button"
          tabIndex={checkIn ? 0 : -1}
          onClick={() => { if (checkIn) checkOutRef.current?.showPicker?.() }}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && checkIn) checkOutRef.current?.showPicker?.()
          }}
          className={cn(
            'relative flex flex-1 flex-col px-4 py-3 select-none transition-colors',
            checkIn ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed opacity-60'
          )}
          aria-label={t('selectCheckOut')}
          aria-disabled={checkIn ? undefined : 'true'}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t('checkOut')}
          </span>
          <div className="mt-1 flex items-center gap-1.5">
            <CalendarIcon />
            <span className={cn('text-sm font-medium', checkOut ? 'text-gray-900' : 'text-gray-400')}>
              {checkOut ? formatShortDate(checkOut, locale) : t('selectDate')}
            </span>
          </div>
          <input
            ref={checkOutRef}
            type="date"
            min={minCheckOut}
            max={maxCheckOut}
            value={checkOut}
            disabled={!checkIn}
            onChange={(e) => onCheckOutChange(e.target.value)}
            aria-label={t('checkOutDate')}
            className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {checkInError && (
        <p className="text-xs text-red-500" role="alert">{checkInError}</p>
      )}
      {!checkInError && checkOutError && (
        <p className="text-xs text-red-500" role="alert">{checkOutError}</p>
      )}
    </div>
  )
}
