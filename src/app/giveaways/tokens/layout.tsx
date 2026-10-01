import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/tokens`

export const metadata: Metadata = {
  title: 'The Token Diet: Cut Your AI Token Use by 70%',
  description: 'The four changes that cut my AI agents\' token use by 70% on the same plan, with the exact setup for each. Free guide from Joe Che.',
  keywords: [
    'The Token Diet', 'AI token usage', 'Claude Code tokens', 'ChatGPT Pro price', 'RTK',
    'cheapest AI model', 'MyOS Dispatch', 'Jev', 'CLAUDE.md', 'AGENTS.md', 'AI costs', 'usage limits',
    'Business Automation Mastermind', 'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'The Token Diet: Cut Your AI Token Use by 70%',
    description: 'Before you pay more for AI, stop burning what you already pay for. Four changes, the exact setup for each. Free from the Business Automation Mastermind.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Token Diet: Cut Your AI Token Use by 70%',
    description: 'Four changes that cut my AI agents\' token use by 70% on the same plan. Free guide.',
    creator: '@joecheuk',
  },
}

export default function TokensLayout({ children }: { children: ReactNode }) {
  return children
}
