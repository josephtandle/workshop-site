'use client'

import { useEffect, useRef } from 'react'

const COLORS = ['#8B79D4', '#A899CC', '#9D8FE0', '#FCF4EB']
const REPEL_RADIUS = 100
const REPEL_STRENGTH = 4.5
const WAKE_RADIUS = 60
const WAKE_STRENGTH = 0.15

export default function PageParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Smoothed mouse position and velocity — start offscreen so no effect until first move
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 }
    const onMouseMove = (e: MouseEvent) => {
      const rawVx = e.clientX - mouse.x
      const rawVy = e.clientY - mouse.y
      mouse.vx = mouse.vx * 0.6 + rawVx * 0.4
      mouse.vy = mouse.vy * 0.6 + rawVy * 0.4
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', onMouseMove)

    type Particle = { x: number; y: number; r: number; dx: number; dy: number; alpha: number; color: string }
    const particles: Particle[] = Array.from({ length: 66 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: Math.random() * 0.5 + 0.15,
      alpha: Math.random() * 0.4 + 0.05,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    let animId = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Decay velocity so wake fades when cursor stops
      mouse.vx *= 0.88
      mouse.vy *= 0.88

      particles.forEach((p) => {
        const distX = p.x - mouse.x
        const distY = p.y - mouse.y
        const dist = Math.sqrt(distX * distX + distY * distY)

        let fx = 0
        let fy = 0

        if (dist < REPEL_RADIUS && dist > 0) {
          // Push away from cursor, strongest at center
          const strength = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH
          fx += (distX / dist) * strength
          fy += (distY / dist) * strength
        }

        if (dist < WAKE_RADIUS && dist > 0) {
          // Particles very close pick up cursor momentum for a trailing ripple
          fx += mouse.vx * WAKE_STRENGTH
          fy += mouse.vy * WAKE_STRENGTH
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()

        p.x += p.dx + fx
        p.y += p.dy + fy

        if (p.y > canvas.height + 5) { p.y = -5; p.x = Math.random() * canvas.width }
        if (p.x < -5) p.x = canvas.width + 5
        if (p.x > canvas.width + 5) p.x = -5
      })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  )
}
