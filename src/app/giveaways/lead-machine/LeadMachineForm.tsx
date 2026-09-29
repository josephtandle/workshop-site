'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const ZIP_URL = 'https://workshop.mastermindshq.business/lead-machine-starter.zip'
const GITHUB_URL = 'https://github.com/josephtandle/lead-machine'
const PDF_URL = 'https://workshop.mastermindshq.business/lead-machine-quick-start.pdf'

export default function LeadMachineForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const journeyId = typeof window !== 'undefined'
        ? window.localStorage.getItem('insight_journey_id')
        : null
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'lead-machine', journeyId }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="text-3xl mb-3">✦</div>
        <p className="text-cream font-bold text-xl mb-2">Check your inbox.</p>
        <p className="text-cream/60 text-sm mb-6">The Lead Machine is on its way.</p>

        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <a
            href={ZIP_URL}
            className="bg-purple hover:bg-purple/90 text-cream font-semibold text-sm px-6 py-3 rounded-xl transition-all"
          >
            Direct download (.zip)
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-cream font-semibold text-sm px-6 py-3 rounded-xl transition-all"
          >
            View on GitHub
          </a>
          <a
            href={PDF_URL}
            className="text-purple/70 hover:text-purple text-xs underline underline-offset-2 mt-1"
          >
            Or grab the Quick Start PDF
          </a>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3.5 text-cream placeholder-cream/30 text-sm focus:outline-none focus:border-purple/60 focus:bg-white/[0.08] transition-all"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-purple hover:bg-purple/90 disabled:opacity-60 text-cream font-semibold text-sm px-7 py-3.5 rounded-xl transition-all whitespace-nowrap"
        >
          {status === 'loading' ? 'Sending...' : 'Send me the Lead Machine'}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-xs text-center">Something went wrong. Try again.</p>
      )}
      <p className="text-cream/30 text-xs text-center">Free. No spam. Unsubscribe anytime.</p>
    </form>
  )
}
