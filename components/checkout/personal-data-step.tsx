'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalDataSchema, type PersonalDataForm } from '@/lib/validations/checkout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PersonalDataForm>({
    resolver: zodResolver(personalDataSchema),
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
      <h2 className="text-lg font-semibold text-gray-900">Dados Pessoais</h2>

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

      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg">
          Continuar para pagamento
        </Button>
      </div>
    </form>
  )
}
