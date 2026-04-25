import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/viral-hooks`

export const metadata: Metadata = {
  title: 'Understanding Visual Hooks -- Free Guide',
  description: '7 visual techniques that appear in scroll-stopping reels, with 8 real examples to study frame by frame. Free from the Business Automation Mastermind.',
  keywords: [
    'visual hooks', 'Instagram Reels hooks', 'scroll-stopping content', 'content creation', 'stop the scroll',
    'reel hooks', 'social media hooks', 'visual techniques', 'Business Automation Mastermind', 'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Understanding Visual Hooks -- Free Guide',
    description: '7 visual techniques that appear in scroll-stopping reels. 8 real examples to study. Free from the Business Automation Mastermind.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Understanding Visual Hooks -- Free Guide',
    description: '7 visual techniques. 8 real reel examples. What scroll-stopping content actually looks like. Free.',
    creator: '@joecheuk',
  },
}

export default function ViralHooksLayout({ children }: { children: ReactNode }) {
  return children
}
