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
]

export function getGiveaway(slug: string): Giveaway | undefined {
  return giveaways.find((g) => g.slug === slug)
}
