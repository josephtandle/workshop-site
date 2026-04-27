'use client'

import { useState, useRef, useEffect, useCallback, type MouseEvent } from 'react'

interface VideoOption {
  id: string
  label: string
}

interface StickyVideoPlayerProps {
  videoId?: string
  videos?: VideoOption[]
  src?: string
  title?: string
}

export default function StickyVideoPlayer({ videoId, videos, src, title = 'Workshop Recording' }: StickyVideoPlayerProps) {
  const initialVideoId = videos ? videos[videos.length - 1].id : (videoId ?? '')
  const [activeVideoId, setActiveVideoId] = useState(initialVideoId)
  const [isSticky, setIsSticky] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const placeholderRef = useRef<HTMLDivElement>(null)
  const [inlineRect, setInlineRect] = useState<DOMRect | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const savedTimeRef = useRef(0)

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

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) savedTimeRef.current = videoRef.current.currentTime
  }, [])

  // After sticky transition, restore playback position in the newly mounted video element
  useEffect(() => {
    if (!src || savedTimeRef.current === 0) return
    const video = videoRef.current
    if (!video) return
    video.currentTime = savedTimeRef.current
    video.play().catch(() => {})
  }, [isSticky, src])

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

  const resolvedVideoId = videos ? activeVideoId : (videoId ?? '')
  const iframeSrc = resolvedVideoId ? `https://www.youtube.com/embed/${resolvedVideoId}?rel=0&modestbranding=1&enablejsapi=1` : ''

  const handleSwitchVideo = useCallback((id: string) => {
    setActiveVideoId(id)
    setHasStarted(false)
  }, [])

  // Magnetic button refs and state
  const magneticRefs = useRef<(HTMLButtonElement | null)[]>([])
  const magneticTransforms = useRef<{ x: number; y: number }[]>([])

  const handleMagneticMove = useCallback((e: MouseEvent<HTMLButtonElement>, index: number) => {
    const btn = magneticRefs.current[index]
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * 0.35
    const dy = (e.clientY - cy) * 0.35
    magneticTransforms.current[index] = { x: dx, y: dy }
    btn.style.transform = `translate(${dx}px, ${dy}px)`
  }, [])

  const handleMagneticLeave = useCallback((index: number) => {
    const btn = magneticRefs.current[index]
    if (!btn) return
    magneticTransforms.current[index] = { x: 0, y: 0 }
    btn.style.transform = 'translate(0px, 0px)'
  }, [])

  // Compute the animated style for the video wrapper (src/local video only)
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

  // ── YouTube iframe path ────────────────────────────────────────────────────────
  // Keep the iframe always mounted inside the placeholder so it never reloads.
  // When sticky, CSS `position: fixed` pops it out of the placeholder's layout
  // while the placeholder stays in flow to maintain page height.
  if ((videoId || videos) && !src) {
    return (
      <>
        {/* Cohort tab switcher (only when multiple videos provided) */}
        {videos && videos.length > 1 && (
          <div className="flex items-center gap-3 mb-5">
            {videos.map((v, i) => {
              const isActive = activeVideoId === v.id
              return (
                <button
                  key={v.id}
                  ref={(el) => { magneticRefs.current[i] = el }}
                  onClick={() => handleSwitchVideo(v.id)}
                  onMouseMove={(e) => handleMagneticMove(e, i)}
                  onMouseLeave={() => handleMagneticLeave(i)}
                  style={{ transition: 'transform 0.25s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.25s ease, background 0.2s ease' }}
                  className={`relative px-6 py-3 rounded-full text-sm font-bold transition-colors select-none ${
                    isActive
                      ? 'text-white'
                      : 'bg-white/[0.06] text-[#FCF4EB]/55 border border-white/[0.10] hover:bg-white/[0.10] hover:text-[#FCF4EB]/85 hover:border-white/[0.18]'
                  }`}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #9D8FE0 0%, #7C69C7 50%, #5B4FAF 100%)',
                        boxShadow: '0 0 20px rgba(124,105,199,0.55), 0 4px 16px rgba(124,105,199,0.35), inset 0 1px 0 rgba(255,255,255,0.18)',
                        borderRadius: 'inherit',
                      }}
                    />
                  )}
                  <span className="relative z-10">{v.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Placeholder: always in flow, maintains vertical space, IntersectionObserver target */}
        <div
          ref={placeholderRef}
          style={{ aspectRatio: '16 / 9', width: '100%', position: 'relative' }}
        >
          {/* iframe lives here in the DOM — never unmounts, just repositioned via CSS */}
          <div
            style={
              isSticky && hasStarted
                ? {
                    position: 'fixed',
                    top: HEADER_HEIGHT,
                    right: STICKY_RIGHT,
                    width: STICKY_WIDTH,
                    zIndex: 40,
                    aspectRatio: '16 / 9',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
                  }
                : {
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }
            }
          >
            <iframe
              src={iframeSrc}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />

            {/* Click overlay before play starts — hands off to YouTube once dismissed */}
            {!hasStarted && (
              <div
                style={{ position: 'absolute', inset: 0, zIndex: 10, cursor: 'pointer' }}
                onClick={handlePlay}
                aria-label="Play video"
              />
            )}

            {/* Sticky cohort switcher */}
            {isSticky && hasStarted && videos && videos.length > 1 && (
              <div className="absolute top-2 left-2 flex items-center gap-1 z-20">
                {videos.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleSwitchVideo(v.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all backdrop-blur-sm ${
                      activeVideoId === v.id
                        ? 'bg-[#7C69C7] text-white'
                        : 'bg-black/60 text-white/60 hover:text-white'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            )}

            {/* Sticky controls */}
            {isSticky && hasStarted && (
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
            )}
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

  // ── Local src video path ───────────────────────────────────────────────────────
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
            <video
              ref={videoRef}
              src={src}
              title={title}
              controls
              playsInline
              onPlay={handlePlay}
              onTimeUpdate={handleTimeUpdate}
              className="absolute inset-0 w-full h-full object-contain bg-black"
            />
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
            <video
              ref={videoRef}
              src={src}
              controls
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="absolute inset-0 w-full h-full object-contain bg-black"
            />

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
              <video
                src={src}
                controls
                playsInline
                onTimeUpdate={handleTimeUpdate}
                className="absolute inset-0 w-full h-full object-contain bg-black"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
