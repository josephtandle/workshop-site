import assert from 'node:assert/strict'
import test from 'node:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

// ---------------------------------------------------------------------------
// Giveaway email collection — must actually collect, not just render.
//
// Rule (PROCESS.md): the email modal must submit to /api/lead-magnet with
// `{ email, source, journeyId }`, the validation regex must match between
// client and server, the API route must validate the email, persist the
// lead, and send a delivery email. Per-page `slug` props must match the
// directory name so captured emails are tagged at the correct source.
//
// This test does not hit the network. It reads the modal, the API route, and
// every giveaway page, and asserts the contract is wired correctly.
// ---------------------------------------------------------------------------

const ROOT = join(__dirname, '..')
const MODAL_PATH = join(ROOT, 'src', 'components', 'giveaways', 'GiveawayEmailModal.tsx')
const AUTO_MODAL_PATH = join(ROOT, 'src', 'components', 'giveaways', 'GiveawayAutoModal.tsx')
const API_PATH = join(ROOT, 'src', 'app', 'api', 'lead-magnet', 'route.ts')
const GIVEAWAYS_DIR = join(ROOT, 'src', 'app', 'giveaways')

const modalSrc = readFileSync(MODAL_PATH, 'utf8')
const autoModalSrc = readFileSync(AUTO_MODAL_PATH, 'utf8')
const apiSrc = readFileSync(API_PATH, 'utf8')

// ---------------------------------------------------------------------------
// 1. Modal -> API contract
// ---------------------------------------------------------------------------

test('GiveawayEmailModal POSTs to /api/lead-magnet', () => {
  assert.match(
    modalSrc,
    /fetch\(\s*['"]\/api\/lead-magnet['"]/,
    'GiveawayEmailModal must POST to /api/lead-magnet. The path is the contract — changing it breaks every existing giveaway.',
  )
})

test('GiveawayEmailModal submits email, source, journeyId in the request body', () => {
  // body must reference all three keys — the API destructures them.
  assert.match(modalSrc, /body:\s*JSON\.stringify\(\{[^}]*\bemail\b/, 'modal body must include `email`')
  assert.match(modalSrc, /body:\s*JSON\.stringify\(\{[^}]*\bsource\b/, 'modal body must include `source` (the giveaway slug)')
  assert.match(modalSrc, /body:\s*JSON\.stringify\(\{[^}]*\bjourneyId\b/, 'modal body must include `journeyId`')
})

test('GiveawayEmailModal uses method POST and JSON content type', () => {
  assert.match(modalSrc, /method:\s*['"]POST['"]/, 'modal fetch must use POST')
  assert.match(modalSrc, /'Content-Type':\s*['"]application\/json['"]/, 'modal fetch must set application/json')
})

test('GiveawayEmailModal surfaces submission errors back to the user', () => {
  // On a failed response, the modal must enter an error state — otherwise a
  // visitor who fat-fingers their email never finds out it failed.
  assert.match(modalSrc, /setStatus\(\s*['"]error['"]/, 'modal must set status to error on failed submission')
  assert.match(modalSrc, /setErrorMsg\(/, 'modal must surface a human-readable error message')
})

// ---------------------------------------------------------------------------
// 2. Validation regex consistency
// ---------------------------------------------------------------------------

function extractEmailRegex(src: string): RegExp {
  const m = src.match(/EMAIL_RE\s*=\s*(\/[^\/]+\/[gimuys]*)/)
  if (!m) throw new Error('could not extract EMAIL_RE from source')
  // eslint-disable-next-line no-eval
  const literal = eval(m[1]) as RegExp
  return literal
}

test('client and server use the same email validation regex', () => {
  const clientRe = extractEmailRegex(modalSrc).toString()
  const serverRe = extractEmailRegex(apiSrc).toString()
  assert.strictEqual(
    clientRe,
    serverRe,
    `client EMAIL_RE (${clientRe}) and server EMAIL_RE (${serverRe}) must match. A divergence means the client accepts emails the server rejects (or vice versa) and the user sees an unexplained 400.`,
  )
})

test('email regex accepts well-formed addresses', () => {
  const re = extractEmailRegex(apiSrc)
  for (const ok of [
    'joe@mastermindshq.business',
    'a@b.co',
    'first.last+tag@sub.example.co.uk',
  ]) {
    assert.ok(re.test(ok), `expected ${ok} to be valid`)
  }
})

test('email regex rejects malformed addresses', () => {
  const re = extractEmailRegex(apiSrc)
  for (const bad of [
    '',
    'not-an-email',
    'missing@domain',
    '@no-local.com',
    'spaces in@address.com',
    'two@@signs.com',
  ]) {
    assert.ok(!re.test(bad), `expected ${bad} to be rejected`)
  }
})

// ---------------------------------------------------------------------------
// 3. API route shape
// ---------------------------------------------------------------------------

test('lead-magnet API validates the email before doing anything else', () => {
  assert.match(apiSrc, /EMAIL_RE\.test\(/, 'API must call EMAIL_RE.test() on the inbound email')
  assert.match(
    apiSrc,
    /status:\s*400/,
    'API must return status 400 when the email is invalid (and only when invalid)',
  )
})

test('lead-magnet API rate-limits requests by client IP', () => {
  assert.match(apiSrc, /checkRateLimit\(/, 'API must rate-limit lead-magnet submissions')
  assert.match(apiSrc, /status:\s*429/, 'API must return 429 when the rate limit is hit')
})

test('lead-magnet API persists the lead and sends a delivery email', () => {
  // The contract: capture + deliver. Both must be present. If either is removed
  // the giveaway captures emails without responding to the visitor, or
  // responds without capturing — both are conversion bugs.
  assert.match(apiSrc, /supabase[\s\S]{0,300}\.from\(\s*['"]leads['"]/, 'API must persist into Supabase `leads` table')
  assert.match(apiSrc, /sendViaResend\s*\(/, 'API must send a confirmation email via Resend')
})

// ---------------------------------------------------------------------------
// 4. Per-page slug consistency
// ---------------------------------------------------------------------------

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

function extractModalSlugs(src: string): string[] {
  const slugs: string[] = []
  const patterns = [
    /<GiveawayEmailModal\b[\s\S]{0,400}?slug=["']([^"']+)["']/g,
    /<GiveawayAutoModal\b[\s\S]{0,400}?slug=["']([^"']+)["']/g,
  ]
  for (const re of patterns) {
    let m: RegExpExecArray | null
    while ((m = re.exec(src)) !== null) slugs.push(m[1])
  }
  return slugs
}

const SLUG_EXEMPT = new Set<string>([
  'human', // re-export of speak-human/page.tsx — slug intentionally differs
])

test('every modal slug matches its giveaway directory name', () => {
  const pages = listGiveawayPages()
  for (const page of pages) {
    if (SLUG_EXEMPT.has(page.slug)) continue
    const found = extractModalSlugs(page.source)
    if (found.length === 0) continue // covered by structure test
    for (const s of found) {
      assert.strictEqual(
        s,
        page.slug,
        `giveaway/${page.slug}/page.tsx passes slug="${s}" to the email modal. The slug must match the directory name so emails captured here are tagged as source="${page.slug}" in Supabase, the CRM, and the Resend delivery template — not the slug of a different giveaway.`,
      )
    }
  }
})
