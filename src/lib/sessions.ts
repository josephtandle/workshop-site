export interface Session {
  slug: string
  number: number
  title: string
  description: string
  date: string
  hasGuide: boolean
  hasPrep: boolean
  hasBonus: boolean
}

export const sessions: Session[] = [
  {
    slug: '1',
    number: 1,
    title: 'Setting the Mastermind Container',
    description:
      'Introductions, group agreements, and the mindset shift from employee to entrepreneur. We define what we are building and why.',
    date: '',
    hasGuide: false,
    hasPrep: false,
    hasBonus: false,
  },
  {
    slug: '2',
    number: 2,
    title: 'Building Your First Web Page with AI',
    description:
      'Go from zero to a live personal brand website in under two hours using Claude Code and Vercel. No coding experience needed — just your ideas and a laptop.',
    date: '',
    hasGuide: true,
    hasPrep: true,
    hasBonus: false,
  },
  {
    slug: '3',
    number: 3,
    title: 'Building Your First Lead Magnets',
    description:
      'Connect a custom domain, build a lead capture page, store subscribers in Supabase, and automatically deliver your resource by email the moment someone signs up.',
    date: '2026-04-05',
    hasGuide: true,
    hasPrep: true,
    hasBonus: true,
  },
]

export function getSession(slug: string): Session | undefined {
  return sessions.find((s) => s.slug === slug)
}
