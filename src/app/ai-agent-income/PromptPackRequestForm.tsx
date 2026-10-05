'use client'

import { useId, useState, type FormEvent } from 'react'

export default function PromptPackRequestForm() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/ai-agent-income/prompt-pack/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json().catch(() => null)
      setMessage(typeof data?.message === 'string' ? data.message : 'Unable to request the prompt pack. Please try again.')
    } catch {
      setMessage('Unable to request the prompt pack. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 sm:p-8">
      <h2 className="text-xl font-bold text-[#FCF4EB]">Already in the trial? Send me my prompt pack</h2>
      <form onSubmit={handleSubmit} className="mt-5" aria-busy={loading}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor={id} className="sr-only">Email address</label>
          <input
            id={id} type="email" required maxLength={254} autoComplete="email"
            value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address"
            className="min-h-[3.5rem] min-w-0 flex-1 rounded-xl border border-white/[0.12] bg-white/[0.06] px-5 text-base text-[#FCF4EB] outline-none transition placeholder:text-[#FCF4EB]/35 focus:border-[#9D8FE0]/70 focus:ring-2 focus:ring-[#8B79D4]/25"
          />
          <button type="submit" disabled={loading} className="min-h-[3.5rem] rounded-xl bg-[#8B79D4] px-6 text-sm font-bold text-white transition hover:bg-[#6B5AB8] focus:outline-none focus:ring-2 focus:ring-[#F5C3C6]/50 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Sending...' : 'Send me my prompt pack'}
          </button>
        </div>
        <p role="status" aria-live="polite" className="mt-3 text-sm text-[#BDB3E8]">{message}</p>
      </form>
    </div>
  )
}
