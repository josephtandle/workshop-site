import { NextResponse } from 'next/server'
import { getEventBySlug, resolvePromoCode } from '@/lib/events'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const { ok: rateLimitOk } = await checkRateLimit(`validate-promo:${getClientIp(request)}`, 30, 60)
    if (!rateLimitOk) {
      return NextResponse.json({ valid: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 })
    }

    const body = await request.json()
    const slug = typeof body.slug === 'string' ? body.slug : ''
    const promoCode = typeof body.promoCode === 'string' ? body.promoCode.trim() : ''

    if (!slug || !promoCode) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (promoCode.length > 64) {
      return NextResponse.json({ valid: false, error: 'Promo code not recognized.' }, { status: 404 })
    }

    const event = getEventBySlug(slug)
    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    }

    const promo = resolvePromoCode(event, promoCode)
    if (!promo) {
      return NextResponse.json({ valid: false, error: 'Promo code not recognized.' }, { status: 404 })
    }

    const amount = promo.amountOff
      ? Math.max(0, event.pricing.fullPrice - promo.amountOff)
      : promo.percentOff
        ? Math.max(0, event.pricing.fullPrice * (1 - promo.percentOff / 100))
        : event.pricing.fullPrice

    return NextResponse.json({
      valid: true,
      appliedPromoCode: promo.code,
      amount,
      message: amount === 0 ? 'Promo code applied. This ticket is free.' : 'Promo code applied.',
    })
  } catch (error) {
    console.error('event validate promo error', error)
    return NextResponse.json({ error: 'Unable to validate promo code.' }, { status: 500 })
  }
}
