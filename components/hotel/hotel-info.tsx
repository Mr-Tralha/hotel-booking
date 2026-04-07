import { formatCurrency } from '@/lib/utils'
import type { HotelWithRooms, Amenity } from '@/types/mock-db'

const AMENITY_LABELS: Record<Amenity, string> = {
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

const PROPERTY_TYPE_LABEL: Record<HotelWithRooms['propertyType'], string> = {
  hotel: 'Hotel',
  pousada: 'Pousada',
  resort: 'Resort',
}

const CANCELLATION_LABELS: Record<HotelWithRooms['cancellationPolicy'], { label: string; color: string }> = {
  free: { label: 'Cancelamento grátis', color: 'text-green-600' },
  moderate: { label: 'Cancelamento moderado', color: 'text-yellow-600' },
  strict: { label: 'Cancelamento restrito', color: 'text-red-600' },
}

const CANCELLATION_DESCRIPTIONS: Record<HotelWithRooms['cancellationPolicy'], string> = {
  free: 'Cancele até 24 horas antes do check-in sem custos.',
  moderate: 'Cancele até 5 dias antes do check-in para reembolso de 50%.',
  strict: 'Não reembolsável. Cancelamentos não geram reembolso.',
}

interface HotelInfoProps {
  hotel: HotelWithRooms
}

export function HotelInfo({ hotel }: HotelInfoProps) {
  const cancellation = CANCELLATION_LABELS[hotel.cancellationPolicy]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            {PROPERTY_TYPE_LABEL[hotel.propertyType]}
          </span>
          <span className={`text-xs font-medium ${cancellation.color}`}>
            {cancellation.label}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {hotel.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{hotel.address}</p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-sm font-bold text-white">
          <StarIcon />
          {hotel.rating.toFixed(1)}
        </span>
        <span className="text-sm text-gray-500">
          {hotel.reviewCount.toLocaleString('pt-BR')} avaliações
        </span>
      </div>

      {/* Price highlight */}
      <div className="flex items-baseline gap-1">
        <span className="text-sm text-gray-500">A partir de</span>
        <span className="text-2xl font-bold text-gray-900">
          {formatCurrency(hotel.pricePerNight)}
        </span>
        <span className="text-sm text-gray-500">/noite</span>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Sobre</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {hotel.description}
        </p>
      </div>

      {/* Check-in/Check-out */}
      <div className="flex gap-6">
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-in</span>
          <p className="mt-0.5 text-sm font-semibold text-gray-900">{hotel.checkInTime}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-out</span>
          <p className="mt-0.5 text-sm font-semibold text-gray-900">{hotel.checkOutTime}</p>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Comodidades</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {hotel.amenities.map((amenity) => (
            <div
              key={amenity}
              className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
            >
              <AmenityIcon amenity={amenity} />
              {AMENITY_LABELS[amenity]}
            </div>
          ))}
        </div>
      </div>

      {/* Cancellation policy */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-900">Política de Cancelamento</h3>
        <p className={`mt-1 text-sm font-medium ${cancellation.color}`}>
          {cancellation.label}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {CANCELLATION_DESCRIPTIONS[hotel.cancellationPolicy]}
        </p>
      </div>

      {/* Availability indicator */}
      {hotel.availableRooms <= 5 && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-medium text-red-700">
            {hotel.availableRooms === 1
              ? 'Apenas 1 quarto disponível!'
              : `Apenas ${hotel.availableRooms} quartos disponíveis!`}
          </span>
        </div>
      )}
    </div>
  )
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function AmenityIcon({ amenity }: { amenity: Amenity }) {
  // Simple check icon for all amenities
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-blue-500 flex-shrink-0">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
