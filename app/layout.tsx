import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Geist } from 'next/font/google'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/navbar'
import { defaultLocale, LOCALE_COOKIE, getMessages } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const value = cookieStore.get(LOCALE_COOKIE)?.value
  if (value === 'en' || value === 'pt-BR') return value
  return defaultLocale
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const messages = getMessages(locale)
  return {
    title: messages.metadata.title,
    description: messages.metadata.description,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = getMessages(locale)

  return (
    <html lang={locale} className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 font-sans">
        <Providers locale={locale} messages={messages}>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
