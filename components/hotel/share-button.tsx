'use client'

import { useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface ShareButtonProps {
  hotelName: string
}

export function ShareButton({ hotelName }: ShareButtonProps) {
  const handleShare = useCallback(async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title: hotelName, url })
        return
      } catch {
        // User cancelled or not supported, fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(url)
    // Simple feedback - could be replaced with a toast system later
    const el = document.getElementById('share-feedback')
    if (el) {
      el.textContent = 'Link copiado!'
      setTimeout(() => {
        el.textContent = ''
      }, 2000)
    }
  }, [hotelName])

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" onClick={handleShare}>
        <ShareIcon />
        Compartilhar
      </Button>
      <span id="share-feedback" className="text-xs text-green-600" aria-live="polite" />
    </div>
  )
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}
