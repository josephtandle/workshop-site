import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { getEventBySlug } from '../src/lib/events'
import {
  createSupabaseEventEmailLedger,
  normalizeLedgerEmail,
  type EventEmailLedger,
  type EventEmailLedgerRow,
} from '../src/lib/event-email-ledger'
import {
  buildLocationReminderLockKey,
  buildLocationReminderLedgerSlug,
  runLocationReminders,
} from '../src/lib/location-reminder'

const ROOT = process.cwd()
const LOCATION_REMINDERS_ROUTE = join(ROOT, 'src', 'app', 'api', 'events', 'location-reminders', 'route.ts')
const LOCATION_REMINDER_LIB = join(ROOT, 'src', 'lib', 'location-reminder.ts')
const VERCEL_CONFIG = join(ROOT, 'vercel.json')

test('normalizeLedgerEmail trims, lowercases, and validates email addresses', () => {
  assert.equal(normalizeLedgerEmail('  Joe@Example.com '), 'joe@example.com')
  assert.equal(normalizeLedgerEmail('HELIX@MastermindsHQ.business'), 'helix@mastermindshq.business')

  assert.throws(
    () => normalizeLedgerEmail(123 as unknown as string),
    /Email address must be a string/,
  )
  assert.throws(
    () => normalizeLedgerEmail('   '),
    /Invalid email address for ledger/,
  )
  assert.throws(
    () => normalizeLedgerEmail('invalid-email-without-at-sign'),
    /Invalid email address for ledger/,
  )
})

test('location reminder lock key and ledger slug are stable and keyed on eventStartIso', () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event?.privateLocationReminder)

  const lockKey = buildLocationReminderLockKey({
    slug: event.slug,
    eventStartIso: event.privateLocationReminder.eventStartIso,
  })

  const ledgerSlug = buildLocationReminderLedgerSlug({
    slug: event.slug,
    eventStartIso: event.privateLocationReminder.eventStartIso,
  })

  assert.equal(
    lockKey,
    `location-reminders/${event.slug}/${event.privateLocationReminder.eventStartIso}`,
  )
  assert.equal(
    ledgerSlug,
    `event-location-reminder/${event.slug}/${event.privateLocationReminder.eventStartIso}`,
  )
})

test('createSupabaseEventEmailLedger handles claim idempotency and non-23505 errors', async () => {
  const store = new Map<string, EventEmailLedgerRow>()

  const fakeSupabase = {
    from(table: string) {
      assert.equal(table, 'event_email_send_log')
      return {
        async insert(payload: Record<string, any>) {
          const key = `${payload.recipient_email}:${payload.slug}`
          if (store.has(key)) {
            return { data: null, error: { code: '23505', message: 'duplicate key' } }
          }
          const row: EventEmailLedgerRow = {
            recipient_email: payload.recipient_email,
            slug: payload.slug,
            status: payload.status,
            provider_id: null,
            sent_at: null,
            error: null,
            claimed_at: new Date().toISOString(),
          }
          store.set(key, row)
          return { data: [row], error: null }
        },
        select() {
          return {
            eq(field1: string, val1: string) {
              return {
                eq(field2: string, val2: string) {
                  return {
                    async maybeSingle() {
                      const email = field1 === 'recipient_email' ? val1 : val2
                      const slug = field1 === 'slug' ? val1 : val2
                      const key = `${email}:${slug}`
                      return { data: store.get(key) ?? null, error: null }
                    },
                  }
                },
              }
            },
          }
        },
        update(updates: Record<string, any>) {
          return {
            eq(field1: string, val1: string) {
              return {
                async eq(field2: string, val2: string) {
                  const email = field1 === 'recipient_email' ? val1 : val2
                  const slug = field1 === 'slug' ? val1 : val2
                  const key = `${email}:${slug}`
                  const existing = store.get(key)
                  if (existing) {
                    store.set(key, { ...existing, ...updates })
                  }
                  return { data: null, error: null }
                },
              }
            },
          }
        },
      }
    },
  }

  const ledger = createSupabaseEventEmailLedger({ client: fakeSupabase, source: 'test' })

  const claimedFirst = await ledger.claim({ recipientEmail: 'joe@example.com', slug: 'test-slug' })
  assert.equal(claimedFirst, true)

  const claimedSecond = await ledger.claim({ recipientEmail: 'joe@example.com', slug: 'test-slug' })
  assert.equal(claimedSecond, false)

  await ledger.markSent({ recipientEmail: 'joe@example.com', slug: 'test-slug', providerId: 'msg_123' })
  const record = await ledger.get({ recipientEmail: 'joe@example.com', slug: 'test-slug' })
  assert.equal(record?.status, 'sent')
  assert.equal(record?.provider_id, 'msg_123')

  const errorSupabase = {
    from() {
      return {
        async insert() {
          return { data: null, error: { code: '42P01', message: 'relation does not exist' } }
        },
      }
    },
  }
  const brokenLedger = createSupabaseEventEmailLedger({ client: errorSupabase })
  await assert.rejects(
    () => brokenLedger.claim({ recipientEmail: 'helix@example.com', slug: 'test-slug' }),
    /Supabase ledger claim error/,
  )
})

function createInMemoryLedger(): EventEmailLedger {
  const store = new Map<string, EventEmailLedgerRow>()
  return {
    async claim({ recipientEmail, slug }) {
      const normalized = normalizeLedgerEmail(recipientEmail)
      const key = `${normalized}:${slug}`
      if (store.has(key)) return false
      store.set(key, {
        recipient_email: normalized,
        slug,
        status: 'claimed',
        provider_id: null,
        sent_at: null,
        error: null,
        claimed_at: new Date().toISOString(),
      })
      return true
    },
    async get({ recipientEmail, slug }) {
      const normalized = normalizeLedgerEmail(recipientEmail)
      return store.get(`${normalized}:${slug}`) ?? null
    },
    async markSent({ recipientEmail, slug, providerId }) {
      const normalized = normalizeLedgerEmail(recipientEmail)
      const key = `${normalized}:${slug}`
      const existing = store.get(key)
      if (existing) {
        store.set(key, {
          ...existing,
          status: 'sent',
          provider_id: providerId ?? null,
          sent_at: new Date().toISOString(),
        })
      }
    },
    async markFailed({ recipientEmail, slug, error }) {
      const normalized = normalizeLedgerEmail(recipientEmail)
      const key = `${normalized}:${slug}`
      const existing = store.get(key)
      if (existing) {
        store.set(key, {
          ...existing,
          status: 'failed',
          error: error ?? null,
        })
      }
    },
  }
}

test('runLocationReminders dedupes attendees, acquires lock, sends via ledger, and skips second run', async () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event?.privateLocationReminder)

  const ledger = createInMemoryLedger()
  const sent: string[] = []
  const locks = new Set<string>()

  const attendees = [
    { attendeeName: 'Joe', attendeeEmail: 'joe@example.com' },
    { attendeeName: 'JOE', attendeeEmail: 'JOE@example.com' },
    { attendeeName: 'Helix', attendeeEmail: 'helix@example.com' },
  ]

  // eventStartIso is '2026-05-30T10:30:00+08:00', leadHours is 4h -> reminderAt is 06:30, windowEnd is 08:00
  const now = new Date('2026-05-30T07:00:00+08:00')

  const run1 = await runLocationReminders(
    { now, events: [event], force: false, dryRun: false },
    {
      acquireLock: async (lockKey) => {
        if (locks.has(lockKey)) return false
        locks.add(lockKey)
        return true
      },
      ledger,
      listAttendees: async () => attendees,
      sendReminder: async ({ attendeeEmail }) => {
        sent.push(attendeeEmail)
        return { id: `resend_${attendeeEmail}` }
      },
    },
  )

  assert.equal(run1.results.length, 1)
  assert.equal(run1.results[0].locked, true)
  assert.equal(run1.results[0].attendeeCount, 2)
  assert.equal(run1.results[0].sentCount, 2)
  assert.equal(run1.results[0].skippedAlreadySentCount, 0)
  assert.deepEqual(sent, ['joe@example.com', 'helix@example.com'])

  // Second run with same lock set -> lock fails
  const run2 = await runLocationReminders(
    { now, events: [event], force: false, dryRun: false },
    {
      acquireLock: async (lockKey) => {
        if (locks.has(lockKey)) return false
        locks.add(lockKey)
        return true
      },
      ledger,
      listAttendees: async () => attendees,
      sendReminder: async ({ attendeeEmail }) => {
        sent.push(attendeeEmail)
        return { id: `resend_${attendeeEmail}` }
      },
    },
  )

  assert.equal(run2.results[0].locked, false)
  assert.equal(run2.results[0].sentCount, 0)
  assert.equal(sent.length, 2) // No additional sends

  // Third run: lock cleared or forced, but ledger prevents duplicate sends
  locks.clear()
  const run3 = await runLocationReminders(
    { now, events: [event], force: true, dryRun: false },
    {
      acquireLock: async () => true,
      ledger,
      listAttendees: async () => attendees,
      sendReminder: async ({ attendeeEmail }) => {
        sent.push(attendeeEmail)
        return { id: `resend_${attendeeEmail}` }
      },
    },
  )

  assert.equal(run3.results[0].locked, true)
  assert.equal(run3.results[0].attendeeCount, 2)
  assert.equal(run3.results[0].sentCount, 0)
  assert.equal(run3.results[0].skippedAlreadySentCount, 2)
  assert.equal(sent.length, 2) // Still no additional sends!
})

test('runLocationReminders dryRun counts attendees without acquiring lock or calling send', async () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event?.privateLocationReminder)

  const ledger = createInMemoryLedger()
  let lockAcquired = false
  let sendCalled = false

  const attendees = [
    { attendeeName: 'Joe', attendeeEmail: 'joe@example.com' },
    { attendeeName: 'Helix', attendeeEmail: 'helix@example.com' },
  ]

  const now = new Date('2026-05-30T07:00:00+08:00')

  const res = await runLocationReminders(
    { now, events: [event], force: false, dryRun: true },
    {
      acquireLock: async () => {
        lockAcquired = true
        return true
      },
      ledger,
      listAttendees: async () => attendees,
      sendReminder: async () => {
        sendCalled = true
        return { id: 'test' }
      },
    },
  )

  assert.equal(res.results[0].dryRun, true)
  assert.equal(res.results[0].locked, true)
  assert.equal(res.results[0].attendeeCount, 2)
  assert.equal(res.results[0].sentCount, 2)
  assert.equal(res.results[0].skippedAlreadySentCount, 0)
  assert.equal(lockAcquired, false)
  assert.equal(sendCalled, false)

  const realSent: string[] = []
  const realRun = await runLocationReminders(
    { now, events: [event], force: false, dryRun: false },
    {
      acquireLock: async () => true,
      ledger,
      listAttendees: async () => attendees,
      sendReminder: async ({ attendeeEmail }) => {
        realSent.push(attendeeEmail)
        return { id: `resend_${attendeeEmail}` }
      },
    },
  )

  assert.equal(realRun.results[0].sentCount, attendees.length)
  assert.equal(realRun.results[0].skippedAlreadySentCount, 0)
  assert.deepEqual(realSent, attendees.map((attendee) => attendee.attendeeEmail))
})

test('two overlapping location-reminder cron processes send each attendee exactly once', async () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event?.privateLocationReminder)

  const ledger = createInMemoryLedger()
  const locks = new Set<string>()
  const sent: string[] = []
  const attendees = [
    { attendeeName: 'Joe', attendeeEmail: 'joe@example.com' },
    { attendeeName: 'Helix', attendeeEmail: 'helix@example.com' },
    { attendeeName: 'Ada', attendeeEmail: 'ada@example.com' },
  ]
  const now = new Date('2026-05-30T07:00:00+08:00')

  const makeDeps = () => ({
    acquireLock: async (lockKey: string) => {
      if (locks.has(lockKey)) return false
      locks.add(lockKey)
      return true
    },
    ledger,
    listAttendees: async () => attendees,
    sendReminder: async ({ attendeeEmail }: { attendeeEmail: string }) => {
      // This is the two-overlapping-cron-processes case, not two sequential ticks.
      await new Promise((r) => setTimeout(r, 5))
      sent.push(attendeeEmail)
      return { id: `resend_${attendeeEmail}` }
    },
  })

  await Promise.all([
    runLocationReminders({ now, events: [event], dryRun: false }, makeDeps()),
    runLocationReminders({ now, events: [event], dryRun: false }, makeDeps()),
  ])

  const uniqueAttendeeEmails = new Set(attendees.map((attendee) => attendee.attendeeEmail))
  assert.equal(sent.length, uniqueAttendeeEmails.size)
  assert.deepEqual(new Set(sent), uniqueAttendeeEmails)
})

test('new attendees in the reminder window are not over-blocked by the event ledger', async () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event?.privateLocationReminder)

  const ledger = createInMemoryLedger()
  const now = new Date('2026-05-30T07:00:00+08:00')
  const firstBatch = [{ attendeeName: 'Joe', attendeeEmail: 'joe@example.com' }]
  const allAttendees = [
    ...firstBatch,
    { attendeeName: 'Helix', attendeeEmail: 'helix@example.com' },
    { attendeeName: 'Ada', attendeeEmail: 'ada@example.com' },
  ]

  const firstSent: string[] = []
  await runLocationReminders(
    { now, events: [event], dryRun: false },
    {
      acquireLock: async () => true,
      ledger,
      listAttendees: async () => firstBatch,
      sendReminder: async ({ attendeeEmail }) => {
        firstSent.push(attendeeEmail)
        return { id: `resend_${attendeeEmail}` }
      },
    },
  )

  const secondSent: string[] = []
  const secondRun = await runLocationReminders(
    { now, events: [event], dryRun: false },
    {
      acquireLock: async () => true,
      ledger,
      listAttendees: async () => allAttendees,
      sendReminder: async ({ attendeeEmail }) => {
        secondSent.push(attendeeEmail)
        return { id: `resend_${attendeeEmail}` }
      },
    },
  )

  assert.deepEqual(firstSent, ['joe@example.com'])
  assert.deepEqual(secondSent, ['helix@example.com', 'ada@example.com'])
  assert.equal(secondRun.results[0].sentCount, 2)
  assert.equal(secondRun.results[0].skippedAlreadySentCount, 1)
})

test('ledger keys normalize attendee email casing and whitespace across runs', async () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event?.privateLocationReminder)

  const ledger = createInMemoryLedger()
  const now = new Date('2026-05-30T07:00:00+08:00')
  const sent: string[] = []

  await runLocationReminders(
    { now, events: [event], dryRun: false },
    {
      acquireLock: async () => true,
      ledger,
      listAttendees: async () => [{ attendeeName: 'Joe', attendeeEmail: 'Joe@Example.com' }],
      sendReminder: async ({ attendeeEmail }) => {
        sent.push(attendeeEmail)
        return { id: `resend_${attendeeEmail}` }
      },
    },
  )

  const secondRun = await runLocationReminders(
    { now, events: [event], dryRun: false },
    {
      acquireLock: async () => true,
      ledger,
      listAttendees: async () => [{ attendeeName: 'Joe', attendeeEmail: '  joe@example.COM ' }],
      sendReminder: async ({ attendeeEmail }) => {
        sent.push(attendeeEmail)
        return { id: `resend_${attendeeEmail}` }
      },
    },
  )

  assert.equal(sent.length, 1)
  assert.equal(secondRun.results[0].skippedAlreadySentCount, 1)
})

test('a mid-batch failure preserves already-sent attendees without auto-retrying the failure', async () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event?.privateLocationReminder)

  const ledger = createInMemoryLedger()
  const now = new Date('2026-05-30T07:00:00+08:00')
  const attendees = [
    { attendeeName: 'Joe', attendeeEmail: 'joe@example.com' },
    { attendeeName: 'Helix', attendeeEmail: 'helix@example.com' },
    { attendeeName: 'Ada', attendeeEmail: 'ada@example.com' },
  ]
  const attempted: string[] = []

  const firstRun = await runLocationReminders(
    { now, events: [event], dryRun: false },
    {
      acquireLock: async () => true,
      ledger,
      listAttendees: async () => attendees,
      sendReminder: async ({ attendeeEmail }) => {
        attempted.push(attendeeEmail)
        if (attendeeEmail === 'helix@example.com') {
          throw new Error('Resend HTTP 429: rate limited')
        }
        return { id: `resend_${attendeeEmail}` }
      },
    },
  )

  assert.equal(firstRun.results[0].sentCount, 2)
  assert.equal(firstRun.results[0].errors.length, 1)
  assert.match(firstRun.results[0].errors[0], /^helix@example\.com: .*429/)
  assert.deepEqual(attempted, attendees.map((attendee) => attendee.attendeeEmail))

  const ledgerSlug = buildLocationReminderLedgerSlug({
    slug: event.slug,
    eventStartIso: event.privateLocationReminder.eventStartIso,
  })
  const joeRecord = await ledger.get({ recipientEmail: 'joe@example.com', slug: ledgerSlug })
  const helixRecord = await ledger.get({ recipientEmail: 'helix@example.com', slug: ledgerSlug })
  const adaRecord = await ledger.get({ recipientEmail: 'ada@example.com', slug: ledgerSlug })
  assert.equal(joeRecord?.status, 'sent')
  assert.equal(helixRecord?.status, 'failed')
  assert.match(helixRecord?.error ?? '', /429/)
  assert.equal(adaRecord?.status, 'sent')

  const retryAttempts: string[] = []
  // A failed address is deliberately left for a human rather than auto-retried on the next tick.
  const secondRun = await runLocationReminders(
    { now, events: [event], dryRun: false },
    {
      acquireLock: async () => true,
      ledger,
      listAttendees: async () => attendees,
      sendReminder: async ({ attendeeEmail }) => {
        retryAttempts.push(attendeeEmail)
        return { id: `resend_${attendeeEmail}` }
      },
    },
  )

  assert.deepEqual(retryAttempts, [])
  assert.equal(secondRun.results[0].skippedAlreadySentCount, 3)
})

test('ledger claim failures fail closed without sending a reminder', async () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event?.privateLocationReminder)

  const attendees = [
    { attendeeName: 'Joe', attendeeEmail: 'joe@example.com' },
    { attendeeName: 'Helix', attendeeEmail: 'helix@example.com' },
  ]
  let sendCalled = false
  const unreachableLedger: EventEmailLedger = {
    async claim() {
      throw new Error('fetch failed')
    },
    async get() {
      throw new Error('get should not be called')
    },
    async markSent() {
      throw new Error('markSent should not be called')
    },
    async markFailed() {
      throw new Error('markFailed should not be called')
    },
  }

  const run = await runLocationReminders(
    { now: new Date('2026-05-30T07:00:00+08:00'), events: [event], dryRun: false },
    {
      acquireLock: async () => true,
      ledger: unreachableLedger,
      listAttendees: async () => attendees,
      sendReminder: async () => {
        sendCalled = true
        return { id: 'unexpected' }
      },
    },
  )

  assert.equal(sendCalled, false)
  assert.equal(run.results[0].sentCount, 0)
  assert.equal(run.results[0].errors.length, attendees.length)
  assert.deepEqual(
    run.results[0].errors,
    attendees.map((attendee) => `${attendee.attendeeEmail}: fetch failed`),
  )
})

test('an unreadable duplicate ledger row fails closed as already sent', async () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event?.privateLocationReminder)

  const attendees = [
    { attendeeName: 'Joe', attendeeEmail: 'joe@example.com' },
    { attendeeName: 'Helix', attendeeEmail: 'helix@example.com' },
  ]
  let sendCalled = false
  const unreadableLedger: EventEmailLedger = {
    async claim() {
      return false
    },
    async get() {
      throw new Error('fetch failed')
    },
    async markSent() {
      throw new Error('markSent should not be called')
    },
    async markFailed() {
      throw new Error('markFailed should not be called')
    },
  }

  const run = await runLocationReminders(
    { now: new Date('2026-05-30T07:00:00+08:00'), events: [event], dryRun: false },
    {
      acquireLock: async () => true,
      ledger: unreadableLedger,
      listAttendees: async () => attendees,
      sendReminder: async () => {
        sendCalled = true
        return { id: 'unexpected' }
      },
    },
  )

  assert.equal(sendCalled, false)
  assert.equal(run.results[0].sentCount, 0)
  assert.equal(run.results[0].skippedAlreadySentCount, attendees.length)
  assert.deepEqual(run.results[0].errors, [])
})

test('location-reminder cron source routes sends through the ledger', () => {
  const routeSource = readFileSync(LOCATION_REMINDERS_ROUTE, 'utf8')

  assert.match(routeSource, /runLocationReminders/, 'the route has stopped routing sends through the ledger.')
  assert.match(routeSource, /createSupabaseEventEmailLedger/, 'the route has stopped routing sends through the ledger.')
  assert.match(routeSource, /cron_window_locks/, 'the route has stopped routing sends through the ledger.')
  assert.doesNotMatch(
    routeSource,
    /for\s*\(\s*const\s+attendee[\s\S]*sendEventLocationReminderEmail/,
    'the route has stopped routing sends through the ledger.',
  )
})

test('location-reminder implementation keeps per-recipient ledger sends', () => {
  const reminderSource = readFileSync(LOCATION_REMINDER_LIB, 'utf8')
  assert.match(reminderSource, /sendOneDeduped\(/)
})

test('location-reminder cron remains scheduled every 30 minutes', () => {
  const vercelConfig = JSON.parse(readFileSync(VERCEL_CONFIG, 'utf8')) as {
    crons?: Array<{ path?: string; schedule?: string }>
  }
  const locationReminderCron = vercelConfig.crons?.find(
    (cron) => cron.path === '/api/events/location-reminders',
  )

  assert.equal(
    locationReminderCron?.schedule,
    '*/30 * * * *',
    'changing this schedule requires re-examining the 90 minute reminder window assumption.',
  )
})
