import ProTip from '@/components/ProTip'
import StepCard from '@/components/StepCard'

function DiscussionBlock({ title, prompts }: { title: string; prompts: string[] }) {
  return (
    <div className="rounded-2xl border border-[#F5C3C6]/20 bg-[#F5C3C6]/[0.06] px-6 py-5">
      <p className="text-xs uppercase tracking-widest font-semibold text-[#F5C3C6] mb-3">{title}</p>
      <ul className="space-y-2 text-sm text-[#FCF4EB]/70 leading-relaxed">
        {prompts.map((prompt) => (
          <li key={prompt}>- {prompt}</li>
        ))}
      </ul>
    </div>
  )
}

function WritePrompt({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4">
      <p className="text-xs uppercase tracking-widest font-semibold text-[#FCF4EB]/45 mb-2">Write Down</p>
      <div className="text-sm text-[#FCF4EB]/70 leading-relaxed">{children}</div>
    </div>
  )
}

export default function Session10GuidePart1() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-14">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Session 10 - Part 1 of 3
        </p>
        <h1 className="gradient-text text-5xl font-extrabold leading-tight mb-5 pb-1">
          The AI Era and Where You Stand
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-8">
          We are going to slow down and go deep on the two things that everything else in this series depends on:
          who you are actually speaking to, and why they would choose you over every other option they are actually considering.
          By the end of today, you will have a positioning statement, an awareness map of your ideal client, and a clear picture
          of how those two things connect to your lead generation.
        </p>

        <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 mb-8">
          <span className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Duration 90-100 minutes
          </span>
          <span className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 14l3-9 4 6 2-3 3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Teaching, exercises, and integrated discussion
          </span>
        </div>

        <details className="rounded-2xl overflow-hidden border border-white/[0.10] bg-[linear-gradient(145deg,rgba(124,105,199,0.07),rgba(255,255,255,0.03))] shadow-[0_8px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.07)]">
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
          <ol className="px-6 py-5 space-y-3">
            {[
              { href: '#opening', label: 'Opening - The AI Era' },
              { href: '#part-a', label: "Part A - The Client's Journey" },
              { href: '#part-b', label: 'Part B - Where You Sit in the Market' },
              { href: '#close', label: 'Close - The Chain Forward' },
            ].map(({ href, label }, i) => (
              <li key={href} className="flex items-center gap-3">
                <span className="number-glow flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'rgba(124,105,199,0.18)', color: '#9D8FE0', border: '1.5px solid rgba(124,105,199,0.30)' }}>
                  {i + 1}
                </span>
                <a href={href} className="text-[#FCF4EB]/58 hover:text-[#9D8FE0] text-sm transition-colors">{label}</a>
              </li>
            ))}
          </ol>
        </details>
      </div>

      <section id="opening" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Opening</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">The AI Era</h2>
        </div>

        <StepCard number={1} title="The opening question and AI Description Test">
          <p>The facilitator opens with:</p>
          <blockquote className="border-l-2 border-[#7C69C7]/50 pl-4 italic text-[#FCF4EB]/75">
            Raise your hand if you have ever asked AI to write marketing copy and the result sounded technically correct but somehow completely generic.
          </blockquote>
          <p>Then immediately ask participants to open Claude, paste in the messaging they gathered during prep, and send this prompt:</p>
          <div className="bg-black/30 border border-white/[0.08] rounded-xl px-5 py-4 font-mono text-sm text-[#FCF4EB]/80 whitespace-pre-wrap">
            Describe what I do, who I serve, and what makes me different from others in my space. Base your answer only on the text I just gave you.
          </div>
          <p>Have them read the output, then anchor the point:</p>
          <p className="text-[#FCF4EB] font-semibold">The gap between that output and how they would describe themselves is what this series is about.</p>
        </StepCard>

        <StepCard number={2} title="The three shifts and two markets">
          <p>The facilitator walks through three changes in the market:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Content is now infinite. Volume is no longer a competitive advantage.</li>
            <li>Automation is now normal. Systems stop being differentiation when everyone has them.</li>
            <li>Human resonance is now rare. Specific, intentional brands are the real advantage.</li>
          </ol>
          <p className="mt-4">Then contrast the two markets:</p>
          <ul className="space-y-2">
            <li><span className="text-[#FCF4EB] font-semibold">Visible Market:</span> features, price, specs. Someone always charges less.</li>
            <li><span className="text-[#FCF4EB] font-semibold">Mental Market:</span> beliefs, identity, meaning. This is where devoted clients live.</li>
          </ul>
          <ProTip type="info">
            Starbucks sells sophistication, not coffee. Nike sells belief in personal greatness, not shoes. The point is who you become when you buy.
          </ProTip>
          <WritePrompt>Which market is your current messaging operating in?</WritePrompt>
        </StepCard>

        <DiscussionBlock
          title="Room Discussion - 3 minutes"
          prompts={[
            'Which market is your current messaging in, and how do you know?',
            'Anyone want to share what came up?',
          ]}
        />

        <StepCard number={3} title="The full through-line">
          <p>Before moving into Part A, establish the thread that runs through all three sessions.</p>
          <p><span className="text-[#FCF4EB] font-semibold">Positioning is not just messaging.</span> Clear positioning tells you:</p>
          <ul className="space-y-2">
            <li>Who to speak to and where to find them</li>
            <li>What they need to hear at each stage of their journey</li>
            <li>When they are ready to buy</li>
            <li>How to make that journey repeatable</li>
          </ul>
          <div className="rounded-xl border border-[#7C69C7]/30 bg-[#7C69C7]/[0.08] px-5 py-4 text-center text-[#FCF4EB] font-semibold">
            Positioning -&gt; Language -&gt; Leads -&gt; System
          </div>
          <p>Part 1 builds the positioning. Part 2 translates it into language. Part 3 turns it into a system that lives in Claude.</p>
          <WritePrompt>Where in that chain is your business currently strongest? Where is the gap?</WritePrompt>
        </StepCard>
      </section>

      <section id="part-a" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part A</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">The Client&apos;s Journey</h2>
        </div>

        <StepCard number={4} title="The five levels of awareness">
          <p>Your dream client is somewhere on this map right now.</p>
          <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.03]">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-white/[0.08] text-[#FCF4EB]/55">
                <tr>
                  <th className="px-4 py-3 font-medium">Level</th>
                  <th className="px-4 py-3 font-medium">State</th>
                  <th className="px-4 py-3 font-medium">What They Are Thinking</th>
                </tr>
              </thead>
              <tbody className="text-[#FCF4EB]/70">
                {[
                  ['1', 'Unaware', 'This is just how business works.'],
                  ['2', 'Problem Aware', 'Something is not working but I do not know what.'],
                  ['3', 'Solution Aware', 'I need better positioning, systems, or clarity.'],
                  ['4', 'Product Aware', "I've seen this offer. Not sure yet."],
                  ['5', 'Most Aware', "I'm ready. Who do I hire?"],
                ].map(([level, state, thought]) => (
                  <tr key={level} className="border-t border-white/[0.06]">
                    <td className="px-4 py-3">{level}</td>
                    <td className="px-4 py-3">{state}</td>
                    <td className="px-4 py-3">{thought}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">Most businesses try to sell to Level 5. Most of their audience is at Level 2 or 3. That is why content does not convert: the message does not match the moment.</p>
          <p>The most valuable clients are built at Levels 2 and 3, where trust forms before they are ready to buy.</p>
          <WritePrompt>Which level is most of your audience at when they first encounter your content?</WritePrompt>
        </StepCard>

        <StepCard number={5} title="Client behaviour becomes predictable">
          <p>When your positioning is clear and you know exactly which awareness level your client is at when they find you, their behaviour stops being a mystery.</p>
          <ul className="space-y-2">
            <li>What content they are consuming at Level 2, and what your content should therefore say</li>
            <li>What questions they are asking at Level 3, and which formats move them forward</li>
            <li>What triggers the decision at Levels 4 and 5, and what proof they need</li>
            <li>What objection appears before they buy, and how to address it in advance</li>
          </ul>
          <ProTip type="tip">
            Predictable behaviour equals repeatable lead generation. This is not theoretical. It is a planning advantage.
          </ProTip>
          <WritePrompt>What does your ideal client typically do or search for just before they find you? What level is that?</WritePrompt>
        </StepCard>

        <StepCard number={6} title="Exercise: the client's moment">
          <p>Four minutes. Ask participants to think of a specific real client, their best-ever client, not an imagined ideal.</p>
          <div className="bg-black/25 border border-white/[0.08] rounded-xl px-5 py-4 whitespace-pre-wrap text-sm text-[#FCF4EB]/80">
{`1. What situation were they in when they first found you?

2. What was the moment that made them realise they needed to change?

3. What had they already tried that had not worked?

4. Which awareness level were they at when they first encountered your content?`}
          </div>
          <ProTip type="info">
            The more specific and honest the answers, the more useful the exercise becomes. Do not describe an ideal person. Describe a real one.
          </ProTip>
        </StepCard>

        <DiscussionBlock
          title="Room Discussion - 8 minutes"
          prompts={[
            'Who wants to share what they wrote about their best-ever client?',
            'Which awareness level surprised you?',
            'Is most of your content speaking to the wrong stage, and what would the right-stage content look like?',
          ]}
        />
      </section>

      <section id="part-b" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part B</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Where You Sit in the Market</h2>
        </div>

        <StepCard number={7} title="The positioning foundation">
          <p>Positioning is not branding, design, or visual identity. Positioning is the role your business plays in the mind of your specific client.</p>
          <p className="text-[#FCF4EB] font-semibold">It answers one question: why you, instead of what they would have done otherwise?</p>
          <p>Two things to establish before the exercise:</p>
          <ul className="space-y-2">
            <li>Positioning shapes product design, pricing strategy, profit margins, and distribution, not just marketing.</li>
            <li>The real competition is rarely another provider. It is usually doing it themselves, hiring a VA, buying a course and doing nothing with it, or staying stuck.</li>
          </ul>
        </StepCard>

        <StepCard number={8} title="Ferrari vs Toyota: what positioning actually does to a business">
          <p>Toyota and Ferrari both make cars. Same function. Entirely different positioning.</p>
          <ul className="space-y-2">
            <li><span className="text-[#FCF4EB] font-semibold">Toyota:</span> reliable, practical, accessible. Buyers compare features, mileage, resale value.</li>
            <li><span className="text-[#FCF4EB] font-semibold">Ferrari:</span> aspiration, identity, exclusivity. Buyers do not compare. They desire.</li>
          </ul>
          <p>The crucial detail is scarcity. Ferrari deliberately limits production because if everyone could have one, the desire would diminish.</p>
          <p>For high-ticket founders, the principle is the same: you do not need two hundred clients. You need twenty right ones.</p>
          <ul className="space-y-2">
            <li>People pay for certainty the outcome will happen.</li>
            <li>They pay for proximity to the person who has the answer.</li>
            <li>They pay for the identity of someone who invests at this level.</li>
          </ul>
          <ProTip type="warning">
            Premium pricing is a Mental Market decision. If your positioning stays in the Visible Market, sales conversations stay hard because the buyer only has features to compare.
          </ProTip>
          <WritePrompt>Are your sales conversations hard or easy? What market is your current offer positioned in?</WritePrompt>
        </StepCard>

        <DiscussionBlock
          title="Quick Check-In - 2 minutes"
          prompts={['Hard or easy? And what does that tell you?']}
        />

        <StepCard number={9} title="The common enemy">
          <p>Strong positioning also names what the brand stands against. Not just who it serves. What it opposes.</p>
          <div className="bg-black/25 border border-white/[0.08] rounded-xl px-5 py-4 text-sm text-[#FCF4EB]/80 whitespace-pre-wrap">
{`Apple opposed corporate conformity.
Liquid Death opposed plastic wellness culture.
CrossFit opposed complacency.`}
          </div>
          <p>The enemy does not have to be a competitor. It can be a behaviour, institution, or belief your ideal client is already frustrated by.</p>
          <WritePrompt>What is the dominant approach in your industry that you believe is wrong or incomplete?</WritePrompt>
        </StepCard>

        <DiscussionBlock
          title="Quick Share - 2 minutes"
          prompts={['Who knows what they stand against? Say it in one sentence.']}
        />

        <StepCard number={10} title="Exercise: the positioning statement">
          <p>Six minutes. This is the most important writing of the session.</p>
          <div className="bg-black/25 border border-white/[0.08] rounded-xl px-5 py-4 text-sm text-[#FCF4EB]/80 whitespace-pre-wrap">
{`For [specific type of person]
who is currently [specific situation],

I help them [specific outcome]

by [specific method or approach]

that [real competitive alternative] cannot provide.`}
          </div>
          <p>Then apply the specificity test: <span className="text-[#FCF4EB] font-semibold">Could my three nearest competitors say the same thing?</span></p>
          <p>If yes, make one element more specific. Then another. Keep going until the answer is no.</p>
          <ProTip type="tip">
            The first version will be too broad. That is completely normal. The goal today is movement from vague to noticeably more specific.
          </ProTip>
        </StepCard>

        <DiscussionBlock
          title="Room Discussion - 10 minutes"
          prompts={[
            'Who wants to share their positioning statement and get feedback from the room?',
            'Where did the specificity test reveal vagueness you had not noticed before?',
            'What would make it more specific? Which part is still a category rather than a person?',
          ]}
        />

        <StepCard number={11} title="Anti-positioning">
          <p>Before closing, ask participants to complete one more sentence:</p>
          <div className="bg-black/25 border border-white/[0.08] rounded-xl px-5 py-4 text-sm text-[#FCF4EB]/80 whitespace-pre-wrap">
            This offer is not for [type of person] who wants [outcome you do not deliver].
          </div>
          <p>This is not exclusionary. It is clarifying. It signals that you know your client well enough to know who you cannot help.</p>
        </StepCard>

        <StepCard number={12} title="How positioning becomes a lead generation system">
          <p>Clear positioning answers three questions your content strategy cannot answer without it:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Who specifically am I trying to reach?</li>
            <li>Where are they before they know they need me?</li>
            <li>What do I say to start that relationship?</li>
          </ol>
          <p><span className="text-[#FCF4EB] font-semibold">Vague positioning produces scattered content.</span></p>
          <p><span className="text-[#FCF4EB] font-semibold">Specific positioning produces a lead generation system.</span></p>
          <ProTip type="info">
            For high-ticket founders, you do not need high volume. You need high relevance. Ten precise pieces of content for the right Level 2 person will outperform a hundred generic posts.
          </ProTip>
        </StepCard>
      </section>

      <section id="close">
        <div className="border-t border-white/[0.08] pt-12">
          <h2 className="text-2xl font-bold text-[#FCF4EB] mb-4">The chain from today forward</h2>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-6">
            Positioning clarity tells you who exactly you are speaking to, where they are in their journey, and why they choose you instead of what they would have done otherwise.
          </p>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-6">
            Part 2 takes that and builds the language: how to say it so the right person feels it. Part 3 takes the language and builds the system so AI works from your clarity, not the average.
          </p>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 mb-8">
            <p className="text-[#FCF4EB] font-semibold mb-3">Before Part 2</p>
            <ul className="space-y-2 text-sm text-[#FCF4EB]/70">
              <li>- Read your positioning statement aloud to someone who knows your work.</li>
              <li>- Ask: Does this sound like you?</li>
              <li>- Ask: Does it sound specific?</li>
              <li>- Ask: Would your best client recognise themselves?</li>
              <li>- Refine it once, then bring the refined version to Part 2.</li>
            </ul>
          </div>
          <p className="text-[#FCF4EB]/55 text-sm leading-relaxed">
            Save your positioning statement somewhere you can find it. You will use it in Part 2 and it becomes Section 4 of your Brand Brain in Part 3.
          </p>
        </div>
      </section>
    </div>
  )
}
