'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPaymentSchema, type PaymentForm } from '@/lib/validations/checkout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/i18n'

interface PaymentStepProps {
  defaultValues?: Partial<PaymentForm>
  onNext: (data: PaymentForm) => void
  onBack: () => void
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function PaymentStep({ defaultValues, onNext, onBack }: PaymentStepProps) {
  const t = useTranslations('checkout')
  const tc = useTranslations('common')
  const tv = useTranslations('validation')
  const schema = useMemo(() => createPaymentSchema(tv), [tv])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      expiry: '',
      cvv: '',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5" noValidate>
      <h2 className="text-lg font-semibold text-gray-900">{t('paymentTitle')}</h2>
      <p className="text-sm text-gray-500">
        {t('paymentSimulated')}
      </p>

      <Input
        label={t('cardNumber')}
        placeholder={t('cardNumberPlaceholder')}
        inputMode="numeric"
        error={errors.cardNumber?.message}
        {...register('cardNumber', {
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue('cardNumber', formatCardNumber(e.target.value))
          },
        })}
      />

      <Input
        label={t('cardHolder')}
        placeholder={t('cardHolderPlaceholder')}
        error={errors.cardHolder?.message}
        {...register('cardHolder')}
      />

      <div className="grid grid-cols-2 gap-5">
        <Input
          label={t('expiry')}
          placeholder={t('expiryPlaceholder')}
          inputMode="numeric"
          error={errors.expiry?.message}
          {...register('expiry', {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setValue('expiry', formatExpiry(e.target.value))
            },
          })}
        />

        <Input
          label={t('cvv')}
          placeholder={t('cvvPlaceholder')}
          inputMode="numeric"
          maxLength={4}
          error={errors.cvv?.message}
          {...register('cvv')}
        />
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="secondary" size="lg" onClick={onBack}>
          {tc('back')}
        </Button>
        <Button type="submit" size="lg">
          {t('reviewBooking')}
        </Button>
      </div>
    </form>
  )
}
