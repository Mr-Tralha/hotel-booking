'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPersonalDataSchema, type PersonalDataForm } from '@/lib/validations/checkout'
import { useTranslations } from '@/lib/i18n'
import { useUserStore } from '@/stores/user-store'
import { formatCPF, formatPhone } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function PerfilPage() {
  const profile = useUserStore((s) => s.profile)
  const setProfile = useUserStore((s) => s.setProfile)
  const [saved, setSaved] = useState(false)
  const t = useTranslations('profile')
  const tc = useTranslations('checkout')
  const tv = useTranslations('validation')
  const personalDataSchema = createPersonalDataSchema(tv)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PersonalDataForm>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      cpf: '',
    },
  })

  // Hydrate form from stored profile
  useEffect(() => {
    if (profile) {
      reset(profile)
    }
  }, [profile, reset])

  function onSubmit(data: PersonalDataForm) {
    setProfile(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        {t('title')}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {t('subtitle')}
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        noValidate
      >
        <Input
          label={tc('fullName')}
          placeholder={tc('fullNamePlaceholder')}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label={tc('email')}
          type="email"
          placeholder={tc('emailPlaceholder')}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label={tc('phone')}
            type="tel"
            placeholder={tc('phonePlaceholder')}
            error={errors.phone?.message}
            {...register('phone', {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setValue('phone', formatPhone(e.target.value))
              },
            })}
          />

          <Input
            label={tc('cpf')}
            placeholder={tc('cpfPlaceholder')}
            error={errors.cpf?.message}
            {...register('cpf', {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setValue('cpf', formatCPF(e.target.value))
              },
            })}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" size="lg">
            {t('saveData')}
          </Button>
          {saved && (
            <span className="text-sm font-medium text-green-600" aria-live="polite">
              {t('savedSuccess')}
            </span>
          )}
        </div>
      </form>
    </main>
  )
}
