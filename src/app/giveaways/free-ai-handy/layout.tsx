import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const URL = 'https://workshop.mastermindshq.business/giveaways/free-ai-handy'

export const metadata: Metadata = {
  title: 'Handy: Talk instead of type. In any app',
  description: 'A free app that types what you say. Hold a key, talk, let go, and the text appears wherever your cursor is. Free setup notes from Joe Che: 3 steps, tips and links.',
  keywords: ['Handy', 'free AI tools', 'open source', 'AI for small business', 'Joe Che', 'Business Automation Mastermind'],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Handy: Talk instead of type. In any app',
    description: 'Hold a key, say it, let go. The words appear wherever your cursor is. Free, and it runs on your own computer.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Handy: Talk instead of type. In any app',
    description: 'Hold a key, say it, let go. The words appear wherever your cursor is. Free, and it runs on your own computer.',
    creator: '@joecheuk',
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
