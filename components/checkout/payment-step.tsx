'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentSchema, type PaymentForm } from '@/lib/validations/checkout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
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
      <h2 className="text-lg font-semibold text-gray-900">Dados de Pagamento</h2>
      <p className="text-sm text-gray-500">
        Pagamento simulado — nenhuma cobrança será realizada.
      </p>

      <Input
        label="Número do cartão"
        placeholder="0000 0000 0000 0000"
        inputMode="numeric"
        error={errors.cardNumber?.message}
        {...register('cardNumber', {
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue('cardNumber', formatCardNumber(e.target.value))
          },
        })}
      />

      <Input
        label="Nome no cartão"
        placeholder="MARIA DA SILVA"
        error={errors.cardHolder?.message}
        {...register('cardHolder')}
      />

      <div className="grid grid-cols-2 gap-5">
        <Input
          label="Validade"
          placeholder="MM/AA"
          inputMode="numeric"
          error={errors.expiry?.message}
          {...register('expiry', {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setValue('expiry', formatExpiry(e.target.value))
            },
          })}
        />

        <Input
          label="CVV"
          placeholder="123"
          inputMode="numeric"
          maxLength={4}
          error={errors.cvv?.message}
          {...register('cvv')}
        />
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="secondary" size="lg" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" size="lg">
          Revisar reserva
        </Button>
      </div>
    </form>
  )
}
