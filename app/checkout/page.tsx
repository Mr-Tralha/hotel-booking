'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useBookingStore } from '@/stores/booking-store'
import { useUserStore } from '@/stores/user-store'
import { useReservationsStore } from '@/stores/reservations-store'
import { calculateNights, calculateTotal } from '@/lib/utils'
import { CheckoutSteps } from '@/components/checkout/checkout-steps'
import { CheckoutSummary } from '@/components/checkout/checkout-summary'
import { PersonalDataStep } from '@/components/checkout/personal-data-step'
import { PaymentStep } from '@/components/checkout/payment-step'
import { ReviewStep } from '@/components/checkout/review-step'
import type { PersonalDataForm, PaymentForm } from '@/lib/validations/checkout'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const STEPS = [
  { label: 'Dados pessoais' },
  { label: 'Pagamento' },
  { label: 'Revisão' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const hotel = useBookingStore((s) => s.hotel)
  const selectedRooms = useBookingStore((s) => s.selectedRooms)
  const checkIn = useBookingStore((s) => s.checkIn)
  const checkOut = useBookingStore((s) => s.checkOut)
  const adults = useBookingStore((s) => s.adults)
  const children = useBookingStore((s) => s.children)
  const profile = useUserStore((s) => s.profile)
  const setProfile = useUserStore((s) => s.setProfile)
  const addBooking = useReservationsStore((s) => s.addBooking)

  const [currentStep, setCurrentStep] = useState(0)
  const [personalData, setPersonalData] = useState<PersonalDataForm | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentForm | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ready, setReady] = useState(false)

  // Redirect if no booking data
  useEffect(() => {
    if (!hotel || selectedRooms.length === 0) {
      router.replace('/')
      return
    }
    setReady(true)
  }, [hotel, selectedRooms.length, router])

  function generateBookingId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }

    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const bytes = crypto.getRandomValues(new Uint8Array(16))
      bytes[6] = (bytes[6] & 0x0f) | 0x40
      bytes[8] = (bytes[8] & 0x3f) | 0x80

      const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
    }

    return `booking-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  }

  const handlePersonalDataNext = useCallback((data: PersonalDataForm) => {
    setPersonalData(data)
    // Save profile for future auto-fill (no card data)
    setProfile(data)
    setCurrentStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [setProfile])

  const handlePaymentNext = useCallback((data: PaymentForm) => {
    setPaymentData(data)
    setCurrentStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleConfirm = useCallback(async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const bookingId = generateBookingId()

    // Persist booking to reservations store
    if (hotel && checkIn && checkOut) {
      const TAX_RATE = 0.12
      const nights = calculateNights(new Date(checkIn), new Date(checkOut))
      const subtotal = calculateTotal(selectedRooms, nights)
      const taxes = Math.round(subtotal * TAX_RATE * 100) / 100
      addBooking({
        id: bookingId,
        hotelName: hotel.name,
        hotelAddress: hotel.address,
        hotelThumbnail: hotel.thumbnail,
        rooms: selectedRooms,
        checkIn,
        checkOut,
        adults,
        children,
        total: subtotal + taxes,
        createdAt: new Date().toISOString(),
      })
    }

    router.push(`/confirmation/${bookingId}`)
  }, [router, hotel, checkIn, checkOut, selectedRooms, adults, children, addBooking])

  if (!ready) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
          <p className="text-sm text-gray-500">Redirecionando...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Voltar para busca
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Checkout</h1>
          <CheckoutSteps steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form area */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              {currentStep === 0 && (
                <PersonalDataStep
                  defaultValues={personalData ?? (profile ? {
                    fullName: profile.fullName,
                    email: profile.email,
                    phone: profile.phone,
                    cpf: profile.cpf,
                  } : undefined)}
                  onNext={handlePersonalDataNext}
                />
              )}

              {currentStep === 1 && (
                <PaymentStep
                  defaultValues={paymentData ?? undefined}
                  onNext={handlePaymentNext}
                  onBack={() => setCurrentStep(0)}
                />
              )}

              {currentStep === 2 && personalData && paymentData && (
                <ReviewStep
                  personalData={personalData}
                  paymentData={paymentData}
                  onConfirm={handleConfirm}
                  onBack={() => setCurrentStep(1)}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <CheckoutSummary />
            </div>
          </div>

          {/* Mobile summary (above form, collapsible) */}
          <div className="order-first lg:hidden">
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </main>
  )
}
