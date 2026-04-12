'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MASTERMIND_URL = 'https://www.mastermindshq.business'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const PATHS = [
  {
    num: '01',
    title: 'DIY (free)',
    body: 'Hatchful and Namecheap are both genuinely good. Zero cost, no credit card, download-ready vectors included.',
  },
  {
    num: '02',
    title: 'DIY (paid)',
    body: 'One-time purchases from $5. Subscriptions from $3/mo. Better quality, more customization, SVG files.',
  },
  {
    num: '03',
    title: 'Hire a designer',
    body: 'Budget $50 minimum for anything worth keeping. Fiverr, 99designs, and direct hire all covered.',
  },
  {
    num: '04',
    title: 'Build with APIs',
    body: 'For developers and automation builders. Includes an honest report of what actually worked.',
  },
]

const ACCORDION_SECTIONS = [
  {
    id: 'check-first',
    label: 'Before you spend anything',
    badge: 'Step 0',
    items: [
      {
        name: 'Canva Pro',
        url: 'https://www.canva.com/create/logos/',
        desc: 'If you pay $10 to $15/mo for Canva, you already have a logo maker, brand kits for up to 1,000 brands, and 140M+ design assets. Most people never open the logo tools.',
      },
      {
        name: 'Adobe Express',
        url: 'https://www.adobe.com/express/create/logo',
        desc: 'Included in most Adobe Creative Cloud subscriptions. Has an AI logo generator and thousands of templates. Check your Adobe account before paying for anything else.',
      },
      {
        name: 'Wix, Squarespace, or Shopify',
        url: 'https://www.shopify.com/tools/logo-maker',
        desc: 'All three include free logo tools for subscribers. Hatchful is built into Shopify. If you already pay for a website builder, log in and look for the logo section.',
      },
      {
        name: 'HubSpot and other marketing tools',
        url: 'https://www.hubspot.com/',
        desc: 'Some all-in-one marketing platforms include basic brand asset tools. Worth checking your account dashboard before buying a standalone logo maker.',
      },
    ],
  },
  {
    id: 'free-tools',
    label: 'Free tools that actually deliver',
    badge: 'DIY Free',
    items: [
      {
        name: 'Hatchful by Shopify',
        url: 'https://www.shopify.com/tools/logo-maker',
        desc: 'Best completely free option. Industry-specific templates, social media variants for Facebook, Instagram, Twitter, and LinkedIn. No paywall anywhere. Download immediately.',
        recommended: true,
      },
      {
        name: 'Namecheap Logo Maker',
        url: 'https://www.namecheap.com/logo-maker/',
        desc: 'Surprisingly strong for free. AI generation, downloadable vectors, and mockup previews on shirts, business cards, and websites. No signup required.',
        recommended: true,
      },
    ],
  },
  {
    id: 'paid-onetime',
    label: 'Paid: one-time purchases',
    badge: 'DIY Paid',
    items: [
      {
        name: 'Turbologo — $19.99',
        url: 'https://turbologo.com/',
        desc: 'Best value for a one-time purchase. 3M+ icons, lifetime access, full branding kit included. Creative AI suggestions that actually vary between runs.',
        recommended: true,
      },
      {
        name: 'Brandmark.io — $25',
        url: 'https://brandmark.io/',
        desc: 'Best AI quality in this price range. Has a logo scoring tool that grades your design and explains why. Font generator and business card templates included.',
        recommended: true,
      },
      {
        name: 'Looka — $20 to download',
        url: 'https://looka.com/',
        desc: 'Generate unlimited logos for free, pay only when you download. Excellent brand kit add-on at $96/yr for full asset suite.',
      },
      {
        name: 'Designhill — $20 basic',
        url: 'https://www.designhill.com/tools/logo-maker',
        desc: 'Over 1M icons, print-ready files (PNG, SVG, EPS), commercial rights included. Good for physical product branding.',
      },
      {
        name: 'LogoAI — $29 per download',
        url: 'https://www.logoai.com/',
        desc: 'Pay per download, no subscription. Strong brand automation: generates social content, ad mockups, and stationery automatically from your logo.',
      },
      {
        name: 'Freelogodesign.org — $44.99 basic',
        url: 'https://www.freelogodesign.org/',
        desc: '2,000+ templates, 1M+ icons, lifetime updates. Confusing tier structure but solid base price.',
      },
    ],
  },
  {
    id: 'paid-subscriptions',
    label: 'Paid: subscriptions',
    badge: 'Monthly or Annual',
    items: [
      {
        name: 'Placeit — $29/yr ($2.42/mo)',
        url: 'https://placeit.net/logo-maker',
        desc: 'Best value subscription. 3,500+ logo templates, unlimited downloads, mockups, and video templates. Annual plan is exceptional.',
        recommended: true,
      },
      {
        name: 'BrandCrowd — $3/mo (annual)',
        url: 'https://www.brandcrowd.com/',
        desc: '300,000+ pre-made logos and 224,000+ templates. Huge library, unlimited edits. Annual plan is one of the best deals anywhere.',
        recommended: true,
      },
      {
        name: 'Tailor Brands — $3.99/mo (2-yr plan)',
        url: 'https://www.tailorbrands.com/',
        desc: 'Includes website builder and business identity tools. Lifetime rights after one month. Watch for upsells during checkout.',
      },
      {
        name: 'Canva Pro — $10/mo (annual)',
        url: 'https://www.canva.com/create/logos/',
        desc: 'Better as an all-around design tool than a dedicated logo maker. Worth it if you design regularly.',
      },
      {
        name: 'Adobe Express — $8.33/mo (annual)',
        url: 'https://www.adobe.com/express/create/logo',
        desc: 'Good if you already use Adobe tools. Does not export SVG. Limited without full Creative Cloud.',
      },
    ],
  },
  {
    id: 'hire',
    label: 'Hiring a designer',
    badge: '$50 minimum',
    items: [
      {
        name: 'Fiverr — $5 to $500+',
        url: 'https://www.fiverr.com/logo-design',
        desc: 'Largest marketplace. Filter by "Level 2" or "Top Rated" sellers. Sweet spot for good work is $50 to $150. Always check portfolio before ordering.',
      },
      {
        name: '99designs — $299+',
        url: 'https://99designs.com/logo-design',
        desc: 'Design contest model: 30+ concepts from different designers. Quality floor is higher than Fiverr. Good when you want real variety. Bronze tier starts at $299.',
      },
      {
        name: 'Dribbble or Behance (direct hire)',
        url: 'https://dribbble.com/designers/logo',
        desc: 'Find a designer whose style you already love, then hire them directly. Most original output. Budget $300 to $800 for good work from an established designer.',
      },
      {
        name: 'Upwork — flat project rate',
        url: 'https://www.upwork.com/hire/logo-designers/',
        desc: 'Better for ongoing design relationships. Fixed-price logo projects typically run $100 to $300. Escrow payment protection included.',
      },
    ],
  },
  {
    id: 'apis',
    label: 'Building with APIs',
    badge: 'For builders',
    items: [
      {
        name: 'Logo Lava — Free',
        url: 'https://logolava.com',
        desc: 'Best starting point. Free, no API key, no signup. Template-based so text always renders correctly. One curl command returns a PNG logo.',
        recommended: true,
      },
      {
        name: 'HuggingFace FLUX.1-schnell — Free tier',
        url: 'https://huggingface.co/black-forest-labs/FLUX.1-schnell',
        desc: 'Best creative output of any generation API tested. Fast model, free tier available. Used in the in-house logo agent alongside Logo Lava for side-by-side comparison.',
        recommended: true,
      },
      {
        name: 'Brandfetch Logo API — 500k req/mo free',
        url: 'https://brandfetch.com/developers',
        desc: 'For fetching logos of existing companies. Returns SVG vectors plus full brand data (colors, fonts). Used by Canva and Typeform in production.',
      },
      {
        name: 'Logo.dev — generous free tier',
        url: 'https://www.logo.dev',
        desc: 'Official Clearbit replacement. Millions of logos indexed. If you were using Clearbit, switch here.',
      },
      {
        name: 'fal.ai — per image',
        url: 'https://fal.ai',
        desc: 'Cheapest text-to-image generation at scale. Supports FLUX and Stable Diffusion. Results are more variable than HuggingFace in practice.',
      },
      {
        name: 'Canva Connect API — SKIP',
        url: 'https://www.canva.dev',
        desc: 'Enterprise only (30+ seats, custom pricing). Cannot generate logos without that plan. Not worth it for independent builders.',
      },
    ],
  },
]

const LIMITATIONS = [
  { title: 'AI generation does not produce clean vectors', body: 'Models produce JPG or PNG, not SVG. For print work or scalable logos you need a template-based tool or a separate conversion step.' },
  { title: 'Font rendering in AI images is unreliable', body: 'Models frequently garble text or misspell brand names. Template-based tools like Logo Lava are far more reliable when exact text matters.' },
  { title: 'Lookup APIs only work for existing brands', body: 'Brandfetch and Logo.dev fetch logos that already exist online. They cannot create a logo for a new brand.' },
  { title: 'AI logos need prompt engineering', body: 'Getting consistent results requires specifying style, palette, text placement, and background. This takes real iteration.' },
  { title: 'Free tiers have rate limits', body: 'Brandfetch gives 500,000 req/mo free. Logo Lava handles light use well. For a production app serving thousands of users daily, plan for paid tiers.' },
]

const MCP_SERVERS = [
  { name: 'brandfetch-mcp', url: 'https://github.com/djmoore711/brandfetch-mcp', desc: 'Fetch any company\'s logo, colors, and fonts by domain. Plug directly into Claude Code. Needs a free Brandfetch key.' },
  { name: 'MCP-LOGO-GEN', url: 'https://github.com/sshtunnelvision/MCP-LOGO-GEN', desc: 'Generate logos, remove backgrounds, auto-scale. Powered by fal.ai. Needs a FAL key.' },
  { name: 'Icons8 MCP', url: 'https://github.com/icons8/icons8-mcp', desc: '368,000+ icons across 116 styles. Free PNGs, full SVG with API key.' },
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
export default function LogoMakerGuidePage() {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(ACCORDION_SECTIONS.map((s) => s.id)),
  )
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const statRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null])

  const toggleSection = useCallback((id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  // Load Cormorant Garamond font
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
    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: Math.random() * 0.7 + 0.3,
      alpha: Math.random() * 0.55 + 0.1,
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
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  // CountUp stats
  useEffect(() => {
    const values = [22, 4, 5]
    const observer = new IntersectionObserver((entries) => {
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
    }, { threshold: 0.8 })
    statRefs.current.forEach((r) => { if (r) observer.observe(r) })
    return () => observer.disconnect()
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
        {/* HERO                                                              */}
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

          {/* Aurora blobs */}
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
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 5.5vw, 3.8rem)',
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                paddingBottom: '0.05em',
              }}
            >
              How to Get a Great Logo
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mb-5 text-[#FCF4EB]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 600,
                fontSize: 'clamp(1.1rem, 3vw, 2.2rem)',
                lineHeight: 1.15,
              }}
            >
              Free tools, paid options, hiring a designer, and building with APIs.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.6 }}
              className="text-[#FCF4EB]/55 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-6"
            >
              Every path covered from free to custom. Plus an honest account of what actually worked when building a logo maker with APIs -- and what did not.
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
              <span>Scroll to explore</span>
            </motion.div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* THE 4 PATHS                                                       */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              Four ways to get a logo. One guide that covers them all.
            </h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PATHS.map((path, i) => (
              <motion.div
                key={path.num}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6"
              >
                <div className="text-4xl font-extrabold text-[#7C69C7]/20 mb-4 font-mono">{path.num}</div>
                <h3 className="text-[#FCF4EB] font-bold text-base mb-2">{path.title}</h3>
                <p className="text-[#FCF4EB]/44 text-sm leading-relaxed">{path.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* MASTERMIND CTA                                                    */}
        {/* ================================================================ */}
        <MastermindCTA />

        {/* ================================================================ */}
        {/* TESTIMONIALS                                                      */}
        {/* ================================================================ */}
        <MastermindReactionsSection />

        {/* ================================================================ */}
        {/* ACCORDION: ALL SECTIONS                                           */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
              Everything in one place
            </h2>
            <p className="text-[#FCF4EB]/35 text-sm max-w-lg mx-auto">
              All four paths, all tools, and all APIs. Sorted cheapest to most expensive within each section.
            </p>
          </motion.div>

          <div className="space-y-3">
            {ACCORDION_SECTIONS.map((section, i) => {
              const isOpen = openSections.has(section.id)
              const itemCount = section.items.length
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.025] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#FCF4EB] font-semibold text-sm sm:text-base">{section.label}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#9D8FE0] bg-[#7C69C7]/12 border border-[#7C69C7]/20 px-2 py-0.5 rounded-full">
                        {section.badge}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#FCF4EB]/25 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-full">
                        {itemCount}
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
                          <div key={item.name} className="flex items-start gap-3 p-3 rounded-lg">
                            <div
                              className="w-1.5 h-1.5 rounded-full mt-[7px] flex-shrink-0"
                              style={{ background: (item as { recommended?: boolean }).recommended ? '#9D8FE0' : '#7C69C7' }}
                            />
                            <div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#9D8FE0] text-sm font-medium hover:text-[#BDB3E8] transition-colors"
                              >
                                {item.name} ↗
                              </a>
                              <p className="text-[#FCF4EB]/34 text-xs leading-relaxed mt-0.5">{item.desc}</p>
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
        {/* HONEST EXPERIENCE: APIs                                           */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(124,105,199,0.10) 0%, rgba(245,195,198,0.07) 100%)',
              border: '1px solid rgba(124,105,199,0.18)',
            }}
          >
            <div className="px-6 sm:px-12 py-10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#9D8FE0] mb-5">
                Honest experience report
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-4">
                What actually worked when I tried to build a logo maker
              </h2>
              <p className="text-[#FCF4EB]/55 max-w-2xl leading-relaxed mb-8">
                I spent time trying several generation APIs. The honest result: most were disappointing. Here is what I found.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: 'What did not work well',
                    color: 'rgba(252,244,235,0.05)',
                    border: 'rgba(255,255,255,0.08)',
                    labelColor: '#FCF4EB',
                    body: 'Most generation APIs produced inconsistent results, garbled text, or outputs that looked nothing like a logo. The more creative control you want, the more prompt engineering is required -- and even then results varied between runs.',
                  },
                  {
                    label: 'What actually worked',
                    color: 'rgba(124,105,199,0.10)',
                    border: 'rgba(124,105,199,0.25)',
                    labelColor: '#9D8FE0',
                    body: 'The best results came from HuggingFace with FLUX.1-schnell. It has a free tier, it is fast, and output quality is noticeably better than other APIs for creative brand concepts. If you are going to try any generation API, start here.',
                  },
                  {
                    label: 'The hybrid that works best',
                    color: 'rgba(252,244,235,0.05)',
                    border: 'rgba(255,255,255,0.08)',
                    labelColor: '#FCF4EB',
                    body: 'Logo Lava for reliable text rendering (templates) paired with HuggingFace FLUX for creative concepts. This is what the in-house logo agent does: two outputs side by side, one guaranteed, one interesting.',
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="rounded-xl p-5"
                    style={{ background: card.color, border: `1px solid ${card.border}` }}
                  >
                    <p className="text-[10px] uppercase tracking-widest mb-3 font-bold" style={{ color: card.labelColor + '80' }}>{card.label}</p>
                    <p className="text-[#FCF4EB]/70 text-sm leading-relaxed">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* LIMITATIONS                                                       */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
              Know before you build
            </h2>
            <p className="text-[#FCF4EB]/35 text-sm max-w-lg mx-auto">
              Five things that will save you hours of frustration with logo APIs.
            </p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LIMITATIONS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5"
              >
                <h3 className="text-[#F5C3C6] font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-[#FCF4EB]/44 text-xs leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* MCP SERVERS                                                       */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
              Claude Code users: plug these in directly
            </h2>
            <p className="text-[#FCF4EB]/35 text-sm max-w-lg mx-auto">
              Three MCP servers that let Claude generate or look up logos without any custom code.
            </p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-3">
            {MCP_SERVERS.map((mcp, i) => (
              <motion.div
                key={mcp.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6"
              >
                <a
                  href={mcp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm font-bold text-[#9D8FE0] hover:text-[#BDB3E8] transition-colors block mb-3"
                >
                  {mcp.name} ↗
                </a>
                <p className="text-[#FCF4EB]/44 text-xs leading-relaxed">{mcp.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* STATS                                                             */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pt-6 pb-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { idx: 0, label: 'tools and APIs compared' },
              { idx: 1, label: 'paths to getting a great logo' },
              { idx: 2, label: 'free tools that actually work' },
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
        {/* QUICK REFERENCE TABLE                                             */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
                Every scenario in one table
              </h2>
              <p className="text-[#FCF4EB]/35 text-sm">Find your situation. Pick the right tool.</p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(124,105,199,0.08)' }}>
                    <th className="text-left py-3 px-5 font-semibold text-[#FCF4EB]/50 uppercase tracking-wider text-[10px]">Goal</th>
                    <th className="text-left py-3 px-5 font-semibold text-[#FCF4EB]/50 uppercase tracking-wider text-[10px]">Best pick</th>
                    <th className="text-left py-3 px-5 font-semibold text-[#FCF4EB]/50 uppercase tracking-wider text-[10px]">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { goal: 'Already paying for Canva Pro', pick: 'Use Canva (you have it)', cost: '$0 extra', url: 'https://www.canva.com/create/logos/' },
                    { goal: 'Free, fast, no account needed', pick: 'Hatchful by Shopify', cost: 'Free', url: 'https://www.shopify.com/tools/logo-maker' },
                    { goal: 'One-time purchase, best quality', pick: 'Turbologo', cost: '$19.99', url: 'https://turbologo.com/' },
                    { goal: 'Subscription, unlimited downloads', pick: 'Placeit', cost: '$29/yr', url: 'https://placeit.net/logo-maker' },
                    { goal: 'Hire a designer, tight budget', pick: 'Fiverr (Level 2+ sellers)', cost: '$50 to $150', url: 'https://www.fiverr.com/logo-design' },
                    { goal: 'API: generate new logos (text-safe)', pick: 'Logo Lava', cost: 'Free', url: 'https://logolava.com' },
                    { goal: 'API: best AI creative output', pick: 'HuggingFace FLUX.1-schnell', cost: 'Free tier', url: 'https://huggingface.co/black-forest-labs/FLUX.1-schnell' },
                    { goal: 'API: look up existing brand logos', pick: 'Brandfetch', cost: 'Free (500k/mo)', url: 'https://brandfetch.com/developers' },
                  ].map((row, i, arr) => (
                    <tr
                      key={row.goal}
                      style={{
                        borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                      }}
                    >
                      <td className="py-3 px-5 text-[#FCF4EB]/55 text-xs">{row.goal}</td>
                      <td className="py-3 px-5">
                        <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-[#9D8FE0] hover:text-[#BDB3E8] transition-colors font-medium text-xs">
                          {row.pick} ↗
                        </a>
                      </td>
                      <td className="py-3 px-5 text-[#FCF4EB]/35 text-xs">{row.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECOND CTA                                                        */}
        {/* ================================================================ */}
        <MastermindCTA />

        {/* P.S. */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6 pb-16 text-center"
        >
          <p className="text-[#FCF4EB]/22 text-sm leading-relaxed italic">
            P.S. This is the same research used to build the in-house logo maker agent. You are getting the finished version of what took several hours of API testing to figure out.
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
            Want to build things like this yourself?
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
            {['Small group, capped at 15', 'We meet weekly', 'Idea to live tool in one session'].map((item) => (
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
