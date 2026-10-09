import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const URL = 'https://workshop.mastermindshq.business/giveaways/free-ai-jan'

export const metadata: Metadata = {
  title: 'Jan: ChatGPT style AI that never leaves your laptop',
  description: 'A free app that runs a ChatGPT style AI on your own computer. Once set up, it works with no internet and nothing leaves your laptop. Free setup notes from Joe Che: 3 steps, tips and links.',
  keywords: ['Jan', 'free AI tools', 'open source', 'AI for small business', 'Joe Che', 'Business Automation Mastermind'],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Jan: ChatGPT style AI that never leaves your laptop',
    description: 'Runs fully offline on your own computer, for client info you would never paste online.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jan: ChatGPT style AI that never leaves your laptop',
    description: 'Runs fully offline on your own computer, for client info you would never paste online.',
    creator: '@joecheuk',
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
