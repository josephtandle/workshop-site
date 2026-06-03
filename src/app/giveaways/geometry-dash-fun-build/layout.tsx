import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const BASE = 'https://workshop.mastermindshq.business'
const URL  = `${BASE}/giveaways/geometry-dash-fun-build`

export const metadata: Metadata = {
  title: 'Geometry Dash Fun Build — Vibe Code a Game with p5.js',
  description: 'Build a Geometry Dash clone from scratch with p5.js. Copy the full game code, paste it into editor.p5js.org, and start customizing. Zero setup, instant play. Vibe coding for beginners.',
  keywords: [
    'Geometry Dash clone', 'p5.js game', 'vibe coding', 'build a game with AI',
    'game development for beginners', 'p5.js tutorial', 'Claude Code game',
    'Business Automation Mastermind', 'Joe Che', 'learn to code',
  ],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'Geometry Dash Fun Build — Vibe Code a Game with p5.js',
    description: 'Copy the full game code, paste it into editor.p5js.org, and play your own Geometry Dash clone in under 2 minutes. Then make it yours.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Geometry Dash Fun Build — Vibe Code a Game with p5.js',
    description: 'Full p5.js game code. Copy, paste, play. Then change the colors, physics, and level design.',
    creator: '@joecheuk',
  },
}

export default function GeometryDashLayout({ children }: { children: ReactNode }) {
  return children
}
