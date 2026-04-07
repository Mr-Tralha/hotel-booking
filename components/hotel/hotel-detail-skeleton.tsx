export function HotelDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-4 flex gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Gallery skeleton */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2">
        <div className="aspect-[16/10] animate-pulse rounded-xl bg-gray-200 sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:h-80" />
        <div className="hidden aspect-[16/10] animate-pulse rounded-xl bg-gray-200 sm:block" />
        <div className="hidden aspect-[16/10] animate-pulse rounded-xl bg-gray-200 sm:block" />
        <div className="hidden aspect-[16/10] animate-pulse rounded-xl bg-gray-200 sm:block" />
        <div className="hidden aspect-[16/10] animate-pulse rounded-xl bg-gray-200 sm:block" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Info skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-72 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-4">
          <div className="h-48 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>

      {/* Rooms skeleton */}
      <div className="mt-10 space-y-4">
        <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white sm:flex-row"
          >
            <div className="aspect-[16/10] w-full animate-pulse bg-gray-200 sm:aspect-auto sm:w-64 sm:h-48" />
            <div className="flex-1 p-4 space-y-3">
              <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="flex gap-4">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex gap-1.5">
                <div className="h-5 w-20 animate-pulse rounded-full bg-gray-200" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
                <div className="h-5 w-24 animate-pulse rounded-full bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
