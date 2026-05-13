import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { getLiveEvents } from '@/lib/events'

export const metadata = {
  title: 'Events',
  description: 'Live Masterminds HQ workshops and event pages.',
}

export default function EventsIndexPage() {
  const events = getLiveEvents()

  return (
    <main className="pb-24">
      <section className="overflow-hidden px-6 pb-10 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#7C69C7]">
              Masterminds HQ Events
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="gradient-text pb-1 font-serif text-5xl leading-[0.94] md:text-7xl">
              Workshop Landing Pages
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#FCF4EB]/64">
              High-signal event pages with detailed hosts, inline media, dynamic sections, and promo-aware pricing.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {events.map((event) => (
            <Link
              key={event.slug}
              href={`/events/${event.slug}`}
              className="card-hover group rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.26)]"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="rounded-full border border-[#7C69C7]/30 bg-[#7C69C7]/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#BDB3E8]">
                  {event.badge ?? 'Live'}
                </span>
                <span className="text-xs uppercase tracking-[0.18em] text-[#FCF4EB]/45">{event.dateLabel}</span>
              </div>
              <h2 className="font-serif text-4xl leading-[0.98] text-[#FCF4EB]">{event.title}</h2>
              <p className="mt-4 text-base leading-8 text-[#FCF4EB]/64">{event.summary}</p>
              <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-[#F5C3C6]">
                <span>Open event page</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
