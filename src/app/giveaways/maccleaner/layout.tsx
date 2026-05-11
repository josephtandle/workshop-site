import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/maccleaner`

export const metadata: Metadata = {
  title: 'MacCleaner — Safe Mac Cleanup Script',
  description: 'A preview-first Mac cleanup script. No Electron app, no subscription, explicit confirmation before cleanup, and external-drive-aware backup archiving.',
  keywords: [
    'MacCleaner',
    'Mac cleanup script',
    'safe Mac cleanup',
    'dry run cleanup',
    'Mac disk cleaner',
    'Business Automation Mastermind',
    'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'MacCleaner — Safe Mac Cleanup Script',
    description: 'Preview first, confirm before cleanup, and use an external drive for old backups only when one is available.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MacCleaner — Safe Mac Cleanup Script',
    description: 'Preview-first Mac cleanup. Explicit confirmation required before anything destructive happens.',
    creator: '@joecheuk',
  },
}

export default function MacCleanerLayout({ children }: { children: ReactNode }) {
  return children
}
