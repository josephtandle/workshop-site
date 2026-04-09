'use client'

import { useRef, useEffect, useState } from 'react'
import Reveal from '@/components/Reveal'

const reactions = [
  { name: 'Sophia', quote: 'We have like 55 signups for our masterclass and we\'ve only launched maybe four days ago.', photo: '/images/participants/sophia-fox.png', session: 4 },
  { name: 'Jenny', quote: 'It took like 5 minutes! I just took the one which took me one year, and I said make an essence of that, and what would be the most interesting free webinar?', photo: '/images/participants/jenny-jessen.jpg', session: 3 },
  { name: 'Alla', quote: 'It looks amazing, and everyone loves my website, and they can\'t believe that I\'ve created it. I can\'t believe it myself.', photo: '/images/participants/alla-demutska.jpg', session: 3 },
  { name: 'SunDari', quote: 'I used to pay all these people; now I can do it myself.', photo: '/images/participants/sundari-marci-lock.jpg', session: 1 },
  { name: 'Ronnie', quote: 'I already had a draft website and it created a link to my calendar, a link to my link tree, a hyperlink for my WhatsApp, all the same photos. This is like 90% of the way there to the kind of website that I want.', photo: '/images/participants/ronnie-ansara.jpg', session: 2 },
  { name: 'Alla', quote: 'I\'ve been comparing myself to a bird who now has wings. I feel so free.', photo: '/images/participants/alla-demutska.jpg', session: 4 },
  { name: 'Sophia', quote: 'I was able to go in and create my full email marketing funnel. It took off so much of the work of creating the workflow.', photo: '/images/participants/sophia-fox.png', session: 4 },
  { name: 'Johanna', quote: 'I have particles floating in the background, a circle following my cursor, things glowing. I could not believe I built this in one session.', photo: '/images/participants/johanna-bieber.png', session: 1 },
  { name: 'Ronnie', quote: 'It pulled in my calendar link, my WhatsApp, all my deck photos. This is 90% of the website I wanted. In 45 minutes.', photo: '/images/participants/ronnie-ansara.jpg', session: 1 },
  { name: 'Aaqib', quote: 'I got a functional contact form on the website using Resend. I managed to get that set up in like 20 minutes. So I\'m pretty stoked.', photo: '/images/participants/aaqib-hasanain.jpg', session: 2 },
  { name: 'Pina Maria', quote: 'I said change it and it changed my whole website in just one second. Everything worked, it was so easy.', photo: '/images/participants/pina-maria-muckle.png', session: 4 },
  { name: 'Johanna', quote: 'I was so on fire and so motivated because so many pieces of the puzzle I\'ve been working on since a long time are coming together.', photo: '/images/participants/johanna-bieber.png', session: 4 },
  { name: 'Jasmine', quote: 'It was great. It\'s been something that I really want to do, so I\'m super grateful. It\'s so easy and we can just keep building over time. It\'s epic.', photo: '/images/participants/jasmine-oh.jpg', session: 2 },
  { name: 'Aaqib', quote: 'I did a whole target audience and persona building exercise. I can safely say that I feel addicted to Claude.', photo: '/images/participants/aaqib-hasanain.jpg', session: 3 },
  { name: 'Marina', quote: 'It\'s really empowering to learn and to see, with all these different tools, what becomes possible.', photo: '/images/participants/marina-jaubert.jpg', session: 3 },
  { name: 'SunDari', quote: 'Excited that I can just ask Claude anything and be guided and supported through it all.', photo: '/images/participants/sundari-marci-lock.jpg', session: 4 },
  { name: 'Quincee', quote: 'The website\'s looking great. I did a brand photoshoot this past week and I feel like a brand new person digitally.', photo: '/images/participants/quincee-lark.jpg', session: 4 },
  { name: 'Alla', quote: 'I got my website online. Thank you so much, it was amazing.', photo: '/images/participants/alla-demutska.jpg', session: 2 },
  { name: 'Quincee', quote: 'I feel magnetic. I feel guided.', photo: '/images/participants/quincee-lark.jpg', session: 4 },
]

const CARD_W = 340

export default function MastermindReactionsSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const autoScrollRef = useRef<number | null>(null)

  function scroll(dir: 'prev' | 'next') {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: dir === 'next' ? CARD_W + 16 : -(CARD_W + 16), behavior: 'smooth' })
  }

  // Auto-scroll
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    if (!isPaused) {
      autoScrollRef.current = window.setInterval(() => {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 5) {
          // Jump to start instantly (no animation), then continue scrolling
          track.scrollLeft = 0
        } else {
          track.scrollLeft += 1
        }
      }, 25)
    }

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    }
  }, [isPaused])

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <img src="/images/backgrounds/purple-texture-bokeh.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" aria-hidden="true" />
      <div className="absolute inset-0 bg-[#0e0a17]/80" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-3">
              Real reactions from{' '}
              <span className="gradient-text">Cohort 1</span>
            </h2>
            <p className="text-cream/35 text-sm max-w-md mx-auto">
              What members said after their sessions.
            </p>
          </div>
        </Reveal>

        <div
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left arrow */}
          <button
            onClick={() => scroll('prev')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 -ml-2 w-12 h-12 rounded-full bg-darkest/90 border border-purple/20 flex items-center justify-center text-cream/60 hover:text-cream hover:border-purple/50 transition-all shadow-lg opacity-0 group-hover:opacity-100"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>

          {/* Scrollable track */}
          <div
            ref={trackRef}
            className="flex gap-5 overflow-x-auto pb-4 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reactions.map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 rounded-2xl p-[1px] bg-gradient-to-br from-purple/30 via-transparent to-rose/20 hover:from-purple/50 hover:to-rose/40 transition-all duration-500"
                style={{ width: CARD_W }}
              >
                <div className="rounded-2xl bg-[#13101e] p-6 h-full flex flex-col backdrop-blur-sm">
                  {/* Photo + name at top */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-purple/30 ring-offset-2 ring-offset-[#13101e] flex-shrink-0">
                      <img
                        src={t.photo}
                        alt={t.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p className="text-cream font-semibold text-base">{t.name}</p>
                      <p className="text-purple/50 text-xs">Session {t.session}</p>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-cream/65 text-sm leading-relaxed italic flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Bottom accent line */}
                  <div className="mt-5 h-px bg-gradient-to-r from-purple/20 via-rose/15 to-transparent" />
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll('next')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 -mr-2 w-12 h-12 rounded-full bg-darkest/90 border border-purple/20 flex items-center justify-center text-cream/60 hover:text-cream hover:border-purple/50 transition-all shadow-lg opacity-0 group-hover:opacity-100"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>

          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0e0a17] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0e0a17] to-transparent z-10" />
        </div>
      </div>
    </section>
  )
}
