import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/all-sorted-overview`

export const metadata: Metadata = {
  title: 'All Sorted Overview — 30 things All Sorted can do for your business',
  description: 'A pre-installed business operating system: 30 specific things All Sorted handles, from CRM and bookkeeping to image generation, voice notes, and 126 AI agents that already know your business.',
  keywords: [
    'All Sorted', 'business operating system', 'AI agents', 'CRM',
    'business automation', 'bookkeeping', 'voice transcription',
    'small business software', 'Business Automation Mastermind', 'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'All Sorted Overview — 30 things All Sorted can do',
    description: 'The pre-installed business operating system. 126 agents. 57 skills. 45+ integrations. Here is exactly what it does for your business.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Sorted Overview — 30 things All Sorted can do',
    description: 'A pre-installed business operating system. 126 agents already configured. Here is exactly what it does.',
    creator: '@joecheuk',
  },
}

export default function AllSortedOverviewLayout({ children }: { children: ReactNode }) {
  return children
}
