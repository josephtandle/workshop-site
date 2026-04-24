'use client'

import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'
import { celebrate } from '@/lib/celebrate'

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

          {/* Table of Contents */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 sm:px-6 py-5">
            <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-4">
              In This Session
            </p>
            <ol className="space-y-2">
              {[
                { href: '#part-a', label: 'Part A: Install Mission Control' },
                { href: '#part-b', label: 'Part B: Tour the Task Board' },
                { href: '#part-c', label: 'Part C: Explore Sample Projects' },
                { href: '#part-d', label: 'Part D: Add Your First Real Card' },
                { href: '#part-e', label: 'Part E: The AI Column (Preview)' },
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
            runs forever. Node.js is already on your machine from Session 2, and Claude Code is
            already installed, so this installation is a single command.
          </p>

          <StepCard number={1} title="Clone the Mission Control repo">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Open your terminal and run this command. It downloads Mission Control to your machine:
            </p>
            <CodeBlock
              filename="Terminal"
              code={`git clone https://github.com/josephtandle/mastermind-mission-control`}
            />
            <ProTip type="info">
              This URL will be live before the session. If you run it early and it does not work yet,
              check back the day before.
            </ProTip>
          </StepCard>

          <StepCard number={2} title="Run the install script">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Run this command to install dependencies, start the server, and open the app in your browser:
            </p>
            <CodeBlock
              filename="Terminal"
              code={`cd mastermind-mission-control && bash install.sh`}
            />
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4 mb-4">
              The install script handles everything. Your browser should open automatically to{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">http://localhost:3001</code>.
            </p>
            <ProTip type="tip">
              If the browser does not open automatically, go to{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">http://localhost:3001</code>{' '}
              in your browser manually. The server is running, the tab just did not pop up on its own.
            </ProTip>
          </StepCard>

          <StepCard number={3} title="How to reopen it later">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              After this session, whenever you want Mission Control open again, run these two
              things in your terminal:
            </p>
            <CodeBlock
              filename="Terminal"
              code={`cd mastermind-mission-control && npm start`}
            />
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
              Then go to{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">http://localhost:3001</code>{' '}
              in your browser. That is it. Your data is saved locally, so everything you added before
              will still be there.
            </p>
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

          <StepCard number={4} title="See the five sample projects">
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

          <StepCard number={5} title="Filter cards by project">
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

          <StepCard number={6} title="Add a new project">
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

          <StepCard number={7} title="Clear the samples when you are ready">
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

          <StepCard number={8} title="Create the card">
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

          <StepCard number={9} title="Assign it to a project and add detail">
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

          <StepCard number={10} title="Move the card by drag and drop">
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
            it actually does and what is coming in the next session.
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

          <StepCard number={11} title="Read the sample AI cards">
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

          <StepCard number={12} title="Add one task you want Claude to handle automatically">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Before the end of the session, add at least one card to Backlog that you are
              planning to move into the AI column once Session 8 is done. Write the description
              the way you would want to brief Claude: clear outcome, relevant context, nothing
              left ambiguous.
            </p>
            <CodeBlock
              filename="Paste into Claude Code"
              editable
              code={`I have a task board called Mission Control running at http://localhost:3001. Help me write a really good card description for an AI column task.

The task is: [DESCRIBE THE TASK YOU WANT CLAUDE TO HANDLE]

Write a title and description for this card that is specific enough for Claude to execute without asking any follow-up questions.`}
            />
            <ProTip type="info">
              You do not need to move it to the AI column yet. Just get it written well. The
              wiring happens next session.
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
    </>
  )
}
