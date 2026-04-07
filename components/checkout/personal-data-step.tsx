'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPersonalDataSchema, type PersonalDataForm } from '@/lib/validations/checkout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/i18n'
import { formatCPF, formatPhone } from '@/lib/utils'

interface PersonalDataStepProps {
  defaultValues?: Partial<PersonalDataForm>
  onNext: (data: PersonalDataForm) => void
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
