'use client'

import { useState } from 'react'
import ProTip from '@/components/ProTip'
import { celebrate } from '@/lib/celebrate'

const ITEMS = [
  { id: 'update-claude',   label: 'Update Claude Code to the latest version', required: true, anchor: '#update-claude' },
  { id: 'confirm-plan',    label: 'Confirm you are on Pro or Max plan',        required: true, anchor: '#confirm-plan' },
  { id: 'macos-check',     label: 'Confirm you are on macOS Monterey or later', required: true, anchor: '#macos-check' },
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

export default function Session8Prep() {
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

      <div className="mb-10">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Before Session Eight
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
          Prep Requirements
        </h1>
        <p className="text-[#FCF4EB]/70 text-base sm:text-lg leading-relaxed mb-6">
          Three quick checks before you arrive. The whole thing takes under five minutes.
        </p>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4">
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
            Computer-use requires macOS and a Pro or Max plan. If you are on the free plan,
            upgrade before the session so you can follow along from the first minute.
          </p>
        </div>
      </div>

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

      <div className="space-y-6">

        <SectionCard
          id="update-claude"
          number={1}
          title="Update Claude Code to the latest version"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('update-claude')}
          onToggle={() => toggle('update-claude')}
        >
          <p>
            Computer-use requires Claude Code version 2.1.85 or later. Open your terminal and run the update command below.
          </p>
          <div className="bg-black/30 border border-white/[0.08] rounded-xl px-5 py-4 font-mono text-sm text-[#FCF4EB]/80">
            claude update
          </div>
          <p>
            After it finishes, run <span className="font-mono text-[#FCF4EB]/80">claude --version</span> to confirm you are on 2.1.85 or higher.
          </p>
          <ProTip type="tip">
            If you see "command not found" when running claude, you need to install Claude Code first.
            Ask in the group chat and someone will get you sorted before the session.
          </ProTip>
        </SectionCard>

        <SectionCard
          id="confirm-plan"
          number={2}
          title="Confirm you are on Pro or Max plan"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('confirm-plan')}
          onToggle={() => toggle('confirm-plan')}
        >
          <p>
            Computer-use is only available on the Pro and Max plans. Check your plan at{' '}
            <a
              href="https://claude.ai/settings/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2"
            >
              claude.ai/settings/billing
            </a>.
          </p>
          <p>
            If you are on the free plan, upgrade before the session. Pro is $20/month and includes everything we use in the Mastermind.
          </p>
          <ProTip type="warning">
            Web Fetch works on all plans. Computer-use does not. If you cannot upgrade before the session,
            you can still follow along for the Web Fetch portion and enable computer-use later.
          </ProTip>
        </SectionCard>

        <SectionCard
          id="macos-check"
          number={3}
          title="Confirm you are on macOS Monterey or later"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('macos-check')}
          onToggle={() => toggle('macos-check')}
        >
          <p>
            Computer-use on the CLI is macOS only. Windows users can use computer-use via the Claude desktop app,
            but the setup is slightly different. We will cover both paths in the session.
          </p>
          <p>
            To check your macOS version: click the Apple menu in the top left, then "About This Mac."
            You need Monterey (12.0) or later.
          </p>
        </SectionCard>

      </div>

      <div className="mt-14 border-t border-white/[0.08] pt-8">
        <p className="text-[#FCF4EB]/40 text-sm leading-relaxed text-center">
          That is all you need. See you at the session.
        </p>
      </div>

      <p className="text-center text-xs text-white/20 pb-8">
        Using Codex instead of Claude Code?{' '}
        <a href="/session/2/guide-codex" className="underline hover:text-white/50 transition-colors">Codex version of this page</a>
      </p>

    </div>
  )
}
