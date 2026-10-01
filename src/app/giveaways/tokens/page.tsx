'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'
import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'
import { copyWithConfetti } from '@/lib/copyWithConfetti'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MASTERMIND_URL = 'https://www.mastermindshq.business'
const RTK_URL = 'https://www.rtk-ai.app/'
const TYPESAFE_URL = 'https://typesafe.ai'

const RTK_COMMANDS = `brew install rtk
rtk init -g
# now work normally for a day or two, then:
rtk gain`

const STARTUP_TEMPLATE = `# CLAUDE.md

## Who I am
- I run [your business] and sell [what you sell] to [who you sell to].
- I am not a developer. Explain things in plain English, short answer first.
- My main tools: [e.g. Claude Code, Stripe, Gmail, my website repo].

## The 5 rules that matter
1. Never send an email or message without showing me first.
2. Ask before deleting any file or data.
3. Run the tests before you tell me something is done.
4. Use the cheapest model that can do the job. Step up only if it fails.
5. Keep answers short unless I ask for detail.

## Where the details live
- Brand and writing voice: read docs/voice.md
- Deploying the website: read docs/deploy.md
- Clients and pricing: read docs/clients.md
Only open these when the task needs them.`

const MODEL_TIERS = [
  {
    job: 'Quick lookups, renames, formatting, summaries',
    model: 'Small, fast model',
    example: 'Claude Haiku',
    glyph: '◇',
  },
  {
    job: 'Everyday coding and writing',
    model: 'Mid model',
    example: 'Claude Sonnet',
    glyph: '◆',
  },
  {
    job: 'Architecture, hard debugging, high-stakes writing',
    model: 'Top model',
    example: 'Claude Opus',
    glyph: '◈',
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
export default function TokensPage() {
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const statRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null])

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

  // Canvas falling particles
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
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // CountUp animated stats: 1.4 billion tokens, 70.7%, ~243,000 commands
  useEffect(() => {
    const configs = [
      { value: 1.4, decimals: 1, separator: '' },
      { value: 70.7, decimals: 1, separator: '' },
      { value: 243000, decimals: 0, separator: ',' },
    ]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const idx = statRefs.current.indexOf(el as HTMLSpanElement)
          if (idx === -1) return
          const cfg = configs[idx]
          ;(async () => {
            const { CountUp } = await import('countup.js')
            const cu = new CountUp(el, cfg.value, { duration: 2.4, decimalPlaces: cfg.decimals, separator: cfg.separator })
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
    name: 'The Token Diet: cut your AI agents\' token use',
    description:
      'Four changes that cut AI agent token use by about 70% on the same plan: filter command output with RTK, route each job to the cheapest model that can do it, keep startup files short, and put a receptionist in front of your AI.',
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
        name: 'Filter the noise before AI reads it',
        text: 'Install RTK with brew install rtk, run rtk init -g to add the Claude Code hook, work normally, then run rtk gain to see your savings.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Use the cheapest model that can do each job',
        text: 'Small, fast models for lookups and formatting, a mid model for everyday coding and writing, the top model only for architecture, hard debugging and high-stakes writing.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Keep startup files short',
        text: 'Cut CLAUDE.md or AGENTS.md down to who you are, the five rules that matter, and pointers to detail files that load only when a task needs them.',
        position: 3,
      },
      {
        '@type': 'HowToStep',
        name: 'Let a router decide before a big model runs',
        text: 'Put a router in front of every request: a free safety gate for read-only commands, saved recipes for known jobs, project indexes for context, then the cheapest capable model. Use a small classifier for the routing decisions.',
        position: 4,
      },
    ],
    tool: [
      { '@type': 'HowToTool', name: 'Claude Code' },
      { '@type': 'HowToTool', name: 'RTK' },
    ],
    totalTime: 'PT15M',
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
          box-shadow: 0 0 28px rgba(139, 121, 212, 0.12), 0 0 0 1px rgba(139, 121, 212, 0.18);
          border-color: rgba(139, 121, 212, 0.22) !important;
        }
        .glow-btn {
          transition: box-shadow 0.2s ease, background-color 0.15s ease, transform 0.1s ease-out;
        }
        .glow-btn:hover {
          box-shadow: 0 0 32px rgba(139, 121, 212, 0.45), 0 0 60px rgba(139, 121, 212, 0.2);
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

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 mb-6 flex justify-center sm:absolute sm:top-10 sm:left-0 sm:right-0 sm:mb-0"
          >
            <div className="p-[1px] rounded-full bg-gradient-to-r from-[#8B79D4] to-[#F5C3C6] inline-block">
              <div className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#151515] flex items-center gap-1.5 sm:gap-2 whitespace-nowrap max-w-[92vw]">
                <span className="text-[#9D8FE0] text-[11px] sm:text-xs">✦</span>
                <span
                  className="font-semibold text-[11px] sm:text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]"
                >
                  Free Guide
                </span>
                <span className="hidden sm:inline text-[#FCF4EB]/32 text-xs">from the</span>
                <a
                  href={MASTERMIND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FCF4EB]/60 text-[11px] sm:text-xs font-medium hover:text-[#FCF4EB]/90 transition-colors"
                >
                  <span className="sm:hidden">Mastermind</span>
                  <span className="hidden sm:inline">Business Automation Mastermind</span>
                </a>
                <span className="text-[#FCF4EB]/20 text-[11px] sm:text-xs">·</span>
                <span className="text-[#FCF4EB]/40 text-[11px] sm:text-xs">by Joe Che</span>
              </div>
            </div>
          </motion.div>

          {/* Aurora glow blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="aurora-a absolute top-[10%] left-[15%] w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] rounded-full opacity-[0.09]"
              style={{ background: 'radial-gradient(circle, #8B79D4 0%, transparent 70%)', filter: 'blur(80px)' }}
            />
            <div
              className="aurora-b absolute top-[30%] right-[10%] w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] rounded-full opacity-[0.07]"
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
                fontSize: 'clamp(2.2rem, 7vw, 4.6rem)',
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                paddingBottom: '0.05em',
              }}
            >
              The Token Diet
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mb-5 text-[#FCF4EB]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 600,
                fontSize: 'clamp(1.1rem, 3.2vw, 2.4rem)',
                lineHeight: 1.15,
              }}
            >
              Before you pay more, stop burning what you already pay for.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.6 }}
              className="text-[#FCF4EB]/55 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-6"
            >
              OpenAI just made ChatGPT&apos;s top plan $500 a month. From October 30, the $200 plan gets half the usage it had, 10x the Plus plan instead of 20x. Most of us are not short on plan. We are wasting it. Here are the four changes that cut my agents&apos; token use by 70% on the same plan.
            </motion.p>

            {/* Works in strip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-6"
            >
              <span className="text-[#FCF4EB]/28 text-xs uppercase tracking-widest">Works in</span>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] border border-[#8B79D4]/35 transition-all duration-200">
                <span className="text-[#9D8FE0] text-sm">◆</span>
                <span className="text-[#FCF4EB]/75 text-sm font-medium">Claude Code</span>
              </div>
              <span className="text-[#FCF4EB]/28 text-xs">+</span>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.10] transition-all duration-200">
                <span className="text-[#FCF4EB]/50 text-sm font-mono">{'</>'}</span>
                <span className="text-[#FCF4EB]/75 text-sm font-medium">Codex</span>
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
              <span>Scroll for the four changes</span>
            </motion.div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 2: PROOF STATS                                           */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 bg-[#8B79D4]/15 text-[#9D8FE0] border border-[#8B79D4]/25">
              My real numbers
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
              Same plan. Same work. 70% fewer tokens.
            </h2>
            <p className="text-[#FCF4EB]/45 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              These come straight from <span className="font-mono text-[#9D8FE0]">rtk gain</span> on my own machine, where my AI agents run all day. I did not pay for a bigger plan. I just stopped feeding them junk.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { idx: 0, suffix: 'B', label: 'tokens saved' },
              { idx: 1, suffix: '%', label: 'of everything my agents would have used' },
              { idx: 2, suffix: '', label: 'commands, about' },
            ].map((stat) => (
              <motion.div
                key={stat.idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: stat.idx * 0.08 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 text-center"
              >
                <div className="text-4xl sm:text-5xl font-extrabold mb-3 tabular-nums" style={{ fontFamily: 'monospace', color: '#9D8FE0' }}>
                  <span ref={(el) => { statRefs.current[stat.idx] = el }}>0</span>
                  {stat.suffix && <span className="text-3xl">{stat.suffix}</span>}
                </div>
                <p className="text-[#FCF4EB]/40 text-sm">
                  {stat.idx === 2 ? 'commands across every agent session' : stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 3: THE FOUR CHANGES                                      */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              Four changes. Start with the first one today.
            </h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '01', title: 'Filter the noise', body: 'Trim test output, git logs and file listings before the model ever reads them.' },
              { step: '02', title: 'Right-size the model', body: 'The cheapest model that can do each job. Step up only when a task actually fails.' },
              { step: '03', title: 'Short startup files', body: 'Your CLAUDE.md is read every session. Make it short and point to the details.' },
              { step: '04', title: 'Route before you run', body: 'How I built MyOS Dispatch, with Jev making the routing calls, so most requests never touch the expensive model.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7"
              >
                <div className="text-4xl font-extrabold text-[#8B79D4]/20 mb-5 font-mono">{item.step}</div>
                <h3 className="text-[#FCF4EB] font-bold text-base mb-2">{item.title}</h3>
                <p className="text-[#FCF4EB]/44 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 4: FIX 1, RTK                                            */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(139,121,212,0.07) 0%, rgba(157,143,224,0.04) 100%)',
              border: '1px solid rgba(139,121,212,0.15)',
            }}
          >
            <div className="px-5 py-8 sm:px-8 sm:py-10">
              <div className="text-center mb-8">
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 bg-[#8B79D4]/15 text-[#9D8FE0] border border-[#8B79D4]/25">
                  Fix 1
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
                  Filter the noise before AI reads it
                </h2>
              </div>

              <div className="max-w-2xl mx-auto space-y-4 text-[#FCF4EB]/60 leading-relaxed">
                <p>
                  Every time your agent runs a command, the whole output goes back into the model. Test runs, git logs, file listings. Most of it is noise: hundreds of passing tests, the same headers over and over, folders nobody asked about. You pay for every line of it, and it crowds out the stuff that matters.
                </p>
                <p>
                  RTK sits between your agent and the terminal and trims that output down to what the model actually needs before it reads it. You do not change how you work. It just happens.
                </p>
                <p className="text-[#FCF4EB]/45 text-sm">
                  To be clear, RTK is not my tool. It is free and open source, made by the team at{' '}
                  <a href={RTK_URL} target="_blank" rel="noopener noreferrer" className="text-[#9D8FE0]/80 hover:text-[#9D8FE0] transition-colors underline underline-offset-2">
                    rtk-ai.app
                  </a>
                  . I just use it every single day, and it is where most of my 70% came from.
                </p>
              </div>

              {/* Steps */}
              <div className="max-w-2xl mx-auto mt-8 space-y-3">
                {[
                  { cmd: 'brew install rtk', text: 'Installs RTK on your Mac.' },
                  { cmd: 'rtk init -g', text: 'Adds the hook to Claude Code so every command gets filtered automatically.' },
                  { cmd: 'work normally', text: 'Nothing to remember. Use your agent the way you already do.' },
                  { cmd: 'rtk gain', text: 'After a day or two, run this to see your own savings.' },
                ].map((s, i) => (
                  <div key={s.cmd} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#9D8FE0] bg-[#8B79D4]/15 border border-[#8B79D4]/25">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <span className={i === 2 ? 'text-[#FCF4EB] font-semibold text-sm' : 'text-[#9D8FE0] font-mono text-sm'}>
                        {s.cmd}
                      </span>
                      <p className="text-[#FCF4EB]/44 text-sm leading-relaxed mt-0.5">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Command block */}
              <div className="max-w-2xl mx-auto mt-8 rounded-xl overflow-hidden border border-white/[0.08]" style={{ borderLeftWidth: 2, borderLeftColor: '#8B79D4' }}>
                <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                  <span className="text-xs text-[#FCF4EB]/40 font-mono">Terminal</span>
                  <InlineCopyButton text={RTK_COMMANDS} />
                </div>
                <pre
                  className="p-3 sm:p-5 text-[12px] sm:text-sm font-mono leading-[1.7] text-[#FCF4EB]/82"
                  style={{ background: '#0d0d0d', whiteSpace: 'pre-wrap', wordBreak: 'normal', overflowWrap: 'anywhere' }}
                >
                  <code>{RTK_COMMANDS}</code>
                </pre>
              </div>
              <p className="text-[#FCF4EB]/25 text-[11px] text-center mt-4 max-w-md mx-auto leading-relaxed">
                Needs Homebrew on a Mac. Other platforms and agents (Cursor, Gemini CLI and more) are covered on{' '}
                <a href={RTK_URL} target="_blank" rel="noopener noreferrer" className="text-[#9D8FE0]/60 hover:text-[#9D8FE0] transition-colors underline underline-offset-2">
                  the RTK site
                </a>
                .
              </p>
            </div>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 5: FIX 2, MODEL ROUTING                                  */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 bg-[#8B79D4]/15 text-[#9D8FE0] border border-[#8B79D4]/25">
              Fix 2
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
              The cheapest model that can do each job
            </h2>
            <p className="text-[#FCF4EB]/45 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Running the top model on everything is like hiring a surgeon to put on a bandage. It works. It is also the fastest way to hit your limit by Wednesday.
            </p>
          </motion.div>

          <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03]">
            <div className="hidden sm:grid grid-cols-[1.6fr_1fr] px-6 py-3 border-b border-white/[0.08] bg-white/[0.03]">
              <span className="text-[11px] uppercase tracking-widest text-[#FCF4EB]/35">The job</span>
              <span className="text-[11px] uppercase tracking-widest text-[#FCF4EB]/35">Use</span>
            </div>
            {MODEL_TIERS.map((tier, i) => (
              <motion.div
                key={tier.model}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`grid gap-2 sm:gap-6 sm:grid-cols-[1.6fr_1fr] px-5 sm:px-6 py-5 ${i < MODEL_TIERS.length - 1 ? 'border-b border-white/[0.06]' : ''}`}
              >
                <p className="text-[#FCF4EB]/75 text-sm sm:text-base leading-relaxed">{tier.job}</p>
                <div className="flex items-start gap-2">
                  <span className="text-[#9D8FE0] text-sm mt-0.5">{tier.glyph}</span>
                  <div>
                    <span className="text-[#FCF4EB] font-semibold text-sm sm:text-base">{tier.model}</span>
                    <p className="text-[#FCF4EB]/35 text-xs mt-0.5">e.g. {tier.example}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 rounded-xl px-5 py-5 sm:px-6"
            style={{ background: 'rgba(245,195,198,0.06)', border: '1px solid rgba(245,195,198,0.14)' }}
          >
            <p className="text-[#FCF4EB]/70 text-sm sm:text-base leading-relaxed">
              <span className="text-[#F5C3C6] font-semibold">The tip: </span>
              set your default to the mid model. Step up to the top model only when a task fails, then step back down. Most days you will barely touch it, and you will not miss it.
            </p>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 6: FIX 3, SHORT STARTUP FILES                            */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(245,195,198,0.06) 0%, rgba(139,121,212,0.05) 100%)',
              border: '1px solid rgba(245,195,198,0.12)',
            }}
          >
            <div className="px-5 py-8 sm:px-8 sm:py-10">
              <div className="text-center mb-8">
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 bg-[#F5C3C6]/10 text-[#F5C3C6] border border-[#F5C3C6]/25">
                  Fix 3
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
                  Short startup files
                </h2>
              </div>

              <div className="max-w-2xl mx-auto space-y-4 text-[#FCF4EB]/60 leading-relaxed mb-8">
                <p>
                  Your CLAUDE.md (or AGENTS.md in Codex) gets read at the start of every single session. That is the point of it. It also means a 2,000-line file is paid for every time, even when you only asked the agent to fix a typo.
                </p>
                <p>
                  Mine used to be huge. Now it is the few things the agent needs every time, plus pointers to everything else. The details still exist. They just load when a task needs them, not on every hello.
                </p>
              </div>

              {/* Before / after */}
              <div className="grid gap-4 sm:grid-cols-2 mb-8">
                <div className="rounded-xl p-5" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.18)' }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#f87171' }}>Before</div>
                  <ul className="space-y-2 text-sm text-[#FCF4EB]/55 leading-relaxed">
                    <li className="flex gap-2"><span className="text-[#f87171]/70">◇</span>2,000 lines, read on every session</li>
                    <li className="flex gap-2"><span className="text-[#f87171]/70">◇</span>Brand guide, client list, deploy steps and old notes all pasted in</li>
                    <li className="flex gap-2"><span className="text-[#f87171]/70">◇</span>You pay for all of it, even for a one-line fix</li>
                  </ul>
                </div>
                <div className="rounded-xl p-5" style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.18)' }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#34d399' }}>After</div>
                  <ul className="space-y-2 text-sm text-[#FCF4EB]/55 leading-relaxed">
                    <li className="flex gap-2"><span className="text-[#34d399]/70">◆</span>About 25 lines</li>
                    <li className="flex gap-2"><span className="text-[#34d399]/70">◆</span>Who you are, the 5 rules that matter, where the details live</li>
                    <li className="flex gap-2"><span className="text-[#34d399]/70">◆</span>Details load only when a task needs them</li>
                  </ul>
                </div>
              </div>

              {/* Template */}
              <div className="rounded-xl overflow-hidden border border-white/[0.08]" style={{ borderLeftWidth: 2, borderLeftColor: '#F5C3C6' }}>
                <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                  <span className="text-xs text-[#FCF4EB]/40 font-mono">CLAUDE.md template</span>
                  <InlineCopyButton text={STARTUP_TEMPLATE} />
                </div>
                <pre
                  className="p-3 sm:p-5 text-[12px] sm:text-sm font-mono leading-[1.7] text-[#FCF4EB]/82"
                  style={{ background: '#0d0d0d', whiteSpace: 'pre-wrap', wordBreak: 'normal', overflowWrap: 'anywhere' }}
                >
                  <code>{STARTUP_TEMPLATE}</code>
                </pre>
              </div>

              <TemplateCopyButton text={STARTUP_TEMPLATE} />

              <p className="text-[#FCF4EB]/25 text-[11px] text-center mt-4 max-w-md mx-auto leading-relaxed">
                Fill in the brackets, save it as CLAUDE.md (or AGENTS.md for Codex) in your project folder, and move everything else into the docs files it points to.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 7: FIX 4, ROUTER (MYOS DISPATCH + JEV)                   */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(139,121,212,0.07) 0%, rgba(157,143,224,0.04) 100%)',
              border: '1px solid rgba(139,121,212,0.15)',
            }}
          >
            <div className="px-5 py-8 sm:px-8 sm:py-10">
              <div className="text-center mb-8">
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 bg-[#8B79D4]/15 text-[#9D8FE0] border border-[#8B79D4]/25">
                  Fix 4
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
                  Put a receptionist in front of your AI
                </h2>
              </div>

              <div className="max-w-2xl mx-auto space-y-4 text-[#FCF4EB]/60 leading-relaxed mb-8">
                <p>
                  Most people send every request straight to the most expensive model. That's like having your CEO answer the phone.
                </p>
                <p>
                  So I built a receptionist. I call it MyOS Dispatch. Before any AI runs, it looks at the request and sends it to the cheapest place that can handle it:
                </p>
              </div>

              {/* Router steps */}
              <div className="max-w-2xl mx-auto space-y-3 mb-8">
                {[
                  { title: 'Simple stuff', body: 'Checking a file or a status. Handled instantly, no AI at all.' },
                  { title: "Jobs I've done before", body: 'It runs the saved recipe. No AI needed.' },
                  { title: 'Real work', body: 'Goes to the cheapest model that can do it, with only the files it needs.' },
                ].map((s, i) => (
                  <div key={s.title} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#9D8FE0] bg-[#8B79D4]/15 border border-[#8B79D4]/25">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[#FCF4EB] font-semibold text-sm">{s.title}</span>
                      <p className="text-[#FCF4EB]/44 text-sm leading-relaxed mt-0.5">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="max-w-2xl mx-auto space-y-4 text-[#FCF4EB]/60 leading-relaxed">
                <p>
                  To make those calls fast, Dispatch uses Jev, a tiny model from{' '}
                  <a href={TYPESAFE_URL} target="_blank" rel="noopener noreferrer" className="text-[#9D8FE0]/80 hover:text-[#9D8FE0] transition-colors underline underline-offset-2">
                    TypeSafe AI
                  </a>
                  {' '}(not mine) that only picks from a short list of answers. It costs me about 18 cents a day.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 mt-8">
                {[
                  { value: '~$0.18 a day', label: 'for every routing decision' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-4 text-center"
                    style={{ background: 'rgba(139,121,212,0.08)', border: '1px solid rgba(139,121,212,0.16)' }}
                  >
                    <div className="text-2xl font-extrabold text-[#9D8FE0] mb-1">{stat.value}</div>
                    <div className="text-[#FCF4EB]/50 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="max-w-2xl mx-auto mt-8 text-center">
                <a href="https://github.com/josephtandle/myos-dispatch" target="_blank" rel="noopener noreferrer" className="text-[#9D8FE0]/80 hover:text-[#9D8FE0] transition-colors underline underline-offset-2">
                  MyOS Dispatch is free and open source: github.com/josephtandle/myos-dispatch
                </a>
              </div>

              <div className="max-w-2xl mx-auto mt-8 rounded-xl px-5 py-5 sm:px-6" style={{ background: 'rgba(245,195,198,0.06)', border: '1px solid rgba(245,195,198,0.14)' }}>
                <p className="text-[#FCF4EB]/70 text-sm sm:text-base leading-relaxed">
                  <span className="text-[#F5C3C6] font-semibold">The point: </span>
                  use a classifier for choices, and save the big model for real work. Picking a lane is not a job for the smartest model you pay for.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 7B: FEATURED QUOTE                                       */}
        {/* ================================================================ */}
        <section className="relative max-w-3xl mx-auto px-6 pb-14">
          <motion.figure
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-l-2 border-[#9D8FE0]/40 pl-6 sm:pl-8"
          >
            <blockquote
              className="text-[#FCF4EB]/85 leading-relaxed"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 'clamp(1.25rem, 2.6vw, 1.75rem)',
                lineHeight: 1.45,
              }}
            >
              &ldquo;I used to pay all these people; now I can do it myself.&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-[#FCF4EB]/45 text-sm uppercase tracking-widest">
              SunDari · Session 1, Business Automation Mastermind
            </figcaption>
          </motion.figure>
        </section>

        {/* ================================================================ */}
        {/* SECTION 8: MASTERMIND CTA                                        */}
        {/* ================================================================ */}
        <MastermindCTA />

        {/* ================================================================ */}
        {/* SECTION 9: PARTICIPANT REACTIONS                                 */}
        {/* ================================================================ */}
        <MastermindReactionsSection />

        {/* ================================================================ */}
        {/* P.S. NOTE                                                         */}
        {/* ================================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6 pt-10 pb-16 text-center"
        >
          <p className="text-[#FCF4EB]/22 text-sm leading-relaxed italic">
            P.S. Prices will keep moving. Usage limits will keep moving. The habit that holds up either way is the same one: do not pay a model to read things it does not need.
          </p>
        </motion.div>

        {/* Footer */}
        <div className="text-center pb-10 flex flex-col items-center gap-1.5">
          <a
            href={MASTERMIND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FCF4EB]/14 text-xs uppercase tracking-widest hover:text-[#FCF4EB]/35 transition-colors"
          >
            Business Automation Mastermind
          </a>
          <span className="text-[#FCF4EB]/10 text-xs">Created by Joe Che</span>
        </div>

      </div>

      <GiveawayAutoModal
        slug="tokens"
        headingOverride="Want The Token Diet in your inbox?"
      />
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
          background: 'linear-gradient(135deg, rgba(245,195,198,0.10) 0%, rgba(139,121,212,0.08) 100%)',
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
            A small, focused group of business owners who meet weekly to build real things, fast, leaving more time to serve clients and be with the people you love.
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
// Inline copy button (code block header)
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
// Big template copy button
// ---------------------------------------------------------------------------
function TemplateCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const magnet = useMagnet(0.28)

  const handleCopy = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await copyWithConfetti(text, event)
      setCopied(true)
      setTimeout(() => setCopied(false), 3500)
    } catch { /* noop */ }
  }, [text])

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <button
        ref={magnet.ref as React.RefObject<HTMLButtonElement>}
        onClick={handleCopy}
        onMouseMove={magnet.onMouseMove}
        onMouseLeave={magnet.onMouseLeave}
        className="block w-full sm:inline-block sm:w-auto px-10 py-4 rounded-xl bg-[#8B79D4] hover:bg-[#6e5db8] text-[#FCF4EB] font-bold text-base active:scale-[0.98] glow-btn text-center"
      >
        {copied ? 'Copied! Paste it into your CLAUDE.md.' : 'Copy the Template'}
      </button>
    </div>
  )
}
