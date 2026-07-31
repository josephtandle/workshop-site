import type { SentEmail } from './subscribe'

/**
 * True when the process is a test run. Node's built-in runner (which this repo
 * uses via `tsx --test`) sets NODE_ENV=test.
 */
export function isTestRun(): boolean {
  const isRunningTestFile = process.argv.some(
    (arg) => /\.test\.[cm]?[jt]s$/.test(arg) || arg.includes('/tests/'),
  )

  return (
    process.env.NODE_ENV === 'test' ||
    process.env.VITEST === 'true' ||
    process.env.JEST_WORKER_ID !== undefined ||
    process.env.TSX_TEST === 'true' ||
    isRunningTestFile
  )
}

/**
 * The ONLY place this codebase talks to the live Resend API.
 *
 * The guard is the point: even if a test forgets to inject a fake sender, or a
 * future refactor wires the real one in by accident, a test run throws rather
 * than mailing a real person. Tests must inject a fake via SubscribeDeps.
 */
export async function sendViaResend(email: SentEmail): Promise<void> {
  if (isTestRun()) {
    throw new Error(
      'Refusing to call the live Resend API during a test run. Inject a fake sendEmail via SubscribeDeps.',
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set')
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: email.from,
      to: [email.to],
      subject: email.subject,
      html: email.html,
      ...(email.headers ? { headers: email.headers } : {}),
    }),
  })

  if (!res.ok) {
    throw new Error(`Resend failed: ${res.status} ${await res.text()}`)
  }
}
