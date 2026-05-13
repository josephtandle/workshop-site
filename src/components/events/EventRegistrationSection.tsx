'use client'

import { useMemo, useState, useTransition } from 'react'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { EventDefinition } from '@/lib/events'
import { formatEventPrice } from '@/lib/events'

type Props = {
  event: EventDefinition
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
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey],
  )

  const appliedPromo = useMemo(
    () =>
      appliedPromoCode
        ? event.pricing.promoCodes?.find((promo) => promo.code.toUpperCase() === appliedPromoCode.toUpperCase()) ?? null
        : null,
    [appliedPromoCode, event.pricing.promoCodes],
  )

  const displayedPrice = formatEventPrice(event, appliedPromo ?? undefined)

  function handleSubmit(formData: FormData) {
    const nextName = String(formData.get('attendeeName') || '').trim()
    const nextEmail = String(formData.get('attendeeEmail') || '').trim()
    const nextPromo = String(formData.get('promoCode') || '').trim()

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
            promoCode: nextPromo,
          }),
        })

        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload.error || 'Unable to start checkout.')
        }

        setAppliedPromoCode(payload.appliedPromoCode)
        setClientSecret(payload.clientSecret)
      } catch (submitError) {
        const message = submitError instanceof Error ? submitError.message : 'Unable to start checkout.'
        setError(message)
      }
    })
  }

  return (
    <section id="register" className="mx-auto max-w-6xl px-6 py-8 md:py-10 scroll-mt-24">
      <div className="mb-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#BDB3E8]">Registration</p>
        <h2 className="event-gradient-title text-[1.7rem] font-extrabold leading-[0.94] tracking-tight md:text-[2.65rem]">
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
                  className="rounded-xl border border-white/10 bg-[#0f0f10]/72 px-4 py-3 text-[#FCF4EB] outline-none transition focus:border-[#7C69C7]/55"
                  placeholder="Your name"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#FCF4EB]">Email</span>
                <input
                  name="attendeeEmail"
                  type="email"
                  defaultValue={attendeeEmail}
                  className="rounded-xl border border-white/10 bg-[#0f0f10]/72 px-4 py-3 text-[#FCF4EB] outline-none transition focus:border-[#7C69C7]/55"
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
                    onChange={(event) => setPromoCode(event.target.value)}
                    className="rounded-xl border border-white/10 bg-[#0f0f10]/72 px-4 py-3 text-[#FCF4EB] outline-none transition focus:border-[#7C69C7]/55"
                    placeholder="EARLY20"
                  />
                </label>
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
              <p className="text-xs leading-5 text-[#FCF4EB]/42">
                Promo codes stay on this page. Payment opens below after you continue.
              </p>
              {error ? <p className="text-sm text-[#F5C3C6]">{error}</p> : null}
            </div>
          </form>

          <aside className="rounded-[1.6rem] border border-white/10 bg-[#0f0f10]/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">Your ticket</p>
            <div className="mt-3 flex items-end gap-3">
              {appliedPromo ? (
                <span className="text-base text-[#FCF4EB]/35 line-through">
                  {event.pricing.currencySymbol}
                  {event.pricing.fullPrice}
                </span>
              ) : null}
              <span className="font-serif text-4xl leading-none text-[#FCF4EB]">{displayedPrice}</span>
            </div>
            {appliedPromo ? (
              <p className="mt-3 text-sm leading-6 text-[#FCF4EB]/58">
                {appliedPromo.code} applied. {appliedPromo.description}
              </p>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[#FCF4EB]/58">{event.pricing.checkoutNote}</p>
            )}
          </aside>
        </div>

        {clientSecret && stripePromise ? (
          <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-[#0f0f10]/72 p-3 md:p-5">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        ) : null}
      </div>
    </section>
  )
}
