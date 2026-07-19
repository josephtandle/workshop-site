'use client'

import { useEffect, useRef, useState } from 'react'
import { askAnAiExpertQuotes } from './ask-an-ai-expert-quotes'

const CARD_WIDTH = 348
const STEP_WIDTH = CARD_WIDTH + 16

export default function AskAnAiExpertQuoteStrip() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const autoScrollRef = useRef<number | null>(null)

  function scroll(direction: 'prev' | 'next') {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction === 'next' ? STEP_WIDTH : -STEP_WIDTH, behavior: 'smooth' })
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    if (!isPaused) {
      autoScrollRef.current = window.setInterval(() => {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 5) {
          track.scrollLeft = 0
        } else {
          track.scrollLeft += 1
        }
      }, 25)
    }

    return () => {
      if (autoScrollRef.current !== null) {
        window.clearInterval(autoScrollRef.current)
        autoScrollRef.current = null
      }
    }
  }, [isPaused])

  return (
    <section className="relative overflow-hidden px-6 py-6 md:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,105,199,0.12),transparent_58%),linear-gradient(180deg,rgba(12,8,20,0.92),rgba(12,8,20,0.98))]" />
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#7C69C7]/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#F5C3C6]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-6 max-w-3xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">Social Proof</p>
          <h2 className="text-[2rem] font-extrabold leading-[1.02] tracking-tight text-[#FCF4EB] md:text-[2.8rem]">
            What people said after getting AI working in the background
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-8 text-[#FCF4EB]/62 md:text-lg">
            Real results from business owners who wanted more sales and less busy work.
          </p>
        </div>

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
            {askAnAiExpertQuotes.map((item) => (
              <article
                key={`${item.name}-${item.quote.slice(0, 16)}`}
                className="flex-shrink-0 rounded-[1.6rem] border border-white/10 bg-[linear-gradient(160deg,rgba(20,14,35,0.95),rgba(11,8,18,0.98))] p-[1px] shadow-[0_20px_50px_rgba(0,0,0,0.22)]"
                style={{ width: CARD_WIDTH }}
              >
                <div className="flex h-full flex-col rounded-[1.55rem] border border-white/[0.04] bg-[radial-gradient(circle_at_top,rgba(124,105,199,0.16),transparent_52%),rgba(15,11,25,0.98)] p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="h-11 w-11 rounded-full border border-white/10 bg-[linear-gradient(135deg,rgba(124,105,199,0.35),rgba(245,195,198,0.22))]" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BDB3E8]">Quote</p>
                  </div>
                  <blockquote className="flex-1 text-sm leading-7 text-[#FCF4EB]/82 md:text-[15px]">
                    {item.quote}
                  </blockquote>
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="text-sm font-semibold text-[#FCF4EB]">{item.name}</p>
                  </div>
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
