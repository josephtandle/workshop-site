'use client'

import { useState } from 'react'
import ProTip from '@/components/ProTip'
import { celebrate } from '@/lib/celebrate'

const ITEMS = [
  { id: 'gather', label: 'Gather your current messaging', required: true, anchor: '#gather' },
  { id: 'baseline', label: 'Run the AI Description Test baseline', required: true, anchor: '#baseline' },
]

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-checked={checked}
      role="checkbox"
      className={`flex-shrink-0 w-5 h-5 rounded border transition-all duration-150 flex items-center justify-center ${
        checked
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
  id,
  number,
  title,
  time,
  checked,
  onToggle,
  children,
}: {
  id: string
  number: number
  title: string
  time: string
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
            <span className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap bg-[#7C69C7]/20 text-[#9D8FE0]">
              Required
            </span>
          </div>
          <p className="text-[#FCF4EB]/40 text-xs">{time}</p>
        </div>
        <Checkbox checked={checked} onChange={onToggle} />
      </div>

      <div className="space-y-4 text-[#FCF4EB]/70 text-sm leading-relaxed">{children}</div>

      <button
        onClick={onToggle}
        className={`mt-6 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border ${
          checked
            ? 'bg-[#7C69C7]/20 border-[#7C69C7]/40 text-[#9D8FE0]'
            : 'bg-white/[0.04] border-white/[0.10] text-[#FCF4EB]/50 hover:border-[#7C69C7]/40 hover:text-[#FCF4EB]/80'
        }`}
      >
        {checked ? 'Done' : 'Mark as done'}
      </button>
    </div>
  )
}

export default function Session10Prep() {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setChecked((prev) => {
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
          Before Session Ten
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
          Get Your Messaging Ready
        </h1>
        <p className="text-[#FCF4EB]/70 text-base sm:text-lg leading-relaxed">
          Two short tasks before the session. They take less than ten minutes total and will make the opening exercise much more meaningful.
        </p>
        <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mt-4">
          No special tools needed. Just your current messaging and five minutes with Claude.
        </p>
      </div>

      <div className="mb-12 bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 sm:px-6 py-5">
        <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-4">On This Page</p>
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
          id="gather"
          number={1}
          title="Gather your current messaging"
          time="About 3 minutes"
          checked={checked.has('gather')}
          onToggle={() => toggle('gather')}
        >
          <p>At the start of the session, we run the AI Description Test on your existing materials. Have them ready before you arrive.</p>
          <p className="text-[#FCF4EB] font-semibold">Gather one of the following:</p>
          <ul className="list-disc list-inside space-y-2 text-[#FCF4EB]/65">
            <li>Your website homepage headline and subheadline</li>
            <li>Your LinkedIn bio or About section</li>
            <li>Your main offer description from a sales page, proposal, or recent social post</li>
          </ul>
          <p>You only need one. The goal is to have your current best attempt at describing what you do somewhere you can paste quickly.</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Open your website, LinkedIn, or wherever your main description lives.</li>
            <li>Copy the text that best describes what you do, who you serve, and what outcome you deliver.</li>
            <li>Paste it into a notes app or Google Doc you can access easily during the session.</li>
          </ol>
          <ProTip type="info">
            If your messaging is spread across multiple places and they all say something slightly different, that is not a problem. That is exactly what this series is designed to fix.
          </ProTip>
        </SectionCard>

        <SectionCard
          id="baseline"
          number={2}
          title="Run the AI Description Test as your baseline"
          time="About 5 minutes"
          checked={checked.has('baseline')}
          onToggle={() => toggle('baseline')}
        >
          <p>Run the test once before the session so you have a clear before picture. You will run it again at the end of the series.</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Open Claude at <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">claude.ai</a>.</li>
            <li>Paste in your current messaging from Task 1.</li>
            <li>Send this prompt exactly:</li>
          </ol>
          <div className="bg-black/30 border border-white/[0.08] rounded-xl px-5 py-4 font-mono text-sm text-[#FCF4EB]/80 whitespace-pre-wrap">
            Describe what I do, who I serve, and what makes me different from others in my space. Base your answer only on the text I just gave you.
          </div>
          <ol className="list-decimal list-inside space-y-2" start={4}>
            <li>Read the output. Screenshot it or copy it into a document.</li>
            <li>Save it and label it: &quot;Baseline - [date].&quot; You will not need it until Part 3.</li>
          </ol>
          <ProTip type="tip">
            The output will probably feel flat or generic. That is normal. You are not testing Claude. You are capturing a baseline so you can see how far your positioning moves.
          </ProTip>
          <ProTip type="warning">
            Do not adjust your messaging before the session. The baseline needs to reflect where you are right now.
          </ProTip>
        </SectionCard>
      </div>
    </div>
  )
}
