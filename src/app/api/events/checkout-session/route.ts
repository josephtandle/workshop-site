import { NextResponse } from 'next/server'
import { getEventBySlug } from '@/lib/events'
import {
  sendAiContentCreationSetupEmail,
  sendAskAnAiExpertWelcomeEmail,
  sendEventConfirmationEmail,
  sendRegistrationBackupAlert,
} from '@/lib/event-confirmation-email'
import { withTimeout } from '@/lib/with-timeout'
import { inviteAttendeeBestEffort, syncLegacyRegistration } from '@/lib/legacy-event-schedule'
import { createStripeClient, getStripePublishableKey } from '@/lib/stripe'
import { saveRegistration, saveRegistrationIntake } from '@/lib/event-registration-db'
import {
  attachCheckoutToEventSeat,
  claimEventSeat,
  confirmEventSeat,
  releaseEventSeat,
} from '@/lib/event-capacity'
import { normalizeWhatsappNumber, validateIntakeFields } from '@/lib/event-intake'
import { toOrigin } from '@/lib/url-utils'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { trackInsightEvent } from '@/lib/insight-to-fix'
import {
  buildEventCheckoutSessionParams,
  resolveCheckoutMode,
  resolveEventCheckoutAmount,
} from '@/lib/event-checkout'
import { toStripeUnitAmount } from '@/lib/stripe-amount'
import { isValidEmail } from '@/lib/email-validation'
import { isEventEnded, isEventRegistrationClosed } from '@/lib/event-status'

export const runtime = 'nodejs'

function getBaseUrl(request: Request) {
  const envOrigin = toOrigin(process.env.NEXT_PUBLIC_SITE_URL)
  if (envOrigin) return envOrigin

  const requestOrigin = toOrigin(request.url)
  if (requestOrigin) return requestOrigin

  return 'https://workshop.mastermindshq.business'
}

export async function POST(request: Request) {
  let seatReservationToRelease: string | null = null
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
    const attendeeEmail = typeof body.attendeeEmail === 'string' ? body.attendeeEmail.trim().toLowerCase() : ''
    const promoCode = typeof body.promoCode === 'string' ? body.promoCode.trim() : ''
    const journeyId = typeof body.journeyId === 'string' ? body.journeyId.trim() : ''
    const acquisitionRoute = typeof body.acquisitionRoute === 'string' ? body.acquisitionRoute.trim() : '/events'
    const acquisitionQuery = typeof body.acquisitionQuery === 'string' ? body.acquisitionQuery.trim() : ''
    const referrer = typeof body.referrer === 'string' ? body.referrer.trim() : ''
    const acquisitionRef =
      typeof body.acquisitionRef === 'string' && body.acquisitionRef.trim()
        ? body.acquisitionRef.trim().toLowerCase()
        : 'joe-che'
    const rawDonationAmount = typeof body.donationAmount === 'number' ? body.donationAmount : null
    const requestedCheckoutMode = typeof body.checkoutMode === 'string' ? body.checkoutMode.trim() : null
    const whatsappNumber = typeof body.whatsappNumber === 'string' ? body.whatsappNumber.trim() : ''
    const businessContext = typeof body.businessContext === 'string' ? body.businessContext.trim() : ''

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

    if (!isValidEmail(attendeeEmail)) {
      await trackInsightEvent('checkout_failed', {
        route: '/events/checkout',
        properties: { reason: 'invalid_email', slug },
      })
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
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

    if (isEventEnded(event)) {
      await trackInsightEvent('checkout_failed', {
        route: '/events/checkout',
        email: attendeeEmail,
        properties: { reason: 'event_ended', slug },
      })
      return NextResponse.json({ error: 'This event has ended.' }, { status: 410 })
    }

    if (isEventRegistrationClosed(event)) {
      await trackInsightEvent('checkout_failed', {
        route: '/events/checkout',
        email: attendeeEmail,
        properties: { reason: 'registration_closed', slug },
      })
      return NextResponse.json({ error: 'Registration is now closed for this event.' }, { status: 410 })
    }

    // Server-side mirror of the form validation. The client checks these too,
    // but the client can be bypassed.
    let intakeSaveError: unknown = null
    const requiresIntake = Boolean(
      event.intakeFields?.whatsappNumber || event.intakeFields?.businessContext,
    )
    if (requiresIntake) {
      const intakeErrors = validateIntakeFields({
        whatsappNumber,
        businessContext,
        businessContextMinLength: event.intakeFields?.businessContextMinLength,
      })
      const firstError = intakeErrors.whatsappNumber || intakeErrors.businessContext
      if (firstError) {
        await trackInsightEvent('checkout_failed', {
          route: '/events/checkout',
          email: attendeeEmail,
          properties: { reason: 'invalid_intake_fields', slug },
        })
        return NextResponse.json({ error: firstError }, { status: 400 })
      }

      // Stored before checkout so a long answer never has to survive Stripe
      // metadata, and so abandoned checkouts still leave us the answers.
      // Bounded: a failure here only blocks PAID checkouts (rethrown below once
      // the amount is known). Free sign-ups carry on and file a backup record.
      try {
        await withTimeout(
          saveRegistrationIntake({
            eventSlug: slug,
            attendeeName,
            attendeeEmail,
            whatsappNumber: normalizeWhatsappNumber(whatsappNumber),
            businessContext,
            acquisitionRef,
          }),
          5000,
          'save registration intake',
        )
      } catch (intakeError) {
        intakeSaveError = intakeError
        console.error('registration intake save failed', intakeError)
      }
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

    if (intakeSaveError && unitAmount > 0) throw intakeSaveError

    const seatClaim = event.capacityReservation
      ? await claimEventSeat(event, attendeeEmail)
      : null

    if (seatClaim?.status === 'full') {
      return NextResponse.json(
        {
          code: 'EVENT_CAPACITY_FULL',
          error: 'This dinner is currently full. Please join the waitlist and we will email you if a seat opens.',
        },
        { status: 409 },
      )
    }

    if (seatClaim?.status === 'confirmed') {
      return NextResponse.json({ error: 'You are already registered for this event.' }, { status: 409 })
    }

    if (seatClaim?.checkoutSessionId) {
      return NextResponse.json(
        { error: 'You already have a checkout in progress. Please complete it before starting another one.' },
        { status: 409 },
      )
    }

    if (seatClaim?.status === 'held') {
      seatReservationToRelease = seatClaim.reservationId
    }

    await trackInsightEvent('lead_acquired', {
        route: acquisitionRoute,
        email: attendeeEmail,
        sessionId: journeyId,
        properties: {
          acquisition_query: acquisitionQuery,
          acquisition_ref: acquisitionRef,
          referrer,
          event_slug: event.slug,
          source: 'event_registration',
        },
      })

    if (unitAmount === 0) {
      if (seatClaim) {
        await confirmEventSeat(seatClaim.reservationId)
      }

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
        const saved = await withTimeout(
          saveRegistration({
            eventSlug: slug,
            attendeeName,
            attendeeEmail,
            acquisitionRef,
            amountPaid: amount,
            whatsappNumber: normalizeWhatsappNumber(whatsappNumber) || null,
            businessContext: businessContext || null,
            capacityReservationId: seatClaim?.reservationId,
          }),
          6000,
          'save registration',
        )
        cancelToken = saved.cancelToken
      } catch (regErr) {
        console.error('event registration save error', regErr)
        if (seatClaim) throw regErr
        // Confirmed to the attendee anyway, so keep a record they can be
        // re-added from. Never let the backup itself fail the sign-up.
        await withTimeout(
          sendRegistrationBackupAlert({
            event,
            attendeeName,
            attendeeEmail,
            whatsappNumber: normalizeWhatsappNumber(whatsappNumber) || null,
            businessContext: businessContext || null,
            acquisitionRef,
            reason: regErr instanceof Error ? regErr.message : 'unknown error',
          }),
          5000,
          'registration backup alert',
        ).catch((alertErr) => console.error('registration backup alert failed', alertErr))
      }

      seatReservationToRelease = null

      try {
        if (event.slug === 'ask-an-ai-expert') {
          await sendAskAnAiExpertWelcomeEmail({
            event,
            attendeeName,
            attendeeEmail,
          })
        } else {
          await sendEventConfirmationEmail({
            event,
            attendeeName,
            attendeeEmail,
            cancelToken,
          })
        }
        if (event.slug === 'ai-avatar-content-creation') {
          await sendAiContentCreationSetupEmail({
            attendeeName,
            attendeeEmail,
          })
        }
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

      // Send a real Google Calendar invite so the event lands in their own
      // calendar. Best effort: never let this fail a completed registration.
      // Shared with the paid path via inviteAttendeeBestEffort, so free and
      // paid registrants always get the same invite.
      const calendarInviteStatus = await withTimeout(
        inviteAttendeeBestEffort(event, attendeeEmail, attendeeName),
        6000,
        'calendar invite',
      ).catch(() => 'failed' as const)

      await trackInsightEvent('checkout_completed', {
        route: '/events/checkout',
        email: attendeeEmail,
        sessionId: journeyId,
        properties: {
          event_slug: event.slug,
          free_checkout: true,
          calendar_invite: calendarInviteStatus,
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
    const seatReservation = seatClaim
      ? {
          reservationId: seatClaim.reservationId,
          // Stripe requires at least 30 minutes from session creation. The
          // reservation itself has a one-minute settlement buffer beyond this
          // customer-facing checkout window.
          expiresAtUnix: Math.ceil((Date.now() + (30 * 60 + 15) * 1000) / 1000),
        }
      : undefined

    const session = await stripe.checkout.sessions.create(
      buildEventCheckoutSessionParams({
        event,
        attendeeName,
        attendeeEmail,
        amount,
        promo,
        baseUrl,
        mode: checkoutMode,
        seatReservation,
      }),
    )

    if (seatClaim) {
      try {
        await attachCheckoutToEventSeat(seatClaim.reservationId, session.id)
      } catch (error) {
        await stripe.checkout.sessions.expire(session.id).catch(() => undefined)
        throw error
      }
      seatReservationToRelease = null
    }

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
    if (seatReservationToRelease) {
      await releaseEventSeat(seatReservationToRelease).catch((releaseError) => {
        console.error('event seat release after checkout error', releaseError)
      })
    }
    console.error('event checkout session error', error)
    await trackInsightEvent('checkout_failed', {
      route: '/events/checkout',
      properties: { reason: 'exception' },
    })
    return NextResponse.json({ error: 'Unable to create checkout session.' }, { status: 500 })
  }
}
