import { NextResponse, type NextRequest } from 'next/server'
import { removeFromWaitlist } from '@/lib/event-registration-db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing token.' }, { status: 400 })
  }

  try {
    await removeFromWaitlist(token)
    return NextResponse.json({ success: true, message: 'You have been removed from the waitlist.' })
  } catch (err) {
    console.error('waitlist remove error', err)
    const message = err instanceof Error ? err.message : 'Unknown error.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
