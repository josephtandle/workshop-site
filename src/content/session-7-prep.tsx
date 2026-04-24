'use client'

import { useState } from 'react'
import ProTip from '@/components/ProTip'
import { celebrate } from '@/lib/celebrate'

const ITEMS = [
  { id: 'node-installed',    label: 'Confirm Node.js is installed',        required: true,  anchor: '#node-installed'    },
  { id: 'claude-working',    label: 'Confirm Claude Code is still working', required: true,  anchor: '#claude-working'    },
  { id: 'terminal-ready',    label: 'Have your terminal ready to go',       required: true,  anchor: '#terminal-ready'    },
  { id: 'task-ideas',        label: 'Think of 3 real tasks to add',         required: false, anchor: '#task-ideas'        },
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
          This session involves installing something new, so your terminal and Node.js need to
          be working before you arrive. Two quick checks and you are set.
        </p>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4">
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
            If either check fails, message the group before the session. Do not wait until you
            are live on the call to troubleshoot it.
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

        {/* 1. Node.js */}
        <SectionCard
          id="node-installed"
          number={1}
          title="Confirm Node.js is installed"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('node-installed')}
          onToggle={() => toggle('node-installed')}
        >
          <p>
            <span className="text-[#FCF4EB] font-semibold">Why it matters:</span> Mission Control
            is a Node.js application. You installed Node.js back in Session 2, so it should
            already be there. This check confirms it is still working.
          </p>

          <p>Open your terminal and run this command:</p>

          <div className="bg-[#0d0d0f] border border-white/[0.08] rounded-xl p-4 font-mono text-sm text-[#FCF4EB]/80 leading-relaxed">
            node --version
          </div>

          <p>
            You should see a version number like{' '}
            <code className="bg-white/[0.08] px-1.5 py-0.5 rounded">v20.11.0</code> or similar.
            Any version from v18 onward is fine. If the command is not found, go back to the
            Session 2 guide and reinstall Node.js before the session.
          </p>

          <ProTip type="info">
            The exact version number does not matter as long as it is v18 or higher. If you
            see a number, Node.js is installed and working.
          </ProTip>
        </SectionCard>

        {/* 2. Claude Code */}
        <SectionCard
          id="claude-working"
          number={2}
          title="Confirm Claude Code is still working"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('claude-working')}
          onToggle={() => toggle('claude-working')}
        >
          <p>
            <span className="text-[#FCF4EB] font-semibold">Why it matters:</span> You will use
            Claude Code during the session to write card descriptions and later to wire up the
            AI automation. Make sure it is responding before you arrive.
          </p>

          <p>In your terminal, run:</p>

          <div className="bg-[#0d0d0f] border border-white/[0.08] rounded-xl p-4 font-mono text-sm text-[#FCF4EB]/80 leading-relaxed">
            claude --version
          </div>

          <p>
            You should see a version number. Then open a Claude Code session and type anything
            short, just to confirm it responds. If Claude Code has not been used in a while it
            may prompt you to log in again. Do that now so you are not doing it live during the session.
          </p>

          <ProTip type="tip">
            If Claude Code asks you to authenticate, run{' '}
            <code className="bg-white/[0.08] px-1.5 py-0.5 rounded">claude</code> in your
            terminal and follow the login steps. It takes about two minutes.
          </ProTip>
        </SectionCard>

        {/* 3. Terminal ready */}
        <SectionCard
          id="terminal-ready"
          number={3}
          title="Have your terminal app ready to go"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('terminal-ready')}
          onToggle={() => toggle('terminal-ready')}
        >
          <p>
            This session starts with a terminal command to clone the repo and run the install
            script. Have your terminal application open and ready before the session starts.
          </p>

          <div className="space-y-2">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-1">On Mac: Terminal</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                Press{' '}
                <code className="bg-white/[0.08] px-1.5 py-0.5 rounded">Cmd + Space</code>,
                type{' '}
                <code className="bg-white/[0.08] px-1.5 py-0.5 rounded">Terminal</code>,
                and hit Enter. Or use iTerm2 if you have it.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-1">On Windows: Windows Terminal</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                Search for &ldquo;Windows Terminal&rdquo; in the Start menu. If you have not installed
                it, get it from the{' '}
                <a
                  href="https://aka.ms/terminal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7C69C7] hover:underline"
                >
                  Microsoft Store
                </a>
                . It is free.
              </p>
            </div>
          </div>

          <ProTip type="info">
            You do not need anything special. The default terminal that came with your computer
            works perfectly fine.
          </ProTip>
        </SectionCard>

        {/* 4. Task ideas */}
        <SectionCard
          id="task-ideas"
          number={4}
          title="Think of 3 real tasks to add"
          badge={{ label: 'Optional', required: false }}
          checked={checked.has('task-ideas')}
          onToggle={() => toggle('task-ideas')}
        >
          <p>
            In this session you will add real cards to your Mission Control board. Coming in with
            a few task ideas makes the session move faster and the board immediately useful to you.
          </p>

          <p>
            Think about tasks that are currently in your head or scattered across different apps.
            Pick three things you have been meaning to do for your business and jot them down
            before the session.
          </p>

          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">Good candidates:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Something you keep forgetting to do and it comes back to mind every few days</li>
              <li>A task that needs a human to do it, not Claude: a call, a decision, a conversation</li>
              <li>Something you could eventually hand off to Claude if the description were specific enough</li>
            </ul>
          </div>

          <ProTip type="tip">
            The third type is the most valuable one to think about before the session. Identifying
            tasks that are repeatable and describable is the foundation of everything you will
            build in Session 8.
          </ProTip>
        </SectionCard>

      </div>

      {/* Footer note */}
      <div className="mt-14 border-t border-white/[0.08] pt-8">
        <p className="text-[#FCF4EB]/40 text-sm leading-relaxed text-center">
          If either required check fails before the session, message the group. Do not try to
          troubleshoot alone during the call.
        </p>
      </div>

    </div>
  )
}
