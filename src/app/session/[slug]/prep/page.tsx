import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSession } from '@/lib/sessions'
import Session2Prep from '@/content/session-2-prep'
import Session3Prep from '@/content/session-3-prep'
import type { ComponentType } from 'react'

const prepComponents: Record<string, ComponentType> = {
  '2': Session2Prep,
  '3': Session3Prep,
}

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return [{ slug: '2' }, { slug: '3' }]
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const session = getSession(slug)
  if (!session) return {}
  return {
    title: `Session ${session.number} Prep: ${session.title} — Masterminds Workshop`,
    description: `Pre-session requirements for Session ${session.number}: ${session.title}. Complete these before attending.`,
  }
}

export default async function SessionPrepPage({ params }: Props) {
  const { slug } = await params
  const session = getSession(slug)
  if (!session || !session.hasPrep) notFound()

  const PrepContent = prepComponents[slug]

  return (
    <main>
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-0">
        <nav className="text-sm text-[#FCF4EB]/40 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#7C69C7] transition-colors">
            All Sessions
          </Link>
          <span>/</span>
          <Link href={`/session/${slug}`} className="hover:text-[#7C69C7] transition-colors">
            Session {session.number}
          </Link>
          <span>/</span>
          <span className="text-[#FCF4EB]/60">Prep Requirements</span>
        </nav>
      </div>

      {/* Content */}
      <PrepContent />

      {/* Footer nav */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="border-t border-white/[0.06] pt-8">
          <Link
            href={`/session/${slug}`}
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
