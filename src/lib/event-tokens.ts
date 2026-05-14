import { createHmac } from 'crypto'

function getSecret() {
  return process.env.CRON_SECRET ?? ''
}

export function generateToken(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex')
}

export function verifyToken(payload: string, token: string): boolean {
  return generateToken(payload) === token
}
