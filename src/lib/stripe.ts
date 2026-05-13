import Stripe from 'stripe'

export function getStripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY || process.env.STRIPE_TEST_SECRET_KEY || null
}

export function getStripePublishableKey() {
  const explicit = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY
  if (explicit) return explicit

  const secretKey = getStripeSecretKey()
  if (!secretKey || !secretKey.startsWith('sk_')) return null

  return `pk_${secretKey.slice(3)}`
}

export function createStripeClient() {
  const secretKey = getStripeSecretKey()
  if (!secretKey) {
    throw new Error('Stripe secret key is not configured.')
  }

  return new Stripe(secretKey)
}
