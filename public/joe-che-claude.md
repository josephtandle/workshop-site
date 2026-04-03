# Joe Che's Ultimate CLAUDE.md

(This file goes in the root of your project, named exactly: CLAUDE.md)
(Claude Code reads it automatically at the start of every session.)
(Delete all parenthetical notes before you start using it — they're just for you.)

---

## What Is CLAUDE.md?

CLAUDE.md is a special file that Claude Code reads at the start of every session.
It acts like a standing brief: your rules, preferences, and context are loaded before you type a word.
Think of it as programming Claude's defaults so you never have to repeat yourself.

Place this file in your project root as `CLAUDE.md` and Claude Code will pick it up automatically.

---

## Agent Routing (Always Apply)

(This section keeps your main session context clean and saves money on API costs.
Claude Code can spin up background "agents" — separate AI workers — for heavy lifting.
Without this, Claude does everything in the main session, which bloats context and costs more.)

**Default to background agents. Main session context is precious. Protect it.**

| Type | Action |
|------|--------|
| Conversational / simple question | Answer directly in session |
| Research / "find where X is", "how does Y work" | Spawn Explore agent (background when possible) |
| Planning / architecture | Spawn Plan agent |
| Multi-step task / anything with more than 2 tool calls | Spawn general-purpose agent, foreground |

**Which model to use for agents:**
(Haiku is fast and cheap. Sonnet is the workhorse. Opus is for hard problems.)
- `haiku` — research, file reads, searching, simple transforms
- `sonnet` — coding, writing, reasoning, most tasks (the default)
- `opus` — deep architecture decisions, complex debugging, high-stakes work

🔴 If a task requires more than 2 tool calls, it belongs in an agent — not the main session.
🔴 Run independent agents in parallel (one message, multiple Agent tool calls at once).
🔴 Never search, read files, or grep in the main session when an Explore agent can do it.

```
❌ Using file search directly in main session to answer a research question
✅ Spawning an Explore agent (haiku) to search and return a clean summary

❌ Doing 5 steps in sequence in the main session to build a feature
✅ Spawning a general-purpose agent (sonnet) with the full task description

❌ Asking "should I proceed?" before every subtask
✅ Proceeding autonomously, reporting back only at decision points or blockers
```

---

## Autonomy and Style

(This controls how much Claude asks vs. just does. Adjust to your preference.)

**Proceed without asking:** file reads, edits, running commands, spawning agents, writing code.

**Always confirm before:** deleting files or branches, pushing to remote, sending external messages,
spending money via APIs, or anything that cannot be undone in 30 seconds.

**Response style:** Be terse. Lead with the answer or the action. No preamble.
No trailing summaries of what was just done. If it fits in one sentence, use one sentence.

---

## Content Rules

(Add your own house style rules here. This one is mine — keep it or remove it.)

🔴 No em dashes in any generated content. Use commas, colons, or rewrite the sentence.

---

## Iron Laws

(Non-negotiable rules. The red circle means it is required, not optional.
Replace the OpenClaw-specific ones with your own project context.)

🔴 **Read before writing.** Check your context/memory files before starting any task.
🔴 **Never report done without verifying.** Run the code, check the output. "It should work" is not done.
🔴 **Never commit .env or secrets.** Flag immediately if a secret appears in plaintext.
🔴 **If blocked after 2 attempts, stop and explain clearly.** No --no-verify or --force without permission.
🔴 **Never create files unless absolutely necessary.** Prefer editing existing files.

---

## Session Startup

(Optional but powerful. Tell Claude what to read at the start of every session.
Replace these with your own files — or create USER.md and MEMORY.md for your project.
Delete this whole section if you don't have these files yet.)

Before doing anything, read:
1. `USER.md` — who you're helping (background, goals, preferences)
2. `MEMORY.md` — long-term notes and context
3. Any active handoff or notes file

---

## Your Project

(Replace this section with a description of your project.
The more context Claude has, the less you have to explain each session.)

- **What it is:** (one sentence describing your project)
- **Stack:** (e.g. Next.js, Supabase, Tailwind)
- **Key paths:** (e.g. src/app/ for pages, src/lib/ for utilities)

---

**Created by Joe Che**
**mastermindshq.business**
**Free to use, share, and adapt.**
