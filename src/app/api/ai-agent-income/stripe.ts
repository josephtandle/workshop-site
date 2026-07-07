import Stripe from 'stripe'

export const AI_AGENT_INCOME_STRIPE_API_VERSION = '2026-04-22.dahlia'

export function createAiAgentIncomeStripeClient() {
  const scopedKey = process.env.AI_AGENT_INCOME_STRIPE_SECRET_KEY?.trim()
  if (!scopedKey) {
    throw new Error('AI_AGENT_INCOME_STRIPE_SECRET_KEY is not configured.')
  }

  return new Stripe(scopedKey, { apiVersion: AI_AGENT_INCOME_STRIPE_API_VERSION })
}
