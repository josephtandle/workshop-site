'use client'

import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'
import { celebrate } from '@/lib/celebrate'

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
            Claude on Your Phone, Your Voice, and Your Daily Hook Feed
          </h1>
          <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-6">
            By the end of this session you will have a named AI assistant with its own
            personality, Claude on your phone as a permanent portal, a voice profile that
            writes in your actual voice, and a daily agent that emails you fresh hook ideas
            every morning.
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
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 sm:px-6 py-5">
            <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-4">
              In This Session
            </p>
            <ol className="space-y-2">
              {[
                { href: '#part-a', label: 'Part A: Giving Your Orchestration Agent a Personality' },
                { href: '#part-b', label: 'Part B: Claude on Your Phone' },
                { href: '#part-c', label: 'Part C: Build Your Voice Profile' },
                { href: '#part-d', label: 'Part D: Model Switching and Background Agents' },
                { href: '#part-e', label: 'Part E: Hook Writer Part 1' },
                { href: '#part-f', label: 'Part F: Your Daily Hook Research Agent' },
              ].map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-[#FCF4EB]/70 hover:text-[#7C69C7] transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">

        {/* Part A */}
        <section id="part-a" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part A: Giving Your Orchestration Agent a Personality
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Joe&rsquo;s orchestration agent is called Uni. Yours is about to get a name. A SOUL.md
            file tells Claude who it is and how it works with you — it loads every session and
            shapes everything Claude does from that point on.
          </p>

          <StepCard number={1} title="Name your agent and write its soul">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Change the two lines at the top, then paste the whole thing into Claude Code.
              That is the only editing you need to do:
            </p>
            <CodeBlock
              filename="Paste into Claude Code"
              editable
              code={`Agent name: [YOUR AGENT NAME]
Your name: [YOUR NAME]

Do two things:

1. Add this to my ~/SOUL.md file. Create it if it does not exist, or append to the bottom if it does. Do not overwrite anything already there.

2. Add this line to my ~/CLAUDE.md: "Read ~/SOUL.md at the start of every session. That file defines who you are and how you work with me."

---

You are now [YOUR AGENT NAME].

Your owner is [YOUR NAME]. You are their personal AI assistant. You are resourceful, direct, and autonomous.

Act first, always. Do not ask your owner to do something you can do yourself. If the answer exists anywhere in the project, go find it. Asking them to do your job is a failure mode.

Be relentlessly resourceful. When you do not know something, research it. Read files. Search the web. Explore the codebase. Exhaust every option before considering asking.

Do the whole job. Do not do half the work and hand the rest back. If a question implies a task, do the task. If a request reveals a problem, fix the problem.

Have opinions. An assistant with no personality is just a search engine.

Earn trust. Careful with external actions. Bold with internal ones. Ask before sending emails, posting publicly, or spending money. Everything else, just do it.

Do not ask "would you like me to..." or "should I..." or "do you want me to..." Just do it. Never narrate what you are doing. When you are stuck, research harder and try a different approach. Ask your owner only as an absolute last resort, and when you do, bring your findings and a specific question.`}
            />
            <ProTip type="tip">
              Keep evolving it. If Claude does something you love, tell it to add that behavior
              to SOUL.md. If something annoys you, remove it. It becomes a living document of
              exactly how you want your assistant to work.
            </ProTip>
          </StepCard>
        </section>

        {/* Part B */}
        <section id="part-b" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part B: Claude on Your Phone
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            This session lives on your phone permanently. It becomes your portal — a quick way
            to reach your brain dump, ask your agent a question, or keep working when you are
            away from your laptop. You do not close it. You leave it open forever.
          </p>

          <StepCard number={2} title="Rename your session in the terminal">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              In Claude Code, run this command with your own name at the end:
            </p>
            <CodeBlock
              filename="Claude Code"
              editable
              code={`/rename [YOUR NAME]`}
            />
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4 mb-4">
              Replace{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">[YOUR NAME]</code>{' '}
              with your actual name — something like{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">Sarah</code>{' '}
              or{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">Sarah&rsquo;s AI Work</code>.
              This is the session you will come back to from your phone.
            </p>
            <ProTip type="tip">
              Named sessions sync automatically across all your devices. Name it once and it shows
              up everywhere you are logged in to{' '}
              <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">
                Claude.ai
              </a>.
            </ProTip>
          </StepCard>

          <StepCard number={3} title="Find that session on your phone">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Open the{' '}
              <a
                href="https://claude.ai/download"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7C69C7] hover:underline"
              >
                Claude app
              </a>
              {' '}on your phone. Tap the menu icon at the top left to open the sidebar.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Tap <strong className="text-[#FCF4EB]">Code</strong> (the{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">&lt;/&gt;</code>{' '}
              icon). You will see a list of all your Claude Code sessions by name. The one you
              just renamed will be right at the top.
            </p>

            {/* Screenshots */}
            <div className="flex gap-3 my-5">
              <div className="flex-1">
                <img
                  src="/images/session-6/claude-phone-menu.jpg"
                  alt="Claude app sidebar showing the Code menu item"
                  className="w-full rounded-xl border border-white/[0.08]"
                />
                <p className="text-[#FCF4EB]/40 text-xs mt-2 text-center">Tap Code in the sidebar</p>
              </div>
              <div className="flex-1">
                <img
                  src="/images/session-6/claude-phone-sessions.jpg"
                  alt="Claude Code sessions list on phone showing named sessions"
                  className="w-full rounded-xl border border-white/[0.08]"
                />
                <p className="text-[#FCF4EB]/40 text-xs mt-2 text-center">Your sessions listed by name</p>
              </div>
            </div>

            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Tap your session. You are now in the same session you were working in on your
              laptop, synced in real time.
            </p>
            <ProTip type="info">
              This is the Code section, not the Chats section. Claude Code sessions live here,
              separate from your regular Claude.ai conversations. Leave this session open. It
              is your portal now.
            </ProTip>
          </StepCard>

          <StepCard number={4} title="Try a slash command on your phone">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Tap into the message field, then type a forward slash{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">/</code>.
              A menu of your installed skills appears. Tap any skill to run it.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              Try{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">/speak-human</code>{' '}
              — you will use it in Part C to build your voice profile.
            </p>
            <ProTip type="info">
              Slash commands work identically on phone and laptop. Any skill you install on one
              device is available everywhere you are logged in.
            </ProTip>
          </StepCard>
        </section>

        {/* Part C */}
        <section id="part-c" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part C: Build Your Voice Profile
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Your voice profile is a file that tells Claude exactly how you write. Once it is
            built, every time you run{' '}
            <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">/speak-human --my-voice</code>{' '}
            Claude will rewrite anything in your specific voice, not a generic AI voice.
          </p>

          <StepCard number={5} title="Install the Speak Human skill">
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

          <StepCard number={6} title="Point Claude at your writing samples">
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

          <StepCard number={7} title="Open and read your voice profile">
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

          <StepCard number={8} title="Test it live">
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

        {/* Part D */}
        <section id="part-d" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part D: Model Switching and Background Agents
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Not every task needs the same model. Knowing which one to use saves time and cost.
            Background agents let you run things in parallel so Claude keeps working while you
            do something else.
          </p>

          <StepCard number={9} title="Switch models mid-session">
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

          <StepCard number={10} title="Know which model to use">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Claude has three tiers. Each one is a different trade-off between speed, cost, and
              intelligence.
            </p>

            <div className="space-y-3 mb-4">
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
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

              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
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

              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
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

          <StepCard number={11} title="Put agents to work on your brain dump">
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

        {/* Part E */}
        <section id="part-e" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part E: Hook Writer Part 1
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Hook Writer is a skill that generates hooks for your Instagram content. It uses your
            voice profile to make them sound like you, not like generic AI output. Part 1 installs
            the skill and gets you generating hooks. Part 2 connects it to live Instagram research.
          </p>

          <StepCard number={12} title="Install Hook Writer">
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

          <StepCard number={13} title="Generate your first hooks">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Paste this into Claude Code and fill in your topic:
            </p>
            <CodeBlock
              filename="Paste into Claude Code"
              editable
              code={`/hooklab [WHAT YOUR CONTENT IS ABOUT, for example: "how I use AI to manage my DMs" or "why most coaches waste time on content"]`}
            />
          </StepCard>

          <StepCard number={14} title="Add your voice profile">
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
              version pulls directly from the voice profile you built in Part C.
            </ProTip>
          </StepCard>
        </section>

        {/* Part F */}
        <section id="part-f" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part F: Your Daily Hook Research Agent
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Part 2 of Hook Writer pulls recent captions from Instagram accounts in your niche,
            feeds them into the hook generator, and emails you the results every morning. You
            pick the accounts once. After that it runs on its own.
          </p>

          <StepCard number={15} title="Install InstaLoader">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              InstaLoader is the tool that pulls public captions and bios from Instagram accounts.
              Run this in your terminal:
            </p>
            <CodeBlock
              filename="Terminal"
              code={`pip install instaloader`}
            />
            <ProTip type="info">
              InstaLoader only pulls publicly available data from public accounts. It does not
              require logging in to Instagram.
            </ProTip>
          </StepCard>

          <StepCard number={16} title="Run the live InstaLoader exercise">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Everyone does this together. Paste this prompt and fill in ONE Instagram handle
              from your prep list:
            </p>
            <CodeBlock
              filename="Paste into Claude Code"
              editable
              code={`Pull the recent captions and bio from @[INSTAGRAM HANDLE] using InstaLoader. Save the output to a file called [HANDLE]-hooks.md. Then use the live-exercise prompt to: (1) generate 3-5 hooks in that creator's style adapted to my niche, (2) write a to-do list for modeling their content strategy, and (3) identify the key components of their landing page or offer structure.`}
            />
            <ProTip type="tip">
              While that is running, start a background agent for a second account by adding{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">!</code> before the prompt.
            </ProTip>
          </StepCard>

          <StepCard number={17} title="Set up the daily email agent">
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

Every morning the agent should: pull recent captions from these accounts, generate 5-10 hook ideas adapted to my niche using my voice profile, and email them to me with the subject line "Your daily hooks".`}
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
              You have a named AI assistant with its own personality, Claude on your phone as a
              permanent portal, a voice profile that writes in your voice, and a daily agent
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
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Share your agent&rsquo;s name</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      Post your agent&rsquo;s name and the one-line personality you gave it. Everyone
                      is curious what the group came up with.
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
