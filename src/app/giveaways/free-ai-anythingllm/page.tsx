'use client'

import FreeAiToolPage from '@/components/giveaways/FreeAiToolPage'
import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'
import { getFreeAiTool } from '@/lib/free-ai-tools'

const TOOL = getFreeAiTool('free-ai-anythingllm')

// Free AI Tools batch, keyword BRAIN. Copy lives in src/lib/free-ai-tools.ts.
export default function FreeAiAnythingllmPage() {
  return (
    <>
      <FreeAiToolPage tool={TOOL} />
      <GiveawayAutoModal
        slug="free-ai-anythingllm"
        headingOverride="Want my AnythingLLM setup notes in your inbox?"
      />
    </>
  )
}
