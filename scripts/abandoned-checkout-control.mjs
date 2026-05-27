import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY
const AUTOMATION_KEYS = {
  day1: 'abandoned_checkout_day_1',
  t12h: 'abandoned_checkout_t12h',
}
const DEFAULT_TEST_RECIPIENTS = ['newyork1@gmail.com', 'joe@mastermindshq.business']

function usage() {
  console.error(
    [
      'Usage:',
      '  node scripts/abandoned-checkout-control.mjs [--workflow day1|t12h] status',
      '  node scripts/abandoned-checkout-control.mjs [--workflow day1|t12h] set-mode <off|test|live>',
      '  node scripts/abandoned-checkout-control.mjs [--workflow day1|t12h] set-test-recipients <email> [email...]',
    ].join('\n'),
  )
  process.exit(1)
}

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY)

async function getCurrent(automationKey) {
  const { data, error } = await supabase
    .from('event_automation_controls')
    .select('automation_key, mode, test_recipients, updated_at')
    .eq('automation_key', automationKey)
    .maybeSingle()

  if (error) throw error

  return (
      data || {
      automation_key: automationKey,
      mode: 'off',
      test_recipients: DEFAULT_TEST_RECIPIENTS,
      updated_at: null,
    }
  )
}

async function upsert(automationKey, values) {
  const { error } = await supabase.from('event_automation_controls').upsert(
    {
      automation_key: automationKey,
      ...values,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'automation_key' },
  )

  if (error) throw error
}

const rawArgs = process.argv.slice(2)
let workflow = 'day1'
if (rawArgs[0] === '--workflow') {
  workflow = rawArgs[1]
  rawArgs.splice(0, 2)
}
if (!AUTOMATION_KEYS[workflow]) usage()
const AUTOMATION_KEY = AUTOMATION_KEYS[workflow]
const [command, ...args] = rawArgs

if (!command) usage()

try {
  if (command === 'status') {
    console.log(JSON.stringify(await getCurrent(AUTOMATION_KEY), null, 2))
    process.exit(0)
  }

  if (command === 'set-mode') {
    const mode = args[0]
    if (!['off', 'test', 'live'].includes(mode)) usage()
    const current = await getCurrent(AUTOMATION_KEY)
    await upsert(AUTOMATION_KEY, {
      mode,
      test_recipients: current.test_recipients || DEFAULT_TEST_RECIPIENTS,
    })
    console.log(JSON.stringify(await getCurrent(AUTOMATION_KEY), null, 2))
    process.exit(0)
  }

  if (command === 'set-test-recipients') {
    const recipients = Array.from(
      new Set(
        args
          .map((value) => value.trim().toLowerCase())
          .filter(Boolean),
      ),
    )
    await upsert(AUTOMATION_KEY, {
      mode: (await getCurrent(AUTOMATION_KEY)).mode || 'off',
      test_recipients: recipients.length ? recipients : DEFAULT_TEST_RECIPIENTS,
    })
    console.log(JSON.stringify(await getCurrent(AUTOMATION_KEY), null, 2))
    process.exit(0)
  }

  usage()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
