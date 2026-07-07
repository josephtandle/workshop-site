import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'
import { createAiAgentIncomeStripeClient } from '../stripe'

export const runtime = 'nodejs'
export const maxDuration = 30

function getWebhookSecret() {
  const secret = process.env.AI_AGENT_INCOME_STRIPE_WEBHOOK_SECRET?.trim()
  if (!secret) {
    throw new Error('AI_AGENT_INCOME_STRIPE_WEBHOOK_SECRET is not configured.')
  }
  return secret
}

function customerIdFrom(value: string | Stripe.Customer | Stripe.DeletedCustomer | null) {
  if (!value) return null
  return typeof value === 'string' ? value : value.id
}

function subscriptionPeriodEnd(sub: Stripe.Subscription): string | null {
  const legacy = sub as unknown as { current_period_end?: number }
  if (typeof legacy.current_period_end === 'number') {
    return new Date(legacy.current_period_end * 1000).toISOString()
  }

  const item = sub.items?.data?.[0] as unknown as { current_period_end?: number } | undefined
  if (typeof item?.current_period_end === 'number') {
    return new Date(item.current_period_end * 1000).toISOString()
  }

  return null
}

async function emailForCustomer(customerId: string, fallback?: string | null) {
  if (fallback) return fallback

  const { data } = await supabase
    .from('ai_agent_income_subscriptions')
    .select('email')
    .eq('stripe_customer_id', customerId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return typeof data?.email === 'string' ? data.email : null
}

async function upsertSubscription(sub: Stripe.Subscription, fallbackEmail?: string | null) {
  const stripeCustomerId = customerIdFrom(sub.customer)
  if (!stripeCustomerId) return

  const email = await emailForCustomer(stripeCustomerId, sub.metadata?.email || fallbackEmail || null)
  if (!email) return

  const { error } = await supabase.from('ai_agent_income_subscriptions').upsert(
    {
      email,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: sub.id,
      status: sub.status,
      price_id: sub.items.data[0]?.price.id ?? null,
      current_period_end: subscriptionPeriodEnd(sub),
      cancel_at_period_end: sub.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_subscription_id' },
  )

  if (error) throw error
}

async function ensureTelegramLink(email: string, stripeCustomerId: string) {
  const { error } = await supabase.from('telegram_links').upsert(
    {
      email,
      stripe_customer_id: stripeCustomerId,
      status: 'pending',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_customer_id' },
  )

  if (error) throw error
}

async function claimWebhookEvent(event: Stripe.Event) {
  const { error } = await supabase.from('stripe_webhook_events').insert({
    event_id: event.id,
    event_type: event.type,
    source: 'ai_agent_income',
    status: 'processing',
  })

  if (!error) return true
  if (error.code === '23505') return false
  throw error
}

async function markWebhookEventProcessed(event: Stripe.Event) {
  const { error } = await supabase
    .from('stripe_webhook_events')
    .update({
      status: 'processed',
      processed_at: new Date().toISOString(),
      error_message: null,
      updated_at: new Date().toISOString(),
    })
    .eq('event_id', event.id)

  if (error) throw error
}

async function markWebhookEventFailed(event: Stripe.Event, message: string) {
  await supabase
    .from('stripe_webhook_events')
    .update({
      status: 'failed',
      error_message: message,
      updated_at: new Date().toISOString(),
    })
    .eq('event_id', event.id)
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 })
  }

  const rawBody = await request.text()
  const stripe = createAiAgentIncomeStripeClient()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, getWebhookSecret())
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signature verification failed.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  try {
    const claimed = await claimWebhookEvent(event)
    if (!claimed) {
      return NextResponse.json({ received: true, duplicate: true })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const email = session.customer_details?.email || session.customer_email || session.metadata?.email || null
        const stripeCustomerId = customerIdFrom(session.customer)

        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string)
          await upsertSubscription(sub, email)
        }

        if (email && stripeCustomerId) {
          await ensureTelegramLink(email, stripeCustomerId)
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await upsertSubscription(sub)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const stripeCustomerId = customerIdFrom(invoice.customer)
        if (stripeCustomerId) {
          const email = await emailForCustomer(stripeCustomerId, null)
          if (email) {
            const { error } = await supabase
              .from('ai_agent_income_subscriptions')
              .update({ status: 'past_due', updated_at: new Date().toISOString() })
              .eq('stripe_customer_id', stripeCustomerId)
              .eq('email', email)
            if (error) throw error
          }
        }
        break
      }

      case 'customer.subscription.trial_will_end': {
        const sub = event.data.object as Stripe.Subscription
        await upsertSubscription(sub)
        break
      }

      default:
        break
    }

    await markWebhookEventProcessed(event)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown webhook error.'
    await markWebhookEventFailed(event, message)
    console.error('ai-agent-income webhook error', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
