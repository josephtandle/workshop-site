'use client'

import { useState } from 'react'
import ProTip from '@/components/ProTip'
import { celebrate } from '@/lib/celebrate'

const ITEMS = [
  { id: 'descript-account',   label: 'Create a free Descript account (if you don\'t already have one)', required: true, anchor: '#descript-account' },
  { id: 'content-ready',      label: 'Have your long-form content ready',        required: true,  anchor: '#content-ready'      },
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

export default function Session7Prep() {
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
          Before Session Seven
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
          Prep Requirements
        </h1>
        <p className="text-[#FCF4EB]/70 text-base sm:text-lg leading-relaxed mb-6">
          Two things to do before you arrive: create a free Descript account and have one piece
          of long-form content ready. Both take under five minutes.
        </p>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4">
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
            No content of your own? A backup podcast episode is provided below.
            It takes two minutes to download and works just as well for the session.
          </p>
        </div>
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

        {/* 1. Descript account */}
        <SectionCard
          id="descript-account"
          number={1}
          title="Create a free Descript account (if you don't already have one)"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('descript-account')}
          onToggle={() => toggle('descript-account')}
        >
          <p>
            Descript is free to start and no credit card is required. Create your account
            before the session so you can follow along from the first minute.
          </p>

          <a
            href="https://get.descript.com/ib44r8t9noyj"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white/[0.05] border border-white/[0.10] hover:border-[#7C69C7]/50 rounded-xl px-5 py-4 transition-all duration-150 group"
          >
            <div className="w-9 h-9 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/40 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2.5 11.5l9-9M5 2.5h6.5v6.5" stroke="#9D8FE0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#FCF4EB] font-semibold text-sm group-hover:text-[#9D8FE0] transition-colors">
                Create your free Descript account
              </p>
              <p className="text-[#FCF4EB]/40 text-xs mt-0.5">
                get.descript.com
              </p>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 text-[#FCF4EB]/30 group-hover:text-[#7C69C7] transition-colors">
              <path d="M2.5 11.5l9-9M5 2.5h6.5v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          <ProTip type="tip">
            Sign up and sign in before the session. You do not need to explore the app yet.
            We will walk through everything together.
          </ProTip>
        </SectionCard>

        {/* 2. Long-form content */}
        <SectionCard
          id="content-ready"
          number={2}
          title="Have your long-form content ready"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('content-ready')}
          onToggle={() => toggle('content-ready')}
        >
          <p>
            You will use this content as your working example during the session. It can be
            anything you have recorded or published, as long as it is over 10 minutes long.
          </p>

          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">What works:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>A podcast episode you recorded</li>
              <li>A keynote, talk, or presentation</li>
              <li>A webinar, coaching call, or interview</li>
              <li>Any speech or long video you have saved</li>
            </ul>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 space-y-1">
            <p className="text-[#FCF4EB] font-semibold text-sm">File format</p>
            <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
              Audio or video both work: .mp3, .m4a, .wav, .mp4, or .mov. If you have it on your
              phone, move it to your laptop before the session.
            </p>
          </div>

          <ProTip type="tip">
            Use your own content if you can. The session will be more useful to you when the
            example is something you actually made.
          </ProTip>

          {/* Inline backup option */}
          <div className="border-t border-white/[0.08] pt-4">
            <p className="text-[#FCF4EB]/50 text-sm mb-3">
              Don't have any long-form content? Download one of my podcasts for the session demo.
            </p>
            <a
              href="https://media.mastermindshq.business/podcast/adam-roa-podcast.mp4"
              download
              className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] hover:border-[#7C69C7]/40 rounded-xl px-4 py-3 transition-all duration-150 group"
            >
              <div className="w-8 h-8 rounded-full bg-[#7C69C7]/15 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v8m0 0l-3-3m3 3l3-3M3 12h10" stroke="#9D8FE0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#FCF4EB]/70 font-medium text-sm group-hover:text-[#9D8FE0] transition-colors">
                  Download: Adam Roa interview (MP4)
                </p>
              </div>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 text-[#FCF4EB]/20 group-hover:text-[#7C69C7] transition-colors">
                <path d="M2.5 11.5l9-9M5 2.5h6.5v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </SectionCard>

      </div>

      {/* Footer note */}
      <div className="mt-14 border-t border-white/[0.08] pt-8">
        <p className="text-[#FCF4EB]/40 text-sm leading-relaxed text-center">
          That is all you need. See you at the session.
        </p>
      </div>

    </div>
  )
}
