'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const DOWNLOAD_PATH = '/downloads/maccleaner-installer.sh'

export default function GiveawayForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'maccleaner' }),
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
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        <div className="text-3xl mb-3">✦</div>
        <p className="text-cream font-bold text-xl mb-2">Installer ready.</p>
        <p className="text-cream/60 text-sm max-w-md mx-auto mb-5">
          Your email is on the list, and the script is ready now. The first run is preview-only until you explicitly confirm cleanup.
        </p>
        <a
          href={DOWNLOAD_PATH}
          download="maccleaner-installer.sh"
          className="inline-flex items-center justify-center bg-purple hover:bg-purple/90 text-cream font-semibold text-sm px-7 py-3.5 rounded-xl transition-all"
        >
          Download the installer
        </a>
        <p className="text-cream/30 text-xs mt-4">A backup copy is also on its way to your inbox.</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3.5 text-cream placeholder-cream/30 text-sm focus:outline-none focus:border-purple/60 focus:bg-white/[0.08] transition-all"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-purple hover:bg-purple/90 disabled:opacity-60 text-cream font-semibold text-sm px-7 py-3.5 rounded-xl transition-all whitespace-nowrap"
        >
          {status === 'loading' ? 'Sending...' : 'Send me MacCleaner'}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-xs text-center">Something went wrong. Try again.</p>
      )}
      <p className="text-cream/30 text-xs text-center">Free. No spam. Unsubscribe anytime.</p>
    </form>
  )
}
