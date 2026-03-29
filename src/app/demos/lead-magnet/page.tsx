'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const STORIES = [
  { name: 'Joe Che', quote: 'Success now means flow, resonance, and authenticity — not grinding to prove something.' },
  { name: 'Shane', quote: 'His most effective work happened when it didn\'t feel like work at all.' },
  { name: 'Eri', quote: 'Success is now rooted in authenticity, balance, and reclaiming her power.' },
  { name: 'Marion', quote: 'It\'s not about chasing status — it\'s about staying true to joy and dignity.' },
  { name: 'Jess', quote: 'His greatest success began unfolding not from control, but from trust.' },
  { name: 'Rayvan', quote: 'Success is freedom, connection, and daily delight.' },
  { name: 'Janel', quote: 'Success is emotional flexibility, resilience, and feeling safe within herself.' },
]

export default function LeadMagnetPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Failed to subscribe')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background texture */}
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
              What 17 People Had to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]">
                Un-Learn
              </span>{' '}
              About Success
            </h1>

            <p className="text-[#FCF4EB]/60 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              Real stories from a VIP dinner in Manhattan. No theory, no fluff. Just honest answers
              to one question that changed how everyone at the table sees their life.
            </p>
          </motion.div>

          {/* Email Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-[#FCF4EB] placeholder:text-[#FCF4EB]/30 focus:outline-none focus:border-[#7C69C7]/60 focus:ring-1 focus:ring-[#7C69C7]/30 transition-all text-base"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-7 py-3.5 rounded-xl bg-[#7C69C7] hover:bg-[#6B5AB8] text-white font-semibold text-base transition-all duration-150 disabled:opacity-60 whitespace-nowrap"
                  >
                    {loading ? 'Sending...' : 'Get the PDF'}
                  </button>
                </div>
                {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
                <p className="text-[#FCF4EB]/30 text-xs mt-3">
                  No spam. Unsubscribe any time.
                </p>
              </form>
            ) : (
              <div className="max-w-md mx-auto bg-[#7C69C7]/10 border border-[#7C69C7]/30 rounded-2xl p-8">
                <div className="w-12 h-12 rounded-full bg-[#7C69C7]/20 flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9D8FE0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#FCF4EB] mb-2">Check your inbox</h3>
                <p className="text-[#FCF4EB]/60 text-sm">
                  The PDF is on its way. If you don&apos;t see it in a few minutes, check your spam folder.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-4">
            What&apos;s inside
          </h2>
          <p className="text-[#FCF4EB]/50 text-base max-w-xl mx-auto">
            At a private dinner at Mostly Restaurant, we asked every guest one question:
            &ldquo;What was one thing you had to un-learn about success?&rdquo;
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: '17', label: 'Personal stories from entrepreneurs, creatives, and leaders' },
            { icon: '1', label: 'Question that cuts through the noise and gets to what matters' },
          ].map((item, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
              <div className="w-10 h-10 rounded-full bg-[#7C69C7]/15 border border-[#7C69C7]/25 flex items-center justify-center mb-4">
                <span className="text-[#9D8FE0] text-sm font-bold">{item.icon}</span>
              </div>
              <p className="text-[#FCF4EB]/70 text-sm leading-relaxed">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Previews */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-bold text-[#FCF4EB] mb-6">A few voices from the table</h2>
        <div className="space-y-3">
          {STORIES.map((story, i) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5"
            >
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed italic mb-2">
                &ldquo;{story.quote}&rdquo;
              </p>
              <p className="text-[#9D8FE0] text-xs font-semibold">{story.name}</p>
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
            Ready to un-learn?
          </h2>
          <p className="text-[#FCF4EB]/50 mb-6 max-w-md mx-auto">
            Get the full PDF with all 17 stories. Free, no strings attached.
          </p>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-[#FCF4EB] placeholder:text-[#FCF4EB]/30 focus:outline-none focus:border-[#7C69C7]/60 focus:ring-1 focus:ring-[#7C69C7]/30 transition-all text-base"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-7 py-3.5 rounded-xl bg-[#7C69C7] hover:bg-[#6B5AB8] text-white font-semibold text-base transition-all duration-150 disabled:opacity-60 whitespace-nowrap"
                >
                  {loading ? 'Sending...' : 'Get the PDF'}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-[#9D8FE0] font-semibold">You&apos;re all set. Check your inbox.</p>
          )}
        </div>
      </section>

      {/* Branding */}
      <div className="text-center pb-12">
        <p className="text-[#FCF4EB]/20 text-xs uppercase tracking-widest">Masterminds HQ</p>
      </div>
    </div>
  )
}
