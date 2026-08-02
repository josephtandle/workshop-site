import assert from 'node:assert/strict'
import test from 'node:test'

import { buildEventCheckoutSessionParams } from '../src/lib/event-checkout'
import { CHECKOUT_BRANDING, MASTERMINDS_LOGO_ABSOLUTE_PNG } from '../src/lib/masterminds-checkout-branding'
import { getEventBySlug } from '../src/lib/events'

const event = getEventBySlug('business-blocks-ai-solved')!

function paramsFor(mode: 'hosted' | 'embedded') {
  return buildEventCheckoutSessionParams({
    event,
    attendeeName: 'Test Person',
    attendeeEmail: 'test@example.com',
    amount: 22,
    promo: null,
    baseUrl: 'https://workshop.mastermindshq.business',
    mode,
  }) as unknown as Record<string, unknown>
}

test('every paid event checkout carries Masterminds branding', () => {
  for (const mode of ['hosted', 'embedded'] as const) {
    const branding = paramsFor(mode).branding_settings
    assert.ok(branding, `${mode} checkout must set branding_settings`)
    assert.equal(branding, CHECKOUT_BRANDING, `${mode} must use the shared constant, not an inline copy`)
  }
})

test('branding values still match the canonical mhq-homepage block', () => {
  // Pinned so drift from masterminds-brand.ts fails here instead of showing up
  // as a wrong-looking checkout page. If mhq-homepage changes, change both.
  assert.deepEqual(CHECKOUT_BRANDING, {
    display_name: 'MastermindsHQ',
    background_color: '#FCF4EB',
    button_color: '#7C69C7',
    font_family: 'inter',
    border_style: 'rounded',
    logo: { type: 'url', url: MASTERMINDS_LOGO_ABSOLUTE_PNG },
    icon: { type: 'url', url: MASTERMINDS_LOGO_ABSOLUTE_PNG },
  })
})

test('the checkout logo is an absolute PNG, since Stripe renders SVG unreliably', () => {
  assert.match(MASTERMINDS_LOGO_ABSOLUTE_PNG, /^https:\/\//)
  assert.match(MASTERMINDS_LOGO_ABSOLUTE_PNG, /\.png$/)
})
