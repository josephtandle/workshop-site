import assert from 'node:assert/strict'
import test from 'node:test'

import { settleAttachedCheckout, type EventSeatClaim } from '../src/lib/event-capacity'
import { getEventBySlug } from '../src/lib/events'
import { supabase } from '../src/lib/supabase'

// Regression for Jasmine Oh, 2026-10-02: a guest who abandoned a checkout and came
// back was told "You already have a checkout in progress" until the hold expired.
const event = getEventBySlug('joe-ches-connection-dinner-sunday-october-04-2026')!
const held: EventSeatClaim = { status: 'held', reservationId: 'res-old', expiresAt: '2026-10-02T00:53:43Z', checkoutSessionId: 'cs_old' }

function fakeRpc() {
  const calls: Array<{ name: string; args: any }> = []
  const supabaseAny = supabase as any
  const original = supabaseAny.rpc
  supabaseAny.rpc = async (name: string, args: any) => {
    calls.push({ name, args })
    if (name === 'claim_event_capacity_seat') {
      return { data: [{ reservation_id: 'res-new', status: 'held', expires_at: '2026-10-02T02:00:00Z', checkout_session_id: null }], error: null }
    }
    return { data: true, error: null }
  }
  return { calls, restore: () => { supabaseAny.rpc = original } }
}

function sessions(states: string[], expireThrows = false) {
  const log: string[] = []
  let i = 0
  return {
    log,
    api: {
      async retrieve(id: string) { log.push('retrieve'); return { id, status: states[Math.min(i++, states.length - 1)] } },
      async expire(id: string) { log.push('expire'); if (expireThrows) throw new Error('already completed'); return { id, status: 'expired' } },
    },
  }
}

test('an abandoned open checkout is expired, released, and a fresh seat is claimed', async () => {
  const rpc = fakeRpc()
  try {
    const s = sessions(['open'])
    const claim = await settleAttachedCheckout(event, 'jazzyodirect@gmail.com', held, s.api)
    assert.deepEqual(s.log, ['retrieve', 'expire'])
    assert.deepEqual(rpc.calls.map((c) => c.name), ['release_event_capacity_checkout', 'claim_event_capacity_seat'])
    assert.equal(claim.status, 'held')
    assert.ok(claim.status !== 'full' && claim.reservationId === 'res-new' && !claim.checkoutSessionId)
  } finally { rpc.restore() }
})

test('an already expired checkout is released and a fresh seat is claimed', async () => {
  const rpc = fakeRpc()
  try {
    const s = sessions(['expired'])
    const claim = await settleAttachedCheckout(event, 'guest@example.com', held, s.api)
    assert.deepEqual(s.log, ['retrieve'])
    assert.equal(claim.status, 'held')
  } finally { rpc.restore() }
})

test('a checkout that was actually paid confirms the seat instead of charging twice', async () => {
  const rpc = fakeRpc()
  try {
    const claim = await settleAttachedCheckout(event, 'guest@example.com', held, sessions(['complete']).api)
    assert.equal(claim.status, 'confirmed')
    assert.deepEqual(rpc.calls.map((c) => c.name), ['confirm_event_capacity_seat'])
    assert.equal(rpc.calls[0].args.p_checkout_session_id, 'cs_old')
  } finally { rpc.restore() }
})

test('a checkout completed between retrieve and expire is confirmed, not released', async () => {
  const rpc = fakeRpc()
  try {
    const claim = await settleAttachedCheckout(event, 'guest@example.com', held, sessions(['open', 'complete'], true).api)
    assert.equal(claim.status, 'confirmed')
    assert.ok(!rpc.calls.some((c) => c.name === 'release_event_capacity_checkout'))
  } finally { rpc.restore() }
})

test('a claim without an attached checkout is returned untouched', async () => {
  const plain: EventSeatClaim = { status: 'held', reservationId: 'r', expiresAt: null }
  const claim = await settleAttachedCheckout(event, 'guest@example.com', plain, sessions(['open']).api)
  assert.equal(claim, plain)
})
