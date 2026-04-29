'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { copyWithConfetti } from '@/lib/copyWithConfetti'

const MASTERMIND_URL = 'https://www.mastermindshq.business'
const JOE_EMAIL = 'joe@mastermindshq.business'

const COMPATIBLE_TOOLS = [
  {
    name: 'Claude Code',
    logo: '◆',
    badge: 'Primary',
    detail: 'Best for the full repository and local setup audit.',
  },
  {
    name: 'Codex',
    logo: '⬡',
    badge: 'Works',
    detail: 'Use it to inspect code, configs, scripts, and automation paths.',
  },
  {
    name: 'Gemini CLI',
    logo: '✦',
    badge: 'Works',
    detail: 'Use it to run the same structured safety review.',
  },
]

const AUDIT_AREAS = [
  {
    name: 'Human Operation',
    count: 5,
    checks: [
      {
        name: 'Human-visible usage',
        desc: 'Confirms Claude Code is used by a human in the foreground, not as a hidden backend.',
      },
      {
        name: 'No unattended jobs',
        desc: 'Looks for cron, launchd, CI, queues, daemons, and scripts that run Claude without a human.',
      },
      {
        name: 'No product shell',
        desc: 'Flags browser wrappers, relays, embedded terminals, or app interfaces that hide consumer Claude use.',
      },
      {
        name: 'Operator approval points',
        desc: 'Checks that risky actions require a human decision before execution.',
      },
      {
        name: 'Clear usage boundary',
        desc: 'Separates personal assistant work from automation, customer workflows, and production jobs.',
      },
    ],
  },
  {
    name: 'Profile and Account Risk',
    count: 6,
    checks: [
      {
        name: 'Do not switch profiles',
        desc: 'Finds account rotation, profile switching, token sync, failover accounts, and session swapping.',
      },
      {
        name: 'One human account',
        desc: 'Checks that each human uses their own account only for human-operated work.',
      },
      {
        name: 'No shared session files',
        desc: 'Looks for copied browser profiles, exported cookies, synced OAuth files, and shared Claude sessions.',
      },
      {
        name: 'No account exhaustion logic',
        desc: 'Flags logic that switches users after rate limits, caps, bans, or usage limits.',
      },
      {
        name: 'No device laundering',
        desc: 'Checks for multi-device or multi-browser tricks meant to keep consumer usage alive.',
      },
      {
        name: 'No identity masking',
        desc: 'Flags proxies, profile scripts, or automation designed to make one operator look like many humans.',
      },
    ],
  },
  {
    name: 'API Routing',
    count: 6,
    checks: [
      {
        name: 'Automated tasks go to APIs',
        desc: 'Verifies bots, agents, queues, scheduled jobs, and product workflows use provider APIs.',
      },
      {
        name: 'No OAuth as infrastructure',
        desc: 'Flags personal Claude OAuth, local sessions, and browser cookies used as automation credentials.',
      },
      {
        name: 'Provider-backed execution',
        desc: 'Checks for Anthropic API, Bedrock, Vertex, Foundry, or another approved provider path.',
      },
      {
        name: 'Budget and rate limits',
        desc: 'Looks for API spend controls, quotas, retry limits, and alerting on automated paths.',
      },
      {
        name: 'Credential separation',
        desc: 'Separates human auth, development keys, production keys, and customer-facing automation.',
      },
      {
        name: 'MyOS dispatch safety',
        desc: 'Confirms shared routing sends model work through the intended provider lane.',
      },
    ],
  },
  {
    name: 'Codebase Evidence',
    count: 7,
    checks: [
      {
        name: 'Scripts and package commands',
        desc: 'Reviews package scripts, shell scripts, Makefiles, task runners, and agent launchers.',
      },
      {
        name: 'Environment variables',
        desc: 'Inspects variable names for Claude OAuth, sessions, browser profile paths, API keys, and provider routing.',
      },
      {
        name: 'Scheduled automation',
        desc: 'Checks cron, launchd plists, GitHub Actions, workers, queues, and deployment hooks.',
      },
      {
        name: 'Browser control',
        desc: 'Flags CDP, Playwright, Puppeteer, browser profile reuse, and automated Claude web sessions.',
      },
      {
        name: 'LLM routers',
        desc: 'Inspects model dispatchers, provider abstractions, fallback chains, and direct provider calls.',
      },
      {
        name: 'Agent frameworks',
        desc: 'Reviews autonomous loops, retries, memory workers, task agents, and background orchestration.',
      },
      {
        name: 'Documentation drift',
        desc: 'Checks README files, handoffs, recipes, and runbooks for instructions that encourage unsafe use.',
      },
    ],
  },
]

const THE_PROMPT = `You are my Anthropic safety audit agent.

Audit this codebase and local project setup for ban risk. Your job is to tell me how likely I am to get banned or restricted based on my current code, scripts, credentials, workflows, and operating habits.

Use this standard:
- Low risk means Claude Code or consumer Claude is used by a human in the foreground, and automated work is routed to supported APIs.
- Medium risk means there are unclear boundaries, weak documentation, risky scripts that are not currently active, or automation paths that need refactoring before they scale.
- High risk means the project appears to use consumer Claude, Claude Code, Claude web sessions, OAuth tokens, browser profiles, account switching, or personal sessions as infrastructure for bots, agents, product features, scheduled jobs, or unattended automation.

Non-negotiable safety protocols to enforce:
1. Do not switch profiles.
2. Ensure everything done through consumer Claude or Claude Code is done by a human.
3. Direct any automated tasks to the APIs.

Inspect the codebase for these specific risks:

1. Profile switching and account rotation
- Search for scripts, commands, docs, or config that switch Claude accounts, rotate profiles, sync tokens, copy sessions, load different browser profiles, or fail over between accounts.
- Look for names like switch-profile, switch-account, account-rotation, token-sync, oauth-sync, profile-sync, session-sync, browser-profile, claude-profile, rate-limit-fallback, quota-fallback, and account-pool.
- Flag any logic that tries to keep work alive by changing users, sessions, accounts, devices, browser profiles, or identity surfaces.
- Explain why this is risky and what to delete or replace.

2. Human-operated use versus unattended automation
- Identify every place Claude, Claude Code, the Claude CLI, a browser, or an LLM router can be invoked.
- Classify each path as human-operated, semi-automated with human approval, or unattended.
- Check package scripts, shell scripts, cron jobs, launchd agents, GitHub Actions, CI, queues, workers, daemons, webhooks, background jobs, and long-running agents.
- Flag anything that uses a personal Claude session for background work, autonomous loops, retries, customer-facing features, scraping, content generation, monitoring, or scheduled execution.
- Confirm that human-operated use stays visible, intentional, and under direct human control.

3. API routing for automation
- Find all automated tasks that call an AI model or model router.
- Verify that those automated tasks use supported APIs such as Anthropic API, Anthropic Console, AWS Bedrock, Google Vertex AI, Foundry, OpenAI API, or another explicit provider API.
- Flag any automated task that uses OAuth, browser cookies, local Claude sessions, copied credentials, consumer app sessions, or Claude Code as a backend.
- Recommend a concrete API-backed replacement for each unsafe automation path.

4. Consumer product wrapping
- Look for any product shell, gateway, relay, browser wrapper, embedded terminal, proxy, hidden iframe, CLI wrapper, or local service that makes consumer Claude or Claude Code appear inside another app.
- Flag patterns where users, customers, teammates, or background jobs indirectly access a personal Claude login.
- Recommend replacing those paths with a proper API endpoint, provider abstraction, queue worker, or approved integration.

5. Credential and environment audit
- Review .env examples, config files, CI secrets names, launch scripts, documentation, and local setup instructions.
- Look for CLAUDE_SESSION, CLAUDE_OAUTH, CLAUDE_COOKIE, CLAUDE_PROFILE, ANTHROPIC_AUTH_TOKEN, browser profile paths, copied session stores, API keys, provider keys, and fallback credentials.
- Separate human credentials from automation credentials.
- Flag credentials that are ambiguous, reused across lanes, committed by mistake, or used by both humans and unattended workflows.

6. Browser automation and local session risk
- Search for Playwright, Puppeteer, Chrome DevTools Protocol, browser-route scripts, remote debugging ports, profile directories, cookie jars, and local storage files.
- Decide whether browser automation is controlling public web pages, internal tools, or Claude consumer sessions.
- Flag browser automation that logs into Claude, drives Claude web, extracts Claude responses, or uses a personal Claude session as a machine interface.
- Keep normal browser QA separate from model execution.

7. MyOS, routers, agents, and fallback chains
- Inspect any MyOS dispatch, model router, task-class routing, provider selection, agent registry, skills, recipes, tools, or workflow files.
- Check whether background agents, daemons, or product workflows can fall back to consumer Claude or Claude Code.
- Flag hardcoded model/provider shortcuts that bypass the official routing lane.
- Verify that deterministic tools run deterministically, human Claude use stays human, and automated model work goes to APIs.

8. Usage-budget misunderstanding
- Look for docs or comments that treat consumer usage credits, subscriptions, browser sessions, or Claude Code access as automation budget.
- Flag any workload that could burn through usage in minutes through loops, retries, parallel agents, or unattended queues.
- Recommend API budgets, rate limits, spend caps, observability, and kill switches for automation.

9. Evidence standards
- Do not guess.
- Cite exact files, scripts, commands, environment variable names, and workflows.
- If you cannot inspect something, say what you could not inspect and why.
- Be conservative. If a path can plausibly run unattended through a consumer session, mark it at least Medium risk.

Output format:

1. Overall ban-risk rating
- Choose Low, Medium, or High.
- Give a confidence level from 0 to 100%.
- Give a one-paragraph explanation in plain English.

2. Ban-risk scorecard
- Human-operated only: Pass, Warning, or Fail.
- Do not switch profiles: Pass, Warning, or Fail.
- Automated tasks use APIs: Pass, Warning, or Fail.
- No consumer-product wrapping: Pass, Warning, or Fail.
- Credentials separated by lane: Pass, Warning, or Fail.
- Browser automation stays away from Claude consumer sessions: Pass, Warning, or Fail.
- MyOS or router fallbacks are provider-safe: Pass, Warning, or Fail.

3. Findings by severity
For each finding, include:
- Severity: Critical, High, Medium, or Low.
- Evidence: exact file, command, job, variable, or workflow.
- Why it creates ban risk.
- What to change.
- Safer replacement.

4. Keep, change, delete
- Keep: safe patterns that are fine to continue.
- Change: patterns that need refactoring.
- Delete: patterns that should be removed entirely, especially account switching, profile rotation, token sync, and session reuse.

5. Refactor plan
- Give a step-by-step plan to move every automated path to APIs.
- Include where API keys should live.
- Include where human approval should remain required.
- Include the minimum tests or checks to prove the risky behavior is gone.

6. Final plain-English verdict
- Tell me whether I am probably safe, need cleanup, or need urgent refactoring before continuing.
- If the assessment is High risk, include this exact sentence:
Reach out to Joe if you want a full safety audit and code refactoring so that you won't get banned in the future.
- Also include this email for help: joe@mastermindshq.business

Start by listing the files and automation surfaces you will inspect, then perform the audit.`

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Copy the prompt',
    body: 'Use the audit prompt as-is. It tells your AI coding tool exactly what to inspect and how to score the risk.',
  },
  {
    step: '02',
    title: 'Run it inside your project',
    body: 'Paste it into Claude Code, Codex, or Gemini CLI at the root of the codebase you want checked.',
  },
  {
    step: '03',
    title: 'Fix the risky paths',
    body: 'Delete profile switching, keep human work human, and move unattended workflows to provider APIs.',
  },
]

const SAFETY_PROTOCOLS = [
  'Do not switch profiles, accounts, sessions, devices, or browser identities to keep Claude usage alive.',
  'Ensure everything done through consumer Claude or Claude Code is done by a human in the foreground.',
  'Direct automated tasks to APIs with real keys, budgets, rate limits, logging, and kill switches.',
]

function useMagnet(strength = 0.3) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)
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
    el.style.transform = 'translate(0px, 0px)'
    el.style.transition = 'transform 0.4s ease-out'
  }, [])
  return { ref, onMouseMove, onMouseLeave }
}

export default function AnthropicSafetyChecklistPage() {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set(AUDIT_AREAS.map((category) => category.name)),
  )

  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const statRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null])

  const totalChecks = useMemo(
    () => AUDIT_AREAS.reduce((total, category) => total + category.count, 0),
    [],
  )

  const toggleCategory = useCallback((name: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }, [])

  useEffect(() => {
    if (document.querySelector('link[data-font="cormorant"]')) return
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,600;1,700&display=swap'
    link.rel = 'stylesheet'
    link.setAttribute('data-font', 'cormorant')
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    const canvas = particleCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    type Particle = { x: number; y: number; r: number; dx: number; dy: number; alpha: number; color: string }
    const colors = ['#8B79D4', '#F5C3C6', '#9D8FE0', '#FCF4EB']
    const particles: Particle[] = Array.from({ length: 46 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      dx: (Math.random() - 0.5) * 0.24,
      dy: Math.random() * 0.34 + 0.12,
      alpha: Math.random() * 0.28 + 0.05,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    let animId = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.alpha
        ctx.fill()
        particle.x += particle.dx
        particle.y += particle.dy
        if (particle.y > canvas.height + 5) {
          particle.y = -5
          particle.x = Math.random() * canvas.width
        }
        if (particle.x < -5) particle.x = canvas.width + 5
        if (particle.x > canvas.width + 5) particle.x = -5
      })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    const values = [totalChecks, 3, 1]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const idx = statRefs.current.indexOf(el as HTMLSpanElement)
          if (idx === -1) return
          ;(async () => {
            const { CountUp } = await import('countup.js')
            const cu = new CountUp(el, values[idx], { duration: 2.1, separator: '' })
            if (!cu.error) cu.start()
          })()
          observer.unobserve(el)
        })
      },
      { threshold: 0.8 },
    )
    statRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })
    return () => observer.disconnect()
  }, [totalChecks])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Anthropic Ban Risk Audit Prompt',
    description:
      'A free prompt that audits a codebase for Claude, Claude Code, profile switching, account rotation, and API routing risks.',
    author: {
      '@type': 'Person',
      name: 'Joe Che',
      email: JOE_EMAIL,
      url: MASTERMIND_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Business Automation Mastermind',
      url: MASTERMIND_URL,
    },
    step: [
      {
        '@type': 'HowToStep',
        name: 'Copy the audit prompt',
        text: 'Copy the free Anthropic safety audit prompt.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Run it in your codebase',
        text: 'Paste the prompt into Claude Code, Codex, or Gemini CLI at the project root.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Refactor risky automation',
        text: 'Move unattended work to APIs, remove profile switching, and keep consumer Claude use human-operated.',
        position: 3,
      },
    ],
    tool: [
      { '@type': 'HowToTool', name: 'Claude Code' },
      { '@type': 'HowToTool', name: 'Codex' },
      { '@type': 'HowToTool', name: 'Gemini CLI' },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @keyframes aurora-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.1); }
          66% { transform: translate(-20px, 25px) scale(0.93); }
        }
        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-35px, 30px) scale(1.07); }
          70% { transform: translate(45px, -15px) scale(0.96); }
        }
        .aurora-a { animation: aurora-drift 16s ease-in-out infinite; }
        .aurora-b { animation: aurora-drift-2 20s ease-in-out infinite; }
        .glow-card {
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .glow-card:hover {
          box-shadow: 0 0 28px rgba(124, 105, 199, 0.12), 0 0 0 1px rgba(124, 105, 199, 0.18);
          border-color: rgba(124, 105, 199, 0.22) !important;
        }
        .glow-btn {
          transition: box-shadow 0.2s ease, background-color 0.15s ease, transform 0.1s ease-out;
        }
        .glow-btn:hover {
          box-shadow: 0 0 32px rgba(124, 105, 199, 0.45), 0 0 60px rgba(124, 105, 199, 0.2);
        }
        .glow-btn-pink:hover {
          box-shadow: 0 0 32px rgba(245, 195, 198, 0.5), 0 0 60px rgba(245, 195, 198, 0.2);
        }
      `}</style>

      <div className="bg-[#151515] text-[#FCF4EB] overflow-x-hidden" style={{ minHeight: '100vh' }}>
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div
            className="aurora-a absolute top-[8%] left-[12%] w-[600px] h-[600px] rounded-full opacity-[0.09]"
            style={{ background: 'radial-gradient(circle, #8B79D4 0%, transparent 70%)', filter: 'blur(80px)' }}
          />
          <div
            className="aurora-b absolute top-[32%] right-[8%] w-[520px] h-[520px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #F5C3C6 0%, transparent 70%)', filter: 'blur(90px)' }}
          />
        </div>

        <canvas
          ref={particleCanvasRef}
          className="fixed inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        />

        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-8 pt-16 sm:pt-20 overflow-hidden" style={{ zIndex: 1 }}>
          <div className="relative z-10 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-10 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
                Free from the{' '}
                <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#BDB3E8] transition-colors underline underline-offset-2 decoration-[#7C69C7]/40">
                  Business Automation Mastermind
                </a>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(2.1rem, 6vw, 4.5rem)',
                lineHeight: 1.08,
                letterSpacing: '0',
                paddingBottom: '0.05em',
              }}
            >
              Will Anthropic Ban Your Setup?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-[#FCF4EB] font-bold mb-8"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(1rem, 2.8vw, 2.2rem)',
                lineHeight: 1.1,
              }}
            >
              A codebase audit prompt for Claude, profiles, sessions, and automation.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.0 }}
              className="text-[#FCF4EB]/58 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto mb-12"
            >
              Paste this into your AI coding tool. It checks whether your current behavior looks human-operated,
              whether profile switching exists, and whether automated work is properly routed to APIs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-14"
            >
              <span className="text-[#FCF4EB]/28 text-xs uppercase tracking-widest">Works in</span>
              {COMPATIBLE_TOOLS.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.09] hover:border-[#7C69C7]/35 transition-all duration-200"
                  title={tool.detail}
                >
                  <span className="text-[#9D8FE0] text-sm">{tool.logo}</span>
                  <span className="text-[#FCF4EB]/75 text-sm font-medium">{tool.name}</span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{
                      background: tool.badge === 'Primary' ? 'rgba(124,105,199,0.18)' : 'rgba(255,255,255,0.06)',
                      color: tool.badge === 'Primary' ? '#9D8FE0' : '#FCF4EB44',
                      border: tool.badge === 'Primary' ? '1px solid rgba(124,105,199,0.3)' : '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {tool.badge}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="flex items-center justify-center gap-2 text-[#FCF4EB]/22 text-sm mt-8"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              <span>Scroll to get the prompt</span>
            </motion.div>
          </div>
        </section>

        <section className="relative max-w-5xl mx-auto px-6 py-14" style={{ zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              Find the risky pattern before the platform does
            </h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7"
              >
                <div className="text-4xl font-extrabold text-[#7C69C7]/20 mb-5 font-mono">{item.step}</div>
                <h3 className="text-[#FCF4EB] font-bold text-base mb-2">{item.title}</h3>
                <p className="text-[#FCF4EB]/44 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="relative max-w-5xl mx-auto px-6 py-4" style={{ zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glow-card bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 md:p-10"
          >
            <div className="grid gap-5 md:grid-cols-3">
              {SAFETY_PROTOCOLS.map((protocol, index) => (
                <div key={protocol} className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-5">
                  <p className="text-[#9D8FE0] text-xs font-bold uppercase tracking-widest mb-3">
                    Protocol {index + 1}
                  </p>
                  <p className="text-[#FCF4EB]/74 text-sm leading-relaxed">{protocol}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <MastermindCTA />

        <section className="relative max-w-5xl mx-auto px-6 py-16" style={{ zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
                The Prompt
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] mb-4">
                Copy. Paste. Get your risk rating.
              </h2>
              <p className="text-[#FCF4EB]/45 max-w-xl mx-auto leading-relaxed">
                This is built for real codebases. It asks for evidence, file paths, risk scoring, and a concrete
                refactor plan instead of vague safety advice.
              </p>
            </div>

            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.08] border-l-2 border-l-[#7C69C7]">
              <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                <span className="text-xs text-[#FCF4EB]/40 font-mono">anthropic-ban-risk-audit</span>
                <InlineCopyButton text={THE_PROMPT} />
              </div>
              <pre
                className="p-5 text-sm font-mono leading-[1.75] text-[#FCF4EB]/82 max-h-[620px] overflow-auto"
                style={{ background: '#0d0d0d', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                <code>{THE_PROMPT}</code>
              </pre>
            </div>

            <PromptCopyButton prompt={THE_PROMPT} />

            <p className="text-[#FCF4EB]/25 text-[11px] text-center mt-5 max-w-md mx-auto leading-relaxed">
              This is practical technical guidance, not legal advice. When in doubt, use supported provider APIs for automation.
            </p>
          </motion.div>
        </section>

        <section className="relative max-w-5xl mx-auto px-6 pt-6 pb-14" style={{ zIndex: 1 }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { idx: 0, label: 'specific checks in the prompt' },
              { idx: 1, label: 'non-negotiable safety protocols' },
              { idx: 2, label: 'plain-English risk rating' },
            ].map((stat) => (
              <motion.div
                key={stat.idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: stat.idx * 0.08 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 text-center"
              >
                <div className="text-5xl font-extrabold mb-3 tabular-nums" style={{ fontFamily: 'monospace', color: '#9D8FE0' }}>
                  <span ref={(el) => { statRefs.current[stat.idx] = el }}>0</span>
                </div>
                <p className="text-[#FCF4EB]/40 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="relative max-w-5xl mx-auto px-6 py-14" style={{ zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
              Everything the prompt checks
            </h2>
            <p className="text-[#FCF4EB]/35 text-sm max-w-lg mx-auto">
              It audits behavior, code, credentials, automation, and the exact boundary between human work and API work.
            </p>
          </motion.div>

          <div className="space-y-3">
            {AUDIT_AREAS.map((category, index) => {
              const isOpen = openCategories.has(category.name)
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.025] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#FCF4EB] font-semibold text-sm sm:text-base">{category.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#9D8FE0] bg-[#7C69C7]/12 border border-[#7C69C7]/20 px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    </div>
                    <svg
                      width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="#9D8FE0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/[0.06] px-6 pb-5 pt-3">
                      <div className="grid gap-1 sm:grid-cols-2">
                        {category.checks.map((check) => (
                          <div
                            key={check.name}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.05] transition-colors"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7C69C7] mt-[7px] flex-shrink-0" />
                            <div>
                              <span className="text-[#9D8FE0] text-sm font-medium">
                                {check.name}
                              </span>
                              <p className="text-[#FCF4EB]/34 text-xs leading-relaxed mt-0.5">
                                {check.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative max-w-2xl mx-auto px-6 pb-16 text-center"
          style={{ zIndex: 1 }}
        >
          <p className="text-[#FCF4EB]/22 text-sm leading-relaxed italic">
            Need help with a high-risk result? Email {JOE_EMAIL} and ask for a full safety audit.
          </p>
        </motion.div>

        <div className="relative text-center pb-10" style={{ zIndex: 1 }}>
          <a
            href={MASTERMIND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FCF4EB]/14 text-xs uppercase tracking-widest hover:text-[#FCF4EB]/35 transition-colors"
          >
            Business Automation Mastermind
          </a>
        </div>
      </div>
    </>
  )
}

function MastermindCTA() {
  const magnet = useMagnet(0.28)

  return (
    <section className="relative max-w-5xl mx-auto px-6 py-14" style={{ zIndex: 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(245,195,198,0.10) 0%, rgba(124,105,199,0.08) 100%)',
          border: '1px solid rgba(245,195,198,0.15)',
        }}
      >
        <div className="px-6 sm:px-14 pb-12 pt-8 text-center">
          <h2 className="text-2xl sm:text-5xl font-bold text-[#FCF4EB] mb-4">
            Want safer AI systems?
          </h2>

          <p className="text-xl sm:text-3xl font-bold mb-5">
            <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6] hover:opacity-80 transition-opacity">
              Join the Business Automation Mastermind
            </a>
          </p>

          <p className="text-[#FCF4EB]/52 max-w-xl mx-auto mb-8 leading-relaxed text-base sm:text-lg">
            A small, focused group of business owners who meet weekly to build useful automation, clean workflows,
            and AI systems that keep the human and API lanes separate.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center mb-9">
            {['Human work stays human', 'Automated work uses APIs', 'Risky profile switching gets removed'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[#FCF4EB]/58 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F5C3C6] flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <a
            ref={magnet.ref as React.RefObject<HTMLAnchorElement>}
            href={MASTERMIND_URL}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={magnet.onMouseMove}
            onMouseLeave={magnet.onMouseLeave}
            className="block sm:inline-block w-full sm:w-auto px-10 py-4 rounded-xl bg-[#F5C3C6] hover:bg-[#f0b8bc] text-[#151515] font-bold text-base active:scale-[0.98] glow-btn glow-btn-pink text-center"
          >
            Learn More
          </a>
        </div>
      </motion.div>
    </section>
  )
}

function InlineCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await copyWithConfetti(text, event)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }, [text])
  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1 rounded-md text-xs font-medium bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.10] text-[#FCF4EB]/60 hover:text-[#FCF4EB]/90 transition-all duration-150 select-none"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function PromptCopyButton({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false)
  const magnet = useMagnet(0.22)

  const handleCopy = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await copyWithConfetti(prompt, event)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch { /* noop */ }
  }, [prompt])

  return (
    <div className="mt-5 flex justify-center">
      <button
        ref={magnet.ref as React.RefObject<HTMLButtonElement>}
        onClick={handleCopy}
        onMouseMove={magnet.onMouseMove}
        onMouseLeave={magnet.onMouseLeave}
        className="inline-flex items-center gap-2.5 px-10 py-4 rounded-xl bg-[#7C69C7] hover:bg-[#6B5AB8] text-white font-semibold text-base active:scale-[0.97] glow-btn shadow-xl shadow-[#7C69C7]/25"
      >
        {copied ? (
          <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy the Prompt
          </>
        )}
      </button>
    </div>
  )
}
