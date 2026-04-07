/**
 * Formata valor em reais (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata data para exibição pt-BR (dd/mm/aaaa)
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

/**
 * Formata data para uso em input[type=date] (yyyy-mm-dd)
 */
export function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Calcula número de noites entre duas datas
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  const diff = checkOut.getTime() - checkIn.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Gera classes condicionais (alternativa mínima ao clsx)
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
