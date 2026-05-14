import type { EventDefinition } from '@/lib/events'
import { buildLocationReminderIdempotencyKey } from './location-reminder'

const RESEND_API_KEY = process.env.RESEND_API_KEY

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://workshop.mastermindshq.business').replace(/\/+$/g, '')
}

function buildConfirmationEmailHtml(event: EventDefinition, attendeeName: string, cancelToken?: string) {
  const siteUrl = getSiteUrl()
  const setupUrl = `${siteUrl}/events/${event.slug}/setup`
  const eventUrl = `${siteUrl}/events/${event.slug}`

  const cfg = event.emailConfig
  const contactName = cfg?.contactName ?? 'Helix'
  const contactWhatsAppLink = cfg?.contactWhatsAppLink ?? 'https://wa.me/13233773154'
  const contactWhatsAppDisplay = cfg?.contactWhatsAppDisplay ?? '+1 (323) 377-3154'
  const detailsLabel = cfg?.detailsLabel ?? 'Workshop Details'
  const signatureName = cfg?.signatureName ?? 'Joe Che\nMasterminds HQ'
  const signatureHtml = signatureName.split('\n').join('<br>')
  const primarySetup = event.postPurchase?.setupItems?.[0]
  const secondarySetup = event.postPurchase?.setupItems?.[1]
  const skipSetup = cfg?.skipSetupInstructions === true

  const headerLabelHtml =
    cfg && 'headerLabel' in cfg && (cfg.headerLabel === null || cfg.headerLabel === '')
      ? ''
      : `<p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #cfc7ee;">${cfg?.headerLabel ?? 'Masterminds HQ Workshop'}</p>`

  const mapsButtonHtml = cfg?.mapsUrl
    ? `<div style="margin-top: 16px;">
        <a href="${cfg.mapsUrl}" style="display:inline-block; background:#7C69C7; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:10px; font-size:14px; font-weight:700; box-shadow:0 8px 20px rgba(124,105,199,0.22);">
          Open Google Maps
        </a>
      </div>`
    : ''

  const cancelHtml = cancelToken
    ? `<div style="padding: 20px 32px 0; border-top: 1px solid rgba(124, 105, 199, 0.10); margin-top: 8px;">
        <p style="margin: 0; font-size: 13px; color: #9e93be;">
          <a href="${siteUrl}/api/events/cancel?token=${cancelToken}" style="color:#9e93be; text-decoration:underline;">Can't make it? Cancel your seat.</a>
        </p>
      </div>`
    : ''

  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f2ff; margin: 0; padding: 32px 16px; color: #1a1a1a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 80px rgba(26, 14, 56, 0.12); border: 1px solid rgba(124, 105, 199, 0.12);">
        <div style="background: linear-gradient(135deg, #110f17 0%, #1a1526 55%, #7C69C7 100%); padding: 36px 32px 32px;">
          ${headerLabelHtml}
          <h1 style="margin: 0; font-size: 34px; line-height: 1.02; font-weight: 800; color: #ffffff;">
            Your seat is reserved.
          </h1>
          <p style="margin: 18px 0 0; font-size: 17px; line-height: 1.7; color: rgba(252,244,235,0.84);">
            ${attendeeName ? `Hi ${attendeeName.split(' ')[0]},` : 'Hi,'} you are confirmed for <strong style="color:#ffffff;">${event.title}</strong>.
          </p>
        </div>

        <div style="padding: 30px 32px 10px;">
          <div style="border: 1px solid rgba(124, 105, 199, 0.16); border-radius: 18px; background: #faf8ff; padding: 22px 24px; margin-bottom: 24px;">
            <p style="margin: 0 0 14px; font-size: 12px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #7C69C7;">${detailsLabel}</p>
            <p style="margin: 0 0 10px; font-size: 15px; line-height: 1.7; color: #2d2442;"><strong>Date:</strong> ${event.dateLabel}</p>
            <p style="margin: 0 0 10px; font-size: 15px; line-height: 1.7; color: #2d2442;"><strong>Time:</strong> ${event.timeLabel}</p>
            <p style="margin: 0${mapsButtonHtml ? ' 0 10px' : ''}; font-size: 15px; line-height: 1.7; color: #2d2442;"><strong>Location:</strong> ${event.locationLabel}</p>
            ${mapsButtonHtml}
          </div>

          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">
            The event is in <strong style="color:#16121f;">Pererenan, Canggu</strong>. You will receive an email with the exact location four hours before the event.
          </p>

          ${
            skipSetup
              ? ''
              : `<h2 style="margin: 0 0 12px; font-size: 24px; line-height: 1.15; font-weight: 800; color: #16121f;">
            What to do next
          </h2>
          <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.75; color: #4b4263;">
            Before the event, here are the steps we need you to take to get the most out of the event:
          </p>

          ${
            primarySetup
              ? `<div style="border: 1px solid rgba(124, 105, 199, 0.16); border-radius: 18px; padding: 20px 22px; margin-bottom: 14px;">
                  <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #7C69C7;">${primarySetup.stepLabel}</p>
                  <p style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #16121f;">Go to <a href="${primarySetup.href}" style="color:#7C69C7; text-decoration:none;">${primarySetup.name}</a> and sign up for an account.</p>
                  <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #4b4263;">${primarySetup.description}</p>
                </div>`
              : ''
          }

          ${
            secondarySetup
              ? `<div style="border: 1px solid rgba(124, 105, 199, 0.16); border-radius: 18px; padding: 20px 22px; margin-bottom: 24px;">
                  <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #7C69C7;">${secondarySetup.stepLabel}</p>
                  <p style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #16121f;">Go to <a href="${secondarySetup.href}" style="color:#7C69C7; text-decoration:none;">${secondarySetup.name}</a> and sign up for a free account.</p>
                  <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #4b4263;">${secondarySetup.description}</p>
                </div>`
              : ''
          }

          <div style="margin: 28px 0 24px;">
            <a href="${setupUrl}" style="display:inline-block; background:#7C69C7; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:12px; font-size:16px; font-weight:700; box-shadow:0 14px 32px rgba(124,105,199,0.24);">
              Open setup instructions
            </a>
          </div>`
          }

          <div style="border: 1px solid rgba(124, 105, 199, 0.16); border-radius: 18px; padding: 20px 22px; margin-bottom: 24px; background: #faf8ff;">
            <p style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #16121f;">Questions before the event?</p>
            <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #4b4263;">
              Message ${contactName} at
              <a href="${contactWhatsAppLink}" style="color:#7C69C7; font-weight:700; text-decoration:none;">${contactWhatsAppDisplay}</a>.
            </p>
          </div>

          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">
            If you need to revisit the event page, you can always return here:
            <a href="${eventUrl}" style="color:#7C69C7; font-weight:700; text-decoration:none;">${event.title}</a>
          </p>
        </div>

        ${cancelHtml}

        <div style="padding: 20px 32px 30px;">
          <p style="margin: 0; font-size: 14px; line-height: 1.75; color: #7a7291;">
            ${signatureHtml}
          </p>
        </div>
      </div>
    </div>
  `
}

function buildLocationReminderEmailHtml(event: EventDefinition, attendeeName: string) {
  const location = event.privateLocationReminder
  if (!location) {
    throw new Error(`Event ${event.slug} is missing private location reminder details.`)
  }

  const cfg = event.emailConfig
  const detailsLabel = cfg?.detailsLabel ?? 'Workshop Details'
  const contactName = cfg?.contactName ?? 'Helix'
  const contactWhatsAppLink = cfg?.contactWhatsAppLink ?? 'https://wa.me/13233773154'
  const contactWhatsAppDisplay = cfg?.contactWhatsAppDisplay ?? '+1 (323) 377-3154'
  const signatureName = cfg?.signatureName ?? 'Joe Che\nMasterminds HQ'
  const signatureHtml = signatureName.split('\n').join('<br>')
  const firstName = attendeeName.trim().split(/\s+/)[0]

  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f2ff; margin: 0; padding: 32px 16px; color: #1a1a1a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 80px rgba(26, 14, 56, 0.12); border: 1px solid rgba(124, 105, 199, 0.12);">
        <div style="background: linear-gradient(135deg, #110f17 0%, #1a1526 55%, #7C69C7 100%); padding: 36px 32px 32px;">
          <p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #cfc7ee;">Exact Location</p>
          <h1 style="margin: 0; font-size: 34px; line-height: 1.02; font-weight: 800; color: #ffffff;">
            Your event location is ready.
          </h1>
          <p style="margin: 18px 0 0; font-size: 17px; line-height: 1.7; color: rgba(252,244,235,0.84);">
            ${firstName ? `Hi ${firstName},` : 'Hi,'} here is the exact location for <strong style="color:#ffffff;">${event.title}</strong>.
          </p>
        </div>

        <div style="padding: 30px 32px 10px;">
          <div style="border: 1px solid rgba(124, 105, 199, 0.16); border-radius: 18px; background: #faf8ff; padding: 22px 24px; margin-bottom: 24px;">
            <p style="margin: 0 0 14px; font-size: 12px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #7C69C7;">${detailsLabel}</p>
            <p style="margin: 0 0 10px; font-size: 15px; line-height: 1.7; color: #2d2442;"><strong>Date:</strong> ${event.dateLabel}</p>
            <p style="margin: 0 0 10px; font-size: 15px; line-height: 1.7; color: #2d2442;"><strong>Time:</strong> ${event.timeLabel}</p>
            <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #2d2442;"><strong>Area:</strong> ${event.locationLabel}</p>
          </div>

          <h2 style="margin: 0 0 12px; font-size: 24px; line-height: 1.15; font-weight: 800; color: #16121f;">
            Exact address
          </h2>
          <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.75; color: #4b4263;">
            ${location.exactAddress}
          </p>

          <div style="margin: 0 0 24px;">
            <a href="${location.googleMapsUrl}" style="display:inline-block; background:#7C69C7; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:12px; font-size:16px; font-weight:700; box-shadow:0 14px 32px rgba(124,105,199,0.24);">
              Open Google Maps pin
            </a>
          </div>

          ${
            location.parkingInstructions?.length
              ? `<div style="border: 1px solid rgba(124, 105, 199, 0.16); border-radius: 18px; padding: 20px 22px; margin-bottom: 24px;">
                  <p style="margin: 0 0 10px; font-size: 20px; font-weight: 800; color: #16121f;">Parking instructions</p>
                  <ul style="margin: 0; padding-left: 20px; color: #4b4263;">
                    ${location.parkingInstructions
                      .map(
                        (instruction) =>
                          `<li style="margin: 0 0 8px; font-size: 15px; line-height: 1.7;">${instruction}</li>`,
                      )
                      .join('')}
                  </ul>
                </div>`
              : ''
          }

          <div style="border: 1px solid rgba(124, 105, 199, 0.16); border-radius: 18px; padding: 20px 22px; margin-bottom: 24px; background: #faf8ff;">
            <p style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #16121f;">Questions before the event?</p>
            <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #4b4263;">
              Message ${contactName} at
              <a href="${contactWhatsAppLink}" style="color:#7C69C7; font-weight:700; text-decoration:none;">${contactWhatsAppDisplay}</a>.
            </p>
          </div>
        </div>

        <div style="padding: 0 32px 30px;">
          <p style="margin: 0; font-size: 14px; line-height: 1.75; color: #7a7291;">
            ${signatureHtml}
          </p>
        </div>
      </div>
    </div>
  `
}

async function sendResendEmail(input: {
  attendeeEmail: string
  subject: string
  html: string
  idempotencyKey?: string
}) {
  if (!RESEND_API_KEY) {
    throw new Error('Resend API key is not configured.')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
      ...(input.idempotencyKey ? { 'Idempotency-Key': input.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from: 'Joe Che <joe@mastermindshq.business>',
      to: [input.attendeeEmail],
      subject: input.subject,
      html: input.html,
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Resend event confirmation error: ${response.status}${body ? ` ${body}` : ''}`)
  }

  return response.json()
}

export function buildConfirmationIdempotencyKey(slug: string, email: string): string {
  return `confirm/${slug}/${email.trim().toLowerCase()}`
}

export function buildWaitlistJoinIdempotencyKey(slug: string, email: string): string {
  return `waitlist-join/${slug}/${email.trim().toLowerCase()}`
}

export async function sendEventConfirmationEmail(input: {
  event: EventDefinition
  attendeeName: string
  attendeeEmail: string
  cancelToken?: string
}) {
  const subject = `Your seat is reserved for ${input.event.title}`
  const html = buildConfirmationEmailHtml(input.event, input.attendeeName, input.cancelToken)

  return sendResendEmail({
    attendeeEmail: input.attendeeEmail,
    subject,
    html,
    idempotencyKey: buildConfirmationIdempotencyKey(input.event.slug, input.attendeeEmail),
  })
}

export async function sendEventLocationReminderEmail(input: {
  event: EventDefinition
  attendeeName: string
  attendeeEmail: string
}) {
  const location = input.event.privateLocationReminder
  if (!location) {
    throw new Error(`Event ${input.event.slug} is missing private location reminder details.`)
  }

  return sendResendEmail({
    attendeeEmail: input.attendeeEmail,
    subject: `Exact location for ${input.event.title}`,
    html: buildLocationReminderEmailHtml(input.event, input.attendeeName),
    idempotencyKey: buildLocationReminderIdempotencyKey({
      slug: input.event.slug,
      attendeeEmail: input.attendeeEmail,
      eventStartIso: location.eventStartIso,
    }),
  })
}

function buildWaitlistConfirmationHtml(event: EventDefinition, name: string, removeToken: string) {
  const siteUrl = getSiteUrl()
  const removeUrl = `${siteUrl}/api/events/waitlist/remove?token=${removeToken}`
  const firstName = name.trim().split(/\s+/)[0]
  const cfg = event.emailConfig
  const signatureName = cfg?.signatureName ?? 'Joe Che\nMasterminds HQ'
  const signatureHtml = signatureName.split('\n').join('<br>')

  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f2ff; margin: 0; padding: 32px 16px; color: #1a1a1a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 80px rgba(26, 14, 56, 0.12); border: 1px solid rgba(124, 105, 199, 0.12);">
        <div style="background: linear-gradient(135deg, #110f17 0%, #1a1526 55%, #7C69C7 100%); padding: 36px 32px 32px;">
          <h1 style="margin: 0; font-size: 34px; line-height: 1.02; font-weight: 800; color: #ffffff;">
            You are on the waitlist.
          </h1>
          <p style="margin: 18px 0 0; font-size: 17px; line-height: 1.7; color: rgba(252,244,235,0.84);">
            ${firstName ? `Hi ${firstName},` : 'Hi,'} you are on the waitlist for <strong style="color:#ffffff;">${event.title}</strong> on ${event.dateLabel}.
          </p>
        </div>

        <div style="padding: 30px 32px 10px;">
          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">
            We will let you know if a spot opens up. Spots are offered first come, first served.
          </p>
        </div>

        <div style="padding: 0 32px 30px; border-top: 1px solid rgba(124, 105, 199, 0.10);">
          <p style="margin: 20px 0 0; font-size: 13px; color: #9e93be;">
            <a href="${removeUrl}" style="color:#9e93be; text-decoration:underline;">Remove yourself from the waitlist</a>
          </p>
          <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.75; color: #7a7291;">
            ${signatureHtml}
          </p>
        </div>
      </div>
    </div>
  `
}

function buildWaitlistSpotNotificationHtml(
  event: EventDefinition,
  name: string,
  removeToken: string,
  variant: 'cancellation' | 't2h',
) {
  const siteUrl = getSiteUrl()
  const registerUrl = `${siteUrl}/events/${event.slug}#register`
  const removeUrl = `${siteUrl}/api/events/waitlist/remove?token=${removeToken}`
  const firstName = name.trim().split(/\s+/)[0]
  const cfg = event.emailConfig
  const signatureName = cfg?.signatureName ?? 'Joe Che\nMasterminds HQ'
  const signatureHtml = signatureName.split('\n').join('<br>')

  const headline =
    variant === 't2h'
      ? 'Another spot just opened.'
      : 'A spot just opened.'

  const bodyText =
    variant === 't2h'
      ? `Another spot just opened for ${event.title} since you are on the waitlist. Seats are first come, first served.`
      : `A spot has opened for ${event.title} on ${event.dateLabel}. Seats are first come, first served.`

  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f2ff; margin: 0; padding: 32px 16px; color: #1a1a1a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 80px rgba(26, 14, 56, 0.12); border: 1px solid rgba(124, 105, 199, 0.12);">
        <div style="background: linear-gradient(135deg, #110f17 0%, #1a1526 55%, #7C69C7 100%); padding: 36px 32px 32px;">
          <h1 style="margin: 0; font-size: 34px; line-height: 1.02; font-weight: 800; color: #ffffff;">
            ${headline}
          </h1>
          <p style="margin: 18px 0 0; font-size: 17px; line-height: 1.7; color: rgba(252,244,235,0.84);">
            ${firstName ? `Hi ${firstName},` : 'Hi,'} ${bodyText}
          </p>
        </div>

        <div style="padding: 30px 32px 10px;">
          <div style="margin-bottom: 24px;">
            <a href="${registerUrl}" style="display:inline-block; background:#7C69C7; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:12px; font-size:16px; font-weight:700; box-shadow:0 14px 32px rgba(124,105,199,0.24);">
              Register now
            </a>
          </div>
        </div>

        <div style="padding: 0 32px 30px; border-top: 1px solid rgba(124, 105, 199, 0.10);">
          <p style="margin: 20px 0 0; font-size: 13px; color: #9e93be;">
            <a href="${removeUrl}" style="color:#9e93be; text-decoration:underline;">Remove me from the waitlist</a>
          </p>
          <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.75; color: #7a7291;">
            ${signatureHtml}
          </p>
        </div>
      </div>
    </div>
  `
}

export async function sendWaitlistConfirmationEmail(input: {
  event: EventDefinition
  name: string
  email: string
  removeToken: string
}) {
  const subject = `You are on the waitlist for ${input.event.title}`
  const html = buildWaitlistConfirmationHtml(input.event, input.name, input.removeToken)

  return sendResendEmail({
    attendeeEmail: input.email,
    subject,
    html,
    idempotencyKey: buildWaitlistJoinIdempotencyKey(input.event.slug, input.email),
  })
}

export async function sendWaitlistSpotNotificationEmail(input: {
  event: EventDefinition
  name: string
  email: string
  removeToken: string
  variant: 'cancellation' | 't2h'
  idempotencyKey?: string
}) {
  const subject =
    input.variant === 't2h'
      ? `Another spot just opened for ${input.event.title} since you are on the waitlist`
      : `A spot just opened for ${input.event.title}`

  const html = buildWaitlistSpotNotificationHtml(
    input.event,
    input.name,
    input.removeToken,
    input.variant,
  )

  return sendResendEmail({
    attendeeEmail: input.email,
    subject,
    html,
    idempotencyKey: input.idempotencyKey,
  })
}
