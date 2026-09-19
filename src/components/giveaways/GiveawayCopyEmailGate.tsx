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

const NO_SIGNUP_PATHS = new Set([
  '/giveaways/terminal-to-claude-desktop',
  '/giveaways/terminal-to-claude-desktop/',
])

function isNoSignupGiveaway(pathname: string | null) {
  return pathname !== null && NO_SIGNUP_PATHS.has(pathname)
}

export default function GiveawayCopyEmailGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const slug = useMemo(() => getGiveawaySlug(pathname), [pathname])
  const isNoSignup = isNoSignupGiveaway(pathname)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function handleCopySuccess() {
      if (!window.location.pathname.startsWith('/giveaways/')) return
      if (isNoSignupGiveaway(window.location.pathname)) return

      window.setTimeout(() => {
        if (isNoSignupGiveaway(window.location.pathname)) return
        if (document.querySelector('[data-giveaway-email-modal="true"]')) return
        setIsOpen(true)
      }, 0)
    }

    window.addEventListener(COPY_WITH_CONFETTI_SUCCESS_EVENT, handleCopySuccess)
    return () => window.removeEventListener(COPY_WITH_CONFETTI_SUCCESS_EVENT, handleCopySuccess)
  }, [])

  useEffect(() => {
    if (isNoSignup) setIsOpen(false)
  }, [isNoSignup])

  return (
    <>
      {children}
      {!isNoSignup && <GiveawayEmailModal slug={slug} isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  )
}
