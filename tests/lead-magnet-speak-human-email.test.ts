import assert from 'node:assert/strict'
import test from 'node:test'
import { buildSpeakHumanEmail } from '../src/lib/speak-human-email'

test('Speak Human email provides chat setup and browser instructions', () => {
  const speakHumanPageUrl = 'https://example.com/giveaways/speak-human?utm_source=email'
  const unsubscribeFooter = '<p>Unsubscribe footer</p>'
  const { subject, html } = buildSpeakHumanEmail({ speakHumanPageUrl, unsubscribeFooter })

  assert.equal(subject, 'Your Speak Human setup (no Terminal needed)')
  for (const text of ['github.com/josephtandle/speak-human', 'INSTALL.md', 'releases/latest']) {
    assert.ok(html.includes(text), `Missing ${text}`)
  }
  for (const text of ['git clone', '--mode', '--file', 'cp -r', '\u2014', '\u2013', 'ManyChat giveaway keyword']) {
    assert.ok(!html.includes(text), `Unexpected ${text}`)
  }
  assert.ok(html.includes(`href="${speakHumanPageUrl}"`))
  assert.ok(html.includes(unsubscribeFooter))
})
