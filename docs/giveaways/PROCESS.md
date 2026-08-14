# Giveaway Launch Protocol

**Purpose:** Every time a new lead magnet, skill, PDF, or resource is ready to give away, this is the end-to-end process from setup to posted reel.

**Name:** The End-to-End Giveaway Process (also: the Giveaway Pipeline).

**Repo:** `~/.myos/workspace/projects/mastermind/workshop-site/`

---

## Pre-flight Checklist (run before starting)

- [ ] You have the giveaway slug (one lowercase-hyphenated word, e.g. `guardog`)
- [ ] You have the giveaway title (display name as it will appear on the page)
- [ ] You have the resource ready to link (PDF, install command, download URL)
- [ ] You have the keyword (ONE WORD, ALL CAPS — directly tied to the content, easy to hear and type)
- [ ] Mission Control is running at localhost:3000
- [ ] Vercel CLI is authenticated (`vercel whoami`)

**Run all four uniqueness checks before touching any files:**

```bash
# 1. Slug must not already exist as a directory
ls ~/.myos/workspace/projects/mastermind/workshop-site/src/app/giveaways/<slug>/ 2>/dev/null \
  && echo "STOP: slug directory already exists" || echo "slug OK"

# 2. Slug must not already be in the registry
grep '"<slug>"' ~/.myos/workspace/projects/mastermind/workshop-site/src/lib/giveaways.ts \
  && echo "STOP: slug already registered" || echo "registry OK"

# 3. Keyword must not already be in ManyChat
curl -s http://localhost:3000/api/manychat-giveaways | \
  node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); \
  const hit=d.data?.find(x=>x.comment_keyword==='<KEYWORD>'); \
  console.log(hit ? 'STOP: keyword already in use — ' + hit.giveaway_name : 'keyword OK')"

# 4. Repo must be clean and on main
git -C ~/.myos/workspace/projects/mastermind/workshop-site/ status --short && \
  git -C ~/.myos/workspace/projects/mastermind/workshop-site/ branch --show-current
```

All four must be clear before continuing. If any fail, resolve before proceeding.

---

## Phase 1: Technical Setup

### 1. Create the Giveaway Page

```bash
cd ~/.myos/workspace/projects/mastermind/workshop-site
```

Create two files:
- `src/app/giveaways/<slug>/page.tsx`
- `src/app/giveaways/<slug>/layout.tsx`

**Template rule: clone `guardog`. Nothing else. Ever.**

The canonical reference implementation is `src/app/giveaways/guardog/page.tsx`. Clone that file as your starting point regardless of whether the new giveaway is a copy-prompt, a guide, a comparison, a checklist, or a reference page. Content type does not determine the template — `guardog` is the structural baseline for every modern giveaway.

**Do not clone these pages — they pre-date the hardened template:**
- `src/app/giveaways/benchmark/page.tsx` — minimal comparison page, missing all required elements below
- `src/app/giveaways/compare/page.tsx` — was initially cloned from benchmark, kept as canonical only after the 2026-06-08 rebuild
- Any page that does not import `MastermindReactionsSection` — by definition non-conforming

If you are about to clone something other than `guardog`, stop. There is no exception.

**Required elements — every giveaway page, regardless of content type:**

| # | Element | Where it lives |
|---|---------|----------------|
| 1 | `'use client'` directive at top of file | line 1 |
| 2 | `framer-motion` for hero + section reveals | `import { motion } from 'framer-motion'` |
| 3 | Full-page canvas particles (fixed, z-0) | `useEffect` block in guardog |
| 4 | Two aurora glow blobs with `filter: blur(80–90px)` | inside hero `<section>` |
| 5 | Cormorant Garamond loaded via `useEffect` (deduped by `data-font="cormorant"`) | top of component |
| 6 | Hero `<h1>` in italic gradient Cormorant Garamond | clamp font-size, gradient text |
| 7 | Hero badge in mobile-aware position (`relative z-10 mb-6 ... sm:absolute sm:top-10`) | inside hero |
| 8 | Magnetic button hook (`useMagnet`) applied to all CTA buttons | top of file |
| 9 | At least one quote / testimonial blockquote inside the body content (named, with session number) | body section |
| 10 | `<MastermindCTA />` soft-sell block — purple-pink gradient, "Want to learn how to do this?" headline, magnetic pink button | inline function, before reactions |
| 11 | `<MastermindReactionsSection />` — testimonial carousel | imported from `@/components/sections/MastermindReactionsSection` |
| 12 | "Created by Joe Che" attribution in the footer | small muted text near MASTERMIND_URL link |
| 13 | Dark theme wrapper: `min-h-screen bg-[#151515] text-[#FCF4EB] overflow-x-hidden` | wraps the page |
| 14 | Lenis smooth scroll (optional but standard) | `useEffect` import |

**Email modal is required on every giveaway page. The trigger depends on whether the page has a copy-prompt:**

| Page type | Trigger | Required props |
|-----------|---------|---------------|
| Copy-prompt (`guardog`, `claude-md`, `speak-human`, etc.) | Every Copy button calls `onAfterCopy={() => setEmailModalOpen(true)}` | `slug`, `isOpen`, `onClose` |
| Non-copy-prompt (guide / comparison / reference) | Auto-open on a `setTimeout`, suppressed by `sessionStorage` so it fires once per session | `slug`, `isOpen`, `onClose`, `showCopiedBadge={false}`, `headingOverride="<custom heading>"` |

If the giveaway has no copy-prompt, the page MUST still wire `GiveawayEmailModal` and open it automatically. Otherwise the visitor has no path onto the mailing list. The canonical auto-open block:

```tsx
const [emailModalOpen, setEmailModalOpen] = useState(false)
const AUTO_POPUP_DELAY_MS = 20000
const AUTO_POPUP_SESSION_KEY = `giveaway-auto-modal-shown-<slug>`

useEffect(() => {
  if (typeof window === 'undefined') return
  if (window.sessionStorage.getItem(AUTO_POPUP_SESSION_KEY)) return
  const t = window.setTimeout(() => {
    setEmailModalOpen(true)
    try { window.sessionStorage.setItem(AUTO_POPUP_SESSION_KEY, '1') } catch { /* noop */ }
  }, AUTO_POPUP_DELAY_MS)
  return () => window.clearTimeout(t)
}, [])

// then in JSX, after the main content:
<GiveawayEmailModal
  slug="<slug>"
  isOpen={emailModalOpen}
  onClose={() => setEmailModalOpen(false)}
  showCopiedBadge={false}
  headingOverride="<custom one-line heading for this giveaway>"
/>
```

The modal submission is shared — `/api/lead-magnet` with `{ email, source: slug, journeyId }`. Do not bypass it. Do not customize the modal's body copy. `headingOverride` is the only per-giveaway adjustment. Modal component: `src/components/giveaways/GiveawayEmailModal.tsx`. Reference implementation for copy-prompt: `src/app/giveaways/guardog/page.tsx`. Reference implementation for auto-popup: `src/app/giveaways/compare/page.tsx`.

**Preferred component for auto-popup pages:** use `<GiveawayAutoModal slug="<slug>" headingOverride="..." />`. It encapsulates the state, timer, sessionStorage, and `showCopiedBadge={false}` so the page only adds two lines: an import and a single JSX tag. Source: `src/components/giveaways/GiveawayAutoModal.tsx`. The legacy inline pattern (useState + useEffect + setTimeout + sessionStorage + GiveawayEmailModal) is still accepted by the test but should not be used in new pages.

**Email collection rule (every page):**

The modal must actually capture the email, not just render. Concretely:

1. The modal submits to `POST /api/lead-magnet` with `{ email, source, journeyId }` — never bypass this route, never invent a different shape.
2. The client and server email regex must be identical (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`). A divergence means the client accepts inputs the server rejects, and the visitor sees an unexplained 400.
3. The `slug` prop passed to `GiveawayEmailModal` or `GiveawayAutoModal` MUST match the directory name. `slug="compare"` on a page at `src/app/giveaways/compare/page.tsx`. Mismatched slugs mean captured emails are tagged with the wrong `source` in Supabase, the CRM, and the Resend delivery template — they go out with the wrong giveaway content attached.
4. The API route must validate, rate-limit (10 req/60s per IP), persist to Supabase `leads`, and send the per-source delivery email via Resend.
5. On submission failure, the modal must surface a human-readable error message. Silent failure is a bug — the visitor leaves thinking they signed up.

**Verification (gates before deploy — both must pass):**

```bash
cd ~/.myos/workspace/projects/mastermind/workshop-site
npm test -- tests/giveaway-template-structure.test.ts
npm test -- tests/giveaway-email-collection.test.ts
```

`giveaway-template-structure.test.ts` asserts every page wires one of the two triggers and imports the modal (or wrapper).

`giveaway-email-collection.test.ts` asserts the wire-up actually collects: the modal POSTs to `/api/lead-magnet`, the client/server regex match, every `slug` prop matches its directory name, and the API validates + rate-limits + persists + delivers.

Running `npm test` runs the whole suite; both files are picked up automatically.

**Layout rule — when to use multi-column grids:** Use single-column flow for body copy, notes, and explanatory sections. Multi-column is reserved for: (a) the actual comparison/data table, (b) stat cards (3 across), (c) "Works in" badge strips. Do not use 2-column card grids for note bodies, masterminds CTA copy, or hero subheadlines. The page should read top-to-bottom on mobile without surprises.

**Icon rule (from `agents/web-designer/CONTEXT.md`):** Never use emoji as icons. Use the portal glyph system — `◆` `✦` `◇` `◈` as text characters, or inline SVG for functional icons. Emoji in headings or as column markers is a violation.

**Mobile design rules (must verify on a 360px viewport before shipping):**
- Hero badge must be `relative z-10 mb-6 flex justify-center sm:absolute sm:top-10 sm:left-0 sm:right-0 sm:mb-0`. Absolute-only positioning collides with the headline in Instagram's in-app browser where the viewport is short.
- Aurora blobs use `w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px]` (and matching `w-[280px]` / `sm:w-[420px]` for the second blob). The 600/500px versions overflow at 360px.
- Prompt code `<pre>` blocks use `wordBreak: 'normal', overflowWrap: 'anywhere'`. Never `break-all` — it shatters URLs mid-character.
- Section padding inside large cards uses `px-5 py-8 sm:px-8 sm:py-10`, not bare `px-8 py-10`.
- The page must look correct at 360px-wide viewport, not just 384px.

**Required globals (already in `src/app/globals.css` — do not remove):** CSS rules that hide LastPass / 1Password / Dashlane / Bitwarden / Samsung Pass injected icons on form inputs, plus webkit autofill button suppression. Without these, the modal email input shows a red icon overlay on mobile.

**Verify files exist:**
```bash
ls src/app/giveaways/<slug>/page.tsx src/app/giveaways/<slug>/layout.tsx
```

**Verify TypeScript compiles:**
```bash
npx tsc --noEmit 2>&1
```

Output must say `TypeScript: No errors found`. Fix any errors before continuing — do not deploy broken code.

---

### 2. Register in the Giveaway Registry

Add an entry to `src/lib/giveaways.ts`:

```ts
{
  slug: '<slug>',
  title: '<title>',
  description: '<one-liner>',
  icon: '✦',
  badge: 'Skill' | 'Guide' | 'Template' | 'Checklist' | 'Resource',
  badgeVariant: 'purple' | 'pink',
}
```

**Rule:** Never add a page without registering. Never register a slug without a matching page.

**Verify entry and re-run TypeScript check:**
```bash
grep -n '"<slug>"' src/lib/giveaways.ts
npx tsc --noEmit 2>&1
```

Both must pass before continuing.

---

### 3. Commit, Push, and Deploy

```bash
git add src/app/giveaways/<slug>/ src/lib/giveaways.ts
git commit -m "feat(giveaways): add <slug>"
git push
npx vercel --prod
```

**`git push` is mandatory.** Never leave commits local.

**Wait for the `Aliased:` line before proceeding.** A preview URL is not deployment:
```
Aliased: workshop-site-sigma.vercel.app -> <deploy-id>.vercel.app
```

---

### 4. Notify — Verify, Telegram, Email, Hard Refresh

Run the notification script immediately after the `Aliased:` line:

```bash
node ~/.myos/workspace/ops/notify-giveaway-launch.js \
  --slug <slug> \
  --title "<Giveaway Title>"
```

This script in order:
1. Verifies the live URL returns 200 — **exits non-zero if not live, stop here**
2. Sends Telegram to Joe's personal chat with a tap-to-open link
3. Sends email to joe@mastermindshq.business with a click-to-open button
4. Hard-refreshes the open workshop-site tab via CDP `Page.reload` with `ignoreCache: true`

No manual refresh needed. If the script exits with a non-zero code, the page is not live — do not proceed to ManyChat.

---

### 5. Set Up ManyChat Automation

**Pre-check: confirm agent Chrome is reachable before attempting automation.**
```bash
curl -s http://localhost:9223/json/version | node -e \
  "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); \
  console.log(d.Browser ? 'Chrome OK: ' + d.Browser : 'STOP: agent Chrome not reachable on port 9223')"
```

If Chrome is not reachable, the Playwright automation will fail silently. Start the agent Chrome profile before continuing, or go straight to the manual fallback.

**The ManyChat API cannot create or modify flows. This is not a bug in our code, it is
the shape of their public API.** Probed 2026-08-12 with a valid key:

| Endpoint | Result |
|---|---|
| `/fb/page/cloneFlow` | 404 (HTML) |
| `/fb/page/setFlowKeyword` | 404 |
| `/fb/page/setFlowCustomFields` | 404 |
| `/fb/page/activateFlow` | 404 |
| `/fb/page/deactivateFlow` | 404 |
| `/fb/page/getFlow` | 404 |
| `/fb/page/getInfo` (control) | **200** |
| `/fb/page/getFlows` (control) | **200** |

Reads work. Every write is fictional. The old instruction here claimed "Click Create,
Playwright auto-creates the flow within 90 seconds". That never worked, and it failed with
an opaque `SyntaxError: Unexpected token '<'` because the client parsed a 404 HTML page as
JSON. `app/api/manychat-giveaways/_manychat.ts` now fails fast with an actionable message
instead, and exports `preflight()` so a broken key can be told apart from a dead endpoint.

**Step 1: create the giveaway row** (this part does work):

```bash
curl -s -X POST http://localhost:3000/api/manychat-giveaways \
  -H "Content-Type: application/json" \
  -d '{"comment_keyword":"<KEYWORD>","giveaway_name":"<title>","giveaway_description":"<one line>","giveaway_link":"<url>","dynamic_tag":"Career_Funnel","draft":true}'
```

Returns the new row id. Keep it for step 3.

**Step 2: build the flow by hand in the ManyChat UI.** There is no automated path.

**The manual build (this is the only path):**
1. Open ManyChat → Automation → Flows
2. Open the MASTER flow directly: **`content20260318104931_653756`** ("MASTER- Effects all new Automations through All Sorted") at
   `https://app.manychat.com/fb1703817/cms/files/content20260318104931_653756`.
   Do not clone SpeakHuman or any other giveaway; they carry their own keyword and link.
3. Duplicate it
4. Set the comment trigger keyword to `<KEYWORD>`
5. Update the delivery link in the DM message to `https://workshop-site-sigma.vercel.app/giveaways/<slug>`
6. Activate the flow — copy the NS (e.g. `ns:12345`) from the flow URL
7. In Mission Control → Manychat Giveaways → Edit this entry → paste the NS → Save

Flow structure: comment trigger (KEYWORD) → DM ask for email → email capture → delivery message with link + follow button.

---

## Phase 2: Content

### 6. Brief HookLab

Update `~/.myos/workspace/projects/mastermind/hook-writer/personal/this-week.md` before running HookLab.

**Content section:**
- The topic/angle (the pain point the lead magnet addresses — not "here's my free thing")
- Any specific numbers, personal details, or real experiences to weave in
- The one thing you want the viewer to feel or think after watching

**Giveaway section:**
- Lead magnet name (exact name as it appears on the page)
- What it delivers (one sentence)
- Keyword: `<KEYWORD>`
- Delivery URL: `https://workshop-site-sigma.vercel.app/giveaways/<slug>`
- Why it matters (the specific pain point)

**Verify the file has real values, not blanks:**
```bash
grep -A1 "Keyword\|Delivery URL" \
  ~/.myos/workspace/projects/mastermind/hook-writer/personal/this-week.md | \
  grep -v "^--$"
```

The output must show the actual keyword and URL on the lines after each label. If they are blank or still say "TBD", fill them in before running HookLab.

---

### 7. Write the Hook — HookLab Pass 1 (CTA First)

Run in **Claude Code** (not terminal, not Codex):

```
/hooklab
```

When prompted for mode, select **2. CTA First** — this starts from the giveaway and works backwards to hooks. Do not use Standard mode for a giveaway.

HookLab generates 15 candidates across 5 psychological mechanisms, scores on 5 axes (Concreteness, Mechanism strength, Voice fidelity, Audience self-recognition, Thumb stop — 0-10 each, total 50), surfaces 5 winners.

Pick the winning hook and top 2 runners-up. Log the winner in `my-hooks-log.md` when HookLab prompts.

---

### 8. Write the Full Reel Script — HookLab Pass 2

Run in Claude Code:

```bash
cat ~/.myos/workspace/projects/mastermind/hook-writer/generate-script-giveaway.md
```

**Pass the winning hook from Pass 1 explicitly** when starting this prompt. HookLab reads giveaway details from `this-week.md` automatically.

Output:
- Full script: hook (0-3s), value body (3-25s), bridge (25-35s), CTA (35-45s)
- On-screen text callouts per section
- Delivery notes per section
- Production notes
- Complete Instagram caption

**CTA is always stated twice.** Never trim the CTA to hit a time target — trim the value body instead.

---

### 9. Print Terminal Summary with Hooks and Script

After HookLab delivers the winning hook, runners-up, and condensed script:

```bash
node ~/.myos/workspace/ops/notify-giveaway-launch.js \
  --slug <slug> \
  --title "<Giveaway Title>" \
  --hook1 "<winning hook — short form>" \
  --hook2 "<runner-up hook — short form>" \
  --hook3 "<third hook — short form>" \
  --script "<hook → value → bridge → CTA condensed to one paragraph>"
```

This also sends the hooks to Telegram and does another hard refresh. Keep the terminal window visible during recording as a reference card.

---

### 10. Joe Records the Reel

Joe films a 30-45 second talking head video.

Before filming:
- Read the delivery notes for each section
- Rehearse the bridge and CTA separately
- Pause before saying the keyword the first time
- Direct eye contact on the CTA
- First word on the first frame — no intro, no "hey everyone"

---

### 11. Hand Off to Designer

Send:
- Raw recording
- On-screen text callouts (Sections 3 and 4 of the script)
- Keyword in large text for the CTA frame
- Caption text (for visual style reference)

Deliverable: Reel with text overlays, hook frame visual, keyword callout on CTA.

---

### 12. Hand Off to Editor

Send:
- Raw recording (or designer's cut)
- Full script with delivery notes
- Production notes from the script generator

Deliverable: Final cut, 30-45 seconds, keyword unmistakable on screen.

---

## Phase 3: Publishing

### 13. Post to Instagram

Caption structure:
- **First line:** hook, word for word
- **Middle:** 3-5 short paragraphs, same voice as the script
- **Last line:** `Comment <KEYWORD> and I'll send you <lead magnet name> for free.`

No hashtags unless voice profile specifies. No em dashes. No link in caption.

---

### 14. Confirm ManyChat Is Firing

After posting, verify the automation is active:

```bash
curl -s http://localhost:3000/api/manychat-giveaways | \
  node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); \
  const g=d.data?.find(x=>x.comment_keyword==='<KEYWORD>'); \
  console.log(g?.status === 'active' && g?.manychat_flow_id \
    ? 'LIVE: ' + g.manychat_flow_id \
    : 'WARNING: ' + JSON.stringify({status: g?.status, flow: g?.manychat_flow_id}))"
```

Must show `LIVE: ns:xxxxx`. If status is not active or flow is missing, fix before leaving the post live.

---

## Quick Reference

| Step | Who | Tool | Gate |
|------|-----|------|------|
| Pre-flight checks | Uni | curl + grep + git | All 4 checks pass |
| Create page + register | Uni | workshop-site | `ls` files + `tsc --noEmit` passes |
| Commit + push + deploy | Uni | git + vercel | `Aliased:` line confirmed |
| Notify (verify + Telegram + email + hard refresh) | Uni | `notify-giveaway-launch.js` | Script exits 0 |
| ManyChat CDP pre-check | Uni | curl port 9223 | Chrome reachable |
| ManyChat setup | Uni | Mission Control / Playwright | `manychat_flow_id` present |
| Brief HookLab | Uni + Joe | `this-week.md` | Keyword + URL have real values |
| Hook generation Pass 1 | Uni | HookLab CTA First (Claude Code) | 5 scored hooks + winner logged |
| Full script Pass 2 | Uni | HookLab giveaway script (Claude Code) | Full 4-section script delivered |
| Terminal summary | Uni | `notify-giveaway-launch.js` | Summary box prints |
| Record | Joe | Camera | — |
| Visuals + on-screen text | Designer | — | — |
| Edit | Editor | — | — |
| Post | Joe | Instagram | — |
| Confirm ManyChat firing | Uni | curl MC API | Shows LIVE |

---

## Key Files

| File | Purpose |
|------|---------|
| `~/.myos/workspace/projects/mastermind/workshop-site/` | Workshop-site repo root |
| `src/lib/giveaways.ts` | Giveaway registry (single source of truth) |
| `~/.myos/workspace/ops/notify-giveaway-launch.js` | Verify + Telegram + email + hard refresh |
| `~/.myos/workspace/ops/workshop-site-hard-refresh.js` | CDP hard refresh for workshop-site tab |
| `projects/mastermind/hook-writer/generate-script-giveaway.md` | Reel script generator prompt |
| `projects/mastermind/hook-writer/personal/this-week.md` | HookLab brief (fill before each run) |
| `localhost:3000/app/manychat-giveaways` | ManyChat automation dashboard |
| `agents/manychat/src/browser.js` | Playwright automation engine (port 9223) |

---

*Last updated: 2026-05-20*
