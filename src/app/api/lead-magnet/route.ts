import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    )
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('subscribers')
      .upsert({ email, source: 'lead-magnet' }, { onConflict: 'email' })

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save subscriber' },
        { status: 500 }
      )
    }

    // Send email with PDF link via Resend
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workshop.mastermindshq.business'

    const { error: emailError } = await resend.emails.send({
      from: 'Masterminds HQ <onboarding@resend.dev>',
      to: email,
      subject: 'Your free PDF: Un-Learning Success',
      html: `
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
      `,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      // Still return success since the subscriber was saved
      return NextResponse.json({ success: true, emailSent: false })
    }

    return NextResponse.json({ success: true, emailSent: true })
  } catch (error) {
    console.error('Lead magnet error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
