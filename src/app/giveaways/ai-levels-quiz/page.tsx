'use client'

import { motion } from 'framer-motion'
import GiveawayAutoModal from '@/components/giveaways/GiveawayAutoModal'

const QUIZ_URL = 'https://mastermindshq.business/ai-capability-levels'

const LEVELS = [
  ['0-10', 'Exploring', 'You are learning what AI can do and where it fits.'],
  ['11-20', 'Applying', 'You are using AI for useful work, with room to make it repeatable.'],
  ['21-30', 'Integrating', 'AI is becoming part of how your work gets done.'],
  ['31-40', 'Compounding', 'You are building leverage that improves with every iteration.'],
] as const

export default function AiLevelsQuizPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#151515] text-[#FCF4EB]">
      <section className="relative px-6 pb-20 pt-28 md:pb-28 md:pt-36">
        <div className="absolute inset-0 -z-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-purple/20 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple/30 bg-purple/10 px-4 py-2"
          >
            <span className="text-sm text-purple">◉</span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-purple">Free AI Quiz</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mx-auto max-w-3xl text-5xl font-extrabold leading-[1.04] tracking-tight md:text-7xl"
          >
            The AI Capability Levels Quiz
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-[#FCF4EB]/65 md:text-xl"
          >
            Find your place on the 0 to 40 capability ladder. In a few minutes, you will see how you use AI today, what level you are operating at, and the next moves that create real leverage.
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
              className="inline-flex items-center gap-3 rounded-xl bg-purple px-7 py-4 text-base font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-purple/90"
            >
              Take the quiz
              <span aria-hidden="true">→</span>
            </a>
            <p className="mt-4 text-sm text-[#FCF4EB]/40">Get your personalized level report and next three moves.</p>
          </motion.div>
        </div>
      </section>

      <section className="relative px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple">The framework</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">A clear view of your AI capability</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#FCF4EB]/60">
              The 0 to 40 framework turns a vague question into a practical baseline. Your report shows your current level, the capability behind it, and three focused actions to help you advance.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEVELS.map(([range, label, description]) => (
              <div key={range} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <p className="font-mono text-sm text-purple">{range}</p>
                <h3 className="mt-4 text-lg font-bold">{label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#FCF4EB]/55">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 pt-8 md:pb-32">
        <div className="mx-auto max-w-3xl rounded-3xl border border-purple/25 bg-purple/10 px-6 py-12 text-center md:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple">Your next step</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">Know your level. Know what to do next.</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-[#FCF4EB]/65">
            Take the quiz to receive a personalized report built around your current AI capability and the three moves most likely to raise it.
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
        slug="ai-levels-quiz"
        headingOverride="Want more AI capability guidance in your inbox?"
      />
    </main>
  )
}
