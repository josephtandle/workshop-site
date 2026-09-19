import Link from 'next/link'
import Reveal from '@/components/Reveal'
import StickyVideoPlayer from '@/components/StickyVideoPlayer'

const VIDEO_SRC = 'https://media.mastermindshq.business/giveaways/terminal-to-claude-desktop-20260810.mp4'

const WHAT_YOU_WILL_SEE = [
  'Find Code inside the Claude Desktop app.',
  'Open your existing project folder and review its settings and connectors.',
  'Verify the tools and context your work needs before you rely on them.',
]

const FOLLOW_ALONG_STEPS = [
  "Open the app's Code area.",
  'Select your existing project folder.',
  'Ask Claude to inspect the existing instructions and tools, then report any missing setup.',
  'Approve only the changes you intend.',
  'Run a small, familiar task to check the context.',
]

export default function TerminalToClaudeDesktopGiveawayPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative px-6 pt-20 pb-12 sm:pt-24 sm:pb-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 left-[8%] h-80 w-80 rounded-full bg-[#8B79D4]/20 blur-3xl" />
          <div className="absolute top-24 right-[8%] h-64 w-64 rounded-full bg-[#F5C3C6]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <Link
              href="/giveaways"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#FCF4EB]/60 transition-colors hover:text-[#FCF4EB]"
            >
              <span aria-hidden="true">←</span>
              Back to Giveaways
            </Link>
          </Reveal>

          <div className="mt-10 space-y-8">
            <div>
              <Reveal delay={1}>
                <div className="mb-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#8B79D4]/35 bg-[#8B79D4]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#BDB3E8]">
                    Free video
                  </span>
                  <span className="rounded-full border border-white/[0.12] bg-white/[0.05] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#FCF4EB]/70">
                    No signup required to watch
                  </span>
                </div>
              </Reveal>
              <Reveal delay={2}>
                <h1 className="gradient-text pb-2 text-5xl font-extrabold leading-[1.02] sm:text-6xl">
                  From Terminal to Claude Desktop
                </h1>
              </Reveal>
              <Reveal delay={3}>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#FCF4EB]/70 sm:text-xl">
                  Follow Joe&apos;s walkthrough of using Claude Code inside the Claude Desktop app.
                </p>
              </Reveal>
              <Reveal delay={4}>
                <div className="mt-7 space-y-3 border-l-2 border-[#8B79D4]/60 pl-4 text-sm leading-relaxed text-[#FCF4EB]/55">
                  <p>To follow along, sign in to your own Claude account in the app.</p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={2}>
              <div className="rounded-[28px] border border-white/[0.12] bg-white/[0.04] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.3)] sm:p-4">
                <StickyVideoPlayer
                  src={VIDEO_SRC}
                  title="Migrating to Claude Desktop"
                  inlineOnly
                />
                <div className="flex items-center justify-between gap-4 px-2 pt-4 text-xs text-[#FCF4EB]/50">
                  <span>Migrating to Claude Desktop</span>
                  <span className="shrink-0 font-semibold text-[#BDB3E8]">8 min 6 sec</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        <Reveal>
          <div className="rounded-2xl border border-[#F5C3C6]/15 bg-[#F5C3C6]/[0.05] px-5 py-4 text-sm leading-relaxed text-[#FCF4EB]/65 sm:px-6">
            <span className="font-semibold text-[#F5C3C6]">Recording note: </span>
            This is a Mac demonstration recorded in August 2026. App controls may change over time.
          </div>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B79D4]">What you&apos;ll see</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#FCF4EB]">A practical handoff to the desktop app</h2>
              <ul className="mt-7 space-y-4">
                {WHAT_YOU_WILL_SEE.map((item) => (
                  <li key={item} className="flex gap-3 text-[#FCF4EB]/65">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#8B79D4]/50 text-xs text-[#BDB3E8]">✓</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="rounded-3xl border border-white/[0.1] bg-white/[0.035] p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B79D4]">Follow along</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#FCF4EB]">A simple checklist</h2>
              <ol className="mt-7 space-y-4">
                {FOLLOW_ALONG_STEPS.map((item, index) => (
                  <li key={item} className="flex gap-4 text-sm leading-relaxed text-[#FCF4EB]/65">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8B79D4]/20 text-xs font-bold text-[#BDB3E8]">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-14 border-t border-white/[0.08] pt-8">
            <Link
              href="/giveaways"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-[#FCF4EB] transition-colors hover:bg-white/[0.09]"
            >
              <span aria-hidden="true">←</span>
              Back to Giveaways
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
