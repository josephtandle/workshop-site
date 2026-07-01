import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/fable-worth-it-audit`

export const metadata: Metadata = {
  title: 'Fable Worth-It Audit — Claude Fable 5 Giveaway',
  description:
    'A free codebase audit prompt that shows where Claude Fable 5 is actually worth using instead of Sonnet.',
  keywords: [
    'Claude Fable 5',
    'Claude Code',
    'Sonnet',
    'AI agents',
    'codebase audit',
    'Claude Managed Agents',
    'Business Automation Mastermind',
    'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Fable Worth-It Audit',
    description:
      'Find the 5 places in your codebase where Claude Fable 5 is actually worth the cost.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fable Worth-It Audit',
    description:
      'Do not hire a surgeon to open a pickle jar. Use this audit to decide when Fable is worth it.',
    creator: '@joecheuk',
  },
}

export default function FableWorthItAuditLayout({ children }: { children: ReactNode }) {
  return children
}
