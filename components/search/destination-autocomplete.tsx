'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useSuggestions } from '@/hooks/queries/use-suggestions'
import { useHistoryStore } from '@/stores/history-store'
import { cn } from '@/lib/utils'

interface DestinationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

const DEBOUNCE_MS = 300

const typeLabels: Record<string, string> = {
  city: 'Cidade',
  beach: 'Praia',
  island: 'Ilha',
  nature: 'Natureza',
}

export function DestinationAutocomplete({
  value,
  onChange,
  error,
}: DestinationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const { data: suggestions, isLoading } = useSuggestions(debouncedQuery)
  const recentSearches = useHistoryStore((s) => s.recentSearches)
  const recentHotels = useHistoryStore((s) => s.recentHotels)

  // Build history items for display
  const historyItems = (() => {
    if (!showHistory) return []
    const items: { label: string; sublabel: string; type: 'search' | 'hotel'; value: string }[] = []
    const seen = new Set<string>()

    for (const s of recentSearches) {
      if (!seen.has(s.destination)) {
        seen.add(s.destination)
        items.push({
          label: s.destination,
          sublabel: 'Pesquisa recente',
          type: 'search',
          value: s.destination,
        })
      }
    }
    for (const h of recentHotels) {
      if (!seen.has(h.destination)) {
        seen.add(h.destination)
        items.push({
          label: h.destination,
          sublabel: `Hotel: ${h.name}`,
          type: 'hotel',
          value: h.destination,
        })
      }
    }
    return items.slice(0, 5)
  })()

  // Debounce input
  const handleInputChange = useCallback(
    (val: string) => {
      setInputValue(val)
      onChange('')
      setActiveIndex(-1)
      setShowHistory(false)

      if (timerRef.current) clearTimeout(timerRef.current)

      if (val.length >= 2) {
        timerRef.current = setTimeout(() => {
          setDebouncedQuery(val)
          setIsOpen(true)
        }, DEBOUNCE_MS)
      } else {
        setDebouncedQuery('')
        setIsOpen(false)
      }
    },
    [onChange]
  )

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
        setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sync external value
  useEffect(() => {
    if (value && value !== inputValue) {
      setInputValue(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  function selectSuggestion(name: string) {
    setInputValue(name)
    onChange(name)
    setIsOpen(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || !suggestions?.length) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          selectSuggestion(suggestions[activeIndex].name)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setActiveIndex(-1)
        break
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  return (
    <div ref={wrapperRef} className="relative flex flex-col gap-1">
      <label
        htmlFor="destination"
        className="text-sm font-medium text-gray-700"
      >
        Destino
      </label>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.145c.182-.1.422-.242.707-.427.57-.37 1.318-.93 2.065-1.685C14.89 15.165 16.5 12.838 16.5 10c0-3.59-2.91-6.5-6.5-6.5S3.5 6.41 3.5 10c0 2.838 1.61 5.165 3.113 6.665a13.586 13.586 0 002.065 1.685 8.5 8.5 0 00.707.427 4.14 4.14 0 00.281.145l.018.008.006.003zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
        <input
          ref={inputRef}
          id="destination"
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={isOpen}
          aria-controls="destination-listbox"
          aria-activedescendant={
            activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
          }
          aria-invalid={!!error}
          aria-describedby={error ? 'destination-error' : undefined}
          placeholder="Para onde você vai?"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (suggestions?.length && inputValue.length >= 2) {
              setIsOpen(true)
            } else if (inputValue.length < 2 && (recentSearches.length > 0 || recentHotels.length > 0)) {
              setShowHistory(true)
            }
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
            error &&
            'border-red-400 focus:border-red-500 focus:ring-red-500/20'
          )}
        />
        {isLoading && debouncedQuery && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          </div>
        )}
      </div>

      {error && (
        <p id="destination-error" className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}

      {isOpen && suggestions && suggestions.length > 0 && (
        <ul
          ref={listRef}
          id="destination-listbox"
          role="listbox"
          className="absolute top-full left-0 right-0 z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={cn(
                'flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                index === activeIndex
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
              onMouseDown={() => selectSuggestion(suggestion.name)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <svg
                className="h-4 w-4 shrink-0 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.145c.182-.1.422-.242.707-.427.57-.37 1.318-.93 2.065-1.685C14.89 15.165 16.5 12.838 16.5 10c0-3.59-2.91-6.5-6.5-6.5S3.5 6.41 3.5 10c0 2.838 1.61 5.165 3.113 6.665a13.586 13.586 0 002.065 1.685 8.5 8.5 0 00.707.427 4.14 4.14 0 00.281.145l.018.008.006.003zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex flex-col">
                <span className="font-medium">{suggestion.name}</span>
                <span className="text-xs text-gray-400">
                  {typeLabels[suggestion.type] || suggestion.type} &middot;{' '}
                  {suggestion.country}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOpen && suggestions && suggestions.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1 rounded-lg border border-gray-200 bg-white p-4 text-center text-sm text-gray-500 shadow-lg">
          Nenhum destino encontrado
        </div>
      )}

      {/* History dropdown when input is empty */}
      {showHistory && !isOpen && historyItems.length > 0 && (
        <ul
          className="absolute top-full left-0 right-0 z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          <li className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
            Recentes
          </li>
          {historyItems.map((item, index) => (
            <li
              key={`${item.type}-${index}`}
              className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onMouseDown={() => {
                selectSuggestion(item.value)
                setShowHistory(false)
              }}
            >
              {item.type === 'search' ? <HistoryIcon /> : <HotelPinIcon />}
              <div className="flex flex-col">
                <span className="font-medium">{item.label}</span>
                <span className="text-xs text-gray-400">{item.sublabel}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function HistoryIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function HotelPinIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.145c.182-.1.422-.242.707-.427.57-.37 1.318-.93 2.065-1.685C14.89 15.165 16.5 12.838 16.5 10c0-3.59-2.91-6.5-6.5-6.5S3.5 6.41 3.5 10c0 2.838 1.61 5.165 3.113 6.665a13.586 13.586 0 002.065 1.685 8.5 8.5 0 00.707.427 4.14 4.14 0 00.281.145l.018.008.006.003zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  )
}
