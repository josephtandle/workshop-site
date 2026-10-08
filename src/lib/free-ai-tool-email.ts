// Delivery email for the Free AI Tools giveaway pages (/giveaways/free-ai-<tool>).
//
// Pretty-light letter format on purpose (same reasoning as the Token Diet
// email in /api/lead-magnet): Georgia serif, styled text links, no buttons, no
// shaded boxes, no attachments, and a plain-text part. That shape reached Gmail
// Primary on a cold inbox; the old purple-button shape went to spam.
//
// Content is the batch's setup-notes.md (via src/lib/free-ai-tools.ts), so the
// email says exactly what the page says.

import { getFreeAiTool } from './free-ai-tools'
import { withUtm } from './utm'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://workshop.mastermindshq.business'

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildFreeAiToolEmail({
  source,
  unsubscribeFooter,
  unsubscribeUrl,
}: {
  source: string
  unsubscribeFooter: string
  unsubscribeUrl: string | null
}) {
  const tool = getFreeAiTool(source)
  const pageUrl = withUtm(`${SITE_URL}/giveaways/${tool.slug}`, { campaign: 'lead-magnet', content: `${tool.slug}-page` })
  const mhqUrl = withUtm('https://mastermindshq.business', { campaign: 'lead-magnet', content: tool.slug })
  const linkStyle = 'color:#6f5cc4;font-weight:bold;'
  const itemStyle = 'margin:0 0 10px;padding-left:14px;border-left:2px solid #d9d2ee;color:#3a3550;'
  const labelStyle = 'color:#8B79D4;font-weight:bold;'

  const subject = `Your ${tool.name} setup notes`

  const html = `
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:#2a2536;max-width:560px;">
        <p>Hi,</p>
        <p>Here&rsquo;s the link you asked for: <a href="${esc(tool.toolUrl)}" style="${linkStyle}">${esc(tool.name)}</a>.</p>
        <p>${esc(tool.intro)}</p>
        <p style="color:#6a6480;">Set it up in 3 steps:</p>
        ${tool.steps.map((s, i) => `<p style="${itemStyle}"><span style="${labelStyle}">${i + 1}.</span> ${esc(s)}</p>`).join('\n        ')}
        <p style="color:#6a6480;margin-top:18px;">How I&rsquo;d use it:</p>
        ${tool.howIUse.map((s) => `<p style="${itemStyle}">${esc(s)}</p>`).join('\n        ')}
        <p style="margin-top:18px;"><span style="${labelStyle}">Good to know.</span> ${esc(tool.goodToKnow)}</p>
        <p style="color:#6a6480;">Links:</p>
        ${tool.links.map((l) => `<p style="margin:0 0 6px;"><a href="${esc(l.url)}" style="${linkStyle}">${esc(l.label)}</a></p>`).join('\n        ')}
        <p style="margin-top:16px;">My setup notes stay open here too: <a href="${pageUrl}" style="${linkStyle}">${esc(tool.name)} setup page</a>.</p>
        <p>If you want help putting tools like this to work in your business, that is what we do every week at <a href="${mhqUrl}" style="${linkStyle}">Masterminds HQ</a>.</p>
        <p>Enjoy it. Reply and tell me what you used it for first.</p>
        <p style="margin-top:20px;">Joe</p>
        ${unsubscribeFooter}
      </div>
    `

  const text = [
    'Hi,',
    '',
    `Here's the link you asked for: ${tool.toolUrl}`,
    '',
    tool.intro,
    '',
    'Set it up in 3 steps:',
    ...tool.steps.map((s, i) => `${i + 1}. ${s}`),
    '',
    "How I'd use it:",
    ...tool.howIUse.map((s) => `- ${s}`),
    '',
    `Good to know: ${tool.goodToKnow}`,
    '',
    'Links:',
    ...tool.links.map((l) => `- ${l.label}: ${l.url}`),
    '',
    `My setup notes stay open here too: ${pageUrl}`,
    '',
    `If you want help putting tools like this to work in your business, that is what we do every week at Masterminds HQ (${mhqUrl}).`,
    '',
    'Enjoy it. Reply and tell me what you used it for first.',
    '',
    'Joe',
    '',
    unsubscribeUrl ? `Sent by Masterminds HQ. Unsubscribe any time: ${unsubscribeUrl}` : 'Sent by Masterminds HQ.',
  ].join('\n')

  return { subject, html, text }
}
