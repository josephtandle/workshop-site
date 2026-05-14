import assert from 'node:assert/strict'
import test from 'node:test'

import { sendEventLocationReminderEmail } from '../src/lib/event-confirmation-email'
import { getEventBySlug } from '../src/lib/events'
import {
  buildLocationReminderIdempotencyKey,
  dedupeAttendeesByEmail,
  isLocationReminderDue,
} from '../src/lib/location-reminder'

test('location reminder idempotency key is stable and normalizes email case', () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event?.privateLocationReminder)

  const firstKey = buildLocationReminderIdempotencyKey({
    slug: event.slug,
    attendeeEmail: 'Joe@MastermindsHQ.Business',
    eventStartIso: event.privateLocationReminder.eventStartIso,
  })

  const secondKey = buildLocationReminderIdempotencyKey({
    slug: event.slug,
    attendeeEmail: 'joe@mastermindshq.business',
    eventStartIso: event.privateLocationReminder.eventStartIso,
  })

  assert.equal(firstKey, secondKey)
})

test('location reminder due window opens four hours before the event', () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event?.privateLocationReminder)

  assert.equal(
    isLocationReminderDue({
      eventStartIso: event.privateLocationReminder.eventStartIso,
      leadHours: event.privateLocationReminder.leadHours,
      now: new Date('2026-05-29T23:35:00.000Z'),
    }),
    true,
  )

  // 22:00Z is 30 minutes before the window opens at 22:30Z — must be false
  assert.equal(
    isLocationReminderDue({
      eventStartIso: event.privateLocationReminder.eventStartIso,
      leadHours: event.privateLocationReminder.leadHours,
      now: new Date('2026-05-29T22:00:00.000Z'),
    }),
    false,
  )
})

test('attendee dedupe keeps one row per email', () => {
  const attendees = dedupeAttendeesByEmail([
    { attendeeName: 'Joe', attendeeEmail: 'joe@example.com' },
    { attendeeName: 'JOE', attendeeEmail: 'JOE@example.com' },
    { attendeeName: 'Helix', attendeeEmail: 'helix@example.com' },
  ])

  assert.deepEqual(attendees, [
    { attendeeName: 'Joe', attendeeEmail: 'joe@example.com' },
    { attendeeName: 'Helix', attendeeEmail: 'helix@example.com' },
  ])
})

test('location reminder send uses a deterministic Resend idempotency key', async () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event?.privateLocationReminder)

  const originalFetch = global.fetch
  const originalApiKey = process.env.RESEND_API_KEY
  const requests: Array<{ headers: HeadersInit | undefined }> = []

  process.env.RESEND_API_KEY = 'test_key'
  global.fetch = async (_input, init) => {
    requests.push({ headers: init?.headers })
    return new Response(JSON.stringify({ id: 'email_123' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  try {
    await sendEventLocationReminderEmail({
      event,
      attendeeName: 'Joe Che',
      attendeeEmail: 'joe@mastermindshq.business',
    })

    await sendEventLocationReminderEmail({
      event,
      attendeeName: 'Joe Che',
      attendeeEmail: 'joe@mastermindshq.business',
    })
  } finally {
    global.fetch = originalFetch
    process.env.RESEND_API_KEY = originalApiKey
  }

  assert.equal(requests.length, 2)

  const expectedKey = buildLocationReminderIdempotencyKey({
    slug: event.slug,
    attendeeEmail: 'joe@mastermindshq.business',
    eventStartIso: event.privateLocationReminder.eventStartIso,
  })

  const firstHeaders = requests[0].headers as Record<string, string>
  const secondHeaders = requests[1].headers as Record<string, string>

  assert.equal(firstHeaders['Idempotency-Key'], expectedKey)
  assert.equal(secondHeaders['Idempotency-Key'], expectedKey)
})
