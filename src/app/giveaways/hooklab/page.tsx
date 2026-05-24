'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'
import GiveawayEmailModal from '@/components/giveaways/GiveawayEmailModal'
import { copyWithConfetti } from '@/lib/copyWithConfetti'
import { INSTALL_PROMPT } from './content'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MASTERMIND_URL = 'https://www.mastermindshq.business'
const MANYCHAT_KEYWORD = 'hooklab'

const MODES = [
  {
    id: '01',
    name: 'Standard',
    body: 'Use your brand voice and this week\'s topic to generate 15 candidates, score every one, then surface the 5 strongest hooks with 2 winners.',
  },
  {
    id: '02',
    name: 'Reverse Engineer',
    body: 'Pull from research accounts in your niche, deconstruct the hooks that are already working, then rebuild them in your voice.',
  },
  {
    id: '03',
    name: 'CTA First',
    body: 'Start with a giveaway, lead magnet, or offer. HookLab works backwards so the hook points to the action you actually want.',
  },
  {
    id: '04',
    name: 'Punch Script',
    body: 'Generate two short 15-25 second scripts built for the first three seconds, saves, shares, and fast filming.',
  },
]

const SCORE_AXES = [
  { name: 'Concreteness', desc: 'Specific details beat vague claims. A hook with a number, name, or real scenario outscores a generic promise every time.' },
  { name: 'Mechanism', desc: 'There has to be a new or unusual angle. If the viewer has heard the same thing before, the thumb moves.' },
  { name: 'Voice Fidelity', desc: 'Sounds like you wrote it, not a template. HookLab reads your brand voice file before generating.' },
  { name: 'Self-Recognition', desc: 'The viewer has to see themselves in it. The best hooks make someone think "that is literally me."' },
  { name: 'Thumb Stop', desc: 'Pattern interrupt. The first two words have to give someone a reason not to scroll past.' },
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
export default function HookLabPage() {
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const statRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Install HookLab for Claude Code',
    description:
      'A free Claude Code skill that generates scored Instagram Reel hooks from your brand voice, niche research, or a specific CTA.',
    author: { '@type': 'Person', name: 'Joe Che', url: 'https://www.mastermindshq.business' },
    publisher: { '@type': 'Organization', name: 'Business Automation Mastermind', url: 'https://www.mastermindshq.business' },
    step: [
      { '@type': 'HowToStep', name: 'Copy the install command', text: 'Copy the one-line install command from this page.', position: 1 },
      { '@type': 'HowToStep', name: 'Run it in your terminal', text: 'Paste and run the command. It installs HookLab, creates your personal templates, registers the Claude Code skill, and installs the research dependencies.', position: 2 },
      { '@type': 'HowToStep', name: 'Type /hooklab in Claude Code', text: 'Fill in your brand voice, research accounts, and weekly topic, then run /hooklab in Claude Code.', position: 3 },
    ],
    tool: [{ '@type': 'HowToTool', name: 'Claude Code' }, { '@type': 'HowToTool', name: 'Terminal' }],
    totalTime: 'PT4M',
  }

  // Load Cormorant Garamond
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
      lenis = new Lenis({ duration: 1.1 }) as unknown as { raf: (t: number) => void; destroy: () => void }
      const raf = (time: number) => { lenis!.raf(time); rafId = requestAnimationFrame(raf) }
      rafId = requestAnimationFrame(raf)
    })()
    return () => { if (lenis) lenis.destroy(); cancelAnimationFrame(rafId) }
  }, [])

  // Canvas falling particles
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

  // CountUp animated stats
  useEffect(() => {
    const values = [15, 5, 2]
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
            className="relative z-10 mb-6 flex justify-center sm:absolute sm:top-10 sm:left-0 sm:right-0 sm:mb-0"
          >
            <div className="p-[1px] rounded-full bg-gradient-to-r from-[#8B79D4] to-[#F5C3C6] inline-block">
              <div className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#151515] flex items-center gap-1.5 sm:gap-2 whitespace-nowrap max-w-[92vw]">
                <span className="text-[#9D8FE0] text-[11px] sm:text-xs">✦</span>
                <span className="font-semibold text-[11px] sm:text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]">
                  Free
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
              className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]"
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
              HookLab: Instagram Reel Hook Generator
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
                fontSize: 'clamp(1.1rem, 3.2vw, 2.6rem)',
                lineHeight: 1.15,
              }}
            >
              Generate hooks that sound like you and point to a real action.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.6 }}
              className="text-[#FCF4EB]/55 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-6"
            >
              HookLab reads your brand voice, studies what is working in your niche, scores every hook on five axes, and gives you scripts you can film the same day.
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
              </div>
            </motion.div>

            {/* Comment keyword */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.9 }}
              className="text-[#FCF4EB]/22 text-xs uppercase tracking-widest mb-5"
            >
              Comment word: <span className="text-[#BDB3E8]">{MANYCHAT_KEYWORD}</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.0 }}
              className="flex items-center justify-center gap-2 text-[#FCF4EB]/22 text-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              <span>Scroll to get the install prompt</span>
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
              Install once. Run it before every post.
            </h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { step: '01', title: 'Copy the install prompt', body: 'One prompt handles everything. Copy it from the box below and paste it directly into Claude Code.' },
              { step: '02', title: 'Let Claude Code install it', body: 'Claude reads the prompt and creates the /hooklab skill file in your Claude Code setup automatically. Nothing to configure.' },
              { step: '03', title: 'Type /hooklab in Claude Code', body: 'Fill in your brand voice, research accounts, and weekly topic. HookLab generates 15 hooks, scores every one, and surfaces 5 winners.' },
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
        {/* SECTION 3: FOUR MODES                                            */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(124,105,199,0.07) 0%, rgba(157,143,224,0.04) 100%)',
              border: '1px solid rgba(124,105,199,0.15)',
            }}
          >
            <div className="px-5 py-8 sm:px-8 sm:py-10">
              <div className="text-center mb-8">
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
                  Four ways to run it
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
                  Pick the path that matches the post.
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {MODES.map((mode, i) => (
                  <motion.div
                    key={mode.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-xl p-6"
                  >
                    <div className="text-3xl font-extrabold text-[#7C69C7]/22 mb-4 font-mono">{mode.id}</div>
                    <h3 className="text-[#FCF4EB] font-bold text-base mb-2">{mode.name}</h3>
                    <p className="text-[#FCF4EB]/44 text-sm leading-relaxed">{mode.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 4: SCORING SYSTEM                                        */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              Scored, not guessed.
            </h2>
            <p className="text-[#FCF4EB]/35 text-sm max-w-lg mx-auto mt-3">
              Every hook gets a 50-point read across five axes. The two strongest get flagged as winners.
            </p>
          </motion.div>
          <div className="space-y-3">
            {SCORE_AXES.map((axis, i) => (
              <motion.div
                key={axis.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-xl px-6 py-5 flex items-start gap-4"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#7C69C7] mt-[7px] flex-shrink-0" />
                <div>
                  <span className="text-[#9D8FE0] text-sm font-bold">{axis.name}</span>
                  <p className="text-[#FCF4EB]/34 text-xs leading-relaxed mt-1">{axis.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 5: STATS                                                 */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pt-6 pb-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { idx: 0, label: 'hook candidates generated per run', suffix: '' },
              { idx: 1, label: 'scoring axes, 10 points each', suffix: '' },
              { idx: 2, label: 'winners surfaced automatically', suffix: '' },
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
        {/* SECTION 6: INSTALL PROMPT                                        */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
                Install Prompt
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] mb-4">
                Copy. Paste into Claude Code. Done.
              </h2>
              <p className="text-[#FCF4EB]/45 max-w-xl mx-auto leading-relaxed">
                Paste this prompt into{' '}
                <span className="text-[#9D8FE0]">Claude Code</span> and it will create the{' '}
                <span className="text-[#9D8FE0] font-mono">/hooklab</span> skill file for you automatically.
              </p>
            </div>

            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.08]" style={{ borderLeftWidth: 2, borderLeftColor: '#7C69C7' }}>
              <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                <span className="text-xs text-[#FCF4EB]/40 font-mono">Claude Code prompt</span>
                <InlineCopyButton text={INSTALL_PROMPT} onAfterCopy={() => setEmailModalOpen(true)} />
              </div>
              <pre
                className="p-3 sm:p-5 text-[12px] sm:text-sm font-mono leading-[1.7] text-[#FCF4EB]/82 max-h-64 overflow-y-auto"
                style={{ background: '#0d0d0d', whiteSpace: 'pre-wrap', wordBreak: 'normal', overflowWrap: 'anywhere' }}
              >
                <code>{INSTALL_PROMPT}</code>
              </pre>
            </div>

            <InstallCopyButton onAfterCopy={() => setEmailModalOpen(true)} />
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 7: MASTERMIND CTA                                        */}
        {/* ================================================================ */}
        <MastermindCTA />

        {/* ================================================================ */}
        {/* SECTION 8: PARTICIPANT REACTIONS                                 */}
        {/* ================================================================ */}
        <MastermindReactionsSection />

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

      <GiveawayEmailModal
        slug={MANYCHAT_KEYWORD}
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        headingOverride="Would you like future skills?"
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
function InlineCopyButton({ text, onAfterCopy }: { text: string; onAfterCopy?: () => void }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await copyWithConfetti(text, event)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      onAfterCopy?.()
    } catch { /* noop */ }
  }, [text, onAfterCopy])
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
// Big install copy button
// ---------------------------------------------------------------------------
function InstallCopyButton({ onAfterCopy }: { onAfterCopy?: () => void }) {
  const [copied, setCopied] = useState(false)
  const magnet = useMagnet(0.28)

  const handleCopy = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await copyWithConfetti(INSTALL_PROMPT, event)
      setCopied(true)
      setTimeout(() => setCopied(false), 3500)
      onAfterCopy?.()
    } catch { /* noop */ }
  }, [onAfterCopy])

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <button
        ref={magnet.ref as React.RefObject<HTMLButtonElement>}
        onClick={handleCopy}
        onMouseMove={magnet.onMouseMove}
        onMouseLeave={magnet.onMouseLeave}
        className="block w-full sm:inline-block sm:w-auto px-10 py-4 rounded-xl bg-[#7C69C7] hover:bg-[#6e5db8] text-[#FCF4EB] font-bold text-base active:scale-[0.98] glow-btn text-center"
      >
        {copied ? 'Copied! Paste it into Claude Code.' : 'Copy install prompt'}
      </button>
    </div>
  )
}
