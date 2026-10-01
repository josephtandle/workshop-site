import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/tokens`

export const metadata: Metadata = {
  title: 'The Token Diet: 1.4 Billion Tokens My Agents Never Had to Read',
  description: 'Four changes that stopped my agents wasting 1.4 billion tokens. RTK trimmed 70% of noisy command output before my agents read it. Free guide from Joe Che.',
  keywords: [
    'The Token Diet', 'AI token usage', 'Claude Code tokens', 'ChatGPT Pro price', 'RTK',
    'cheapest AI model', 'MyOS Dispatch', 'Jev', 'CLAUDE.md', 'AGENTS.md', 'AI costs', 'usage limits',
    'Business Automation Mastermind', 'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'The Token Diet: 1.4 Billion Tokens My Agents Never Had to Read',
    description: 'RTK trimmed 70% of the noisy command output before my agents read it. Four changes with the exact setup for each. Free from the Business Automation Mastermind.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Token Diet: 1.4 Billion Tokens My Agents Never Had to Read',
    description: 'RTK trimmed 70% of noisy command output before my agents read it. Free guide.',
    creator: '@joecheuk',
  },
}

export default function TokensLayout({ children }: { children: ReactNode }) {
  return children
}
