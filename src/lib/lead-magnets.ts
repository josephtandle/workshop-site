// The lead magnet table. One entry per magnet: what it is called, what subject
// line it sends under, and what file it delivers.
//
// Deliberately fail-closed. The existing /api/lead-magnet route has an `else`
// branch that sends the Un-Learning Success PDF to any source it does not
// recognise, which means roughly eighteen magnets currently email people an
// asset they never asked for. Do not repeat that here: an unknown slug is an
// error, not a default.

import { buildUnsubscribeUrl } from './list-unsubscribe'
import { withUtm } from './utm'

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

/**
 * The slugs /api/lead-magnet can actually deliver today.
 *
 * Each one is still served by a hardcoded template inside
 * src/app/api/lead-magnet/route.ts, NOT by LEAD_MAGNETS above. This set exists
 * so that route can fail closed instead of falling through to a default asset:
 * a source that is not listed here gets nothing, and the caller is told.
 *
 * TODO(lead-magnets): migrate these templates into LEAD_MAGNETS so there is one
 * typed registry rather than a registry plus an if/else chain. Separate job.
 * Until it happens, adding a giveaway page means adding its template to the
 * route AND its slug here, in the same change.
 *
 * Known gap the fail-closed behaviour exposes: several live giveaway pages
 * (agent-infrastructure, ai-behavior-quiz, ai-levels-quiz, anthropic-safety-checklist,
 * benchmark, claude-md, client-launch-checklist, compare,
 * cross-cli-compatibility-routing, fable-worth-it-audit, ig-settings,
 * intuition-quiz, logo-maker-guide, ray-dalio-council, squarespace-escape,
 * viral-hooks, ...) post sources with no template. They used to receive the
 * Un-Learning Success PDF by accident. They now receive nothing, which is the
 * correct failure until each one gets a real asset.
 */
export const DELIVERABLE_LEAD_MAGNET_SOURCES: ReadonlySet<string> = new Set([
  'all-sorted-overview',
  'business-builder-quiz',
  'cost-stack',
  'cult-brand-playbook',
  'guardog',
  'human',
  'lead-magnet',
  'maccleaner',
  'speak-human',
  'web-design-arsenal',
])

/** True when /api/lead-magnet has a real asset for this source. */
export function isDeliverableLeadMagnetSource(source: string): boolean {
  return DELIVERABLE_LEAD_MAGNET_SOURCES.has(source)
}

/** Thrown rather than defaulting to some other magnet's asset. */
export class UnknownLeadMagnetSourceError extends Error {
  readonly source: string

  constructor(source: string) {
    super(`No lead magnet asset is registered for source "${source}".`)
    this.name = 'UnknownLeadMagnetSourceError'
    this.source = source
  }
}

export function downloadUrlFor(magnet: LeadMagnet): string {
  return `${SITE_URL}${magnet.downloadPath}`
}

/** Greets by first name and carries a single download button. */
export function buildWelcomeEmail(firstName: string, magnet: LeadMagnet, recipientEmail: string) {
  const url = downloadUrlFor(magnet)
  const taggedUrl = withUtm(url, { campaign: `lead-magnet-${magnet.slug}` })
  const name = firstName.trim()
  const unsubscribeUrl = buildUnsubscribeUrl(recipientEmail)

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#23202a;max-width:520px">
      <p>Hi ${escapeHtml(name)},</p>
      <p>Here is ${escapeHtml(magnet.name)}, as promised.</p>
      <p style="margin:28px 0">
        <a href="${taggedUrl}"
           style="display:inline-block;background:#8B79D4;color:#ffffff;text-decoration:none;font-weight:600;padding:14px 28px;border-radius:12px">
          Download ${escapeHtml(magnet.name)}
        </a>
      </p>
      <p>If the button does not work, use this link:<br>
        <a href="${taggedUrl}" style="color:#8B79D4">${url}</a>
      </p>
      <p>Joe Che</p>
      <p style="font-size:12px;color:#999;margin-top:24px">
        ${unsubscribeUrl
          ? `Sent by Masterminds HQ. <a href="${unsubscribeUrl}" style="color:#999">Unsubscribe</a> any time.`
          : 'Sent by Masterminds HQ.'}
      </p>
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
