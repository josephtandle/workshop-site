'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { COPY_WITH_CONFETTI_SUCCESS_EVENT } from '@/lib/copyWithConfetti'
import GiveawayEmailModal from './GiveawayEmailModal'

function getGiveawaySlug(pathname: string | null) {
  const [, section, slug] = (pathname || '').split('/')
  return section === 'giveaways' && slug ? slug : 'giveaways'
}

export default function GiveawayCopyEmailGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const slug = useMemo(() => getGiveawaySlug(pathname), [pathname])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function handleCopySuccess() {
      if (!window.location.pathname.startsWith('/giveaways/')) return

      window.setTimeout(() => {
        if (document.querySelector('[data-giveaway-email-modal="true"]')) return
        setIsOpen(true)
      }, 0)
    }

    window.addEventListener(COPY_WITH_CONFETTI_SUCCESS_EVENT, handleCopySuccess)
    return () => window.removeEventListener(COPY_WITH_CONFETTI_SUCCESS_EVENT, handleCopySuccess)
  }, [])

  return (
    <>
      {children}
      <GiveawayEmailModal slug={slug} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
