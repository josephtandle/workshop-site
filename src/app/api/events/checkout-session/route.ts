import { NextResponse } from 'next/server'
import { getEventBySlug } from '@/lib/events'
import { sendEventConfirmationEmail } from '@/lib/event-confirmation-email'
import { syncLegacyRegistration } from '@/lib/legacy-event-schedule'
import { createStripeClient, getStripePublishableKey } from '@/lib/stripe'
import { saveRegistration } from '@/lib/event-registration-db'
import { toOrigin } from '@/lib/url-utils'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { trackInsightEvent } from '@/lib/insight-to-fix'
import {
  buildEventCheckoutSessionParams,
  resolveCheckoutMode,
  resolveEventCheckoutAmount,
} from '@/lib/event-checkout'
import { toStripeUnitAmount } from '@/lib/stripe-amount'

export const runtime = 'nodejs'

function getBaseUrl(request: Request) {
  const envOrigin = toOrigin(process.env.NEXT_PUBLIC_SITE_URL)
  if (envOrigin) return envOrigin

  const requestOrigin = toOrigin(request.url)
  if (requestOrigin) return requestOrigin

  return 'https://workshop.mastermindshq.business'
}

export async function POST(request: Request) {
  try {
    const { ok: rateLimitOk } = await checkRateLimit(`checkout:${getClientIp(request)}`, 10, 60)
    if (!rateLimitOk) {
      await trackInsightEvent('checkout_failed', {
        route: '/events/checkout',
        properties: { reason: 'rate_limited' },
      })
      return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
    }

    const body = await request.json()
    const slug = typeof body.slug === 'string' ? body.slug : ''
    const attendeeName = typeof body.attendeeName === 'string' ? body.attendeeName.trim() : ''
    const attendeeEmail = typeof body.attendeeEmail === 'string' ? body.attendeeEmail.trim() : ''
    const promoCode = typeof body.promoCode === 'string' ? body.promoCode.trim() : ''
    const journeyId = typeof body.journeyId === 'string' ? body.journeyId.trim() : ''
    const acquisitionRoute = typeof body.acquisitionRoute === 'string' ? body.acquisitionRoute.trim() : '/events'
    const acquisitionQuery = typeof body.acquisitionQuery === 'string' ? body.acquisitionQuery.trim() : ''
    const referrer = typeof body.referrer === 'string' ? body.referrer.trim() : ''
    const rawDonationAmount = typeof body.donationAmount === 'number' ? body.donationAmount : null
    const requestedCheckoutMode = typeof body.checkoutMode === 'string' ? body.checkoutMode.trim() : null

    if (!slug || !attendeeName || !attendeeEmail) {
      await trackInsightEvent('checkout_failed', {
        route: '/events/checkout',
        properties: { reason: 'missing_required_fields', slug },
      })
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (attendeeName.length > 256 || attendeeEmail.length > 256) {
      await trackInsightEvent('checkout_failed', {
        route: '/events/checkout',
        properties: { reason: 'invalid_input_length', slug },
      })
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
    }

    if (
      rawDonationAmount !== null &&
      (!Number.isFinite(rawDonationAmount) || rawDonationAmount < 0 || rawDonationAmount > 99999)
    ) {
      await trackInsightEvent('checkout_failed', {
        route: '/events/checkout',
        email: attendeeEmail,
        properties: { reason: 'invalid_donation_amount', slug },
      })
      return NextResponse.json({ error: 'Invalid donation amount.' }, { status: 400 })
    }

    const event = getEventBySlug(slug)
    if (!event) {
      await trackInsightEvent('checkout_failed', {
        route: '/events/checkout',
        email: attendeeEmail,
        properties: { reason: 'event_not_found', slug },
      })
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    }

    const { amount, promo } = resolveEventCheckoutAmount({
      event,
      promoCode,
      rawDonationAmount,
    })

    if (!Number.isFinite(amount) || amount < 0) {
      await trackInsightEvent('checkout_failed', {
        route: '/events/checkout',
        email: attendeeEmail,
        properties: { reason: 'invalid_amount', slug },
      })
      return NextResponse.json({ error: 'Invalid amount.' }, { status: 400 })
    }

    await trackInsightEvent('lead_acquired', {
      route: acquisitionRoute,
      email: attendeeEmail,
      sessionId: journeyId,
      properties: {
        acquisition_query: acquisitionQuery,
        referrer,
        event_slug: event.slug,
        source: 'event_registration',
      },
    })

    const unitAmount = toStripeUnitAmount(amount)
    if (unitAmount === null) {
      await trackInsightEvent('checkout_failed', {
        route: '/events/checkout',
        email: attendeeEmail,
        properties: { reason: 'amount_below_stripe_minimum', slug, amount },
      })
      return NextResponse.json(
        { error: 'Donation amount must be $0 or at least $0.50.' },
        { status: 400 },
      )
    }

    if (unitAmount === 0) {
      const syncResult = await syncLegacyRegistration({
        event,
        attendeeName,
        attendeeEmail,
        amount,
        status: 'paid',
      })

      let message = 'Free ticket reserved. No payment needed.'

      // Save registration to Supabase and include cancel token in confirmation email
      let cancelToken: string | undefined
      try {
        const saved = await saveRegistration({
          eventSlug: slug,
          attendeeName,
          attendeeEmail,
          amountPaid: amount,
        })
        cancelToken = saved.cancelToken
      } catch (regErr) {
        console.error('event registration save error', regErr)
      }

      try {
        await sendEventConfirmationEmail({
          event,
          attendeeName,
          attendeeEmail,
          cancelToken,
        })
        await trackInsightEvent('initial_email_sent', {
          route: '/events/checkout',
          email: attendeeEmail,
          sessionId: journeyId,
          properties: { event_slug: event.slug, email_type: 'event_confirmation' },
        })
        await trackInsightEvent('welcome_email_sent', {
          route: '/events/checkout',
          email: attendeeEmail,
          sessionId: journeyId,
          properties: { event_slug: event.slug, email_type: 'event_confirmation' },
        })
        await trackInsightEvent('delivery_completed', {
          route: '/events/checkout',
          email: attendeeEmail,
          sessionId: journeyId,
          properties: { event_slug: event.slug, delivery_type: 'free_event_registration' },
        })
      } catch (error) {
        console.error('event confirmation email error', error)
        message = `${message} Confirmation email failed to send automatically.`
        await trackInsightEvent('initial_email_failed', {
          route: '/events/checkout',
          email: attendeeEmail,
          sessionId: journeyId,
          properties: { event_slug: event.slug, reason: 'confirmation_email_failed' },
        })
      }

      await trackInsightEvent('checkout_completed', {
        route: '/events/checkout',
        email: attendeeEmail,
        sessionId: journeyId,
        properties: {
          event_slug: event.slug,
          free_checkout: true,
          amount,
          sync_status: syncResult.status,
          confirmation_email_warning: message !== 'Free ticket reserved. No payment needed.',
        },
      })

      return NextResponse.json({
        completed: true,
        freeCheckout: true,
        appliedPromoCode: promo?.code ?? null,
        amount,
        message,
        syncStatus: syncResult.status,
      })
    }

    const stripe = createStripeClient()
    const baseUrl = getBaseUrl(request)
    const publishableKey = getStripePublishableKey()
    const embeddedCheckoutEnabled = process.env.EVENTS_EMBEDDED_CHECKOUT === '1' && Boolean(publishableKey)
    const checkoutMode = resolveCheckoutMode(requestedCheckoutMode, embeddedCheckoutEnabled)
    const session = await stripe.checkout.sessions.create(
      buildEventCheckoutSessionParams({
        event,
        attendeeName,
        attendeeEmail,
        amount,
        promo,
        baseUrl,
        mode: checkoutMode,
      }),
    )

    await trackInsightEvent('checkout_session_created', {
      route: '/events/checkout',
      email: attendeeEmail,
      checkoutId: session.id,
      sessionId: journeyId,
      properties: {
        event_slug: event.slug,
        amount,
        applied_promo_code: promo?.code ?? null,
        checkout_mode: checkoutMode,
      },
    })

    return NextResponse.json({
      clientSecret: session.client_secret,
      checkoutUrl: session.url,
      sessionId: session.id,
      completed: false,
      appliedPromoCode: promo?.code ?? null,
      amount,
      checkoutMode,
    })
  } catch (error) {
    console.error('event checkout session error', error)
    await trackInsightEvent('checkout_failed', {
      route: '/events/checkout',
      properties: { reason: 'exception' },
    })
    return NextResponse.json({ error: 'Unable to create checkout session.' }, { status: 500 })
  }
}
