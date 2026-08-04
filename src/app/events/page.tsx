import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { formatEventPrice, getUpcomingLiveEvents } from '@/lib/events'

const COHORT_4_HREF = 'https://a.mastermindshq.business/mastermind-events'

export const metadata = {
  title: 'Events',
  description: 'Upcoming live workshops with Joe Che.',
}

export default function EventsIndexPage() {
  const events = getUpcomingLiveEvents()

  return (
    <main className="pb-24">
      <section className="overflow-hidden px-6 pb-10 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#8B79D4]">
              Masterminds HQ Events
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="gradient-text pb-1 font-serif text-5xl leading-[0.94] md:text-7xl">
              Upcoming Workshops
              <span className="mt-3 block font-sans text-2xl italic tracking-tight md:text-4xl">
                with Joe Che
              </span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#FCF4EB]/64">
              Both online and in person, come sit in and watch exactly what I use AI for in my own business.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6">
          {events.map((event) => {
            const priceLabel = event.pricing.fullPrice === 0 ? 'Free' : formatEventPrice(event)
            const modalityLabel = event.badge ?? (event.zoomLink ? 'Online' : null)
            return (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                className="card-hover group flex flex-col overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.04] shadow-[0_22px_70px_rgba(0,0,0,0.26)] sm:flex-row"
              >
                <div className="relative aspect-[16/9] w-full flex-shrink-0 self-center bg-black/20 sm:w-96">
                  <Image src={event.heroImage} alt={event.heroAlt} fill className="object-contain" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[#8B79D4]/30 bg-[#8B79D4]/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#BDB3E8]">
                        Live
                      </span>
                      {modalityLabel && (
                        <span className="rounded-full border border-[#8B79D4]/30 bg-[#8B79D4]/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#BDB3E8]">
                          {modalityLabel}
                        </span>
                      )}
                      <span className="rounded-full border border-[#F5C3C6]/30 bg-[#F5C3C6]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F5C3C6]">
                        {priceLabel}
                      </span>
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-[#FCF4EB]/45">{event.dateLabel}</span>
                  </div>
                  <h2 className="gradient-text font-serif text-4xl leading-[0.98]">{event.title}</h2>
                  <p className="mt-4 text-base leading-8 text-[#FCF4EB]/64">{event.summary}</p>
                  <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-[#F5C3C6]">
                    <span>Open event page</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-6">
        <div className="grid gap-6 rounded-[1.8rem] border border-white/10 bg-[linear-gradient(145deg,rgba(252,244,235,0.08),rgba(139,121,212,0.08))] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.26)] md:grid-cols-[1.4fr_auto] md:items-center md:p-8">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">Not a one-off workshop</p>
            <h2 className="gradient-text font-serif text-3xl leading-[1.04] md:text-4xl">Join the AI Business Mastermind</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#FCF4EB]/64">
              These are a taste of what I teach every week inside the AI Business Mastermind. Cohort 4 is open now.
            </p>
          </div>
          <a
            href={COHORT_4_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="copy-button-glass copy-button-primary inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-4 text-sm font-semibold no-underline"
          >
            See Cohort 4 Details
          </a>
        </div>
      </section>
    </main>
  )
}
