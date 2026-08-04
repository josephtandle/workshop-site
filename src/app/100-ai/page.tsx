'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Launch window: 12-day countdown starting 2026-06-07 (Joe-locked plan date).
// Adjust LAUNCH_DATE before any real go-live email is sent.
const LAUNCH_DATE = new Date('2026-06-19T05:00:00Z') // 2026-06-19 launch lock

const BENEFITS = [
  { icon: '01', label: 'A weekend-buildable catalog of 100 AI agent income lanes you can ship one at a time.' },
  { icon: '02', label: 'Every lane is one page: who pays, the agent stack, the starter prompt, the upgrade, and the tripwire.' },
  { icon: '03', label: 'Companion portal course turns each card into a copy-paste lesson with starter and upgrade prompts.' },
  { icon: '04', label: 'Pioneer claim: the first weekend-build catalog of solo-operator AI income lanes.' },
  { icon: '05', label: 'Voice-aligned for builders. No generic advice, no kitchen metaphors, no fluff.' },
]

const SECTIONS = [
  'Content and SEO Engines',
  'Voice and Audio Income',
  'Trading and Market Data Agents',
  'Local Services and Lead Routing',
  'E-commerce and Marketplaces',
  'Education and Cohort Income',
  'Affiliate and Rev-share Lanes',
  'Newsletters and Subscription Stacks',
  'Concierge and Operations as a Service',
  'Tools, Templates, and Productized Agents',
]

type Countdown = { days: number; hours: number; minutes: number; seconds: number; expired: boolean }

function getCountdown(): Countdown {
  const now = Date.now()
  const diff = LAUNCH_DATE.getTime() - now
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds, expired: false }
}

export default function PassiveIncome100Page() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState<Countdown | null>(null)

  useEffect(() => {
    setCountdown(getCountdown())
    const t = setInterval(() => setCountdown(getCountdown()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName || !email) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/lead-magnets/passive-income-100', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const Form = () =>
    !submitted ? (
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          placeholder="First name"
          required
          className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-[#FCF4EB] placeholder:text-[#FCF4EB]/30 focus:outline-none focus:border-[#8B79D4]/60 focus:ring-1 focus:ring-[#8B79D4]/30 transition-all text-base"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-[#FCF4EB] placeholder:text-[#FCF4EB]/30 focus:outline-none focus:border-[#8B79D4]/60 focus:ring-1 focus:ring-[#8B79D4]/30 transition-all text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3.5 rounded-xl bg-[#8B79D4] hover:bg-[#6B5AB8] text-white font-semibold text-base transition-all duration-150 disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? 'Sending...' : 'Notify me at launch'}
          </button>
        </div>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        <p className="text-[#FCF4EB]/30 text-xs">
          No spam. We send one launch email and a launch-week recap. Unsubscribe any time.
        </p>
      </form>
    ) : (
      <div className="max-w-md mx-auto bg-[#8B79D4]/10 border border-[#8B79D4]/30 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#8B79D4]/20 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9D8FE0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#FCF4EB] mb-2">You are on the list</h3>
        <p className="text-[#FCF4EB]/60 text-sm">
          We will email you on launch day with the $27 link. Check your spam folder if you do not see a welcome message in a few minutes.
        </p>
      </div>
    )

  return (
    <div className="min-h-screen bg-[#151515]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1520] via-[#151515] to-[#151515]" />
        <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8 bg-[#8B79D4]/15 text-[#9D8FE0] border border-[#8B79D4]/25">
              Pre-launch. $27 for the first 12 days.
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#FCF4EB] leading-[1.1] mb-6">
              100 Ways to Make{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]">
                Passive Income
              </span>{' '}
              with AI Agents
            </h1>

            <p className="text-[#FCF4EB]/60 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              The weekend operator&apos;s catalog of AI side income lanes for solo builders.
              One page per lane: who pays, the agent stack, the starter prompt, the upgrade, and the tripwire.
              From the team behind the build-it-yourself AI OS playbook.
            </p>
          </motion.div>

          {countdown && !countdown.expired && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-10"
            >
              {[
                { label: 'Days', value: countdown.days },
                { label: 'Hours', value: countdown.hours },
                { label: 'Min', value: countdown.minutes },
                { label: 'Sec', value: countdown.seconds },
              ].map((cell) => (
                <div key={cell.label} className="bg-white/[0.04] border border-white/[0.08] rounded-xl py-3">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#FCF4EB]">{String(cell.value).padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#FCF4EB]/40 mt-1">{cell.label}</div>
                </div>
              ))}
            </motion.div>
          )}

          {countdown && countdown.expired && (
            <div className="bg-[#8B79D4]/10 border border-[#8B79D4]/25 rounded-xl py-3 px-5 max-w-md mx-auto mb-10">
              <p className="text-[#9D8FE0] text-sm font-semibold">The launch window is open. Grab it now.</p>
            </div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Form />
          </motion.div>
        </div>
      </section>

      {/* Pioneer claim */}
      <section className="max-w-3xl mx-auto px-6 py-10 text-center">
        <p className="text-[#FCF4EB]/55 italic text-base sm:text-lg">
          The first weekend-build catalog of solo-operator AI income lanes.
          Adjacent to and inspired by the AI Operating System playbook.
        </p>
      </section>

      {/* Benefits */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-4">
            What you get
          </h2>
          <p className="text-[#FCF4EB]/50 text-base max-w-xl mx-auto">
            One catalog. One hundred small machines. Each one buildable in a weekend with a Macbook, a Claude Code login, and a Stripe account.
          </p>
        </div>

        <div className="space-y-3">
          {BENEFITS.map((item, i) => (
            <motion.div
              key={item.icon}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5 flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-full bg-[#8B79D4]/15 border border-[#8B79D4]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#9D8FE0] text-xs font-bold">{item.icon}</span>
              </div>
              <p className="text-[#FCF4EB]/70 text-sm leading-relaxed">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section listing */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-4">
            Ten section lanes. One hundred small machines.
          </h2>
        </div>
        <div className="space-y-2">
          {SECTIONS.map((s, i) => (
            <div key={s} className="flex items-baseline gap-4 border-b border-white/[0.06] py-3">
              <span className="text-[#9D8FE0] font-bold text-sm w-8">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[#FCF4EB] text-base sm:text-lg">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing ladder */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-4">The ladder</h2>
          <p className="text-[#FCF4EB]/50 text-base max-w-xl mx-auto">
            Pick the level that matches how fast you want to ship.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl p-6 bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-xl font-bold text-[#FCF4EB]">The book</h3>
              <div>
                <span className="text-[#9D8FE0] font-extrabold text-2xl">$27</span>
                <span className="text-[#FCF4EB]/40 text-sm ml-2 line-through">$47</span>
              </div>
            </div>
            <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
              The catalog. PDF, EPUB, and (week 1) Kindle plus paperback. Every prompt copy-paste ready.
            </p>
          </div>

          <div className="rounded-2xl p-6 bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-xl font-bold text-[#FCF4EB]">The companion portal course</h3>
              <div>
                <span className="text-[#9D8FE0] font-extrabold text-2xl">$197</span>
              </div>
            </div>
            <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
              Each card becomes a lesson page. Starter and upgrade prompts wrapped in copy buttons.
              Built to sit next to your Claude Code or Codex session.
            </p>
          </div>

          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#8B79D4]/10 to-[#F5C3C6]/5 border border-[#8B79D4]/25">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-xl font-bold text-[#FCF4EB]">The biweekly operator tier</h3>
              <div>
                <span className="text-[#9D8FE0] font-extrabold text-2xl">$999</span>
                <span className="text-[#FCF4EB]/40 text-sm ml-1">/mo</span>
              </div>
            </div>
            <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-2">
              Office hours every two weeks. Recordings. The prompts I keep behind the paywall.
              Ten intro seats at $799.
            </p>
            <p className="text-[#9D8FE0] text-xs font-semibold">10 intro seats at $799. First-come, first-served.</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div
          className="rounded-2xl p-8 sm:p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 195, 198, 0.10) 0%, rgba(139, 121, 212, 0.08) 100%)',
            border: '1px solid rgba(245, 195, 198, 0.15)',
          }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">Get the $27 launch link</h2>
          <p className="text-[#FCF4EB]/50 mb-8 max-w-md mx-auto">
            One email on launch day. The price goes up after the 12-day window.
          </p>
          <Form />
        </div>
      </section>

      <div className="text-center pb-12">
        <p className="text-[#FCF4EB]/20 text-xs uppercase tracking-widest">By Joe Che. Masterminds HQ.</p>
      </div>
    </div>
  )
}
