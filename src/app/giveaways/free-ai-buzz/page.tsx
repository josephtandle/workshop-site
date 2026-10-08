'use client'

import FreeAiToolPage from '@/components/giveaways/FreeAiToolPage'
import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'
import { getFreeAiTool } from '@/lib/free-ai-tools'

const TOOL = getFreeAiTool('free-ai-buzz')

// Free AI Tools batch, keyword CALLS. Copy lives in src/lib/free-ai-tools.ts.
export default function FreeAiBuzzPage() {
  return (
    <>
      <FreeAiToolPage tool={TOOL} />
      <GiveawayAutoModal
        slug="free-ai-buzz"
        headingOverride="Want my Buzz setup notes in your inbox?"
      />
    </>
  )
}
