import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import EventPageView from '@/components/events/EventPageView'
import { getPublicImageSize } from '@/lib/image-size'
import { getEventBySlug, resolvePromoCode } from '@/lib/events'
import { getStripePublishableKey } from '@/lib/stripe'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<EventSearchParams>
}

type EventSearchParams = {
  promo?: string
  promoCode?: string
  code?: string
  discount?: string
  checkout?: string
  session_id?: string
}

export const dynamic = 'force-dynamic'

function getPromoParam(searchParams: EventSearchParams) {
  return searchParams.promo ?? searchParams.promoCode ?? searchParams.code ?? searchParams.discount ?? null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = getEventBySlug(slug)

  if (!event) {
    return {
      title: 'Event Not Found',
    }
  }

  const title = event.metadata?.title ?? event.title
  const description = event.metadata?.description ?? event.description
  const { width, height } = getPublicImageSize(event.heroImage)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: event.heroImage, width, height, alt: event.heroAlt ?? title }],
    },
    // Without this the root layout's generic "Masterminds Workshop" card is
    // what X and anything else reading twitter:* shows for every event
    // (Illy, 2026-09-23).
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [event.heroImage],
    },
  }
}

export default async function EventDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const promoParam = getPromoParam(await searchParams)
  const event = getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const promo = resolvePromoCode(event, promoParam ?? null)
  const publishableKey = getStripePublishableKey()
  const publicEvent = {
    ...event,
    pricing: {
      ...event.pricing,
      promoCodes: undefined,
    },
  }

  return (
    <EventPageView
      event={publicEvent}
      promo={promo}
      publishableKey={publishableKey}
      initialPromoCode={promo?.code ?? null}
    />
  )
}
