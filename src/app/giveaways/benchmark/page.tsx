import Link from 'next/link'
import Reveal from '@/components/Reveal'
import ProTip from '@/components/ProTip'

const comparisons = [
  {
    lane: 'Flagship',
    benchmarkFocus: 'Deep reasoning, long-form writing, coding quality, and high-stakes synthesis',
    anthropic: {
      name: 'Claude Opus 4.6',
      tier: 'Vendor top tier',
      input: '$5 / 1M',
      output: '$25 / 1M',
      notes: 'Anthropic positions this as its most intelligent option for agents and coding.',
    },
    openai: {
      name: 'GPT-5.4',
      tier: 'Vendor top tier',
      input: '$2.50 / 1M',
      output: '$15 / 1M',
      notes: 'OpenAI flagship lane for broad, high-capability work.',
    },
    comparison:
      'OpenAI is materially cheaper on both input and output here. Opus only stays justified if it wins clearly on quality for your hardest real workloads.',
    benchmarkChecks: [
      'Architectural reasoning across multiple files',
      'High-quality code edits with low supervision',
      'Dense business memos and recommendation writing',
    ],
  },
  {
    lane: 'Balanced default',
    benchmarkFocus: 'Everyday agent use, drafting, editing, and practical internal workflows',
    anthropic: {
      name: 'Claude Sonnet 4.6',
      tier: 'Vendor premium default',
      input: '$3 / 1M',
      output: '$15 / 1M',
      notes: 'Anthropic positions this as the best speed-to-intelligence tradeoff.',
    },
    openai: {
      name: 'GPT-5.4',
      tier: 'Vendor flagship',
      input: '$2.50 / 1M',
      output: '$15 / 1M',
      notes: 'Closest premium OpenAI comparison for deciding a serious default.',
    },
    comparison:
      'Output pricing is the same. OpenAI is slightly cheaper on input. This is the most important premium-vs-premium benchmark to run.',
    benchmarkChecks: [
      'Document summarization and synthesis',
      'Internal planning and agent orchestration',
      'Business copy that still sounds sharp and human',
    ],
  },
  {
    lane: 'Value pressure test',
    benchmarkFocus: 'Whether a premium default is worth paying for versus a smaller cheaper model',
    anthropic: {
      name: 'Claude Sonnet 4.6',
      tier: 'Vendor premium default',
      input: '$3 / 1M',
      output: '$15 / 1M',
      notes: 'Good candidate if you want one Anthropic default to test seriously.',
    },
    openai: {
      name: 'GPT-5.4-mini',
      tier: 'Small capable model',
      input: '$0.75 / 1M',
      output: '$4.50 / 1M',
      notes: 'Likely strongest value benchmark for day-to-day internal automation.',
    },
    comparison:
      'Sonnet costs about 4x more on input and over 3x more on output. It needs a visible quality advantage to survive this benchmark.',
    benchmarkChecks: [
      'Email and memo drafting',
      'Routine extraction and formatting',
      'Cheap but capable interactive assistant tasks',
    ],
  },
  {
    lane: 'Fast / cheap',
    benchmarkFocus: 'Classification, extraction, summaries, and high-volume utility work',
    anthropic: {
      name: 'Claude Haiku 4.5',
      tier: 'Fast model',
      input: '$1 / 1M',
      output: '$5 / 1M',
      notes: 'Fastest Anthropic option in this set, but not ultra-cheap.',
    },
    openai: {
      name: 'GPT-5.4-nano',
      tier: 'Cheapest small model',
      input: '$0.20 / 1M',
      output: '$1.25 / 1M',
      notes: 'Lowest-cost OpenAI option listed here.',
    },
    comparison:
      'Haiku is still much more expensive. It needs to beat Nano convincingly on quality, reliability, or output cleanliness.',
    benchmarkChecks: [
      'Structured extraction from messy source text',
      'Short summaries at scale',
      'Simple tagging, labeling, and triage',
    ],
  },
] as const

const benchmarkDimensions = [
  'Coding and editing quality',
  'Structured extraction accuracy',
  'Summarization clarity',
  'Long-context synthesis',
  'Agentic tool use',
  'Business writing quality',
] as const

export default function BenchmarkPage() {
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
                <h1 className="gradient-text text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-5 max-w-5xl">
                  Anthropic vs OpenAI, arranged for direct comparison
                </h1>
              </Reveal>
              <Reveal delay={1}>
                <p className="text-[#FCF4EB]/68 text-lg sm:text-xl leading-relaxed max-w-3xl">
                  This version is built to be scanned side by side. Each row shows the two models, the pricing,
                  what the benchmark should test, and the actual comparison question you are trying to answer.
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
                    <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest mb-2">Important rule</p>
                    <p className="text-[#FCF4EB] leading-relaxed">
                      The “tier” labels here are vendor positioning, not measured benchmark scores.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#FCF4EB]/[0.10] bg-[rgba(245,195,198,0.06)] p-4">
                    <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest mb-2">Main decision line</p>
                    <p className="text-[#FCF4EB] leading-relaxed">
                      The most important practical test is <span className="font-semibold">Sonnet 4.6 vs GPT-5.4</span>,
                      with <span className="font-semibold">GPT-5.4-mini</span> acting as the value pressure test.
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
          Benchmark the models on your actual workloads. Pricing is objective. Capability claims are not.
        </ProTip>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <Reveal>
          <div className="mb-6">
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              Benchmark dimensions
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              Every row below should be judged on the same workload set
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {benchmarkDimensions.map((item, index) => (
            <Reveal key={item} delay={index + 1}>
              <div className="card-hover rounded-xl border border-[#FCF4EB]/[0.08] bg-[linear-gradient(180deg,rgba(252,244,235,0.05),rgba(245,195,198,0.04))] px-4 py-4 text-sm text-[#FCF4EB]/78">
                {item}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="glow-divider" />
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <Reveal>
          <div className="mb-6">
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              Side-by-side rows
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              Four direct comparisons that are actually worth running
            </h2>
          </div>
        </Reveal>

        <div className="space-y-6">
          {comparisons.map((row, index) => (
            <Reveal key={row.lane} delay={index + 1}>
              <div className="card-hover rounded-[28px] border border-[#FCF4EB]/[0.10] bg-[linear-gradient(180deg,rgba(124,105,199,0.16),rgba(252,244,235,0.04))] p-5 sm:p-6">
                <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                      {row.lane}
                    </p>
                    <h3 className="text-2xl font-bold text-[#FCF4EB]">{row.benchmarkFocus}</h3>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1.1fr]">
                  <div className="rounded-2xl border border-[#9D8FE0]/25 bg-[linear-gradient(180deg,rgba(124,105,199,0.18),rgba(124,105,199,0.10))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <p className="text-xs uppercase tracking-widest text-[#9D8FE0] mb-2">Anthropic</p>
                    <h4 className="text-xl font-bold text-[#FCF4EB] mb-2">{row.anthropic.name}</h4>
                    <p className="text-sm text-[#FCF4EB]/60 mb-4">{row.anthropic.tier}</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="rounded-xl border border-[#FCF4EB]/[0.08] bg-[rgba(252,244,235,0.05)] px-3 py-3">
                        <p className="text-[11px] uppercase tracking-widest text-[#FCF4EB]/40 mb-1">Input</p>
                        <p className="text-[#FCF4EB] font-semibold">{row.anthropic.input}</p>
                      </div>
                      <div className="rounded-xl border border-[#FCF4EB]/[0.08] bg-[rgba(252,244,235,0.05)] px-3 py-3">
                        <p className="text-[11px] uppercase tracking-widest text-[#FCF4EB]/40 mb-1">Output</p>
                        <p className="text-[#FCF4EB] font-semibold">{row.anthropic.output}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#FCF4EB]/72 leading-relaxed">{row.anthropic.notes}</p>
                  </div>

                  <div className="rounded-2xl border border-[#F5C3C6]/25 bg-[linear-gradient(180deg,rgba(245,195,198,0.18),rgba(252,244,235,0.07))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <p className="text-xs uppercase tracking-widest text-[#F5C3C6] mb-2">OpenAI</p>
                    <h4 className="text-xl font-bold text-[#FCF4EB] mb-2">{row.openai.name}</h4>
                    <p className="text-sm text-[#FCF4EB]/60 mb-4">{row.openai.tier}</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="rounded-xl border border-[#FCF4EB]/[0.08] bg-[rgba(252,244,235,0.06)] px-3 py-3">
                        <p className="text-[11px] uppercase tracking-widest text-[#FCF4EB]/40 mb-1">Input</p>
                        <p className="text-[#FCF4EB] font-semibold">{row.openai.input}</p>
                      </div>
                      <div className="rounded-xl border border-[#FCF4EB]/[0.08] bg-[rgba(252,244,235,0.06)] px-3 py-3">
                        <p className="text-[11px] uppercase tracking-widest text-[#FCF4EB]/40 mb-1">Output</p>
                        <p className="text-[#FCF4EB] font-semibold">{row.openai.output}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#FCF4EB]/72 leading-relaxed">{row.openai.notes}</p>
                  </div>

                  <div className="rounded-2xl border border-[#FCF4EB]/[0.12] bg-[linear-gradient(180deg,rgba(252,244,235,0.08),rgba(245,195,198,0.10))] p-5 shadow-[0_16px_48px_rgba(124,105,199,0.10),inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <p className="text-xs uppercase tracking-widest text-[#FCF4EB]/45 mb-2">Comparison</p>
                    <p className="text-[#FCF4EB] leading-relaxed mb-5">{row.comparison}</p>

                    <p className="text-xs uppercase tracking-widest text-[#FCF4EB]/45 mb-2">Benchmark checks</p>
                    <ul className="space-y-2 text-sm text-[#FCF4EB]/72">
                      {row.benchmarkChecks.map((check) => (
                        <li key={check} className="rounded-xl border border-[#FCF4EB]/[0.08] bg-[rgba(252,244,235,0.05)] px-3 py-2">
                          {check}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
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
                  If you want support beyond the chart, Masterminds HQ is where that starts
                </h2>
                <p className="max-w-2xl text-[#FCF4EB]/68 text-lg leading-relaxed mb-6">
                  Masterminds HQ is built for purpose-driven founders who want to stop doing business alone, get real
                  accountability, and learn practical systems that help them automate, organize, attract more clients,
                  and earn more with less stress.
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
                      Workflows, automation, prompts, offers, and practical operator systems
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#FCF4EB]/[0.10] bg-[linear-gradient(180deg,rgba(252,244,235,0.07),rgba(245,195,198,0.08))] p-6 sm:p-7 shadow-[0_18px_60px_rgba(0,0,0,0.20)]">
                <h3 className="text-2xl font-bold text-[#FCF4EB] mb-3">See if it feels like the right fit</h3>
                <p className="text-[#FCF4EB]/68 leading-relaxed mb-6">
                  The main site gives the clearest overview of the mastermind, the live sessions, the community, the
                  resource vault, and the kind of business automation support Joe is actually offering.
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
