import { NextResponse } from 'next/server'
import { isValidEmail, normaliseEmail } from '@/lib/email-validation'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { createAiAgentIncomeStripeClient } from '../stripe'

export const runtime = 'nodejs'

const SUCCESS_URL = 'https://passiveincome.mastermindshq.business?session_id={CHECKOUT_SESSION_ID}'
const CANCEL_URL = 'https://passiveincome.mastermindshq.business'

function requireEnv(name: string) {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`${name} is not configured.`)
  }
  return value
}

async function findOrCreateCustomer(email: string) {
  const stripe = createAiAgentIncomeStripeClient()
  const existing = await stripe.customers.list({ email, limit: 1 })
  const customer = existing.data[0]
  if (customer) return customer.id

  const created = await stripe.customers.create({
    email,
    metadata: {
      product_key: 'ai_agent_income_playbook',
    },
  })
  return created.id
}

export async function POST(request: Request) {
  try {
    const { ok: rateLimitOk } = await checkRateLimit(`ai-agent-income-checkout:${getClientIp(request)}`, 10, 60)
    if (!rateLimitOk) {
      return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
    }

    const body = await request.json().catch(() => null)
    const email = typeof body?.email === 'string' ? normaliseEmail(body.email) : ''

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const setupPriceId = requireEnv('AI_AGENT_INCOME_SETUP_PRICE_ID')
    const monthlyPriceId = requireEnv('AI_AGENT_INCOME_MONTHLY_PRICE_ID')
    const stripe = createAiAgentIncomeStripeClient()
    const customerId = await findOrCreateCustomer(email)

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        { price: setupPriceId, quantity: 1 },
        { price: monthlyPriceId, quantity: 1 },
      ],
      subscription_data: {
        trial_period_days: 7,
        trial_settings: {
          end_behavior: { missing_payment_method: 'cancel' },
        },
        metadata: {
          product_key: 'ai_agent_income_playbook',
          email,
        },
      },
      payment_method_collection: 'always',
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
      customer_update: {
        name: 'auto',
        address: 'auto',
      },
      metadata: {
        product_key: 'ai_agent_income_playbook',
        email,
      },
    })

    if (!session.url) {
      throw new Error('Stripe did not return a Checkout URL.')
    }

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('ai-agent-income checkout error', err)
    return NextResponse.json({ error: 'Unable to create checkout session.' }, { status: 500 })
  }
}
