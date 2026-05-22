import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/hooklab`

export const metadata: Metadata = {
  title: 'HookLab — Free Instagram Reel Hook Generator',
  description: 'A free Claude Code skill that generates scored Instagram Reel hooks from your brand voice, top posts in your niche, or a specific CTA.',
  keywords: [
    'HookLab', 'Instagram hooks', 'Reel hooks', 'Claude Code skill', 'content hooks',
    'viral hooks', 'brand voice', 'Instagram content', 'Business Automation Mastermind', 'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'HookLab — Free Instagram Reel Hook Generator',
    description: 'Generate scored Instagram Reel hooks from your brand voice, live niche research, or a specific giveaway CTA. Free from the Business Automation Mastermind.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HookLab — Free Instagram Reel Hook Generator',
    description: 'A free Claude Code skill for generating scored Reel hooks that sound like you and point to a real CTA.',
    creator: '@joecheuk',
  },
}

export default function HookLabLayout({ children }: { children: ReactNode }) {
  return children
}
