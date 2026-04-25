import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/viral-hooks`

export const metadata: Metadata = {
  title: 'Understanding Viral Hooks -- Free Guide',
  description: '7 proven hook formulas, 8 real reel examples, and AI prompts to generate hooks for any topic. Free from the Business Automation Mastermind.',
  keywords: [
    'viral hooks', 'Instagram Reels hooks', 'hook formulas', 'content creation', 'stop the scroll',
    'reel hooks', 'social media hooks', 'AI content', 'Claude Code', 'Business Automation Mastermind', 'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Understanding Viral Hooks -- Free Guide',
    description: '7 proven hook formulas. 8 viral reel examples. 3 AI prompts to generate hooks for any topic. Free from the Business Automation Mastermind.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Understanding Viral Hooks -- Free Guide',
    description: '7 formulas. 8 examples. 3 AI prompts. Everything you need to stop the scroll. Free.',
    creator: '@joecheuk',
  },
}

export default function ViralHooksLayout({ children }: { children: ReactNode }) {
  return children
}
