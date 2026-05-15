function toIcalDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

function escapeIcal(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')
}

export function buildGoogleCalendarUrl(params: {
  title: string
  startIso: string
  endIso: string
  location?: string
  description?: string
}): string {
  const start = toIcalDate(params.startIso)
  const end = toIcalDate(params.endIso)
  const url = new URL('https://calendar.google.com/calendar/render')
  url.searchParams.set('action', 'TEMPLATE')
  url.searchParams.set('text', params.title)
  url.searchParams.set('dates', `${start}/${end}`)
  if (params.location) url.searchParams.set('location', params.location)
  if (params.description) url.searchParams.set('details', params.description)
  return url.toString()
}

export function buildIcalString(params: {
  uid: string
  title: string
  startIso: string
  endIso: string
  location?: string
  description?: string
}): string {
  const start = toIcalDate(params.startIso)
  const end = toIcalDate(params.endIso)
  const stamp = toIcalDate(new Date().toISOString())

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Masterminds HQ//Workshop Site//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${params.uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcal(params.title)}`,
  ]
  if (params.location) lines.push(`LOCATION:${escapeIcal(params.location)}`)
  if (params.description) lines.push(`DESCRIPTION:${escapeIcal(params.description)}`)
  lines.push('END:VEVENT', 'END:VCALENDAR')

  return lines.join('\r\n')
}
