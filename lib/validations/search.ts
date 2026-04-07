import { z } from 'zod'

export const searchSchema = z
  .object({
    destination: z.string().min(1, 'Selecione um destino'),
    checkIn: z.string().min(1, 'Selecione a data de check-in'),
    checkOut: z.string().min(1, 'Selecione a data de check-out'),
    adults: z.number().min(1, 'Mínimo 1 adulto').max(10, 'Máximo 10 adultos'),
    children: z.number().min(0).max(6, 'Máximo 6 crianças'),
    rooms: z.number().min(1, 'Mínimo 1 quarto').max(5, 'Máximo 5 quartos'),
  })
  .refine(
    (data) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const checkIn = new Date(data.checkIn + 'T00:00:00')
      return checkIn >= today
    },
    { message: 'Check-in não pode ser no passado', path: ['checkIn'] }
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
      message: 'Check-out deve ser ao menos 1 dia após check-in',
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
      message: 'Estadia máxima de 30 dias',
      path: ['checkOut'],
    }
  )

export type SearchFormData = z.input<typeof searchSchema>
