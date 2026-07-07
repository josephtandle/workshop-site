# Stripe Trial Mechanics

## Conclusion

The confirmed implementation is a single Stripe Checkout Session with `mode: "subscription"` containing both:

- a one-time $1 price line item
- a recurring $20/month price line item

The Checkout Session also includes `subscription_data.trial_period_days: 7` and `payment_method_collection: "always"`.

This shape was accepted by the Stripe API in test mode on 2026-07-07 using `STRIPE_TEST_SECRET_KEY`. It was verified against Stripe API versions `2024-12-18.acacia` and `2026-04-22.dahlia`. The returned session had `livemode: false`, `mode: "subscription"`, two line items, `amount_total: 100`, and the recurring $20/month line item had `amount_total: 0` during the trial.

## Verified Session Shape

```json
{
  "livemode": false,
  "mode": "subscription",
  "amount_total": 100,
  "payment_status": "unpaid",
  "status": "open",
  "line_items_count": 2,
  "line_items": [
    {
      "unit_amount": 100,
      "recurring": null,
      "amount_total": 100
    },
    {
      "unit_amount": 2000,
      "recurring": {
        "interval": "month",
        "interval_count": 1
      },
      "amount_total": 0
    }
  ]
}
```

## Why This Approach

Stripe Checkout supports mixed one-time and recurring prices in subscription mode. The one-time price is placed on the initial invoice only, while the recurring price becomes the subscription item. With the 7-day trial applied, Checkout still immediately collects the $1 one-time amount and starts the subscription trial for the $20/month item.

No fallback PaymentIntent, separate payment-mode Checkout Session, invoice item, or Subscription Schedule is needed.
