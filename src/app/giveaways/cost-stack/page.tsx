'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'
import GiveawayEmailModal from '@/components/giveaways/GiveawayEmailModal'
import { copyWithConfetti } from '@/lib/copyWithConfetti'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MASTERMIND_URL = 'https://www.mastermindshq.business'

// Every proof line below is a DOCUMENTED member statement from
// projects/mastermind/BRAND-BRAIN.md sections 21A, 22, 23 and 25.
// Rules that govern this page:
//   1. Prefilled prices are PUBLIC LIST PRICES, never a member's actual bill.
//   2. Never attribute a list price to a member as their saving.
//   3. Never convert cost avoided into revenue, ROI, or "made back".
//   4. Never claim a replacement nobody in the room has stated on record.
//   5. No em dashes. No emoji as icons.
// ---------------------------------------------------------------------------

type Status = 'documented' | 'unproven' | 'not-documented'

/**
 * A face for every named graduate. `pos` and `zoom` frame each photo on the
 * face: the source shots range from a tight portrait to a very wide landscape,
 * so a plain centred square crop cuts heads off or leaves the face tiny. Values
 * were set by eye against each image, not guessed.
 */
type Person = { name: string; photo: string; pos: string; zoom: number }

const PEOPLE: Record<string, Person> = {
  beata: { name: 'Beata Fuller', photo: '/images/participants/beata-fuller.webp', pos: '36% 28%', zoom: 2.1 },
  vonetta: { name: 'Vonetta Taylor', photo: '/images/participants/vonetta-taylor.webp', pos: '51% 24%', zoom: 2.2 },
  quincee: { name: 'Quincee Lark', photo: '/images/participants/quincee-lark.jpg', pos: '47% 25%', zoom: 1.6 },
  naomi: { name: 'Naomi Galinski', photo: '/images/participants/naomi-galinski.webp', pos: '48% 22%', zoom: 1.45 },
  jonathan: { name: 'Jonathan Marshall', photo: '/images/participants/jonathan-marshall.webp', pos: '62% 26%', zoom: 1.6 },
  alicia: { name: 'Alicia Hoffendahl', photo: '/images/participants/alice-hoffendahl.jpg', pos: '51% 26%', zoom: 3.1 },
  pete: { name: 'Pete Longworth', photo: '/images/participants/pete-longworth.jpeg', pos: '49% 30%', zoom: 1.25 },
  wes: { name: 'Wes Jones', photo: '/images/participants/wesley-jones.webp', pos: '50% 22%', zoom: 1.4 },
}

type Tool = {
  id: string
  name: string
  what: string
  defaultMonthly: number
  rangeLabel: string
  status: Status
  /** Key into PEOPLE. Absent when no member is on record for this line. */
  person?: keyof typeof PEOPLE
  proof: string
}

const TOOLS: Tool[] = [
  {
    id: 'gohighlevel',
    name: 'GoHighLevel',
    what: 'Funnels, CRM, booking, email, all in one',
    defaultMonthly: 97,
    rangeLabel: '$97 to $497 a month',
    status: 'documented',
    person: 'naomi',
    proof:
      'Naomi Galinski migrated her site off GoHighLevel onto Vercel with every booking link preserved.',
  },
  {
    id: 'kajabi',
    name: 'Kajabi',
    what: 'Courses, memberships, landing pages',
    defaultMonthly: 149,
    rangeLabel: '$149 to $399 a month',
    status: 'unproven',
    proof:
      'Nobody in the room has named Kajabi on record. It is the same class of tool as the course and site platforms members did replace, so treat this as likely rather than proven.',
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    what: 'Email list and broadcasts',
    defaultMonthly: 13,
    rangeLabel: '$13 to $350 a month, depending on list size',
    status: 'documented',
    person: 'jonathan',
    proof:
      'Jonathan Marshall moved his email onto his own domain through Resend. His words: "The whole point is get rid of MailChimp and have more flexibility."',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    what: 'Storefront and checkout',
    defaultMonthly: 39,
    rangeLabel: '$39 to $105 a month',
    status: 'documented',
    person: 'alicia',
    proof:
      'Alicia Hoffendahl cancelled Shopify. Her words: "I was paying for tons of things that I didn’t need and just made things more complicated."',
  },
  {
    id: 'manychat',
    name: 'ManyChat',
    what: 'DM automation and comment triggers',
    defaultMonthly: 15,
    rangeLabel: '$15 to $65 a month',
    status: 'documented',
    person: 'alicia',
    proof: 'Alicia Hoffendahl cancelled ManyChat in the same clear out.',
  },
  {
    id: 'vsl',
    name: 'Video or VSL hosting',
    what: 'Wistia, Vimeo Pro, or similar',
    defaultMonthly: 20,
    rangeLabel: '$20 to $99 a month',
    status: 'documented',
    person: 'quincee',
    proof:
      'Quincee Lark dropped her VSL hosting subscription, moved her mail subscription and brought her website in house.',
  },
  {
    id: 'sitebuilder',
    name: 'Squarespace or Wix',
    what: 'Website builder subscription',
    defaultMonthly: 16,
    rangeLabel: '$16 to $49 a month',
    status: 'documented',
    person: 'pete',
    proof:
      'Pete Longworth spent 15 years on Squarespace only, then built an entire brand and site from code and wrote every word of it himself.',
  },
  {
    id: 'hosting',
    name: 'Website hosting',
    what: 'Whatever keeps the site up',
    defaultMonthly: 10,
    rangeLabel: '$10 to $50 a month',
    status: 'documented',
    person: 'wes',
    proof:
      'Wes Jones runs three live sites on custom domains that he built and deploys himself.',
  },
]

const DEV_PROOF =
  'Vonetta Taylor paid a contractor $4,000 for a website she did not like, then rebuilt it herself in five minutes. She used to charge her own clients $40,000 for that work.'

const VA_PROOF =
  'This one stays honest. One graduate is letting one team member go, and that is real. Nobody in the room is on record replacing a whole team, and every system built in the program still has a human in it. The documented claim is narrower and stronger: you stop paying other people for work you can now do yourself.'

const QUOTE_PROOF =
  'Developers quoted Beata Fuller $200,000 over two years to build the app she described. She built the bones of it in one night. Her API spend at the time was $13.45.'

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

function money(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

// ---------------------------------------------------------------------------
// Face — a round, framed photo of a named graduate.
//
// The zoom is a transform scaled about the same origin as the object-position,
// so the crop and the zoom pull toward the same point: the face. Without it,
// the wider shots render as a person standing in a garden at 36 pixels.
// ---------------------------------------------------------------------------
function Face({ person, size }: { person: Person; size: number }) {
  return (
    <span
      className="inline-block rounded-full overflow-hidden flex-shrink-0"
      style={{
        width: size,
        height: size,
        border: '1px solid rgba(252,244,235,0.14)',
        background: 'rgba(255,255,255,0.05)',
      }}
    >
      <img
        src={person.photo}
        alt={person.name}
        loading="lazy"
        width={size}
        height={size}
        className="w-full h-full object-cover"
        style={{
          objectPosition: person.pos,
          transform: `scale(${person.zoom})`,
          transformOrigin: person.pos,
        }}
      />
    </span>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function CostStackPage() {
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [monthly, setMonthly] = useState<Record<string, number>>(
    () => Object.fromEntries(TOOLS.map((t) => [t.id, t.defaultMonthly])),
  )
  const [devAnnual, setDevAnnual] = useState<number>(0)
  const [vaMonthly, setVaMonthly] = useState<number>(0)
  const [quotedBuild, setQuotedBuild] = useState<number>(0)

  const particleCanvasRef = useRef<HTMLCanvasElement>(null)

  const toggle = useCallback((id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
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

  // -------------------------------------------------------------------------
  // The maths. Every number here comes from what the visitor typed.
  // -------------------------------------------------------------------------
  const result = useMemo(() => {
    const picked = TOOLS.filter((t) => selected[t.id])
    const documented = picked.filter((t) => t.status === 'documented')
    const unproven = picked.filter((t) => t.status === 'unproven')

    const documentedAnnual =
      documented.reduce((sum, t) => sum + (monthly[t.id] || 0) * 12, 0) + (devAnnual || 0)
    const unprovenAnnual = unproven.reduce((sum, t) => sum + (monthly[t.id] || 0) * 12, 0)
    const notDocumentedAnnual = (vaMonthly || 0) * 12
    const total = documentedAnnual + unprovenAnnual + notDocumentedAnnual

    return {
      picked,
      documented,
      unproven,
      documentedAnnual,
      unprovenAnnual,
      notDocumentedAnnual,
      total,
      hasAnything: total > 0 || quotedBuild > 0,
    }
  }, [selected, monthly, devAnnual, vaMonthly, quotedBuild])

  // -------------------------------------------------------------------------
  // The prompt, built from what they actually entered.
  // -------------------------------------------------------------------------
  const auditPrompt = useMemo(() => {
    const lines: string[] = []
    result.picked.forEach((t) => {
      lines.push(`- ${t.name}: ${money(monthly[t.id] || 0)} a month`)
    })
    if (devAnnual > 0) lines.push(`- Web developer or designer: ${money(devAnnual)} a year`)
    if (vaMonthly > 0) lines.push(`- Assistant or VA: ${money(vaMonthly)} a month`)
    if (quotedBuild > 0) lines.push(`- A build I was quoted ${money(quotedBuild)} for and never did`)

    const stack = lines.length > 0 ? lines.join('\n') : '- (list your tools here, one per line, with what you pay)'

    return `I want to work out which parts of my software stack I could run myself instead of paying for.

Here is what I currently pay for:

${stack}

Do this in order. Do not ask me questions first.

1. For each line, tell me what job it actually does in my business. Not the feature list. The job.
2. Sort them into three groups: I could replace this myself in an afternoon, I could replace this with a week of work, and I should keep paying for this.
3. For anything in the first group, give me the specific replacement and the first step to move it. Name the tool or the approach, not a category.
4. Tell me the order to do them in, easiest and highest cost first.
5. Flag anything where replacing it would put my data, my payments, or my client relationships at risk. I would rather keep paying than break something that works.
6. Finish with the one I should start with this week and why.

Be direct about which ones are not worth replacing. I am not trying to cancel everything. I am trying to stop paying for work I can now do myself.`
  }, [result.picked, monthly, devAnnual, vaMonthly, quotedBuild])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'The Cost Stack Audit',
    applicationCategory: 'BusinessApplication',
    description:
      'A free calculator that totals what you pay for business software, freelancers and subscriptions every year, then shows which parts members of the AI Business Mastermind replaced themselves.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Person', name: 'Joe Che', url: MASTERMIND_URL },
    publisher: {
      '@type': 'Organization',
      name: 'AI Business Mastermind',
      url: MASTERMIND_URL,
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
        .glow-card { transition: box-shadow 0.3s ease, border-color 0.3s ease; }
        .glow-card:hover {
          box-shadow: 0 0 28px rgba(124, 105, 199, 0.12), 0 0 0 1px rgba(124, 105, 199, 0.18);
          border-color: rgba(124, 105, 199, 0.22) !important;
        }
        .glow-btn { transition: box-shadow 0.2s ease, background-color 0.15s ease, transform 0.1s ease-out; }
        .glow-btn:hover { box-shadow: 0 0 32px rgba(124, 105, 199, 0.45), 0 0 60px rgba(124, 105, 199, 0.2); }
        .glow-btn-pink:hover { box-shadow: 0 0 32px rgba(245, 195, 198, 0.5), 0 0 60px rgba(245, 195, 198, 0.2); }
        .stack-input::-webkit-outer-spin-button,
        .stack-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .stack-input { -moz-appearance: textfield; }
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
                  <span className="hidden sm:inline">AI Business Mastermind</span>
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
              The Cost Stack Audit
            </motion.h1>

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
              Add up what you pay every year. Then see what you could stop paying.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.6 }}
              className="text-[#FCF4EB]/55 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-6"
            >
              Tick what you pay for, correct the numbers to what you actually pay, and you get your annual total in about 60 seconds. Every line comes back marked with whether someone in the mastermind has already replaced it, and said so on the record.
            </motion.p>

            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              href="#audit"
              className="inline-block px-10 py-4 rounded-xl bg-[#7C69C7] hover:bg-[#6e5db8] text-[#FCF4EB] font-bold text-base active:scale-[0.98] glow-btn text-center"
            >
              Start the audit
            </motion.a>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.0 }}
              className="flex items-center justify-center gap-2 text-[#FCF4EB]/22 text-sm mt-6"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              <span>Nothing to install. Nothing saved.</span>
            </motion.div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 2: THE AUDIT                                             */}
        {/* ================================================================ */}
        <section id="audit" className="max-w-3xl mx-auto px-6 py-14 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
              Step 1
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
              What are you paying for right now?
            </h2>
            <p className="text-[#FCF4EB]/40 text-sm max-w-lg mx-auto leading-relaxed">
              The prices are prefilled with the cheapest public plan. They are almost certainly lower than what you pay, so change them to your real number. Nothing you type leaves your browser.
            </p>
          </motion.div>

          <div className="space-y-3">
            {TOOLS.map((tool, i) => {
              const on = !!selected[tool.id]
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="glow-card rounded-xl border overflow-hidden"
                  style={{
                    background: on ? 'rgba(124,105,199,0.08)' : 'rgba(255,255,255,0.04)',
                    borderColor: on ? 'rgba(124,105,199,0.30)' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
                    <button
                      onClick={() => toggle(tool.id)}
                      aria-pressed={on}
                      aria-label={`Toggle ${tool.name}`}
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-150"
                      style={{
                        background: on ? '#7C69C7' : 'rgba(255,255,255,0.05)',
                        border: on ? '1px solid #7C69C7' : '1px solid rgba(255,255,255,0.15)',
                      }}
                    >
                      {on && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FCF4EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </button>

                    <button onClick={() => toggle(tool.id)} className="flex-1 text-left min-w-0">
                      <div className="text-[#FCF4EB] font-semibold text-sm sm:text-base truncate">{tool.name}</div>
                      <div className="text-[#FCF4EB]/34 text-xs truncate">{tool.what}</div>
                    </button>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[#FCF4EB]/30 text-sm">$</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={monthly[tool.id] ?? 0}
                        onChange={(e) => {
                          const v = Math.max(0, Number(e.target.value) || 0)
                          setMonthly((prev) => ({ ...prev, [tool.id]: v }))
                          if (!selected[tool.id] && v > 0) setSelected((prev) => ({ ...prev, [tool.id]: true }))
                        }}
                        className="stack-input w-16 sm:w-20 bg-white/[0.06] border border-white/[0.10] rounded-lg px-2 py-1.5 text-right text-sm text-[#FCF4EB] focus:outline-none focus:border-[#7C69C7]/60"
                      />
                      <span className="text-[#FCF4EB]/25 text-xs">/mo</span>
                    </div>
                  </div>
                  <div className="px-4 pb-3 sm:px-5 text-[#FCF4EB]/22 text-[11px]">
                    Public list price: {tool.rangeLabel}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* People, not software */}
          <div className="mt-8 space-y-3">
            <div className="text-[#FCF4EB]/35 text-xs uppercase tracking-widest mb-1">And the people</div>

            <div className="glow-card rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="text-[#9D8FE0] text-sm">◆</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[#FCF4EB] font-semibold text-sm sm:text-base">Web developer or designer</div>
                  <div className="text-[#FCF4EB]/34 text-xs">What you spent on your site and changes to it in the last year</div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[#FCF4EB]/30 text-sm">$</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={devAnnual}
                    onChange={(e) => setDevAnnual(Math.max(0, Number(e.target.value) || 0))}
                    className="stack-input w-20 sm:w-24 bg-white/[0.06] border border-white/[0.10] rounded-lg px-2 py-1.5 text-right text-sm text-[#FCF4EB] focus:outline-none focus:border-[#7C69C7]/60"
                  />
                  <span className="text-[#FCF4EB]/25 text-xs">/yr</span>
                </div>
              </div>
            </div>

            <div className="glow-card rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="text-[#9D8FE0] text-sm">◇</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[#FCF4EB] font-semibold text-sm sm:text-base">Assistant or VA</div>
                  <div className="text-[#FCF4EB]/34 text-xs">Only the part that is admin, not the part that is judgement</div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[#FCF4EB]/30 text-sm">$</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={vaMonthly}
                    onChange={(e) => setVaMonthly(Math.max(0, Number(e.target.value) || 0))}
                    className="stack-input w-20 sm:w-24 bg-white/[0.06] border border-white/[0.10] rounded-lg px-2 py-1.5 text-right text-sm text-[#FCF4EB] focus:outline-none focus:border-[#7C69C7]/60"
                  />
                  <span className="text-[#FCF4EB]/25 text-xs">/mo</span>
                </div>
              </div>
            </div>

            <div className="glow-card rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="text-[#9D8FE0] text-sm">◈</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[#FCF4EB] font-semibold text-sm sm:text-base">The thing you were quoted for and never built</div>
                  <div className="text-[#FCF4EB]/34 text-xs">The app, the portal, the tool. One time, kept out of your annual total</div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[#FCF4EB]/30 text-sm">$</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={quotedBuild}
                    onChange={(e) => setQuotedBuild(Math.max(0, Number(e.target.value) || 0))}
                    className="stack-input w-20 sm:w-24 bg-white/[0.06] border border-white/[0.10] rounded-lg px-2 py-1.5 text-right text-sm text-[#FCF4EB] focus:outline-none focus:border-[#7C69C7]/60"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 3: THE RESULT                                            */}
        {/* ================================================================ */}
        {result.hasAnything && (
          <section className="max-w-3xl mx-auto px-6 pb-14 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(124,105,199,0.10) 0%, rgba(157,143,224,0.05) 100%)',
                border: '1px solid rgba(124,105,199,0.20)',
              }}
            >
              <div className="px-5 py-8 sm:px-8 sm:py-10">
                <div className="text-center mb-8">
                  <div className="text-[#FCF4EB]/35 text-xs uppercase tracking-widest mb-3">
                    Your stack, every year
                  </div>
                  <div
                    className="font-extrabold tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]"
                    style={{ fontSize: 'clamp(2.6rem, 11vw, 4.5rem)', lineHeight: 1.05 }}
                  >
                    {money(result.total)}
                  </div>
                  <div className="text-[#FCF4EB]/40 text-sm mt-2">
                    {money(result.total / 12)} a month, before anything you forgot
                  </div>
                </div>

                {result.documentedAnnual > 0 && (
                  <div className="rounded-xl p-5 mb-4" style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.18)' }}>
                    <div className="flex items-baseline justify-between gap-3 mb-3">
                      <span className="text-[#34d399] font-bold text-sm uppercase tracking-widest">Someone dropped this on the record</span>
                      <span className="text-[#34d399] font-extrabold tabular-nums text-lg">{money(result.documentedAnnual)}</span>
                    </div>
                    <div className="space-y-3">
                      {result.documented.map((t) => (
                        <div key={t.id} className="flex items-start gap-3">
                          {t.person ? (
                            <Face person={PEOPLE[t.person]} size={40} />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#34d399] mt-[7px] flex-shrink-0" />
                          )}
                          <div>
                            <span className="text-[#FCF4EB]/85 text-sm font-medium">{t.name}</span>
                            {t.person && (
                              <span className="text-[#34d399]/70 text-xs block sm:inline sm:ml-2">{PEOPLE[t.person].name}</span>
                            )}
                            <p className="text-[#FCF4EB]/40 text-xs leading-relaxed mt-0.5">{t.proof}</p>
                          </div>
                        </div>
                      ))}
                      {devAnnual > 0 && (
                        <div className="flex items-start gap-3">
                          <Face person={PEOPLE.vonetta} size={40} />
                          <div>
                            <span className="text-[#FCF4EB]/85 text-sm font-medium">Web developer or designer</span>
                            <span className="text-[#34d399]/70 text-xs block sm:inline sm:ml-2">{PEOPLE.vonetta.name}</span>
                            <p className="text-[#FCF4EB]/40 text-xs leading-relaxed mt-0.5">{DEV_PROOF}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {result.unprovenAnnual > 0 && (
                  <div className="rounded-xl p-5 mb-4" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.18)' }}>
                    <div className="flex items-baseline justify-between gap-3 mb-3">
                      <span className="text-[#fbbf24] font-bold text-sm uppercase tracking-widest">Likely, but nobody on record</span>
                      <span className="text-[#fbbf24] font-extrabold tabular-nums text-lg">{money(result.unprovenAnnual)}</span>
                    </div>
                    <div className="space-y-3">
                      {result.unproven.map((t) => (
                        <div key={t.id} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] mt-[7px] flex-shrink-0" />
                          <div>
                            <span className="text-[#FCF4EB]/85 text-sm font-medium">{t.name}</span>
                            <p className="text-[#FCF4EB]/40 text-xs leading-relaxed mt-0.5">{t.proof}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.notDocumentedAnnual > 0 && (
                  <div className="rounded-xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
                    <div className="flex items-baseline justify-between gap-3 mb-3">
                      <span className="text-[#FCF4EB]/55 font-bold text-sm uppercase tracking-widest">Not a documented replacement</span>
                      <span className="text-[#FCF4EB]/55 font-extrabold tabular-nums text-lg">{money(result.notDocumentedAnnual)}</span>
                    </div>
                    <p className="text-[#FCF4EB]/40 text-xs leading-relaxed">{VA_PROOF}</p>
                  </div>
                )}

                {quotedBuild > 0 && (
                  <div className="rounded-xl p-5" style={{ background: 'rgba(245,195,198,0.06)', border: '1px solid rgba(245,195,198,0.15)' }}>
                    <div className="flex items-baseline justify-between gap-3 mb-3">
                      <span className="text-[#F5C3C6] font-bold text-sm uppercase tracking-widest">The one you never built</span>
                      <span className="text-[#F5C3C6] font-extrabold tabular-nums text-lg">{money(quotedBuild)}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Face person={PEOPLE.beata} size={40} />
                      <p className="text-[#FCF4EB]/40 text-xs leading-relaxed">{QUOTE_PROOF}</p>
                    </div>
                  </div>
                )}

                <p className="text-[#FCF4EB]/22 text-[11px] leading-relaxed mt-6">
                  This is money you would stop spending, not money you would make. It is not revenue and it is not a return. Quincee Lark is the one who put the payback plainly: by the time she had rebuilt her site herself, dropped her video hosting and moved her mail subscription, the program had already paid for itself.
                </p>
              </div>
            </motion.div>
          </section>
        )}

        {/* ================================================================ */}
        {/* SECTION 4: THE PROMPT                                            */}
        {/* ================================================================ */}
        <section className="max-w-3xl mx-auto px-6 pb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
                Step 2
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
                Now find out what to do about it
              </h2>
              <p className="text-[#FCF4EB]/45 max-w-xl mx-auto leading-relaxed text-sm">
                This prompt already has your stack in it. Paste it into{' '}
                <span className="text-[#9D8FE0]">Claude</span>,{' '}
                <span className="text-[#9D8FE0]">Claude Code</span> or{' '}
                <span className="text-[#9D8FE0]">ChatGPT</span> and it comes back with what to replace, in what order, and what to leave alone.
              </p>
            </div>

            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.08]" style={{ borderLeftWidth: 2, borderLeftColor: '#7C69C7' }}>
              <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                <span className="text-xs text-[#FCF4EB]/40 font-mono">Your audit prompt</span>
                <InlineCopyButton text={auditPrompt} onAfterCopy={() => setEmailModalOpen(true)} />
              </div>
              <pre
                className="p-3 sm:p-5 text-[12px] sm:text-sm font-mono leading-[1.7] text-[#FCF4EB]/82 max-h-[420px] overflow-y-auto"
                style={{ background: '#0d0d0d', whiteSpace: 'pre-wrap', wordBreak: 'normal', overflowWrap: 'anywhere' }}
              >
                <code>{auditPrompt}</code>
              </pre>
            </div>

            <BigCopyButton prompt={auditPrompt} onAfterCopy={() => setEmailModalOpen(true)} />
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 5: THE THREE ANCHORS                                     */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pb-14 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
              Three real numbers from the room
            </h2>
            <p className="text-[#FCF4EB]/35 text-sm max-w-lg mx-auto">
              These are prices real people were quoted or paid, in their own words, on recorded sessions.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: '$200,000', person: PEOPLE.beata, body: 'Quoted $200,000 over two years to build her app. She built the bones of it in one night. API spend at the time: $13.45.' },
              { value: '$4,000', person: PEOPLE.vonetta, body: 'Paid a contractor $4,000 for a website she did not like. Rebuilt it herself in five minutes. She used to charge clients $40,000 for that work.' },
              { value: '6 months', person: PEOPLE.quincee, body: 'A website that took her six months. She can now rebuild it in about 40 minutes.' },
            ].map((a, i) => (
              <motion.div
                key={a.person.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 text-center"
              >
                <div className="flex justify-center mb-4">
                  <Face person={a.person} size={92} />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold mb-2 tabular-nums" style={{ color: '#9D8FE0' }}>
                  {a.value}
                </div>
                <div className="text-[#F5C3C6]/70 text-xs uppercase tracking-widest mb-3">{a.person.name}</div>
                <p className="text-[#FCF4EB]/45 text-sm leading-relaxed">{a.body}</p>
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
        {/* SECTION 8: HOW THIS IS CALCULATED                                */}
        {/* ================================================================ */}
        <section className="max-w-3xl mx-auto px-6 py-14 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(245,195,198,0.06) 0%, rgba(124,105,199,0.05) 100%)',
              border: '1px solid rgba(245,195,198,0.12)',
            }}
          >
            <div className="px-5 py-8 sm:px-8 sm:py-10">
              <h3 className="text-xl font-bold text-[#FCF4EB] mb-5">How this is worked out</h3>
              <div className="space-y-4 text-[#FCF4EB]/50 text-sm leading-relaxed">
                <p>
                  The total is your number, not an estimate. It is whatever you typed, multiplied out to a year. The prefilled prices are the cheapest public plan for each tool, which is why they are probably too low for you.
                </p>
                <p>
                  A line is marked as dropped on the record only when a named member said so on a recorded session. Everything else is marked honestly as likely or not documented. Nobody here is going to tell you that you will replace your whole team, because nobody in the room has done that.
                </p>
                <p>
                  What you get back is cost you stop carrying. It is not revenue, it is not a return, and it is not a promise about your business.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* P.S. NOTE                                                         */}
        {/* ================================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6 pb-16 text-center relative z-10"
        >
          <p className="text-[#FCF4EB]/22 text-sm leading-relaxed italic">
            P.S. Most people are surprised twice. Once by the total, and once by how many of the lines are things they set up years ago and never looked at again.
          </p>
        </motion.div>

        {/* Footer */}
        <div className="text-center pb-10 flex flex-col items-center gap-1.5 relative z-10">
          <a
            href={MASTERMIND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FCF4EB]/14 text-xs uppercase tracking-widest hover:text-[#FCF4EB]/35 transition-colors"
          >
            AI Business Mastermind
          </a>
          <span className="text-[#FCF4EB]/10 text-xs">Created by Joe Che</span>
        </div>

      </div>

      <GiveawayEmailModal
        slug="cost-stack"
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        headingOverride="Want your cost stack breakdown emailed to you?"
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
    <section className="max-w-5xl mx-auto px-6 py-14 relative z-10">
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
              Join the AI Business Mastermind
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
// Big copy button
// ---------------------------------------------------------------------------
function BigCopyButton({ prompt, onAfterCopy }: { prompt: string; onAfterCopy?: () => void }) {
  const [copied, setCopied] = useState(false)
  const magnet = useMagnet(0.28)

  const handleCopy = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await copyWithConfetti(prompt, event)
      setCopied(true)
      setTimeout(() => setCopied(false), 3500)
      onAfterCopy?.()
    } catch { /* noop */ }
  }, [prompt, onAfterCopy])

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <button
        ref={magnet.ref as React.RefObject<HTMLButtonElement>}
        onClick={handleCopy}
        onMouseMove={magnet.onMouseMove}
        onMouseLeave={magnet.onMouseLeave}
        className="block w-full sm:inline-block sm:w-auto px-10 py-4 rounded-xl bg-[#7C69C7] hover:bg-[#6e5db8] text-[#FCF4EB] font-bold text-base active:scale-[0.98] glow-btn text-center"
      >
        {copied ? 'Copied! Paste it into Claude or ChatGPT.' : 'Copy my audit prompt'}
      </button>
    </div>
  )
}
