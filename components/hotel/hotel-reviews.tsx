'use client'

import { useState } from 'react'
import { useReviews } from '@/hooks/queries/use-reviews'
import { Pagination } from '@/components/ui/pagination'

interface HotelReviewsProps {
  hotelId: number
}

export function HotelReviews({ hotelId }: HotelReviewsProps) {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useReviews(hotelId, page)

  return (
    <section id="avaliacoes">
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Avaliações dos Hóspedes
      </h2>

      <div className="mt-4 space-y-4">
        {isLoading && <ReviewsSkeleton />}

        {!isLoading && data && data.data.length === 0 && (
          <p className="text-sm text-gray-500 py-4">
            Nenhuma avaliação disponível para este hotel.
          </p>
        )}

        {data?.data.map((review) => (
          <article
            key={review.id}
            className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 flex-shrink-0">
                  {review.guestName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {review.guestName}
                    </span>
                    {review.verified && (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        Verificado
                      </span>
                    )}
                  </div>
                  <time className="text-xs text-gray-400" dateTime={review.date}>
                    {new Date(review.date).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </div>

              {/* Rating */}
              <span className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 flex-shrink-0">
                <StarIcon />
                {review.rating.toFixed(1)}
              </span>
            </div>

            <h4 className="mt-3 text-sm font-semibold text-gray-900">
              {review.title}
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              {review.comment}
            </p>

            {review.helpful > 0 && (
              <p className="mt-2 text-xs text-gray-400">
                {review.helpful} {review.helpful === 1 ? 'pessoa achou' : 'pessoas acharam'} útil
              </p>
            )}
          </article>
        ))}

        {/* Pagination */}
        {data && data.total > data.limit && (
          <div className="pt-2">
            <Pagination
              page={page}
              total={data.total}
              limit={data.limit}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </section>
  )
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
            <div className="space-y-1.5">
              <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  )
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
