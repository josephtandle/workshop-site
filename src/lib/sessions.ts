export interface Session {
  slug: string
  number: number
  title: string
  description: string
  date: string
  hasGuide: boolean
  hasPrep: boolean
  hasBonus: boolean
  hasWrapup?: boolean
  guidePath?: string
  guideTitle?: string
  prepLabel?: string
  prepDescription?: string
}

export const sessions: Session[] = [
  {
    slug: '1',
    number: 1,
    title: 'Setting the Mastermind Container',
    description:
      'Introductions, group agreements, and the mindset shift from employee to entrepreneur. We define what we are building and why.',
    date: '',
    hasGuide: true,
    hasPrep: true,
    hasBonus: true,
    guideTitle: 'Session Recording',
    prepDescription: 'Get your Claude Pro account and Vercel account set up before we start. Takes about 5 minutes.',
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
    title: 'Creating Your Second Brain and Putting It in Your Pocket',
    description:
      'Export your conversation history from ChatGPT and Claude, use AI to organize it into a Brain Dump folder, and wire it into Claude Code so it knows who you are automatically.',
    date: '',
    hasGuide: true,
    hasPrep: true,
    hasBonus: false,
    guidePath: 'guide-brain',
    guideTitle: 'Creating Your Second Brain and Putting It in Your Pocket: Session Guide',
    prepLabel: 'Prep: Export Your AI Conversations',
    prepDescription: 'Export your conversation history from ChatGPT and Claude before the session. Requests can take up to 48 hours.',
  },
  {
    slug: '5',
    number: 5,
    title: 'Mastermind Alignment',
    description: '',
    date: '',
    hasGuide: false,
    hasPrep: false,
    hasBonus: false,
    hasWrapup: true,
  },
  {
    slug: '6',
    number: 6,
    title: 'Prepare for Hook Writer and Hook Writer Part 1',
    description:
      'Build a personal voice profile that actually sounds like you, explore model switching and background agents, install Hook Writer, and wire up a daily hook research agent that sends you fresh ideas every morning.',
    date: '',
    hasGuide: true,
    hasPrep: true,
    hasBonus: false,
  },
  {
    slug: '7',
    number: 7,
    title: 'Your First Mission Control',
    description:
      'Install a personal browser-based task board with AI automation columns, pre-loaded projects, and drag-and-drop kanban — running entirely on your laptop.',
    date: '',
    hasGuide: true,
    hasPrep: true,
    hasBonus: false,
  },
  {
    slug: '8',
    number: 8,
    title: 'Safety and WebFetch',
    description:
      'Install WebFetch, understand the tools inside it, and practice safe web fetching, scraping, browser automation, and media downloads.',
    date: '',
    hasGuide: true,
    hasPrep: true,
    hasBonus: false,
    guideTitle: 'Session 8 Workshop Guide',
    prepDescription: 'Update Claude Code to the latest version and confirm your plan before we start.',
  },
  {
    slug: '9',
    number: 9,
    title: "Joe's Magic CRM Installation",
    description:
      'Install the All Sorted CRM module into your existing Mission Control setup, validate the live CRM routes, and start using the sample pipeline, templates, automations, and settings right away.',
    date: '',
    hasGuide: true,
    hasPrep: false,
    hasBonus: false,
    guideTitle: "Joe's Magic CRM Installation",
  },
]

export function getSession(slug: string): Session | undefined {
  return sessions.find((s) => s.slug === slug)
}
