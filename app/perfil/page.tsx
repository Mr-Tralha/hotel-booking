'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalDataSchema, type PersonalDataForm } from '@/lib/validations/checkout'
import { useUserStore } from '@/stores/user-store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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

export default function PerfilPage() {
  const profile = useUserStore((s) => s.profile)
  const setProfile = useUserStore((s) => s.setProfile)
  const [saved, setSaved] = useState(false)

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
        Meu Perfil
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Seus dados pessoais serão utilizados para autopreenchimento no checkout.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        noValidate
      >
        <Input
          label="Nome completo"
          placeholder="Maria da Silva"
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="maria@exemplo.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Telefone"
            type="tel"
            placeholder="(11) 99999-9999"
            error={errors.phone?.message}
            {...register('phone', {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setValue('phone', formatPhone(e.target.value))
              },
            })}
          />

          <Input
            label="CPF"
            placeholder="000.000.000-00"
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
            Salvar dados
          </Button>
          {saved && (
            <span className="text-sm font-medium text-green-600" aria-live="polite">
              Dados salvos com sucesso!
            </span>
          )}
        </div>
      </form>
    </main>
  )
}
