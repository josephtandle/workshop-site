import assert from 'node:assert/strict'
import test from 'node:test'
import { createRegistrationProfileToken, verifyRegistrationProfileToken } from '../src/lib/registration-profile-token'
import { isValidAiLevel } from '../src/lib/event-intake'
import { AI_LEVELS_SIGNUP } from '../src/data/ai-levels-signup'

const secret = 'test-only-registration-profile-secret'

test('profile token binds the normalized email and event', () => {
  const token = createRegistrationProfileToken('class', ' PERSON@example.com ', secret)
  assert.equal(verifyRegistrationProfileToken('class', 'person@example.com', token, secret), true)
  assert.equal(verifyRegistrationProfileToken('class', 'other@example.com', token, secret), false)
  assert.equal(verifyRegistrationProfileToken('other-class', 'person@example.com', token, secret), false)
  const tampered = (token[0] === 'a' ? 'b' : 'a') + token.slice(1)
  assert.equal(verifyRegistrationProfileToken('class', 'person@example.com', tampered, secret), false)
  for (const invalid of ['', 'abc', 'z'.repeat(64), token + '00']) {
    assert.equal(verifyRegistrationProfileToken('class', 'person@example.com', invalid, secret), false)
  }
})

test('AI levels accept only integers from 0 through 14', () => {
  for (const value of [0, 14]) assert.equal(isValidAiLevel(value), true)
  for (const value of [-1, 15, 2.5, '3', null, undefined, NaN, Infinity]) {
    assert.equal(isValidAiLevel(value), false)
  }
})

test('signup levels are consecutive, complete and have no em dashes', () => {
  assert.equal(AI_LEVELS_SIGNUP.length, 15)
  assert.deepEqual(AI_LEVELS_SIGNUP.map(({ level }) => level), Array.from({ length: 15 }, (_, i) => i))
  assert.doesNotMatch(JSON.stringify(AI_LEVELS_SIGNUP), /\u2014/)
})
