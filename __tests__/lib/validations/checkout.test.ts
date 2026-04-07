import {
  createPersonalDataSchema,
  createPaymentSchema,
  createReviewSchema,
} from '@/lib/validations/checkout'

// Identity translation function — returns the key as-is for test assertions
const t = (key: string) => key

const personalDataSchema = createPersonalDataSchema(t)
const paymentSchema = createPaymentSchema(t)
const reviewSchema = createReviewSchema(t)

// ---------- Personal Data Schema ----------

describe('personalDataSchema', () => {
  const validData = {
    fullName: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    cpf: '529.982.247-25', // valid CPF
  }

  it('accepts valid personal data', () => {
    const result = personalDataSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects fullName without space (no last name)', () => {
    const result = personalDataSchema.safeParse({ ...validData, fullName: 'João' })
    expect(result.success).toBe(false)
  })

  it('rejects fullName shorter than 3 chars', () => {
    const result = personalDataSchema.safeParse({ ...validData, fullName: 'Jo' })
    expect(result.success).toBe(false)
  })

  it('rejects empty email', () => {
    const result = personalDataSchema.safeParse({ ...validData, email: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email format', () => {
    const result = personalDataSchema.safeParse({ ...validData, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects phone with wrong format', () => {
    const result = personalDataSchema.safeParse({ ...validData, phone: '11999998888' })
    expect(result.success).toBe(false)
  })

  it('accepts phone without space after area code', () => {
    const result = personalDataSchema.safeParse({ ...validData, phone: '(11)99999-9999' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid CPF (repeated digits)', () => {
    const result = personalDataSchema.safeParse({ ...validData, cpf: '111.111.111-11' })
    expect(result.success).toBe(false)
  })

  it('rejects CPF with wrong check digits', () => {
    const result = personalDataSchema.safeParse({ ...validData, cpf: '529.982.247-00' })
    expect(result.success).toBe(false)
  })

  it('rejects empty CPF', () => {
    const result = personalDataSchema.safeParse({ ...validData, cpf: '' })
    expect(result.success).toBe(false)
  })
})

// ---------- Payment Schema ----------

describe('paymentSchema', () => {
  const validPayment = {
    cardNumber: '4111 1111 1111 1111', // passes Luhn
    cardHolder: 'João Silva',
    expiry: '12/30',
    cvv: '123',
  }

  it('accepts valid payment data', () => {
    const result = paymentSchema.safeParse(validPayment)
    expect(result.success).toBe(true)
  })

  it('rejects card number that fails Luhn check', () => {
    const result = paymentSchema.safeParse({ ...validPayment, cardNumber: '1234 5678 9012 3456' })
    expect(result.success).toBe(false)
  })

  it('rejects card number that is too short', () => {
    const result = paymentSchema.safeParse({ ...validPayment, cardNumber: '1234' })
    expect(result.success).toBe(false)
  })

  it('rejects cardHolder with numbers', () => {
    const result = paymentSchema.safeParse({ ...validPayment, cardHolder: 'João 123' })
    expect(result.success).toBe(false)
  })

  it('rejects cardHolder shorter than 3 chars', () => {
    const result = paymentSchema.safeParse({ ...validPayment, cardHolder: 'Jo' })
    expect(result.success).toBe(false)
  })

  it('rejects expiry with invalid month', () => {
    const result = paymentSchema.safeParse({ ...validPayment, expiry: '13/30' })
    expect(result.success).toBe(false)
  })

  it('rejects expiry with wrong format', () => {
    const result = paymentSchema.safeParse({ ...validPayment, expiry: '1/30' })
    expect(result.success).toBe(false)
  })

  it('rejects expired card', () => {
    const result = paymentSchema.safeParse({ ...validPayment, expiry: '01/20' })
    expect(result.success).toBe(false)
  })

  it('rejects CVV with 2 digits', () => {
    const result = paymentSchema.safeParse({ ...validPayment, cvv: '12' })
    expect(result.success).toBe(false)
  })

  it('accepts CVV with 4 digits (Amex)', () => {
    const result = paymentSchema.safeParse({ ...validPayment, cvv: '1234' })
    expect(result.success).toBe(true)
  })

  it('rejects CVV with 5 digits', () => {
    const result = paymentSchema.safeParse({ ...validPayment, cvv: '12345' })
    expect(result.success).toBe(false)
  })
})

// ---------- Review Schema ----------

describe('reviewSchema', () => {
  it('accepts acceptTerms: true', () => {
    const result = reviewSchema.safeParse({ acceptTerms: true })
    expect(result.success).toBe(true)
  })

  it('rejects acceptTerms: false', () => {
    const result = reviewSchema.safeParse({ acceptTerms: false })
    expect(result.success).toBe(false)
  })
})
