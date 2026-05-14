const DEFAULT_REMINDER_WINDOW_MINUTES = 90

export function buildLocationReminderIdempotencyKey(input: {
  slug: string
  attendeeEmail: string
  eventStartIso: string
}) {
  const normalizedEmail = input.attendeeEmail.trim().toLowerCase()
  return `event-location-reminder/${input.slug}/${input.eventStartIso}/${normalizedEmail}`
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
