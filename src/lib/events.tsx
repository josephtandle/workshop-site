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
      videoSrc?: string
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
      type: 'quoteCard'
      id: string
      quote: string
      name: string
      bio?: string
      location?: string
      imageSrc: string
      imageAlt: string
      videoSrc?: string
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
    donationMode?: boolean
    minDonation?: number
  }
  legacyRegistration?: {
    eventId: string
    eventDate: string
    fallbackTicketId: string
  }
  privateLocationReminder?: {
    eventStartIso: string
    leadHours: number
    exactAddress: string
    googleMapsUrl: string
    parkingInstructions?: string[]
  }
  postPurchase?: {
    setupPageTitle: string
    setupPageIntro: string
    setupPageBody: string[]
    setupItems: Array<{
      name: string
      href: string
      description: string
      stepLabel: string
    }>
  }
  ctaLabel?: string
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
    slug: 'connection-dinner-canggu',
    status: 'live',
    title: 'Canggu Connection Dinner',
    shortTitle: 'Connection Dinner',
    eyebrow: 'Monthly Gathering',
    summary: 'A monthly dinner for entrepreneurs, founders, and people doing interesting things in Canggu.',
    description:
      'Once a month I bring together a small room of people I find genuinely interesting for dinner at Mostly in Pererenan. No pitches, no panels, no agenda. Real conversation over really good food.',
    ctaLabel: 'Save Your Seat',
    dateLabel: 'Wednesday, May 27, 2026',
    timeLabel: '6:00 PM',
    locationLabel: 'Mostly Restaurant, Pererenan, Canggu',
    durationLabel: 'Your Reserved Seat',
    heroImage: '/events/connection-dinner-canggu/venue-room.jpg',
    heroAlt: 'Canggu Connection Dinner at Mostly Restaurant',
    badge: 'This Month',
    audience: [
      'Entrepreneurs',
      'Founders',
      'Creators',
      'Remote workers',
      'Coaches',
      'Investors',
      'Change-makers',
    ],
    outcomes: [
      'Real conversations with people doing interesting things',
      'A seat at a curated table, not a random networking event',
      'Connections that matter',
      'A good meal at one of Canggu\'s best restaurants',
    ],
    hosts: [
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
      fullPrice: 10,
      checkoutHref: '',
      checkoutNote: 'Your donation goes directly to PKP Community Centre.',
      donationMode: true,
      minDonation: 0,
    },
    privateLocationReminder: {
      eventStartIso: '2026-05-27T18:00:00+08:00',
      leadHours: 4,
      exactAddress: 'Mostly Restaurant, Jl. Pantai Pererenan No.114, Pererenan, Mengwi, Bali 80351',
      googleMapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Mostly+Restaurant+Jl.+Pantai+Pererenan+No.114+Pererenan+Mengwi+Bali',
      parkingInstructions: [
        'Arrival is at 6:00 PM. Doors close at 6:30 PM.',
        'The restaurant is on Jalan Pantai Pererenan, just off the main Pererenan strip.',
      ],
    },
    postPurchase: {
      setupPageTitle: 'You\'re confirmed for the dinner.',
      setupPageIntro: 'We\'ll send you the exact address closer to the date.',
      setupPageBody: [
        'The dinner is at Mostly Restaurant, Pererenan, Canggu. Arrive at 6:00 PM. Doors close at 6:30 PM.',
        'You will receive a reminder email with the address four hours before the dinner. See you there.',
      ],
      setupItems: [],
    },
    sections: [
      {
        type: 'story',
        id: 'invite',
        eyebrow: "You're Invited",
        title: 'An evening worth showing up for.',
        body: [
          'Once a month I bring together a small room of people I find genuinely interesting for dinner at Mostly in Pererenan. Entrepreneurs, founders, builders. Some artists. A few people working on things I have not seen before.',
          'No panels. No pitches. No agenda. Just dinner and real conversation.',
          'We start at 6 PM and close the doors at 6:30 so we can stay present with each other for the evening. The food is good. The people are better.',
        ],
      },
      {
        type: 'cards',
        id: 'about',
        eyebrow: 'What To Expect',
        title: 'A real dinner. A real room.',
        intro: 'This is not a conference. It is not a networking event. It is a dinner.',
        columns: 2,
        items: [
          {
            kicker: 'Curated',
            title: 'A small, intentional table',
            body: 'Every seat is invited. The room is built so the conversation stays high-quality and the connections are worth having.',
          },
          {
            kicker: 'Monthly',
            title: 'The same table, every month',
            body: 'The Connection Dinner happens monthly in Canggu. Some faces return. New ones join. The room always surprises you.',
          },
        ],
      },
      {
        type: 'html',
        id: 'mostly-video',
        eyebrow: 'The Venue',
        html: `
          <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:1rem;">
            <iframe
              src="https://www.youtube.com/embed/qUciw2hjnhk?rel=0"
              style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              title="Mostly Restaurant, Bali"
            ></iframe>
          </div>
        `,
      },
      {
        type: 'html',
        id: 'gallery',
        eyebrow: 'Past Dinners',
        html: `
          <div class="not-prose grid grid-cols-2 gap-3">
            <img src="/events/connection-dinner-canggu/guests-1.jpg" alt="Joe and guests at the Connection Dinner" style="width:100%;border-radius:1rem;display:block;" />
            <img src="/events/connection-dinner-canggu/guests-3.jpg" alt="Guests at the Connection Dinner" style="width:100%;border-radius:1rem;display:block;" />
          </div>
        `,
      },
      {
        type: 'html',
        id: 'mid-cta',
        html: `
          <div class="not-prose text-center py-2">
            <a href="#register" class="copy-button-glass copy-button-primary inline-flex min-w-[220px] items-center justify-center rounded-xl px-6 py-4 text-base font-semibold no-underline">
              Save Your Seat
            </a>
          </div>
        `,
      },
      {
        type: 'html',
        id: 'dress-code',
        eyebrow: 'Dress Code',
        html: `
          <div class="not-prose">
            <p class="text-[1.8rem] font-bold leading-[1.05] tracking-tight text-[#FCF4EB] md:text-[2.1rem]">The dinner is an occasion worth dressing for.</p>
            <p class="mt-4 text-base leading-8 text-[#FCF4EB]/68">Smart casual at minimum. Think a nice dinner out, not the beach. Leave the yoga clothes and flip-flops for another day.</p>
          </div>
        `,
      },
      {
        type: 'split',
        id: 'pkp',
        eyebrow: '100% of Donations Go To PKP',
        title: 'Supporting PKP Community Centre',
        body: [
          'Every dollar donated at this dinner goes directly to PKP. The suggested amount is $10, but you decide what feels right.',
        ],
        imageSrc: '/events/connection-dinner-canggu/pkp-catering.jpg',
        imageAlt: 'PKP Community Centre women, Bali',
        caption: 'PKP Community Centre, Bali — pkpcommunitycentre.org',
      },
      {
        type: 'html',
        id: 'pkp-photos',
        html: `
          <div class="not-prose grid grid-cols-2 gap-3">
            <img src="/events/connection-dinner-canggu/guests-2.jpg" alt="Guests at the Connection Dinner" style="width:100%;border-radius:1rem;display:block;" />
            <img src="/events/connection-dinner-canggu/guests-4.jpg" alt="Joe and a guest at the Connection Dinner" style="width:100%;border-radius:1rem;display:block;" />
          </div>
        `,
      },
      {
        type: 'html',
        id: 'vip',
        eyebrow: 'VIP Connection Dinner',
        html: `
          <div class="rounded-[1.4rem] border border-[#8B79D4]/30 bg-white/[0.04] px-6 py-5">
            <p class="text-sm leading-7 text-[#FCF4EB]/72">
              Those who attend the Connection Dinner receive <strong class="text-[#FCF4EB]">VIP status at Mostly Restaurant</strong>, which includes discounted pricing on future visits.
            </p>
          </div>
        `,
      },
      {
        type: 'hosts',
        id: 'hosts',
        eyebrow: 'Hosted By',
        title: 'Joe Che',
        intro: '',
        hosts: [],
      },
    ],
    metadata: {
      title: 'Canggu Connection Dinner, May 27, 2026',
      description:
        'An intimate gathering of entrepreneurs, creators, and change-makers in Canggu. Donations go to PKP Community Centre.',
    },
  },
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
    timeLabel: '10:30 AM to 5:00 PM',
    locationLabel: 'Pererenan, Canggu',
    durationLabel: 'One-day intensive bootcamp',
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
      checkoutNote: 'Enter your details below and complete checkout on this page.',
      promoFieldHint: 'Click Enter promo code to reveal the field before checkout.',
      promoCodes: [
        {
          code: 'helix33',
          label: 'Helix 33',
          description: 'Save 33% with Helix.',
          percentOff: 33,
        },
        {
          code: 'Joe33',
          label: 'Joe 33',
          description: 'Save 33% with Joe.',
          percentOff: 33,
        },
        {
          code: 'Guest100',
          label: 'Guest 100',
          description: 'Guest pass for a free ticket.',
          percentOff: 100,
        },
        {
          code: 'Guest99',
          label: 'Guest 99',
          description: 'Guest pass for 99% off.',
          percentOff: 99,
        },
        {
          code: 'Mastermind50',
          label: 'Mastermind 50',
          description: 'Save 50% with the Mastermind rate.',
          percentOff: 50,
        },
      ],
    },
    legacyRegistration: {
      eventId: '9YGs4u',
      eventDate: '2026-05-30',
      fallbackTicketId: 'wab8lo',
    },
    privateLocationReminder: {
      eventStartIso: '2026-05-30T10:30:00+08:00',
      leadHours: 4,
      exactAddress:
        'Happy Days Villa No. 2, Jalan Pura Gede Batur, off Jalan Pantai Pererenan, Canggu 80361, Bali, Indonesia',
      googleMapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Happy+Days+Villa+No.+2%2C+Jalan+Pura+Gede+Batur%2C+off+Jalan+Pantai+Pererenan%2C+Canggu+80361%2C+Bali%2C+Indonesia',
      parkingInstructions: [],
    },
    postPurchase: {
      setupPageTitle: 'Great, your seat is reserved.',
      setupPageIntro:
        'Before the workshop, there are two free accounts you need to create so you can follow the class live without delays.',
      setupPageBody: [
        'Start with Higgsfield first. That is where the cinematic AI video workflow happens, including the tools we will use for b-roll, motion, and multi-model experimentation.',
        'After that, create your HeyGen account so you are ready for avatar, talking-head, and translation workflows during the event.',
      ],
      setupItems: [
        {
          name: 'Higgsfield',
          href: 'https://higgsfield.ai',
          description: 'Create this first for cinematic AI video workflows, including Kling, Seedance, lip sync tools, and multi-model experimentation.',
          stepLabel: 'Step 1',
        },
        {
          name: 'HeyGen',
          href: 'https://www.heygen.com',
          description: 'Create this second for AI avatars, AI clones, voice translation, and talking-head style content.',
          stepLabel: 'Step 2',
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
        type: 'image',
        id: 'bright-harbor-commercial',
        eyebrow: 'Example Commercial',
        title: 'This commercial was created by Helix in two hours',
        imageSrc: '/events/ai-avatar-content-creation/symbol.jpg',
        imageAlt: 'Bright Harbor AI commercial example created by Helix',
        videoSrc: '/events/ai-avatar-content-creation/bright-harbor-video-email.mp4',
        caption: 'A fast production example of the kind of commercial direction this workshop is built around.',
      },
      {
        type: 'quoteCard',
        id: 'fitness-influencer-ad',
        quote:
          'You do NOT need more motivation.\nYou need systems.\nI stopped trying to “feel inspired” every day and built routines that work even when I don’t feel like showing up.\nThat’s when everything changed.\nBody. Energy. Confidence. Discipline.',
        name: 'AI Fitness Ad Influencer',
        imageSrc: '/events/ai-avatar-content-creation/symbol.jpg',
        imageAlt: 'AI filmmaking symbol with director chair and film reels',
        videoSrc: '/events/ai-avatar-content-creation/ai-fitness-ad-influencer.mp4',
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
        type: 'quoteCard',
        id: 'creator-content-ad',
        quote:
          'I used to spend DAYS making content.\nNow I can create a week’s worth in one afternoon with AI.\nScripts, visuals, voiceovers, editing — all streamlined.\nThe crazy part?\nMost people still can’t tell what’s AI and what isn’t.\nIf you’re a creator, coach, or business owner and you’re not learning these tools right now… you’re already behind.',
        name: 'AI Health Coach',
        imageSrc: '/events/ai-avatar-content-creation/workstation.jpg',
        imageAlt: 'AI content creation workstation with visual assets in motion',
        videoSrc: '/events/ai-avatar-content-creation/ai-health-coach.mp4',
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
        type: 'hosts',
        id: 'hosts',
        eyebrow: 'Facilitating Team',
        title: 'Joe and Helix',
        intro: '',
        hosts: [],
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
