import { type EventDefinition } from '@/lib/events'
import { supabase } from '@/lib/supabase'

type CapacityReservationRow = {
  reservation_id: string
  status: 'held' | 'confirmed'
  expires_at: string | null
  checkout_session_id: string | null
}

export type EventSeatClaim =
  | {
      status: 'held' | 'confirmed'
      reservationId: string
      expiresAt: string | null
      checkoutSessionId?: string
    }
  | { status: 'full' }

export async function claimEventSeat(
  event: EventDefinition,
  attendeeEmail: string,
): Promise<EventSeatClaim> {
  if (event.capacity === undefined || !event.capacityReservation) {
    throw new Error(`Event ${event.slug} does not use capacity reservations.`)
  }

  const { data, error } = await supabase.rpc('claim_event_capacity_seat', {
    p_event_slug: event.slug,
    p_attendee_email: attendeeEmail.trim().toLowerCase(),
    p_capacity: event.capacity,
    p_hold_minutes: event.capacityReservation.holdMinutes,
  })

  if (error) {
    throw new Error(`Unable to reserve a seat: ${error.message}`)
  }

  const row = Array.isArray(data) ? (data[0] as CapacityReservationRow | undefined) : undefined
  if (!row) {
    return { status: 'full' }
  }

  return {
    status: row.status,
    reservationId: row.reservation_id,
    expiresAt: row.expires_at,
    ...(row.checkout_session_id ? { checkoutSessionId: row.checkout_session_id } : {}),
  }
}

export async function confirmEventSeat(
  reservationId: string,
  checkoutSessionId?: string,
): Promise<void> {
  const { data, error } = await supabase.rpc('confirm_event_capacity_seat', {
    p_reservation_id: reservationId,
    p_checkout_session_id: checkoutSessionId ?? null,
  })

  if (error || data !== true) {
    throw new Error(error?.message || 'Unable to confirm the reserved seat.')
  }
}

export async function attachCheckoutToEventSeat(
  reservationId: string,
  checkoutSessionId: string,
): Promise<void> {
  const { data, error } = await supabase.rpc('attach_event_capacity_checkout', {
    p_reservation_id: reservationId,
    p_checkout_session_id: checkoutSessionId,
  })

  if (error || data !== true) {
    throw new Error(error?.message || 'Unable to attach checkout to the reserved seat.')
  }
}

export async function releaseEventSeat(
  reservationId: string,
): Promise<void> {
  const { error } = await supabase.rpc('release_event_capacity_seat', {
    p_reservation_id: reservationId,
  })

  if (error) {
    throw new Error(`Unable to release the reserved seat: ${error.message}`)
  }
}

export async function releaseEventSeatByCheckout(checkoutSessionId: string): Promise<void> {
  const { error } = await supabase.rpc('release_event_capacity_checkout', {
    p_checkout_session_id: checkoutSessionId,
  })

  if (error) {
    throw new Error(`Unable to release the expired checkout seat: ${error.message}`)
  }
}
