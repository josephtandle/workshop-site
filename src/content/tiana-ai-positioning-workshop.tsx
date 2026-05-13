'use client'

import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'
import StepCard from '@/components/StepCard'

function Section({
  id,
  number,
  label,
  title,
  children,
}: {
  id: string
  number?: string
  label: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="rounded-[30px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.028))] p-8 md:p-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-start gap-4 mb-6">
        {number ? (
          <div
            className="number-glow flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-base font-bold"
            style={{ background: 'rgba(124, 105, 199, 0.20)', color: '#7C69C7', border: '1.5px solid rgba(124, 105, 199, 0.35)' }}
          >
            {number}
          </div>
        ) : null}
        <div className="min-w-0">
          <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-[0.22em] mb-3">{label}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#FCF4EB]">{title}</h2>
        </div>
      </div>
      <div className="space-y-8">{children}</div>
    </section>
  )
}

function PromptCard({
  id,
  number,
  title,
  intro,
  filename = 'Claude Code prompt',
  prompt,
}: {
  id?: string
  number?: string
  title: string
  intro?: string
  filename?: string
  prompt: string
}) {
  return (
    <div id={id} className="rounded-[24px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(0,0,0,0.10))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-start gap-4">
        {number ? (
          <div
            className="number-glow flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: 'rgba(124, 105, 199, 0.20)', color: '#7C69C7', border: '1.5px solid rgba(124, 105, 199, 0.35)' }}
          >
            {number}
          </div>
        ) : null}
        <div className="flex-1 min-w-0">
          <h3 className="text-[1.1rem] font-bold text-[#FCF4EB] mb-3 leading-tight">{title}</h3>
          {intro ? <p className="text-[#FCF4EB]/62 leading-relaxed mb-4 text-[15px]">{intro}</p> : null}
          <CodeBlock filename={filename} editable codexPrompt code={prompt} />
        </div>
      </div>
    </div>
  )
}

function TeachingCard({
  id,
  step,
  eyebrow,
  title,
  children,
}: {
  id?: string
  step: string
  eyebrow?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="group card-hover card-shimmer rounded-[26px] border border-white/[0.11] bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.035))] p-6 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <div className="flex items-start gap-5">
        <div
          className="number-glow flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-bold"
          style={{ background: 'rgba(124, 105, 199, 0.20)', color: '#7C69C7', border: '1.5px solid rgba(124, 105, 199, 0.35)', fontSize: step.length > 1 ? '0.82rem' : '1rem' }}
        >
          {step}
        </div>
        <div className="flex-1 min-w-0">
          {eyebrow ? <p className="text-[#FCF4EB]/48 text-[11px] font-semibold uppercase tracking-[0.18em] mb-2">{eyebrow}</p> : null}
          <h3 className="text-xl md:text-[1.35rem] font-bold text-[#FCF4EB] leading-tight mb-4 group-hover:text-white transition-colors duration-200">{title}</h3>
          <div className="space-y-4 text-[15px] text-[#FCF4EB]/72 leading-[1.72]">{children}</div>
        </div>
      </div>
    </div>
  )
}

function FrameworkBlock({ lines }: { lines: string[] }) {
  return (
    <div className="rounded-[24px] border border-white/[0.10] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="space-y-3 text-[1.12rem] leading-[1.65] text-[#FCF4EB]/88">
        {lines.map((line, index) => (
          <p key={`${index}-${line}`} className={line === '' ? 'h-2' : ''}>
            {line || '\u00A0'}
          </p>
        ))}
      </div>
    </div>
  )
}

function StructureCard({
  number,
  title,
  time,
  items,
}: {
  number: string
  title: string
  time: string
  items: string[]
}) {
  return (
    <div className="rounded-[24px] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-start gap-4">
        <div
          className="number-glow flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ background: 'rgba(124, 105, 199, 0.20)', color: '#7C69C7', border: '1.5px solid rgba(124, 105, 199, 0.35)' }}
        >
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
            <h4 className="text-[#FCF4EB] font-semibold text-lg leading-tight">{title}</h4>
            <span className="text-xs text-[#FCF4EB]/40 whitespace-nowrap">{time}</span>
          </div>
          <ul className="flex flex-wrap gap-x-3 gap-y-3 text-sm text-[#FCF4EB]/68 leading-relaxed">
            {items.map((item) => (
              <li key={item} className="flex gap-2 items-start rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-2">
                <span className="text-[#7C69C7] mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-[#FCF4EB]/68 leading-relaxed">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="text-[#7C69C7]">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

const LEAVE_WITH = [
  'A written positioning statement built using the competitive alternative framework',
  'Clarity on which awareness level your dream client is at and what that means for your content',
  'An understanding of how clear positioning becomes a repeatable lead generation system',
  'The specificity test as a permanent filter for everything you write about your business',
]

export default function TianaAiPositioningWorkshop() {
  return (
    <div className="max-w-5xl mx-auto px-6 pb-16">
      <div className="pt-20 pb-10">
        <div className="mb-5 space-y-2">
          <p className="text-sm uppercase tracking-[0.22em] text-[#F5C3C6] font-semibold">Created by Tiyana Gori</p>
          <p className="text-sm uppercase tracking-[0.22em] text-[#FCF4EB]/74 font-semibold">Adapted by Joe Che</p>
          <p className="text-xs uppercase tracking-[0.24em] text-[#FCF4EB]/45 font-semibold">Adapted by Joe Che for the Masterminds HQ bonus workshop.</p>
        </div>
        <h1 className="gradient-text text-5xl md:text-6xl font-extrabold leading-[0.98] pb-1 mb-5 max-w-4xl">
          How to Stand Out in the Age of AI
        </h1>
        <p className="text-lg text-[#FCF4EB]/60 max-w-4xl leading-relaxed mb-8">
          Messaging and Positioning Workshop. Series of 3 parts, about 90 to 100 minutes each.
          This page turns Part 1 into an interactive workshop flow you can fill in, copy, and use with Claude Code as you go.
        </p>
        <div className="mb-8">
          <a
            href="https://www.tiyara.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#7C69C7]/28 bg-[#7C69C7]/10 px-4 py-2 text-sm font-medium text-[#FCF4EB]/78 transition-colors hover:text-white"
          >
            Visit Tiyara.co
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 4h6v6M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <details open className="rounded-2xl overflow-hidden border border-white/[0.10] bg-[linear-gradient(145deg,rgba(124,105,199,0.07),rgba(255,255,255,0.03))] shadow-[0_8px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.07)]">
          <summary className="flex items-center justify-between px-6 py-5 cursor-pointer select-none">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#9D8FE0] shadow-[0_0_12px_rgba(157,143,224,0.70)]" />
              <span className="text-xs uppercase tracking-[0.20em] text-[#FCF4EB]/65 font-semibold">Table of Contents</span>
            </div>
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(124,105,199,0.15)] border border-[rgba(124,105,199,0.28)] text-[#9D8FE0]">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </summary>
          <div className="border-t border-white/[0.07] mx-5" />
          <div className="px-6 py-5 space-y-5">
            {[
              {
                heading: 'Sections',
                items: [
                  { href: '#overview', label: 'Overview', number: '0' },
                  { href: '#before-you-start', label: 'Get Your Messaging Ready', number: '1-6' },
                  { href: '#live-guide', label: 'Opening and Client Journey', number: '7-21' },
                  { href: '#step-positioning-foundation', label: 'Market Positioning and Close', number: '22-39' },
                  { href: '#positioning-builder', label: 'Workbook', number: '40-46' },
                ],
              },
            ].map((group) => (
              <div key={group.heading} className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#FCF4EB]/38 font-semibold">{group.heading}</p>
                <ol className="space-y-2.5">
                  {group.items.map(({ href, label, number }) => (
                    <li key={href} className="flex items-start gap-3 group/item min-w-0">
                      <span
                        className="flex-shrink-0 min-w-[3.25rem] rounded-full border border-[#7C69C7]/30 bg-[#7C69C7]/12 px-2.5 py-1 text-center text-[10px] font-bold tabular-nums text-[#9D8FE0] mt-0.5"
                      >
                        {number}
                      </span>
                      <a href={href} className="text-[#FCF4EB]/54 hover:text-[#9D8FE0] text-[13px] leading-[1.35] transition-colors duration-150">
                        {label}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </details>
      </div>

      <div className="space-y-8">
        <Section id="overview" number="1" label="Workshop Overview" title="The AI Era and Where You Stand">
          <div className="space-y-4">
            <p className="text-[#FCF4EB]/68 leading-relaxed">
              Understand exactly who you are speaking to, where they are in their journey, and why they would choose you over every other option they are actually considering.
              Leave with a positioning statement that passes the specificity test and a clear picture of how that positioning becomes your lead generation system.
            </p>
            <p className="text-sm text-[#FCF4EB]/45">Duration about 90 to 100 minutes | Teaching, exercises, and integrated room discussion throughout</p>
          </div>

          <div className="space-y-4">
            {[
              {
                badge: 'Before You Start',
                title: 'Get Your Messaging Ready',
                description: 'Gather your current messaging and run the AI Description Test as a baseline. Takes ten minutes. Makes the opening exercise significantly more useful.',
              },
              {
                badge: 'Live Guide',
                title: 'The AI Era and Where You Stand: Session Guide',
                description: 'Step-by-step guide for following along. All exercises, frameworks, and discussion prompts included. Designed as a mastermind. Discussion happens throughout, not at the end.',
                featured: true,
              },
              {
                badge: 'During the Session',
                title: 'Positioning Statement Builder',
                description: 'Build your first-draft positioning statement using the competitive alternative framework. Includes the awareness check and the lead generation connection.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border p-6"
                style={
                  card.featured
                    ? {
                        background: 'linear-gradient(135deg, rgba(124, 105, 199, 0.18) 0%, rgba(245, 195, 198, 0.10) 100%)',
                        borderColor: 'rgba(124, 105, 199, 0.30)',
                      }
                    : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.10)' }
                }
              >
                <p className="text-[10px] uppercase tracking-widest font-semibold text-[#FCF4EB]/45 mb-3">{card.badge}</p>
                <h3 className="text-xl font-bold text-[#FCF4EB] mb-3">{card.title}</h3>
                <p className="text-sm text-[#FCF4EB]/58 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div id="what-this-session-covers">
              <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest font-semibold mb-4">What This Session Covers</p>
              <div className="space-y-4 text-[#FCF4EB]/68 leading-relaxed">
                <p><span className="text-[#FCF4EB] font-semibold">Opening - The AI Description Test.</span> Why generic AI output is a clarity problem, not an AI problem. The gap between what Claude says about your business and how you would describe it yourself is what this series closes.</p>
                <p><span className="text-[#FCF4EB] font-semibold">Part A - The Client&apos;s Journey.</span> Five levels of awareness and where your audience actually is. Why most content does not convert: the message does not match the moment. How knowing your client&apos;s awareness level makes their behaviour predictable and your lead generation repeatable.</p>
                <p><span className="text-[#FCF4EB] font-semibold">Part B - Where You Sit in the Market.</span> Positioning using the competitive alternative framework. The Visible Market versus the Mental Market. Why the real competition is almost never another provider. The Ferrari principle: how deliberate positioning shapes pricing, access, and the sales conversation.</p>
                <p><span className="text-[#FCF4EB] font-semibold">Integrated Discussion.</span> Discussion happens throughout, after each exercise and at key turning points. Not saved for the end.</p>
                <p><span className="text-[#FCF4EB] font-semibold">Close - The Chain Forward.</span> Your positioning statement, refined using the specificity test. How that positioning becomes the foundation for Part 2 and Part 3.</p>
              </div>
            </div>

            <div id="what-you-will-learn">
              <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest font-semibold mb-4">What You&apos;ll Learn</p>
              <BulletList items={LEAVE_WITH} />
            </div>

            <div id="session-structure">
              <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest font-semibold mb-4">Session Structure At A Glance</p>
              <div className="space-y-4">
                <StructureCard
                  number="1"
                  title="Opening: The AI Era"
                  time="~20 min"
                  items={[
                    'Step 1 - AI Description Test',
                    'Step 2 - Three Shifts and Two Markets',
                    'Discussion - 3 min',
                    'Step 3 - The Full Through-Line',
                  ]}
                />
                <StructureCard
                  number="2"
                  title="Part A: The Client's Journey"
                  time="~25 min"
                  items={[
                    'Step 4 - Five Levels of Awareness',
                    'Step 4B - Client Behaviour Is Predictable',
                    "Step 5 - Exercise: The Client's Moment",
                    'Discussion - 8 min',
                  ]}
                />
                <StructureCard
                  number="3"
                  title="Part B: Where You Sit in the Market"
                  time="~40 min"
                  items={[
                    'Step 6 - The Positioning Foundation',
                    'Step 6B - Ferrari vs Toyota',
                    'Quick check-in - 2 min',
                    'Step 7 - The Common Enemy',
                    'Quick share - 2 min',
                    'Step 8 - Exercise: The Positioning Statement',
                    'Discussion - 10 min',
                    'Step 9 - Anti-Positioning',
                    'Step 10 - Positioning as Lead Generation System',
                  ]}
                />
                <StructureCard
                  number="4"
                  title="Close"
                  time="~10 min"
                  items={[
                    'Refine the positioning statement',
                    'Bring the refined version to Part 2',
                    'Carry it forward into the Brand Brain',
                  ]}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest font-semibold mb-4">Series Through-Line</p>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 text-sm text-[#FCF4EB]/72 whitespace-pre-wrap">
{`Part 1 - Positioning      Who you speak to and why they choose you
Part 2 - Language         How to say it so the right person feels it
Part 3 - System           AI Brand Brain: Claude works from your clarity`}
                </div>
              </div>

              <div>
                <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest font-semibold mb-4">Key Frameworks Used In Part 1</p>
                <BulletList items={[
                  'Five Levels of Awareness - Eugene Schwartz: Unaware / Problem Aware / Solution Aware / Product Aware / Most Aware',
                  'Competitive Alternative Framework - April Dunford: What would they have done if they had never found you?',
                  'Visible Market vs Mental Market - where features are compared vs where identity decisions are made',
                  'The Specificity Test - Could my three nearest competitors say the same thing?',
                  'Anti-Positioning - naming who you do not serve as a clarifying signal, not an exclusionary one',
                ]} />
              </div>
            </div>

            <div className="rounded-2xl border border-[#7C69C7]/30 bg-[#7C69C7]/[0.08] px-5 py-4">
              <p className="text-[#7C69C7] text-xs uppercase tracking-widest font-semibold mb-2">One Output</p>
              <p className="text-[#FCF4EB]/78 leading-relaxed">
                A written positioning statement that passes the specificity test.
              </p>
            </div>
          </div>
        </Section>

        <Section id="before-you-start" number="2" label="Before You Start" title="Get Your Messaging Ready">
          <div className="space-y-4">
            <p className="text-[#FCF4EB]/68 leading-relaxed">
              Two short tasks before the session. They take less than ten minutes total and will make the opening exercise much more meaningful.
            </p>
            <p className="text-[#FCF4EB]/68 leading-relaxed">
              No special tools needed. Just your current messaging and five minutes with Claude.
            </p>
          </div>

          <div id="task-gather-current-messaging">
          <StepCard number={3} title="Gather your current messaging">
            <p>At the start of the session, we run the AI Description Test on your existing materials. Have them ready before you arrive.</p>
            <p>Gather one of the following:</p>
            <BulletList items={[
              'Your website homepage headline and subheadline',
              'Your LinkedIn bio or About section',
              'Your main offer description from your sales page, a proposal, or a recent social post',
            ]} />
            <p>You only need one. The goal is to have your current best attempt at describing what you do somewhere you can paste it quickly.</p>
          </StepCard>
          </div>

          <PromptCard
            title="Edit this first"
            intro="Fill this in yourself first. This is the block you keep open during the workshop."
            prompt={`My source:
[WEBSITE / LINKEDIN / OFFER DESCRIPTION / OTHER]

Paste the text that best describes what I do, who I serve, and what outcome I deliver:
[PASTE HERE]

Where I saved it so I can access it easily during the session:
[WRITE HERE]`}
          />

          <PromptCard
            title="Optional: Let Claude pull the messaging using WebFetch"
            intro="If the source is on the internet, use this so Claude can do the fetching for you."
            prompt={`Using WebFetch, read this live page and extract only the text that best describes what I do, who I serve, and what outcome I deliver.

URL:
[PASTE WEBSITE OR LINKEDIN URL HERE]

Then return:
1. The exact relevant text from the page
2. A shorter cleaned version without navigation or clutter
3. One sentence on what already feels vague or generic

Do not rewrite the messaging yet. I only want the clean baseline text.`}
          />

          <div id="task-run-baseline">
          <StepCard number={4} title="Run the AI Description Test as your baseline">
            <p>Before the session, run the test once so you have a clear before picture. You will run it again at the end of the series.</p>
            <p>Open Claude, paste in your current messaging from Step 1, then send the exact prompt below.</p>
          </StepCard>
          </div>

          <PromptCard
            title="Exact baseline prompt"
            intro="Paste your messaging first, then copy this exact prompt into Claude."
            prompt={`Describe what I do, who I serve, and what makes me different from others in my space. Base your answer only on the text I just gave you.`}
          />

          <PromptCard
            title="Save your baseline notes"
            intro="After Claude responds, fill this in so you have a clear before-state to compare later."
            prompt={`Baseline - [DATE]

What felt flat or generic:
[WRITE HERE]

What details Claude could not see clearly:
[WRITE HERE]

Where I saved the screenshot or copied response:
[WRITE HERE]`}
          />

          <ProTip type="tip">
            The output will probably feel flat or generic. That is normal and expected. You are not testing Claude. You are capturing a baseline so you can see how far your positioning has moved by the end of the series.
          </ProTip>

          <ProTip type="warning">
            Do not adjust your messaging before the session. The baseline needs to reflect where you are right now.
          </ProTip>
        </Section>

        <Section id="live-guide" number="5" label="Part 1" title="The AI Era and Where You Stand">
          <div className="space-y-4">
            <p className="text-[#FCF4EB]/68 leading-relaxed">
              We are going to slow down and go deep on the two things that everything else in this series depends on:
              who you are actually speaking to, and why they would choose you over every other option they are actually considering.
              By the end of today, you will have a positioning statement, an awareness map of your ideal client, and a clear picture of how those two things connect to your lead generation.
            </p>
          </div>

          <PromptCard
            title="Operator Prompt - Claude Dangerous Skip Permissions"
            intro="Keep this at the top so the workshop can still run as an execution surface in Claude Code."
            prompt={`Open Claude Code in the correct project folder for this workshop and use Dangerously Skip Permissions for the session.

Rules:
1. Confirm the project folder before making any edits.
2. Stay inside the intended project scope.
3. Keep going until each requested step is complete unless you hit a real blocker.
4. Tell me clearly if something is missing before you proceed.`}
          />

          <TeachingCard id="step-opening-question" step="6" eyebrow="Opening: The AI Era" title="The Opening Question and AI Description Test">
            <p>The facilitator opens with:</p>
            <blockquote className="border-l-2 border-[#7C69C7]/50 pl-4 italic text-[#FCF4EB]/75">
              Raise your hand if you have ever asked AI to write marketing copy and the result sounded technically correct but somehow completely generic.
            </blockquote>
            <p>Then immediately: open Claude and paste in the messaging you gathered during prep.</p>
            <p>Send the prompt below. Read the output.</p>
            <p className="text-[#FCF4EB] font-semibold">The gap between that and how you would describe yourself is what this series is about.</p>
          </TeachingCard>

          <PromptCard
            title="Claude Prompt - The AI Description Test"
            prompt={`Use only the messaging below.

Messaging:
[PASTE CURRENT MESSAGING HERE]

Describe:
1. What I do
2. Who I serve
3. What makes me different from others in my space

Base your answer only on the text I just gave you.`}
          />

          <TeachingCard id="step-three-shifts" step="7" title="The Three Shifts and Two Markets">
            <p>The facilitator will walk through:</p>
            <div>
              <p className="text-[#FCF4EB] font-semibold mb-2">Three things that changed:</p>
              <ol className="space-y-2 list-decimal pl-5">
                <li>Content is now infinite. Volume is no longer a competitive advantage.</li>
                <li>Automation is now normal. Systems stop being differentiation when everyone has them.</li>
                <li>Human resonance is now rare. Specific, intentional brands are the real advantage.</li>
              </ol>
            </div>
            <div>
              <p className="text-[#FCF4EB] font-semibold mb-2">Two markets:</p>
              <p><span className="text-[#FCF4EB] font-semibold">The Visible Market:</span> features, price, specs. Someone always charges less.</p>
              <p><span className="text-[#FCF4EB] font-semibold">The Mental Market:</span> beliefs, identity, meaning. Where devoted clients live.</p>
            </div>
            <blockquote className="border-l-2 border-[#7C69C7]/50 pl-4 italic text-[#FCF4EB]/75">
              Starbucks sells sophistication, not coffee. Nike sells belief in personal greatness, not shoes. None of them lead with specs. They lead with who you become when you buy.
            </blockquote>
            <p><span className="text-[#FCF4EB] font-semibold">Write down:</span> Which market is your current messaging operating in?</p>
          </TeachingCard>

          <PromptCard
            title="Claude Prompt - The Three Shifts and Two Markets"
            intro="Fill in your answer first, then let Claude help you sharpen the explanation."
            prompt={`Step 2 - The Three Shifts and Two Markets

The three shifts:
1. Content is now infinite - volume is no longer a competitive advantage
2. Automation is now normal - systems stop being differentiation when everyone has them
3. Human resonance is now rare - specific, intentional brands are the real advantage

The two markets:
- Visible Market: features, price, specs. Someone always charges less.
- Mental Market: beliefs, identity, meaning. Where devoted clients live.

My current messaging:
[PASTE HERE]

Write down:
Which market is my current messaging operating in?
[WRITE HERE]

Then help me explain why in plain language.`}
          />

          <div className="rounded-[24px] border border-white/[0.08] bg-black/10 p-6">
            <p className="text-[#FCF4EB] font-semibold mb-3">Room Discussion - 3 minutes</p>
            <BulletList items={[
              'Which market is your current messaging in, and how do you know?',
              'Anyone want to share what came up?',
            ]} />
          </div>

          <TeachingCard id="step-through-line" step="8" title="The Full Through-Line">
            <p>Before moving into Part A, the facilitator will establish the thread that runs through all three sessions:</p>
            <p><span className="text-[#FCF4EB] font-semibold">Positioning is not just messaging.</span> Clear positioning tells you:</p>
            <BulletList items={[
              'Who to speak to and where to find them',
              'What they need to hear at each stage of their journey',
              'When they are ready to buy',
              'How to make that journey repeatable',
            ]} />
            <div>
              <p className="text-[#FCF4EB] font-semibold mb-2">The series chain:</p>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 text-sm text-[#FCF4EB]/72 whitespace-pre-wrap">
{`Positioning -> Language -> Leads -> System`}
              </div>
            </div>
            <p>Part 1 builds the positioning. Part 2 translates it into language. Part 3 turns it into a system that lives in Claude.</p>
            <p><span className="text-[#FCF4EB] font-semibold">Write down:</span> Where in that chain is your business currently strongest? Where is the gap?</p>
          </TeachingCard>

          <PromptCard
            title="Claude Prompt - The Full Through-Line"
            prompt={`Positioning is not just messaging.

Clear positioning tells you:
- Who to speak to and where to find them
- What they need to hear at each stage of their journey
- When they are ready to buy
- How to make that journey repeatable

The series chain is:
Positioning -> Language -> Leads -> System

Write down:
Where in that chain is my business currently strongest?
[WRITE HERE]

Where is the gap?
[WRITE HERE]

Then help me summarize the real bottleneck in one sentence.`}
          />

          <TeachingCard id="step-awareness" step="9" eyebrow="Part A: The Client&apos;s Journey" title="The Five Levels of Awareness">
            <p>Your dream client is somewhere on this map right now.</p>
                <div className="rounded-[28px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(124,105,199,0.10),rgba(245,195,198,0.06),rgba(255,255,255,0.02))] p-6 md:p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-[#F5C3C6] text-xs uppercase tracking-[0.22em] font-semibold mb-2">Awareness Map</p>
                    <p className="text-[#FCF4EB]/72 leading-relaxed max-w-2xl">
                      The goal is not to sound smart about the stages. The goal is to see the moment they are actually in when they find you.
                    </p>
                  </div>
                  <p className="text-sm text-[#FCF4EB]/45">From hidden problem to buying decision</p>
                </div>

                <div className="space-y-3">
                {[
                  ['1', 'Unaware', 'This is just how business works.'],
                  ['2', 'Problem Aware', "Something isn't working but I don't know what."],
                  ['3', 'Solution Aware', 'I need better positioning / systems / clarity.'],
                  ['4', 'Product Aware', "I've seen this offer. Not sure yet."],
                  ['5', 'Most Aware', "I'm ready. Who do I hire?"],
                ].map(([level, state, thought]) => (
                    <div
                      key={level}
                      className="rounded-[24px] p-5 border shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                      style={{
                        background: level === '5'
                          ? 'linear-gradient(135deg, rgba(245, 195, 198, 0.12) 0%, rgba(124, 105, 199, 0.10) 100%)'
                          : 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                        borderColor: level === '5' ? 'rgba(245, 195, 198, 0.22)' : 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className="number-glow w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{
                            background: 'rgba(124, 105, 199, 0.18)',
                            color: '#9D8FE0',
                            border: '1.5px solid rgba(124, 105, 199, 0.30)',
                          }}
                        >
                          {level}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1 mb-3 md:flex-row md:items-center md:justify-between">
                            <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#FCF4EB]/35">Level {level}</span>
                            <p className="text-[#FCF4EB] font-semibold text-base">{state}</p>
                          </div>
                          <p className="text-sm text-[#FCF4EB]/65 leading-relaxed mb-4">&ldquo;{thought}&rdquo;</p>
                          <div className="h-px w-full bg-white/[0.06] mb-4" />
                          <p className="text-[11px] uppercase tracking-[0.18em] text-[#FCF4EB]/28">
                            {level === '1' && 'No urgency yet'}
                            {level === '2' && 'Feels friction'}
                            {level === '3' && 'Wants a path'}
                            {level === '4' && 'Comparing options'}
                            {level === '5' && 'Ready to decide'}
                          </p>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
            <p><span className="text-[#FCF4EB] font-semibold">The strategic insight:</span> Most businesses try to sell to Level 5. Most of their audience is at Level 2 or 3. That is why content does not convert. The message does not match the moment.</p>
            <p>The most valuable clients, the loyal long-term ones, are built at Levels 2 and 3. When you help someone understand their problem and then their options, they trust you deeply by the time they are ready to buy.</p>
            <p><span className="text-[#FCF4EB] font-semibold">Write down:</span> Which level is most of your audience at when they first encounter your content?</p>
          </TeachingCard>

          <PromptCard
            title="Claude Prompt - Awareness"
            prompt={`Most businesses try to sell to Level 5.
Most of their audience is at Level 2 or 3.
That is why content does not convert: the message does not match the moment.

Write down:
Which level is most of my audience at when they first encounter my content?
[WRITE HERE]

Then help me explain what that means for the kind of content I should be making.`}
          />

          <TeachingCard id="step-behaviour" step="10" title="Client Behaviour Becomes Predictable">
            <p>When your positioning is clear and you know exactly which awareness level your client is at when they find you, their behaviour stops being a mystery.</p>
            <div>
              <p className="text-[#FCF4EB] font-semibold mb-2">You will know:</p>
              <BulletList items={[
                'What content they are consuming at Level 2 and what your content should therefore say',
                'What questions they are asking at Level 3 and what formats move them forward',
                'What triggers the decision at Levels 4 and 5 and what proof they need',
                'What objection will appear before they buy and how to address it in advance',
              ]} />
            </div>
            <p className="text-[#FCF4EB] font-semibold">Predictable behaviour = repeatable lead generation.</p>
            <blockquote className="border-l-2 border-[#7C69C7]/50 pl-4 italic text-[#FCF4EB]/75">
              This is not a theoretical payoff. A founder who maps this accurately for their specific client can build a content plan that consistently moves the right people from first encounter to buying decision without reinventing it each month.
            </blockquote>
            <p><span className="text-[#FCF4EB] font-semibold">Write down:</span> What does your ideal client typically do or search for just before they find you? What level is that?</p>
          </TeachingCard>

          <PromptCard
            title="Claude Prompt - Client Behaviour Becomes Predictable"
            prompt={`When positioning is clear and I know exactly which awareness level my client is at when they find me, their behaviour stops being a mystery.

Write down:
What does my ideal client typically do or search for just before they find me?
[WRITE HERE]

What level is that?
[WRITE HERE]

Then help me turn that into a simple lead-generation insight.`}
          />

          <TeachingCard id="step-client-moment" step="11" title="Exercise: The Client's Moment">
            <p>Four minutes. Write answers to these four questions.</p>
            <p>Think of a specific real client, your best-ever client, not an imagined ideal.</p>
          </TeachingCard>

          <PromptCard
            title="Claude Prompt - Exercise: The Client's Moment"
            intro="Think of a specific real client - your best-ever client, not an imagined ideal."
            prompt={`1. What situation were they in when they first found you?
[WRITE HERE]

2. What was the moment that made them realise they needed to change?
[WRITE HERE]

3. What had they already tried that had not worked?
[WRITE HERE]

4. Which awareness level were they at when they first encountered your content?
[WRITE HERE]

Now help me tighten these answers without changing the truth.`}
          />

          <ProTip type="tip">
            The more specific and honest your answers, the more useful this exercise becomes. Do not describe an ideal person. Describe a real one.
          </ProTip>

          <div className="rounded-[24px] border border-white/[0.08] bg-black/10 p-6">
            <p className="text-[#FCF4EB] font-semibold mb-3">Room Discussion - 8 minutes</p>
            <BulletList items={[
              'Who wants to share what they wrote about their best-ever client?',
              'Which awareness level surprised you?',
              'Is most of your content speaking to the wrong stage, and what would the right-stage content look like?',
            ]} />
          </div>

          <TeachingCard id="step-positioning-foundation" step="12" eyebrow="Part B: Where You Sit in the Market" title="The Positioning Foundation">
            <p>Positioning is not branding. Not design. Not visual identity.</p>
            <p>Positioning is the role your business plays in the mind of your specific client.</p>
            <p><span className="text-[#FCF4EB] font-semibold">It answers one question:</span></p>
            <p className="text-[#FCF4EB] font-semibold">Why you, instead of what they would have done otherwise?</p>
            <div>
              <p className="text-[#FCF4EB] font-semibold mb-2">Two things to know before the main exercise:</p>
              <p><span className="text-[#FCF4EB] font-semibold">Positioning shapes the entire business</span>, not just marketing. It shapes product design, pricing strategy, profit margins, and distribution.</p>
              <p><span className="text-[#FCF4EB] font-semibold">The real competition is rarely another provider.</span> It is usually: kept doing it themselves, hired a VA, bought a course and done nothing with it, or stayed stuck.</p>
            </div>
          </TeachingCard>

          <PromptCard
            title="Claude Prompt - The Competitive Alternative Framework"
            prompt={`I want to clarify my positioning using the competitive alternative framework.

Here is what I offer:
[DESCRIBE YOUR OFFER]

Here is the kind of client I serve:
[DESCRIBE THE CLIENT]

Tell me:
1. What this client would most likely have done if they had never found me
2. Why that alternative feels attractive at first
3. What that alternative cannot provide that I can
4. Which of those differences is strongest for positioning

Be honest and realistic.
Do not default to "they would have hired a competitor" unless that is truly the most likely answer.`}
          />

          <TeachingCard id="step-ferrari" step="13" title="Ferrari vs Toyota: What Positioning Actually Does to a Business">
            <p>The facilitator will use the Toyota and Ferrari contrast:</p>
            <p>Toyota and Ferrari both make cars. Same function. Entirely different positioning.</p>
            <p><span className="text-[#FCF4EB] font-semibold">Toyota:</span> reliable, practical, accessible. Buyers compare features, mileage, resale value.</p>
            <p><span className="text-[#FCF4EB] font-semibold">Ferrari:</span> aspiration, identity, exclusivity. Buyers do not compare. They desire.</p>
            <p><span className="text-[#FCF4EB] font-semibold">The most important detail:</span> Ferrari deliberately limits production. They could triple revenue. They choose not to because scarcity is part of the positioning.</p>
            <blockquote className="border-l-2 border-[#7C69C7]/50 pl-4 italic text-[#FCF4EB]/75">
              You do not need two hundred clients. You need twenty right ones. The pricing, the access, the qualification process, all of it can signal Ferrari-level positioning if the clarity is there underneath it.
            </blockquote>
            <div>
              <p className="text-[#FCF4EB] font-semibold mb-2">The high-ticket positioning principle:</p>
              <p>Nobody pays £10,000 for six modules and weekly calls.</p>
              <BulletList items={[
                'Certainty the outcome will happen',
                'Proximity to the person who has the answer',
                'The identity of someone who invests at this level',
              ]} />
            </div>
            <p><span className="text-[#FCF4EB] font-semibold">Premium pricing is a Mental Market decision.</span> If your positioning is in the Visible Market, your sales conversations will always be hard.</p>
            <p><span className="text-[#FCF4EB] font-semibold">Write down:</span> Are your sales conversations hard or easy? What market is your current offer positioned in?</p>
          </TeachingCard>

          <PromptCard
            title="Claude Prompt - Ferrari vs Toyota"
            prompt={`Toyota and Ferrari both make cars. Same function. Entirely different positioning.

Toyota:
- reliable
- practical
- accessible

Ferrari:
- aspiration
- identity
- exclusivity

Write down:
Are my sales conversations hard or easy?
[WRITE HERE]

What market is my current offer positioned in?
[WRITE HERE]

Then help me explain what that tells me.`}
          />

            <div className="rounded-[24px] border border-white/[0.08] bg-black/10 p-6">
              <p className="text-[#FCF4EB] font-semibold mb-3">Quick Check-In - 2 minutes</p>
              <BulletList items={['Hard or easy? And what does that tell you?']} />
            </div>

          <TeachingCard id="step-common-enemy" step="14" title="The Common Enemy">
            <p>Strong positioning also names what the brand stands against.</p>
            <p>Not just who it serves. What it opposes.</p>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 text-sm text-[#FCF4EB]/72 whitespace-pre-wrap">
{`Apple opposed corporate conformity.
Liquid Death opposed plastic wellness culture.
CrossFit opposed complacency.`}
            </div>
            <p>The enemy does not have to be a competitor. It can be a behaviour, an institution, or a belief that is accepted as normal but that your ideal client is already frustrated by.</p>
            <p><span className="text-[#FCF4EB] font-semibold">Write down:</span> What is the dominant approach in your industry that you believe is wrong or incomplete?</p>
          </TeachingCard>

          <PromptCard
            title="Claude Prompt - The Common Enemy"
            prompt={`Strong positioning also names what the brand stands against.

Examples:
Apple opposed corporate conformity.
Liquid Death opposed plastic wellness culture.
CrossFit opposed complacency.

Write down:
What is the dominant approach in my industry that I believe is wrong or incomplete?
[WRITE HERE]

Then help me sharpen that into one sentence.`}
          />

            <div className="rounded-[24px] border border-white/[0.08] bg-black/10 p-6">
              <p className="text-[#FCF4EB] font-semibold mb-3">Quick Share - 2 minutes</p>
              <BulletList items={['Who knows what they stand against? Say it in one sentence.']} />
            </div>

          <TeachingCard id="step-positioning-statement" step="15" title="Exercise: The Positioning Statement">
            <p>Six minutes. This is the most important writing of the session.</p>
            <p>Use this framework:</p>
            <FrameworkBlock
              lines={[
                'For [specific type of person]',
                'who is currently [specific situation],',
                '',
                'I help them [specific outcome]',
                '',
                'by [specific method or approach]',
                '',
                'that [real competitive alternative] cannot provide.',
              ]}
            />
            <p>Write a first draft. Then apply the specificity test:</p>
            <p className="text-[#FCF4EB] font-semibold">Could my three nearest competitors say the same thing?</p>
            <p>If yes: not positioned. Make one element more specific. Then another. Keep going until the answer is no.</p>
            <p><span className="text-[#FCF4EB] font-semibold">Note:</span> The first version will be too broad. That is completely normal. The goal today is movement, from vague to noticeably more specific.</p>
          </TeachingCard>

          <PromptCard
            title="Claude Prompt - Exercise: The Positioning Statement"
            prompt={`Use this framework:

For [specific type of person]
who is currently [specific situation],

I help them [specific outcome]

by [specific method or approach]

that [real competitive alternative] cannot provide.

My notes:
- Person: [WRITE HERE]
- Situation: [WRITE HERE]
- Outcome: [WRITE HERE]
- Method: [WRITE HERE]
- Competitive alternative: [WRITE HERE]

Then give me:
1. A first draft
2. A sharper version
3. The one line most likely to still be too broad

Assume the first version is too broad and help me move it toward specificity, not perfection.`}
          />

            <PromptCard
              title="Claude Prompt - The Specificity Test"
              prompt={`Test this positioning statement for specificity.

Statement:
[PASTE POSITIONING STATEMENT HERE]

Evaluate it against these questions:
1. Could my three nearest competitors say this word for word?
2. Does this describe a specific person in a specific situation, or just a category?
3. Is the outcome a felt outcome, or just a feature someone would compare?

Then tell me:
4. Which part is still too broad
5. What the felt outcome is underneath the feature language

Then rewrite it once to make it more specific without making it longer.`}
            />

            <div className="rounded-[24px] border border-white/[0.08] bg-black/10 p-6">
              <p className="text-[#FCF4EB] font-semibold mb-3">Room Discussion - 10 minutes</p>
              <BulletList items={[
                'Who wants to share their positioning statement and get feedback from the room?',
                'Where did the specificity test reveal vagueness you had not noticed before?',
                'What would make it more specific? Which part is still a category rather than a person?',
              ]} />
            </div>

          <TeachingCard id="step-anti-positioning" step="16" title="Anti-Positioning">
            <p>Before we close, complete this one additional sentence:</p>
            <FrameworkBlock
              lines={[
                'This offer is not for [type of person]',
                'who wants [outcome you do not deliver].',
              ]}
            />
            <p>This is not exclusionary. It is clarifying. It signals that you know your client well enough to know who you cannot help. And it makes everything else more specific.</p>
          </TeachingCard>

          <PromptCard
            title="Claude Prompt - Anti-Positioning"
            prompt={`Complete this sentence:

"This offer is not for [type of person] who wants [outcome I do not deliver]."

My first version:
[WRITE HERE]

Then help me improve it without making it harsher than it needs to be.`}
          />

          <TeachingCard id="step-lead-generation" step="17" title="How Positioning Becomes a Lead Generation System">
            <p>The final teaching point before the close:</p>
            <p>Clear positioning answers three questions your content strategy cannot answer without it:</p>
            <ol className="space-y-2 list-decimal pl-5">
              <li>Who specifically am I trying to reach?</li>
              <li>Where are they before they know they need me?</li>
              <li>What do I say to start that relationship?</li>
            </ol>
            <p className="text-[#FCF4EB] font-semibold">Vague positioning produces scattered content. Specific positioning produces a lead generation system.</p>
            <p>The same principle applies to paid. When you know exactly who you serve and what they are thinking before they find you, you can find them before they find you.</p>
            <blockquote className="border-l-2 border-[#7C69C7]/50 pl-4 italic text-[#FCF4EB]/75">
              For high-ticket founders: you do not need high volume. You need high relevance. Ten pieces of content that speak with surgical precision to the right person at Level 2 will outperform a hundred generic posts every time.
            </blockquote>
          </TeachingCard>

          <PromptCard
            title="Claude Prompt - Positioning Becomes a Lead Generation System"
            prompt={`Use my positioning notes below to help me connect positioning to lead generation.

Positioning notes:
[PASTE NOTES HERE]

Answer:
1. Which awareness level is most of my audience at when they first encounter my content?
2. Which awareness level is most of my content currently speaking to?
3. What is the gap between those two?
4. Where does this client spend time before they know they need me?
5. What language are they using to describe the problem in their own words?
6. What one piece of content would make a Level 2 client feel: "this person understands exactly what I'm going through"?

At the end, summarize:
- WHO exactly I am speaking to
- WHERE they are in their journey
- WHY they would choose me instead of what they would have done otherwise`}
          />

          <TeachingCard id="step-chain-forward" step="18" eyebrow="Close" title="The Chain From Today Forward">
            <p>Positioning clarity tells you:</p>
            <BulletList items={[
              'WHO exactly you are speaking to',
              'WHERE they are in their journey',
              'WHY you, and not what they would have done instead',
            ]} />
            <p>Part 2 takes that and builds the language: how to say it so the right person feels it.</p>
            <p>Part 3 takes the language and builds the system: so AI works from your clarity, not the average.</p>
            <p>Each session only works if the previous one is solid. The work you did today is the foundation.</p>
          </TeachingCard>

          <TeachingCard id="step-before-part-2" step="19" title="Before Part 2">
            <p>Read your positioning statement aloud to someone who knows your work. Ask them:</p>
            <BulletList items={[
              'Does this sound like you?',
              'Does it sound specific?',
              'Would your best client recognise themselves?',
            ]} />
            <p>Refine it once. Bring the refined version to Part 2.</p>
            <p><span className="text-[#FCF4EB] font-semibold">What Part 2 covers:</span> Taking your positioning statement and turning it into outcome language, how to describe what you do so the right person immediately feels the value. Visible Market versus Mental Market in practice. The So What Chain. The Hormozi Value Equation.</p>
            <p><span className="text-[#FCF4EB] font-semibold">After the session:</span> Save your positioning statement somewhere you can find it. You will use it in Part 2 and it becomes Section 4 of your Brand Brain in Part 3.</p>
          </TeachingCard>
        </Section>

        <Section id="positioning-builder" number="20" label="Part 1 Workbook" title="Positioning Statement Builder">
          <div className="space-y-4">
            <p className="text-[#FCF4EB]/68 leading-relaxed">
              Use this during the session to write and refine your first-draft positioning statement. Save it, refine it before Part 2, and bring the updated version back. It becomes Section 4 of your Brand Brain.
            </p>
            <div className="rounded-2xl border border-[#F5C3C6]/25 bg-[linear-gradient(135deg,rgba(245,195,198,0.12),rgba(124,105,199,0.08))] p-6">
              <p className="text-[#F5C3C6] text-xs uppercase tracking-widest font-semibold mb-3">Disclaimer</p>
              <p className="text-[#FCF4EB]/78 leading-relaxed">
                Your first draft will be too broad. That is completely normal and expected. The goal today is not a perfect statement. It is a statement that is noticeably more specific than what you had when you walked in. You will refine it between sessions.
              </p>
            </div>
          </div>

          <PromptCard
            id="workbook-foundation"
            number="21"
            title="Before You Write: The Foundation"
            intro="Answer these questions first. They are the raw material for your positioning statement."
            filename="Editable worksheet"
            prompt={`Your best-ever client's situation:
What situation were they in when they first found you?
What had they already tried that had not worked?
What was the moment that made them realise they needed to change?

[Write here]

The real competitive alternative:
What would that client have done if they had never found you?
Be honest. Not "hired a competitor." What they would ACTUALLY have done.

[Write here]

What you offer that the alternative cannot:
[Write here]

Who cares most intensely about that:
[Write here]

What you stand against:
[Write here]

Who you do not serve:
This offer is not for [type of person] who wants [outcome you do not deliver].

[Write here]`}
          />

          <PromptCard
            id="workbook-statement"
            number="22"
            title="Write Your Positioning Statement"
            filename="Editable worksheet"
            prompt={`Use the framework. Fill in all five parts.

For [specific type of person]
who is currently [specific situation],

I help them [specific outcome]

by [specific method or approach]

that [real competitive alternative] cannot provide.

Your first draft:

For _______________________________________________

who is currently ___________________________________

I help them ________________________________________

by _________________________________________________

that _______________________________________________ cannot provide.`}
          />

          <PromptCard
            id="workbook-specificity"
            number="23"
            title="The Specificity Test"
            filename="Editable worksheet"
            prompt={`Question 1:
Could your three nearest competitors say this word for word?

Yes / No

If yes - which part is still too broad?
___________________________________________________

Question 2:
Does this describe a specific person in a specific situation, or a category of people?

Specific person / Category

What would make it more specific?
___________________________________________________

Question 3:
Does the outcome describe something someone actually wants to feel, or a feature they would compare?

Felt outcome / Feature

What is the felt outcome underneath the feature you wrote?
___________________________________________________`}
          />

          <PromptCard
            id="workbook-refined"
            number="24"
            title="Your Refined Draft"
            filename="Editable worksheet"
            prompt={`After applying the specificity test, write a refined version:

For _______________________________________________

who is currently ___________________________________

I help them ________________________________________

by _________________________________________________

that _______________________________________________ cannot provide.`}
          />

          <PromptCard
            id="workbook-awareness"
            number="25"
            title="The Awareness Check"
            filename="Editable worksheet"
            prompt={`Which awareness level is most of your current audience at when they first encounter your content?

Level 1 - Unaware
Level 2 - Problem Aware
Level 3 - Solution Aware
Level 4 - Product Aware
Level 5 - Most Aware

My answer:
[Write here]

Which awareness level is most of your content currently speaking to?

Level 1 - Unaware
Level 2 - Problem Aware
Level 3 - Solution Aware
Level 4 - Product Aware
Level 5 - Most Aware

My answer:
[Write here]

If those two answers are different, that is your content strategy gap.

What would one piece of content for the right awareness level look like?
[Write a rough idea here]`}
          />

          <PromptCard
            id="workbook-lead-generation"
            number="26"
            title="Positioning to Lead Generation"
            filename="Editable worksheet"
            prompt={`Where does your ideal client spend time before they know they need you?
[Write here]

What are they searching for in words they would actually use?
[Write here]

What content could you create that would make a Level 2 client feel: "this person understands exactly what I'm going through"?
[Write here]

Visible Market or Mental Market?

Visible Market - I lead with features, deliverables, what is included
Mental Market - I lead with identity, transformation, who they become

My current lead gen is mostly:
[Write here]

What one change would shift it toward the Mental Market?
[Write here]`}
          />

          <PromptCard
            id="workbook-part-2"
            number="27"
            title="Between Now and Part 2"
            filename="Editable worksheet"
            prompt={`Before Part 2, do this once:

Read your refined positioning statement aloud to one person who knows your work.

Ask them:
1. Does this sound like me?
2. Does it sound specific, like it was written for one person?
3. Would my best client recognise themselves in this?

Based on their answers, make one more refinement.

Bring that version to Part 2.

My one more refinement:
[Write here]`}
          />
        </Section>
      </div>
    </div>
  )
}
