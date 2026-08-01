import { randomUUID } from 'crypto'
import { supabase } from '@/lib/supabase'
import { generateToken } from '@/lib/event-tokens'
import { getEventBySlug, type EventDefinition } from '@/lib/events'

export type Registration = {
  id: string
  event_slug: string
  attendee_name: string
  attendee_email: string
  acquisition_ref: string
  stripe_session_id: string | null
  amount_paid: number
  cancel_token: string
  status: 'confirmed' | 'cancelled'
  registered_at: string
  cancelled_at: string | null
  whatsapp_number: string | null
  business_context: string | null
}

export type RegistrationIntake = {
  whatsappNumber: string | null
  businessContext: string | null
}

export type WaitlistEntry = {
  id: string
  event_slug: string
  name: string
  email: string
  remove_token: string
  status: 'active' | 'removed' | 'converted'
  added_at: string
}

/**
 * Persist the intake answers before checkout starts.
 *
 * Deliberately written ahead of the Stripe redirect: Stripe metadata values cap
 * at 500 characters, so a business description with links cannot safely ride
 * along with the session. Doing it here also keeps the answers from people who
 * open checkout and never pay.
 */
export async function saveRegistrationIntake(input: {
  eventSlug: string
  attendeeName: string
  attendeeEmail: string
  whatsappNumber?: string | null
  businessContext?: string | null
  acquisitionRef?: string
}): Promise<void> {
  const { error } = await supabase.from('event_registration_intake').upsert(
    {
      event_slug: input.eventSlug,
      attendee_name: input.attendeeName,
      attendee_email: input.attendeeEmail.trim().toLowerCase(),
      whatsapp_number: input.whatsappNumber?.trim() || null,
      business_context: input.businessContext?.trim() || null,
      acquisition_ref: input.acquisitionRef?.trim().toLowerCase() || 'joe-che',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'event_slug,attendee_email' },
  )

  if (error) {
    // Deliberately throws. This runs BEFORE the Stripe redirect, so failing
    // here costs nothing but a retry, whereas swallowing it loses the answers
    // and nobody finds out until someone reads an empty table. That is exactly
    // how the 42P10 conflict-target bug survived its first live checkout.
    console.error('saveRegistrationIntake upsert error', error)
    throw new Error('Failed to save registration intake.')
  }
}

export async function getRegistrationIntake(
  eventSlug: string,
  email: string,
): Promise<RegistrationIntake | null> {
  const { data, error } = await supabase
    .from('event_registration_intake')
    .select('whatsapp_number, business_context')
    .eq('event_slug', eventSlug)
    .eq('attendee_email', email.trim().toLowerCase())
    .maybeSingle()

  if (error) {
    console.error('getRegistrationIntake error', error)
    return null
  }

  if (!data) return null

  return {
    whatsappNumber: data.whatsapp_number ?? null,
    businessContext: data.business_context ?? null,
  }
}

export async function saveRegistration(input: {
  eventSlug: string
  attendeeName: string
  attendeeEmail: string
  acquisitionRef?: string
  stripeSessionId?: string
  amountPaid?: number
  whatsappNumber?: string | null
  businessContext?: string | null
}): Promise<{ id: string; cancelToken: string }> {
  // Pre-generate UUID so the cancel token can be derived in a single insert — no two-step update.
  const id = randomUUID()
  const cancelToken = generateToken(`cancel:${id}`)
  const acquisitionRef = input.acquisitionRef?.trim().toLowerCase() || 'joe-che'

  // On the paid path the caller only has what Stripe gave back, so recover the
  // intake answers that were stored before the redirect. Skipped entirely for
  // events that do not collect intake, which is most of them.
  let whatsappNumber = input.whatsappNumber?.trim() || null
  let businessContext = input.businessContext?.trim() || null
  const collectsIntake = Boolean(getEventBySlug(input.eventSlug)?.intakeFields)
  if (collectsIntake && !whatsappNumber && !businessContext) {
    const intake = await getRegistrationIntake(input.eventSlug, input.attendeeEmail)
    whatsappNumber = intake?.whatsappNumber ?? null
    businessContext = intake?.businessContext ?? null

    // The intake row is written before checkout, so by now it must exist. If it
    // does not, the registration is about to be saved with the answers missing
    // and we want that in the logs rather than discovered weeks later.
    if (!whatsappNumber && !businessContext) {
      console.error(
        `saveRegistration: no intake row for ${input.eventSlug} / ${input.attendeeEmail}; ` +
          'registration will be saved without WhatsApp or business context.',
      )
    }
  }

  const { error } = await supabase
    .from('event_registrations')
    .insert({
      id,
      event_slug: input.eventSlug,
      attendee_name: input.attendeeName,
      attendee_email: input.attendeeEmail.trim().toLowerCase(),
      acquisition_ref: acquisitionRef,
      stripe_session_id: input.stripeSessionId ?? null,
      amount_paid: input.amountPaid ?? 0,
      cancel_token: cancelToken,
      status: 'confirmed',
      whatsapp_number: whatsappNumber,
      business_context: businessContext,
    })

  if (error) {
    // Unique constraint violation — already registered
    if (error.code === '23505') {
      throw new Error('This email address is already registered for this event.')
    }
    console.error('saveRegistration insert error', error)
    throw new Error('Failed to save registration.')
  }

  return { id, cancelToken }
}

export async function isAlreadyRegistered(eventSlug: string, email: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('event_slug', eventSlug)
    .eq('attendee_email', email.trim().toLowerCase())
    .eq('status', 'confirmed')

  if (error) {
    console.error('isAlreadyRegistered error', error)
    return false
  }

  return (count ?? 0) > 0
}

export async function isAlreadyOnWaitlist(eventSlug: string, email: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('event_waitlist')
    .select('*', { count: 'exact', head: true })
    .eq('event_slug', eventSlug)
    .eq('email', email.trim().toLowerCase())
    .eq('status', 'active')

  if (error) {
    console.error('isAlreadyOnWaitlist error', error)
    return false
  }

  return (count ?? 0) > 0
}

export async function cancelRegistration(cancelToken: string): Promise<{
  eventSlug: string
  attendeeName: string
  attendeeEmail: string
  wasAlreadyCancelled: boolean
}> {
  const { data: reg, error: findError } = await supabase
    .from('event_registrations')
    .select('id, event_slug, attendee_name, attendee_email, status')
    .eq('cancel_token', cancelToken)
    .single()

  if (findError || !reg) {
    console.error('cancelRegistration find error', findError)
    throw new Error('Registration not found.')
  }

  if (reg.status === 'cancelled') {
    return {
      eventSlug: reg.event_slug,
      attendeeName: reg.attendee_name,
      attendeeEmail: reg.attendee_email,
      wasAlreadyCancelled: true,
    }
  }

  const { error: updateError } = await supabase
    .from('event_registrations')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq('id', reg.id)

  if (updateError) {
    console.error('cancelRegistration update error', updateError)
    throw new Error('Failed to cancel registration.')
  }

  return {
    eventSlug: reg.event_slug,
    attendeeName: reg.attendee_name,
    attendeeEmail: reg.attendee_email,
    wasAlreadyCancelled: false,
  }
}

export async function getConfirmedCount(eventSlug: string): Promise<number> {
  const { count, error } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('event_slug', eventSlug)
    .eq('status', 'confirmed')

  if (error) {
    console.error('getConfirmedCount error', error)
    return 0
  }

  return count ?? 0
}

export async function getConfirmedRegistrationsForEvent(
  eventSlug: string,
): Promise<Array<{ attendeeName: string; attendeeEmail: string }>> {
  const { data, error } = await supabase
    .from('event_registrations')
    .select('attendee_name, attendee_email')
    .eq('event_slug', eventSlug)
    .eq('status', 'confirmed')

  if (error) {
    console.error('getConfirmedRegistrationsForEvent error', error)
    return []
  }

  return (data ?? []).map((row) => ({
    attendeeName: row.attendee_name,
    attendeeEmail: row.attendee_email,
  }))
}

export async function addToWaitlist(input: {
  eventSlug: string
  name: string
  email: string
}): Promise<{ id: string; removeToken: string }> {
  const id = randomUUID()
  const normalizedEmail = input.email.trim().toLowerCase()
  const removeToken = generateToken(`waitlist:${id}`)

  const { error } = await supabase
    .from('event_waitlist')
    .insert({
      id,
      event_slug: input.eventSlug,
      name: input.name,
      email: normalizedEmail,
      remove_token: removeToken,
      status: 'active',
    })

  if (error) {
    if (error.code === '23505') {
      throw new Error('This email address is already on the waitlist for this event.')
    }
    console.error('addToWaitlist insert error', error)
    throw new Error('Failed to add to waitlist.')
  }

  return { id, removeToken }
}

export async function removeFromWaitlist(removeToken: string): Promise<void> {
  const { data: entry, error: findError } = await supabase
    .from('event_waitlist')
    .select('id, status')
    .eq('remove_token', removeToken)
    .single()

  if (findError || !entry) {
    console.error('removeFromWaitlist find error', findError)
    throw new Error('Waitlist entry not found.')
  }

  if (entry.status !== 'active') {
    return
  }

  const { error: updateError } = await supabase
    .from('event_waitlist')
    .update({ status: 'removed' })
    .eq('id', entry.id)

  if (updateError) {
    console.error('removeFromWaitlist update error', updateError)
    throw new Error('Failed to remove from waitlist.')
  }
}

export async function getActiveWaitlist(
  eventSlug: string,
): Promise<Array<{ name: string; email: string; removeToken: string }>> {
  const { data, error } = await supabase
    .from('event_waitlist')
    .select('name, email, remove_token')
    .eq('event_slug', eventSlug)
    .eq('status', 'active')
    .order('added_at', { ascending: true })

  if (error) {
    console.error('getActiveWaitlist error', error)
    return []
  }

  return (data ?? []).map((row) => ({
    name: row.name,
    email: row.email,
    removeToken: row.remove_token,
  }))
}

export async function hasOpenSpots(event: EventDefinition): Promise<boolean> {
  if (event.capacity === undefined) return true
  const count = await getConfirmedCount(event.slug)
  return count < event.capacity
}
