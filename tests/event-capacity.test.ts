import assert from 'node:assert/strict'
import test from 'node:test'

import {
  attachCheckoutToEventSeat,
  claimEventSeat,
  confirmEventSeat,
  releaseEventSeat,
  releaseEventSeatByCheckout,
} from '../src/lib/event-capacity'
import { getEventBySlug } from '../src/lib/events'
import { supabase } from '../src/lib/supabase'

test('capacity-managed events obtain their seat through the atomic reservation RPC', async () => {
  const dinner = getEventBySlug('joe-ches-connection-dinner-sunday-october-04-2026')
  assert.ok(dinner)

  const supabaseAny = supabase as any
  const originalRpc = supabaseAny.rpc
  const calls: Array<{ name: string; args: Record<string, unknown> }> = []
  supabaseAny.rpc = async (name: string, args: Record<string, unknown>) => {
    calls.push({ name, args })
    return {
      data: [{ reservation_id: 'seat-1', status: 'held', expires_at: '2026-10-04T10:30:00.000Z' }],
      error: null,
    }
  }

  try {
    const result = await claimEventSeat(dinner, 'person@example.com')
    assert.deepEqual(result, {
      status: 'held',
      reservationId: 'seat-1',
      expiresAt: '2026-10-04T10:30:00.000Z',
    })
    assert.deepEqual(calls, [
      {
        name: 'claim_event_capacity_seat',
        args: {
          p_event_slug: dinner.slug,
          p_attendee_email: 'person@example.com',
          p_capacity: 24,
          p_hold_minutes: 30,
        },
      },
    ])
  } finally {
    supabaseAny.rpc = originalRpc
  }
})

test('a full event does not create another checkout hold', async () => {
  const dinner = getEventBySlug('joe-ches-connection-dinner-sunday-october-04-2026')
  assert.ok(dinner)

  const supabaseAny = supabase as any
  const originalRpc = supabaseAny.rpc
  supabaseAny.rpc = async () => ({ data: [], error: null })

  try {
    assert.deepEqual(await claimEventSeat(dinner, 'waitlist@example.com'), { status: 'full' })
  } finally {
    supabaseAny.rpc = originalRpc
  }
})

test('a completed registration confirms its existing reservation', async () => {
  const supabaseAny = supabase as any
  const originalRpc = supabaseAny.rpc
  const calls: Array<{ name: string; args: Record<string, unknown> }> = []
  supabaseAny.rpc = async (name: string, args: Record<string, unknown>) => {
    calls.push({ name, args })
    return { data: true, error: null }
  }

  try {
    await confirmEventSeat('seat-1', 'cs_test_1')
    assert.deepEqual(calls, [
      {
        name: 'confirm_event_capacity_seat',
        args: { p_reservation_id: 'seat-1', p_checkout_session_id: 'cs_test_1' },
      },
    ])
  } finally {
    supabaseAny.rpc = originalRpc
  }
})

test('a paid checkout is attached to the seat hold before its URL is returned', async () => {
  const supabaseAny = supabase as any
  const originalRpc = supabaseAny.rpc
  const calls: Array<{ name: string; args: Record<string, unknown> }> = []
  supabaseAny.rpc = async (name: string, args: Record<string, unknown>) => {
    calls.push({ name, args })
    return { data: true, error: null }
  }

  try {
    await attachCheckoutToEventSeat('seat-1', 'cs_test_1')
    assert.deepEqual(calls, [
      {
        name: 'attach_event_capacity_checkout',
        args: { p_reservation_id: 'seat-1', p_checkout_session_id: 'cs_test_1' },
      },
    ])
  } finally {
    supabaseAny.rpc = originalRpc
  }
})

test('a cancelled registration releases its confirmed seat', async () => {
  const supabaseAny = supabase as any
  const originalRpc = supabaseAny.rpc
  const calls: Array<{ name: string; args: Record<string, unknown> }> = []
  supabaseAny.rpc = async (name: string, args: Record<string, unknown>) => {
    calls.push({ name, args })
    return { data: true, error: null }
  }

  try {
    await releaseEventSeat('seat-1')
    assert.deepEqual(calls, [
      {
        name: 'release_event_capacity_seat',
        args: {
          p_reservation_id: 'seat-1',
        },
      },
    ])
  } finally {
    supabaseAny.rpc = originalRpc
  }
})

test('an expired Stripe checkout releases only its own seat', async () => {
  const supabaseAny = supabase as any
  const originalRpc = supabaseAny.rpc
  const calls: Array<{ name: string; args: Record<string, unknown> }> = []
  supabaseAny.rpc = async (name: string, args: Record<string, unknown>) => {
    calls.push({ name, args })
    return { data: true, error: null }
  }
  try {
    await releaseEventSeatByCheckout('cs_test_expired')
    assert.deepEqual(calls, [{ name: 'release_event_capacity_checkout', args: { p_checkout_session_id: 'cs_test_expired' } }])
  } finally {
    supabaseAny.rpc = originalRpc
  }
})
