import { NextResponse } from 'next/server'
import { getEventBySlug } from '@/lib/events'
import { isValidEmail } from '@/lib/email-validation'
import { isValidAiLevel, validateBusinessContext } from '@/lib/event-intake'
import { verifyRegistrationProfileToken } from '@/lib/registration-profile-token'
import { saveRegistrationProfile } from '@/lib/event-registration-db'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
  }
  const { slug, email, profileToken, aiLevel, businessContext } = body as Record<string, unknown>
  if (typeof slug !== 'string' || typeof email !== 'string' || email.length > 256 ||
      !isValidEmail(email.trim()) || typeof profileToken !== 'string' ||
      (aiLevel !== undefined && !isValidAiLevel(aiLevel)) ||
      (businessContext !== undefined && typeof businessContext !== 'string')) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
  }
  const event = getEventBySlug(slug)
  if (!event?.intakeFields?.aiLevelStep || event.pricing.fullPrice !== 0 || event.pricing.donationMode) {
    return NextResponse.json({ error: 'Profile questions are not enabled for this event.' }, { status: 400 })
  }
  const context = typeof businessContext === 'string' ? businessContext.trim() : ''
  if (context) {
    const contextError = event.intakeFields.businessContext
      ? validateBusinessContext(context, event.intakeFields.businessContextMinLength)
      : 'This event does not collect a task.'
    if (contextError) return NextResponse.json({ error: contextError }, { status: 400 })
  }
  try {
    const normalizedEmail = email.trim().toLowerCase()
    if (!verifyRegistrationProfileToken(slug, normalizedEmail, profileToken)) {
      return NextResponse.json({ error: 'Invalid profile token.' }, { status: 401 })
    }
    const saved = await saveRegistrationProfile({
      eventSlug: slug,
      attendeeEmail: normalizedEmail,
      aiLevel,
      businessContext: context || undefined,
    })
    if (!saved) return NextResponse.json({ error: 'Confirmed registration not found.' }, { status: 404 })
    return NextResponse.json({ saved: true })
  } catch {
    return NextResponse.json({ error: 'Your registration is saved, but these answers could not be saved. Please retry or skip.' }, { status: 500 })
  }
}
