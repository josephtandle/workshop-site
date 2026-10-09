import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const URL = 'https://workshop.mastermindshq.business/giveaways/free-ai-documenso'

export const metadata: Metadata = {
  title: 'Documenso: Contracts signed from a phone',
  description: 'An open source alternative to DocuSign. Upload a contract, mark where to sign, and send it. People sign from their phone or laptop. Free setup notes from Joe Che: 3 steps, tips and links.',
  keywords: ['Documenso', 'free AI tools', 'open source', 'AI for small business', 'Joe Che', 'Business Automation Mastermind'],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Documenso: Contracts signed from a phone',
    description: 'A free, open source DocuSign alternative. Upload, drag a signature box, send.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documenso: Contracts signed from a phone',
    description: 'A free, open source DocuSign alternative. Upload, drag a signature box, send.',
    creator: '@joecheuk',
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
