import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/claude-md`

export const metadata: Metadata = {
  title: 'The Ultimate CLAUDE.md File — Free Download',
  description: 'Stop repeating yourself to Claude. One file in your project root loads your rules, preferences, and context automatically at the start of every Claude Code session. Free from the Business Automation Mastermind.',
  keywords: [
    'CLAUDE.md', 'Claude Code', 'Claude Code configuration', 'AI coding setup',
    'Claude Code tips', 'CLAUDE.md template', 'Claude Code rules', 'AI developer tools',
    'Business Automation Mastermind', 'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'The Ultimate CLAUDE.md File — Free Download',
    description: 'One file. Your rules, preferences, and project context loaded automatically every Claude Code session. Free from the Business Automation Mastermind.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Ultimate CLAUDE.md File — Free Download',
    description: 'One file. Your rules loaded automatically every Claude Code session. Free from the Business Automation Mastermind.',
    creator: '@joecheuk',
  },
}

export default function ClaudeMdLayout({ children }: { children: ReactNode }) {
  return children
}
