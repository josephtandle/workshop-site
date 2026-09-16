export const LEDGER_STATUS_CLAIMED = 'claimed'
export const LEDGER_STATUS_SENT = 'sent'
export const LEDGER_STATUS_FAILED = 'failed'

// Two blank addresses must never share one ledger slot, because that
// would dedupe two different people against each other.
export function normalizeLedgerEmail(email: string): string {
  if (typeof email !== 'string') {
    throw new Error('Email address must be a string for ledger operations.')
  }

  const normalized = email.trim().toLowerCase()
  if (!normalized || !normalized.includes('@')) {
    throw new Error(`Invalid email address for ledger: "${email}"`)
  }

  return normalized
}

export type EventEmailLedgerRow = {
  recipient_email: string
  slug: string
  status: string
  provider_id: string | null
  sent_at: string | null
  error: string | null
  claimed_at: string
}

export type EventEmailLedger = {
  claim(input: { recipientEmail: string; slug: string; subject?: string | null }): Promise<boolean>
  get(input: { recipientEmail: string; slug: string }): Promise<EventEmailLedgerRow | null>
  markSent(input: { recipientEmail: string; slug: string; providerId?: string | null }): Promise<void>
  markFailed(input: { recipientEmail: string; slug: string; error?: string | null }): Promise<void>
}

export function createSupabaseEventEmailLedger(deps: {
  client: { from: (table: string) => any }
  source?: string | null
}): EventEmailLedger {
  return {
    async claim(input) {
      const normalizedEmail = normalizeLedgerEmail(input.recipientEmail)

      const { error } = await deps.client.from('event_email_send_log').insert({
        recipient_email: normalizedEmail,
        slug: input.slug,
        subject: input.subject ?? null,
        source: deps.source ?? null,
        status: LEDGER_STATUS_CLAIMED,
      })

      if (!error) {
        return true
      }

      // A Postgres unique violation (code 23505) means another worker or process
      // already claimed this slot.
      if (error.code === '23505') {
        return false
      }

      // A ledger that cannot be written is a broken safety device, not a licence to send.
      // Never translate an unknown Supabase error into true.
      throw new Error(`Supabase ledger claim error: ${error.message || JSON.stringify(error)}`)
    },

    async get(input) {
      const normalizedEmail = normalizeLedgerEmail(input.recipientEmail)

      const { data, error } = await deps.client
        .from('event_email_send_log')
        .select('*')
        .eq('recipient_email', normalizedEmail)
        .eq('slug', input.slug)
        .maybeSingle()

      if (error) {
        throw new Error(`Supabase ledger get error: ${error.message || JSON.stringify(error)}`)
      }

      return data as EventEmailLedgerRow | null
    },

    async markSent(input) {
      const normalizedEmail = normalizeLedgerEmail(input.recipientEmail)

      const { error } = await deps.client
        .from('event_email_send_log')
        .update({
          status: LEDGER_STATUS_SENT,
          sent_at: new Date().toISOString(),
          provider_id: input.providerId ?? null,
        })
        .eq('recipient_email', normalizedEmail)
        .eq('slug', input.slug)

      if (error) {
        throw new Error(`Supabase ledger markSent error: ${error.message || JSON.stringify(error)}`)
      }
    },

    // Mark failed keeps the row rather than deleting it. Deleting would let the next
    // */30 tick auto-retry, and a network timeout after Resend already accepted the
    // message is indistinguishable from a real failure. Same policy as the sqlite ledger:
    // failures are surfaced for a human, never re-blasted on a timer.
    async markFailed(input) {
      const normalizedEmail = normalizeLedgerEmail(input.recipientEmail)
      const truncatedError = input.error ? input.error.slice(0, 2000) : null

      const { error } = await deps.client
        .from('event_email_send_log')
        .update({
          status: LEDGER_STATUS_FAILED,
          error: truncatedError,
        })
        .eq('recipient_email', normalizedEmail)
        .eq('slug', input.slug)

      if (error) {
        throw new Error(`Supabase ledger markFailed error: ${error.message || JSON.stringify(error)}`)
      }
    },
  }
}

// Order of operations: claim (atomic) -> send -> markSent / markFailed.
//
// Claiming first means a crash between claim and send produces a GAP (that person
// gets nothing) rather than a DUPLICATE (they get two). That direction is chosen
// deliberately: an unwanted send is the unrecoverable error here, and a gap is
// visible and recoverable.
export async function sendOneDeduped(input: {
  ledger: EventEmailLedger
  recipientEmail: string
  slug: string
  subject?: string | null
  send: () => Promise<unknown>
  log?: { error: (msg: string) => void }
}): Promise<
  | { outcome: 'sent'; providerId: string | null }
  | { outcome: 'already-sent'; existingStatus: string }
  | { outcome: 'failed'; error: string }
> {
  let claimed = false

  try {
    claimed = await input.ledger.claim({
      recipientEmail: input.recipientEmail,
      slug: input.slug,
      subject: input.subject,
    })
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    input.log?.error(`Ledger claim error for ${input.recipientEmail}: ${errorMsg}`)
    return { outcome: 'failed', error: errorMsg }
  }

  if (!claimed) {
    try {
      const existing = await input.ledger.get({
        recipientEmail: input.recipientEmail,
        slug: input.slug,
      })
      return {
        outcome: 'already-sent',
        existingStatus: existing?.status ?? LEDGER_STATUS_CLAIMED,
      }
    } catch (err) {
      return {
        outcome: 'already-sent',
        existingStatus: LEDGER_STATUS_CLAIMED,
      }
    }
  }

  try {
    const res = await input.send()
    const providerId =
      res && typeof res === 'object' && 'id' in res && typeof (res as { id?: unknown }).id === 'string'
        ? (res as { id: string }).id
        : null

    await input.ledger.markSent({
      recipientEmail: input.recipientEmail,
      slug: input.slug,
      providerId,
    })

    return { outcome: 'sent', providerId }
  } catch (sendErr) {
    const errorMsg = sendErr instanceof Error ? sendErr.message : String(sendErr)

    try {
      await input.ledger.markFailed({
        recipientEmail: input.recipientEmail,
        slug: input.slug,
        error: errorMsg,
      })
    } catch (markErr) {
      const markMsg = markErr instanceof Error ? markErr.message : String(markErr)
      input.log?.error(`Ledger markFailed error for ${input.recipientEmail}: ${markMsg}`)
    }

    return { outcome: 'failed', error: errorMsg }
  }
}
