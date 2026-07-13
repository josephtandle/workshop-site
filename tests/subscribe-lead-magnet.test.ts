import assert from 'node:assert/strict'
import test from 'node:test'

import {
  handleSubscribe,
  SubscribeError,
  FROM_ADDRESS,
  type SentEmail,
  type SubscribeDeps,
} from '../src/lib/subscribe'
import { sendViaResend, isTestRun } from '../src/lib/resend-sender'
import { downloadUrlFor, getLeadMagnet } from '../src/lib/lead-magnets'

// ---------------------------------------------------------------------------
// /api/subscribe — capture the lead, send the right email, never twice for the
// same magnet, and NEVER touch the live Resend API from a test.
// ---------------------------------------------------------------------------

const MAGNET = 'client-launch-checklist'

/** A fake Supabase + Resend. Nothing here reaches the network. */
function makeDeps() {
  const saved: unknown[] = []
  const sent: SentEmail[] = []
  const claimed = new Set<string>()

  const deps: SubscribeDeps = {
    async saveLead(lead) {
      saved.push(lead)
    },
    async claimSignup(email, leadMagnet) {
      const key = `${email}::${leadMagnet}`
      if (claimed.has(key)) return false // mirrors UNIQUE(email, lead_magnet)
      claimed.add(key)
      return true
    },
    async sendEmail(email) {
      sent.push(email)
    },
  }

  return { deps, saved, sent }
}

test('sends the right recipient, subject and download link', async () => {
  const { deps, saved, sent } = makeDeps()

  const result = await handleSubscribe(
    { firstName: 'Joe', lastName: 'Che', email: 'Joe@Example.com', leadMagnet: MAGNET },
    deps,
  )

  assert.deepEqual(result, { ok: true, emailed: true })

  // Saved, with the name split out and the magnet recorded.
  assert.equal(saved.length, 1)
  assert.deepEqual(saved[0], {
    firstName: 'Joe',
    lastName: 'Che',
    email: 'joe@example.com', // normalised
    leadMagnet: MAGNET,
  })

  // Exactly one email, to the right person.
  assert.equal(sent.length, 1)
  const email = sent[0]
  assert.equal(email.to, 'joe@example.com')
  assert.equal(email.from, FROM_ADDRESS)

  // Right subject for this magnet.
  const magnet = getLeadMagnet(MAGNET)!
  assert.equal(email.subject, magnet.subject)
  assert.equal(email.subject, 'Your Client Launch Checklist')

  // Greets by first name.
  assert.match(email.html, /Hi Joe,/)

  // Carries the real download link.
  const url = downloadUrlFor(magnet)
  assert.match(url, /\/client-launch-checklist\.pdf$/)
  assert.ok(email.html.includes(url), 'email must contain the download URL')
  assert.match(email.html, /<a[^>]+href="[^"]*client-launch-checklist\.pdf"/)
})

test('same lead magnet twice: succeeds, but does not email again', async () => {
  const { deps, sent } = makeDeps()
  const person = { firstName: 'Joe', email: 'joe@example.com', leadMagnet: MAGNET }

  const first = await handleSubscribe(person, deps)
  const second = await handleSubscribe(person, deps)

  assert.deepEqual(first, { ok: true, emailed: true })
  assert.deepEqual(second, { ok: true, emailed: false }, 'second signup must not email')
  assert.equal(sent.length, 1, 'only one email may ever be sent for the same magnet')
})

test('a different lead magnet later does get its own email', async () => {
  const { deps, sent } = makeDeps()

  // Register a second magnet at runtime so the test does not depend on the
  // table growing later.
  const { LEAD_MAGNETS } = await import('../src/lib/lead-magnets')
  LEAD_MAGNETS['second-magnet'] = {
    slug: 'second-magnet',
    name: 'Second Magnet',
    subject: 'Your Second Magnet',
    downloadPath: '/second-magnet.pdf',
  }

  await handleSubscribe({ firstName: 'Joe', email: 'joe@example.com', leadMagnet: MAGNET }, deps)
  await handleSubscribe(
    { firstName: 'Joe', email: 'joe@example.com', leadMagnet: 'second-magnet' },
    deps,
  )

  assert.equal(sent.length, 2, 'a different magnet must send its own email')
  assert.equal(sent[0].subject, 'Your Client Launch Checklist')
  assert.equal(sent[1].subject, 'Your Second Magnet')

  delete LEAD_MAGNETS['second-magnet']
})

test('an unknown lead magnet is rejected, not silently sent the wrong file', async () => {
  const { deps, sent } = makeDeps()

  await assert.rejects(
    () => handleSubscribe({ firstName: 'Joe', email: 'joe@example.com', leadMagnet: 'nope' }, deps),
    (err: unknown) => err instanceof SubscribeError && err.status === 400,
  )
  assert.equal(sent.length, 0, 'must not email anything for an unknown magnet')
})

test('a bad email is rejected before anything is saved or sent', async () => {
  const { deps, saved, sent } = makeDeps()

  await assert.rejects(
    () => handleSubscribe({ firstName: 'Joe', email: 'not-an-email', leadMagnet: MAGNET }, deps),
    (err: unknown) => err instanceof SubscribeError && err.status === 400,
  )
  assert.equal(saved.length, 0)
  assert.equal(sent.length, 0)
})

test('THE GUARD: a test run cannot call the live Resend API', async () => {
  assert.ok(isTestRun(), 'the test runner must be detected as a test run')

  // Even with a real-looking key present, the live sender refuses to fire.
  const previous = process.env.RESEND_API_KEY
  process.env.RESEND_API_KEY = 're_ThisMustNeverBeUsed'

  await assert.rejects(
    () =>
      sendViaResend({
        from: FROM_ADDRESS,
        to: 'nobody@example.com',
        subject: 'should never send',
        html: '<p>should never send</p>',
      }),
    /Refusing to call the live Resend API during a test run/,
  )

  if (previous === undefined) delete process.env.RESEND_API_KEY
  else process.env.RESEND_API_KEY = previous
})
