import { type NextRequest } from 'next/server'
import { cancelRegistration, getActiveWaitlist, hasOpenSpots } from '@/lib/event-registration-db'
import { getEventBySlug } from '@/lib/events'
import { sendWaitlistSpotNotificationEmail } from '@/lib/event-confirmation-email'

export const runtime = 'nodejs'

function htmlPage(title: string, message: string, status = 200) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f0f0f; color: #f0f0f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; box-sizing: border-box; }
    .card { max-width: 480px; text-align: center; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.75rem; }
    p { color: #a0a0a0; margin: 0; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

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
    return htmlPage('Invalid Link', 'This cancellation link is invalid or has expired.', 400)
  }

  try {
    const { eventSlug, attendeeName, wasAlreadyCancelled } = await cancelRegistration(token)

    if (!wasAlreadyCancelled) {
      notifyWaitlist(eventSlug, token).catch((err) => {
        console.error('waitlist notify error after cancel', err)
      })
    }

    const heading = wasAlreadyCancelled ? 'Already cancelled' : 'Seat cancelled'
    const body = wasAlreadyCancelled
      ? `Your seat was already cancelled, ${attendeeName}. Nothing further to do.`
      : `Your seat has been cancelled, ${attendeeName}. We hope to see you at a future event.`

    return htmlPage(heading, body)
  } catch (err) {
    console.error('cancel registration error', err)
    const message = err instanceof Error ? err.message : 'Unknown error.'
    return htmlPage('Something went wrong', message, 400)
  }
}
