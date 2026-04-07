import { createSearchSchema } from '@/lib/validations/search'

const t = (key: string) => key

const searchSchema = createSearchSchema(t)

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

describe('searchSchema', () => {
  const today = todayStr()

  const validSearch = {
    destination: 'São Paulo',
    checkIn: today,
    checkOut: addDays(today, 3),
    adults: 2,
    children: 0,
    rooms: 1,
  }

  it('accepts valid search data', () => {
    const result = searchSchema.safeParse(validSearch)
    expect(result.success).toBe(true)
  })

  it('rejects empty destination', () => {
    const result = searchSchema.safeParse({ ...validSearch, destination: '' })
    expect(result.success).toBe(false)
  })

  it('rejects checkIn in the past', () => {
    const result = searchSchema.safeParse({ ...validSearch, checkIn: '2020-01-01', checkOut: '2020-01-05' })
    expect(result.success).toBe(false)
  })

  it('rejects checkOut same as checkIn (0 nights)', () => {
    const result = searchSchema.safeParse({ ...validSearch, checkOut: today })
    expect(result.success).toBe(false)
  })

  it('accepts checkOut 1 day after checkIn', () => {
    const result = searchSchema.safeParse({
      ...validSearch,
      checkOut: addDays(today, 1),
    })
    expect(result.success).toBe(true)
  })

  it('rejects stay longer than 30 days', () => {
    const result = searchSchema.safeParse({
      ...validSearch,
      checkOut: addDays(today, 31),
    })
    expect(result.success).toBe(false)
  })

  it('accepts exactly 30 days stay', () => {
    const result = searchSchema.safeParse({
      ...validSearch,
      checkOut: addDays(today, 30),
    })
    expect(result.success).toBe(true)
  })

  it('rejects adults: 0', () => {
    const result = searchSchema.safeParse({ ...validSearch, adults: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects adults: 11', () => {
    const result = searchSchema.safeParse({ ...validSearch, adults: 11 })
    expect(result.success).toBe(false)
  })

  it('rejects children: 7', () => {
    const result = searchSchema.safeParse({ ...validSearch, children: 7 })
    expect(result.success).toBe(false)
  })

  it('rejects rooms: 0', () => {
    const result = searchSchema.safeParse({ ...validSearch, rooms: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects rooms: 6', () => {
    const result = searchSchema.safeParse({ ...validSearch, rooms: 6 })
    expect(result.success).toBe(false)
  })

  it('accepts maximum valid rooms (5)', () => {
    const result = searchSchema.safeParse({ ...validSearch, rooms: 5 })
    expect(result.success).toBe(true)
  })
})
