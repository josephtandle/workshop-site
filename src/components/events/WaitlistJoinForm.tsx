'use client'

import { useState } from 'react'

type Props = {
  eventSlug: string
  eventTitle?: string
}

export default function WaitlistJoinForm({ eventSlug, eventTitle }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    if (!trimmedName || !trimmedEmail) {
      setError('Please enter your name and email.')
      return
    }
    setSubmitting(true)
    try {
      const response = await fetch('/api/events/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventSlug, name: trimmedName, email: trimmedEmail }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.error || 'Unable to join waitlist.')
      }
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to join waitlist.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="register" className="mx-auto max-w-6xl px-6 py-8 md:py-10">
      <div className="mb-5">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8] md:text-[13px]">
          This Event Is Full
        </p>
        <h2 className="event-gradient-title text-[2.2rem] font-extrabold leading-[0.92] tracking-tight md:text-[4.1rem]">
          Join the waitlist{eventTitle ? ` for ${eventTitle}` : ''}.
        </h2>
        <p className="mt-4 text-base leading-8 text-[#FCF4EB]/68 md:text-lg">
          All seats are taken. Add your name below and we will email you the moment a spot opens. You can remove yourself at any time from that email.
        </p>
      </div>

      <div className="event-registration-shell rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(252,244,235,0.08),rgba(124,105,199,0.08))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.26)] md:p-8">
        {success ? (
          <div className="text-center py-8">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">You are on the list</p>
            <h3 className="event-gradient-title mt-3 text-[1.8rem] font-extrabold leading-[0.95] tracking-tight md:text-[2.6rem]">
              We will be in touch.
            </h3>
            <p className="mt-4 text-base leading-8 text-[#FCF4EB]/74 md:text-lg">
              Check your inbox for a confirmation. If a seat opens, you will get an email with a one-click reservation link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} autoComplete="off" className="grid gap-5 max-w-xl mx-auto">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#FCF4EB]">Full name</span>
              <input
                type="text"
                autoCapitalize="words"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-white/12 bg-black/30 px-4 py-3 text-base text-white outline-none focus:border-[#8B79D4]"
                required
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#FCF4EB]">Email</span>
              <input
                type="email"
                autoCapitalize="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-white/12 bg-black/30 px-4 py-3 text-base text-white outline-none focus:border-[#8B79D4]"
                required
              />
            </label>
            {error ? (
              <p className="text-sm text-rose-300">{error}</p>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="copy-button-glass copy-button-primary inline-flex items-center justify-center rounded-xl px-6 py-4 text-base font-semibold shadow-[0_16px_38px_rgba(124,105,199,0.22)] disabled:opacity-60"
            >
              {submitting ? 'Joining…' : 'Join the Waitlist'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
