'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'
import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'
import LeadMachineForm from './LeadMachineForm'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MASTERMIND_URL = 'https://www.mastermindshq.business'
const GITHUB_URL = 'https://github.com/josephtandle/lead-machine'

const HOW_IT_WORKS = [
  { step: '01', title: 'Download and unzip', body: 'One zip file. Unzip it anywhere on your computer.' },
  { step: '02', title: 'Open the prompt file', body: 'Open PASTE-INTO-CHATGPT-OR-CLAUDE.txt inside the folder, select all, and copy.' },
  { step: '03', title: 'Paste it and send', body: 'Paste into ChatGPT or Claude and hit send. It asks one thing first: cold outreach, warm network, or both. Cold runs first.' },
]

const WHAT_YOU_GET = [
  { icon: '◆', title: '25 real businesses', body: 'Numbered list: name, what they do, why they fit, and a real public way to reach them. Not made up, not guessed.' },
  { icon: '✦', title: 'Say "more" for a fresh 25', body: 'No repeats. Keep going as long as it is useful to you.' },
  { icon: '◎', title: 'Warm network mode', body: 'Works from your own LinkedIn and inbox and drafts first messages in your voice. You approve and send every one yourself. It never sends anything.' },
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
export default function LeadMachinePage() {
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Get 25 real leads with the Lead Machine',
    description:
      'Paste one prompt into ChatGPT or Claude and get 25 real businesses that fit who you serve, each with a real public way to reach them.',
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
      { '@type': 'HowToStep', name: 'Download and unzip', text: 'Download the Lead Machine and unzip it.', position: 1 },
      { '@type': 'HowToStep', name: 'Open the prompt file', text: 'Open PASTE-INTO-CHATGPT-OR-CLAUDE.txt and copy it.', position: 2 },
      { '@type': 'HowToStep', name: 'Paste it and send', text: 'Paste into ChatGPT or Claude and send.', position: 3 },
    ],
    tool: [
      { '@type': 'HowToTool', name: 'ChatGPT' },
      { '@type': 'HowToTool', name: 'Claude' },
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
                <span className="font-semibold text-[11px] sm:text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]">
                  Free
                </span>
                <span className="hidden sm:inline text-[#FCF4EB]/32 text-xs">from Joe Che&apos;s</span>
                <a
                  href={MASTERMIND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FCF4EB]/60 text-[11px] sm:text-xs font-medium hover:text-[#FCF4EB]/90 transition-colors"
                >
                  <span className="sm:hidden">AI class</span>
                  <span className="hidden sm:inline">AI class</span>
                </a>
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
                fontSize: 'clamp(2.2rem, 7vw, 4.6rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                paddingBottom: '0.05em',
              }}
            >
              The Lead Machine
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.4 }}
              className="text-[#FCF4EB]/55 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8"
            >
              Paste one prompt into ChatGPT or Claude and get 25 real businesses that fit who you serve, each with a real public way to reach them. Free, from Joe Che&apos;s AI class.
            </motion.p>

            {/* Works in strip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-8"
            >
              <span className="text-[#FCF4EB]/28 text-xs uppercase tracking-widest">Works in</span>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] border border-[#8B79D4]/35 transition-all duration-200">
                <span className="text-[#9D8FE0] text-sm">◆</span>
                <span className="text-[#FCF4EB]/75 text-sm font-medium">ChatGPT</span>
              </div>
              <span className="text-[#FCF4EB]/28 text-xs">+</span>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.10] transition-all duration-200">
                <span className="text-[#FCF4EB]/50 text-sm">✦</span>
                <span className="text-[#FCF4EB]/75 text-sm font-medium">Claude</span>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.8 }}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 max-w-xl mx-auto"
            >
              <LeadMachineForm />
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
              Three steps. About two minutes.
            </h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
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
        {/* SECTION 2B: HOW IT ACTUALLY WORKS                               */}
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
                  What happens after you paste it
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
                  One question, or no questions at all.
                </h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex items-start gap-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(139,121,212,0.15)', border: '1px solid rgba(139,121,212,0.25)' }}
                  >
                    <span className="text-[#9D8FE0] text-lg">◆</span>
                  </div>
                  <div>
                    <h3 className="text-[#FCF4EB] font-semibold text-base mb-2">It asks cold, warm, or both</h3>
                    <p className="text-[#FCF4EB]/44 text-sm leading-relaxed">
                      First it asks one thing: cold outreach, warm network, or both. Cold runs first.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(139,121,212,0.15)', border: '1px solid rgba(139,121,212,0.25)' }}
                  >
                    <span className="text-[#9D8FE0] text-lg">✦</span>
                  </div>
                  <div>
                    <h3 className="text-[#FCF4EB] font-semibold text-base mb-2">Then it just goes, or asks one thing</h3>
                    <p className="text-[#FCF4EB]/44 text-sm leading-relaxed">
                      If it can already tell what you sell and who you serve, it just goes. If not, one question, or paste your website link.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 3: WHAT YOU GET                                          */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              What you get
            </h2>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-3">
            {WHAT_YOU_GET.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7"
              >
                <div className="text-2xl text-[#9D8FE0] mb-4">{item.icon}</div>
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
        {/* SECTION 6: FOLDER MODE                                           */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-16">
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
            <div className="px-5 py-8 sm:px-8 sm:py-10 text-center">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 bg-[#8B79D4]/15 text-[#9D8FE0] border border-[#8B79D4]/25">
                Prefer a coding tool
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#FCF4EB] mb-3">
                It also runs as a folder
              </h3>
              <p className="text-[#FCF4EB]/55 leading-relaxed max-w-xl mx-auto mb-2">
                Open the unzipped folder in Claude Code, Codex, or Gemini CLI and say &quot;go&quot;. Same 25 leads, and it remembers everyone it found for you across days.
              </p>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9D8FE0]/70 hover:text-[#9D8FE0] text-sm underline underline-offset-2"
              >
                View on GitHub
              </a>
            </div>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* GET IT AGAIN                                                     */}
        {/* ================================================================ */}
        <section className="py-16 px-6">
          <div className="max-w-xl mx-auto text-center">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold text-[#FCF4EB] mb-4">
                Get the Lead Machine. It is free.
              </h2>
              <p className="text-[#FCF4EB]/50 text-sm mb-8">
                One zip file, one prompt, 25 real leads. Delivered to your inbox right now.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6"
            >
              <LeadMachineForm />
            </motion.div>
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
            P.S. It never sends anything on its own. Cold mode only ever writes what you paste into a chat. Warm mode only ever drafts, you approve and send every single message yourself.
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
        slug="lead-machine"
        headingOverride="Want more free tools like this in your inbox?"
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
