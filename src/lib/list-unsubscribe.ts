import { createHmac, timingSafeEqual } from 'crypto'

function getSecret(): string {
  return process.env.UNSUBSCRIBE_TOKEN_SECRET ?? ''
}

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://workshop.mastermindshq.business').replace(/\/+$/g, '')
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
 */
export function verifyUnsubscribeToken(token: string | null | undefined): UnsubscribeTokenResult {
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

export function buildUnsubscribeUrl(email: string): string {
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
 */
export function buildUnsubscribeHeaders(recipientEmail: string): Record<string, string> {
  const url = buildUnsubscribeUrl(recipientEmail)
  return {
    'List-Unsubscribe': `<${url}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  }
}
