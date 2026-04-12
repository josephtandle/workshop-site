import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/speak-human`

export const metadata: Metadata = {
  title: 'Speak Human — Free Claude Code Skill',
  description: 'A free Claude Code skill that strips AI writing patterns and rewrites in your actual voice. Learns from your podcasts, books, and content. One command to install.',
  keywords: [
    'Speak Human', 'Claude Code skill', 'AI writing humanizer', 'remove AI patterns',
    'humanize AI text', 'Claude Code', 'AI writing tool', 'voice profile',
    'Business Automation Mastermind', 'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Speak Human — Free Claude Code Skill',
    description: 'Strip AI writing patterns and rewrite in your actual voice. Learns from your podcasts, books, and content. Free from the Business Automation Mastermind.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speak Human — Free Claude Code Skill',
    description: 'Strip AI writing patterns and rewrite in your actual voice. One command to install. Free from the Business Automation Mastermind.',
    creator: '@joecheuk',
  },
}

export default function SpeakHumanLayout({ children }: { children: ReactNode }) {
  return children
}
