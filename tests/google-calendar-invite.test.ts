import assert from 'node:assert/strict'
import test from 'node:test'

import { getEventBySlug } from '../src/lib/events'
import { resolveCalendarEventId } from '../src/lib/google-calendar-invite'

test('a checked-in event-specific Google Calendar ID takes precedence over shared fallbacks', () => {
  const dinner = getEventBySlug('joe-ches-connection-dinner-sunday-october-04-2026')
  assert.ok(dinner)

  assert.equal(
    resolveCalendarEventId(dinner, 'shared-workshop-event'),
    'o15i65v5e4v2ntgn0rqsmem54c',
  )
})

test('the per-event environment override takes precedence over the checked-in event ID', () => {
  const dinner = getEventBySlug('joe-ches-connection-dinner-sunday-october-04-2026')
  assert.ok(dinner)
  const key = 'GOOGLE_CALENDAR_EVENT_ID_JOE_CHES_CONNECTION_DINNER_SUNDAY_OCTOBER_04_2026'
  const original = process.env[key]
  process.env[key] = 'replacement-event-id'
  try {
    assert.equal(resolveCalendarEventId(dinner, 'shared-workshop-event'), 'replacement-event-id')
  } finally {
    if (original === undefined) delete process.env[key]
    else process.env[key] = original
  }
})
