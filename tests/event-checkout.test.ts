import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildEventCheckoutSessionParams,
  resolveCheckoutMode,
  resolveEventCheckoutAmount,
} from '../src/lib/event-checkout'
import { getEventBySlug, resolvePromoCode } from '../src/lib/events'

test('checkout mode defaults to hosted and requires explicit embedded capability', () => {
  assert.equal(resolveCheckoutMode(null, true), 'hosted')
  assert.equal(resolveCheckoutMode('embedded', true), 'embedded')
  assert.equal(resolveCheckoutMode('hosted', true), 'hosted')
  assert.equal(resolveCheckoutMode(null, false), 'hosted')
  assert.equal(resolveCheckoutMode('embedded', false), 'hosted')
})

test('donation checkout uses the submitted donation amount and clamps to minimum', () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)

  assert.equal(resolveEventCheckoutAmount({ event, rawDonationAmount: 12 }).amount, 12)
  assert.equal(resolveEventCheckoutAmount({ event, rawDonationAmount: -5 }).amount, event.pricing.minDonation)
  assert.equal(resolveEventCheckoutAmount({ event, rawDonationAmount: null }).amount, event.pricing.fullPrice)
})

test('paid checkout applies promo code discounts', () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event)

  const result = resolveEventCheckoutAmount({ event, promoCode: 'Mastermind50' })
  assert.equal(result.promo?.code, 'Mastermind50')
  assert.equal(result.amount, 48.5)
})

test('paid checkout applies Marina affiliate discount and keeps referral metadata', () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event)

  const result = resolveEventCheckoutAmount({ event, promoCode: 'marina' })
  assert.equal(result.promo?.code, 'MARINA')
  assert.equal(result.amount, 87.3)
})

test('embedded checkout session params use embedded page return flow', () => {
  const event = getEventBySlug('connection-dinner-canggu')
  assert.ok(event)

  const params = buildEventCheckoutSessionParams({
    event,
    attendeeName: 'Test Buyer',
    attendeeEmail: 'buyer@example.com',
    amount: 10,
    promo: null,
    baseUrl: 'https://workshop.mastermindshq.business',
    mode: 'embedded',
  })

  assert.equal(params.ui_mode, 'embedded_page')
  assert.equal(params.success_url, undefined)
  assert.equal(params.cancel_url, undefined)
  assert.ok(params.return_url?.includes('/events/connection-dinner-canggu?checkout=success'))
  assert.equal(params.redirect_on_completion, 'if_required')
  assert.equal(params.line_items?.[0]?.price_data?.unit_amount, 1000)
  assert.equal(params.metadata?.event_slug, event.slug)
})

test('hosted checkout session params use Stripe-hosted redirect flow', () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event)
  const promo = resolvePromoCode(event, 'Guest99')
  assert.ok(promo)

  const params = buildEventCheckoutSessionParams({
    event,
    attendeeName: 'Test Buyer',
    attendeeEmail: 'buyer@example.com',
    amount: 0.97,
    promo,
    baseUrl: 'https://workshop.mastermindshq.business',
    mode: 'hosted',
  })

  assert.equal(params.ui_mode, 'hosted_page')
  assert.equal(params.return_url, undefined)
  assert.equal(params.redirect_on_completion, undefined)
  assert.ok(params.success_url?.includes('/events/ai-avatar-content-creation?checkout=success'))
  assert.ok(params.cancel_url?.includes('/events/ai-avatar-content-creation?checkout=cancelled'))
  assert.equal(params.line_items?.[0]?.price_data?.unit_amount, 97)
  assert.equal(params.metadata?.promo_code, 'Guest99')
})

test('hosted checkout session params retain Marina referral code metadata', () => {
  const event = getEventBySlug('ai-avatar-content-creation')
  assert.ok(event)
  const promo = resolvePromoCode(event, 'MARINA')
  assert.ok(promo)

  const params = buildEventCheckoutSessionParams({
    event,
    attendeeName: 'Referral Buyer',
    attendeeEmail: 'referral@example.com',
    amount: 87.3,
    promo,
    baseUrl: 'https://workshop.mastermindshq.business',
    mode: 'hosted',
  })

  assert.equal(params.line_items?.[0]?.price_data?.unit_amount, 8730)
  assert.equal(params.metadata?.promo_code, 'MARINA')
  assert.equal(params.payment_intent_data?.metadata?.promo_code, 'MARINA')
})
