import type { EventDefinition } from '@/lib/events'
import type { EventEmailLedger } from './event-email-ledger'
import { sendOneDeduped } from './event-email-ledger'

const DEFAULT_REMINDER_WINDOW_MINUTES = 90

export function buildLocationReminderIdempotencyKey(input: {
  slug: string
  attendeeEmail: string
  eventStartIso: string
}) {
  const normalizedEmail = input.attendeeEmail.trim().toLowerCase()
  return `event-location-reminder/${input.slug}/${input.eventStartIso}/${normalizedEmail}`
}

// The lock key is deliberately keyed on eventStartIso and NOT on
// now.toISOString().slice(0, 10) the way buildSessionReminderLockKey is: a
// 90 minute window can straddle UTC midnight, and a date-based key would mint a
// second lock halfway through and let the batch run twice.
export function buildLocationReminderLockKey(input: { slug: string; eventStartIso: string }) {
  return `location-reminders/${input.slug}/${input.eventStartIso}`
}

export function buildLocationReminderLedgerSlug(input: { slug: string; eventStartIso: string }) {
  return `event-location-reminder/${input.slug}/${input.eventStartIso}`
}

export function isLocationReminderDue(input: {
  eventStartIso: string
  leadHours: number
  now?: Date
  windowMinutes?: number
}) {
  const now = input.now ?? new Date()
  const reminderAt = new Date(
    new Date(input.eventStartIso).getTime() - input.leadHours * 60 * 60 * 1000,
  )
  const windowMinutes = input.windowMinutes ?? DEFAULT_REMINDER_WINDOW_MINUTES
  const windowEnd = new Date(reminderAt.getTime() + windowMinutes * 60 * 1000)

  return now >= reminderAt && now < windowEnd
}

// True once the scheduled location-reminder cron will never reach this
// registrant (its due window has fully closed). Anyone registering at or
// after this point gets the exact address immediately in their confirmation
// email instead of waiting on a reminder that has already passed them by.
export function hasLocationRevealWindowClosed(input: {
  eventStartIso: string
  leadHours: number
  now?: Date
  windowMinutes?: number
}) {
  const now = input.now ?? new Date()
  const reminderAt = new Date(
    new Date(input.eventStartIso).getTime() - input.leadHours * 60 * 60 * 1000,
  )
  const windowMinutes = input.windowMinutes ?? DEFAULT_REMINDER_WINDOW_MINUTES
  const windowEnd = new Date(reminderAt.getTime() + windowMinutes * 60 * 1000)

  return now >= windowEnd
}

export function dedupeAttendeesByEmail<T extends { attendeeEmail: string }>(attendees: T[]) {
  const seen = new Set<string>()
  const unique: T[] = []

  for (const attendee of attendees) {
    const email = attendee.attendeeEmail.trim().toLowerCase()
    if (!email || seen.has(email)) continue
    seen.add(email)
    unique.push(attendee)
  }

  return unique
}

export type LocationReminderRecipient = { attendeeName: string; attendeeEmail: string }

export type LocationReminderRunResult = {
  slug: string
  attendeeCount: number
  sentCount: number
  skippedAlreadySentCount: number
  dryRun: boolean
  locked: boolean
  errors: string[]
}

export type RunLocationRemindersInput = {
  now: Date
  force?: boolean
  dryRun?: boolean
  slug?: string | null
  events: EventDefinition[]
}

export type RunLocationRemindersDeps = {
  acquireLock: (lockKey: string) => Promise<boolean>
  ledger: EventEmailLedger
  listAttendees: (event: EventDefinition) => Promise<LocationReminderRecipient[]>
  sendReminder: (input: {
    event: EventDefinition
    attendeeName: string
    attendeeEmail: string
  }) => Promise<unknown>
}

export async function runLocationReminders(
  input: RunLocationRemindersInput,
  deps: RunLocationRemindersDeps,
): Promise<{ results: LocationReminderRunResult[] }> {
  const targetEvents = input.slug
    ? input.events.filter((event) => event.slug === input.slug)
    : input.events

  const results: LocationReminderRunResult[] = []
  const dryRun = input.dryRun === true

  for (const event of targetEvents) {
    const reminderConfig = event.privateLocationReminder
    if (!reminderConfig) continue

    // Force bypasses isLocationReminderDue to allow re-running a window that has closed.
    // Force does NOT bypass the lock or the ledger, preventing accidental duplicate emails.
    const isDue =
      input.force ||
      isLocationReminderDue({
        eventStartIso: reminderConfig.eventStartIso,
        leadHours: reminderConfig.leadHours,
        now: input.now,
      })

    if (!isDue) continue

    const attendees = dedupeAttendeesByEmail(await deps.listAttendees(event))

    // A dry run that burned a ledger slot would suppress the attendee's real reminder later,
    // which is the same trap bin/cohort-session-reminder.js guards with LIVE && !TEST_EMAIL.
    if (dryRun) {
      results.push({
        slug: event.slug,
        attendeeCount: attendees.length,
        sentCount: attendees.length,
        skippedAlreadySentCount: 0,
        dryRun: true,
        locked: true,
        errors: [],
      })
      continue
    }

    // Two layers of deduplication: the cron_window_locks row is the cheap fast
    // path that stops a redundant second pass, and the per-recipient
    // event_email_send_log row is the actual guarantee. If the lock row is ever lost,
    // cleared, or the table is truncated, the per-recipient ledger still makes a duplicate
    // impossible. This mirrors the JSON-state-file plus sqlite-ledger split documented in
    // projects/mastermind/bin/cohort-session-reminder.js.
    const lockKey = buildLocationReminderLockKey({
      slug: event.slug,
      eventStartIso: reminderConfig.eventStartIso,
    })

    const locked = await deps.acquireLock(lockKey)
    if (!locked) {
      results.push({
        slug: event.slug,
        attendeeCount: attendees.length,
        sentCount: 0,
        skippedAlreadySentCount: 0,
        dryRun: false,
        locked: false,
        errors: [],
      })
      continue
    }

    const ledgerSlug = buildLocationReminderLedgerSlug({
      slug: event.slug,
      eventStartIso: reminderConfig.eventStartIso,
    })

    let sentCount = 0
    let skippedAlreadySentCount = 0
    const errors: string[] = []

    for (const attendee of attendees) {
      const sendResult = await sendOneDeduped({
        ledger: deps.ledger,
        recipientEmail: attendee.attendeeEmail,
        slug: ledgerSlug,
        subject: `Exact location for ${event.title}`,
        send: () =>
          deps.sendReminder({
            event,
            attendeeName: attendee.attendeeName,
            attendeeEmail: attendee.attendeeEmail,
          }),
      })

      if (sendResult.outcome === 'sent') {
        sentCount += 1
      } else if (sendResult.outcome === 'already-sent') {
        skippedAlreadySentCount += 1
      } else if (sendResult.outcome === 'failed') {
        errors.push(`${attendee.attendeeEmail}: ${sendResult.error}`)
      }
    }

    results.push({
      slug: event.slug,
      attendeeCount: attendees.length,
      sentCount,
      skippedAlreadySentCount,
      dryRun: false,
      locked: true,
      errors,
    })
  }

  return { results }
}
