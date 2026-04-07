import { z } from 'zod'

type T = (key: string) => string

export function createSearchSchema(t: T) {
  return z
    .object({
      destination: z.string().min(1, t('destinationRequired')),
      checkIn: z.string().min(1, t('checkInRequired')),
      checkOut: z.string().min(1, t('checkOutRequired')),
      adults: z.number().min(1, t('adultsMin')).max(10, t('adultsMax')),
      children: z.number().min(0).max(6, t('childrenMax')),
      rooms: z.number().min(1, t('roomsMin')).max(5, t('roomsMax')),
    })
    .refine(
      (data) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const checkIn = new Date(data.checkIn + 'T00:00:00')
        return checkIn >= today
      },
      { message: t('checkInPast'), path: ['checkIn'] }
    )
    .refine(
      (data) => {
        const checkIn = new Date(data.checkIn + 'T00:00:00')
        const checkOut = new Date(data.checkOut + 'T00:00:00')
        const diffMs = checkOut.getTime() - checkIn.getTime()
        const diffDays = diffMs / (1000 * 60 * 60 * 24)
        return diffDays >= 1
      },
      {
        message: t('checkOutMinDays'),
        path: ['checkOut'],
      }
    )
    .refine(
      (data) => {
        const checkIn = new Date(data.checkIn + 'T00:00:00')
        const checkOut = new Date(data.checkOut + 'T00:00:00')
        const diffMs = checkOut.getTime() - checkIn.getTime()
        const diffDays = diffMs / (1000 * 60 * 60 * 24)
        return diffDays <= 30
      },
      {
        message: t('maxStay'),
        path: ['checkOut'],
      }
    )
}

export type SearchFormData = z.input<ReturnType<typeof createSearchSchema>>
