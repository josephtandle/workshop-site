import assert from 'node:assert/strict'
import test from 'node:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { FREE_AI_TOOLS } from '../src/lib/free-ai-tools'
import { buildFreeAiToolEmail } from '../src/lib/free-ai-tool-email'
import { isDeliverableLeadMagnetSource } from '../src/lib/lead-magnets'
import { giveaways } from '../src/lib/giveaways'

const KEYWORDS = ['SKILL', 'HANDY', 'BRAIN', 'PAPER', 'CALLS', 'SHARP', 'SLOTS', 'DRAW', 'INKED', 'LOCAL']

test('all ten Free AI Tools are present, one per keyword', () => {
  assert.deepEqual(FREE_AI_TOOLS.map((t) => t.keyword), KEYWORDS)
  for (const t of FREE_AI_TOOLS) {
    assert.match(t.slug, /^free-ai-[a-z0-9-]+$/)
    assert.equal(t.steps.length, 3, `${t.slug} needs exactly 3 steps`)
    assert.ok(t.howIUse.length > 0 && t.goodToKnow && t.links.length > 0, `${t.slug} missing copy`)
    assert.match(t.toolUrl, /^https:\/\//)
  }
})

test('every Free AI Tool has a page, a layout and a registry entry', () => {
  for (const t of FREE_AI_TOOLS) {
    const dir = join(__dirname, '..', 'src', 'app', 'giveaways', t.slug)
    assert.ok(existsSync(join(dir, 'page.tsx')), `${t.slug} page.tsx missing`)
    assert.ok(existsSync(join(dir, 'layout.tsx')), `${t.slug} layout.tsx missing`)
    assert.ok(readFileSync(join(dir, 'page.tsx'), 'utf8').includes(`getFreeAiTool('${t.slug}')`), `${t.slug} page reads the wrong tool`)
    assert.ok(giveaways.some((g) => g.slug === t.slug), `${t.slug} not in the giveaways registry`)
  }
})

test('every Free AI Tool slug is deliverable and its email carries the real link', () => {
  for (const t of FREE_AI_TOOLS) {
    assert.ok(isDeliverableLeadMagnetSource(t.slug), `${t.slug} would fail closed in /api/lead-magnet`)
    const e = buildFreeAiToolEmail({ source: t.slug, unsubscribeFooter: '<p>footer</p>', unsubscribeUrl: 'https://x.test/u' })
    assert.equal(e.subject, `Your ${t.name} setup notes`)
    assert.ok(e.html.includes(t.toolUrl) && e.text.includes(t.toolUrl), `${t.slug} email missing tool link`)
    assert.ok(e.text.includes(`/giveaways/${t.slug}`), `${t.slug} email missing page link`)
    for (const body of [e.subject, e.html, e.text]) {
      assert.ok(!body.includes('—'), `${t.slug} email contains an em dash`)
      assert.ok(!/\{\{|\[LINK\]|undefined/.test(body), `${t.slug} email has a placeholder`)
    }
  }
})

test('page copy has no em dashes', () => {
  const src = readFileSync(join(__dirname, '..', 'src', 'lib', 'free-ai-tools.ts'), 'utf8')
  assert.ok(!src.includes('—'))
  const comp = readFileSync(join(__dirname, '..', 'src', 'components', 'giveaways', 'FreeAiToolPage.tsx'), 'utf8')
  assert.ok(!comp.includes('—'))
})
