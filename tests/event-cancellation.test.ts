import assert from 'node:assert/strict'
import test from 'node:test'

import { cancelRegistration } from '../src/lib/event-registration-db'
import { supabase } from '../src/lib/supabase'

test('cancelling a capacity-managed registration releases its seat', async () => {
  const supabaseAny = supabase as any
  const originalFrom = supabaseAny.from
  const originalRpc = supabaseAny.rpc
  const rpcCalls: Array<{ name: string; args: Record<string, unknown> }> = []

  supabaseAny.from = (table: string) => {
    assert.equal(table, 'event_registrations')
    return {
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: {
              id: 'registration-1',
              event_slug: 'joe-ches-connection-dinner-sunday-october-04-2026',
              attendee_name: 'Test Guest',
              attendee_email: 'guest@example.com',
              capacity_reservation_id: 'seat-1',
              status: 'confirmed',
            },
            error: null,
          }),
        }),
      }),
      update: () => ({ eq: async () => ({ error: null }) }),
    }
  }
  supabaseAny.rpc = async (name: string, args: Record<string, unknown>) => {
    rpcCalls.push({ name, args })
    return { data: true, error: null }
  }

  try {
    await cancelRegistration('cancel-token')
    assert.deepEqual(rpcCalls, [
      {
        name: 'release_event_capacity_seat',
        args: {
          p_reservation_id: 'seat-1',
        },
      },
    ])
  } finally {
    supabaseAny.from = originalFrom
    supabaseAny.rpc = originalRpc
  }
})
