'use client'

import { useRef, type ReactNode } from 'react'
import { useTranslations } from '@/lib/i18n'

interface CarouselProps {
  children: ReactNode
  /** Label shown above the arrows (optional) */
  title?: ReactNode
  /** Extra classes on the scroll container */
  className?: string
  /** Width of each card on mobile (default: 85vw) */
  mobileCardWidth?: string
}

/**
 * Generic horizontal-scroll carousel.
 *
 * - Mobile: snap-x, one card at a time (snap-center).
 * - Desktop: multiple cards side-by-side, prev/next arrow buttons.
 *
 * Direct children should be block-level elements (e.g. <article>, <div>).
 * Each child receives `flex-shrink-0` sizing via the container; you can
 * override the child's width externally if needed.
 */
export function Carousel({ children, title, className = '' }: CarouselProps) {
  const t = useTranslations('hotel')
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(direction: 'left' | 'right') {
    const container = scrollRef.current
    if (!container) return
    const cardWidth = container.firstElementChild?.getBoundingClientRect().width ?? 300
    const distance = direction === 'left' ? -(cardWidth + 16) : cardWidth + 16
    container.scrollBy({ left: distance, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Header row — title + arrows */}
      {title !== undefined && (
        <div className="flex items-center justify-between">
          <div>{title}</div>
          <div className="hidden sm:flex items-center gap-1">
            <CarouselArrow direction="left" onClick={() => scroll('left')} label={t('previousSlide')} />
            <CarouselArrow direction="right" onClick={() => scroll('right')} label={t('nextSlide')} />
          </div>
        </div>
      )}

      {/* When no title, still render arrows aligned to the right */}
      {title === undefined && (
        <div className="hidden sm:flex justify-end gap-1 mb-2">
          <CarouselArrow direction="left" onClick={() => scroll('left')} label={t('previousSlide')} />
          <CarouselArrow direction="right" onClick={() => scroll('right')} label={t('nextSlide')} />
        </div>
      )}

      <div
        ref={scrollRef}
        className={[
          'flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3',
          '-mx-4 px-4 sm:-mx-0 sm:px-0 sm:snap-none',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ scrollbarWidth: 'none' }}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * Convenience wrapper for a carousel item — handles the flex-shrink-0,
 * snap alignment and responsive width automatically.
 *
 * Usage:
 *   <CarouselItem>…content…</CarouselItem>
 *   <CarouselItem className="sm:w-96">…wider card…</CarouselItem>
 */
export function CarouselItem({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={[
        'w-[85vw] flex-shrink-0 snap-center sm:w-80 sm:snap-start',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

function CarouselArrow({
  direction,
  onClick,
  label,
}: {
  direction: 'left' | 'right'
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer"
      aria-label={label}
    >
      {direction === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </button>
  )
}

function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
