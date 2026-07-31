import assert from 'node:assert/strict'
import test from 'node:test'
import { createHmac } from 'node:crypto'

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

  assert.ok(url, 'expected a url when the secret is configured')
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

// ---------------------------------------------------------------------------
// SECURITY: missing UNSUBSCRIBE_TOKEN_SECRET must fail CLOSED for
// verification and fail OPEN (safe no-op) for link/header generation.
//
// The bug this guards against: getSecret() used to return '' when the env
// var was unset, and createHmac('sha256', '') is a real, reusable HMAC key,
// not a no-op. That meant anyone who knew the scheme could forge a token
// with an empty-string key and have it accepted the moment the env var went
// missing or was misspelled in Vercel: a silent, unlogged auth bypass that
// could unsubscribe any address on the list.
// ---------------------------------------------------------------------------

test('SECURITY: with no secret configured, a token forged with an empty-string HMAC key is rejected', () => {
  process.env.UNSUBSCRIBE_TOKEN_SECRET = ''

  // Reproduce the exact forgery: sign with the empty key the old bug used.
  const payload = Buffer.from('victim@example.com', 'utf8').toString('base64url')
  const forgedSignature = createHmac('sha256', '').update(payload).digest('base64url')
  const forgedToken = `${payload}.${forgedSignature}`

  const result = verifyUnsubscribeToken(forgedToken)
  assert.equal(result.valid, false, 'a token forged against an empty-string key must never verify')
  assert.equal(result.email, null)
})

test('SECURITY: with no secret configured, even a token minted by buildUnsubscribeToken itself is rejected', () => {
  process.env.UNSUBSCRIBE_TOKEN_SECRET = ''
  // buildUnsubscribeToken still runs (it is not the security boundary), but
  // whatever it produces under an empty key must not be accepted back.
  const token = buildUnsubscribeToken('victim@example.com')

  const result = verifyUnsubscribeToken(token)
  assert.equal(result.valid, false)
})

test('with no secret configured, buildUnsubscribeUrl returns null instead of a dead/unverifiable link', () => {
  process.env.UNSUBSCRIBE_TOKEN_SECRET = ''
  assert.equal(buildUnsubscribeUrl('someone@example.com'), null)
})

test('with no secret configured, buildUnsubscribeHeaders fails open and returns {} (safe to spread)', () => {
  process.env.UNSUBSCRIBE_TOKEN_SECRET = ''
  const headers = buildUnsubscribeHeaders('someone@example.com')

  assert.deepEqual(headers, {})
  // Must be safe to spread into a send payload without a special case.
  const body = { from: 'a', to: 'b', ...headers }
  assert.deepEqual(body, { from: 'a', to: 'b' })
})

test('undefined secret (env var never set) is treated the same as an empty string', () => {
  delete process.env.UNSUBSCRIBE_TOKEN_SECRET
  assert.equal(buildUnsubscribeUrl('someone@example.com'), null)
  assert.deepEqual(buildUnsubscribeHeaders('someone@example.com'), {})
  assert.equal(verifyUnsubscribeToken('anything.anything').valid, false)
})

// ---------------------------------------------------------------------------
// Cross-repo compatibility: mhq-homepage mints tokens against the same
// scheme and must match ours byte-for-byte. It previously signed with
// .digest('hex') while this file verified .digest('base64url'), so every
// homepage-minted link was silently rejected. Pinning the exact signature
// shape here is what stops that drift from recurring undetected.
// ---------------------------------------------------------------------------

test('CROSS-REPO COMPAT: the signature segment is base64url, 43 chars, no "=" padding, no hex', () => {
  const token = buildUnsubscribeToken('compat@example.com')
  const [, signature] = token.split('.')

  assert.equal(signature.length, 43, 'a base64url-encoded SHA-256 digest (32 bytes) is 43 chars unpadded')
  assert.ok(!signature.includes('='), 'base64url must not carry "=" padding')
  assert.match(signature, /^[A-Za-z0-9_-]+$/, 'must use the base64url alphabet (+/ replaced with -_), not hex')
  assert.ok(!/^[0-9a-f]{64}$/.test(signature), 'must not be a 64-char lowercase hex digest (the old homepage bug)')
})
