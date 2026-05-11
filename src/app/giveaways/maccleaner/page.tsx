import type { Metadata } from 'next'
import Reveal from '@/components/Reveal'
import GiveawayForm from './GiveawayForm'

export const metadata: Metadata = {
  title: 'MacCleaner',
  description: 'A safer way to clean up disk space on a Mac. Preview first, confirm before deleting anything, and archive old backups only when an external drive is available.',
  openGraph: {
    title: 'MacCleaner — Free Mac Cleanup Script',
    description: 'Preview-first Mac cleanup with explicit confirmation and external-drive-aware backup handling.',
  },
}

const CLEANUP_AREAS = [
  {
    title: 'Developer clutter',
    body: 'Build artifacts, temporary package caches, stale local outputs, and the noisy leftovers that pile up after shipping.',
    icon: '◇',
  },
  {
    title: 'Log and cache sprawl',
    body: 'Old logs, obvious cache bloat, and disk junk that quietly expands until your machine feels heavier than it should.',
    icon: '✦',
  },
  {
    title: 'Old iPhone backups',
    body: 'If a writable external drive is connected, MacCleaner archives old device backups there instead of blindly nuking them.',
    icon: '◎',
  },
]

const SAFETY_RULES = [
  'The first run is preview-only. You see what would happen before anything changes.',
  'Real cleanup requires explicit confirmation. No silent destructive mode.',
  'If no writable external drive exists, old iPhone backups are skipped instead of being deleted.',
  'The package is just a script. No Electron app, no background junk, no subscription.',
]

const STEPS = [
  {
    step: '01',
    title: 'Download the installer script',
    body: 'It installs MacCleaner into a normal local folder and adds a launcher at ~/bin/maccleaner.',
  },
  {
    step: '02',
    title: 'Run MacCleaner in preview mode',
    body: 'The default run shows what it would clean and what it will leave alone.',
  },
  {
    step: '03',
    title: 'Confirm only if the preview looks right',
    body: 'Cleanup runs only after you explicitly tell it to. That is the point.',
  },
]

export default function MacCleanerPage() {
  return (
    <main className="min-h-screen">
      <section className="relative pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-purple/10 border border-purple/20 rounded-full px-4 py-1.5 mb-8">
              <span className="text-purple text-xs">✦</span>
              <span className="text-purple text-xs font-semibold tracking-widest uppercase">Free Mac Tool</span>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <h1 className="gradient-text text-5xl md:text-6xl font-extrabold leading-[1.06] pb-2 mb-6">
              Clean your Mac<br />without playing<br />Russian roulette.
            </h1>
          </Reveal>

          <Reveal delay={2}>
            <p className="text-cream/60 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
              MacCleaner starts in preview mode, shows you what it would remove, and waits for explicit confirmation
              before doing anything destructive. If an external drive is available, it uses it for old backups. If not,
              it skips that step safely.
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 max-w-2xl mx-auto">
              <GiveawayForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
          {CLEANUP_AREAS.map((item, i) => (
            <Reveal key={item.title} delay={i + 1}>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 h-full">
                <div className="w-10 h-10 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center text-purple mb-4">
                  {item.icon}
                </div>
                <h2 className="text-cream font-semibold text-lg mb-2">{item.title}</h2>
                <p className="text-cream/55 text-sm leading-relaxed">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-purple font-semibold text-center mb-3">
              Why this version exists
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-cream text-center mb-3">
              Safe first, then useful
            </h2>
            <p className="text-cream/50 text-center text-sm max-w-2xl mx-auto mb-10">
              Most cleanup tools hide the risky part behind a glossy button. This one does the opposite.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-4">
            {SAFETY_RULES.map((rule, i) => (
              <Reveal key={rule} delay={i + 1}>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-purple/10 border border-purple/20 flex items-center justify-center text-purple text-xs">
                      {i + 1}
                    </div>
                    <p className="text-cream/75 text-sm leading-relaxed">{rule}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-purple font-semibold text-center mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-cream text-center mb-10">
              Three clean steps
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4">
            {STEPS.map((item, i) => (
              <Reveal key={item.step} delay={i + 1}>
                <div className="bg-purple/10 border border-purple/20 rounded-2xl p-6 h-full">
                  <p className="text-purple/60 text-xs font-mono mb-3">{item.step}</p>
                  <h3 className="text-cream font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-cream/65 text-sm leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl font-extrabold text-cream mb-4">
              Get the installer
            </h2>
            <p className="text-cream/50 text-sm mb-8">
              MacCleaner is free. You get the installer immediately, and the email copy gives you the link again if you need it later.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
              <GiveawayForm />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
