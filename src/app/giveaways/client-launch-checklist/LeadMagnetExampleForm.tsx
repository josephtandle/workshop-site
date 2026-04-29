'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'done' | 'error'

export default function LeadMagnetExampleForm() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!firstName.trim() || !email.trim()) {
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          source: 'client-launch-checklist',
          leadMagnet: 'Client Launch Checklist',
        }),
      })

      if (!response.ok) {
        throw new Error('Subscription failed')
      }

      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-[#7C69C7]/35 bg-[#7C69C7]/10 p-6 text-center">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#7C69C7]/40 bg-[#7C69C7]/20">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" stroke="#FCF4EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mb-2 text-xl font-bold text-[#FCF4EB]">Check your inbox.</p>
        <p className="text-sm leading-relaxed text-[#FCF4EB]/60">
          Your Client Launch Checklist is on its way. If it does not show up in a few minutes, check spam.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#FCF4EB]/40">
            First name
          </span>
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Avery"
            required
            className="w-full rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 py-3.5 text-sm text-[#FCF4EB] outline-none transition-all placeholder:text-[#FCF4EB]/30 focus:border-[#7C69C7]/70 focus:bg-white/[0.08]"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#FCF4EB]/40">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="avery@example.com"
            required
            className="w-full rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 py-3.5 text-sm text-[#FCF4EB] outline-none transition-all placeholder:text-[#FCF4EB]/30 focus:border-[#7C69C7]/70 focus:bg-white/[0.08]"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C69C7] px-5 py-3.5 text-sm font-bold text-[#FCF4EB] transition-colors hover:bg-[#6B5AB8] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'loading' && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#FCF4EB]/30 border-t-[#FCF4EB]" />
        )}
        {status === 'loading' ? 'Sending checklist...' : 'Get My Free Checklist'}
      </button>

      {status === 'error' && (
        <p className="text-center text-xs text-red-300">
          Something went wrong. Please check both fields and try again.
        </p>
      )}

      <p className="text-center text-xs text-[#FCF4EB]/30">
        Free checklist. No spam. Unsubscribe any time.
      </p>
    </form>
  )
}
