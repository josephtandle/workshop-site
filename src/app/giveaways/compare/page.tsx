'use client'

import { Fragment, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'

const MASTERMIND_URL = 'https://www.mastermindshq.business'
const CLAUDE_DESIGN_URL = 'https://www.anthropic.com/news/claude-design-anthropic-labs'

type Cell = 'yes' | 'partial' | 'no' | string

interface Row {
  feature: string
  terminal: Cell
  desktop: Cell
  cowork: Cell
  chat: Cell
}

interface RowGroup {
  title: string
  rows: Row[]
}

interface Product {
  key: 'terminal' | 'desktop' | 'cowork' | 'chat'
  name: string
  sub: string
  glyph: string
  bestFor: string
  isPowerLane?: boolean
}

const products: Product[] = [
  {
    key: 'terminal',
    name: 'Terminal',
    sub: 'Claude Code CLI',
    glyph: '✦',
    bestFor: 'Full system control, automation, orchestration, building',
    isPowerLane: true,
  },
  {
    key: 'desktop',
    name: 'Code Desktop',
    sub: 'Desktop app',
    glyph: '◆',
    bestFor: 'Visual coding with full project context',
  },
  {
    key: 'cowork',
    name: 'Cowork',
    sub: 'Desktop app',
    glyph: '◇',
    bestFor: 'Document work, research synthesis, file tasks without code',
  },
  {
    key: 'chat',
    name: 'Claude Chat',
    sub: 'claude.ai',
    glyph: '◈',
    bestFor: 'Questions, writing, brainstorming',
  },
]

const rowGroups: RowGroup[] = [
  {
    title: 'Overview',
    rows: [
      {
        feature: 'Interface',
        terminal: 'Command line',
        desktop: 'Visual app — file tree, plan sidebar, diff viewer',
        cowork: 'Tasks tab GUI',
        chat: 'Browser or app chat',
      },
      {
        feature: 'Platform',
        terminal: 'Mac, Windows, Linux',
        desktop: 'Mac, Windows',
        cowork: 'macOS only',
        chat: 'Any browser or device',
      },
      {
        feature: 'Available on',
        terminal: 'All paid plans',
        desktop: 'All paid plans',
        cowork: 'All paid plans',
        chat: 'Free + all paid plans',
      },
    ],
  },
  {
    title: 'File & system access',
    rows: [
      {
        feature: 'File access',
        terminal: 'Full, unrestricted',
        desktop: 'Full, unrestricted',
        cowork: 'Sandboxed to approved folders',
        chat: 'Upload only',
      },
      { feature: 'Shell commands & scripts', terminal: 'Yes — any command', desktop: 'yes', cowork: 'no', chat: 'no' },
      { feature: 'Project navigation (cd)', terminal: 'Any path instantly', desktop: 'Via GUI selector', cowork: 'no', chat: 'no' },
      { feature: 'Scripting & piping', terminal: 'Full shell automation', desktop: 'no', cowork: 'no', chat: 'no' },
      { feature: 'Git & version control', terminal: 'yes', desktop: 'yes', cowork: 'no', chat: 'no' },
    ],
  },
  {
    title: 'Integrations',
    rows: [
      {
        feature: 'MCP server integrations',
        terminal: 'Yes — full CLI config + scopes',
        desktop: 'Yes — GUI approval flow',
        cowork: 'Separate plugin system',
        chat: 'no',
      },
      {
        feature: 'Pre-built plugins',
        terminal: 'no',
        desktop: 'no',
        cowork: '11+ (HubSpot, Jira, Slack, Notion, Figma, Box…)',
        chat: 'no',
      },
      {
        feature: 'CLAUDE.md project context',
        terminal: 'Loads on session start',
        desktop: 'Loads on session start',
        cowork: 'no',
        chat: 'no',
      },
    ],
  },
  {
    title: 'Automation & power',
    rows: [
      {
        feature: 'Hooks (auto-triggers)',
        terminal: 'Full — shell-level, every event',
        desktop: 'Basic event hooks only',
        cowork: 'no',
        chat: 'no',
      },
      { feature: 'Skills & pipelines', terminal: 'Full chaining + pipelines', desktop: 'Single invocations only', cowork: 'no', chat: 'no' },
      { feature: 'Parallel background agents', terminal: 'Unlimited', desktop: 'Limited', cowork: 'no', chat: 'no' },
      {
        feature: 'Runs unattended overnight',
        terminal: 'Yes — tmux, nohup, SSH',
        desktop: 'no',
        cowork: 'Yes — Anthropic cloud',
        chat: 'no',
      },
      { feature: 'CI/CD pipeline integration', terminal: 'Yes — fully scriptable', desktop: 'no', cowork: 'no', chat: 'no' },
      {
        feature: 'Complex routing & dispatch',
        terminal: 'Scripts, JSON dispatch, multi-provider',
        desktop: 'no',
        cowork: 'no',
        chat: 'no',
      },
    ],
  },
]

const notes = [
  {
    title: 'What “partial” means for Hooks & Skills on Desktop',
    body: 'The Desktop app fires basic event hooks and can invoke individual skills. What it cannot do is run full pipeline sequences, chaining skills in order, passing outputs between them, and running unattended. The shell-level hooks that fire below Claude do not work the same way. Partial means interactive use only.',
  },
  {
    title: 'MCP servers on Desktop, not just yes / yes',
    body: 'Both Desktop and Terminal use the same three permission layers (auto-grant, ask every time, block) and the same three scopes (local project, team-shared via version control, all your projects). The Desktop shows a GUI approval dialog the first time a project-scoped server connects. The Terminal gives you fine-grained control via flags, env vars, per-server timeouts, and push channels the GUI does not expose.',
  },
  {
    title: 'Cowork and your local files',
    body: 'Cowork reads files in approved folders. What it cannot do is interact with the scripts or dispatch systems behind those files. If a folder connects to an indexing script, an automation workflow, or a routing layer, Cowork sees the raw files only. It reads documents. It does not run systems.',
  },
  {
    title: 'CLAUDE.md is not a product',
    body: 'It is a markdown file in your project directory that Claude Code reads at session start. Both Desktop and Terminal read it. It is the instruction layer. The Terminal is the execution layer that acts on those instructions at full power.',
  },
]

function useMagnet(strength = 0.28) {
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

function CellContent({ value }: { value: Cell }) {
  if (value === 'no') {
    return <span className="text-[#FCF4EB]/35 font-medium">No</span>
  }
  if (value === 'yes') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[#FCF4EB] font-semibold">
        <span className="text-[#9D8FE0]">✦</span>
        <span>Yes</span>
      </span>
    )
  }
  if (value === 'partial') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[#FCF4EB]/80 font-medium">
        <span className="text-[#F5C3C6]">◐</span>
        <span>Partial</span>
      </span>
    )
  }
  return <span className="text-[#FCF4EB]/85 leading-relaxed">{value}</span>
}

export default function ComparePage() {
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)

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
        .glow-btn { transition: box-shadow 0.2s ease, background-color 0.15s ease, transform 0.1s ease-out; }
        .glow-btn:hover { box-shadow: 0 0 32px rgba(124, 105, 199, 0.45), 0 0 60px rgba(124, 105, 199, 0.2); }
        .glow-btn-pink:hover { box-shadow: 0 0 32px rgba(245, 195, 198, 0.5), 0 0 60px rgba(245, 195, 198, 0.2); }
      `}</style>

      <div className="min-h-screen bg-[#151515] text-[#FCF4EB] overflow-x-hidden">

        <canvas
          ref={particleCanvasRef}
          className="fixed inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        />

        {/* ============================================================ */}
        {/* SECTION 1: HERO                                              */}
        {/* ============================================================ */}
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

          <div className="relative z-10 w-full max-w-3xl mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]"
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
              The 5 Versions of Claude
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mb-5 text-[#FCF4EB]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 600,
                fontSize: 'clamp(1.1rem, 3.2vw, 2.2rem)',
                lineHeight: 1.2,
              }}
            >
              And why most people are using the weakest one.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.6 }}
              className="text-[#FCF4EB]/55 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8"
            >
              Most people discover Claude through the chat interface and stop there. There are five
              distinct products. Four sit in the table below, where the terminal is the power layer and
              everything else is built on top of it or a subset of it. The fifth is a different category,
              covered after the table.
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
              <span>Scroll for the full comparison</span>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: FEATURED QUOTE                                    */}
        {/* ============================================================ */}
        <section className="relative max-w-3xl mx-auto px-6 py-12">
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
              “I’ve been playing around with just using Terminal and Claude Code to do lead gen, follow-up
              leads, and send them messages.”
            </blockquote>
            <figcaption className="mt-4 text-[#FCF4EB]/45 text-sm uppercase tracking-widest">
              Richard · Session 6, Business Automation Mastermind
            </figcaption>
          </motion.figure>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: COMPARISON TABLE                                  */}
        {/* ============================================================ */}
        <section className="relative max-w-6xl mx-auto px-6 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
              Side-by-side comparison
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
              What each version can and cannot do, line by line
            </h2>
            <p className="text-[#FCF4EB]/45 max-w-xl mx-auto leading-relaxed">
              Read the columns left to right, most powerful to least.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[28px] border border-[#FCF4EB]/[0.10] bg-[linear-gradient(180deg,rgba(124,105,199,0.10),rgba(252,244,235,0.03))] p-4 sm:p-6"
          >
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-transparent px-3 sm:px-4 py-4 text-xs uppercase tracking-widest text-[#FCF4EB]/45 font-semibold align-bottom">
                      Feature
                    </th>
                    {products.map((p) => (
                      <th key={p.key} className="px-3 sm:px-4 py-4 align-bottom border-l border-[#FCF4EB]/[0.06]">
                        <div
                          className={
                            p.isPowerLane
                              ? 'rounded-xl border border-[#9D8FE0]/35 bg-[rgba(124,105,199,0.18)] px-3 py-2.5'
                              : 'rounded-xl border border-[#FCF4EB]/[0.10] bg-[rgba(252,244,235,0.04)] px-3 py-2.5'
                          }
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={p.isPowerLane ? 'text-[#9D8FE0]' : 'text-[#7C69C7]'} aria-hidden>
                              {p.glyph}
                            </span>
                            <span className="text-[#FCF4EB] font-bold text-sm">{p.name}</span>
                          </div>
                          <p className="text-[10px] uppercase tracking-widest text-[#FCF4EB]/45">{p.sub}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="sticky left-0 bg-[#151515]/95 backdrop-blur-sm px-3 sm:px-4 py-4 text-sm text-[#FCF4EB] font-semibold align-top border-b border-[#FCF4EB]/[0.08] min-w-[180px]"
                    >
                      Best for
                    </th>
                    {products.map((p) => (
                      <td
                        key={p.key}
                        className={
                          p.isPowerLane
                            ? 'px-3 sm:px-4 py-4 text-sm align-top border-b border-[#FCF4EB]/[0.08] border-l border-[#FCF4EB]/[0.05] bg-[rgba(124,105,199,0.05)] min-w-[180px] text-[#FCF4EB]/90 leading-relaxed'
                            : 'px-3 sm:px-4 py-4 text-sm align-top border-b border-[#FCF4EB]/[0.08] border-l border-[#FCF4EB]/[0.05] min-w-[180px] text-[#FCF4EB]/85 leading-relaxed'
                        }
                      >
                        {p.bestFor}
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rowGroups.map((group) => (
                    <Fragment key={group.title}>
                      <tr>
                        <th
                          colSpan={5}
                          scope="colgroup"
                          className="px-3 sm:px-4 pt-7 pb-2 text-[11px] uppercase tracking-[0.22em] text-[#7C69C7] font-semibold border-b border-[#FCF4EB]/[0.08]"
                        >
                          {group.title}
                        </th>
                      </tr>
                      {group.rows.map((row, idx) => (
                        <tr
                          key={`${group.title}-${row.feature}`}
                          className={idx % 2 === 0 ? 'bg-[rgba(252,244,235,0.015)]' : ''}
                        >
                          <td className="sticky left-0 bg-[#151515]/95 backdrop-blur-sm px-3 sm:px-4 py-4 text-sm text-[#FCF4EB] font-medium align-top border-b border-[#FCF4EB]/[0.05] min-w-[180px]">
                            {row.feature}
                          </td>
                          {(['terminal', 'desktop', 'cowork', 'chat'] as const).map((key) => (
                            <td
                              key={key}
                              className={
                                key === 'terminal'
                                  ? 'px-3 sm:px-4 py-4 text-sm align-top border-b border-[#FCF4EB]/[0.05] border-l border-[#FCF4EB]/[0.05] bg-[rgba(124,105,199,0.05)] min-w-[180px]'
                                  : 'px-3 sm:px-4 py-4 text-sm align-top border-b border-[#FCF4EB]/[0.05] border-l border-[#FCF4EB]/[0.05] min-w-[180px]'
                              }
                            >
                              <CellContent value={row[key]} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 px-1 text-xs text-[#FCF4EB]/55">
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#9D8FE0]">✦</span> Yes, fully supported
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#F5C3C6]">◐</span> Partial, with real limits
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#FCF4EB]/40">No</span> not supported
              </span>
            </div>
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: THE FINE PRINT (4 NOTES)                          */}
        {/* ============================================================ */}
        <section className="relative max-w-3xl mx-auto px-6 pt-10 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
              The fine print
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              Four notes that change how you read the table
            </h2>
          </motion.div>

          <div className="space-y-10">
            {notes.map((note, index) => (
              <motion.div
                key={note.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-[#FCF4EB] mb-3 flex items-start gap-3">
                  <span className="text-[#7C69C7] mt-1 flex-shrink-0">◆</span>
                  <span>{note.title}</span>
                </h3>
                <p className="text-[#FCF4EB]/72 leading-relaxed text-lg ml-7">{note.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 5: THE 5TH CLAUDE — CLAUDE DESIGN                    */}
        {/* ============================================================ */}
        <section className="relative max-w-3xl mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[28px] border border-[#FCF4EB]/[0.10] bg-[linear-gradient(180deg,rgba(124,105,199,0.10),rgba(252,244,235,0.03))] p-6 sm:p-8 lg:p-10"
          >
            <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-[0.22em] mb-3">
              The 5th Claude
            </p>
            <h2
              className="text-[#FCF4EB] mb-5"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                lineHeight: 1.2,
              }}
            >
              <a
                href={CLAUDE_DESIGN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6] hover:opacity-80 transition-opacity"
              >
                Claude Design
              </a>
            </h2>
            <div className="space-y-5 text-[#FCF4EB]/75 leading-relaxed text-lg">
              <p>
                Launched April 2026 by Anthropic Labs, Claude Design is a separate product built specifically
                for visual creation. You describe what you need, a slide deck, a one-pager, a prototype, a
                marketing asset, and Claude builds it, then refines it through conversation, inline comments,
                and live adjustment controls.
              </p>
              <p>
                What makes it different from everything else in this list: it reads your existing codebase and
                design files to apply your actual brand system automatically. It accepts images, documents
                (DOCX, PPTX, XLSX), and web captures as input. When you are done, you export to Canva, PDF,
                PPTX, or standalone HTML, or hand the finished design directly to Claude Code for
                implementation.
              </p>
              <p>
                It does not connect to your file system the way Code does, and it has no automation or
                scripting layer. It is a purpose-built creative tool, not a power tool. For founders,
                marketers, and product teams who need polished visual output without a designer, it fills a
                gap none of the four above were built for.
              </p>
              <p className="text-[#FCF4EB]/55 text-base">Available on Pro, Max, Team, and Enterprise plans.</p>
            </div>
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 6: MASTERMIND CTA                                    */}
        {/* ============================================================ */}
        <MastermindCTA />

        {/* ============================================================ */}
        {/* SECTION 7: PARTICIPANT REACTIONS                             */}
        {/* ============================================================ */}
        <MastermindReactionsSection />

        {/* ============================================================ */}
        {/* P.S. NOTE                                                    */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6 pt-10 pb-16 text-center"
        >
          <p className="text-[#FCF4EB]/22 text-sm leading-relaxed italic">
            P.S. The chat window is the door. The terminal is the room behind it where the real work
            actually happens. The gap between them is the whole point of this page.
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
    </>
  )
}

function MastermindCTA() {
  const magnet = useMagnet(0.28)

  return (
    <section className="relative max-w-5xl mx-auto px-6 py-14">
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
            <a
              href={MASTERMIND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6] hover:opacity-80 transition-opacity"
            >
              Join the Business Automation Mastermind
            </a>
          </p>

          <p className="text-[#FCF4EB]/52 max-w-xl mx-auto mb-8 leading-relaxed text-base sm:text-lg">
            A small, focused group of business owners who meet weekly to build real things, fast, leaving
            more time to serve clients and be with the people you love.
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
