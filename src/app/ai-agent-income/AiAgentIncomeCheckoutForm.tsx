'use client'

import type { FormEvent } from 'react'
import { useId, useState } from 'react'

type CheckoutFormProps = {
  compact?: boolean
}

export default function AiAgentIncomeCheckoutForm({ compact = false }: CheckoutFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const generatedId = useId()
  const emailInputId = `${generatedId}-email`
  const errorId = `${generatedId}-error`

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/ai-agent-income/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok || typeof data?.url !== 'string') {
        throw new Error(data?.error || 'Unable to start checkout. Please try again.')
      }

      window.location.assign(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start checkout. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? 'w-full' : 'mx-auto w-full max-w-xl'}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor={emailInputId}>
          Email address
        </label>
        <input
          id={emailInputId}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          required
          autoComplete="email"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className="min-h-[3.5rem] flex-1 rounded-xl border border-white/[0.12] bg-white/[0.06] px-5 text-base text-[#FCF4EB] outline-none transition placeholder:text-[#FCF4EB]/35 focus:border-[#9D8FE0]/70 focus:ring-2 focus:ring-[#8B79D4]/25"
        />
        <button
          type="submit"
          disabled={loading}
          className="min-h-[3.5rem] rounded-xl bg-[#8B79D4] px-7 text-base font-bold text-white transition hover:bg-[#6B5AB8] focus:outline-none focus:ring-2 focus:ring-[#F5C3C6]/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Opening checkout...' : 'Start your $1 trial'}
        </button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-3 text-sm text-[#F5C3C6]">
          {error}
        </p>
      )}
    </form>
  )
}
