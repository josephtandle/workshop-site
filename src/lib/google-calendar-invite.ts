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

export function resolveCalendarEventId(event: EventDefinition, sharedEventId = process.env.GOOGLE_WORKSHOP_CALENDAR_EVENT_ID?.trim() || '') {
  // One env var per event keeps this generic: GOOGLE_CALENDAR_EVENT_ID_<SLUG>,
  // then uses the checked-in event id and finally the single workshop fallback.
  // The environment override is intentionally first so an event can be
  // recreated without a code redeploy.
  const key = `GOOGLE_CALENDAR_EVENT_ID_${event.slug.replace(/-/g, '_').toUpperCase()}`
  return process.env[key]?.trim() || event.calendarEvent?.googleCalendarEventId || sharedEventId
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

  const eventId = resolveCalendarEventId(event)
  if (!eventId) return { status: 'skipped', reason: `no calendar event id for ${event.slug}` }

  const auth = getAuth()
  if (!auth) return { status: 'skipped', reason: 'google oauth env vars missing' }

  try {
    const calendar = google.calendar({ version: 'v3', auth })
    const existing = await calendar.events.get({ calendarId: CALENDAR_ID, eventId })

    // The resolver falls back to a single shared GOOGLE_WORKSHOP_CALENDAR_EVENT_ID.
    // When a new workshop ships without its own id, that fallback still points at
    // the PREVIOUS workshop, and every registrant is silently invited to an event
    // on the wrong date. That is exactly what happened to the 29 Sep 2026 free
    // class: 16 people were added to the 29 July 2026 entry (Illy, 2026-09-23).
    // Never add a guest to an entry whose start does not match the event page.
    const expectedStart = event.calendarEvent?.startIso
    const actualStart = existing.data.start?.dateTime || existing.data.start?.date
    if (expectedStart && actualStart) {
      const expectedDay = new Date(expectedStart).toISOString().slice(0, 10)
      const actualDay = new Date(actualStart).toISOString().slice(0, 10)
      if (expectedDay !== actualDay) {
        console.error(
          `[calendar-invite] WRONG EVENT for ${event.slug}: calendar entry ${eventId} starts ${actualDay}, page says ${expectedDay}. Refusing to invite ${email}. Set GOOGLE_CALENDAR_EVENT_ID_${event.slug.replace(/-/g, '_').toUpperCase()}.`,
        )
        return {
          status: 'failed',
          reason: `calendar entry ${eventId} is dated ${actualDay}, event page is ${expectedDay}`,
        }
      }
    }

    const attendees = existing.data.attendees || []

    // Registrants must never see each other. Google defaults to letting every
    // guest see the full guest list, which exposed every registrant's name and
    // email on the free workshop invite (Illy, 2026-09-21). Enforced on every
    // registration so an event created with the default is corrected too.
    const guestPrivacy = { guestsCanSeeOtherGuests: false, guestsCanInviteOthers: false }

    if (attendees.some((a) => a.email?.toLowerCase() === email)) {
      if (existing.data.guestsCanSeeOtherGuests !== false || existing.data.guestsCanInviteOthers !== false) {
        await calendar.events.patch({
          calendarId: CALENDAR_ID,
          eventId,
          sendUpdates: 'none',
          requestBody: guestPrivacy,
        })
      }
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
        ...guestPrivacy,
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
