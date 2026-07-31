import { buildWelcomeEmail, getLeadMagnet } from './lead-magnets'
import { buildUnsubscribeHeaders } from './list-unsubscribe'

export const FROM_ADDRESS = 'Joe Che <joe@mastermindshq.business>'

export type SubscribeInput = {
  firstName: string
  lastName?: string
  email: string
  leadMagnet: string
}

export type SentEmail = {
  from: string
  to: string
  subject: string
  html: string
  /** RFC 8058 List-Unsubscribe / List-Unsubscribe-Post headers, marketing sends only. */
  headers?: Record<string, string>
}

/** Injected so tests can substitute fakes and never touch the network. */
export type SubscribeDeps = {
  /** Upsert the person. Returns nothing; failures must throw. */
  saveLead(input: Required<Omit<SubscribeInput, 'lastName'>> & { lastName: string | null }): Promise<void>
  /**
   * Claim this (email, magnet) pair. Returns true if this is the first time
   * this person signed up for this magnet, false if they already had.
   */
  claimSignup(email: string, leadMagnet: string): Promise<boolean>
  sendEmail(email: SentEmail): Promise<void>
  /**
   * Optional: check the global marketing suppression list before sending.
   * Omitted in tests (and in any deps that don't wire it), in which case no
   * suppression check happens. The real /api/subscribe route always supplies
   * this, backed by src/lib/email-suppressions.ts (fail-closed on read error).
   */
  isSuppressed?(email: string): Promise<boolean>
}

export type SubscribeResult = {
  ok: true
  /** False when they had already signed up for this same magnet. */
  emailed: boolean
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class SubscribeError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

export async function handleSubscribe(
  input: SubscribeInput,
  deps: SubscribeDeps,
): Promise<SubscribeResult> {
  const firstName = (input.firstName ?? '').trim()
  const lastName = (input.lastName ?? '').trim()
  const email = (input.email ?? '').trim().toLowerCase()
  const slug = (input.leadMagnet ?? '').trim()

  if (!firstName || firstName.length > 256) {
    throw new SubscribeError('First name is required', 400)
  }
  if (!email || email.length > 256 || !EMAIL_RE.test(email)) {
    throw new SubscribeError('A valid email is required', 400)
  }

  const magnet = getLeadMagnet(slug)
  if (!magnet) {
    // Fail closed. Sending the wrong asset is worse than sending nothing.
    throw new SubscribeError(`Unknown lead magnet: ${slug}`, 400)
  }

  await deps.saveLead({
    firstName,
    lastName: lastName || null,
    email,
    leadMagnet: slug,
  })

  const isFirstTime = await deps.claimSignup(email, slug)

  // Same magnet twice: report success, but do not email again.
  if (!isFirstTime) {
    return { ok: true, emailed: false }
  }

  // Marketing send: skip if this address is on the global suppression list.
  // Reported the same as "already signed up for this magnet": the person
  // still gets `{ ok: true }`, they just do not get emailed.
  if (deps.isSuppressed && (await deps.isSuppressed(email))) {
    return { ok: true, emailed: false }
  }

  // A different magnet later still gets its own email, because the claim is
  // keyed on (email, magnet) rather than on email alone.
  const { subject, html } = buildWelcomeEmail(firstName, magnet, email)

  await deps.sendEmail({
    from: FROM_ADDRESS,
    to: email,
    subject,
    html,
    headers: buildUnsubscribeHeaders(email),
  })

  return { ok: true, emailed: true }
}
