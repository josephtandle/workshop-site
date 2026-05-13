'use client'

import { useEffect, useRef, useMemo, useState, useTransition } from 'react'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

export type EventRegistrationData = {
  slug: string
  pricing: {
    currencySymbol: string
    fullPrice: number
    checkoutNote: string
  }
}

type Props = {
  event: EventRegistrationData
  publishableKey: string | null
  initialPromoCode?: string | null
}

export default function EventRegistrationSection({
  event,
  publishableKey,
  initialPromoCode,
}: Props) {
  const [attendeeName, setAttendeeName] = useState('')
  const [attendeeEmail, setAttendeeEmail] = useState('')
  const [promoOpen, setPromoOpen] = useState(Boolean(initialPromoCode))
  const [promoCode, setPromoCode] = useState(initialPromoCode ?? '')
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(initialPromoCode ?? null)
  const [appliedAmount, setAppliedAmount] = useState<number | null>(null)
  const [promoMessage, setPromoMessage] = useState<string | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null)
  const [completionMessage, setCompletionMessage] = useState<string | null>(null)
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

      setClientSecret(null)
      setCompletionMessage(payload.message || 'Registration confirmed.')
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

  const displayedPrice = `${event.pricing.currencySymbol}${Number.isInteger(appliedAmount ?? event.pricing.fullPrice) ? String(appliedAmount ?? event.pricing.fullPrice) : (appliedAmount ?? event.pricing.fullPrice).toFixed(2)}`

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
            promoCode: appliedPromoCode ?? '',
          }),
        })

        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload.error || 'Unable to start checkout.')
        }

        setAppliedPromoCode(payload.appliedPromoCode)
        setAppliedAmount(typeof payload.amount === 'number' ? payload.amount : null)
        if (payload.completed) {
          setClientSecret(null)
          setCheckoutSessionId(null)
          setCompletionMessage(payload.message || 'Ticket reserved.')
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

            <div className="flex flex-col items-start gap-2">
              {!promoOpen ? (
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

          <aside className="rounded-[1.6rem] border border-white/10 bg-[#0f0f10]/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">Your ticket</p>
            <div className="mt-3 flex items-end gap-3">
              {appliedPromoCode ? (
                <span className="text-base text-[#FCF4EB]/35 line-through">
                  {event.pricing.currencySymbol}
                  {event.pricing.fullPrice}
                </span>
              ) : null}
              <span className="font-serif text-4xl leading-none text-[#FCF4EB]">{displayedPrice}</span>
            </div>
            {appliedPromoCode ? (
              <p className="mt-3 text-sm leading-6 text-[#FCF4EB]/58">
                {appliedPromoCode} applied to this order.
              </p>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[#FCF4EB]/58">{event.pricing.checkoutNote}</p>
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
