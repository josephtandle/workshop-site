import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSession } from '@/lib/sessions'
import Session5Guide from '@/content/session-5-guide'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return [{ slug: '4' }]
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

export default async function SessionGuideBrainPage({ params }: Props) {
  const { slug } = await params
  if (slug !== '4') notFound()
  const session = getSession(slug)
  if (!session) notFound()

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
      <Session5Guide />

      {/* Footer nav */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="border-t border-white/[0.06] pt-8 flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/session/4/prep"
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
