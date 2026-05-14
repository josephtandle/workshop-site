import { NextResponse, type NextRequest } from 'next/server'
import { getEventBySlug, getLiveEvents } from '@/lib/events'
import { sendEventLocationReminderEmail } from '@/lib/event-confirmation-email'
import { listLegacyPaidAttendeesForEvent } from '@/lib/legacy-event-schedule'
import { isLocationReminderDue } from '@/lib/location-reminder'

export const runtime = 'nodejs'

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false
  return request.headers.get('authorization') === `Bearer ${secret}`
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const nowParam = url.searchParams.get('now')
  const slug = url.searchParams.get('slug')
  const force = url.searchParams.get('force') === '1'
  const dryRun = url.searchParams.get('dryRun') === '1'
  const now = nowParam ? new Date(nowParam) : new Date()

  if (Number.isNaN(now.getTime())) {
    return NextResponse.json({ error: 'Invalid now parameter.' }, { status: 400 })
  }

  const events = slug
    ? [getEventBySlug(slug)].filter(Boolean)
    : getLiveEvents()

  const dueEvents = events.filter((event) => {
    if (!event?.privateLocationReminder) return false
    if (force) return true

    return isLocationReminderDue({
      eventStartIso: event.privateLocationReminder.eventStartIso,
      leadHours: event.privateLocationReminder.leadHours,
      now,
    })
  })

  const results: Array<{
    slug: string
    attendeeCount: number
    sentCount: number
    dryRun: boolean
    errors: string[]
  }> = []

  for (const event of dueEvents) {
    if (!event) continue

    const attendees = await listLegacyPaidAttendeesForEvent(event)
    const errors: string[] = []
    let sentCount = 0

    for (const attendee of attendees) {
      if (dryRun) {
        sentCount += 1
        continue
      }

      try {
        await sendEventLocationReminderEmail({
          event,
          attendeeName: attendee.attendeeName,
          attendeeEmail: attendee.attendeeEmail,
        })
        sentCount += 1
      } catch (error) {
        errors.push(
          `${attendee.attendeeEmail}: ${error instanceof Error ? error.message : 'Unknown send error.'}`,
        )
      }
    }

    results.push({
      slug: event.slug,
      attendeeCount: attendees.length,
      sentCount,
      dryRun,
      errors,
    })
  }

  return NextResponse.json({
    ok: true,
    now: now.toISOString(),
    dueEventCount: dueEvents.length,
    force,
    dryRun,
    results,
  })
}
