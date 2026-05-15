import { randomUUID } from 'crypto'
import { supabase } from '@/lib/supabase'
import { generateToken } from '@/lib/event-tokens'
import type { EventDefinition } from '@/lib/events'

export type Registration = {
  id: string
  event_slug: string
  attendee_name: string
  attendee_email: string
  stripe_session_id: string | null
  amount_paid: number
  cancel_token: string
  status: 'confirmed' | 'cancelled'
  registered_at: string
  cancelled_at: string | null
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

export async function saveRegistration(input: {
  eventSlug: string
  attendeeName: string
  attendeeEmail: string
  stripeSessionId?: string
  amountPaid?: number
}): Promise<{ id: string; cancelToken: string }> {
  // Pre-generate UUID so the cancel token can be derived in a single insert — no two-step update.
  const id = randomUUID()
  const cancelToken = generateToken(`cancel:${id}`)

  const { error } = await supabase
    .from('event_registrations')
    .insert({
      id,
      event_slug: input.eventSlug,
      attendee_name: input.attendeeName,
      attendee_email: input.attendeeEmail.trim().toLowerCase(),
      stripe_session_id: input.stripeSessionId ?? null,
      amount_paid: input.amountPaid ?? 0,
      cancel_token: cancelToken,
      status: 'confirmed',
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
