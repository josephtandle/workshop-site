import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { buildUnsubscribeHeaders, buildUnsubscribeUrl } from '@/lib/list-unsubscribe'
import { isSuppressed } from '@/lib/email-suppressions'

const RESEND_API_KEY = process.env.RESEND_API_KEY

/**
 * Lead magnet route for the 100 Ways to Make Passive Income with AI Agents
 * pre-launch landing page (/100-ai).
 *
 * Hard rules locked by Joe:
 *   - All test sends go to newyork1@gmail.com ONLY until Joe says "go live."
 *   - Provider is Resend (never Mandrill).
 *   - Sign-off is "Joe Che" (never "Joe" or "Joe Tandle").
 *   - No em dashes anywhere in user-facing copy.
 *
 * To flip to real recipients, set the env var:
 *   PASSIVE_INCOME_100_LIVE=1
 * After Joe explicitly green-lights the launch.
 */
const LIVE_MODE = process.env.PASSIVE_INCOME_100_LIVE === '1'
const TEST_TO = 'newyork1@gmail.com'

async function sendViaResend(firstName: string, email: string, idempotencyKey: string) {
  if (!RESEND_API_KEY) {
    // Fail soft in preview environments missing the secret. Log so Joe can
    // see what would have happened without breaking the form UX.
    console.warn('[passive-income-100] RESEND_API_KEY missing. Skipping send.')
    return { skipped: true }
  }

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
      <p style="font-size: 18px; line-height: 1.6; margin-bottom: 16px;">
        Hi ${firstName.trim()},
      </p>
      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 16px;">
        Thanks for grabbing a spot on the launch list for
        <strong>100 Ways to Make Passive Income with AI Agents</strong>.
      </p>
      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 16px;">
        Here is what you get on launch day:
      </p>
      <ul style="font-size: 16px; line-height: 1.7; padding-left: 20px; margin-bottom: 24px;">
        <li>The catalog of 100 weekend-buildable AI agent income lanes.</li>
        <li>The $27 launch link, locked in for 12 days.</li>
        <li>An invite to the companion portal course at $197.</li>
        <li>First-in-line on the biweekly operator tier (10 intro seats at $799).</li>
      </ul>
      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 32px;">
        I will email you the moment the book is live. Until then, keep building.
      </p>
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        Joe Che<br />
        Founder, Masterminds HQ<br />
        From the team behind the build-it-yourself AI OS playbook.
      </p>
      <p style="font-size: 12px; color: #999; margin-top: 16px;">
        Sent by Masterminds HQ. <a href="${buildUnsubscribeUrl(email)}" style="color: #999;">Unsubscribe</a> any time.
      </p>
    </div>
  `

  const to = LIVE_MODE ? [email] : [TEST_TO]

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from: 'Joe Che <joe@mastermindshq.business>',
      to,
      subject: 'You are on the 100 AI Agent Incomes launch list',
      html,
      headers: buildUnsubscribeHeaders(email),
    }),
  })

  if (!res.ok) throw new Error(`Resend error: ${res.status}`)
  return res.json()
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const { ok: rateLimitOk } = await checkRateLimit(`passive-income-100:${getClientIp(request)}`, 10, 60)
    if (!rateLimitOk) {
      return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
    }

    const { firstName, email } = await request.json()

    if (
      !firstName || typeof firstName !== 'string' || firstName.trim().length === 0 || firstName.length > 256 ||
      !email || typeof email !== 'string' || email.length > 256 || !EMAIL_RE.test(email.trim())
    ) {
      return NextResponse.json({ error: 'firstName and valid email are required' }, { status: 400 })
    }

    // Save the captured email to Supabase even in test mode so Joe can see
    // the actual address that submitted, while sends still go to TEST_TO.
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SECRET_KEY
        )
        await supabase
          .from('leads')
          .upsert(
            { first_name: firstName, email, lead_source: '100-ai-agent-incomes' },
            { onConflict: 'email' }
          )
      }
    } catch (dbErr) {
      console.error('[passive-income-100] Supabase non-blocking error:', dbErr)
    }

    // Mission Control CRM ingest (non-blocking)
    const crmBase = process.env.MISSION_CONTROL_URL ?? 'http://localhost:3000'
    fetch(`${crmBase}/api/crm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'ingest',
        first_name: firstName,
        email,
        source: '100-ai-agent-incomes-prelaunch',
        primary_project: 'passive-income',
        campaign: '100-ai-agent-incomes',
      }),
    }).catch((err) => console.error('[passive-income-100] CRM ingest error:', err))

    // Marketing send: skip if suppressed (fails closed on any read error).
    if (await isSuppressed(email)) {
      console.log(`[passive-income-100] skipping suppressed address ${email}`)
      return NextResponse.json({ success: true, liveMode: LIVE_MODE, suppressed: true })
    }

    const idempotencyKey = `lead-magnet/100-ai-agent-incomes/${email.trim().toLowerCase()}`
    await sendViaResend(firstName, email, idempotencyKey)

    return NextResponse.json({ success: true, liveMode: LIVE_MODE })
  } catch (error) {
    console.error('[passive-income-100] error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
