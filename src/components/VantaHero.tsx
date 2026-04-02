'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

interface Props {
  sessionNumber: number
  title: string
  description: string
  slug: string
}

export default function VantaHero({ sessionNumber, title, description, slug }: Props) {
  const bgRef = useRef<HTMLDivElement>(null)
  const effectRef = useRef<{ destroy: () => void } | null>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      const THREE = await import('three')
      // @ts-expect-error vanta has no types
      const { default: NET } = await import('vanta/dist/vanta.net.min')

      if (cancelled || !bgRef.current) return

      effectRef.current = NET({
        el: bgRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        color: 0x2a2a2a,
        backgroundColor: 0x151515,
        points: 8.0,
        maxDistance: 18.0,
        spacing: 22.0,
      })
    }

    init()

    return () => {
      cancelled = true
      effectRef.current?.destroy()
    }
  }, [])

  return (
    <div ref={bgRef} className="relative w-full" style={{ minHeight: '380px' }}>
      {/* very light vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(21,21,21,0.5) 100%)',
        }}
      />

      {/* content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-14">
        {/* Breadcrumb */}
        <nav className="mb-10 text-sm text-[#FCF4EB]/40 flex items-center gap-2">
          <Link href="/" className="hover:text-[#7C69C7] transition-colors">
            All Sessions
          </Link>
          <span>/</span>
          <span className="text-[#FCF4EB]/60">Session {sessionNumber}</span>
        </nav>

        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Session {sessionNumber}
        </p>
        <h1 className="gradient-text text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          {title}
        </h1>
        <p className="text-lg text-[#FCF4EB]/60 leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>
    </div>
  )
}
