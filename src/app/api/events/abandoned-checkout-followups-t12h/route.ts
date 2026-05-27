import { NextResponse, type NextRequest } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { supabase } from '@/lib/supabase'
import {
  ABANDONED_CHECKOUT_T12H_AUTOMATION_KEY,
  getAbandonedCheckoutEligibleEvents,
  getAbandonedCheckoutAutomationControl,
  getCheckoutFollowupDefinition,
  runAbandonedCheckoutFollowups,
} from '@/lib/abandoned-checkout-followups'

export const runtime = 'nodejs'

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false
  const expected = `Bearer ${secret}`
  const provided = request.headers.get('authorization') ?? ''
  if (provided.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected))
}

async function acquireEventLock(eventSlug: string, mode: string, now: Date) {
  const definition = getCheckoutFollowupDefinition(ABANDONED_CHECKOUT_T12H_AUTOMATION_KEY)
  const lockKey = `${definition.eventLockPrefix}/${mode}/${eventSlug}/${now.toISOString().slice(0, 10)}`
  const { error } = await supabase.from('cron_window_locks').insert({ lock_key: lockKey })
  return !error
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const nowParam = url.searchParams.get('now')
  const now = nowParam ? new Date(nowParam) : new Date()

  if (Number.isNaN(now.getTime())) {
    return NextResponse.json({ error: 'Invalid now parameter.' }, { status: 400 })
  }

  const automationKey = ABANDONED_CHECKOUT_T12H_AUTOMATION_KEY
  const control = await getAbandonedCheckoutAutomationControl(automationKey)

  if (control.mode === 'off') {
    const run = await runAbandonedCheckoutFollowups(now, automationKey, control.mode)
    return NextResponse.json({
      ok: true,
      automationKey,
      mode: run.mode,
      now: now.toISOString(),
      testRecipients: run.testRecipients,
      results: run.results,
    })
  }

  const lockedEventSlugs = new Set<string>()
  for (const event of await getAbandonedCheckoutEligibleEvents(now, automationKey)) {
    const hasLock = await acquireEventLock(event.slug, control.mode, now)
    if (hasLock) lockedEventSlugs.add(event.slug)
  }

  const run = await runAbandonedCheckoutFollowups(now, automationKey, control.mode, lockedEventSlugs)

  return NextResponse.json({
    ok: true,
    automationKey,
    mode: run.mode,
    now: now.toISOString(),
    testRecipients: run.testRecipients,
    results: run.results,
  })
}
