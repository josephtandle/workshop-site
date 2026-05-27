#!/usr/bin/env node
// Backfill Supabase event_registrations from Stripe paid checkout sessions.
// Usage: node scripts/backfill-event-registrations.mjs <event_slug>

import { createHmac, randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const slug = process.argv[2]
if (!slug) {
  console.error('Usage: node scripts/backfill-event-registrations.mjs <event_slug>')
  process.exit(1)
}

const stripeKey = process.env.STRIPE_SECRET_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SECRET_KEY
const cronSecret = process.env.CRON_SECRET

if (!stripeKey || !supabaseUrl || !supabaseKey || !cronSecret) {
  console.error('Missing env: need STRIPE_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL), SUPABASE_SECRET_KEY, CRON_SECRET')
  process.exit(1)
}

const stripe = new Stripe(stripeKey)
const supabase = createClient(supabaseUrl, supabaseKey)

function generateCancelToken(id) {
  return createHmac('sha256', cronSecret).update(`cancel:${id}`).digest('hex')
}

function isTestEntry({ name, email }) {
  const n = (name || '').toLowerCase()
  const e = (email || '').toLowerCase()
  return (
    e.endsWith('@example.com') ||
    e.includes('debug') ||
    n.includes('debug') ||
    n.includes('test') ||
    e.startsWith('joe-check') ||
    n === 'sdf' ||
    n === 'stes'
  )
}

async function fetchPaidSessions(eventSlug) {
  const sessions = []
  let startingAfter
  for (let page = 0; page < 20; page += 1) {
    const params = {
      limit: 100,
      created: { gte: Math.floor(Date.now() / 1000) - 180 * 24 * 60 * 60 },
    }
    if (startingAfter) params.starting_after = startingAfter
    const list = await stripe.checkout.sessions.list(params)
    for (const s of list.data) {
      if (s.metadata?.event_slug !== eventSlug) continue
      if (s.payment_status !== 'paid' || s.status !== 'complete') continue
      sessions.push(s)
    }
    if (!list.has_more || list.data.length === 0) break
    startingAfter = list.data[list.data.length - 1].id
  }
  return sessions
}

async function main() {
  console.log(`Fetching paid Stripe sessions for ${slug} ...`)
  const sessions = await fetchPaidSessions(slug)
  console.log(`Found ${sessions.length} paid sessions on Stripe`)

  const { data: existing, error: existingErr } = await supabase
    .from('event_registrations')
    .select('attendee_email, stripe_session_id')
    .eq('event_slug', slug)
    .eq('status', 'confirmed')

  if (existingErr) {
    console.error('Supabase read error:', existingErr)
    process.exit(1)
  }
  const knownEmails = new Set((existing ?? []).map((r) => (r.attendee_email || '').trim().toLowerCase()))
  const knownSessions = new Set((existing ?? []).map((r) => r.stripe_session_id).filter(Boolean))
  console.log(`Supabase already has ${knownEmails.size} confirmed rows`)

  let inserted = 0
  let skipped = 0
  let skippedTest = 0

  for (const s of sessions) {
    const name = (s.metadata?.attendee_name || s.customer_details?.name || '').trim()
    const email = (s.metadata?.attendee_email || s.customer_email || '').trim().toLowerCase()
    if (!name || !email) {
      console.log(`  skip ${s.id} — missing name/email`)
      skipped += 1
      continue
    }
    if (isTestEntry({ name, email })) {
      skippedTest += 1
      continue
    }
    if (knownEmails.has(email) || knownSessions.has(s.id)) {
      skipped += 1
      continue
    }

    const id = randomUUID()
    const cancel_token = generateCancelToken(id)
    const amount = Number(s.amount_total || 0) / 100
    const { error } = await supabase.from('event_registrations').insert({
      id,
      event_slug: slug,
      attendee_name: name,
      attendee_email: email,
      stripe_session_id: s.id,
      amount_paid: amount,
      cancel_token,
      status: 'confirmed',
      registered_at: new Date(s.created * 1000).toISOString(),
    })
    if (error) {
      console.error(`  FAIL ${name} <${email}>:`, error.message)
      continue
    }
    inserted += 1
    knownEmails.add(email)
    console.log(`  + ${name} <${email}> $${amount}`)
  }

  console.log('')
  console.log(`Done. Inserted: ${inserted}, Skipped existing: ${skipped}, Skipped test: ${skippedTest}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
