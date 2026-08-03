import { NextResponse } from 'next/server'
import { getEventBySlug } from '@/lib/events'
import { finalizeLegacyCheckoutSession } from '@/lib/legacy-event-schedule'
import { trackInsightEvent } from '@/lib/insight-to-fix'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : ''
    const slug = typeof body.slug === 'string' ? body.slug.trim() : ''

    if (!sessionId || !slug) {
      await trackInsightEvent('checkout_finalize_failed', {
        route: '/events/finalize-registration',
        properties: { reason: 'missing_checkout_session_details', slug },
      })
      return NextResponse.json({ error: 'Missing checkout session details.' }, { status: 400 })
    }

    if (!/^cs_[a-zA-Z0-9_]{1,200}$/.test(sessionId)) {
      await trackInsightEvent('checkout_finalize_failed', {
        route: '/events/finalize-registration',
        properties: { reason: 'invalid_session_id', slug },
      })
      return NextResponse.json({ error: 'Invalid session ID.' }, { status: 400 })
    }

    const event = getEventBySlug(slug)
    if (!event) {
      await trackInsightEvent('checkout_finalize_failed', {
        route: '/events/finalize-registration',
        checkoutId: sessionId,
        properties: { reason: 'event_not_found', slug },
      })
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    }

    const result = await finalizeLegacyCheckoutSession({ event, sessionId })
    await trackInsightEvent('checkout_finalized', {
      route: '/events/finalize-registration',
      checkoutId: sessionId,
      properties: {
        event_slug: event.slug,
        status: result.status,
        calendar_invite: result.calendarInvite,
      },
    })
    await trackInsightEvent('delivery_completed', {
      route: '/events/finalize-registration',
      checkoutId: sessionId,
      properties: {
        event_slug: event.slug,
        delivery_type: 'paid_event_registration',
        status: result.status,
        calendar_invite: result.calendarInvite,
      },
    })

    // result.message is an INTERNAL Event Schedule sync status ("Legacy
    // registration disabled for this event.", "Legacy attendee created and
    // marked paid.") and must never reach the attendee. It shipped to a real
    // customer once already. Keep it for diagnostics under syncMessage and let
    // the client fall back to the event's own success copy.
    //
    // The one part an attendee genuinely needs to know is a failed confirmation
    // email, since that changes what they should expect in their inbox.
    const confirmationEmailFailed = /confirmation email failed/i.test(result.message)

    return NextResponse.json({
      ok: true,
      status: result.status,
      message: confirmationEmailFailed
        ? 'Your seat is reserved. The confirmation email did not send automatically, so keep this page for your records.'
        : null,
      syncStatus: result.status,
      syncMessage: result.message,
      calendarInvite: result.calendarInvite,
    })
  } catch (error) {
    console.error('event finalize registration error', error)
    await trackInsightEvent('checkout_finalize_failed', {
      route: '/events/finalize-registration',
      properties: { reason: 'exception' },
    })
    return NextResponse.json({ error: 'Unable to finalize registration.' }, { status: 500 })
  }
}
