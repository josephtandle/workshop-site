import { NextResponse } from 'next/server'
import { getEventBySlug } from '@/lib/events'
import { finalizeLegacyCheckoutSession } from '@/lib/legacy-event-schedule'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : ''
    const slug = typeof body.slug === 'string' ? body.slug.trim() : ''

    if (!sessionId || !slug) {
      return NextResponse.json({ error: 'Missing checkout session details.' }, { status: 400 })
    }

    if (!/^cs_[a-zA-Z0-9_]{1,200}$/.test(sessionId)) {
      return NextResponse.json({ error: 'Invalid session ID.' }, { status: 400 })
    }

    const event = getEventBySlug(slug)
    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    }

    const result = await finalizeLegacyCheckoutSession({ event, sessionId })

    return NextResponse.json({
      ok: true,
      status: result.status,
      message: result.message,
    })
  } catch (error) {
    console.error('event finalize registration error', error)
    return NextResponse.json({ error: 'Unable to finalize registration.' }, { status: 500 })
  }
}
