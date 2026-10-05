import assert from 'node:assert/strict'
import test from 'node:test'
import { buildPackEmail, createPackToken, emailLookupPattern, packDownloadUrl, sendPackEmail, verifyPackToken } from '../src/lib/ai-agent-income-prompt-pack'

test('email lookup pattern escapes LIKE special characters', () => {
  assert.equal(emailLookupPattern('A_b%c@X.com'), 'a\\_b\\%c@x.com')
  assert.equal(emailLookupPattern('A\\b@X.com'), 'a\\\\b@x.com')
})

test('email lookup pattern lowercases and trims plain addresses', () => {
  assert.equal(emailLookupPattern('Reader@Example.COM'), 'reader@example.com')
  assert.equal(emailLookupPattern('  Reader@Example.COM  '), 'reader@example.com')
})

const now = 1_800_000_000_000
const lifetime = 30 * 24 * 60 * 60 * 1000
test.beforeEach(() => { process.env.AI_AGENT_INCOME_STRIPE_SECRET_KEY = 'test-only-prompt-pack-key' })
test.afterEach(() => { delete process.env.AI_AGENT_INCOME_STRIPE_SECRET_KEY })

test('pack token round trip', () => {
  assert.equal(verifyPackToken(createPackToken('reader@example.com', now), now), 'reader@example.com')
})

test('tampered payload and signature are rejected', () => {
  const token = createPackToken('reader@example.com', now)
  const [payload, signature] = token.split('.')
  const changedPayload = Buffer.from(JSON.stringify({ email: 'other@example.com', expires: now + lifetime })).toString('base64url')
  assert.equal(verifyPackToken(`${changedPayload}.${signature}`, now), null)
  assert.equal(verifyPackToken(`${payload}.${signature[0] === 'A' ? 'B' : 'A'}${signature.slice(1)}`, now), null)
})

test('token expires at exactly 30 days', () => {
  const token = createPackToken('reader@example.com', now)
  assert.equal(verifyPackToken(token, now + lifetime - 1), 'reader@example.com')
  assert.equal(verifyPackToken(token, now + lifetime), null)
  assert.equal(verifyPackToken(token, now + lifetime + 1), null)
})

test('different email casing and whitespace are accepted and normalized', () => {
  const token = createPackToken('  Reader@Example.COM  ', now)
  assert.equal(token, createPackToken('reader@example.com', now))
  assert.equal(verifyPackToken(token, now), 'reader@example.com')
})

test('malformed tokens are rejected', () => {
  for (const token of ['', '.', 'abc.def', 'abc.def.extra', '!.$', 'x'.repeat(2049)]) {
    assert.equal(verifyPackToken(token, now), null)
  }
})

test('missing signing configuration throws clearly for both token functions', () => {
  delete process.env.AI_AGENT_INCOME_STRIPE_SECRET_KEY
  assert.throws(() => createPackToken('reader@example.com', now), /AI_AGENT_INCOME_STRIPE_SECRET_KEY is not configured/)
  assert.throws(() => verifyPackToken('', now), /AI_AGENT_INCOME_STRIPE_SECRET_KEY is not configured/)
})

test('email includes a valid download link, exact copy, and no em dash', () => {
  const email = buildPackEmail('Reader@Example.com')
  assert.equal(email.from, 'Joe Che <joe@mastermindshq.business>')
  assert.equal(email.to, 'reader@example.com')
  assert.equal(email.subject, 'Your prompt pack for The AI Agent Income Playbook')
  const link = email.html.match(/href="([^"]+)"/)?.[1]
  assert.ok(link)
  const url = new URL(link)
  assert.equal(url.origin, 'https://passiveincome.mastermindshq.business')
  assert.equal(url.pathname, '/api/ai-agent-income/prompt-pack')
  assert.equal(verifyPackToken(url.searchParams.get('token')!), 'reader@example.com')
  assert.equal(email.text, [
    'Hi,',
    'Thanks for starting the trial. Here is your prompt pack: all 200 full build prompts from The AI Agent Income Playbook, one text file each.',
    `[Download the prompt pack](${link})`,
    'To use one: unzip the file, open index.txt to find your lane, open the starter file, copy all of it, and paste it into a fresh Claude Code session in an empty folder.',
    'The link works for 30 days. If it expires, go to passiveincome.mastermindshq.business and use "Send me my prompt pack" to get a new one.',
    'Your trial is $1 for 7 days, then $20 a month. You can cancel any time, and the prompt pack stays yours.',
    'Joe',
  ].join('\n\n'))
  assert.ok(!`${email.subject}${email.html}${email.text}`.includes('\u2014'))
  assert.equal(new URL(packDownloadUrl('reader@example.com')).pathname, url.pathname)
})

test('throwing fake sender returns sent false without throwing', async () => {
  const result = await sendPackEmail('reader@example.com', {
    sendEmail: async () => { throw new Error('fake delivery failure') },
  })
  assert.deepEqual(result, { sent: false, error: 'fake delivery failure' })
})

test('successful fake sender receives both bodies', async () => {
  let calls = 0
  assert.deepEqual(await sendPackEmail('reader@example.com', {
    sendEmail: async (email) => {
      calls += 1
      assert.ok(email.text.includes('Download the prompt pack'))
      assert.ok(email.html.includes('Download the prompt pack'))
    },
  }), { sent: true })
  assert.equal(calls, 1)
})

test('missing configuration is contained by sendPackEmail', async () => {
  delete process.env.AI_AGENT_INCOME_STRIPE_SECRET_KEY
  let called = false
  const result = await sendPackEmail('reader@example.com', { sendEmail: async () => { called = true } })
  assert.equal(result.sent, false)
  assert.match(result.error!, /AI_AGENT_INCOME_STRIPE_SECRET_KEY/)
  assert.equal(called, false)
})
