import { z } from 'zod'

// --- Helpers ---

function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return false
  if (/^(\d)\1{10}$/.test(digits)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i)
  let remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== Number(digits[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i)
  remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  return remainder === Number(digits[10])
}

function passesLuhn(number: string): boolean {
  const digits = number.replace(/\D/g, '')
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  let alternate = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i])
    if (alternate) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alternate = !alternate
  }
  return sum % 10 === 0
}

// --- Step 1: Personal Data ---

export const personalDataSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Nome completo é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .refine((val) => val.trim().includes(' '), {
      message: 'Informe nome e sobrenome',
    }),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido'),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Formato: (11) 99999-9999'),
  cpf: z
    .string()
    .min(1, 'CPF é obrigatório')
    .refine((val) => isValidCPF(val), { message: 'CPF inválido' }),
})

export type PersonalDataForm = z.infer<typeof personalDataSchema>

// --- Step 2: Payment ---

export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Número do cartão é obrigatório')
    .refine((val) => passesLuhn(val), { message: 'Número de cartão inválido' }),
  cardHolder: z
    .string()
    .min(1, 'Nome no cartão é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  expiry: z
    .string()
    .min(1, 'Validade é obrigatória')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato: MM/AA')
    .refine(
      (val) => {
        const [mm, yy] = val.split('/')
        const month = Number(mm)
        const year = 2000 + Number(yy)
        const now = new Date()
        const expDate = new Date(year, month) // first day of next month
        return expDate > now
      },
      { message: 'Cartão expirado' }
    ),
  cvv: z
    .string()
    .min(1, 'CVV é obrigatório')
    .regex(/^\d{3,4}$/, 'CVV deve ter 3 ou 4 dígitos'),
})

export type PaymentForm = z.infer<typeof paymentSchema>

// --- Step 3: Review (only acceptance) ---

export const reviewSchema = z.object({
  acceptTerms: z.literal(true, {
    message: 'Você deve aceitar os termos e condições',
  }),
})

export type ReviewForm = z.infer<typeof reviewSchema>
