import assert from 'node:assert/strict'
import test from 'node:test'

import {
  sendEventConfirmationEmail,
  sendWaitlistConfirmationEmail,
  sendWaitlistSpotNotificationEmail,
  buildConfirmationIdempotencyKey,
  buildWaitlistJoinIdempotencyKey,
} from '../src/lib/event-confirmation-email'
import { getEventBySlug } from '../src/lib/events'

// ─── Helpers ──────────────────────────────────────────────────────────────────

type CapturedRequest = { headers: Record<string, string>; body: Record<string, unknown> }

function mockFetch(responses: Array<{ status: number; body: unknown }>) {
  let callIndex = 0
  const captured: CapturedRequest[] = []

  const fake = async (_input: unknown, init?: RequestInit) => {
    const resp = responses[callIndex++] ?? { status: 200, body: { id: 'email_test' } }
    captured.push({
      headers: Object.fromEntries(
        Object.entries((init?.headers ?? {}) as Record<string, string>),
      ),
      body: JSON.parse(typeof init?.body === 'string' ? init.body : '{}'),
    })
    return new Response(JSON.stringify(resp.body), {
      status: resp.status,
      headers: { 'content-type': 'application/json' },
    })
  }

  return { fake, captured }
}

function withMockFetch<T>(
  fn: (captured: CapturedRequest[]) => Promise<T>,
): Promise<T> {
  const originalFetch = global.fetch
  const originalApiKey = process.env.RESEND_API_KEY
  const { fake, captured } = mockFetch([])

  process.env.RESEND_API_KEY = 'test_key'
  global.fetch = fake as typeof global.fetch

  return fn(captured).finally(() => {
    global.fetch = originalFetch
    process.env.RESEND_API_KEY = originalApiKey
  })
}

// ─── Confirmation email ────────────────────────────────────────────────────────

test('confirmation idempotency key is stable and case-insensitive', () => {
  const a = buildConfirmationIdempotencyKey('connection-dinner-canggu', 'Joe@Example.com')
  const b = buildConfirmationIdempotencyKey('connection-dinner-canggu', 'joe@example.com')
  assert.equal(a, b)
  assert.ok(a.startsWith('confirm/'))
})

test('confirmation email sends the same Idempotency-Key on repeated calls', async () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)

  await withMockFetch(async (captured) => {
    await sendEventConfirmationEmail({
      event,
      attendeeName: 'Joe Che',
      attendeeEmail: 'joe@mastermindshq.business',
    })

    await sendEventConfirmationEmail({
      event,
      attendeeName: 'Joe Che',
      attendeeEmail: 'joe@mastermindshq.business',
    })

    assert.equal(captured.length, 2)

    const key1 = captured[0].headers['Idempotency-Key']
    const key2 = captured[1].headers['Idempotency-Key']

    assert.ok(key1, 'first call must include Idempotency-Key')
    assert.equal(key1, key2, 'both calls must send the same key so Resend deduplicates')
  })
})

test('confirmation email idempotency key differs across events and emails', () => {
  const keyA = buildConfirmationIdempotencyKey('connection-dinner-canggu', 'alice@example.com')
  const keyB = buildConfirmationIdempotencyKey('connection-dinner-canggu', 'bob@example.com')
  const keyC = buildConfirmationIdempotencyKey('ai-avatar-content-creation', 'alice@example.com')

  assert.notEqual(keyA, keyB)
  assert.notEqual(keyA, keyC)
})

// ─── Waitlist join email ───────────────────────────────────────────────────────

test('waitlist join idempotency key is stable and case-insensitive', () => {
  const a = buildWaitlistJoinIdempotencyKey('connection-dinner-canggu', 'Joe@Example.com')
  const b = buildWaitlistJoinIdempotencyKey('connection-dinner-canggu', 'joe@example.com')
  assert.equal(a, b)
  assert.ok(a.startsWith('waitlist-join/'))
})

test('waitlist join email sends the same Idempotency-Key on repeated calls', async () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)

  await withMockFetch(async (captured) => {
    const args = {
      event,
      name: 'Alice',
      email: 'alice@example.com',
      removeToken: 'tok_remove_abc',
    }

    await sendWaitlistConfirmationEmail(args)
    await sendWaitlistConfirmationEmail(args)

    assert.equal(captured.length, 2)

    const key1 = captured[0].headers['Idempotency-Key']
    const key2 = captured[1].headers['Idempotency-Key']

    assert.ok(key1, 'first call must include Idempotency-Key')
    assert.equal(key1, key2, 'both calls must send the same key so Resend deduplicates')
  })
})

// ─── Waitlist spot notification (cron / cancel) ────────────────────────────────

test('waitlist spot notification key differs across time windows', () => {
  // Cron produces per-window keys — t5h and t2h must not collide
  const t5h = `waitlist-spot-t5h/connection-dinner-canggu/alice@example.com`
  const t2h = `waitlist-spot-t2h/connection-dinner-canggu/alice@example.com`
  assert.notEqual(t5h, t2h)
})

test('cancel waitlist notification uses a stable key tied to the cancel token', async () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)

  const cancelToken = 'tok_cancel_xyz'
  const email = 'alice@example.com'

  await withMockFetch(async (captured) => {
    const args = {
      event,
      name: 'Alice',
      email,
      removeToken: 'tok_remove_abc',
      variant: 'cancellation' as const,
      idempotencyKey: `waitlist-spot-cancel/${event.slug}/${email}/${cancelToken}`,
    }

    await sendWaitlistSpotNotificationEmail(args)
    await sendWaitlistSpotNotificationEmail(args)

    assert.equal(captured.length, 2)

    const key1 = captured[0].headers['Idempotency-Key']
    const key2 = captured[1].headers['Idempotency-Key']

    assert.ok(key1, 'must include Idempotency-Key')
    assert.equal(key1, key2, 'same cancel event produces the same key')
    assert.ok(key1.includes(cancelToken), 'key must embed the cancel token')
  })
})

test('different cancellations produce different waitlist notification keys', () => {
  const slug = 'connection-dinner-canggu'
  const email = 'alice@example.com'

  const keyA = `waitlist-spot-cancel/${slug}/${email}/tok_cancel_aaa`
  const keyB = `waitlist-spot-cancel/${slug}/${email}/tok_cancel_bbb`

  assert.notEqual(keyA, keyB)
})

// ─── No double-send across email types ────────────────────────────────────────

test('confirmation and waitlist-join keys do not collide for the same email', () => {
  const slug = 'connection-dinner-canggu'
  const email = 'joe@mastermindshq.business'

  const confirmKey = buildConfirmationIdempotencyKey(slug, email)
  const joinKey = buildWaitlistJoinIdempotencyKey(slug, email)

  assert.notEqual(confirmKey, joinKey)
})
