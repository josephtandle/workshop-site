import type { EventDefinition } from '@/lib/events'
import { dedupeAttendeesByEmail } from './location-reminder'

export type SessionReminderWindowLabel = 't24h' | 't2h'

type SessionReminderWindow = {
  windowLabel: SessionReminderWindowLabel
  leadHours: number
}

const DEFAULT_REMINDER_WINDOW_MINUTES = 90

const SESSION_REMINDER_WINDOWS: SessionReminderWindow[] = [
  { windowLabel: 't24h', leadHours: 24 },
  { windowLabel: 't2h', leadHours: 2 },
]

export function buildSessionReminderIdempotencyKey(input: {
  slug: string
  attendeeEmail: string
  eventStartIso: string
  windowLabel: SessionReminderWindowLabel
}) {
  const normalizedEmail = input.attendeeEmail.trim().toLowerCase()
  return `session-reminder/${input.windowLabel}/${input.slug}/${input.eventStartIso}/${normalizedEmail}`
}

export function buildSessionReminderLockKey(input: {
  slug: string
  windowLabel: SessionReminderWindowLabel
  now: Date
}) {
  return `session-reminders/${input.windowLabel}/${input.slug}/${input.now.toISOString().slice(0, 10)}`
}

export function isSessionReminderDue(input: {
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

export function getDueSessionReminderWindows(eventStartIso: string, now: Date) {
  return SESSION_REMINDER_WINDOWS.filter((window) =>
    isSessionReminderDue({
      eventStartIso,
      leadHours: window.leadHours,
      now,
    }),
  )
}

export type SessionReminderRecipient = {
  attendeeName: string
  attendeeEmail: string
}

export type SessionReminderRunResult = {
  slug: string
  windowLabel: SessionReminderWindowLabel
  attendeeCount: number
  sentCount: number
  dryRun: boolean
  errors: string[]
}

export type RunSessionRemindersInput = {
  now: Date
  force?: boolean
  dryRun?: boolean
  slug?: string | null
  events: EventDefinition[]
}

export type RunSessionRemindersDeps = {
  acquireLock: (lockKey: string) => Promise<boolean>
  listConfirmedRegistrations: (eventSlug: string) => Promise<SessionReminderRecipient[]>
  sendReminder: (input: {
    event: EventDefinition
    attendeeName: string
    attendeeEmail: string
    windowLabel: SessionReminderWindowLabel
  }) => Promise<unknown>
}

export async function runSessionReminders(
  input: RunSessionRemindersInput,
  deps: RunSessionRemindersDeps,
): Promise<{ results: SessionReminderRunResult[] }> {
  const targetEvents = input.slug
    ? input.events.filter((event) => event.slug === input.slug)
    : input.events

  const results: SessionReminderRunResult[] = []
  const dryRun = input.dryRun === true

  for (const event of targetEvents) {
    const startIso = event.calendarEvent?.startIso
    if (!event.zoomLink || !startIso) continue

    const dueWindows = input.force
      ? SESSION_REMINDER_WINDOWS
      : getDueSessionReminderWindows(startIso, input.now)

    if (dueWindows.length === 0) continue

    const attendees = dedupeAttendeesByEmail(await deps.listConfirmedRegistrations(event.slug))

    for (const window of dueWindows) {
      const lockKey = buildSessionReminderLockKey({
        slug: event.slug,
        windowLabel: window.windowLabel,
        now: input.now,
      })

      if (!dryRun) {
        const locked = await deps.acquireLock(lockKey)
        if (!locked) {
          continue
        }
      }

      const result: SessionReminderRunResult = {
        slug: event.slug,
        windowLabel: window.windowLabel,
        attendeeCount: attendees.length,
        sentCount: 0,
        dryRun,
        errors: [],
      }

      for (const attendee of attendees) {
        if (dryRun) {
          result.sentCount += 1
          continue
        }

        try {
          await deps.sendReminder({
            event,
            attendeeName: attendee.attendeeName,
            attendeeEmail: attendee.attendeeEmail,
            windowLabel: window.windowLabel,
          })
          result.sentCount += 1
        } catch (error) {
          result.errors.push(
            `${attendee.attendeeEmail}: ${error instanceof Error ? error.message : 'Unknown error.'}`,
          )
        }
      }

      results.push(result)
    }
  }

  return { results }
}
