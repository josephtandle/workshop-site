import type Stripe from 'stripe'
import { randomUUID } from 'crypto'
import type { EventDefinition } from '@/lib/events'
import { getLiveEvents, getEventBySlug } from '@/lib/events'
import { createStripeClient } from '@/lib/stripe'
import { toOrigin } from '@/lib/url-utils'

const RESEND_API_KEY = process.env.RESEND_API_KEY

export const ABANDONED_CHECKOUT_DAY1_AUTOMATION_KEY = 'abandoned_checkout_day_1'
export const ABANDONED_CHECKOUT_T12H_AUTOMATION_KEY = 'abandoned_checkout_t12h'
export const DEFAULT_TEST_RECIPIENTS = ['newyork1@gmail.com', 'joe@mastermindshq.business']

export type CheckoutFollowupAutomationKey =
  | typeof ABANDONED_CHECKOUT_DAY1_AUTOMATION_KEY
  | typeof ABANDONED_CHECKOUT_T12H_AUTOMATION_KEY

export type AbandonedCheckoutMode = 'off' | 'test' | 'live'

export type AbandonedCheckoutAutomationControl = {
  mode: AbandonedCheckoutMode
  testRecipients: string[]
}

export type AbandonedCheckoutCandidate = {
  event: EventDefinition
  attendeeEmail: string
  attendeeName: string
  firstName: string
  sourceCheckoutSessionId: string
  sourceCheckoutCreatedAt: string
  eventUrl: string
  financeLineIncluded: boolean
}

type CheckoutFollowupStateRow = {
  attendee_email: string
  event_slug: string
  source_checkout_session_id: string | null
  live_sent_at: string | null
  live_send_claimed_at?: string | null
  live_send_claim_token?: string | null
  last_test_sent_at: string | null
  last_test_source_checkout_session_id: string | null
}

let supabaseClient: typeof import('@/lib/supabase').supabase | null = null
let hasOpenSpotsImpl: typeof import('@/lib/event-registration-db').hasOpenSpots | null = null

async function getSupabase() {
  if (supabaseClient) return supabaseClient
  const module = await import('@/lib/supabase')
  supabaseClient = module.supabase
  return supabaseClient
}

async function getHasOpenSpots() {
  if (hasOpenSpotsImpl) return hasOpenSpotsImpl
  const module = await import('@/lib/event-registration-db')
  hasOpenSpotsImpl = module.hasOpenSpots
  return hasOpenSpotsImpl
}

type CandidateStatus =
  | 'candidate'
  | 'skipped_live_sent'
  | 'skipped_paid'
  | 'skipped_registered'
  | 'skipped_suppressed'

type CandidateEvaluation = {
  status: CandidateStatus
  candidate?: AbandonedCheckoutCandidate
  suppressionReason?: string
}

export type AbandonedCheckoutRouteResult = {
  slug: string
  eligible: number
  sent: number
  suppressed: number
  failed: number
  skippedPaid: number
  skippedRecent: number
  preview: Array<{
    attendeeEmail: string
    attendeeName: string
    sourceCheckoutSessionId: string
    sourceCheckoutCreatedAt: string
  }>
  errors: string[]
}

export type LiveSendOutcome = 'sent' | 'skipped_claimed' | 'failed'

type CheckoutFollowupDefinition = {
  automationKey: CheckoutFollowupAutomationKey
  eventLockPrefix: string
  minCheckoutAgeHours: number
  leadHoursBeforeEvent: number | null
  leadWindowMinutes: number
  requiresOpenSpots: boolean
}

const CHECKOUT_FOLLOWUP_DEFINITIONS: Record<CheckoutFollowupAutomationKey, CheckoutFollowupDefinition> = {
  [ABANDONED_CHECKOUT_DAY1_AUTOMATION_KEY]: {
    automationKey: ABANDONED_CHECKOUT_DAY1_AUTOMATION_KEY,
    eventLockPrefix: 'abandoned-checkout-day-1',
    minCheckoutAgeHours: 24,
    leadHoursBeforeEvent: null,
    leadWindowMinutes: 0,
    requiresOpenSpots: false,
  },
  [ABANDONED_CHECKOUT_T12H_AUTOMATION_KEY]: {
    automationKey: ABANDONED_CHECKOUT_T12H_AUTOMATION_KEY,
    eventLockPrefix: 'abandoned-checkout-t12h',
    minCheckoutAgeHours: 0,
    leadHoursBeforeEvent: 12,
    leadWindowMinutes: 60,
    requiresOpenSpots: true,
  },
}

function getSiteUrl() {
  return (toOrigin(process.env.NEXT_PUBLIC_SITE_URL) || 'https://workshop.mastermindshq.business').replace(/\/+$/g, '')
}

function normalizeEmail(email: string | null | undefined) {
  return (email || '').trim().toLowerCase()
}

function normalizeName(name: string | null | undefined) {
  return (name || '').trim()
}

function getFirstName(name: string) {
  return normalizeName(name).split(/\s+/)[0] || 'there'
}

function buildEventUrl(slug: string) {
  return `${getSiteUrl()}/events/${slug}`
}

function isKnownMode(value: unknown): value is AbandonedCheckoutMode {
  return value === 'off' || value === 'test' || value === 'live'
}

export function getCheckoutFollowupDefinition(automationKey: CheckoutFollowupAutomationKey) {
  return CHECKOUT_FOLLOWUP_DEFINITIONS[automationKey]
}

function normalizeTestRecipients(value: unknown): string[] {
  if (!Array.isArray(value)) return [...DEFAULT_TEST_RECIPIENTS]

  const unique = new Set<string>()
  for (const item of value) {
    const normalized = normalizeEmail(typeof item === 'string' ? item : '')
    if (normalized) unique.add(normalized)
  }

  if (unique.size === 0) {
    return [...DEFAULT_TEST_RECIPIENTS]
  }

  return Array.from(unique)
}

export function shouldIncludeFinanceLine(event: EventDefinition) {
  return event.pricing.donationMode !== true && event.pricing.fullPrice > 50
}

export function buildAbandonedCheckoutIdempotencyKey(slug: string, email: string) {
  return `abandoned-checkout-day-1/${slug}/${normalizeEmail(email)}`
}

export function buildAbandonedCheckoutT12hIdempotencyKey(slug: string, email: string) {
  return `abandoned-checkout-t12h/${slug}/${normalizeEmail(email)}`
}

export function buildAbandonedCheckoutTestIdempotencyKey(
  slug: string,
  email: string,
  testRecipient: string,
) {
  return `abandoned-checkout-day-1-test/${slug}/${normalizeEmail(email)}/${normalizeEmail(testRecipient)}`
}

export function buildAbandonedCheckoutT12hTestIdempotencyKey(
  slug: string,
  email: string,
  testRecipient: string,
) {
  return `abandoned-checkout-t12h-test/${slug}/${normalizeEmail(email)}/${normalizeEmail(testRecipient)}`
}

export function buildAbandonedCheckoutSubject(event: EventDefinition) {
  return `Follow-up for ${event.title}`
}

export function buildAbandonedCheckoutT12hSubject(event: EventDefinition) {
  return `Still interested in ${event.title}?`
}

export function buildAbandonedCheckoutTestSubject(
  event: EventDefinition,
  attendeeEmail: string,
) {
  return `[TEST] Follow-up for ${event.title} -> ${normalizeEmail(attendeeEmail)}`
}

export function buildAbandonedCheckoutT12hTestSubject(
  event: EventDefinition,
  attendeeEmail: string,
) {
  return `[TEST] Still interested in ${event.title}? -> ${normalizeEmail(attendeeEmail)}`
}

export function buildAbandonedCheckoutEmailHtml(candidate: AbandonedCheckoutCandidate) {
  const financeHtml = candidate.financeLineIncluded
    ? `<p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">
        And if finances are the thing getting in the way, let me know. I can look into whether there are any options.
      </p>`
    : ''

  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f2ff; margin: 0; padding: 32px 16px; color: #1a1a1a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 80px rgba(26, 14, 56, 0.12); border: 1px solid rgba(124, 105, 199, 0.12);">
        <div style="background: linear-gradient(135deg, #110f17 0%, #1a1526 55%, #7C69C7 100%); padding: 36px 32px 32px;">
          <p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #cfc7ee;">Event Follow-up</p>
          <h1 style="margin: 0; font-size: 34px; line-height: 1.02; font-weight: 800; color: #ffffff;">
            Follow-up for ${candidate.event.title}
          </h1>
          <p style="margin: 18px 0 0; font-size: 17px; line-height: 1.7; color: rgba(252,244,235,0.84);">
            Hi ${candidate.firstName},
          </p>
        </div>

        <div style="padding: 30px 32px 24px;">
          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">
            It looks like you tried signing up for <strong style="color:#16121f;">${candidate.event.title}</strong>.
          </p>
          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">
            I built this whole checkout flow myself, and sometimes there are still errors.
          </p>
          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">
            If something went wrong, hit reply and let me know. I can get it fixed up. I'd love to have you at the event.
          </p>
          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">
            If you had trouble with payments through Stripe, let me know. I might have some other options.
          </p>
          ${financeHtml}
          <div style="margin: 28px 0 18px;">
            <a href="${candidate.eventUrl}" style="display:inline-block; background:#7C69C7; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:12px; font-size:16px; font-weight:700; box-shadow:0 14px 32px rgba(124,105,199,0.24);">
              Open the event page
            </a>
          </div>
          <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.75; color: #4b4263;">
            You can try again here: <a href="${candidate.eventUrl}" style="color:#7C69C7; font-weight:700; text-decoration:none;">${candidate.eventUrl}</a>
          </p>
          <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #4b4263;">
            Joe
          </p>
        </div>
      </div>
    </div>
  `
}

export function buildAbandonedCheckoutT12hEmailHtml(candidate: AbandonedCheckoutCandidate) {
  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f2ff; margin: 0; padding: 32px 16px; color: #1a1a1a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 80px rgba(26, 14, 56, 0.12); border: 1px solid rgba(124, 105, 199, 0.12);">
        <div style="padding: 32px;">
          <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.7; color: #4b4263;">
            ${candidate.firstName}, are you still interested in coming to this event?
          </p>
          <p style="margin: 0 0 22px; font-size: 16px; line-height: 1.7; color: #4b4263;">
            We have a spot left for <strong style="color:#16121f;">${candidate.event.title}</strong>.
          </p>
          <div style="margin: 0 0 18px;">
            <a href="${candidate.eventUrl}" style="display:inline-block; background:#7C69C7; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:12px; font-size:16px; font-weight:700; box-shadow:0 14px 32px rgba(124,105,199,0.24);">
              Open the event page
            </a>
          </div>
          <p style="margin: 0; font-size: 14px; line-height: 1.75; color: #4b4263;">
            <a href="${candidate.eventUrl}" style="color:#7C69C7; font-weight:700; text-decoration:none;">${candidate.eventUrl}</a>
          </p>
        </div>
      </div>
    </div>
  `
}

export function buildAbandonedCheckoutTestEmailHtml(
  candidate: AbandonedCheckoutCandidate,
  mode: AbandonedCheckoutMode,
  innerHtml: string = buildAbandonedCheckoutEmailHtml(candidate),
) {
  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f2ff; margin: 0; padding: 32px 16px; color: #1a1a1a;">
      <div style="max-width: 720px; margin: 0 auto; background: #ffffff; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 80px rgba(26, 14, 56, 0.12); border: 1px solid rgba(124, 105, 199, 0.12);">
        <div style="background: #16121f; padding: 24px 28px;">
          <p style="margin: 0; font-size: 12px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #cfc7ee;">Test send only</p>
        </div>
        <div style="padding: 28px;">
          <p style="margin: 0 0 12px; font-size: 15px; color: #4b4263;"><strong>Mode:</strong> ${mode}</p>
          <p style="margin: 0 0 12px; font-size: 15px; color: #4b4263;"><strong>Event:</strong> ${candidate.event.title} (${candidate.event.slug})</p>
          <p style="margin: 0 0 12px; font-size: 15px; color: #4b4263;"><strong>Intended attendee:</strong> ${candidate.attendeeName} &lt;${candidate.attendeeEmail}&gt;</p>
          <p style="margin: 0 0 12px; font-size: 15px; color: #4b4263;"><strong>Source checkout session:</strong> ${candidate.sourceCheckoutSessionId}</p>
          <p style="margin: 0 0 24px; font-size: 15px; color: #4b4263;"><strong>Finance line included:</strong> ${candidate.financeLineIncluded ? 'yes' : 'no'}</p>
          <div style="border-top: 1px solid rgba(124, 105, 199, 0.12); padding-top: 24px;">
            ${innerHtml}
          </div>
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
}) {
  if (!RESEND_API_KEY) {
    throw new Error('Resend API key is not configured.')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Idempotency-Key': input.idempotencyKey,
    },
    body: JSON.stringify({
      from: 'Joe Che <joe@mastermindshq.business>',
      to: [input.attendeeEmail],
      subject: input.subject,
      html: input.html,
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Resend abandoned checkout error: ${response.status}${body ? ` ${body}` : ''}`)
  }

  return response.json()
}

export async function sendAbandonedCheckoutFollowupEmail(candidate: AbandonedCheckoutCandidate) {
  return sendResendEmail({
    attendeeEmail: candidate.attendeeEmail,
    subject: buildAbandonedCheckoutSubject(candidate.event),
    html: buildAbandonedCheckoutEmailHtml(candidate),
    idempotencyKey: buildAbandonedCheckoutIdempotencyKey(candidate.event.slug, candidate.attendeeEmail),
  })
}

export async function sendAbandonedCheckoutT12hEmail(candidate: AbandonedCheckoutCandidate) {
  return sendResendEmail({
    attendeeEmail: candidate.attendeeEmail,
    subject: buildAbandonedCheckoutT12hSubject(candidate.event),
    html: buildAbandonedCheckoutT12hEmailHtml(candidate),
    idempotencyKey: buildAbandonedCheckoutT12hIdempotencyKey(candidate.event.slug, candidate.attendeeEmail),
  })
}

export async function sendAbandonedCheckoutFollowupTestEmail(
  automationKey: CheckoutFollowupAutomationKey,
  candidate: AbandonedCheckoutCandidate,
  testRecipient: string,
  mode: AbandonedCheckoutMode,
) {
  const isT12h = automationKey === ABANDONED_CHECKOUT_T12H_AUTOMATION_KEY
  return sendResendEmail({
    attendeeEmail: testRecipient,
    subject: isT12h
      ? buildAbandonedCheckoutT12hTestSubject(candidate.event, candidate.attendeeEmail)
      : buildAbandonedCheckoutTestSubject(candidate.event, candidate.attendeeEmail),
    html: buildAbandonedCheckoutTestEmailHtml(
      candidate,
      mode,
      isT12h ? buildAbandonedCheckoutT12hEmailHtml(candidate) : buildAbandonedCheckoutEmailHtml(candidate),
    ),
    idempotencyKey: isT12h
      ? buildAbandonedCheckoutT12hTestIdempotencyKey(
          candidate.event.slug,
          candidate.attendeeEmail,
          testRecipient,
        )
      : buildAbandonedCheckoutTestIdempotencyKey(
          candidate.event.slug,
          candidate.attendeeEmail,
          testRecipient,
        ),
  })
}

export async function getAbandonedCheckoutAutomationControl(
  automationKey: CheckoutFollowupAutomationKey = ABANDONED_CHECKOUT_DAY1_AUTOMATION_KEY,
): Promise<AbandonedCheckoutAutomationControl> {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('event_automation_controls')
    .select('mode, test_recipients')
    .eq('automation_key', automationKey)
    .maybeSingle()

  if (error || !data) {
    return {
      mode: 'off',
      testRecipients: [...DEFAULT_TEST_RECIPIENTS],
    }
  }

  return {
    mode: isKnownMode(data.mode) ? data.mode : 'off',
    testRecipients: normalizeTestRecipients(data.test_recipients),
  }
}

function isEventUpcoming(event: EventDefinition, now: Date) {
  const referenceIso = event.calendarEvent?.endIso || event.privateLocationReminder?.eventStartIso
  if (!referenceIso) return true

  const eventTime = new Date(referenceIso)
  if (Number.isNaN(eventTime.getTime())) return true
  return eventTime.getTime() > now.getTime()
}

function supportsCheckoutFollowup(event: EventDefinition) {
  return event.status === 'live' && (event.pricing.fullPrice > 0 || event.pricing.donationMode === true)
}

function getEventStartIso(event: EventDefinition) {
  return event.calendarEvent?.startIso || event.privateLocationReminder?.eventStartIso || null
}

export function isEventInLeadWindow(
  event: EventDefinition,
  now: Date,
  leadHoursBeforeEvent: number,
  leadWindowMinutes: number,
) {
  const startIso = getEventStartIso(event)
  if (!startIso) return false

  const start = new Date(startIso)
  if (Number.isNaN(start.getTime())) return false

  const diffMinutes = (start.getTime() - now.getTime()) / (60 * 1000)
  const targetMinutes = leadHoursBeforeEvent * 60
  return diffMinutes <= targetMinutes && diffMinutes > targetMinutes - leadWindowMinutes
}

export async function getAbandonedCheckoutEligibleEvents(
  now: Date,
  automationKey: CheckoutFollowupAutomationKey = ABANDONED_CHECKOUT_DAY1_AUTOMATION_KEY,
  deps: {
    hasOpenSpotsForEvent?: (event: EventDefinition) => Promise<boolean>
  } = {},
) {
  const definition = getCheckoutFollowupDefinition(automationKey)
  const eligible: EventDefinition[] = []

  for (const event of getLiveEvents()) {
    if (!supportsCheckoutFollowup(event) || !isEventUpcoming(event, now)) continue
    if (
      definition.leadHoursBeforeEvent !== null &&
      !isEventInLeadWindow(event, now, definition.leadHoursBeforeEvent, definition.leadWindowMinutes)
    ) {
      continue
    }
    if (definition.requiresOpenSpots) {
      const open = await (deps.hasOpenSpotsForEvent || (await getHasOpenSpots()))(event)
      if (!open) continue
    }
    eligible.push(event)
  }

  return eligible
}

export function isObviousTestCheckoutAttempt(name: string, email: string) {
  const normalizedName = normalizeName(name).toLowerCase()
  const normalizedEmail = normalizeEmail(email)
  const localPart = normalizedEmail.split('@')[0] || ''
  const domain = normalizedEmail.split('@')[1] || ''

  if (!normalizedEmail) return true

  return (
    normalizedName.includes('test') ||
    localPart.includes('test') ||
    localPart.includes('checkout-test') ||
    localPart.includes('smoke') ||
    localPart.includes('debug') ||
    localPart.includes('browser-postdeploy') ||
    domain === 'example.com'
  )
}

function getCandidateKey(eventSlug: string, email: string) {
  return `${eventSlug}::${normalizeEmail(email)}`
}

async function listFollowupStates(automationKey: CheckoutFollowupAutomationKey) {
  const supabase = await getSupabase()
  let { data, error } = await supabase
    .from('event_checkout_followup_state')
    .select('event_slug, attendee_email, source_checkout_session_id, live_sent_at, live_send_claimed_at, live_send_claim_token, last_test_sent_at, last_test_source_checkout_session_id')
    .eq('followup_type', automationKey)

  if (error && error.message.includes('live_send_claimed_at')) {
    const fallback = await supabase
      .from('event_checkout_followup_state')
      .select('event_slug, attendee_email, source_checkout_session_id, live_sent_at, last_test_sent_at, last_test_source_checkout_session_id')
      .eq('followup_type', automationKey)
    data = (fallback.data ?? []).map((row) => ({
      ...row,
      live_send_claimed_at: null,
      live_send_claim_token: null,
    }))
    error = fallback.error
  }

  if (error) {
    throw new Error(`Unable to read checkout follow-up state: ${error.message}`)
  }

  const states = new Map<string, CheckoutFollowupStateRow>()
  for (const row of data ?? []) {
    states.set(getCandidateKey(row.event_slug, row.attendee_email), row)
  }
  return states
}

async function listSuppressionMap() {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('event_checkout_followup_suppressions')
    .select('event_slug, email, reason')
    .eq('active', true)

  if (error) {
    throw new Error(`Unable to read checkout follow-up suppressions: ${error.message}`)
  }

  const suppressions = new Map<string, string>()
  for (const row of data ?? []) {
    const email = normalizeEmail(row.email)
    if (!email) continue

    if (row.event_slug) {
      suppressions.set(getCandidateKey(row.event_slug, email), row.reason || 'manual suppression')
      continue
    }

    suppressions.set(`*::${email}`, row.reason || 'manual suppression')
  }
  return suppressions
}

function resolveSuppressionReason(
  suppressions: Map<string, string>,
  eventSlug: string,
  email: string,
) {
  return (
    suppressions.get(getCandidateKey(eventSlug, email)) ||
    suppressions.get(`*::${normalizeEmail(email)}`) ||
    null
  )
}

function sessionAttendeeEmail(session: Stripe.Checkout.Session) {
  return normalizeEmail(
    session.metadata?.attendee_email ||
      session.customer_email ||
      session.customer_details?.email ||
      '',
  )
}

function sessionAttendeeName(session: Stripe.Checkout.Session) {
  return normalizeName(session.metadata?.attendee_name || session.customer_details?.name || '')
}

async function listEventCheckoutSessions(
  stripe: Stripe,
  eventSlug: string,
) {
  const sessions: Stripe.Checkout.Session[] = []
  let startingAfter: string | undefined

  while (true) {
    const page = await stripe.checkout.sessions.list({
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    })

    for (const session of page.data) {
      if (session.metadata?.event_slug === eventSlug) {
        sessions.push(session)
      }
    }

    if (!page.has_more || page.data.length === 0) break
    startingAfter = page.data[page.data.length - 1]?.id
    if (!startingAfter) break
  }

  return sessions
}

function evaluateSessionGroups(input: {
  event: EventDefinition
  now: Date
  sessions: Stripe.Checkout.Session[]
  minCheckoutAgeHours: number
}) {
  const grouped = new Map<
    string,
    { newestUnpaid: Stripe.Checkout.Session | null; hasPaid: boolean }
  >()
  let skippedRecent = 0

  const cutoffMs = input.now.getTime() - input.minCheckoutAgeHours * 60 * 60 * 1000

  for (const session of input.sessions) {
    const attendeeEmail = sessionAttendeeEmail(session)
    if (!attendeeEmail) continue

    const key = getCandidateKey(input.event.slug, attendeeEmail)
    const current = grouped.get(key) || { newestUnpaid: null, hasPaid: false }

    if (session.payment_status === 'paid') {
      current.hasPaid = true
      grouped.set(key, current)
      continue
    }

    if (session.status !== 'open' && session.status !== 'expired') continue

    const createdAtMs = (session.created || 0) * 1000
    if (createdAtMs > cutoffMs) {
      skippedRecent += 1
      grouped.set(key, current)
      continue
    }

    if (!current.newestUnpaid || (session.created || 0) > (current.newestUnpaid.created || 0)) {
      current.newestUnpaid = session
    }

    grouped.set(key, current)
  }

  return { grouped, skippedRecent }
}

async function isConfirmedRegistration(eventSlug: string, attendeeEmail: string) {
  const supabase = await getSupabase()
  const { count, error } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('event_slug', eventSlug)
    .eq('attendee_email', normalizeEmail(attendeeEmail))
    .eq('status', 'confirmed')

  if (error) {
    throw new Error(`Unable to check confirmed registrations: ${error.message}`)
  }

  return (count ?? 0) > 0
}

async function evaluateCandidate(
  event: EventDefinition,
  session: Stripe.Checkout.Session,
  states: Map<string, CheckoutFollowupStateRow>,
  suppressions: Map<string, string>,
  hasPaidSession: boolean,
) : Promise<CandidateEvaluation> {
  const attendeeEmail = sessionAttendeeEmail(session)
  const attendeeName = sessionAttendeeName(session)
  const key = getCandidateKey(event.slug, attendeeEmail)
  const state = states.get(key)

  if (state?.live_sent_at) {
    return { status: 'skipped_live_sent' }
  }

  const suppressionReason = resolveSuppressionReason(suppressions, event.slug, attendeeEmail)
  if (suppressionReason) {
    return { status: 'skipped_suppressed', suppressionReason }
  }

  if (isObviousTestCheckoutAttempt(attendeeName, attendeeEmail)) {
    return { status: 'skipped_suppressed', suppressionReason: 'obvious test checkout attempt' }
  }

  if (hasPaidSession) {
    return { status: 'skipped_paid' }
  }

  if (await isConfirmedRegistration(event.slug, attendeeEmail)) {
    return { status: 'skipped_registered' }
  }

  return {
    status: 'candidate',
    candidate: {
      event,
      attendeeEmail,
      attendeeName: attendeeName || attendeeEmail,
      firstName: getFirstName(attendeeName || attendeeEmail),
      sourceCheckoutSessionId: session.id,
      sourceCheckoutCreatedAt: new Date((session.created || 0) * 1000).toISOString(),
      eventUrl: buildEventUrl(event.slug),
      financeLineIncluded: shouldIncludeFinanceLine(event),
    },
  }
}

async function upsertState(input: {
  automationKey: CheckoutFollowupAutomationKey
  candidate: AbandonedCheckoutCandidate
  values: Record<string, string | null>
}) {
  const supabase = await getSupabase()
  const { error } = await supabase.from('event_checkout_followup_state').upsert(
    {
      followup_type: input.automationKey,
      event_slug: input.candidate.event.slug,
      attendee_email: normalizeEmail(input.candidate.attendeeEmail),
      attendee_name: input.candidate.attendeeName,
      source_checkout_session_id: input.candidate.sourceCheckoutSessionId,
      source_checkout_created_at: input.candidate.sourceCheckoutCreatedAt,
      ...input.values,
    },
    {
      onConflict: 'followup_type,event_slug,attendee_email',
    },
  )

  if (error) {
    throw new Error(`Unable to update checkout follow-up state: ${error.message}`)
  }
}

async function claimLiveSend(input: {
  automationKey: CheckoutFollowupAutomationKey
  candidate: AbandonedCheckoutCandidate
  now: Date
  claimToken: string
}) {
  const supabase = await getSupabase()
  const { data, error } = await supabase.rpc('claim_event_checkout_followup_live_send', {
    p_followup_type: input.automationKey,
    p_event_slug: input.candidate.event.slug,
    p_attendee_email: normalizeEmail(input.candidate.attendeeEmail),
    p_attendee_name: input.candidate.attendeeName,
    p_source_checkout_session_id: input.candidate.sourceCheckoutSessionId,
    p_source_checkout_created_at: input.candidate.sourceCheckoutCreatedAt,
    p_claim_token: input.claimToken,
    p_now: input.now.toISOString(),
  })

  if (error) {
    if (error.message.includes('claim_event_checkout_followup_live_send')) {
      throw new Error('Abandoned checkout live-send migration is not applied yet. Apply migration 005 before sending live follow-ups.')
    }
    throw new Error(`Unable to claim checkout follow-up send: ${error.message}`)
  }

  return data === true
}

async function finalizeLiveSend(input: {
  automationKey: CheckoutFollowupAutomationKey
  candidate: AbandonedCheckoutCandidate
  now: Date
  claimToken: string
}) {
  const supabase = await getSupabase()
  const { error } = await supabase
    .from('event_checkout_followup_state')
    .update({
      live_sent_at: input.now.toISOString(),
      live_send_claimed_at: null,
      live_send_claim_token: null,
      last_error_at: null,
      last_error_message: null,
      updated_at: input.now.toISOString(),
    })
    .eq('followup_type', input.automationKey)
    .eq('event_slug', input.candidate.event.slug)
    .eq('attendee_email', normalizeEmail(input.candidate.attendeeEmail))
    .eq('live_send_claim_token', input.claimToken)

  if (error) {
    throw new Error(`Unable to finalize checkout follow-up send: ${error.message}`)
  }
}

async function releaseLiveSendClaim(input: {
  automationKey: CheckoutFollowupAutomationKey
  candidate: AbandonedCheckoutCandidate
  now: Date
  claimToken: string
  errorMessage: string
}) {
  const supabase = await getSupabase()
  const { error } = await supabase
    .from('event_checkout_followup_state')
    .update({
      live_send_claimed_at: null,
      live_send_claim_token: null,
      last_error_at: input.now.toISOString(),
      last_error_message: input.errorMessage,
      updated_at: input.now.toISOString(),
    })
    .eq('followup_type', input.automationKey)
    .eq('event_slug', input.candidate.event.slug)
    .eq('attendee_email', normalizeEmail(input.candidate.attendeeEmail))
    .eq('live_send_claim_token', input.claimToken)

  if (error) {
    throw new Error(`Unable to release checkout follow-up claim: ${error.message}`)
  }
}

export async function sendLiveCandidateOnce(
  automationKey: CheckoutFollowupAutomationKey,
  candidate: AbandonedCheckoutCandidate,
  now: Date,
  deps: {
    claim?: typeof claimLiveSend
    send?: (candidate: AbandonedCheckoutCandidate) => Promise<unknown>
    finalize?: typeof finalizeLiveSend
    release?: typeof releaseLiveSendClaim
    claimTokenFactory?: () => string
  } = {},
): Promise<{ outcome: LiveSendOutcome; errorMessage?: string }> {
  const claimToken = (deps.claimTokenFactory || randomUUID)()
  const claim = deps.claim || claimLiveSend
  const send = deps.send || sendAbandonedCheckoutFollowupEmail
  const finalize = deps.finalize || finalizeLiveSend
  const release = deps.release || releaseLiveSendClaim

  const claimed = await claim({ automationKey, candidate, now, claimToken })
  if (!claimed) {
    return { outcome: 'skipped_claimed' }
  }

  try {
    await send(candidate)
    await finalize({ automationKey, candidate, now, claimToken })
    return { outcome: 'sent' }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await release({ automationKey, candidate, now, claimToken, errorMessage })
    return { outcome: 'failed', errorMessage }
  }
}

export function shouldSendTestPreview(
  state: Pick<CheckoutFollowupStateRow, 'last_test_source_checkout_session_id'> | null | undefined,
  candidate: Pick<AbandonedCheckoutCandidate, 'sourceCheckoutSessionId'>,
) {
  return state?.last_test_source_checkout_session_id !== candidate.sourceCheckoutSessionId
}

function routeResultFor(slug: string): AbandonedCheckoutRouteResult {
  return {
    slug,
    eligible: 0,
    sent: 0,
    suppressed: 0,
    failed: 0,
    skippedPaid: 0,
    skippedRecent: 0,
    preview: [],
    errors: [],
  }
}

export async function runAbandonedCheckoutFollowups(
  now: Date,
  automationKey: CheckoutFollowupAutomationKey = ABANDONED_CHECKOUT_DAY1_AUTOMATION_KEY,
  modeOverride?: AbandonedCheckoutMode,
  eventSlugFilter?: Set<string>,
) {
  const definition = getCheckoutFollowupDefinition(automationKey)
  const control = await getAbandonedCheckoutAutomationControl(automationKey)
  const mode = modeOverride || control.mode
  const stripe = createStripeClient()
  const states = await listFollowupStates(automationKey)
  const suppressions = await listSuppressionMap()
  const results: AbandonedCheckoutRouteResult[] = []
  const sendEmail =
    automationKey === ABANDONED_CHECKOUT_T12H_AUTOMATION_KEY
      ? sendAbandonedCheckoutT12hEmail
      : sendAbandonedCheckoutFollowupEmail

  for (const event of await getAbandonedCheckoutEligibleEvents(now, automationKey)) {
    if (eventSlugFilter && !eventSlugFilter.has(event.slug)) continue
    const result = routeResultFor(event.slug)
    results.push(result)

    try {
      const sessions = await listEventCheckoutSessions(stripe, event.slug)
      const { grouped, skippedRecent } = evaluateSessionGroups({
        event,
        now,
        sessions,
        minCheckoutAgeHours: definition.minCheckoutAgeHours,
      })

      result.skippedRecent = skippedRecent

      for (const [key, group] of grouped.entries()) {
        if (!group.newestUnpaid) continue

        const evaluation = await evaluateCandidate(
          event,
          group.newestUnpaid,
          states,
          suppressions,
          group.hasPaid,
        )

        if (evaluation.status === 'skipped_paid' || evaluation.status === 'skipped_registered') {
          result.skippedPaid += 1
          continue
        }

        if (evaluation.status === 'skipped_suppressed') {
          result.suppressed += 1
          if (mode !== 'off') {
            await upsertState({
              automationKey,
              candidate: {
                event,
                attendeeEmail: sessionAttendeeEmail(group.newestUnpaid),
                attendeeName: sessionAttendeeName(group.newestUnpaid) || sessionAttendeeEmail(group.newestUnpaid),
                firstName: getFirstName(sessionAttendeeName(group.newestUnpaid)),
                sourceCheckoutSessionId: group.newestUnpaid.id,
                sourceCheckoutCreatedAt: new Date((group.newestUnpaid.created || 0) * 1000).toISOString(),
                eventUrl: buildEventUrl(event.slug),
                financeLineIncluded: shouldIncludeFinanceLine(event),
              },
              values: {
                suppressed_at: now.toISOString(),
                suppression_reason: evaluation.suppressionReason || 'suppressed',
                live_sent_at: null,
              },
            })
          }
          continue
        }

        if (evaluation.status !== 'candidate' || !evaluation.candidate) continue

        const candidate = evaluation.candidate
        result.eligible += 1
        result.preview.push({
          attendeeEmail: candidate.attendeeEmail,
          attendeeName: candidate.attendeeName,
          sourceCheckoutSessionId: candidate.sourceCheckoutSessionId,
          sourceCheckoutCreatedAt: candidate.sourceCheckoutCreatedAt,
        })

        const state = states.get(key) || null

        if (mode === 'off') {
          continue
        }

        if (mode === 'test') {
          if (!shouldSendTestPreview(state, candidate)) {
            continue
          }

          try {
            for (const recipient of control.testRecipients) {
              await sendAbandonedCheckoutFollowupTestEmail(automationKey, candidate, recipient, mode)
            }

            await upsertState({
              automationKey,
              candidate,
              values: {
                last_test_sent_at: now.toISOString(),
                last_test_source_checkout_session_id: candidate.sourceCheckoutSessionId,
                last_error_at: null,
                last_error_message: null,
              },
            })
            result.sent += control.testRecipients.length
          } catch (error) {
            await upsertState({
              automationKey,
              candidate,
              values: {
                last_error_at: now.toISOString(),
                last_error_message: error instanceof Error ? error.message : 'Unknown error',
              },
            })
            result.failed += 1
            result.errors.push(
              `${candidate.attendeeEmail}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            )
          }

          continue
        }

        try {
          const liveSend = await sendLiveCandidateOnce(automationKey, candidate, now, {
            send: sendEmail,
          })
          if (liveSend.outcome === 'sent') {
            result.sent += 1
            continue
          }

          if (liveSend.outcome === 'skipped_claimed') {
            continue
          }

          result.failed += 1
          result.errors.push(`${candidate.attendeeEmail}: ${liveSend.errorMessage || 'Unknown error'}`)
        } catch (error) {
          result.failed += 1
          result.errors.push(`${candidate.attendeeEmail}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  return {
    mode,
    testRecipients: control.testRecipients,
    results,
  }
}

export function resolveEventFromSlug(slug: string) {
  return getEventBySlug(slug)
}
