// The lead magnet table. One entry per magnet: what it is called, what subject
// line it sends under, and what file it delivers.
//
// Deliberately fail-closed. The existing /api/lead-magnet route has an `else`
// branch that sends the Un-Learning Success PDF to any source it does not
// recognise, which means roughly eighteen magnets currently email people an
// asset they never asked for. Do not repeat that here: an unknown slug is an
// error, not a default.

export type LeadMagnet = {
  slug: string
  name: string
  subject: string
  /** Path under the public site. Rendered into an absolute URL at send time. */
  downloadPath: string
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://workshop.mastermindshq.business'

export const LEAD_MAGNETS: Record<string, LeadMagnet> = {
  'client-launch-checklist': {
    slug: 'client-launch-checklist',
    name: 'The Client Launch Checklist',
    subject: 'Your Client Launch Checklist',
    downloadPath: '/client-launch-checklist.pdf',
  },
}

export function getLeadMagnet(slug: string): LeadMagnet | undefined {
  return LEAD_MAGNETS[slug]
}

export function downloadUrlFor(magnet: LeadMagnet): string {
  return `${SITE_URL}${magnet.downloadPath}`
}

/** Greets by first name and carries a single download button. */
export function buildWelcomeEmail(firstName: string, magnet: LeadMagnet) {
  const url = downloadUrlFor(magnet)
  const name = firstName.trim()

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#23202a;max-width:520px">
      <p>Hi ${escapeHtml(name)},</p>
      <p>Here is ${escapeHtml(magnet.name)}, as promised.</p>
      <p style="margin:28px 0">
        <a href="${url}"
           style="display:inline-block;background:#7C69C7;color:#ffffff;text-decoration:none;font-weight:600;padding:14px 28px;border-radius:12px">
          Download ${escapeHtml(magnet.name)}
        </a>
      </p>
      <p>If the button does not work, use this link:<br>
        <a href="${url}" style="color:#7C69C7">${url}</a>
      </p>
      <p>Joe Che</p>
    </div>
  `.trim()

  return {
    subject: magnet.subject,
    html,
    downloadUrl: url,
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
