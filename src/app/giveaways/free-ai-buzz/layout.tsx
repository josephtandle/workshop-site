import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const URL = 'https://workshop.mastermindshq.business/giveaways/free-ai-buzz'

export const metadata: Metadata = {
  title: 'Buzz: Turn every call into text you can use',
  description: 'A free app that turns recordings into text on your own computer: calls, voice notes, videos. It also makes subtitle files for reels. Free setup notes from Joe Che: 3 steps, tips and links.',
  keywords: ['Buzz', 'free AI tools', 'open source', 'AI for small business', 'Joe Che', 'Business Automation Mastermind'],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Buzz: Turn every call into text you can use',
    description: 'Free, offline transcription for calls, voice notes and videos, plus subtitle files for your reels.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buzz: Turn every call into text you can use',
    description: 'Free, offline transcription for calls, voice notes and videos, plus subtitle files for your reels.',
    creator: '@joecheuk',
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
