import type { ReactNode } from 'react'
import GiveawayCopyEmailGate from '@/components/giveaways/GiveawayCopyEmailGate'

export const metadata = {
  description: 'Free resources and tools for building with AI and automation.',
}

export default function GiveawaysLayout({ children }: { children: ReactNode }) {
  return <GiveawayCopyEmailGate>{children}</GiveawayCopyEmailGate>
}
