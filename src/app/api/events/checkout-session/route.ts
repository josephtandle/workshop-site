import { NextResponse } from 'next/server'
import { getEventBySlug, resolvePromoCode } from '@/lib/events'
import { createStripeClient } from '@/lib/stripe'

function toOrigin(value: string | null | undefined) {
  if (!value) return null

  try {
    return new URL(value).origin
  } catch {
    try {
      return new URL(`https://${value.replace(/^\/+|\/+$/g, '')}`).origin
    } catch {
      return null
    }
  }
}

function getBaseUrl(request: Request) {
  const envOrigin = toOrigin(process.env.NEXT_PUBLIC_SITE_URL)
  if (envOrigin) return envOrigin

  const requestOrigin = toOrigin(request.url)
  if (requestOrigin) return requestOrigin

  return 'https://workshop.mastermindshq.business'
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const slug = typeof body.slug === 'string' ? body.slug : ''
    const attendeeName = typeof body.attendeeName === 'string' ? body.attendeeName.trim() : ''
    const attendeeEmail = typeof body.attendeeEmail === 'string' ? body.attendeeEmail.trim() : ''
    const promoCode = typeof body.promoCode === 'string' ? body.promoCode.trim() : ''

    if (!slug || !attendeeName || !attendeeEmail) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const event = getEventBySlug(slug)
    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    }

    const promo = resolvePromoCode(event, promoCode || null)
    const amount = promo?.amountOff
      ? Math.max(0, event.pricing.fullPrice - promo.amountOff)
      : promo?.percentOff
        ? Math.max(0, event.pricing.fullPrice * (1 - promo.percentOff / 100))
        : event.pricing.fullPrice

    const unitAmount = Math.round(amount * 100)
    if (unitAmount === 0) {
      return NextResponse.json({
        completed: true,
        freeCheckout: true,
        appliedPromoCode: promo?.code ?? null,
        amount,
        message: 'Free ticket reserved. No payment needed.',
      })
    }

    const stripe = createStripeClient()
    const baseUrl = getBaseUrl(request)
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded_page',
      mode: 'payment',
      return_url: `${baseUrl}/events/${event.slug}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      redirect_on_completion: 'if_required',
      customer_email: attendeeEmail,
      billing_address_collection: 'auto',
      customer_creation: 'always',
      allow_promotion_codes: false,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: unitAmount,
            product_data: {
              name: event.title,
              description: event.description,
            },
          },
        },
      ],
      metadata: {
        event_slug: event.slug,
        attendee_name: attendeeName,
        attendee_email: attendeeEmail,
        promo_code: promo?.code ?? '',
      },
      payment_intent_data: {
        metadata: {
          event_slug: event.slug,
          attendee_name: attendeeName,
          attendee_email: attendeeEmail,
          promo_code: promo?.code ?? '',
        },
      },
    })

    return NextResponse.json({
      clientSecret: session.client_secret,
      completed: false,
      appliedPromoCode: promo?.code ?? null,
      amount,
    })
  } catch (error) {
    console.error('event checkout session error', error)
    return NextResponse.json({ error: 'Unable to create checkout session.' }, { status: 500 })
  }
}
