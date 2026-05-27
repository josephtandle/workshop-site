import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY
const SOURCE_FILE = '/Users/myos/.myos/workspace/agents/events-manager/data/checkout-attempt-suppressions.json'

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.')
  process.exit(1)
}

if (!fs.existsSync(SOURCE_FILE)) {
  console.error(`Suppression source file not found: ${SOURCE_FILE}`)
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY)

async function main() {
  const raw = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf8'))
  const emailEntries = Object.entries(raw.emails || {})
    .map(([email, reason]) => ({
      email: String(email).trim().toLowerCase(),
      reason: String(reason || 'synced suppression').trim(),
      active: true,
    }))
    .filter((row) => row.email)

  const { data: existing, error: existingError } = await supabase
    .from('event_checkout_followup_suppressions')
    .select('id, email, event_slug')

  if (existingError) throw existingError

  const globalExisting = new Map(
    (existing || [])
      .filter((row) => !row.event_slug)
      .map((row) => [String(row.email || '').trim().toLowerCase(), row.id]),
  )

  let inserted = 0
  let updated = 0

  for (const row of emailEntries) {
    const existingId = globalExisting.get(row.email)
    if (existingId) {
      const { error } = await supabase
        .from('event_checkout_followup_suppressions')
        .update({
          reason: row.reason,
          active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingId)
      if (error) throw error
      updated += 1
      continue
    }

    const { error } = await supabase.from('event_checkout_followup_suppressions').insert({
      email: row.email,
      reason: row.reason,
      active: true,
    })
    if (error) throw error
    inserted += 1
  }

  console.log(JSON.stringify({
    source: path.basename(SOURCE_FILE),
    inserted,
    updated,
    total: emailEntries.length,
  }, null, 2))
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
