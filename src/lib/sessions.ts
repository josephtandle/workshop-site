export interface Session {
  slug: string
  number: number
  title: string
  description: string
  date: string
  hasGuide: boolean
  hasPrep: boolean
  hasBonus: boolean
  guidePath?: string
  guideTitle?: string
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
    hasBonus: true,
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
    date: '',
    hasGuide: true,
    hasPrep: true,
    hasBonus: true,
  },
  {
    slug: '4',
    number: 4,
    title: 'Mastermind Alignment',
    description: '',
    date: '',
    hasGuide: false,
    hasPrep: true,
    hasBonus: false,
  },
  {
    slug: '5',
    number: 5,
    title: 'Give Claude Code Your Brain',
    description:
      'Export your conversation history from ChatGPT and Claude, use AI to organize it into a Brain Dump folder, and wire it into Claude Code so it knows who you are automatically.',
    date: '',
    hasGuide: true,
    hasPrep: false,
    hasBonus: false,
    guidePath: 'guide-brain',
    guideTitle: 'How to Give Claude Code Your Brain, Part 1: Session Guide',
  },
]

export function getSession(slug: string): Session | undefined {
  return sessions.find((s) => s.slug === slug)
}
