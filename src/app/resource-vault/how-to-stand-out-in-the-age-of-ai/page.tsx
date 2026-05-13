import type { Metadata } from 'next'
import Link from 'next/link'
import TianaSessionFooter from '@/components/TianaSessionFooter'
import TianaAiPositioningWorkshop from '@/content/tiana-ai-positioning-workshop'

const PAGE_URL = 'https://workshop.mastermindshq.business/resource-vault/how-to-stand-out-in-the-age-of-ai'

export const metadata: Metadata = {
  title: 'How to Stand Out in the Age of AI',
  description:
    'Workshop Masterminds HQ draft for Tiyana Gori\'s messaging and positioning workshop with editable copy-and-paste prompts throughout.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'How to Stand Out in the Age of AI',
    description:
      'Tiyana Gori\'s messaging and positioning workshop with editable copy-and-paste prompts throughout.',
    url: PAGE_URL,
    type: 'article',
  },
}

export default function HowToStandOutDraftPage() {
  return (
    <main>
      <section className="relative overflow-hidden px-6">
        <div className="text-sm text-[#FCF4EB]/40 flex items-center gap-2 flex-wrap max-w-5xl mx-auto pt-8">
          <Link href="/" className="hover:text-[#7C69C7] transition-colors">
            All Sessions
          </Link>
          <span>/</span>
          <Link href="/resource-vault" className="hover:text-[#7C69C7] transition-colors">
            Resource Vault
          </Link>
          <span>/</span>
          <span className="text-[#FCF4EB]/60">How to Stand Out in the Age of AI</span>
        </div>
      </section>

      <TianaAiPositioningWorkshop />

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="border-t border-white/[0.06] pt-8">
          <Link
            href="/resource-vault"
            className="inline-flex items-center gap-2 text-sm text-[#FCF4EB]/40 hover:text-[#7C69C7] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Resource Vault
          </Link>
        </div>
        <TianaSessionFooter />
      </div>
    </main>
  )
}
