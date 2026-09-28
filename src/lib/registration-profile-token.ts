import { createHmac, timingSafeEqual } from 'node:crypto'

function profileSecret(): string {
  const secret = process.env.REGISTRATION_PROFILE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  if (!secret) throw new Error('Registration profile secret is not configured.')
  return secret
}

export function createRegistrationProfileToken(slug: string, email: string, secret = profileSecret()): string {
  return createHmac('sha256', secret).update(`${slug}:${email.trim().toLowerCase()}`).digest('hex')
}

export function verifyRegistrationProfileToken(slug: string, email: string, token: string, secret = profileSecret()): boolean {
  if (!/^[a-f0-9]{64}$/.test(token)) return false
  const expected = createRegistrationProfileToken(slug, email, secret)
  return timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'))
}
