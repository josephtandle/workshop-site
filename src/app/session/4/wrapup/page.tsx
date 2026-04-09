import Link from 'next/link'
import StickyVideoPlayer from '@/components/StickyVideoPlayer'
import ParticipantCarousel from '@/components/ParticipantCarousel'
import Reveal from '@/components/Reveal'
import StaggerList, { StaggerItem } from '@/components/StaggerList'

export const metadata = {
  title: 'Session 4 Wrap-Up: Mastermind Alignment — Masterminds Workshop',
  description: 'Recording, summary, participant wins, and suggested improvements from our first Mastermind Alignment call.',
}

const participants = [
  {
    name: 'Sophia Fox',
    photo: '/participants/sophia-fox.png',
    wins: '55 masterclass signups. Used Claude Code and Wix AI together to build a full email marketing funnel.',
    automate: 'Email marketing funnel, landing page to payment flow, content repurposing for social media.',
    needle: 'Finding ways to target her US and European audience beyond Meta ads, which have been unstable and expensive.',
  },
  {
    name: 'Quincee Lark',
    photo: '/participants/quincee-lark.jpg',
    wins: 'Built an oracle reading corner as an engagement offer. Has a physical product that people love every time they hold it.',
    automate: 'Organic product distribution, giveaway workflows, podcast outreach and guest booking.',
    needle: 'Getting oracle decks into more hands without relying on cold outreach or paid ads.',
  },
  {
    name: 'Aaqib Hasnain',
    photo: '/participants/aaiqb-hasnain.jpg',
    wins: 'Created a sustainable giveaway using stickers and tote bags made from off-cuts, turning waste into a brand touchpoint.',
    automate: 'Customer nurturing and email follow-up sequences, segmentation of high-value customers in Shopify.',
    needle: 'Increasing lifetime value from existing customers instead of chasing cold traffic.',
  },
  {
    name: 'Ronnie Ansara',
    photo: '/participants/ronnie-ansara.JPG',
    wins: 'Nearly three years of growth through word-of-mouth alone, proving strong product-market fit for his concierge business.',
    automate: 'Partner outreach and referral tracking, client onboarding workflows.',
    needle: 'Shifting from word-of-mouth to partner-led acquisition to scale without losing premium positioning.',
  },
  {
    name: 'Daniel Holloway',
    photo: '/participants/daniel-holloway.png',
    wins: 'Identified personalized email outreach as his single biggest needle-mover and has a clear productized service to build from.',
    automate: 'Personalized email outreach at scale, lead research and enrichment.',
    needle: 'Scaling his outreach system while keeping messages personal and relevant to each prospect.',
  },
  {
    name: 'Miia Nern',
    photo: '/participants/miia-nern.jpg',
    wins: 'Grew her Instagram quickly by posting viral content, proving she understands what gets attention.',
    automate: 'Customer journey from free content to paid offer, automated Instagram messages, landing pages, and payment links.',
    needle: 'Attracting dream clients instead of a generic audience. Everything is in progress but nothing is fully connected yet.',
  },
  {
    name: 'Marina Jaubert',
    photo: '/participants/marina--jaubert.jpg',
    wins: 'Actively exploring AI skill agents and looking for ways to integrate automation into her matchmaking business.',
    automate: 'AI-powered client matching, scheduling, and follow-up sequences.',
    needle: 'Using AI skill agents to handle repetitive work so she can focus on high-value personal interactions.',
  },
]

const improvements = [
  {
    title: 'Collecting questions ahead of time',
    description: 'Before each session, we will gather questions from everyone in advance. This means we can prepare better answers, allocate time more effectively, and make sure nobody gets left behind.',
  },
  {
    title: 'Curating hot seat topics',
    description: 'I will pick the two or three most relevant topics for the hot seats to ensure they relate to as many people as possible. This way, even if you are not in the hot seat, you are learning something directly applicable to your business.',
  },
  {
    title: 'Considering two separate masterminds',
    description: 'We are looking at splitting participants into two different masterminds based on business types. This would let us go deeper on the specific challenges each group faces, whether that is physical products, services, digital offers, or creative businesses.',
  },
]

const takeaways = [
  "Don't get stuck in perfectionism on your website and lead magnets.",
  "Now that we have the lead magnets, it's time to start driving people to them.",
  "Creating content is a major time sink. We're going to focus on making better content instead of more content by using AI, repeatable systems for hooks, repurposing, and scheduling.",
  "Meta advertising is fragile (people are getting banned often) and expensive. We're going to explore other traction channels first and save Meta ads for later.",
  "We're preparing to brain dump every conversation we've ever had with AI into one place, so our AI tools know exactly who we are and what we're building.",
]

export default function Session4WrapUp() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-0">
        <nav className="text-sm text-[#FCF4EB]/40 flex items-center gap-2 flex-wrap mb-12">
          <Link href="/" className="hover:text-[#7C69C7] transition-colors">All Sessions</Link>
          <span>/</span>
          <Link href="/session/4" className="hover:text-[#7C69C7] transition-colors">Session 4</Link>
          <span>/</span>
          <span className="text-[#FCF4EB]/60">Wrap-Up</span>
        </nav>

        <div className="relative mb-14">
          <div className="absolute -inset-x-6 -inset-y-4 bg-gradient-to-r from-[#7C69C7]/12 via-[#9D8FE0]/16 to-[#F5C3C6]/10 blur-3xl rounded-full pointer-events-none" />
          <p className="relative text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
            Session Four
          </p>
          <h1 className="relative gradient-text text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            Mastermind Alignment
          </h1>
          <p className="relative text-[#FCF4EB]/60 text-lg leading-relaxed max-w-2xl">
            We shared our wins, identified the tasks we dislike that should be automated, and mapped what would actually move the needle in each of our businesses.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">

        {/* ── Recording ────────────────────────────────────── */}
        <Reveal className="mt-10 mb-16">
          <StickyVideoPlayer videoId="FiBCvP7Y-xw" title="Mastermind Alignment Call" />
        </Reveal>

        <hr className="glow-divider mb-16" />

        {/* ── Key Takeaways ────────────────────────────────── */}
        <section className="mb-16">
          <Reveal>
            <div className="relative mb-8">
              <div className="absolute -inset-x-6 -inset-y-3 bg-gradient-to-r from-[#7C69C7]/10 via-[#9D8FE0]/14 to-[#F5C3C6]/8 blur-2xl rounded-full pointer-events-none" />
              <p className="relative text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">
                From This Session
              </p>
              <h2 className="relative gradient-text text-2xl md:text-3xl font-bold">
                Key Takeaways
              </h2>
            </div>
          </Reveal>

          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 card-hover card-shimmer">
            <StaggerList className="space-y-4">
              {takeaways.map((item, i) => (
                <StaggerItem key={i}>
                  <div className="flex items-start gap-4 group">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center text-[#7C69C7] text-xs font-bold mt-0.5 number-glow">
                      {i + 1}
                    </span>
                    <span className="text-[#FCF4EB]/70 text-sm leading-relaxed">{item}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerList>
          </div>
        </section>

        <hr className="glow-divider mb-16" />

        {/* ── Participant Highlights ────────────────────────── */}
        <section className="mb-16">
          <Reveal>
            <div className="relative mb-8">
              <div className="absolute -inset-x-6 -inset-y-3 bg-gradient-to-r from-[#F5C3C6]/8 via-[#9D8FE0]/14 to-[#7C69C7]/10 blur-2xl rounded-full pointer-events-none" />
              <p className="relative text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">
                The Group
              </p>
              <h2 className="relative gradient-text text-2xl md:text-3xl font-bold mb-2">
                Participant Highlights
              </h2>
              <p className="text-[#FCF4EB]/50 text-sm leading-relaxed">
                Where each member is at, what they want to automate, and what would move the needle.
              </p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <ParticipantCarousel participants={participants} />
          </Reveal>
        </section>

        <hr className="glow-divider mb-16" />

        {/* ── Suggested Improvements ───────────────────────── */}
        <section className="mb-16">
          <Reveal>
            <div className="relative mb-8">
              <div className="absolute -inset-x-6 -inset-y-3 bg-gradient-to-r from-[#7C69C7]/10 via-[#F5C3C6]/12 to-[#9D8FE0]/8 blur-2xl rounded-full pointer-events-none" />
              <p className="relative text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">
                What's Changing
              </p>
              <h2 className="relative gradient-text text-2xl md:text-3xl font-bold mb-2">
                Suggested Improvements
              </h2>
              <p className="text-[#FCF4EB]/50 text-sm leading-relaxed">
                Based on this session, here is what we are changing to make the next calls even better.
              </p>
            </div>
          </Reveal>

          <StaggerList className="space-y-5">
            {improvements.map((item, i) => (
              <StaggerItem key={item.title}>
                <div className="flex gap-5 items-start bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-xl p-5 card-hover card-shimmer group">
                  <div className="w-9 h-9 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5 number-glow">
                    <span className="text-[#7C69C7] text-sm font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">{item.title}</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        </section>

        {/* ── Footer nav ───────────────────────────────────── */}
        <div className="pb-16">
          <hr className="glow-divider mb-8" />
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/session/4"
              className="inline-flex items-center gap-2 text-sm text-[#FCF4EB]/40 hover:text-[#7C69C7] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Session Overview
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#FCF4EB]/40 hover:text-[#7C69C7] transition-colors"
            >
              All Sessions
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
