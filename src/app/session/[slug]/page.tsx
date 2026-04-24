import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSession } from '@/lib/sessions'
import { LOCKS } from '@/lib/locks'
import Reveal from '@/components/Reveal'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return [{ slug: '1' }, { slug: '2' }, { slug: '3' }, { slug: '4' }, { slug: '5' }, { slug: '6' }, { slug: '7' }]
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const session = getSession(slug)
  if (!session) return { title: 'Session', description: '' }
  return {
    title: `Session ${session.number}: ${session.title}`,
    description: session.description,
  }
}

export default async function SessionIndexPage({ params }: Props) {
  const { slug } = await params
  const session = getSession(slug)
  if (!session) notFound()

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-10 text-sm text-[#FCF4EB]/40 flex items-center gap-2">
        <Link href="/" className="hover:text-[#7C69C7] transition-colors">All Sessions</Link>
        <span>/</span>
        <span className="text-[#FCF4EB]/60">Session {session.number}</span>
      </nav>

      {/* Header */}
      <Reveal className="mb-14">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Session {session.number}
        </p>
        <h1 className="gradient-text text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          {session.title}
        </h1>
        <p className="text-lg text-[#FCF4EB]/60 leading-relaxed max-w-2xl">
          {session.description}
        </p>
      </Reveal>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6 items-stretch">
        {/* Hook writing prep card — Session 5 only */}
        {slug === '5' && (
          <Reveal delay={1} className="h-full">
            <Link
              href="/session/5/prep-hooks"
              className="group card-hover card-shimmer flex flex-col h-full bg-white/[0.05] border border-white/[0.10] rounded-2xl p-8"
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className="number-glow w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'rgba(252, 244, 235, 0.07)', border: '1px solid rgba(252, 244, 235, 0.12)' }}
                >
                  ✓
                </div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(124, 105, 199, 0.12)', color: '#7C69C7', border: '1px solid rgba(124, 105, 199, 0.2)' }}
                >
                  Before the Session
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#FCF4EB] mb-2 group-hover:text-white transition-colors">
                Prep: Prepare for Hook Writing
              </h2>
              <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-6 flex-1">
                Find your Instagram inspiration and define your audience so we can write hooks that actually land.
              </p>
              <div className="flex items-center gap-2 text-[#7C69C7] text-sm font-medium group-hover:gap-3 transition-all">
                <span>Read prep guide</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </Reveal>
        )}

        {/* Prep page */}
        {session.hasPrep && (
          <Reveal delay={1} className="h-full">
            <Link
              href={`/session/${slug}/prep`}
              className="group card-hover card-shimmer flex flex-col h-full bg-white/[0.05] border border-white/[0.10] rounded-2xl p-8"
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className="number-glow w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'rgba(252, 244, 235, 0.07)', border: '1px solid rgba(252, 244, 235, 0.12)' }}
                >
                  ✓
                </div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(124, 105, 199, 0.12)',
                    color: '#7C69C7',
                    border: '1px solid rgba(124, 105, 199, 0.2)',
                  }}
                >
                  Before the Session
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#FCF4EB] mb-2 group-hover:text-white transition-colors">
                {session.prepLabel ?? 'Prep Requirements'}
              </h2>
              <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-6 flex-1">
                {session.prepDescription ?? 'What to set up before you arrive. Complete this first.'}
              </p>
              <div className="flex items-center gap-2 text-[#7C69C7] text-sm font-medium group-hover:gap-3 transition-all">
                <span>Read prep guide</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </Reveal>
        )}

        {/* Auto Lead Magnet bonus — Session 2 only */}
        {slug === '2' && (
          <Reveal delay={2} className="h-full">
            <Link
              href="/session/2/auto-lead-magnet"
              className="group card-hover card-shimmer flex flex-col h-full bg-white/[0.05] border border-white/[0.10] rounded-2xl p-8"
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className="number-glow w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'rgba(252, 244, 235, 0.07)', border: '1px solid rgba(252, 244, 235, 0.12)' }}
                >
                  ✦
                </div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(124, 105, 199, 0.12)',
                    color: '#7C69C7',
                    border: '1px solid rgba(124, 105, 199, 0.2)',
                  }}
                >
                  Pre-Session Bonus
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#FCF4EB] mb-2 group-hover:text-white transition-colors">
                Lead Magnet: Auto Lead Magnet PDF
              </h2>
              <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-6 flex-1">
                Paste one prompt into Claude Code, point it at your website, and get a custom PDF lead magnet in your brand colors. Takes about 2 minutes.
              </p>
              <div className="flex items-center gap-2 text-[#7C69C7] text-sm font-medium group-hover:gap-3 transition-all">
                <span>Open bonus</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </Reveal>
        )}

        {/* Guide page */}
        {session.hasGuide && (
          <Reveal delay={2} className="h-full">
            {(slug === '5' && LOCKS.session5Guide === false) || (slug === '6' && !LOCKS.session6Guide) || (slug === '7' && !LOCKS.session7Guide) ? (
              <div
                className="flex flex-col h-full bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 cursor-not-allowed select-none"
                aria-disabled="true"
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(124, 105, 199, 0.06)', border: '1px solid rgba(124, 105, 199, 0.10)' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="5" y="11" width="14" height="10" rx="2" stroke="rgba(124,105,199,0.3)" strokeWidth="1.5" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="rgba(124,105,199,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(124, 105, 199, 0.06)',
                      color: 'rgba(124, 105, 199, 0.35)',
                      border: '1px solid rgba(124, 105, 199, 0.10)',
                    }}
                  >
                    Locked
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: 'rgba(252,244,235,0.25)' }}>
                  {session.guideTitle ?? 'Session Workshop Guide'}
                </h2>
                <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'rgba(252,244,235,0.18)' }}>
                  Step-by-step instructions for following along during the live session. Available when the session opens.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'rgba(124,105,199,0.3)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span>Coming soon</span>
                </div>
              </div>
            ) : (
              <Link
                href={`/session/${slug}/${session.guidePath ?? 'guide'}`}
                className="group card-hover card-shimmer flex flex-col h-full rounded-2xl p-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(124, 105, 199, 0.18) 0%, rgba(245, 195, 198, 0.10) 100%)',
                  border: '1px solid rgba(124, 105, 199, 0.30)',
                }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="number-glow w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: 'rgba(124, 105, 199, 0.20)', border: '1px solid rgba(124, 105, 199, 0.35)' }}
                  >
                    ⚡
                  </div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(124, 105, 199, 0.25)',
                      color: '#9D8FE0',
                      border: '1px solid rgba(124, 105, 199, 0.40)',
                    }}
                  >
                    Live Guide
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#FCF4EB] mb-2 group-hover:text-white transition-colors">
                  {session.guideTitle ?? 'Session Workshop Guide'}
                </h2>
                <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-6 flex-1">
                  Step-by-step instructions for following along during the live session. All code included.
                </p>
                <div className="flex items-center gap-2 text-[#7C69C7] text-sm font-medium group-hover:gap-3 transition-all">
                  <span>Open guide</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            )}
          </Reveal>
        )}

        {/* 3 — Custom Domain — Session 3 only */}
        {slug === '3' && (
          <Reveal delay={3} className="h-full">
            <Link
              href="/session/3/custom-domain"
              className="group card-hover card-shimmer flex flex-col h-full bg-white/[0.05] border border-white/[0.10] rounded-2xl p-8"
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className="number-glow w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'rgba(252, 244, 235, 0.07)', border: '1px solid rgba(252, 244, 235, 0.12)' }}
                >
                  🌐
                </div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(252, 244, 235, 0.06)',
                    color: 'rgba(252, 244, 235, 0.4)',
                    border: '1px solid rgba(252, 244, 235, 0.10)',
                  }}
                >
                  Step-by-Step
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#FCF4EB] mb-2 group-hover:text-white transition-colors">
                Add a Custom Domain to Vercel
              </h2>
              <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-6 flex-1">
                Buy a domain, connect it to Vercel, and configure DNS so your site lives at your own address.
              </p>
              <div className="flex items-center gap-2 text-[#7C69C7] text-sm font-medium group-hover:gap-3 transition-all">
                <span>Open guide</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </Reveal>
        )}

        {/* 4 — Resend Homework — Session 3 only */}
        {slug === '3' && (
          <Reveal delay={4} className="h-full">
            <Link
              href="/session/3/homework"
              className="group card-hover card-shimmer flex flex-col h-full bg-white/[0.05] border border-white/[0.10] rounded-2xl p-8"
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className="number-glow w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'rgba(245, 195, 198, 0.10)', border: '1px solid rgba(245, 195, 198, 0.20)' }}
                >
                  ✦
                </div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(245, 195, 198, 0.10)',
                    color: '#F5C3C6',
                    border: '1px solid rgba(245, 195, 198, 0.20)',
                  }}
                >
                  Bonus
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#FCF4EB] mb-2 group-hover:text-white transition-colors">
                Verify Your Domain in Resend
              </h2>
              <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-6 flex-1">
                Send emails from your own domain and unlock delivery to any email address. About 15 minutes.
              </p>
              <div className="flex items-center gap-2 text-[#7C69C7] text-sm font-medium group-hover:gap-3 transition-all">
                <span>Open bonus</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </Reveal>
        )}

        {slug === '4' && (
          <Reveal delay={3} className="h-full">
            <Link
              href="/session/4/wrapup"
              className="group card-hover card-shimmer flex flex-col h-full bg-white/[0.05] border border-white/[0.10] rounded-2xl p-8"
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className="number-glow w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'rgba(252, 244, 235, 0.07)', border: '1px solid rgba(252, 244, 235, 0.12)' }}
                >
                  ▶
                </div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(252, 244, 235, 0.06)',
                    color: 'rgba(252, 244, 235, 0.4)',
                    border: '1px solid rgba(252, 244, 235, 0.10)',
                  }}
                >
                  Session Recap
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#FCF4EB] mb-2 group-hover:text-white transition-colors">
                Mastermind Alignment Wrap-Up
              </h2>
              <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-6 flex-1">
                Recording, participant highlights, and what we are improving for next time.
              </p>
              <div className="flex items-center gap-2 text-[#7C69C7] text-sm font-medium group-hover:gap-3 transition-all">
                <span>View recap</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </Reveal>
        )}

        {/* Hook Writer — Session 5 only */}
        {slug === '5' && (
          <Reveal delay={3} className="h-full">
            {LOCKS.session5HookWriter === false ? (
              <div
                className="flex flex-col h-full bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 cursor-not-allowed select-none"
                aria-disabled="true"
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(124, 105, 199, 0.06)', border: '1px solid rgba(124, 105, 199, 0.10)' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="5" y="11" width="14" height="10" rx="2" stroke="rgba(124,105,199,0.3)" strokeWidth="1.5" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="rgba(124,105,199,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(124, 105, 199, 0.06)',
                      color: 'rgba(124, 105, 199, 0.35)',
                      border: '1px solid rgba(124, 105, 199, 0.10)',
                    }}
                  >
                    Locked
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: 'rgba(252,244,235,0.25)' }}>
                  Hook Writer: Part 1
                </h2>
                <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'rgba(252,244,235,0.18)' }}>
                  Build your brand voice profile and generate your first Instagram Reel hooks in your own voice.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'rgba(124,105,199,0.3)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span>Coming soon</span>
                </div>
              </div>
            ) : (
            <Link
              href="/session/5/hook-writer"
              className="group card-hover card-shimmer flex flex-col h-full bg-white/[0.05] border border-white/[0.10] rounded-2xl p-8"
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className="number-glow w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'rgba(252, 244, 235, 0.07)', border: '1px solid rgba(252, 244, 235, 0.12)' }}
                >
                  🪝
                </div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(252, 244, 235, 0.06)',
                    color: 'rgba(252, 244, 235, 0.4)',
                    border: '1px solid rgba(252, 244, 235, 0.10)',
                  }}
                >
                  During the Session
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#FCF4EB] mb-2 group-hover:text-white transition-colors">
                Hook Writer: Part 1
              </h2>
              <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-6 flex-1">
                Build your brand voice profile and generate your first Instagram Reel hooks in your own voice.
              </p>
              <div className="flex items-center gap-2 text-[#7C69C7] text-sm font-medium group-hover:gap-3 transition-all">
                <span>Open Hook Writer</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
            )}
          </Reveal>
        )}

        {/* Descript Guide — Session 7 only */}
        {slug === '7' && (
          <Reveal delay={3} className="h-full">
            <Link
              href="/session/7/descript"
              className="group card-hover card-shimmer flex flex-col h-full bg-white/[0.05] border border-white/[0.10] rounded-2xl p-8"
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className="number-glow w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'rgba(245, 195, 198, 0.10)', border: '1px solid rgba(245, 195, 198, 0.20)' }}
                >
                  ✦
                </div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(245, 195, 198, 0.10)',
                    color: '#F5C3C6',
                    border: '1px solid rgba(245, 195, 198, 0.20)',
                  }}
                >
                  Bonus
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#FCF4EB] mb-2 group-hover:text-white transition-colors">
                Descript: Repurpose Your Content
              </h2>
              <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-6 flex-1">
                Turn any long-form recording into short-form clips, reels, and social content using Descript. No video editing skills required.
              </p>
              <div className="flex items-center gap-2 text-[#7C69C7] text-sm font-medium group-hover:gap-3 transition-all">
                <span>Open guide</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </Reveal>
        )}

        {slug === '1' && (
          <Reveal delay={3} className="h-full">
            <Link
              href="/session/1/bonus"
              className="group card-hover card-shimmer flex flex-col h-full bg-white/[0.05] border border-white/[0.10] rounded-2xl p-8"
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className="number-glow w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'rgba(245, 195, 198, 0.10)', border: '1px solid rgba(245, 195, 198, 0.20)' }}
                >
                  ✦
                </div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(245, 195, 198, 0.10)',
                    color: '#F5C3C6',
                    border: '1px solid rgba(245, 195, 198, 0.20)',
                  }}
                >
                  Optional Bonus
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#FCF4EB] mb-2 group-hover:text-white transition-colors">
                Dictate to Your Computer
              </h2>
              <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-6 flex-1">
                A polished web version of the Session 1 dictation guide with MacWhisper, built-in Mac and Windows tools, and cross-platform options.
              </p>
              <div className="flex items-center gap-2 text-[#7C69C7] text-sm font-medium group-hover:gap-3 transition-all">
                <span>Open bonus</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </Reveal>
        )}
      </div>

      {/* Back link */}
      <div className="mt-16 pt-8 border-t border-white/[0.06]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#FCF4EB]/40 hover:text-[#7C69C7] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to all sessions
        </Link>
      </div>
    </main>
  )
}
