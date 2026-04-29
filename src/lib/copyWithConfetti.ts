'use client'

import confetti from 'canvas-confetti'

const copyColors = ['#7C69C7', '#9D8FE0', '#F5C3C6', '#FCF4EB']

type CopyClick = {
  clientX: number
  currentTarget: EventTarget & Element
}

function getOrigin(event?: CopyClick) {
  if (!event || typeof window === 'undefined') return { y: 0.72 }

  const rect = event.currentTarget.getBoundingClientRect()
  const x = Math.min(0.98, Math.max(0.02, event.clientX / window.innerWidth))
  const y = Math.min(0.98, Math.max(0.02, (rect.top - 10) / window.innerHeight))

  return { x, y }
}

export async function copyWithConfetti(text: string, event?: CopyClick) {
  await navigator.clipboard.writeText(text)
  confetti({
    particleCount: 90,
    spread: 70,
    ticks: 160,
    scalar: 0.9,
    colors: copyColors,
    origin: getOrigin(event),
  })
}
