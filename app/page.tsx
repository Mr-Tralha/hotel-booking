import { cookies } from 'next/headers'
import dynamic from 'next/dynamic'
import { defaultLocale, getMessages, getServerTranslations } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import { SearchForm } from '@/components/search/search-form'

const RecentSearches = dynamic(
  () => import('@/components/search/recent-searches').then((m) => m.RecentSearches),
)
const FeaturedHotels = dynamic(
  () => import('@/components/hotels/featured-hotels').then((m) => m.FeaturedHotels),
)

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const value = cookieStore.get('NEXT_LOCALE')?.value
  if (value === 'en' || value === 'pt-BR') return value
  return defaultLocale
}

export default async function Home() {
  const locale = await getLocale()
  const messages = getMessages(locale)
  const t = getServerTranslations(messages, locale, 'home')

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero — server-rendered for fast LCP */}
      <section className="relative flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 pb-28 pt-16 text-center sm:pb-32 sm:pt-20 md:pb-36 md:pt-24">
        {/* Pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
          aria-hidden="true"
        />

        <h1 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {t('heroTitle')}
        </h1>
        <p className="relative mt-3 max-w-md text-base text-blue-100 sm:text-lg">
          {t('heroSubtitle')}
        </p>
      </section>

      {/* Search card — sobrepõe a hero */}
      <div className="relative z-10 mx-auto -mt-20 w-full max-w-6xl px-4 sm:-mt-24 md:-mt-28">
        <SearchForm />
      </div>

      {/* Recent searches */}
      <RecentSearches />

      {/* Featured hotels */}
      <FeaturedHotels />
    </main>
  )
}
