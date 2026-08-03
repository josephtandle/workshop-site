import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/cost-stack`

export const metadata: Metadata = {
  title: 'The Cost Stack Audit — What Your Software Actually Costs You',
  description:
    'A free calculator that adds up what you pay every year for business software, hosting, freelancers and subscriptions, then shows which lines members of the Business Automation Mastermind replaced themselves.',
  keywords: [
    'software cost calculator', 'SaaS audit', 'cancel subscriptions', 'GoHighLevel alternative',
    'Kajabi alternative', 'Mailchimp alternative', 'small business software costs',
    'stop paying developers', 'AI automation', 'Business Automation Mastermind', 'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'The Cost Stack Audit — What Your Software Actually Costs You',
    description:
      'Add up what you pay every year, then see which lines someone in the mastermind already replaced and said so on the record. Free, takes about 60 seconds.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Cost Stack Audit',
    description:
      'Add up what your software, hosting and freelancers cost you every year. Then see what you could stop paying. Free.',
    creator: '@joecheuk',
  },
}

export default function CostStackLayout({ children }: { children: ReactNode }) {
  return children
}
