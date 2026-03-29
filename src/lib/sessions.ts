export interface Session {
  slug: string
  number: number
  title: string
  description: string
  date: string
  hasGuide: boolean
  hasPrep: boolean
}

export const sessions: Session[] = [
  {
    slug: '1',
    number: 1,
    title: 'Setting the Mastermind Container',
    description: '',
    date: '',
    hasGuide: false,
    hasPrep: false,
  },
  {
    slug: '2',
    number: 2,
    title: 'Building Your First Web Page with AI',
    description:
      'Use Claude Code to build and deploy a personal brand website in under 2 hours. No experience required.',
    date: '',
    hasGuide: true,
    hasPrep: true,
  },
  {
    slug: '3',
    number: 3,
    title: 'Custom Domains and Lead Magnets',
    description:
      'Buy a domain, connect it to Vercel, capture leads with a form, save them to Supabase, and send an automatic welcome email with Resend.',
    date: '2026-04-05',
    hasGuide: true,
    hasPrep: true,
  },
]

export function getSession(slug: string): Session | undefined {
  return sessions.find((s) => s.slug === slug)
}
