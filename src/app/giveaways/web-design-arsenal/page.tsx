'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import gsap from 'gsap'
import confetti from 'canvas-confetti'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MASTERMIND_URL = 'https://www.mastermindshq.business'

const COMPATIBLE_TOOLS = [
  {
    name: 'Claude Code',
    logo: '◆',
    badge: 'Full install',
    detail: 'Skills + npm libraries. All 4 steps work natively.',
  },
  {
    name: 'Codex',
    logo: '⬡',
    badge: 'npm only',
    detail: 'Run Step 3 only. Skip the git clone steps.',
  },
  {
    name: 'Gemini CLI',
    logo: '✦',
    badge: 'npm only',
    detail: 'Run Step 3 only. Skip the git clone steps.',
  },
]

const THE_PROMPT = `Set up my professional web design toolkit so I can
build incredibly gorgeous websites fast.

-- For Claude Code users (all 4 steps) --------------------

Step 1 -- Install Claude Code design skills:
git clone https://github.com/anthropics/frontend-design ~/.claude/skills/frontend-design
git clone https://github.com/Koomook/claude-frontend-skills ~/.claude/skills/claude-frontend-skills
git clone https://github.com/greensock/gsap-skills ~/.claude/skills/gsap-skills
git clone https://github.com/Dammyjay93/interface-design ~/.claude/skills/interface-design
git clone https://github.com/Owl-Listener/designer-skills ~/.claude/skills/designer-skills
git clone https://github.com/freshtechbro/claudedesignskills ~/.claude/skills/claudedesignskills

Step 2 -- Install mobile-first and responsive skills:
git clone https://github.com/szilu/ux-designer-skill ~/.claude/skills/ux-designer
git clone https://github.com/HermeticOrmus/LibreUIUX-Claude-Code ~/.claude/skills/libreUIUX

-- For all tools (Claude Code, Codex, Gemini CLI) ---------

Step 3 -- Install animation and effects libraries:
npm install gsap lenis framer-motion animejs \\
  @formkit/auto-animate split-type typed.js \\
  countup.js canvas-confetti tsparticles \\
  vanta three @barba/core scrollreveal aos vivus

Step 4 -- Confirm and quick-start:
When complete, show me a quick-start example:
add smooth scroll and an animated text reveal
to a hero section for a landing page.`

const SKILL_CATEGORIES = [
  {
    name: 'Claude Code Design Skills',
    count: 6,
    skills: [
      { name: 'frontend-design (Official Anthropic)', url: 'https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design', desc: 'Forces bold aesthetic decisions before a line of code. 240+ styles, 127 font pairings.' },
      { name: 'claude-frontend-skills', url: 'https://github.com/Koomook/claude-frontend-skills', desc: 'Anti-AI-slop framework. 10+ bold modes: brutalist, luxury, retro-futuristic.' },
      { name: 'gsap-skills', url: 'https://github.com/greensock/gsap-skills', desc: 'Official from the GSAP team. Teaches perfect animation code and ScrollTrigger.' },
      { name: 'interface-design', url: 'https://github.com/Dammyjay93/interface-design', desc: 'Linear, Notion, and Stripe-inspired. Maintains design memory across sessions.' },
      { name: 'designer-skills (63 skills)', url: 'https://github.com/Owl-Listener/designer-skills', desc: 'Built by a designer for designers. 63 skills covering the full design workflow.' },
      { name: 'claude-design-skills', url: 'https://github.com/freshtechbro/claudedesignskills', desc: '22 skills for 3D, animation, and interactive web. GSAP, Framer Motion, Locomotive Scroll.' },
    ],
  },
  {
    name: 'Mobile-First and Responsive',
    count: 4,
    skills: [
      { name: 'ux-designer-skill 2026', url: 'https://github.com/szilu/ux-designer-skill', desc: '22 reference files. Dedicated mobile UX guide. Synthesizes NNG, WCAG 2.2, Material Design, Apple HIG.' },
      { name: 'LibreUIUX-Claude-Code', url: 'https://github.com/HermeticOrmus/LibreUIUX-Claude-Code', desc: '152 agents, 74 skills. Mobile constraints force clarity. Clarity scales up beautifully.' },
      { name: 'elite-frontend-ux', url: 'https://gist.github.com/majidmanzarpour/8b95e5e0e78d7eeacd3ee54606c7acc6', desc: 'True mobile-first: 44px touch targets, 16px min body text, WCAG 2.1 AA.' },
      { name: 'responsive-breakpoint-analyzer', url: 'https://github.com/ia23a-lachnita/claude-code-plugins-plus-fix-skills', desc: 'Auto-validates breakpoints and generates production-ready responsive code.' },
    ],
  },
  {
    name: 'Scroll and Animation',
    count: 6,
    skills: [
      { name: 'gsap', url: 'https://github.com/greensock/GSAP', desc: 'Industry standard. Used on virtually every award-winning website. ScrollTrigger defines the modern agency look.' },
      { name: 'lenis', url: 'https://github.com/darkroomengineering/lenis', desc: 'Gold standard smooth scroll. GPU-accelerated, inertia-based. Makes every scroll feel premium.' },
      { name: 'framer-motion', url: 'https://github.com/motiondivision/motion', desc: '30M+ monthly downloads. Layout animations, gestures, scroll-linked effects.' },
      { name: 'animejs', url: 'https://github.com/juliangarnier/anime', desc: 'Lightweight. SVG morphing, motion paths, timeline orchestration.' },
      { name: 'scrollreveal', url: 'https://github.com/jlmakes/scrollreveal', desc: 'Elements animate as they enter the viewport. Zero dependencies.' },
      { name: 'aos', url: 'https://github.com/michalsnik/aos', desc: '28K+ GitHub stars. CSS3 scroll animations via data attributes. Instant wow factor.' },
    ],
  },
  {
    name: 'Particles, 3D, and Visual Effects',
    count: 4,
    skills: [
      { name: 'tsparticles', url: 'https://github.com/tsparticles/tsparticles', desc: 'Particles, confetti, fireworks. React, Vue, Svelte, Angular components ready to drop in.' },
      { name: 'vanta', url: 'https://github.com/tengbao/vanta', desc: 'Animated 3D WebGL backgrounds in 5 lines. WAVES, BIRDS, NET, GLOBE, FOG. Mouse-responsive.' },
      { name: 'three.js', url: 'https://github.com/mrdoob/three.js', desc: 'World\'s most-used 3D JavaScript library. 100K+ stars. Foundation for every impressive 3D web experience.' },
      { name: 'canvas-confetti', url: 'https://github.com/catdad/canvas-confetti', desc: 'Performant confetti from any position. Customizable shapes, colors, and physics.' },
    ],
  },
  {
    name: 'Typography, Text, and Extras',
    count: 6,
    skills: [
      { name: 'split-type', url: 'https://github.com/lukePeavey/SplitType', desc: 'Splits text into characters, words, and lines for independent animation. The engine behind premium text reveals.' },
      { name: 'typed.js', url: 'https://github.com/mattboldt/typed.js', desc: 'The canonical typewriter effect library. Configurable speed, loops, smart backspace.' },
      { name: 'countup.js', url: 'https://github.com/inorganik/CountUp.js', desc: 'Animates numbers counting up. Makes stats and metrics come alive.' },
      { name: 'vivus', url: 'https://github.com/maxwellito/vivus', desc: 'Animates SVGs with a hand-drawing effect. Logo reveals that draw themselves.' },
      { name: '@barba/core', url: 'https://github.com/barbajs/barba', desc: 'Cinematic page transitions. Makes multi-page sites feel like SPAs.' },
      { name: '@formkit/auto-animate', url: 'https://github.com/formkit/auto-animate', desc: 'Zero-config: one line makes DOM mutations and list reordering look polished.' },
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
export default function WebDesignArsenalPage() {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set(SKILL_CATEGORIES.map((c) => c.name)),
  )
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState('')

  const headlineRef = useRef<HTMLHeadingElement>(null)
  const heroBgRef = useRef<HTMLDivElement>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const statRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null])

  const toggleCategory = useCallback((name: string) => {
    setOpenCategories((prev) => {
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

  // GSAP + SplitType headline reveal
  useEffect(() => {
    if (!headlineRef.current) return
    let split: { chars: Element[]; revert: () => void } | null = null
    ;(async () => {
      const { default: SplitType } = await import('split-type')
      if (!headlineRef.current) return
      split = new SplitType(headlineRef.current, { types: 'chars' }) as unknown as {
        chars: Element[]
        revert: () => void
      }
      gsap.set(split.chars, { opacity: 0, y: 60, rotateX: -20 })
      gsap.to(split.chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.0,
        stagger: 0.018,
        ease: 'power4.out',
        delay: 0.3,
      })
    })()
    return () => { if (split) split.revert() }
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

  // Parallax: hero background image scrolls at 0.4x rate
  useEffect(() => {
    const bg = heroBgRef.current
    if (!bg) return
    const handleScroll = () => {
      bg.style.transform = `translateY(${window.scrollY * 0.4}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Canvas floating particles
  useEffect(() => {
    const canvas = particleCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    type Particle = { x: number; y: number; r: number; dx: number; dy: number; alpha: number; color: string }
    const colors = ['#8B79D4', '#F5C3C6', '#9D8FE0', '#FCF4EB']
    const particles: Particle[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.3,
      dy: Math.random() * 0.4 + 0.15,
      alpha: Math.random() * 0.35 + 0.05,
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
    const values = [24, 3, 1]
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setEmailLoading(true)
    setEmailError('')
    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'web-design-arsenal' }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setEmailError('Something went wrong. Please try again.')
    } finally {
      setEmailLoading(false)
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Build Gorgeous Websites with AI Using Claude Code',
    description:
      'A free prompt that installs 24 of the best web design tools and libraries in seconds. No coding experience needed. Works with Claude Code.',
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
        name: 'Copy the prompt',
        text: 'Copy the free web design toolkit install prompt.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Paste into your AI tool',
        text: 'Open Claude Code, Codex, or Gemini CLI and paste. Everything installs automatically.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Describe what you want',
        text: 'Your AI now has professional design intelligence. Describe your site and it builds something beautiful.',
        position: 3,
      },
    ],
    tool: [
      { '@type': 'HowToTool', name: 'Claude Code' },
      { '@type': 'HowToTool', name: 'Codex' },
      { '@type': 'HowToTool', name: 'Gemini CLI' },
    ],
    totalTime: 'PT3H',
    supply: [
      { '@type': 'HowToSupply', name: 'GSAP animation library' },
      { '@type': 'HowToSupply', name: 'Framer Motion' },
      { '@type': 'HowToSupply', name: 'Lenis smooth scroll' },
      { '@type': 'HowToSupply', name: 'tsparticles' },
      { '@type': 'HowToSupply', name: 'Three.js' },
    ],
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

        {/* ================================================================ */}
        {/* SECTION 1: HERO -- full-bleed image with parallax + fade to black */}
        {/* ================================================================ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-8 pt-16 sm:pt-20 overflow-hidden">


          {/* Aurora glow blobs (subtle, on top of image) */}
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

          {/* Floating particles canvas */}
          <canvas
            ref={particleCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Content */}
          <div className="relative z-10 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-10 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
                Free from the{' '}
                <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#BDB3E8] transition-colors underline underline-offset-2 decoration-[#7C69C7]/40">
                  Business Automation Mastermind
                </a>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-3 sm:whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]"
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
              Build Gorgeous Websites with AI
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-[#FCF4EB] font-bold mb-8"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(1rem, 2.8vw, 2.2rem)',
                lineHeight: 1.1,
              }}
            >
              The best 24 tools. One prompt.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.6 }}
              className="text-[#FCF4EB]/55 text-base sm:text-xl leading-relaxed max-w-xl mx-auto mb-12"
            >
              Paste it into your AI coding tool. Your entire professional design toolkit installs automatically -- and you start building.
            </motion.p>

            {/* Works in strip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-14"
            >
              <span className="text-[#FCF4EB]/28 text-xs uppercase tracking-widest">Works in</span>
              {COMPATIBLE_TOOLS.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.09] hover:border-[#7C69C7]/35 transition-all duration-200"
                  title={tool.detail}
                >
                  <span className="text-[#9D8FE0] text-sm">{tool.logo}</span>
                  <span className="text-[#FCF4EB]/75 text-sm font-medium">{tool.name}</span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{
                      background: tool.badge === 'Full install' ? 'rgba(124,105,199,0.18)' : 'rgba(255,255,255,0.06)',
                      color: tool.badge === 'Full install' ? '#9D8FE0' : '#FCF4EB44',
                      border: tool.badge === 'Full install' ? '1px solid rgba(124,105,199,0.3)' : '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {tool.badge}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.0 }}
              className="flex items-center justify-center gap-2 text-[#FCF4EB]/22 text-sm mt-8"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              <span>Scroll to get the prompt</span>
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
              From idea to live site in an afternoon
            </h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { step: '01', title: 'Copy the prompt', body: 'Hit Copy above. The entire install command lands in your clipboard.' },
              { step: '02', title: 'Paste into your AI tool', body: 'Open Claude Code, Codex, or Gemini CLI and paste. Everything installs automatically.' },
              { step: '03', title: 'Describe what you want', body: 'Your AI now has professional design intelligence. Describe your site and it builds something genuinely beautiful.' },
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
        {/* SECTION 3: PARTICIPANT TESTIMONIAL                               */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glow-card flex flex-col md:flex-row items-center gap-8 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 md:p-10"
          >
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-[#F5C3C6]/30 ring-4 ring-[#F5C3C6]/08">
                <Image
                  src="/participant-johanna.png"
                  alt="Johanna, Cohort 1"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[#FCF4EB]/72 text-base sm:text-lg leading-relaxed italic mb-3">
                &ldquo;I have particles floating in the background, a circle following my cursor, things glowing. I could not believe I built this in one session.&rdquo;
              </p>
              <p className="text-[#F5C3C6] text-sm font-semibold">Johanna</p>
              <p className="text-[#FCF4EB]/40 text-xs">Cohort 1</p>
            </div>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 5: MASTERMIND CTA (pink gradient, magnetic button)       */}
        {/* ================================================================ */}
        <MastermindCTA />

        {/* ================================================================ */}
        {/* SECTION 6: PARTICIPANT TESTIMONIALS                              */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
              Real reactions from the{' '}
              <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]">
                Mastermind
              </a>
            </h2>
            <p className="text-[#FCF4EB]/35 text-sm max-w-md mx-auto">What people said the first time they built a website in one session.</p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                photo: '/participant-sundari.jpg',
                name: 'SunDari',
                quote: 'I used to pay all these people; now I can do it myself.',
              },
              {
                photo: '/participant-johanna.png',
                name: 'Johanna',
                quote: 'I have particles floating in the background, a circle following my cursor, things glowing. I could not believe I built this in one session.',
              },
              {
                photo: '/participant-ronnie.jpg',
                name: 'Ronnie',
                quote: 'It pulled in my calendar link, my WhatsApp, all my deck photos. This is 90% of the website I wanted. In 45 minutes.',
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glow-card flex flex-col bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6"
              >
                <p className="text-[#FCF4EB]/70 text-sm leading-relaxed italic mb-5 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-[#7C69C7]/25 flex-shrink-0">
                    <Image
                      src={t.photo}
                      alt={t.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[#9D8FE0] text-sm font-semibold">{t.name}</p>
                    <p className="text-[#FCF4EB]/40 text-xs">Cohort 1</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 7: THE ONE PROMPT                                         */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
                The Prompt
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] mb-4">
                Copy. Paste. Done.
              </h2>
              <p className="text-[#FCF4EB]/45 max-w-xl mx-auto leading-relaxed">
                In the{' '}
                <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="text-[#9D8FE0] hover:text-[#BDB3E8] transition-colors">
                  Business Automation Mastermind
                </a>
                , this is how we go from zero to a fully equipped design environment in minutes.
              </p>
            </div>

            {/* Inline code block with text wrapping */}
            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.08] border-l-2 border-l-[#7C69C7]">
              <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                <span className="text-xs text-[#FCF4EB]/40 font-mono">web-design-toolkit-install</span>
                <InlineCopyButton text={THE_PROMPT} />
              </div>
              <pre
                className="p-5 text-sm font-mono leading-[1.75] text-[#FCF4EB]/82"
                style={{ background: '#0d0d0d', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                <code>{THE_PROMPT}</code>
              </pre>
            </div>

            {/* Big CTA copy button */}
            <PromptCopyButton prompt={THE_PROMPT} />

            <p className="text-[#FCF4EB]/20 text-[11px] text-center mt-5 max-w-md mx-auto leading-relaxed">
              I already scanned these packages for anything malicious and everything checked out. I still encourage everyone to do their own scan before installing anything new.
            </p>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 8: STATS                                                  */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pt-6 pb-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { idx: 0, label: 'skills and libraries' },
              { idx: 1, label: 'AI coding tools supported' },
              { idx: 2, label: 'prompt to install everything' },
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
        {/* SECTION 9: WHAT'S INSTALLED                                      */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
              Everything in this prompt
            </h2>
            <p className="text-[#FCF4EB]/35 text-sm max-w-lg mx-auto">
              Every item links to its GitHub page so you can review it before installing.
            </p>
          </motion.div>

          <div className="space-y-3">
            {SKILL_CATEGORIES.map((cat, i) => {
              const isOpen = openCategories.has(cat.name)
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleCategory(cat.name)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.025] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#FCF4EB] font-semibold text-sm sm:text-base">{cat.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#9D8FE0] bg-[#7C69C7]/12 border border-[#7C69C7]/20 px-2 py-0.5 rounded-full">
                        {cat.count}
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
                        {cat.skills.map((skill) => (
                          <a
                            key={skill.name}
                            href={skill.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.05] transition-colors group"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7C69C7] mt-[7px] flex-shrink-0" />
                            <div>
                              <span className="text-[#9D8FE0] text-sm font-medium group-hover:text-[#BDB3E8] transition-colors">
                                {skill.name}
                              </span>
                              <p className="text-[#FCF4EB]/34 text-xs leading-relaxed mt-0.5">
                                {skill.desc}
                              </p>
                            </div>
                          </a>
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
            P.S. This page took 4 minutes to build with these exact tools. I only looked at it once :)
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
// Mastermind CTA -- extracted so magnetic hook has clean scope
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
// Inline copy button (for the code block header)
// ---------------------------------------------------------------------------
function InlineCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
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
// Big CTA copy button with confetti
// ---------------------------------------------------------------------------
function PromptCopyButton({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false)
  const magnet = useMagnet(0.22)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      confetti({
        particleCount: 140,
        spread: 85,
        colors: ['#8B79D4', '#BDB3E8', '#F5C3C6', '#FCF4EB'],
        origin: { y: 0.55 },
      })
      setTimeout(() => setCopied(false), 2500)
    } catch { /* noop */ }
  }, [prompt])

  return (
    <div className="mt-5 flex justify-center">
      <button
        ref={magnet.ref as React.RefObject<HTMLButtonElement>}
        onClick={handleCopy}
        onMouseMove={magnet.onMouseMove}
        onMouseLeave={magnet.onMouseLeave}
        className="inline-flex items-center gap-2.5 px-10 py-4 rounded-xl bg-[#7C69C7] hover:bg-[#6B5AB8] text-white font-semibold text-base active:scale-[0.97] glow-btn shadow-xl shadow-[#7C69C7]/25"
      >
        {copied ? (
          <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy the Prompt
          </>
        )}
      </button>
    </div>
  )
}

