import type { Metadata } from 'next'
import Reveal from '@/components/Reveal'
import LeadMagnetExampleForm from './LeadMagnetExampleForm'

export const metadata: Metadata = {
  title: 'Client Launch Checklist',
  description: 'Get the 14-point checklist for launching a paid client offer without missing the trust-building details.',
  openGraph: {
    title: 'Client Launch Checklist',
    description: 'A practical 14-point checklist for consultants, coaches, and service business owners launching a paid offer.',
  },
}

const CHECKLIST_ITEMS = [
  'A one-sentence promise that names the buyer, outcome, and time frame',
  'A pricing anchor that makes the offer easier to understand',
  'Three proof points you can publish before you have a large audience',
  'A checkout or booking link that works on mobile',
  'A follow-up email that tells new leads exactly what happens next',
  'A simple tracking sheet for leads, calls, follow-ups, and wins',
]

const USE_CASES = [
  {
    label: 'Consultants',
    copy: 'Turn a custom service into a packaged offer people can say yes to quickly.',
  },
  {
    label: 'Coaches',
    copy: 'Launch a small paid program without waiting for a perfect funnel.',
  },
  {
    label: 'Local services',
    copy: 'Make the path from curious visitor to booked call clear and measurable.',
  },
]

export default function ClientLaunchChecklistPage() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden px-6 pb-14 pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B1724] via-[#151515] to-[#151515]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(rgba(252,244,235,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(252,244,235,0.14) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        <div className="relative mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <Reveal>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#7C69C7]/25 bg-[#7C69C7]/15 px-4 py-1.5">
                <span className="text-xs text-[#9D8FE0]">◇</span>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#9D8FE0]">
                  Free checklist
                </span>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h1 className="mb-6 text-4xl font-extrabold leading-[1.06] text-[#FCF4EB] sm:text-5xl md:text-6xl">
                Launch your next client offer without missing the trust details.
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p className="mb-8 max-w-2xl text-lg leading-relaxed text-[#FCF4EB]/60">
                The Client Launch Checklist gives you a 14-point preflight review for your landing
                page, checkout path, follow-up email, and first-week outreach plan.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['14', 'launch checks'],
                  ['30 min', 'to review'],
                  ['1 page', 'printable PDF'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-4">
                    <p className="text-2xl font-extrabold text-[#FCF4EB]">{value}</p>
                    <p className="text-xs text-[#FCF4EB]/40">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={4}>
            <div className="rounded-2xl border border-white/[0.10] bg-white/[0.05] p-5 shadow-2xl shadow-black/20">
              <div className="mb-5 rounded-xl border border-[#F5C3C6]/20 bg-[#F5C3C6]/10 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#F5C3C6]">
                  Instant delivery
                </p>
                <p className="text-sm leading-relaxed text-[#FCF4EB]/60">
                  Enter your first name and email. The checklist is delivered by email, and your
                  signup is saved to the lead list.
                </p>
              </div>
              <LeadMagnetExampleForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#7C69C7]">
              What you get
            </p>
            <h2 className="mb-4 text-3xl font-bold text-[#FCF4EB]">
              A practical checklist for the messy parts of selling.
            </h2>
            <p className="text-sm leading-relaxed text-[#FCF4EB]/55">
              Most launch advice talks about big funnels. This checklist focuses on the small details
              that make a stranger feel ready to take the next step.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2">
          {CHECKLIST_ITEMS.map((item, index) => (
            <Reveal key={item} delay={index + 1}>
              <div className="flex h-full gap-4 rounded-xl border border-white/[0.08] bg-white/[0.04] p-5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#7C69C7]/35 bg-[#7C69C7]/15 text-xs font-bold text-[#9D8FE0]">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed text-[#FCF4EB]/70">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {USE_CASES.map((item, index) => (
            <Reveal key={item.label} delay={index + 1}>
              <div className="h-full rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
                <p className="mb-2 text-sm font-bold text-[#FCF4EB]">{item.label}</p>
                <p className="text-sm leading-relaxed text-[#FCF4EB]/50">{item.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <Reveal>
          <div className="rounded-2xl border border-[#7C69C7]/25 bg-[#7C69C7]/10 p-6 text-center sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#9D8FE0]">
              Use it before you publish
            </p>
            <h2 className="mb-4 text-2xl font-bold text-[#FCF4EB]">
              Find the weak spots before your buyers do.
            </h2>
            <p className="mx-auto mb-6 max-w-lg text-sm leading-relaxed text-[#FCF4EB]/55">
              Get the checklist, review your offer page, then tighten the pieces that create trust.
            </p>
            <div className="mx-auto max-w-xl">
              <LeadMagnetExampleForm />
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
