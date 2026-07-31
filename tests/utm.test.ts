import assert from 'node:assert/strict'
import test from 'node:test'

import { withUtm } from '../src/lib/utm'

test('appends utm_source/medium/campaign to a bare owned-domain URL', () => {
  const result = withUtm('https://workshop.mastermindshq.business/events/ask-an-ai-expert', {
    campaign: 'lead-magnet-claudemd',
  })
  const url = new URL(result)
  assert.equal(url.searchParams.get('utm_source'), 'email')
  assert.equal(url.searchParams.get('utm_medium'), 'email')
  assert.equal(url.searchParams.get('utm_campaign'), 'lead-magnet-claudemd')
  assert.equal(url.searchParams.has('utm_content'), false)
})

test('adds utm_content only when provided', () => {
  const result = withUtm('https://workshop.mastermindshq.business/events/ask-an-ai-expert', {
    campaign: 'passive-income-100',
    content: 'cta-1',
  })
  const url = new URL(result)
  assert.equal(url.searchParams.get('utm_content'), 'cta-1')
})

test('preserves an existing query string (including ref=) alongside new utm params', () => {
  const result = withUtm('https://workshop.mastermindshq.business/events/ask-an-ai-expert?ref=email&foo=bar', {
    campaign: 'x',
  })
  const url = new URL(result)
  assert.equal(url.searchParams.get('ref'), 'email')
  assert.equal(url.searchParams.get('foo'), 'bar')
  assert.equal(url.searchParams.get('utm_campaign'), 'x')
})

test('preserves a URL fragment', () => {
  const result = withUtm('https://workshop.mastermindshq.business/page#section-2', { campaign: 'x' })
  assert.equal(new URL(result).hash, '#section-2')
  assert.ok(result.includes('#section-2'))
})

test('a URL with an existing token= param is returned completely unchanged (auth/unsubscribe/cancel guard)', () => {
  const original = 'https://workshop.mastermindshq.business/events/cancel?token=abc123'
  const result = withUtm(original, { campaign: 'should-not-apply' })
  assert.equal(result, original)
})

test('the mastermindshq.business root domain (cross-repo destination) is tagged', () => {
  const result = withUtm('https://mastermindshq.business/apply', { campaign: 'abandoned-checkout' })
  const url = new URL(result)
  assert.equal(url.searchParams.get('utm_campaign'), 'abandoned-checkout')
})

test('joe-che.com is tagged (second owned domain)', () => {
  const result = withUtm('https://joe-che.com/', { campaign: 'x' })
  const url = new URL(result)
  assert.equal(url.searchParams.get('utm_source'), 'email')
})

test('an external domain is returned unchanged', () => {
  const original = 'https://www.youtube.com/watch?v=abc123'
  const result = withUtm(original, { campaign: 'x' })
  assert.equal(result, original)
})

test('external domains list: github, instagram, wa.me, linkedin all pass through unchanged', () => {
  const externals = [
    'https://github.com/josephtandle/speak-human',
    'https://instagram.com/joeche',
    'https://wa.me/13233773154',
    'https://linkedin.com/in/joeche',
  ]
  for (const url of externals) {
    assert.equal(withUtm(url, { campaign: 'x' }), url)
  }
})

test('an unparseable URL is returned unchanged rather than throwing', () => {
  const original = 'not a url'
  assert.equal(withUtm(original, { campaign: 'x' }), original)
})

test('double-tagging is idempotent: applying withUtm twice does not duplicate params', () => {
  const once = withUtm('https://workshop.mastermindshq.business/events/ask-an-ai-expert', {
    campaign: 'a',
    content: 'b',
  })
  const twice = withUtm(once, { campaign: 'a', content: 'b' })
  assert.equal(once, twice)
  const url = new URL(twice)
  assert.equal(url.searchParams.getAll('utm_campaign').length, 1)
  assert.equal(url.searchParams.getAll('utm_source').length, 1)
})

test('a second withUtm call overwrites utm params rather than appending duplicates', () => {
  const first = withUtm('https://workshop.mastermindshq.business/events/ask-an-ai-expert', {
    campaign: 'first-campaign',
  })
  const second = withUtm(first, { campaign: 'second-campaign' })
  const url = new URL(second)
  assert.equal(url.searchParams.getAll('utm_campaign').length, 1)
  assert.equal(url.searchParams.get('utm_campaign'), 'second-campaign')
})

test('custom source/medium override the email defaults', () => {
  const result = withUtm('https://workshop.mastermindshq.business/events/ask-an-ai-expert', {
    campaign: 'x',
    source: 'newsletter',
    medium: 'digest',
  })
  const url = new URL(result)
  assert.equal(url.searchParams.get('utm_source'), 'newsletter')
  assert.equal(url.searchParams.get('utm_medium'), 'digest')
})
