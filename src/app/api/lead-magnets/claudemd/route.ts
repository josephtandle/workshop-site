import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const MANDRILL_API_KEY = process.env.MANDRILL_API_KEY
const BASE_URL = 'https://mandrillapp.com/api/1.0'

async function sendViaMandrill(firstName: string, email: string, fileContent: string) {
  const fileBase64 = Buffer.from(fileContent).toString('base64')

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
      <h1 style="font-size: 24px; margin-bottom: 16px;">Hi ${firstName},</h1>
      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 16px;">
        Here is the file. I hope you enjoy it. This represents many months of learning
        that you can now add to your own records.
      </p>
      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 32px;">
        The file is attached. The full contents are also included below so you can
        read it right here.
      </p>

      <div style="background: #f5f5f5; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
        <pre style="font-family: monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; margin: 0; color: #333;">${fileContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
      </div>

      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />

      <p style="font-size: 15px; line-height: 1.7; margin-bottom: 16px; color: #444;">
        If you want to learn more, I host Masterminds where you can learn how to create
        websites and use AI to automate your business. This is designed for service-based
        small business owners with fewer than five employees. Even after just one session,
        my participants have been able to create stunning websites, ingest years of business
        information and conversations, and organize it all so their AI gets smart.
      </p>
      <p style="font-size: 15px; margin-bottom: 8px;">
        <a href="https://mastermindshq.business" style="color: #7C69C7; font-weight: 600;">
          Learn more at mastermindshq.business
        </a>
      </p>

      <p style="font-size: 14px; color: #999; margin-top: 32px;">
        — Joe Che
      </p>
    </div>
  `

  const res = await fetch(`${BASE_URL}/messages/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: MANDRILL_API_KEY,
      message: {
        html,
        subject: 'Your Ultimate Claude.md File',
        from_email: 'joe@mastermindshq.business',
        from_name: 'Joe Che',
        to: [{ email, type: 'to' }],
        attachments: [
          {
            type: 'text/plain',
            name: 'joe-che-claude.md',
            content: fileBase64,
          },
        ],
      },
    }),
  })

  if (!res.ok) throw new Error(`Mandrill error: ${res.status}`)
  return res.json()
}

export async function POST(request: Request) {
  try {
    const { firstName, email } = await request.json()

    if (!firstName || !email) {
      return NextResponse.json({ error: 'firstName and email are required' }, { status: 400 })
    }

    // Save to Supabase leads table
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    )

    const { error: dbError } = await supabase
      .from('leads')
      .upsert({ first_name: firstName, email, lead_source: 'Claude.md' }, { onConflict: 'email' })

    if (dbError) {
      console.error('Supabase error:', dbError)
      // Don't block email send if DB save fails
    }

    // Read the file
    const filePath = join(process.cwd(), 'public', 'joe-che-claude.md')
    const fileContent = readFileSync(filePath, 'utf-8')

    // Send via Mandrill
    await sendViaMandrill(firstName, email, fileContent)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('claudemd lead magnet error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
