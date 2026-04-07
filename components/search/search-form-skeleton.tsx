/**
 * Skeleton that mirrors the SearchForm layout to prevent CLS during Suspense loading.
 */
export function SearchFormSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-lg sm:p-6 md:gap-5">
      {/* Destination */}
      <div className="flex flex-col gap-1">
        <div className="h-4 w-14 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
      </div>
      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
      {/* Guests */}
      <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
      {/* Submit button */}
      <div className="h-11 w-full animate-pulse rounded-lg bg-blue-200" />
    </div>
  )
}
