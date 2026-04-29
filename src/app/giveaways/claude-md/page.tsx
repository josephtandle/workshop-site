'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import confetti from 'canvas-confetti'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'
import { copyWithConfetti } from '@/lib/copyWithConfetti'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MASTERMIND_URL = 'https://www.mastermindshq.business'

const THE_FILE = `# Joe Che's Ultimate CLAUDE.md

(This file goes in the root of your project, named exactly: CLAUDE.md)
(Claude Code reads it automatically at the start of every session.)
(Delete all parenthetical notes before you start using it -- they're just for you.)

---

## What Is CLAUDE.md?

CLAUDE.md is a special file that Claude Code reads at the start of every session.
It acts like a standing brief: your rules, preferences, and context are loaded before you type a word.
Think of it as programming Claude's defaults so you never have to repeat yourself.

Place this file in your project root as \`CLAUDE.md\` and Claude Code will pick it up automatically.

---

## Agent Routing (Always Apply)

(This section keeps your main session context clean and saves money on API costs.
Claude Code can spin up background "agents" -- separate AI workers -- for heavy lifting.
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
- \`haiku\` -- research, file reads, searching, simple transforms
- \`sonnet\` -- coding, writing, reasoning, most tasks (the default)
- \`opus\` -- deep architecture decisions, complex debugging, high-stakes work

🔴 If a task requires more than 2 tool calls, it belongs in an agent -- not the main session.
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

(Add your own house style rules here. This one is mine -- keep it or remove it.)

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
Replace these with your own files -- or create USER.md and MEMORY.md for your project.
Delete this whole section if you don't have these files yet.)

Before doing anything, read:
1. \`USER.md\` -- who you're helping (background, goals, preferences)
2. \`MEMORY.md\` -- long-term notes and context
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

const FILE_SECTIONS = [
  {
    name: 'Agent Routing',
    count: 1,
    items: [
      { name: 'Background agent routing table', url: 'https://www.mastermindshq.business', desc: 'Routes tasks to the right agent type automatically. Keeps your main session context lean and cuts API costs.' },
      { name: 'Model selector guide (Haiku, Sonnet, Opus)', url: 'https://www.mastermindshq.business', desc: 'Tells Claude which model to use for which job. Haiku for research, Sonnet for most tasks, Opus for hard problems.' },
      { name: 'Parallel agent rule', url: 'https://www.mastermindshq.business', desc: 'Forces independent tasks to run at the same time instead of one after another. Faster and cheaper.' },
    ],
  },
  {
    name: 'Autonomy and Style',
    count: 1,
    items: [
      { name: 'Proceed-without-asking list', url: 'https://www.mastermindshq.business', desc: 'Claude reads files, edits code, and runs commands without stopping to ask. No more "Should I proceed?" interruptions.' },
      { name: 'Always-confirm list', url: 'https://www.mastermindshq.business', desc: 'Hard stops before deleting files, pushing to remote, or spending money via APIs. The guardrails that matter.' },
      { name: 'Response style rules', url: 'https://www.mastermindshq.business', desc: 'Terse, lead-with-the-answer style. No preamble, no trailing summaries. Claude gets to the point immediately.' },
    ],
  },
  {
    name: 'Content Rules',
    count: 1,
    items: [
      { name: 'House style placeholder', url: 'https://www.mastermindshq.business', desc: 'Add your own style rules here. The template ships with one example: no em dashes in any generated content.' },
    ],
  },
  {
    name: 'Iron Laws',
    count: 5,
    items: [
      { name: 'Read before writing', url: 'https://www.mastermindshq.business', desc: 'Claude checks your context and memory files before starting any task. No flying blind.' },
      { name: 'Never report done without verifying', url: 'https://www.mastermindshq.business', desc: '"It should work" is not done. Claude runs the code and checks the output before calling anything complete.' },
      { name: 'Never commit secrets', url: 'https://www.mastermindshq.business', desc: 'No .env files, no API keys in commits. Claude flags immediately if a secret appears in plaintext.' },
      { name: 'Stop and explain if blocked', url: 'https://www.mastermindshq.business', desc: 'After 2 failed attempts, Claude explains clearly instead of trying risky workarounds like --no-verify or --force.' },
      { name: 'Never create unnecessary files', url: 'https://www.mastermindshq.business', desc: 'Prefer editing existing files. No file bloat, no clutter, no ghost files appearing in your project.' },
    ],
  },
  {
    name: 'Session Startup',
    count: 1,
    items: [
      { name: 'Auto-read list (USER.md, MEMORY.md)', url: 'https://www.mastermindshq.business', desc: 'Claude reads your key context files at the start of every session. Your preferences are loaded before you say a word.' },
    ],
  },
  {
    name: 'Your Project',
    count: 1,
    items: [
      { name: 'Project description placeholder', url: 'https://www.mastermindshq.business', desc: 'Describe your project once. Claude carries that context into every session without you repeating it.' },
      { name: 'Stack and key paths', url: 'https://www.mastermindshq.business', desc: 'Tell Claude your tech stack and folder structure so it navigates your codebase correctly from session one.' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Magnetic button hook
// ---------------------------------------------------------------------------
function useMagnet(strength = 0.3) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
    el.style.transition = 'transform 0.1s ease-out'
  }, [strength])
  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0px, 0px)'
    el.style.transition = 'transform 0.4s ease-out'
  }, [])
  return { ref, onMouseMove, onMouseLeave }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ClaudeMdPage() {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(FILE_SECTIONS.map((s) => s.name)),
  )

  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const statRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null])

  const toggleSection = useCallback((name: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }, [])

  // Load fonts
  useEffect(() => {
    if (document.querySelector('link[data-font="cormorant"]')) return
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,600;1,700&display=swap'
    link.rel = 'stylesheet'
    link.setAttribute('data-font', 'cormorant')
    document.head.appendChild(link)
  }, [])


  // Lenis smooth scroll
  useEffect(() => {
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null
    let rafId = 0
    ;(async () => {
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({ duration: 1.1 }) as unknown as {
        raf: (t: number) => void
        destroy: () => void
      }
      const raf = (time: number) => {
        lenis!.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    })()
    return () => {
      if (lenis) lenis.destroy()
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Canvas falling particles — full page fixed overlay
  useEffect(() => {
    const canvas = particleCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    type Particle = { x: number; y: number; r: number; dx: number; dy: number; alpha: number; color: string }
    const colors = ['#8B79D4', '#F5C3C6', '#9D8FE0', '#BDB3E8', '#FCF4EB']
    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: Math.random() * 0.7 + 0.3,
      alpha: Math.random() * 0.55 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    let animId = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.y > canvas.height + 5) { p.y = -5; p.x = Math.random() * canvas.width }
        if (p.x < -5) p.x = canvas.width + 5
        if (p.x > canvas.width + 5) p.x = -5
      })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // CountUp animated stats
  useEffect(() => {
    const values = [6, 5, 1]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const idx = statRefs.current.indexOf(el as HTMLSpanElement)
          if (idx === -1) return
          ;(async () => {
            const { CountUp } = await import('countup.js')
            const cu = new CountUp(el, values[idx], { duration: 2.4, separator: '' })
            if (!cu.error) cu.start()
          })()
          observer.unobserve(el)
        })
      },
      { threshold: 0.8 },
    )
    statRefs.current.forEach((r) => { if (r) observer.observe(r) })
    return () => observer.disconnect()
  }, [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Stop Repeating Yourself to Claude with CLAUDE.md',
    description:
      'A free CLAUDE.md template that loads your rules, preferences, and project context automatically at the start of every Claude Code session.',
    author: {
      '@type': 'Person',
      name: 'Joe Che',
      url: 'https://www.mastermindshq.business',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Business Automation Mastermind',
      url: 'https://www.mastermindshq.business',
    },
    step: [
      {
        '@type': 'HowToStep',
        name: 'Download the file',
        text: 'Download the free CLAUDE.md template. It lands in your Downloads folder ready to use.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Move it to your project root',
        text: 'Drop CLAUDE.md in the root folder of your project. That is the only place it needs to be.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Open Claude Code',
        text: 'Claude Code reads CLAUDE.md automatically. Your rules and context are loaded before you type a word.',
        position: 3,
      },
    ],
    tool: [
      { '@type': 'HowToTool', name: 'Claude Code' },
    ],
    totalTime: 'PT5M',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @keyframes aurora-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -40px) scale(1.1); }
          66%       { transform: translate(-20px, 25px) scale(0.93); }
        }
        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(-35px, 30px) scale(1.07); }
          70%       { transform: translate(45px, -15px) scale(0.96); }
        }
        .aurora-a { animation: aurora-drift 16s ease-in-out infinite; }
        .aurora-b { animation: aurora-drift-2 20s ease-in-out infinite; }
        .glow-card {
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .glow-card:hover {
          box-shadow: 0 0 28px rgba(124, 105, 199, 0.12), 0 0 0 1px rgba(124, 105, 199, 0.18);
          border-color: rgba(124, 105, 199, 0.22) !important;
        }
        .glow-btn {
          transition: box-shadow 0.2s ease, background-color 0.15s ease, transform 0.1s ease-out;
        }
        .glow-btn:hover {
          box-shadow: 0 0 32px rgba(124, 105, 199, 0.45), 0 0 60px rgba(124, 105, 199, 0.2);
        }
        .glow-btn-pink:hover {
          box-shadow: 0 0 32px rgba(245, 195, 198, 0.5), 0 0 60px rgba(245, 195, 198, 0.2);
        }
      `}</style>

      <div className="min-h-screen bg-[#151515] text-[#FCF4EB] overflow-x-hidden">

        {/* Full-page falling particles */}
        <canvas
          ref={particleCanvasRef}
          className="fixed inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        />

        {/* ================================================================ */}
        {/* SECTION 1: HERO                                                   */}
        {/* ================================================================ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-4 pt-6 sm:pt-8">

          {/* Badge — pinned near the top */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-8 sm:top-10 left-0 right-0 flex justify-center"
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
              Free from the{' '}
              <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#BDB3E8] transition-colors underline underline-offset-2 decoration-[#7C69C7]/40">
                Business Automation Mastermind
              </a>
            </span>
          </motion.div>

          {/* Aurora glow blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="aurora-a absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full opacity-[0.09]"
              style={{ background: 'radial-gradient(circle, #8B79D4 0%, transparent 70%)', filter: 'blur(80px)' }}
            />
            <div
              className="aurora-b absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.07]"
              style={{ background: 'radial-gradient(circle, #F5C3C6 0%, transparent 70%)', filter: 'blur(90px)' }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4">

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-2 sm:whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(1.8rem, 5.5vw, 3.8rem)',
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                paddingBottom: '0.05em',
              }}
            >
              The Ultimate CLAUDE.md File
            </motion.h1>

            {/* Subheadline — white */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mb-5 sm:whitespace-nowrap text-[#FCF4EB]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 600,
                fontSize: 'clamp(1.1rem, 3.2vw, 2.6rem)',
                lineHeight: 1.15,
              }}
            >
              One file, your rules loaded automatically every session.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.6 }}
              className="text-[#FCF4EB]/55 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-6"
            >
              Drop <code className="text-[#9D8FE0] font-mono text-sm">CLAUDE.md</code> in your project root. Claude Code reads it at the start of every session -- your preferences, guardrails, and project context loaded before you type a word.
            </motion.p>

            {/* Works in strip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-6"
            >
              <span className="text-[#FCF4EB]/28 text-xs uppercase tracking-widest">Works in</span>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] border border-[#7C69C7]/35 transition-all duration-200">
                <span className="text-[#9D8FE0] text-sm">◆</span>
                <span className="text-[#FCF4EB]/75 text-sm font-medium">Claude Code</span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(124,105,199,0.18)',
                    color: '#9D8FE0',
                    border: '1px solid rgba(124,105,199,0.3)',
                  }}
                >
                  Native support
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.0 }}
              className="flex items-center justify-center gap-2 text-[#FCF4EB]/22 text-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              <span>Scroll to get the file</span>
            </motion.div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 2: HOW IT WORKS                                          */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              Set up once. Never explain yourself again.
            </h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { step: '01', title: 'Download the file', body: 'Hit the download button below. CLAUDE.md lands in your Downloads folder, named correctly and ready to go.' },
              { step: '02', title: 'Move it to your project root', body: 'Drop it in the root folder of your project -- the same level as your package.json or README. That is the only place it needs to be.' },
              { step: '03', title: 'Open Claude Code', body: 'Claude Code reads CLAUDE.md automatically at session start. Your rules, routing, and context are loaded before you type a word.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7"
              >
                <div className="text-4xl font-extrabold text-[#7C69C7]/20 mb-5 font-mono">{item.step}</div>
                <h3 className="text-[#FCF4EB] font-bold text-base mb-2">{item.title}</h3>
                <p className="text-[#FCF4EB]/44 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 4: MASTERMIND CTA (pink gradient, magnetic button)       */}
        {/* ================================================================ */}
        <MastermindCTA />

        {/* ================================================================ */}
        {/* SECTION 5: PARTICIPANT TESTIMONIALS                              */}
        {/* ================================================================ */}
        <MastermindReactionsSection />

        {/* ================================================================ */}
        {/* SECTION 6: THE FILE                                              */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
                The File
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] mb-4">
                Download. Drop. Done.
              </h2>
              <p className="text-[#FCF4EB]/45 max-w-xl mx-auto leading-relaxed">
                In the{' '}
                <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="text-[#9D8FE0] hover:text-[#BDB3E8] transition-colors">
                  Business Automation Mastermind
                </a>
                , this is the first thing we put in every new project. Edit the sections that say &ldquo;replace this&rdquo; and you are done.
              </p>
            </div>

            {/* Inline code block */}
            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.08] border-l-2 border-l-[#7C69C7]">
              <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                <span className="text-xs text-[#FCF4EB]/40 font-mono">CLAUDE.md</span>
                <InlineCopyButton text={THE_FILE} />
              </div>
              <pre
                className="p-5 text-sm font-mono leading-[1.75] text-[#FCF4EB]/82"
                style={{ background: '#0d0d0d', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '480px', overflowY: 'auto' }}
              >
                <code>{THE_FILE}</code>
              </pre>
            </div>

            {/* CTA buttons: copy + download */}
            <FileActionButtons fileContent={THE_FILE} />

            <p className="text-[#FCF4EB]/20 text-[11px] text-center mt-5 max-w-md mx-auto leading-relaxed">
              Free to use, share, and adapt. This is exactly the format Joe uses in every project. Customize the sections that are marked as placeholders and delete the ones you do not need.
            </p>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 7: STATS                                                  */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pt-6 pb-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { idx: 0, label: 'sections inside the file' },
              { idx: 1, label: 'iron laws pre-written for you' },
              { idx: 2, label: 'file in your project root' },
            ].map((stat) => (
              <motion.div
                key={stat.idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: stat.idx * 0.08 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 text-center"
              >
                <div className="text-5xl font-extrabold mb-3 tabular-nums" style={{ fontFamily: 'monospace', color: '#9D8FE0' }}>
                  <span ref={(el) => { statRefs.current[stat.idx] = el }}>0</span>
                </div>
                <p className="text-[#FCF4EB]/40 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 8: WHAT'S INSIDE                                         */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
              Everything inside this file
            </h2>
            <p className="text-[#FCF4EB]/35 text-sm max-w-lg mx-auto">
              Six sections. Each one solves a real problem with how Claude behaves by default.
            </p>
          </motion.div>

          <div className="space-y-3">
            {FILE_SECTIONS.map((section, i) => {
              const isOpen = openSections.has(section.name)
              return (
                <motion.div
                  key={section.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(section.name)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.025] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#FCF4EB] font-semibold text-sm sm:text-base">{section.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#9D8FE0] bg-[#7C69C7]/12 border border-[#7C69C7]/20 px-2 py-0.5 rounded-full">
                        {section.count}
                      </span>
                    </div>
                    <svg
                      width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="#9D8FE0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/[0.06] px-6 pb-5 pt-3">
                      <div className="grid gap-1 sm:grid-cols-2">
                        {section.items.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-start gap-3 p-3 rounded-lg"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7C69C7] mt-[7px] flex-shrink-0" />
                            <div>
                              <span className="text-[#9D8FE0] text-sm font-medium">
                                {item.name}
                              </span>
                              <p className="text-[#FCF4EB]/34 text-xs leading-relaxed mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ================================================================ */}
        {/* P.S. NOTE                                                         */}
        {/* ================================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6 pb-16 text-center"
        >
          <p className="text-[#FCF4EB]/22 text-sm leading-relaxed italic">
            P.S. This is the actual CLAUDE.md Joe uses. It took a few iterations to get right. You are getting the finished version.
          </p>
        </motion.div>

        {/* Footer */}
        <div className="text-center pb-10">
          <a
            href={MASTERMIND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FCF4EB]/14 text-xs uppercase tracking-widest hover:text-[#FCF4EB]/35 transition-colors"
          >
            Business Automation Mastermind
          </a>
        </div>

      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Mastermind CTA
// ---------------------------------------------------------------------------
function MastermindCTA() {
  const magnet = useMagnet(0.28)

  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(245,195,198,0.10) 0%, rgba(124,105,199,0.08) 100%)',
          border: '1px solid rgba(245,195,198,0.15)',
        }}
      >
        <div className="px-6 sm:px-14 pb-12 pt-8 text-center">
          <h2 className="text-2xl sm:text-5xl font-bold text-[#FCF4EB] mb-4">
            Want to learn how to do this?
          </h2>

          <p className="text-xl sm:text-3xl font-bold mb-5">
            <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6] hover:opacity-80 transition-opacity">
              Join the Business Automation Mastermind
            </a>
          </p>

          <p className="text-[#FCF4EB]/52 max-w-xl mx-auto mb-8 leading-relaxed text-base sm:text-lg">
            A small, focused group of business owners who meet weekly to build real things, fast -- leaving more time to serve clients and be with the people you love.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center mb-9">
            {['Small group, capped at 15', 'We meet weekly', 'Idea to live site in one session'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[#FCF4EB]/58 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F5C3C6] flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <a
            ref={magnet.ref as React.RefObject<HTMLAnchorElement>}
            href={MASTERMIND_URL}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={magnet.onMouseMove}
            onMouseLeave={magnet.onMouseLeave}
            className="block sm:inline-block w-full sm:w-auto px-10 py-4 rounded-xl bg-[#F5C3C6] hover:bg-[#f0b8bc] text-[#151515] font-bold text-base active:scale-[0.98] glow-btn glow-btn-pink text-center"
          >
            Learn More
          </a>
        </div>
      </motion.div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Inline copy button (for the code block header)
// ---------------------------------------------------------------------------
function InlineCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await copyWithConfetti(text, event)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }, [text])
  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1 rounded-md text-xs font-medium bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.10] text-[#FCF4EB]/60 hover:text-[#FCF4EB]/90 transition-all duration-150 select-none"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Copy + Download buttons
// ---------------------------------------------------------------------------
function FileActionButtons({ fileContent }: { fileContent: string }) {
  const [copied, setCopied] = useState(false)
  const magnet = useMagnet(0.22)

  const handleCopy = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await copyWithConfetti(fileContent, event)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch { /* noop */ }
  }, [fileContent])

  const handleDownload = useCallback(() => {
    const blob = new Blob([fileContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'CLAUDE.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    confetti({
      particleCount: 100,
      spread: 70,
      colors: ['#8B79D4', '#BDB3E8', '#F5C3C6', '#FCF4EB'],
      origin: { y: 0.55 },
    })
  }, [fileContent])

  return (
    <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
      {/* Download button (primary) */}
      <a
        ref={magnet.ref as React.RefObject<HTMLAnchorElement>}
        onClick={handleDownload}
        onMouseMove={magnet.onMouseMove}
        onMouseLeave={magnet.onMouseLeave}
        href="/joe-che-claude.md"
        download="CLAUDE.md"
        className="inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-xl bg-[#F5C3C6] hover:bg-[#f0b8bc] text-[#151515] font-bold text-base active:scale-[0.97] glow-btn glow-btn-pink shadow-xl shadow-[#F5C3C6]/20 cursor-pointer"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download CLAUDE.md
      </a>

      {/* Copy button (secondary) */}
      <button
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-xl bg-[#7C69C7] hover:bg-[#6B5AB8] text-white font-semibold text-base active:scale-[0.97] glow-btn shadow-xl shadow-[#7C69C7]/25"
      >
        {copied ? (
          <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy to Clipboard
          </>
        )}
      </button>
    </div>
  )
}
