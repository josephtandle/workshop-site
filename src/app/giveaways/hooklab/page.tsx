'use client'

import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import GiveawayEmailModal from '@/components/giveaways/GiveawayEmailModal'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'
import { copyWithConfetti } from '@/lib/copyWithConfetti'

const MASTERMIND_URL = 'https://www.mastermindshq.business'
const GITHUB_URL = 'https://github.com/josephtandle/ultimate-hooklab-skill'
const MANYCHAT_KEYWORD = 'hooklab'
const INSTALL_COMMAND = 'curl -fsSL https://raw.githubusercontent.com/josephtandle/ultimate-hooklab-skill/main/install.sh | bash'

const MODES = [
  {
    name: 'Standard',
    body: "Use your brand voice and this week's topic to generate 15 candidates, score every one, then surface the 5 strongest hooks with 2 winners.",
  },
  {
    name: 'Reverse Engineer',
    body: 'Pull from research accounts in your niche, deconstruct the hooks that are already working, then rebuild them in your voice.',
  },
  {
    name: 'CTA First',
    body: 'Start with a giveaway, lead magnet, or offer. HookLab works backwards so the hook points to the action you actually want.',
  },
  {
    name: 'Punch Script',
    body: 'Generate two short 15-25 second scripts built for the first three seconds, saves, shares, and fast filming.',
  },
]

const SCORE_AXES = [
  'Concreteness',
  'Mechanism',
  'Voice Fidelity',
  'Self-Recognition',
  'Thumb Stop',
]

export default function HookLabPage() {
  const [emailModalOpen, setEmailModalOpen] = useState(false)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Install HookLab for Claude Code',
    description:
      'A free Claude Code skill that generates scored Instagram Reel hooks from your brand voice, niche research, or a specific CTA.',
    author: {
      '@type': 'Person',
      name: 'Joe Che',
      url: 'https://www.mastermindshq.business',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Business Automation Mastermind',
      url: 'https://www.mastermindshq.business',
    },
    step: [
      {
        '@type': 'HowToStep',
        name: 'Copy the install command',
        text: 'Copy the one-line install command from this page.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Run it in your terminal',
        text: 'Paste and run the command. It installs HookLab, creates your personal templates, registers the Claude Code skill, and installs the research dependencies.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Type /hooklab in Claude Code',
        text: 'Fill in your brand voice, research accounts, and weekly topic, then run /hooklab in Claude Code.',
        position: 3,
      },
    ],
    tool: [
      { '@type': 'HowToTool', name: 'Claude Code' },
      { '@type': 'HowToTool', name: 'Terminal' },
    ],
    totalTime: 'PT4M',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen overflow-x-hidden bg-[#151515] text-[#FCF4EB]">
        <section className="relative isolate flex min-h-screen items-center px-5 py-12 sm:px-8">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-[8%] top-[12%] h-[22rem] w-[22rem] rounded-full bg-[#7C69C7]/16 blur-[110px]" />
            <div className="absolute bottom-[10%] right-[4%] h-[19rem] w-[19rem] rounded-full bg-[#F5C3C6]/12 blur-[100px]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FCF4EB]/12 to-transparent" />
          </div>

          <div className="mx-auto grid w-full min-w-0 max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="min-w-0"
            >
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#7C69C7]/35 bg-[#7C69C7]/12 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#BDB3E8]">
                Free Claude Code skill
              </p>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-normal text-[#FCF4EB] sm:text-7xl lg:text-8xl">
                HookLab
              </h1>
              <p className="mt-5 max-w-2xl text-xl font-semibold leading-tight text-[#F5C3C6] sm:text-3xl">
                Generate Reel hooks that sound like you and point to a real action.
              </p>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#FCF4EB]/58 sm:text-lg">
                HookLab reads your brand voice, studies what is working in your niche, scores every hook on five axes, and gives you scripts you can film the same day.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CopyInstallButton onAfterCopy={() => setEmailModalOpen(true)} />
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-[#FCF4EB]/76 transition hover:border-[#F5C3C6]/35 hover:text-[#FCF4EB]"
                >
                  View public repo
                </a>
              </div>

              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#FCF4EB]/30">
                Comment word: <span className="text-[#BDB3E8]">{MANYCHAT_KEYWORD}</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="min-w-0 rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-[0_30px_110px_rgba(0,0,0,0.35)]"
            >
              <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                <span className="text-xs font-mono text-[#FCF4EB]/42">Terminal</span>
                <InlineCopyButton onAfterCopy={() => setEmailModalOpen(true)} />
              </div>
              <pre className="whitespace-pre-wrap break-all p-5 text-sm leading-7 text-[#FCF4EB]/82">
                <code>{INSTALL_COMMAND}</code>
              </pre>
              <div className="grid border-t border-white/8 sm:grid-cols-3">
                {['installs ~/.hooklab', 'registers /hooklab', 'adds research deps'].map((item) => (
                  <div key={item} className="border-white/8 px-4 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#FCF4EB]/36 sm:border-r last:sm:border-r-0">
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="mb-9 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#BDB3E8]">Four ways to run it</p>
            <h2 className="mt-3 text-3xl font-black tracking-normal text-[#FCF4EB] sm:text-5xl">
              Pick the path that matches the post.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {MODES.map((mode, index) => (
              <motion.article
                key={mode.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="rounded-2xl border border-white/9 bg-white/[0.04] p-6 transition hover:border-[#7C69C7]/34 hover:bg-white/[0.055]"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#7C69C7]/16 text-sm font-black text-[#BDB3E8]">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-lg font-black text-[#FCF4EB]">{mode.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[#FCF4EB]/48">{mode.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="overflow-hidden rounded-2xl border border-[#F5C3C6]/16 bg-[#F5C3C6]/[0.055]">
            <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F5C3C6]">Scored, not guessed</p>
                <h2 className="mt-3 text-3xl font-black tracking-normal text-[#FCF4EB] sm:text-5xl">
                  Every hook gets a 50-point read.
                </h2>
                <p className="mt-5 text-base leading-8 text-[#FCF4EB]/54">
                  HookLab does not just hand you pretty lines. It scores each option for the exact things that make someone stop, recognize themselves, and keep watching.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {SCORE_AXES.map((axis) => (
                  <div key={axis} className="rounded-xl border border-white/9 bg-black/20 px-4 py-4">
                    <p className="text-sm font-bold text-[#FCF4EB]">{axis}</p>
                  </div>
                ))}
                <div className="rounded-xl border border-[#7C69C7]/25 bg-[#7C69C7]/14 px-4 py-4">
                  <p className="text-sm font-bold text-[#BDB3E8]">2 winners surfaced</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <MastermindCTA />
        <MastermindReactionsSection />

        <section className="mx-auto max-w-5xl px-5 py-16 text-center sm:px-8">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#BDB3E8]">The repo</p>
          <h2 className="text-3xl font-black text-[#FCF4EB] sm:text-5xl">Public, installable, ready to run.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#FCF4EB]/52">
            The giveaway points to Joe&apos;s public GitHub repo. Run the installer, fill in your brand voice, add a few research accounts, and start with <code className="font-mono text-[#BDB3E8]">/hooklab</code>.
          </p>

          <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-white/10 bg-[#0d0d0d] text-left">
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
              <span className="text-xs font-mono text-[#FCF4EB]/42">Install command</span>
              <InlineCopyButton onAfterCopy={() => setEmailModalOpen(true)} />
            </div>
            <pre className="whitespace-pre-wrap break-all p-5 text-sm leading-7 text-[#FCF4EB]/82">
              <code>{INSTALL_COMMAND}</code>
            </pre>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CopyInstallButton onAfterCopy={() => setEmailModalOpen(true)} />
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] px-8 py-4 text-sm font-bold text-[#FCF4EB]/76 transition hover:border-[#F5C3C6]/35 hover:text-[#FCF4EB] sm:w-auto"
            >
              Open GitHub repo
            </a>
          </div>

          <p className="mx-auto mt-5 max-w-md text-xs leading-6 text-[#FCF4EB]/28">
            Coming from Instagram or ManyChat? The giveaway keyword is <span className="font-bold uppercase text-[#BDB3E8]">{MANYCHAT_KEYWORD}</span>.
          </p>
        </section>

        <footer className="px-5 pb-10 text-center">
          <a
            href={MASTERMIND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#FCF4EB]/16 transition hover:text-[#FCF4EB]/38"
          >
            Business Automation Mastermind
          </a>
        </footer>
      </main>

      <GiveawayEmailModal
        slug={MANYCHAT_KEYWORD}
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        headingOverride="Want the HookLab install notes by email too?"
      />
    </>
  )
}

function CopyInstallButton({ onAfterCopy }: { onAfterCopy?: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await copyWithConfetti(INSTALL_COMMAND, event)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 3000)
      onAfterCopy?.()
    } catch {
      // Clipboard can fail in restricted browsers. The command remains visible.
    }
  }, [onAfterCopy])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex w-full items-center justify-center rounded-xl bg-[#7C69C7] px-8 py-4 text-sm font-black text-[#FCF4EB] transition hover:bg-[#6e5db8] active:scale-[0.98] sm:w-auto"
    >
      {copied ? 'Copied. Run it in your terminal.' : 'Copy install command'}
    </button>
  )
}

function InlineCopyButton({ onAfterCopy }: { onAfterCopy?: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await copyWithConfetti(INSTALL_COMMAND, event)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
      onAfterCopy?.()
    } catch {
      // Clipboard can fail in restricted browsers. The command remains visible.
    }
  }, [onAfterCopy])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-[#FCF4EB]/62 transition hover:bg-white/[0.14] hover:text-[#FCF4EB]"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function MastermindCTA() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="overflow-hidden rounded-2xl border border-[#7C69C7]/18 bg-[linear-gradient(135deg,rgba(124,105,199,0.11),rgba(245,195,198,0.07))] px-6 py-10 text-center sm:px-12 sm:py-14">
        <h2 className="text-3xl font-black text-[#FCF4EB] sm:text-5xl">Want to build tools like this?</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#FCF4EB]/58 sm:text-lg">
          Join the Business Automation Mastermind and build practical AI systems, lead magnets, automations, and launch pages with a small group that ships every week.
        </p>
        <a
          href={MASTERMIND_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#F5C3C6] px-8 py-4 text-sm font-black text-[#151515] transition hover:bg-[#efb7bb] active:scale-[0.98] sm:w-auto"
        >
          Learn More
        </a>
      </div>
    </section>
  )
}
