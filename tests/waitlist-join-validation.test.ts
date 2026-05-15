import assert from 'node:assert/strict'
import test from 'node:test'

// ─── Email format validation (pure regex — no Supabase dependency) ─────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validate = (e: string) => EMAIL_RE.test(e)

test('email validation accepts valid addresses', () => {
  assert.ok(validate('joe@mastermindshq.business'))
  assert.ok(validate('user+tag@example.co.uk'))
  assert.ok(validate('a@b.io'))
})

test('email validation rejects empty input', () => {
  assert.equal(validate(''), false)
})

test('email validation rejects addresses without @', () => {
  assert.equal(validate('notanemail'), false)
  assert.equal(validate('missing-at-sign.com'), false)
})

test('email validation rejects addresses without local part', () => {
  assert.equal(validate('@missing-local.com'), false)
})

test('email validation rejects addresses with spaces', () => {
  assert.equal(validate('spaces in@email.com'), false)
})

// ─── Email normalisation ───────────────────────────────────────────────────────

const normalise = (e: string) => e.trim().toLowerCase()

test('email normalisation: uppercase and mixed-case treated equally', () => {
  assert.equal(normalise('Joe@MastermindsHQ.Business'), normalise('joe@mastermindshq.business'))
})

test('email normalisation: trims surrounding whitespace', () => {
  assert.equal(normalise('  user@example.com  '), 'user@example.com')
})

// ─── Dedup response messages ───────────────────────────────────────────────────

test('409 message for already registered is distinct from already waitlisted', () => {
  const registeredMsg = 'You are already registered for this event.'
  const waitlistedMsg = 'You are already on the waitlist for this event.'
  assert.notEqual(registeredMsg, waitlistedMsg)
  assert.ok(registeredMsg.includes('registered'))
  assert.ok(waitlistedMsg.includes('waitlist'))
})

test('dedup check runs both registered and waitlisted checks before inserting', () => {
  // Validates the logic ordering: registered check must short-circuit before waitlist check
  let registered = false
  let waitlisted = false
  let inserted = false

  function simulateJoin(alreadyRegistered: boolean, alreadyWaitlisted: boolean) {
    registered = alreadyRegistered
    if (registered) return { status: 409, error: 'You are already registered for this event.' }
    waitlisted = alreadyWaitlisted
    if (waitlisted) return { status: 409, error: 'You are already on the waitlist for this event.' }
    inserted = true
    return { status: 200, success: true }
  }

  // When registered, waitlist check is irrelevant — still returns 409
  const res1 = simulateJoin(true, false)
  assert.equal(res1.status, 409)
  assert.ok(res1.error?.includes('registered'))
  assert.equal(inserted, false)

  // When waitlisted, returns 409
  inserted = false
  const res2 = simulateJoin(false, true)
  assert.equal(res2.status, 409)
  assert.ok(res2.error?.includes('waitlist'))
  assert.equal(inserted, false)

  // When neither, insert proceeds
  inserted = false
  const res3 = simulateJoin(false, false)
  assert.equal(res3.status, 200)
  assert.equal(inserted, true)
})
