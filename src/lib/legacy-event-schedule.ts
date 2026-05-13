import { getEventBySlug, type EventDefinition } from '@/lib/events'
import { createStripeClient } from '@/lib/stripe'

type SyncStatus = 'already_paid' | 'marked_paid' | 'imported'

type SyncLegacyRegistrationInput = {
  event: EventDefinition
  attendeeName: string
  attendeeEmail: string
  amount: number
  status: 'paid'
}

type FinalizeLegacyCheckoutInput = {
  event: EventDefinition
  sessionId: string
}

type LegacySaleRow = {
  name: string
  email: string
  event: string
  eventDate: string
  quantity: number
  amount: number
  paymentMethod: string
  status: string
}

type EventScheduleConfig = {
  baseUrl: string
  email: string
  password: string
}

type EventScheduleSession = {
  csrfToken: string
  cookieHeader: string
}

function getEventScheduleConfig(): EventScheduleConfig | null {
  const email = process.env.EVENTSCHEDULE_ADMIN_EMAIL?.trim()
  const password = process.env.EVENTSCHEDULE_ADMIN_PASSWORD?.trim()

  if (!email || !password) {
    return null
  }

  return {
    baseUrl: (process.env.EVENTSCHEDULE_BASE_URL || 'https://events.mastermindshq.business')
      .trim()
      .replace(/\/+$/g, ''),
    email,
    password,
  }
}

function extractCsrfToken(html: string) {
  const inputMatch = html.match(/name="_token"\s+value="([^"]+)"/)
  if (inputMatch) return inputMatch[1]

  const metaMatch = html.match(/meta name="csrf-token" content="([^"]+)"/)
  if (metaMatch) return metaMatch[1]

  throw new Error('Unable to find Event Schedule CSRF token.')
}

function splitSetCookieHeader(headerValue: string) {
  return headerValue.split(/,(?=\s*[A-Za-z0-9!#$%&'*+.^_`|~-]+=)/g)
}

function collectSetCookies(headers: Headers) {
  const direct = (headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.()
  if (direct?.length) return direct

  const headerValue = headers.get('set-cookie')
  if (!headerValue) return []
  return splitSetCookieHeader(headerValue)
}

function mergeCookieHeader(existingHeader: string, setCookieHeaders: string[]) {
  const jar = new Map<string, string>()

  const appendCookie = (cookie: string) => {
    const [pair] = cookie.split(';', 1)
    const separatorIndex = pair.indexOf('=')
    if (separatorIndex === -1) return
    const name = pair.slice(0, separatorIndex).trim()
    const value = pair.slice(separatorIndex + 1).trim()
    if (!name) return
    jar.set(name, value)
  }

  for (const cookie of existingHeader.split(/;\s*/g)) {
    if (cookie) appendCookie(cookie)
  }

  for (const cookie of setCookieHeaders) {
    appendCookie(cookie)
  }

  return Array.from(jar.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ')
}

async function authenticateEventSchedule(config: EventScheduleConfig): Promise<EventScheduleSession> {
  const loginPage = await fetch(`${config.baseUrl}/login`, {
    headers: {
      accept: 'text/html,application/xhtml+xml',
    },
    cache: 'no-store',
  })

  if (!loginPage.ok) {
    throw new Error(`Event Schedule login page failed: ${loginPage.status}`)
  }

  const loginHtml = await loginPage.text()
  const loginToken = extractCsrfToken(loginHtml)
  let cookieHeader = mergeCookieHeader('', collectSetCookies(loginPage.headers))

  const loginBody = new URLSearchParams({
    _token: loginToken,
    email: config.email,
    password: config.password,
  })

  const loginResponse = await fetch(`${config.baseUrl}/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      cookie: cookieHeader,
      referer: `${config.baseUrl}/login`,
      accept: 'text/html,application/xhtml+xml',
    },
    body: loginBody.toString(),
    redirect: 'manual',
    cache: 'no-store',
  })

  cookieHeader = mergeCookieHeader(cookieHeader, collectSetCookies(loginResponse.headers))

  if (loginResponse.status !== 302 && loginResponse.status !== 303) {
    throw new Error(`Event Schedule login failed: ${loginResponse.status}`)
  }

  const salesPage = await fetch(`${config.baseUrl}/sales`, {
    headers: {
      cookie: cookieHeader,
      accept: 'text/html,application/xhtml+xml',
    },
    cache: 'no-store',
  })

  if (!salesPage.ok) {
    throw new Error(`Event Schedule sales page failed: ${salesPage.status}`)
  }

  const salesHtml = await salesPage.text()

  return {
    csrfToken: extractCsrfToken(salesHtml),
    cookieHeader,
  }
}

function parseCsvLine(line: string) {
  const cells: string[] = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      cells.push(current)
      current = ''
      continue
    }

    current += char
  }

  cells.push(current)
  return cells
}

function parseLegacySalesCsv(csvText: string) {
  const lines = csvText.replace(/^\uFEFF/, '').split(/\r?\n/g).filter(Boolean)
  if (lines.length <= 1) return []

  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line)
    return {
      name: cells[0] || '',
      email: cells[1] || '',
      event: cells[3] || '',
      eventDate: cells[4] || '',
      quantity: Number(cells[7] || 0),
      amount: Number(cells[8] || 0),
      paymentMethod: cells[13] || '',
      status: (cells[14] || '').toLowerCase(),
    } satisfies LegacySaleRow
  })
}

function amountsMatch(a: number, b: number) {
  return Math.abs(a - b) < 0.01
}

async function listLegacySalesForEmail(
  config: EventScheduleConfig,
  session: EventScheduleSession,
  attendeeEmail: string,
) {
  const response = await fetch(
    `${config.baseUrl}/sales/export?filter=${encodeURIComponent(attendeeEmail)}`,
    {
      headers: {
        cookie: session.cookieHeader,
        accept: 'text/csv,text/plain,*/*',
      },
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    throw new Error(`Unable to export Event Schedule sales: ${response.status}`)
  }

  return parseLegacySalesCsv(await response.text())
}

async function findLegacySaleId(
  config: EventScheduleConfig,
  session: EventScheduleSession,
  attendeeEmail: string,
) {
  const response = await fetch(
    `${config.baseUrl}/sales?filter=${encodeURIComponent(attendeeEmail)}`,
    {
      headers: {
        cookie: session.cookieHeader,
        accept: 'text/html,application/xhtml+xml',
      },
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    throw new Error(`Unable to fetch Event Schedule sales table: ${response.status}`)
  }

  const html = await response.text()
  const match = html.match(/data-sale-id="([^"]+)"/)
  return match?.[1] ?? null
}

async function markLegacySalePaid(
  config: EventScheduleConfig,
  session: EventScheduleSession,
  saleId: string,
) {
  const response = await fetch(`${config.baseUrl}/sales/action/${saleId}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-csrf-token': session.csrfToken,
      'x-requested-with': 'XMLHttpRequest',
      cookie: session.cookieHeader,
      accept: 'application/json',
    },
    body: JSON.stringify({ action: 'mark_paid' }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Unable to mark Event Schedule sale paid: ${response.status}`)
  }
}

async function seedLegacySaleViaPublicCheckout(
  config: EventScheduleConfig,
  input: SyncLegacyRegistrationInput,
) {
  const legacyRegistration = input.event.legacyRegistration
  if (!legacyRegistration) {
    throw new Error(`Event ${input.event.slug} is missing legacy registration configuration.`)
  }

  const pageResponse = await fetch(
    `${config.baseUrl}/masterminds-workshops/${input.event.slug}`,
    {
      headers: {
        accept: 'text/html,application/xhtml+xml',
      },
      cache: 'no-store',
    },
  )

  if (!pageResponse.ok) {
    throw new Error(`Unable to load legacy event checkout page: ${pageResponse.status}`)
  }

  const pageHtml = await pageResponse.text()
  const csrfToken = extractCsrfToken(pageHtml)
  const cookieHeader = mergeCookieHeader('', collectSetCookies(pageResponse.headers))

  const form = new URLSearchParams({
    _token: csrfToken,
    event_id: legacyRegistration.eventId,
    event_date: legacyRegistration.eventDate,
    subdomain: 'masterminds-workshops',
    name: input.attendeeName,
    email: input.attendeeEmail,
    phone: '',
    [`tickets[${legacyRegistration.fallbackTicketId}]`]: '1',
  })

  const response = await fetch(`${config.baseUrl}/masterminds-workshops/checkout`, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      cookie: cookieHeader,
      referer: `${config.baseUrl}/masterminds-workshops/${input.event.slug}`,
      accept: 'text/html,application/xhtml+xml',
    },
    body: form.toString(),
    redirect: 'manual',
    cache: 'no-store',
  })

  if (response.status !== 302 && response.status !== 303) {
    throw new Error(`Unable to seed Event Schedule sale via checkout: ${response.status}`)
  }
}

export async function syncLegacyRegistration(
  input: SyncLegacyRegistrationInput,
): Promise<{ status: SyncStatus; message: string }> {
  if (!input.event.legacyRegistration) {
    return {
      status: 'imported',
      message: 'Legacy registration disabled for this event.',
    }
  }

  const config = getEventScheduleConfig()
  if (!config) {
    throw new Error('Event Schedule credentials are not configured.')
  }

  const session = await authenticateEventSchedule(config)
  const matchingSales = (await listLegacySalesForEmail(config, session, input.attendeeEmail)).filter(
    (sale) =>
      sale.email.toLowerCase() === input.attendeeEmail.toLowerCase() &&
      sale.event === input.event.title &&
      sale.eventDate === input.event.legacyRegistration?.eventDate,
  )

  const paidSale = matchingSales.find((sale) => sale.status === 'paid')
  if (paidSale) {
    return {
      status: 'already_paid',
      message: 'Legacy attendee already recorded as paid.',
    }
  }

  const unpaidSale = matchingSales.find(
    (sale) => sale.status === 'unpaid' && amountsMatch(sale.amount, input.amount),
  )

  if (unpaidSale) {
    const saleId = await findLegacySaleId(config, session, input.attendeeEmail)
    if (saleId) {
      await markLegacySalePaid(config, session, saleId)
      return {
        status: 'marked_paid',
        message: 'Existing legacy attendee was marked paid.',
      }
    }
  }

  await seedLegacySaleViaPublicCheckout(config, input)

  const refreshedSales = (await listLegacySalesForEmail(config, session, input.attendeeEmail)).filter(
    (sale) =>
      sale.email.toLowerCase() === input.attendeeEmail.toLowerCase() &&
      sale.event === input.event.title &&
      sale.eventDate === input.event.legacyRegistration?.eventDate &&
      sale.status === 'unpaid',
  )

  if (!refreshedSales.length) {
    throw new Error('Legacy checkout did not create a visible unpaid sale.')
  }

  const nextUnpaidSale =
    refreshedSales.find((sale) => amountsMatch(sale.amount, input.amount)) ?? refreshedSales[0]
  const saleId = await findLegacySaleId(config, session, input.attendeeEmail)
  if (!saleId) {
    throw new Error('Unable to locate the legacy sale after checkout seeding.')
  }

  await markLegacySalePaid(config, session, saleId)

  return {
    status: 'marked_paid',
    message: `Legacy attendee created and marked paid${nextUnpaidSale.amount ? '.' : ' (seeded from checkout row).'}`,
  }
}

export async function finalizeLegacyCheckoutSession(
  input: FinalizeLegacyCheckoutInput,
): Promise<{ status: SyncStatus; message: string }> {
  const stripe = createStripeClient()
  const session = await stripe.checkout.sessions.retrieve(input.sessionId, {
    expand: ['payment_intent'],
  })

  if (session.metadata?.event_slug !== input.event.slug) {
    throw new Error('Checkout session event mismatch.')
  }

  if (session.payment_status !== 'paid') {
    throw new Error('Checkout session is not paid yet.')
  }

  const paymentIntent =
    typeof session.payment_intent === 'string' ? null : session.payment_intent

  if (paymentIntent?.metadata?.legacy_sync_status === 'complete') {
    return {
      status: 'already_paid',
      message: 'Legacy attendee already synced.',
    }
  }

  const attendeeName = session.metadata?.attendee_name?.trim()
  const attendeeEmail = session.metadata?.attendee_email?.trim() || session.customer_email?.trim()

  if (!attendeeName || !attendeeEmail) {
    throw new Error('Checkout session is missing attendee details.')
  }

  const status = await syncLegacyRegistration({
    event: input.event,
    attendeeName,
    attendeeEmail,
    amount: (session.amount_total ?? 0) / 100,
    status: 'paid',
  })

  if (paymentIntent?.id) {
    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: {
        ...paymentIntent.metadata,
        legacy_sync_status: 'complete',
      },
    })
  }

  return status
}

export function getLegacyEventBySlug(slug: string) {
  return getEventBySlug(slug)
}
