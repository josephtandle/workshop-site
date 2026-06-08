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
//
// TODO 2026-06-08: 9 legacy giveaway pages (everything below `benchmark`) need
// the email modal backfilled. Each currently has no email-capture path for its
// visitors — a real conversion gap. As pages get rebuilt on the hardened
// template, remove their slugs from this list.
const EXEMPT_SLUGS = new Set<string>([
  'benchmark',               // legacy comparison page, flagged as DO NOT CLONE in the file header
  'agent-infrastructure',    // legacy: no GiveawayEmailModal import
  'all-sorted-overview',     // legacy: imports modal but wires neither trigger
  'client-launch-checklist', // legacy: no GiveawayEmailModal import
  'cult-brand-playbook',     // legacy: no GiveawayEmailModal import
  'human',                   // legacy: no GiveawayEmailModal import
  'ig-settings',             // legacy: no GiveawayEmailModal import
  'lead-magnet',             // legacy: no GiveawayEmailModal import
  'logo-maker-guide',        // legacy: no GiveawayEmailModal import
  'maccleaner',              // legacy: no GiveawayEmailModal import
  'viral-hooks',             // legacy: no GiveawayEmailModal import
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
  return /from\s+['"]@\/components\/giveaways\/GiveawayEmailModal['"]/.test(src)
}

function hasCopyPromptTrigger(src: string): boolean {
  // Either the inline onAfterCopy pattern or a copyWithConfetti caller that
  // also calls setEmailModalOpen(true).
  return /onAfterCopy\s*=\s*\{?\s*\(\s*\)\s*=>\s*setEmailModalOpen\(true\)/.test(src)
}

function hasAutoPopupTrigger(src: string): boolean {
  // The session key must appear somewhere — either at the sessionStorage call
  // site (literal string) or in a hoisted constant. Both forms are valid.
  const hasSessionKey = /['"]giveaway-auto-modal-shown-/.test(src)
  // setTimeout (window.setTimeout or bare) whose callback opens the modal.
  // The body may have other statements before/after setEmailModalOpen(true).
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

    // Auto-popup page — there was no copy, so the "✓ Copied" badge must be off.
    assert.match(
      page.source,
      /showCopiedBadge\s*=\s*\{?\s*false\s*\}?/,
      `giveaway/${page.slug}/page.tsx uses the auto-popup trigger but does not pass showCopiedBadge={false} to GiveawayEmailModal. The "✓ Copied" badge is misleading when nothing was copied.`,
    )
  }
})
