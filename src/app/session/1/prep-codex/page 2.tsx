import Link from 'next/link'
import Session1PrepCodex from '@/content/session-1-prep-codex'

export const metadata = {
  title: 'Session 1 Prep: Setting the Mastermind Container (Codex)',
  description: 'Pre-session requirements for Session 1 using OpenAI Codex instead of Claude Code.',
}

export default function Session1PrepCodexPage() {
  return (
    <main>
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-0">
        <nav className="text-sm text-[#FCF4EB]/40 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#7C69C7] transition-colors">
            All Sessions
          </Link>
          <span>/</span>
          <Link href="/session/1" className="hover:text-[#7C69C7] transition-colors">
            Session 1
          </Link>
          <span>/</span>
          <span className="text-[#FCF4EB]/60">Prep Requirements</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#7C69C7]/20 text-[#9D8FE0] font-medium ml-1">Codex</span>
        </nav>
      </div>

      {/* Content */}
      <Session1PrepCodex />

      {/* Footer nav */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="border-t border-white/[0.06] pt-8">
          <Link
            href="/session/1"
            className="inline-flex items-center gap-2 text-sm text-[#FCF4EB]/40 hover:text-[#7C69C7] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Session Overview
          </Link>
        </div>
      </div>
    </main>
  )
}
