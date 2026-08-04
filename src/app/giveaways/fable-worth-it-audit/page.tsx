'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'
import GiveawayEmailModal from '@/components/giveaways/GiveawayEmailModal'
import { copyWithConfetti } from '@/lib/copyWithConfetti'

const MASTERMIND_URL = 'https://www.mastermindshq.business'
const MANYCHAT_KEYWORD = 'FABLE'

const AUDIT_PROMPT = `You are auditing this codebase to decide where Claude Fable 5 is actually worth using instead of Sonnet.

Important frame:
- Fable is expensive. Do not recommend it for routine work.
- Sonnet should be the default for contained edits, short summaries, simple debugging, and normal feature work.
- Fable is only justified when the task is long-horizon, high-context, ambiguous, risky, expensive to redo, or benefits from multi-stage agent execution.
- Use the surgeon/pickle-jar rule: do not hire a surgeon to open a pickle jar.

Audit the repository and return:

1. Executive verdict
- Should this repo use Fable at all right now?
- If yes, for which 3-5 workflows?
- If no, what should stay on Sonnet?

2. Ranked Fable opportunities
For each opportunity, include:
- Workflow name
- Why Sonnet may struggle
- Why Fable may be worth the cost
- Risk if the model gets it wrong
- Required files, services, data, and tools
- Verification plan
- Estimated first experiment under 90 minutes
- Decision: Sonnet, Opus, Fable, or Managed Agent

3. Pickle jar list
List tasks that sound impressive but should not use Fable.

4. Agent readiness
Identify any workflows that need Claude Managed Agents or another agent harness because they require memory, tools, permissions, sandboxes, tracing, or long-running execution.

5. First prototype
Give me one copy-paste task spec I can run today in Claude Code to test the highest-value Fable use case safely.

Be blunt. Save money where possible. Recommend Fable only when the value is obvious.`

const AUDIT_QUESTIONS = [
  {
    key: 'failureCost',
    label: 'Cost if it gets it wrong',
    options: [
      ['1', 'Annoying, easy to fix'],
      ['2', 'A few hours lost'],
      ['4', 'A day or two lost'],
      ['6', 'Production, customers, or serious money'],
    ],
  },
  {
    key: 'contextSize',
    label: 'Context it must understand',
    options: [
      ['1', 'One file'],
      ['2', 'One module'],
      ['4', 'Several packages or services'],
      ['6', 'Whole system architecture'],
    ],
  },
  {
    key: 'duration',
    label: 'Work length',
    options: [
      ['1', 'Under 20 minutes'],
      ['2', 'One focused session'],
      ['4', 'Several stages'],
      ['6', 'Hours or days of agent work'],
    ],
  },
  {
    key: 'ambiguity',
    label: 'Ambiguity',
    options: [
      ['1', 'Very clear'],
      ['2', 'Some product judgment'],
      ['4', 'Architecture decisions'],
      ['6', 'Messy and high-context'],
    ],
  },
  {
    key: 'verification',
    label: 'Verification difficulty',
    options: [
      ['1', 'Simple test or visual check'],
      ['2', 'Several tests'],
      ['4', 'Regression thinking required'],
      ['6', 'Failures hide in edge cases'],
    ],
  },
] as const

const FABLE_EXAMPLES = [
  'Migrating a messy codebase without breaking production',
  'Planning architecture before a three-month build',
  'Debugging a failure across multiple services',
  'Reviewing hundreds of pages where missing one clause matters',
  'Running an agent that plans, tests, revises, and keeps going',
]

const SONNET_EXAMPLES = [
  'Rename a button',
  'Summarize a short email',
  'Clean up copy',
  'Fix a contained component bug',
  'Generate ten post ideas',
]

function useMagnet(strength = 0.3) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null)
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

function scoreToVerdict(score: number) {
  if (score < 35) {
    return {
      title: 'Use Sonnet. This is a pickle jar.',
      body: 'Fable would probably solve it, but that is not the same as being worth it. Start cheaper and escalate only if Sonnet stalls.',
    }
  }
  if (score < 68) {
    return {
      title: 'Start with Sonnet. Escalate with evidence.',
      body: 'Run the audit prompt on Sonnet first. If it finds architecture risk, unclear verification, or too much cross-repo context, then bring in Fable.',
    }
  }
  return {
    title: 'Fable is probably justified.',
    body: 'This has enough risk, context, ambiguity, or duration to justify the expensive specialist. Give it a tight task spec and a verification plan.',
  }
}

export default function FableWorthItAuditPage() {
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [answers, setAnswers] = useState<Record<string, number>>({
    failureCost: 4,
    contextSize: 4,
    duration: 4,
    ambiguity: 4,
    verification: 4,
  })
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)

  const total = Object.values(answers).reduce((sum, value) => sum + value, 0)
  const score = Math.max(0, Math.min(100, Math.round((total / 30) * 100)))
  const verdict = scoreToVerdict(score)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Audit your codebase for where Claude Fable 5 is worth using',
    description:
      'A free Claude Code prompt that ranks where to use Sonnet, Fable, or Managed Agents in a real codebase.',
    author: { '@type': 'Person', name: 'Joe Che', url: MASTERMIND_URL },
    publisher: { '@type': 'Organization', name: 'Business Automation Mastermind', url: MASTERMIND_URL },
    step: [
      { '@type': 'HowToStep', name: 'Run the quick audit', text: 'Score your workflow for risk, context, duration, ambiguity, and verification difficulty.', position: 1 },
      { '@type': 'HowToStep', name: 'Copy the prompt', text: 'Paste the Fable Worth-It Audit prompt into Claude Code from your repository root.', position: 2 },
      { '@type': 'HowToStep', name: 'Pick the first experiment', text: 'Use the ranked output to decide whether Sonnet, Fable, Opus, or Managed Agents is the right tool.', position: 3 },
    ],
    tool: [{ '@type': 'HowToTool', name: 'Claude Code' }],
    totalTime: 'PT10M',
  }

  useEffect(() => {
    if (document.querySelector('link[data-font="cormorant"]')) return
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,600;1,700&display=swap'
    link.rel = 'stylesheet'
    link.setAttribute('data-font', 'cormorant')
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null
    let rafId = 0
    ;(async () => {
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({ duration: 1.1 }) as unknown as { raf: (t: number) => void; destroy: () => void }
      const raf = (time: number) => { lenis!.raf(time); rafId = requestAnimationFrame(raf) }
      rafId = requestAnimationFrame(raf)
    })()
    return () => { if (lenis) lenis.destroy(); cancelAnimationFrame(rafId) }
  }, [])

  useEffect(() => {
    const canvas = particleCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    type Particle = { x: number; y: number; r: number; dx: number; dy: number; alpha: number; color: string }
    const colors = ['#8B79D4', '#F5C3C6', '#9D8FE0', '#BDB3E8', '#FCF4EB']
    const particles: Particle[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.4,
      dx: (Math.random() - 0.5) * 0.4,
      dy: Math.random() * 0.7 + 0.3,
      alpha: Math.random() * 0.22 + 0.05,
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
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        @keyframes aurora-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.1); }
          66% { transform: translate(-20px, 25px) scale(0.93); }
        }
        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-35px, 30px) scale(1.07); }
          70% { transform: translate(45px, -15px) scale(0.96); }
        }
        .aurora-a { animation: aurora-drift 16s ease-in-out infinite; }
        .aurora-b { animation: aurora-drift-2 20s ease-in-out infinite; }
        .glow-card { transition: box-shadow 0.3s ease, border-color 0.3s ease; }
        .glow-card:hover {
          box-shadow: 0 0 28px rgba(139, 121, 212, 0.12), 0 0 0 1px rgba(139, 121, 212, 0.18);
          border-color: rgba(139, 121, 212, 0.22) !important;
        }
        .glow-btn { transition: box-shadow 0.2s ease, background-color 0.15s ease, transform 0.1s ease-out; }
        .glow-btn:hover { box-shadow: 0 0 32px rgba(139, 121, 212, 0.45), 0 0 60px rgba(139, 121, 212, 0.2); }
        .fable-meter { width: ${score}%; }
      `}</style>

      <div className="min-h-screen bg-[#151515] text-[#FCF4EB] overflow-x-hidden">
        <canvas ref={particleCanvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />

        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-4 pt-6 sm:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 mb-6 flex justify-center sm:absolute sm:top-10 sm:left-0 sm:right-0 sm:mb-0"
          >
            <div className="p-[1px] rounded-full bg-gradient-to-r from-[#8B79D4] to-[#F5C3C6] inline-block">
              <div className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#151515] flex items-center gap-1.5 sm:gap-2 whitespace-nowrap max-w-[92vw]">
                <span className="text-[#9D8FE0] text-[11px] sm:text-xs">✦</span>
                <span className="font-semibold text-[11px] sm:text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]">
                  Comment {MANYCHAT_KEYWORD}
                </span>
                <span className="hidden sm:inline text-[#FCF4EB]/32 text-xs">for the free audit prompt</span>
                <span className="text-[#FCF4EB]/20 text-[11px] sm:text-xs">·</span>
                <span className="text-[#FCF4EB]/40 text-[11px] sm:text-xs">by Joe Che</span>
              </div>
            </div>
          </motion.div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="aurora-a absolute top-[10%] left-[15%] w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] rounded-full opacity-[0.09]" style={{ background: 'radial-gradient(circle, #8B79D4 0%, transparent 70%)', filter: 'blur(80px)' }} />
            <div className="aurora-b absolute top-[30%] right-[10%] w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #F5C3C6 0%, transparent 70%)', filter: 'blur(90px)' }} />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(2.7rem, 8vw, 6.2rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.01em',
                paddingBottom: '0.07em',
              }}
            >
              Fable is back. Do not waste it on pickle jars.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.45 }}
              className="text-[#FCF4EB]/62 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto mb-7"
            >
              Use Sonnet to decide when to use Fable. This free audit prompt finds where the expensive model is actually worth it in your codebase.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-6"
            >
              <span className="text-[#FCF4EB]/28 text-xs uppercase tracking-widest">Rule of thumb</span>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.10]">
                <span className="text-[#FCF4EB]/50 text-sm">◇</span>
                <span className="text-[#FCF4EB]/75 text-sm font-medium">Sonnet for minutes</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] border border-[#8B79D4]/35">
                <span className="text-[#9D8FE0] text-sm">◆</span>
                <span className="text-[#FCF4EB]/75 text-sm font-medium">Fable for days saved</span>
              </div>
            </motion.div>

            <HeroCopyButton prompt={AUDIT_PROMPT} onAfterCopy={() => setEmailModalOpen(true)} />
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-14">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#8B79D4]/15 text-[#9D8FE0] border border-[#8B79D4]/25">
              Start here
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] mb-4">The Fable Worth-It Audit</h2>
            <p className="text-[#FCF4EB]/45 max-w-xl mx-auto leading-relaxed">
              Score a workflow before you pay premium tokens for it. If failure costs minutes, use Sonnet. If failure costs days, consider Fable.
            </p>
          </motion.div>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-7">
              <div className="grid gap-4">
                {AUDIT_QUESTIONS.map((question) => (
                  <label key={question.key} className="grid gap-2">
                    <span className="text-[#FCF4EB]/70 text-sm font-semibold">{question.label}</span>
                    <select
                      value={answers[question.key]}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [question.key]: Number(e.target.value) }))}
                      className="w-full rounded-xl bg-[#0d0d0d] border border-white/[0.10] px-4 py-3 text-[#FCF4EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#9D8FE0]/50"
                    >
                      {question.options.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>

            <div className="glow-card bg-white/[0.04] border border-[#8B79D4]/25 rounded-2xl p-6 sm:p-8">
              <div className="text-[#FCF4EB]/32 text-xs uppercase tracking-widest mb-3">Worth-it score</div>
              <div className="text-7xl font-extrabold text-[#9D8FE0] mb-4 tabular-nums">{score}</div>
              <div className="h-3 rounded-full bg-white/[0.08] overflow-hidden mb-6">
                <div className="fable-meter h-full rounded-full bg-gradient-to-r from-[#8B79D4] to-[#F5C3C6]" />
              </div>
              <h3 className="text-2xl font-bold text-[#FCF4EB] mb-3">{verdict.title}</h3>
              <p className="text-[#FCF4EB]/48 text-sm leading-relaxed mb-6">{verdict.body}</p>
              <InlineCopyButton text={AUDIT_PROMPT} onAfterCopy={() => setEmailModalOpen(true)} label="Copy audit prompt" />
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-14">
          <div className="grid gap-5 sm:grid-cols-2">
            <ExampleColumn title="Use Sonnet for" intro="Fast, smart, affordable, and usually enough." items={SONNET_EXAMPLES} />
            <ExampleColumn title="Use Fable for" intro="Long, risky, expensive to redo, or painful to reason about." items={FABLE_EXAMPLES} highlight />
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(139,121,212,0.07) 0%, rgba(245,195,198,0.05) 100%)',
              border: '1px solid rgba(139,121,212,0.15)',
            }}
          >
            <div className="px-5 py-8 sm:px-8 sm:py-10">
              <blockquote className="text-xl sm:text-2xl leading-relaxed text-[#FCF4EB]/80 mb-5" style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic' }}>
                "The audit is useful because it does not ask, can AI do this? It asks whether the work is expensive enough to justify the expensive model."
              </blockquote>
              <p className="text-[#FCF4EB]/36 text-sm">Joe Che, Business Automation Mastermind, Session 5</p>
            </div>
          </motion.div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-10">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#8B79D4]/15 text-[#9D8FE0] border border-[#8B79D4]/25">
                Giveaway prompt
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] mb-4">Copy it into Claude Code.</h2>
              <p className="text-[#FCF4EB]/45 max-w-xl mx-auto leading-relaxed">
                Run this from your repository root. The output should rank Fable opportunities, pickle jars, Managed Agent candidates, and the first safe prototype.
              </p>
            </div>

            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.08]" style={{ borderLeftWidth: 2, borderLeftColor: '#8B79D4' }}>
              <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06] gap-3">
                <span className="text-xs text-[#FCF4EB]/40 font-mono">Claude Code prompt</span>
                <InlineCopyButton text={AUDIT_PROMPT} onAfterCopy={() => setEmailModalOpen(true)} label="Copy" compact />
              </div>
              <pre
                className="p-3 sm:p-5 text-[12px] sm:text-sm font-mono leading-[1.7] text-[#FCF4EB]/82"
                style={{ background: '#0d0d0d', whiteSpace: 'pre-wrap', wordBreak: 'normal', overflowWrap: 'anywhere' }}
              >
                <code>{AUDIT_PROMPT}</code>
              </pre>
            </div>
          </motion.div>
        </section>

        <MastermindCTA />
        <MastermindReactionsSection />

        <div className="text-center pb-10 flex flex-col items-center gap-1.5">
          <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="text-[#FCF4EB]/14 text-xs uppercase tracking-widest hover:text-[#FCF4EB]/35 transition-colors">
            Business Automation Mastermind
          </a>
          <span className="text-[#FCF4EB]/10 text-xs">Created by Joe Che</span>
        </div>
      </div>

      <GiveawayEmailModal
        slug="fable-worth-it-audit"
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />
    </>
  )
}

function ExampleColumn({ title, intro, items, highlight = false }: { title: string; intro: string; items: string[]; highlight?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glow-card rounded-2xl p-7"
      style={{
        background: highlight ? 'rgba(139,121,212,0.10)' : 'rgba(255,255,255,0.04)',
        border: highlight ? '1px solid rgba(139,121,212,0.24)' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <h3 className="text-2xl font-bold text-[#FCF4EB] mb-2">{title}</h3>
      <p className="text-[#FCF4EB]/42 text-sm leading-relaxed mb-5">{intro}</p>
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span className="text-[#9D8FE0] mt-0.5">◆</span>
            <span className="text-[#FCF4EB]/68 text-sm leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function HeroCopyButton({ prompt, onAfterCopy }: { prompt: string; onAfterCopy: () => void }) {
  const magnet = useMagnet(0.24)
  return (
    <button
      ref={magnet.ref as React.RefObject<HTMLButtonElement>}
      onMouseMove={magnet.onMouseMove}
      onMouseLeave={magnet.onMouseLeave}
      onClick={async (e) => {
        await copyWithConfetti(prompt, e)
        onAfterCopy()
      }}
      className="glow-btn inline-flex items-center justify-center rounded-full px-7 py-4 bg-[#8B79D4] text-white font-bold text-sm sm:text-base hover:bg-[#8B79D4]"
    >
      Copy the Fable audit prompt
    </button>
  )
}

function InlineCopyButton({ text, onAfterCopy, label = 'Copy prompt', compact = false }: { text: string; onAfterCopy: () => void; label?: string; compact?: boolean }) {
  const magnet = useMagnet(0.22)
  return (
    <button
      ref={magnet.ref as React.RefObject<HTMLButtonElement>}
      onMouseMove={magnet.onMouseMove}
      onMouseLeave={magnet.onMouseLeave}
      onClick={async (e) => {
        await copyWithConfetti(text, e)
        onAfterCopy()
      }}
      className={`glow-btn rounded-full bg-[#8B79D4] text-white font-bold hover:bg-[#8B79D4] ${compact ? 'px-3 py-1.5 text-xs' : 'w-full px-5 py-3 text-sm'}`}
    >
      {label}
    </button>
  )
}

function MastermindCTA() {
  const magnet = useMagnet(0.28)
  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl p-8 sm:p-10 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(139,121,212,0.16) 0%, rgba(245,195,198,0.10) 100%)',
          border: '1px solid rgba(245,195,198,0.18)',
        }}
      >
        <h2 className="text-2xl sm:text-4xl font-bold text-[#FCF4EB] mb-4">
          Want to learn how to build agent workflows without wasting tokens?
        </h2>
        <p className="text-[#FCF4EB]/52 max-w-2xl mx-auto mb-7 leading-relaxed">
          Business Automation Mastermind teaches the practical system: which model to use, when to escalate, how to verify, and when an agent needs real infrastructure instead of a bigger prompt.
        </p>
        <a
          ref={magnet.ref as React.RefObject<HTMLAnchorElement>}
          onMouseMove={magnet.onMouseMove}
          onMouseLeave={magnet.onMouseLeave}
          href={MASTERMIND_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="glow-btn glow-btn-pink inline-flex items-center justify-center rounded-full px-7 py-4 bg-[#F5C3C6] text-[#151515] font-bold text-sm sm:text-base hover:bg-[#ffd5d8]"
        >
          Join the Mastermind
        </a>
      </motion.div>
    </section>
  )
}
