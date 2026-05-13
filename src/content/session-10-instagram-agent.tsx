'use client'

import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'
import StepCard from '@/components/StepCard'

const REPO_URL = 'https://github.com/josephtandle/instagram-agent'
const MAC_INSTALL = 'curl -fsSL https://raw.githubusercontent.com/josephtandle/instagram-agent/main/install.sh | bash'
const WINDOWS_INSTALL = 'irm https://raw.githubusercontent.com/josephtandle/instagram-agent/main/install.ps1 | iex'

const CLAUDE_INSTALL_PROMPT = `Install the Instagram agent from GitHub and make sure it is callable correctly for this machine.

Repository:
https://github.com/josephtandle/instagram-agent

Do this carefully:
1. Detect whether I am on macOS, Windows, or Linux before choosing commands.
2. Resolve my home directory dynamically. Do not hard-code a username.
3. Install the repo into a Tools/Instagram folder inside my home directory.
4. Use shell-safe commands on macOS/Linux and PowerShell-safe commands on Windows.
5. If the folder already exists, pull the latest main branch. Otherwise clone the repo.
6. Run the bundled installer from inside the repo:
   - macOS/Linux: node install/install-instagram.js --target <resolved-home>/Tools/Instagram
   - Windows: node install/install-instagram.js --target <resolved-home>\\Tools\\Instagram
7. Let the installer create the Python virtualenv, install the Python requirements, and save the resolved absolute install path.
8. Make sure the saved install manifest exists at:
   - macOS/Linux: ~/.instagram-agent/install.json
   - Windows: $env:USERPROFILE\\.instagram-agent\\install.json
9. Try to make the global command available by running npm install -g . from inside the installed repo if the installer did not already do it.
10. Verify the command works:
   - preferred: instagram status
   - fallback: node <resolved-home>/Tools/Instagram/install/launcher.js status
11. Show me:
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
2. Tell me which browser session or login flow this setup expects for Instagram.
3. If the agent needs its own login step, walk me through it exactly.
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

const INSTAGRAM_TEST_PROMPT = `Test my Instagram agent in the safest useful way.

Goal:
Verify that the agent works for read-only lead capture tasks.

Tasks:
1. Confirm the Instagram command works on this machine.
2. Read the most recent direct message conversation.
3. Tell me what the last direct message was.
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
Show me how this would work for lead capture without doing anything risky.

Tasks:
1. Read the latest 10 DM conversations.
2. Identify which ones look like real business leads, which ones are not leads, and which ones are unclear.
3. Do not send any messages.
4. Do not create duplicates if a lead already exists.
5. Add or update only the real leads in the CRM with:
   - Instagram username
   - display name if available
   - source = Instagram DM
   - short summary
   - stage
   - next step
   - notes
6. At the end, show me exactly what was added or updated.

Rules:
- Read and capture only.
- No outreach.
- No posting.
- If CRM write access fails, stop and explain the blocker.`

const INSTAGRAM_COMMENTS_TEST_PROMPT = `Use my Instagram agent in read-only mode.

Goal:
Check whether the agent can read engagement on my latest post.

Tasks:
1. Find my most recent Instagram post.
2. Read the comments on that post.
3. Tell me how many comments there are.
4. Give me all of the comments in a clean list.
5. If there are replies or nested comments, show that clearly if possible.

Rules:
- Do not reply to any comments.
- Do not post anything.
- Do not modify the account.
- This is a read-only test only.`

export default function Session10InstagramAgent() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Session 10
        </p>
        <h1 className="gradient-text text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Instagram Agent and Lead Capture
        </h1>
        <p className="text-lg text-[#FCF4EB]/60 leading-relaxed max-w-3xl">
          This is the first step for bringing Instagram into the sales system. The goal is not mass outreach.
          The goal is to read DMs, review inbound interest, capture leads into a CRM, and make follow-up cleaner.
        </p>
      </div>

      <div className="space-y-8">
        <StepCard number={1} title="What this is for">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Use Instagram as a lead source. Capture the conversations, opportunities, and people already touching your business.
            Then move those into a CRM so nothing slips through the cracks.
          </p>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            This is not about turning Instagram into a growth-hacking machine. It is about getting visibility into the conversations
            you already have, organizing them properly, and making follow-up more intentional.
          </p>
        </StepCard>

        <StepCard number={2} title="Install the Instagram agent">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Public repo: <a href={REPO_URL} className="underline hover:text-white" target="_blank" rel="noopener noreferrer">{REPO_URL}</a>
          </p>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Open your terminal first. Start Claude Code or Codex, then paste this prompt in. It handles Mac, Windows,
            Linux, installs the repo, saves the absolute install path, and verifies whether the `instagram` command works.
          </p>
          <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Mac or Linux</p>
          <CodeBlock filename="Terminal" code={MAC_INSTALL} />
          <p className="text-[#FCF4EB] font-semibold text-sm mb-2 mt-5">Windows PowerShell</p>
          <CodeBlock filename="PowerShell" code={WINDOWS_INSTALL} />
          <div className="mt-5">
            <CodeBlock filename="Claude Code prompt" code={CLAUDE_INSTALL_PROMPT} editable />
          </div>
        </StepCard>

        <StepCard number={3} title="What success looks like">
          <div className="space-y-3 text-sm text-[#FCF4EB]/70">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-[#FCF4EB] font-semibold mb-1">The install path is saved</p>
              <p>The installer writes the resolved absolute path into `~/.instagram-agent/install.json`.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-[#FCF4EB] font-semibold mb-1">The command works</p>
              <p>`instagram status` returns a result, or the fallback launcher command works from the saved install directory.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-[#FCF4EB] font-semibold mb-1">You can read the inbox</p>
              <p>The next useful command is `instagram read-dms --limit 20` so you can start reviewing conversations for CRM capture.</p>
            </div>
          </div>
        </StepCard>

        <StepCard number={4} title="Log into the Instagram account this agent will use">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Before this is actually useful, you need a live Instagram login session for the account you want the agent to read.
            Do not skip this. Installation alone is not enough.
          </p>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            The important requirement is that you log into the Instagram account in the browser or session that this agent is using,
            then verify the login was saved successfully before you try any CRM workflow.
          </p>
          <CodeBlock filename="Claude Code prompt" code={INSTAGRAM_LOGIN_PROMPT} editable />
        </StepCard>

        <StepCard number={5} title="What the Instagram agent can do">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Once installed, this agent gives you a practical Instagram toolbelt. Some of these are useful right away.
            Others are capabilities you should treat very carefully.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-[#FCF4EB]/70">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <p className="text-[#FCF4EB] font-semibold mb-2">Read and research</p>
              <ul className="space-y-2">
                <li>- `read-dms`</li>
                <li>- `read-comments`</li>
                <li>- `get-profile`</li>
                <li>- `resolve-user`</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <p className="text-[#FCF4EB] font-semibold mb-2">Publish and respond</p>
              <ul className="space-y-2">
                <li>- `send-dm`</li>
                <li>- `reply-comment`</li>
                <li>- `post-feed`</li>
                <li>- `post-story`</li>
                <li>- `post-reel`</li>
                <li>- `post-carousel`</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
            <p className="text-[#FCF4EB] font-semibold mb-2">Recommended first use</p>
            <p className="text-sm text-[#FCF4EB]/65">
              Start with `read-dms`, `read-comments`, and profile research. That is the cleanest path for reviewing inbound interest
              and moving real opportunities into your CRM.
            </p>
          </div>
        </StepCard>

        <StepCard number={6} title="Recommended uses and non-uses">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <p className="text-[#FCF4EB] font-semibold mb-2">Recommended uses</p>
              <ul className="space-y-2 text-sm text-[#FCF4EB]/65">
                <li>- read Instagram DM threads</li>
                <li>- review comments and interest signals</li>
                <li>- research profiles before a reply or sales call</li>
                <li>- capture leads into your CRM</li>
                <li>- prepare better follow-up notes</li>
                <li>- review inbound activity before a launch or offer push</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-[#F5C3C6]/20 bg-[#F5C3C6]/[0.06] p-5">
              <p className="text-[#FCF4EB] font-semibold mb-2">Recommended non-uses</p>
              <ul className="space-y-2 text-sm text-[#FCF4EB]/65">
                <li>- do not use it for mass DMs</li>
                <li>- do not blast outbound automation</li>
                <li>- do not send large-volume campaigns from this setup</li>
                <li>- if you send anything, keep it to only a couple per day</li>
                <li>- do not use it as your permanent production integration</li>
                <li>- do not assume this is risk-free just because it works technically</li>
              </ul>
            </div>
          </div>
        </StepCard>

        <StepCard number={7} title="Reality and dangers">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            This agent uses an unofficial private API. That means it can be useful, but it is not the same as having a clean,
            officially supported Meta integration.
          </p>
          <ProTip type="warning">
            This tool uses an unofficial private API. Treat it as a first-step workflow for visibility and CRM capture, not as the final production system.
          </ProTip>
          <div className="mt-4 rounded-2xl border border-[#F5C3C6]/20 bg-[#F5C3C6]/[0.06] p-5">
            <p className="text-[#FCF4EB] font-semibold mb-2">Main risks</p>
            <ul className="space-y-2 text-sm text-[#FCF4EB]/65">
              <li>- account restrictions or rate limits if you act too aggressively</li>
              <li>- fragile behavior because unofficial APIs can change without notice</li>
              <li>- false confidence if you mistake a first-step tool for a production-safe system</li>
              <li>- operational mess if you mix research, outreach, and automation without clear boundaries</li>
            </ul>
          </div>
        </StepCard>

        <StepCard number={8} title="Test it safely">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Do not jump straight into broad use. Run a safe read-only test first, then a small CRM capture test once you know the login,
            session, and command path are working.
          </p>
          <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Test 1: read the latest direct message</p>
          <CodeBlock filename="Claude Code prompt" code={INSTAGRAM_TEST_PROMPT} editable />
          <p className="text-[#FCF4EB] font-semibold text-sm mb-2 mt-5">Test 2: read the last 20 DMs and capture real leads into the CRM</p>
          <CodeBlock filename="Claude Code prompt" code={INSTAGRAM_CRM_TEST_PROMPT} editable />
          <p className="text-[#FCF4EB] font-semibold text-sm mb-2 mt-5">Test 3: read the comments on your latest post</p>
          <CodeBlock filename="Claude Code prompt" code={INSTAGRAM_COMMENTS_TEST_PROMPT} editable />
        </StepCard>

        <StepCard number={9} title="The right long-term way to do it">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            The proper production path is the official Meta API. That is the real route if you want a stable, compliant,
            long-term Instagram integration.
          </p>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            That setup is not a quick workshop task. It is a real integration project, and it can take days to months to get
            fully working depending on your accounts, business structure, permissions, review requirements, and how far you want to take it.
          </p>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
            <p className="text-[#FCF4EB] font-semibold mb-2">What that process usually involves</p>
            <ol className="space-y-2 text-sm text-[#FCF4EB]/65">
              <li>1. Convert to the right professional Instagram / Facebook business setup.</li>
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

      </div>
    </div>
  )
}
