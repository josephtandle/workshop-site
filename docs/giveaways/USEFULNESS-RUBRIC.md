---
kg:
  id: workshop-site:docs-giveaways-usefulness-rubric
  type: document
  status: active
  audience: team
  relations: {}
---
# Giveaway Usefulness Rubric (LOCKED)

**Rule (Joe, 2026-10-02):** "giveaways need to pass a user usefulness test and keep looping until it's super useful to users."

**Lock:** the agent that builds or edits a giveaway may NOT edit this file. Only Joe (or a session he explicitly asks) changes the rubric. This is the Self-Fixing Loop anti-cheat lock (MYOS-DISPATCH-REFERENCE.md, "Self-Fixing Loop").

## Who the grader pretends to be

A non-technical small business owner (coach, consultant, agency owner, under 5 staff) who found this from an Instagram comment DM, on their phone, with 10 minutes. They have Claude or ChatGPT but are not a developer. They have never heard of Joe's internal tools.

## Binary checks (every one must be YES to ship)

Deterministic first (run by script/curl, no model):

- **D1 Live:** the page and every link on it return 200 (internal and external).
- **D2 Works:** every command, prompt, or install step on the page was actually run on a clean setup (or the prompt pasted into Claude) and produced the promised result. Record what was run.
- **D3 Clean copy:** zero em dashes, zero banned words from the voice profile, no internal paths, hostnames, keys, or private names.
- **D4 Latest proof:** the testimonial is one of the current featured quotes on the MHQ homepage (PROCESS.md "Testimonial quote rule").
- **D5 Email delivers:** a test signup to /api/lead-magnet with this slug returns 200 and the delivery email arrives with the right content.

Persona judgment (clean-context grader answers YES/NO with a one-line quote from the page as evidence):

- **U1 5-second promise:** from the hero alone, can the persona say in one sentence what they get and why it matters to them?
- **U2 First win under 15 minutes:** is there one clear thing they can do right now, on the page, that gives a real result in under 15 minutes?
- **U3 No missing knowledge:** can they finish every step without knowing anything the page does not tell them (every term explained in plain words or linked)?
- **U4 Copy-paste ready:** is every prompt/command complete and copyable as-is (no "fill in your X" left unexplained)?
- **U5 Every section earns its place:** would the persona miss each section if it were removed? (Any NO = cut or fix that section.)
- **U6 Proof, not hype:** is every number or claim backed by a source or Joe's own measured result, worded honestly (e.g. "worth about $5,700 at API prices", not "saved $5,700")?
- **U7 Stands alone:** is it fully useful without buying anything or joining a call?
- **U8 Clear next step:** at the end, do they know exactly what to do next (use it, and optionally the soft Mastermind CTA)?
- **U9 Would share it:** would the persona plausibly send this page to a friend in the same situation? Explain why in one line.

## Loop

1. Builder ships to a preview or prod.
2. Clean-context grader (a separate subagent that did not build it, cheapest reliable model) runs D1-D5, then U1-U9, and writes `docs/giveaways/grades/<slug>-<date>-rN.md` with YES/NO + evidence + the single most important fix per NO.
3. Builder fixes only the page/email (never this rubric or the grade file), redeploys.
4. Repeat. Hard cap: 5 rounds. If still failing at round 5, stop and report the remaining NOs to Joe with the proposed fix.
5. Ship (ManyChat activation, posting) only when every check is YES.
6. Append one line per run to `docs/giveaways/LESSONS.md`: slug, rounds needed, which checks failed first. Read LESSONS.md before building the next giveaway.
