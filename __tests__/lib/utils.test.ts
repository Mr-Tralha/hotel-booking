import {
  formatCurrency,
  formatDate,
  toDateInputValue,
  calculateNights,
  calculateTotal,
  cn,
  normalizeText,
  formatCPF,
  formatPhone,
} from '@/lib/utils'

// ---------- formatCurrency ----------

describe('formatCurrency', () => {
  it('formats positive BRL values', () => {
    expect(formatCurrency(150)).toBe('R$\u00a0150,00')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('R$\u00a00,00')
  })

  it('formats decimals', () => {
    expect(formatCurrency(99.9)).toBe('R$\u00a099,90')
  })

  it('formats large values with separator', () => {
    const result = formatCurrency(1250.5)
    expect(result).toContain('1.250,50')
  })
})

// ---------- formatDate ----------

describe('formatDate', () => {
  it('formats a date in pt-BR', () => {
    const date = new Date(2025, 5, 15) // June 15, 2025
    const result = formatDate(date, 'pt-BR')
    expect(result).toBe('15/06/2025')
  })

  it('formats a date in en-US', () => {
    const date = new Date(2025, 0, 1) // Jan 1, 2025
    const result = formatDate(date, 'en-US')
    expect(result).toBe('1/1/2025')
  })
})

// ---------- toDateInputValue ----------

describe('toDateInputValue', () => {
  it('returns yyyy-mm-dd format', () => {
    const date = new Date(2025, 0, 5) // Jan 5, 2025
    expect(toDateInputValue(date)).toBe('2025-01-05')
  })

  it('pads single digit months and days', () => {
    const date = new Date(2025, 2, 3) // Mar 3
    expect(toDateInputValue(date)).toBe('2025-03-03')
  })
})

// ---------- calculateNights ----------

describe('calculateNights', () => {
  it('returns 1 for one-day difference', () => {
    const checkIn = new Date('2025-06-01')
    const checkOut = new Date('2025-06-02')
    expect(calculateNights(checkIn, checkOut)).toBe(1)
  })

  it('returns 7 for a week', () => {
    const checkIn = new Date('2025-06-01')
    const checkOut = new Date('2025-06-08')
    expect(calculateNights(checkIn, checkOut)).toBe(7)
  })

  it('returns 30 for max stay', () => {
    const checkIn = new Date('2025-06-01')
    const checkOut = new Date('2025-07-01')
    expect(calculateNights(checkIn, checkOut)).toBe(30)
  })

  it('returns 0 for same date', () => {
    const date = new Date('2025-06-01')
    expect(calculateNights(date, date)).toBe(0)
  })
})

// ---------- calculateTotal ----------

describe('calculateTotal', () => {
  it('returns 0 with no rooms', () => {
    expect(calculateTotal([], 5)).toBe(0)
  })

  it('calculates single room correctly', () => {
    expect(calculateTotal([{ pricePerNight: 200 }], 3)).toBe(600)
  })

  it('sums multiple rooms', () => {
    const rooms = [{ pricePerNight: 200 }, { pricePerNight: 350 }]
    expect(calculateTotal(rooms, 2)).toBe(1100)
  })

  it('returns 0 with zero nights', () => {
    expect(calculateTotal([{ pricePerNight: 200 }], 0)).toBe(0)
  })
})

// ---------- cn ----------

describe('cn', () => {
  it('joins truthy classes', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('filters falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
  })

  it('returns empty string with no truthy values', () => {
    expect(cn(false, null, undefined)).toBe('')
  })
})

// ---------- normalizeText ----------

describe('normalizeText', () => {
  it('removes accents', () => {
    expect(normalizeText('São Paulo')).toBe('sao paulo')
  })

  it('lowercases', () => {
    expect(normalizeText('RIO DE JANEIRO')).toBe('rio de janeiro')
  })

  it('removes special characters', () => {
    expect(normalizeText('praia-do-forte!')).toBe('praiadoforte')
  })

  it('handles combined transformations', () => {
    expect(normalizeText('Florianópolis - SC')).toBe('florianopolis  sc')
  })
})

// ---------- formatCPF ----------

describe('formatCPF', () => {
  it('returns raw digits for up to 3 chars', () => {
    expect(formatCPF('123')).toBe('123')
  })

  it('adds first dot for 4-6 digits', () => {
    expect(formatCPF('1234')).toBe('123.4')
    expect(formatCPF('123456')).toBe('123.456')
  })

  it('adds second dot for 7-9 digits', () => {
    expect(formatCPF('1234567')).toBe('123.456.7')
    expect(formatCPF('123456789')).toBe('123.456.789')
  })

  it('formats complete CPF with dash', () => {
    expect(formatCPF('12345678901')).toBe('123.456.789-01')
  })

  it('strips non-digit characters', () => {
    expect(formatCPF('123.456.789-01')).toBe('123.456.789-01')
  })

  it('limits to 11 digits', () => {
    expect(formatCPF('123456789012345')).toBe('123.456.789-01')
  })

  it('handles empty string', () => {
    expect(formatCPF('')).toBe('')
  })
})

// ---------- formatPhone ----------

describe('formatPhone', () => {
  it('returns empty for empty input', () => {
    expect(formatPhone('')).toBe('')
  })

  it('wraps first digits in parentheses', () => {
    expect(formatPhone('11')).toBe('(11')
  })

  it('adds space after area code', () => {
    expect(formatPhone('119')).toBe('(11) 9')
  })

  it('formats partial number', () => {
    expect(formatPhone('1199999')).toBe('(11) 99999')
  })

  it('formats complete mobile number', () => {
    expect(formatPhone('11999998888')).toBe('(11) 99999-8888')
  })

  it('strips non-digit characters from formatted input', () => {
    expect(formatPhone('(11) 99999-8888')).toBe('(11) 99999-8888')
  })

  it('limits to 11 digits', () => {
    expect(formatPhone('119999988889999')).toBe('(11) 99999-8888')
  })
})
