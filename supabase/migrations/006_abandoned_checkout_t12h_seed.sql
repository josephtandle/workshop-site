INSERT INTO event_automation_controls (automation_key, mode, test_recipients)
VALUES (
  'abandoned_checkout_t12h',
  'off',
  '["newyork1@gmail.com","joe@mastermindshq.business"]'::jsonb
)
ON CONFLICT (automation_key) DO NOTHING;
