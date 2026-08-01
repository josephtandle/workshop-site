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
import { getEventBySlug } from '../src/lib/events'

const VALID_BUSINESS_ANSWER =
  'I run a small design studio in Canggu doing brand work for hospitality clients, and so far I only use AI for first-draft copy.'

test('business-blocks-ai-solved collects both intake fields and is priced at $22', () => {
  const event = getEventBySlug('business-blocks-ai-solved')
  assert.ok(event)
  assert.equal(event.intakeFields?.whatsappNumber, true)
  assert.equal(event.intakeFields?.businessContext, true)
  assert.equal(event.pricing.fullPrice, 22)
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
