'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import Reveal from '@/components/Reveal'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'
import {
  FLOW_STEPS,
  LANE_CARDS,
  MIGRATION_PROMPT,
  PROBLEM_POINTS,
  ROUTING_SUMMARY,
  ROUTING_TITLE,
  RULE_SECTIONS,
  WHY_IT_SCALES,
} from './content'

const PDF_PATH = '/cross-cli-compatibility-routing-guide.pdf'
const PROMPT_PATH = '/giveaways/cross-cli-compatibility-routing-prompt.md'
const MASTERMIND_URL = 'https://www.mastermindshq.business'

function useMagnet(strength = 0.24) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)
  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * strength
      const y = (e.clientY - rect.top - rect.height / 2) * strength
      el.style.transform = `translate(${x}px, ${y}px)`
      el.style.transition = 'transform 0.1s ease-out'
    },
    [strength],
  )
  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0px, 0px)'
    el.style.transition = 'transform 0.4s ease-out'
  }, [])
  return { ref, onMouseMove, onMouseLeave }
}

function PromptButtons({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false)
  const magnet = useMagnet()

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      confetti({
        particleCount: 90,
        spread: 70,
        colors: ['#7C69C7', '#F5C3C6', '#FCF4EB'],
        origin: { y: 0.55 },
      })
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      // noop
    }
  }, [prompt])

  return (
    <div className="mt-5 flex flex-col sm:flex-row gap-3">
      <button
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#7C69C7] hover:bg-[#6b59b7] text-white font-semibold text-base active:scale-[0.98] shadow-xl shadow-[#7C69C7]/20 transition-all"
      >
        {copied ? 'Copied!' : 'Copy migration prompt'}
      </button>
      <a
        ref={magnet.ref as React.RefObject<HTMLAnchorElement>}
        href={PROMPT_PATH}
        download
        onMouseMove={magnet.onMouseMove}
        onMouseLeave={magnet.onMouseLeave}
        className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#F5C3C6] hover:bg-[#efb7bc] text-[#151515] font-bold text-base active:scale-[0.98] shadow-xl shadow-[#F5C3C6]/20 transition-all"
      >
        Download prompt file
      </a>
    </div>
  )
}

function DownloadButtons() {
  const magnet = useMagnet()
  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
      <a
        ref={magnet.ref as React.RefObject<HTMLAnchorElement>}
        href={PDF_PATH}
        download
        onMouseMove={magnet.onMouseMove}
        onMouseLeave={magnet.onMouseLeave}
        className="inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-xl bg-[#F5C3C6] hover:bg-[#efb7bc] text-[#151515] font-bold text-base active:scale-[0.98] shadow-xl shadow-[#F5C3C6]/20 transition-all"
      >
        Download the PDF
      </a>
      <Link
        href="#migration-prompt"
        className="inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] text-[#FCF4EB] font-semibold text-base border border-white/[0.12] active:scale-[0.98] transition-all"
      >
        Jump to the prompt
      </Link>
    </div>
  )
}

export default function CrossCliCompatibilityRoutingPage() {
  useEffect(() => {
    if (document.querySelector('link[data-font="cormorant"]')) return
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap'
    link.rel = 'stylesheet'
    link.setAttribute('data-font', 'cormorant')
    document.head.appendChild(link)
  }, [])

  return (
    <>
      <style>{`
        .cormorant-display { font-family: 'Cormorant Garamond', serif; }
        @keyframes routing-glow {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.22; }
          50% { transform: translate(18px, -24px) scale(1.08); opacity: 0.3; }
        }
        .routing-orb { animation: routing-glow 18s ease-in-out infinite; }
      `}</style>

      <main>
        <section className="relative overflow-hidden pt-24 pb-16 px-6">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="routing-orb absolute top-[-10%] left-[4%] h-[420px] w-[420px] rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(124, 105, 199, 0.34) 0%, transparent 70%)' }}
            />
            <div
              className="routing-orb absolute top-[12%] right-[8%] h-[260px] w-[260px] rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(245, 195, 198, 0.20) 0%, transparent 72%)' }}
            />
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-start">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-2 bg-purple/10 border border-purple/20 rounded-full px-4 py-1.5 mb-7">
                    <span className="text-purple text-xs">◈</span>
                    <span className="text-purple text-xs font-semibold tracking-widest uppercase">
                      Bonus Resource
                    </span>
                  </div>
                </Reveal>
                <Reveal delay={1}>
                  <h1 className="gradient-text text-5xl md:text-6xl font-extrabold leading-[1.02] pb-2 mb-5">
                    {ROUTING_TITLE}
                  </h1>
                </Reveal>
                <Reveal delay={2}>
                  <p className="text-[#FCF4EB]/68 text-lg md:text-xl leading-relaxed max-w-3xl">
                    {ROUTING_SUMMARY}
                  </p>
                </Reveal>
                <Reveal delay={3}>
                  <p className="text-[#FCF4EB]/42 text-sm leading-relaxed mt-5 max-w-3xl">
                    This page explains the architecture, shows the full decision tree without clipping,
                    and gives you a copy-pasteable migration prompt you can hand to your own orchestrator.
                  </p>
                </Reveal>
                <Reveal delay={4}>
                  <DownloadButtons />
                </Reveal>
              </div>

              <Reveal delay={2}>
                <div className="rounded-[28px] border border-[#FCF4EB]/[0.12] bg-[linear-gradient(180deg,rgba(252,244,235,0.06),rgba(124,105,199,0.10))] p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#FCF4EB]/45 font-semibold mb-5">
                    What this fixes
                  </p>
                  <div className="space-y-4">
                    <div className="rounded-xl border border-[#FCF4EB]/[0.10] bg-[rgba(252,244,235,0.05)] p-4">
                      <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest mb-2">
                        Without this
                      </p>
                      <p className="text-[#FCF4EB] leading-relaxed">
                        More agents and more skills eventually make the system slower, noisier, and less reliable.
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#FCF4EB]/[0.10] bg-[rgba(245,195,198,0.06)] p-4">
                      <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest mb-2">
                        With this
                      </p>
                      <p className="text-[#FCF4EB] leading-relaxed">
                        Requests get routed by lane, execution stays authoritative, and the top of the stack stays tiny.
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#FCF4EB]/[0.10] bg-[rgba(124,105,199,0.10)] p-4">
                      <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest mb-2">
                        Deliverables
                      </p>
                      <p className="text-[#FCF4EB] leading-relaxed">
                        A public guide, a direct-download PDF, and a universal migration prompt you can hand to any orchestrator.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-10">
          <ProTip type="warning">
            This architecture is not about stuffing more intelligence into the prompt. It is about
            shrinking the top of the system so the runtime can load only what is necessary.
          </ProTip>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-8">
          <Reveal>
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              The real problem
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FCF4EB] mb-3">
              Big capability systems get slower before they get smarter
            </h2>
            <p className="text-[#FCF4EB]/55 max-w-3xl leading-relaxed">
              The failure mode is rarely raw model intelligence. It is almost always architecture: too much
              context, too many ambiguous surfaces, and no clean authority boundary between deterministic operations
              and judgment-heavy work.
            </p>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 mt-8">
            {PROBLEM_POINTS.map((item, index) => (
              <Reveal key={item.title} delay={index + 1}>
                <div className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(252,244,235,0.05),rgba(245,195,198,0.03))] p-5">
                  <p className="text-[#F5C3C6] text-xs font-semibold uppercase tracking-[0.18em] mb-2">
                    {item.title}
                  </p>
                  <p className="text-[#FCF4EB]/72 text-sm leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12">
          <Reveal>
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              The architecture
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FCF4EB] mb-3">
              Tiny bootstrap first. Lane-native execution second.
            </h2>
          </Reveal>

          <div className="mt-8 space-y-4">
            {FLOW_STEPS.map((item, index) => (
              <Reveal key={item.id} delay={index + 1}>
                <div className="grid gap-4 lg:grid-cols-[100px_1fr] rounded-[26px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(124,105,199,0.14),rgba(252,244,235,0.03))] p-5 sm:p-6">
                  <div className="flex lg:block items-center gap-3">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#7C69C7]/16 border border-[#7C69C7]/28 text-[#9D8FE0] font-bold">
                      {item.step}
                    </span>
                    <p className="text-[#FCF4EB]/38 text-xs uppercase tracking-[0.18em]">
                      Step
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-2 mb-3">
                      <h3 className="text-2xl font-bold text-[#FCF4EB]">{item.title}</h3>
                      <p className="text-[#F5C3C6] text-sm font-semibold">{item.summary}</p>
                    </div>
                    <p className="text-[#FCF4EB]/70 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12">
          <Reveal>
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              The decision tree
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FCF4EB] mb-3">
              Fully visible, no clipped diagram required
            </h2>
            <p className="text-[#FCF4EB]/55 max-w-3xl leading-relaxed">
              The outer router chooses the lane. The lane system chooses the executor. That is the
              whole trick.
            </p>
          </Reveal>

          <Reveal delay={1}>
            <div className="mt-8 rounded-[30px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(252,244,235,0.06),rgba(124,105,199,0.06))] p-5 sm:p-8">
              <div className="grid gap-4">
                <div className="rounded-2xl border border-white/[0.10] bg-white/[0.04] p-5 text-center">
                  <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-[0.2em] mb-2">Start</p>
                  <p className="text-[#FCF4EB] text-xl font-bold">Incoming request</p>
                </div>
                <div className="flex justify-center text-[#7C69C7] text-2xl">↓</div>
                <div className="rounded-2xl border border-[#7C69C7]/25 bg-[#7C69C7]/10 p-5 text-center">
                  <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-[0.2em] mb-2">Bootstrap</p>
                  <p className="text-[#FCF4EB] text-xl font-bold">Read ROUTING-SLIM.md</p>
                </div>
                <div className="flex justify-center text-[#7C69C7] text-2xl">↓</div>
                <div className="rounded-2xl border border-[#F5C3C6]/25 bg-[#F5C3C6]/10 p-5 text-center">
                  <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-[0.2em] mb-2">Discovery</p>
                  <p className="text-[#FCF4EB] text-xl font-bold">Load compact capability index</p>
                </div>
                <div className="flex justify-center text-[#7C69C7] text-2xl">↓</div>
                <div className="rounded-2xl border border-white/[0.10] bg-white/[0.04] p-5">
                  <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-[0.2em] mb-3 text-center">Lane selector</p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-white/[0.10] bg-[#151515]/60 p-4">
                      <p className="text-[#F5C3C6] font-semibold mb-2">Is it deterministic operational work?</p>
                      <p className="text-[#FCF4EB]/65 text-sm">If yes, route to the recipe lane.</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.10] bg-[#151515]/60 p-4">
                      <p className="text-[#F5C3C6] font-semibold mb-2">Is it a named orchestration pattern?</p>
                      <p className="text-[#FCF4EB]/65 text-sm">If yes, route to the workflow lane.</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.10] bg-[#151515]/60 p-4">
                      <p className="text-[#F5C3C6] font-semibold mb-2">Otherwise, is it ambiguous or compositional?</p>
                      <p className="text-[#FCF4EB]/65 text-sm">Route to the worker or skill lane.</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-3 mt-2">
                  {LANE_CARDS.map((lane) => (
                    <div
                      key={lane.lane}
                      className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(252,244,235,0.05),rgba(124,105,199,0.04))] p-5"
                    >
                      <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-[0.18em] mb-2">
                        {lane.label}
                      </p>
                      <h3 className="text-[#FCF4EB] text-2xl font-bold mb-3">{lane.lane}</h3>
                      <p className="text-[#FCF4EB]/72 leading-relaxed">{lane.body}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center text-[#7C69C7] text-2xl">↓</div>
                <div className="rounded-2xl border border-white/[0.10] bg-white/[0.04] p-5 text-center">
                  <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-[0.2em] mb-2">Finish</p>
                  <p className="text-[#FCF4EB] text-xl font-bold">Return one normalized result envelope</p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12">
          <Reveal>
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              Why this scales
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FCF4EB] mb-3">
              It grows by breadcrumbing, not by preloading everything
            </h2>
          </Reveal>
          <div className="grid gap-3 md:grid-cols-2 mt-8">
            {WHY_IT_SCALES.map((point, index) => (
              <Reveal key={point} delay={index + 1}>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-4 text-[#FCF4EB]/78 leading-relaxed">
                  {point}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12">
          <Reveal>
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              Build rules
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FCF4EB] mb-3">
              The system only stays clean if new capabilities enter cleanly
            </h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 mt-8">
            {RULE_SECTIONS.map((rule, index) => (
              <Reveal key={rule.title} delay={index + 1}>
                <div className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(245,195,198,0.05),rgba(252,244,235,0.03))] p-5">
                  <h3 className="text-[#FCF4EB] text-xl font-bold mb-3">{rule.title}</h3>
                  <p className="text-[#FCF4EB]/68 leading-relaxed">{rule.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="migration-prompt" className="max-w-6xl mx-auto px-6 py-14">
          <Reveal>
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              Copy-pasteable prompt
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FCF4EB] mb-3">
              Hand this to your orchestrator and make it do the migration properly
            </h2>
            <p className="text-[#FCF4EB]/55 max-w-3xl leading-relaxed">
              This prompt is written to force an audit-first migration. It makes the system inspect what
              already exists, preserve deterministic infrastructure, and only then restructure toward the
              lane-based model.
            </p>
          </Reveal>

          <PromptButtons prompt={MIGRATION_PROMPT} />
          <CodeBlock
            code={MIGRATION_PROMPT}
            language="txt"
            filename="cross-cli-compatibility-routing-prompt.md"
          />
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16">
          <Reveal>
            <div className="rounded-[32px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(124,105,199,0.16),rgba(252,244,235,0.05))] px-6 py-10 sm:px-10 text-center shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
              <p className="text-[#F5C3C6] text-xs font-semibold uppercase tracking-[0.22em] mb-3">
                Bonus resource
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#FCF4EB] mb-4">
                Download the polished PDF version
              </h2>
              <p className="text-[#FCF4EB]/60 max-w-2xl mx-auto leading-relaxed">
                The PDF packages the architecture, the visible decision tree, the lane rules, and the full
                migration prompt into one clean giveaway asset you can keep, share, or hand off.
              </p>
              <DownloadButtons />
            </div>
          </Reveal>
        </section>

        <MastermindCTA />
        <MastermindReactionsSection />
      </main>
    </>
  )
}

function MastermindCTA() {
  return (
    <section className="relative px-6 pt-8 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-[34px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(21,21,21,0.96),rgba(43,31,56,0.96))] px-6 py-10 sm:px-10 md:px-12 md:py-12 overflow-hidden relative">
          <div
            className="absolute -top-24 -right-16 h-64 w-64 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(124, 105, 199, 0.20) 0%, transparent 72%)' }}
          />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[#F5C3C6] text-xs font-semibold uppercase tracking-[0.22em] mb-3">
                Masterminds HQ
              </p>
              <h3 className="text-[#FCF4EB] text-3xl md:text-4xl font-extrabold leading-tight mb-4">
                This is what we actually build inside the program
              </h3>
              <p className="text-[#FCF4EB]/62 leading-relaxed">
                Coaches, consultants, and operators use the Mastermind to build real business infrastructure:
                sites, funnels, automations, and now agent systems that stay usable after the tenth capability.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={MASTERMIND_URL}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#7C69C7] hover:bg-[#6b59b7] text-white font-semibold transition-all"
              >
                Explore Masterminds HQ
              </a>
              <a
                href={PDF_PATH}
                download
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#F5C3C6] hover:bg-[#efb7bc] text-[#151515] font-bold transition-all"
              >
                Download the PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
