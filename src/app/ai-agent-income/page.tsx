import type { Metadata } from 'next'
import AiAgentIncomeCheckoutForm from './AiAgentIncomeCheckoutForm'

export const metadata: Metadata = {
  title: {
    absolute: 'The AI Agent Income Playbook',
  },
  description:
    '100 passive income ideas and the Claude Code prompts to build them, with a $1 trial for the weekly operator feed.',
  alternates: {
    canonical: 'https://passiveincome.mastermindshq.business',
  },
  openGraph: {
    title: 'The AI Agent Income Playbook',
    description:
      '100 passive income ideas and the Claude Code prompts to build them, with weekly lanes for operators.',
    url: 'https://passiveincome.mastermindshq.business',
    siteName: 'Masterminds HQ',
    type: 'website',
  },
}

const lanes = [
  'A new batch of 10 passive-income lanes every week',
  'Full Claude Code build prompts for each lane',
  'Idea, copy-paste prompt, and tripwire offer in the same format as the book',
  'Access to a private Telegram community of other operators building these lanes',
]

const audience = [
  'You are tired of AI books that are all hype and zero code.',
  'You want proven ideas you can test this weekend without building a huge business first.',
  'You want automation to save time before you hire a VA.',
]

export default function AiAgentIncomePage() {
  return (
    <main className="overflow-hidden bg-[#151515]">
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1520] via-[#151515] to-[#151515]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-16 pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pb-24 lg:pt-24">
          <div>
            <span className="mb-7 inline-flex rounded-full border border-[#8B79D4]/25 bg-[#8B79D4]/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#BDB3E8]">
              Book plus operator feed
            </span>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.08] text-[#FCF4EB] sm:text-5xl lg:text-6xl">
              The AI Agent Income Playbook
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-semibold leading-relaxed text-[#FCF4EB]/82 sm:text-2xl">
              100 Passive Income Ideas and the Claude Code Prompts to Build Them
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#FCF4EB]/58 sm:text-lg">
              A practical field guide for solo operators who want small, testable AI income lanes with the prompt, offer, and first build path on the page.
            </p>

            <div className="mt-9 space-y-4">
              <AiAgentIncomeCheckoutForm />
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled
                  className="min-h-[3.25rem] rounded-xl border border-white/[0.12] bg-white/[0.04] px-6 text-sm font-bold text-[#FCF4EB]/45"
                >
                  Coming to Amazon
                </button>
                <p className="text-sm leading-6 text-[#FCF4EB]/42">
                  The book link goes live after publication. The operator feed is available through the trial.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 shadow-2xl shadow-black/25 sm:p-8">
            <div className="border-b border-white/[0.08] pb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-[#BDB3E8]">Inside the playbook</p>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[#FCF4EB]">
                One lane per page. No theory detours.
              </h2>
            </div>
            <div className="space-y-4 pt-6">
              {[
                ['01', 'Who pays'],
                ['02', 'The agent stack'],
                ['03', 'The Claude Code prompt'],
                ['04', 'The tripwire offer'],
              ].map(([number, label]) => (
                <div key={number} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#8B79D4]/25 bg-[#8B79D4]/15 text-xs font-extrabold text-[#BDB3E8]">
                    {number}
                  </div>
                  <p className="text-base font-semibold text-[#FCF4EB]/78">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-2xl border border-[#8B79D4]/25 bg-gradient-to-br from-[#8B79D4]/12 to-[#F5C3C6]/6 p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#BDB3E8]">Operator feed pricing</p>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <span className="text-5xl font-extrabold leading-none text-[#FCF4EB]">$20</span>
              <span className="pb-1 text-lg font-semibold text-[#FCF4EB]/60">/month</span>
              <span className="pb-1 text-lg font-semibold text-[#FCF4EB]/35 line-through">$49/month</span>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#FCF4EB]/62">
              $1 for 7 days, then $20/mo, cancel anytime.
            </p>
          </div>
          <div className="mt-7 w-full max-w-md lg:mt-0">
            <AiAgentIncomeCheckoutForm compact />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#BDB3E8]">What you get</p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#FCF4EB] sm:text-4xl">
            A weekly build queue for practical AI income tests.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {lanes.map((item, index) => (
            <div key={item} className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-5">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#8B79D4]/15 text-xs font-extrabold text-[#BDB3E8]">
                {String(index + 1).padStart(2, '0')}
              </div>
              <p className="text-base leading-7 text-[#FCF4EB]/72">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#BDB3E8]">Who this is for</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#FCF4EB] sm:text-4xl">
              Built for operators who want to test, not theorize.
            </h2>
          </div>
          <div className="space-y-3">
            {audience.map((item) => (
              <div key={item} className="border-b border-white/[0.07] py-4">
                <p className="text-lg leading-8 text-[#FCF4EB]/70">{item}</p>
              </div>
            ))}
            <p className="pt-4 text-sm leading-7 text-[#FCF4EB]/42">
              This is a prompt and offer library for experiments. It does not promise passive income, instant wins, or hands-off businesses.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 pt-12 text-center">
        <h2 className="text-3xl font-extrabold text-[#FCF4EB] sm:text-4xl">
          Start with the next 10 lanes.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#FCF4EB]/55">
          Join the weekly operator feed, use the book format, and decide what is worth building from real prompts instead of vague ideas.
        </p>
        <div className="mt-8">
          <AiAgentIncomeCheckoutForm />
        </div>
      </section>
    </main>
  )
}
