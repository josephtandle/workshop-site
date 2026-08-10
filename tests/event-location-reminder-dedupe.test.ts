import assert from 'node:assert/strict'
import test from 'node:test'

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
})
