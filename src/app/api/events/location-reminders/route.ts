import { NextResponse, type NextRequest } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { getEventBySlug, getLiveEvents } from '@/lib/events'
import { sendEventLocationReminderEmail } from '@/lib/event-confirmation-email'
import { listLegacyPaidAttendeesForEvent } from '@/lib/legacy-event-schedule'
import { getConfirmedRegistrationsForEvent } from '@/lib/event-registration-db'
import { runLocationReminders } from '@/lib/location-reminder'
import { createSupabaseEventEmailLedger } from '@/lib/event-email-ledger'
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

  const ledger = createSupabaseEventEmailLedger({ client: supabase, source: 'location-reminders' })

  const run = await runLocationReminders(
    {
      now,
      force,
      dryRun,
      slug,
      events,
    },
    {
      acquireLock: acquireEventWindowLock,
      ledger,
      listAttendees: async (event) => {
        const [siteAttendees, legacyAttendees] = await Promise.all([
          getConfirmedRegistrationsForEvent(event.slug),
          event.legacyRegistration ? listLegacyPaidAttendeesForEvent(event) : Promise.resolve([]),
        ])
        return [...siteAttendees, ...legacyAttendees]
      },
      sendReminder: sendEventLocationReminderEmail,
    },
  )

  return NextResponse.json({
    ok: true,
    now: now.toISOString(),
    dueEventCount: run.results.length,
    force,
    dryRun,
    results: run.results,
  })
}
