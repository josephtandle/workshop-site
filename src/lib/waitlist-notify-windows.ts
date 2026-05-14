export type NotifyWindow = {
  windowLabel: 't5h' | 't2h'
  variant: 'cancellation' | 't2h'
} | null

export function hoursUntilEvent(eventStartIso: string, now: Date): number {
  return (new Date(eventStartIso).getTime() - now.getTime()) / (1000 * 60 * 60)
}

export function resolveNotifyWindow(eventStartIso: string, now: Date): NotifyWindow {
  const hours = hoursUntilEvent(eventStartIso, now)

  if (hours >= 4.5 && hours < 5.5) return { windowLabel: 't5h', variant: 'cancellation' }
  if (hours >= 1.5 && hours < 2.5) return { windowLabel: 't2h', variant: 't2h' }
  return null
}
