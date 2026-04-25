'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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

const HOOK_FORMULAS = [
  {
    number: '01',
    name: 'The Curiosity Gap',
    pattern: '"The one thing I changed that [specific outcome]..."',
    why: 'Opens a loop the brain needs to close. Implies a secret that most people are missing. The word "changed" signals a before/after and makes the outcome feel earned.',
    examples: [
      'The one thing I changed that tripled my close rate overnight',
      'The one habit that changed how I sleep forever',
      'I deleted this from my business and revenue went up 40%',
    ],
    color: '#8B79D4',
  },
  {
    number: '02',
    name: 'The Contrarian Take',
    pattern: '"Stop doing [common advice]. Here\'s what actually works."',
    why: 'Attacks a belief your audience already holds. Disagreement creates cognitive dissonance, which forces attention. Works best when the common advice is genuinely wrong or overrated.',
    examples: [
      'Stop posting every day. It is making your content worse.',
      'Cold outreach is not dead. You are just doing it wrong.',
      'Hustle culture did not build my business. Doing less did.',
    ],
    color: '#F5C3C6',
  },
  {
    number: '03',
    name: 'The Specific Outcome',
    pattern: '"How I [specific result] in [specific timeframe] with [specific constraint]"',
    why: 'Specificity signals credibility. Vague claims are easy to ignore. When you say "42 new clients in 30 days without paid ads," every number forces the brain to pay attention.',
    examples: [
      'How I got 300 followers in 3 days without spending a dollar',
      'How I replaced my 9-to-5 income in 90 days with one service',
      'How I land 3 discovery calls a week from one Instagram story',
    ],
    color: '#9D8FE0',
  },
  {
    number: '04',
    name: 'The POV Setup',
    pattern: '"POV: [relatable situation your audience is in]"',
    why: 'Places the viewer inside the scene instantly. No buildup required. The POV format primes the brain to see itself in the content, which is the fastest path to emotional engagement.',
    examples: [
      'POV: You just hit send on your first cold email and it landed a call',
      'POV: You are 2 years into your business and still working for free',
      'POV: Your competitor has half your skills and twice your followers',
    ],
    color: '#BDB3E8',
  },
  {
    number: '05',
    name: 'The Bold Claim',
    pattern: '"[Strong assertion that is surprising or counterintuitive]"',
    why: 'No hedging. No "I think" or "maybe." A hard claim made without apology demands a reaction. The audience either wants to agree or prove you wrong. Either way, they keep watching.',
    examples: [
      'This is the only content strategy you need in 2025.',
      'Your pricing is why you are not closing. Not your pitch.',
      'Most online courses fail on purpose. Here is proof.',
    ],
    color: '#F5C3C6',
  },
  {
    number: '06',
    name: 'The Story Open',
    pattern: '"[Moment of tension or turning point] + where I was + what changed"',
    why: 'Stories bypass resistance. Your brain cannot help but follow a narrative once it has started. Opening with tension drops the viewer mid-scene and makes stopping feel unnatural.',
    examples: [
      'I was about to quit my agency. Then I got one reply that changed everything.',
      'Two years ago I was charging $200 for projects I now sell for $8,000.',
      'My first product launch made $11. My second made $47,000. Here is the difference.',
    ],
    color: '#8B79D4',
  },
  {
    number: '07',
    name: 'The Direct Address',
    pattern: '"If you are [specific person in specific situation], watch this."',
    why: 'Names the exact person who needs to see the content. When people feel personally called out, they stop. The more specific the description, the stronger the pull. Generic calls to action get ignored.',
    examples: [
      'If you are a freelancer charging less than $2,000 per project, this is for you.',
      'If you have been posting for 6 months and have under 500 followers, watch this.',
      'If your business runs entirely on referrals, you have a serious problem.',
    ],
    color: '#9D8FE0',
  },
]

const ANATOMY = [
  {
    label: 'The Pattern Interrupt',
    desc: 'The very first visual or word must break whatever the viewer was expecting. This can be an unusual angle, a bold text overlay, silence before a loud moment, or an opening statement that contradicts conventional wisdom.',
  },
  {
    label: 'The Implicit Promise',
    desc: 'Every strong hook contains an unspoken deal: "stay with me and you will get X." The viewer does not need to be told this. They feel it in the tension between what they see and what they want to know.',
  },
  {
    label: 'The Audience Signal',
    desc: 'The best hooks filter as well as attract. They say "this is for you" to the right viewer and "this is not for you" to everyone else. Specificity is not exclusion. It is precision.',
  },
  {
    label: 'The Forward Pull',
    desc: 'A hook is not complete until the viewer wants to keep watching. If the first 3 seconds could stand alone without the rest of the video, you do not have a hook. You have an intro.',
  },
]

const AI_PROMPTS = [
  {
    title: 'Generate 10 hooks for any topic',
    prompt: `Write 10 viral Instagram Reel hooks for the following topic: [YOUR TOPIC]\n\nFor each hook, use one of these formats:\n- Curiosity gap: "The one thing I changed that..."\n- Contrarian: "Stop doing X. Here's what actually works."\n- Specific outcome: "How I [result] in [timeframe]"\n- POV setup: "POV: You are [relatable situation]"\n- Bold claim: direct statement, no hedging\n- Story open: tension-first, then context\n- Direct address: "If you are [specific person]..."\n\nMy audience is: [DESCRIBE AUDIENCE]\nThe goal of the reel is: [EXPLAIN WHAT YOU WANT VIEWERS TO DO OR FEEL]\n\nFor each hook, also note which format you used and why it fits this topic.`,
  },
  {
    title: 'Rewrite a weak hook until it lands',
    prompt: `I have a hook that is not working. Help me improve it.\n\nMy current hook: [PASTE YOUR CURRENT HOOK]\n\nHere is what the reel is about: [BRIEF DESCRIPTION]\nMy target viewer: [WHO WILL SEE THIS]\n\nProblems I think it has: [WHAT FEELS FLAT ABOUT IT]\n\nRewrite it 5 different ways. For each version:\n1. Show the rewritten hook\n2. Name the formula used\n3. Explain in one sentence why this version should outperform the original`,
  },
  {
    title: 'Extract the hook pattern from a successful reel',
    prompt: `Analyze this hook and extract the formula so I can reuse it:\n\n[PASTE THE HOOK TEXT OR DESCRIBE WHAT HAPPENS IN THE FIRST 3 SECONDS]\n\nTell me:\n1. What type of hook formula is this?\n2. What specifically makes it work (the exact mechanism)\n3. What beliefs or desires does it target?\n4. Write 3 new hooks that use the exact same formula but for a different topic: [YOUR TOPIC]`,
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
// Video Card
// ---------------------------------------------------------------------------
function VideoCard({ reel, index }: { reel: typeof REELS[0]; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 4) * 0.08 }}
      className="group relative rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03]"
      style={{ aspectRatio: '9/16', maxHeight: 480 }}
    >
      <video
        ref={videoRef}
        src={`/videos/viral-hooks/${reel.id}.mp4`}
        className="w-full h-full object-cover"
        playsInline
        loop
        onEnded={() => setPlaying(false)}
      />

      {/* Play/pause overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
      >
        <AnimatePresence>
          {!playing && (
            <motion.div
              key="play"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-14 h-14 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-sm"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between">
        <span className="text-white/70 text-xs font-medium">{reel.label}</span>
        <a
          href={reel.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 text-white/55 hover:text-white/90 transition-colors text-xs"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
          Instagram
        </a>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Copy Button (for AI prompts)
// ---------------------------------------------------------------------------
function PromptCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handle = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }, [text])
  return (
    <button
      onClick={handle}
      className="px-3 py-1 rounded-md text-xs font-medium bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.10] text-[#FCF4EB]/60 hover:text-[#FCF4EB]/90 transition-all duration-150 select-none"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
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
            Want to build this as a real skill?
          </h2>

          <p className="text-xl sm:text-3xl font-bold mb-5">
            <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6] hover:opacity-80 transition-opacity">
              Join the Business Automation Mastermind
            </a>
          </p>

          <p className="text-[#FCF4EB]/52 max-w-xl mx-auto mb-8 leading-relaxed text-base sm:text-lg">
            A small, focused group of business owners who meet weekly to build real things, fast. We go from hook to complete content system in a single session.
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
            ref={magnet.ref as React.RefObject<HTMLAnchorElement>}
            href={MASTERMIND_URL}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={magnet.onMouseMove}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 transparent'; magnet.onMouseLeave() }}
            className="block sm:inline-block w-full sm:w-auto px-10 py-4 rounded-xl bg-[#F5C3C6] hover:bg-[#f0b8bc] text-[#151515] font-bold text-base active:scale-[0.98] transition-all text-center"
            style={{ boxShadow: '0 0 0 transparent', transition: 'box-shadow 0.2s ease, background-color 0.15s ease, transform 0.1s ease-out' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(245,195,198,0.5), 0 0 60px rgba(245,195,198,0.2)' }}
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
export default function ViralHooksPage() {
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const [expandedFormula, setExpandedFormula] = useState<string | null>(null)

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
    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: Math.random() * 0.6 + 0.25,
      alpha: Math.random() * 0.18 + 0.04,
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
    '@type': 'LearningResource',
    name: 'Understanding Viral Hooks',
    description: 'A free guide covering 7 proven hook formulas, real reel examples, and AI prompts to generate hooks for any topic.',
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
        .formula-card {
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .formula-card:hover {
          box-shadow: 0 0 24px rgba(124, 105, 199, 0.10);
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
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4">

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(2.2rem, 6vw, 4.2rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                paddingBottom: '0.05em',
              }}
            >
              Understanding Viral Hooks
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mb-5 text-[#FCF4EB]/85"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 600,
                fontSize: 'clamp(1.1rem, 3vw, 2.2rem)',
                lineHeight: 1.2,
              }}
            >
              Why some content stops the scroll and most of it doesn't.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.6 }}
              className="text-[#FCF4EB]/52 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8"
            >
              7 proven hook formulas broken down with real examples, a video library of viral reels, and AI prompts you can copy straight into Claude. Use this yourself, share it with your community, or give it away as a lead magnet.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.9 }}
              className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 mb-8"
            >
              {[
                { value: '7', label: 'Hook formulas' },
                { value: '8', label: 'Reel examples' },
                { value: '3', label: 'AI prompts' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]">{stat.value}</div>
                  <div className="text-[#FCF4EB]/38 text-xs uppercase tracking-widest mt-0.5">{stat.label}</div>
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

        {/* ================================================================ */}
        {/* SECTION 2: THE 3-SECOND WINDOW                                   */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-4">
              You have 3 seconds. Maybe less.
            </h2>
            <p className="text-[#FCF4EB]/50 max-w-2xl mx-auto leading-relaxed">
              The algorithm does not care how good your content is. It only measures whether people stop scrolling. A hook is not an intro. It is not context-setting. It is the exact moment your viewer decides whether to stay or leave.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: '◎',
                title: 'Pattern interrupt',
                body: 'The first frame must break the expected format. Something unexpected, visually or verbally, buys you the next few seconds.',
              },
              {
                icon: '◈',
                title: 'Open loop',
                body: 'A hook works because it creates a question the viewer cannot answer without watching. Satisfaction comes from closing the loop, not from the intro.',
              },
              {
                icon: '✦',
                title: 'Audience filter',
                body: 'The best hooks signal exactly who the content is for. If everyone is your audience, your hook will not stop anyone. Specificity is not exclusion.',
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

        {/* ================================================================ */}
        {/* SECTION 3: HOOK FORMULAS                                         */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
              The 7 Formulas
            </span>
            <div className="mb-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB]">
                Every viral hook fits one of these patterns
              </h2>
            </div>
            <p className="text-[#FCF4EB]/45 max-w-xl mx-auto leading-relaxed">
              These are not guesses. They are extracted from hundreds of high-performing reels across every niche. Click any formula to see examples.
            </p>
          </motion.div>

          <div className="space-y-3">
            {HOOK_FORMULAS.map((formula, i) => {
              const isOpen = expandedFormula === formula.name
              return (
                <motion.div
                  key={formula.name}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="formula-card rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden"
                  style={{ borderColor: isOpen ? `${formula.color}30` : undefined }}
                >
                  <button
                    onClick={() => setExpandedFormula(isOpen ? null : formula.name)}
                    className="w-full flex items-start sm:items-center justify-between p-6 text-left gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-5 flex-1 min-w-0">
                      <span className="text-2xl font-extrabold font-mono flex-shrink-0" style={{ color: `${formula.color}40` }}>
                        {formula.number}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[#FCF4EB] font-bold text-base sm:text-lg">{formula.name}</div>
                        <div className="text-[#FCF4EB]/38 text-xs sm:text-sm mt-0.5 font-mono italic truncate">
                          {formula.pattern}
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border border-white/[0.12] text-[#FCF4EB]/40"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 3.5l3 3 3-3" />
                      </svg>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-7 space-y-5" style={{ borderTop: `1px solid ${formula.color}18` }}>
                          {/* Why it works */}
                          <div className="pt-5">
                            <div className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: formula.color }}>
                              Why it works
                            </div>
                            <p className="text-[#FCF4EB]/62 text-sm leading-relaxed">{formula.why}</p>
                          </div>

                          {/* Examples */}
                          <div>
                            <div className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: formula.color }}>
                              Examples
                            </div>
                            <div className="space-y-2">
                              {formula.examples.map((ex, j) => (
                                <div
                                  key={j}
                                  className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                                >
                                  <span className="text-[#FCF4EB]/20 text-xs font-mono mt-0.5 flex-shrink-0">{String(j + 1).padStart(2, '0')}</span>
                                  <p className="text-[#FCF4EB]/72 text-sm leading-relaxed italic">&ldquo;{ex}&rdquo;</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 4: VIDEO LIBRARY                                         */}
        {/* ================================================================ */}
        <section className="max-w-6xl mx-auto px-6 py-14">
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
                8 viral hooks to study
              </h2>
            </div>
            <p className="text-[#FCF4EB]/45 max-w-xl mx-auto leading-relaxed">
              Watch each one and identify which formula it uses. The best way to internalize these patterns is to analyze them in the wild. Links to the original reels are included below each video.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {REELS.map((reel, i) => (
              <VideoCard key={reel.id} reel={reel} index={i} />
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 5: ANATOMY                                               */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
              Hook Anatomy
            </span>
            <div className="mb-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB]">
                What every great hook has in common
              </h2>
            </div>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {ANATOMY.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #9D8FE0, #F5C3C6)' }}
                  />
                  <h3 className="text-[#FCF4EB] font-bold text-base">{item.label}</h3>
                </div>
                <p className="text-[#FCF4EB]/44 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 6: MASTERMIND CTA                                        */}
        {/* ================================================================ */}
        <MastermindCTA />

        {/* ================================================================ */}
        {/* SECTION 7: PARTICIPANT REACTIONS                                 */}
        {/* ================================================================ */}
        <MastermindReactionsSection />

        {/* ================================================================ */}
        {/* SECTION 8: AI PROMPTS                                            */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
                AI Prompts
              </span>
              <div className="mb-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB]">
                  Let Claude write the hooks
                </h2>
              </div>
              <p className="text-[#FCF4EB]/45 max-w-xl mx-auto leading-relaxed">
                Three prompts you can paste straight into{' '}
                <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-[#9D8FE0] hover:text-[#BDB3E8] transition-colors">Claude</a>
                {' '}or{' '}
                <a href="https://claude.ai/claude-code" target="_blank" rel="noopener noreferrer" className="text-[#9D8FE0] hover:text-[#BDB3E8] transition-colors">Claude Code</a>.
                Fill in the brackets, hit send, and get a batch of hooks in seconds.
              </p>
            </div>

            <div className="space-y-6">
              {AI_PROMPTS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl overflow-hidden border border-white/[0.08]"
                >
                  <div className="flex items-center justify-between px-4 py-3 bg-white/[0.04] border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <span className="text-[#9D8FE0] text-xs font-bold font-mono">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[#FCF4EB]/70 text-sm font-medium">{item.title}</span>
                    </div>
                    <PromptCopyButton text={item.prompt} />
                  </div>
                  <pre
                    className="p-5 text-sm font-mono leading-[1.75] text-[#FCF4EB]/72 whitespace-pre-wrap break-words"
                    style={{ background: '#0d0d0d' }}
                  >
                    <code>{item.prompt}</code>
                  </pre>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 9: SECOND CTA                                            */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-10 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-[#FCF4EB]/30 text-sm">
              This guide is free.{' '}
              <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="text-[#9D8FE0] hover:text-[#BDB3E8] transition-colors underline underline-offset-2 decoration-[#7C69C7]/40">
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
