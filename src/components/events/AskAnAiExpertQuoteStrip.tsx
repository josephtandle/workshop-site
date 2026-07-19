'use client'

import { useEffect, useRef, useState } from 'react'
import { askAnAiExpertQuotes } from './ask-an-ai-expert-quotes'

const CARD_WIDTH = 348
const STEP_WIDTH = CARD_WIDTH + 16

export default function AskAnAiExpertQuoteStrip() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const autoScrollRef = useRef<number | null>(null)
  const resumeTimerRef = useRef<number | null>(null)

  // Manual nav pauses the drift so the two never fight over scrollLeft,
  // then resumes once the smooth scroll has settled.
  function scroll(direction: 'prev' | 'next') {
    const track = trackRef.current
    if (!track) return
    setIsPaused(true)
    if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current)
    const half = track.scrollWidth / 2
    if (direction === 'next' && track.scrollLeft >= half) track.scrollLeft -= half
    if (direction === 'prev' && track.scrollLeft < STEP_WIDTH) track.scrollLeft += half
    track.scrollBy({ left: direction === 'next' ? STEP_WIDTH : -STEP_WIDTH, behavior: 'smooth' })
    resumeTimerRef.current = window.setTimeout(() => setIsPaused(false), 1400)
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    if (!isPaused) {
      // The list is rendered twice, so resetting at the halfway point is invisible:
      // the second copy is pixel-identical to the first. No jump, no snap-back.
      autoScrollRef.current = window.setInterval(() => {
        const half = track.scrollWidth / 2
        if (track.scrollLeft >= half) {
          track.scrollLeft -= half
        } else {
          track.scrollLeft += 0.5
        }
      }, 16)
    }

    return () => {
      if (autoScrollRef.current !== null) {
        window.clearInterval(autoScrollRef.current)
        autoScrollRef.current = null
      }
      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current)
        resumeTimerRef.current = null
      }
    }
  }, [isPaused])

  return (
    <section className="relative overflow-hidden px-6 py-6 md:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,105,199,0.12),transparent_58%),linear-gradient(180deg,rgba(12,8,20,0.92),rgba(12,8,20,0.98))]" />
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#7C69C7]/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#F5C3C6]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button
            type="button"
            onClick={() => scroll('prev')}
            className="absolute left-0 top-1/2 z-20 -ml-2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#120c1e]/90 text-[#FCF4EB]/65 shadow-[0_16px_30px_rgba(0,0,0,0.28)] transition hover:border-[#7C69C7]/40 hover:text-[#FCF4EB] group-hover:flex"
            aria-label="Previous quote"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto pb-4 pr-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[...askAnAiExpertQuotes, ...askAnAiExpertQuotes].map((item, index) => (
              <article
                key={`${index}-${item.name}`}
                className="flex-shrink-0 rounded-[1.6rem] border border-white/10 bg-[linear-gradient(160deg,rgba(20,14,35,0.95),rgba(11,8,18,0.98))] p-[1px] shadow-[0_20px_50px_rgba(0,0,0,0.22)]"
                style={{ width: CARD_WIDTH }}
              >
                <div className="flex h-full flex-col rounded-[1.55rem] border border-white/[0.04] bg-[radial-gradient(circle_at_top,rgba(124,105,199,0.16),transparent_52%),rgba(15,11,25,0.98)] p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ring-[#7C69C7]/30 flex-shrink-0">
                      <img src={item.photoSrc} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#FCF4EB] font-semibold text-lg leading-tight break-words">{item.name}</p>
                    </div>
                  </div>
                  <blockquote className="flex-1 text-sm italic leading-relaxed text-[#FCF4EB]/65 md:text-[15px] line-clamp-6">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <div className="mt-6 border-t border-white/10 pt-4" />
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll('next')}
            className="absolute right-0 top-1/2 z-20 -mr-2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#120c1e]/90 text-[#FCF4EB]/65 shadow-[0_16px_30px_rgba(0,0,0,0.28)] transition hover:border-[#7C69C7]/40 hover:text-[#FCF4EB] group-hover:flex"
            aria-label="Next quote"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0c0814] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0c0814] to-transparent" />
        </div>
      </div>
    </section>
  )
}
