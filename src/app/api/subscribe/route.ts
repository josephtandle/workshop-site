import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { handleSubscribe, SubscribeError, type SubscribeDeps } from '@/lib/subscribe'
import { sendViaResend } from '@/lib/resend-sender'
import { isSuppressed } from '@/lib/email-suppressions'

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Server-side only. The browser never sees this; it holds the publishable
    // key, and RLS is on with no anon policies, so it can neither read nor write.
    process.env.SUPABASE_SECRET_KEY!,
  )
}

const deps: SubscribeDeps = {
  async saveLead({ firstName, lastName, email, leadMagnet }) {
    const { error } = await supabase()
      .from('leads')
      .upsert(
        {
          email,
          first_name: firstName,
          last_name: lastName,
          lead_source: leadMagnet,
        },
        { onConflict: 'email' },
      )

    // supabase-js RESOLVES with an error rather than throwing. The old code
    // ignored this, which is exactly how the missing leads table went unnoticed.
    if (error) throw new Error(`Supabase saveLead failed: ${error.message}`)
  },

  async claimSignup(email, leadMagnet) {
    // UNIQUE(email, lead_magnet) makes this the dedupe gate. A duplicate raises
    // 23505, which we read as "they already have this one" rather than an error.
    const { error } = await supabase()
      .from('lead_magnet_signups')
      .insert({ email, lead_magnet: leadMagnet, emailed_at: new Date().toISOString() })

    if (error) {
      if (error.code === '23505') return false
      throw new Error(`Supabase claimSignup failed: ${error.message}`)
    }
    return true
  },

  sendEmail: sendViaResend,
  isSuppressed,
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = await handleSubscribe(
      {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        leadMagnet: body.leadMagnet ?? body.source,
      },
      deps,
    )

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof SubscribeError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
