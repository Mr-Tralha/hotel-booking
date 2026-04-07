'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface GuestSelectorProps {
  adults: number
  children: number
  rooms: number
  onAdultsChange: (value: number) => void
  onChildrenChange: (value: number) => void
  onRoomsChange: (value: number) => void
}

function Counter({
  label,
  subtitle,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  subtitle?: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Diminuir ${label.toLowerCase()}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-transparent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" />
          </svg>
        </button>
        <span className="w-6 text-center text-sm font-medium tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Aumentar ${label.toLowerCase()}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-transparent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export function GuestSelector({
  adults,
  children: childrenCount,
  rooms,
  onAdultsChange,
  onChildrenChange,
  onRoomsChange,
}: GuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const totalGuests = adults + childrenCount

  const summary = [
    `${totalGuests} hóspede${totalGuests !== 1 ? 's' : ''}`,
    `${rooms} quarto${rooms !== 1 ? 's' : ''}`,
  ].join(', ')

  return (
    <div ref={wrapperRef} className="relative flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        Hóspedes e Quartos
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={cn(
          'flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-left text-sm text-gray-900 transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
        )}
      >
        <svg
          className="h-4 w-4 shrink-0 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
        </svg>
        <span className="flex-1">{summary}</span>
        <svg
          className={cn(
            'h-4 w-4 shrink-0 text-gray-400 transition-transform',
            isOpen && 'rotate-180'
          )}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <Counter
            label="Adultos"
            value={adults}
            min={1}
            max={10}
            onChange={onAdultsChange}
          />
          <div className="border-t border-gray-100" />
          <Counter
            label="Crianças"
            subtitle="0 a 12 anos"
            value={childrenCount}
            min={0}
            max={6}
            onChange={onChildrenChange}
          />
          <div className="border-t border-gray-100" />
          <Counter
            label="Quartos"
            value={rooms}
            min={1}
            max={5}
            onChange={onRoomsChange}
          />
        </div>
      )}
    </div>
  )
}
