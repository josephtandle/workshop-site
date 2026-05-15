'use client'

import { useEffect, useRef, useMemo, useState, useTransition } from 'react'

function useAnimatedNumber(target: number, duration = 750): number {
  const [value, setValue] = useState(target)
  const frameRef = useRef<number | null>(null)
  const prevTargetRef = useRef(target)

  useEffect(() => {
    const from = prevTargetRef.current
    prevTargetRef.current = target
    if (from === target) return

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)

    const start = performance.now()
    const diff = target - from

    function step(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(from + diff * eased)
      if (t < 1) {
        frameRef.current = requestAnimationFrame(step)
      } else {
        setValue(target)
        frameRef.current = null
      }
    }

    frameRef.current = requestAnimationFrame(step)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration])

  return value
}
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { celebrate } from '@/lib/celebrate'

export type EventRegistrationData = {
  slug: string
  durationLabel?: string
  pricing: {
    currencySymbol: string
    fullPrice: number
    checkoutNote: string
    donationMode?: boolean
    minDonation?: number
  }
  calendarEvent?: {
    googleUrl: string
    icalUrl: string
  }
  successLabel?: string
  successDetail?: string
  successRedirect?: string
}

type Props = {
  event: EventRegistrationData
  publishableKey: string | null
  initialPromoCode?: string | null
}

type SuccessState = {
  title: string
  detail: string
}

export default function EventRegistrationSection({
  event,
  publishableKey,
  initialPromoCode,
}: Props) {
  const [attendeeName, setAttendeeName] = useState('')
  const [attendeeEmail, setAttendeeEmail] = useState('')
  const [donationAmount, setDonationAmount] = useState(event.pricing.fullPrice)
  const [promoOpen, setPromoOpen] = useState(Boolean(initialPromoCode))
  const [promoCode, setPromoCode] = useState(initialPromoCode ?? '')
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(initialPromoCode ?? null)
  const [appliedAmount, setAppliedAmount] = useState<number | null>(null)
  const [promoMessage, setPromoMessage] = useState<string | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null)
  const [completionMessage, setCompletionMessage] = useState<string | null>(null)
  const [successState, setSuccessState] = useState<SuccessState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isApplyingPromo, startApplyTransition] = useTransition()
  const checkoutRef = useRef<HTMLDivElement | null>(null)
  const checkoutSessionIdRef = useRef<string | null>(null)
  const finalizedSessionIdsRef = useRef<Set<string>>(new Set())

  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey],
  )

  useEffect(() => {
    checkoutSessionIdRef.current = checkoutSessionId
  }, [checkoutSessionId])

  function markSuccess(detail?: string) {
    setClientSecret(null)
    setCheckoutSessionId(null)
    setCompletionMessage('Your seat has been reserved.')
    setSuccessState({
      title: 'Your seat has been reserved.',
      detail:
        detail ||
        event.successDetail ||
        'Great, your seat is reserved. Watch your inbox for a confirmation email from joe@mastermindshq.business. Then I will take you to the setup page for the two free accounts you need before the workshop.',
    })
  }

  async function finalizeRegistration(sessionId: string) {
    if (!sessionId || finalizedSessionIdsRef.current.has(sessionId)) {
      return
    }

    finalizedSessionIdsRef.current.add(sessionId)

    try {
      const response = await fetch('/api/events/finalize-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: event.slug,
          sessionId,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Unable to finalize registration.')
      }

      markSuccess(payload.message || 'Payment received and registration confirmed.')
    } catch (finalizeError) {
      const message = finalizeError instanceof Error ? finalizeError.message : 'Unable to finalize registration.'
      setError(message)
      finalizedSessionIdsRef.current.delete(sessionId)
    }
  }

  useEffect(() => {
    if (!clientSecret || !checkoutRef.current) return

    const timeout = window.setTimeout(() => {
      const top = window.scrollY + checkoutRef.current!.getBoundingClientRect().top - 24
      window.scrollTo({ top, behavior: 'smooth' })
    }, 120)

    return () => window.clearTimeout(timeout)
  }, [clientSecret])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')
    const checkoutStatus = params.get('checkout')

    if (checkoutStatus === 'success' && sessionId) {
      void finalizeRegistration(sessionId)
    }
  }, [])

  useEffect(() => {
    if (!successState) return
    celebrate()
  }, [successState])

  const embeddedCheckoutOptions = useMemo(
    () =>
      clientSecret
        ? {
            clientSecret,
            onComplete: () => {
              const sessionId = checkoutSessionIdRef.current
              if (sessionId) {
                void finalizeRegistration(sessionId)
              }
            },
          }
        : null,
    [clientSecret],
  )

  const effectivePrice = event.pricing.donationMode ? donationAmount : (appliedAmount ?? event.pricing.fullPrice)
  const animatedPrice = useAnimatedNumber(effectivePrice)
  const isAnimating = Math.round(animatedPrice * 100) !== Math.round(effectivePrice * 100)
  const displayedPrice = `${event.pricing.currencySymbol}${
    isAnimating
      ? Math.round(animatedPrice)
      : (Number.isInteger(effectivePrice) ? String(effectivePrice) : effectivePrice.toFixed(2))
  }`

  function handleApplyPromo() {
    const nextPromo = promoCode.trim()
    if (!nextPromo) {
      setPromoError('Enter a promo code first.')
      setPromoMessage(null)
      setAppliedPromoCode(null)
      setAppliedAmount(null)
      return
    }

    startApplyTransition(async () => {
      setPromoError(null)
      setPromoMessage(null)

      try {
        const response = await fetch('/api/events/validate-promo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: event.slug,
            promoCode: nextPromo,
          }),
        })

        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload.error || 'Unable to validate promo code.')
        }

        setAppliedPromoCode(payload.appliedPromoCode ?? null)
        setAppliedAmount(typeof payload.amount === 'number' ? payload.amount : null)
        setPromoMessage(payload.message || 'Promo code applied.')
      } catch (applyError) {
        const message = applyError instanceof Error ? applyError.message : 'Unable to validate promo code.'
        setAppliedPromoCode(null)
        setAppliedAmount(null)
        setPromoMessage(null)
        setPromoError(message)
      }
    })
  }

  function handleSubmit(formData: FormData) {
    const nextName = String(formData.get('attendeeName') || '').trim()
    const nextEmail = String(formData.get('attendeeEmail') || '').trim()

    if (!nextName || !nextEmail) {
      setError('Please enter your name and email.')
      return
    }

    if (!publishableKey) {
      setError('Stripe publishable key is missing. Add it to the site config to enable embedded checkout.')
      return
    }

    startTransition(async () => {
      setError(null)
      setCompletionMessage(null)
      setAttendeeName(nextName)
      setAttendeeEmail(nextEmail)

      try {
        const response = await fetch('/api/events/checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: event.slug,
            attendeeName: nextName,
            attendeeEmail: nextEmail,
            promoCode: promoCode.trim() || appliedPromoCode || '',
            ...(event.pricing.donationMode ? { donationAmount } : {}),
          }),
        })

        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload.error || 'Unable to start checkout.')
        }

        setAppliedPromoCode(payload.appliedPromoCode)
        setAppliedAmount(typeof payload.amount === 'number' ? payload.amount : null)
        if (payload.completed) {
          markSuccess(payload.message || 'Free ticket reserved. No payment needed.')
          return
        }

        setCheckoutSessionId(payload.sessionId ?? null)
        setClientSecret(payload.clientSecret)
      } catch (submitError) {
        const message = submitError instanceof Error ? submitError.message : 'Unable to start checkout.'
        setError(message)
      }
    })
  }

  return (
    <section id="register" className="mx-auto max-w-6xl px-6 py-8 md:py-10">
      {successState ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/72 px-6 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-[2rem] border border-white/12 bg-[#151517] p-7 text-center shadow-[0_30px_120px_rgba(0,0,0,0.45)] md:p-9">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setSuccessState(null)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#8B79D4] bg-black text-white transition hover:bg-[#1a1a2e]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">Registration Confirmed</p>
            <h3 className="event-gradient-title mt-3 text-[2rem] font-extrabold leading-[0.95] tracking-tight md:text-[3.2rem]">
              {successState.title}
            </h3>
            <p className="mt-4 text-base leading-8 text-[#FCF4EB]/74 md:text-lg">
              {successState.detail}
            </p>
            {event.calendarEvent ? (
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <a
                  href={event.calendarEvent.googleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#8B79D4]/50 px-4 py-2.5 text-sm font-semibold text-[#BDB3E8] transition hover:border-[#8B79D4] hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  Google Calendar
                </a>
                <a
                  href={event.calendarEvent.icalUrl}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#8B79D4]/50 px-4 py-2.5 text-sm font-semibold text-[#BDB3E8] transition hover:border-[#8B79D4] hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  iCal
                </a>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setSuccessState(null)
                window.location.href = event.successRedirect ?? `/events/${event.slug}/setup`
              }}
              className="copy-button-glass copy-button-primary mt-5 inline-flex min-w-[220px] items-center justify-center rounded-xl px-6 py-4 text-base font-semibold shadow-[0_16px_38px_rgba(124,105,199,0.22)]"
            >
              {event.successLabel ?? 'Start Account Setup'}
            </button>
          </div>
        </div>
      ) : null}
      <div className="mb-5">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8] md:text-[13px]">Reserve Your Spot</p>
        <h2 className="event-gradient-title text-[2.2rem] font-extrabold leading-[0.92] tracking-tight md:text-[4.1rem]">
          Reserve your seat and check out below.
        </h2>
        <p className="mt-4 text-base leading-8 text-[#FCF4EB]/68 md:text-lg">
          Enter your information here. Once you continue, checkout opens on this page instead of sending you away.
        </p>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(252,244,235,0.08),rgba(124,105,199,0.08))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.26)] md:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <form action={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#FCF4EB]">Full name</span>
                <input
                  name="attendeeName"
                  defaultValue={attendeeName}
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-black placeholder:text-black/35 outline-none transition focus:border-[#7C69C7]/55"
                  placeholder="Your name"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#FCF4EB]">Email</span>
                <input
                  name="attendeeEmail"
                  type="email"
                  defaultValue={attendeeEmail}
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-black placeholder:text-black/35 outline-none transition focus:border-[#7C69C7]/55"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            {event.pricing.donationMode ? (
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#FCF4EB]">
                  Donation amount <span className="font-normal text-[#FCF4EB]/55">(suggested: $10 — minimum: $0)</span>
                </span>
                <div className="flex items-center gap-0 rounded-xl border border-black/10 bg-white overflow-hidden focus-within:border-[#7C69C7]/55 transition w-48">
                  <span className="pl-4 pr-1 text-black/55 font-semibold select-none">$</span>
                  <input
                    type="number"
                    min={event.pricing.minDonation ?? 0}
                    step={1}
                    value={donationAmount}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value)
                      setDonationAmount(isNaN(v) ? 0 : Math.max(event.pricing.minDonation ?? 0, v))
                    }}
                    className="flex-1 py-3 pr-4 text-black outline-none bg-transparent"
                  />
                </div>
                <p className="text-sm text-[#FCF4EB]/55">{event.pricing.checkoutNote}</p>
              </label>
            ) : null}

            <div className="flex flex-col items-start gap-2">
              {!promoOpen && !event.pricing.donationMode ? (
                <button
                  type="button"
                  onClick={() => setPromoOpen(true)}
                  className="text-sm font-semibold text-[#BDB3E8] transition hover:text-[#FCF4EB]"
                >
                  Enter promo code
                </button>
              ) : null}
              {promoOpen ? (
                <label className="grid w-full max-w-sm gap-2">
                  <span className="text-sm font-semibold text-[#FCF4EB]">Promo code</span>
                  <input
                    name="promoCode"
                    value={promoCode}
                    onChange={(event) => {
                      setPromoCode(event.target.value)
                      setPromoError(null)
                      setPromoMessage(null)
                      setAppliedPromoCode(null)
                      setAppliedAmount(null)
                    }}
                    className="rounded-xl border border-black/10 bg-white px-4 py-3 text-black placeholder:text-black/35 outline-none transition focus:border-[#7C69C7]/55"
                    placeholder="Promo code"
                  />
                </label>
              ) : null}
              {promoOpen ? (
                <div className="flex flex-col items-start gap-2">
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={isApplyingPromo}
                    className="inline-flex items-center justify-center rounded-xl border border-white/14 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-[#FCF4EB] transition hover:bg-white/[0.1] disabled:cursor-wait disabled:opacity-70"
                  >
                    {isApplyingPromo ? 'Applying...' : 'Apply'}
                  </button>
                  {promoMessage ? <p className="text-sm text-[#BDE7C0]">{promoMessage}</p> : null}
                  {promoError ? <p className="text-sm text-[#F5C3C6]">{promoError}</p> : null}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col items-start gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="copy-button-glass copy-button-primary inline-flex min-w-[220px] items-center justify-center rounded-xl px-6 py-4 text-base font-semibold shadow-[0_16px_38px_rgba(124,105,199,0.22)] disabled:cursor-wait disabled:opacity-70"
              >
                {isPending ? 'Preparing Checkout...' : 'Continue To Checkout'}
              </button>
              {completionMessage ? <p className="text-sm text-[#BDE7C0]">{completionMessage}</p> : null}
              {error ? <p className="text-sm text-[#F5C3C6]">{error}</p> : null}
            </div>
          </form>

          <aside className="relative overflow-hidden rounded-[1.6rem] border border-[#8B79D4]/55 bg-[#0C0715] px-6 py-7 text-center shadow-[0_0_0_1px_rgba(139,121,212,0.10),0_24px_70px_rgba(0,0,0,0.32)]">
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[#BDB3E8]/70" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#BDB3E8]">Your Ticket</p>
            <h3 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#FCF4EB]">Event Seat</h3>
            {event.durationLabel ? (
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FCF4EB]/42">{event.durationLabel}</p>
            ) : null}
            <div className="my-7 border-t border-white/10" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#FCF4EB]/42">
              {event.pricing.donationMode ? 'Your Donation' : appliedPromoCode ? 'Promo Price' : 'Event Price'}
            </p>
            {!event.pricing.donationMode && appliedPromoCode ? (
              <p className="mt-3 text-base text-[#FCF4EB]/35 line-through">
                {event.pricing.currencySymbol}
                {event.pricing.fullPrice}
              </p>
            ) : null}
            <p className="mt-2 font-serif text-[4.6rem] leading-none tracking-tight text-[#FCF4EB]">{displayedPrice}</p>
            {!event.pricing.donationMode && appliedPromoCode ? (
              <p className="mt-4 text-sm font-semibold leading-6 text-[#BDB3E8]">
                {appliedPromoCode} applied to this order.
              </p>
            ) : (
              <p className="mt-4 text-sm leading-6 text-[#FCF4EB]/58">{event.pricing.checkoutNote}</p>
            )}
          </aside>
        </div>

        {clientSecret && stripePromise && embeddedCheckoutOptions ? (
          <div ref={checkoutRef} className="mt-8 rounded-[1.6rem] border border-white/10 bg-white p-3 text-black md:p-5">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={embeddedCheckoutOptions}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        ) : null}
      </div>
    </section>
  )
}
