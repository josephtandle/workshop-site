'use client'

import { useState } from 'react'
import ProTip from '@/components/ProTip'
import { celebrate } from '@/lib/celebrate'
import StickyVideoPlayer from '@/components/StickyVideoPlayer'

const ITEMS = [
  { id: 'claude',  label: 'Claude Pro Account',       required: true, anchor: '#claude'  },
  { id: 'vercel',  label: 'Create a Vercel Account',  required: true, anchor: '#vercel'  },
  { id: 'video',   label: 'Watch the Welcome Video',  required: true, anchor: '#video'   },
]

const WELCOME_VIDEO_SRC = 'https://media.mastermindshq.business/videos/mastermind-welcome-setup.mp4'

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

export default function Session1Prep() {
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
          Before Session One
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
          Prep Requirements
        </h1>
        <p className="text-[#FCF4EB]/70 text-base sm:text-lg leading-relaxed mb-6">
          Complete these three steps before Session One. Total time: about 10 minutes. We will handle all the technical setup together during the live session.
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

        {/* 1. Claude Pro */}
        <SectionCard
          id="claude"
          number={1}
          title="Claude Pro Account"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('claude')}
          onToggle={() => toggle('claude')}
        >
          <p>
            <span className="text-[#FCF4EB] font-semibold">What it is:</span> Claude Pro is the paid
            version of Claude AI. It is required to use Claude Code, which is the tool we use to build
            your website during the session. The free version of Claude does not include Claude Code access.
          </p>

          <p>
            Claude Pro costs $20 per month. You can cancel any time.
          </p>

          <ol className="space-y-3 list-decimal list-inside">
            <li>
              Go to{' '}
              <a href="https://claude.ai/upgrade" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline font-medium">
                claude.ai/upgrade
              </a>
            </li>
            <li>Sign in or create a free Claude account if you do not have one</li>
            <li>Click &ldquo;Upgrade to Pro&rdquo; and complete the payment</li>
            <li>Confirm you can log in to your Claude account before the session</li>
          </ol>

          <ProTip type="info">
            Claude Pro is enough for this session. If you get into heavy daily use later,
            there is a higher-tier plan available but you do not need it now.
          </ProTip>
        </SectionCard>

        {/* 2. Vercel */}
        <SectionCard
          id="vercel"
          number={2}
          title="Create a Vercel Account"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('vercel')}
          onToggle={() => toggle('vercel')}
        >
          <p>
            <span className="text-[#FCF4EB] font-semibold">What it is:</span> Vercel is the platform
            that puts your website on the internet. At the end of Session Two, you will run one command
            and Vercel will give you a live URL you can share with anyone. It is completely free.
          </p>

          <ol className="space-y-3 list-decimal list-inside">
            <li>
              Go to{' '}
              <a href="https://vercel.com/signup" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline font-medium">
                vercel.com/signup
              </a>
            </li>
            <li>
              Sign up with Google (recommended — one click if you are already logged into Gmail) or
              with your email and a password
            </li>
            <li>If you signed up with email, check your inbox and click the verification link</li>
            <li>Make sure your email is verified before the session — Vercel requires this before you can go live</li>
          </ol>

          <ProTip type="info">
            The free plan covers everything you need. Unlimited projects, unlimited deployments,
            and custom domain support — all at no cost.
          </ProTip>
        </SectionCard>

        {/* 3. Welcome Video */}
        <SectionCard
          id="video"
          number={3}
          title="Watch the Welcome Video"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('video')}
          onToggle={() => toggle('video')}
        >
          <p>
            <span className="text-[#FCF4EB] font-semibold">What it is:</span> A short welcome video
            that walks you through what to expect in Session One and how to get the most out of
            the workshop. Watch it before we go live.
          </p>

          <p>Hit play below. The video will follow you as you scroll.</p>

          <div className="mt-4">
            <StickyVideoPlayer src={WELCOME_VIDEO_SRC} title="Mastermind Welcome and Setup" />
          </div>
        </SectionCard>

      </div>

      {/* Footer note */}
      <div className="mt-14 border-t border-white/[0.08] pt-8">
        <p className="text-[#FCF4EB]/40 text-sm leading-relaxed text-center">
          That is everything. We will handle the rest together during the session.
        </p>
      </div>
    </div>
  )
}
