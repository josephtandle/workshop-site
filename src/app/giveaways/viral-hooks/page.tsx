'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MASTERMIND_URL = 'https://www.mastermindshq.business'

const REELS = [
  { id: 'DA0k_aYMnhp', label: 'Example 1', url: 'https://www.instagram.com/reel/DA0k_aYMnhp/' },
  { id: 'DSPBxlviPtK', label: 'Example 2', url: 'https://www.instagram.com/reel/DSPBxlviPtK/' },
  { id: 'DFfc26Lsqog', label: 'Example 3', url: 'https://www.instagram.com/reel/DFfc26Lsqog/' },
  { id: 'DF2sqPkN2hU', label: 'Example 4', url: 'https://www.instagram.com/reel/DF2sqPkN2hU/' },
  { id: 'DKaoC1hubgG', label: 'Example 5', url: 'https://www.instagram.com/reel/DKaoC1hubgG/' },
  { id: 'DWzni9xEcxL', label: 'Example 6', url: 'https://www.instagram.com/reel/DWzni9xEcxL/' },
  { id: 'DTO27ZBjsnl', label: 'Example 7', url: 'https://www.instagram.com/reel/DTO27ZBjsnl/' },
  { id: 'DWmYXSxD5GP', label: 'Example 8', url: 'https://www.instagram.com/reel/DWmYXSxD5GP/' },
]

const TECHNIQUES = [
  {
    n: 1,
    name: 'The First-Frame Statement',
    desc: 'Pause on frame one. Mute the video. A stranger who knows nothing about the creator should be able to sense what is at stake. If the first frame is generic — a person standing, an office background, neutral expression — the hook is already failing before a word is spoken.',
  },
  {
    n: 2,
    name: 'The Interruption Visual',
    desc: 'Something in the frame that does not belong to the expected content format. An unexpected environment, an unusual object, a facial expression that contradicts the setting. The brain registers the mismatch before conscious attention engages, which buys the next two seconds.',
  },
  {
    n: 3,
    name: 'Tight Framing',
    desc: 'Close-up shots communicate intimacy and urgency. Wide shots communicate context. Scroll-stopping hooks almost always open tight: face filling most of the frame, eyes near the upper third. The tighter the frame, the harder it is to look away.',
  },
  {
    n: 4,
    name: 'On-Screen Text Timing',
    desc: 'Text that appears before the voiceover starts has more stopping power than text that chases the speech. When the viewer reads before they hear, they have already committed to the first half-second. That commitment compounds.',
  },
  {
    n: 5,
    name: 'Direct Camera Address',
    desc: 'Looking directly into the lens creates a different psychological effect than looking slightly off-camera. Direct address is confrontational in the best possible way. It reads as: this is specifically for you. Looking away from the lens reads as: you are observing something that was not meant for you.',
  },
  {
    n: 6,
    name: 'The Unresolved Scene',
    desc: 'Starting in the middle of something that has already started. The brain is a pattern-completing machine. An action already in progress with no visible beginning creates an obligation to see how it resolves. The hook does not explain what is happening. That explanation is the content.',
  },
  {
    n: 7,
    name: 'Visual Contrast',
    desc: 'A person in an unexpected setting. A mismatch between expression and environment. Text that contradicts what is visible. Contrast within the frame creates a visual tension the eye is drawn to resolve. Sameness gets scrolled. Contrast gets paused.',
  },
]

// ---------------------------------------------------------------------------
// Magnetic button hook
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// CountUp number — fires when it enters viewport
// ---------------------------------------------------------------------------
function CountUpNum({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(async () => {
            const { CountUp } = await import('countup.js')
            const cu = new CountUp(el, value, { duration: 1.8, separator: '' })
            if (!cu.error) cu.start()
          })()
          observer.unobserve(el)
        })
      },
      { threshold: 0.8 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])
  return <span ref={ref} className={className}>0</span>
}

// ---------------------------------------------------------------------------
// Video Card
// ---------------------------------------------------------------------------
function VideoCard({ reel, index }: { reel: typeof REELS[0]; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) }
    else { v.pause(); setPlaying(false) }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 4) * 0.07 }}
      className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03] cursor-pointer group"
      style={{ aspectRatio: '9/16', maxHeight: 460 }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={`/videos/viral-hooks/${reel.id}.mp4`}
        className="w-full h-full object-cover"
        playsInline
        loop
        onEnded={() => setPlaying(false)}
      />

      {/* Play overlay */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            key="play"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-14 h-14 rounded-full bg-black/55 border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-black/70 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom label */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 bg-gradient-to-t from-black/75 to-transparent flex items-center justify-between">
        <span className="text-white/65 text-xs font-medium">{reel.label}</span>
        <a
          href={reel.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-white/45 hover:text-white/80 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Mastermind CTA
// ---------------------------------------------------------------------------
function MastermindCTA() {
  const magnet = useMagnet(0.28)
  return (
    <section className="relative z-10 max-w-5xl mx-auto px-6 py-14">
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
            Want to build this as a real skill?
          </h2>
          <p className="text-xl sm:text-3xl font-bold mb-5">
            <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6] hover:opacity-80 transition-opacity">
              Join the Business Automation Mastermind
            </a>
          </p>
          <p className="text-[#FCF4EB]/52 max-w-xl mx-auto mb-8 leading-relaxed text-base sm:text-lg">
            A small, focused group of business owners who meet weekly to build real things, fast. We go from studying what works to having a complete content system in a single session.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center mb-9">
            {['Small group, capped at 15', 'We meet weekly', 'Idea to live system in one session'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[#FCF4EB]/58 text-sm">
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
            className="block sm:inline-block w-full sm:w-auto px-10 py-4 rounded-xl bg-[#F5C3C6] text-[#151515] font-bold text-base active:scale-[0.98] text-center glow-btn glow-btn-pink"
          >
            Learn More
          </a>
        </div>
      </motion.div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function VisualHooksPage() {
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const [expandedTech, setExpandedTech] = useState<number | null>(null)

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
    type P = { x: number; y: number; r: number; dx: number; dy: number; alpha: number; color: string }
    const colors = ['#8B79D4', '#F5C3C6', '#9D8FE0', '#BDB3E8', '#FCF4EB']
    const particles: P[] = Array.from({ length: 70 }, () => ({
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
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.y > canvas.height + 5) { p.y = -5; p.x = Math.random() * canvas.width }
        if (p.x < -5) p.x = canvas.width + 5
        if (p.x > canvas.width + 5) p.x = -5
      })
      ctx.globalAlpha = 1; animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: 'Understanding Visual Hooks',
    description: 'A free guide covering 7 visual techniques found in scroll-stopping reels, with 8 real examples to study.',
    author: { '@type': 'Person', name: 'Joe Che', url: MASTERMIND_URL },
    publisher: { '@type': 'Organization', name: 'Business Automation Mastermind', url: MASTERMIND_URL },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        @keyframes aurora-drift {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(30px,-40px) scale(1.1); }
          66%       { transform: translate(-20px,25px) scale(0.93); }
        }
        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          40%       { transform: translate(-35px,30px) scale(1.07); }
          70%       { transform: translate(45px,-15px) scale(0.96); }
        }
        .aurora-a { animation: aurora-drift 16s ease-in-out infinite; }
        .aurora-b { animation: aurora-drift-2 20s ease-in-out infinite; }
        .glow-card { transition: box-shadow 0.3s ease, border-color 0.3s ease; }
        .glow-card:hover {
          box-shadow: 0 0 28px rgba(124,105,199,0.12), 0 0 0 1px rgba(124,105,199,0.18);
          border-color: rgba(124,105,199,0.22) !important;
        }
        .glow-btn { transition: box-shadow 0.2s ease, background-color 0.15s ease, transform 0.1s ease-out; }
        .glow-btn:hover { box-shadow: 0 0 32px rgba(124,105,199,0.45), 0 0 60px rgba(124,105,199,0.2); }
        .glow-btn-pink:hover { box-shadow: 0 0 32px rgba(245,195,198,0.5), 0 0 60px rgba(245,195,198,0.2); }
        .tech-row { transition: border-color 0.2s ease; }
        .tech-row:hover { border-color: rgba(124,105,199,0.22) !important; }
      `}</style>

      <div className="min-h-screen bg-[#151515] text-[#FCF4EB] overflow-x-hidden">

        {/* Fixed background particles */}
        <canvas
          ref={particleCanvasRef}
          className="fixed inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        />

        {/* ================================================================
            HERO
        ================================================================ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-4 pt-6 sm:pt-8">

          {/* Gradient-border badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-8 sm:top-10 left-0 right-0 flex justify-center"
          >
            <div className="p-[1px] rounded-full bg-gradient-to-r from-[#8B79D4] to-[#F5C3C6] inline-block">
              <div className="px-5 py-2 rounded-full bg-[#151515] flex items-center gap-2">
                <span className="text-[#9D8FE0] text-xs">✦</span>
                <span className="font-semibold text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]">Free</span>
                <span className="text-[#FCF4EB]/32 text-xs">from the</span>
                <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="text-[#FCF4EB]/60 text-xs font-medium hover:text-[#FCF4EB]/90 transition-colors">
                  Business Automation Mastermind
                </a>
              </div>
            </div>
          </motion.div>

          {/* Aurora blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="aurora-a absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full opacity-[0.09]"
              style={{ background: 'radial-gradient(circle, #8B79D4 0%, transparent 70%)', filter: 'blur(80px)' }} />
            <div className="aurora-b absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.07]"
              style={{ background: 'radial-gradient(circle, #F5C3C6 0%, transparent 70%)', filter: 'blur(90px)' }} />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4">

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(2.2rem, 6vw, 4.4rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                paddingBottom: '0.05em',
              }}
            >
              Understanding Visual Hooks
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mb-5 text-[#FCF4EB]/82"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 600,
                fontSize: 'clamp(1.1rem, 2.8vw, 2rem)',
                lineHeight: 1.2,
              }}
            >
              What the first 3 seconds of scroll-stopping content actually look like.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.6 }}
              className="text-[#FCF4EB]/50 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10"
            >
              Most people focus on what to say. This guide is about what to show. Seven visual techniques that appear in scroll-stopping content, with eight real reels to study frame by frame.
            </motion.p>

            {/* Stats — CountUp */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.9 }}
              className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 mb-10"
            >
              {[
                { value: 7, label: 'visual techniques' },
                { value: 8, label: 'reel examples' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <CountUpNum
                    value={stat.value}
                    className="block text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]"
                  />
                  <div className="text-[#FCF4EB]/35 text-xs uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.1 }}
              className="flex items-center justify-center gap-2 text-[#FCF4EB]/22 text-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              <span>Scroll to explore</span>
            </motion.div>
          </div>
        </section>

        {/* ================================================================
            THE 3-SECOND WINDOW
        ================================================================ */}
        <section className="relative z-10 max-w-5xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-4">
              The decision happens before the audio starts.
            </h2>
            <p className="text-[#FCF4EB]/50 max-w-2xl mx-auto leading-relaxed">
              Most people scroll with sound off. The first 1-3 frames of a reel are processed visually before the brain decides whether to stay. Understanding what makes those frames work is a visual skill, not a writing skill.
            </p>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: '◎',
                title: 'Visual before audio',
                body: 'On Instagram, over 60% of users scroll with sound off. The hook has to work as a silent image before it works as a spoken sentence.',
              },
              {
                icon: '◈',
                title: 'Frame one is a billboard',
                body: 'The first frame is a static image on the feed. It competes with every other static image in the scroll. Treat it like a billboard, not a film opening.',
              },
              {
                icon: '✦',
                title: 'Motion earns the next second',
                body: 'Once someone pauses, the first moment of motion either confirms they made the right choice or tells them they were tricked. The visual energy has to match the promise.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
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

        {/* ================================================================
            7 VISUAL TECHNIQUES
        ================================================================ */}
        <section className="relative z-10 max-w-5xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
              Visual Techniques
            </span>
            <div className="mb-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB]">
                7 things to look for in the first 3 seconds
              </h2>
            </div>
            <p className="text-[#FCF4EB]/45 max-w-xl mx-auto leading-relaxed">
              Every scroll-stopping reel uses at least one of these. Most use three or more. Use the video library below to identify them as you watch.
            </p>
          </motion.div>

          <div className="space-y-3">
            {TECHNIQUES.map((tech, i) => {
              const isOpen = expandedTech === tech.n
              return (
                <motion.div
                  key={tech.n}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="tech-row rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden"
                  style={{ borderColor: isOpen ? 'rgba(124,105,199,0.25)' : undefined }}
                >
                  <button
                    onClick={() => setExpandedTech(isOpen ? null : tech.n)}
                    className="w-full flex items-center gap-5 p-5 sm:p-6 text-left"
                  >
                    {/* Animated counter number */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(124,105,199,0.12)', border: '1px solid rgba(124,105,199,0.2)' }}>
                      <CountUpNum
                        value={tech.n}
                        className="text-sm font-extrabold font-mono text-[#9D8FE0]"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[#FCF4EB] font-bold text-base">{tech.name}</div>
                    </div>

                    <div
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border border-white/[0.10] text-[#FCF4EB]/35"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.22s ease' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 3.5l3 3 3-3" />
                      </svg>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 pt-1 text-[#FCF4EB]/58 text-sm leading-relaxed"
                          style={{ borderTop: '1px solid rgba(124,105,199,0.1)' }}>
                          {tech.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ================================================================
            VIDEO LIBRARY
        ================================================================ */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#F5C3C6]/10 text-[#F5C3C6] border border-[#F5C3C6]/20">
              Reel Library
            </span>
            <div className="mb-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB]">
                <CountUpNum value={8} className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]" /> reels to study
              </h2>
            </div>
            <p className="text-[#FCF4EB]/45 max-w-xl mx-auto leading-relaxed">
              Watch each one and identify which visual techniques it uses. Pause on frame one. Watch the first 3 seconds twice before you watch the full video. The original reels are linked below each.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {REELS.map((reel, i) => (
              <VideoCard key={reel.id} reel={reel} index={i} />
            ))}
          </div>
        </section>

        {/* ================================================================
            HOW TO STUDY A VISUAL HOOK
        ================================================================ */}
        <section className="relative z-10 max-w-5xl mx-auto px-6 py-14">
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
            <div className="px-8 py-10">
              <div className="text-center mb-8">
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
                  How to use this
                </span>
                <div className="mb-3">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
                    Four questions to ask before you watch the rest
                  </h2>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  {
                    q: '01',
                    title: 'Pause on frame one',
                    body: 'Before you press play: what does the thumbnail communicate? Is it a person, a setting, an action? Does anything look unexpected or out of place? What emotion does the first frame alone suggest?',
                  },
                  {
                    q: '02',
                    title: 'Watch the first 3 seconds, no sound',
                    body: 'Mute the video and watch the opening. Does it still hold your attention? What visual event happens and when? Is there text, and does it appear before or after motion starts?',
                  },
                  {
                    q: '03',
                    title: 'Name the technique',
                    body: 'Which of the 7 techniques above does this hook use? Most use more than one. Write them down. The ones that recur across multiple reels are worth practicing.',
                  },
                  {
                    q: '04',
                    title: 'Ask: could I reproduce this?',
                    body: 'Not the topic. The visual structure. Could you film something with the same framing, the same text timing, the same visual contrast? If yes, you have extracted a reusable template.',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono text-[#9D8FE0]"
                      style={{ background: 'rgba(124,105,199,0.15)', border: '1px solid rgba(124,105,199,0.25)' }}>
                      {item.q}
                    </div>
                    <div>
                      <h3 className="text-[#FCF4EB] font-semibold text-sm mb-1">{item.title}</h3>
                      <p className="text-[#FCF4EB]/44 text-sm leading-relaxed">{item.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================================================================
            MASTERMIND CTA
        ================================================================ */}
        <MastermindCTA />

        {/* ================================================================
            PARTICIPANT REACTIONS
        ================================================================ */}
        <MastermindReactionsSection />

        {/* ================================================================
            FOOTER NOTE
        ================================================================ */}
        <section className="relative z-10 max-w-5xl mx-auto px-6 py-10 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-[#FCF4EB]/28 text-sm">
              This guide is free.{' '}
              <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="text-[#9D8FE0] hover:text-[#BDB3E8] transition-colors underline underline-offset-2 decoration-[#7C69C7]/35">
                The Mastermind
              </a>
              {' '}is where the real work happens.
            </p>
          </motion.div>
        </section>

      </div>
    </>
  )
}
