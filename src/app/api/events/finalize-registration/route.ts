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
      },
    })
    await trackInsightEvent('delivery_completed', {
      route: '/events/finalize-registration',
      checkoutId: sessionId,
      properties: {
        event_slug: event.slug,
        delivery_type: 'paid_event_registration',
        status: result.status,
      },
    })

    return NextResponse.json({
      ok: true,
      status: result.status,
      message: result.message,
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
