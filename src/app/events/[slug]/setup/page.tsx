import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEventBySlug } from '@/lib/events'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = getEventBySlug(slug)

  if (!event?.postPurchase) {
    return {
      title: 'Setup Not Found',
    }
  }

  return {
    title: `${event.title} Setup`,
    description: event.postPurchase.setupPageIntro,
  }
}

export default async function EventSetupPage({ params }: PageProps) {
  const { slug } = await params
  const event = getEventBySlug(slug)

  if (!event?.postPurchase) {
    notFound()
  }

  const [primarySetup, secondarySetup] = event.postPurchase.setupItems
  const hasSetupItems = event.postPurchase.setupItems.length > 0

  return (
    <main className="min-h-screen bg-[#0b0b0c] px-6 py-16 text-[#FCF4EB] md:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">
          {hasSetupItems ? 'Workshop Setup' : 'See You There'}
        </p>
        <h1 className="event-gradient-title mt-4 text-[2.6rem] font-extrabold leading-[0.92] tracking-tight md:text-[5rem]">
          {event.postPurchase.setupPageTitle}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#FCF4EB]/74 md:text-[1.2rem]">
          {event.postPurchase.setupPageIntro}
        </p>

        {hasSetupItems && primarySetup ? (
          <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(252,244,235,0.08),rgba(124,105,199,0.08))] p-7 shadow-[0_24px_70px_rgba(0,0,0,0.26)] md:p-9">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">Do This First</p>
              <h2 className="mt-3 text-[2rem] font-extrabold leading-[0.96] tracking-tight text-[#FCF4EB] md:text-[3rem]">
                Start with {primarySetup.name}
              </h2>
              <p className="mt-4 text-base leading-8 text-[#FCF4EB]/74 md:text-lg">
                {primarySetup.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={primarySetup.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="copy-button-glass copy-button-primary inline-flex min-w-[240px] items-center justify-center rounded-xl px-6 py-4 text-base font-semibold shadow-[0_16px_38px_rgba(124,105,199,0.22)]"
                >
                  Open {primarySetup.name}
                </a>
                <Link
                  href={`/events/${event.slug}`}
                  className="inline-flex min-w-[220px] items-center justify-center rounded-xl border border-white/14 bg-white/[0.06] px-6 py-4 text-base font-semibold text-[#FCF4EB] transition hover:bg-white/[0.1]"
                >
                  Back To Event Page
                </Link>
              </div>
            </section>

            <aside className="rounded-[2rem] border border-white/10 bg-[#101011] p-7 shadow-[0_24px_70px_rgba(0,0,0,0.22)] md:p-9">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">What Happens Next</p>
              <div className="mt-6 space-y-6">
                {event.postPurchase.setupItems.map((item) => (
                  <div key={item.name} className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">{item.stepLabel}</p>
                    <h3 className="mt-2 text-xl font-bold text-[#FCF4EB]">{item.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#FCF4EB]/72">{item.description}</p>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex text-sm font-semibold text-[#BDB3E8] transition hover:text-[#FCF4EB]"
                    >
                      Open {item.name}
                    </a>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        ) : (
          <div className="mt-12">
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex min-w-[220px] items-center justify-center rounded-xl border border-white/14 bg-white/[0.06] px-6 py-4 text-base font-semibold text-[#FCF4EB] transition hover:bg-white/[0.1]"
            >
              Back To Event Page
            </Link>
          </div>
        )}

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-[#101011] p-7 shadow-[0_24px_70px_rgba(0,0,0,0.22)] md:p-9">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">
            {hasSetupItems ? 'Important' : 'Details'}
          </p>
          <div className="mt-4 space-y-4">
            {event.postPurchase.setupPageBody.map((paragraph) => (
              <p key={paragraph} className="text-base leading-8 text-[#FCF4EB]/74 md:text-lg">
                {paragraph}
              </p>
            ))}
            {hasSetupItems && secondarySetup && primarySetup ? (
              <p className="text-base leading-8 text-[#FCF4EB]/74 md:text-lg">
                Once you finish {primarySetup.name}, come back here and open{' '}
                <a
                  href={secondarySetup.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#BDB3E8] transition hover:text-[#FCF4EB]"
                >
                  {secondarySetup.name}
                </a>
                .
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}
