'use client'

import FreeAiToolPage from '@/components/giveaways/FreeAiToolPage'
import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'
import { getFreeAiTool } from '@/lib/free-ai-tools'

const TOOL = getFreeAiTool('free-ai-excalidraw')

// Free AI Tools batch, keyword DRAW. Copy lives in src/lib/free-ai-tools.ts.
export default function FreeAiExcalidrawPage() {
  return (
    <>
      <FreeAiToolPage tool={TOOL} />
      <GiveawayAutoModal
        slug="free-ai-excalidraw"
        headingOverride="Want my Excalidraw setup notes in your inbox?"
      />
    </>
  )
}
