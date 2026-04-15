'use client'

import { useState } from 'react'
import ProTip from '@/components/ProTip'
import { celebrate } from '@/lib/celebrate'

const ITEMS = [
  { id: 'phone-download', label: 'Download Claude on your phone',          required: true,  anchor: '#phone-download' },
  { id: 'phone-login',    label: 'Log in with your existing account',       required: true,  anchor: '#phone-login'    },
  { id: 'resend-domain',  label: 'Verify your Resend domain (or sandbox)',  required: true,  anchor: '#resend-domain'  },
  { id: 'voice-samples',  label: 'Gather your writing samples',             required: true,  anchor: '#voice-samples'  },
  { id: 'ig-handles',     label: 'Pick 2-3 Instagram accounts to study',   required: true,  anchor: '#ig-handles'     },
  { id: 'instaloader',    label: 'Install InstaLoader',                     required: false, anchor: '#instaloader'    },
  { id: 'resend-key',     label: 'Save your Resend API key somewhere handy', required: true,  anchor: '#resend-key'     },
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

export default function Session6Prep() {
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
          Before Session Six
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
          Prep Requirements
        </h1>
        <p className="text-[#FCF4EB]/70 text-base sm:text-lg leading-relaxed mb-6">
          Complete these steps before the session. Most of them take under five minutes.
          The writing samples step takes a little longer but it is the most important one, so give it proper attention.
        </p>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4">
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
            If you get stuck on anything before the session, message the group. Do not skip the writing samples
            step and try to do it during the session, it takes time.
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

        {/* 1. Download Claude on phone */}
        <SectionCard
          id="phone-download"
          number={1}
          title="Download Claude on your phone"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('phone-download')}
          onToggle={() => toggle('phone-download')}
        >
          <p>
            <span className="text-[#FCF4EB] font-semibold">What it is:</span> Claude has a free mobile app
            for both iPhone and Android. In this session you will use it to continue conversations from your
            laptop, run slash commands on the go, and see how much you can accomplish without ever opening a computer.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://apps.apple.com/app/claude-ai/id6473753684"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.10] hover:border-[#7C69C7]/40 text-[#FCF4EB]/80 text-sm px-4 py-2 rounded-xl transition-colors"
            >
              App Store (iPhone)
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.anthropic.claude"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.10] hover:border-[#7C69C7]/40 text-[#FCF4EB]/80 text-sm px-4 py-2 rounded-xl transition-colors"
            >
              Google Play (Android)
            </a>
          </div>

          <ol className="space-y-2 list-decimal list-inside">
            <li>Download the app from the store above</li>
            <li>Open it, tap &ldquo;Log in&rdquo;</li>
            <li>Stop there, do not start any conversations yet</li>
          </ol>
        </SectionCard>

        {/* 2. Log in with existing account */}
        <SectionCard
          id="phone-login"
          number={2}
          title="Log in with your existing account"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('phone-login')}
          onToggle={() => toggle('phone-login')}
        >
          <p>
            Log in using the same email address you use on your laptop. This connects
            your phone and laptop so you can pick up any conversation on either device.
          </p>

          <ol className="space-y-2 list-decimal list-inside">
            <li>Open the Claude app</li>
            <li>Tap &ldquo;Log in&rdquo; and enter the same email you use on your laptop</li>
            <li>Complete the verification if prompted</li>
            <li>Confirm the app opens and shows your account name</li>
          </ol>

          <ProTip type="info">
            If you signed up with Google on your laptop, use &ldquo;Continue with Google&rdquo; on the phone too.
            Make sure it is the same Google account.
          </ProTip>
        </SectionCard>

        {/* 3. Resend domain */}
        <SectionCard
          id="resend-domain"
          number={3}
          title="Verify your Resend domain (or set up sandbox)"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('resend-domain')}
          onToggle={() => toggle('resend-domain')}
        >
          <p>
            In Session 3 you created a{' '}
            <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">
              Resend
            </a>{' '}
            account. In this session you will use it to send yourself a daily email of fresh hook ideas.
            For that to work, your domain needs to be verified, or sandbox mode needs to be active.
          </p>

          <div className="space-y-3">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Option A: Full domain verification (preferred)</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                If you verified your domain in Session 3, you are all set. Log into{' '}
                <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">
                  Resend Domains
                </a>{' '}
                and confirm your domain shows a green &ldquo;Verified&rdquo; status.
                If it is not verified yet, do it before the session, DNS changes can take up to 24 hours to propagate.
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Option B: Sandbox mode (works for today)</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                If your domain is not verified, sandbox mode lets you send emails to yourself for testing.
                You can only email your own verified address, but that is enough for the session exercise.
                No setup needed, sandbox is on by default in new accounts.
              </p>
            </div>
          </div>

          <ProTip type="warning">
            Either way, have your Resend API key ready before the session. You will need it to wire up the daily agent.
          </ProTip>
        </SectionCard>

        {/* 4. Writing samples */}
        <SectionCard
          id="voice-samples"
          number={4}
          title="Gather your writing samples"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('voice-samples')}
          onToggle={() => toggle('voice-samples')}
        >
          <p>
            In this session you will build a personal voice profile so Claude writes in your voice, not a generic AI voice.
            To do that, Claude needs examples of how you actually write. This step collects those examples.
          </p>

          <p>
            Open Claude Code on your laptop and run this prompt exactly:
          </p>

          <div className="bg-[#0d0d0f] border border-white/[0.08] rounded-xl p-4 font-mono text-sm text-[#FCF4EB]/80 leading-relaxed whitespace-pre-wrap">
{`Go into my brain_dump_map folder on my Desktop. Find 5 examples of my actual writing - look for emails, captions, posts, messages, or anything that sounds like me talking. Copy each one into its own .txt file and save them all into a new folder called MyVoice inside brain_dump_map. Then tell me what you found and why you picked each one.`}
          </div>

          <p>
            Once Claude tells you what it found, review each sample. Ask yourself: does this actually sound like me?
            If any sample feels off or too polished, tell Claude to swap it out for something else.
          </p>

          <ProTip type="tip">
            The samples do not need to be perfect writing. Raw, unedited messages often work better than polished posts
            because they capture how you actually talk, not how you think you should write.
          </ProTip>

          <p className="text-[#FCF4EB]/50 text-xs">
            No brain_dump_map folder yet? If you did not complete the Session 5 brain dump exercise, create a folder
            called brain_dump_map on your Desktop and drop in 3-5 text files containing things you have written:
            emails you sent, captions, WhatsApp messages, anything in your own words.
          </p>
        </SectionCard>

        {/* 5. Instagram handles */}
        <SectionCard
          id="ig-handles"
          number={5}
          title="Pick 2-3 Instagram accounts to study"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('ig-handles')}
          onToggle={() => toggle('ig-handles')}
        >
          <p>
            In the second half of the session you will pull recent captions from creators in your niche and use
            them to generate hook ideas. Pick 2-3 accounts before you arrive so you are not choosing on the spot.
          </p>

          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">What to look for:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Creators in your niche whose content style you want to model</li>
              <li>Accounts with under 500K followers. Mid-size creators use hooks that actually work
                  today. Mega accounts often rely on their audience rather than their hooks.</li>
              <li>Active accounts that have posted in the last 30 days</li>
            </ul>
          </div>

          <p>
            Write the handles down somewhere you can access during the session. Just the usernames, like{' '}
            <code className="bg-white/[0.08] px-1.5 py-0.5 rounded">@username</code>.
          </p>

          <ProTip type="tip">
            Not sure whose content to model? Think about the last creator in your niche that made you stop scrolling.
            Start there.
          </ProTip>
        </SectionCard>

        {/* 6. InstaLoader */}
        <SectionCard
          id="instaloader"
          number={6}
          title="Install InstaLoader"
          badge={{ label: 'Optional', required: false }}
          checked={checked.has('instaloader')}
          onToggle={() => toggle('instaloader')}
        >
          <p>
            InstaLoader is a free tool that pulls recent captions and profile info from Instagram accounts.
            We use it in the second half of the session to feed real content into your hook generator.
          </p>

          <p>
            Try installing it now so we do not spend session time on it. Open your terminal and run:
          </p>

          <div className="bg-[#0d0d0f] border border-white/[0.08] rounded-xl p-4 font-mono text-sm text-[#FCF4EB]/80">
            pip install instaloader
          </div>

          <p>
            If it installs without errors, you are done. If you get an error, do not stress.
            We will sort it out together at the start of the session, it is a common one.
          </p>

          <ProTip type="info">
            If you get a &ldquo;pip not found&rdquo; error, try{' '}
            <code className="bg-white/[0.08] px-1.5 py-0.5 rounded">pip3 install instaloader</code> instead.
          </ProTip>
        </SectionCard>

        {/* 7. Resend API key */}
        <SectionCard
          id="resend-key"
          number={7}
          title="Save your Resend API key somewhere handy"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('resend-key')}
          onToggle={() => toggle('resend-key')}
        >
          <p>
            You will need your Resend API key during the session to wire up the daily hook email agent.
            Find it now and save it somewhere you can copy it quickly, like a note on your phone.
          </p>

          <ol className="space-y-2 list-decimal list-inside">
            <li>
              Log into{' '}
              <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">
                Resend API Keys
              </a>
            </li>
            <li>If you already have a key, copy it and save it in your notes</li>
            <li>
              If you do not have one yet, click &ldquo;Create API Key,&rdquo; name it anything (like &ldquo;Mastermind&rdquo;),
              and save the key immediately. Resend only shows it once.
            </li>
          </ol>

          <ProTip type="warning">
            API keys are shown only once when you create them. If you never saved yours, you will need to create a new one.
            That is fine, just delete the old one and generate a fresh key.
          </ProTip>
        </SectionCard>

      </div>

      {/* Footer note */}
      <div className="mt-14 border-t border-white/[0.08] pt-8">
        <p className="text-[#FCF4EB]/40 text-sm leading-relaxed text-center">
          If you get stuck on any of the setup steps, reach out before the session and someone will help.
        </p>
      </div>

    </div>
  )
}
