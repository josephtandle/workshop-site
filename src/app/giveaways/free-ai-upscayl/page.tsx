'use client'

import FreeAiToolPage from '@/components/giveaways/FreeAiToolPage'
import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'
import { getFreeAiTool } from '@/lib/free-ai-tools'

const TOOL = getFreeAiTool('free-ai-upscayl')

// Free AI Tools batch, keyword SHARP. Copy lives in src/lib/free-ai-tools.ts.
export default function FreeAiUpscaylPage() {
  return (
    <>
      <FreeAiToolPage tool={TOOL} />
      <GiveawayAutoModal
        slug="free-ai-upscayl"
        headingOverride="Want my Upscayl setup notes in your inbox?"
      />
    </>
  )
}
