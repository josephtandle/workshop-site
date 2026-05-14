import Image from 'next/image'
import Link from 'next/link'
import type { EventDefinition, EventPromoCode, EventSection } from '@/lib/events'
import { formatEventPrice } from '@/lib/events'
import Reveal from '@/components/Reveal'
import EventRegistrationSection from '@/components/events/EventRegistrationSection'
import type { EventRegistrationData } from '@/components/events/EventRegistrationSection'
import ScrollToRegisterButton from '@/components/events/ScrollToRegisterButton'

function sectionTitleClass(sectionId?: string) {
  if (sectionId === 'creative-lab' || sectionId === 'outcomes') {
    return 'text-[1.95rem] font-extrabold leading-[0.92] tracking-tight md:text-[3.15rem]'
  }
  return 'text-[1.7rem] font-extrabold leading-[0.94] tracking-tight md:text-[2.65rem]'
}

function sectionEyebrowClass(sectionId?: string) {
  return 'mb-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8] md:text-[13px]'
}

function SectionShell({
  eyebrow,
  title,
  intro,
  sectionId,
  children,
}: {
  eyebrow?: string
  title?: string
  intro?: string
  sectionId?: string
  children: React.ReactNode
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-6 md:py-8">
      {(eyebrow || title || intro) && (
        <div className="mb-5">
          {eyebrow ? (
            <p className={sectionEyebrowClass(sectionId)}>
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className={`event-gradient-title ${sectionTitleClass(sectionId)}`}>
              {title}
            </h2>
          ) : null}
          {intro ? <p className="mt-4 text-base leading-8 text-[#FCF4EB]/68 md:text-lg">{intro}</p> : null}
        </div>
      )}
      {children}
    </section>
  )
}

function RichParagraphs({ body }: { body: string[] }) {
  return (
    <div className="space-y-5 text-base leading-8 text-[#FCF4EB]/72 md:text-lg">
      {body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  )
}

function StorySection({ section }: { section: Extract<EventSection, { type: 'story' }> }) {
  return (
    <SectionShell eyebrow={section.eyebrow} title={section.title} sectionId={section.id}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)] md:p-8">
          <RichParagraphs body={section.body} />
        </div>
      </div>
    </SectionShell>
  )
}

function ChecklistSection({ section }: { section: Extract<EventSection, { type: 'checklist' }> }) {
  return (
    <SectionShell eyebrow={section.eyebrow} title={section.title} intro={section.intro} sectionId={section.id}>
      <div className="grid gap-4">
        {section.items.map((item, index) => (
          <div
            key={item}
            className="card-hover card-shimmer group rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_56px_rgba(0,0,0,0.22)] md:flex md:items-center md:gap-6 md:p-6"
          >
            <div className="mb-4 flex items-center gap-3 md:mb-0">
              <div className="number-glow flex h-14 w-14 items-center justify-center rounded-full border border-[#7C69C7]/38 bg-[rgba(18,10,44,0.88)] text-lg font-bold tracking-tight text-[#FCF4EB] shadow-[0_0_0_6px_rgba(124,105,199,0.12),0_0_30px_rgba(124,105,199,0.28)] md:h-16 md:w-16 md:text-xl">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
            <p className="text-[1.8rem] font-bold leading-[1] tracking-tight text-[#FCF4EB] md:flex-1 md:text-[2.1rem]">{item}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

function CardsSection({ section }: { section: Extract<EventSection, { type: 'cards' }> }) {
  const isCurriculum = section.id === 'curriculum'
  return (
    <SectionShell eyebrow={section.eyebrow} title={section.title} intro={section.intro} sectionId={section.id}>
      <div className="grid gap-4">
        {section.items.map((item) => (
          <article
            key={item.title}
            className="card-hover card-shimmer rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_56px_rgba(0,0,0,0.22)] md:p-6"
          >
            {item.kicker ? (
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">{item.kicker}</p>
            ) : null}
            <h3
              className={
                isCurriculum
                  ? 'mb-4 text-[2rem] font-bold leading-[0.96] tracking-tight text-[#FCF4EB] md:text-[2.7rem]'
                  : 'mb-4 text-[1.8rem] font-bold leading-[1] tracking-tight text-[#FCF4EB] md:text-[2.1rem]'
              }
            >
              {item.title}
            </h3>
            {item.body ? <p className="text-sm leading-7 text-[#FCF4EB]/68">{item.body}</p> : null}
            {item.bullets?.length ? (
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[#FCF4EB]/72">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-[0.4rem] h-1.5 w-1.5 rounded-full bg-[#F5C3C6]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </SectionShell>
  )
}

function SplitSection({ section }: { section: Extract<EventSection, { type: 'split' }> }) {
  return (
    <SectionShell eyebrow={section.eyebrow} title={section.title} sectionId={section.id}>
      <div className="grid gap-5">
        <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
          <RichParagraphs body={section.body} />
        </div>
        <figure className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <div className="relative aspect-[16/9] w-full">
            <Image src={section.imageSrc} alt={section.imageAlt} fill className="object-cover" />
          </div>
          {section.caption ? (
            <figcaption className="border-t border-white/10 px-5 py-4 text-sm leading-6 text-[#FCF4EB]/58">
              {section.caption}
            </figcaption>
          ) : null}
        </figure>
      </div>
    </SectionShell>
  )
}

function ImageSection({ section }: { section: Extract<EventSection, { type: 'image' }> }) {
  const compactVisual = section.id === 'visual-marker'
  const media = section.videoSrc ? (
    <video
      className="h-full w-full object-cover"
      src={section.videoSrc}
      aria-label={section.imageAlt}
      controls
      playsInline
      preload="metadata"
    />
  ) : (
    <Image src={section.imageSrc} alt={section.imageAlt} width={1400} height={900} className="h-full w-full object-cover" />
  )

  return (
    <SectionShell eyebrow={section.eyebrow} title={section.title} sectionId={section.id}>
      <figure className={`overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_70px_rgba(0,0,0,0.28)] ${compactVisual ? 'mx-auto max-w-sm md:max-w-md' : ''}`}>
        {media}
        {section.caption ? (
          <figcaption className="border-t border-white/10 px-6 py-4 text-sm leading-6 text-[#FCF4EB]/58">
            {section.caption}
          </figcaption>
        ) : null}
      </figure>
    </SectionShell>
  )
}

function HtmlSection({ section }: { section: Extract<EventSection, { type: 'html' }> }) {
  return (
    <SectionShell eyebrow={section.eyebrow} title={section.title} sectionId={section.id}>
      <div
        className="event-html prose prose-invert max-w-none rounded-[1.8rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8"
        dangerouslySetInnerHTML={{ __html: section.html }}
      />
    </SectionShell>
  )
}

function QuoteCardSection({ section }: { section: Extract<EventSection, { type: 'quoteCard' }> }) {
  const renderMedia = () =>
    section.videoSrc ? (
      <video
        className="h-full w-full object-cover object-center"
        src={section.videoSrc}
        aria-label={section.imageAlt}
        autoPlay
        controls
        loop
        muted
        playsInline
        preload="metadata"
      />
    ) : (
      <Image
        src={section.imageSrc}
        alt={section.imageAlt}
        width={900}
        height={900}
        className="h-full w-full object-cover object-center"
      />
    )

  return (
    <section className="mx-auto max-w-6xl px-6 py-6 md:py-8">
      <div
        className="relative overflow-hidden rounded-3xl border border-white/[0.08]"
        style={{ background: 'linear-gradient(135deg, rgba(20,14,36,0.97) 0%, rgba(10,7,20,1) 100%)' }}
      >
        <div
          className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full blur-[100px]"
          style={{ background: 'rgba(139,121,212,0.18)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full blur-[100px]"
          style={{ background: 'rgba(189,179,232,0.10)' }}
        />

        <div className="relative z-10 flex flex-col md:hidden">
          <div className="relative max-h-[364px] w-full overflow-hidden rounded-t-[1.5rem]">
            <div className="h-[364px] w-full">{renderMedia()}</div>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(10,7,20,0.97))' }}
            />
          </div>

          <div className="flex flex-col px-6 py-6">
            <div
              className="select-none font-serif leading-none"
              style={{ fontSize: '3rem', color: 'rgba(139,121,212,0.40)', lineHeight: 1 }}
            >
              &ldquo;
            </div>
            <blockquote className="mb-5 whitespace-pre-line font-serif text-base italic leading-relaxed text-[#FCF4EB]/90">
              {section.quote}
            </blockquote>
            <div className="border-t border-white/[0.10] pt-4">
              <p className="text-sm font-semibold text-[#FCF4EB]">{section.name}</p>
              {section.bio ? <p className="mt-0.5 text-xs text-[#FCF4EB]/55">{section.bio}</p> : null}
              {section.location ? <p className="mt-0.5 text-xs text-[#FCF4EB]/35">{section.location}</p> : null}
            </div>
          </div>
        </div>

        <div className="relative z-10 hidden flex-row items-stretch gap-0 md:flex">
          <div className="relative w-[15.5rem] flex-shrink-0 overflow-hidden rounded-l-[1.5rem]">
            {renderMedia()}
          </div>

          <div className="flex flex-1 flex-col justify-center px-10 py-8">
            <div
              className="select-none font-serif leading-none"
              style={{ fontSize: '3.5rem', color: 'rgba(139,121,212,0.40)', lineHeight: 1 }}
            >
              &ldquo;
            </div>
            <blockquote className="mb-5 whitespace-pre-line font-serif text-lg italic leading-relaxed text-[#FCF4EB]/85">
              {section.quote}
            </blockquote>
            <div className="border-t border-white/[0.10] pt-4">
              <p className="text-sm font-semibold text-[#FCF4EB]">{section.name}</p>
              {section.bio ? <p className="mt-0.5 text-xs text-[#FCF4EB]/55">{section.bio}</p> : null}
              {section.location ? <p className="mt-0.5 text-xs text-[#FCF4EB]/35">{section.location}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HostsSection({ section }: { section: Extract<EventSection, { type: 'hosts' }> }) {
  return (
    <SectionShell eyebrow={section.eyebrow} title={section.title} intro={section.intro} sectionId={section.id}>
      <div className="grid gap-6">
        {section.hosts.map((host) => (
          <article
            key={host.name}
            className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(145deg,rgba(252,244,235,0.09),rgba(252,244,235,0.025))] shadow-[0_22px_70px_rgba(0,0,0,0.28)] md:grid md:grid-cols-[280px_minmax(0,1fr)] md:items-stretch"
          >
            <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(139,121,212,0.18),transparent_55%),linear-gradient(180deg,rgba(252,244,235,0.06),rgba(252,244,235,0.01))] md:border-b-0 md:border-r">
              <div className="relative h-[260px] w-full overflow-hidden md:h-full md:min-h-[320px] md:w-full">
                <Image src={host.photoSrc} alt={host.name} fill className="object-cover object-center" />
              </div>
            </div>
            <div className="grid gap-4 p-6 md:p-7">
              <div>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">{host.role}</p>
                <h3 className="mt-2 text-[2rem] font-bold leading-tight tracking-tight text-[#FCF4EB]">{host.name}</h3>
              </div>
              <div className="space-y-4 text-sm leading-7 text-[#FCF4EB]/70">
                {host.bio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  )
}

function CtaSection({
  section,
  event,
  promo,
}: {
  section: Extract<EventSection, { type: 'cta' }>
  event: EventDefinition
  promo: EventPromoCode | null
}) {
  return (
    <SectionShell eyebrow={section.eyebrow} title={section.title} sectionId={section.id}>
      <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(252,244,235,0.08),rgba(124,105,199,0.08))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.26)] md:p-8">
        <div>
          <p className="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">{section.body}</p>
          {event.pricing.promoFieldHint ? (
            <p className="mt-4 text-xs leading-6 text-[#FCF4EB]/42">{event.pricing.promoFieldHint}</p>
          ) : null}
          {section.note ? <p className="mt-5 text-sm leading-7 text-[#FCF4EB]/50">{section.note}</p> : null}
        </div>
        <div className="rounded-[1.6rem] border border-white/10 bg-[#0f0f10]/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">Workshop Price</p>
              <div className="mt-2 flex items-end gap-3">
                {promo ? (
                  <span className="text-lg text-[#FCF4EB]/35 line-through">{event.pricing.currencySymbol}{event.pricing.fullPrice}</span>
                ) : null}
                <span className="font-serif text-5xl leading-none text-[#FCF4EB]">{formatEventPrice(event, promo ?? undefined)}</span>
              </div>
            </div>
            {promo ? (
              <div className="rounded-full border border-[#F5C3C6]/30 bg-[#F5C3C6]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F5C3C6]">
                {promo.code}
              </div>
            ) : null}
          </div>
          <p className="mb-5 text-sm leading-6 text-[#FCF4EB]/55">
            {promo ? promo.description : event.pricing.checkoutNote}
          </p>
          <div className="grid gap-3">
            <ScrollToRegisterButton
              className="copy-button-glass copy-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold"
            >
              {section.primaryLabel}
            </ScrollToRegisterButton>
            {section.secondaryHref && section.secondaryLabel ? (
              <Link
                href={section.secondaryHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-[#FCF4EB]/74 transition hover:bg-white/[0.06] hover:text-[#FCF4EB]"
              >
                {section.secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}

function renderSection(section: EventSection, event: EventDefinition, promo: EventPromoCode | null) {
  switch (section.type) {
    case 'story':
      return <StorySection key={section.id} section={section} />
    case 'checklist':
      return <ChecklistSection key={section.id} section={section} />
    case 'cards':
      return <CardsSection key={section.id} section={section} />
    case 'split':
      return <SplitSection key={section.id} section={section} />
    case 'image':
      return <ImageSection key={section.id} section={section} />
    case 'html':
      return <HtmlSection key={section.id} section={section} />
    case 'quoteCard':
      return <QuoteCardSection key={section.id} section={section} />
    case 'hosts':
      return <HostsSection key={section.id} section={section} />
    case 'cta':
      return <CtaSection key={section.id} section={section} event={event} promo={promo} />
    case 'custom':
      return <section key={section.id}>{section.render}</section>
    default:
      return null
  }
}

export default function EventPageView({
  event,
  promo,
  publishableKey,
  initialPromoCode,
}: {
  event: EventDefinition
  promo: EventPromoCode | null
  publishableKey: string | null
  initialPromoCode?: string | null
}) {
  const hasSetupItems = (event.postPurchase?.setupItems?.length ?? 0) > 0
  const registrationEvent: EventRegistrationData = {
    slug: event.slug,
    pricing: {
      currencySymbol: event.pricing.currencySymbol,
      fullPrice: event.pricing.fullPrice,
      checkoutNote: event.pricing.checkoutNote,
      donationMode: event.pricing.donationMode,
      minDonation: event.pricing.minDonation,
    },
    successLabel: hasSetupItems ? 'Start Account Setup' : 'View Event Details',
    successDetail: event.postPurchase
      ? event.pricing.donationMode
        ? 'Thank you. A confirmation email is on its way from joe@mastermindshq.business.'
        : undefined
      : undefined,
    successRedirect: hasSetupItems ? undefined : `/events/${event.slug}`,
  }

  return (
    <main className="pb-24">
      <section className="overflow-hidden px-6 pb-6 pt-8 md:pb-10 md:pt-10">
        <div className="mx-auto max-w-6xl">
          {event.eyebrow ? (
            <Reveal>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#BDB3E8]">
                {event.eyebrow}
              </p>
            </Reveal>
          ) : null}
          <Reveal delay={1}>
            <h1 className="event-gradient-title max-w-[15ch] text-[1.7rem] font-extrabold leading-[0.92] tracking-tight sm:text-[2.2rem] md:max-w-none md:text-[3.1rem] lg:text-[3.7rem]">
              {event.title}
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-[#FCF4EB]/68 md:text-xl">
              {event.summary}
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="min-w-[240px] flex-1 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">When</p>
                <p className="mt-3 text-2xl font-bold text-[#FCF4EB]">{event.dateLabel}</p>
                <p className="mt-1 text-sm text-[#FCF4EB]/58">{event.timeLabel}</p>
              </div>
              <div className="min-w-[240px] flex-1 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">Where</p>
                <p className="mt-3 text-2xl font-bold text-[#FCF4EB]">{event.locationLabel}</p>
                <p className="mt-1 text-sm text-[#FCF4EB]/58">{event.durationLabel}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={4}>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex flex-col gap-2">
                <ScrollToRegisterButton
                  className="copy-button-glass copy-button-primary inline-flex min-w-[220px] items-center justify-center rounded-xl px-6 py-4 text-base font-semibold shadow-[0_16px_38px_rgba(124,105,199,0.22)]"
                >
                  Buy Ticket
                </ScrollToRegisterButton>
                <p className="pl-1 text-xs leading-5 text-[#FCF4EB]/42">
                  Have a promo code? Enter it in the registration section below.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={5}>
            <aside className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(252,244,235,0.08),rgba(124,105,199,0.12))] shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
              <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10">
                <Image src={event.heroImage} alt={event.heroAlt} fill className="object-cover" />
              </div>
              <div className="space-y-5 p-6 md:p-7">
                <div>
                  <p className="text-base leading-8 text-[#FCF4EB]/72 md:text-lg">{event.description}</p>
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      {event.sections.map((section) => renderSection(section, event, promo))}
      <EventRegistrationSection event={registrationEvent} publishableKey={publishableKey} initialPromoCode={initialPromoCode} />
    </main>
  )
}
