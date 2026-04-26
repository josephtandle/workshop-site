'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MASTERMIND_URL = 'https://www.mastermindshq.business'

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------
const SECTIONS = [
  {
    id: 'memory',
    number: '01',
    icon: '◈',
    title: 'The Memory and Knowledge Stack',
    tagline: 'Agents that forget are just expensive search boxes.',
    summary: 'Three tools that give your agents memory, structural awareness, and shared knowledge across the whole system.',
    items: [
      {
        name: 'AgentMem',
        desc: 'A local worker service that gives all your agents shared, searchable memory. Agents write to it at session end and recall from it at session start. The result is agents that remember what worked, what a user said last week, and what decisions were made across sessions. Install once via npm. Every agent in your system can use it immediately.',
      },
      {
        name: 'Graphify',
        desc: 'A Python tool that reads your entire agent codebase and builds a knowledge graph from it. Every function, class, and module becomes a node. Every dependency becomes an edge. The result is a queryable map of how your whole system connects. With 20+ agents sharing utilities, Graphify is the only way to know for certain what uses what.',
      },
      {
        name: 'Graphiti',
        desc: 'A temporal knowledge graph by Zep. Where AgentMem answers "what do I remember?", Graphiti answers "what does the whole system know about the world, and when did it learn it?" Every agent observation gets timestamped and linked by entity and relationship. The graph gets more valuable every day it runs.',
      },
    ],
  },
  {
    id: 'index',
    number: '02',
    icon: '◎',
    title: 'The Index System',
    tagline: 'Any agent should be able to orient itself in 3 reads.',
    summary: 'A flat filing convention that makes your entire system navigable without grepping through files.',
    items: [
      {
        name: 'INDEX.md in every folder',
        desc: 'An INDEX.md lives at the root of every significant directory. Its job is to tell an agent what is in that directory and where things live. It does not contain the things themselves, it points to them. When you have 60+ agents in a folder, an agent reading a well-written INDEX.md knows exactly what to open next. No guessing, no grepping.',
      },
      {
        name: 'CONTEXT.md in every project',
        desc: 'A CONTEXT.md lives at the root of every active project. It captures what is not obvious from the code: current state, decisions made and why, what is in progress, what has been tried and failed, what the constraints are. CONTEXT.md is written and updated by agents, not just humans. The next agent that touches the project starts with full context.',
      },
      {
        name: 'ROUTING-SLIM.md at the top',
        desc: 'A lean routing document at the top level. When Claude Code needs to know which agent handles what, it reads ROUTING-SLIM.md first. One line per domain, pointing to the right INDEX or CONTEXT file. Three reads from anywhere in the system to full context: ROUTING-SLIM.md, INDEX.md, CONTEXT.md.',
      },
    ],
  },
  {
    id: 'selflearning',
    number: '03',
    icon: '✦',
    title: 'Self-Learning for Each Agent',
    tagline: 'Agents that do the same thing the same way are not learning.',
    summary: 'The infrastructure pattern that makes individual agents improve over time without retraining.',
    items: [
      {
        name: 'Recall at session start',
        desc: 'Every agent starts a session by recalling from AgentMem what is relevant to the current task. Not the full history, just what matters for this context. This keeps agents grounded in accumulated knowledge rather than starting from scratch every time.',
      },
      {
        name: 'Observe during the session',
        desc: 'During work, the agent buffers observations: what it tried, what worked, what the user responded to, what failed. These do not go anywhere yet. They accumulate in memory. The observation discipline is simple: if you learned something, write it down.',
      },
      {
        name: 'Flush and update at session end',
        desc: "At session end, the agent flushes observations to Graphiti and updates its own CONTEXT.md with any decisions or state changes. Over time, the CONTEXT.md becomes a living record of the agent's domain. The Graphiti graph builds a network the agent can query before acting. The agent stops asking what it should do and starts asking what it already knows.",
      },
    ],
  },
  {
    id: 'pm',
    number: '04',
    icon: '⬡',
    title: 'Project Manager Architecture',
    tagline: 'PMs do not execute. They coordinate.',
    summary: 'How to structure autonomous project manager agents that handle entire domains without human involvement.',
    items: [
      {
        name: 'One PM per major domain',
        desc: 'Each PM owns a domain completely: its own CONTEXT.md, its own memory, its own view of the stakeholders, open items, constraints, and goals. The PM reads this context at session start and updates it at session end. When you have multiple domains, each PM runs independently. A top-level synthesizer pulls signals from all of them for the morning brief.',
      },
      {
        name: 'Five things a well-built PM does',
        desc: 'It reads agent outputs and logs to understand what happened. It identifies what needs action: billing issues, missed milestones, at-risk relationships, open loops. It routes work to specialist agents rather than doing it itself. It sends a brief to the human only when a decision is needed or something is outside normal parameters. It updates its CONTEXT.md so the next session starts with accurate state.',
      },
      {
        name: 'PMs route, specialists execute',
        desc: 'The moment a PM starts doing the work of a specialist agent, it loses the altitude it needs to see the whole domain. The discipline is strict: PMs identify and route, they do not execute. Specialist agents execute. When this separation holds, the PM can manage a domain with dozens of moving parts without getting buried in any single one.',
      },
    ],
  },
  {
    id: 'dispatch',
    number: '05',
    icon: '◇',
    title: 'Dispatch and Modeling',
    tagline: 'The right task, to the right agent, with the right model.',
    summary: 'How to route work intelligently across your agent network and pick the right model for each job.',
    items: [
      {
        name: 'Model selection by task type',
        desc: 'Different tasks have different requirements. Architecture decisions, new agent builds, and complex multi-file problems need the most capable model. Standard task execution, writing, and coordination work needs a mid-tier model. Fast, high-volume operations like classification, routing, and short lookups can use a lighter model. Getting this right cuts costs without sacrificing quality.',
      },
      {
        name: 'Three-question routing',
        desc: 'When a task arrives: which domain does this belong to? (ROUTING-SLIM.md answers this.) Which specialist handles it within that domain? (INDEX.md and the PM CONTEXT.md answer this.) Does this need to run now or can it be queued? Most tasks can be queued and run asynchronously. Only decisions and user-facing responses need to be synchronous.',
      },
      {
        name: 'Parallelize everything that can be parallelized',
        desc: 'Five independent research tasks become five agents running simultaneously. A task that requires synthesizing five results waits until all five are done. The orchestrator manages sequencing. The default is always: what is the maximum work I can dispatch right now without creating a dependency bottleneck? Parallelization is not optional at scale, it is the architecture.',
      },
    ],
  },
  {
    id: 'recipes',
    number: '06',
    icon: '✶',
    title: 'Recipes, Skills, and Agents',
    tagline: 'Write it once. Every agent in the system benefits.',
    summary: 'The three tiers of reusable capability that compose into a coherent, maintainable multi-agent system.',
    items: [
      {
        name: 'Recipes: the utility layer',
        desc: 'Recipes are small, single-purpose scripts that live in a shared folder accessible to all agents. One recipe knows how to send a WhatsApp message. Another looks up a CRM contact. Another posts a Telegram notification. When you improve a recipe, every agent that uses it improves. When you find a bug, you fix it in one place. Recipes are the foundation everything else builds on.',
      },
      {
        name: 'Skills: packaged expertise',
        desc: 'Skills are Claude Code slash commands installed as plugins and available in any session. A skill is prompt-based: a set of instructions that encodes significant expertise about a specific type of work. The best skills encode months of refinement into a reusable workflow. A hook-writing skill does not just say "write a hook." It encodes the framework, the voice profile, the format, and the evaluation criteria.',
      },
      {
        name: 'Agents: complete autonomous capabilities',
        desc: 'Agents are autonomous programs with their own CONTEXT.md, their own memory, their own scope, and their own external service relationships. They use recipes internally. They operate without human involvement. The discipline: recipes own the how, agents own the what and why, skills own the framework for thinking. When they stay in their lanes, the system is easy to maintain, easy to extend, and easy to debug.',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Magnetic hook
// ---------------------------------------------------------------------------
function useMagnet(strength = 0.28) {
  const ref = useRef<HTMLAnchorElement | null>(null)
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
    el.style.transition = 'transform 0.1s ease-out'
  }, [strength])
  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0, 0)'
    el.style.transition = 'transform 0.4s ease-out'
  }, [])
  return { ref, onMouseMove, onMouseLeave }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AgentInfrastructurePage() {
  const [open, setOpen] = useState<Set<string>>(() => new Set([SECTIONS[0].id]))
  const magnet = useMagnet()

  const toggle = useCallback((id: string) => {
    setOpen(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  useEffect(() => {
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null
    let rafId = 0
    ;(async () => {
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({ duration: 1.1 }) as unknown as { raf: (t: number) => void; destroy: () => void }
      const raf = (time: number) => { lenis!.raf(time); rafId = requestAnimationFrame(raf) }
      rafId = requestAnimationFrame(raf)
    })()
    return () => { if (lenis) lenis.destroy(); cancelAnimationFrame(rafId) }
  }, [])

  return (
    <>
      <style>{`
        @keyframes aurora-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -40px) scale(1.08); }
          66%       { transform: translate(-25px, 20px) scale(0.94); }
        }
        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(-30px, 25px) scale(1.06); }
          70%       { transform: translate(40px, -20px) scale(0.96); }
        }
        .aurora-a { animation: aurora-drift 18s ease-in-out infinite; }
        .aurora-b { animation: aurora-drift-2 22s ease-in-out infinite; }
        .glow-card { transition: box-shadow 0.3s ease, border-color 0.3s ease; }
        .glow-card:hover {
          box-shadow: 0 0 28px rgba(124,105,199,0.12), 0 0 0 1px rgba(124,105,199,0.18);
          border-color: rgba(124,105,199,0.22) !important;
        }
        .glow-btn { transition: box-shadow 0.2s ease, transform 0.1s ease-out; }
        .glow-btn:hover { box-shadow: 0 0 32px rgba(124,105,199,0.45), 0 0 60px rgba(124,105,199,0.2); }
      `}</style>

      <div className="min-h-screen bg-[#151515] text-[#FCF4EB] overflow-x-hidden">

        {/* ================================================================
            HERO
        ================================================================ */}
        <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 pt-10 pb-10">

          {/* Aurora blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="aurora-a absolute top-[8%] left-[12%] w-[700px] h-[700px] rounded-full opacity-[0.08]"
              style={{ background: 'radial-gradient(circle, #8B79D4 0%, transparent 70%)', filter: 'blur(90px)' }} />
            <div className="aurora-b absolute top-[35%] right-[8%] w-[550px] h-[550px] rounded-full opacity-[0.06]"
              style={{ background: 'radial-gradient(circle, #F5C3C6 0%, transparent 70%)', filter: 'blur(100px)' }} />
          </div>

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="relative z-10 mb-10">
            <div className="p-[1px] rounded-full bg-gradient-to-r from-[#8B79D4] to-[#F5C3C6] inline-block">
              <div className="px-5 py-2 rounded-full bg-[#151515] flex items-center gap-2">
                <span className="text-[#9D8FE0] text-xs">✦</span>
                <span className="font-semibold text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]">
                  Free
                </span>
                <span className="text-[#FCF4EB]/35 text-xs">from the</span>
                <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer"
                  className="text-[#FCF4EB]/60 text-xs font-medium hover:text-[#FCF4EB]/90 transition-colors">
                  Business Automation Mastermind
                </a>
              </div>
            </div>
          </motion.div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#7C69C7] mb-5">
              Joe Che&apos;s APRIL Resource
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mb-5 text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] via-[#C4BBF0] to-[#F5C3C6]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 6vw, 4.2rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                paddingBottom: '0.05em',
              }}
            >
              Advanced Infrastructure for Multi-Agent AI Operating Systems
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.0 }}
              className="text-[#FCF4EB]/50 text-lg leading-relaxed max-w-2xl mx-auto mb-3">
              For builders who have moved past single agents and are ready to make their entire system work as one intelligent, coordinated network.
            </motion.p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.3 }}
              className="text-[#FCF4EB]/28 text-sm">
              6 layers. Memory, navigation, self-learning, coordination, dispatch, and composability.
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.8 }}
            className="relative z-10 mt-14 flex items-center gap-2 text-[#FCF4EB]/20 text-sm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
            <span>Read the full guide below</span>
          </motion.div>
        </section>

        {/* ================================================================
            INTRO
        ================================================================ */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl p-8 sm:p-10"
            style={{ background: 'linear-gradient(135deg, rgba(124,105,199,0.07) 0%, rgba(157,143,224,0.04) 100%)', border: '1px solid rgba(124,105,199,0.14)' }}>
            <p className="text-[#FCF4EB]/65 text-base leading-relaxed mb-4">
              Most people stop at the agent layer. They build ten agents, maybe twenty, and then wonder why the system feels like it is getting harder to manage instead of easier.
            </p>
            <p className="text-[#FCF4EB]/65 text-base leading-relaxed mb-4">
              The bottleneck is not more agents. The bottleneck is infrastructure. Agents that cannot remember what happened last session, cannot see how the codebase connects, and cannot share knowledge with other agents are doing a fraction of what they are capable of.
            </p>
            <p className="text-[#FCF4EB]/65 text-base leading-relaxed">
              This guide covers the six layers that turn a collection of agents into a system that gets smarter every day it runs.
            </p>
          </motion.div>
        </section>

        {/* ================================================================
            SECTIONS
        ================================================================ */}
        <section className="max-w-4xl mx-auto px-6 pb-20 space-y-4">
          {SECTIONS.map((section, si) => {
            const isOpen = open.has(section.id)
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: si * 0.05 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <button
                  onClick={() => toggle(section.id)}
                  className="w-full flex items-start gap-5 px-7 py-6 text-left hover:bg-white/[0.025] transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: 'rgba(124,105,199,0.15)', border: '1.5px solid rgba(124,105,199,0.3)' }}>
                    <span className="text-[#9D8FE0] text-sm font-bold">{section.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold text-[#7C69C7]/60 font-mono tracking-widest">{section.number}</span>
                      <span className="text-[#FCF4EB] font-semibold text-base leading-snug">{section.title}</span>
                    </div>
                    <p className="text-[#FCF4EB]/40 text-sm leading-relaxed">{section.tagline}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9D8FE0" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    className={`flex-shrink-0 mt-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="border-t border-white/[0.06] px-7 pt-5 pb-7">
                        <p className="text-[#9D8FE0] text-sm mb-6 font-medium">{section.summary}</p>
                        <div className="grid gap-4 sm:grid-cols-3">
                          {section.items.map((item) => (
                            <div key={item.name}
                              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.10] transition-colors">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#8B79D4] flex-shrink-0" />
                                <span className="text-[#9D8FE0] text-sm font-semibold">{item.name}</span>
                              </div>
                              <p className="text-[#FCF4EB]/42 text-xs leading-relaxed">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </section>

        {/* ================================================================
            HOW IT ALL FITS
        ================================================================ */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(245,195,198,0.07) 0%, rgba(124,105,199,0.06) 100%)', border: '1px solid rgba(245,195,198,0.12)' }}>
            <div className="px-8 sm:px-12 py-10">
              <div className="text-center mb-8">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 bg-[#7C69C7]/12 text-[#9D8FE0] border border-[#7C69C7]/22">
                  The Full Stack
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
                  How the six layers work together
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Foundation', text: 'Recipes and skills form the base. Reusable capabilities that any agent or session can use without rebuilding.' },
                  { label: 'Navigation', text: 'The index system makes everything findable. INDEX.md, CONTEXT.md, and ROUTING-SLIM.md mean any agent can orient itself in three reads.' },
                  { label: 'Memory', text: 'AgentMem, Graphify, and Graphiti give agents individual memory, structural awareness, and shared knowledge across the whole system.' },
                  { label: 'Coordination', text: 'Project manager agents synthesize domain signals and route work to specialists. Humans receive a brief. Agents handle the rest.' },
                  { label: 'Learning', text: 'Observe, flush, update. Every agent writes at session end. Over time, the system accumulates institutional knowledge that informs every future decision.' },
                  { label: 'Dispatch', text: 'The right task goes to the right agent with the right model. Parallelization is the default. Synchronous execution is the exception.' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                      style={{ background: 'rgba(124,105,199,0.15)', border: '1px solid rgba(124,105,199,0.25)' }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-[#9D8FE0]" />
                    </div>
                    <div>
                      <span className="text-[#FCF4EB] text-sm font-semibold block mb-1">{item.label}</span>
                      <p className="text-[#FCF4EB]/40 text-xs leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================================================================
            MASTERMIND CTA
        ================================================================ */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl overflow-hidden text-center"
            style={{ background: 'linear-gradient(135deg, rgba(124,105,199,0.10) 0%, rgba(245,195,198,0.08) 100%)', border: '1px solid rgba(124,105,199,0.18)' }}>
            <div className="px-6 sm:px-14 py-12">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#7C69C7] mb-4">Go deeper</p>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#FCF4EB] mb-4">
                This is what we build in the Mastermind.
              </h2>
              <p className="text-[#FCF4EB]/50 max-w-xl mx-auto mb-8 leading-relaxed text-base sm:text-lg">
                A small, focused group of business owners who meet weekly to build real systems, fast. We go from idea to live agent in a single session. Infrastructure like this is standard.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center mb-9">
                {['Small group, capped at 15', 'We meet weekly', 'Real builds, real systems'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[#FCF4EB]/50 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9D8FE0] flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <a
                ref={magnet.ref}
                href={MASTERMIND_URL}
                target="_blank"
                rel="noopener noreferrer"
                onMouseMove={magnet.onMouseMove}
                onMouseLeave={magnet.onMouseLeave}
                className="inline-block px-10 py-4 rounded-xl bg-[#7C69C7] hover:bg-[#6e5db8] text-[#FCF4EB] font-bold text-base glow-btn"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <div className="text-center pb-12">
          <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer"
            className="text-[#FCF4EB]/14 text-xs uppercase tracking-widest hover:text-[#FCF4EB]/35 transition-colors">
            Business Automation Mastermind
          </a>
        </div>

      </div>
    </>
  )
}
