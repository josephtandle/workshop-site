import { type NextRequest } from 'next/server'
import { verifyUnsubscribeToken } from '@/lib/list-unsubscribe'
import { recordSuppression } from '@/lib/email-suppressions'

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

async function recordUnsubscribeFromToken(
  token: string | null,
): Promise<{ ok: true; email: string } | { ok: false }> {
  const result = verifyUnsubscribeToken(token)
  if (!result.valid) return { ok: false }

  try {
    await recordSuppression({ email: result.email, reason: 'unsubscribed', source: 'list-unsubscribe' })
    return { ok: true, email: result.email }
  } catch (err) {
    console.error('unsubscribe: failed to record suppression', err)
    return { ok: false }
  }
}

/**
 * RFC 8058 one-click unsubscribe (List-Unsubscribe-Post: List-Unsubscribe=One-Click).
 * Mail clients POST here directly on the recipient's behalf, with no page
 * render and no confirmation UI. Must respond fast with 2xx regardless of
 * outcome: clients do not parse a body and do not retry on non-2xx in any
 * useful way, so there is nothing actionable to signal back either way.
 * The token itself is still fully verified before anything is recorded.
 */
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const result = await recordUnsubscribeFromToken(token)

  if (!result.ok) {
    console.error('unsubscribe POST: missing, invalid, or tampered token')
  }

  return new Response(null, { status: 200 })
}

/** Human clicks the visible unsubscribe link in an email footer. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const result = await recordUnsubscribeFromToken(token)

  if (!result.ok) {
    return htmlPage('Invalid link', 'This unsubscribe link is invalid or has expired.', 400)
  }

  return htmlPage(
    "You're unsubscribed",
    `${result.email} will not receive further marketing emails from Masterminds HQ.`,
  )
}
