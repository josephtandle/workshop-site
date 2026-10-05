import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { emailLookupPattern, verifyPackToken } from '@/lib/ai-agent-income-prompt-pack'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

const filename = 'AI-Agent-Income-Playbook-Prompt-Pack.zip'
const deniedMessage = 'This download link is invalid or expired. Request a new link from passiveincome.mastermindshq.business using "Send me my prompt pack".'

export async function GET(request: Request) {
  try {
    const email = verifyPackToken(new URL(request.url).searchParams.get('token') ?? '')
    if (!email) return NextResponse.json({ message: deniedMessage }, { status: 403 })

    const { data, error } = await supabase.from('ai_agent_income_subscriptions')
      .select('email').ilike('email', emailLookupPattern(email)).limit(1).maybeSingle()
    if (error) throw error
    if (!data) return NextResponse.json({ message: deniedMessage }, { status: 403 })

    const zip = await readFile(path.join(process.cwd(), 'private-assets/ai-agent-income', filename))
    return new Response(new Uint8Array(zip), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error('ai-agent-income prompt pack download failed', error)
    return NextResponse.json({ message: 'Unable to download the prompt pack. Please try again shortly.' }, { status: 500 })
  }
}
