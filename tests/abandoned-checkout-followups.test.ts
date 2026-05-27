import assert from 'node:assert/strict'
import test from 'node:test'

import {
  ABANDONED_CHECKOUT_DAY1_AUTOMATION_KEY,
  ABANDONED_CHECKOUT_T12H_AUTOMATION_KEY,
  buildAbandonedCheckoutEmailHtml,
  buildAbandonedCheckoutIdempotencyKey,
  buildAbandonedCheckoutSubject,
  buildAbandonedCheckoutT12hEmailHtml,
  buildAbandonedCheckoutT12hIdempotencyKey,
  buildAbandonedCheckoutT12hSubject,
  buildAbandonedCheckoutT12hTestIdempotencyKey,
  buildAbandonedCheckoutTestIdempotencyKey,
  buildAbandonedCheckoutTestSubject,
  getAbandonedCheckoutEligibleEvents,
  isObviousTestCheckoutAttempt,
  isEventInLeadWindow,
  resolveEventFromSlug,
  sendLiveCandidateOnce,
  shouldIncludeFinanceLine,
  shouldSendTestPreview,
  type AbandonedCheckoutCandidate,
} from '../src/lib/abandoned-checkout-followups'

function makeCandidate(slug: string, attendeeEmail: string): AbandonedCheckoutCandidate {
  const event = resolveEventFromSlug(slug)
  assert.ok(event)

  return {
    event,
    attendeeEmail,
    attendeeName: 'Alice Example',
    firstName: 'Alice',
    sourceCheckoutSessionId: 'cs_test_123',
    sourceCheckoutCreatedAt: '2026-05-24T01:00:00.000Z',
    eventUrl: `https://workshop.mastermindshq.business/events/${slug}`,
    financeLineIncluded: shouldIncludeFinanceLine(event),
  }
}

test('idempotency key is stable and normalizes email case', () => {
  const a = buildAbandonedCheckoutIdempotencyKey('connection-dinner-canggu', 'Joe@Example.com')
  const b = buildAbandonedCheckoutIdempotencyKey('connection-dinner-canggu', 'joe@example.com')
  assert.equal(a, b)

  const t12hA = buildAbandonedCheckoutT12hIdempotencyKey('connection-dinner-canggu', 'Joe@Example.com')
  const t12hB = buildAbandonedCheckoutT12hIdempotencyKey('connection-dinner-canggu', 'joe@example.com')
  assert.equal(t12hA, t12hB)
  assert.notEqual(a, t12hA)
})

test('test idempotency key includes test recipient', () => {
  const key = buildAbandonedCheckoutTestIdempotencyKey(
    'connection-dinner-canggu',
    'joe@example.com',
    'newyork1@gmail.com',
  )
  assert.ok(key.includes('newyork1@gmail.com'))
  const t12hKey = buildAbandonedCheckoutT12hTestIdempotencyKey(
    'connection-dinner-canggu',
    'joe@example.com',
    'newyork1@gmail.com',
  )
  assert.ok(t12hKey.includes('newyork1@gmail.com'))
  assert.notEqual(key, t12hKey)
})

test('subject uses the event title', () => {
  const candidate = makeCandidate('connection-dinner-canggu', 'alice@example.com')
  assert.equal(buildAbandonedCheckoutSubject(candidate.event), `Follow-up for ${candidate.event.title}`)
  assert.equal(buildAbandonedCheckoutT12hSubject(candidate.event), `Still interested in ${candidate.event.title}?`)
  assert.equal(
    buildAbandonedCheckoutTestSubject(candidate.event, candidate.attendeeEmail),
    `[TEST] Follow-up for ${candidate.event.title} -> alice@example.com`,
  )
})

test('finance line appears only for events over fifty dollars and not donation mode', () => {
  const paidCandidate = makeCandidate('ai-avatar-content-creation', 'alice@example.com')
  const paidHtml = buildAbandonedCheckoutEmailHtml(paidCandidate)
  assert.ok(paidHtml.includes('finances are the thing getting in the way'))
  assert.ok(paidHtml.includes('trouble with payments through Stripe'))

  const dinnerCandidate = makeCandidate('connection-dinner-canggu', 'alice@example.com')
  const dinnerHtml = buildAbandonedCheckoutEmailHtml(dinnerCandidate)
  assert.ok(!dinnerHtml.includes('finances are the thing getting in the way'))
  assert.ok(dinnerHtml.includes('trouble with payments through Stripe'))
})

test('email includes event link button and plain text url', () => {
  const candidate = makeCandidate('connection-dinner-canggu', 'alice@example.com')
  const html = buildAbandonedCheckoutEmailHtml(candidate)
  assert.ok(html.includes('Open the event page'))
  assert.ok(html.includes(candidate.eventUrl))

  const t12hHtml = buildAbandonedCheckoutT12hEmailHtml(candidate)
  assert.ok(t12hHtml.includes('are you still interested in coming to this event?'))
  assert.ok(t12hHtml.includes('We have a spot left'))
  assert.ok(t12hHtml.includes(candidate.eventUrl))
})

test('obvious test checkout attempts are detected', () => {
  assert.equal(isObviousTestCheckoutAttempt('Checkout Test', 'checkout-test@example.com'), true)
  assert.equal(isObviousTestCheckoutAttempt('Alice Example', 'alice@realdomain.com'), false)
})

test('test preview only re-sends when source checkout session changes', () => {
  const candidate = makeCandidate('connection-dinner-canggu', 'alice@example.com')
  assert.equal(
    shouldSendTestPreview(
      { last_test_source_checkout_session_id: 'cs_test_123' },
      candidate,
    ),
    false,
  )
  assert.equal(
    shouldSendTestPreview(
      { last_test_source_checkout_session_id: 'cs_test_old' },
      candidate,
    ),
    true,
  )
})

test('t12h lead window only opens in the hour before twelve hours out', () => {
  const event = resolveEventFromSlug('connection-dinner-canggu')
  assert.ok(event)

  assert.equal(
    isEventInLeadWindow(event, new Date('2026-05-27T06:15:00+08:00'), 12, 60),
    true,
  )
  assert.equal(
    isEventInLeadWindow(event, new Date('2026-05-27T05:50:00+08:00'), 12, 60),
    false,
  )
  assert.equal(
    isEventInLeadWindow(event, new Date('2026-05-27T07:10:00+08:00'), 12, 60),
    false,
  )
})

test('t12h eligible events skip full events', async () => {
  const eligible = await getAbandonedCheckoutEligibleEvents(
    new Date('2026-05-27T05:15:00+08:00'),
    ABANDONED_CHECKOUT_T12H_AUTOMATION_KEY,
    {
      hasOpenSpotsForEvent: async (event) => event.slug !== 'connection-dinner-canggu',
    },
  )

  assert.ok(!eligible.some((event) => event.slug === 'connection-dinner-canggu'))
})

test('live send skips when another run already holds the claim', async () => {
  const candidate = makeCandidate('connection-dinner-canggu', 'alice@example.com')
  let sendCalls = 0

  const result = await sendLiveCandidateOnce(ABANDONED_CHECKOUT_DAY1_AUTOMATION_KEY, candidate, new Date('2026-05-24T12:00:00.000Z'), {
    claim: async () => false,
    send: async () => {
      sendCalls += 1
      return {}
    },
  })

  assert.equal(result.outcome, 'skipped_claimed')
  assert.equal(sendCalls, 0)
})

test('live send finalizes after a successful send', async () => {
  const candidate = makeCandidate('connection-dinner-canggu', 'alice@example.com')
  const calls: string[] = []

  const result = await sendLiveCandidateOnce(ABANDONED_CHECKOUT_DAY1_AUTOMATION_KEY, candidate, new Date('2026-05-24T12:00:00.000Z'), {
    claimTokenFactory: () => 'claim-token-1',
    claim: async ({ claimToken }) => {
      calls.push(`claim:${claimToken}`)
      return true
    },
    send: async () => {
      calls.push('send')
      return {}
    },
    finalize: async ({ claimToken }) => {
      calls.push(`finalize:${claimToken}`)
    },
    release: async () => {
      calls.push('release')
    },
  })

  assert.equal(result.outcome, 'sent')
  assert.deepEqual(calls, ['claim:claim-token-1', 'send', 'finalize:claim-token-1'])
})

test('live send releases claim and records failure on send error', async () => {
  const candidate = makeCandidate('connection-dinner-canggu', 'alice@example.com')
  const calls: string[] = []

  const result = await sendLiveCandidateOnce(ABANDONED_CHECKOUT_DAY1_AUTOMATION_KEY, candidate, new Date('2026-05-24T12:00:00.000Z'), {
    claimTokenFactory: () => 'claim-token-2',
    claim: async ({ claimToken }) => {
      calls.push(`claim:${claimToken}`)
      return true
    },
    send: async () => {
      calls.push('send')
      throw new Error('SMTP temporary failure')
    },
    finalize: async () => {
      calls.push('finalize')
    },
    release: async ({ claimToken, errorMessage }) => {
      calls.push(`release:${claimToken}:${errorMessage}`)
    },
  })

  assert.equal(result.outcome, 'failed')
  assert.equal(result.errorMessage, 'SMTP temporary failure')
  assert.deepEqual(calls, ['claim:claim-token-2', 'send', 'release:claim-token-2:SMTP temporary failure'])
})
