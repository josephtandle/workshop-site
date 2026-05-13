'use client'

import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'
import StepCard from '@/components/StepCard'

const REPO_URL = 'https://github.com/josephtandle/instagram-agent'

const CLAUDE_INSTALL_PROMPT = `Install the Instagram agent from GitHub and make sure it is callable correctly on this machine.

Repository:
https://github.com/josephtandle/instagram-agent

Do this carefully:
1. Detect whether I am on macOS, Windows, or Linux before choosing commands.
2. Resolve my home directory dynamically. Do not hard-code a username.
3. Install the repo into a Tools/Instagram folder inside my home directory.
4. If the folder already exists, pull the latest main branch. Otherwise clone the repo.
5. Run the bundled installer from inside the repo:
   - macOS/Linux: node install/install-instagram.js --target <resolved-home>/Tools/Instagram
   - Windows: node install/install-instagram.js --target <resolved-home>\\Tools\\Instagram
6. Let the installer create the Python virtualenv, install the Python requirements, and save the resolved absolute install path.
7. Make sure the saved install manifest exists at:
   - macOS/Linux: ~/.instagram-agent/install.json
   - Windows: $env:USERPROFILE\\.instagram-agent\\install.json
8. Try to make the global command available if the installer did not already do it.
9. Verify the command works:
   - preferred: instagram status
   - fallback: node <resolved-home>/Tools/Instagram/install/launcher.js status
10. Show me:
   - where the repo was installed
   - where the absolute path was saved
   - whether the global instagram command works
   - the exact fallback command if global install did not work

Important:
- This tool is mainly for reading DMs, reading comments, researching profiles, and supporting CRM capture.
- Do not frame it as a mass-DM tool.
- If anything requires manual approval or login, stop and tell me exactly what needs to happen next.`

const INSTAGRAM_LOGIN_PROMPT = `Help me get the Instagram agent ready to use on this machine.

Tasks:
1. Confirm the Instagram agent is installed and callable.
2. Run the correct login command for the Instagram agent.
3. If any manual verification, challenge, or browser confirmation is required, stop and tell me exactly what I need to do.
4. Wait while I log into the Instagram account that this agent will use.
5. After login, verify the session is saved correctly.
6. Test one safe read-only command, such as:
   - instagram status
   - instagram read-dms --limit 5
7. Tell me clearly whether the login is complete and the agent is ready.

Rules:
- Do not send any DMs.
- Do not post anything.
- Keep this as a setup and verification pass only.`

const INSTAGRAM_LAST_DM_PROMPT = `Test my Instagram agent in read-only mode.

Goal:
Verify that the agent can read my latest DM thread safely.

Tasks:
1. Confirm the Instagram command works on this machine.
2. Read the most recent DM thread summary first.
3. Tell me what the last direct message was from that latest thread.
4. Summarize what the command returned without exposing anything unnecessary.
5. Tell me:
   - which commands passed
   - whether the agent is ready for CRM capture workflows
   - what the next recommended command should be

Rules:
- Do not send any DMs.
- Do not post content.
- Do not change account settings.
- This is read-only testing only.`

const INSTAGRAM_CRM_TEST_PROMPT = `Use my Instagram agent and CRM together in a safe test run.

Goal:
Read the last 20 DM conversations, identify which ones are actual leads, and add only the real leads into my CRM with useful information filled in.

Tasks:
1. First verify the Instagram agent works on this machine.
2. If the global command works, use it. If not, find the saved install path and use the fallback launcher command.
3. Read the last 20 DM conversations.
4. For each conversation, decide whether it is:
   - a real lead
   - not a lead
   - unclear / needs manual review
5. Treat someone as a lead only if there is real business intent, such as:
   - asking about working together
   - asking about services, pricing, availability, or booking
   - showing serious interest that could reasonably become a sales conversation
6. Ignore obvious spam, friends chatting casually, low-signal reactions, and anything that is not a real business opportunity.
7. For each real lead, add a CRM contact or lead record with as much of this as you can find:
   - Instagram username
   - display name
   - lead source = Instagram DM
   - short summary of what they want
   - current stage = New Lead or Interested, whichever fits better
   - next step
   - notes from the conversation
8. If a lead already exists in the CRM, do not create a duplicate. Update the existing record instead.
9. At the end, give me:
   - how many DMs were reviewed
   - which conversations were treated as real leads
   - which ones were unclear
   - exactly what was added or updated in the CRM

Rules:
- Read and capture only.
- No outreach.
- No posting.
- If CRM write access fails, stop and explain the blocker.`

const INSTAGRAM_COMMENTS_TEST_PROMPT = `Use my Instagram agent in read-only mode.

Goal:
Check whether the agent can read engagement on my latest post.

Tasks:
1. First check whether the current Instagram agent can directly identify my latest post URL or shortcode.
2. If it can, use that.
3. If it cannot, stop and ask me to paste the URL of my latest post, because the read-comments command needs a post URL or shortcode.
4. Read the comments on that post.
5. Tell me how many comments there are.
6. Give me all of the comments in a clean list.
7. If there are replies or nested comments, show that clearly if possible.

Rules:
- Do not reply to any comments.
- Do not post anything.
- Do not modify the account.
- This is a read-only test only.`

const SUCCESS_SIGNALS = [
  {
    label: 'Saved path',
    title: 'The install path is saved',
    body: 'The installer writes the resolved absolute path into `~/.instagram-agent/install.json`.',
  },
  {
    label: 'Ready',
    title: 'The command works',
    body: '`instagram status` returns a result, or the fallback launcher command works from the saved install directory.',
  },
  {
    label: 'Inbox access',
    title: 'You can read the inbox',
    body: 'The next useful command is `instagram read-dms --limit 20` so you can start reviewing conversations for CRM capture.',
  },
]

export default function Session10InstagramAgent() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-14">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Session 10
        </p>
        <h1 className="gradient-text text-5xl font-extrabold leading-tight mb-5 pb-1">
          Instagram Agent and Lead Capture
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-8">
          This is the first practical step for bringing Instagram into your sales system. The goal is not mass outreach.
          The goal is to read DMs, review inbound interest, capture real leads into a CRM, and make follow-up cleaner.
        </p>

        <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 mb-8">
          <span className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Duration ~60 minutes
          </span>
          <span className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 14l3-9 4 6 2-3 3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Intermediate
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
              { href: '#permissions', label: 'Start Here — Claude Dangerously Skip Permissions' },
              { href: '#install', label: 'Install — Install and log into the Instagram agent' },
              { href: '#capabilities', label: 'Capabilities — What it can do and how to use it' },
              { href: '#reality', label: 'Reality — Risks and the right long-term path' },
              { href: '#tests', label: 'Tests — Try the agent safely' },
            ].map(({ href, label }, i) => (
              <li key={href} className="flex items-center gap-3 group/item">
                <span
                  className="number-glow flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold tabular-nums"
                  style={{ background: 'rgba(124,105,199,0.18)', color: '#9D8FE0', border: '1.5px solid rgba(124,105,199,0.30)' }}
                >
                  {i + 1}
                </span>
                <a href={href} className="text-[#FCF4EB]/58 hover:text-[#9D8FE0] text-sm leading-snug transition-colors duration-150">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </details>
      </div>

      <section id="permissions" className="mb-16">
        <div className="mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Start Here</span>
          <h2 className="text-3xl font-bold text-[#FCF4EB] mt-3">Claude Dangerously Skip Permissions</h2>
        </div>

        <StepCard number={1} title="Open your terminal and start Claude Code">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Start the workshop by opening Claude Code in Dangerously Skip Permissions so you are not approving every small step during setup.
          </p>
          <CodeBlock filename="Claude Code prompt" code={`Start Claude Code in Dangerously Skip Permissions for this workshop session. Confirm you are in the right project folder before making changes.`} />
          <ProTip type="warning" className="mt-4">
            Only use this in the project folder you actually intend to edit.
          </ProTip>
        </StepCard>
      </section>

      <section id="install" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Install</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Install and Log Into the Instagram Agent</h2>
        </div>

        <StepCard number={2} title="Install the Instagram agent with one prompt">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Public repo: <a href={REPO_URL} className="underline hover:text-white" target="_blank" rel="noopener noreferrer">{REPO_URL}</a>
          </p>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Use one prompt only. This should handle Mac, Windows, or Linux, install the repo, save the absolute install path,
            and verify whether the `instagram` command works.
          </p>
          <CodeBlock filename="Claude Code prompt" code={CLAUDE_INSTALL_PROMPT} editable />
        </StepCard>

        <StepCard number={3} title="What success looks like">
          <div className="space-y-4">
            {SUCCESS_SIGNALS.map(({ label, title, body }, index) => (
              <div
                key={title}
                className="group card-hover card-shimmer relative overflow-hidden rounded-[24px] border border-white/[0.10] bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-60 blur-2xl"
                  style={{
                    background:
                      index === 1
                        ? 'radial-gradient(circle, rgba(245,195,198,0.32) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(124,105,199,0.30) 0%, transparent 70%)',
                  }}
                />
                <div className="relative flex items-start gap-4">
                  <div
                    className="number-glow flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124,105,199,0.22) 0%, rgba(245,195,198,0.14) 100%)',
                      color: '#FCF4EB',
                      border: '1px solid rgba(124,105,199,0.32)',
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#9D8FE0] font-semibold mb-2">{label}</p>
                    <p className="text-[#FCF4EB] font-semibold text-[17px] leading-snug mb-2">{title}</p>
                    <p className="text-[#FCF4EB]/58 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </StepCard>

        <StepCard number={4} title="Log into the Instagram account this agent will use">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Before this is actually useful, you need a live Instagram login session for the account you want the agent to read.
            Installation alone is not enough.
          </p>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Open <a href="https://www.instagram.com/" className="underline hover:text-white" target="_blank" rel="noopener noreferrer">Instagram</a>,
            log into the correct account, and then make sure the agent saves the session successfully before you try any CRM workflow.
          </p>
          <CodeBlock filename="Claude Code prompt" code={INSTAGRAM_LOGIN_PROMPT} editable />
        </StepCard>
      </section>

      <section id="capabilities" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Capabilities</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">What It Can Do and How to Use It</h2>
        </div>

        <StepCard number={5} title="What the Instagram agent can do">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Once installed, this agent gives you a practical Instagram toolbelt. The safest and most useful part is the read-and-research side.
          </p>
          <div className="space-y-4">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Read and research</p>
              <ul className="space-y-1 text-[#FCF4EB]/60 text-sm">
                <li>`read-dms`</li>
                <li>`read-comments`</li>
                <li>`get-profile`</li>
                <li>`resolve-user`</li>
              </ul>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Publish and respond</p>
              <ul className="space-y-1 text-[#FCF4EB]/60 text-sm">
                <li>`send-dm`</li>
                <li>`reply-comment`</li>
                <li>`post-feed`</li>
                <li>`post-story`</li>
                <li>`post-reel`</li>
                <li>`post-carousel`</li>
              </ul>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Recommended first use</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                Start with `read-dms`, `read-comments`, and profile research. That is the cleanest path for reviewing inbound
                interest and moving real opportunities into your CRM.
              </p>
            </div>
          </div>
        </StepCard>

        <StepCard number={6} title="Recommended uses and recommended non-uses">
          <div className="space-y-4">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Recommended uses</p>
              <ul className="space-y-1 text-[#FCF4EB]/60 text-sm">
                <li>read Instagram DM threads</li>
                <li>review comments and interest signals</li>
                <li>research profiles before a reply or sales call</li>
                <li>capture leads into your CRM</li>
                <li>prepare better follow-up notes</li>
                <li>review inbound activity before a launch or offer push</li>
              </ul>
            </div>
            <div className="bg-[#F5C3C6]/[0.06] border border-[#F5C3C6]/20 rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Recommended non-uses</p>
              <ul className="space-y-1 text-[#FCF4EB]/60 text-sm">
                <li>do not use it for mass DMs</li>
                <li>do not blast outbound automation</li>
                <li>do not send large-volume campaigns from this setup</li>
                <li>if you send anything, keep it to only a couple per day</li>
                <li>do not use it as your permanent production integration</li>
                <li>do not assume this is risk-free just because it works technically</li>
              </ul>
            </div>
          </div>
        </StepCard>
      </section>

      <section id="reality" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Reality</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Risks and the Right Long-Term Path</h2>
        </div>

        <StepCard number={7} title="Reality and dangers">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            This agent uses an unofficial private API. That means it can be useful, but it is not the same as having a clean,
            officially supported Meta integration.
          </p>
          <ProTip type="warning">
            Treat this as a first-step workflow for visibility and CRM capture, not as the final production system.
          </ProTip>
          <div className="mt-4 bg-[#F5C3C6]/[0.06] border border-[#F5C3C6]/20 rounded-xl p-4">
            <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Main risks</p>
            <ul className="space-y-1 text-[#FCF4EB]/60 text-sm">
              <li>account restrictions or rate limits if you act too aggressively</li>
              <li>fragile behavior because unofficial APIs can change without notice</li>
              <li>false confidence if you mistake a first-step tool for a production-safe system</li>
              <li>operational mess if you mix research, outreach, and automation without clear boundaries</li>
            </ul>
          </div>
        </StepCard>

        <StepCard number={8} title="The right long-term way to do it">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            The proper production path is the official Meta API. That is the real route if you want a stable, compliant,
            long-term Instagram integration.
          </p>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            This is not a quick workshop task. It is a real integration project, and it can take days to months to get fully
            working depending on your accounts, business structure, permissions, review requirements, and how far you want to take it.
          </p>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <p className="text-[#FCF4EB] font-semibold text-sm mb-2">What that process usually involves</p>
            <ol className="space-y-2 text-[#FCF4EB]/60 text-sm">
              <li>1. Convert to the right professional Instagram and Facebook business setup.</li>
              <li>2. Create or configure a Meta app in the Meta developer environment.</li>
              <li>3. Connect the correct Instagram Business account and Facebook Page.</li>
              <li>4. Request the right permissions for messaging, comments, and account access.</li>
              <li>5. Handle Meta app review, verification, and any required business verification steps.</li>
              <li>6. Set up secure authentication, token handling, and refresh behavior.</li>
              <li>7. Build the actual ingestion layer that reads the events you want.</li>
              <li>8. Map Instagram data cleanly into your CRM and internal workflow.</li>
              <li>9. Test failure cases, rate limits, retries, and permission changes.</li>
              <li>10. Only then use it as a real production integration.</li>
            </ol>
          </div>
          <ProTip type="tip" className="mt-4">
            Recommendation: work toward the official Meta API over time, but use this agent now as the first practical step
            for reading conversations and capturing leads into your CRM.
          </ProTip>
        </StepCard>
      </section>

      <section id="tests" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Tests</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Try the Agent Safely</h2>
        </div>

        <StepCard number={9} title="Go read and tell me what the last direct message was">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            This is the safest first test. It verifies the login session and confirms the agent can read your inbox without taking action.
          </p>
          <CodeBlock filename="Claude Code prompt" code={INSTAGRAM_LAST_DM_PROMPT} editable />
        </StepCard>

        <StepCard number={10} title="Go read the last 20 messages and capture real leads into the CRM">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            This is the actual sales workflow. Review inbound conversations, decide which ones are real opportunities, and organize them properly.
          </p>
          <CodeBlock filename="Claude Code prompt" code={INSTAGRAM_CRM_TEST_PROMPT} editable />
        </StepCard>

        <StepCard number={11} title="Go look at my last post, read the comments, tell me how many there were, and give me all the comments">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            This tests comment-reading in a safe way. If the agent cannot identify your latest post URL by itself, it should ask you for the link.
          </p>
          <CodeBlock filename="Claude Code prompt" code={INSTAGRAM_COMMENTS_TEST_PROMPT} editable />
        </StepCard>
      </section>
    </div>
  )
}
