'use client'

import Image from 'next/image'
import { useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/lib/i18n'

interface ImageLightboxProps {
  images: string[]
  initialIndex?: number
  onClose: () => void
  altPrefix?: string
}

/**
 * Fullscreen image lightbox with keyboard/touch navigation.
 * Reusable across hotel gallery, room images, etc.
 */
export function ImageLightbox({
  images,
  initialIndex = 0,
  onClose,
  altPrefix,
}: ImageLightboxProps) {
  const t = useTranslations('lightbox')
  const tc = useTranslations('common')
  const [index, setIndex] = useState(initialIndex)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const goTo = useCallback(
    (i: number) => setIndex((i + images.length) % images.length),
    [images.length]
  )

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goTo(index - 1)
      if (e.key === 'ArrowRight') goTo(index + 1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [index, goTo, onClose])

  // Touch swipe
  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX)
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return
    const diff = e.changedTouches[0].clientX - touchStart
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? index - 1 : index + 1)
    }
    setTouchStart(null)
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label={t('viewImage')}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
        aria-label={tc('close')}
      >
        <CloseIcon />
      </button>

      {/* Counter */}
      <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm">
        {index + 1} / {images.length}
      </span>

      {/* Previous */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20 transition-colors hidden md:flex"
          aria-label={t('previous')}
        >
          <ChevronLeftIcon />
        </button>
      )}

      {/* Image */}
      <div className="relative mx-4 md:mx-16 h-[80vh] w-full max-w-5xl">
        <Image
          src={images[index]}
          alt={altPrefix ? `${altPrefix} ${index + 1}` : t('viewImageN', { n: index + 1 })}
          fill
          sizes="90vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20 transition-colors hidden md:flex"
          aria-label={t('next')}
        >
          <ChevronRightIcon />
        </button>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 overflow-x-auto rounded-xl bg-black/50 p-2 backdrop-blur-sm">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                'relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-md transition-opacity',
                i === index
                  ? 'ring-2 ring-white opacity-100'
                  : 'opacity-60 hover:opacity-100'
              )}
              aria-label={t('viewImageN', { n: i + 1 })}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Icons ─── */

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}
