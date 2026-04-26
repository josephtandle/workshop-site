export interface Giveaway {
  slug: string
  title: string
  description: string
  icon: string
  badge: string
  badgeVariant: 'purple' | 'pink'
}

// ---------------------------------------------------------------------------
// GIVEAWAY REGISTRY
// When you add a new giveaway page under /giveaways/<slug>/, add an entry here.
// The index page at /giveaways/ is generated from this list automatically.
// ---------------------------------------------------------------------------
export const giveaways: Giveaway[] = [
  {
    slug: 'web-design-arsenal',
    title: 'Web Design Arsenal',
    description: 'Install 6 Claude Code design skills and 20+ animation libraries in one prompt. Build gorgeous websites fast.',
    icon: '✦',
    badge: 'Claude Code',
    badgeVariant: 'purple',
  },
  {
    slug: 'claude-md',
    title: "Joe's Ultimate CLAUDE.md",
    description: "A ready-to-use CLAUDE.md template that programs Claude Code with your rules and context before you type a word.",
    icon: '◆',
    badge: 'Template',
    badgeVariant: 'purple',
  },
  {
    slug: 'benchmark',
    title: 'Claude vs OpenAI Benchmark Guide',
    description: 'A side-by-side pricing and capability comparison across flagship, balanced, and value tiers. Know which model to use and when.',
    icon: '⬡',
    badge: 'Guide',
    badgeVariant: 'pink',
  },
  {
    slug: 'anthropic-safety-checklist',
    title: 'Anthropic Safety Checklist',
    description: "The rules Anthropic actually enforces. Know what's allowed before you build agents, bots, or automated workflows.",
    icon: '✓',
    badge: 'Checklist',
    badgeVariant: 'pink',
  },
  {
    slug: 'lead-magnet',
    title: 'What Does Success Mean to You?',
    description: 'Stories and reflections from the Masterminds cohort on what success really looks like when you stop chasing and start building.',
    icon: '✶',
    badge: 'Resource',
    badgeVariant: 'purple',
  },
  {
    slug: 'logo-maker-guide',
    title: 'How to Get a Great Logo',
    description: 'Every path covered: free tools, paid options, hiring a designer, and how to build your own logo maker with APIs. Includes API comparison and limitations.',
    icon: '◈',
    badge: 'Guide',
    badgeVariant: 'pink',
  },
  {
    slug: 'speak-human',
    title: 'Speak Human',
    description: 'A Claude Code skill that strips AI writing patterns and rewrites in your actual voice. Learns from your podcasts, books, and content. One command to install.',
    icon: '✦',
    badge: 'Skill',
    badgeVariant: 'purple',
  },
  {
    slug: 'guardog',
    title: 'Guardog',
    description: 'Scan npm and PyPI packages for malware, CVEs, and suspicious patterns before you install them. One command to set up.',
    icon: '◈',
    badge: 'Skill',
    badgeVariant: 'purple',
  },
  {
    slug: 'ray-dalio-council',
    title: 'Ray Dalio Council',
    description: 'A Claude Code skill that runs a believability-weighted decision council. Five scouts argue your question. One synthesizer weighs them. PROCEED, HOLD, or INVESTIGATE.',
    icon: '✦',
    badge: 'Skill',
    badgeVariant: 'purple',
  },
  {
    slug: 'viral-hooks',
    title: 'Understanding Visual Hooks',
    description: '7 visual techniques that appear in scroll-stopping reels, with 8 real examples to study frame by frame. Free from the Business Automation Mastermind.',
    icon: '◎',
    badge: 'Guide',
    badgeVariant: 'pink',
  },
  {
    slug: 'squarespace-escape',
    title: 'Squarespace Escape Kit',
    description: 'One Claude Code prompt that scrapes your entire Squarespace site. Every page saved as HTML. Every image downloaded at full resolution. Delivered as a zip file.',
    icon: '◈',
    badge: 'Prompt',
    badgeVariant: 'purple',
  },
  {
    slug: 'cult-brand-playbook',
    title: 'The Cult Brand Playbook',
    description: 'The 7-element system behind Apple, Nike, Supreme, and CrossFit. Stop competing on features. Start competing on identity.',
    icon: '✦',
    badge: 'Playbook',
    badgeVariant: 'purple',
  },
  {
    slug: 'agent-infrastructure',
    title: 'Advanced Infrastructure for Multi-Agent AI Operating Systems',
    description: 'Six layers that turn a collection of agents into a system that gets smarter every day. Memory, navigation, self-learning, coordination, dispatch, and composability.',
    icon: '◈',
    badge: 'Guide',
    badgeVariant: 'purple',
  },
]

export function getGiveaway(slug: string): Giveaway | undefined {
  return giveaways.find((g) => g.slug === slug)
}
