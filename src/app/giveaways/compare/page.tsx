import { Fragment } from 'react'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import ProTip from '@/components/ProTip'

type Cell = 'yes' | 'partial' | 'no' | string

interface Row {
  feature: string
  terminal: Cell
  desktop: Cell
  cowork: Cell
  chat: Cell
}

interface RowGroup {
  title: string
  rows: Row[]
}

const products = [
  {
    key: 'terminal' as const,
    name: 'Terminal',
    sub: 'Claude Code CLI',
    glyph: '✦',
    bestFor: 'Full system control — automation, orchestration, building',
    isPowerLane: true,
  },
  {
    key: 'desktop' as const,
    name: 'Code Desktop',
    sub: 'Desktop app',
    glyph: '◆',
    bestFor: 'Visual coding with full project context',
  },
  {
    key: 'cowork' as const,
    name: 'Cowork',
    sub: 'Desktop app',
    glyph: '◇',
    bestFor: 'Document work, research synthesis, file tasks without code',
  },
  {
    key: 'chat' as const,
    name: 'Claude Chat',
    sub: 'claude.ai',
    glyph: '◈',
    bestFor: 'Questions, writing, brainstorming',
  },
]

const rowGroups: RowGroup[] = [
  {
    title: 'Overview',
    rows: [
      {
        feature: 'Interface',
        terminal: 'Command line',
        desktop: 'Visual app — file tree, plan sidebar, diff viewer',
        cowork: 'Tasks tab GUI',
        chat: 'Browser or app chat',
      },
      {
        feature: 'Platform',
        terminal: 'Mac, Windows, Linux',
        desktop: 'Mac, Windows',
        cowork: 'macOS only',
        chat: 'Any browser or device',
      },
      {
        feature: 'Available on',
        terminal: 'All paid plans',
        desktop: 'All paid plans',
        cowork: 'All paid plans',
        chat: 'Free + all paid plans',
      },
    ],
  },
  {
    title: 'File & system access',
    rows: [
      {
        feature: 'File access',
        terminal: 'Full, unrestricted',
        desktop: 'Full, unrestricted',
        cowork: 'Sandboxed to approved folders',
        chat: 'Upload only',
      },
      {
        feature: 'Shell commands & scripts',
        terminal: 'Yes — any command',
        desktop: 'yes',
        cowork: 'no',
        chat: 'no',
      },
      {
        feature: 'Project navigation (cd)',
        terminal: 'Any path instantly',
        desktop: 'Via GUI selector',
        cowork: 'no',
        chat: 'no',
      },
      {
        feature: 'Scripting & piping',
        terminal: 'Full shell automation',
        desktop: 'no',
        cowork: 'no',
        chat: 'no',
      },
      {
        feature: 'Git & version control',
        terminal: 'yes',
        desktop: 'yes',
        cowork: 'no',
        chat: 'no',
      },
    ],
  },
  {
    title: 'Integrations',
    rows: [
      {
        feature: 'MCP server integrations',
        terminal: 'Yes — full CLI config + scopes',
        desktop: 'Yes — GUI approval flow',
        cowork: 'Separate plugin system',
        chat: 'no',
      },
      {
        feature: 'Pre-built plugins',
        terminal: 'no',
        desktop: 'no',
        cowork: '11+ (HubSpot, Jira, Slack, Notion, Figma, Box…)',
        chat: 'no',
      },
      {
        feature: 'CLAUDE.md project context',
        terminal: 'Loads on session start',
        desktop: 'Loads on session start',
        cowork: 'no',
        chat: 'no',
      },
    ],
  },
  {
    title: 'Automation & power',
    rows: [
      {
        feature: 'Hooks (auto-triggers)',
        terminal: 'Full — shell-level, every event',
        desktop: 'Basic event hooks only',
        cowork: 'no',
        chat: 'no',
      },
      {
        feature: 'Skills & pipelines',
        terminal: 'Full chaining + pipelines',
        desktop: 'Single invocations only',
        cowork: 'no',
        chat: 'no',
      },
      {
        feature: 'Parallel background agents',
        terminal: 'Unlimited',
        desktop: 'Limited',
        cowork: 'no',
        chat: 'no',
      },
      {
        feature: 'Runs unattended overnight',
        terminal: 'Yes — tmux, nohup, SSH',
        desktop: 'no',
        cowork: 'Yes — Anthropic cloud',
        chat: 'no',
      },
      {
        feature: 'CI/CD pipeline integration',
        terminal: 'Yes — fully scriptable',
        desktop: 'no',
        cowork: 'no',
        chat: 'no',
      },
      {
        feature: 'Complex routing & dispatch',
        terminal: 'Scripts, JSON dispatch, multi-provider',
        desktop: 'no',
        cowork: 'no',
        chat: 'no',
      },
    ],
  },
]

const notes = [
  {
    title: 'What “partial” means for Hooks & Skills on Desktop',
    body: 'The Desktop app fires basic event hooks and can invoke individual skills. What it cannot do is run full pipeline sequences, chaining skills in order, passing outputs between them, and running unattended. The shell-level hooks that fire below Claude do not work the same way. Partial means interactive use only.',
  },
  {
    title: 'MCP servers on Desktop — not just yes / yes',
    body: 'Both Desktop and Terminal use the same three permission layers (auto-grant, ask every time, block) and the same three scopes (local project, team-shared via version control, all your projects). The Desktop shows a GUI approval dialog the first time a project-scoped server connects. The Terminal gives you fine-grained control via flags, env vars, per-server timeouts, and push channels the GUI does not expose.',
  },
  {
    title: 'Cowork and your local files',
    body: 'Cowork reads files in approved folders. What it cannot do is interact with the scripts or dispatch systems behind those files. If a folder connects to an indexing script, an automation workflow, or a routing layer, Cowork sees the raw files only. It reads documents. It does not run systems.',
  },
  {
    title: 'CLAUDE.md is not a product',
    body: 'It is a markdown file in your project directory that Claude Code reads at session start. Both Desktop and Terminal read it. It is the instruction layer. The Terminal is the execution layer that acts on those instructions at full power.',
  },
]

function CellContent({ value }: { value: Cell }) {
  if (value === 'no') {
    return <span className="text-[#FCF4EB]/30 text-lg leading-none">—</span>
  }
  if (value === 'yes') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[#FCF4EB] font-semibold">
        <span className="text-[#9D8FE0]">✦</span>
        <span>Yes</span>
      </span>
    )
  }
  if (value === 'partial') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[#FCF4EB]/80 font-medium">
        <span className="text-[#F5C3C6]">◐</span>
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

        <div className="relative max-w-4xl mx-auto">
          <Reveal>
            <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-[0.22em] mb-4">
              ManyChat keyword: COMPARE
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="gradient-text text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6">
              The four versions of Claude
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="text-[#FCF4EB]/72 text-lg sm:text-xl leading-relaxed">
              Most people discover Claude through the chat interface and stop there. There are four distinct
              products, each with different access, different capabilities, and a different relationship to your
              actual work. The terminal is the power layer. Everything else is built on top of it or is a subset
              of it. That is the frame for the whole comparison.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-12">
        <ProTip type="warning">
          Read the columns left to right, most powerful to least. The terminal is what runs your business when
          you sleep. The chat window is the door to the room.
        </ProTip>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <Reveal>
          <div className="mb-6">
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              Side-by-side comparison
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              What each version can and cannot do, line by line
            </h2>
          </div>
        </Reveal>

        <div className="rounded-[28px] border border-[#FCF4EB]/[0.10] bg-[linear-gradient(180deg,rgba(124,105,199,0.10),rgba(252,244,235,0.03))] p-4 sm:p-6">
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-transparent px-3 sm:px-4 py-4 text-xs uppercase tracking-widest text-[#FCF4EB]/45 font-semibold align-bottom">
                    Feature
                  </th>
                  {products.map((p) => (
                    <th
                      key={p.key}
                      className="px-3 sm:px-4 py-4 align-bottom border-l border-[#FCF4EB]/[0.06]"
                    >
                      <div
                        className={
                          p.isPowerLane
                            ? 'rounded-xl border border-[#9D8FE0]/35 bg-[rgba(124,105,199,0.18)] px-3 py-2.5'
                            : 'rounded-xl border border-[#FCF4EB]/[0.10] bg-[rgba(252,244,235,0.04)] px-3 py-2.5'
                        }
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={p.isPowerLane ? 'text-[#9D8FE0]' : 'text-[#7C69C7]'}
                            aria-hidden
                          >
                            {p.glyph}
                          </span>
                          <span className="text-[#FCF4EB] font-bold text-sm">{p.name}</span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-[#FCF4EB]/45">{p.sub}</p>
                      </div>
                    </th>
                  ))}
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="sticky left-0 bg-[#150d22]/95 backdrop-blur-sm px-3 sm:px-4 py-4 text-sm text-[#FCF4EB] font-semibold align-top border-b border-[#FCF4EB]/[0.08] min-w-[180px]"
                  >
                    Best for
                  </th>
                  {products.map((p) => (
                    <td
                      key={p.key}
                      className={
                        p.isPowerLane
                          ? 'px-3 sm:px-4 py-4 text-sm align-top border-b border-[#FCF4EB]/[0.08] border-l border-[#FCF4EB]/[0.05] bg-[rgba(124,105,199,0.05)] min-w-[180px] text-[#FCF4EB]/90 leading-relaxed'
                          : 'px-3 sm:px-4 py-4 text-sm align-top border-b border-[#FCF4EB]/[0.08] border-l border-[#FCF4EB]/[0.05] min-w-[180px] text-[#FCF4EB]/85 leading-relaxed'
                      }
                    >
                      {p.bestFor}
                    </td>
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
                        {(['terminal', 'desktop', 'cowork', 'chat'] as const).map((key) => (
                          <td
                            key={key}
                            className={
                              key === 'terminal'
                                ? 'px-3 sm:px-4 py-4 text-sm align-top border-b border-[#FCF4EB]/[0.05] border-l border-[#FCF4EB]/[0.05] bg-[rgba(124,105,199,0.05)] min-w-[180px]'
                                : 'px-3 sm:px-4 py-4 text-sm align-top border-b border-[#FCF4EB]/[0.05] border-l border-[#FCF4EB]/[0.05] min-w-[180px]'
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

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <Reveal>
          <div className="mb-8">
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-2">
              The fine print
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              Four notes that change how you read the table
            </h2>
          </div>
        </Reveal>

        <div className="space-y-8">
          {notes.map((note, index) => (
            <Reveal key={note.title} delay={index + 1}>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#FCF4EB] mb-3 flex items-start gap-3">
                  <span className="text-[#7C69C7] mt-1 flex-shrink-0">◆</span>
                  <span>{note.title}</span>
                </h3>
                <p className="text-[#FCF4EB]/72 leading-relaxed text-lg ml-7">{note.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <Reveal>
          <div
            className="rounded-[28px] border border-[#FCF4EB]/[0.10] bg-[linear-gradient(180deg,rgba(124,105,199,0.10),rgba(252,244,235,0.03))] p-6 sm:p-8 lg:p-10"
          >
            <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-[0.22em] mb-3">
              One more worth knowing
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-5">
              <Link
                href="https://www.anthropic.com/news/claude-design-anthropic-labs"
                className="border-b border-[#9D8FE0]/40 hover:border-[#9D8FE0] transition-colors"
              >
                Claude Designer
              </Link>
            </h2>
            <div className="space-y-5 text-[#FCF4EB]/75 leading-relaxed text-lg">
              <p>
                Launched April 2026 by Anthropic Labs, Claude Designer is a separate product built specifically
                for visual creation. You describe what you need, a slide deck, a one-pager, a prototype, a
                marketing asset, and Claude builds it, then refines it through conversation, inline comments,
                and live adjustment controls.
              </p>
              <p>
                What makes it different from everything else in this list: it reads your existing codebase and
                design files to apply your actual brand system automatically. It accepts images, documents
                (DOCX, PPTX, XLSX), and web captures as input. When you are done, you export to Canva, PDF,
                PPTX, or standalone HTML, or hand the finished design directly to Claude Code for
                implementation.
              </p>
              <p>
                It does not connect to your file system the way Code does, and it has no automation or
                scripting layer. It is a purpose-built creative tool, not a power tool. For founders,
                marketers, and product teams who need polished visual output without a designer, it fills a gap
                none of the four above were built for.
              </p>
              <p className="text-[#FCF4EB]/55 text-base">Available on Pro, Max, Team, and Enterprise plans.</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24">
        <Reveal>
          <div
            className="rounded-[32px] p-8 sm:p-10 lg:p-12"
            style={{
              background:
                'linear-gradient(135deg, rgba(245, 195, 198, 0.14) 0%, rgba(124, 105, 199, 0.12) 42%, rgba(252, 244, 235, 0.08) 100%)',
              border: '1px solid rgba(252,244,235,0.10)',
            }}
          >
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
              Masterminds HQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FCF4EB] leading-tight mb-5">
              The terminal is where Claude becomes infrastructure
            </h2>
            <p className="text-[#FCF4EB]/72 text-lg leading-relaxed mb-6">
              If someone sent you here, they want you to see what is possible beyond the chat window. The
              Business Automation Mastermind is where founders learn how to actually build with this, agents
              that do real work, automation that runs without you, and systems that turn AI from a chat tool
              into operational leverage.
            </p>
            <Link
              href="https://www.mastermindshq.business/"
              className="inline-flex items-center rounded-xl bg-[#FCF4EB] px-5 py-3 text-sm font-semibold text-[#151515] transition-transform hover:-translate-y-0.5"
            >
              Visit mastermindshq.business
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
