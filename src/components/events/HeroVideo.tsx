'use client'

import { useRef, useState } from 'react'
import EventMediaVideo from '@/components/events/EventMediaVideo'

type Props = {
  src: string
  poster?: string
  alt: string
  className?: string
}

export default function HeroVideo({ src, poster, alt, className }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [hasStarted, setHasStarted] = useState(false)

  function handlePlayClick() {
    const video = videoRef.current
    if (!video) return
    void video.play()
    setHasStarted(true)
  }

  return (
    <div className="relative h-full w-full">
      <EventMediaVideo
        ref={videoRef}
        className={className}
        src={src}
        poster={poster}
        aria-label={alt}
        controls
        playsInline
        preload="auto"
        onPlay={() => setHasStarted(true)}
        onPause={() => setHasStarted(Boolean(videoRef.current && videoRef.current.currentTime > 0))}
      />
      {!hasStarted ? (
        <button
          type="button"
          aria-label="Play video"
          onClick={handlePlayClick}
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/20 via-transparent to-black/10"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/35 bg-black/45 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:bg-black/60">
            <svg viewBox="0 0 24 24" className="ml-1 h-9 w-9 fill-white" aria-hidden="true">
              <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
            </svg>
          </span>
        </button>
      ) : null}
    </div>
  )
}
