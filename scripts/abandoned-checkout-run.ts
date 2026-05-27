import {
  ABANDONED_CHECKOUT_DAY1_AUTOMATION_KEY,
  ABANDONED_CHECKOUT_T12H_AUTOMATION_KEY,
  runAbandonedCheckoutFollowups,
  type CheckoutFollowupAutomationKey,
} from '../src/lib/abandoned-checkout-followups'

type Command = 'preview' | 'live-once'

function usage() {
  console.error(
    [
      'Usage:',
      '  npx tsx scripts/abandoned-checkout-run.ts preview [--workflow day1|t12h] [--event <slug>]...',
      '  npx tsx scripts/abandoned-checkout-run.ts live-once [--workflow day1|t12h] --confirm-live [--event <slug>]...',
    ].join('\n'),
  )
  process.exit(1)
}

function parseArgs(argv: string[]) {
  const [command, ...rest] = argv
  if (command !== 'preview' && command !== 'live-once') usage()

  const eventSlugs: string[] = []
  let confirmLive = false
  let automationKey: CheckoutFollowupAutomationKey = ABANDONED_CHECKOUT_DAY1_AUTOMATION_KEY

  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i]
    if (arg === '--workflow') {
      const workflow = rest[i + 1]
      if (workflow === 'day1') automationKey = ABANDONED_CHECKOUT_DAY1_AUTOMATION_KEY
      else if (workflow === 't12h') automationKey = ABANDONED_CHECKOUT_T12H_AUTOMATION_KEY
      else usage()
      i += 1
      continue
    }

    if (arg === '--event') {
      const slug = rest[i + 1]
      if (!slug) usage()
      eventSlugs.push(slug)
      i += 1
      continue
    }

    if (arg === '--confirm-live') {
      confirmLive = true
      continue
    }

    usage()
  }

  return {
    command: command as Command,
    automationKey,
    eventSlugs,
    confirmLive,
  }
}

async function main() {
  const { command, automationKey, eventSlugs, confirmLive } = parseArgs(process.argv.slice(2))
  const now = new Date()
  const filter = eventSlugs.length ? new Set(eventSlugs) : undefined

  const preview = await runAbandonedCheckoutFollowups(now, automationKey, 'off', filter)

  if (command === 'preview') {
    console.log(JSON.stringify({ command, automationKey, now: now.toISOString(), preview }, null, 2))
    return
  }

  if (!confirmLive) {
    console.error('Refusing to send live follow-ups without --confirm-live.')
    console.log(JSON.stringify({ command, automationKey, now: now.toISOString(), preview }, null, 2))
    process.exit(1)
  }

  const live = await runAbandonedCheckoutFollowups(now, automationKey, 'live', filter)
  console.log(JSON.stringify({ command, automationKey, now: now.toISOString(), preview, live }, null, 2))
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
