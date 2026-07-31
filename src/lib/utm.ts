/**
 * UTM tagging for links inside marketing emails.
 *
 * Why this exists: Resend's account-level click tracking rewrites every link
 * (including portal magic sign-in JWTs) through a redirect domain, which would
 * break auth links. Instead we tag only our own outbound marketing links with
 * UTM params at send time, so GA4 (already installed via gtag on
 * mastermindshq.business) attributes the click without any link rewriting.
 *
 * Note: workshop.mastermindshq.business itself does not currently have GA4
 * installed (only the Meta Pixel, which does not read UTM params). Links from
 * this repo that stay on workshop.mastermindshq.business will carry UTM params
 * that nothing consumes yet until GA4 (or another UTM-aware analytics tool) is
 * added there. Links that point back to mastermindshq.business (which does
 * have GA4) are captured today. Tagging is still applied uniformly so nothing
 * needs to change in the sending code once analytics is added on this domain.
 *
 * Convention: `utm_source=email`, `utm_medium=email`, `utm_campaign=<slug>`,
 * optional `utm_content=<slug>`. This sits alongside Joe's existing
 * `?ref=<channel>` convention for owned-property signup attribution
 * (see agents/shlink/CANONICAL-LINKS.md) rather than replacing it — a link
 * that already carries `?ref=` keeps it; `withUtm` only adds/overwrites the
 * `utm_*` params.
 */

/** Domains we own. UTM tagging is scoped to these — never tag a third-party link. */
const OWNED_HOSTNAMES = [
  'mastermindshq.business',
  'joe-che.com',
]

export interface UtmOptions {
  /** Required. Identifies the specific campaign/send, e.g. "lead-magnet-claudemd". */
  campaign: string
  /** Optional. Distinguishes multiple links/CTAs within the same campaign. */
  content?: string
  /** Defaults to "email". Rarely needs overriding from this helper. */
  source?: string
  /** Defaults to "email". Rarely needs overriding from this helper. */
  medium?: string
}

function isOwnedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase()
  return OWNED_HOSTNAMES.some((owned) => host === owned || host.endsWith(`.${owned}`))
}

/**
 * Append UTM params to a URL for outbound marketing email links.
 *
 * Returns the URL UNCHANGED (no UTM params added) when:
 * - the URL is not parseable
 * - the URL does not point at one of our owned domains (never tag external links)
 * - the URL already carries a `token` query param — this is the guard that keeps
 *   auth links, unsubscribe links, and event-cancel links untouched. Those tokens
 *   are single-purpose and sensitive; we never want to be the reason a link
 *   changes shape or gets re-copied/re-shared in a way that could disturb them.
 *
 * Existing query params and the URL fragment are preserved. Calling this
 * more than once on the same URL is idempotent — it overwrites the utm_*
 * keys rather than duplicating them.
 */
export function withUtm(url: string, options: UtmOptions): string {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return url
  }

  if (!isOwnedHostname(parsed.hostname)) return url
  if (parsed.searchParams.has('token')) return url

  const source = options.source ?? 'email'
  const medium = options.medium ?? 'email'

  parsed.searchParams.set('utm_source', source)
  parsed.searchParams.set('utm_medium', medium)
  parsed.searchParams.set('utm_campaign', options.campaign)
  if (options.content) {
    parsed.searchParams.set('utm_content', options.content)
  }

  return parsed.toString()
}
