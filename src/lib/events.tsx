import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export type EventHost = {
  name: string
  firstName: string
  role: string
  photoSrc: string
  bio: string[]
}

export type EventPromoCode = {
  code: string
  label: string
  description: string
  percentOff?: number
  amountOff?: number
}

export type EventSection =
  | {
      type: 'story'
      id: string
      eyebrow?: string
      title: string
      body: string[]
    }
  | {
      type: 'checklist'
      id: string
      eyebrow?: string
      title: string
      intro?: string
      items: string[]
    }
  | {
      type: 'cards'
      id: string
      eyebrow?: string
      title: string
      intro?: string
      columns?: 2 | 3
      items: Array<{
        kicker?: string
        title: string
        body?: string
        bullets?: string[]
      }>
    }
  | {
      type: 'split'
      id: string
      eyebrow?: string
      title: string
      body: string[]
      imageSrc: string
      imageAlt: string
      caption?: string
    }
  | {
      type: 'image'
      id: string
      eyebrow?: string
      title?: string
      imageSrc: string
      imageAlt: string
      caption?: string
    }
  | {
      type: 'html'
      id: string
      eyebrow?: string
      title?: string
      html: string
    }
  | {
      type: 'custom'
      id: string
      render: ReactNode
    }
  | {
      type: 'hosts'
      id: string
      eyebrow?: string
      title: string
      intro?: string
      hosts: EventHost[]
    }
  | {
      type: 'cta'
      id: string
      eyebrow?: string
      title: string
      body: string
      primaryLabel: string
      primaryHref: string
      secondaryLabel?: string
      secondaryHref?: string
      note?: string
    }

export type EventDefinition = {
  slug: string
  status: 'live' | 'draft'
  title: string
  shortTitle?: string
  eyebrow: string
  summary: string
  description: string
  dateLabel: string
  timeLabel: string
  locationLabel: string
  durationLabel: string
  heroImage: string
  heroAlt: string
  badge?: string
  audience: string[]
  outcomes: string[]
  hosts: EventHost[]
  pricing: {
    currencySymbol: string
    fullPrice: number
    checkoutHref: string
    checkoutNote: string
    promoCodes?: EventPromoCode[]
    promoFieldHint?: string
  }
  sections: EventSection[]
  metadata?: Partial<Metadata>
}

function getDiscountedPrice(fullPrice: number, promo?: EventPromoCode) {
  if (!promo) return fullPrice
  if (promo.amountOff) return Math.max(0, fullPrice - promo.amountOff)
  if (promo.percentOff) return Math.max(0, fullPrice * (1 - promo.percentOff / 100))
  return fullPrice
}

export function resolvePromoCode(event: EventDefinition, promoCode?: string | null) {
  const normalized = promoCode?.trim().toUpperCase()
  if (!normalized) return null
  return event.pricing.promoCodes?.find((promo) => promo.code.toUpperCase() === normalized) ?? null
}

export function formatEventPrice(event: EventDefinition, promo?: EventPromoCode) {
  const value = getDiscountedPrice(event.pricing.fullPrice, promo)
  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(2)
  return `${event.pricing.currencySymbol}${rounded}`
}

export const events: EventDefinition[] = [
  {
    slug: 'ai-avatar-content-creation',
    status: 'live',
    title: 'AI Avatar Content Creation Lab',
    shortTitle: 'AI Avatar Lab',
    eyebrow: '',
    summary:
      'A one-day cinematic AI content workshop for founders, creators, and brands who want content that looks modern, intentional, and commercially usable.',
    description:
      'Learn how to create AI avatars, cinematic b-roll, vertical videos, and repeatable content systems in one hands-on Bali workshop led by Joe Che and Helix Wolfson.',
    dateLabel: 'Saturday, May 30, 2026',
    timeLabel: '11:30 AM to 6:00 PM',
    locationLabel: 'Pererenan, Canggu',
    durationLabel: 'One intensive day',
    heroImage: '/events/ai-avatar-content-creation/flyer.jpg',
    heroAlt: 'AI Avatar Content Creation Lab flyer',
    badge: 'Live Workshop',
    audience: [
      'Creators',
      'Founders',
      'Coaches',
      'Retreat leaders',
      'Influencers',
      'Musicians',
      'Product brands',
      'Agencies',
    ],
    outcomes: [
      'A real content concept',
      'AI-generated visuals and avatar direction',
      'Hooks and scripts you can use immediately',
      'A repeatable workflow for producing more content from one idea',
      'A clear view of which AI tools are worth using right now',
    ],
    hosts: [
      {
        name: 'Helix Wolfson',
        firstName: 'Helix',
        role: 'Filmmaker • AI Creative Director',
        photoSrc: '/events/ai-avatar-content-creation/helix-wolfson.jpg',
        bio: [
          'Helix is a filmmaker, experiential designer, and AI creative director working at the intersection of storytelling, cinema, and emerging technology.',
          'He has spent decades producing commercials, immersive experiences, branded content, and large-scale creative projects. Now he teaches creators and brands how to use AI tools to build cinematic visuals, AI actors, animated scenes, and commercial-style content faster than traditional production pipelines allow.',
          'His work blends filmmaking discipline with cutting-edge AI workflows so the final output feels crafted, not generated.',
        ],
      },
      {
        name: 'Joe Che',
        firstName: 'Joe',
        role: 'Founder • AI Entrepreneur • Community Builder',
        photoSrc: '/mastermind-participants/joe-che.jpeg',
        bio: [
          'Joe Che is the founder of 24 companies and the builder of two AI companies, including All Sorted AI, a practical AI operating system for service-based small business owners.',
          'He previously built the largest software and business training company in New York City, where he trained more than 90,000 people, including Fortune 5 executives, the CIA, Microsoft, and Tyra Banks.',
          'Today, Joe mentors entrepreneurs inside his Business Automation Mastermind and helps founders use AI to create cleaner operations, stronger offers, faster execution, and more freedom.',
        ],
      },
    ],
    pricing: {
      currencySymbol: '$',
      fullPrice: 97,
      checkoutHref: 'https://buy.stripe.com/6oU7sL2npdRg1lPfc9cEw0x',
      checkoutNote: 'Promo codes can be entered directly in the Stripe checkout.',
      promoFieldHint: 'Bring your code with you. Promo codes are entered during checkout.',
      promoCodes: [
        {
          code: 'EARLY20',
          label: 'Early supporter',
          description: 'Save 20% for early registration.',
          percentOff: 20,
        },
        {
          code: 'COMMUNITY15',
          label: 'Community rate',
          description: 'Save $15 for invited community guests.',
          amountOff: 15,
        },
      ],
    },
    sections: [
      {
        type: 'cards',
        id: 'hero-capabilities',
        eyebrow: 'What You Will Learn',
        title: 'Modern AI content that actually looks directed',
        intro:
          'This is not a lecture about the future. It is a creative working session for people who want content that feels cinematic, current, and commercially usable.',
        columns: 3,
        items: [
          {
            kicker: 'Create',
            title: 'AI avatars and digital spokespeople',
            body: 'Build realistic presenters, clones, and digital influencers that still feel aligned with your brand.',
          },
          {
            kicker: 'Generate',
            title: 'Cinematic b-roll and short-form scenes',
            body: 'Use current AI video workflows to create modern vertical content without a full crew or traditional edit stack.',
          },
          {
            kicker: 'Systemize',
            title: 'A content engine you can repeat',
            body: 'Turn one good idea into hooks, scripts, visuals, and multiple usable content pieces instead of starting from zero every time.',
          },
        ],
      },
      {
        type: 'checklist',
        id: 'outcomes',
        eyebrow: 'What You Will Leave With',
        title: 'Real assets, clearer direction, and a workflow you can keep using',
        intro: 'By the end of the day, the goal is not more theory. The goal is traction.',
        items: [
          'A strong content angle tied to a real business or creator objective',
          'Visual direction for an avatar, spokesperson, or AI-assisted content style',
          'Hooks and scripts for short-form content',
          'A stronger understanding of current AI video and avatar tools',
          'The start of your first AI-powered content asset or campaign',
        ],
      },
      {
        type: 'split',
        id: 'creative-lab',
        eyebrow: 'How The Day Works',
        title: 'Creative direction first. Tool execution second.',
        body: [
          'Most AI content looks bad because people go straight to the tool before they know what they are trying to say, show, or sell.',
          'This workshop starts with positioning, concept, hooks, and visual direction. Then Helix and Joe walk the room through the actual AI workflows that turn that direction into something publishable.',
        ],
        imageSrc: '/events/ai-avatar-content-creation/workstation.jpg',
        imageAlt: 'AI content creation workstation with visual assets in motion',
        caption: 'The class is built like a guided studio session, not a generic software demo.',
      },
      {
        type: 'cards',
        id: 'curriculum',
        eyebrow: 'Workshop Structure',
        title: 'Three parts. One clean production flow.',
        columns: 3,
        items: [
          {
            kicker: 'Part 1',
            title: 'Ideas, hooks, and creative direction',
            bullets: [
              'Audience and positioning',
              'Scroll-stopping hooks',
              'Script structure',
              'Avatar or spokesperson concepts',
              'Cinematic b-roll ideas',
            ],
          },
          {
            kicker: 'Part 2',
            title: 'AI visuals, avatars, and cinematic content',
            bullets: [
              'AI image generation',
              'AI video workflows',
              'Lip sync and voice',
              'Commercial-style vertical content',
              'Multi-model experimentation',
            ],
          },
          {
            kicker: 'Part 3',
            title: 'Systems and automation',
            bullets: [
              'Scripting workflows',
              'Asset organization',
              'Caption and publishing flow',
              'Repurposing one idea into multiple outputs',
              'A repeatable content pipeline after the workshop',
            ],
          },
        ],
      },
      {
        type: 'html',
        id: 'tools',
        eyebrow: 'Tools To Set Up Before Class',
        title: 'Two accounts everyone should create in advance',
        html: `
          <div class="grid gap-4">
            <article class="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-6">
              <p class="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">Cinematic AI Video</p>
              <h3 class="mb-3 text-xl font-bold tracking-tight text-[#FCF4EB] md:text-[1.4rem]">Higgsfield</h3>
              <p class="mb-4 text-sm leading-7 text-[#FCF4EB]/68">
                Used for cinematic AI video workflows, including Kling, Seedance, lip sync tools, and multi-model experimentation.
              </p>
              <a class="inline-flex items-center gap-2 text-sm font-semibold text-[#F5C3C6]" href="https://higgsfield.ai" target="_blank" rel="noreferrer">higgsfield.ai</a>
            </article>
            <article class="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-6">
              <p class="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">Avatars and Translation</p>
              <h3 class="mb-3 text-xl font-bold tracking-tight text-[#FCF4EB] md:text-[1.4rem]">HeyGen</h3>
              <p class="mb-4 text-sm leading-7 text-[#FCF4EB]/68">
                Used for AI avatars, clones, voice translation, and talking-head content workflows.
              </p>
              <a class="inline-flex items-center gap-2 text-sm font-semibold text-[#F5C3C6]" href="https://www.heygen.com" target="_blank" rel="noreferrer">heygen.com</a>
            </article>
          </div>
        `,
      },
      {
        type: 'image',
        id: 'visual-marker',
        eyebrow: 'Visual Direction',
        title: 'The standard is intentional, not generic',
        imageSrc: '/events/ai-avatar-content-creation/symbol.jpg',
        imageAlt: 'AI filmmaking symbol with director chair and film reels',
        caption: 'The workshop is built to help people make content that feels considered, not templated.',
      },
      {
        type: 'hosts',
        id: 'hosts',
        eyebrow: 'Facilitating Team',
        title: 'Joe and Helix are both on the page and in the room',
        intro:
          'This section lives near the bottom on purpose. By the time someone gets here, they should already understand the value of the workshop and then meet the people leading it.',
        hosts: [],
      },
      {
        type: 'cta',
        id: 'final-cta',
        eyebrow: 'Reserve Your Spot',
        title: 'Bring a laptop, a charger, and one real idea worth turning into content.',
        body:
          'This is for people who want a guided working session, not another abstract AI talk. If you are serious about modern creator content, this is the room.',
        primaryLabel: 'Buy Ticket',
        primaryHref: 'https://buy.stripe.com/6oU7sL2npdRg1lPfc9cEw0x',
        note: 'Promo codes can be entered directly during checkout.',
      },
    ],
    metadata: {
      title: 'AI Avatar Content Creation Lab',
      description:
        'A cinematic AI content workshop in Bali with Joe Che and Helix Wolfson. Learn avatars, AI video, hooks, and repeatable content systems.',
    },
  },
]

for (const event of events) {
  event.sections = event.sections.map((section) =>
    section.type === 'hosts'
      ? {
          ...section,
          hosts: event.hosts,
        }
      : section,
  )
}

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug)
}

export function getLiveEvents() {
  return events.filter((event) => event.status === 'live')
}
