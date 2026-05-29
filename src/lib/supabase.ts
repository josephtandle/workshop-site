import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL

export const supabase = createClient(
  supabaseUrl!,
  process.env.SUPABASE_SECRET_KEY!,
)
