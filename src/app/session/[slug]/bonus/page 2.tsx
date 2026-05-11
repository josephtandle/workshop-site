import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSession } from '@/lib/sessions'
import Session1Bonus from '@/content/session-1-bonus'
import type { ComponentType } from 'react'

const bonusComponents: Record<string, ComponentType> = {
  '1': Session1Bonus,
}

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return [{ slug: '1' }]
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const session = getSession(slug)
  if (!session) return { title: 'Bonus', description: '' }

  return {
    title: `Session ${session.number} Bonus: ${session.title}`,
    description: `Optional bonus resource for Session ${session.number}: ${session.title}`,
  }
}

export default async function SessionBonusPage({ params }: Props) {
  const { slug } = await params
  const session = getSession(slug)
  const BonusContent = bonusComponents[slug]

  if (!session || !session.hasBonus || !BonusContent) notFound()

  return (
    <main>
      <BonusContent />

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="border-t border-white/[0.06] pt-8 flex items-center justify-between flex-wrap gap-4">
          <Link
            href={`/session/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-[#FCF4EB]/40 hover:text-[#7C69C7] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Session Overview
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
