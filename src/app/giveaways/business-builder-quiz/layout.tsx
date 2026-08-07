import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/business-builder-quiz`

export const metadata: Metadata = {
  title: 'Do You Have What It Takes to Build Your Own Business? — Take the Quiz',
  description:
    '6 questions that score your founder readiness across 5 research-backed levels, from not yet to built for this. Free from the Business Automation Mastermind.',
  keywords: [
    'do you have what it takes',
    'entrepreneur quiz',
    'founder readiness quiz',
    'should I start a business',
    'entrepreneurial mindset test',
    'grit quiz',
    'business builder quiz',
    'Business Automation Mastermind',
    'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Do You Have What It Takes to Build Your Own Business?',
    description:
      '6 questions to score your founder readiness across 5 levels. Backed by research from Rotter, Sarasvathy, Baker & Nelson, Duckworth, and Shane. Free from the Business Automation Mastermind.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Do You Have What It Takes to Build Your Own Business?',
    description:
      '6 questions. 5 levels. Find out where you actually stand as a founder.',
    creator: '@joecheuk',
  },
}

export default function BusinessBuilderQuizLayout({ children }: { children: ReactNode }) {
  return children
}
