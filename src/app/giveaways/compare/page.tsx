import { Fragment } from 'react'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import ProTip from '@/components/ProTip'

type Cell = 'yes' | 'partial' | 'no' | string

interface Row {
  feature: string
  chat: Cell
  cowork: Cell
  desktop: Cell
  terminal: Cell
}

interface RowGroup {
  title: string
  rows: Row[]
}

type ProductKey = 'chat' | 'cowork' | 'desktop' | 'terminal'

interface Product {
  key: ProductKey
  name: string
  sub: string
  icon: string
  bestFor: string
  isPowerLane?: boolean
}

const products: Product[] = [
  {
    key: 'chat',
    name: 'Claude Chat',
    sub: 'claude.ai',
    icon: '💬',
    bestFor: 'Questions, writing, brainstorming',
  },
  {
    key: 'cowork',
    name: 'Cowork',
    sub: 'Desktop app',
    icon: '🗂',
    bestFor: 'Document work, research synthesis, file tasks without code',
  },
  {
    key: 'desktop',
    name: 'Code Desktop',
    sub: 'Desktop app',
    icon: '🖥',
    bestFor: 'Visual coding with full project context',
  },
  {
    key: 'terminal',
    name: 'Terminal',
    sub: 'Claude Code CLI',
    icon: '⌨️',
    bestFor: 'Full system control — automation, orchestration, building',
    isPowerLane: true,
  },
]

const rowGroups: RowGroup[] = [
  {
    title: 'Overview',
    rows: [
      {
        feature: 'Interface',
        chat: 'Browser or app chat',
        cowork: 'Tasks tab GUI',
        desktop: 'Visual app — file tree, plan sidebar, diff viewer',
        terminal: 'Command line',
      },
      {
        feature: 'Platform',
        chat: 'Any browser or device',
        cowork: 'macOS only',
        desktop: 'Mac, Windows',
        terminal: 'Mac, Windows, Linux',
      },
      {
        feature: 'Available on',
        chat: 'Free + all paid plans',
        cowork: 'All paid plans',
        desktop: 'All paid plans',
        terminal: 'All paid plans',
      },
    ],
  },
  {
    title: 'File & system access',
    rows: [
      {
        feature: 'File access',
        chat: 'Upload only',
        cowork: 'Sandboxed to approved folders',
        desktop: 'Full, unrestricted',
        terminal: 'Full, unrestricted',
      },
      {
        feature: 'Shell commands & scripts',
        chat: 'no',
        cowork: 'no',
        desktop: 'yes',
        terminal: 'Yes — any command',
      },
      {
        feature: 'Project navigation (cd)',
        chat: 'no',
        cowork: 'no',
        desktop: 'Via GUI selector',
        terminal: 'Any path instantly',
      },
      {
        feature: 'Scripting & piping',
        chat: 'no',
        cowork: 'no',
        desktop: 'no',
        terminal: 'Full shell automation',
      },
      {
        feature: 'Git & version control',
        chat: 'no',
        cowork: 'no',
        desktop: 'yes',
        terminal: 'yes',
      },
    ],
  },
  {
    title: 'Integrations',
    rows: [
      {
        feature: 'MCP server integrations',
        chat: 'no',
        cowork: 'Separate plugin system',
        desktop: 'Yes — GUI approval flow',
        terminal: 'Yes — full CLI config + scopes',
      },
      {
        feature: 'Pre-built plugins',
        chat: 'no',
        cowork: '11+ (HubSpot, Jira, Slack, Notion, Figma, Box…)',
        desktop: 'no',
        terminal: 'no',
      },
      {
        feature: 'CLAUDE.md project context',
        chat: 'no',
        cowork: 'no',
        desktop: 'Loads on session start',
        terminal: 'Loads on session start',
      },
    ],
  },
  {
    title: 'Automation & power',
    rows: [
      {
        feature: 'Hooks (auto-triggers)',
        chat: 'no',
        cowork: 'no',
        desktop: 'partial',
        terminal: 'Full — shell-level, every event',
      },
      {
        feature: 'Skills & pipelines',
        chat: 'no',
        cowork: 'no',
        desktop: 'partial',
        terminal: 'Full chaining + pipelines',
      },
      {
        feature: 'Parallel background agents',
        chat: 'no',
        cowork: 'no',
        desktop: 'partial',
        terminal: 'Unlimited',
      },
      {
        feature: 'Runs unattended overnight',
        chat: 'no',
        cowork: 'Yes — Anthropic cloud',
        desktop: 'no',
        terminal: 'Yes — tmux, nohup, SSH',
      },
      {
        feature: 'CI/CD pipeline integration',
        chat: 'no',
        cowork: 'no',
        desktop: 'no',
        terminal: 'Yes — fully scriptable',
      },
      {
        feature: 'Complex routing & dispatch',
        chat: 'no',
        cowork: 'no',
        desktop: 'no',
        terminal: 'Scripts, JSON dispatch, multi-provider',
      },
    ],
  },
]

const noteCards = [
  {
    badge: 'Hooks & skills',
    title: 'What “partial” actually means',
    body: 'The Desktop app supports hooks and can invoke individual skills. What it cannot do is run full pipeline sequences, chaining multiple skills in order, passing outputs between them programmatically, and running the whole sequence unattended. It also does not support the shell-level hooks that fire below Claude, which is where the real automation power lives. Partial means it works for interactive use. It does not mean it replaces the terminal for building anything.',
  },
  {
    badge: 'Not just yes/yes',
    title: 'MCP servers on the desktop',
    body: 'MCP servers work the same in the Desktop app as they do in the terminal at the protocol level. Both use the same three permission layers, auto-grant, ask every time, or block entirely. Both use the same three configuration scopes, private to the current project, shared with your team via version control, or available across all your projects. What the Desktop adds is a GUI approval dialog the first time a project-scoped server connects. What the terminal adds is fine-grained control via flags, environment variables, per-server timeouts, and push channels the GUI does not expose.',
  },
  {
    badge: 'Important limit',
    title: 'Cowork and your local files',
    body: 'Cowork can read files in the folders you approve, including local directories you point it at. What it cannot do is interact with the scripts or dispatch systems that sit behind those files. If a folder is connected to an indexing script, an automation workflow, or a routing layer, Cowork sees the raw files only. It reads documents. It does not run systems. For reading and synthesizing document-heavy content, it is genuinely useful. For anything that touches the logic behind the files, you need the terminal.',
  },
  {
    badge: 'Common confusion',
    title: 'CLAUDE.md is not a product',
    body: 'CLAUDE.md is a markdown file you place in a project directory, or globally, that contains project-specific instructions Claude Code reads at session start. Both the terminal and the Desktop app read it. It is the instruction layer for a project, think of it as a briefing document that loads automatically whenever Claude opens that project. The terminal is the execution layer that can actually act on those instructions at full power.',
  },
] as const

function CellContent({ value }: { value: Cell }) {
  if (value === 'no') {
    return <span className="text-[#FCF4EB]/30 text-lg leading-none">—</span>
  }
  if (value === 'yes') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[#FCF4EB] font-semibold">
        <span className="text-[#9D8FE0] text-base">✦</span>
        <span>Yes</span>
      </span>
    )
  }
  if (value === 'partial') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[#FCF4EB]/80 font-medium">
        <span className="text-[#F5C3C6] text-base">◐</span>
        <span>Partial</span>
      </span>
    )
  }
  return <span className="text-[#FCF4EB]/85 leading-relaxed">{value}</span>
}

export default function ComparePage() {
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
                <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-[0.22em] mb-4">
                  ManyChat keyword: COMPARE
                </p>
              </Reveal>
              <Reveal delay={1}>
                <h1 className="gradient-text text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-5 max-w-5xl">
                  The four versions of Claude, and why most people are using the weakest one
                </h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="text-[#FCF4EB]/68 text-lg sm:text-xl leading-relaxed max-w-3xl">
                  Most people find Claude through the chat interface and stop there. There are actually four
                  distinct products, and the gap between them is enormous. Here is the full picture, arranged so
                  you can see exactly where each one stops.
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
                    <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest mb-2">The frame</p>
                    <p className="text-[#FCF4EB] leading-relaxed">
                      The terminal is the power layer. Everything else is built on top of it or is a subset of it.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#FCF4EB]/[0.10] bg-[rgba(245,195,198,0.06)] p-4">
                    <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest mb-2">The shortcut</p>
                    <p className="text-[#FCF4EB] leading-relaxed">
                      If you only use <span className="font-semibold">Claude Chat</span>, you are using about{' '}
                      <span className="font-semibold">10%</span> of what the tool can actually do.
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
          Each column is a different product with different access, different capabilities, and a different
          relationship to your actual work. Read the rows that map to what you actually do.
        </ProTip>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <Reveal>
          <div className="mb-6">
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">Best for</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              The single sentence to remember for each one
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((p, index) => (
            <Reveal key={p.key} delay={index + 1}>
              <div
                className={
                  p.isPowerLane
                    ? 'card-hover rounded-2xl border border-[#9D8FE0]/35 bg-[linear-gradient(180deg,rgba(124,105,199,0.22),rgba(124,105,199,0.10))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] h-full'
                    : 'card-hover rounded-2xl border border-[#FCF4EB]/[0.10] bg-[linear-gradient(180deg,rgba(252,244,235,0.06),rgba(245,195,198,0.05))] p-5 h-full'
                }
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl" aria-hidden>{p.icon}</span>
                  <p className="text-[#FCF4EB] font-bold">{p.name}</p>
                </div>
                <p className="text-xs uppercase tracking-widest text-[#FCF4EB]/40 mb-3">{p.sub}</p>
                <p className="text-[#FCF4EB]/78 text-sm leading-relaxed">{p.bestFor}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="glow-divider" />
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <Reveal>
          <div className="mb-6">
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              Side-by-side comparison
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              What each one can and cannot do, line by line
            </h2>
          </div>
        </Reveal>

        <div className="rounded-[28px] border border-[#FCF4EB]/[0.10] bg-[linear-gradient(180deg,rgba(124,105,199,0.10),rgba(252,244,235,0.03))] p-4 sm:p-6">
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-transparent px-3 sm:px-4 py-4 text-xs uppercase tracking-widest text-[#FCF4EB]/45 font-semibold align-bottom">
                    Feature
                  </th>
                  {products.map((p) => (
                    <th
                      key={p.key}
                      className={
                        p.isPowerLane
                          ? 'px-3 sm:px-4 py-4 align-bottom border-l border-[#FCF4EB]/[0.06]'
                          : 'px-3 sm:px-4 py-4 align-bottom border-l border-[#FCF4EB]/[0.06]'
                      }
                    >
                      <div
                        className={
                          p.isPowerLane
                            ? 'rounded-xl border border-[#9D8FE0]/35 bg-[rgba(124,105,199,0.18)] px-3 py-2.5'
                            : 'rounded-xl border border-[#FCF4EB]/[0.10] bg-[rgba(252,244,235,0.04)] px-3 py-2.5'
                        }
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span aria-hidden>{p.icon}</span>
                          <span className="text-[#FCF4EB] font-bold text-sm">{p.name}</span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-[#FCF4EB]/45">{p.sub}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowGroups.map((group) => (
                  <Fragment key={group.title}>
                    <tr>
                      <th
                        colSpan={5}
                        scope="colgroup"
                        className="px-3 sm:px-4 pt-7 pb-2 text-[11px] uppercase tracking-[0.22em] text-[#7C69C7] font-semibold border-b border-[#FCF4EB]/[0.08]"
                      >
                        {group.title}
                      </th>
                    </tr>
                    {group.rows.map((row, idx) => (
                      <tr
                        key={`${group.title}-${row.feature}`}
                        className={idx % 2 === 0 ? 'bg-[rgba(252,244,235,0.015)]' : ''}
                      >
                        <td className="sticky left-0 bg-[#150d22]/95 backdrop-blur-sm px-3 sm:px-4 py-4 text-sm text-[#FCF4EB] font-medium align-top border-b border-[#FCF4EB]/[0.05] min-w-[180px]">
                          {row.feature}
                        </td>
                        {(['chat', 'cowork', 'desktop', 'terminal'] as const).map((key) => (
                          <td
                            key={key}
                            className={
                              key === 'terminal'
                                ? 'px-3 sm:px-4 py-4 text-sm align-top border-b border-[#FCF4EB]/[0.05] border-l border-[#FCF4EB]/[0.05] bg-[rgba(124,105,199,0.05)] min-w-[170px]'
                                : 'px-3 sm:px-4 py-4 text-sm align-top border-b border-[#FCF4EB]/[0.05] border-l border-[#FCF4EB]/[0.05] min-w-[170px]'
                            }
                          >
                            <CellContent value={row[key]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 px-1 text-xs text-[#FCF4EB]/55">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#9D8FE0]">✦</span> Yes — fully supported
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#F5C3C6]">◐</span> Partial — works, with real limits
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#FCF4EB]/40">—</span> Not supported
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <Reveal>
          <div className="mb-6">
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              The fine print
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              Four notes that change how you read the table
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-2">
          {noteCards.map((card, index) => (
            <Reveal key={card.title} delay={index + 1}>
              <div className="card-hover h-full rounded-[28px] border border-[#FCF4EB]/[0.10] bg-[linear-gradient(180deg,rgba(124,105,199,0.16),rgba(252,244,235,0.04))] p-5 sm:p-6">
                <p className="inline-block rounded-full border border-[#9D8FE0]/30 bg-[rgba(124,105,199,0.18)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#9D8FE0] font-semibold mb-3">
                  {card.badge}
                </p>
                <h3 className="text-xl font-bold text-[#FCF4EB] mb-3">{card.title}</h3>
                <p className="text-[#FCF4EB]/72 leading-relaxed">{card.body}</p>
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
                  The terminal is where Claude becomes infrastructure
                </h2>
                <p className="max-w-2xl text-[#FCF4EB]/68 text-lg leading-relaxed mb-6">
                  If someone sent you here, they want you to see what is possible beyond the chat window. The
                  Business Automation Mastermind is where founders learn how to actually build with this — agents
                  that do real work, automation that runs without you, and systems that turn AI from a chat tool
                  into operational leverage.
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#FCF4EB]/[0.08] bg-[rgba(252,244,235,0.05)] p-4">
                    <p className="text-xs uppercase tracking-widest text-[#FCF4EB]/40 mb-2">Learn how to</p>
                    <p className="text-[#FCF4EB] font-semibold leading-relaxed">Build agents that do real work</p>
                  </div>
                  <div className="rounded-2xl border border-[#FCF4EB]/[0.08] bg-[rgba(245,195,198,0.08)] p-4">
                    <p className="text-xs uppercase tracking-widest text-[#FCF4EB]/40 mb-2">Learn how to</p>
                    <p className="text-[#FCF4EB] font-semibold leading-relaxed">
                      Automate the work that does not need you
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#FCF4EB]/[0.08] bg-[rgba(252,244,235,0.05)] p-4">
                    <p className="text-xs uppercase tracking-widest text-[#FCF4EB]/40 mb-2">Related topics</p>
                    <p className="text-[#FCF4EB] font-semibold leading-relaxed">
                      Workflows, dispatch, prompts, offers, and practical operator systems
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#FCF4EB]/[0.10] bg-[linear-gradient(180deg,rgba(252,244,235,0.07),rgba(245,195,198,0.08))] p-6 sm:p-7 shadow-[0_18px_60px_rgba(0,0,0,0.20)]">
                <h3 className="text-2xl font-bold text-[#FCF4EB] mb-3">See if it feels like the right fit</h3>
                <p className="text-[#FCF4EB]/68 leading-relaxed mb-6">
                  The main site has the full overview, the live sessions, the community, the resource vault, and
                  the kind of business automation support Joe is actually offering.
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
