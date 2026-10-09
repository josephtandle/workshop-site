'use client'

import FreeAiToolPage from '@/components/giveaways/FreeAiToolPage'
import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'
import { getFreeAiTool } from '@/lib/free-ai-tools'

const TOOL = getFreeAiTool('free-ai-cal-com')

// Free AI Tools batch, keyword SLOTS. Copy lives in src/lib/free-ai-tools.ts.
export default function FreeAiCalComPage() {
  return (
    <>
      <FreeAiToolPage tool={TOOL} />
      <GiveawayAutoModal
        slug="free-ai-cal-com"
        headingOverride="Want my Cal.com setup notes in your inbox?"
      />
    </>
  )
}
