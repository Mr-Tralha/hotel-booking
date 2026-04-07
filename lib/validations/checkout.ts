import { z } from 'zod'

type T = (key: string) => string

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

export function createPersonalDataSchema(t: T) {
  return z.object({
    fullName: z
      .string()
      .min(1, t('fullNameRequired'))
      .min(3, t('fullNameMinLength'))
      .refine((val) => val.trim().includes(' '), {
        message: t('fullNameLastName'),
      }),
    email: z
      .string()
      .min(1, t('emailRequired'))
      .email(t('emailInvalid')),
    phone: z
      .string()
      .min(1, t('phoneRequired'))
      .regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, t('phoneFormat')),
    cpf: z
      .string()
      .min(1, t('cpfRequired'))
      .refine((val) => isValidCPF(val), { message: t('cpfInvalid') }),
  })
}

export type PersonalDataForm = z.infer<ReturnType<typeof createPersonalDataSchema>>

// --- Step 2: Payment ---

export function createPaymentSchema(t: T) {
  return z.object({
    cardNumber: z
      .string()
      .min(1, t('cardNumberRequired'))
      .refine((val) => passesLuhn(val), { message: t('cardNumberInvalid') }),
    cardHolder: z
      .string()
      .min(1, t('cardHolderRequired'))
      .min(3, t('cardHolderMinLength'))
      .refine((val) => !/\d/.test(val), { message: t('cardHolderNoNumbers') }),
    expiry: z
      .string()
      .min(1, t('expiryRequired'))
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, t('expiryFormat'))
      .refine(
        (val) => {
          const [mm, yy] = val.split('/')
          const month = Number(mm)
          const year = 2000 + Number(yy)
          const now = new Date()
          const expDate = new Date(year, month)
          return expDate > now
        },
        { message: t('expiryExpired') }
      ),
    cvv: z
      .string()
      .min(1, t('cvvRequired'))
      .regex(/^\d{3,4}$/, t('cvvFormat')),
  })
}

export type PaymentForm = z.infer<ReturnType<typeof createPaymentSchema>>

// --- Step 3: Review (only acceptance) ---

export function createReviewSchema(t: T) {
  return z.object({
    acceptTerms: z.literal(true, {
      message: t('acceptTermsRequired'),
    }),
  })
}

export type ReviewForm = z.infer<ReturnType<typeof createReviewSchema>>
