/**
 * TOOL PAGE TEMPLATE
 *
 * Use this as the starting point for interactive tool pages (not step-by-step guides).
 * Search for all [FILL IN] markers and replace them before publishing.
 *
 * Rules (also in CLAUDE.md):
 * - 'use client' required for all interactive tool pages
 * - No em dashes anywhere -- use "and", "then", or a period
 * - No hardcoded hex in className -- use inline style for custom colors
 * - No CDN icons -- use lucide-react or inline SVG
 * - Max width: max-w-5xl (wider than guide pages, tools need space)
 */

'use client'

import Link from 'next/link'

export default function ToolPageTemplate() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">

      {/* ============================================================
          BREADCRUMB
          Fill in: session number, page title
      ============================================================ */}
      <nav className="mb-10 text-sm flex items-center gap-2" style={{ color: 'rgba(252,244,235,0.4)' }}>
        <Link href="/" className="hover:text-[#7C69C7] transition-colors">All Sessions</Link>
        <span>/</span>
        <Link href="/session/[N]" className="hover:text-[#7C69C7] transition-colors">Session [N]</Link>
        <span>/</span>
        <span style={{ color: 'rgba(252,244,235,0.6)' }}>[Page Title]</span>
      </nav>

      {/* ============================================================
          PAGE HEADER
          Fill in: session number, h1, description
      ============================================================ */}
      <div className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#7C69C7' }}>
          Session [N]
        </p>
        <h1 className="gradient-text text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          [Page Title]
        </h1>
        <p className="text-lg leading-relaxed max-w-2xl" style={{ color: 'rgba(252,244,235,0.6)' }}>
          [One or two sentences explaining what this tool does and what the participant will leave with.]
        </p>
      </div>

      {/* ============================================================
          TOOL BODY
          Replace this section with the interactive content.
          Common patterns:
          - Name picker grid (see hook-writer page)
          - Editable form sections
          - Copy button
      ============================================================ */}
      <div className="space-y-8">
        {/* Your tool content here */}
      </div>

      {/* ============================================================
          BACK LINK
          Always present at the bottom of every page.
      ============================================================ */}
      <div className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link
          href="/session/[N]"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: 'rgba(252,244,235,0.4)' }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Session [N]
        </Link>
      </div>

    </main>
  )
}
