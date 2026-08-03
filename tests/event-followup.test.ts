import assert from 'node:assert/strict'
import test from 'node:test'

import { getEventBySlug } from '../src/lib/events'
import {
  DEFAULT_FOLLOWUP_LEAD_HOURS,
  buildEventFollowupEmailHtml,
  buildEventFollowupIdempotencyKey,
  buildEventFollowupLockKey,
  buildEventFollowupSubject,
  isEventFollowupDue,
  runEventFollowups,
  sendEventFollowupEmail,
} from '../src/lib/event-followup'

const SLUG = 'ask-an-ai-expert'
// ask-an-ai-expert ends 2026-07-29T21:00:00+08:00, so the default 20h
// follow-up opens at 2026-07-30T17:00:00+08:00.
const AFTER_END_IN_WINDOW = new Date('2026-07-30T17:20:00+08:00')

test('follow-up fires AFTER the event end plus a positive lead, never before', () => {
  const eventEndIso = '2026-07-29T21:00:00+08:00'

  assert.equal(DEFAULT_FOLLOWUP_LEAD_HOURS, 20)

  // Inside the window that opens at end + 20h.
  assert.equal(
    isEventFollowupDue({ eventEndIso, now: new Date('2026-07-30T17:20:00+08:00') }),
    true,
  )
  // Before the window opens.
  assert.equal(
    isEventFollowupDue({ eventEndIso, now: new Date('2026-07-30T16:00:00+08:00') }),
    false,
  )
  // After the window closes.
  assert.equal(
    isEventFollowupDue({ eventEndIso, now: new Date('2026-07-30T19:00:00+08:00') }),
    false,
  )
  // Event has not ended yet: never due, whatever the lead.
  assert.equal(
    isEventFollowupDue({ eventEndIso, leadHours: 0, now: new Date('2026-07-29T20:00:00+08:00') }),
    false,
  )
  // Zero lead fires right at the end of the event.
  assert.equal(
    isEventFollowupDue({ eventEndIso, leadHours: 0, now: new Date('2026-07-29T21:10:00+08:00') }),
    true,
  )
})

test('follow-up idempotency key and lock key are stable and email-normalised', () => {
  const event = getEventBySlug(SLUG)
  assert.ok(event?.calendarEvent)

  const key = buildEventFollowupIdempotencyKey({
    slug: event.slug,
    attendeeEmail: 'Joe@Example.com',
    eventEndIso: event.calendarEvent.endIso,
  })

  assert.equal(
    key,
    buildEventFollowupIdempotencyKey({
      slug: event.slug,
      attendeeEmail: 'joe@example.com',
      eventEndIso: event.calendarEvent.endIso,
    }),
  )
  assert.match(key, /^event-followup\/ask-an-ai-expert\//)

  assert.equal(
    buildEventFollowupLockKey({ slug: event.slug, now: AFTER_END_IN_WINDOW }),
    'event-followups/ask-an-ai-expert/2026-07-30',
  )
})

test('follow-up run dedupes attendees, skips suppressed, and skips a locked re-run', async () => {
  const event = getEventBySlug(SLUG)
  assert.ok(event?.calendarEvent)

  const sent: string[] = []
  const locks = new Set<string>()

  const run = async () =>
    runEventFollowups(
      {
        now: AFTER_END_IN_WINDOW,
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
          { attendeeName: 'Gone', attendeeEmail: 'gone@example.com' },
        ],
        sendFollowup: async ({ attendeeEmail }) => {
          sent.push(attendeeEmail)
        },
        isSuppressed: async (email) => email.trim().toLowerCase() === 'gone@example.com',
      },
    )

  const first = await run()
  const second = await run()

  assert.deepEqual(sent, ['joe@example.com', 'helix@example.com'])
  assert.equal(first.results.length, 1)
  assert.equal(first.results[0].attendeeCount, 3)
  assert.equal(first.results[0].sentCount, 2)
  assert.equal(first.results[0].suppressedCount, 1)
  assert.deepEqual(first.results[0].errors, [])
  // Second run is locked out: no results, no extra sends.
  assert.equal(second.results.length, 0)
})

test('follow-up never runs for an event that has not ended, even with force', async () => {
  const event = getEventBySlug(SLUG)
  assert.ok(event?.calendarEvent)

  const sent: string[] = []
  const run = await runEventFollowups(
    {
      now: new Date('2026-07-29T20:00:00+08:00'),
      events: [event],
      force: true,
      dryRun: false,
    },
    {
      acquireLock: async () => true,
      listConfirmedRegistrations: async () => [
        { attendeeName: 'Joe', attendeeEmail: 'joe@example.com' },
      ],
      sendFollowup: async ({ attendeeEmail }) => {
        sent.push(attendeeEmail)
      },
      isSuppressed: async () => false,
    },
  )

  assert.deepEqual(run.results, [])
  assert.deepEqual(sent, [])
})

test('follow-up dry run counts recipients without sending or locking', async () => {
  const event = getEventBySlug(SLUG)
  assert.ok(event?.calendarEvent)

  const sent: string[] = []
  let lockAttempts = 0

  const run = await runEventFollowups(
    {
      now: AFTER_END_IN_WINDOW,
      events: [event],
      dryRun: true,
    },
    {
      acquireLock: async () => {
        lockAttempts += 1
        return true
      },
      listConfirmedRegistrations: async () => [
        { attendeeName: 'Joe', attendeeEmail: 'joe@example.com' },
        { attendeeName: 'Helix', attendeeEmail: 'helix@example.com' },
      ],
      sendFollowup: async ({ attendeeEmail }) => {
        sent.push(attendeeEmail)
      },
      isSuppressed: async () => false,
    },
  )

  assert.equal(lockAttempts, 0)
  assert.deepEqual(sent, [])
  assert.equal(run.results[0].dryRun, true)
  assert.equal(run.results[0].sentCount, 2)
})

test('follow-up copy obeys the content rules', () => {
  const event = getEventBySlug(SLUG)
  assert.ok(event)

  const subject = buildEventFollowupSubject(event)
  const html = buildEventFollowupEmailHtml(event, 'Joe Che', 'joe@mastermindshq.business')
  const text = `${subject}\n${html}`

  assert.ok(!text.includes('—'), 'no em dashes')
  assert.ok(!text.includes('!'), 'no exclamation points')
  assert.ok(!/excited to share/i.test(text), 'no "excited to share"')
  for (const slang of ['gutted', 'chuffed', 'brilliant', 'cheers', 'whilst', 'keen as']) {
    assert.ok(!new RegExp(`\\b${slang}\\b`, 'i').test(text), `no British slang: ${slang}`)
  }

  // Warm, short, with resources placeholder and exactly one invitation link.
  assert.match(html, /Hi Joe,/)
  assert.match(html, /Thanks for/i)
  assert.match(html, /recording/i)
  assert.equal((html.match(/https:\/\/mastermindshq\.business/g) ?? []).length, 1)
})

test('follow-up send carries the per-recipient idempotency key and unsubscribe headers', async () => {
  const event = getEventBySlug(SLUG)
  assert.ok(event?.calendarEvent)

  const originalFetch = global.fetch
  const originalApiKey = process.env.RESEND_API_KEY
  const originalSecret = process.env.UNSUBSCRIBE_TOKEN_SECRET
  const requests: Array<{ idempotencyKey: string | null; body: Record<string, unknown> }> = []

  process.env.RESEND_API_KEY = 'test_key'
  process.env.UNSUBSCRIBE_TOKEN_SECRET = 'test_secret'
  global.fetch = async (_input, init) => {
    const headers = new Headers(init?.headers as HeadersInit)
    requests.push({
      idempotencyKey: headers.get('Idempotency-Key'),
      body: JSON.parse(typeof init?.body === 'string' ? init.body : '{}'),
    })
    return new Response(JSON.stringify({ id: 'email_test' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  try {
    await sendEventFollowupEmail({
      event,
      attendeeName: 'Joe Che',
      attendeeEmail: 'joe@mastermindshq.business',
    })
  } finally {
    global.fetch = originalFetch
    process.env.RESEND_API_KEY = originalApiKey
    process.env.UNSUBSCRIBE_TOKEN_SECRET = originalSecret
  }

  assert.equal(requests.length, 1)
  assert.equal(
    requests[0].idempotencyKey,
    buildEventFollowupIdempotencyKey({
      slug: event.slug,
      attendeeEmail: 'joe@mastermindshq.business',
      eventEndIso: event.calendarEvent.endIso,
    }),
  )
  assert.equal(requests[0].body.from, 'Joe Che <joe@mastermindshq.business>')

  const headers = requests[0].body.headers as Record<string, string>
  assert.ok(headers['List-Unsubscribe'])
  assert.equal(headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click')
})
