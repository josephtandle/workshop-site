import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { isValidEmail, normaliseEmail } from './email-validation'
import { sendViaResend } from './resend-sender'
import { FROM_ADDRESS, type SentEmail } from './subscribe'

const SITE = 'https://passiveincome.mastermindshq.business'
const TOKEN_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000

export function emailLookupPattern(email: string): string {
  return email.trim().toLowerCase().replace(/[\\%_]/g, '\\$&')
}

function signingKey(): Buffer {
  const secret = process.env.AI_AGENT_INCOME_STRIPE_SECRET_KEY?.trim()
  if (!secret) throw new Error('AI_AGENT_INCOME_STRIPE_SECRET_KEY is not configured.')
  return createHash('sha256').update(`prompt-pack:${secret}`).digest()
}

export function createPackToken(email: string, now = Date.now()): string {
  const key = signingKey()
  const normalized = normaliseEmail(email)
  if (normalized.length > 254 || !isValidEmail(normalized) || !Number.isSafeInteger(now)) {
    throw new Error('A valid email and time are required for a prompt pack link.')
  }
  const payload = Buffer.from(JSON.stringify({ email: normalized, expires: now + TOKEN_LIFETIME_MS })).toString('base64url')
  const signature = createHmac('sha256', key).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

export function verifyPackToken(token: string, now = Date.now()): string | null {
  const key = signingKey()
  if (token.length > 2048 || !Number.isSafeInteger(now)) return null
  const parts = token.split('.')
  if (parts.length !== 2 || !parts.every((part) => /^[A-Za-z0-9_-]+$/.test(part))) return null
  const [payload, signature] = parts
  const received = Buffer.from(signature, 'base64url')
  const expected = createHmac('sha256', key).update(payload).digest()
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null
  if (received.toString('base64url') !== signature) return null
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (typeof decoded.email !== 'string' || decoded.email.length > 254 || !isValidEmail(decoded.email)) return null
    if (!Number.isSafeInteger(decoded.expires) || now >= decoded.expires) return null
    return normaliseEmail(decoded.email)
  } catch {
    return null
  }
}

export function packDownloadUrl(email: string): string {
  return `${SITE}/api/ai-agent-income/prompt-pack?token=${createPackToken(email)}`
}

export function buildPackEmail(email: string): SentEmail & { text: string } {
  const url = packDownloadUrl(email)
  const paragraphs = [
    'Hi,',
    'Thanks for starting the trial. Here is your prompt pack: all 200 full build prompts from The AI Agent Income Playbook, one text file each.',
    'To use one: unzip the file, open index.txt to find your lane, open the starter file, copy all of it, and paste it into a fresh Claude Code session in an empty folder.',
    'The link works for 30 days. If it expires, go to passiveincome.mastermindshq.business and use "Send me my prompt pack" to get a new one.',
    'Your trial is $1 for 7 days, then $20 a month. You can cancel any time, and the prompt pack stays yours.',
    'Joe',
  ]
  const text = [...paragraphs.slice(0, 2), `[Download the prompt pack](${url})`, ...paragraphs.slice(2)].join('\n\n')
  const html = paragraphs.map((paragraph, index) => `<p>${paragraph}</p>${index === 1 ? `<p><a href="${url}">Download the prompt pack</a></p>` : ''}`).join('\n')
  return { from: FROM_ADDRESS, to: normaliseEmail(email), subject: 'Your prompt pack for The AI Agent Income Playbook', text, html }
}

export async function sendPackEmail(
  email: string,
  deps: { sendEmail?: (email: SentEmail & { text: string }) => Promise<void> } = {},
): Promise<{ sent: boolean; error?: string }> {
  try {
    await (deps.sendEmail ?? sendViaResend)(buildPackEmail(email))
    return { sent: true }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unable to send prompt pack email.'
    console.error('ai-agent-income prompt pack email failed', error)
    return { sent: false, error }
  }
}
