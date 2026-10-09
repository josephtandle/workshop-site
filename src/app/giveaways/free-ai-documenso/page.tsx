'use client'

import FreeAiToolPage from '@/components/giveaways/FreeAiToolPage'
import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'
import { getFreeAiTool } from '@/lib/free-ai-tools'

const TOOL = getFreeAiTool('free-ai-documenso')

// Free AI Tools batch, keyword INKED. Copy lives in src/lib/free-ai-tools.ts.
export default function FreeAiDocumensoPage() {
  return (
    <>
      <FreeAiToolPage tool={TOOL} />
      <GiveawayAutoModal
        slug="free-ai-documenso"
        headingOverride="Want my Documenso setup notes in your inbox?"
      />
    </>
  )
}
