'use client'

import FreeAiToolPage from '@/components/giveaways/FreeAiToolPage'
import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'
import { getFreeAiTool } from '@/lib/free-ai-tools'

const TOOL = getFreeAiTool('free-ai-handy')

// Free AI Tools batch, keyword HANDY. Copy lives in src/lib/free-ai-tools.ts.
export default function FreeAiHandyPage() {
  return (
    <>
      <FreeAiToolPage tool={TOOL} />
      <GiveawayAutoModal
        slug="free-ai-handy"
        headingOverride="Want my Handy setup notes in your inbox?"
      />
    </>
  )
}
