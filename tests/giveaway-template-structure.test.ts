import assert from 'node:assert/strict'
import test from 'node:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

// ---------------------------------------------------------------------------
// Giveaway page structural rules — enforced from PROCESS.md
// ~/.myos/workspace/projects/mastermind/giveaways/PROCESS.md
//
// Every giveaway page MUST wire <GiveawayEmailModal /> and trigger it via one
// of two paths:
//
//   (A) Copy-prompt giveaways: every Copy button calls
//       onAfterCopy={() => setEmailModalOpen(true)}
//
//   (B) Non-copy-prompt giveaways (guides, comparisons, references):
//       the page opens the modal on a setTimeout, suppressed by sessionStorage
//       so it fires once per session.
//
// A page that imports the modal but wires neither trigger is broken — the
// visitor never sees the modal. A page that does not import the modal at all
// is even more broken — it has no email-capture path.
//
// Legacy pages that explicitly opt out are listed in EXEMPT_SLUGS below with
// a justification, so the exemption is visible in code review.
// ---------------------------------------------------------------------------

const GIVEAWAYS_DIR = join(__dirname, '..', 'src', 'app', 'giveaways')

// Pages that pre-date the hardened template. Do not extend this list without
// also commenting why in PROCESS.md / LESSONS.md.
const EXEMPT_SLUGS = new Set<string>([
  'human', // re-export of speak-human/page.tsx (which is conforming). Single line: `export { default } from '../speak-human/page'`
])

interface Page {
  slug: string
  source: string
}

function listGiveawayPages(): Page[] {
  const entries = readdirSync(GIVEAWAYS_DIR, { withFileTypes: true })
  const pages: Page[] = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const pagePath = join(GIVEAWAYS_DIR, entry.name, 'page.tsx')
    try {
      const stat = statSync(pagePath)
      if (!stat.isFile()) continue
    } catch {
      continue
    }
    pages.push({ slug: entry.name, source: readFileSync(pagePath, 'utf8') })
  }
  return pages
}

function importsModal(src: string): boolean {
  // Either the bare email modal or the auto-modal wrapper counts as wiring the
  // capture surface. The auto-modal imports GiveawayEmailModal internally.
  return (
    /from\s+['"]@\/components\/giveaways\/GiveawayEmailModal['"]/.test(src) ||
    /from\s+['"]@\/components\/giveaways\/GiveawayAutoModal['"]/.test(src)
  )
}

function hasCopyPromptTrigger(src: string): boolean {
  return /onAfterCopy\s*=\s*\{?\s*\(\s*\)\s*=>\s*setEmailModalOpen\(true\)/.test(src)
}

function hasAutoPopupTrigger(src: string): boolean {
  // Preferred: <GiveawayAutoModal slug="..." headingOverride="..." />
  if (/<GiveawayAutoModal\b/.test(src)) return true
  // Legacy inline pattern: setTimeout + sessionStorage key + setEmailModalOpen(true).
  const hasSessionKey = /['"]giveaway-auto-modal-shown-/.test(src)
  const opensViaTimer = /setTimeout\s*\([\s\S]{0,200}?setEmailModalOpen\s*\(\s*true\s*\)/.test(src)
  return hasSessionKey && opensViaTimer
}

test('every giveaway page imports GiveawayEmailModal (or is exempt)', () => {
  const pages = listGiveawayPages()
  assert.ok(pages.length > 0, 'no giveaway pages found — check GIVEAWAYS_DIR')
  for (const page of pages) {
    if (EXEMPT_SLUGS.has(page.slug)) continue
    assert.ok(
      importsModal(page.source),
      `giveaway/${page.slug}/page.tsx does not import GiveawayEmailModal — every giveaway page must wire the email modal (see PROCESS.md). If this page is intentionally exempt, add its slug to EXEMPT_SLUGS in this test with a justification.`,
    )
  }
})

test('every giveaway page wires either the copy-prompt trigger or the auto-popup trigger', () => {
  const pages = listGiveawayPages()
  for (const page of pages) {
    if (EXEMPT_SLUGS.has(page.slug)) continue
    if (!importsModal(page.source)) continue // covered by the previous test

    const copyTrigger = hasCopyPromptTrigger(page.source)
    const autoTrigger = hasAutoPopupTrigger(page.source)

    assert.ok(
      copyTrigger || autoTrigger,
      `giveaway/${page.slug}/page.tsx imports GiveawayEmailModal but wires neither trigger.\n` +
        '  Copy-prompt: every Copy button must call onAfterCopy={() => setEmailModalOpen(true)}.\n' +
        '  Non-copy-prompt: page must open the modal on a setTimeout suppressed by sessionStorage with key `giveaway-auto-modal-shown-<slug>`.\n' +
        '  See PROCESS.md for the canonical auto-popup block.',
    )
  }
})

test('non-copy-prompt giveaways set showCopiedBadge={false} on the modal', () => {
  const pages = listGiveawayPages()
  for (const page of pages) {
    if (EXEMPT_SLUGS.has(page.slug)) continue
    if (!importsModal(page.source)) continue
    if (hasCopyPromptTrigger(page.source)) continue
    if (!hasAutoPopupTrigger(page.source)) continue

    // <GiveawayAutoModal> sets showCopiedBadge={false} internally — no inline check needed.
    if (/<GiveawayAutoModal\b/.test(page.source)) continue

    // Legacy inline auto-popup must still set the prop directly.
    assert.match(
      page.source,
      /showCopiedBadge\s*=\s*\{?\s*false\s*\}?/,
      `giveaway/${page.slug}/page.tsx uses the inline auto-popup trigger but does not pass showCopiedBadge={false} to GiveawayEmailModal. The "✓ Copied" badge is misleading when nothing was copied.`,
    )
  }
})
