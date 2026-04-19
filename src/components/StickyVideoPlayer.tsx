'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface StickyVideoPlayerProps {
  videoId?: string
  src?: string
  title?: string
}

export default function StickyVideoPlayer({ videoId, src, title = 'Workshop Recording' }: StickyVideoPlayerProps) {
  const [isSticky, setIsSticky] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const placeholderRef = useRef<HTMLDivElement>(null)
  const [inlineRect, setInlineRect] = useState<DOMRect | null>(null)

  const HEADER_HEIGHT = 64
  const STICKY_WIDTH = 450
  const STICKY_RIGHT = 24

  // Measure the inline position so we can animate from it
  const measureInline = useCallback(() => {
    if (placeholderRef.current) {
      setInlineRect(placeholderRef.current.getBoundingClientRect())
    }
  }, [])

  // Keep inline rect updated on scroll/resize when not sticky
  useEffect(() => {
    if (!hasStarted || isSticky) return
    measureInline()
    const onScroll = () => measureInline()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [hasStarted, isSticky, measureInline])

  // Track when the in-page container scrolls out of view
  useEffect(() => {
    if (!hasStarted || isMinimized) return

    const el = placeholderRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
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

  const iframeSrc = videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1` : ''

  // Compute the animated style for the video wrapper
  const getVideoStyle = (): React.CSSProperties => {
    if (!hasStarted || !inlineRect) {
      return {}
    }

    if (isSticky) {
      // Fly to top-right corner
      return {
        position: 'fixed',
        top: HEADER_HEIGHT,
        right: STICKY_RIGHT,
        width: STICKY_WIDTH,
        left: 'auto',
        zIndex: 40,
        transition: 'top 0.4s cubic-bezier(0.4, 0, 0.2, 1), right 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
      }
    }

    // Inline position: no fixed positioning needed, just flow normally
    return {
      position: 'relative',
      width: '100%',
    }
  }

  // Minimized floating pill (bottom-right) to restore the video
  if (isMinimized) {
    return (
      <>
        <div ref={placeholderRef} />

        <button
          onClick={handleRestore}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#7C69C7] hover:bg-[#9D8FE0] text-white pl-4 pr-5 py-3 rounded-full shadow-lg shadow-purple-900/40 transition-all duration-200 hover:scale-105"
        >
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
      {/* Placeholder to maintain page flow and measure inline position */}
      <div
        ref={placeholderRef}
        style={{
          aspectRatio: '16 / 9',
          width: '100%',
          // When sticky, keep the space; when inline, video fills this naturally
          visibility: isSticky ? 'hidden' : 'visible',
        }}
      >
        {/* When not sticky, video lives here in flow */}
        {!isSticky && (
          <div className="relative w-full h-full rounded-2xl border border-white/[0.10] overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
            {src ? (
              <video
                src={src}
                title={title}
                controls
                playsInline
                onPlay={handlePlay}
                className="absolute inset-0 w-full h-full object-contain bg-black"
              />
            ) : (
              <>
                <iframe
                  src={iframeSrc}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
                {!hasStarted && (
                  <div
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={handlePlay}
                    aria-label="Play video"
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Sticky floating video */}
      {isSticky && (
        <div
          style={getVideoStyle()}
        >
          <div
            className="relative overflow-hidden rounded-xl border border-white/[0.12]"
            style={{ aspectRatio: '16 / 9' }}
          >
            {src ? (
              <video
                src={src}
                controls
                playsInline
                autoPlay
                className="absolute inset-0 w-full h-full object-contain bg-black"
              />
            ) : (
              <iframe
                src={iframeSrc}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            )}

            {/* Controls */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
              <button
                onClick={handleExpand}
                className="flex items-center justify-center w-7 h-7 rounded-lg bg-black/60 hover:bg-black/80 text-white/70 hover:text-white backdrop-blur-sm transition-all"
                title="Expand video"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </button>
              <button
                onClick={handleMinimize}
                className="flex items-center justify-center w-7 h-7 rounded-lg bg-black/60 hover:bg-black/80 text-white/70 hover:text-white backdrop-blur-sm transition-all"
                title="Minimize video"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

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
            <button
              onClick={handleCollapse}
              className="absolute -top-12 right-0 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            >
              <span>Close</span>
              <kbd className="text-xs bg-white/10 px-1.5 py-0.5 rounded">Esc</kbd>
            </button>

            <div className="relative rounded-2xl overflow-hidden border border-white/[0.10] shadow-2xl shadow-purple-900/20" style={{ aspectRatio: '16 / 9' }}>
              {src ? (
                <video
                  src={src}
                  controls
                  playsInline
                  autoPlay
                  className="absolute inset-0 w-full h-full object-contain bg-black"
                />
              ) : (
                <iframe
                  src={iframeSrc}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
