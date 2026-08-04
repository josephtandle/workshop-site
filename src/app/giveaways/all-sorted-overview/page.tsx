'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'
import GiveawayEmailModal from '@/components/giveaways/GiveawayEmailModal'
import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MASTERMIND_URL = 'https://www.mastermindshq.business'
const ALL_SORTED_URL = 'https://getallsorted.ai'

const CAPABILITY_GROUPS: { name: string; items: { title: string; body: string }[] }[] = [
  {
    name: 'Growth & Outreach',
    items: [
      { title: 'Automated cold outreach', body: 'Apollo-connected research and sequenced outreach that runs in the background while you work on the business.' },
      { title: 'SEO that maintains itself', body: 'Keeps your site indexed, watches rankings, flags drops, and queues fixes without you tracking another dashboard.' },
      { title: 'Blog content on autopilot', body: 'Drafts, reviews, and publishes blog posts from your own ideas and recordings. You approve, it ships.' },
      { title: 'Social posts scheduled across channels', body: 'Postiz writes and queues posts for IG, LinkedIn, X, and threads on whatever cadence you want.' },
      { title: 'Web research compiled into reports', body: 'Ask one question, get a structured report with sources, not a chat that you have to wrangle.' },
    ],
  },
  {
    name: 'Clients & Sales',
    items: [
      { title: 'CRM with full pipeline tracking', body: 'Every lead, contact, conversation, and opportunity in one place. No tabs. No spreadsheets. No more cold leads.' },
      { title: 'Follow-up reminders that actually fire', body: 'When a deal goes quiet, you hear about it. Opportunities stop slipping through the cracks.' },
      { title: 'Stripe sync', body: 'Every sale, refund, and subscription event visible in real time. You always know where the money is.' },
      { title: 'Mentorship and client booking', body: 'TidyCal connected. Onboarding sequences and client folders created automatically when someone books.' },
    ],
  },
  {
    name: 'Money',
    items: [
      { title: 'Subscription audit', body: 'Finds every recurring charge across your accounts. Joe found $1,400 a month he had no idea he was paying.' },
      { title: 'Bookkeeping with auto categorization', body: 'Transactions sorted, expenses tagged, reports ready when you need them. Tax season is a half-hour, not a weekend.' },
      { title: 'Real-time revenue dashboard', body: 'A single number that tells you the truth about this month, this quarter, this year.' },
      { title: 'Budget tracking across accounts', body: 'See spending across every bank, credit card, and Stripe in one view. Catch drift before it gets expensive.' },
    ],
  },
  {
    name: 'Content & Brand',
    items: [
      { title: 'Logo and brand identity generation', body: 'Logo Lava generates on-brand logos and identity systems. No designer needed for the first cut.' },
      { title: 'AI image generation built in', body: 'Dalle-o connected. Generate on-brand visuals from inside any workflow without leaving your system.' },
      { title: 'Pitch deck generation', body: 'Slide decks built from your bullet points, branded automatically, ready to present.' },
      { title: 'Carousel builder for social', body: 'Drop in a topic, get a multi-slide IG or LinkedIn carousel that matches your voice.' },
      { title: 'Video editing on autopilot', body: 'Trim filler, add captions, export the version sized for the platform. You record once, it ships everywhere.' },
    ],
  },
  {
    name: 'Voice & Memory',
    items: [
      { title: 'Voice memos transcribed and searchable', body: 'MLX Whisper transcribes every recording locally. Search across years of voice notes instantly.' },
      { title: 'Meeting notes captured automatically', body: 'Joins your calls, takes notes, summarizes action items, and routes them to the right place.' },
      { title: 'Persistent business memory', body: 'Remembers every conversation, document, and decision. Never tell it the same thing twice.' },
      { title: 'Email inbox cleaned and organized', body: 'Sorts, summarizes, and surfaces what actually matters. Inbox zero becomes a default, not a project.' },
    ],
  },
  {
    name: 'Strategy & Execution',
    items: [
      { title: 'Santa', body: 'A proactive agent that surfaces passive income opportunities and useful capabilities you do not know to ask for yet.' },
      { title: 'Council', body: 'Multi-perspective strategic advisor. Five scouts argue, one synthesizer weighs the call. Better than asking one model.' },
      { title: 'Competitive research and market analysis', body: 'Pulls the data on competitors, pricing, and positioning. Updates on schedule so you are never out of date.' },
      { title: 'Task routing across 157 agents', body: 'You ask once, the dispatcher figures out which agent handles it. You stop micromanaging the system.' },
    ],
  },
  {
    name: 'System',
    items: [
      { title: '45+ integrations preconfigured', body: 'Stripe, Gmail, Notion, Google Calendar, Zoho, Wix, Trello, and more. Already wired in on day one.' },
      { title: 'Website builder with landing pages', body: 'Build, edit, and publish full pages from inside the system. No separate hosting account to manage.' },
      { title: 'Telegram bot for remote control', body: 'Tell your business anything from your phone. Voice or text. It runs the right workflow.' },
      { title: 'Mac optimization and cleanup', body: 'MacCleaner included. Keeps the machine running so your AI system runs.' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Magnetic hover
// ---------------------------------------------------------------------------
function useMagnet(strength = 0.3) {
  const ref = useRef<HTMLElement | null>(null)
  const onMouseMove = useCallback((e: React.MouseEvent) => {
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
export default function AllSortedOverviewPage() {
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)

  // Cormorant Garamond
  useEffect(() => {
    if (document.querySelector('link[data-font="cormorant"]')) return
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,600;1,700&display=swap'
    link.rel = 'stylesheet'
    link.setAttribute('data-font', 'cormorant')
    document.head.appendChild(link)
  }, [])

  // Canvas particles
  useEffect(() => {
    const canvas = particleCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.5 + 0.2,
    }))

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * window.devicePixelRatio, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(189, 179, 232, ${p.alpha})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Lenis smooth scroll
  useEffect(() => {
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null
    let rafId = 0
    ;(async () => {
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({ duration: 1.1 }) as unknown as { raf: (t: number) => void; destroy: () => void }
      const raf = (time: number) => {
        lenis?.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    })()
    return () => {
      cancelAnimationFrame(rafId)
      lenis?.destroy?.()
    }
  }, [])

  // Number every capability so we hit "30" on screen
  let runningCount = 0

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] text-[#FCF4EB] relative overflow-x-hidden">

        {/* Particle canvas */}
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
                <span className="font-semibold text-[11px] sm:text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]">Free</span>
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

          <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(1.8rem, 6vw, 3.8rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                paddingBottom: '0.05em',
              }}
            >
              All Sorted Overview
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-[#FCF4EB]/85 text-base sm:text-lg mb-1 max-w-2xl mx-auto"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(1.05rem, 2.4vw, 1.4rem)' }}
            >
              30 specific things All Sorted does for your business.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-[#FCF4EB]/55 text-sm sm:text-base mt-5 leading-relaxed max-w-2xl mx-auto"
            >
              All Sorted is the pre-installed business operating system. 157 agents, 57 skills,
              45+ integrations, already configured. Here is the short list of what it actually does.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm"
            >
              {[
                { value: '126', label: 'agents' },
                { value: '57', label: 'skills' },
                { value: '45+', label: 'integrations' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1.5">
                  <span className="font-extrabold text-[#9D8FE0]">{stat.value}</span>
                  <span className="text-[#FCF4EB]/55 ml-1.5">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.95 }}
              className="text-[#FCF4EB]/40 text-xs mt-10 flex items-center justify-center gap-2"
            >
              <span className="inline-block w-3 h-3">↓</span> Scroll for the full list
            </motion.p>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 2: THE 30                                                 */}
        {/* ================================================================ */}
        <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          {CAPABILITY_GROUPS.map((group, groupIdx) => (
            <div key={group.name} className={groupIdx === 0 ? '' : 'mt-14 sm:mt-16'}>
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.24em] text-[#9D8FE0]/80 mb-5 sm:mb-6"
              >
                {group.name}
              </motion.h2>
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                {group.items.map((item) => {
                  runningCount += 1
                  const idx = runningCount
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.35, delay: 0.04 * (idx % 5) }}
                      className="rounded-2xl p-[1px] bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent"
                    >
                      <div className="rounded-2xl bg-[#0e0e10] border border-white/[0.04] p-5 sm:p-6 h-full">
                        <div className="flex items-start gap-3 mb-2">
                          <span className="font-mono text-[11px] text-[#9D8FE0]/55 mt-1 tabular-nums">
                            {String(idx).padStart(2, '0')}
                          </span>
                          <h3 className="text-[#FCF4EB] font-bold text-[15px] sm:text-base leading-snug">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-[#FCF4EB]/55 text-[13.5px] sm:text-sm leading-[1.65] pl-7">
                          {item.body}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </section>

        {/* ================================================================ */}
        {/* SECTION 3: EMAIL CTA                                              */}
        {/* ================================================================ */}
        <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="rounded-3xl p-[1px] bg-gradient-to-br from-[#8B79D4]/35 to-[#F5C3C6]/30"
          >
            <div className="rounded-3xl bg-[#0e0e10] border border-white/[0.04] px-5 py-8 sm:px-10 sm:py-12 text-center">
              <h2 className="text-[#FCF4EB] font-extrabold text-xl sm:text-2xl leading-tight">
                Want this overview saved to your inbox?
              </h2>
              <p className="text-[#FCF4EB]/60 text-sm sm:text-base mt-3 leading-relaxed max-w-md mx-auto">
                I&apos;ll send you the full overview plus what comes next when All Sorted opens to founding members.
              </p>
              <button
                onClick={() => setEmailModalOpen(true)}
                className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#8B79D4] hover:bg-[#6e5db8] text-[#FCF4EB] font-bold px-8 py-3.5 text-[15px] active:scale-[0.98] transition"
              >
                Send me the overview
              </button>
              <p className="text-[#FCF4EB]/30 text-[11px] mt-4">Unsubscribe anytime.</p>
            </div>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 4: REACTIONS                                              */}
        {/* ================================================================ */}
        <div className="relative z-10">
          <MastermindReactionsSection />
        </div>

        {/* ================================================================ */}
        {/* SECTION 5: MASTERMIND CTA                                         */}
        {/* ================================================================ */}
        <MastermindCTA />

        {/* Footer */}
        <div className="relative z-10 text-center pb-10 flex flex-col items-center gap-1.5">
          <a
            href={ALL_SORTED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest hover:text-[#FCF4EB]/70 transition-colors"
          >
            getallsorted.ai
          </a>
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
        slug="all-sorted-overview"
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        headingOverride="Where should I send the overview?"
        showCopiedBadge={false}
      />
      <GiveawayAutoModal
        slug="all-sorted-overview"
        headingOverride="Want updates from All Sorted in your inbox?"
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
    <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        className="rounded-3xl p-[1px] bg-gradient-to-br from-[#F5C3C6]/35 to-[#8B79D4]/30"
      >
        <div className="rounded-3xl bg-[#0e0e10] border border-white/[0.04] px-5 py-10 sm:px-12 sm:py-14 text-center">
          <p className="text-[#F5C3C6]/85 text-[11px] font-bold uppercase tracking-[0.24em]">Want to build something like this?</p>
          <h2 className="mt-3 text-[#FCF4EB] font-extrabold text-2xl sm:text-3xl leading-tight">
            Join the Business Automation Mastermind.
          </h2>
          <p className="text-[#FCF4EB]/65 text-sm sm:text-base mt-4 leading-relaxed max-w-xl mx-auto">
            Live cohort, real builds, every member walks out with a working AI system for their business.
            Same tools I used to put All Sorted together.
          </p>
          <a
            ref={magnet.ref as React.RefObject<HTMLAnchorElement>}
            href={MASTERMIND_URL}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={magnet.onMouseMove}
            onMouseLeave={magnet.onMouseLeave}
            className="block sm:inline-block w-full sm:w-auto mt-7 px-10 py-4 rounded-xl bg-[#F5C3C6] hover:bg-[#f0b8bc] text-[#151515] font-bold text-base active:scale-[0.98] text-center transition"
          >
            Learn more
          </a>
        </div>
      </motion.div>
    </section>
  )
}
