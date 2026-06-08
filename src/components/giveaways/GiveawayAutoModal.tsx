'use client'

import { useEffect, useState } from 'react'
import GiveawayEmailModal from './GiveawayEmailModal'

type Props = {
  /** Giveaway slug — used as the source on the lead-magnet API call. */
  slug: string
  /** One-line heading shown in the modal. Customize per giveaway. */
  headingOverride: string
  /** Auto-open delay in milliseconds. Default 20s. */
  delayMs?: number
}

// ---------------------------------------------------------------------------
// GiveawayAutoModal — auto-popup email modal for non-copy-prompt giveaways.
//
// Wire this on every giveaway page that does not have a copy-prompt. The
// component opens GiveawayEmailModal on a timer, suppressed by sessionStorage
// so it fires once per session per slug.
//
// Usage:
//   import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'
//   <GiveawayAutoModal slug="compare" headingOverride="Want this kind of breakdown in your inbox?" />
//
// Rule: ~/.myos/workspace/projects/mastermind/giveaways/PROCESS.md
// Test: workshop-site/tests/giveaway-template-structure.test.ts
// ---------------------------------------------------------------------------
export default function GiveawayAutoModal({ slug, headingOverride, delayMs = 20000 }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const key = `giveaway-auto-modal-shown-${slug}`
    if (window.sessionStorage.getItem(key)) return
    const t = window.setTimeout(() => {
      setIsOpen(true)
      try { window.sessionStorage.setItem(key, '1') } catch { /* noop */ }
    }, delayMs)
    return () => window.clearTimeout(t)
  }, [slug, delayMs])

  return (
    <GiveawayEmailModal
      slug={slug}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      showCopiedBadge={false}
      headingOverride={headingOverride}
    />
  )
}
