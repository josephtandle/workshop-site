import Link from 'next/link'
import Session7DescriptGuide from '@/content/session-7-descript-guide'

export const metadata = {
  title: 'Session 7: Descript — Repurpose Long-Form Content into Short-Form Gold',
  description:
    'Learn to turn any long-form recording into social clips, reels, and short-form content using Descript. No video editing skills required.',
}

export default function Session7DescriptPage() {
  return (
    <main>
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-0">
        <nav className="text-sm text-[#FCF4EB]/40 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#7C69C7] transition-colors">
            All Sessions
          </Link>
          <span>/</span>
          <Link href="/session/7" className="hover:text-[#7C69C7] transition-colors">
            Session 7
          </Link>
          <span>/</span>
          <span className="text-[#FCF4EB]/60">Descript Guide</span>
        </nav>
      </div>

      {/* Content */}
      <Session7DescriptGuide />

      {/* Footer nav */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="border-t border-white/[0.06] pt-8 flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/session/7"
            className="inline-flex items-center gap-2 text-sm text-[#FCF4EB]/40 hover:text-[#7C69C7] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Session 7 Overview
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
