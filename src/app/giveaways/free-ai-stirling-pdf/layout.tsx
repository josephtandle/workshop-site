import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const URL = 'https://workshop.mastermindshq.business/giveaways/free-ai-stirling-pdf'

export const metadata: Metadata = {
  title: 'Stirling PDF: Every PDF tool you need, in one free app',
  description: 'One free app with 50+ PDF tools: merge, split, compress, convert, sign, redact (black out) and turn scans into text. Free setup notes from Joe Che: 3 steps, tips and links.',
  keywords: ['Stirling PDF', 'free AI tools', 'open source', 'AI for small business', 'Joe Che', 'Business Automation Mastermind'],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Stirling PDF: Every PDF tool you need, in one free app',
    description: 'Merge, compress, sign, redact and convert, without uploading client contracts to random websites.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stirling PDF: Every PDF tool you need, in one free app',
    description: 'Merge, compress, sign, redact and convert, without uploading client contracts to random websites.',
    creator: '@joecheuk',
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
