'use client'

import { useState } from 'react'
import ProTip from '@/components/ProTip'
import { celebrate } from '@/lib/celebrate'

const ITEMS = [
  { id: 'content',  label: 'Write Down Your Content',        required: true,  anchor: '#content'  },
  { id: 'photo',    label: 'Gather Your Photos',              required: true,  anchor: '#photo'    },
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
  badge: { label: string; required: boolean }
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
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-9 h-9 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/40 flex items-center justify-center text-[#7C69C7] font-bold text-sm flex-shrink-0 mt-0.5">
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-[#FCF4EB] font-bold text-xl leading-snug">{title}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
              badge.required
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

      {/* Mark done button */}
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

export default function Session2Prep() {
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

      {/* Page Header */}
      <div className="mb-10">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Before Session Two
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
          Prep Requirements
        </h1>
        <p className="text-[#FCF4EB]/70 text-base sm:text-lg leading-relaxed mb-6">
          Complete these two steps before the session. Total time: about 10 minutes.
          We will handle all the technical setup together during the live session.
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
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                item.required
                  ? 'bg-[#7C69C7]/20 text-[#9D8FE0]'
                  : 'bg-white/[0.06] text-[#FCF4EB]/40'
              }`}>
                {item.required ? 'Required' : 'Optional'}
              </span>
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

      {/* Sections */}
      <div className="space-y-6">

        {/* 1. Your Content */}
        <SectionCard
          id="content"
          number={1}
          title="Write Down Your Content"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('content')}
          onToggle={() => toggle('content')}
        >
          <p>
            <span className="text-[#FCF4EB] font-semibold">What this is for:</span> During the session,
            you will give Claude all of this information and it will build your personal brand page
            automatically. Write it down in advance so you are not scrambling to remember things on the call.
          </p>

          <p>Open a notes app or a Google Doc and write down these six things:</p>

          <ol className="space-y-4 mt-2">
            <li className="flex gap-3">
              <span className="text-[#7C69C7] font-bold flex-shrink-0">1.</span>
              <div>
                <p className="text-[#FCF4EB] font-medium">Your name</p>
                <p className="text-[#FCF4EB]/50 text-xs mt-0.5">The name you want displayed on your page.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#7C69C7] font-bold flex-shrink-0">2.</span>
              <div>
                <p className="text-[#FCF4EB] font-medium">One sentence about what you do and who you help</p>
                <p className="text-[#FCF4EB]/50 text-xs mt-0.5">
                  Example: &ldquo;I help women feel powerful in their bodies.&rdquo; Keep it short and specific.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#7C69C7] font-bold flex-shrink-0">3.</span>
              <div>
                <p className="text-[#FCF4EB] font-medium">Your three services</p>
                <p className="text-[#FCF4EB]/50 text-xs mt-0.5">
                  A name and one-line description for each. You will get three cards on the page, one per service.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#7C69C7] font-bold flex-shrink-0">4.</span>
              <div>
                <p className="text-[#FCF4EB] font-medium">Your CTA link</p>
                <p className="text-[#FCF4EB]/50 text-xs mt-0.5">
                  This is the link your &ldquo;Book Now&rdquo; or &ldquo;Get in Touch&rdquo; button will point to.
                  Use your booking link, your WhatsApp number, or your email address.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#7C69C7] font-bold flex-shrink-0">5.</span>
              <div>
                <p className="text-[#FCF4EB] font-medium">Your brand colors</p>
                <p className="text-[#FCF4EB]/50 text-xs mt-0.5">
                  If you have specific hex codes or brand colors, note them down. If not, just pick a vibe:{' '}
                  <span className="text-[#FCF4EB]/70">dark and moody</span>,{' '}
                  <span className="text-[#FCF4EB]/70">bright and energetic</span>, or{' '}
                  <span className="text-[#FCF4EB]/70">soft and minimal</span>.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-[#7C69C7] font-bold flex-shrink-0">6.</span>
              <div>
                <p className="text-[#FCF4EB] font-medium">A photo of yourself</p>
                <p className="text-[#FCF4EB]/50 text-xs mt-0.5">
                  We will pick one together during the session. See the next step for how to prepare.
                </p>
              </div>
            </li>
          </ol>

          <ProTip type="tip">
            The more specific your tagline, the better your page will feel. &ldquo;I help busy mums lose
            weight without giving up their favourite foods&rdquo; is far stronger than &ldquo;I help people get healthy.&rdquo;
            Specificity builds trust instantly.
          </ProTip>
        </SectionCard>

        {/* 2. Your Photo */}
        <SectionCard
          id="photo"
          number={2}
          title="Gather Your Photos"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('photo')}
          onToggle={() => toggle('photo')}
        >
          <p>
            Gather a few photos of yourself and put them somewhere easy to find — your desktop or
            Downloads folder works perfectly. Having options is better than having one. You will pick
            the best one together during the session.
          </p>

          <p>
            Any mix of headshots, candid shots, or photos that represent you well is great.
            Quality matters more than perfection — clear and well-lit is all you need.
          </p>

          <ProTip type="info">
            Your photos do not need to be professional. Clear selfies work perfectly.
            We will choose and add one to your page together during the session.
          </ProTip>
        </SectionCard>

      </div>

      {/* Footer note */}
      <div className="mt-14 border-t border-white/[0.08] pt-8">
        <p className="text-[#FCF4EB]/40 text-sm leading-relaxed text-center">
          That is everything. We will handle the rest together during the session.
        </p>
      </div>

      <p className="text-center text-xs text-white/20 pb-8">
        Using Codex instead of Claude Code?{' '}
        <a href="/session/2/guide-codex" className="underline hover:text-white/50 transition-colors">Codex version of this page</a>
      </p>

    </div>
  )
}
