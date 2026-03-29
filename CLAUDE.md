# Workshop Site — Building Rules

These rules apply whenever building or editing pages in this workshop site.
Follow them exactly. Do not deviate without Joe's explicit instruction.

---

## Audience

Absolute beginners. No coding experience. English-first at all times.

- Never show raw code for participants to copy and paste as-is if it requires expert knowledge to fill in correctly.
- Every technical action should be a plain-English instruction they give to Claude Code.
- Minimize manual steps. If Claude Code can do it, Claude Code should do it.
- Never use em dashes. Use "and," "then," or a period instead.

---

## Code Blocks — Editable Rule

Any `CodeBlock` that contains placeholder text the participant must fill in before copying
**must** use the `editable` prop:

```tsx
<CodeBlock editable code={`...`} />
```

Indicators that a block needs `editable={true}`:
- Contains text in `[BRACKETS]` (e.g., `[YOUR HEADLINE]`, `[YOUR RESOURCE URL]`)
- Contains placeholder values like `[YOUR NAME]`, `[PASTE KEY HERE]`
- Any field where a person-specific value must be substituted before use

The `editable` prop renders the block as a live textarea with an "Edit before copying"
badge in the header bar. This signals to participants they must customize before hitting Copy.

Blocks that do NOT need `editable`:
- Fixed terminal commands (`npm run dev`, `npx vercel --prod`)
- DNS record values (these are universal)
- Claude Code prompts with no placeholders

---

## Bonus Sections

Bonus sections must be visually distinct from the main guide — they should look like
an entirely separate, featured section, not just another step. Use the pink gradient
card treatment with a large heading (text-4xl or bigger).

---

## Links

Link to every external service mentioned. Never write a service name as plain text
if there is a URL to link to. Supabase, Vercel, Resend, Porkbun — all clickable.
Deep-link where possible (e.g., Supabase SQL Editor, Resend API Keys page).

---

## Claude Code Prompts

When writing Claude Code prompts for participants:
- Write them in plain English, not code
- Structure as clear numbered or bulleted instructions
- Include all context Claude needs (table names, field names, behavior on edge cases)
- Never require participants to understand what the prompt is doing technically

---

## Prep Pages

Use `session-3-prep.tsx` as the canonical template for all prep pages.
Interactive checkboxes, progress bar, TOC with shared state — all required.

---

*Last updated: 2026-03-27 — Joe / Uni*
