'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState, useCallback } from 'react'
import { useTranslations } from '@/lib/i18n'

const ImageLightbox = dynamic(
  () => import('@/components/ui/image-lightbox').then((m) => m.ImageLightbox),
  { ssr: false }
)


interface HotelGalleryProps {
  images: string[]
  hotelName: string
  availableRooms?: number
}

export function HotelGallery({ images, hotelName, availableRooms }: HotelGalleryProps) {
  const t = useTranslations('hotel')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index)
    setLightboxOpen(true)
  }, [])

  if (images.length === 0) return null

  return (
    <>
      {/* Main gallery grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2">
        {/* Main image */}
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100 sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:h-full"
        >
          <Image
            src={images[0]}
            alt={t('mainPhoto', { name: hotelName })}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
            priority
          />
          {availableRooms !== undefined && availableRooms <= 3 && (
            <span className="absolute right-3 top-3 rounded-md bg-red-500/90 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm pointer-events-none">
              {availableRooms === 1
                ? t('lastRoom')
                : t('onlyAvailable', { count: availableRooms })}
            </span>
          )}

          {/* Mobile: show all button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="
      absolute bottom-4 right-4
      flex items-center gap-2
      px-3 py-2
      rounded-full
      bg-black/50 backdrop-blur-md
      text-white text-sm font-medium
      shadow-lg
      active:scale-95 transition
      sm:hidden
    "
            >
              <div className="relative">
                <GalleryIcon />

                {/* Badge */}
                <span
                  className="
          absolute -top-2 -right-2
          bg-white text-black text-[10px]
          font-bold
          px-1.5 py-0.5
          rounded-full
          leading-none
        "
                >
                  {images.length}
                </span>
              </div>

              <span>{t('photos')}</span>
            </button>
          )}
        </button>

        {/* Secondary images */}
        {images.slice(1, 5).map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => openLightbox(i + 1)}
            className="relative hidden aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 sm:block cursor-pointer"
          >
            <Image
              src={src}
              alt={t('photoN', { name: hotelName, n: i + 2 })}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
            {/* "Show all" overlay on last visible image */}
            {i === 3 && images.length > 5 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-semibold text-white">
                {t('photoCount', { count: images.length - 5 })}
              </span>
            )}
          </button>
        ))}


      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={images}
          initialIndex={selectedIndex}
          onClose={() => setLightboxOpen(false)}
          altPrefix={`${hotelName} — foto`}
        />
      )}
    </>
  )
}

function GalleryIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="16" height="16" rx="2" />
      <path d="M6 22h12a2 2 0 0 0 2-2V6" />
      <circle cx="10" cy="10" r="2" />
      <path d="m2 18 4-4 4 4" />
    </svg>
  )
}
