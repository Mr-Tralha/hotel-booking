/**
 * Human-readable labels for domain enums.
 *
 * Centralised here so every component reads from the same source and
 * swapping in an i18n library (e.g. next-intl) requires a single change
 * in this file instead of hunting through every component.
 */

import type { Amenity, RoomAmenity, Bed, Hotel } from '@/types/mock-db'

export const AMENITY_LABELS: Record<Amenity, string> = {
  wifi: 'Wi-Fi',
  pool: 'Piscina',
  spa: 'Spa',
  restaurant: 'Restaurante',
  gym: 'Academia',
  parking: 'Estacionamento',
  bar: 'Bar',
  room_service: 'Room Service',
  beach_access: 'Acesso à Praia',
  kids_club: 'Kids Club',
  business_center: 'Business Center',
  concierge: 'Concierge',
  valet: 'Manobrista',
  lounge_access: 'Acesso ao Lounge',
}

export const ROOM_AMENITY_LABELS: Record<RoomAmenity, string> = {
  ocean_view: 'Vista para o mar',
  city_view: 'Vista da cidade',
  garden_view: 'Vista do jardim',
  balcony: 'Varanda',
  terrace: 'Terraço',
  bathtub: 'Banheira',
  minibar: 'Frigobar',
  safe: 'Cofre',
  aircon: 'Ar condicionado',
  desk: 'Mesa de trabalho',
  kitchen: 'Cozinha',
  living_room: 'Sala de estar',
  sound_system: 'Sistema de som',
  butler: 'Mordomo',
  pool_access: 'Acesso à piscina',
  garden: 'Jardim privativo',
}

export const BED_TYPE_LABELS: Record<Bed['type'], string> = {
  single: 'Solteiro',
  double: 'Casal',
  queen: 'Queen',
  king: 'King',
  twin: 'Twin',
  sofa_bed: 'Sofá-cama',
}

export const PROPERTY_TYPE_LABELS: Record<Hotel['propertyType'], string> = {
  hotel: 'Hotel',
  pousada: 'Pousada',
  resort: 'Resort',
}

export const CANCELLATION_LABELS: Record<
  Hotel['cancellationPolicy'],
  { label: string; color: string }
> = {
  free: { label: 'Cancelamento grátis', color: 'text-green-600' },
  moderate: { label: 'Cancelamento moderado', color: 'text-yellow-600' },
  strict: { label: 'Cancelamento restrito', color: 'text-red-600' },
}

export const CANCELLATION_DESCRIPTIONS: Record<Hotel['cancellationPolicy'], string> = {
  free: 'Cancele até 24 horas antes do check-in sem custos.',
  moderate: 'Cancele até 5 dias antes do check-in para reembolso de 50%.',
  strict: 'Não reembolsável. Cancelamentos não geram reembolso.',
}
