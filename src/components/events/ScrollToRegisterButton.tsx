'use client'

import type { ReactNode } from 'react'

type Props = {
  className?: string
  children: ReactNode
}

export default function ScrollToRegisterButton({ className, children }: Props) {
  function handleClick() {
    const target = document.getElementById('register')
    if (!target) return

    const offset = -52
    const top = window.scrollY + target.getBoundingClientRect().top - offset

    window.scrollTo({ top, behavior: 'smooth' })
    window.history.replaceState(null, '', '#register')
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
