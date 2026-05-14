import { NextResponse, type NextRequest } from 'next/server'
import { getLiveEvents } from '@/lib/events'
import { getActiveWaitlist, hasOpenSpots } from '@/lib/event-registration-db'
import { sendWaitlistSpotNotificationEmail } from '@/lib/event-confirmation-email'

export const runtime = 'nodejs'

const WINDOW_MINUTES = 60

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false
  return request.headers.get('authorization') === `Bearer ${secret}`
}

function hoursUntilEvent(eventStartIso: string, now: Date): number {
  const eventMs = new Date(eventStartIso).getTime()
  return (eventMs - now.getTime()) / (1000 * 60 * 60)
}

function buildIdempotencyKey(slug: string, email: string, windowLabel: string): string {
  return `waitlist-spot-${windowLabel}/${slug}/${email.trim().toLowerCase()}`
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const nowParam = url.searchParams.get('now')
  const now = nowParam ? new Date(nowParam) : new Date()

  if (Number.isNaN(now.getTime())) {
    return NextResponse.json({ error: 'Invalid now parameter.' }, { status: 400 })
  }

  const liveEvents = getLiveEvents()
  const results: Array<{
    slug: string
    window: string | null
    waitlistCount: number
    sentCount: number
    errors: string[]
  }> = []

  for (const event of liveEvents) {
    if (!event.privateLocationReminder?.eventStartIso) continue

    const hours = hoursUntilEvent(event.privateLocationReminder.eventStartIso, now)

    // Determine which window we are in (T-5h: 4.5–5.5h, T-2h: 1.5–2.5h)
    let windowLabel: string | null = null
    let variant: 'cancellation' | 't2h' | null = null

    if (hours >= 4.5 && hours < 5.5) {
      windowLabel = 't5h'
      variant = 'cancellation'
    } else if (hours >= 1.5 && hours < 2.5) {
      windowLabel = 't2h'
      variant = 't2h'
    }

    if (!windowLabel || !variant) {
      results.push({ slug: event.slug, window: null, waitlistCount: 0, sentCount: 0, errors: [] })
      continue
    }

    const open = await hasOpenSpots(event)
    if (!open) {
      results.push({ slug: event.slug, window: windowLabel, waitlistCount: 0, sentCount: 0, errors: [] })
      continue
    }

    const waitlist = await getActiveWaitlist(event.slug)
    if (waitlist.length === 0) {
      results.push({ slug: event.slug, window: windowLabel, waitlistCount: 0, sentCount: 0, errors: [] })
      continue
    }

    const errors: string[] = []
    let sentCount = 0

    for (const entry of waitlist) {
      const idempotencyKey = buildIdempotencyKey(event.slug, entry.email, windowLabel)

      try {
        await sendWaitlistSpotNotificationEmail({
          event,
          name: entry.name,
          email: entry.email,
          removeToken: entry.removeToken,
          variant,
          idempotencyKey,
        })
        sentCount += 1
      } catch (err) {
        errors.push(`${entry.email}: ${err instanceof Error ? err.message : 'Unknown error.'}`)
      }
    }

    results.push({
      slug: event.slug,
      window: windowLabel,
      waitlistCount: waitlist.length,
      sentCount,
      errors,
    })
  }

  return NextResponse.json({
    ok: true,
    now: now.toISOString(),
    windowMinutes: WINDOW_MINUTES,
    results,
  })
}
