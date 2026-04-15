import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const RESEND_API_KEY = process.env.RESEND_API_KEY

async function sendViaResend(email: string, source: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workshop.mastermindshq.business'

  let subject: string
  let html: string

  if (source === 'web-design-arsenal') {
    subject = "You're on the list"
    html = `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
        <h1 style="font-size: 22px; margin-bottom: 16px;">You're on the list.</h1>
        <p style="font-size: 16px; line-height: 1.7; margin-bottom: 16px;">
          I'll let you know when new skills and resources drop.
        </p>
        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 24px; color: #444;">
          In the meantime, if you want to see what's possible when people use these tools in a live mastermind session,
          come check out what we're building at
          <a href="https://mastermindshq.business" style="color: #7C69C7; font-weight: 600;">mastermindshq.business</a>.
        </p>
        <p style="font-size: 14px; color: #999; margin-top: 32px;">— Joe Che</p>
      </div>
    `
  } else {
    subject = 'Your free PDF: Un-Learning Success'
    html = `
      <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; color: #1a1a1a; margin-bottom: 16px;">
          Here's your copy of Un-Learning Success
        </h1>
        <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 24px;">
          17 real stories from a VIP dinner in Manhattan. Each person answered one question:
          "What did you have to un-learn about success?"
        </p>
        <a href="${siteUrl}/unlearning-success.pdf"
           style="display: inline-block; background: #7C69C7; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Download the PDF
        </a>
        <p style="font-size: 13px; color: #999; margin-top: 32px; line-height: 1.5;">
          Sent by Masterminds HQ. You can unsubscribe any time.
        </p>
      </div>
    `
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Joe Che <joe@mastermindshq.business>',
      to: [email],
      subject,
      html,
    }),
  })

  if (!res.ok) throw new Error(`Resend error: ${res.status}`)
  return res.json()
}

// Map the giveaway page source to the CRM source key and giveaway label
const GIVEAWAY_SOURCE_MAP: Record<string, string> = {
  'web-design-arsenal': 'giveaway-web-design-arsenal',
  'lead-magnet': 'giveaway-unlearning-success',
  'claude-md': 'giveaway-claude-md',
  'benchmark': 'giveaway-benchmark',
  'anthropic-safety-checklist': 'giveaway-anthropic-checklist',
}

async function ingestIntoCrm(email: string, source: string) {
  const crmSource = GIVEAWAY_SOURCE_MAP[source] ?? `giveaway-${source}`
  const res = await fetch('http://localhost:3000/api/crm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'ingest',
      email,
      source: crmSource,
      primary_project: 'mastermind',
      campaign: source,
    }),
  })
  if (!res.ok) throw new Error(`CRM ingest failed: ${res.status}`)
}

export async function POST(request: Request) {
  try {
    const { email, source = 'lead-magnet' } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Save to Supabase leads table (non-blocking)
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!
      )
      await supabase
        .from('leads')
        .upsert({ email, lead_source: source }, { onConflict: 'email' })
    } catch (dbErr) {
      console.error('Supabase error (non-blocking):', dbErr)
    }

    // Ingest into Mission Control CRM with giveaway tag (non-blocking)
    ingestIntoCrm(email, source).catch((err) =>
      console.error('CRM ingest error (non-blocking):', err)
    )

    // Send confirmation via Resend
    await sendViaResend(email, source)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead magnet error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
