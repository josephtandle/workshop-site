#!/usr/bin/env node
// Send tonight's "see you at 6, doors close 6:30" reminder to confirmed
// connection-dinner-canggu attendees. Each email includes a self-serve cancel
// link that auto-triggers waitlist notifications.
//
// Usage:
//   DRY_RUN=1 node scripts/send-dinner-tonight-reminder.mjs   # preview
//   node scripts/send-dinner-tonight-reminder.mjs             # send

import { createClient } from '@supabase/supabase-js'

const SLUG = 'connection-dinner-canggu'
const DRY_RUN = process.env.DRY_RUN === '1'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://workshop.mastermindshq.business'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SECRET_KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY

if (!supabaseUrl || !supabaseKey || !RESEND_API_KEY) {
  console.error('Missing env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, RESEND_API_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

function firstName(full) {
  if (!full) return ''
  return full.trim().split(/\s+/)[0]
}

function htmlBody({ name, cancelUrl }) {
  const hi = name ? `Hi ${firstName(name)},` : 'Hi,'
  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size:16px; line-height:1.6; color:#1a1a1a; max-width:560px;">
  <p>${hi}</p>
  <p>Looking forward to seeing you tonight at the Connection Dinner.</p>
  <p><strong>Please arrive at 6:00 PM sharp. Doors close at 6:30 PM.</strong></p>
  <p>Venue: Mostly Restaurant, Jl. Pantai Pererenan No.114, Pererenan, Canggu.</p>
  <p>If something has come up and you can't make it, please use the link below to cancel. It will automatically alert someone on our long waitlist so your seat goes to good use.</p>
  <p><a href="${cancelUrl}" style="display:inline-block;background:#7C69C7;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;">Cancel my seat</a></p>
  <p>See you soon.</p>
  <p>Joe Che</p>
</div>
`.trim()
}

async function sendEmail({ to, subject, html, idempotencyKey }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from: 'Joe Che <joe@mastermindshq.business>',
      to: [to],
      subject,
      html,
    }),
  })
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Resend ${response.status} ${body}`)
  }
  return response.json()
}

async function main() {
  const { data, error } = await supabase
    .from('event_registrations')
    .select('attendee_name, attendee_email, cancel_token')
    .eq('event_slug', SLUG)
    .eq('status', 'confirmed')

  if (error) {
    console.error('Supabase read error:', error)
    process.exit(1)
  }

  const rows = (data || []).filter((r) => r.attendee_email && r.cancel_token)
  console.log(`${rows.length} confirmed attendees with cancel tokens`)
  if (rows.length === 0) {
    console.log('Nothing to send.')
    return
  }

  let sent = 0
  let failed = 0
  for (const r of rows) {
    const cancelUrl = `${SITE_URL}/api/events/cancel?token=${encodeURIComponent(r.cancel_token)}`
    const html = htmlBody({ name: r.attendee_name, cancelUrl })
    const subject = "Tonight at 6:00 PM — Connection Dinner reminder"
    const idempotencyKey = `dinner-tonight-reminder/${SLUG}/${r.attendee_email.trim().toLowerCase()}`
    if (DRY_RUN) {
      console.log(`[dry] would send to ${r.attendee_email} (${r.attendee_name})`)
      console.log(`      cancel: ${cancelUrl}`)
      continue
    }
    try {
      await sendEmail({ to: r.attendee_email, subject, html, idempotencyKey })
      sent += 1
      console.log(`  sent: ${r.attendee_email}`)
    } catch (err) {
      failed += 1
      console.error(`  FAIL: ${r.attendee_email} — ${err.message}`)
    }
  }
  console.log('')
  console.log(`Sent: ${sent}, Failed: ${failed}${DRY_RUN ? ' (DRY RUN)' : ''}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
