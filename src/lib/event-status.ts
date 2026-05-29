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
  if (event.manuallyClosed) return true
  if (!event.registrationClosesIso) return false

  const closeMs = new Date(event.registrationClosesIso).getTime()
  return Number.isFinite(closeMs) && now.getTime() >= closeMs
}
