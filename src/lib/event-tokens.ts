import { createHmac, timingSafeEqual } from 'crypto'

function getSecret() {
  return process.env.CRON_SECRET ?? ''
}

export function generateToken(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex')
}

export function verifyToken(payload: string, token: string): boolean {
  const expected = generateToken(payload)
  if (expected.length !== token.length) return false
  return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(token, 'hex'))
}
