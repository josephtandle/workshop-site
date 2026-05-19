'use client'

import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from 'react'

type Props = React.VideoHTMLAttributes<HTMLVideoElement>

const ACTIVE_EVENT_VIDEO = 'masterminds:event-video-active'

const EventMediaVideo = forwardRef<HTMLVideoElement, Props>(function EventMediaVideo(props, forwardedRef) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const videoId = useId()

  useImperativeHandle(forwardedRef, () => {
    if (!videoRef.current) {
      throw new Error('EventMediaVideo ref requested before mount')
    }

    return videoRef.current
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const currentVideo = video

    function activateThisVideo(targetVideo: HTMLVideoElement) {
      targetVideo.muted = false
      window.dispatchEvent(new CustomEvent(ACTIVE_EVENT_VIDEO, { detail: videoId }))
    }

    function handleActiveVideo(event: Event) {
      const activeId = (event as CustomEvent<string>).detail
      if (activeId !== videoId) {
        currentVideo.muted = true
      }
    }

    function handleVolumeChange() {
      if (!currentVideo.muted && !currentVideo.paused) {
        activateThisVideo(currentVideo)
      }
    }

    function handlePlay() {
      activateThisVideo(currentVideo)
    }

    window.addEventListener(ACTIVE_EVENT_VIDEO, handleActiveVideo)
    currentVideo.addEventListener('play', handlePlay)
    currentVideo.addEventListener('volumechange', handleVolumeChange)

    return () => {
      window.removeEventListener(ACTIVE_EVENT_VIDEO, handleActiveVideo)
      currentVideo.removeEventListener('play', handlePlay)
      currentVideo.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [videoId])

  return <video ref={videoRef} {...props} />
})

export default EventMediaVideo
