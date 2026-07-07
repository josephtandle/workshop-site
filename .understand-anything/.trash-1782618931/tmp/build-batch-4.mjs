import { writeFileSync } from 'fs'

const fileMeta = {
  "src/lib/event-registration-db.ts": { type:"file", name:"event-registration-db.ts", summary:"Supabase-backed data layer for event registrations and waitlists: saves/cancels registrations, generates cancel tokens, counts confirmed seats, and manages waitlist entries.", tags:["events","supabase","registration","waitlist","data-layer"], complexity:"medium" },
  "src/lib/event-status.ts": { type:"file", name:"event-status.ts", summary:"Pure helpers that derive event lifecycle status (ended, registration closed) from an event's calendar and close dates.", tags:["events","status","date","helper"], complexity:"low" },
  "src/lib/event-tokens.ts": { type:"file", name:"event-tokens.ts", summary:"HMAC-SHA256 token generation and constant-time verification using CRON_SECRET, used for signed cancel/cron links.", tags:["security","hmac","tokens","crypto"], complexity:"low" },
  "src/lib/events.tsx": { type:"file", name:"events.tsx", summary:"Canonical static event catalog (EventDefinition list) plus pricing/promo helpers and slug/live-event lookups; central source of truth for the events site.", tags:["events","catalog","pricing","promo","data"], complexity:"high" },
  "src/lib/insight-to-fix.ts": { type:"file", name:"insight-to-fix.ts", summary:"Fire-and-forget analytics client that posts checkout/funnel events to the insight-to-fix collector with a short timeout, swallowing errors.", tags:["analytics","telemetry","fetch","tracking"], complexity:"low" },
  "src/lib/legacy-event-schedule.ts": { type:"file", name:"legacy-event-schedule.ts", summary:"Bridge to the legacy EventSchedule system: authenticates, parses CSV sales exports, reconciles/marks paid sales, and finalizes legacy checkout sessions while syncing registrations and emails.", tags:["legacy","integration","csv","checkout","reconciliation"], complexity:"high" },
  "src/lib/location-reminder.ts": { type:"file", name:"location-reminder.ts", summary:"Helpers for event location-reminder emails: idempotency key building, due-window calculation, and attendee email de-duplication.", tags:["events","reminder","email","idempotency"], complexity:"low" },
  "src/lib/rate-limit.ts": { type:"file", name:"rate-limit.ts", summary:"Sliding-window rate limiter backed by a Supabase rate_limit_log table plus a client-IP extractor; fails open on errors.", tags:["rate-limit","supabase","security","api"], complexity:"medium" },
  "src/lib/stripe-amount.ts": { type:"file", name:"stripe-amount.ts", summary:"Converts a dollar amount to Stripe integer cents, enforcing the 50-cent minimum charge threshold.", tags:["stripe","payments","money","helper"], complexity:"low" },
  "src/lib/stripe.ts": { type:"file", name:"stripe.ts", summary:"Stripe client factory and key resolvers reading secret/publishable keys from environment with live/test fallbacks.", tags:["stripe","payments","client","config"], complexity:"low" },
  "src/lib/supabase.ts": { type:"config", name:"supabase.ts", summary:"Initializes and exports the shared Supabase client using environment URL and secret key.", tags:["supabase","client","config","database"], complexity:"low" },
  "src/lib/url-utils.ts": { type:"file", name:"url-utils.ts", summary:"Normalizes a string into a URL origin, tolerating missing scheme and returning null on failure.", tags:["url","helper","parsing"], complexity:"low" },
  "src/lib/waitlist-notify-windows.ts": { type:"file", name:"waitlist-notify-windows.ts", summary:"Computes hours-until-event and resolves which waitlist notification window (t5h cancellation or t2h) applies.", tags:["waitlist","notification","time-window","events"], complexity:"low" },
  "tests/abandoned-checkout-followups.test.ts": { type:"file", name:"abandoned-checkout-followups.test.ts", summary:"Unit tests for abandoned-checkout follow-up logic: eligibility windows, idempotency keys, subjects, and send candidate selection.", tags:["test","checkout","email","followup"], complexity:"medium" },
  "tests/email-content.test.ts": { type:"file", name:"email-content.test.ts", summary:"Tests asserting confirmation and event email HTML/content correctness via mocked fetch.", tags:["test","email","content","mock"], complexity:"medium" },
  "tests/email-idempotency.test.ts": { type:"file", name:"email-idempotency.test.ts", summary:"Tests that event/confirmation emails are sent at most once using idempotency keys with mocked fetch.", tags:["test","email","idempotency","mock"], complexity:"medium" },
  "tests/event-checkout.test.ts": { type:"file", name:"event-checkout.test.ts", summary:"Tests for event checkout session params, mode resolution, and amount calculation.", tags:["test","checkout","stripe","pricing"], complexity:"low" },
  "tests/event-location-reminder.test.ts": { type:"file", name:"event-location-reminder.test.ts", summary:"Tests for location-reminder due windows, dedup, and reminder email sending.", tags:["test","reminder","email","events"], complexity:"medium" },
  "tests/event-pricing-and-data.test.ts": { type:"file", name:"event-pricing-and-data.test.ts", summary:"Tests covering event pricing/promo helpers, status derivation, URL origin parsing, and waitlist windows.", tags:["test","pricing","events","data"], complexity:"medium" },
  "tests/event-tokens.test.ts": { type:"file", name:"event-tokens.test.ts", summary:"Tests HMAC token generation and constant-time verification, including tamper rejection.", tags:["test","security","tokens","hmac"], complexity:"low" },
  "tests/hardening.test.ts": { type:"file", name:"hardening.test.ts", summary:"Security/robustness tests: donation amount validation, Stripe minimum enforcement, and waitlist window edge cases.", tags:["test","security","hardening","validation"], complexity:"medium" },
}

// function nodes: [relpath, name, start, end, summary, tags, complexity]
const fns = [
  ["src/lib/event-registration-db.ts","saveRegistration",29,64,"Inserts a confirmed event registration into Supabase with a generated cancel token.",["registration","supabase","insert","tokens"],"medium"],
  ["src/lib/event-registration-db.ts","isAlreadyRegistered",65,80,"Checks whether an email already has a confirmed registration for an event.",["registration","supabase","dedupe","query"],"low"],
  ["src/lib/event-registration-db.ts","isAlreadyOnWaitlist",81,96,"Checks whether an email is already on the active waitlist for an event.",["waitlist","supabase","dedupe","query"],"low"],
  ["src/lib/event-registration-db.ts","cancelRegistration",97,140,"Cancels a registration by cancel token, marking it cancelled with a timestamp.",["registration","cancel","supabase","tokens"],"medium"],
  ["src/lib/event-registration-db.ts","getConfirmedCount",141,155,"Returns the count of confirmed registrations for an event slug.",["registration","count","supabase","query"],"low"],
  ["src/lib/event-registration-db.ts","addToWaitlist",156,186,"Adds an attendee to an event waitlist with a remove token.",["waitlist","supabase","insert","tokens"],"medium"],
  ["src/lib/event-registration-db.ts","removeFromWaitlist",187,213,"Removes a waitlist entry by remove token, setting status to removed.",["waitlist","remove","supabase","tokens"],"medium"],
  ["src/lib/event-registration-db.ts","getActiveWaitlist",214,235,"Fetches the ordered list of active waitlist entries for an event.",["waitlist","query","supabase","ordering"],"low"],
  ["src/lib/event-registration-db.ts","hasOpenSpots",236,240,"Determines whether an event still has open spots given capacity and confirmed count.",["events","capacity","query","helper"],"low"],
  ["src/lib/event-status.ts","isEventEnded",3,9,"Returns true if the event's calendar end time has passed.",["events","status","date","helper"],"low"],
  ["src/lib/event-status.ts","isEventRegistrationClosed",10,19,"Returns true if registration is manually closed or past the close date.",["events","status","registration","date"],"low"],
  ["src/lib/event-tokens.ts","generateToken",7,10,"Generates an HMAC-SHA256 hex digest of a payload using CRON_SECRET.",["security","hmac","crypto","tokens"],"low"],
  ["src/lib/event-tokens.ts","verifyToken",11,15,"Constant-time verification of a payload token against the expected HMAC.",["security","hmac","verify","crypto"],"low"],
  ["src/lib/events.tsx","getEventDiscountedPrice",197,200,"Computes an event's price after applying an optional promo code.",["pricing","promo","events","helper"],"low"],
  ["src/lib/events.tsx","resolvePromoCode",201,206,"Finds a matching promo code on an event by normalized code string.",["promo","events","lookup","helper"],"low"],
  ["src/lib/events.tsx","formatEventPrice",207,211,"Formats an event's (optionally discounted) price with its currency symbol.",["pricing","format","events","helper"],"low"],
  ["src/lib/events.tsx","getEventBySlug",741,744,"Looks up an event definition from the catalog by slug.",["events","lookup","catalog","helper"],"low"],
  ["src/lib/events.tsx","getLiveEvents",745,747,"Returns the subset of catalog events marked live.",["events","filter","catalog","helper"],"low"],
  ["src/lib/insight-to-fix.ts","trackInsightEvent",6,37,"Posts a funnel/checkout event to the insight-to-fix collector with a timeout, swallowing errors.",["analytics","telemetry","fetch","tracking"],"medium"],
  ["src/lib/legacy-event-schedule.ts","syncLegacyRegistration",392,469,"Reconciles or imports a legacy paid sale and syncs it into the new registration system.",["legacy","reconciliation","registration","integration"],"high"],
  ["src/lib/legacy-event-schedule.ts","finalizeLegacyCheckoutSession",470,655,"Finalizes a legacy checkout session: verifies payment, saves registration, and sends confirmation emails.",["legacy","checkout","stripe","email"],"high"],
  ["src/lib/legacy-event-schedule.ts","getLegacyEventBySlug",656,659,"Resolves a legacy event configuration by slug.",["legacy","events","lookup","helper"],"low"],
  ["src/lib/legacy-event-schedule.ts","listLegacyPaidAttendeesForEvent",660,689,"Lists paid attendees for an event from the legacy sales export.",["legacy","attendees","csv","query"],"medium"],
  ["src/lib/location-reminder.ts","buildLocationReminderIdempotencyKey",3,11,"Builds a stable idempotency key for an attendee's location-reminder email.",["reminder","idempotency","email","helper"],"low"],
  ["src/lib/location-reminder.ts","isLocationReminderDue",12,27,"Determines whether the current time falls within the reminder send window.",["reminder","time-window","events","helper"],"low"],
  ["src/lib/location-reminder.ts","dedupeAttendeesByEmail",28,40,"De-duplicates a list of attendees by normalized email.",["dedupe","attendees","email","helper"],"low"],
  ["src/lib/rate-limit.ts","getClientIp",3,12,"Extracts the client IP from the x-forwarded-for header.",["rate-limit","ip","request","helper"],"low"],
  ["src/lib/rate-limit.ts","checkRateLimit",13,43,"Sliding-window rate limit check against Supabase that fails open on error.",["rate-limit","supabase","security","async"],"medium"],
  ["src/lib/stripe-amount.ts","toStripeUnitAmount",3,11,"Converts dollars to Stripe cents, returning null below the minimum charge.",["stripe","money","conversion","helper"],"low"],
  ["src/lib/stripe.ts","getStripeSecretKey",3,5,"Resolves the Stripe secret key from env with live/test fallback.",["stripe","config","env","helper"],"low"],
  ["src/lib/stripe.ts","getStripePublishableKey",7,9,"Resolves the Stripe publishable key from env.",["stripe","config","env","helper"],"low"],
  ["src/lib/stripe.ts","createStripeClient",11,18,"Creates a Stripe client, throwing if the secret key is missing.",["stripe","client","factory","config"],"low"],
  ["src/lib/url-utils.ts","toOrigin",1,13,"Parses a string into a URL origin, tolerating missing scheme.",["url","parsing","helper","normalize"],"low"],
  ["src/lib/waitlist-notify-windows.ts","hoursUntilEvent",6,8,"Computes fractional hours from now until the event start.",["time","events","helper","calc"],"low"],
  ["src/lib/waitlist-notify-windows.ts","resolveNotifyWindow",10,16,"Resolves which waitlist notification window applies based on hours until event.",["waitlist","notification","time-window","helper"],"low"],
]

const nodes = []
for (const [p,m] of Object.entries(fileMeta)) {
  nodes.push({ id:`${m.type==="config"?"config":m.type==="document"?"document":"file"}:${p}`, type:m.type, name:m.name, summary:m.summary, tags:m.tags, complexity:m.complexity, filePath:p })
}
for (const [p,name,s,e,sum,tags,cx] of fns) {
  nodes.push({ id:`function:${p}:${name}`, type:"function", name, summary:sum, tags, complexity:cx, lineRange:`${s}-${e}` })
}

const fileNodeId = (p) => fileMeta[p].type==="config" ? `config:${p}` : `file:${p}`

const edges = []
// contains + exports
for (const [p,name] of fns.map(f=>[f[0],f[1]])) {
  edges.push({ source:fileNodeId(p), target:`function:${p}:${name}`, type:"contains", direction:"forward", weight:1.0 })
  edges.push({ source:fileNodeId(p), target:`function:${p}:${name}`, type:"exports", direction:"forward", weight:0.8 })
}
// imports
const imports = {
  "src/lib/event-registration-db.ts":["src/lib/event-tokens.ts","src/lib/events.tsx","src/lib/supabase.ts"],
  "src/lib/event-status.ts":["src/lib/events.tsx"],
  "src/lib/rate-limit.ts":["src/lib/supabase.ts"],
  "src/lib/legacy-event-schedule.ts":["src/lib/event-confirmation-email.ts","src/lib/event-registration-db.ts","src/lib/events.tsx","src/lib/insight-to-fix.ts","src/lib/location-reminder.ts","src/lib/stripe.ts"],
  "tests/abandoned-checkout-followups.test.ts":["src/lib/abandoned-checkout-followups.ts"],
  "tests/email-content.test.ts":["src/lib/event-confirmation-email.ts","src/lib/events.tsx"],
  "tests/email-idempotency.test.ts":["src/lib/event-confirmation-email.ts","src/lib/events.tsx"],
  "tests/event-checkout.test.ts":["src/lib/event-checkout.ts","src/lib/events.tsx"],
  "tests/event-location-reminder.test.ts":["src/lib/event-confirmation-email.ts","src/lib/events.tsx","src/lib/location-reminder.ts"],
  "tests/event-pricing-and-data.test.ts":["src/lib/event-status.ts","src/lib/events.tsx","src/lib/url-utils.ts","src/lib/waitlist-notify-windows.ts"],
  "tests/event-tokens.test.ts":["src/lib/event-tokens.ts"],
  "tests/hardening.test.ts":["src/lib/events.tsx","src/lib/stripe-amount.ts","src/lib/waitlist-notify-windows.ts"],
}
const inBatch = new Set(Object.keys(fileMeta))
const tgtFileId = (p) => inBatch.has(p) ? fileNodeId(p) : `file:${p}`
for (const [src,deps] of Object.entries(imports)) {
  for (const d of deps) edges.push({ source:fileNodeId(src), target:tgtFileId(d), type:"imports", direction:"forward", weight:0.7 })
}
// tested_by (prod in-batch -> test)
const testedBy = [
  ["src/lib/events.tsx","tests/email-content.test.ts"],
  ["src/lib/events.tsx","tests/email-idempotency.test.ts"],
  ["src/lib/events.tsx","tests/event-checkout.test.ts"],
  ["src/lib/events.tsx","tests/event-location-reminder.test.ts"],
  ["src/lib/events.tsx","tests/event-pricing-and-data.test.ts"],
  ["src/lib/events.tsx","tests/hardening.test.ts"],
  ["src/lib/location-reminder.ts","tests/event-location-reminder.test.ts"],
  ["src/lib/event-status.ts","tests/event-pricing-and-data.test.ts"],
  ["src/lib/url-utils.ts","tests/event-pricing-and-data.test.ts"],
  ["src/lib/waitlist-notify-windows.ts","tests/event-pricing-and-data.test.ts"],
  ["src/lib/waitlist-notify-windows.ts","tests/hardening.test.ts"],
  ["src/lib/event-tokens.ts","tests/event-tokens.test.ts"],
  ["src/lib/stripe-amount.ts","tests/hardening.test.ts"],
]
for (const [prod,test] of testedBy) edges.push({ source:fileNodeId(prod), target:fileNodeId(test), type:"tested_by", direction:"forward", weight:0.5 })
// calls
const calls = [
  ["function:src/lib/event-tokens.ts:verifyToken","function:src/lib/event-tokens.ts:generateToken"],
  ["function:src/lib/events.tsx:formatEventPrice","function:src/lib/events.tsx:getEventDiscountedPrice"],
  ["function:src/lib/waitlist-notify-windows.ts:resolveNotifyWindow","function:src/lib/waitlist-notify-windows.ts:hoursUntilEvent"],
  ["function:src/lib/stripe.ts:createStripeClient","function:src/lib/stripe.ts:getStripeSecretKey"],
]
for (const [s,t] of calls) edges.push({ source:s, target:t, type:"calls", direction:"forward", weight:0.8 })

const out = { nodes, edges }
const dupN = nodes.length - new Set(nodes.map(n=>n.id)).size
const selfE = edges.filter(e=>e.source===e.target).length
writeFileSync("/Users/myos/.myos/workspace/projects/mastermind/workshop-site/.understand-anything/intermediate/batch-4.json", JSON.stringify(out,null,2))
console.log("nodes:",nodes.length,"edges:",edges.length,"dupNodeIds:",dupN,"selfEdges:",selfE)
