import { NextResponse, type NextRequest } from 'next/server'
import { addToWaitlist, isAlreadyOnWaitlist, isAlreadyRegistered } from '@/lib/event-registration-db'
import { getEventBySlug } from '@/lib/events'
import { sendWaitlistConfirmationEmail } from '@/lib/event-confirmation-email'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { isValidEmail } from '@/lib/email-validation'
import { isEventEnded } from '@/lib/event-status'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { ok: rateLimitOk } = await checkRateLimit(`waitlist-join:${getClientIp(request)}`, 10, 60)
    if (!rateLimitOk) {
      return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
    }

    const body = await request.json()
    const eventSlug = typeof body.eventSlug === 'string' ? body.eventSlug.trim() : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!eventSlug || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const event = getEventBySlug(eventSlug)
    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    }

    if (isEventEnded(event)) {
      return NextResponse.json({ error: 'This event has ended.' }, { status: 410 })
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
