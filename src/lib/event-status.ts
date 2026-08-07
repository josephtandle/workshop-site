import type { EventDefinition } from '@/lib/events'

export function isEventEnded(event: Pick<EventDefinition, 'calendarEvent'>, now: Date = new Date()) {
  if (!event.calendarEvent?.endIso) return false

  const endMs = new Date(event.calendarEvent.endIso).getTime()
  return Number.isFinite(endMs) && now.getTime() >= endMs
}

export function isEventRegistrationClosed(
  event: Pick<EventDefinition, 'manuallyClosed' | 'registrationClosesIso'>,
  now: Date = new Date(),
) {
  return event.manuallyClosed || isRegistrationWindowPassed(event, now)
}

// Split out from isEventRegistrationClosed so the page can tell "closed because
// an admin toggled it off (capacity, sold out)" apart from "closed because the
// scheduled cutoff passed." The two need different copy: a manual close usually
// still makes sense to waitlist (a spot might free up); a scheduled cutoff for
// a same-day in-person event does not, nobody benefits from waitlisting a seat
// 30 minutes before doors open.
export function isRegistrationWindowPassed(
  event: Pick<EventDefinition, 'registrationClosesIso'>,
  now: Date = new Date(),
) {
  if (!event.registrationClosesIso) return false

  const closeMs = new Date(event.registrationClosesIso).getTime()
  return Number.isFinite(closeMs) && now.getTime() >= closeMs
}
