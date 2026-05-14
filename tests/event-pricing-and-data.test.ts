import assert from 'node:assert/strict'
import test from 'node:test'

import { events, getLiveEvents, getEventBySlug, resolvePromoCode, formatEventPrice } from '../src/lib/events'
import { resolveNotifyWindow, hoursUntilEvent } from '../src/lib/waitlist-notify-windows'
import { toOrigin } from '../src/lib/url-utils'

// ─── Event data integrity ──────────────────────────────────────────────────────

test('no two events share the same slug', () => {
  const slugs = events.map((e) => e.slug)
  const unique = new Set(slugs)
  assert.equal(unique.size, slugs.length, `Duplicate slugs found: ${slugs.join(', ')}`)
})

test('all live events have required string fields', () => {
  for (const event of getLiveEvents()) {
    assert.ok(event.slug, `${event.slug}: missing slug`)
    assert.ok(event.title, `${event.slug}: missing title`)
    assert.ok(event.dateLabel, `${event.slug}: missing dateLabel`)
    assert.ok(event.timeLabel, `${event.slug}: missing timeLabel`)
    assert.ok(event.locationLabel, `${event.slug}: missing locationLabel`)
    assert.ok(event.heroImage, `${event.slug}: missing heroImage`)
  }
})

test('connection dinner has capacity and emailConfig set', () => {
  const dinner = getEventBySlug('connection-dinner-canggu')
  assert.ok(dinner, 'connection dinner event must exist')
  assert.ok(typeof dinner.capacity === 'number' && dinner.capacity > 0, 'must have positive capacity')
  assert.ok(dinner.emailConfig, 'must have emailConfig')
  assert.equal(dinner.emailConfig?.headerLabel, null, 'header should be suppressed (null)')
  assert.ok(dinner.emailConfig?.mapsUrl, 'must have a Google Maps URL')
  assert.equal(dinner.emailConfig?.skipSetupInstructions, true, 'must skip setup instructions')
})

test('donation-mode events have minDonation defined', () => {
  for (const event of events) {
    if (event.pricing.donationMode) {
      assert.ok(
        typeof event.pricing.minDonation === 'number',
        `${event.slug}: donationMode event must have minDonation`,
      )
    }
  }
})

test('all promo codes within an event are unique (case-insensitive)', () => {
  for (const event of events) {
    const codes = (event.pricing.promoCodes ?? []).map((p) => p.code.toUpperCase())
    const unique = new Set(codes)
    assert.equal(unique.size, codes.length, `${event.slug}: duplicate promo codes`)
  }
})

// ─── resolvePromoCode ──────────────────────────────────────────────────────────

test('resolvePromoCode finds a code case-insensitively', () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event)

  const promo = resolvePromoCode(event, 'helix33')
  assert.ok(promo, 'should resolve lowercase "helix33"')
  assert.equal(promo.code, 'helix33')
  assert.equal(promo.percentOff, 33)
})

test('resolvePromoCode matches regardless of input case', () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event)

  const lower = resolvePromoCode(event, 'helix33')
  const upper = resolvePromoCode(event, 'HELIX33')
  const mixed = resolvePromoCode(event, 'Helix33')

  assert.ok(lower && upper && mixed)
  assert.equal(lower.code, upper.code)
  assert.equal(lower.code, mixed.code)
})

test('resolvePromoCode returns null for an unknown code', () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event)
  assert.equal(resolvePromoCode(event, 'NOTACODE'), null)
})

test('resolvePromoCode returns null for empty or whitespace input', () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event)
  assert.equal(resolvePromoCode(event, ''), null)
  assert.equal(resolvePromoCode(event, '   '), null)
})

test('resolvePromoCode returns null for events with no promo codes', () => {
  const dinner = getEventBySlug('connection-dinner-canggu')
  assert.ok(dinner)
  assert.equal(resolvePromoCode(dinner, 'anything'), null)
})

// ─── formatEventPrice ──────────────────────────────────────────────────────────

test('formatEventPrice returns the full price when no promo is applied', () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event)
  assert.equal(formatEventPrice(event), '$97')
})

test('formatEventPrice applies percentOff correctly', () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event)
  const promo = resolvePromoCode(event, 'Mastermind50')
  assert.ok(promo)
  // $97 - 50% = $48.50 (two decimal places for non-integers)
  assert.equal(formatEventPrice(event, promo), '$48.50')
})

test('formatEventPrice applies 100% off (free ticket)', () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event)
  const promo = resolvePromoCode(event, 'Guest100')
  assert.ok(promo)
  assert.equal(formatEventPrice(event, promo), '$0')
})

test('formatEventPrice never returns a negative price', () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event)
  // Synthetic over-discount: amountOff greater than the full price
  const bigDiscount = { code: 'BIG', label: 'Big', description: '', amountOff: 9999 }
  assert.equal(formatEventPrice(event, bigDiscount), '$0')
})

// ─── Cron notify window detection ─────────────────────────────────────────────

const EVENT_START = '2026-05-27T18:00:00+08:00' // 10:00 UTC

function nowAt(hoursBeforeEvent: number): Date {
  const eventMs = new Date(EVENT_START).getTime()
  return new Date(eventMs - hoursBeforeEvent * 60 * 60 * 1000)
}

test('hoursUntilEvent returns the correct fractional hours', () => {
  const now = nowAt(5)
  const hours = hoursUntilEvent(EVENT_START, now)
  assert.ok(Math.abs(hours - 5) < 0.001, `expected ~5, got ${hours}`)
})

test('resolveNotifyWindow returns t5h at exactly 5h before the event', () => {
  const win = resolveNotifyWindow(EVENT_START, nowAt(5))
  assert.ok(win)
  assert.equal(win.windowLabel, 't5h')
  assert.equal(win.variant, 'cancellation')
})

test('resolveNotifyWindow returns t5h at the start of the window (4.5h)', () => {
  const win = resolveNotifyWindow(EVENT_START, nowAt(4.5))
  assert.ok(win)
  assert.equal(win.windowLabel, 't5h')
})

test('resolveNotifyWindow returns null just outside the t5h window (5.5h)', () => {
  // Exactly at the boundary — the window is [4.5, 5.5), so 5.5 is outside
  const win = resolveNotifyWindow(EVENT_START, nowAt(5.5))
  assert.equal(win, null)
})

test('resolveNotifyWindow returns null between the two windows (3h before)', () => {
  const win = resolveNotifyWindow(EVENT_START, nowAt(3))
  assert.equal(win, null)
})

test('resolveNotifyWindow returns t2h at exactly 2h before the event', () => {
  const win = resolveNotifyWindow(EVENT_START, nowAt(2))
  assert.ok(win)
  assert.equal(win.windowLabel, 't2h')
  assert.equal(win.variant, 't2h')
})

test('resolveNotifyWindow returns t2h at the start of the window (1.5h)', () => {
  const win = resolveNotifyWindow(EVENT_START, nowAt(1.5))
  assert.ok(win)
  assert.equal(win.windowLabel, 't2h')
})

test('resolveNotifyWindow returns null just outside the t2h window (2.5h)', () => {
  const win = resolveNotifyWindow(EVENT_START, nowAt(2.5))
  assert.equal(win, null)
})

test('resolveNotifyWindow returns null after the event has started', () => {
  const win = resolveNotifyWindow(EVENT_START, nowAt(-1))
  assert.equal(win, null)
})

// ─── URL / origin parsing ──────────────────────────────────────────────────────

test('toOrigin extracts origin from a full URL', () => {
  assert.equal(toOrigin('https://workshop.mastermindshq.business/events/foo'), 'https://workshop.mastermindshq.business')
})

test('toOrigin handles a URL with a port', () => {
  assert.equal(toOrigin('http://localhost:3000/foo'), 'http://localhost:3000')
})

test('toOrigin adds https:// when the scheme is missing', () => {
  assert.equal(toOrigin('workshop.mastermindshq.business'), 'https://workshop.mastermindshq.business')
})

test('toOrigin returns null for null/empty input', () => {
  assert.equal(toOrigin(null), null)
  assert.equal(toOrigin(''), null)
  assert.equal(toOrigin(undefined), null)
})

test('toOrigin returns null for garbage input', () => {
  assert.equal(toOrigin('not a url at all !!'), null)
})
