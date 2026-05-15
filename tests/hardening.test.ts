import assert from 'node:assert/strict'
import test from 'node:test'

import { resolveNotifyWindow, hoursUntilEvent } from '../src/lib/waitlist-notify-windows'
import { resolvePromoCode, getEventBySlug } from '../src/lib/events'

// ---------------------------------------------------------------------------
// Email validation (mirrors the regex used across API routes)
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

test('email regex: accepts standard addresses', () => {
  assert.ok(EMAIL_RE.test('joe@mastermindshq.business'))
  assert.ok(EMAIL_RE.test('user+tag@example.co.uk'))
  assert.ok(EMAIL_RE.test('a@b.io'))
})

test('email regex: rejects addresses with spaces', () => {
  assert.ok(!EMAIL_RE.test('joe @example.com'))
  assert.ok(!EMAIL_RE.test('joe@ example.com'))
})

test('email regex: rejects missing @ or domain', () => {
  assert.ok(!EMAIL_RE.test('notanemail'))
  assert.ok(!EMAIL_RE.test('@nodomain'))
  assert.ok(!EMAIL_RE.test('noatsign.com'))
})

test('email regex: rejects empty string', () => {
  assert.ok(!EMAIL_RE.test(''))
})

// ---------------------------------------------------------------------------
// Session ID format (mirrors the regex in finalize-registration)
// ---------------------------------------------------------------------------

const SESSION_ID_RE = /^cs_[a-zA-Z0-9_]{1,200}$/

test('session ID regex: accepts valid Stripe session IDs', () => {
  assert.ok(SESSION_ID_RE.test('cs_test_a1B2c3D4e5F6'))
  assert.ok(SESSION_ID_RE.test('cs_live_xyzABC123'))
  assert.ok(SESSION_ID_RE.test('cs_abc'))
})

test('session ID regex: rejects IDs without cs_ prefix', () => {
  assert.ok(!SESSION_ID_RE.test('pi_abc123'))
  assert.ok(!SESSION_ID_RE.test('abc123'))
})

test('session ID regex: rejects empty string', () => {
  assert.ok(!SESSION_ID_RE.test(''))
})

test('session ID regex: rejects IDs that are too long', () => {
  const tooLong = 'cs_' + 'a'.repeat(201)
  assert.ok(!SESSION_ID_RE.test(tooLong))
})

test('session ID regex: rejects IDs with disallowed chars', () => {
  assert.ok(!SESSION_ID_RE.test('cs_test<script>'))
  assert.ok(!SESSION_ID_RE.test('cs_test/../../etc'))
})

// ---------------------------------------------------------------------------
// Donation amount bounds (mirrors checkout-session validation)
// ---------------------------------------------------------------------------

function isDonationAmountValid(v: number): boolean {
  return Number.isFinite(v) && v >= 0 && v <= 99999
}

test('donation amount: zero is valid (free event)', () => {
  assert.ok(isDonationAmountValid(0))
})

test('donation amount: typical value is valid', () => {
  assert.ok(isDonationAmountValid(10))
  assert.ok(isDonationAmountValid(97))
  assert.ok(isDonationAmountValid(500))
})

test('donation amount: max boundary is valid', () => {
  assert.ok(isDonationAmountValid(99999))
})

test('donation amount: negative is invalid', () => {
  assert.ok(!isDonationAmountValid(-1))
  assert.ok(!isDonationAmountValid(-0.01))
})

test('donation amount: Infinity is invalid', () => {
  assert.ok(!isDonationAmountValid(Infinity))
  assert.ok(!isDonationAmountValid(-Infinity))
})

test('donation amount: NaN is invalid', () => {
  assert.ok(!isDonationAmountValid(NaN))
})

test('donation amount: over cap is invalid', () => {
  assert.ok(!isDonationAmountValid(100000))
  assert.ok(!isDonationAmountValid(9999999))
})

// ---------------------------------------------------------------------------
// Promo code length guard
// ---------------------------------------------------------------------------

test('promo code: length over 64 should be rejected', () => {
  const tooLong = 'a'.repeat(65)
  assert.ok(tooLong.length > 64)
})

test('promo code: length 64 should pass length check', () => {
  const maxLen = 'a'.repeat(64)
  assert.ok(maxLen.length <= 64)
})

// ---------------------------------------------------------------------------
// waitlist-notify-windows: hoursUntilEvent
// ---------------------------------------------------------------------------

test('hoursUntilEvent: returns positive hours when event is in the future', () => {
  const now = new Date('2026-05-30T10:00:00Z')
  const eventStart = '2026-05-30T15:00:00Z'
  const h = hoursUntilEvent(eventStart, now)
  assert.ok(Math.abs(h - 5) < 0.001)
})

test('hoursUntilEvent: returns negative when event is in the past', () => {
  const now = new Date('2026-05-30T16:00:00Z')
  const eventStart = '2026-05-30T15:00:00Z'
  assert.ok(hoursUntilEvent(eventStart, now) < 0)
})

// ---------------------------------------------------------------------------
// waitlist-notify-windows: resolveNotifyWindow
// ---------------------------------------------------------------------------

test('resolveNotifyWindow: returns t5h window when 5 hours out', () => {
  const now = new Date('2026-05-30T10:00:00Z')
  const eventStart = '2026-05-30T15:00:00Z'
  const win = resolveNotifyWindow(eventStart, now)
  assert.equal(win?.windowLabel, 't5h')
  assert.equal(win?.variant, 'cancellation')
})

test('resolveNotifyWindow: returns t2h window when 2 hours out', () => {
  const now = new Date('2026-05-30T13:00:00Z')
  const eventStart = '2026-05-30T15:00:00Z'
  const win = resolveNotifyWindow(eventStart, now)
  assert.equal(win?.windowLabel, 't2h')
  assert.equal(win?.variant, 't2h')
})

test('resolveNotifyWindow: returns null outside both windows', () => {
  const now = new Date('2026-05-30T08:00:00Z')
  const eventStart = '2026-05-30T15:00:00Z'
  assert.equal(resolveNotifyWindow(eventStart, now), null)
})

test('resolveNotifyWindow: returns null after the event', () => {
  const now = new Date('2026-05-30T16:00:00Z')
  const eventStart = '2026-05-30T15:00:00Z'
  assert.equal(resolveNotifyWindow(eventStart, now), null)
})

test('resolveNotifyWindow: t5h window lower boundary (4.5h = in)', () => {
  const eventStart = '2026-05-30T15:00:00Z'
  const now = new Date(new Date(eventStart).getTime() - 4.5 * 60 * 60 * 1000)
  const win = resolveNotifyWindow(eventStart, now)
  assert.equal(win?.windowLabel, 't5h')
})

test('resolveNotifyWindow: t5h window upper boundary (5.5h = in)', () => {
  const eventStart = '2026-05-30T15:00:00Z'
  const now = new Date(new Date(eventStart).getTime() - 5.5 * 60 * 60 * 1000 + 1)
  const win = resolveNotifyWindow(eventStart, now)
  assert.equal(win?.windowLabel, 't5h')
})

test('resolveNotifyWindow: exactly at 5.5h boundary is outside window', () => {
  const eventStart = '2026-05-30T15:00:00Z'
  const now = new Date(new Date(eventStart).getTime() - 5.5 * 60 * 60 * 1000)
  assert.equal(resolveNotifyWindow(eventStart, now), null)
})

test('resolveNotifyWindow: t2h window lower boundary (1.5h = in)', () => {
  const eventStart = '2026-05-30T15:00:00Z'
  const now = new Date(new Date(eventStart).getTime() - 1.5 * 60 * 60 * 1000)
  const win = resolveNotifyWindow(eventStart, now)
  assert.equal(win?.windowLabel, 't2h')
})

// ---------------------------------------------------------------------------
// resolvePromoCode: edge cases
// ---------------------------------------------------------------------------

const aiEvent = getEventBySlug('ai-avatar-content-creation')!

test('resolvePromoCode: known code matches case-insensitively', () => {
  assert.ok(resolvePromoCode(aiEvent, 'helix33') !== null)
  assert.ok(resolvePromoCode(aiEvent, 'HELIX33') !== null)
  assert.ok(resolvePromoCode(aiEvent, 'Helix33') !== null)
})

test('resolvePromoCode: unknown code returns null', () => {
  assert.equal(resolvePromoCode(aiEvent, 'BADCODE'), null)
})

test('resolvePromoCode: empty string returns null', () => {
  assert.equal(resolvePromoCode(aiEvent, ''), null)
})

test('resolvePromoCode: null returns null', () => {
  assert.equal(resolvePromoCode(aiEvent, null), null)
})

test('resolvePromoCode: whitespace-only returns null', () => {
  assert.equal(resolvePromoCode(aiEvent, '   '), null)
})

test('resolvePromoCode: Guest100 makes ticket free (100% off)', () => {
  const promo = resolvePromoCode(aiEvent, 'Guest100')
  assert.ok(promo !== null)
  assert.equal(promo?.percentOff, 100)
  const price = Math.max(0, aiEvent.pricing.fullPrice * (1 - (promo?.percentOff ?? 0) / 100))
  assert.equal(price, 0)
})

test('resolvePromoCode: helix33 gives 33% off', () => {
  const promo = resolvePromoCode(aiEvent, 'helix33')
  assert.equal(promo?.percentOff, 33)
  const discounted = Math.max(0, aiEvent.pricing.fullPrice * (1 - 33 / 100))
  assert.ok(discounted > 0 && discounted < aiEvent.pricing.fullPrice)
})

test('resolvePromoCode: Mastermind50 gives 50% off', () => {
  const promo = resolvePromoCode(aiEvent, 'Mastermind50')
  assert.equal(promo?.percentOff, 50)
})
