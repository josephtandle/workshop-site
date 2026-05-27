import type Stripe from 'stripe'
import type { EventDefinition, EventPromoCode } from '@/lib/events'
import { resolvePromoCode } from '@/lib/events'
import { toStripeUnitAmount } from '@/lib/stripe-amount'

export type EventCheckoutMode = 'embedded' | 'hosted'

export function resolveCheckoutMode(requestedMode: unknown, canUseEmbeddedCheckout: boolean): EventCheckoutMode {
  if (requestedMode === 'embedded' && canUseEmbeddedCheckout) return 'embedded'
  return 'hosted'
}

export function resolveEventCheckoutAmount({
  event,
  promoCode,
  rawDonationAmount,
}: {
  event: EventDefinition
  promoCode?: string | null
  rawDonationAmount?: number | null
}): { amount: number; promo: EventPromoCode | null } {
  const promo = event.pricing.donationMode ? null : resolvePromoCode(event, promoCode || null)

  const amount =
    event.pricing.donationMode && rawDonationAmount !== null && rawDonationAmount !== undefined
      ? Math.max(event.pricing.minDonation ?? 0, rawDonationAmount)
      : promo?.amountOff
        ? Math.max(0, event.pricing.fullPrice - promo.amountOff)
        : promo?.percentOff
          ? Math.max(0, event.pricing.fullPrice * (1 - promo.percentOff / 100))
          : event.pricing.fullPrice

  return { amount, promo }
}

export function buildEventCheckoutSessionParams({
  event,
  attendeeName,
  attendeeEmail,
  amount,
  promo,
  baseUrl,
  mode,
}: {
  event: EventDefinition
  attendeeName: string
  attendeeEmail: string
  amount: number
  promo: EventPromoCode | null
  baseUrl: string
  mode: EventCheckoutMode
}): Stripe.Checkout.SessionCreateParams {
  const eventUrl = `${baseUrl}/events/${event.slug}`
  const unitAmount = toStripeUnitAmount(amount)
  if (unitAmount === null) {
    throw new Error('Amount is below Stripe minimum.')
  }

  const metadata = {
    event_slug: event.slug,
    attendee_name: attendeeName,
    attendee_email: attendeeEmail,
    promo_code: promo?.code ?? '',
  }

  return {
    ...(mode === 'embedded'
      ? {
          ui_mode: 'embedded_page' as const,
          return_url: `${eventUrl}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          redirect_on_completion: 'if_required' as const,
        }
      : {
          ui_mode: 'hosted_page' as const,
          success_url: `${eventUrl}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${eventUrl}?checkout=cancelled`,
        }),
    mode: 'payment',
    customer_email: attendeeEmail,
    billing_address_collection: 'auto',
    customer_creation: 'always',
    allow_promotion_codes: false,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: unitAmount,
          product_data: {
            name: event.title,
            description: event.description,
          },
        },
      },
    ],
    metadata,
    payment_intent_data: {
      metadata,
    },
  }
}
