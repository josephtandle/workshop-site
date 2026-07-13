'use client'

import { motion } from 'framer-motion'
import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'

const QUIZ_URL = 'https://mastermindshq.business/ai-behavioral-quiz'

const LEVELS = [
  ['B0', 'Avoidant', 'AI is mostly outside your day, whether by choice, uncertainty, or simply not needing it yet.'],
  ['B3', 'Testing', 'You are trying it in small, useful moments and learning what feels worth keeping.'],
  ['B6', 'Embedded', 'AI has become a familiar part of your work and your thinking, with clear benefits and tradeoffs.'],
  ['B9', 'Watchful', 'This is where sleep can start slipping, making it a good moment to pause and check what the pace is asking of you.'],
] as const

export default function AiBehaviorQuizPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#151515] text-[#FCF4EB]">
      <section className="relative px-6 pb-20 pt-28 md:pb-28 md:pt-36">
        <div className="absolute inset-0 -z-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-pink/20 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-pink/30 bg-pink/10 px-4 py-2"
          >
            <span className="text-sm text-pink">○</span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">Free AI Quiz</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mx-auto max-w-3xl text-5xl font-extrabold leading-[1.04] tracking-tight md:text-7xl"
          >
            The AI Behavioral Use Quiz
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-[#FCF4EB]/65 md:text-xl"
          >
            This measures intensity, not skill. It is a different question from what you can build with AI, and nobody wins by scoring high.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-10"
          >
            <a
              href={QUIZ_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-xl bg-pink px-7 py-4 text-base font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-pink/90"
            >
              Take the quiz
              <span aria-hidden="true">→</span>
            </a>
            <p className="mt-4 text-sm text-[#FCF4EB]/40">Ten honest questions, from B0 Avoidant to B10.</p>
          </motion.div>
        </div>
      </section>

      <section className="relative px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pink">The scale</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">A more honest look at AI use</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#FCF4EB]/60">
              The scale runs from B0 Avoidant to B10. It is not a scorecard for talent or ambition. It is a quiet way to notice how much space AI is taking up in your work and life.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEVELS.map(([range, label, description]) => (
              <div key={range} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <p className="font-mono text-sm text-pink">{range}</p>
                <h3 className="mt-4 text-lg font-bold">{label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#FCF4EB]/55">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 pt-8 md:pb-32">
        <div className="mx-auto max-w-3xl rounded-3xl border border-pink/25 bg-pink/10 px-6 py-12 text-center md:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pink">A useful check-in</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">Notice your pace with a little more clarity.</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-[#FCF4EB]/65">
            Take the quiz, see where you land, and use the result as a starting point for a more intentional relationship with AI.
          </p>
          <a
            href={QUIZ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#FCF4EB] px-7 py-4 font-bold text-[#151515] transition-transform hover:-translate-y-0.5"
          >
            Take the quiz
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <GiveawayAutoModal
        slug="ai-behavior-quiz"
        headingOverride="Want thoughtful AI guidance in your inbox?"
      />
    </main>
  )
}
