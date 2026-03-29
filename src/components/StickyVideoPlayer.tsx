'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface StickyVideoPlayerProps {
  videoId: string
  title?: string
}

export default function StickyVideoPlayer({ videoId, title = 'Workshop Recording' }: StickyVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const placeholderRef = useRef<HTMLDivElement>(null)

  // Header height (py-4 = 16px*2 + content ~24px = ~56px, use 64 for safety)
  const HEADER_HEIGHT = 64

  // Track when the in-page container scrolls out of view
  useEffect(() => {
    if (!hasStarted || isMinimized) return

    const el = placeholderRef.current || containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Sticky when the original position is above the viewport
        setIsSticky(!entry.isIntersecting)
      },
      {
        rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px`,
        threshold: 0,
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasStarted, isMinimized])

  const handlePlay = useCallback(() => {
    setHasStarted(true)
  }, [])

  const handleMinimize = useCallback(() => {
    setIsMinimized(true)
    setIsSticky(false)
  }, [])

  const handleRestore = useCallback(() => {
    setIsMinimized(false)
  }, [])

  const handleExpand = useCallback(() => {
    setIsExpanded(true)
  }, [])

  const handleCollapse = useCallback(() => {
    setIsExpanded(false)
  }, [])

  // Close expanded view on Escape
  useEffect(() => {
    if (!isExpanded) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isExpanded])

  const iframeSrc = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`

  // Minimized floating pill (bottom-right) to restore the video
  if (isMinimized) {
    return (
      <>
        {/* Placeholder to maintain page flow */}
        <div ref={placeholderRef} />

        <button
          onClick={handleRestore}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#7C69C7] hover:bg-[#9D8FE0] text-white pl-4 pr-5 py-3 rounded-full shadow-lg shadow-purple-900/40 transition-all duration-200 hover:scale-105"
        >
          {/* Play icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="text-sm font-semibold">Resume Video</span>
        </button>
      </>
    )
  }

  return (
    <>
      {/* Spacer when sticky — prevents content jump */}
      {isSticky && (
        <div
          ref={placeholderRef}
          style={{ height: containerRef.current?.offsetHeight || 0 }}
        />
      )}

      {/* Main video container */}
      <div
        ref={!isSticky ? placeholderRef : undefined}
      >
        <div
          ref={containerRef}
          className={`
            transition-all duration-300 ease-out
            ${isSticky
              ? 'fixed left-0 right-0 z-40 shadow-2xl shadow-black/60'
              : 'relative'
            }
          `}
          style={isSticky ? { top: HEADER_HEIGHT } : undefined}
        >
          {/* Sticky mode: constrained height with controls bar */}
          <div className={`
            ${isSticky
              ? 'bg-[#111111] border-b border-white/[0.08]'
              : ''
            }
          `}>
            {/* Video embed */}
            <div
              className={`
                relative w-full mx-auto
                ${isSticky ? 'max-w-5xl' : 'max-w-3xl'}
              `}
            >
              <div
                className={`
                  relative overflow-hidden
                  ${isSticky
                    ? 'rounded-none'
                    : 'rounded-2xl border border-white/[0.10]'
                  }
                `}
                style={{
                  aspectRatio: isSticky ? undefined : '16 / 9',
                  height: isSticky ? 'min(35vh, 280px)' : undefined,
                }}
              >
                <iframe
                  src={iframeSrc}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  onLoad={() => {
                    // We can't directly detect play via cross-origin iframe,
                    // so we treat first interaction (click on iframe area) as play
                  }}
                />

                {/* Click overlay to detect first play — only shown before started */}
                {!hasStarted && (
                  <div
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={handlePlay}
                    aria-label="Play video"
                  />
                )}
              </div>

              {/* Controls bar — only in sticky mode */}
              {isSticky && (
                <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
                  {/* Expand button */}
                  <button
                    onClick={handleExpand}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/60 hover:bg-black/80 text-white/70 hover:text-white backdrop-blur-sm transition-all"
                    title="Expand video"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  </button>

                  {/* Minimize button */}
                  <button
                    onClick={handleMinimize}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/60 hover:bg-black/80 text-white/70 hover:text-white backdrop-blur-sm transition-all"
                    title="Minimize video"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Sticky info bar */}
            {isSticky && (
              <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
                <p className="text-xs text-[#FCF4EB]/40 truncate">
                  <span className="text-[#7C69C7] font-semibold">Session 2</span>
                  <span className="mx-2 text-white/20">|</span>
                  {title}
                </p>
                <button
                  onClick={() => {
                    const el = placeholderRef.current
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-xs text-[#FCF4EB]/30 hover:text-[#7C69C7] transition-colors whitespace-nowrap ml-4"
                >
                  Back to top
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={handleCollapse}
        >
          <div
            className="relative w-[92vw] max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCollapse}
              className="absolute -top-12 right-0 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            >
              <span>Close</span>
              <kbd className="text-xs bg-white/10 px-1.5 py-0.5 rounded">Esc</kbd>
            </button>

            <div className="relative rounded-2xl overflow-hidden border border-white/[0.10] shadow-2xl shadow-purple-900/20" style={{ aspectRatio: '16 / 9' }}>
              <iframe
                src={iframeSrc}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
