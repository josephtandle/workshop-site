import type { EventDefinition } from '@/lib/events'
import { buildUnsubscribeHeaders, buildUnsubscribeUrl } from '@/lib/list-unsubscribe'
import { isSuppressed } from '@/lib/email-suppressions'
import { dedupeAttendeesByEmail } from './location-reminder'

/**
 * Post-event follow-up.
 *
 * Every other cron on this site is a PRE-event reminder: it computes
 * `eventStart - leadHours`. This one is the mirror image. It fires AFTER the
 * event, computed from `calendarEvent.endIso + leadHours` with a POSITIVE
 * lead, and it never fires for an event that has not ended yet.
 *
 * This is a marketing-class send (it carries an invitation link), so it must
 * go through the suppression list and must carry RFC 8058 unsubscribe headers.
 */

export const DEFAULT_FOLLOWUP_LEAD_HOURS = 20
const DEFAULT_FOLLOWUP_WINDOW_MINUTES = 90

export function buildEventFollowupIdempotencyKey(input: {
  slug: string
  attendeeEmail: string
  eventEndIso: string
}) {
  const normalizedEmail = input.attendeeEmail.trim().toLowerCase()
  return `event-followup/${input.slug}/${input.eventEndIso}/${normalizedEmail}`
}

export function buildEventFollowupLockKey(input: { slug: string; now: Date }) {
  return `event-followups/${input.slug}/${input.now.toISOString().slice(0, 10)}`
}

/**
 * Due when now is inside [end + leadHours, end + leadHours + windowMinutes).
 * leadHours is positive: it counts FORWARD from the end of the event.
 */
export function isEventFollowupDue(input: {
  eventEndIso: string
  leadHours?: number
  now?: Date
  windowMinutes?: number
}) {
  const now = input.now ?? new Date()
  const end = new Date(input.eventEndIso)
  if (Number.isNaN(end.getTime())) return false

  // Never follow up on an event that has not ended.
  if (now < end) return false

  const leadHours = input.leadHours ?? DEFAULT_FOLLOWUP_LEAD_HOURS
  const followupAt = new Date(end.getTime() + leadHours * 60 * 60 * 1000)
  const windowMinutes = input.windowMinutes ?? DEFAULT_FOLLOWUP_WINDOW_MINUTES
  const windowEnd = new Date(followupAt.getTime() + windowMinutes * 60 * 1000)

  return now >= followupAt && now < windowEnd
}

export function hasEventEnded(eventEndIso: string, now: Date) {
  const end = new Date(eventEndIso)
  if (Number.isNaN(end.getTime())) return false
  return now >= end
}

/**
 * Per-event follow-up copy, keyed by slug, with a sensible default.
 *
 * Kept here rather than on EventDefinition so adding copy for a new event
 * never touches `src/lib/events.tsx`.
 *
 * Content rules for everything below: no em dashes, no exclamation points,
 * no "excited to share", no British slang.
 */
export type EventFollowupCopy = {
  subject: string
  headline: string
  thanksLine: string
  resourcesLine: string
  invitationLabel: string
  invitationUrl: string
  signOff: string
}

const DEFAULT_FOLLOWUP_COPY: EventFollowupCopy = {
  subject: 'Thanks for coming',
  headline: 'Thanks for coming',
  thanksLine:
    'It was good to have you there. Thanks for giving up the time and for the questions you brought.',
  resourcesLine:
    'The recording and the resources from the session are on their way. I will send the link here as soon as they are ready.',
  invitationLabel: 'See what we run next',
  invitationUrl: 'https://mastermindshq.business',
  signOff: 'Joe Che\nMasterminds HQ',
}

const FOLLOWUP_COPY_BY_SLUG: Record<string, Partial<EventFollowupCopy>> = {}

export function getEventFollowupCopy(slug: string): EventFollowupCopy {
  return { ...DEFAULT_FOLLOWUP_COPY, ...(FOLLOWUP_COPY_BY_SLUG[slug] ?? {}) }
}

export function buildEventFollowupSubject(event: EventDefinition) {
  return getEventFollowupCopy(event.slug).subject
}

export function buildEventFollowupEmailHtml(
  event: EventDefinition,
  attendeeName: string,
  attendeeEmail = '',
) {
  const copy = getEventFollowupCopy(event.slug)
  const firstName = attendeeName.trim().split(/\s+/)[0]
  const greeting = firstName ? `Hi ${firstName},` : 'Hi,'
  const signatureHtml = copy.signOff.split('\n').join('<br>')
  const unsubscribeUrl = attendeeEmail ? buildUnsubscribeUrl(attendeeEmail) : ''
  const unsubscribeHtml = unsubscribeUrl
    ? `<p style="margin: 18px 0 0; font-size: 12px; color: #9e93be;">
            <a href="${unsubscribeUrl}" style="color:#9e93be; text-decoration:underline;">Unsubscribe</a>
          </p>`
    : ''

  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f2ff; margin: 0; padding: 32px 16px; color: #1a1a1a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 22px; overflow: hidden; border: 1px solid rgba(124, 105, 199, 0.12);">
        <div style="padding: 34px 32px 8px;">
          <h1 style="margin: 0; font-size: 26px; line-height: 1.15; font-weight: 800; color: #1a1a1a;">
            ${copy.headline}
          </h1>
          <p style="margin: 20px 0 0; font-size: 15px; line-height: 1.75; color: #4b4263;">
            ${greeting}
          </p>
          <p style="margin: 14px 0 0; font-size: 15px; line-height: 1.75; color: #4b4263;">
            ${copy.thanksLine}
          </p>
          <p style="margin: 14px 0 0; font-size: 15px; line-height: 1.75; color: #4b4263;">
            ${copy.resourcesLine}
          </p>
        </div>

        <div style="padding: 24px 32px 8px;">
          <a href="${copy.invitationUrl}" style="display: inline-block; background: #7C69C7; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 13px 24px; border-radius: 999px;">
            ${copy.invitationLabel}
          </a>
        </div>

        <div style="padding: 18px 32px 30px;">
          <p style="margin: 12px 0 0; font-size: 14px; line-height: 1.75; color: #7a7291;">
            ${signatureHtml}
          </p>
          ${unsubscribeHtml}
        </div>
      </div>
    </div>
  `
}

async function sendResendEmail(input: {
  attendeeEmail: string
  subject: string
  html: string
  idempotencyKey: string
  headers?: Record<string, string>
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('Resend API key is not configured.')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'Idempotency-Key': input.idempotencyKey,
    },
    body: JSON.stringify({
      from: 'Joe Che <joe@mastermindshq.business>',
      to: [input.attendeeEmail],
      subject: input.subject,
      html: input.html,
      ...(input.headers ? { headers: input.headers } : {}),
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Resend event followup error: ${response.status}${body ? ` ${body}` : ''}`)
  }

  return response.json()
}

export async function sendEventFollowupEmail(input: {
  event: EventDefinition
  attendeeName: string
  attendeeEmail: string
}) {
  const endIso = input.event.calendarEvent?.endIso
  if (!endIso) {
    throw new Error(`Event ${input.event.slug} is missing calendar event details.`)
  }

  return sendResendEmail({
    attendeeEmail: input.attendeeEmail,
    subject: buildEventFollowupSubject(input.event),
    html: buildEventFollowupEmailHtml(input.event, input.attendeeName, input.attendeeEmail),
    idempotencyKey: buildEventFollowupIdempotencyKey({
      slug: input.event.slug,
      attendeeEmail: input.attendeeEmail,
      eventEndIso: endIso,
    }),
    headers: buildUnsubscribeHeaders(input.attendeeEmail),
  })
}

export type EventFollowupRecipient = {
  attendeeName: string
  attendeeEmail: string
}

export type EventFollowupRunResult = {
  slug: string
  attendeeCount: number
  sentCount: number
  suppressedCount: number
  dryRun: boolean
  errors: string[]
}

export type RunEventFollowupsInput = {
  now: Date
  force?: boolean
  dryRun?: boolean
  slug?: string | null
  events: EventDefinition[]
  leadHours?: number
}

export type RunEventFollowupsDeps = {
  acquireLock: (lockKey: string) => Promise<boolean>
  listConfirmedRegistrations: (eventSlug: string) => Promise<EventFollowupRecipient[]>
  sendFollowup: (input: {
    event: EventDefinition
    attendeeName: string
    attendeeEmail: string
  }) => Promise<unknown>
  isSuppressed?: (email: string) => Promise<boolean>
}

export async function runEventFollowups(
  input: RunEventFollowupsInput,
  deps: RunEventFollowupsDeps,
): Promise<{ results: EventFollowupRunResult[] }> {
  const targetEvents = input.slug
    ? input.events.filter((event) => event.slug === input.slug)
    : input.events

  const results: EventFollowupRunResult[] = []
  const dryRun = input.dryRun === true
  const leadHours = input.leadHours ?? DEFAULT_FOLLOWUP_LEAD_HOURS
  const suppressionCheck = deps.isSuppressed ?? isSuppressed

  for (const event of targetEvents) {
    const endIso = event.calendarEvent?.endIso
    if (!endIso) continue

    // Hard floor: the event must have ended, even under force.
    if (!hasEventEnded(endIso, input.now)) continue

    const due = input.force
      ? true
      : isEventFollowupDue({ eventEndIso: endIso, leadHours, now: input.now })

    if (!due) continue

    const attendees = dedupeAttendeesByEmail(await deps.listConfirmedRegistrations(event.slug))

    const lockKey = buildEventFollowupLockKey({ slug: event.slug, now: input.now })

    if (!dryRun) {
      const locked = await deps.acquireLock(lockKey)
      if (!locked) {
        continue
      }
    }

    const result: EventFollowupRunResult = {
      slug: event.slug,
      attendeeCount: attendees.length,
      sentCount: 0,
      suppressedCount: 0,
      dryRun,
      errors: [],
    }

    for (const attendee of attendees) {
      try {
        // Marketing-class send: suppression is checked before every send,
        // including in dry runs so the dry-run count matches reality.
        if (await suppressionCheck(attendee.attendeeEmail)) {
          result.suppressedCount += 1
          continue
        }
      } catch (error) {
        result.errors.push(
          `${attendee.attendeeEmail}: ${error instanceof Error ? error.message : 'Suppression check failed.'}`,
        )
        continue
      }

      if (dryRun) {
        result.sentCount += 1
        continue
      }

      try {
        await deps.sendFollowup({
          event,
          attendeeName: attendee.attendeeName,
          attendeeEmail: attendee.attendeeEmail,
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

  return { results }
}
