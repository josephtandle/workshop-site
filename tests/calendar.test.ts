import assert from 'node:assert/strict'
import test from 'node:test'

import { buildGoogleCalendarUrl, buildIcalString } from '../src/lib/calendar'

const START = '2026-05-30T10:30:00+08:00'
const END = '2026-05-30T17:00:00+08:00'
const UID = 'test-event@mastermindshq.business'

// --- buildGoogleCalendarUrl ---

test('buildGoogleCalendarUrl: produces Google Calendar render URL', () => {
  const url = buildGoogleCalendarUrl({ title: 'AI Avatar Lab', startIso: START, endIso: END })
  assert.ok(url.startsWith('https://calendar.google.com/calendar/render'))
})

test('buildGoogleCalendarUrl: includes action=TEMPLATE', () => {
  const url = buildGoogleCalendarUrl({ title: 'Test', startIso: START, endIso: END })
  assert.ok(new URL(url).searchParams.get('action') === 'TEMPLATE')
})

test('buildGoogleCalendarUrl: encodes title in text param', () => {
  const url = buildGoogleCalendarUrl({ title: 'My Event & Workshop', startIso: START, endIso: END })
  assert.ok(new URL(url).searchParams.get('text') === 'My Event & Workshop')
})

test('buildGoogleCalendarUrl: dates param is start/end in compact UTC format', () => {
  const url = buildGoogleCalendarUrl({ title: 'E', startIso: START, endIso: END })
  const dates = new URL(url).searchParams.get('dates') ?? ''
  const [s, e] = dates.split('/')
  assert.match(s, /^\d{8}T\d{6}Z$/)
  assert.match(e, /^\d{8}T\d{6}Z$/)
})

test('buildGoogleCalendarUrl: location param added when provided', () => {
  const url = buildGoogleCalendarUrl({ title: 'E', startIso: START, endIso: END, location: 'Canggu, Bali' })
  assert.equal(new URL(url).searchParams.get('location'), 'Canggu, Bali')
})

test('buildGoogleCalendarUrl: location param omitted when not provided', () => {
  const url = buildGoogleCalendarUrl({ title: 'E', startIso: START, endIso: END })
  assert.equal(new URL(url).searchParams.get('location'), null)
})

test('buildGoogleCalendarUrl: description goes into details param', () => {
  const url = buildGoogleCalendarUrl({ title: 'E', startIso: START, endIso: END, description: 'Bring a laptop' })
  assert.equal(new URL(url).searchParams.get('details'), 'Bring a laptop')
})

// --- buildIcalString ---

test('buildIcalString: contains VCALENDAR wrapper', () => {
  const ical = buildIcalString({ uid: UID, title: 'T', startIso: START, endIso: END })
  assert.ok(ical.includes('BEGIN:VCALENDAR'))
  assert.ok(ical.includes('END:VCALENDAR'))
})

test('buildIcalString: contains VEVENT wrapper', () => {
  const ical = buildIcalString({ uid: UID, title: 'T', startIso: START, endIso: END })
  assert.ok(ical.includes('BEGIN:VEVENT'))
  assert.ok(ical.includes('END:VEVENT'))
})

test('buildIcalString: METHOD is PUBLISH when no organizer', () => {
  const ical = buildIcalString({ uid: UID, title: 'T', startIso: START, endIso: END })
  assert.ok(ical.includes('METHOD:PUBLISH'))
  assert.ok(!ical.includes('METHOD:REQUEST'))
})

test('buildIcalString: METHOD is REQUEST when organizer provided', () => {
  const ical = buildIcalString({
    uid: UID, title: 'T', startIso: START, endIso: END,
    organizer: { name: 'Joe Che', email: 'joe@mastermindshq.business' },
  })
  assert.ok(ical.includes('METHOD:REQUEST'))
  assert.ok(!ical.includes('METHOD:PUBLISH'))
})

test('buildIcalString: UID is present', () => {
  const ical = buildIcalString({ uid: UID, title: 'T', startIso: START, endIso: END })
  assert.ok(ical.includes(`UID:${UID}`))
})

test('buildIcalString: SEQUENCE defaults to 0', () => {
  const ical = buildIcalString({ uid: UID, title: 'T', startIso: START, endIso: END })
  assert.ok(ical.includes('SEQUENCE:0'))
})

test('buildIcalString: SEQUENCE is set when provided', () => {
  const ical = buildIcalString({ uid: UID, title: 'T', startIso: START, endIso: END, sequence: 1 })
  assert.ok(ical.includes('SEQUENCE:1'))
  assert.ok(!ical.includes('SEQUENCE:0'))
})

test('buildIcalString: SUMMARY contains the title', () => {
  const ical = buildIcalString({ uid: UID, title: 'AI Avatar Lab', startIso: START, endIso: END })
  assert.ok(ical.includes('SUMMARY:AI Avatar Lab'))
})

test('buildIcalString: special characters in title are escaped', () => {
  const ical = buildIcalString({ uid: UID, title: 'Food, Drink & Fun', startIso: START, endIso: END })
  assert.ok(ical.includes('SUMMARY:Food\\, Drink & Fun'))
})

test('buildIcalString: ORGANIZER line present when provided', () => {
  const ical = buildIcalString({
    uid: UID, title: 'T', startIso: START, endIso: END,
    organizer: { name: 'Joe Che', email: 'joe@mastermindshq.business' },
  })
  assert.ok(ical.includes('ORGANIZER'))
  assert.ok(ical.includes('joe@mastermindshq.business'))
})

test('buildIcalString: ATTENDEE line present when provided', () => {
  const ical = buildIcalString({
    uid: UID, title: 'T', startIso: START, endIso: END,
    organizer: { name: 'Joe Che', email: 'joe@mastermindshq.business' },
    attendee: { name: 'Alice', email: 'alice@example.com' },
  })
  assert.ok(ical.includes('ATTENDEE'))
  assert.ok(ical.includes('alice@example.com'))
})

test('buildIcalString: LOCATION present when provided', () => {
  const ical = buildIcalString({ uid: UID, title: 'T', startIso: START, endIso: END, location: 'Canggu' })
  assert.ok(ical.includes('LOCATION:Canggu'))
})

test('buildIcalString: LOCATION absent when not provided', () => {
  const ical = buildIcalString({ uid: UID, title: 'T', startIso: START, endIso: END })
  assert.ok(!ical.includes('LOCATION:'))
})

test('buildIcalString: DTSTART and DTEND are compact UTC timestamps', () => {
  const ical = buildIcalString({ uid: UID, title: 'T', startIso: START, endIso: END })
  assert.match(ical, /DTSTART:\d{8}T\d{6}Z/)
  assert.match(ical, /DTEND:\d{8}T\d{6}Z/)
})

test('buildIcalString: lines are separated by CRLF', () => {
  const ical = buildIcalString({ uid: UID, title: 'T', startIso: START, endIso: END })
  assert.ok(ical.includes('\r\n'))
})

test('buildIcalString: same UID across SEQUENCE:0 and SEQUENCE:1 (update, not duplicate)', () => {
  const base = buildIcalString({ uid: UID, title: 'T', startIso: START, endIso: END, sequence: 0 })
  const update = buildIcalString({ uid: UID, title: 'T', startIso: START, endIso: END, sequence: 1 })
  assert.ok(base.includes(`UID:${UID}`) && update.includes(`UID:${UID}`))
  assert.ok(base.includes('SEQUENCE:0') && update.includes('SEQUENCE:1'))
})
