import { NextResponse, type NextRequest } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { getEventBySlug, getLiveEvents } from '@/lib/events'
import { getConfirmedRegistrationsForEvent } from '@/lib/event-registration-db'
import { sendSessionReminderEmail } from '@/lib/event-confirmation-email'
import {
  buildSessionReminderLockKey,
  runSessionReminders,
} from '@/lib/session-reminder'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false
  const expected = `Bearer ${secret}`
  const provided = request.headers.get('authorization') ?? ''
  if (provided.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected))
}

async function acquireEventWindowLock(lockKey: string) {
  const { error } = await supabase.from('cron_window_locks').insert({ lock_key: lockKey })
  return !error
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const nowParam = url.searchParams.get('now')
  const slug = url.searchParams.get('slug')
  const force = url.searchParams.get('force') === '1'
  const dryRun = url.searchParams.get('dryRun') === '1'
  const now = nowParam ? new Date(nowParam) : new Date()

  if (Number.isNaN(now.getTime())) {
    return NextResponse.json({ error: 'Invalid now parameter.' }, { status: 400 })
  }

  const events = slug
    ? ([getEventBySlug(slug)].filter(Boolean) as ReturnType<typeof getLiveEvents>)
    : getLiveEvents()

  const run = await runSessionReminders(
    {
      now,
      force,
      dryRun,
      slug,
      events,
    },
    {
      acquireLock: acquireEventWindowLock,
      listConfirmedRegistrations: getConfirmedRegistrationsForEvent,
      sendReminder: sendSessionReminderEmail,
    },
  )

  return NextResponse.json({
    ok: true,
    now: now.toISOString(),
    force,
    dryRun,
    results: run.results,
  })
}
