# Giveaway Build — Lessons Log

Mistakes made building giveaway pages and the rule that prevents the repeat.

---

## 2026-06-08 — Cloned `benchmark` instead of `guardog` for `/giveaways/compare`

**What happened:**
The compare giveaway is a side-by-side comparison of the four versions of Claude. Reaching for "the closest existing giveaway page", the build picked `benchmark` because the content type was a comparison guide. The result: a page missing every hardened-template element — no canvas particles, no aurora blobs, no Cormorant Garamond hero, no `MastermindCTA`, no `MastermindReactionsSection`, no "Created by Joe Che" attribution, no magnetic CTA buttons. The first build also used emoji as column markers (web-designer rule violation) and 2-column note cards (layout-rule violation). The second build fixed columns and notes but still missed the soft-sell, testimonials, and attribution.

**Root cause:**
"Closest existing giveaway page" was read as "closest by content type". The right reading is "closest by structure". Structure does not vary with content type — every giveaway page uses the same template. `benchmark` is non-conforming and pre-dates the template; cloning it propagates the gap silently because the missing elements are not surfaced by TypeScript or by deploy.

**Rule (added to PROCESS.md):**
Clone `guardog`. Nothing else. Ever. Content type does not determine the template. Pages that do not import `MastermindReactionsSection` are non-conforming by definition and must not be cloned. The list of required elements is enumerated in PROCESS.md Phase 1 Step 1 as a table — work through it row by row.

**Secondary lessons from the same session:**
1. **Emoji are not icons.** `💬 🗂 🖥 ⌨️` as column markers violated `agents/web-designer/CONTEXT.md`. Use `◆ ✦ ◇ ◈` text glyphs.
2. **2-column grids are for data, not body copy.** Notes, masterminds CTA, and hero subheads must stack. Multi-column is reserved for tables, 3-across stat cards, and "Works in" badge strips.
3. **Do not invent product names or URLs.** The product is "Claude Design", not "Claude Designer". When unsure of a name or URL, look it up. Do not guess.
4. **Treat the handoff wording as canonical.** When a handoff document specifies exact column order, exact wording, or exact link, copy it verbatim. Do not paraphrase, reorder, or rename.

---

## 2026-06-08 — Missed: non-copy-prompt giveaways still need an email path

**What happened:**
Built `/giveaways/compare` as a comparison guide with no copy-prompt. The PROCESS.md text "Required (every copy-prompt giveaway page): wire `GiveawayEmailModal` ... onAfterCopy" was read as "non-copy-prompt giveaways do not need the modal at all". That left the page with no email-capture path. Visitors who read the comparison have no way onto the mailing list.

**Root cause:**
The PROCESS.md guidance treated the email modal as a copy-prompt accessory rather than a universal requirement with two different triggers. The "if no prompt → no modal" reading is the wrong default. The right framing: **the modal is required on every page; the trigger depends on whether a copy-prompt exists.**

**Rule (added to PROCESS.md):**
Every giveaway page must wire `GiveawayEmailModal`. Trigger depends on type:
- Copy-prompt pages: every Copy button calls `onAfterCopy={() => setEmailModalOpen(true)}`
- Non-copy-prompt pages: page opens the modal on a 20-second `setTimeout`, suppressed by `sessionStorage` so it fires once per session. Set `showCopiedBadge={false}` and pass a per-page `headingOverride`.

**Test added:**
`workshop-site/tests/giveaway-template-structure.test.ts` reads every giveaway page and asserts the modal is imported and wired to one of the two triggers. Legacy pages without the modal are listed in `EXEMPT_SLUGS` with TODO markers so the gap is visible but the test does not block deploys for unrelated changes.

**Secondary finding:**
The test surfaced 10 legacy giveaway pages without the modal. Every one of them is leaking traffic. These should be backfilled on next touch of each page. Pages: `agent-infrastructure`, `all-sorted-overview`, `client-launch-checklist`, `cult-brand-playbook`, `human`, `ig-settings`, `lead-magnet`, `logo-maker-guide`, `maccleaner`, `viral-hooks`, plus the deprecated `benchmark`.

---

## 2026-06-09 — Reusable `<GiveawayAutoModal />` + email-collection contract

**What happened:**
After codifying the auto-popup rule (2026-06-08), backfilled 10 legacy giveaway pages. The inline auto-popup pattern (state + useEffect + setTimeout + sessionStorage + 6-prop modal) was repeated identically across pages. Each backfill needed 3-4 edits and risked drift. Joe also asked: "test that emails must collect properly" — the modal could be wired structurally but fail silently at the submission layer.

**What changed:**
1. Extracted the auto-popup into `src/components/giveaways/GiveawayAutoModal.tsx` — a 2-line addition per page (import + `<GiveawayAutoModal slug headingOverride />`).
2. Refactored `compare` and backfilled all 10 legacy pages on the new component.
3. Added `tests/giveaway-email-collection.test.ts` — asserts the submission contract: POSTs to `/api/lead-magnet`, body shape, client/server regex parity, slug-matches-directory, error surfacing, rate-limit + persistence + delivery on the server.
4. `EXEMPT_SLUGS` in the structural test is now down to one entry: `human` (single-line re-export of `speak-human`).

**Rule (added to PROCESS.md):**
- Auto-popup pages should use `<GiveawayAutoModal />` not the inline pattern.
- The modal `slug` prop MUST match the directory name. Mismatch sends the wrong delivery email.
- The client and server email regex MUST be identical. Drift breaks submissions silently.
- Both test files are deploy gates.

---

## 2026-08-03 — Three gaps found building `cost-stack`

**1. A new slug with no delivery template collects emails and sends nothing.**
`/api/lead-magnet` fails closed on an unrecognised source, which is correct, but it means a new giveaway page silently has no asset until you add BOTH a template branch in `src/app/api/lead-magnet/route.ts` AND the slug in `DELIVERABLE_LEAD_MAGNET_SOURCES` in `src/lib/lead-magnets.ts`. Neither test catches the omission, because the structural test only checks the modal is wired, not that the source can be delivered.

**Rule:** creating a giveaway page is three edits, not two. Page plus registry plus delivery. Also add the slug to `GIVEAWAY_SOURCE_MAP` so the CRM source reads `giveaway-<slug>` deliberately rather than by fallback.

**2. ManyChat auto-create fails with a CSRF error that is usually transient.**
The Mission Control POST returned `Automation auto-create failed: Could not capture CSRF token from ManyChat requests`, which reads like a broken login. It was not. `node ~/.myos/workspace/agents/manychat/src/browser.js list-flows` succeeded immediately after, proving the session was fine, and re-running auto-create directly worked first try.

**Rule:** before falling back to the manual ManyChat UI path in PROCESS.md step 5, check auth with `list-flows`, then retry the same call directly:
```bash
node ~/.myos/workspace/agents/manychat/src/browser.js auto-create \
  --keyword STACK --name "..." --link "https://workshop.mastermindshq.business/giveaways/<slug>" \
  --tag Career_Funnel --description "..."
```
Then PATCH the returned `flowNs` onto the Mission Control row (`PATCH /api/manychat-giveaways` with `{id, manychat_flow_id, status: "active"}`). The Mission Control route caps the browser script at 90 seconds; running it directly removes that ceiling, which is the likely cause of the flakiness in the first place.

**3. The delivery link domain in PROCESS.md is stale.**
PROCESS.md step 5 says `https://workshop-site-sigma.vercel.app/giveaways/<slug>`. The last several real entries use a branded domain, and the site declares `workshop.mastermindshq.business` as its own canonical. Use `https://workshop.mastermindshq.business/giveaways/<slug>` in ManyChat and in the HookLab brief. Note `passiveincome.mastermindshq.business` also resolves and was used for the two quiz giveaways, so the domain choice is currently inconsistent across rows and worth settling once.

---

## 2026-08-03 — Every giveaway delivery email had been failing in production

**What happened:**
Testing the new `cost-stack` capture on production returned a 500. So did `guardog`. An unregistered slug correctly returned 422, which proved the route, the rate limit, Supabase, the suppression check and the CRM ingest were all fine. The same code with the same pulled production env returned 200 locally. Vercel runtime logs were not reachable from the CLI, so a temporary CRON_SECRET-gated error echo was deployed to surface the real exception: `Resend error: 422`.

**Root cause:**
`NEXT_PUBLIC_SITE_URL` was stored in Vercel production with a **trailing newline** in the value. `getSiteUrl()` stripped trailing slashes but not whitespace, so the newline ended up inside the `List-Unsubscribe: <...>` header. A header value cannot contain CR or LF, Resend rejected the whole send with a 422, `sendViaResend` threw, and the route returned 500 for every deliverable source. It was invisible locally because dev read a clean value from `.env.local`.

**How long:** unknown. The env var is 60+ days old, so potentially every giveaway signup in that window received nothing.

**Rules:**
1. **A 500 on one giveaway is a site-wide test, not a page-specific one.** Before assuming a new page broke something, POST the same request with an old, known-good slug. Same failure means the bug is not yours.
2. **Never trust an environment value that gets interpolated into a header or URL.** `getSiteUrl()` now trims and strips CR and LF. Two OUTAGE GUARD tests in `tests/list-unsubscribe.test.ts` pin it.
3. **Check env values as bytes, not as text.** `vercel env pull <file>` then `grep NAME <file> | od -c`. A trailing newline is invisible in every normal view, including the Vercel dashboard.
4. **Verify a new giveaway by actually POSTing to `/api/lead-magnet` on production** with `newyork1@gmail.com`, before calling it done. A page that renders and a page that delivers are different claims.

---

## How to use this file

Before starting a new giveaway, read this file end to end. Each entry costs roughly one full rebuild cycle in lost time. The rule that follows the failure is the cheap version.

When a new failure happens, add an entry with: date, what happened, root cause, the rule that prevents the repeat. Link the rule into PROCESS.md so it has somewhere durable to live.
