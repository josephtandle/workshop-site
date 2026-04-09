'use client'

import { useState } from 'react'
import ProTip from '@/components/ProTip'
import ScreenshotCard from '@/components/ScreenshotCard'
import { celebrate } from '@/lib/celebrate'

const ITEMS = [
  { id: 'chatgpt', label: 'Export from ChatGPT', anchor: '#chatgpt' },
  { id: 'claude',  label: 'Export from Claude',  anchor: '#claude'  },
  { id: 'urls',    label: 'Gather your online presence', anchor: '#urls' },
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

export default function Session5Prep() {
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

      {/* Page Header */}
      <div className="mb-10">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Before Session Five
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
          Get Your Brain Dump Ready
        </h1>
        <p className="text-[#FCF4EB]/70 text-base sm:text-lg leading-relaxed mb-6">
          Do these steps at least two days before the session.
          The export emails from ChatGPT and Claude can take up to 48 hours to arrive.
        </p>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4">
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
            Don&apos;t have ChatGPT? Don&apos;t use Claude much yet? No problem.
            Even one export file is enough to get started. Do what you can.
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

        {/* 1. ChatGPT Export */}
        <SectionCard
          id="chatgpt"
          number={1}
          title="Export from ChatGPT"
          badge={{ label: 'Do this 2 days early', color: 'purple' }}
          checked={checked.has('chatgpt')}
          onToggle={() => toggle('chatgpt')}
        >
          <p>
            ChatGPT has a built-in export tool. It emails you a download link within 24-48 hours,
            so request it now.
          </p>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4">
            <p className="text-[#FCF4EB]/50 text-xs mb-3 font-semibold uppercase tracking-wide">Don&apos;t have ChatGPT? Skip this section.</p>
          </div>

          <ol className="space-y-3 list-decimal list-inside">
            <li>
              Go to{' '}
              <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline font-medium">
                chatgpt.com
              </a>
              {' '}and log in
            </li>
            <li>Click your profile icon in the bottom-left corner, then click <strong className="text-[#FCF4EB]">Settings</strong></li>
            <li>In the sidebar, click <strong className="text-[#FCF4EB]">Data controls</strong></li>
            <li>Scroll to the bottom and click the <strong className="text-[#FCF4EB]">Export</strong> button next to &ldquo;Export data&rdquo;</li>
          </ol>

          <ScreenshotCard
            src="/screenshots/chatgpt-data-controls.png"
            alt="ChatGPT Data controls settings panel showing the Export data button"
            caption="The Export button is at the very bottom of the Data controls panel"
          />

          <ol className="space-y-3 list-decimal list-inside" start={5}>
            <li>A confirmation email will arrive in your inbox within a few minutes to a few hours</li>
            <li>When the email arrives: click the download link, then unzip the file you receive</li>
            <li>Inside the zip you will find a file called <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">conversations.json</code> — keep this handy for the session</li>
          </ol>

          <ProTip type="info">
            The download link in the email expires after 24 hours. Download the file as soon as it arrives.
          </ProTip>
        </SectionCard>

        {/* 2. Claude Export */}
        <SectionCard
          id="claude"
          number={2}
          title="Export from Claude"
          badge={{ label: 'Do this 2 days early', color: 'purple' }}
          checked={checked.has('claude')}
          onToggle={() => toggle('claude')}
        >
          <p>
            Claude&apos;s export tool lives in your Privacy settings. It works the same way: you
            request it, they email you the file.
          </p>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4">
            <p className="text-[#FCF4EB]/50 text-xs font-semibold uppercase tracking-wide">Don&apos;t use Claude much yet? Skip this section.</p>
          </div>

          <ol className="space-y-3 list-decimal list-inside">
            <li>
              Go to{' '}
              <a href="https://claude.ai/settings/data-privacy-controls" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline font-medium">
                claude.ai/settings/data-privacy-controls
              </a>
            </li>
            <li>In the sidebar, click <strong className="text-[#FCF4EB]">Privacy</strong></li>
            <li>Scroll to <strong className="text-[#FCF4EB]">Privacy settings</strong> and click the <strong className="text-[#FCF4EB]">Export data</strong> button on the right</li>
          </ol>

          <ScreenshotCard
            src="/screenshots/claude-privacy-settings.png"
            alt="Claude Settings Privacy page showing the Export data button"
            caption="Go to Settings, then Privacy, and click Export data on the right"
          />

          <ol className="space-y-3 list-decimal list-inside" start={4}>
            <li>A dialog will appear. Make sure <strong className="text-[#FCF4EB]">All</strong> is selected under &ldquo;Conversations from&rdquo;</li>
            <li>Click the white <strong className="text-[#FCF4EB]">Export</strong> button</li>
          </ol>

          <ScreenshotCard
            src="/screenshots/claude-export-modal.png"
            alt="Claude Export data dialog with All selected and the Export button highlighted"
            caption="Select All, then click Export"
          />

          <ol className="space-y-3 list-decimal list-inside" start={6}>
            <li>Check your email for a download link (arrives within a few hours, sometimes up to 48 hours)</li>
            <li>Download the file and unzip it when it arrives. Keep it ready for the session</li>
          </ol>

          <ProTip type="info">
            The download link expires in 24 hours. Download it as soon as you get the email.
          </ProTip>
        </SectionCard>

        {/* 3. Online Presence */}
        <SectionCard
          id="urls"
          number={3}
          title="Gather your online presence"
          badge={{ label: 'Before the session', color: 'muted' }}
          checked={checked.has('urls')}
          onToggle={() => toggle('urls')}
        >
          <p>
            We will feed your social media and website URLs into your Brain Dump so Claude knows
            where to find you online. Take two minutes now to collect these links.
          </p>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4">
            <p className="text-[#FCF4EB]/50 text-xs font-semibold uppercase tracking-wide">Don&apos;t have some of these? No problem. Skip the ones that don&apos;t apply.</p>
          </div>

          <p className="text-[#FCF4EB]/80 font-medium">
            Open a notes app and paste in any of the following you have:
          </p>

          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-[#7C69C7] mt-0.5">•</span>
              <span>Your main website URL</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7C69C7] mt-0.5">•</span>
              <span>Instagram profile URL</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7C69C7] mt-0.5">•</span>
              <span>Facebook profile or page URL</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7C69C7] mt-0.5">•</span>
              <span>LinkedIn profile URL</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7C69C7] mt-0.5">•</span>
              <span>Any other platforms you use: TikTok, Twitter/X, YouTube, etc.</span>
            </li>
          </ul>

          <p>
            You will paste these into a prompt during the session. Having them ready saves
            time and means Claude gets a more complete picture of you.
          </p>
        </SectionCard>
      </div>

      {/* Footer note */}
      <div className="mt-14 border-t border-white/[0.08] pt-8">
        <p className="text-[#FCF4EB]/40 text-sm leading-relaxed text-center">
          If you get stuck on any of the export steps, reach out before the session and someone will help.
        </p>
      </div>
    </div>
  )
}
