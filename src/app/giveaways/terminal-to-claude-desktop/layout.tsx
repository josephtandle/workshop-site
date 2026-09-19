import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const URL = 'https://workshop.mastermindshq.business/giveaways/terminal-to-claude-desktop'

export const metadata: Metadata = {
  title: 'Terminal to Claude Desktop | Free Video Walkthrough',
  description: 'Follow Joe’s walkthrough of using Claude Code inside the Claude Desktop app. Free to watch with no signup required.',
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Terminal to Claude Desktop | Free Video Walkthrough',
    description: 'Follow Joe’s walkthrough of using Claude Code inside the Claude Desktop app. Free to watch with no signup required.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
}

export default function TerminalToClaudeDesktopLayout({ children }: { children: ReactNode }) {
  return children
}
