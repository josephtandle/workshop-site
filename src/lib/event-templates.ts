/**
 * Canonical event templates.
 *
 * THE RULE: a new event starts by copying one of these, never by copying an
 * arbitrary older event. When you improve an event, fold the improvement back
 * into the template here so the next one inherits it. The template is the
 * living version, not a snapshot.
 *
 * These are deliberately data, not code that builds events. Copy the object
 * into the `events` array in `events.tsx` and edit it. Keeping them inert means
 * a template can never break a live event.
 *
 * Current versions carry every fix learned on the 2026-08-02 launch. Each field
 * that exists because something broke is annotated with what broke.
 *
 * See `projects/mastermind/WORKSHOP-PLAYBOOK.md` for the full process.
 */

import type { EventDefinition } from './events'

export const EVENT_TEMPLATE_VERSION = '2026-08-02'

/** Fields every event needs regardless of price. */
const SHARED_REQUIRED = {
  status: 'live' as const,
  locationLabel: 'Free online workshop',

  // Never omit. Without it the page renders a gradient scrim over the artwork,
  // which is banned.
  heroNoOverlay: true,

  // Load-bearing twice: no .ics on the confirmation email without it, AND the
  // events-manager reporting agent regex-parses startIso out of events.tsx. A
  // missing block makes that parser swallow the NEXT event's date.
  calendarEvent: {
    startIso: '2026-01-01T17:00:00+08:00',
    endIso: '2026-01-01T18:30:00+08:00',
  },

  // Who to contact. There is no fallback phone number anywhere by design, so
  // leaving this out means the confirmation email has no contact block at all.
  // It once defaulted to a different person's name and mobile.
  emailConfig: {
    contactName: 'Joe Che',
    contactWhatsAppLink: 'https://wa.me/16462092333',
    contactWhatsAppDisplay: '+1 (646) 209-2333',
    signatureName: 'Joe Che\nMasterminds HQ',
  },
}

/**
 * FREE WORKSHOP. The default. Registration is instant, no Stripe.
 *
 * Collects name, email, WhatsApp and business context. Free does not mean
 * anonymous: we need a way to reach people and enough to pre-qualify them.
 */
export const FREE_WORKSHOP_TEMPLATE: Partial<EventDefinition> = {
  ...SHARED_REQUIRED,
  eyebrow: 'Free Live Workshop',
  ctaLabel: 'Register Free',
  durationLabel: '90 minutes, and the room stays open after',

  // fullPrice 0 is the ONLY thing that selects the free path. It gives the
  // Register Free button, no Stripe, and no promo field.
  pricing: {
    currencySymbol: '$',
    fullPrice: 0,
    checkoutHref: '',
    checkoutNote: 'Free registration. The Zoom link will be emailed right after you sign up.',
  },

  intakeFields: {
    whatsappNumber: true,
    businessContext: true,
    businessContextLabel: "Tell us a little about your business and what you're working on.",
    businessContextPlaceholder:
      "What you do, what you're building, and anything you are curious about with AI.",
  },

  // Shown after signup. Without it the free path falls back to a generic line
  // about setting up two accounts, which is wrong for most workshops.
  successDetail:
    'You are in. Your confirmation email has the Zoom link, and a calendar invite is on its way. It comes from joe@mastermindshq.business. If you do not see it within a couple of minutes, check your spam folder and add that address to your contacts so the reminders reach you too.',
}

/**
 * PAID WORKSHOP. Runs through Stripe Checkout.
 *
 * Differences that matter versus free:
 *  - `checkoutNote` describes what happens after payment, not after signup.
 *  - promo codes live on `pricing.promoCodes`.
 *  - `capacity` is usually set, since paid events are seat-limited.
 *  - intake still applies. A paying attendee is worth qualifying too.
 */
export const PAID_WORKSHOP_TEMPLATE: Partial<EventDefinition> = {
  ...SHARED_REQUIRED,
  eyebrow: 'Live Workshop',
  ctaLabel: 'Reserve Your Seat',
  durationLabel: '90 minutes',

  pricing: {
    currencySymbol: '$',
    fullPrice: 22,
    checkoutHref: '',
    checkoutNote: 'Secure checkout. Your seat and the joining details are emailed straight after payment.',
    promoCodes: [],
  },

  capacity: 40,

  intakeFields: {
    whatsappNumber: true,
    businessContext: true,
    businessContextLabel: "Tell us a little about your business and what you're working on.",
    businessContextPlaceholder:
      "What you do, what you're building, and anything you are curious about with AI.",
  },

  successDetail:
    'Your seat is confirmed. Your confirmation email has the joining details, and a calendar invite is on its way. It comes from joe@mastermindshq.business. If you do not see it within a couple of minutes, check your spam folder.',
}

/**
 * Fields you must change on every copy. Left as obvious placeholders above so a
 * forgotten one is visible rather than silently wrong.
 */
export const MUST_CUSTOMISE = [
  'slug',
  'title',
  'shortTitle',
  'summary',
  'description',
  'dateLabel',
  'timeLabel',
  'durationLabel',
  'heroImage',
  'heroAlt',
  'zoomLink',
  'calendarEvent.startIso',
  'calendarEvent.endIso',
  'audience',
  'outcomes',
  'hosts',
  'sections',
  'metadata',
] as const
