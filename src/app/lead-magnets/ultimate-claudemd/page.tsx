'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const BENEFITS = [
  { icon: '01', label: 'Cuts context bloat so Claude stays fast and focused across long sessions' },
  { icon: '02', label: 'Routes AI to the right model automatically — cheap Haiku for research, Sonnet for building' },
  { icon: '03', label: 'Saves money on API costs by pushing heavy work to background agents' },
  { icon: '04', label: 'Keeps Claude working autonomously without constant hand-holding' },
  { icon: '05', label: 'Sets iron-law rules Claude cannot ignore — no more bad habits creeping back in' },
]

export default function UltimateClaudeMDPage() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName || !email) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/lead-magnets/claudemd', {
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
          className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-[#FCF4EB] placeholder:text-[#FCF4EB]/30 focus:outline-none focus:border-[#7C69C7]/60 focus:ring-1 focus:ring-[#7C69C7]/30 transition-all text-base"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-[#FCF4EB] placeholder:text-[#FCF4EB]/30 focus:outline-none focus:border-[#7C69C7]/60 focus:ring-1 focus:ring-[#7C69C7]/30 transition-all text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3.5 rounded-xl bg-[#7C69C7] hover:bg-[#6B5AB8] text-white font-semibold text-base transition-all duration-150 disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? 'Sending...' : 'Send it to me'}
          </button>
        </div>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        <p className="text-[#FCF4EB]/30 text-xs">No spam. Unsubscribe any time.</p>
      </form>
    ) : (
      <div className="max-w-md mx-auto bg-[#7C69C7]/10 border border-[#7C69C7]/30 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#7C69C7]/20 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9D8FE0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#FCF4EB] mb-2">Check your inbox</h3>
        <p className="text-[#FCF4EB]/60 text-sm">
          The file is on its way. Check your spam folder if you don&apos;t see it in a few minutes.
        </p>
      </div>
    )

  return (
    <div className="min-h-screen bg-[#151515]">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1520] via-[#151515] to-[#151515]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23FCF4EB\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
              Free Download
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#FCF4EB] leading-[1.1] mb-6">
              Joe Che&apos;s{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]">
                Ultimate
              </span>{' '}
              Claude.md File
            </h1>

            <p className="text-[#FCF4EB]/60 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              The configuration file that cuts context bloat, routes AI to the right model,
              and saves money on API costs. Drop it into your project and Claude works smarter from the first message.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Form />
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-4">
            What it does
          </h2>
          <p className="text-[#FCF4EB]/50 text-base max-w-xl mx-auto">
            CLAUDE.md is a file Claude Code reads automatically at the start of every session.
            This one was refined over months of daily use.
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
              <div className="w-9 h-9 rounded-full bg-[#7C69C7]/15 border border-[#7C69C7]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#9D8FE0] text-xs font-bold">{item.icon}</span>
              </div>
              <p className="text-[#FCF4EB]/70 text-sm leading-relaxed">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div
          className="rounded-2xl p-8 sm:p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 195, 198, 0.10) 0%, rgba(124, 105, 199, 0.08) 100%)',
            border: '1px solid rgba(245, 195, 198, 0.15)',
          }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
            Get the file
          </h2>
          <p className="text-[#FCF4EB]/50 mb-8 max-w-md mx-auto">
            Sent to your inbox as an attachment plus full inline content.
            Drop it into any project as CLAUDE.md and you&apos;re set.
          </p>
          <Form />
        </div>
      </section>

      <div className="text-center pb-12">
        <p className="text-[#FCF4EB]/20 text-xs uppercase tracking-widest">Masterminds HQ</p>
      </div>
    </div>
  )
}
