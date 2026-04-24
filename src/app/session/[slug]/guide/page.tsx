import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSession } from '@/lib/sessions'
import { LOCKS } from '@/lib/locks'
import Session1Guide from '@/content/session-1-guide'
import Session2Guide from '@/content/session-2-guide'
import Session3Guide from '@/content/session-3-guide'
import Session6Guide from '@/content/session-6-guide'
import Session7Guide from '@/content/session-7-guide'
import type { ComponentType } from 'react'

const guideComponents: Record<string, ComponentType> = {
  '1': Session1Guide,
  '2': Session2Guide,
  '3': Session3Guide,
  '6': Session6Guide,
  '7': Session7Guide,
}

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return [
    { slug: '1' },
    { slug: '2' },
    { slug: '3' },
    ...(LOCKS.session6Guide ? [{ slug: '6' }] : []),
    ...(LOCKS.session7Guide ? [{ slug: '7' }] : []),
  ]
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const session = getSession(slug)
  if (!session) return { title: 'Workshop Guide', description: '' }
  return {
    title: `Session ${session.number} Guide: ${session.title}`,
    description: `Step-by-step workshop guide for Session ${session.number}: ${session.title}`,
  }
}

export default async function SessionGuidePage({ params }: Props) {
  const { slug } = await params
  const session = getSession(slug)
  if (!session || !session.hasGuide) notFound()
  if (slug === '6' && !LOCKS.session6Guide) notFound()
  if (slug === '7' && !LOCKS.session7Guide) notFound()

  const GuideContent = guideComponents[slug]

  return (
    <main>
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-0">
        <nav className="text-sm text-[#FCF4EB]/40 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#7C69C7] transition-colors">
            All Sessions
          </Link>
          <span>/</span>
          <Link href={`/session/${slug}`} className="hover:text-[#7C69C7] transition-colors">
            Session {session.number}
          </Link>
          <span>/</span>
          <span className="text-[#FCF4EB]/60">Workshop Guide</span>
        </nav>
      </div>

      {/* Content */}
      <GuideContent />

      {/* Footer nav */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="border-t border-white/[0.06] pt-8 flex items-center justify-between flex-wrap gap-4">
          <Link
            href={`/session/${slug}/prep`}
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
