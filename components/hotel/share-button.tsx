'use client'

import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/i18n'

export function ShareButton({ hotelName }: { hotelName: string }) {
  const t = useTranslations('hotel')
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" onClick={handleCopy}>
        <ShareIcon />
        {copied ? t('copied') : t('share')}
      </Button>
      {copied && (
        <span className="text-xs text-green-600" aria-live="polite">
          {t('linkCopied')}
        </span>
      )}
    </div>
  )
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}
