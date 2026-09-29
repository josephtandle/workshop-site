import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/lead-machine`

export const metadata: Metadata = {
  title: 'The Lead Machine',
  description: 'Paste one prompt into ChatGPT or Claude and get 25 real businesses that fit who you serve, each with a real public way to reach them. Free, from Joe Che\'s AI class.',
  keywords: [
    'Lead Machine', 'lead generation', 'cold outreach', 'ChatGPT prompt', 'Claude prompt',
    'business leads', 'AI prompt', 'Claude Code', 'Codex', 'Gemini CLI',
    'Business Automation Mastermind', 'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'The Lead Machine: Free from Joe Che',
    description: 'Paste one prompt into ChatGPT or Claude and get 25 real businesses that fit who you serve, each with a real public way to reach them. Free.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Lead Machine: Free from Joe Che',
    description: '25 real leads, each with a real public way to reach them. One prompt, free.',
    creator: '@joecheuk',
  },
}

export default function LeadMachineLayout({ children }: { children: ReactNode }) {
  return children
}
