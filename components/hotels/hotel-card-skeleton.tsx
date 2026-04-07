export function HotelCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Image placeholder */}
      <div className="aspect-[16/10] w-full animate-pulse bg-gray-200" />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title + location */}
        <div className="space-y-2">
          <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Rating */}
        <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />

        {/* Amenities */}
        <div className="flex gap-1.5">
          <div className="h-5 w-14 animate-pulse rounded-full bg-gray-200" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
          <div className="h-5 w-10 animate-pulse rounded-full bg-gray-200" />
        </div>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-2">
          <div className="h-6 w-28 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}
