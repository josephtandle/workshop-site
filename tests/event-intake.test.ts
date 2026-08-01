import assert from 'node:assert/strict'
import test from 'node:test'

import {
  BUSINESS_CONTEXT_MIN_LENGTH,
  hasIntakeErrors,
  normalizeWhatsappNumber,
  validateBusinessContext,
  validateIntakeFields,
  validateWhatsappNumber,
} from '../src/lib/event-intake'
import { formatEventPrice, getEventBySlug } from '../src/lib/events'
import { resolveEventCheckoutAmount } from '../src/lib/event-checkout'
import { toStripeUnitAmount, MIN_STRIPE_USD_CHARGE_CENTS } from '../src/lib/stripe-amount'

const VALID_BUSINESS_ANSWER =
  'I run a small design studio in Canggu doing brand work for hospitality clients, and so far I only use AI for first-draft copy.'

test('business-blocks-ai-solved collects both intake fields and is priced at $22', () => {
  const event = getEventBySlug('business-blocks-ai-solved')
  assert.ok(event)
  assert.equal(event.intakeFields?.whatsappNumber, true)
  assert.equal(event.intakeFields?.businessContext, true)
  assert.equal(event.pricing.fullPrice, 22)
})

test('JOETEST still runs the real Stripe path, not the free bypass', () => {
  const event = getEventBySlug('business-blocks-ai-solved')!
  const { amount, promo } = resolveEventCheckoutAmount({ event, promoCode: 'JOETEST' })

  assert.equal(promo?.code, 'JOETEST')
  const cents = toStripeUnitAmount(amount)

  // The whole point of the test code: a real charge, so checkout-session does
  // NOT take the `unitAmount === 0` branch that skips Stripe.
  assert.notEqual(cents, null, 'must not fall below the Stripe minimum')
  assert.notEqual(cents, 0, 'a $0 total would bypass Stripe and prove nothing')
  assert.ok(cents! >= MIN_STRIPE_USD_CHARGE_CENTS)

  // Assert on cents and on the rendered string, not the raw float: percentOff
  // math yields 1.100000000000001, which Math.round and toFixed(2) both settle.
  assert.equal(cents, 110)
  assert.equal(formatEventPrice(event, promo!), '$1.10')
})

test('a 99% code would be rejected on a $22 ticket (why JOETEST is 95%)', () => {
  const event = getEventBySlug('business-blocks-ai-solved')!
  // 99% of $22 is $0.22, under Stripe's floor. Documents the trap so nobody
  // "tidies" JOETEST up to the usual Guest99.
  assert.equal(toStripeUnitAmount(event.pricing.fullPrice * 0.01), null)
})

test('GUESTOFMARINA comps a seat to exactly zero', () => {
  const event = getEventBySlug('business-blocks-ai-solved')!
  const { amount } = resolveEventCheckoutAmount({ event, promoCode: 'GUESTOFMARINA' })
  assert.equal(toStripeUnitAmount(amount), 0, 'a comp must be free, which skips Stripe by design')
})

test('the event carries its own success copy, not the generic setup-accounts line', () => {
  const event = getEventBySlug('business-blocks-ai-solved')!
  assert.ok(event.successDetail, 'without this the modal claims there are two accounts to set up')
  assert.doesNotMatch(event.successDetail!, /setup page|two free accounts/i)
  assert.doesNotMatch(event.successDetail!, /—/, 'no em dashes in attendee-facing copy')
})

test('no attendee-facing copy on this event leaks internal sync wording', () => {
  const event = getEventBySlug('business-blocks-ai-solved')!
  const attendeeFacing = [
    event.successDetail,
    event.pricing.checkoutNote,
    event.postPurchase?.setupPageTitle,
    event.postPurchase?.setupPageIntro,
    ...(event.postPurchase?.setupPageBody ?? []),
  ].filter(Boolean) as string[]

  for (const copy of attendeeFacing) {
    assert.doesNotMatch(copy, /legacy/i, `internal wording leaked to attendees: ${copy}`)
  }
})

test('events without intakeFields are unaffected', () => {
  for (const slug of ['connection-dinner-canggu', 'ask-an-ai-expert']) {
    assert.equal(getEventBySlug(slug)?.intakeFields, undefined, `${slug} should not collect intake`)
  }
})

test('whatsapp number requires a real number with enough digits', () => {
  assert.ok(validateWhatsappNumber(''), 'empty is rejected')
  assert.ok(validateWhatsappNumber('   '), 'whitespace is rejected')
  assert.ok(validateWhatsappNumber('12345'), 'too few digits is rejected')
  assert.ok(validateWhatsappNumber('not a phone'), 'letters are rejected')
  assert.ok(validateWhatsappNumber('+1234567890123456789'), 'too many digits is rejected')
})

test('whatsapp number accepts common international formats', () => {
  for (const value of ['+62 812 3456 7890', '+1 (646) 230-4209', '081234567890', '+6281234567890']) {
    assert.equal(validateWhatsappNumber(value), undefined, `${value} should be accepted`)
  }
})

test('whatsapp normalisation keeps the country-code marker and drops formatting', () => {
  assert.equal(normalizeWhatsappNumber('+62 812 3456 7890'), '+6281234567890')
  assert.equal(normalizeWhatsappNumber('+1 (646) 230-4209'), '+16462304209')
  assert.equal(normalizeWhatsappNumber('081234567890'), '081234567890')
})

test('business context requires at least one real sentence', () => {
  assert.ok(validateBusinessContext(''), 'empty is rejected')
  assert.ok(validateBusinessContext('coaching'), 'one word is rejected')
  assert.ok(validateBusinessContext('a'.repeat(BUSINESS_CONTEXT_MIN_LENGTH - 1)), 'just under the floor is rejected')
  assert.equal(
    validateBusinessContext('a'.repeat(BUSINESS_CONTEXT_MIN_LENGTH)),
    undefined,
    'exactly the floor is accepted',
  )
  assert.equal(validateBusinessContext(VALID_BUSINESS_ANSWER), undefined)
})

test('business context ignores padding whitespace when measuring length', () => {
  const padded = `   ${'a'.repeat(BUSINESS_CONTEXT_MIN_LENGTH - 10)}   `
  assert.ok(validateBusinessContext(padded), 'whitespace must not count toward the minimum')
})

test('business context rejects an answer beyond the storage limit', () => {
  assert.ok(validateBusinessContext('a'.repeat(5000)))
})

test('validateIntakeFields reports both fields together', () => {
  const errors = validateIntakeFields({ whatsappNumber: '', businessContext: '' })
  assert.ok(errors.whatsappNumber)
  assert.ok(errors.businessContext)
  assert.equal(hasIntakeErrors(errors), true)
})

test('validateIntakeFields passes clean input', () => {
  const errors = validateIntakeFields({
    whatsappNumber: '+62 812 3456 7890',
    businessContext: VALID_BUSINESS_ANSWER,
  })
  assert.equal(hasIntakeErrors(errors), false)
})

test('the countdown message tells the user how many characters remain', () => {
  const message = validateBusinessContext('a'.repeat(BUSINESS_CONTEXT_MIN_LENGTH - 5))
  assert.match(String(message), /5 more characters/)
})
