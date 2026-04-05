'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import CodeBlock from '@/components/CodeBlock'
import Reveal from '@/components/Reveal'
import ProTip from '@/components/ProTip'
import { celebrate as launchConfetti } from '@/lib/celebrate'

const checklistItems = [
  {
    id: 'interactive-only',
    title: 'Keep Claude Code human-operated',
    risk:
      'Do not use a personal Claude login as the engine for unattended jobs, bots, cron tasks, or agent daemons.',
    fix:
      'Use Claude Code interactively with a human at the keyboard. If you need background automation, move that workflow to API-backed infrastructure.',
  },
  {
    id: 'oauth-agents',
    title: 'Do not use OAuth/session credentials to run agents',
    risk:
      'Personal Claude session access is not a safe foundation for running autonomous agents or productized workflows.',
    fix:
      'Use Anthropic API keys, or an approved provider path such as Anthropic Console, Bedrock, Vertex, or Foundry when you need real automation.',
  },
  {
    id: 'wrappers',
    title: 'Do not wrap Claude or the CLI inside your own product shell',
    risk:
      'If your app or service is effectively a hidden browser shell, wrapper, or relay around Claude Code or the consumer product, that is a bad pattern.',
    fix:
      'Build your product on supported APIs and provider abstractions instead of tunneling a consumer Claude session through your own interface.',
  },
  {
    id: 'account-switching',
    title: 'Never rotate or switch between accounts to keep automation alive',
    risk:
      'Account switching, token sync, or other multi-account workarounds create exactly the kind of signals you do not want.',
    fix:
      'Delete account-rotation logic. One human account for human use, API credentials for automation.',
  },
  {
    id: 'openclaw-safe',
    title: 'Use OpenClaw with Claude Code the safe way',
    risk:
      'OpenClaw becomes risky when it silently turns Claude Code into an unattended backend or routes product/background work through a personal Claude session.',
    fix:
      'Interactive OpenClaw + Claude Code is fine for human-guided work. Product paths, bots, and background flows should run through API-backed providers instead.',
  },
  {
    id: 'credits',
    title: 'Do not treat extra usage credits like real automation budget',
    risk:
      'Those credits can disappear extremely fast under agentic workloads. Burning through $20 in a few minutes is easy if you treat consumer usage like API infrastructure.',
    fix:
      'Use consumer usage for interactive work only. Budget automation separately with API pricing, monitoring, and hard limits.',
  },
] as const

const saferPatterns = [
  'Human-operated Claude Code for coding, debugging, and guided repo work',
  'Anthropic API keys for real automation and background execution',
  'Provider-backed deployments through Anthropic Console, Bedrock, Vertex, or Foundry when teams need scale or governance',
  'OpenClaw routing that keeps consumer Claude use interactive and moves automation to API-backed providers',
] as const

const sourceLinks = [
  {
    label: 'Anthropic Consumer Terms',
    href: 'https://www.anthropic.com/legal/consumer-terms',
  },
  {
    label: 'Using agents according to Anthropic usage policy',
    href: 'https://support.claude.com/en/articles/12005017-using-agents-according-to-our-usage-policy',
  },
  {
    label: 'Claude Code enterprise deployment overview',
    href: 'https://code.claude.com/docs/en/third-party-integrations',
  },
] as const

const auditPrompt = `Audit my current Claude / Claude Code / OpenClaw setup for Anthropic policy and enforcement risk.

Check this repository and my local setup for any of the following patterns:
1. Using a personal Claude login, OAuth token, local session, or consumer auth to power unattended agents, bots, cron jobs, daemons, or product workflows
2. Wrapping Claude Code or the Claude CLI inside a third-party shell, browser wrapper, gateway, router, relay, or embedded terminal product
3. Account switching, token sync, multi-account failover, or any logic designed to rotate between Claude accounts
4. OpenClaw or local tools routing background work through consumer Claude sessions instead of API-backed providers
5. Workflows that assume bonus usage credits are a safe budget for automation

Search for obvious files, scripts, env vars, cron jobs, launch agents, and code paths related to:
- switch-claude-account
- token-sync
- claude-router
- consumer OAuth/session reuse
- unattended claude calls
- background bots using Claude Code
- OpenClaw paths that call Claude outside normal interactive use

Then produce:
- a short risk summary
- a table or bullet list of findings by severity
- the exact files or jobs involved
- the safer replacement for each risky pattern
- a “safe to keep” list for interactive human-operated workflows

Do not be vague. Be explicit and conservative.`

export default function AnthropicSafetyChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [celebrate, setCelebrate] = useState(false)

  const completedCount = useMemo(
    () => checklistItems.filter((item) => checked[item.id]).length,
    [checked]
  )

  const allDone = completedCount === checklistItems.length

  useEffect(() => {
    if (!allDone) return
    launchConfetti()
    setCelebrate(true)
    const timeout = setTimeout(() => setCelebrate(false), 2200)
    return () => clearTimeout(timeout)
  }, [allDone])

  const toggleItem = (id: string) => {
    setChecked((current) => {
      const nextValue = !current[id]
      if (nextValue) {
        launchConfetti()
      }
      return { ...current, [id]: nextValue }
    })
  }

  return (
    <main>
      <section className="relative overflow-hidden py-20 sm:py-24 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="aurora-orb absolute top-[-14%] left-[5%] h-[420px] w-[420px] rounded-full opacity-24"
            style={{ background: 'radial-gradient(circle, rgba(124, 105, 199, 0.55) 0%, transparent 70%)' }}
          />
          <div
            className="aurora-orb absolute top-[10%] right-[10%] h-[220px] w-[220px] rounded-full opacity-14"
            style={{ background: 'radial-gradient(circle, rgba(124, 105, 199, 0.34) 0%, transparent 72%)' }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div>
              <Reveal>
                <h1 className="gradient-text text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-5 max-w-4xl">
                  How to avoid getting banned by Anthropic
                </h1>
              </Reveal>
              <Reveal delay={1}>
                <p className="text-[#FCF4EB]/68 text-lg sm:text-xl leading-relaxed max-w-3xl">
                  This is the practical version: the patterns most likely to put your Claude setup in a bad place,
                  the safer replacement for each one, and a copyable prompt you can use to audit your own stack.
                </p>
              </Reveal>
            </div>

            <Reveal delay={2}>
              <div className="rounded-2xl border border-[#FCF4EB]/[0.12] bg-[linear-gradient(180deg,rgba(252,244,235,0.06),rgba(245,195,198,0.06))] p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                <p className="text-xs uppercase tracking-[0.22em] text-[#FCF4EB]/45 font-semibold mb-5">
                  Read this correctly
                </p>
                <div className="space-y-4">
                  <div className="rounded-xl border border-[#FCF4EB]/[0.10] bg-[rgba(252,244,235,0.05)] p-4">
                    <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest mb-2">Core idea</p>
                    <p className="text-[#FCF4EB] leading-relaxed">
                      The safest line is simple: keep consumer Claude usage human-operated, and move automation to
                      API-backed infrastructure.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#FCF4EB]/[0.10] bg-[rgba(245,195,198,0.06)] p-4">
                    <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest mb-2">OpenClaw note</p>
                    <p className="text-[#FCF4EB] leading-relaxed">
                      OpenClaw itself is not the problem. The risk appears when OpenClaw is used to turn Claude Code
                      into a hidden unattended backend instead of an interactive tool.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-12">
        <ProTip type="warning">
          This page is practical guidance, not legal advice. Use the official Anthropic links below when you want to
          verify the policy language yourself.
        </ProTip>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <Reveal>
          <div className="mb-6">
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              Interactive checklist
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              Work down this list and fix every risky pattern you find
            </h2>
          </div>
        </Reveal>

        <div className="mb-6 rounded-2xl border border-[#FCF4EB]/[0.10] bg-[linear-gradient(180deg,rgba(252,244,235,0.05),rgba(245,195,198,0.05))] px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[#FCF4EB]/45 text-xs uppercase tracking-[0.22em] font-semibold mb-1">Checklist progress</p>
              <p className="text-[#FCF4EB] text-lg font-semibold">
                {completedCount} of {checklistItems.length} complete
              </p>
            </div>
            <div className="h-2 w-full sm:max-w-[260px] rounded-full bg-white/[0.07] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(completedCount / checklistItems.length) * 100}%`,
                  background: 'linear-gradient(90deg, #7C69C7 0%, #F5C3C6 100%)',
                }}
              />
            </div>
          </div>
          {celebrate && allDone && (
            <p className="mt-3 text-sm font-semibold text-[#F5C3C6]">
              All clear. You worked through every risk item on the page.
            </p>
          )}
        </div>

        <div className="grid gap-4">
          {checklistItems.map((item, index) => {
            const isChecked = !!checked[item.id]

            return (
              <Reveal key={item.id} delay={index + 1}>
                <div
                  className={`card-hover w-full rounded-[28px] border p-5 sm:p-6 text-left transition-all ${
                    isChecked
                      ? 'border-[#F5C3C6]/35 bg-[linear-gradient(180deg,rgba(245,195,198,0.16),rgba(252,244,235,0.06))]'
                      : 'border-[#FCF4EB]/[0.10] bg-[linear-gradient(180deg,rgba(124,105,199,0.16),rgba(252,244,235,0.04))]'
                  }`}
                >
                  <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
                    <div className="flex items-center gap-3 lg:items-start lg:flex-col">
                      <span
                        className={`number-glow flex h-11 w-11 items-center justify-center rounded-xl border text-lg font-bold ${
                          isChecked
                            ? 'border-[#F5C3C6]/40 bg-[#F5C3C6]/20 text-[#FCF4EB]'
                            : 'border-[#7C69C7]/30 bg-[#7C69C7]/18 text-[#9D8FE0]'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FCF4EB]/40">
                        Stage {index + 1}
                      </span>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                      <div>
                        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <h3 className="text-xl font-bold text-[#FCF4EB]">{item.title}</h3>
                          <button
                            type="button"
                            onClick={() => toggleItem(item.id)}
                            className={`inline-flex items-center gap-2 self-start rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all ${
                              isChecked
                                ? 'border-[#F5C3C6]/45 bg-[#F5C3C6]/18 text-[#FCF4EB]'
                                : 'border-[#FCF4EB]/20 bg-white/[0.04] text-[#FCF4EB]/65'
                            }`}
                            aria-pressed={isChecked}
                            aria-label={`Mark ${item.title} as complete`}
                          >
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-md border text-[12px] ${
                                isChecked
                                  ? 'border-[#F5C3C6]/50 bg-[#F5C3C6]/20 text-[#FCF4EB]'
                                  : 'border-[#FCF4EB]/25 bg-white/[0.04] text-transparent'
                              }`}
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                            {isChecked ? 'Checked' : 'Check this'}
                          </button>
                        </div>
                        <p className="text-[#FCF4EB]/72 leading-relaxed">
                          {item.risk}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[#FCF4EB]/[0.08] bg-[rgba(252,244,235,0.05)] p-4">
                        <p className="text-xs uppercase tracking-widest text-[#FCF4EB]/45 mb-2">Safer replacement</p>
                        <p className="text-[#FCF4EB] leading-relaxed">{item.fix}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="glow-divider" />
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <Reveal>
          <div className="mb-6">
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              Safer patterns
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              What a low-risk Claude setup usually looks like
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {saferPatterns.map((pattern, index) => (
            <Reveal key={pattern} delay={index + 1}>
              <div className="card-hover rounded-2xl border border-[#FCF4EB]/[0.08] bg-[linear-gradient(180deg,rgba(252,244,235,0.05),rgba(245,195,198,0.04))] p-5">
                <p className="text-[#FCF4EB] leading-relaxed">{pattern}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <Reveal>
          <div className="mb-6">
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              Audit prompt
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              Paste this into Claude Code and let it audit your setup
            </h2>
          </div>
        </Reveal>

        <div className="rounded-[28px] border border-[#FCF4EB]/[0.10] bg-[linear-gradient(180deg,rgba(124,105,199,0.14),rgba(252,244,235,0.04))] p-6 sm:p-7">
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
            This prompt is designed to catch the exact patterns that tend to create avoidable Anthropic risk.
          </p>
          <CodeBlock code={auditPrompt} filename="Paste into Claude Code" editable />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <Reveal>
          <div className="mb-6">
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              Official links
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              If you want to verify the source material yourself
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3">
          {sourceLinks.map((source, index) => (
            <Reveal key={source.href} delay={index + 1}>
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover block rounded-2xl border border-[#FCF4EB]/[0.08] bg-[linear-gradient(180deg,rgba(252,244,235,0.05),rgba(245,195,198,0.04))] p-5"
              >
                <p className="text-[#FCF4EB] font-semibold mb-2">{source.label}</p>
                <p className="text-sm text-[#FCF4EB]/55 break-all">{source.href}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <div
            className="card-hover rounded-[32px] p-8 sm:p-10 lg:p-12"
            style={{
              background:
                'linear-gradient(135deg, rgba(245, 195, 198, 0.14) 0%, rgba(124, 105, 199, 0.12) 42%, rgba(252, 244, 235, 0.08) 100%)',
              border: '1px solid rgba(252,244,235,0.10)',
            }}
          >
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
                  Masterminds HQ
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FCF4EB] leading-tight mb-4">
                  If you want safer AI systems, build them with the right operating model
                </h2>
                <p className="max-w-2xl text-[#FCF4EB]/68 text-lg leading-relaxed mb-6">
                  Masterminds HQ is for founders who want more than prompts. It is about designing practical systems,
                  better workflows, stronger business automation, and cleaner AI infrastructure that does not quietly
                  create risk.
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#FCF4EB]/[0.08] bg-[rgba(252,244,235,0.05)] p-4">
                    <p className="text-xs uppercase tracking-widest text-[#FCF4EB]/40 mb-2">Learn how to</p>
                    <p className="text-[#FCF4EB] font-semibold leading-relaxed">Build agents that do real work</p>
                  </div>
                  <div className="rounded-2xl border border-[#FCF4EB]/[0.08] bg-[rgba(245,195,198,0.08)] p-4">
                    <p className="text-xs uppercase tracking-widest text-[#FCF4EB]/40 mb-2">Learn how to</p>
                    <p className="text-[#FCF4EB] font-semibold leading-relaxed">Upgrade your business with AI leverage</p>
                  </div>
                  <div className="rounded-2xl border border-[#FCF4EB]/[0.08] bg-[rgba(252,244,235,0.05)] p-4">
                    <p className="text-xs uppercase tracking-widest text-[#FCF4EB]/40 mb-2">Related topics</p>
                    <p className="text-[#FCF4EB] font-semibold leading-relaxed">
                      Safe automation, operator systems, prompts, workflows, and business infrastructure
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#FCF4EB]/[0.10] bg-[linear-gradient(180deg,rgba(252,244,235,0.07),rgba(245,195,198,0.08))] p-6 sm:p-7 shadow-[0_18px_60px_rgba(0,0,0,0.20)]">
                <h3 className="text-2xl font-bold text-[#FCF4EB] mb-3">See whether Masterminds HQ fits where you are now</h3>
                <p className="text-[#FCF4EB]/68 leading-relaxed mb-6">
                  The main site gives the clearest overview of the mastermind, the live sessions, the community, the
                  resource vault, and the kind of practical business automation support Joe is actually offering.
                </p>
                <Link
                  href="https://www.mastermindshq.business/"
                  className="inline-flex items-center rounded-xl bg-[#FCF4EB] px-5 py-3 text-sm font-semibold text-[#151515] transition-transform hover:-translate-y-0.5"
                >
                  Visit mastermindshq.business
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
