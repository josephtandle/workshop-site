import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const URL = 'https://workshop.mastermindshq.business/giveaways/free-ai-cal-com'

export const metadata: Metadata = {
  title: 'Cal.com: One link. No more back and forth',
  description: 'A free booking page. You share one link, people pick an open time from your calendar, and it books the call and sends reminders. Free setup notes from Joe Che: 3 steps, tips and links.',
  keywords: ['Cal.com', 'free AI tools', 'open source', 'AI for small business', 'Joe Che', 'Business Automation Mastermind'],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Cal.com: One link. No more back and forth',
    description: 'A free booking page: people pick a time from your calendar and it books the call and sends the reminders.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cal.com: One link. No more back and forth',
    description: 'A free booking page: people pick a time from your calendar and it books the call and sends the reminders.',
    creator: '@joecheuk',
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
