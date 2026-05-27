'use client'

import { useState } from 'react'

type Props = {
  durationLabel?: string
  eventSlug: string
  eventTitle?: string
}

export default function WaitlistJoinForm({ durationLabel, eventSlug, eventTitle }: Props) {
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
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8] md:text-[13px]">Waitlist Available</p>
        <h2 className="event-gradient-title text-[2.2rem] font-extrabold leading-[0.92] tracking-tight md:text-[4.1rem]">
          Join the waitlist.
        </h2>
        <p className="mt-4 text-base leading-8 text-[#FCF4EB]/68 md:text-lg">
          Add your information here. We will email you if a seat opens, and no payment is due unless you claim that spot.
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
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <form onSubmit={handleSubmit} autoComplete="off" className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="min-h-[14px] text-sm font-semibold leading-none text-[#FCF4EB]">Full name</span>
                  <div className="relative h-16">
                    <input
                      type="text"
                      autoCapitalize="words"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-16 w-full rounded-xl border border-black/10 bg-white px-4 text-black placeholder:text-black/35 outline-none transition focus:border-[#7C69C7]/55"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </label>
                <label className="grid gap-2">
                  <span className="min-h-[14px] text-sm font-semibold leading-none text-[#FCF4EB]">Email</span>
                  <div className="relative h-16">
                    <input
                      type="email"
                      autoCapitalize="none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-16 w-full rounded-xl border border-black/10 bg-white px-4 text-black placeholder:text-black/35 outline-none transition focus:border-[#7C69C7]/55"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </label>
              </div>

              <div className="flex flex-col items-start gap-2 pt-2">
                {error ? <p className="text-sm text-[#F5C3C6]">{error}</p> : null}
                <button
                  type="submit"
                  disabled={submitting}
                  className="copy-button-glass copy-button-primary inline-flex min-w-[220px] items-center justify-center rounded-xl px-6 py-4 text-base font-semibold shadow-[0_16px_38px_rgba(124,105,199,0.22)] disabled:cursor-wait disabled:opacity-70"
                >
                  {submitting ? 'Joining Waitlist...' : 'Join The Waitlist'}
                </button>
              </div>
            </form>

            <aside className="relative overflow-hidden rounded-[1.6rem] border border-[#8B79D4]/55 bg-[#0C0715] px-6 py-7 text-center shadow-[0_0_0_1px_rgba(139,121,212,0.10),0_24px_70px_rgba(0,0,0,0.32)]">
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[#BDB3E8]/70" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#BDB3E8]">Your Waitlist Spot</p>
              <h3 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#FCF4EB]">
                {eventTitle ?? 'Event Seat'}
              </h3>
              {durationLabel ? (
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FCF4EB]/42">{durationLabel}</p>
              ) : null}
              <div className="my-7 border-t border-white/10" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#FCF4EB]/42">Waitlist Price</p>
              <p className="mt-2 font-serif text-[4.6rem] leading-none tracking-tight text-[#FCF4EB]">$0</p>
              <p className="mt-4 text-sm leading-6 text-[#FCF4EB]/58">No payment today. We will email you if a seat opens.</p>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}
