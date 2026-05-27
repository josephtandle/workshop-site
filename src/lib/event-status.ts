import type { EventDefinition } from '@/lib/events'

export function isEventEnded(event: Pick<EventDefinition, 'calendarEvent'>, now: Date = new Date()) {
  if (!event.calendarEvent?.endIso) return false

  const endMs = new Date(event.calendarEvent.endIso).getTime()
  return Number.isFinite(endMs) && now.getTime() >= endMs
}
