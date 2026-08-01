import assert from 'node:assert/strict'
import test from 'node:test'

import { buildConfirmationEmailHtml } from '../src/lib/event-confirmation-email'
import { getEventBySlug } from '../src/lib/events'

const event = getEventBySlug('business-blocks-ai-solved')!
// Well before the 24h reveal window.
const wellBeforeEvent = new Date('2026-08-01T00:00:00+08:00')
const html = buildConfirmationEmailHtml(event, 'Joe', 'tok', wellBeforeEvent)

test('the venue is not revealed in the confirmation email', () => {
  assert.ok(event.privateLocationReminder, 'event must hold its location back')
  assert.doesNotMatch(html, /Samm/i, 'venue name leaked')
  assert.doesNotMatch(html, /Padang Linjong/i, 'street address leaked')
  assert.doesNotMatch(html, /Open Google Maps/i, 'maps button hands over the venue')
})

test('the maps url is never embedded while the location is private', () => {
  const mapsUrl = event.emailConfig?.mapsUrl
  assert.ok(mapsUrl, 'this event does configure a maps url, which is why gating matters')
  assert.ok(!html.includes(mapsUrl!), 'configured maps url must not appear before the reveal')
})

test('attendees are still told the area and when the address arrives', () => {
  assert.match(html, /Canggu/i, 'they need to know roughly where it is')
  assert.match(html, /exact location/i, 'and that the address is coming')
})

test('calendar buttons do not rely on flexbox, which email clients strip', () => {
  assert.match(html, /Add to Google Calendar/)
  assert.match(html, /Download iCal/)
  assert.doesNotMatch(html, /display:\s*flex/i, 'flex gap silently collapses in Gmail and Outlook')
})
