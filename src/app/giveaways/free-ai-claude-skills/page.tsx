'use client'

import FreeAiToolPage from '@/components/giveaways/FreeAiToolPage'
import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'
import { getFreeAiTool } from '@/lib/free-ai-tools'

const TOOL = getFreeAiTool('free-ai-claude-skills')

// Free AI Tools batch, keyword SKILL. Copy lives in src/lib/free-ai-tools.ts.
export default function FreeAiClaudeSkillsPage() {
  return (
    <>
      <FreeAiToolPage tool={TOOL} />
      <GiveawayAutoModal
        slug="free-ai-claude-skills"
        headingOverride="Want my Claude Skills setup notes in your inbox?"
      />
    </>
  )
}
