import { NextResponse, type NextRequest } from 'next/server'
import { cancelRegistration, getActiveWaitlist, hasOpenSpots } from '@/lib/event-registration-db'
import { getEventBySlug } from '@/lib/events'
import { sendWaitlistSpotNotificationEmail } from '@/lib/event-confirmation-email'

export const runtime = 'nodejs'

async function notifyWaitlist(eventSlug: string, cancelToken: string) {
  const event = getEventBySlug(eventSlug)
  if (!event) return

  const open = await hasOpenSpots(event)
  if (!open) return

  const waitlist = await getActiveWaitlist(eventSlug)
  if (waitlist.length === 0) return

  for (const entry of waitlist) {
    try {
      await sendWaitlistSpotNotificationEmail({
        event,
        name: entry.name,
        email: entry.email,
        removeToken: entry.removeToken,
        variant: 'cancellation',
        // Stable key: one notification per cancellation event per waitlist person
        idempotencyKey: `waitlist-spot-cancel/${eventSlug}/${entry.email.trim().toLowerCase()}/${cancelToken}`,
      })
    } catch (err) {
      console.error('waitlist notify on cancel error', entry.email, err)
    }
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing token.' }, { status: 400 })
  }

  try {
    const { eventSlug, wasAlreadyCancelled } = await cancelRegistration(token)

    // Only notify waitlist for a fresh cancellation — not if this link was already used
    if (!wasAlreadyCancelled) {
      notifyWaitlist(eventSlug, token).catch((err) => {
        console.error('waitlist notify error after cancel', err)
      })
    }

    return NextResponse.json({ success: true, message: 'Your seat has been cancelled.' })
  } catch (err) {
    console.error('cancel registration error', err)
    const message = err instanceof Error ? err.message : 'Unknown error.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
