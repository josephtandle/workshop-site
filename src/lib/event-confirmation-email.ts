import type { EventDefinition } from '@/lib/events'
import { buildLocationReminderIdempotencyKey, hasLocationRevealWindowClosed } from './location-reminder'
import {
  buildSessionReminderIdempotencyKey,
  type SessionReminderWindowLabel,
} from './session-reminder'
import { buildGoogleCalendarUrl, buildIcalString } from './calendar'
import { buildUnsubscribeHeaders, buildUnsubscribeUrl } from './list-unsubscribe'
import { isSuppressed } from './email-suppressions'
import { withUtm } from './utm'

const RESEND_API_KEY = process.env.RESEND_API_KEY

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://workshop.mastermindshq.business').replace(/\/+$/g, '')
}

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || ''
}

function formatLeadHours(leadHours: number) {
  if (leadHours === 24) return 'the day'
  return `${leadHours} hour${leadHours === 1 ? '' : 's'}`
}

function buildAiContentCreationSetupEmailHtml(attendeeName: string) {
  const firstName = getFirstName(attendeeName)
  const workshopAddress =
    'Happy Days Villa 1, Jalan Pura Gede Batur, Pererenan, Mengwi, Kabupaten Badung, Bali 80351'
  const workshopMapsUrl = 'https://maps.app.goo.gl/auASnDX9wmS96a1n9'

  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f2ff; margin: 0; padding: 32px 16px; color: #1a1a1a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 80px rgba(26, 14, 56, 0.12); border: 1px solid rgba(139, 121, 212, 0.12);">
        <div style="background: linear-gradient(135deg, #110f17 0%, #1a1526 55%, #8B79D4 100%); padding: 36px 32px 32px;">
          <p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #cfc7ee;">Workshop Setup</p>
          <h1 style="margin: 0; font-size: 34px; line-height: 1.02; font-weight: 800; color: #ffffff;">${firstName ? `${firstName}, ` : ''}get set up for Saturday</h1>
          <p style="margin: 18px 0 0; font-size: 17px; line-height: 1.7; color: rgba(252,244,235,0.84);">Hey ${firstName || 'there'},</p>
        </div>

        <div style="padding: 30px 32px 24px;">
          <div style="margin: 0 0 24px; padding: 20px; border-radius: 16px; background: #fbf9ff; border: 1px solid rgba(139, 121, 212, 0.14);">
            <h2 style="margin: 0 0 10px; font-size: 20px; color: #16121f;">Location</h2>
            <p style="margin: 0 0 10px; font-size: 15px; line-height: 1.75; color: #4b4263;"><strong style="color:#16121f;">Happy Days Villa 1</strong><br>${workshopAddress}</p>
            <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #4b4263;"><a href="${workshopMapsUrl}" style="color:#8B79D4; font-weight:700; text-decoration:none;">Open Google Maps</a></p>
          </div>

          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">We are getting really excited for this Saturday's <strong style="color:#16121f;">AI Content Creation Lab</strong> in Pererenan, and we have a lot of fun stuff planned for the day.</p>
          <p style="margin: 0 0 22px; font-size: 15px; line-height: 1.75; color: #4b4263;">To make sure we can spend the day creating instead of troubleshooting accounts, please take 10-15 minutes beforehand to get set up on the platforms we will be using.</p>
          <p style="margin: 0 0 22px; font-size: 15px; line-height: 1.75; color: #4b4263;"><strong style="color:#16121f;">Please arrive on time.</strong> We are starting at 10:30 AM sharp and want everyone ready to create from the beginning.</p>

          <div style="margin: 24px 0; padding: 20px; border-radius: 16px; background: #fbf9ff; border: 1px solid rgba(139, 121, 212, 0.14);">
            <h2 style="margin: 0 0 8px; font-size: 20px; color: #16121f;">Higgsfield</h2>
            <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.65; color: #4b4263;">AI images and video.</p>
            <p style="margin: 0 0 10px; font-size: 14px; line-height: 1.65; color: #4b4263;">We recommend starting with either Basic ($5) if you just want to experiment, or Plus ($49) if you think you will be generating a lot of video. You can always scale up later.</p>
            <a href="https://higgsfield.ai/" style="color:#8B79D4; font-weight:700; text-decoration:none;">Open Higgsfield</a>
          </div>

          <div style="margin: 24px 0; padding: 20px; border-radius: 16px; background: #fbf9ff; border: 1px solid rgba(139, 121, 212, 0.14);">
            <h2 style="margin: 0 0 8px; font-size: 20px; color: #16121f;">HeyGen</h2>
            <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.65; color: #4b4263;">AI avatars, digital clones, and talking-head content.</p>
            <p style="margin: 0 0 10px; font-size: 14px; line-height: 1.65; color: #4b4263;">The free tier is fine to start. If you want access to voice cloning and more avatar features, the Creator plan ($29) is the best place to begin.</p>
            <a href="https://www.heygen.com/" style="color:#8B79D4; font-weight:700; text-decoration:none;">Open HeyGen</a>
          </div>

          <div style="margin: 24px 0; padding: 20px; border-radius: 16px; background: #fbf9ff; border: 1px solid rgba(139, 121, 212, 0.14);">
            <h2 style="margin: 0 0 8px; font-size: 20px; color: #16121f;">CapCut</h2>
            <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.65; color: #4b4263;">Editing, captions, pacing, and assembly.</p>
            <p style="margin: 0 0 10px; font-size: 14px; line-height: 1.65; color: #4b4263;">No paid plan needed. Just make sure you have signed up and downloaded it before class.</p>
            <a href="https://www.capcut.com/" style="color:#8B79D4; font-weight:700; text-decoration:none;">Open CapCut</a>
          </div>

          <div style="margin: 28px 0 18px;">
            <a href="https://forms.gle/7YKYqJcznbf6U8U19" style="display:inline-block; background:#8B79D4; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:12px; font-size:16px; font-weight:700; box-shadow:0 14px 32px rgba(139,121,212,0.24);">Fill out the workshop form</a>
          </div>

          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">This part is important. We will review these beforehand so we can tailor the workshop around what you actually want to create, whether that is personal branding, AI influencers, ads, social content, avatars, products, storytelling, or creator workflows.</p>
          <p style="margin: 0 0 22px; font-size: 15px; line-height: 1.75; color: #4b4263;">The more thoughtful your answers are, the more useful and personalized the day will feel.</p>

          <div style="margin: 28px 0 18px;">
            <a href="https://chat.whatsapp.com/HRpALDP0o3AE3dJDEMwhvW?s=cl&amp;p=i&amp;mlu=4" style="display:inline-block; background:#16121f; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:12px; font-size:16px; font-weight:700;">Join the WhatsApp group</a>
          </div>

          <div style="margin: 26px 0; padding: 20px; border-radius: 16px; background: #fff8fb; border: 1px solid rgba(245, 195, 198, 0.42);">
            <h2 style="margin: 0 0 10px; font-size: 20px; color: #16121f;">Workshop details</h2>
            <p style="margin: 0; font-size: 15px; line-height: 1.8; color: #4b4263;"><strong>Saturday, May 30</strong><br>10:30 AM - 5:00 PM</p>
            <p style="margin: 16px 0 0; font-size: 15px; line-height: 1.8; color: #4b4263;">We will break for lunch around 1:30 PM.</p>
          </div>

          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;"><strong style="color:#16121f;">Please note:</strong> we will not be providing food or drinks other than water, so please plan accordingly and bring or order whatever you need for the day.</p>
          <p style="margin: 0 0 10px; font-size: 15px; line-height: 1.75; color: #4b4263;"><strong style="color:#16121f;">Bring:</strong></p>
          <ul style="margin: 0 0 24px 20px; padding: 0; color: #4b4263; font-size: 15px; line-height: 1.75;">
            <li>Laptop + charger</li>
            <li>Headphones if you have them</li>
            <li>An idea, business, brand, or creator concept you would like to explore</li>
          </ul>

          <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #4b4263;">Looking forward to building some amazing content with you all.<br><br>Helix &amp; Joe</p>
        </div>
      </div>
    </div>
  `
}

export function buildAskAnAiExpertWelcomeEmailHtml(event: EventDefinition, attendeeName: string, attendeeEmail: string) {
  const firstName = getFirstName(attendeeName)
  const zoomLink = event.zoomLink ?? 'ZOOM_LINK_TBD'
  const siteUrl = getSiteUrl()
  const eventUrl = withUtm(`${siteUrl}/events/${event.slug}`, {
    campaign: 'ask-an-ai-expert-welcome',
    content: event.slug,
  })
  const cfg = event.emailConfig
  const signatureName = cfg?.signatureName ?? 'Joe Che\nMasterminds HQ'
  const signatureHtml = signatureName.split('\n').join('<br>')
  const calendarLine = event.calendarEvent
    ? `<p style="margin: 0 0 10px; font-size: 15px; line-height: 1.75; color: #4b4263;"><strong>Date:</strong> ${event.dateLabel}<br><strong>Time:</strong> ${event.timeLabel}</p>`
    : ''
  const unsubscribeUrl = buildUnsubscribeUrl(attendeeEmail)

  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f2ff; margin: 0; padding: 32px 16px; color: #1a1a1a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 80px rgba(26, 14, 56, 0.12); border: 1px solid rgba(139, 121, 212, 0.12);">
        <div style="background: linear-gradient(135deg, #110f17 0%, #1a1526 55%, #8B79D4 100%); padding: 36px 32px 32px;">
          <p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #cfc7ee;">Free Live Workshop</p>
          <h1 style="margin: 0; font-size: 34px; line-height: 1.02; font-weight: 800; color: #ffffff;">${firstName ? `${firstName}, ` : ''}you are in</h1>
          <p style="margin: 18px 0 0; font-size: 17px; line-height: 1.7; color: rgba(252,244,235,0.84);">Hey ${firstName || 'there'}, your free spot for <strong style="color:#ffffff;">${event.title}</strong> is confirmed.</p>
        </div>

        <div style="padding: 30px 32px 24px;">
          <div style="margin: 0 0 24px; padding: 20px; border-radius: 16px; background: #fbf9ff; border: 1px solid rgba(139, 121, 212, 0.14);">
            <h2 style="margin: 0 0 10px; font-size: 20px; color: #16121f;">Event Details</h2>
            ${calendarLine}
            <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #4b4263;"><strong>Format:</strong> Free online workshop</p>
          </div>

          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">Join live on Zoom using the link below. Bring your business and your questions, and I will answer them live.</p>

          <div style="margin: 28px 0 18px;">
            <a href="${zoomLink}" style="display:inline-block; background:#8B79D4; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:12px; font-size:16px; font-weight:700; box-shadow:0 14px 32px rgba(139,121,212,0.24);">Open Zoom link</a>
          </div>

          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">If the button does not open cleanly, use this link instead:</p>
          <p style="margin: 0 0 22px; font-size: 15px; line-height: 1.75; color: #4b4263;"><a href="${zoomLink}" style="color:#8B79D4; font-weight:700; text-decoration:none;">${zoomLink}</a></p>

          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">The session runs for 90 minutes of core teaching plus a 30 minute bonus hot-seat round for anyone who wants to stay on.</p>

          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">You can revisit the event page here: <a href="${eventUrl}" style="color:#8B79D4; font-weight:700; text-decoration:none;">${event.title}</a></p>
        </div>

        ${unsubscribeUrl
          ? `<div style="padding: 20px 32px 0; border-top: 1px solid rgba(139, 121, 212, 0.10); margin-top: 8px;">
          <p style="margin: 0; font-size: 13px; color: #9e93be;">
            <a href="${unsubscribeUrl}" style="color:#9e93be; text-decoration:underline;">Unsubscribe from marketing emails</a>
          </p>
        </div>`
          : ''}

        <div style="padding: 20px 32px 30px;">
          <p style="margin: 0; font-size: 14px; line-height: 1.75; color: #7a7291;">${signatureHtml}</p>
        </div>
      </div>
    </div>
  `
}

function buildSessionReminderEmailHtml(
  event: EventDefinition,
  attendeeName: string,
  windowLabel: SessionReminderWindowLabel,
) {
  const firstName = getFirstName(attendeeName)
  const zoomLink = event.zoomLink ?? 'ZOOM_LINK_TBD'
  const sessionStart = `${event.dateLabel} at ${event.timeLabel}`
  const leadCopy = windowLabel === 't24h' ? 'in 24 hours' : 'in 2 hours'
  const subjectLine = windowLabel === 't24h' ? '24 hour reminder' : '2 hour reminder'

  return {
    subject: `${subjectLine}: ${event.title}`,
    html: `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f2ff; margin: 0; padding: 32px 16px; color: #1a1a1a;">
        <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 80px rgba(26, 14, 56, 0.12); border: 1px solid rgba(139, 121, 212, 0.12);">
          <div style="background: linear-gradient(135deg, #110f17 0%, #1a1526 55%, #8B79D4 100%); padding: 36px 32px 32px;">
            <p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #cfc7ee;">Free Live Workshop</p>
            <h1 style="margin: 0; font-size: 34px; line-height: 1.02; font-weight: 800; color: #ffffff;">${subjectLine}</h1>
            <p style="margin: 18px 0 0; font-size: 17px; line-height: 1.7; color: rgba(252,244,235,0.84);">Hi ${firstName || 'there'}, your session starts ${leadCopy}.</p>
          </div>

          <div style="padding: 30px 32px 24px;">
            <div style="margin: 0 0 24px; padding: 20px; border-radius: 16px; background: #fbf9ff; border: 1px solid rgba(139, 121, 212, 0.14);">
              <h2 style="margin: 0 0 10px; font-size: 20px; color: #16121f;">Event Details</h2>
              <p style="margin: 0 0 10px; font-size: 15px; line-height: 1.75; color: #4b4263;"><strong>Date:</strong> ${event.dateLabel}</p>
              <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #4b4263;"><strong>Time:</strong> ${event.timeLabel}</p>
            </div>

            <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">Join live on Zoom when it is time.</p>

            <div style="margin: 28px 0 18px;">
              <a href="${zoomLink}" style="display:inline-block; background:#8B79D4; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:12px; font-size:16px; font-weight:700; box-shadow:0 14px 32px rgba(139,121,212,0.24);">Open Zoom link</a>
            </div>

            <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">If the button does not open cleanly, use this link instead:</p>
            <p style="margin: 0 0 0; font-size: 15px; line-height: 1.75; color: #4b4263;"><a href="${zoomLink}" style="color:#8B79D4; font-weight:700; text-decoration:none;">${zoomLink}</a></p>
          </div>
        </div>
      </div>
    `,
  }
}

/**
 * Who to contact about the event. Derived from the event's first host so a new
 * workshop cannot inherit a previous host's name and phone number.
 *
 * There is deliberately NO fallback phone number. A wrong number is worse than
 * no number, so when none is configured the contact block is omitted entirely.
 * A hardcoded default here once shipped Helix's personal number on a Joe Che
 * workshop confirmation.
 */
function resolveHostContact(event: EventDefinition) {
  const cfg = event.emailConfig
  const host = event.hosts?.[0]
  const contactName = cfg?.contactName ?? host?.firstName ?? host?.name ?? null
  const contactWhatsAppLink = cfg?.contactWhatsAppLink ?? null
  const contactWhatsAppDisplay = cfg?.contactWhatsAppDisplay ?? null
  const canContact = Boolean(contactName && contactWhatsAppLink && contactWhatsAppDisplay)
  const contactBlockHtml = canContact
    ? `<div style="border: 1px solid rgba(139, 121, 212, 0.16); border-radius: 18px; padding: 20px 22px; margin-bottom: 24px; background: #faf8ff;">
            <p style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #16121f;">Questions before the event?</p>
            <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #4b4263;">
              Message ${contactName} at
              <a href="${contactWhatsAppLink}" style="color:#8B79D4; font-weight:700; text-decoration:none;">${contactWhatsAppDisplay}</a>.
            </p>
          </div>`
    : ''
  return { contactName, contactWhatsAppLink, contactWhatsAppDisplay, contactBlockHtml }
}

export function buildConfirmationEmailHtml(event: EventDefinition, attendeeName: string, cancelToken?: string, now: Date = new Date()) {
  const siteUrl = getSiteUrl()
  const location = event.privateLocationReminder
  const revealLocationNow =
    Boolean(location) &&
    hasLocationRevealWindowClosed({
      eventStartIso: location!.eventStartIso,
      leadHours: location!.leadHours,
      now,
    })
  const setupUrl = `${siteUrl}/events/${event.slug}/setup`
  const eventUrl = `${siteUrl}/events/${event.slug}`

  const cfg = event.emailConfig
  const { contactBlockHtml } = resolveHostContact(event)
  const detailsLabel = cfg?.detailsLabel ?? 'Workshop Details'
  const signatureName = cfg?.signatureName ?? 'Joe Che\nMasterminds HQ'
  const signatureHtml = signatureName.split('\n').join('<br>')
  // The generic confirmation never carried the Zoom link, only the bespoke
  // ask-an-ai-expert template did. Every online event's checkout note promises
  // "the Zoom link will be emailed right after you sign up", so an online event
  // on this template was shipping a broken promise.
  const zoomBlockHtml = event.zoomLink
    ? `<div style="border: 1px solid rgba(139, 121, 212, 0.16); border-radius: 18px; background: #faf8ff; padding: 22px 24px; margin-bottom: 24px;">
            <p style="margin: 0 0 14px; font-size: 12px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #8B79D4;">Join Link</p>
            <a href="${event.zoomLink}" style="display:inline-block; background:#8B79D4; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:12px; font-size:16px; font-weight:700; box-shadow:0 14px 32px rgba(139,121,212,0.24);">Open Zoom link</a>
            <p style="margin: 14px 0 0; font-size: 14px; line-height: 1.7; color: #4b4263;">Or paste this in: <a href="${event.zoomLink}" style="color:#8B79D4; font-weight:700; text-decoration:none;">${event.zoomLink}</a></p>
          </div>`
    : ''
  const primarySetup = event.postPurchase?.setupItems?.[0]
  const secondarySetup = event.postPurchase?.setupItems?.[1]
  // Only offer setup instructions when the event actually has any. The old
  // opt-out flag meant every event without postPurchase still shipped an
  // "Open setup instructions" button pointing at an empty page.
  const skipSetup = cfg?.skipSetupInstructions === true || !event.postPurchase?.setupItems?.length

  const headerLabelHtml =
    cfg && 'headerLabel' in cfg && (cfg.headerLabel === null || cfg.headerLabel === '')
      ? ''
      : `<p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #cfc7ee;">${cfg?.headerLabel ?? 'Masterminds HQ Workshop'}</p>`

  const calendarButtonsHtml = event.calendarEvent
    ? (() => {
        const googleUrl = buildGoogleCalendarUrl({
          title: event.title,
          startIso: event.calendarEvent!.startIso,
          endIso: event.calendarEvent!.endIso,
          location: event.locationLabel,
          description: event.privateLocationReminder
            ? 'Exact address will be emailed to you before the event.'
            : undefined,
        })
        const icalUrl = `${siteUrl}/api/events/${event.slug}/calendar`
        // No flexbox here. Gmail and Outlook strip `display:flex`, so the old
        // `gap:10px` never applied and the two buttons rendered touching.
        // Spacing has to live on the elements themselves via margin.
        const calendarButtonStyle =
          'display:inline-block; background: transparent; color: #8B79D4; border: 1.5px solid #8B79D4; text-decoration:none; padding:10px 18px; border-radius:10px; font-size:13px; font-weight:700; white-space:nowrap;'
        return `<div style="margin: 20px 0 24px;">
          <a href="${googleUrl}" style="${calendarButtonStyle} margin: 0 16px 10px 0;">
            Add to Google Calendar
          </a>
          <a href="${icalUrl}" style="${calendarButtonStyle} margin: 0 0 10px 0;">
            Download iCal
          </a>
        </div>`
      })()
    : ''

  // An event with a privateLocationReminder is deliberately withholding its
  // venue until the reveal window. A maps button pointing at that venue hands
  // it over anyway, one click from the confirmation email, which defeats the
  // whole point of holding it back.
  const locationIsStillPrivate = Boolean(location) && !revealLocationNow

  const mapsButtonHtml =
    cfg?.mapsUrl && !locationIsStillPrivate
      ? `<div style="margin-top: 16px;">
        <a href="${cfg.mapsUrl}" style="display:inline-block; background:#8B79D4; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:10px; font-size:14px; font-weight:700; box-shadow:0 8px 20px rgba(139,121,212,0.22);">
          Open Google Maps
        </a>
      </div>`
      : ''

  // While the venue is private the details box drops its Location row entirely.
  // Nothing is lost: the paragraph below already names the area and says when
  // the exact address arrives.
  const locationRowHtml = locationIsStillPrivate
    ? ''
    : `<p style="margin: 0${mapsButtonHtml ? ' 0 10px' : ''}; font-size: 15px; line-height: 1.7; color: #2d2442;"><strong>Location:</strong> ${event.locationLabel}</p>
            ${mapsButtonHtml}`

  const cancelHtml = cancelToken
    ? `<div style="padding: 20px 32px 0; border-top: 1px solid rgba(139, 121, 212, 0.10); margin-top: 8px;">
        <p style="margin: 0; font-size: 13px; color: #9e93be;">
          <a href="${siteUrl}/api/events/cancel?token=${cancelToken}" style="color:#9e93be; text-decoration:underline;">Can't make it? Cancel your seat.</a>
        </p>
      </div>`
    : ''

  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f2ff; margin: 0; padding: 32px 16px; color: #1a1a1a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 80px rgba(26, 14, 56, 0.12); border: 1px solid rgba(139, 121, 212, 0.12);">
        <div style="background: linear-gradient(135deg, #110f17 0%, #1a1526 55%, #8B79D4 100%); padding: 36px 32px 32px;">
          ${headerLabelHtml}
          <h1 style="margin: 0; font-size: 34px; line-height: 1.02; font-weight: 800; color: #ffffff;">
            Your seat is reserved.
          </h1>
          <p style="margin: 18px 0 0; font-size: 17px; line-height: 1.7; color: rgba(252,244,235,0.84);">
            ${attendeeName ? `Hi ${attendeeName.split(' ')[0]},` : 'Hi,'} you are confirmed for <strong style="color:#ffffff;">${event.title}</strong>.
          </p>
        </div>

        <div style="padding: 30px 32px 10px;">
          <div style="border: 1px solid rgba(139, 121, 212, 0.16); border-radius: 18px; background: #faf8ff; padding: 22px 24px; margin-bottom: 24px;">
            <p style="margin: 0 0 14px; font-size: 12px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #8B79D4;">${detailsLabel}</p>
            <p style="margin: 0 0 10px; font-size: 15px; line-height: 1.7; color: #2d2442;"><strong>Date:</strong> ${event.dateLabel}</p>
            <p style="margin: 0 0 10px; font-size: 15px; line-height: 1.7; color: #2d2442;"><strong>Time:</strong> ${event.timeLabel}</p>
            ${locationRowHtml}
          </div>

          ${zoomBlockHtml}

          ${calendarButtonsHtml}

          ${
            location && revealLocationNow
              ? `<div style="border: 1px solid rgba(139, 121, 212, 0.16); border-radius: 18px; background: #faf8ff; padding: 22px 24px; margin-bottom: 24px;">
            <p style="margin: 0 0 10px; font-size: 12px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #8B79D4;">Exact Address</p>
            <p style="margin: 0 0 14px; font-size: 15px; line-height: 1.7; color: #2d2442;">${location.exactAddress}</p>
            <a href="${location.googleMapsUrl}" style="display:inline-block; background:#8B79D4; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:10px; font-size:14px; font-weight:700; box-shadow:0 8px 20px rgba(139,121,212,0.22);">
              Open Google Maps pin
            </a>
            ${
              location.parkingInstructions?.length
                ? `<ul style="margin: 16px 0 0; padding-left: 20px; color: #4b4263;">
                    ${location.parkingInstructions
                      .map((instruction) => `<li style="margin: 0 0 8px; font-size: 14px; line-height: 1.65;">${instruction}</li>`)
                      .join('')}
                  </ul>`
                : ''
            }
          </div>`
              : location
                ? `<p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">
            The event is in <strong style="color:#16121f;">${event.locationLabel}</strong>. You will receive an email with the exact location ${formatLeadHours(location.leadHours)} before the event.
          </p>`
                : ''
          }

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
              ? `<div style="border: 1px solid rgba(139, 121, 212, 0.16); border-radius: 18px; padding: 20px 22px; margin-bottom: 14px;">
                  <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #8B79D4;">${primarySetup.stepLabel}</p>
                  <p style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #16121f;">Go to <a href="${primarySetup.href}" style="color:#8B79D4; text-decoration:none;">${primarySetup.name}</a> and sign up for an account.</p>
                  <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #4b4263;">${primarySetup.description}</p>
                </div>`
              : ''
          }

          ${
            secondarySetup
              ? `<div style="border: 1px solid rgba(139, 121, 212, 0.16); border-radius: 18px; padding: 20px 22px; margin-bottom: 24px;">
                  <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #8B79D4;">${secondarySetup.stepLabel}</p>
                  <p style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #16121f;">Go to <a href="${secondarySetup.href}" style="color:#8B79D4; text-decoration:none;">${secondarySetup.name}</a> and sign up for a free account.</p>
                  <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #4b4263;">${secondarySetup.description}</p>
                </div>`
              : ''
          }

          <div style="margin: 28px 0 24px;">
            <a href="${setupUrl}" style="display:inline-block; background:#8B79D4; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:12px; font-size:16px; font-weight:700; box-shadow:0 14px 32px rgba(139,121,212,0.24);">
              Open setup instructions
            </a>
          </div>`
          }

          ${contactBlockHtml}

          <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.75; color: #4b4263;">
            If you need to revisit the event page, you can always return here:
            <a href="${eventUrl}" style="color:#8B79D4; font-weight:700; text-decoration:none;">${event.title}</a>
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
  const { contactBlockHtml } = resolveHostContact(event)
  const signatureName = cfg?.signatureName ?? 'Joe Che\nMasterminds HQ'
  const signatureHtml = signatureName.split('\n').join('<br>')
  const firstName = attendeeName.trim().split(/\s+/)[0]

  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f2ff; margin: 0; padding: 32px 16px; color: #1a1a1a;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 80px rgba(26, 14, 56, 0.12); border: 1px solid rgba(139, 121, 212, 0.12);">
        <div style="background: linear-gradient(135deg, #110f17 0%, #1a1526 55%, #8B79D4 100%); padding: 36px 32px 32px;">
          <p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #cfc7ee;">Exact Location</p>
          <h1 style="margin: 0; font-size: 34px; line-height: 1.02; font-weight: 800; color: #ffffff;">
            Your event location is ready.
          </h1>
          <p style="margin: 18px 0 0; font-size: 17px; line-height: 1.7; color: rgba(252,244,235,0.84);">
            ${firstName ? `Hi ${firstName},` : 'Hi,'} here is the exact location for <strong style="color:#ffffff;">${event.title}</strong>.
          </p>
        </div>

        <div style="padding: 30px 32px 10px;">
          <div style="border: 1px solid rgba(139, 121, 212, 0.16); border-radius: 18px; background: #faf8ff; padding: 22px 24px; margin-bottom: 24px;">
            <p style="margin: 0 0 14px; font-size: 12px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #8B79D4;">${detailsLabel}</p>
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
            <a href="${location.googleMapsUrl}" style="display:inline-block; background:#8B79D4; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:12px; font-size:16px; font-weight:700; box-shadow:0 14px 32px rgba(139,121,212,0.24);">
              Open Google Maps pin
            </a>
          </div>

          ${
            location.parkingInstructions?.length
              ? `<div style="border: 1px solid rgba(139, 121, 212, 0.16); border-radius: 18px; padding: 20px 22px; margin-bottom: 24px;">
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

          ${contactBlockHtml}
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

type ResendAttachment = {
  filename: string
  content: string
  content_type: string
}

async function sendResendEmail(input: {
  attendeeEmail: string
  subject: string
  html: string
  idempotencyKey?: string
  attachments?: ResendAttachment[]
  /**
   * Email-level headers (e.g. RFC 8058 List-Unsubscribe / List-Unsubscribe-Post).
   * These become part of the outgoing message the recipient's mail client
   * sees: distinct from the HTTP request headers used to call Resend.
   * Marketing sends only; transactional mail must not set these.
   */
  headers?: Record<string, string>
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
      ...(input.attachments?.length ? { attachments: input.attachments } : {}),
      ...(input.headers ? { headers: input.headers } : {}),
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

export function buildAiContentCreationSetupIdempotencyKey(email: string): string {
  return `ai-content-creation-setup/ai-avatar-content-creation/${email.trim().toLowerCase()}`
}

export function buildAskAnAiExpertWelcomeIdempotencyKey(email: string): string {
  return `ask-an-ai-expert-welcome/${email.trim().toLowerCase()}`
}

export async function sendEventConfirmationEmail(input: {
  event: EventDefinition
  attendeeName: string
  attendeeEmail: string
  cancelToken?: string
  now?: Date
}) {
  const now = input.now ?? new Date()
  const location = input.event.privateLocationReminder
  const revealLocationNow =
    Boolean(location) &&
    hasLocationRevealWindowClosed({
      eventStartIso: location!.eventStartIso,
      leadHours: location!.leadHours,
      now,
    })

  const subject = `Your seat is reserved for ${input.event.title}`
  const html = buildConfirmationEmailHtml(input.event, input.attendeeName, input.cancelToken, now)

  const attachments = input.event.calendarEvent
    ? [
        {
          filename: `${input.event.slug}.ics`,
          content: Buffer.from(
            buildIcalString({
              uid: `${input.event.slug}@mastermindshq.business`,
              title: input.event.title,
              startIso: input.event.calendarEvent.startIso,
              endIso: input.event.calendarEvent.endIso,
              location: revealLocationNow && location ? location.exactAddress : input.event.locationLabel,
              description: location && !revealLocationNow
                ? 'Exact address will be emailed to you before the event.'
                : undefined,
              organizer: { name: 'Joe Che', email: 'joe@mastermindshq.business' },
              attendee: { name: input.attendeeName, email: input.attendeeEmail },
              sequence: 0,
            }),
          ).toString('base64'),
          content_type: 'text/calendar; method=REQUEST',
        },
      ]
    : []

  return sendResendEmail({
    attendeeEmail: input.attendeeEmail,
    subject,
    html,
    idempotencyKey: buildConfirmationIdempotencyKey(input.event.slug, input.attendeeEmail),
    attachments,
  })
}

export async function sendAiContentCreationSetupEmail(input: {
  attendeeName: string
  attendeeEmail: string
}) {
  return sendResendEmail({
    attendeeEmail: input.attendeeEmail,
    subject: 'Before Saturday: AI Content Creation Lab setup',
    html: buildAiContentCreationSetupEmailHtml(input.attendeeName),
    idempotencyKey: buildAiContentCreationSetupIdempotencyKey(input.attendeeEmail),
  })
}

export async function sendAskAnAiExpertWelcomeEmail(input: {
  event: EventDefinition
  attendeeName: string
  attendeeEmail: string
}) {
  const attachments = input.event.calendarEvent
    ? [
        {
          filename: `${input.event.slug}.ics`,
          content: Buffer.from(
            buildIcalString({
              uid: `${input.event.slug}@mastermindshq.business`,
              title: input.event.title,
              startIso: input.event.calendarEvent.startIso,
              endIso: input.event.calendarEvent.endIso,
              location: input.event.locationLabel,
              description: `Join on Zoom: ${input.event.zoomLink ?? 'ZOOM_LINK_TBD'}`,
              organizer: { name: 'Joe Che', email: 'joe@mastermindshq.business' },
              attendee: { name: input.attendeeName, email: input.attendeeEmail },
              sequence: 0,
            }),
          ).toString('base64'),
          content_type: 'text/calendar; method=REQUEST',
        },
      ]
    : []

  // Marketing send: this is the promotional "you're in" welcome for a free
  // workshop signup, not a paid-seat transactional confirmation. Gate it on
  // the global suppression list before sending.
  if (await isSuppressed(input.attendeeEmail)) {
    console.log(`sendAskAnAiExpertWelcomeEmail: skipping suppressed address ${input.attendeeEmail}`)
    return
  }

  return sendResendEmail({
    attendeeEmail: input.attendeeEmail,
    subject: `You're in: ${input.event.title}`,
    html: buildAskAnAiExpertWelcomeEmailHtml(input.event, input.attendeeName, input.attendeeEmail),
    idempotencyKey: buildAskAnAiExpertWelcomeIdempotencyKey(input.attendeeEmail),
    attachments,
    headers: buildUnsubscribeHeaders(input.attendeeEmail),
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

  // SEQUENCE:1 on the same UID causes email clients to update the existing
  // calendar event from the confirmation email rather than creating a duplicate.
  const attachments =
    input.event.calendarEvent
      ? [
          {
            filename: `${input.event.slug}-location.ics`,
            content: Buffer.from(
              buildIcalString({
                uid: `${input.event.slug}@mastermindshq.business`,
                title: input.event.title,
                startIso: input.event.calendarEvent.startIso,
                endIso: input.event.calendarEvent.endIso,
                location: location.exactAddress,
                description: `Full address: ${location.exactAddress}`,
                organizer: { name: 'Joe Che', email: 'joe@mastermindshq.business' },
                attendee: { name: input.attendeeName, email: input.attendeeEmail },
                sequence: 1,
              }),
            ).toString('base64'),
            content_type: 'text/calendar; method=REQUEST',
          },
        ]
      : []

  return sendResendEmail({
    attendeeEmail: input.attendeeEmail,
    subject: `Exact location for ${input.event.title}`,
    html: buildLocationReminderEmailHtml(input.event, input.attendeeName),
    idempotencyKey: buildLocationReminderIdempotencyKey({
      slug: input.event.slug,
      attendeeEmail: input.attendeeEmail,
      eventStartIso: location.eventStartIso,
    }),
    attachments,
  })
}

export async function sendSessionReminderEmail(input: {
  event: EventDefinition
  attendeeName: string
  attendeeEmail: string
  windowLabel: SessionReminderWindowLabel
}) {
  const startIso = input.event.calendarEvent?.startIso
  if (!startIso) {
    throw new Error(`Event ${input.event.slug} is missing calendar event details.`)
  }

  const body = buildSessionReminderEmailHtml(input.event, input.attendeeName, input.windowLabel)

  return sendResendEmail({
    attendeeEmail: input.attendeeEmail,
    subject: body.subject,
    html: body.html,
    idempotencyKey: buildSessionReminderIdempotencyKey({
      slug: input.event.slug,
      attendeeEmail: input.attendeeEmail,
      eventStartIso: startIso,
      windowLabel: input.windowLabel,
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
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 80px rgba(26, 14, 56, 0.12); border: 1px solid rgba(139, 121, 212, 0.12);">
        <div style="background: linear-gradient(135deg, #110f17 0%, #1a1526 55%, #8B79D4 100%); padding: 36px 32px 32px;">
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

        <div style="padding: 0 32px 30px; border-top: 1px solid rgba(139, 121, 212, 0.10);">
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
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 80px rgba(26, 14, 56, 0.12); border: 1px solid rgba(139, 121, 212, 0.12);">
        <div style="background: linear-gradient(135deg, #110f17 0%, #1a1526 55%, #8B79D4 100%); padding: 36px 32px 32px;">
          <h1 style="margin: 0; font-size: 34px; line-height: 1.02; font-weight: 800; color: #ffffff;">
            ${headline}
          </h1>
          <p style="margin: 18px 0 0; font-size: 17px; line-height: 1.7; color: rgba(252,244,235,0.84);">
            ${firstName ? `Hi ${firstName},` : 'Hi,'} ${bodyText}
          </p>
        </div>

        <div style="padding: 30px 32px 10px;">
          <div style="margin-bottom: 24px;">
            <a href="${registerUrl}" style="display:inline-block; background:#8B79D4; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:12px; font-size:16px; font-weight:700; box-shadow:0 14px 32px rgba(139,121,212,0.24);">
              Register now
            </a>
          </div>
        </div>

        <div style="padding: 0 32px 30px; border-top: 1px solid rgba(139, 121, 212, 0.10);">
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
