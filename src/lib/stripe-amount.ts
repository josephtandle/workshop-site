export const MIN_STRIPE_USD_CHARGE_CENTS = 50

export function toStripeUnitAmount(amount: number): number | null {
  const unitAmount = Math.round(amount * 100)

  if (unitAmount > 0 && unitAmount < MIN_STRIPE_USD_CHARGE_CENTS) {
    return null
  }

  return unitAmount
}
