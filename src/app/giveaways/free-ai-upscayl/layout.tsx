import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const URL = 'https://workshop.mastermindshq.business/giveaways/free-ai-upscayl'

export const metadata: Metadata = {
  title: 'Upscayl: Blurry photo in, sharp photo out',
  description: 'A free app that uses AI to make small or blurry images bigger and sharper. Free setup notes from Joe Che: 3 steps, tips and links.',
  keywords: ['Upscayl', 'free AI tools', 'open source', 'AI for small business', 'Joe Che', 'Business Automation Mastermind'],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Upscayl: Blurry photo in, sharp photo out',
    description: 'Drag in a small or blurry image and AI makes it bigger and sharper. Free, and your photos stay on your computer.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Upscayl: Blurry photo in, sharp photo out',
    description: 'Drag in a small or blurry image and AI makes it bigger and sharper. Free, and your photos stay on your computer.',
    creator: '@joecheuk',
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
