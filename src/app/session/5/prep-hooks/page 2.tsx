import Link from 'next/link'
import Session4Prep from '@/content/session-4-prep'

export const metadata = {
  title: 'Session 5 Prep: Prepare for Hook Writing',
  description: 'Find your Instagram inspiration and define your audience before the session so we can write hooks that actually land.',
}

export default function Session5HookPrepPage() {
  return (
    <main>
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-0">
        <nav className="text-sm text-[#FCF4EB]/40 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#7C69C7] transition-colors">All Sessions</Link>
          <span>/</span>
          <Link href="/session/5" className="hover:text-[#7C69C7] transition-colors">Session 5</Link>
          <span>/</span>
          <span className="text-[#FCF4EB]/60">Prep: Hook Writing</span>
        </nav>
      </div>
      <Session4Prep />
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="border-t border-white/[0.06] pt-8">
          <Link
            href="/session/5"
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
