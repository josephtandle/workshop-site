'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'
import { copyWithConfetti } from '@/lib/copyWithConfetti'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MASTERMIND_URL = 'https://www.mastermindshq.business'
const GITHUB_URL = 'https://github.com/josephtandle/ray-dalio-council'

const INSTALL_COMMAND = `mkdir -p ~/.claude/skills && curl -fsSL https://raw.githubusercontent.com/josephtandle/ray-dalio-council/main/dalio-council.md -o ~/.claude/skills/dalio-council.md`

const SKILL_SECTIONS = [
  {
    name: 'The Five Scouts',
    count: 5,
    items: [
      { name: 'Optimist (w1.0)', desc: 'Makes the strongest case FOR proceeding. Upside, momentum, and the cost of inaction. Never raises risks -- that is not its job.' },
      { name: 'Skeptic (w1.0)', desc: 'Makes the strongest case AGAINST. What are you missing? Which assumption is wrong? What would cause this to fail in 90 days?' },
      { name: 'Strategist (w1.2)', desc: 'Evaluates long-term alignment. Is this the right move at the right time? Does it serve your core goals 6 to 12 months out?' },
      { name: 'Risk Analyst (w1.1)', desc: 'Identifies specific failure modes and worst-case scenarios. For each risk: how likely is it, and what is the blast radius if it hits?' },
      { name: 'Domain Expert (w1.3)', desc: 'Uses any context you provide to evaluate the decision from the ground level. If no context is given, it applies general business principles.' },
    ],
  },
  {
    name: 'Believability Weighting',
    count: 1,
    items: [
      { name: 'Not a vote count', desc: 'Three scouts saying PROCEED does not override one Domain Expert (w1.3) and one Strategist (w1.2) saying HOLD. The weights matter. Higher weight means more influence on the final verdict.' },
      { name: 'Weighted confidence', desc: 'Confidence is calculated as a weighted average across all scouts. A 9/10 from the Domain Expert moves the number more than a 9/10 from the Optimist.' },
      { name: 'Consensus vs split', desc: 'STRONG consensus means weighted confidence 6.0 or higher and 3 or more scouts agree. SPLIT means a close vote or low confidence, and the synthesizer names the dissent explicitly.' },
    ],
  },
  {
    name: 'The Verdict',
    count: 3,
    items: [
      { name: 'PROCEED', desc: 'The weighted council agrees this is the right move. Still includes the strongest objection so you go in with eyes open.' },
      { name: 'HOLD', desc: 'The risks or strategic misalignment outweigh the upside right now. Often comes with a specific condition: "Proceed when X is resolved."' },
      { name: 'INVESTIGATE', desc: 'You do not have enough information to decide well. The council flags exactly what you need to find out before calling it.' },
    ],
  },
  {
    name: 'Usage Modes',
    count: 2,
    items: [
      { name: 'Bare question', desc: '/dalio Should we launch the referral program this week? -- Five scouts argue it cold. No context needed. Works for any decision.' },
      { name: 'With context', desc: '/dalio context: "bootstrapped SaaS, 150 users, $5k MRR" -- Should we hire a salesperson? -- The Domain Expert uses your context. The other four still argue their fixed lens.' },
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
export default function RayDalioCouncilPage() {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(SKILL_SECTIONS.map((s) => s.name)),
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

  // CountUp animated stats
  useEffect(() => {
    const values = [5, 3, 1]
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
    name: 'Install the Ray Dalio Council Skill for Claude Code',
    description:
      'A free Claude Code skill that runs a Ray Dalio-style believability-weighted decision council. Five scouts argue your question. One synthesizer weighs them. You get PROCEED, HOLD, or INVESTIGATE.',
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
        name: 'Copy the install command',
        text: 'Copy the one-line install command from this page.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Run it in your terminal',
        text: 'Paste and run the command in your terminal. It clones the repo, copies the skill to your Claude skills directory, and cleans up.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Type /dalio in Claude Code',
        text: 'Open Claude Code and type /dalio followed by any decision. The council runs immediately.',
        position: 3,
      },
    ],
    tool: [
      { '@type': 'HowToTool', name: 'Claude Code' },
      { '@type': 'HowToTool', name: 'Terminal' },
    ],
    totalTime: 'PT2M',
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

          {/* Badge */}
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
              The Ray Dalio Council Skill for Claude Code
            </motion.h1>

            {/* Subheadline */}
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
              Five scouts. One verdict. Never second-guess a decision again.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.6 }}
              className="text-[#FCF4EB]/55 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-6"
            >
              Install it once in Claude Code. Type /dalio followed by any decision you are wrestling with. Five specialist scouts argue the question from different angles, a synthesizer weighs them by believability, and you get a clear PROCEED, HOLD, or INVESTIGATE verdict with a confidence score and the dissenting view.
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
                  Skill
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
              <span>Scroll to get the install command</span>
            </motion.div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 2: WHO IS RAY DALIO                                      */}
        {/* ================================================================ */}
        <section className="max-w-3xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl px-8 sm:px-12 py-10"
            style={{
              background: 'linear-gradient(135deg, rgba(124,105,199,0.07) 0%, rgba(245,195,198,0.05) 100%)',
              border: '1px solid rgba(124,105,199,0.14)',
            }}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#9D8FE0] mb-5">
              Why Ray Dalio
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#FCF4EB] mb-5 leading-snug">
              Ray Dalio founded Bridgewater Associates in 1975 and built it into the largest hedge fund in the world, managing over $150 billion at its peak.
            </h2>
            <div className="space-y-4 text-[#FCF4EB]/55 text-base leading-relaxed">
              <p>
                He ran it for nearly 50 years. In that time, he correctly called the 2008 financial crisis, survived multiple market collapses, and compounded returns for clients in ways that most funds never achieve.
              </p>
              <p>
                His book <em className="text-[#FCF4EB]/75">Principles</em> lays out the system behind all of it. The core idea is called believability weighting: not all opinions deserve equal weight. The people with the strongest track record in a given domain should carry more influence over a decision than those without one.
              </p>
              <p>
                He also believed you should never trust your own thinking unchallenged. The best decisions come from stress-testing your position against people who genuinely disagree with you, each arguing their strongest case, before you commit.
              </p>
              <p className="text-[#FCF4EB]/75 font-medium">
                That is the exact system this skill runs. Five specialists. Fixed lenses. Weighted synthesis. One verdict.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 3: HOW IT WORKS                                          */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              Set up once. Never make a decision alone again.
            </h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { step: '01', title: 'Copy the install command', body: 'One line. Copy it from the box below.' },
              { step: '02', title: 'Run it in your terminal', body: 'Paste it in your terminal and run. It clones the repo, drops the skill file in the right place, and cleans up. Done in seconds.' },
              { step: '03', title: 'Type /dalio [your question]', body: 'Open Claude Code and type /dalio followed by any decision. The council convenes, argues the question, and delivers a verdict immediately.' },
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
        {/* SECTION 4: MASTERMIND CTA                                        */}
        {/* ================================================================ */}
        <MastermindCTA />

        {/* ================================================================ */}
        {/* SECTION 5: PARTICIPANT REACTIONS                                 */}
        {/* ================================================================ */}
        <MastermindReactionsSection />

        {/* ================================================================ */}
        {/* SECTION 6: THE INSTALL COMMAND                                   */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
                The Skill
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] mb-4">
                Copy. Paste. Done.
              </h2>
              <p className="text-[#FCF4EB]/45 max-w-xl mx-auto leading-relaxed">
                In the{' '}
                <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="text-[#9D8FE0] hover:text-[#BDB3E8] transition-colors">
                  Business Automation Mastermind
                </a>
                , this is the council we run before every major program decision. One command in your terminal and it is ready in Claude Code.
              </p>
            </div>

            {/* Install command block */}
            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.08] border-l-2 border-l-[#7C69C7]">
              <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                <span className="text-xs text-[#FCF4EB]/40 font-mono">Terminal</span>
                <InlineCopyButton text={INSTALL_COMMAND} />
              </div>
              <pre
                className="p-5 text-sm font-mono leading-[1.75] text-[#FCF4EB]/82"
                style={{ background: '#0d0d0d', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
              >
                <code>{INSTALL_COMMAND}</code>
              </pre>
            </div>

            {/* Big copy button */}
            <InstallCopyButton command={INSTALL_COMMAND} />

            <p className="text-[#FCF4EB]/20 text-[11px] text-center mt-5 max-w-md mx-auto leading-relaxed">
              Requires Git. Copies the skill to <code className="font-mono">~/.claude/skills/dalio-council.md</code>. If your Claude Code skills live somewhere else,{' '}
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-[#9D8FE0]/60 hover:text-[#9D8FE0] transition-colors underline underline-offset-2">
                check the README
              </a>{' '}
              for the manual install path.
            </p>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 7: STATS                                                  */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pt-6 pb-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { idx: 0, label: 'specialist scouts argue every decision' },
              { idx: 1, label: 'possible verdicts: PROCEED, HOLD, INVESTIGATE' },
              { idx: 2, label: 'command to install' },
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
              Everything inside this skill
            </h2>
            <p className="text-[#FCF4EB]/35 text-sm max-w-lg mx-auto">
              Five scouts with fixed lenses, a believability weighting system, and a synthesizer that produces one clean verdict. Modeled on how Ray Dalio ran decisions at Bridgewater.
            </p>
          </motion.div>

          <div className="space-y-3">
            {SKILL_SECTIONS.map((section, i) => {
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
            P.S. This is the same council that runs inside Joe&apos;s AI operating system before every major Mastermind decision. We named it after Ray Dalio because that is exactly where the idea came from.
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
// Big install copy button (with confetti + GitHub star nudge)
// ---------------------------------------------------------------------------
function InstallCopyButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const magnet = useMagnet(0.28)

  const handleCopy = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await copyWithConfetti(command, event)
      setCopied(true)
      window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')
      setTimeout(() => setCopied(false), 3500)
    } catch { /* noop */ }
  }, [command])

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <button
        ref={magnet.ref as React.RefObject<HTMLButtonElement>}
        onClick={handleCopy}
        onMouseMove={magnet.onMouseMove}
        onMouseLeave={magnet.onMouseLeave}
        className="block w-full sm:inline-block sm:w-auto px-10 py-4 rounded-xl bg-[#7C69C7] hover:bg-[#6e5db8] text-[#FCF4EB] font-bold text-base active:scale-[0.98] glow-btn text-center"
      >
        {copied ? 'Copied! Run it in your terminal.' : 'Copy Install Command'}
      </button>
      {copied && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#FCF4EB]/40 text-xs text-center"
        >
          We opened the GitHub repo too. A star helps others find it.
        </motion.p>
      )}
    </div>
  )
}
