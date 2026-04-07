'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  closeOnBackdropClick?: boolean
  /** aria-label for the dialog */
  ariaLabel?: string
  /** Extra classes on the overlay */
  overlayClassName?: string
}

export function BaseModal({
  isOpen,
  onClose,
  children,
  closeOnBackdropClick = true,
  ariaLabel,
  overlayClassName,
}: BaseModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleOverlayClick(e: React.MouseEvent) {
    if (closeOnBackdropClick && e.target === overlayRef.current) {
      onClose()
    }
  }

  return (
    <div
      ref={overlayRef}
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4',
        overlayClassName
      )}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={handleOverlayClick}
    >
      {children}
    </div>
  )
}
