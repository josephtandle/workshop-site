import { supabase } from './supabase'

/**
 * Checks the global marketing-email suppression list (public.email_suppressions,
 * see supabase/migrations/010_email_suppressions.sql) before any marketing send.
 *
 * FAIL CLOSED: if the Supabase read itself errors (network blip, RLS
 * misconfig, table not yet migrated, etc.) this returns `true`, meaning treat
 * the address as suppressed and skip the send, rather than `false`. Silently
 * emailing someone who may have unsubscribed is worse than skipping a send we
 * could not verify. The error is logged loudly (not swallowed) so the read
 * failure gets noticed and fixed rather than quietly suppressing everyone
 * forever.
 */
export async function isSuppressed(email: string): Promise<boolean> {
  const normalized = (email ?? '').trim().toLowerCase()
  if (!normalized) return true

  try {
    const { data, error } = await supabase
      .from('email_suppressions')
      .select('email')
      .eq('email', normalized)
      .maybeSingle()

    if (error) {
      console.error(
        `[email-suppressions] READ ERROR checking ${normalized}, FAILING CLOSED and skipping marketing send. ${error.message}`,
      )
      return true
    }

    return Boolean(data)
  } catch (err) {
    console.error(
      `[email-suppressions] READ EXCEPTION checking ${normalized}, FAILING CLOSED and skipping marketing send.`,
      err,
    )
    return true
  }
}

export type SuppressionSource =
  | 'list-unsubscribe'
  | 'lead-magnet'
  | 'ask-an-ai-expert-welcome'
  | 'abandoned-checkout-followup'
  | 'subscribe'
  | 'manual'

/**
 * Records an address on the global suppression list. Called by
 * src/app/api/unsubscribe/route.ts on both the RFC 8058 POST (mail client
 * one-click) and the human-facing GET (link click) paths.
 */
export async function recordSuppression(input: {
  email: string
  reason: string
  source: SuppressionSource | string
}): Promise<void> {
  const normalized = input.email.trim().toLowerCase()
  if (!normalized) throw new Error('recordSuppression called with an empty email')

  const { error } = await supabase
    .from('email_suppressions')
    .upsert({ email: normalized, reason: input.reason, source: input.source }, { onConflict: 'email' })

  if (error) {
    console.error(`[email-suppressions] WRITE ERROR recording suppression for ${normalized}: ${error.message}`)
    throw new Error(`Unable to record email suppression: ${error.message}`)
  }
}
