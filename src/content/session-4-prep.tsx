'use client'

import { useState } from 'react'
import { celebrate } from '@/lib/celebrate'

const ITEMS = [
  { id: 'creators', label: 'Find your Instagram inspiration', anchor: '#creators' },
  { id: 'audience', label: 'Define your audience and content focus', anchor: '#audience' },
]

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-checked={checked}
      role="checkbox"
      className={`flex-shrink-0 w-5 h-5 rounded border transition-all duration-150 flex items-center justify-center
        ${checked
          ? 'bg-[#7C69C7] border-[#7C69C7]'
          : 'bg-white/[0.04] border-white/20 hover:border-[#7C69C7]/60'
        }`}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4l2.5 2.5L9 1" stroke="#FCF4EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

function SectionCard({
  id, number, title, badge, checked, onToggle, children,
}: {
  id: string
  number: number
  title: string
  badge: { label: string; color: 'purple' | 'muted' }
  checked: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div
      id={id}
      className={`bg-white/[0.05] border rounded-2xl p-6 sm:p-8 transition-all duration-200 ${
        checked ? 'border-[#7C69C7]/40 bg-white/[0.07]' : 'border-white/[0.10]'
      }`}
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="w-9 h-9 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/40 flex items-center justify-center text-[#7C69C7] font-bold text-sm flex-shrink-0 mt-0.5">
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-[#FCF4EB] font-bold text-xl leading-snug">{title}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
              badge.color === 'purple'
                ? 'bg-[#7C69C7]/20 text-[#9D8FE0]'
                : 'bg-white/[0.06] text-[#FCF4EB]/40'
            }`}>
              {badge.label}
            </span>
          </div>
        </div>
        <Checkbox checked={checked} onChange={onToggle} />
      </div>

      <div className="space-y-4 text-[#FCF4EB]/70 text-sm leading-relaxed">
        {children}
      </div>

      <button
        onClick={onToggle}
        className={`mt-6 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border ${
          checked
            ? 'bg-[#7C69C7]/20 border-[#7C69C7]/40 text-[#9D8FE0]'
            : 'bg-white/[0.04] border-white/[0.10] text-[#FCF4EB]/50 hover:border-[#7C69C7]/40 hover:text-[#FCF4EB]/80'
        }`}
      >
        {checked ? '✓ Done' : 'Mark as done'}
      </button>
    </div>
  )
}

export default function Session4Prep() {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        celebrate()
      }
      return next
    })
  }

  const allDone = checked.size === ITEMS.length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

      {/* Page Header */}
      <div className="mb-10">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Before Session Five
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
          Prepare for Hook Writing Project
        </h1>
        <p className="text-[#FCF4EB]/70 text-base sm:text-lg leading-relaxed mb-6">
          This session we are going to write real Instagram hooks for your business using AI.
          Do this research before you show up so we can move fast and make them actually good.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="mb-12 bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 sm:px-6 py-5">
        <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-4">
          On This Page
        </p>
        <ol className="space-y-3">
          {ITEMS.map((item, i) => (
            <li key={item.id} className="flex items-center gap-3">
              <Checkbox checked={checked.has(item.id)} onChange={() => toggle(item.id)} />
              <span className="text-[#FCF4EB]/30 text-sm w-4 flex-shrink-0">{i + 1}.</span>
              <a
                href={item.anchor}
                className={`text-sm flex-1 transition-colors ${
                  checked.has(item.id)
                    ? 'text-[#FCF4EB]/40 line-through'
                    : 'text-[#FCF4EB]/70 hover:text-[#7C69C7]'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>

        {/* Progress bar */}
        <div className="mt-5 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#FCF4EB]/40 text-xs">Progress</span>
            <span className="text-[#FCF4EB]/40 text-xs">{checked.size} of {ITEMS.length}</span>
          </div>
          <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7C69C7] rounded-full transition-all duration-300"
              style={{ width: `${(checked.size / ITEMS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* All Done Banner */}
      {allDone && (
        <div className="mb-10 rounded-2xl px-6 py-5 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(124,105,199,0.20) 0%, rgba(245,195,198,0.15) 100%)', border: '1px solid rgba(124,105,199,0.30)' }}>
          <p className="text-xl font-bold text-[#FCF4EB] mb-1">You are ready.</p>
          <p className="text-[#FCF4EB]/60 text-sm">See you at the session.</p>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-6">

        {/* 1. Instagram Inspiration */}
        <SectionCard
          id="creators"
          number={1}
          title="Find your Instagram inspiration"
          badge={{ label: 'Before the session', color: 'purple' }}
          checked={checked.has('creators')}
          onToggle={() => toggle('creators')}
        >
          <p>
            Find two or three Instagram creators who are in your niche, have under 500,000 followers,
            and are doing really well on the platform. These are people whose hooks you genuinely admire
            and whose content stops you mid-scroll.
          </p>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4 space-y-2">
            <p className="text-[#FCF4EB]/70 text-sm font-semibold">What to look for:</p>
            <ul className="space-y-2 ml-2">
              {[
                'They are in your niche or adjacent to it',
                'Under 500,000 followers — smaller accounts often have stronger, more intentional hooks',
                'Their Reels and posts consistently get strong engagement relative to their size',
                'Their hooks make you want to keep watching or reading',
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#7C69C7] mt-0.5 flex-shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <p>
            Save their profile URLs and note two or three specific posts or Reels with hooks you respect.
            We will use these as reference material to understand what works in your space.
          </p>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4">
            <p className="text-[#FCF4EB]/50 text-xs font-semibold uppercase tracking-wide mb-2">Bring to the session</p>
            <ul className="space-y-1.5 text-sm text-[#FCF4EB]/65">
              <li>2-3 creator profile URLs</li>
              <li>Links to specific posts or Reels whose hooks you admire</li>
            </ul>
          </div>
        </SectionCard>

        {/* 2. Audience and Content Focus */}
        <SectionCard
          id="audience"
          number={2}
          title="Define your audience and content focus"
          badge={{ label: 'Before the session', color: 'muted' }}
          checked={checked.has('audience')}
          onToggle={() => toggle('audience')}
        >
          <p>
            Good hooks are specific. The more clearly you know who you are talking to and what you
            want to say, the better the hooks we can write together. Take a few minutes to write
            down answers to these three things.
          </p>

          <div className="space-y-4">
            {[
              {
                number: 1,
                label: 'Your target audience',
                detail: 'Who exactly are you trying to reach? Be as specific as you can. Not just "women" or "entrepreneurs" but something like "service-based business owners who want more clients without more ads."',
              },
              {
                number: 2,
                label: 'What that audience wants',
                detail: 'What is the outcome they are chasing? What do they lie awake thinking about? What would feel like a win for them?',
              },
              {
                number: 3,
                label: 'One thing you love creating content about',
                detail: 'If you had to pick one topic, angle, or idea that you genuinely enjoy talking about, what is it? This is the lens we will write your hooks through.',
              },
            ].map((item) => (
              <div key={item.number} className="flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center text-[#7C69C7] text-xs font-bold flex-shrink-0 mt-0.5">
                  {item.number}
                </div>
                <div>
                  <p className="text-[#FCF4EB] font-semibold text-sm mb-1">{item.label}</p>
                  <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4">
            <p className="text-[#FCF4EB]/50 text-xs font-semibold uppercase tracking-wide mb-2">Bring to the session</p>
            <p className="text-[#FCF4EB]/65 text-sm">
              A short written answer to each of the three points above. A few sentences is enough.
              You do not need to have it perfect.
            </p>
          </div>
        </SectionCard>

      </div>

      {/* Footer note */}
      <div className="mt-14 border-t border-white/[0.08] pt-8">
        <p className="text-[#FCF4EB]/40 text-sm leading-relaxed text-center">
          The more specific your answers, the better your hooks will be. Come ready to work.
        </p>
      </div>
    </div>
  )
}
