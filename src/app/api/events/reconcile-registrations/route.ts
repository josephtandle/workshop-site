import { NextResponse, type NextRequest } from 'next/server'
import { randomUUID, timingSafeEqual } from 'crypto'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'
import { generateToken } from '@/lib/event-tokens'
import { getStripeSecretKey } from '@/lib/stripe'

export const runtime = 'nodejs'
export const maxDuration = 60

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false
  const expected = `Bearer ${secret}`
  const provided = request.headers.get('authorization') ?? ''
  if (provided.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected))
}

function isLikelyTest(name: string, email: string) {
  const n = name.toLowerCase()
  const e = email.toLowerCase()
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

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const secret = getStripeSecretKey()
  if (!secret) {
    return NextResponse.json({ error: 'Stripe not configured.' }, { status: 500 })
  }

  const stripe = new Stripe(secret)
  const lookbackDays = 14
  const threshold = Math.floor(Date.now() / 1000) - lookbackDays * 24 * 60 * 60

  const sessions: Stripe.Checkout.Session[] = []
  let startingAfter: string | undefined
  for (let page = 0; page < 10; page += 1) {
    const list: Stripe.ApiList<Stripe.Checkout.Session> = await stripe.checkout.sessions.list({
      limit: 100,
      created: { gte: threshold },
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    })
    for (const s of list.data) {
      if (!s.metadata?.event_slug) continue
      if (s.payment_status !== 'paid' || s.status !== 'complete') continue
      sessions.push(s)
    }
    if (!list.has_more || list.data.length === 0) break
    startingAfter = list.data[list.data.length - 1].id
  }

  if (sessions.length === 0) {
    return NextResponse.json({ ok: true, scanned: 0, inserted: 0 })
  }

  const slugs = Array.from(new Set(sessions.map((s) => s.metadata!.event_slug!)))
  const { data: existing, error: readErr } = await supabase
    .from('event_registrations')
    .select('attendee_email, stripe_session_id, event_slug')
    .in('event_slug', slugs)
    .eq('status', 'confirmed')

  if (readErr) {
    console.error('reconcile read error', readErr)
    return NextResponse.json({ error: 'Supabase read failed.' }, { status: 500 })
  }

  const knownByEvent = new Map<string, { emails: Set<string>; sessions: Set<string> }>()
  for (const slug of slugs) {
    knownByEvent.set(slug, { emails: new Set(), sessions: new Set() })
  }
  for (const row of existing ?? []) {
    const bucket = knownByEvent.get(row.event_slug)
    if (!bucket) continue
    if (row.attendee_email) bucket.emails.add(row.attendee_email.trim().toLowerCase())
    if (row.stripe_session_id) bucket.sessions.add(row.stripe_session_id)
  }

  let inserted = 0
  const drift: Array<{ slug: string; email: string; sessionId: string }> = []

  for (const s of sessions) {
    const slug = s.metadata!.event_slug!
    const name = (s.metadata?.attendee_name || s.customer_details?.name || '').trim()
    const email = (s.metadata?.attendee_email || s.customer_email || '').trim().toLowerCase()
    if (!name || !email) continue
    if (isLikelyTest(name, email)) continue
    const bucket = knownByEvent.get(slug)
    if (!bucket) continue
    if (bucket.emails.has(email) || bucket.sessions.has(s.id)) continue

    const id = randomUUID()
    const cancelToken = generateToken(`cancel:${id}`)
    const { error: insertErr } = await supabase.from('event_registrations').insert({
      id,
      event_slug: slug,
      attendee_name: name,
      attendee_email: email,
      stripe_session_id: s.id,
      amount_paid: Number(s.amount_total || 0) / 100,
      cancel_token: cancelToken,
      status: 'confirmed',
      registered_at: new Date(s.created * 1000).toISOString(),
    })
    if (insertErr) {
      console.error('reconcile insert error', slug, email, insertErr)
      continue
    }
    bucket.emails.add(email)
    bucket.sessions.add(s.id)
    inserted += 1
    drift.push({ slug, email, sessionId: s.id })
  }

  return NextResponse.json({
    ok: true,
    scanned: sessions.length,
    inserted,
    drift,
  })
}
