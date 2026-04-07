interface SectionNavProps {
  hasRooms: boolean
  hasReviews: boolean
}

export function SectionNav({ hasRooms, hasReviews }: SectionNavProps) {
  return (
    <nav
      aria-label="Seções do hotel"
      className="sticky top-0 z-20  bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4"
    >
      <div className="mx-auto flex max-w-6xl px-4 gap-6 overflow-x-auto ">
        {/* mx-auto w-full max-w-6xl px-4 py-6 sm:py-8 */}

        <SectionLink href="#sobre" label="Sobre" />
        {hasRooms && <SectionLink href="#quartos" label="Quartos" />}
        {hasReviews && <SectionLink href="#avaliacoes" label="Avaliações" />}
      </div>
    </nav>
  )
}

function SectionLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="whitespace-nowrap border-b-2 border-transparent py-3 text-sm font-medium text-gray-600 transition-colors hover:border-blue-600 hover:text-blue-600"
    >
      {label}
    </a>
  )
}
