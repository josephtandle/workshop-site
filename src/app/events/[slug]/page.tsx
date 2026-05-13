import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import EventPageView from '@/components/events/EventPageView'
import { getEventBySlug, resolvePromoCode } from '@/lib/events'
import { getStripePublishableKey } from '@/lib/stripe'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ promo?: string; checkout?: string; session_id?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = getEventBySlug(slug)

  if (!event) {
    return {
      title: 'Event Not Found',
    }
  }

  return {
    title: event.metadata?.title ?? event.title,
    description: event.metadata?.description ?? event.description,
    openGraph: {
      title: event.metadata?.title ?? event.title,
      description: event.metadata?.description ?? event.description,
      images: [{ url: event.heroImage, width: 1200, height: 630 }],
    },
  }
}

export default async function EventDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { promo } = await searchParams
  const event = getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const activePromo = resolvePromoCode(event, promo)
  const publishableKey = getStripePublishableKey()

  return <EventPageView event={event} promo={activePromo} publishableKey={publishableKey} initialPromoCode={promo ?? null} />
}
