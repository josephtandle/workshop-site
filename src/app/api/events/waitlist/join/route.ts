import { NextResponse, type NextRequest } from 'next/server'
import { addToWaitlist } from '@/lib/event-registration-db'
import { getEventBySlug } from '@/lib/events'
import { sendWaitlistConfirmationEmail } from '@/lib/event-confirmation-email'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const eventSlug = typeof body.eventSlug === 'string' ? body.eventSlug.trim() : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!eventSlug || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const event = getEventBySlug(eventSlug)
    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    }

    const { removeToken } = await addToWaitlist({ eventSlug, name, email })

    try {
      await sendWaitlistConfirmationEmail({ event, name, email, removeToken })
    } catch (err) {
      console.error('waitlist join confirmation email error', err)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('waitlist join error', err)
    return NextResponse.json({ error: 'Unable to join waitlist.' }, { status: 500 })
  }
}
