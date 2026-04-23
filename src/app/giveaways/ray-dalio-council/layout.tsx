import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/ray-dalio-council`

export const metadata: Metadata = {
  title: 'Ray Dalio Council -- Free Claude Code Skill',
  description: 'A free Claude Code skill that runs a believability-weighted decision council. Five scouts argue your question. One synthesizer weighs them. You get PROCEED, HOLD, or INVESTIGATE with a confidence score.',
  keywords: [
    'Ray Dalio Council', 'Claude Code skill', 'decision making', 'believability weighted',
    'AI decision council', 'Claude Code', 'business decisions', 'Ray Dalio Bridgewater',
    'Business Automation Mastermind', 'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Ray Dalio Council -- Free Claude Code Skill',
    description: 'Five scouts argue every decision. One synthesizer weighs them. PROCEED, HOLD, or INVESTIGATE. Free from the Business Automation Mastermind.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ray Dalio Council -- Free Claude Code Skill',
    description: 'Five scouts argue every decision. One synthesizer weighs them. PROCEED, HOLD, or INVESTIGATE. One command to install. Free.',
    creator: '@joecheuk',
  },
}

export default function RayDalioCouncilLayout({ children }: { children: ReactNode }) {
  return children
}
