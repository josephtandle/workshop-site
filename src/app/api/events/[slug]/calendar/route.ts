import { type NextRequest } from 'next/server'
import { getEventBySlug } from '@/lib/events'
import { buildIcalString } from '@/lib/calendar'

export const runtime = 'nodejs'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const event = getEventBySlug(slug)

  if (!event?.calendarEvent) {
    return new Response('Event not found.', { status: 404 })
  }

  const description = event.privateLocationReminder
    ? `Exact address will be emailed to you before the event. Area: ${event.locationLabel}`
    : event.locationLabel

  const ical = buildIcalString({
    uid: `${event.slug}@mastermindshq.business`,
    title: event.title,
    startIso: event.calendarEvent.startIso,
    endIso: event.calendarEvent.endIso,
    location: event.locationLabel,
    description,
  })

  return new Response(ical, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${event.slug}.ics"`,
    },
  })
}
