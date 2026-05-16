import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const URL = 'https://workshop.mastermindshq.business/giveaways/ig-settings'

export const metadata: Metadata = {
  title: 'Instagram Settings Growth Checklist',
  description:
    'A practical Instagram account settings checklist for creators who want more reach, better recommendations, and cleaner Reels uploads.',
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Instagram Settings Growth Checklist',
    description:
      'Turn on the Instagram settings that help your account stay recommendable, remixable, measurable, and easy to grow.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Settings Growth Checklist',
    description: 'The settings checklist to run before you post your next Reel.',
  },
}

export default function IgSettingsLayout({ children }: { children: ReactNode }) {
  return children
}
