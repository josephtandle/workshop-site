import assert from 'node:assert/strict'
import test from 'node:test'

import {
  sendEventConfirmationEmail,
  sendWaitlistSpotNotificationEmail,
  sendWaitlistConfirmationEmail,
} from '../src/lib/event-confirmation-email'
import { getEventBySlug } from '../src/lib/events'

// ─── Helpers ───────────────────────────────────────────────────────────────────

type Captured = { subject: string; html: string; to: string[] }

function withMockFetch(fn: (captured: Captured[]) => Promise<void>): Promise<void> {
  const originalFetch = global.fetch
  const originalKey = process.env.RESEND_API_KEY
  const captured: Captured[] = []

  process.env.RESEND_API_KEY = 'test_key'
  global.fetch = async (_url: unknown, init?: RequestInit) => {
    const body = JSON.parse(typeof init?.body === 'string' ? init.body : '{}')
    captured.push({ subject: body.subject, html: body.html, to: body.to })
    return new Response(JSON.stringify({ id: 'email_test' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  return fn(captured).finally(() => {
    global.fetch = originalFetch
    process.env.RESEND_API_KEY = originalKey
  })
}

// ─── Confirmation email — cancel link ─────────────────────────────────────────

test('confirmation email includes cancel link when cancelToken is provided', async () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)

  await withMockFetch(async (captured) => {
    await sendEventConfirmationEmail({
      event,
      attendeeName: 'Joe Che',
      attendeeEmail: 'joe@mastermindshq.business',
      cancelToken: 'tok_abc123',
    })

    assert.equal(captured.length, 1)
    assert.ok(
      captured[0].html.includes('tok_abc123'),
      'cancel token must appear in the email HTML',
    )
    assert.ok(
      captured[0].html.includes("Can't make it? Cancel your seat."),
      'cancel link text must appear in the email',
    )
  })
})

test('confirmation email omits cancel link when no cancelToken is given', async () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)

  await withMockFetch(async (captured) => {
    await sendEventConfirmationEmail({
      event,
      attendeeName: 'Joe Che',
      attendeeEmail: 'joe@mastermindshq.business',
    })

    assert.equal(captured.length, 1)
    assert.ok(
      !captured[0].html.includes("Can't make it? Cancel your seat."),
      'no cancel link should appear when cancelToken is absent',
    )
  })
})

// ─── Confirmation email — emailConfig overrides ────────────────────────────────

test('connection dinner confirmation email suppresses the workshop header', async () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)
  assert.equal(event.emailConfig?.headerLabel, null)

  await withMockFetch(async (captured) => {
    await sendEventConfirmationEmail({
      event,
      attendeeName: 'Alice',
      attendeeEmail: 'alice@example.com',
    })

    assert.ok(
      !captured[0].html.includes('Masterminds HQ Workshop'),
      'workshop header must not appear for the dinner event',
    )
  })
})

test('connection dinner confirmation email includes the Google Maps button', async () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)
  assert.ok(event.emailConfig?.mapsUrl)

  await withMockFetch(async (captured) => {
    await sendEventConfirmationEmail({
      event,
      attendeeName: 'Alice',
      attendeeEmail: 'alice@example.com',
    })

    assert.ok(
      captured[0].html.includes('Open Google Maps'),
      'Google Maps button must appear in dinner confirmation email',
    )
  })
})

test('connection dinner confirmation email skips the setup instructions block', async () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)
  assert.equal(event.emailConfig?.skipSetupInstructions, true)

  await withMockFetch(async (captured) => {
    await sendEventConfirmationEmail({
      event,
      attendeeName: 'Alice',
      attendeeEmail: 'alice@example.com',
    })

    assert.ok(
      !captured[0].html.includes('What to do next'),
      'setup section must not appear in dinner confirmation email',
    )
    assert.ok(
      !captured[0].html.includes('Open setup instructions'),
      'setup button must not appear in dinner confirmation email',
    )
  })
})

test('AI avatar event confirmation email includes setup instructions', async () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event)
  assert.ok(!event.emailConfig?.skipSetupInstructions)

  await withMockFetch(async (captured) => {
    await sendEventConfirmationEmail({
      event,
      attendeeName: 'Bob',
      attendeeEmail: 'bob@example.com',
    })

    assert.ok(
      captured[0].html.includes('What to do next'),
      'setup section must appear for the AI avatar event',
    )
  })
})

test('confirmation email subject contains the event title', async () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)

  await withMockFetch(async (captured) => {
    await sendEventConfirmationEmail({
      event,
      attendeeName: 'Alice',
      attendeeEmail: 'alice@example.com',
    })

    assert.ok(
      captured[0].subject.includes(event.title),
      'subject must include the event title',
    )
  })
})

// ─── Waitlist spot notification — subjects differ by variant ───────────────────

test('t2h waitlist notification uses "Another spot just opened" subject', async () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)

  await withMockFetch(async (captured) => {
    await sendWaitlistSpotNotificationEmail({
      event,
      name: 'Alice',
      email: 'alice@example.com',
      removeToken: 'tok_remove',
      variant: 't2h',
    })

    assert.ok(
      captured[0].subject.toLowerCase().includes('another spot'),
      `t2h subject should say "Another spot", got: "${captured[0].subject}"`,
    )
  })
})

test('cancellation waitlist notification uses "A spot just opened" subject', async () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)

  await withMockFetch(async (captured) => {
    await sendWaitlistSpotNotificationEmail({
      event,
      name: 'Alice',
      email: 'alice@example.com',
      removeToken: 'tok_remove',
      variant: 'cancellation',
    })

    assert.ok(
      !captured[0].subject.toLowerCase().includes('another'),
      `cancellation subject must not say "another", got: "${captured[0].subject}"`,
    )
    assert.ok(
      captured[0].subject.toLowerCase().includes('spot'),
      `cancellation subject must mention "spot", got: "${captured[0].subject}"`,
    )
  })
})

test('all waitlist spot notifications include a remove-from-waitlist link', async () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)

  for (const variant of ['cancellation', 't2h'] as const) {
    await withMockFetch(async (captured) => {
      await sendWaitlistSpotNotificationEmail({
        event,
        name: 'Alice',
        email: 'alice@example.com',
        removeToken: 'tok_remove_xyz',
        variant,
      })

      assert.ok(
        captured[0].html.includes('tok_remove_xyz'),
        `${variant}: remove token must appear in the HTML`,
      )
      assert.ok(
        captured[0].html.toLowerCase().includes('remove'),
        `${variant}: remove link text must appear`,
      )
    })
  }
})

// ─── Waitlist join confirmation ────────────────────────────────────────────────

test('waitlist join email includes a remove-from-waitlist link', async () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)

  await withMockFetch(async (captured) => {
    await sendWaitlistConfirmationEmail({
      event,
      name: 'Alice',
      email: 'alice@example.com',
      removeToken: 'tok_remove_abc',
    })

    assert.equal(captured.length, 1)
    assert.ok(
      captured[0].html.includes('tok_remove_abc'),
      'remove token must appear in waitlist confirmation HTML',
    )
  })
})

test('waitlist join email subject mentions the event title', async () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)

  await withMockFetch(async (captured) => {
    await sendWaitlistConfirmationEmail({
      event,
      name: 'Alice',
      email: 'alice@example.com',
      removeToken: 'tok_remove_abc',
    })

    assert.ok(
      captured[0].subject.includes(event.title),
      'waitlist join subject must include event title',
    )
  })
})

test('emails are sent to the correct recipient address', async () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)

  await withMockFetch(async (captured) => {
    await sendEventConfirmationEmail({
      event,
      attendeeName: 'Joe',
      attendeeEmail: 'unique-recipient@example.com',
    })

    assert.deepEqual(captured[0].to, ['unique-recipient@example.com'])
  })
})
