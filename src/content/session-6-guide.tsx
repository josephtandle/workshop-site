'use client'

import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'
import StickyVideoPlayer from '@/components/StickyVideoPlayer'

const TOC_PANEL_CLASS =
  'rounded-2xl overflow-hidden border border-white/[0.10] bg-[linear-gradient(145deg,rgba(124,105,199,0.07),rgba(255,255,255,0.03))] shadow-[0_8px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.07)]'

const FEATURE_CARD_CLASS =
  'relative overflow-hidden rounded-[24px] border border-white/[0.10] bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 shadow-[0_16px_42px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.04)]'

export default function Session6Guide() {
  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-16 pb-0">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
            Session Six
          </p>
          <h1 className="gradient-text text-5xl font-extrabold leading-tight mb-5 pb-1">
            Your Voice and Your Daily Hook Feed
          </h1>
          <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-6">
            By the end of this session you will have a voice profile that writes in your actual
            voice, a Hook Writer setup that uses that voice, and a daily agent that emails you
            fresh hook ideas every morning.
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 mb-8">
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Duration ~90 minutes
            </span>
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 14l3-9 4 6 2-3 3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Beginner
            </span>
          </div>

          {/* Table of Contents */}
          <details className={TOC_PANEL_CLASS}>
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
                { href: '#part-a', label: 'Part A: Build Your Voice Profile' },
                { href: '#part-b', label: 'Part B: Model Switching and Background Agents' },
                { href: '#part-c', label: 'Part C: Hook Writer Part 1' },
                { href: '#part-d', label: 'Part D: Your Daily Hook Research Agent' },
              ].map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-[#FCF4EB]/58 hover:text-[#9D8FE0] transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </details>
        </div>
      </div>

    {/* Workshop Recording — sticky video player */}
    <div className="max-w-3xl mx-auto px-6 mb-14">
      <div className="mb-4">
        <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-1">Workshop Recording</p>
        <p className="text-[#FCF4EB]/40 text-sm">Follow along with the live session. Hit play and the video will stick to the top as you scroll.</p>
      </div>
      <StickyVideoPlayer videoId="uhJ6NJxrOxg" title="Session 6 Workshop Recording" />
    </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">

        {/* Always start with dangerously-skip-permissions */}
        <div className={FEATURE_CARD_CLASS + ' mb-10'}>
          <div className="pointer-events-none absolute -right-10 top-[-28px] h-24 w-24 rounded-full bg-[#7C69C7]/10 blur-2xl" />
          <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Always start Claude Code this way</p>
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
            Every time you open Claude Code, use this command instead of just typing <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">claude</span>.
            It skips the permission prompts so you are not clicking through confirmation screens every few seconds.
          </p>
          <CodeBlock filename="Terminal" code={`claude --dangerously-skip-permissions`} />
        </div>

        {/* Part A */}
        <section id="part-a" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part A: Build Your Voice Profile
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Your voice profile is a file that tells Claude exactly how you write. Once it is
            built, every time you run{' '}
            <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">/speak-human --my-voice</code>{' '}
            Claude will rewrite anything in your specific voice, not a generic AI voice.
          </p>

          <StepCard number={1} title="Install the Speak Human skill">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Run this command in your terminal. It downloads and installs the skill in one step:
            </p>
            <CodeBlock
              filename="Terminal"
              code={`claude skill add https://github.com/josephtandle/speak-human`}
            />
            <ProTip type="info">
              You only need to do this once. After it installs,{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">/speak-human</code>{' '}
              will be available in every Claude Code session going forward.
            </ProTip>
          </StepCard>

          <StepCard number={2} title="Point Claude at your writing samples">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Tell Claude where your writing samples are. They can be anywhere — a folder, a few
              files, a Notes export, anything. Paste this and fill in the location:
            </p>
            <CodeBlock
              filename="Paste into Claude Code"
              editable
              code={`I want to build my voice profile. My writing samples are here: [DESCRIBE WHERE YOUR FILES ARE — for example: "a folder called MyVoice on my Desktop" or "three text files in ~/Documents/writing"].

Read those files. These are samples of my actual writing — emails, posts, notes, whatever I gave you. Analyze them and build my voice profile using the speak-human skill.`}
            />
            <ProTip type="tip">
              The more variety the better. Different formats — a casual email, a social post, a
              brain dump — give Claude a fuller picture of how you actually write.
            </ProTip>
          </StepCard>

          <StepCard number={3} title="Open and read your voice profile">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Paste this to have Claude read the file and show it to you right here in the
              session — no external app needed:
            </p>
            <CodeBlock
              filename="Paste into Claude Code"
              code={`Read my voice profile file and show me the full contents here.`}
            />
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4 mb-4">
              Read through it. Does it sound like you? Pay attention to the examples at the
              bottom — if those sentences feel like something you would actually write, the
              profile is working.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              If something is off, tell Claude: &ldquo;The [section] is wrong. Here is what is
              actually true: [correction].&rdquo; It will update the file.
            </p>
          </StepCard>

          <StepCard number={4} title="Test it live">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Paste any bland, AI-sounding text into Claude Code, then run:
            </p>
            <CodeBlock
              filename="Paste into Claude Code"
              code={`Run /speak-human --my-voice on the text above.`}
            />
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
              Compare the before and after. The rewritten version should sound noticeably more
              like you.
            </p>
          </StepCard>
        </section>

        {/* Part B */}
        <section id="part-b" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part B: Model Switching and Background Agents
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Not every task needs the same model. Knowing which one to use saves time and cost.
            Background agents let you run things in parallel so Claude keeps working while you
            do something else.
          </p>

          <StepCard number={5} title="Switch models mid-session">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Type this in Claude Code and a menu appears. Pick the model you want for this session:
            </p>
            <CodeBlock
              filename="Claude Code"
              code={`/model`}
            />
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
              You can switch back and forth at any point mid-conversation. The model you pick
              stays for that session only.
            </p>
          </StepCard>

          <StepCard number={6} title="Know which model to use">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Claude has three tiers. Each one is a different trade-off between speed, cost, and
              intelligence.
            </p>

            <div className="space-y-3 mb-4">
              <div className={FEATURE_CARD_CLASS}>
                <div className="pointer-events-none absolute -right-10 top-[-28px] h-24 w-24 rounded-full bg-[#7C69C7]/10 blur-2xl" />
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#7C69C7]/20 text-[#7C69C7] border border-[#7C69C7]/30">
                    Haiku
                  </span>
                  <span className="text-[#FCF4EB]/50 text-xs">Fast and cheap</span>
                </div>
                <p className="text-[#FCF4EB]/70 text-sm leading-relaxed">
                  Great for background agents doing repetitive work — scanning files, pulling
                  data, running the same task in parallel across many inputs.
                </p>
              </div>

              <div className={FEATURE_CARD_CLASS}>
                <div className="pointer-events-none absolute -right-10 top-[-28px] h-24 w-24 rounded-full bg-[#7C69C7]/10 blur-2xl" />
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#7C69C7]/20 text-[#7C69C7] border border-[#7C69C7]/30">
                    Sonnet
                  </span>
                  <span className="text-[#FCF4EB]/50 text-xs">Fast and capable</span>
                </div>
                <p className="text-[#FCF4EB]/70 text-sm leading-relaxed">
                  A strong balance of speed and reasoning. Good for most writing, editing, and
                  research tasks when you want a quick answer.
                </p>
              </div>

              <div className={FEATURE_CARD_CLASS}>
                <div className="pointer-events-none absolute -right-10 top-[-28px] h-24 w-24 rounded-full bg-[#7C69C7]/10 blur-2xl" />
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#7C69C7]/20 text-[#7C69C7] border border-[#7C69C7]/30">
                    Opus
                  </span>
                  <span className="text-[#FCF4EB]/50 text-xs">Smartest, most capable</span>
                </div>
                <p className="text-[#FCF4EB]/70 text-sm leading-relaxed">
                  The most intelligent model. Use it when the quality of the answer matters most
                  — strategy, complex writing, synthesizing large amounts of information. Worth
                  the extra time.
                </p>
              </div>
            </div>

            <ProTip type="tip">
              A powerful pattern: use Haiku agents to gather and scan, then hand everything to
              Opus to synthesize. You get thoroughness and intelligence without waiting forever.
              That is exactly what you will do in the next step.
            </ProTip>
          </StepCard>

          <StepCard number={7} title="Put agents to work on your brain dump">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Here is a real example that uses both concepts at once. Paste this into Claude Code:
            </p>
            <CodeBlock
              filename="Paste into Claude Code"
              code={`I want you to spin up four background agents using Haiku to read through my brain dump folder. Each agent should cover a different section and pull out the most important themes, ideas, and action items it finds.

Then use Opus as the orchestrating agent to take everything the four Haiku agents found and reorganize it — make the brain dump more structured, cleaner, and easier to navigate than it was before.

My brain dump is at: ~/Desktop/brain_dump_map`}
            />
            <ProTip type="tip">
              This is the Haiku-plus-Opus pattern in action. Four fast agents gather everything
              in parallel. One smart agent synthesizes it. You get a better result than any
              single agent could produce alone, and it runs faster than doing it in one go.
            </ProTip>
          </StepCard>
        </section>

        {/* Part C */}
        <section id="part-c" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part C: Hook Writer Part 1
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Hook Writer is a skill that generates hooks for your Instagram content. It uses your
            voice profile to make them sound like you, not like generic AI output. Part 1 installs
            the skill and gets you generating hooks. Part 2 connects it to live Instagram research.
          </p>

          <StepCard number={8} title="Install Hook Writer">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Open your terminal and run this command:
            </p>
            <CodeBlock
              filename="Terminal"
              code={`curl -fsSL https://raw.githubusercontent.com/josephtandle/ultimate-hooklab-skill/main/install.sh | bash`}
            />
            <ProTip type="info">
              This runs an install script that sets up the skill and all its dependencies. You
              only need to do this once.
            </ProTip>
          </StepCard>

          <StepCard number={9} title="Generate your first hooks">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Paste this into Claude Code and fill in your topic:
            </p>
            <CodeBlock
              filename="Paste into Claude Code"
              editable
              code={`/hooklab [WHAT YOUR CONTENT IS ABOUT, for example: "how I use AI to manage my DMs" or "why most coaches waste time on content"]`}
            />
          </StepCard>

          <StepCard number={10} title="Add your voice profile">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Run this version to get hooks that sound like you:
            </p>
            <CodeBlock
              filename="Paste into Claude Code"
              editable
              code={`/hooklab [YOUR TOPIC] --my-voice`}
            />
            <ProTip type="tip">
              Compare the output with and without{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">--my-voice</code>.
              The difference is usually striking. The{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">--my-voice</code>{' '}
              version pulls directly from the voice profile you built in Part A.
            </ProTip>
          </StepCard>
        </section>

        {/* Part D */}
        <section id="part-d" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part D: Your Daily Hook Research Agent
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Part 2 of Hook Writer downloads real Instagram videos from accounts in your niche,
            transcribes what the creator actually said, and feeds the transcripts into the hook
            generator. You get the spoken content, not just the caption. Then you set it up to
            run every morning and email you fresh hook ideas automatically.
          </p>

          <StepCard number={11} title="Install yt-dlp and FFmpeg">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Paste this into Claude Code. It will detect your operating system and install both
              tools the right way for your machine:
            </p>
            <CodeBlock
              filename="Paste into Claude Code"
              code={`Check what operating system I am on, then install yt-dlp and FFmpeg using the correct method for my system. If I am on a Mac, use Homebrew. If I am on Windows, use the appropriate package manager or direct download. Confirm both are installed and working when you are done.`}
            />
            <ProTip type="info">
              yt-dlp downloads public videos from Instagram and hundreds of other platforms.
              FFmpeg handles audio extraction. You only need to install these once.
            </ProTip>
          </StepCard>

          <StepCard number={12} title="Download and transcribe a reel">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Everyone does this together. Go to one of the accounts from your prep list, open
              any recent reel, and copy the URL from your browser. Then paste this prompt with
              the URL filled in:
            </p>
            <CodeBlock
              filename="Paste into Claude Code"
              editable
              code={`Download this Instagram reel using yt-dlp: [PASTE THE REEL URL HERE]

Extract the audio using FFmpeg. Then transcribe the audio using Whisper — install it first if needed using "pip install openai-whisper", and use the "base" model for speed.

Save the transcript to a file called research-transcript.md.

Then use the transcript to:
1. Generate 3-5 hooks in that creator's style adapted to my niche
2. Write a to-do list for modeling their content strategy based on what they actually said
3. Identify the key talking points, offer structure, or calls to action from the video`}
            />
            <ProTip type="tip">
              While that is running, start a background agent on a second reel by adding{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">!</code> before the prompt.
              You can transcribe multiple reels in parallel.
            </ProTip>
          </StepCard>

          <StepCard number={13} title="Set up the daily email agent">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Fill in your Instagram handles and email address, then paste:
            </p>
            <CodeBlock
              filename="Paste into Claude Code"
              editable
              code={`Set up my daily hook research agent.

Instagram accounts to pull from: [@HANDLE1, @HANDLE2, @HANDLE3]
My email address: [YOUR EMAIL]
Send time: 7am my local time

Every morning the agent should:
1. Use yt-dlp to download the most recent reel from each account
2. Extract the audio with FFmpeg
3. Transcribe each reel using Whisper (base model)
4. Generate 5-10 hook ideas adapted to my niche using my voice profile, drawing from the transcripts
5. Email the hooks to me with the subject line "Your daily hooks"

Use Claude's scheduled remote agents to run this automatically every day. Set it up using the /schedule skill so it runs on a daily cron schedule at the send time above. The agent should run in the cloud so it works even when my laptop is closed.`}
            />
            <ProTip type="warning">
              Make sure your{' '}
              <a
                href="https://resend.com/domains"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5C3C6] hover:underline"
              >
                Resend domain
              </a>
              {' '}is verified or sandbox mode is active, or the emails will not send. If you are
              not sure, go back to Prep step 3.
            </ProTip>
          </StepCard>
        </section>

        {/* Wrap-up */}
        <section className="mb-16">
          <div className="border-t border-white/[0.08] pt-12">
            <div className="mb-4">
              <h2 className="gradient-text text-3xl font-extrabold pb-1">You just built something real.</h2>
            </div>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-10">
              You have a voice profile that writes in your voice, Hook Writer running from that
              voice, and a daily agent
              sending you hook ideas every morning. That is a full content machine, running on
              its own.
            </p>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 mb-8">
              <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">Support Each Other</p>
              <h3 className="text-xl font-bold text-[#FCF4EB] mb-3">Post in the Masterminds group</h3>
              <p className="text-[#FCF4EB]/70 leading-relaxed mb-6">
                Share a screenshot of your first daily hook email in the Masterminds group when
                it arrives. Everyone gets one. Compare what the agent generated across different
                niches.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#7C69C7] text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Share your first hooks</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      Post the first hooks Hook Writer generated with your voice profile. The group
                      will tell you which one would make them stop scrolling.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#7C69C7] text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Share your voice profile summary</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      Post the 3-sentence summary Claude gave you when it built your voice profile.
                      The group will tell you if it sounds like you.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#7C69C7] text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Test someone else&rsquo;s hooks</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      Take a hook from someone else&rsquo;s daily email and tell them if it would
                      make you stop scrolling.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#7C69C7]/50 bg-[#7C69C7]/[0.08] rounded-xl p-6">
              <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">Challenge</p>
              <p className="text-[#FCF4EB]/80 leading-relaxed">
                Use{' '}
                <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">/hooklab --my-voice</code>{' '}
                every day this week. Do not use it to post everything automatically. Use it to get
                unstuck when you do not know what to write.
              </p>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
