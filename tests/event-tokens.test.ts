import assert from 'node:assert/strict'
import test from 'node:test'

import { generateToken, verifyToken } from '../src/lib/event-tokens'

const originalSecret = process.env.CRON_SECRET
test.beforeEach(() => { process.env.CRON_SECRET = 'test-secret-abc123' })
test.afterEach(() => { process.env.CRON_SECRET = originalSecret })

test('generateToken returns a 64-char hex string', () => {
  const token = generateToken('some-payload')
  assert.match(token, /^[0-9a-f]{64}$/)
})

test('generateToken is deterministic — same payload always produces the same token', () => {
  const a = generateToken('cancel:uuid-1234')
  const b = generateToken('cancel:uuid-1234')
  assert.equal(a, b)
})

test('generateToken produces different tokens for different payloads', () => {
  const a = generateToken('cancel:uuid-aaaa')
  const b = generateToken('cancel:uuid-bbbb')
  assert.notEqual(a, b)
})

test('verifyToken returns true when the token matches the payload', () => {
  const payload = 'cancel:some-registration-id'
  const token = generateToken(payload)
  assert.equal(verifyToken(payload, token), true)
})

test('verifyToken returns false for a wrong token', () => {
  const token = generateToken('cancel:id-abc')
  assert.equal(verifyToken('cancel:id-abc', 'deadbeef'.repeat(8)), false)
})

test('verifyToken returns false when payload is tampered', () => {
  const token = generateToken('cancel:id-real')
  assert.equal(verifyToken('cancel:id-fake', token), false)
})

test('tokens differ when CRON_SECRET changes', () => {
  process.env.CRON_SECRET = 'secret-one'
  const tokenA = generateToken('payload')

  process.env.CRON_SECRET = 'secret-two'
  const tokenB = generateToken('payload')

  assert.notEqual(tokenA, tokenB)
})

test('cancel and waitlist tokens never collide even for the same ID', () => {
  const id = 'shared-uuid-9999'
  const cancelToken = generateToken(`cancel:${id}`)
  const waitlistToken = generateToken(`waitlist:${id}`)
  assert.notEqual(cancelToken, waitlistToken)
})
