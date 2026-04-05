'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'left' | 'right' | 'none'
}

export default function Reveal({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const staggerDelay = delay * 0.08

  const initial = {
    opacity: 0,
    y: direction === 'up' ? 14 : 0,
    x: direction === 'left' ? -14 : direction === 'right' ? 14 : 0,
  }

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.34, delay: staggerDelay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
