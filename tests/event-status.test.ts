import assert from 'node:assert/strict'
import test from 'node:test'

import { isEventRegistrationClosed, isRegistrationWindowPassed } from '../src/lib/event-status'
import { getEventBySlug } from '../src/lib/events'

test('business-blocks-ai-solved closes registration 30 minutes before doors', () => {
  const event = getEventBySlug('business-blocks-ai-solved')!
  assert.equal(event.registrationClosesIso, '2026-08-07T14:30:00+08:00')
})

test('registration is open well before the cutoff', () => {
  const event = getEventBySlug('business-blocks-ai-solved')!
  const beforeCutoff = new Date('2026-08-07T12:00:00+08:00')
  assert.equal(isRegistrationWindowPassed(event, beforeCutoff), false)
  assert.equal(isEventRegistrationClosed(event, beforeCutoff), false)
})

test('registration is closed at and after the cutoff', () => {
  const event = getEventBySlug('business-blocks-ai-solved')!
  assert.equal(isRegistrationWindowPassed(event, new Date('2026-08-07T14:30:00+08:00')), true)
  assert.equal(isRegistrationWindowPassed(event, new Date('2026-08-07T14:31:00+08:00')), true)
  assert.equal(isEventRegistrationClosed(event, new Date('2026-08-07T14:45:00+08:00')), true)
})

test('a manual close and a scheduled cutoff are distinguishable', () => {
  // A manually-closed event (capacity/sold out) has no registrationClosesIso,
  // so the time-based check must not also report it as window-passed -- the
  // page needs to tell these apart to show waitlist copy vs plain "closed" copy.
  const manuallyClosedOnly = { manuallyClosed: true, registrationClosesIso: undefined }
  assert.equal(isRegistrationWindowPassed(manuallyClosedOnly), false)
  assert.equal(isEventRegistrationClosed(manuallyClosedOnly), true)
})

test('an event with no registrationClosesIso never reports the window as passed', () => {
  for (const slug of ['connection-dinner-canggu', 'ask-an-ai-expert']) {
    const event = getEventBySlug(slug)
    if (!event || event.registrationClosesIso) continue
    assert.equal(isRegistrationWindowPassed(event, new Date('2099-01-01T00:00:00Z')), false)
  }
})
