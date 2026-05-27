// Stripe webhook for guaranteed server-side mirror of paid event checkouts.
//
// Setup (one time, in Stripe Dashboard):
//   1. Developers → Webhooks → Add endpoint
//   2. URL: https://workshop.mastermindshq.business/api/stripe/webhook
//   3. Events: checkout.session.completed
//   4. Reveal "Signing secret" and add it to Vercel as STRIPE_WEBHOOK_SECRET
//
// Without STRIPE_WEBHOOK_SECRET set, this route refuses every request.
//
// The webhook fires server-side from Stripe regardless of whether the
// client browser completes the redirect to finalize-registration, so
// closing the tab after paying no longer causes Supabase drift.

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getEventBySlug } from '@/lib/events'
import { finalizeLegacyCheckoutSession } from '@/lib/legacy-event-schedule'
import { createStripeClient } from '@/lib/stripe'
import { trackInsightEvent } from '@/lib/insight-to-fix'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 })
  }

  const rawBody = await request.text()
  const stripe = createStripeClient()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signature verification failed.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ ok: true, ignored: event.type })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const eventSlug = session.metadata?.event_slug
  if (!eventSlug) {
    return NextResponse.json({ ok: true, ignored: 'no event_slug metadata' })
  }

  const eventDef = getEventBySlug(eventSlug)
  if (!eventDef) {
    await trackInsightEvent('stripe_webhook_unknown_event', {
      route: '/stripe/webhook',
      checkoutId: session.id,
      properties: { event_slug: eventSlug },
    })
    return NextResponse.json({ ok: true, ignored: 'unknown event_slug' })
  }

  try {
    const result = await finalizeLegacyCheckoutSession({ event: eventDef, sessionId: session.id })
    await trackInsightEvent('stripe_webhook_finalized', {
      route: '/stripe/webhook',
      checkoutId: session.id,
      properties: { event_slug: eventSlug, status: result.status },
    })
    return NextResponse.json({ ok: true, status: result.status })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error.'
    console.error('stripe webhook finalize error', err)
    await trackInsightEvent('stripe_webhook_failed', {
      route: '/stripe/webhook',
      checkoutId: session.id,
      properties: { event_slug: eventSlug, reason: message },
    })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
