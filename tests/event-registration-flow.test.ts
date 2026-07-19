import assert from 'node:assert/strict'
import test from 'node:test'

import { buildEventCheckoutRequestBody, resolveAcquisitionRef } from '../src/lib/event-registration-flow'
import { saveRegistration } from '../src/lib/event-registration-db'
import { supabase } from '../src/lib/supabase'

test('ask-an-ai-expert checkout payload keeps ref=marina as acquisition_ref', async () => {
  const body = buildEventCheckoutRequestBody({
    slug: 'ask-an-ai-expert',
    attendeeName: 'Marina Jaubert',
    attendeeEmail: 'marina@example.com',
    search: '?ref=marina',
    promoCode: '',
    journeyId: 'journey-1',
    acquisitionRoute: '/events/ask-an-ai-expert',
    acquisitionQuery: '?ref=marina',
    checkoutMode: 'embedded',
  })

  assert.equal(body.acquisitionRef, 'marina')

  const supabaseAny = supabase as any
  const originalFrom = supabaseAny.from
  const inserts: Array<Record<string, unknown>> = []

  supabaseAny.from = ((table: string) => {
    assert.equal(table, 'event_registrations')
    return {
      insert: async (payload: Record<string, unknown>) => {
        inserts.push(payload)
        return { error: null }
      },
    } as never
  }) as typeof originalFrom

  try {
    await saveRegistration({
      eventSlug: body.slug,
      attendeeName: body.attendeeName,
      attendeeEmail: body.attendeeEmail,
      acquisitionRef: body.acquisitionRef,
      amountPaid: 0,
    })
  } finally {
    supabaseAny.from = originalFrom
  }

  assert.equal(inserts.length, 1)
  assert.equal(inserts[0].acquisition_ref, 'marina')
})

test('ask-an-ai-expert checkout payload defaults to joe-che without ref', () => {
  const body = buildEventCheckoutRequestBody({
    slug: 'ask-an-ai-expert',
    attendeeName: 'Joe Che',
    attendeeEmail: 'joe@example.com',
    search: '',
    promoCode: '',
    journeyId: 'journey-2',
    acquisitionRoute: '/events/ask-an-ai-expert',
    acquisitionQuery: '',
    checkoutMode: 'embedded',
  })

  assert.equal(resolveAcquisitionRef(''), 'joe-che')
  assert.equal(body.acquisitionRef, 'joe-che')
})
