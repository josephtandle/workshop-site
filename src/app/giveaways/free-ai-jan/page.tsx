'use client'

import FreeAiToolPage from '@/components/giveaways/FreeAiToolPage'
import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'
import { getFreeAiTool } from '@/lib/free-ai-tools'

const TOOL = getFreeAiTool('free-ai-jan')

// Free AI Tools batch, keyword LOCAL. Copy lives in src/lib/free-ai-tools.ts.
export default function FreeAiJanPage() {
  return (
    <>
      <FreeAiToolPage tool={TOOL} />
      <GiveawayAutoModal
        slug="free-ai-jan"
        headingOverride="Want my Jan setup notes in your inbox?"
      />
    </>
  )
}
