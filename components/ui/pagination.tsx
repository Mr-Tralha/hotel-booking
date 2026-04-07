'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from '@/lib/i18n'

interface PaginationProps {
  page: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, total, limit, onPageChange }: PaginationProps) {
  const t = useTranslations('pagination')
  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) return null

  // Show at most 5 page buttons centered around current page
  const range: number[] = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, start + 4)
  for (let i = Math.max(1, end - 4); i <= end; i++) {
    range.push(i)
  }

  return (
    <nav aria-label={t('navigation')} className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label={t('previous')}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeftIcon />
      </button>

      {range[0] > 1 && (
        <>
          <PageButton page={1} current={page} onClick={onPageChange} />
          {range[0] > 2 && (
            <span className="flex h-9 w-9 items-center justify-center text-sm text-gray-400">
              …
            </span>
          )}
        </>
      )}

      {range.map((p) => (
        <PageButton key={p} page={p} current={page} onClick={onPageChange} />
      ))}

      {range[range.length - 1] < totalPages && (
        <>
          {range[range.length - 1] < totalPages - 1 && (
            <span className="flex h-9 w-9 items-center justify-center text-sm text-gray-400">
              …
            </span>
          )}
          <PageButton page={totalPages} current={page} onClick={onPageChange} />
        </>
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('next')}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRightIcon />
      </button>
    </nav>
  )
}

function PageButton({
  page,
  current,
  onClick,
}: {
  page: number
  current: number
  onClick: (p: number) => void
}) {
  const isActive = page === current
  return (
    <button
      type="button"
      onClick={() => onClick(page)}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      )}
    >
      {page}
    </button>
  )
}

function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}
