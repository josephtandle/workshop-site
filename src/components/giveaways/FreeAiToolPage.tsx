'use client'

// ---------------------------------------------------------------------------
// FreeAiToolPage: shared body for the "Free AI Tools" giveaway batch
// (/giveaways/free-ai-<tool>). Structure follows the guardog template
// (particles, aurora, Cormorant hero, magnetic CTAs, quote, MastermindCTA,
// reactions, footer). Copy comes from src/lib/free-ai-tools.ts, which is
// generated from the batch's setup-notes.md, so the page and the delivery
// email always say the same thing.
//
// Each page.tsx renders this AND its own <GiveawayAutoModal slug="..."> so the
// giveaway structure tests can see the modal + slug on the page file itself.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'
import { formatStars, type FreeAiTool } from '@/lib/free-ai-tools'

const MASTERMIND_URL = 'https://www.mastermindshq.business'

// Latest featured quote on the MHQ homepage most relevant to "which AI tool to
// use for what" (PROCESS.md testimonial rule, pulled 2026-10-08).
const QUOTE = {
  text: 'Learning how to use AI in a proper way and knowing when to use what has saved me literally at least 20 to 25 hours a week.',
  name: 'Miia Nern',
  bio: 'Astrology educator and content creator, Berlin',
}

function useMagnet(strength = 0.3) {
  const ref = useRef<HTMLAnchorElement | null>(null)
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

export default function FreeAiToolPage({ tool }: { tool: FreeAiTool }) {
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const heroCta = useMagnet(0.28)
  const bottomCta = useMagnet(0.28)

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
      lenis = new Lenis({ duration: 1.1 }) as unknown as { raf: (t: number) => void; destroy: () => void }
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
    const particles: Particle[] = Array.from({ length: 60 }, () => ({
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `${tool.name}: free setup notes`,
    description: tool.intro,
    author: { '@type': 'Person', name: 'Joe Che', url: MASTERMIND_URL },
    publisher: { '@type': 'Organization', name: 'Business Automation Mastermind', url: MASTERMIND_URL },
    step: tool.steps.map((text, i) => ({ '@type': 'HowToStep', position: i + 1, text })),
    tool: [{ '@type': 'HowToTool', name: tool.name }],
    totalTime: 'PT10M',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
        .glow-card { transition: box-shadow 0.3s ease, border-color 0.3s ease; }
        .glow-card:hover {
          box-shadow: 0 0 28px rgba(139, 121, 212, 0.12), 0 0 0 1px rgba(139, 121, 212, 0.18);
          border-color: rgba(139, 121, 212, 0.22) !important;
        }
        .glow-btn { transition: box-shadow 0.2s ease, background-color 0.15s ease, transform 0.1s ease-out; }
        .glow-btn:hover { box-shadow: 0 0 32px rgba(139, 121, 212, 0.45), 0 0 60px rgba(139, 121, 212, 0.2); }
        .glow-btn-pink:hover { box-shadow: 0 0 32px rgba(245, 195, 198, 0.5), 0 0 60px rgba(245, 195, 198, 0.2); }
      `}</style>

      <div className="min-h-screen bg-[#151515] text-[#FCF4EB] overflow-x-hidden" data-free-ai-tool={tool.slug}>
        <canvas ref={particleCanvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />

        {/* HERO */}
        <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-8 pt-8">
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
                  Free AI Tools
                </span>
                <span className="text-[#FCF4EB]/20 text-[11px] sm:text-xs">·</span>
                <span className="text-[#FCF4EB]/40 text-[11px] sm:text-xs">setup notes by Joe Che</span>
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

          <div className="relative z-10 w-full max-w-4xl mx-auto px-2 sm:px-4">
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(2.4rem, 8vw, 4.6rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                paddingBottom: '0.05em',
              }}
            >
              {tool.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-5 text-[#FCF4EB]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 600,
                fontSize: 'clamp(1.35rem, 4.2vw, 2.4rem)',
                lineHeight: 1.2,
              }}
            >
              {tool.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.8 }}
              className="text-[#FCF4EB]/70 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8"
            >
              {tool.subline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="flex flex-col items-center gap-4"
            >
              <a
                ref={heroCta.ref}
                href={tool.toolUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseMove={heroCta.onMouseMove}
                onMouseLeave={heroCta.onMouseLeave}
                data-tool-link="primary"
                className="block w-full sm:inline-block sm:w-auto px-10 py-4 rounded-xl bg-[#8B79D4] hover:bg-[#6e5db8] text-[#FCF4EB] font-bold text-base active:scale-[0.98] glow-btn text-center"
              >
                {tool.primaryLabel} ↗
              </a>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#FCF4EB]/55">
                <span className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.10]">◆ Free to start</span>
                <a
                  href={tool.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-[#8B79D4]/35 hover:text-[#FCF4EB]/85 transition-colors"
                >
                  ★ {formatStars(tool.stars)} stars on GitHub
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="mt-8 flex items-center justify-center gap-2 text-[#FCF4EB]/35 text-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              <span>Scroll for my 3-step setup</span>
            </motion.div>
          </div>
        </section>

        {/* WHAT IT IS */}
        <section className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl px-5 py-7 sm:px-8 sm:py-9"
            style={{
              background: 'linear-gradient(135deg, rgba(139,121,212,0.08) 0%, rgba(157,143,224,0.04) 100%)',
              border: '1px solid rgba(139,121,212,0.18)',
            }}
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#9D8FE0]">What it is</span>
            <p className="mt-3 text-[#FCF4EB]/85 text-lg sm:text-xl leading-relaxed">{tool.intro}</p>
          </motion.div>
        </section>

        {/* 3 STEPS */}
        <section className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#8B79D4]/15 text-[#9D8FE0] border border-[#8B79D4]/25">
              Setup
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB]">Set it up in 3 steps</h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-3">
            {tool.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 sm:p-7"
              >
                <div className="text-4xl font-extrabold text-[#8B79D4]/40 mb-4 font-mono">0{i + 1}</div>
                <p className="text-[#FCF4EB]/80 text-[15px] leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW I'D USE IT */}
        <section className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-6 text-center">How I&apos;d use it</h2>
            <ul className="space-y-3">
              {tool.howIUse.map((tip, i) => (
                <li key={i} className="glow-card flex items-start gap-3 bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4">
                  <span className="text-[#9D8FE0] mt-0.5 flex-shrink-0">◆</span>
                  <span className="text-[#FCF4EB]/80 text-[15px] leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* GOOD TO KNOW */}
        <section className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl px-5 py-7 sm:px-8 sm:py-9"
            style={{
              background: 'linear-gradient(135deg, rgba(245,195,198,0.07) 0%, rgba(139,121,212,0.05) 100%)',
              border: '1px solid rgba(245,195,198,0.15)',
            }}
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#F5C3C6]/80">Good to know</span>
            <p className="mt-3 text-[#FCF4EB]/80 text-[15px] sm:text-base leading-relaxed">{tool.goodToKnow}</p>
          </motion.div>
        </section>

        {/* LINKS */}
        <section className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-6 text-center">Links</h2>
            <div className="space-y-3">
              {tool.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-tool-link="list"
                  className="glow-card flex items-center justify-between gap-4 bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 hover:bg-white/[0.06] transition-colors"
                >
                  <span className="min-w-0">
                    <span className="block text-[#FCF4EB] font-semibold text-[15px]">{link.label}</span>
                    <span className="block text-[#FCF4EB]/45 text-xs mt-0.5" style={{ overflowWrap: 'anywhere' }}>
                      {link.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </span>
                  </span>
                  <span className="text-[#9D8FE0] flex-shrink-0">↗</span>
                </a>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <a
                ref={bottomCta.ref}
                href={tool.toolUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseMove={bottomCta.onMouseMove}
                onMouseLeave={bottomCta.onMouseLeave}
                className="block w-full sm:inline-block sm:w-auto px-10 py-4 rounded-xl bg-[#8B79D4] hover:bg-[#6e5db8] text-[#FCF4EB] font-bold text-base active:scale-[0.98] glow-btn text-center"
              >
                {tool.primaryLabel} ↗
              </a>
            </div>
          </motion.div>
        </section>

        {/* QUOTE */}
        <section className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 py-10">
          <motion.blockquote
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-l-2 border-[#8B79D4] pl-5 sm:pl-6"
          >
            <p
              className="text-[#FCF4EB]/90 italic leading-snug"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(1.35rem, 3.6vw, 1.9rem)' }}
            >
              &ldquo;{QUOTE.text}&rdquo;
            </p>
            <footer className="mt-3 text-sm text-[#FCF4EB]/55">
              <span className="font-semibold text-[#FCF4EB]/80">{QUOTE.name}</span>, {QUOTE.bio}. Business Automation Mastermind member.
            </footer>
          </motion.blockquote>
        </section>

        <MastermindCTA />
        <MastermindReactionsSection />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto px-6 pb-14 text-center"
        >
          <p className="text-[#FCF4EB]/45 text-sm leading-relaxed italic">
            P.S. I don&apos;t make {tool.name} and nobody pays me to share it. It&apos;s just a free tool I think is worth ten minutes of your time. Try it this week and tell me what you used it for first.
          </p>
        </motion.div>

        <div className="relative z-10 text-center pb-10 flex flex-col items-center gap-1.5">
          <a
            href={MASTERMIND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FCF4EB]/30 text-xs uppercase tracking-widest hover:text-[#FCF4EB]/55 transition-colors"
          >
            Business Automation Mastermind
          </a>
          <span className="text-[#FCF4EB]/25 text-xs">Created by Joe Che</span>
        </div>
      </div>
    </>
  )
}

function MastermindCTA() {
  const magnet = useMagnet(0.28)
  return (
    <section className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 py-14">
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
          <h2 className="text-2xl sm:text-5xl font-bold text-[#FCF4EB] mb-4">Want to learn how to do this?</h2>
          <p className="text-xl sm:text-3xl font-bold mb-5">
            <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6] hover:opacity-80 transition-opacity">
              Join the Business Automation Mastermind
            </a>
          </p>
          <p className="text-[#FCF4EB]/60 max-w-xl mx-auto mb-8 leading-relaxed text-base sm:text-lg">
            A small, focused group of business owners who meet weekly to build real things, fast, leaving more time to serve clients and be with the people you love.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center mb-9">
            {['Small group, capped at 15', 'We meet weekly', 'Idea to live site in one session'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[#FCF4EB]/65 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F5C3C6] flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <a
            ref={magnet.ref}
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
