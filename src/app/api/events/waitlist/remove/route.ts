import { type NextRequest } from 'next/server'
import { removeFromWaitlist } from '@/lib/event-registration-db'

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

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return htmlPage('Invalid Link', 'This removal link is invalid or has expired.', 400)
  }

  try {
    await removeFromWaitlist(token)
    return htmlPage(
      'Removed from waitlist',
      "You've been removed from the waitlist. We hope to see you at a future event.",
    )
  } catch (err) {
    console.error('waitlist remove error', err)
    const message = err instanceof Error ? err.message : 'Unknown error.'
    return htmlPage('Something went wrong', message, 400)
  }
}
