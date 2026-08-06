import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export type EventHost = {
  name: string
  firstName: string
  role: string
  photoSrc: string
  bio: string[]
  bioHtml?: string[]
  hideBestsellerBadge?: boolean
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
  heroNoOverlay?: boolean
  heroObjectFit?: 'cover' | 'contain'
  heroVideoSrc?: string
  heroVideoPoster?: string
  zoomLink?: string
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
  video?: {
    youtubeEmbedId: string
    eyebrow?: string
    title?: string
    caption?: string
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
  calendarEvent?: {
    startIso: string
    endIso: string
    googleCalendarEventId?: string
  }
  registrationClosesIso?: string
  capacity?: number
  manuallyClosed?: boolean
  // Post-checkout copy for the success modal. Without this an event falls back
  // to the generic paid-event line about setting up two free accounts, which is
  // wrong for any event that has no setup items.
  successDetail?: string
  // Opt-in per event. Events without this collect name and email only, so
  // adding a field here never changes the form on any other event.
  intakeFields?: {
    whatsappNumber?: boolean
    businessContext?: boolean
    businessContextLabel?: string
    businessContextPlaceholder?: string
  }
  emailConfig?: {
    headerLabel?: string | null
    detailsLabel?: string
    contactName?: string
    contactWhatsAppLink?: string
    contactWhatsAppDisplay?: string
    mapsUrl?: string
    skipSetupInstructions?: boolean
    signatureName?: string
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

export function getEventDiscountedPrice(event: EventDefinition, promo?: EventPromoCode | null) {
  return getDiscountedPrice(event.pricing.fullPrice, promo ?? undefined)
}

export function resolvePromoCode(event: EventDefinition, promoCode?: string | null) {
  const normalized = promoCode?.trim().toUpperCase()
  if (!normalized) return null
  return event.pricing.promoCodes?.find((promo) => promo.code.toUpperCase() === normalized) ?? null
}

export function formatEventPrice(event: EventDefinition, promo?: EventPromoCode) {
  const value = getEventDiscountedPrice(event, promo)
  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(2)
  return `${event.pricing.currencySymbol}${rounded}`
}

export const events: EventDefinition[] = [
  {
    slug: 'connection-dinner-canggu',
    status: 'live',
    title: "Joe Che's VIP Connection Dinner",
    shortTitle: 'VIP Connection Dinner',
    eyebrow: 'Monthly Gathering',
    summary: 'A monthly dinner for entrepreneurs, founders, and people doing interesting things in Canggu.',
    description:
      'Once a month I bring together a small room of people I find genuinely interesting for dinner at Mostly in Pererenan. Real conversation over really good food.',
    ctaLabel: 'Save Your Seat',
    dateLabel: 'Wednesday, May 27, 2026',
    timeLabel: '6:00 PM',
    locationLabel: 'Mostly Restaurant, Pererenan, Canggu',
    durationLabel: 'Your Reserved Seat',
    heroImage: '/events/connection-dinner-canggu/venue-room.jpg',
    heroAlt: "Joe Che's VIP Connection Dinner at Mostly Restaurant",
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
        photoSrc: '/images/events/joe-che-bio-bw.jpg',
        bio: [
          'Joe Che is a number one bestselling author in three categories across business and AI, the founder of 26 companies, and the builder of two AI companies, including All Sorted AI, a practical AI operating system for service-based small business owners.',
          'He previously built the largest software and business training company in New York City, where he trained more than 90,000 people, including Fortune 5 executives, the CIA, Microsoft, and Tyra Banks.',
          'Today, Joe mentors entrepreneurs inside his Business Automation Mastermind and helps founders use AI to create cleaner operations, stronger offers, faster execution, and more freedom.',
          'He demos his own AI operating system live and shows people how to use the 165 AI agents from his bestselling book in their own businesses.',
          'He built All Sorted, a plug and play AI operating system he installs for businesses, pre-built with 157 agents covering social media strategy, payments, finances, bookkeeping, research, lead generation and outreach, and content creation.',
        ],
      },
    ],
    calendarEvent: {
      startIso: '2026-05-27T18:00:00+08:00',
      endIso: '2026-05-27T21:00:00+08:00',
      googleCalendarEventId: '0gu029anp7kbu1ljvi6chvic1g',
    },
    capacity: 24,
    manuallyClosed: true,
    emailConfig: {
      headerLabel: null,
      detailsLabel: 'Event Details',
      contactName: 'Joe Che',
      contactWhatsAppLink: 'https://wa.me/16462304209',
      contactWhatsAppDisplay: '(646) 230-4209',
      mapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Mostly+Restaurant+Jl.+Pantai+Pererenan+No.114+Pererenan+Mengwi+Bali',
      skipSetupInstructions: true,
      signatureName: 'Joe Che',
    },
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
        type: 'html',
        id: 'invite',
        eyebrow: "You're Invited",
        html: `
          <div class="not-prose">
            <h2 class="text-[2.8rem] font-extrabold leading-[1.0] tracking-tight text-[#FCF4EB] md:text-[3.5rem] mb-5">A monthly dinner.</h2>
            <p class="text-[1.25rem] font-semibold text-[#FCF4EB]/85 mb-7 leading-relaxed">Just dinner and real connection conversations.</p>
            <p class="text-base leading-8 text-[#FCF4EB]/68 mb-4">Once a month I bring together a small room of people I find genuinely interesting for dinner at Mostly in Pererenan. Entrepreneurs, founders, builders. Some artists. A few people working on things I have not seen before.</p>
            <p class="text-base leading-8 text-[#FCF4EB]/68">We start at 6 PM and close the doors at 6:30 so we can stay present with each other for the evening. The food is good. The people are better.</p>
          </div>
        `,
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
      title: "Joe Che's VIP Connection Dinner, May 27, 2026",
      description:
        'A monthly dinner for entrepreneurs, founders, and people doing interesting things in Canggu. Donations go to PKP Community Centre.',
    },
  },
  {
    slug: 'ubud-connection-brunch',
    status: 'live',
    title: 'Ubud Connection Brunch',
    shortTitle: 'Ubud Connection Brunch',
    eyebrow: 'First Sunday Gathering',
    summary: 'A casual Connection Sunday brunch hosted by Joe Che & Alla. Come as you are, meet new friends and old.',
    description:
      'A relaxed brunch at G-Dos Eden in Ubud, right after Ecstatic Dance. We have a big table. Show up as you are and connect over good food and real conversation.',
    ctaLabel: 'Save Your Spot',
    dateLabel: 'Sunday, July 26, 2026',
    timeLabel: '2:00 PM to 4:00 PM',
    locationLabel: 'G-Dos Eden, Ubud',
    durationLabel: 'Your Spot at the Table',
    heroImage: '/events/ubud-connection-brunch/hero.jpg',
    heroAlt: 'Joe Che, Alla and the Bali community gathered at G-Dos Eden, Ubud',
    heroNoOverlay: true,
    badge: 'This Sunday',
    audience: [
      'Entrepreneurs',
      'Founders',
      'Creators',
      'Remote workers',
      'Coaches',
      'Change-makers',
    ],
    outcomes: [
      'Real conversations with people doing interesting things',
      'A big table, not a random networking event',
      'New friends and old',
      'A relaxed Sunday afternoon in Ubud',
    ],
    hosts: [
      {
        name: 'Joe Che',
        firstName: 'Joe',
        role: 'Founder • AI Entrepreneur • Community Builder',
        photoSrc: '/images/events/joe-che-bio-bw.jpg',
        bio: [
          'Joe Che is a number one bestselling author in three categories across business and AI, the founder of 26 companies, and the builder of two AI companies, including All Sorted AI, a practical AI operating system for service-based small business owners.',
          'He previously built the largest software and business training company in New York City, where he trained more than 90,000 people, including Fortune 5 executives, the CIA, Microsoft, and Tyra Banks.',
          'Today, Joe mentors entrepreneurs inside his Business Automation Mastermind and helps founders use AI to create cleaner operations, stronger offers, faster execution, and more freedom.',
        ],
        bioHtml: [
          'Joe Che is a number one bestselling author in three categories across business and AI, the founder of 26 companies, and the builder of two AI companies, including All Sorted AI, a practical AI operating system for service-based small business owners.',
          'He previously built the largest software and business training company in New York City, where he trained more than 90,000 people, including Fortune 5 executives, the CIA, Microsoft, and Tyra Banks.',
          'Today, Joe mentors entrepreneurs inside his <a href="https://www.mastermindshq.business/?ref=brunch-bio" target="_blank" rel="noopener" style="text-decoration:underline;color:#CFC6F0;">Business Automation Mastermind</a> and helps founders use AI to create cleaner operations, stronger offers, faster execution, and more freedom.',
        ],
      },
      {
        name: 'Alla Demutska',
        firstName: 'Alla',
        role: 'Co-host • Clinical Psychologist • Dancer',
        photoSrc: '/images/events/alla-demutska.jpg',
        hideBestsellerBadge: true,
        bio: [
          'Alla is a clinical psychologist with a doctorate from Monash University and more than 15 years guiding people through trauma recovery, emotional healing, and deeper connection across Singapore, Hong Kong, and Australia.',
          'When she is not holding space for growth, she is usually dancing. Contact improv, zouk, and ecstatic dance are her happy places.',
          'Alla co-hosts the Ubud gatherings with Joe and brings the warmth that makes the table feel like home.',
        ],
      },
    ],
    calendarEvent: {
      startIso: '2026-07-26T14:00:00+08:00',
      endIso: '2026-07-26T16:00:00+08:00',
    },
    capacity: 24,
    emailConfig: {
      headerLabel: null,
      detailsLabel: 'Event Details',
      contactName: 'Joe Che',
      contactWhatsAppLink: 'https://wa.me/16462304209',
      contactWhatsAppDisplay: '(646) 230-4209',
      mapsUrl: 'https://maps.google.com/?cid=13346073993895221884',
      skipSetupInstructions: true,
      signatureName: 'Joe Che',
    },
    pricing: {
      currencySymbol: '$',
      fullPrice: 0,
      checkoutHref: '',
      checkoutNote: 'Your donation goes directly to PKP Community Centre.',
      donationMode: true,
      minDonation: 0,
    },
    privateLocationReminder: {
      eventStartIso: '2026-07-26T14:00:00+08:00',
      leadHours: 4,
      exactAddress: 'G-Dos Eden (The Bali Eden), Jl. Cempaka, Banjar Kumbuh, Mas, Kecamatan Ubud, Gianyar, Bali 80571',
      googleMapsUrl: 'https://maps.google.com/?cid=13346073993895221884',
      parkingInstructions: [
        'We start at 2:00 PM, right after Ecstatic Dance.',
        'G-Dos Eden is in Mas, just south of central Ubud.',
      ],
    },
    postPurchase: {
      setupPageTitle: 'You\'re confirmed for the brunch.',
      setupPageIntro: 'We\'ll send you the exact address closer to the date.',
      setupPageBody: [
        'The brunch is at G-Dos Eden, Ubud, from 2:00 PM to 4:00 PM. Come as you are.',
        'You will receive a reminder email with the address before the brunch. See you at the table.',
      ],
      setupItems: [],
    },
    sections: [
      {
        type: 'html',
        id: 'invite',
        eyebrow: "You're Invited",
        html: `
          <div class="not-prose">
            <h2 class="text-[2.8rem] font-extrabold leading-[1.0] tracking-tight text-[#FCF4EB] md:text-[3.5rem] mb-5">A Sunday brunch.</h2>
            <p class="text-[1.25rem] font-semibold text-[#FCF4EB]/85 mb-7 leading-relaxed">Come as you are. Meet new friends and old.</p>
            <p class="text-base leading-8 text-[#FCF4EB]/68 mb-4">We gather at G-Dos Eden in Ubud, right after Ecstatic Dance, for a relaxed brunch and real conversation. Entrepreneurs, founders, builders, and interesting people doing interesting things.</p>
            <p class="text-base leading-8 text-[#FCF4EB]/68">We have a big table. No dress code, no agenda. Just good food and good people. 2:00 PM to 4:00 PM.</p>
          </div>
        `,
      },
      {
        type: 'html',
        id: 'mid-cta',
        html: `
          <div class="not-prose text-center py-2">
            <a href="#register" class="copy-button-glass copy-button-primary inline-flex min-w-[220px] items-center justify-center rounded-xl px-6 py-4 text-base font-semibold no-underline">
              Save Your Spot
            </a>
          </div>
        `,
      },
      {
        type: 'split',
        id: 'pkp',
        eyebrow: '100% of Donations Go To PKP',
        title: 'Supporting PKP Community Centre',
        body: [
          'The brunch is free to attend. If you would like to give, every dollar goes directly to PKP Community Centre. You decide what feels right, even if that is nothing at all.',
        ],
        imageSrc: '/events/connection-dinner-canggu/pkp-catering.jpg',
        imageAlt: 'PKP Community Centre women, Bali',
        caption: 'PKP Community Centre, Bali — pkpcommunitycentre.org',
      },
      {
        type: 'hosts',
        id: 'hosts',
        eyebrow: 'Hosted By',
        title: 'Joe Che and Alla',
        intro: '',
        hosts: [],
      },
    ],
    metadata: {
      title: 'Ubud Connection Brunch, July 26, 2026',
      description:
        'A casual Sunday brunch for entrepreneurs, founders, and interesting people in Ubud. Free to attend. Donations go to PKP Community Centre.',
    },
  },
  {
    slug: 'ai-avatar-content-creation',
    status: 'live',
    title: 'AI Content Creation Lab',
    shortTitle: 'AI Content Lab',
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
    heroAlt: 'AI Content Creation Lab flyer',
    heroVideoSrc: '/events/ai-avatar-content-creation/ai-content-creation-v2.mp4',
    heroVideoPoster: '/events/ai-avatar-content-creation/ai-content-creation-v2-poster-48s.jpg',
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
          'Joe Che is a number one bestselling author in three categories across business and AI, the founder of 26 companies, and the builder of two AI companies, including All Sorted AI, a practical AI operating system for service-based small business owners.',
          'He previously built the largest software and business training company in New York City, where he trained more than 90,000 people, including Fortune 5 executives, the CIA, Microsoft, and Tyra Banks.',
          'Today, Joe mentors entrepreneurs inside his Business Automation Mastermind and helps founders use AI to create cleaner operations, stronger offers, faster execution, and more freedom.',
          'He demos his own AI operating system live and shows people how to use the 165 AI agents from his bestselling book in their own businesses.',
          'He built All Sorted, a plug and play AI operating system he installs for businesses, pre-built with 157 agents covering social media strategy, payments, finances, bookkeeping, research, lead generation and outreach, and content creation.',
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
        {
          code: 'UF',
          label: 'UF 20',
          description: 'Save 20% with UF.',
          percentOff: 20,
        },
        {
          code: 'MARINA',
          label: 'Marina',
          description: 'Save 10% with Marina.',
          percentOff: 10,
        },
      ],
    },
    calendarEvent: {
      startIso: '2026-05-30T10:30:00+08:00',
      endIso: '2026-05-30T17:00:00+08:00',
      googleCalendarEventId: 'tgq3bqi8jfsa0itg7l74e8iev8',
    },
    registrationClosesIso: '2026-05-30T10:15:00+08:00',
    legacyRegistration: {
      eventId: '9YGs4u',
      eventDate: '2026-05-30',
      fallbackTicketId: 'wab8lo',
    },
    privateLocationReminder: {
      eventStartIso: '2026-05-30T10:30:00+08:00',
      leadHours: 4,
      exactAddress:
        'Happy Days Villa 1, Jalan Pura Gede Batur, Pererenan, Mengwi, Kabupaten Badung, Bali 80351, Indonesia',
      googleMapsUrl:
        'https://maps.app.goo.gl/auASnDX9wmS96a1n9',
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
        type: 'quoteCard',
        id: 'fitness-influencer-ad',
        quote:
          'You do NOT need more motivation.\nYou need systems.\nI stopped trying to “feel inspired” every day and built routines that work even when I don’t feel like showing up.\nThat’s when everything changed.\nBody. Energy. Confidence. Discipline.',
        name: 'AI Fitness Ad Influencer',
        imageSrc: '/events/ai-avatar-content-creation/symbol.jpg',
        imageAlt: 'AI filmmaking symbol with director chair and film reels',
        videoSrc: 'https://media.mastermindshq.business/events/ai-avatar-content-creation/ai-fitness-ad-influencer.mp4',
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
        videoSrc: 'https://media.mastermindshq.business/events/ai-avatar-content-creation/ai-health-coach.mp4',
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
      title: 'AI Content Creation Lab',
      description:
        'A cinematic AI content workshop in Bali with Joe Che and Helix Wolfson. Learn avatars, AI video, hooks, and repeatable content systems.',
    },
  },
  {
    slug: 'stop-sounding-like-everyone-else',
    status: 'live',
    title: 'Stop Sounding Like Everyone Else While Using AI',
    shortTitle: 'Sound Like You, Not AI',
    eyebrow: 'Free Live Workshop',
    summary:
      'A free 90 minute live session with Joe Che. Build your own voice profile from writing you have already done, install the free tool that strips AI patterns out of your drafts, then 45 minutes of open Q&A on anything AI. The room stays open after for anyone who wants to keep going.',
    description:
      'A live online workshop where Joe walks you through building a voice profile and installing Speak Human, then answers your AI questions live.',
    dateLabel: 'Tuesday, August 4, 2026',
    timeLabel: '5:00 PM to 6:30 PM Singapore time',
    locationLabel: 'Free online workshop',
    durationLabel: '90 minutes, and the room stays open after',
    heroImage: '/images/events/stop-sounding-like-everyone-else-hero.jpg',
    heroAlt: 'Joe Che beside the workshop title, Stop Sounding Like Everyone Else While Using AI',
    // Never put a gradient scrim over event artwork. Joe's rule, 2026-08-02.
    heroNoOverlay: true,
    successDetail:
      'You are in. Your confirmation email has the Zoom link, and a calendar invite is on its way. It comes from joe@mastermindshq.business. If you do not see it within a couple of minutes, check your spam folder and add that address to your contacts so the reminders reach you too.',
    // Free registration still collects a WhatsApp number and a business
    // description. Free does not mean anonymous: we need a way to reach people
    // and enough context to pre-qualify them.
    intakeFields: {
      whatsappNumber: true,
      businessContext: true,
      businessContextLabel:
        "Tell us a little about your business and what you're working on.",
      businessContextPlaceholder:
        "What you do, what you're building, and anything you are curious about with AI.",
    },
    zoomLink: 'https://us02web.zoom.us/j/81275409884?pwd=lWpaRasSci7h7YHesIhRM2HlTbzVFA.1',
    ctaLabel: 'Register Free',
    audience: [
      'Coaches and consultants building a personal brand',
      'Founders whose content sounds nothing like them',
      'Anyone drowning in manual content work',
      'People who want their AI questions answered live',
    ],
    outcomes: [
      'Your own voice profile, built from writing you already have',
      'Speak Human installed and running on your real content',
      'A repeatable way to turn one recording into a week of content',
      'Straight answers to the AI questions you have been sitting on',
    ],
    hosts: [
      {
        name: 'Joe Che',
        firstName: 'Joe',
        role: 'Author • Founder • AI Business Mentor',
        photoSrc: '/images/events/joe-che-bio-bw.jpg',
        bio: [
          'Joe Che is the author of How to Build Your Own AI Agent Operating System, which hit number one in three categories across business and AI. Over 30 years he has founded 26 companies, and he now builds two AI companies, including All Sorted AI, a practical AI operating system for service based small business owners.',
          'He previously built the largest software and business training company in New York City, where he trained more than 90,000 people, including Fortune 5 executives, the CIA, Microsoft, and Tyra Banks.',
          'Today Joe mentors entrepreneurs inside his AI Business Mastermind and helps founders use AI to create cleaner operations, stronger offers, faster execution, and more freedom. He demos his own AI operating system live and shows people how to use the 165 AI agents from the book in their own businesses.',
        ],
        bioHtml: [
          'Joe Che is the author of <a href="https://a.mastermindshq.business/ai-os-kindle" target="_blank" rel="noopener noreferrer" class="text-[#BDB3E8] underline underline-offset-4 hover:text-[#FCF4EB]">How to Build Your Own AI Agent Operating System</a>, which hit number one in three categories across business and AI. Over 30 years he has founded 26 companies, and he now builds two AI companies, including All Sorted AI, a practical AI operating system for service based small business owners.',
          'He previously built the largest software and business training company in New York City, where he trained more than 90,000 people, including Fortune 5 executives, the CIA, Microsoft, and Tyra Banks.',
          'Today Joe mentors entrepreneurs inside his <a href="https://mastermindshq.business" target="_blank" rel="noopener noreferrer" class="text-[#BDB3E8] underline underline-offset-4 hover:text-[#FCF4EB]">AI Business Mastermind</a> and helps founders use AI to create cleaner operations, stronger offers, faster execution, and more freedom.',
        ],
      },
    ],
    pricing: {
      currencySymbol: '$',
      fullPrice: 0,
      checkoutHref: '',
      checkoutNote: 'Free registration. The Zoom link will be emailed right after you sign up.',
    },
    calendarEvent: {
      startIso: '2026-08-04T17:00:00+08:00',
      endIso: '2026-08-04T18:30:00+08:00',
    },
    // Who hosts this event. Without it the confirmation email has no contact
    // block at all, which is the safe default. Never leave it to inherit.
    emailConfig: {
      contactName: 'Joe Che',
      contactWhatsAppLink: 'https://wa.me/16462092333',
      contactWhatsAppDisplay: '+1 (646) 209-2333',
      signatureName: 'Joe Che\nMasterminds HQ',
    },
    sections: [
      {
        type: 'html',
        id: 'about',
        eyebrow: 'What This Is',
        html: `
          <div class="not-prose space-y-5">
            <h2 class="event-gradient-title pt-2 text-[2rem] font-extrabold leading-[1.02] tracking-tight text-[#FCF4EB] md:text-[2.6rem]">
              Why does everything AI writes for me sound like everyone else?
            </h2>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              You are excellent at what you do. Your content does not sound like it, because AI wrote it and AI has no idea who you are. That is why it reads as forced and generic. It was never yours.
            </p>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              Joe will walk you through Speak Human, the free tool he built to strip AI patterns out of writing and put your own voice back in. You will build your voice profile from writing you have already done, install the tool, and watch it run on real content, live.
            </p>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              Then the floor is open for 45 minutes. Bring every question you have been sitting on about content, repurposing, outreach, websites, any of it. Joe teaches this to founders every week inside his <a href="https://mastermindshq.business" target="_blank" rel="noopener noreferrer" class="text-[#BDB3E8] underline underline-offset-4 transition hover:text-[#FCF4EB]">AI Business Mastermind</a>, and this is the part he is best at.
            </p>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              The session runs 90 minutes. The room stays open after that, so if you want to keep going, stay on.
            </p>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              You will leave with your voice profile built and the tool installed, not a list of apps to go look at later.
            </p>
          </div>
        `,
      },
      {
        type: 'html',
        id: 'bring',
        eyebrow: 'What To Bring',
        html: `
          <div class="not-prose space-y-5">
            <h2 class="event-gradient-title pt-2 text-[2rem] font-extrabold leading-[1.02] tracking-tight text-[#FCF4EB] md:text-[2.6rem]">
              Two things, so you leave with it finished
            </h2>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              <strong class="text-[#FCF4EB]">A Claude Code or OpenAI Pro subscription</strong>, if you want to install and use the tool during the session. Everything is shown on screen either way, but you will need one of these to follow along hands on.
            </p>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              <strong class="text-[#FCF4EB]">Some of your own writing, ready to go.</strong> Podcast transcripts, chapters from a book, emails you have sent, posts you have written, anything with your real voice in it. Your voice profile gets built from your own material during the session, so bringing it means you leave with a finished one instead of homework.
            </p>
          </div>
        `,
      },
      {
        type: 'hosts',
        id: 'bio',
        eyebrow: 'Bio',
        title: 'Joe Che',
        intro: 'Author • Founder • AI Business Mentor',
        hosts: [],
      },
    ],
    metadata: {
      title: 'Stop Sounding Like Everyone Else While Using AI',
      description:
        'A free 90 minute live session with Joe Che. Build your voice profile, install Speak Human, then 45 minutes of open Q&A on anything AI.',
    },
  },
  {
    slug: 'ask-an-ai-expert',
    status: 'live',
    title: 'How to Get AI Making You More Sales and Less Busy Work',
    shortTitle: 'More Sales, Less Busy Work',
    eyebrow: 'Free Live Workshop',
    summary:
      'A free two-hour live session with Joe Che. Bring your business and your questions, get answers on the spot, and watch real businesses get AI working on their sales and their busywork right in front of you.',
    description:
      'A live online workshop where Joe answers real questions, looks at real businesses, and shows practical ways to get AI working on sales and busywork.',
    dateLabel: 'Wednesday, July 29, 2026',
    timeLabel: '7:00 PM to 9:00 PM Asia/Makassar (Bali)',
    locationLabel: 'Free online workshop',
    durationLabel: '90-minute AI business Q&A plus 30-minute bonus round',
    heroImage: '/images/events/ask-an-ai-expert-hero.jpg',
    heroAlt: 'Feet up on a beach lounger with a laptop showing sales climbing',
    heroNoOverlay: true,
    zoomLink: 'https://us02web.zoom.us/j/81275409884?pwd=lWpaRasSci7h7YHesIhRM2HlTbzVFA.1',
    ctaLabel: 'Register Free',
    audience: [
      'Owners who want more sales',
      'Operators who want less busywork',
      'Founders who want practical AI answers',
      'People who want live hot-seat feedback',
    ],
    outcomes: [
      'Clear next steps for using AI in your actual business',
      'Ideas for turning AI into more sales and less manual work',
      'A chance to get your business looked at live',
      'A simple way to think about your own AI operating system',
    ],
    hosts: [
      {
        name: 'Joe Che',
        firstName: 'Joe',
        role: 'Founder • AI Entrepreneur • Community Builder',
        photoSrc: '/images/events/joe-che-bio-bw.jpg',
        bio: [
          'Joe Che is a number one bestselling author in three categories across business and AI, the founder of 26 companies, and the builder of two AI companies, including All Sorted AI, a practical AI operating system for service-based small business owners.',
          'He previously built the largest software and business training company in New York City, where he trained more than 90,000 people, including Fortune 5 executives, the CIA, Microsoft, and Tyra Banks.',
          'Today, Joe mentors entrepreneurs inside his Business Automation Mastermind and helps founders use AI to create cleaner operations, stronger offers, faster execution, and more freedom.',
          'He demos his own AI operating system live and shows people how to use the 165 AI agents from his bestselling book in their own businesses.',
          'He built All Sorted, a plug and play AI operating system he installs for businesses, pre-built with 157 agents covering social media strategy, payments, finances, bookkeeping, research, lead generation and outreach, and content creation.',
        ],
        bioHtml: [
          'Joe Che is a number one bestselling author in three categories across business and AI, the founder of 26 companies, and the builder of two AI companies, including All Sorted AI, a practical AI operating system for service-based small business owners.',
          'He previously built the largest software and business training company in New York City, where he trained more than 90,000 people, including Fortune 5 executives, the CIA, Microsoft, and Tyra Banks.',
          'Today, Joe mentors entrepreneurs inside his <a href="https://mastermindshq.business" target="_blank" rel="noopener noreferrer" class="text-[#BDB3E8] underline underline-offset-4 hover:text-[#FCF4EB]">Business Automation Mastermind</a> and helps founders use AI to create cleaner operations, stronger offers, faster execution, and more freedom. He also wrote <a href="https://a.mastermindshq.business/ai-os-kindle" target="_blank" rel="noopener noreferrer" class="text-[#BDB3E8] underline underline-offset-4 hover:text-[#FCF4EB]">his number one bestselling book on AI operating systems</a>.',
        ],
      },
    ],
    pricing: {
      currencySymbol: '$',
      fullPrice: 0,
      checkoutHref: '',
      checkoutNote: 'Free registration. The Zoom link will be emailed right after you sign up.',
    },
    calendarEvent: {
      startIso: '2026-07-29T19:00:00+08:00',
      endIso: '2026-07-29T21:00:00+08:00',
    },
    sections: [
      {
        type: 'html',
        id: 'about',
        eyebrow: 'What This Is',
        html: `
          <div class="not-prose space-y-5">
            <h2 class="event-gradient-title pt-2 text-[2rem] font-extrabold leading-[1.02] tracking-tight text-[#FCF4EB] md:text-[2.6rem]">
              How do I get AI to make me more money?
            </h2>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              This is a live online workshop where Joe answers real questions, looks at real businesses, and shows practical ways to get AI working on sales and busywork.
            </p>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              Joe teaches business owners to do this every day in his <a href="https://mastermindshq.business" target="_blank" rel="noopener noreferrer" class="text-[#BDB3E8] underline underline-offset-4 transition hover:text-[#FCF4EB]">AI Business Mastermind</a>. Three cohorts have run so far and all three filled. The people in them are not techies. They are coaches, artists, therapists, and consultants who now have websites they built themselves, honed their messages through branding and marketing agents, billing automations, business dashboards, tracking everything about the business, and the pattern across all of them is the same: more sales coming in, less time spent on the work that used to eat their week. <a href="https://mastermindshq.business" target="_blank" rel="noopener noreferrer" class="text-[#BDB3E8] underline underline-offset-4 transition hover:text-[#FCF4EB]">Cohort 4 starts August 10</a> and is the one currently open.
            </p>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              For 90 minutes, Joe takes that question in every form, live. He pulls people into hot seats so everyone can look at a real business together and find the fastest ways AI can bring in sales and hand back time. When one person gets unstuck, everyone learns from it.
            </p>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              Joe will also be available to demo his AI operating system and give examples of how to use some of the 165 AI agents from his bestselling book.
            </p>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              He has also built All Sorted, a full plug and play AI operating system he has been installing for businesses. It comes pre-built with 157 agents that handle social media strategy, payments, finances and analysis, automated bookkeeping, research, lead generation and outreach, and video and content creation.
            </p>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              It is free. Save your seat below.
            </p>
          </div>
        `,
      },
      {
        type: 'hosts',
        id: 'bio',
        eyebrow: 'Bio',
        title: 'Joe Che',
        intro: 'Founder • AI Entrepreneur • Community Builder',
        hosts: [],
      },
    ],
    metadata: {
      title: 'How to Get AI Making You More Sales and Less Busy Work',
      description:
        'A free two-hour live session with Joe Che. Bring your business and your questions, get answers on the spot, and watch real businesses get AI working on their sales and their busywork right in front of you.',
    },
  },
  {
    slug: 'business-blocks-ai-solved',
    status: 'live',
    title: 'The Biggest Business Blocks That AI Solved For Me',
    shortTitle: 'Business Blocks AI Solved',
    eyebrow: 'Live Workshop',
    summary:
      'A raw, practical Bali session hosted by Marina Choueri, featuring Joe Che on what AI actually removed from his business this year.',
    description:
      'A live workshop in Canggu where Joe Che shows what actually changed in his business this year, and the real AI systems behind it.',
    ctaLabel: 'Reserve Your Seat',
    dateLabel: 'Friday, August 7, 2026',
    timeLabel: '3:00 PM to 6:00 PM',
    locationLabel: 'Near La Brisa, Canggu, Bali',
    durationLabel: 'A 3-hour live session',
    heroImage: '/events/business-blocks-ai-solved/poster.png',
    heroAlt: 'The Biggest Business Blocks That AI Solved For Me, featuring Joe Che, Friday August 7, 3 to 6 PM',
    heroObjectFit: 'contain',
    heroNoOverlay: true,
    badge: 'Limited Spots',
    audience: [
      'Entrepreneurs',
      'Founders',
      'Coaches',
      'Neurodivergent operators',
      'People stuck in perfectionism',
      'Anyone launching something new',
    ],
    outcomes: [
      'Clarity over overwhelm',
      'Time back in your day',
      'Better decisions, faster',
      'A stronger team and systems',
      'More profit, less stress',
    ],
    hosts: [
      {
        name: 'Joe Che',
        firstName: 'Joe',
        role: 'Founder • AI Entrepreneur and Educator • Community Builder',
        photoSrc: '/images/events/joe-che-bio-bw.jpg',
        bio: [
          'Joe Che is a number one bestselling author in three categories across business and AI, the founder of 26 companies, and the builder of two AI companies, including All Sorted AI, a practical AI operating system for service-based small business owners.',
          'He previously built the largest software and business training company in New York City, where he trained more than 90,000 people, including Fortune 5 executives, the CIA, Microsoft, and Tyra Banks.',
          'Today, Joe mentors entrepreneurs inside his AI Business Mastermind and helps founders use AI to create cleaner operations, stronger offers, faster execution, and more freedom.',
        ],
        bioHtml: [
          'Joe Che is a number one bestselling author in three categories across business and AI, the founder of 26 companies, and the builder of two AI companies, including All Sorted AI, a practical AI operating system for service-based small business owners.',
          'He previously built the largest software and business training company in New York City, where he trained more than 90,000 people, including Fortune 5 executives, the CIA, Microsoft, and Tyra Banks.',
          'Today, Joe mentors entrepreneurs inside his <a href="https://mastermindshq.business" target="_blank" rel="noopener noreferrer" class="text-[#BDB3E8] underline underline-offset-4 hover:text-[#FCF4EB]">AI Business Mastermind</a> and helps founders use AI to create cleaner operations, stronger offers, faster execution, and more freedom.',
        ],
      },
      {
        name: 'Marina Choueri',
        firstName: 'Marina',
        role: 'Host • Super-Connector • Event Producer',
        photoSrc: '/mastermind-participants/marina--jaubert.jpg',
        hideBestsellerBadge: true,
        bio: [
          'Marina Choueri is known across Bali and Dubai as a true super-connector, the person who brings the right people into the same room.',
          'She went through Joe\'s AI Business Mastermind herself and came out with Magenta, an always-on AI co-founder that takes her voice notes, a personalized content studio, and her own brand book.',
          'Marina is hosting this session because she has lived the shift firsthand and wants her network to see it too.',
        ],
      },
    ],
    pricing: {
      currencySymbol: '$',
      fullPrice: 22,
      checkoutHref: '',
      checkoutNote: 'The exact venue address is emailed to registered guests the day before the event.',
      promoCodes: [
        {
          // Internal end-to-end test code. 95% lands at $1.10, deliberately
          // above Stripe's $0.50 floor. The usual Guest99 does NOT work on a
          // $22 ticket: 99% off is $0.22, which toStripeUnitAmount rejects.
          // A 100% code would be worse for testing, since a $0 total skips
          // Stripe entirely and never exercises the paid path.
          code: 'JOETEST',
          label: 'Internal test',
          description: 'Internal checkout test.',
          percentOff: 95,
        },
        {
          // Comped seats (Marina's guests, speakers, anyone Joe waves through).
          // 100% is correct here because the goal is a free seat, not a test:
          // this deliberately takes the no-Stripe path.
          code: 'GUESTOFMARINA',
          label: 'Guest of Marina',
          description: 'Complimentary seat.',
          percentOff: 100,
        },
      ],
    },
    calendarEvent: {
      startIso: '2026-08-07T15:00:00+08:00',
      endIso: '2026-08-07T18:00:00+08:00',
    },
    capacity: 40,
    successDetail:
      'Your seat is confirmed. Check your inbox for the confirmation email, and I will send the exact address the day before the workshop.',
    intakeFields: {
      whatsappNumber: true,
      businessContext: true,
    },
    emailConfig: {
      headerLabel: null,
      detailsLabel: 'Event Details',
      // Marina is hosting, so attendee questions go to her rather than Joe. The
      // signature below stays Joe Che: he is still the one presenting.
      contactName: 'Marina',
      contactWhatsAppLink: 'https://wa.me/6282146079766',
      contactWhatsAppDisplay: '+62 821 4607 9766',
      // Only rendered once the location reveal window opens. See
      // event-confirmation-email.ts, which suppresses it while the venue is private.
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Samm%27s+Farm+Jl.+Canggu+Padang+Linjong+No.58+Canggu+Bali",
      skipSetupInstructions: true,
      signatureName: 'Joe Che',
    },
    privateLocationReminder: {
      eventStartIso: '2026-08-07T15:00:00+08:00',
      leadHours: 24,
      exactAddress:
        "Samm's Farm, Jl. Canggu Padang Linjong No.58, Canggu, Kec. Kuta Utara, Kabupaten Badung, Bali 80351, Indonesia",
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Samm%27s+Farm+Jl.+Canggu+Padang+Linjong+No.58+Canggu+Bali",
      parkingInstructions: [
        'Doors open at 3:00 PM, we start on time.',
        "Samm's Farm is on Jalan Canggu Padang Linjong, just off the main Canggu strip.",
      ],
    },
    postPurchase: {
      setupPageTitle: "You're confirmed for the workshop.",
      setupPageIntro: "We'll send you the exact address closer to the date.",
      setupPageBody: [
        'The workshop runs 3:00 PM to 6:00 PM on Friday, August 7, in Canggu, Bali.',
        'You will receive a reminder email with the exact address the day before the event. See you there.',
      ],
      setupItems: [],
    },
    sections: [
      {
        type: 'checklist',
        id: 'outcomes',
        eyebrow: 'What You Will Leave With',
        title: 'Real stories, practical tools, bigger results',
        intro: 'This is a working session, not a keynote.',
        items: [
          'Clarity over overwhelm, instead of noise and too many open loops',
          'Time back in your day from automations that save hours every week',
          'Better decisions, faster, backed by data and confidence to move',
          'A stronger team and systems that scale past just you',
          'More profit and less stress, from solving the right blocks first',
        ],
      },
      {
        type: 'html',
        id: 'about',
        eyebrow: 'What This Is',
        html: `
          <div class="not-prose space-y-5">
            <h2 class="event-gradient-title pt-2 text-[2rem] font-extrabold leading-[1.02] tracking-tight text-[#FCF4EB] md:text-[2.6rem]">
              The blocks that used to run my business are gone. Here's what removed them.
            </h2>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              For three hours in Canggu, I'm going to get specific about what actually changed this year. Perfectionism, focus, speed, messaging, the stuff that used to run my week is the stuff I removed with AI, and I'll show you exactly how, live.
            </p>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              This isn't a theory talk. It's the real systems, the agents, the workflows, the decisions behind them, shown so you can take the same approach into your own business.
            </p>
            <p class="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
              It's $22, hosted by Marina at Samm's Farm in Canggu. The exact address goes out to confirmed ticket holders the day before the event. Save your seat below.
            </p>
          </div>
        `,
      },
      {
        type: 'html',
        id: 'mid-cta',
        html: `
          <div class="not-prose text-center py-2">
            <a href="#register" class="copy-button-glass copy-button-primary inline-flex min-w-[220px] items-center justify-center rounded-xl px-6 py-4 text-base font-semibold no-underline">
              Reserve Your Seat
            </a>
          </div>
        `,
      },
      {
        type: 'hosts',
        id: 'hosts',
        eyebrow: 'Hosted By',
        title: 'Joe Che and Marina Choueri',
        intro: '',
        hosts: [],
      },
    ],
    metadata: {
      title: 'The Biggest Business Blocks That AI Solved For Me',
      description:
        'A live workshop in Canggu, Bali hosted by Marina Choueri, featuring Joe Che on what AI actually removed from his business this year.',
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

export function getUpcomingLiveEvents(now: Date = new Date()) {
  return getLiveEvents()
    .filter((event) => {
      const endIso = event.calendarEvent?.endIso ?? event.calendarEvent?.startIso
      if (!endIso) return true
      return new Date(endIso).getTime() >= now.getTime()
    })
    .sort((a, b) => {
      const aStart = a.calendarEvent?.startIso
      const bStart = b.calendarEvent?.startIso
      if (!aStart && !bStart) return 0
      if (!aStart) return 1
      if (!bStart) return -1
      return new Date(aStart).getTime() - new Date(bStart).getTime()
    })
}
