import { supabase } from './supabase'

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for') ?? ''
  return forwarded.split(',')[0]?.trim() || 'unknown'
}

/**
 * Sliding-window rate limiter backed by Supabase.
 * Returns { ok: true } if the request is allowed, { ok: false } if rate limited.
 * Fails open: any Supabase error allows the request through.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ ok: boolean }> {
  try {
    const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString()

    const { count } = await supabase
      .from('rate_limit_log')
      .select('id', { count: 'exact', head: true })
      .eq('key', key)
      .gte('created_at', windowStart)

    if ((count ?? 0) >= limit) return { ok: false }

    await supabase.from('rate_limit_log').insert({ key })

    // Best-effort cleanup of expired records for this key (non-blocking)
    supabase
      .from('rate_limit_log')
      .delete()
      .eq('key', key)
      .lt('created_at', windowStart)
      .then(() => {})

    return { ok: true }
  } catch {
    return { ok: true }
  }
}
