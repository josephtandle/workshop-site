import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  DELIVERABLE_LEAD_MAGNET_SOURCES,
  isDeliverableLeadMagnetSource,
  UnknownLeadMagnetSourceError,
} from '../src/lib/lead-magnets'

// ---------------------------------------------------------------------------
// Two regressions that both shipped the wrong thing to a real person.
//
// 1. Google Calendar invites fired only on the FREE registration path. Anyone
//    who paid got the .ics attachment and no real invite.
// 2. /api/lead-magnet's final `else` sent the Un-Learning Success PDF to any
//    unrecognised source, so roughly eighteen giveaway pages emailed people an
//    asset they never asked for.
//
// The calendar assertions are source-level on purpose: importing the route
// pulls in googleapis and the Stripe client, and the point being defended is
// structural (which code paths call the invite), not runtime behaviour.
// ---------------------------------------------------------------------------

const ROOT = join(__dirname, '..')
const CHECKOUT_ROUTE = join(ROOT, 'src', 'app', 'api', 'events', 'checkout-session', 'route.ts')
const FINALIZE_ROUTE = join(ROOT, 'src', 'app', 'api', 'events', 'finalize-registration', 'route.ts')
const LEGACY_LIB = join(ROOT, 'src', 'lib', 'legacy-event-schedule.ts')
const LEAD_MAGNET_ROUTE = join(ROOT, 'src', 'app', 'api', 'lead-magnet', 'route.ts')

const checkoutSrc = readFileSync(CHECKOUT_ROUTE, 'utf8')
const finalizeSrc = readFileSync(FINALIZE_ROUTE, 'utf8')
const legacySrc = readFileSync(LEGACY_LIB, 'utf8')
const leadMagnetSrc = readFileSync(LEAD_MAGNET_ROUTE, 'utf8')

// ---------------------------------------------------------------------------
// 1. Calendar invites fire on BOTH registration paths
// ---------------------------------------------------------------------------

test('free and paid registration share one calendar-invite helper', () => {
  assert.match(
    legacySrc,
    /export async function inviteAttendeeBestEffort/,
    'inviteAttendeeBestEffort must exist as the single invite entry point. Duplicating the invite call per path is how the paid path lost it in the first place.',
  )
  assert.match(
    checkoutSrc,
    /inviteAttendeeBestEffort\(\s*event,\s*attendeeEmail,\s*attendeeName\s*\)/,
    'the free checkout path must invite via inviteAttendeeBestEffort',
  )
  assert.match(
    legacySrc,
    /inviteAttendeeBestEffort\(input\.event, attendeeEmail, attendeeName\)/,
    'finalizeLegacyCheckoutSession (the paid path) must invite via inviteAttendeeBestEffort',
  )
})

test('the paid path invites on both of its return branches', () => {
  // finalizeLegacyCheckoutSession returns early when the payment intent is
  // already marked synced. That branch must invite too, otherwise a re-finalize
  // or a pre-existing paid registration never lands in the calendar.
  const calls = legacySrc.match(/await inviteAttendeeBestEffort\(input\.event/g) ?? []
  assert.ok(
    calls.length >= 2,
    `expected the already-synced branch and the main branch to both invite, found ${calls.length} call(s)`,
  )
})

test('the checkout route no longer calls inviteAttendeeToEvent directly', () => {
  assert.doesNotMatch(
    checkoutSrc,
    /inviteAttendeeToEvent/,
    'the free path must go through the shared helper, not its own copy of the try/catch',
  )
})

test('a calendar failure can never fail a registration', () => {
  // The helper owns the best-effort contract: catch, log, return a status.
  const helper = legacySrc.slice(legacySrc.indexOf('export async function inviteAttendeeBestEffort'))
  const body = helper.slice(0, helper.indexOf('\n}\n') + 3)
  assert.match(body, /try \{/, 'helper must wrap the invite in try/catch')
  assert.match(body, /catch \(error\)/, 'helper must catch invite errors')
  assert.match(body, /console\.error\(/, 'helper must log the failure rather than swallow it silently')
  assert.match(body, /return 'failed'/, 'helper must resolve to a status instead of rethrowing')
  assert.doesNotMatch(body, /\bthrow\b/, 'helper must never throw — a calendar problem must not fail a paid registration')
})

test('both paths report the calendar_invite insight property', () => {
  assert.match(
    checkoutSrc,
    /calendar_invite:\s*calendarInviteStatus/,
    'free path must keep reporting calendar_invite',
  )
  assert.match(
    finalizeSrc,
    /calendar_invite:\s*result\.calendarInvite/,
    'paid path must report calendar_invite too, otherwise a silently skipped invite is invisible',
  )
})

test('finalizeLegacyCheckoutSession returns the invite status to its callers', () => {
  assert.match(
    legacySrc,
    /calendarInvite:\s*CalendarInviteStatus/,
    'the result type must carry calendarInvite so every caller (finalize route, Stripe webhook) can report it',
  )
})

// ---------------------------------------------------------------------------
// 2. Lead magnet: unknown slugs fail closed
// ---------------------------------------------------------------------------

test('only sources with a real asset are deliverable', () => {
  for (const known of [
    'lead-magnet',
    'maccleaner',
    'guardog',
    'cult-brand-playbook',
    'web-design-arsenal',
    'human',
    'speak-human',
  ]) {
    assert.ok(isDeliverableLeadMagnetSource(known), `${known} has a template and must be deliverable`)
  }
})

test('unregistered slugs are not deliverable', () => {
  for (const unknown of [
    'benchmark',
    'claude-md',
    'anthropic-safety-checklist',
    'viral-hooks',
    'ray-dalio-council',
    'squarespace-escape',
    'intuition-quiz',
    'all-sorted-overview',
    'totally-made-up-slug',
    '',
  ]) {
    assert.ok(
      !isDeliverableLeadMagnetSource(unknown),
      `${unknown || '(empty)'} has no asset and must NOT be deliverable — defaulting it to some other magnet's PDF is the bug this guards`,
    )
  }
})

test('every deliverable source has a matching branch in the route', () => {
  for (const source of DELIVERABLE_LEAD_MAGNET_SOURCES) {
    assert.ok(
      leadMagnetSrc.includes(`source === '${source}'`),
      `DELIVERABLE_LEAD_MAGNET_SOURCES lists "${source}" but /api/lead-magnet has no branch for it. The set and the template chain must not drift.`,
    )
  }
})

test('the route has no catch-all else that sends a default asset', () => {
  assert.match(
    leadMagnetSrc,
    /source === 'lead-magnet'/,
    'Un-Learning Success must be delivered by an explicit source check, not by falling through',
  )
  assert.match(
    leadMagnetSrc,
    /throw new UnknownLeadMagnetSourceError\(source\)/,
    'the final else must fail closed by throwing, not by picking a default PDF',
  )
  assert.doesNotMatch(
    leadMagnetSrc,
    /\}\s*else\s*\{\s*\n\s*subject\s*=/,
    'no else branch may assign a subject — that is the misdelivery shape',
  )
})

test('an unknown source is surfaced, not swallowed', () => {
  // Standing workspace rule: log-and-continue has already shipped silent data
  // loss. The caller must be told, and the miss must reach insight tracking.
  assert.match(leadMagnetSrc, /isDeliverableLeadMagnetSource\(source\)/, 'route must check deliverability before sending')
  assert.match(leadMagnetSrc, /lead_magnet_unknown_source/, 'route must track the unknown source as an insight event')
  assert.match(leadMagnetSrc, /status:\s*422/, 'route must return a non-2xx so the caller knows nothing was delivered')
  assert.match(leadMagnetSrc, /delivered:\s*false/, 'response must state that nothing was delivered')
})

test('the lead is still captured before the fail-closed return', () => {
  const guardIndex = leadMagnetSrc.indexOf('isDeliverableLeadMagnetSource(source)')
  const supabaseIndex = leadMagnetSrc.indexOf(`.from('leads')`)
  const crmIndex = leadMagnetSrc.indexOf('ingestIntoCrm(email, source)')
  assert.ok(supabaseIndex > -1 && supabaseIndex < guardIndex, 'the lead must be saved to Supabase before the guard returns')
  assert.ok(crmIndex > -1 && crmIndex < guardIndex, 'the lead must be ingested into the CRM before the guard returns')
})

test('UnknownLeadMagnetSourceError carries the offending slug', () => {
  const err = new UnknownLeadMagnetSourceError('mystery-slug')
  assert.equal(err.source, 'mystery-slug')
  assert.equal(err.name, 'UnknownLeadMagnetSourceError')
  assert.match(err.message, /mystery-slug/)
  assert.ok(err instanceof Error)
})
