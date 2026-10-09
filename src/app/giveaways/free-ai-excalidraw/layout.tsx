import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const URL = 'https://workshop.mastermindshq.business/giveaways/free-ai-excalidraw'

export const metadata: Metadata = {
  title: 'Excalidraw: Explain anything in one picture',
  description: 'A free whiteboard in your browser with a friendly hand-drawn look. No download and no account. Free setup notes from Joe Che: 3 steps, tips and links.',
  keywords: ['Excalidraw', 'free AI tools', 'open source', 'AI for small business', 'Joe Che', 'Business Automation Mastermind'],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Excalidraw: Explain anything in one picture',
    description: 'A free whiteboard in your browser with a hand-drawn look. No download, no account.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Excalidraw: Explain anything in one picture',
    description: 'A free whiteboard in your browser with a hand-drawn look. No download, no account.',
    creator: '@joecheuk',
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
