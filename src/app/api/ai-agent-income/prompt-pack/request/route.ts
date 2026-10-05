import { NextResponse } from 'next/server'
import { sendPackEmail } from '@/lib/ai-agent-income-prompt-pack'
import { isValidEmail, normaliseEmail } from '@/lib/email-validation'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

const message = 'If that email has a trial or subscription, the prompt pack link is on its way.'
const windowMs = 10 * 60 * 1000
const requests = new Map<string, { count: number; expires: number }>()

export async function POST(request: Request) {
  const now = Date.now()
  for (const [ip, entry] of requests) {
    if (now >= entry.expires) requests.delete(ip)
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const entry = requests.get(ip) ?? { count: 0, expires: now + windowMs }
  if (entry.count >= 5) {
    return NextResponse.json({ message: 'Too many requests. Please try again in 10 minutes.' }, {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil((entry.expires - now) / 1000)) },
    })
  }
  entry.count += 1
  requests.set(ip, entry)

  try {
    const body = await request.json().catch(() => null)
    const email = typeof body?.email === 'string' ? normaliseEmail(body.email) : ''
    if (email.length <= 254 && isValidEmail(email)) {
      const { data, error } = await supabase.from('ai_agent_income_subscriptions')
        .select('email').eq('email', email).limit(1).maybeSingle()
      if (error) throw error
      if (data) await sendPackEmail(email)
    }
  } catch (error) {
    console.error('ai-agent-income prompt pack request failed', error)
  }
  return NextResponse.json({ message })
}
