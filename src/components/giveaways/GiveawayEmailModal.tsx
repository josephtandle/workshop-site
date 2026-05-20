'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  slug: string
  isOpen: boolean
  onClose: () => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function GiveawayEmailModal({ slug, isOpen, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const closeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setStatus('idle')
    setErrorMsg(null)
    setEmail('')
    const t = window.setTimeout(() => inputRef.current?.focus(), 80)
    return () => window.clearTimeout(t)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!EMAIL_RE.test(trimmed)) {
      setStatus('error')
      setErrorMsg('Please enter a valid email.')
      return
    }
    setStatus('submitting')
    setErrorMsg(null)
    try {
      const journeyId = typeof window !== 'undefined'
        ? window.localStorage.getItem('insight_journey_id')
        : null
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source: slug, journeyId }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Something went wrong')
      }
      setStatus('success')
      closeTimerRef.current = window.setTimeout(() => {
        onClose()
      }, 3200)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/72 px-6 backdrop-blur-md">
      <div
        className="relative w-full max-w-md rounded-[2rem] border border-white/12 bg-[#151517] px-7 pb-7 pt-12 text-center shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#8B79D4] bg-black text-white transition hover:bg-[#1a1a2e]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {status === 'success' ? (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#7C69C7]/15 text-[#BDB3E8]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 className="text-[1.4rem] font-extrabold leading-tight text-[#FCF4EB]">
              On its way.
            </h3>
            <p className="mt-3 text-[15px] leading-7 text-[#FCF4EB]/72">
              Hit reply on any email and tell me what you&apos;re building. I read every one.
            </p>
          </>
        ) : (
          <>
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">
              ✓ Copied
            </p>
            <h3 className="mt-3 text-[1.55rem] font-extrabold leading-[1.15] text-[#FCF4EB]">
              Your prompt is ready to paste into Claude Code or Codex.
            </h3>
            <p className="mt-4 text-[15px] leading-7 text-[#FCF4EB]/70">
              Every week I&apos;m building new free skills like this one, sometimes a few at a time. There&apos;s also a book and a couple of courses I&apos;m currently creating. Drop your email and I&apos;ll send everything over as it comes out. Unsubscribe anytime.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
              <input
                ref={inputRef}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@yourdomain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'submitting'}
                className="w-full rounded-xl border border-white/12 bg-black/40 px-4 py-3 text-[15px] text-[#FCF4EB] placeholder:text-[#FCF4EB]/30 focus:border-[#8B79D4] focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex items-center justify-center rounded-xl bg-[#7C69C7] px-6 py-3.5 text-[15px] font-bold text-[#FCF4EB] transition hover:bg-[#6e5db8] active:scale-[0.98] disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending...' : 'Send me future skills'}
              </button>
              {errorMsg ? (
                <p className="text-[13px] text-[#F5C3C6]">{errorMsg}</p>
              ) : null}
            </form>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 text-[15px] font-medium text-[#FCF4EB]/55 underline-offset-2 transition hover:text-[#FCF4EB]/85 hover:underline"
            >
              No thanks, I&apos;m good.
            </button>
          </>
        )}
      </div>
    </div>
  )
}
