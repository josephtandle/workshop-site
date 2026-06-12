import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/intuition-quiz`

export const metadata: Metadata = {
  title: "What's Your Intuition Level? — Take the Quiz",
  description:
    'Rate your intuition across 5 evidence-based levels. 8 questions backed by research from Klein, Kahneman, Gladwell, and Gigerenzen. Free from the Business Automation Mastermind.',
  keywords: [
    'intuition quiz',
    'intuition levels',
    'trust your gut',
    'gut feeling test',
    'decision making quiz',
    'System 1 System 2',
    'business intuition',
    'intuition research',
    'Business Automation Mastermind',
    'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: "What's Your Intuition Level?",
    description:
      '8 questions to rate your intuition across 5 levels. Backed by Klein, Kahneman, Gladwell, and Gigerenzen. Free from the Business Automation Mastermind.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "What's Your Intuition Level?",
    description:
      '8 questions. 5 levels. Backed by intuition research. Find out where your gut feeling really stands.',
    creator: '@joecheuk',
  },
}

export default function IntuitionQuizLayout({ children }: { children: ReactNode }) {
  return children
}
