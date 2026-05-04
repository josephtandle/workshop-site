'use client'

import { useState } from 'react'
import ProTip from '@/components/ProTip'
import { celebrate } from '@/lib/celebrate'

const ITEMS = [
  { id: 'supabase', label: 'Create a FREE Supabase Account', required: true, anchor: '#supabase' },
  { id: 'resend',   label: 'Create a FREE Resend Account',   required: true, anchor: '#resend'   },
  { id: 'domain',   label: 'Domain Setup',               required: false, anchor: '#domain'  },
  { id: 'headline', label: 'Write Your Lead Magnet',       required: false, anchor: '#headline'},
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

export default function Session3Prep() {
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
          Before Session Three
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
          Prep Requirements
        </h1>
        <p className="text-[#FCF4EB]/70 text-base sm:text-lg leading-relaxed mb-6">
          Complete these steps before the session. Total time: about 20 minutes.
          The Supabase and Resend accounts are required — everything else is optional.
        </p>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4">
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
            You do not need to be a developer or have any technical experience.
            These are all sign-up processes — no code involved.
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

        {/* 1. Supabase */}
        <SectionCard
          id="supabase"
          number={1}
          title="Create a FREE Supabase Account"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('supabase')}
          onToggle={() => toggle('supabase')}
        >
          <p>
            <span className="text-[#FCF4EB] font-semibold">What it is:</span> Supabase is your
            database. It stores subscriber information when someone fills out your lead magnet form.
            Think of it as a Google Sheet that updates automatically and connects to your website.
          </p>

          <ol className="space-y-3 list-decimal list-inside">
            <li>
              Go to{' '}
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline font-medium">
                supabase.com
              </a>
            </li>
            <li>Click &ldquo;Start your project&rdquo; in the top right corner</li>
            <li>
              Choose how to sign up:
              <ul className="mt-3 ml-4 space-y-3">
                <li>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[#FCF4EB] font-medium">Email and password</span>
                    <span className="text-xs bg-[#7C69C7]/20 text-[#9D8FE0] px-2 py-0.5 rounded-full font-medium">Recommended</span>
                  </div>
                  <p className="text-[#FCF4EB]/50 text-xs mt-1">Enter your email and create a password</p>
                </li>
                <li>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[#FCF4EB] font-medium">Sign in with Google</span>
                    <span className="text-xs bg-[#7C69C7]/20 text-[#9D8FE0] px-2 py-0.5 rounded-full font-medium">Recommended</span>
                  </div>
                  <p className="text-[#FCF4EB]/50 text-xs mt-1">One click if you are already logged into Google — fastest option</p>
                </li>
              </ul>
            </li>
            <li>If signing up with email: check your inbox for a verification email and click the link</li>
            <li>After login you will see the Supabase dashboard with a &ldquo;New Project&rdquo; button</li>
            <li className="text-[#FCF4EB]/90 font-medium">
              Stop here. Do not create a project yet — we will do that together in the session.
            </li>
            <li>Confirm you can log in before the workshop</li>
          </ol>

          <ProTip type="info">
            Supabase free tier includes 500MB of storage and unlimited API requests for two projects.
            More than enough for everything we are building.
          </ProTip>
        </SectionCard>

        {/* 2. Resend */}
        <SectionCard
          id="resend"
          number={2}
          title="Create a FREE Resend Account"
          badge={{ label: 'Required', required: true }}
          checked={checked.has('resend')}
          onToggle={() => toggle('resend')}
        >
          <p>
            <span className="text-[#FCF4EB] font-semibold">What it is:</span> Resend sends emails on
            your behalf. When someone signs up on your lead magnet page, Resend delivers their welcome
            email automatically — with your resource included.
          </p>

          <ol className="space-y-3 list-decimal list-inside">
            <li>
              Go to{' '}
              <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline font-medium">
                resend.com
              </a>
            </li>
            <li>Click &ldquo;Get Started&rdquo; in the top right</li>
            <li>Enter your email address and create a password</li>
            <li>Check your inbox for a verification email from Resend</li>
            <li>Click &ldquo;Verify Email&rdquo; in that email</li>
            <li>You will land on the Resend dashboard</li>
            <li className="text-[#FCF4EB]/90 font-medium">
              Stop here. Do not create an API key yet — we will do that together in the session.
            </li>
            <li>Confirm you can log in before the workshop</li>
          </ol>

          <p className="text-[#FCF4EB]/60 text-xs">
            Free plan: 3,000 emails/month, 100 emails/day — plenty for the workshop and your first
            few hundred subscribers.
          </p>

          <ProTip type="info">
            On the free plan, emails can only be sent FROM{' '}
            <code className="bg-white/[0.06] px-1.5 py-0.5 rounded">onboarding@resend.dev</code>.
            This is fine for learning. In a future session we will cover how to send from your own email address.
          </ProTip>
        </SectionCard>

        {/* 3. Domain */}
        <SectionCard
          id="domain"
          number={3}
          title="Domain Setup"
          badge={{ label: 'Optional', required: false }}
          checked={checked.has('domain')}
          onToggle={() => toggle('domain')}
        >
          <p>
            <span className="text-[#FCF4EB] font-semibold">This is optional.</span> You can complete
            the entire session without a domain — your site will use a{' '}
            <code className="bg-white/[0.08] px-1.5 py-0.5 rounded">.vercel.app</code> address.
            A domain makes it feel real and professional, but it is not required to learn the skills.
          </p>

          {/* Option A */}
          <div className="pt-2">
            <h3 className="text-[#FCF4EB] font-bold text-lg mb-2">Option A: Use a domain you already own</h3>
            <p className="mb-3">
              Only relevant if you want to point an existing domain to your project. If that domain is
              attached to a live website, read the warning below before touching anything.
            </p>
            <p className="font-medium text-[#FCF4EB]/90 mb-2">
              Your pre-work: verify you can log in to wherever your domain is managed.
            </p>
            <p className="mb-4">
              Find your registrar below and click the walkthrough link. You do not need to change
              anything yet — just confirm you have access.
            </p>

            <div className="space-y-2">
              {[
                {
                  name: 'GoDaddy',
                  path: 'Log in → My Products → Domains → click the domain → DNS → Manage',
                  link: 'https://www.godaddy.com/help/manage-dns-records-680',
                },
                {
                  name: 'Namecheap',
                  path: 'Log in → Domain List → Manage → Advanced DNS tab',
                  link: 'https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/',
                },
                {
                  name: 'Porkbun',
                  path: 'Log in → hover your domain → Details → DNS Records tab',
                  link: 'https://kb.porkbun.com/article/54-how-to-edit-dns-records',
                },
                {
                  name: 'Squarespace Domains (formerly Google Domains)',
                  path: 'Log in at domains.squarespace.com → select domain → DNS tab',
                  link: 'https://support.squarespace.com/hc/en-us/articles/213469948',
                },
                {
                  name: 'Cloudflare',
                  path: 'Log in at dash.cloudflare.com → select domain → DNS tab on left',
                  link: 'https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/',
                },
                {
                  name: 'Bluehost',
                  path: 'Log in → Domains → Zone Editor → select your domain',
                  link: 'https://www.bluehost.com/help/article/dns-management-adding-or-editing-dns-entries',
                },
                {
                  name: 'Wix',
                  path: 'Note: if your domain runs an active Wix site, use Option B instead.',
                  link: 'https://support.wix.com/en/article/managing-dns-records-in-your-wix-account',
                },
              ].map((r) => (
                <div key={r.name} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <span className="text-[#FCF4EB] font-medium text-sm">{r.name}</span>
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7C69C7] text-xs hover:underline whitespace-nowrap"
                    >
                      DNS walkthrough →
                    </a>
                  </div>
                  <p className="text-[#FCF4EB]/50 text-xs leading-relaxed">{r.path}</p>
                </div>
              ))}

              <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4">
                <p className="text-[#FCF4EB]/60 text-xs">
                  <span className="text-[#FCF4EB] font-medium">Domain via your web host (cPanel)?</span>{' '}
                  Log in to your hosting control panel and look for &ldquo;Zone Editor&rdquo; or &ldquo;DNS Management.&rdquo;
                  If you cannot find it, ask your host: &ldquo;How do I edit DNS records for my domain?&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-4">
              <ProTip type="warning">
                If your domain is attached to a live website, changing the DNS records{' '}
                <strong>will take that site offline.</strong> Do not touch an active domain unless
                you are sure you want to move it. Use Option B instead — buy a cheap domain just
                for this exercise.
              </ProTip>
            </div>
          </div>

          {/* Option B */}
          <div className="pt-2">
            <h3 className="text-[#FCF4EB] font-bold text-lg mb-2">Option B: Buy a cheap domain just for practice</h3>
            <p className="mb-3">
              Great if you do not have a domain yet, or if you do not want to touch an existing one.
              You do not need a real business domain — something cheap and throwaway works perfectly
              for learning.
            </p>

            <p className="font-medium text-[#FCF4EB]/90 mb-2">Best cheap TLDs for testing:</p>
            <ul className="space-y-1.5 mb-4">
              <li>
                <code className="bg-white/[0.08] px-1.5 py-0.5 rounded">.site</code>{' '}
                <span className="text-[#FCF4EB]/50">— often under $2/year — our top pick for testing</span>
              </li>
              <li>
                <code className="bg-white/[0.08] px-1.5 py-0.5 rounded">.online</code>{' '}
                <span className="text-[#FCF4EB]/50">— often under $2/year — also great</span>
              </li>
              <li>
                <code className="bg-white/[0.08] px-1.5 py-0.5 rounded">.xyz</code>{' '}
                <span className="text-[#FCF4EB]/50">— around $1/year on Porkbun</span>
              </li>
              <li>
                <code className="bg-white/[0.08] px-1.5 py-0.5 rounded">.click</code>{' '}
                <span className="text-[#FCF4EB]/50">— around $1/year</span>
              </li>
            </ul>

            <p className="font-medium text-[#FCF4EB]/90 mb-2">
              Steps for{' '}
              <a href="https://porkbun.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">
                porkbun.com
              </a>{' '}
              — usually the cheapest:
            </p>
            <ol className="space-y-2 list-decimal list-inside">
              <li>Go to <a href="https://porkbun.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">porkbun.com</a></li>
              <li>Search for any name you like — does not have to be your business name</li>
              <li>Look for a <code className="bg-white/[0.08] px-1.5 py-0.5 rounded">.site</code> or <code className="bg-white/[0.08] px-1.5 py-0.5 rounded">.online</code> version — usually under $2</li>
              <li>Add to cart → Create a free Porkbun account → Checkout</li>
              <li>Turn on auto-renew so you do not accidentally lose it</li>
              <li>Save your login details — you will need them during the session</li>
            </ol>
          </div>

          {/* Option C */}
          <div className="pt-2">
            <h3 className="text-[#FCF4EB] font-bold text-lg mb-2">Option C: Skip it entirely</h3>
            <p>
              Totally fine. Your site works perfectly on{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded">your-project.vercel.app</code>.
              You can add a domain any time after the session using the steps in the workshop guide.
            </p>
          </div>
        </SectionCard>

        {/* 4. Write Your Lead Magnet */}
        <SectionCard
          id="headline"
          number={4}
          title="Write Your Lead Magnet"
          badge={{ label: 'Optional', required: false }}
          checked={checked.has('headline')}
          onToggle={() => toggle('headline')}
        >
          <p>
            A lead magnet is whatever you give someone in exchange for their email address. The
            goal of this session is to build a page that collects emails — the lead magnet is simply
            what you are offering. It can be almost anything:
          </p>

          <ul className="space-y-2 ml-4 list-disc list-inside">
            <li>A PDF — guide, checklist, template, or cheat sheet</li>
            <li>A link to a workshop — live training, evergreen video, or recorded webinar</li>
            <li>A webpage — a resource page, a mini-course, or a curated list</li>
            <li>Anything else with a URL — a discount code, a free tool, a case study</li>
          </ul>

          <p>
            If you have something you already use or plan to use, bring it. If not, do not stress —
            you can make something up during class. The technical steps are the same either way, and
            you can swap in your real offer any time after the session.
          </p>

          <div>
            <h3 className="text-[#FCF4EB] font-bold text-lg mb-2">What to prepare</h3>
            <p className="mb-3">
              If you do have something ready, jot down these two things in your notes before the session:
            </p>
            <ul className="space-y-2 mb-3 ml-4">
              <li><span className="text-[#FCF4EB]/90 font-medium">A headline</span> — one sentence that promises a specific outcome</li>
              <li><span className="text-[#FCF4EB]/90 font-medium">A 2-sentence description</span> — what it is and what they will get from it</li>
            </ul>
            <p className="text-[#FCF4EB]/50 italic text-xs">
              Example: &ldquo;The 5-Step System to Get Your First 10 Clients&rdquo; / &ldquo;A battle-tested checklist
              used by 200+ service businesses. Download it and start generating qualified leads this week.&rdquo;
            </p>
          </div>

          <ProTip type="tip">
            The more specific your headline, the higher your conversion rate. Vague = low signups.
            Specific = high signups.
          </ProTip>
        </SectionCard>
      </div>

      {/* Footer note */}
      <div className="mt-14 border-t border-white/[0.08] pt-8">
        <p className="text-[#FCF4EB]/40 text-sm leading-relaxed text-center">
          If you get stuck on any of the setup steps, reach out before the session and someone will help.
        </p>
      </div>

      <p className="text-center text-xs text-white/20 pb-8">
        Using Codex instead of Claude Code?{' '}
        <a href="/session/2/guide-codex" className="underline hover:text-white/50 transition-colors">Codex version of this page</a>
      </p>

    </div>
  )
}
