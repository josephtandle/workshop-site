import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

const RESEND_API_KEY = process.env.RESEND_API_KEY

// Embedded at build time — no filesystem dependency in serverless
const FILE_CONTENT = `# Joe Che's Ultimate CLAUDE.md

(This file goes in the root of your project, named exactly: CLAUDE.md)
(Claude Code reads it automatically at the start of every session.)
(Delete all parenthetical notes before you start using it — they're just for you.)

---

## What Is CLAUDE.md?

CLAUDE.md is a special file that Claude Code reads at the start of every session.
It acts like a standing brief: your rules, preferences, and context are loaded before you type a word.
Think of it as programming Claude's defaults so you never have to repeat yourself.

Place this file in your project root as \`CLAUDE.md\` and Claude Code will pick it up automatically.

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
- \`haiku\` — research, file reads, searching, simple transforms
- \`sonnet\` — coding, writing, reasoning, most tasks (the default)
- \`opus\` — deep architecture decisions, complex debugging, high-stakes work

🔴 If a task requires more than 2 tool calls, it belongs in an agent — not the main session.
🔴 Run independent agents in parallel (one message, multiple Agent tool calls at once).
🔴 Never search, read files, or grep in the main session when an Explore agent can do it.

\`\`\`
❌ Using file search directly in main session to answer a research question
✅ Spawning an Explore agent (haiku) to search and return a clean summary

❌ Doing 5 steps in sequence in the main session to build a feature
✅ Spawning a general-purpose agent (sonnet) with the full task description

❌ Asking "should I proceed?" before every subtask
✅ Proceeding autonomously, reporting back only at decision points or blockers
\`\`\`

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
Replace the MyOS-specific ones with your own project context.)

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
1. \`USER.md\` — who you're helping (background, goals, preferences)
2. \`MEMORY.md\` — long-term notes and context
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
**Free to use, share, and adapt.**`

async function sendViaResend(firstName: string, email: string, idempotencyKey: string) {
  const fileBase64 = Buffer.from(FILE_CONTENT).toString('base64')
  const escapedContent = FILE_CONTENT.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
      <h1 style="font-size: 24px; margin-bottom: 16px;">Hi ${firstName},</h1>
      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 16px;">
        Here is the file. I hope you enjoy it. This represents many months of learning
        that you can now add to your own records.
      </p>
      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 32px;">
        The file is attached. The full contents are also included below.
      </p>

      <div style="background: #f5f5f5; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
        <pre style="font-family: monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; margin: 0; color: #333;">${escapedContent}</pre>
      </div>

      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />

      <p style="font-size: 15px; line-height: 1.7; margin-bottom: 16px; color: #444;">
        If you want to learn more, I host Masterminds where you can learn how to create
        websites and use AI to automate your business. This is designed for service-based
        small business owners with fewer than five employees. Even after just one session,
        my participants have been able to create stunning websites, ingest years of business
        information and conversations, and organize it all so their AI gets smart.
      </p>
      <p style="font-size: 15px; margin-bottom: 8px;">
        <a href="https://mastermindshq.business" style="color: #7C69C7; font-weight: 600;">
          Learn more at mastermindshq.business
        </a>
      </p>
      <p style="font-size: 14px; color: #999; margin-top: 32px;">— Joe Che</p>
    </div>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from: 'Joe Che <joe@mastermindshq.business>',
      to: [email],
      subject: 'Your Ultimate Claude.md File',
      html,
      attachments: [
        {
          filename: 'joe-che-claude.md',
          content: fileBase64,
        },
      ],
    }),
  })

  if (!res.ok) throw new Error(`Resend error: ${res.status}`)
  return res.json()
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const { ok: rateLimitOk } = await checkRateLimit(`claudemd:${getClientIp(request)}`, 10, 60)
    if (!rateLimitOk) {
      return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
    }

    const { firstName, email } = await request.json()

    if (
      !firstName || typeof firstName !== 'string' || firstName.trim().length === 0 || firstName.length > 256 ||
      !email || typeof email !== 'string' || email.length > 256 || !EMAIL_RE.test(email.trim())
    ) {
      return NextResponse.json({ error: 'firstName and valid email are required' }, { status: 400 })
    }

    // Save to Supabase leads table
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!
      )
      await supabase
        .from('leads')
        .upsert({ first_name: firstName, email, lead_source: 'Claude.md' }, { onConflict: 'email' })
    } catch (dbErr) {
      console.error('Supabase error (non-blocking):', dbErr)
    }

    // Ingest into Mission Control CRM (non-blocking)
    const crmBase = process.env.MISSION_CONTROL_URL ?? 'http://localhost:3000'
    fetch(`${crmBase}/api/crm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'ingest',
        first_name: firstName,
        email,
        source: 'giveaway-claude-md',
        primary_project: 'mastermind',
        campaign: 'claude-md',
      }),
    }).catch((err) => console.error('CRM ingest error (non-blocking):', err))

    // Send via Resend
    const idempotencyKey = `lead-magnet/claude-md/${email.trim().toLowerCase()}`
    await sendViaResend(firstName, email, idempotencyKey)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('claudemd lead magnet error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
