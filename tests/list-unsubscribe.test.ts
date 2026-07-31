import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildUnsubscribeToken,
  buildUnsubscribeUrl,
  buildUnsubscribeHeaders,
  verifyUnsubscribeToken,
} from '../src/lib/list-unsubscribe'

// UNSUBSCRIBE_TOKEN_SECRET is set in .env.local for local dev; tsx does not
// auto-load it, so pin a deterministic secret for this test run.
const originalSecret = process.env.UNSUBSCRIBE_TOKEN_SECRET
test.beforeEach(() => { process.env.UNSUBSCRIBE_TOKEN_SECRET = 'test-secret-do-not-use-in-prod' })
test.afterEach(() => { process.env.UNSUBSCRIBE_TOKEN_SECRET = originalSecret })

test('round-trips: verifyUnsubscribeToken(buildUnsubscribeToken(email)) recovers the email', () => {
  const email = 'Joe@Example.com'
  const token = buildUnsubscribeToken(email)
  const result = verifyUnsubscribeToken(token)

  assert.equal(result.valid, true)
  assert.equal(result.email, 'joe@example.com') // normalized lowercase
})

test('a tampered token (flipped signature) is rejected', () => {
  const token = buildUnsubscribeToken('alice@example.com')
  const [payload, signature] = token.split('.')

  // Flip a character in the signature.
  const tamperedSig = signature[0] === 'a' ? 'b' + signature.slice(1) : 'a' + signature.slice(1)
  const tampered = `${payload}.${tamperedSig}`

  const result = verifyUnsubscribeToken(tampered)
  assert.equal(result.valid, false)
  assert.equal(result.email, null)
})

test('a tampered payload (different email, same signature) is rejected', () => {
  const tokenA = buildUnsubscribeToken('alice@example.com')
  const tokenB = buildUnsubscribeToken('bob@example.com')
  const [, signatureA] = tokenA.split('.')
  const [payloadB] = tokenB.split('.')

  // Attacker tries to reuse alice's signature with bob's payload.
  const frankensteined = `${payloadB}.${signatureA}`

  const result = verifyUnsubscribeToken(frankensteined)
  assert.equal(result.valid, false)
})

test('garbage input is rejected without throwing', () => {
  for (const bad of [null, undefined, '', 'not-a-token', '...', 'onlyonepart', '.nopeayload']) {
    const result = verifyUnsubscribeToken(bad as unknown as string)
    assert.equal(result.valid, false)
    assert.equal(result.email, null)
  }
})

test('a token signed under a different secret is rejected', () => {
  const email = 'carol@example.com'
  const token = buildUnsubscribeToken(email)

  process.env.UNSUBSCRIBE_TOKEN_SECRET = 'a-completely-different-secret'
  try {
    const result = verifyUnsubscribeToken(token)
    assert.equal(result.valid, false)
  } finally {
    process.env.UNSUBSCRIBE_TOKEN_SECRET = 'test-secret-do-not-use-in-prod'
  }
})

test('buildUnsubscribeUrl embeds a verifiable token under /api/unsubscribe', () => {
  const email = 'dana@example.com'
  const url = buildUnsubscribeUrl(email)

  assert.match(url, /\/api\/unsubscribe\?token=/)

  const token = decodeURIComponent(url.split('token=')[1])
  const result = verifyUnsubscribeToken(token)
  assert.equal(result.valid, true)
  assert.equal(result.email, email)
})

test('buildUnsubscribeHeaders returns RFC 8058 headers with no mailto: form', () => {
  const headers = buildUnsubscribeHeaders('erin@example.com')

  assert.match(headers['List-Unsubscribe'], /^<https?:\/\/.+\/api\/unsubscribe\?token=.+>$/)
  assert.equal(headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click')
  assert.ok(!headers['List-Unsubscribe'].includes('mailto:'), 'must not include a mailto: form')
})
