import assert from 'node:assert/strict'
import test from 'node:test'

import { getEventBySlug } from '../src/lib/events'
import {
  buildSessionReminderIdempotencyKey,
  buildSessionReminderLockKey,
  isSessionReminderDue,
  runSessionReminders,
} from '../src/lib/session-reminder'
import { sendSessionReminderEmail } from '../src/lib/event-confirmation-email'

test('session reminder due window opens 24h before and 2h before the workshop', () => {
  const eventStartIso = '2026-07-28T19:00:00+08:00'

  assert.equal(
    isSessionReminderDue({
      eventStartIso,
      leadHours: 24,
      now: new Date('2026-07-27T19:20:00+08:00'),
    }),
    true,
  )
  assert.equal(
    isSessionReminderDue({
      eventStartIso,
      leadHours: 24,
      now: new Date('2026-07-27T18:00:00+08:00'),
    }),
    false,
  )

  assert.equal(
    isSessionReminderDue({
      eventStartIso,
      leadHours: 2,
      now: new Date('2026-07-28T17:20:00+08:00'),
    }),
    true,
  )
  assert.equal(
    isSessionReminderDue({
      eventStartIso,
      leadHours: 2,
      now: new Date('2026-07-28T15:50:00+08:00'),
    }),
    false,
  )
})

test('session reminder idempotency key and lock key are stable', () => {
  const event = getEventBySlug('ask-an-ai-expert')
  assert.ok(event?.calendarEvent)

  const idempotencyKey = buildSessionReminderIdempotencyKey({
    slug: event.slug,
    attendeeEmail: 'Joe@Example.com',
    eventStartIso: event.calendarEvent.startIso,
    windowLabel: 't24h',
  })
  const lockKey = buildSessionReminderLockKey({
    slug: event.slug,
    windowLabel: 't24h',
    now: new Date('2026-07-27T19:20:00+08:00'),
  })

  assert.equal(
    idempotencyKey,
    buildSessionReminderIdempotencyKey({
      slug: event.slug,
      attendeeEmail: 'joe@example.com',
      eventStartIso: event.calendarEvent.startIso,
      windowLabel: 't24h',
    }),
  )
  assert.equal(lockKey, 'session-reminders/t24h/ask-an-ai-expert/2026-07-27')
})

test('session reminders dedupe duplicate registrations and skip a locked second run', async () => {
  const event = getEventBySlug('ask-an-ai-expert')
  assert.ok(event?.calendarEvent)

  const sent: Array<{ email: string; windowLabel: string }> = []
  const locks = new Set<string>()

  const run = async () =>
    runSessionReminders(
      {
        now: new Date('2026-07-27T19:20:00+08:00'),
        events: [event],
        force: false,
        dryRun: false,
      },
      {
        acquireLock: async (lockKey) => {
          if (locks.has(lockKey)) return false
          locks.add(lockKey)
          return true
        },
        listConfirmedRegistrations: async () => [
          { attendeeName: 'Joe', attendeeEmail: 'joe@example.com' },
          { attendeeName: 'JOE', attendeeEmail: 'JOE@example.com' },
          { attendeeName: 'Helix', attendeeEmail: 'helix@example.com' },
        ],
        sendReminder: async ({ attendeeEmail, windowLabel }) => {
          sent.push({ email: attendeeEmail, windowLabel })
        },
      },
    )

  await run()
  await run()

  assert.equal(sent.length, 2)
  assert.deepEqual(sent, [
    { email: 'joe@example.com', windowLabel: 't24h' },
    { email: 'helix@example.com', windowLabel: 't24h' },
  ])
})

test('session reminder emails include the Zoom link and the workshop time', async () => {
  const event = getEventBySlug('ask-an-ai-expert')
  assert.ok(event)

  const originalFetch = global.fetch
  const originalApiKey = process.env.RESEND_API_KEY
  const requests: Array<{ subject: string; html: string }> = []

  process.env.RESEND_API_KEY = 'test_key'
  global.fetch = async (_input, init) => {
    const body = JSON.parse(typeof init?.body === 'string' ? init.body : '{}')
    requests.push({ subject: body.subject, html: body.html })
    return new Response(JSON.stringify({ id: 'email_test' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  try {
    await sendSessionReminderEmail({
      event,
      attendeeName: 'Joe Che',
      attendeeEmail: 'joe@mastermindshq.business',
      windowLabel: 't24h',
    })
  } finally {
    global.fetch = originalFetch
    process.env.RESEND_API_KEY = originalApiKey
  }

  assert.equal(requests.length, 1)
  assert.match(requests[0].subject, /24 hour reminder/i)
  assert.ok(requests[0].html.includes('https://us02web.zoom.us/j/81275409884'))
  assert.ok(requests[0].html.includes('Tuesday, July 28, 2026'))
  assert.ok(requests[0].html.includes('7:00 PM to 9:00 PM Asia/Makassar (Bali)'))
})
