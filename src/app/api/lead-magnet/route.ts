import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const RESEND_API_KEY = process.env.RESEND_API_KEY

async function sendViaResend(email: string, source: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workshop.mastermindshq.business'

  let subject: string
  let html: string

  if (source === 'cult-brand-playbook') {
    subject = 'The Cult Brand Playbook'
    html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; background: #ffffff;">

        <p style="font-size: 13px; color: #999; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px;">The Cult Brand Playbook</p>

        <h1 style="font-size: 28px; font-weight: 800; line-height: 1.2; margin-bottom: 20px; color: #111;">
          Stop competing on features.<br>Start competing on identity.
        </h1>

        <p style="font-size: 16px; color: #444; line-height: 1.7; margin-bottom: 24px;">
          Most brands fight in the Visible Market: features, price, specs. It is a race to the bottom.
          The brands with the most devoted customers operate in the Mental Market: beliefs, identity, meaning.
          This playbook gives you the full system.
        </p>

        <div style="background: #f5f0ff; border-left: 3px solid #7C69C7; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 32px;">
          <p style="font-size: 14px; color: #333; margin: 0; line-height: 1.6;">
            <strong>Starbucks</strong> sells sophistication, not coffee.<br>
            <strong>Nike</strong> sells belief in personal greatness, not shoes.<br>
            <strong>Liquid Death</strong> sells rebellion against corporate wellness culture, not water.<br>
            None of them lead with specs. They lead with who you become when you buy.
          </p>
        </div>

        <h2 style="font-size: 20px; font-weight: 700; color: #111; margin-bottom: 16px;">The 7 Elements of a Cult Brand</h2>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; width: 32px; color: #7C69C7; font-weight: 700; font-size: 13px; vertical-align: top;">01</td>
            <td style="padding: 12px 8px; vertical-align: top;">
              <p style="margin: 0 0 4px; font-weight: 700; font-size: 15px; color: #111;">Shared Beliefs</p>
              <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">The manifesto that makes some people nod hard and others disagree. Disagreement is the signal. A belief that everyone agrees with is a platitude, not a position.</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #7C69C7; font-style: italic;">Your job: Complete the sentence "We believe that..." so that some people would push back.</p>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #7C69C7; font-weight: 700; font-size: 13px; vertical-align: top;">02</td>
            <td style="padding: 12px 8px; vertical-align: top;">
              <p style="margin: 0 0 4px; font-weight: 700; font-size: 15px; color: #111;">The Common Enemy</p>
              <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">Cult brands define themselves as much by what they oppose as what they stand for. The enemy creates unity. The enemy does not have to be a competitor. It can be a behavior, an institution, or a mindset.</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #7C69C7; font-style: italic;">Apple's enemy: IBM, corporate conformity. Liquid Death's enemy: plastic, boring wellness. CrossFit's enemy: complacency, globo gyms.</p>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #7C69C7; font-weight: 700; font-size: 13px; vertical-align: top;">03</td>
            <td style="padding: 12px 8px; vertical-align: top;">
              <p style="margin: 0 0 4px; font-weight: 700; font-size: 15px; color: #111;">Identity</p>
              <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">The most powerful thing you can sell is an answer to "who am I?" Watch how people describe themselves with cult brands. They say "I am a CrossFit person," not "I use CrossFit." The brand becomes part of their self-concept.</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #7C69C7; font-style: italic;">Your job: Write the identity sentence your customer feels. "When I use [brand], I am [identity]."</p>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #7C69C7; font-weight: 700; font-size: 13px; vertical-align: top;">04</td>
            <td style="padding: 12px 8px; vertical-align: top;">
              <p style="margin: 0 0 4px; font-weight: 700; font-size: 15px; color: #111;">Rituals</p>
              <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">Repeated behaviors that reinforce belonging. They can be product rituals (how you use it), community rituals (events, challenges), or language rituals (words only members use). They separate insiders from outsiders without a word.</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #7C69C7; font-style: italic;">CrossFit: posting your WOD time on the whiteboard. SoulCycle: the candle, the darkness. Harley: the group ride.</p>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #7C69C7; font-weight: 700; font-size: 13px; vertical-align: top;">05</td>
            <td style="padding: 12px 8px; vertical-align: top;">
              <p style="margin: 0 0 4px; font-weight: 700; font-size: 15px; color: #111;">Sacred Language</p>
              <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">Every tribe develops its own vocabulary. Shared language is a signal of belonging. Know the words, you are in. CrossFit calls it a "box," not a gym. Apple calls its stores "stores" but its support staff "Geniuses." The naming matters.</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #7C69C7; font-style: italic;">Your job: Replace 3 generic words in your brand vocabulary with brand-specific ones.</p>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #7C69C7; font-weight: 700; font-size: 13px; vertical-align: top;">06</td>
            <td style="padding: 12px 8px; vertical-align: top;">
              <p style="margin: 0 0 4px; font-weight: 700; font-size: 15px; color: #111;">Symbols</p>
              <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">Visual and verbal badges that let members recognize each other. The Nike swoosh on your shoes. The Patagonia fleece in certain professional circles. Symbols are shorthand for belonging and signal "I am one of you" without a word spoken.</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #7C69C7; font-style: italic;">Your job: What is the one symbol your most devoted customers already use to signal membership?</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; color: #7C69C7; font-weight: 700; font-size: 13px; vertical-align: top;">07</td>
            <td style="padding: 12px 8px; vertical-align: top;">
              <p style="margin: 0 0 4px; font-weight: 700; font-size: 15px; color: #111;">Community</p>
              <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">Competitors can copy your product. They cannot copy your people. The brand is the origin. The community becomes the destination. The key distinction: are you building connections between customers, or only between customers and you? The latter is fragile. The former compounds.</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #7C69C7; font-style: italic;">Audience to fans to community to tribe. Each stage is harder to copy and more defensible.</p>
            </td>
          </tr>
        </table>

        <h2 style="font-size: 18px; font-weight: 700; color: #111; margin-bottom: 12px;">The 30-Day Sprint</h2>

        <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 8px;"><strong>Week 1: Diagnose.</strong> Write your current elevator pitch. Is it Visible Market or Mental Market? Find your 3 most devoted customers and ask: "What does this brand say about you?"</p>
        <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 8px;"><strong>Week 2: Build the foundation.</strong> Write your manifesto. Name your enemy (be specific). Write the identity sentence: "When I use [brand], I am [identity]."</p>
        <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 8px;"><strong>Week 3: Build the language.</strong> Replace 3 generic words with brand-specific vocabulary. Design one ritual. Identify or design one symbol.</p>
        <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 24px;"><strong>Week 4: Activate community.</strong> Find where your most devoted customers already gather. Create one touchpoint that connects customers to each other, not just to you. Start measuring advocacy, not just satisfaction.</p>

        <div style="background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 16px 20px; margin-bottom: 32px;">
          <p style="font-size: 13px; color: #666; margin: 0; line-height: 1.6;"><strong>The one-sentence version:</strong> Stop selling products. Start building a world that people want to live in.</p>
        </div>

        <p style="font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 8px;">
          If this resonates, come see what we are building at
          <a href="https://mastermindshq.business" style="color: #7C69C7; font-weight: 600;">Masterminds HQ</a>.
          It is a live community of founders building real businesses with AI.
        </p>

        <p style="font-size: 14px; color: #999; margin-top: 32px;">Joe Che</p>
        <p style="font-size: 12px; color: #bbb; margin-top: 8px;">Sent by Masterminds HQ. You can unsubscribe any time.</p>
      </div>
    `
  } else if (source === 'web-design-arsenal') {
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
  'cult-brand-playbook': 'giveaway-cult-brand-playbook',
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
