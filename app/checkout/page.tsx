'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useBookingStore } from '@/stores/booking-store'
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

  const handlePersonalDataNext = useCallback((data: PersonalDataForm) => {
    setPersonalData(data)
    setCurrentStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handlePaymentNext = useCallback((data: PaymentForm) => {
    setPaymentData(data)
    setCurrentStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleConfirm = useCallback(async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const bookingId = crypto.randomUUID()
    router.push(`/confirmation/${bookingId}`)
  }, [router])

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
                  defaultValues={personalData ?? undefined}
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
