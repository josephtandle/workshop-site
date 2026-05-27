import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/speak-human`

export const metadata: Metadata = {
  title: 'Speak Human — Free Claude Code Skill',
  description: 'A free Claude Code skill from Joe Che’s public GitHub that strips AI writing patterns, protects real passages, and rewrites copy in a human voice. One command to install.',
  keywords: [
    'Speak Human', 'Claude Code skill', 'AI writing humanizer', 'remove AI patterns',
    'humanize AI text', 'Claude Code', 'AI writing tool', 'voice profile',
    'Business Automation Mastermind', 'Joe Che', 'ManyChat human giveaway',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Speak Human — Free Claude Code Skill',
    description: 'Install Joe Che’s free Claude Code skill from GitHub. It strips AI writing patterns, explains what it changes, and rewrites copy in a human voice.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speak Human — Free Claude Code Skill',
    description: 'Install Joe Che’s free Claude Code skill from GitHub. One command. Local skill. Human copy.',
    creator: '@joecheuk',
  },
}

export default function SpeakHumanLayout({ children }: { children: ReactNode }) {
  return children
}
