import { createHmac, timingSafeEqual } from 'crypto'

function getSecret(): string {
  return process.env.UNSUBSCRIBE_TOKEN_SECRET ?? ''
}

function hasSecret(): boolean {
  return getSecret().length > 0
}

// Dedupe the "secret missing" warning for the fail-OPEN paths (URL/header
// generation) so a broken deploy doesn't spam one log line per send. The
// fail-CLOSED path (verifyUnsubscribeToken) logs every call on purpose: each
// one is a potential forged-token attempt and must not go quiet after the
// first.
let hasWarnedMissingSecretForGeneration = false
function warnMissingSecretForGeneration(context: string) {
  if (hasWarnedMissingSecretForGeneration) return
  hasWarnedMissingSecretForGeneration = true
  console.error(
    `[list-unsubscribe] UNSUBSCRIBE_TOKEN_SECRET is not set. ${context} is disabled until it is configured (fails open: link/header omitted, send still goes out).`,
  )
}

/**
 * TRIM FIRST, always. On 2026-08-03 the production NEXT_PUBLIC_SITE_URL was
 * stored with a trailing newline. That newline landed inside the
 * `List-Unsubscribe: <...>` header value, Resend rejected every send with a
 * 422, and EVERY giveaway delivery email failed in production for as long as
 * the bad value was set. The old `.replace(/\/+$/g, '')` stripped trailing
 * slashes but not whitespace, so nothing caught it.
 *
 * A header value can never contain CR or LF, so strip those unconditionally
 * rather than trusting the environment to be clean.
 */
function getSiteUrl() {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || 'https://workshop.mastermindshq.business').trim()
  return raw.replace(/[\r\n]/g, '').replace(/\/+$/g, '')
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8')
}

/**
 * Builds a stateless, tamper-proof unsubscribe token for `email`.
 *
 * Format: `${base64url(email)}.${base64url(HMAC-SHA256(base64url(email)))}`.
 * Verification never touches the database: the signature alone proves the
 * token was minted by us for this exact address, so a suppression check can
 * happen entirely from the URL.
 */
export function buildUnsubscribeToken(email: string): string {
  const normalized = email.trim().toLowerCase()
  const payload = base64UrlEncode(normalized)
  const signature = createHmac('sha256', getSecret()).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

export type UnsubscribeTokenResult = { valid: true; email: string } | { valid: false; email: null }

/**
 * Stateless verification of a token minted by buildUnsubscribeToken. No DB
 * read. Never trust an unsigned or tampered email param: this is the only
 * source of truth for "which address does this link unsubscribe."
 *
 * SECURITY: fails CLOSED when UNSUBSCRIBE_TOKEN_SECRET is missing. Signing
 * and verifying with an empty-string key would let anyone who knows the
 * scheme forge a valid token (createHmac('sha256', '') is a real, reusable
 * key, not a no-op), so an unset/misconfigured secret must reject every
 * token outright, before any HMAC work, rather than silently accept forged
 * ones.
 */
export function verifyUnsubscribeToken(token: string | null | undefined): UnsubscribeTokenResult {
  if (!hasSecret()) {
    console.error(
      '[list-unsubscribe] SECURITY: UNSUBSCRIBE_TOKEN_SECRET is not set. Refusing to verify ANY unsubscribe token (fail closed): every token is being rejected until this is configured.',
    )
    return { valid: false, email: null }
  }

  if (!token || typeof token !== 'string') return { valid: false, email: null }

  const dotIndex = token.indexOf('.')
  if (dotIndex <= 0 || dotIndex === token.length - 1) return { valid: false, email: null }

  const payload = token.slice(0, dotIndex)
  const signature = token.slice(dotIndex + 1)

  const expectedSignature = createHmac('sha256', getSecret()).update(payload).digest('base64url')

  const signatureBuf = Buffer.from(signature)
  const expectedBuf = Buffer.from(expectedSignature)
  if (signatureBuf.length !== expectedBuf.length) return { valid: false, email: null }
  if (!timingSafeEqual(signatureBuf, expectedBuf)) return { valid: false, email: null }

  try {
    const email = base64UrlDecode(payload).trim().toLowerCase()
    if (!email || !email.includes('@')) return { valid: false, email: null }
    return { valid: true, email }
  } catch {
    return { valid: false, email: null }
  }
}

/**
 * Returns null when UNSUBSCRIBE_TOKEN_SECRET is missing, rather than a URL
 * carrying an unverifiable (empty-key-signed) token. Callers must omit the
 * visible unsubscribe link entirely in that case, not render a dead or
 * insecure href.
 */
export function buildUnsubscribeUrl(email: string): string | null {
  if (!hasSecret()) {
    warnMissingSecretForGeneration('Unsubscribe link generation')
    return null
  }
  const token = buildUnsubscribeToken(email)
  return `${getSiteUrl()}/api/unsubscribe?token=${encodeURIComponent(token)}`
}

/**
 * RFC 8058 one-click unsubscribe headers for a marketing send. Stateless:
 * the token embeds and signs the recipient email, so the /api/unsubscribe
 * route never needs a DB read to validate it, only to record it.
 *
 * Deliberately omits a `mailto:` List-Unsubscribe form. There is no inbound
 * mailbox on this domain that parses unsubscribe requests: joe@mastermindshq
 * .business is a human reply inbox, not an automated processor, so a
 * mailto: entry would silently drop the request instead of honoring it.
 * A dead mailto is worse than no mailto.
 *
 * Fails OPEN when UNSUBSCRIBE_TOKEN_SECRET is missing: returns `{}` (a safe
 * no-op to spread into a headers object) rather than throwing. A missing
 * unsubscribe header is a deliverability nit; a send that throws because of
 * it is a broken product. Verification (verifyUnsubscribeToken) is the
 * security boundary and fails closed instead.
 */
export function buildUnsubscribeHeaders(recipientEmail: string): Record<string, string> {
  const url = buildUnsubscribeUrl(recipientEmail)
  if (!url) return {}

  return {
    'List-Unsubscribe': `<${url}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  }
}
