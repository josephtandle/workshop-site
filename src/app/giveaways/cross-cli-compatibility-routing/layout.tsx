import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const BASE = 'https://workshop.mastermindshq.business'
const URL = `${BASE}/giveaways/cross-cli-compatibility-routing`

export const metadata: Metadata = {
  title: 'Cross CLI Compatibility Routing',
  description:
    'A lane-based architecture for making large agent, skill, recipe, and workflow systems smarter, faster, and easier to grow. Includes a direct-download PDF and a universal migration prompt.',
  keywords: [
    'agent routing',
    'Claude Code',
    'Codex',
    'Gemini CLI',
    'AI orchestrator',
    'recipe dispatcher',
    'workflow routing',
    'capability registry',
    'Masterminds HQ',
    'Joe Che',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Cross CLI Compatibility Routing',
    description:
      'The architecture for making large AI capability systems leaner, smarter, and more portable across CLIs. Includes a universal migration prompt and PDF.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cross CLI Compatibility Routing',
    description:
      'A lane-based routing architecture for recipes, skills, and workflows. Includes a universal migration prompt and direct-download PDF.',
    creator: '@joecheuk',
  },
}

export default function CrossCliCompatibilityRoutingLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
