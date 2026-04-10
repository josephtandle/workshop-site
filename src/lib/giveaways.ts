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
]

export function getGiveaway(slug: string): Giveaway | undefined {
  return giveaways.find((g) => g.slug === slug)
}
