import { google } from 'googleapis'

import type { EventDefinition } from './events'
import { buildEventCalendarDescription } from './calendar'

/**
 * Adds a registrant to the event's Google Calendar entry so the invite lands in
 * their own calendar. Mirrors addToCalendarLocal in
 * agents/stripe-webhook-ingress/src/processor.js, which is the proven pattern.
 *
 * Best effort by design: a calendar failure must never fail a registration, so
 * every path returns a result object instead of throwing.
 */

export type CalendarInviteResult =
  | { status: 'invited' }
  | { status: 'already-invited' }
  | { status: 'skipped'; reason: string }
  | { status: 'failed'; reason: string }

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID?.trim() || 'primary'

function eventIdFor(slug: string) {
  // One env var per event keeps this generic: GOOGLE_CALENDAR_EVENT_ID_<SLUG>,
  // falling back to the single workshop id.
  const key = `GOOGLE_CALENDAR_EVENT_ID_${slug.replace(/-/g, '_').toUpperCase()}`
  return process.env[key]?.trim() || process.env.GOOGLE_WORKSHOP_CALENDAR_EVENT_ID?.trim() || ''
}

function getAuth() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim()
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim()
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN?.trim()
  if (!clientId || !clientSecret || !refreshToken) return null
  const auth = new google.auth.OAuth2(clientId, clientSecret)
  auth.setCredentials({ refresh_token: refreshToken })
  return auth
}

export async function inviteAttendeeToEvent(
  event: EventDefinition,
  attendeeEmail: string,
  attendeeName?: string,
): Promise<CalendarInviteResult> {
  const email = attendeeEmail?.trim().toLowerCase()
  if (!email) return { status: 'skipped', reason: 'no email' }

  const eventId = eventIdFor(event.slug)
  if (!eventId) return { status: 'skipped', reason: `no calendar event id for ${event.slug}` }

  const auth = getAuth()
  if (!auth) return { status: 'skipped', reason: 'google oauth env vars missing' }

  try {
    const calendar = google.calendar({ version: 'v3', auth })
    const existing = await calendar.events.get({ calendarId: CALENDAR_ID, eventId })
    const attendees = existing.data.attendees || []
    if (attendees.some((a) => a.email?.toLowerCase() === email)) {
      return { status: 'already-invited' }
    }

    // Keep the calendar copy in step with the page on every registration, so the
    // description never drifts from the live event copy.
    const description = buildEventCalendarDescription(event)

    await calendar.events.patch({
      calendarId: CALENDAR_ID,
      eventId,
      sendUpdates: 'all',
      requestBody: {
        attendees: [...attendees, { email, displayName: attendeeName || undefined }],
        ...(description ? { description } : {}),
        ...(event.zoomLink ? { location: event.zoomLink } : {}),
      },
    })
    return { status: 'invited' }
  } catch (error) {
    return { status: 'failed', reason: error instanceof Error ? error.message : 'unknown error' }
  }
}
