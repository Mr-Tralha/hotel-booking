'use client'

import Link from 'next/link'
import { useTranslations } from '@/lib/i18n'

interface BreadcrumbProps {
  hotelName: string
  destination: string
}

export function Breadcrumb({ hotelName, destination }: BreadcrumbProps) {
  const t = useTranslations('hotel')
  return (
    <nav aria-label={t('sectionNavigation')} className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <li>
          <Link href="/" className="hover:text-blue-600 transition-colors">
            {t('breadcrumbHome')}
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronIcon />
        </li>
        <li>
          <Link
            href={`/search?destination=${encodeURIComponent(destination)}`}
            className="hover:text-blue-600 transition-colors"
          >
            {destination}
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronIcon />
        </li>
        <li>
          <span className="font-medium text-gray-900 line-clamp-1">
            {hotelName}
          </span>
        </li>
      </ol>
    </nav>
  )
}

function ChevronIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-gray-300">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}
