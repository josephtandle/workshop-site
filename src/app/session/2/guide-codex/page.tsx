import Link from 'next/link'
import Session2GuideCodex from '@/content/session-2-guide-codex'

export const metadata = {
  title: 'Session 2 Guide: Building Your First Website with AI (Codex)',
  description: 'Step-by-step workshop guide for Session 2 using OpenAI Codex instead of Claude Code.',
}

export default function Session2GuideCodexPage() {
  return (
    <main>
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-0">
        <nav className="text-sm text-[#FCF4EB]/40 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#7C69C7] transition-colors">
            All Sessions
          </Link>
          <span>/</span>
          <Link href="/session/2" className="hover:text-[#7C69C7] transition-colors">
            Session 2
          </Link>
          <span>/</span>
          <span className="text-[#FCF4EB]/60">Workshop Guide</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#7C69C7]/20 text-[#9D8FE0] font-medium ml-1">Codex</span>
        </nav>
      </div>

      {/* Content */}
      <Session2GuideCodex />

      {/* Footer nav */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="border-t border-white/[0.06] pt-8 flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/session/2/prep"
            className="inline-flex items-center gap-2 text-sm text-[#FCF4EB]/40 hover:text-[#7C69C7] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Prep Requirements
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#FCF4EB]/40 hover:text-[#7C69C7] transition-colors"
          >
            All Sessions
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  )
}
