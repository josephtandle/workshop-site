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

type CheckoutSessionLike = { id: string; status: string | null }
export type CheckoutSessionsApi = {
  retrieve(id: string): Promise<CheckoutSessionLike>
  expire(id: string): Promise<CheckoutSessionLike>
}

/**
 * A guest who starts a checkout, leaves, and comes back used to hit "You already
 * have a checkout in progress" until Stripe's expiry webhook freed the seat
 * (Jasmine Oh, 2026-10-02; several other guests before her signed up under a
 * second email or gave up). The earlier Checkout Session is still attached to
 * their held seat, so settle it instead of blocking:
 *   - already paid  -> confirm the seat (the webhook may simply be late)
 *   - still open    -> expire it (Stripe guarantees it can no longer be paid),
 *                      release the hold, and claim a fresh seat
 *   - expired       -> release the hold and claim a fresh seat
 */
export async function settleAttachedCheckout(
  event: EventDefinition,
  attendeeEmail: string,
  claim: EventSeatClaim,
  sessions: CheckoutSessionsApi,
): Promise<EventSeatClaim> {
  if (claim.status !== 'held' || !claim.checkoutSessionId) return claim
  const sessionId = claim.checkoutSessionId

  let session = await sessions.retrieve(sessionId)
  if (session.status === 'open') {
    try {
      session = await sessions.expire(sessionId)
    } catch {
      // It may have completed between retrieve and expire; re-read and decide.
      session = await sessions.retrieve(sessionId)
    }
  }

  if (session.status === 'complete') {
    await confirmEventSeat(claim.reservationId, sessionId)
    return { ...claim, status: 'confirmed' }
  }
  if (session.status !== 'expired') {
    throw new Error(`Checkout ${sessionId} is still ${session.status}; cannot start another one.`)
  }

  await releaseEventSeatByCheckout(sessionId)
  return claimEventSeat(event, attendeeEmail)
}
