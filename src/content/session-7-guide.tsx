'use client'

import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'
import { celebrate } from '@/lib/celebrate'
import StickyVideoPlayer from '@/components/StickyVideoPlayer'

export default function Session7Guide() {
  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-16 pb-0">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
            Session Seven
          </p>
          <h1 className="gradient-text text-5xl font-extrabold leading-tight mb-5 pb-1">
            Your First Mission Control: Automated Task Board + Projects
          </h1>
          <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-6">
            By the end of this session you will have a personal browser-based task board running
            on your laptop, loaded with sample projects, and ready to use. The kanban board is
            yours to keep. The next session wires up the AI column so Claude can start executing
            tasks automatically.
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

          <details className="rounded-2xl overflow-hidden border border-white/[0.10] bg-[linear-gradient(145deg,rgba(124,105,199,0.07),rgba(255,255,255,0.03))] shadow-[0_8px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.07)]">
            <summary className="flex items-center justify-between px-6 py-5 cursor-pointer select-none">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#9D8FE0] shadow-[0_0_12px_rgba(157,143,224,0.70)]" />
                <span className="text-xs uppercase tracking-[0.20em] text-[#FCF4EB]/65 font-semibold">Table of Contents</span>
              </div>
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(124,105,199,0.15)] border border-[rgba(124,105,199,0.28)] text-[#9D8FE0]">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </summary>
            <div className="border-t border-white/[0.07] mx-5" />
            <ol className="px-6 py-5 space-y-3">
              {[
                { href: '#part-a', label: 'Part A: Install and Wire Up Mission Control' },
                { href: '#part-b', label: 'Part B: Tour the Task Board' },
                { href: '#part-c', label: 'Part C: Explore Sample Projects' },
                { href: '#part-d', label: 'Part D: Add Your First Real Card' },
                { href: '#part-e', label: 'Part E: The AI Column (Preview)' },
              ].map(({ href, label }, i) => (
                <li key={href} className="flex items-center gap-3 group/item">
                  <span className="number-glow flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold tabular-nums" style={{ background: 'rgba(124,105,199,0.18)', color: '#9D8FE0', border: '1.5px solid rgba(124,105,199,0.30)' }}>
                    {i + 1}
                  </span>
                  <a href={href} className="text-[#FCF4EB]/58 hover:text-[#9D8FE0] text-sm leading-snug transition-colors duration-150">{label}</a>
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
        <StickyVideoPlayer videoId="5u7ArWgKNOU" title="Cohort 1, Session 7: Business Automation Masterminds" />
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">

        {/* Always start with dangerously-skip-permissions */}
        <div className="mb-10 bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
          <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Always start Claude Code this way</p>
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
            Every time you open Claude Code, use this command instead of just typing{' '}
            <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">claude</span>.
            It skips the permission prompts so you are not clicking through confirmation screens every few seconds.
          </p>
          <CodeBlock filename="Terminal" code={`claude --dangerously-skip-permissions`} />
        </div>

        {/* Part A */}
        <section id="part-a" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part A: Install Mission Control
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Mission Control is a personal task board that runs entirely on your laptop. Nothing
            is stored in the cloud, nothing requires a subscription. You install it once and it
            runs forever. Node.js is already on your machine from Session 2, so this is a
            two-command install.
          </p>

          <StepCard number={1} title="Clone and install Mission Control (approximately 10 minutes)">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Open your terminal and run this single command. It clones the repo, installs
              everything, and starts the server in one go:
            </p>
            <CodeBlock
              filename="Terminal"
              code={`git clone https://github.com/josephtandle/mastermind-mission-control-app && cd mastermind-mission-control-app && bash install.sh`}
            />
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
              The install script handles everything: dependencies, database setup, and starting
              the server. It takes about two minutes the first time.
            </p>
            <ProTip type="tip">
              If you run into any issues during install, make sure Node.js is installed on your
              machine first. You would have done this in Session 2. If not, go to{' '}
              <a href="https://nodejs.org" target="_blank" rel="noopener" className="text-[#7C69C7] hover:underline">nodejs.org</a>{' '}
              and install the LTS version before running the command above.
            </ProTip>
          </StepCard>

          <StepCard number={2} title="Wire up the task executor to Claude">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              After the install, the task executor needs to know where Claude lives on your
              machine. If it was not picked up automatically, paste this into Claude Code to fix it:
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={`Find the Claude binary and wire up the task executor to use it.

1. Locate the claude executable on this machine. Try these in order:
   - Run which claude (Mac/Linux) or where claude (Windows)
   - Check common install paths: ~/.local/bin/claude, /usr/local/bin/claude, %APPDATA%\\npm\\claude.cmd (Windows)
   - If none found, check the output of npm list -g claude or npm root -g
2. Open executor.py in this project directory.
3. Find the subprocess.run call that invokes claude. Replace the bare "claude" string with the full absolute path you found in step 1.
4. Save the file.
5. Test it by running python3 executor.py (or python executor.py on Windows). If a card is in the AI Auto Execute column, it should run. If the column is empty, confirm the script exits cleanly with "No pending cards in AI column."
6. Write DONE when the executor runs without a "not found" error.

Deploy when you're done.`}
            />
          </StepCard>

          <StepCard number={3} title="Open Mission Control in your browser">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Once the install finishes, go to this address in your browser:
            </p>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/[0.05] border border-white/[0.10] hover:border-[#7C69C7]/50 rounded-xl px-5 py-4 transition-all duration-150 group mb-4"
            >
              <div className="w-9 h-9 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/40 flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="9" rx="1.5" stroke="#9D8FE0" strokeWidth="1.5"/>
                  <path d="M5 13h6" stroke="#9D8FE0" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 11v2" stroke="#9D8FE0" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#FCF4EB] font-semibold text-sm group-hover:text-[#9D8FE0] transition-colors">
                  Open Mission Control
                </p>
                <p className="text-[#FCF4EB]/40 text-xs mt-0.5">
                  localhost:3001
                </p>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 text-[#FCF4EB]/30 group-hover:text-[#7C69C7] transition-colors">
                <path d="M2.5 11.5l9-9M5 2.5h6.5v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              Any time you want Mission Control open again, just go back to that address. Your
              board and all your cards will still be there. If the server is not running, open
              your terminal, go to the mastermind-mission-control folder, and run{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">npm start</code>.
            </p>
          </StepCard>

          <StepCard number={4} title="Wire up the task browser">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Paste this into Claude Code to verify the file browser paths and lazy loading are
              working correctly on your machine:
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={`Wire up the Mission Control file browser — verify paths and lazy loading.

You are setting up the Mission Control file browser on this machine. Complete all steps.

STEP 1 — DETECT HOME DIRECTORY
Run this and note the output:
  Mac/Linux: python3 -c "import os; print(os.path.expanduser('~'))"
  Windows:   python -c "import os; print(os.path.expanduser('~'))"

STEP 2 — VERIFY INITIAL LOAD
Run:
  curl -s -o /dev/null -w "%{http_code} | %{size_download} bytes | %{time_total}s" "http://localhost:3001/api/repo/tree?depth=2"

Expected: 200 | under 200000 bytes | under 2 seconds
If the server is not running, start it first: cd mission-control && npm run dev

STEP 3 — VERIFY LAZY EXPAND WORKS
Pick any subdirectory from the home directory and test the expand endpoint:
  Mac/Linux: DIR=$(python3 -c "import os; print(os.path.expanduser('~/Desktop'))"); curl -s -o /dev/null -w "%{http_code} | %{size_download} bytes" "http://localhost:3001/api/repo/tree?path=$(python3 -c 'import urllib.parse, os; print(urllib.parse.quote(os.path.expanduser("~/Desktop")))')&depth=1"
  Windows: Use Postman or browser: http://localhost:3001/api/repo/tree?path=C%3A%5CUsers%5CYOURNAME%5CDesktop&depth=1

Expected: 200 | under 50000 bytes

STEP 4 — FIX EXECUTOR PATH
Find the claude binary and update executor.py:
  Mac/Linux: which claude
  Windows:   where claude

Open mission-control/executor.py. Find the subprocess.run call. Replace "claude" with the full path you just found. Save the file.

STEP 5 — CONFIRM EVERYTHING
Run the executor with no pending cards to confirm it starts cleanly:
  python3 executor.py   (Mac/Linux)
  python executor.py    (Windows)

Expected last line: "No pending cards in AI column"

Write DONE when all 5 steps pass. If any step fails, write the error and NEEDS_REVIEW.

---
How the two-level loading works:
- Depth 2 on initial load — you see your top-level folders and their immediate contents without clicking anything. No blank tree, no spinner on first open.
- Depth 1 on expand — when you click into a folder that has not been loaded yet, it fetches just that folder's direct children. One network request per expand, each one tiny.
- Already-loaded nodes — if children are already in the tree from the depth-2 initial load, expanding is instant with no network call at all.`}
            />
          </StepCard>
        </section>

        {/* Part B */}
        <section id="part-b" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part B: Tour the Task Board
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            When Mission Control opens, you will see a kanban board with seven columns. Each
            column represents a stage in how work moves through your business. Here is what each
            one means:
          </p>

          <div className="space-y-3 mb-8">
            {[
              {
                name: 'Backlog',
                description: 'Ideas and tasks you have not started yet. Think of it as your inbox for future work. Everything that comes to mind goes here first.',
              },
              {
                name: 'AI (Auto Execute)',
                description: 'The automation column. Cards you move here get picked up by Claude automatically and executed without you doing anything. This is Phase 2, coming in the next session. For now, read the sample cards to see what kinds of tasks this is designed for.',
              },
              {
                name: 'Doing',
                description: 'Tasks you are actively working on right now. Keep this column short, three to five cards maximum. If it gets long, some of those things are not actually in progress.',
              },
              {
                name: 'Human Must Do',
                description: 'Tasks that only a human can handle: phone calls, important decisions, relationship conversations, anything requiring your physical presence or judgment. Claude will never touch these.',
              },
              {
                name: 'Review',
                description: 'Work that is done but needs a second look before it is finished. Claude might move a card here after completing a task so you can check its output.',
              },
              {
                name: 'Done',
                description: 'Completed. Cards move here when the work is finished and approved.',
              },
              {
                name: 'Icebox',
                description: 'Good ideas you are not doing now and do not want to lose. Not rejected, just parked. Different from Backlog, which is active. Icebox is long-term maybe.',
              },
            ].map((col) => (
              <div key={col.name} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#7C69C7]/20 text-[#7C69C7] border border-[#7C69C7]/30">
                    {col.name}
                  </span>
                </div>
                <p className="text-[#FCF4EB]/70 text-sm leading-relaxed">
                  {col.description}
                </p>
              </div>
            ))}
          </div>

          <ProTip type="tip">
            The seven columns mirror how real work actually moves: an idea forms, it gets queued,
            someone or something executes it, it gets checked, and it closes. The AI column is
            what makes this board different from every other task app you have used.
          </ProTip>
        </section>

        {/* Part C */}
        <section id="part-c" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part C: Explore Sample Projects
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Mission Control comes with five sample projects pre-loaded so the board is not empty
            when you arrive. These are realistic examples of the kind of projects a small business
            owner would actually run. Look through them to understand how the board is meant to work.
          </p>

          <StepCard number={5} title="See the five sample projects">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              The five pre-loaded sample projects are:
            </p>
            <div className="space-y-2 mb-4">
              {[
                { name: 'Email Automation System', description: 'Setting up automated sequences for leads and onboarding' },
                { name: 'Client Onboarding Portal', description: 'A structured flow for bringing new clients into your process' },
                { name: 'Content Strategy Hub', description: 'Planning, scheduling, and tracking content across platforms' },
                { name: 'Revenue Growth Tracker', description: 'Monitoring income, sources, and monthly targets' },
                { name: 'Infrastructure Setup', description: 'The tools, systems, and tech stack running your business' },
              ].map((project) => (
                <div key={project.name} className="bg-white/[0.03] border border-white/[0.07] rounded-lg px-4 py-3">
                  <p className="text-[#FCF4EB] text-sm font-semibold mb-0.5">{project.name}</p>
                  <p className="text-[#FCF4EB]/50 text-xs">{project.description}</p>
                </div>
              ))}
            </div>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              Each project has cards distributed across the columns already. Click through them
              and read what is in each card. You will start to see how a real workflow is supposed
              to look.
            </p>
          </StepCard>

          <StepCard number={6} title="Filter cards by project">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              At the top of the board there is a projects dropdown. Click it and select any project
              to filter the board to show only that project&rsquo;s cards. Click it again and select
              &ldquo;All Projects&rdquo; to go back to seeing everything.
            </p>
            <ProTip type="info">
              Filtering by project is how you focus. When you are working on one thing, filter to
              that project and everything else disappears. This matters more once your board has
              hundreds of cards across multiple areas of the business.
            </ProTip>
          </StepCard>

          <StepCard number={7} title="Add a new project">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              To create a new project: click the Projects dropdown at the top of the board, then
              select{' '}
              <strong className="text-[#FCF4EB]">+ New Project</strong>. Give it a name that
              represents something real in your business.
            </p>
            <ProTip type="tip">
              Start with the name of something you are actually working on. You will add your first
              real card to it in the next part.
            </ProTip>
          </StepCard>

          <StepCard number={8} title="Clear the samples when you are ready">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Once you have explored the sample cards and understand how the board works, you can
              remove them all at once: go to{' '}
              <strong className="text-[#FCF4EB]">Settings</strong> and choose{' '}
              <strong className="text-[#FCF4EB]">Clear Sample Cards</strong>.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              Do not do this yet if you are still in the session. Wait until you have added at
              least one real card first so the board is not empty.
            </p>
            <ProTip type="warning">
              Clearing sample cards is permanent. Only do it when you are sure you have read
              through them and are ready to start fresh with your own cards.
            </ProTip>
          </StepCard>
        </section>

        {/* Part D */}
        <section id="part-d" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part D: Add Your First Real Card
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            The fastest way to learn a task board is to put something real into it. Think of one
            actual task sitting in your head right now, something you know you need to do for your
            business. You are going to add that as your first card.
          </p>

          <StepCard number={9} title="Create the card">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Click the{' '}
              <strong className="text-[#FCF4EB]">+</strong> button at the top of the Backlog
              column. A new card form will open. Give it a title that describes the task clearly
              enough that you will know exactly what it means three weeks from now.
            </p>
            <ProTip type="tip">
              A good card title is specific. &ldquo;Follow up with leads&rdquo; is vague.
              &ldquo;Reply to the three DMs from Tuesday&rdquo; is something you can actually execute.
            </ProTip>
          </StepCard>

          <StepCard number={10} title="Assign it to a project and add detail">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Inside the card, choose a project from the dropdown. Then add a description: a sentence
              or two about what done looks like, any context Claude will need later, and any relevant
              links or notes.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              You can also add labels to tag the card. Labels are optional but useful for filtering
              later: things like{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">content</code>,{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">client</code>, or{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">marketing</code>.
            </p>
            <ProTip type="info">
              The description field matters more once you start using the AI column. Claude reads
              it to understand what to do. Write descriptions as if you are briefing someone who
              has never seen your business before.
            </ProTip>
          </StepCard>

          <StepCard number={11} title="Move the card by drag and drop">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Click and hold the card, then drag it to a different column. Try moving it to Doing,
              then to Review, then back to Backlog. That is how work moves through the board.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              Cards can also be moved by opening them and changing the status field in the card
              detail view. Drag and drop is faster for quick moves. The status dropdown is better
              when you are already reading the card.
            </p>
          </StepCard>
        </section>

        {/* Part E */}
        <section id="part-e" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part E: The AI Column (Preview)
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            You have seen the AI (Auto Execute) column in the board tour. This part explains what
            it actually does and what is coming in the next session. It also teaches you a shortcut
            for adding cards instantly using only plain English.
          </p>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 mb-6">
            <p className="text-[#FCF4EB] font-semibold text-sm mb-3">How the AI column works</p>
            <p className="text-[#FCF4EB]/70 text-sm leading-relaxed mb-4">
              In Session 8, you will wire Claude into Mission Control so it watches the AI
              (Auto Execute) column automatically. When you move a card there, Claude reads
              the title and description, figures out what needs to happen, and executes the task
              without you doing anything else.
            </p>
            <p className="text-[#FCF4EB]/70 text-sm leading-relaxed mb-4">
              This works for tasks that Claude can fully complete on its own: writing copy,
              doing research, building pages, drafting emails, generating reports. Once the task is
              done, Claude moves the card to Review so you can check the output before it is
              considered finished.
            </p>
            <p className="text-[#FCF4EB]/70 text-sm leading-relaxed">
              Tasks that need a human stay out of that column. Calls, decisions, and anything
              requiring your actual presence belong in{' '}
              <strong className="text-[#FCF4EB]">Human Must Do</strong>.
            </p>
          </div>

          <StepCard number={12} title="Read the sample AI cards">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              The sample data includes cards already in the AI (Auto Execute) column. Open a few
              of them and read the titles and descriptions. These are real examples of tasks that
              Claude can execute fully automatically once the integration is wired up.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              As you read them, think about your own business: what tasks do you do every week
              that follow a predictable pattern? Those are your best candidates for this column.
            </p>
            <ProTip type="tip">
              Good AI column tasks have clear, specific outcomes. &ldquo;Write a follow-up email
              to [client name] thanking them for the call and summarizing the three next steps
              we agreed on&rdquo; is something Claude can do completely. &ldquo;Handle the client&rdquo;
              is not.
            </ProTip>
          </StepCard>

          <StepCard number={13} title="Teach Claude your shorthand for the task board">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              You are going to give Claude a one-time instruction so that whenever you say{' '}
              <strong className="text-[#FCF4EB]">&ldquo;add this to the MC task board&rdquo;</strong>,
              it knows exactly what to do: create a card in Mission Control with the right title,
              description, and column, without you having to explain it every time.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Paste this into Claude Code. It adds a permanent note to your CLAUDE.md file, which
              is the file Claude reads at the start of every session to understand your setup:
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={`Add the following to my CLAUDE.md file:

## Mission Control Task Board

My personal task board runs at http://localhost:3001.

When I say "add this to the MC task board" or "add a card to Mission Control":
- Create a new card via POST http://localhost:3001/api/cards
- Body: { "title": "[card title]", "description": "[description]", "status": "backlog" }
- Put it in Backlog unless I specify a different column
- Confirm when done and tell me the card title`}
            />
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
              After Claude adds this, you never have to explain the board again. It becomes part
              of your permanent setup.
            </p>
            <ProTip type="info">
              CLAUDE.md is a file in your home folder that Claude reads automatically every
              time you start a session. Anything you put there becomes a standing instruction.
              Think of it as a briefing document for your AI.
            </ProTip>
          </StepCard>

          <StepCard number={14} title="Add your first real AI task">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              The board already has sample AI tasks to show you the format. Now add one of your
              own. Paste this into Claude Code, fill in your details, and it will create the card:
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              editable
              code={`Add a card to my MC task board in the AI Auto Execute column with this exact title and description:

Title: Research my top 3 competitors

Description: Search Google for "[your industry] competitors" and "[your product or service] alternatives". Find the 3 competitors that come up most often.

For each competitor:
1. Visit their website and find their pricing page
2. List every pricing tier: name, price, what is included
3. Copy their homepage headline word for word
4. Find one customer review that mentions their biggest weakness
5. Write 2 sentences on how they are positioned differently from me

Save the results as competitor-research.md on my Desktop. Use one section per competitor.`}
            />
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4 mb-4">
              Once the card is on the board, the task executor picks it up automatically and
              runs it with Claude Code. It checks the AI column once an hour. When it finishes,
              your card moves to Done or Review on its own.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              You can also chain research into action. This prompt researches, installs, and
              logs the result to your board in one shot:
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              editable
              code={`Research the [skill or tool name] Claude Code skill. Check if it's well-maintained and actually useful for someone running a small business. If it looks good, install it on my machine. Then add a card to my MC task board in the Backlog column: title "[Skill Name] installed", description what it does and why I installed it.`}
            />
            <ProTip type="tip">
              The best AI column tasks have a clear outcome you can check: a file saved, a list
              written, a report generated. Vague tasks like &ldquo;improve my marketing&rdquo;
              give Claude nothing to execute. Specific tasks like &ldquo;research my top 3
              competitors and save as competitor-research.md&rdquo; run on their own without
              any follow-up.
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
              You have a personal task board running on your laptop, a clear view of how work
              moves through the columns, and your first real card in the system. Next session,
              Claude starts executing tasks directly from that AI column automatically.
            </p>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 mb-8">
              <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">Support Each Other</p>
              <h3 className="text-xl font-bold text-[#FCF4EB] mb-3">Post in the Masterminds group</h3>
              <p className="text-[#FCF4EB]/70 leading-relaxed mb-6">
                Share a screenshot of your Mission Control board in the group. Everyone gets
                to see how others have organized their projects and what they are working on.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#7C69C7] text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Share your board screenshot</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      Post a screenshot of your Mission Control with at least one real card in it.
                      Show the group what you are actually working on right now.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#7C69C7] text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Share your AI column task idea</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      Post the card you wrote for the AI column: the title and description. Others
                      will tell you if it is specific enough for Claude to execute or if it needs
                      more detail.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#7C69C7] text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Review someone else&rsquo;s card</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      Read another member&rsquo;s AI column card description. Tell them: is it specific
                      enough for Claude to do without asking questions, or does it need more context?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#7C69C7]/50 bg-[#7C69C7]/[0.08] rounded-xl p-6">
              <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">Challenge</p>
              <p className="text-[#FCF4EB]/80 leading-relaxed">
                Before the next session, move your existing to-do list into Mission Control. Every
                task that is in your head, in a notes app, or in a spreadsheet right now belongs on
                the board. Backlog everything. At the start of Session 8 your board should reflect
                your real workload, not just the session exercise.
              </p>
            </div>
          </div>
        </section>

      </div>

      <p className="text-center text-xs text-white/20 pb-8">
        Using Codex instead of Claude Code?{' '}
        <a href="/session/2/guide-codex" className="underline hover:text-white/50 transition-colors">Codex version of this page</a>
      </p>

    </>
  )
}
