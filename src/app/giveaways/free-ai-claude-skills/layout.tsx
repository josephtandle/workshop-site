import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const URL = 'https://workshop.mastermindshq.business/giveaways/free-ai-claude-skills'

export const metadata: Metadata = {
  title: 'Claude Skills: Teach Claude your way of working once',
  description: 'Anthropic\'s own library of Claude skills. A skill is a short recipe that teaches Claude how to do one job your way, every time. Free setup notes from Joe Che: 3 steps, tips and links.',
  keywords: ['Claude Skills', 'free AI tools', 'open source', 'AI for small business', 'Joe Che', 'Business Automation Mastermind'],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Claude Skills: Teach Claude your way of working once',
    description: 'Anthropic\'s free library of Claude skills: real Word, PowerPoint and Excel files, your brand on every one.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claude Skills: Teach Claude your way of working once',
    description: 'Anthropic\'s free library of Claude skills: real Word, PowerPoint and Excel files, your brand on every one.',
    creator: '@joecheuk',
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
