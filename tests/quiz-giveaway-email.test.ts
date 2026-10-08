import assert from 'node:assert/strict'
import test from 'node:test'
import {
  QUIZ_GIVEAWAY_SLUGS,
  buildQuizGiveawayEmail,
  isQuizGiveawaySource,
  LEVELS_QUIZ_URL,
  BEHAVIOR_QUIZ_URL,
} from '../src/lib/quiz-giveaway-email'
import { isDeliverableLeadMagnetSource } from '../src/lib/lead-magnets'
import { giveaways } from '../src/lib/giveaways'

// IG keyword -> /api/lead-magnet source. LEVEL and BEHAVIOR had no delivery
// email before 2026-10-08 (fail-closed 422, nothing sent).
const EXPECTED: Record<string, { quizUrl: string; subject: string }> = {
  'ai-levels-quiz': { quizUrl: LEVELS_QUIZ_URL, subject: 'Your AI Capability Levels quiz' },
  'ai-behavior-quiz': { quizUrl: BEHAVIOR_QUIZ_URL, subject: 'Your AI Behavioral Use quiz' },
}

test('both quiz slugs are deliverable and registered giveaways', () => {
  assert.deepEqual([...QUIZ_GIVEAWAY_SLUGS].sort(), Object.keys(EXPECTED).sort())
  for (const slug of QUIZ_GIVEAWAY_SLUGS) {
    assert.ok(isQuizGiveawaySource(slug))
    assert.ok(isDeliverableLeadMagnetSource(slug), `${slug} would fail closed in /api/lead-magnet`)
    assert.ok(giveaways.some((g) => g.slug === slug), `${slug} not in the giveaways registry`)
  }
  assert.ok(!isQuizGiveawaySource('tokens'))
})

test('each quiz email carries its quiz link in html and text, pretty-light, no em dashes', () => {
  for (const slug of QUIZ_GIVEAWAY_SLUGS) {
    const e = buildQuizGiveawayEmail({ source: slug, unsubscribeFooter: '<p>footer</p>', unsubscribeUrl: 'https://x.test/u' })
    const { quizUrl, subject } = EXPECTED[slug]
    assert.equal(e.subject, subject)
    assert.ok(e.html.includes(quizUrl) && e.text.includes(quizUrl), `${slug} email missing quiz link`)
    assert.ok(e.text.includes('https://x.test/u'), `${slug} text part missing unsubscribe`)
    assert.ok(e.html.includes('<p>footer</p>'), `${slug} html missing footer`)
    assert.ok(!/background(-color)?:|<table|<button|display:inline-block/i.test(e.html), `${slug} has a button or shaded box`)
    for (const body of [e.subject, e.html, e.text]) {
      assert.ok(!body.includes('—'), `${slug} email contains an em dash`)
      assert.ok(!/\{\{|\[LINK\]|undefined/.test(body), `${slug} email has a placeholder`)
    }
  }
})
