'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPersonalDataSchema, type PersonalDataForm } from '@/lib/validations/checkout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/i18n'

interface PersonalDataStepProps {
  defaultValues?: Partial<PersonalDataForm>
  onNext: (data: PersonalDataForm) => void
}

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function PersonalDataStep({ defaultValues, onNext }: PersonalDataStepProps) {
  const t = useTranslations('checkout')
  const tv = useTranslations('validation')
  const schema = useMemo(() => createPersonalDataSchema(tv), [tv])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PersonalDataForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      cpf: '',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5" noValidate>
      <h2 className="text-lg font-semibold text-gray-900">{t('personalDataTitle')}</h2>

      <Input
        label={t('fullName')}
        placeholder={t('fullNamePlaceholder')}
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      <Input
        label={t('email')}
        type="email"
        placeholder={t('emailPlaceholder')}
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label={t('phone')}
          type="tel"
          placeholder={t('phonePlaceholder')}
          error={errors.phone?.message}
          {...register('phone', {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setValue('phone', formatPhone(e.target.value))
            },
          })}
        />

        <Input
          label={t('cpf')}
          placeholder={t('cpfPlaceholder')}
          error={errors.cpf?.message}
          {...register('cpf', {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setValue('cpf', formatCPF(e.target.value))
            },
          })}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg">
          {t('continueToPayment')}
        </Button>
      </div>
    </form>
  )
}
