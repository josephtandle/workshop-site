import Stripe from 'stripe'

export function getStripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY || process.env.STRIPE_TEST_SECRET_KEY || null
}

export function getStripePublishableKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY || null
}

export function createStripeClient() {
  const secretKey = getStripeSecretKey()
  if (!secretKey) {
    throw new Error('Stripe secret key is not configured.')
  }

  return new Stripe(secretKey)
}
