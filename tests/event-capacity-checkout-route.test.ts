import assert from 'node:assert/strict'
import test from 'node:test'

import { POST } from '../src/app/api/events/checkout-session/route'
import { supabase } from '../src/lib/supabase'

test('a donation below Stripe minimum never claims a capacity reservation', async () => {
  const supabaseAny = supabase as any
  const originalFrom = supabaseAny.from
  const originalRpc = supabaseAny.rpc
  const rpcCalls: string[] = []

  supabaseAny.from = () => ({
    select: () => ({
      eq: () => ({
        gte: async () => ({ count: 0 }),
      }),
    }),
    insert: async () => ({ error: null }),
    delete: () => ({
      eq: () => ({
        lt: async () => ({ error: null }),
      }),
    }),
  })
  supabaseAny.rpc = async (name: string) => {
    rpcCalls.push(name)
    return { data: [], error: null }
  }

  try {
    const response = await POST(new Request('https://workshop.mastermindshq.business/api/events/checkout-session', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.9' },
      body: JSON.stringify({
        slug: 'joe-ches-connection-dinner-sunday-october-04-2026',
        attendeeName: 'Test Guest',
        attendeeEmail: 'guest@example.com',
        donationAmount: 0.25,
      }),
    }))

    assert.equal(response.status, 400)
    assert.deepEqual(rpcCalls, [])
  } finally {
    supabaseAny.from = originalFrom
    supabaseAny.rpc = originalRpc
  }
})
