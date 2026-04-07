export default function ReservasLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-24 animate-pulse rounded-full bg-gray-200" />
              </div>
              <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
              <div className="flex gap-4">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
