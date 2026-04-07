'use client'

import Image from 'next/image'
import { useState, useCallback, useEffect } from 'react'

interface HotelGalleryProps {
  images: string[]
  hotelName: string
  availableRooms?: number
}

export function HotelGallery({ images, hotelName, availableRooms }: HotelGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      setSelectedIndex((index + images.length) % images.length)
    },
    [images.length]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') goTo(selectedIndex - 1)
      if (e.key === 'ArrowRight') goTo(selectedIndex + 1)
    },
    [lightboxOpen, selectedIndex, goTo]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxOpen])

  if (images.length === 0) return null

  return (
    <>
      {/* Main gallery grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2">
        {/* Main image */}
        <button
          type="button"
          onClick={() => {
            setSelectedIndex(0)
            setLightboxOpen(true)
          }}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100 sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:h-full"
        >
          <Image
            src={images[0]}
            alt={`${hotelName} — foto principal`}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
            priority
          />
          {availableRooms !== undefined && availableRooms <= 3 && (
            <span className="absolute right-3 top-3 rounded-md bg-red-500/90 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm pointer-events-none">
              {availableRooms === 1
                ? 'Último quarto!'
                : `Apenas ${availableRooms} disponíveis!`}
            </span>
          )}
        </button>

        {/* Secondary images */}
        {images.slice(1, 5).map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => {
              setSelectedIndex(i + 1)
              setLightboxOpen(true)
            }}
            className="relative hidden aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 sm:block cursor-pointer"
          >
            <Image
              src={src}
              alt={`${hotelName} — foto ${i + 2}`}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
            {/* "Show all" overlay on last visible image */}
            {i === 3 && images.length > 5 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-semibold text-white">
                +{images.length - 5} fotos
              </span>
            )}
          </button>
        ))}

        {/* Mobile: show all button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="mt-1 text-sm font-medium text-blue-600 hover:underline sm:hidden"
          >
            Ver todas as {images.length} fotos
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90"
          role="dialog"
          aria-label="Galeria de fotos"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Fechar galeria"
          >
            <CloseIcon />
          </button>

          {/* Counter */}
          <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </span>

          {/* Previous */}
          <button
            type="button"
            onClick={() => goTo(selectedIndex - 1)}
            className="hidden md:absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Foto anterior"
          >
            <ChevronLeftIcon />
          </button>

          {/* Image */}
          <div className="relative h-[80vh] w-full max-w-5xl mx-4 md:mx-16">
            <Image
              src={images[selectedIndex]}
              alt={`${hotelName} — foto ${selectedIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={() => goTo(selectedIndex + 1)}
            className="hidden md:absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Próxima foto"
          >
            <ChevronRightIcon />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 overflow-x-auto rounded-xl bg-black/50 p-2 backdrop-blur-sm">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={`relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-md transition-opacity ${i === selectedIndex
                  ? 'ring-2 ring-white opacity-100'
                  : 'opacity-60 hover:opacity-100'
                  }`}
                aria-label={`Ver foto ${i + 1}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

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
