'use client'

import FreeAiToolPage from '@/components/giveaways/FreeAiToolPage'
import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'
import { getFreeAiTool } from '@/lib/free-ai-tools'

const TOOL = getFreeAiTool('free-ai-stirling-pdf')

// Free AI Tools batch, keyword PAPER. Copy lives in src/lib/free-ai-tools.ts.
export default function FreeAiStirlingPdfPage() {
  return (
    <>
      <FreeAiToolPage tool={TOOL} />
      <GiveawayAutoModal
        slug="free-ai-stirling-pdf"
        headingOverride="Want my Stirling PDF setup notes in your inbox?"
      />
    </>
  )
}
