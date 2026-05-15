import { NextResponse, type NextRequest } from 'next/server'
import { addToWaitlist, isAlreadyOnWaitlist, isAlreadyRegistered } from '@/lib/event-registration-db'
import { getEventBySlug } from '@/lib/events'
import { sendWaitlistConfirmationEmail } from '@/lib/event-confirmation-email'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const eventSlug = typeof body.eventSlug === 'string' ? body.eventSlug.trim() : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!eventSlug || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const event = getEventBySlug(eventSlug)
    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    }

    const [alreadyRegistered, alreadyWaitlisted] = await Promise.all([
      isAlreadyRegistered(eventSlug, email),
      isAlreadyOnWaitlist(eventSlug, email),
    ])

    if (alreadyRegistered) {
      return NextResponse.json(
        { error: 'You are already registered for this event.' },
        { status: 409 },
      )
    }

    if (alreadyWaitlisted) {
      return NextResponse.json(
        { error: 'You are already on the waitlist for this event.' },
        { status: 409 },
      )
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
