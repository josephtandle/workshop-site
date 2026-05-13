'use client'

import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'

const CRM_RELEASE_URL = '/downloads/allsorted-crm-module-v1.5.zip'

const CRM_INSTALL_PROMPT = `Install the All Sorted CRM module into my existing Mission Control on this computer.

If the operating system is macOS, use macOS commands and paths.
If the operating system is Windows, use Windows commands and paths.

Keep going until the install is complete, tested, and working unless you hit a real blocker.

Download the CRM module from:
${CRM_RELEASE_URL}

Your rules:
1. First locate my existing Mission Control repo automatically.
2. Confirm it is the right repo before editing anything.
3. If the package zip is not already on this computer, download it first. Then extract it.
4. Back up every CRM-related file before you change it.
5. Run the packaged installer.
6. If dependencies are missing, install what is needed.
7. Look for existing Resend configuration in .env.local, .env, and nearby workspace env files.
8. If RESEND_API_KEY already exists, wire email automatically.
9. If Resend is missing, do not block the install. Finish the CRM install anyway and tell me exactly what to add later.
10. Preserve any existing CRM data. Do not overwrite it.
11. Import the included sample CRM data.
12. If Mission Control is not already running on port 3000, start it. If it needs a restart after install, restart it.
13. Run the packaged validation checks and also verify these routes in the browser:
   - /app/crm
   - /app/crm/pipeline
   - /app/crm/templates
   - /app/crm/automations
   - /app/crm/settings
14. If a test fails, fix it and rerun the validation until it passes.
15. When everything passes, open Mission Control in the browser directly to /app/crm/pipeline so I land inside the CRM immediately.
16. Only when everything passes, tell me:
   - CRM installed correctly
   - the exact Mission Control path
   - whether Resend was auto-wired
   - that the sample leads are available
   - which tests passed

Hard blockers only:
- you cannot find a real Mission Control repo
- the repo is not writable
- the app structure is too broken to patch safely`

const CRM_NULL_ERROR_PROMPT = `Fix the Mission Control CRM install in this repo so lead creation no longer crashes with NOT NULL constraint failures in lib/crm.js.

Tasks:
1. Open lib/crm.js.
2. Find the INSERT INTO crm_lead_events statement inside the lead ingest flow.
3. Add the missing created_at column to the insert column list.
4. Expand the values tuple from 9 placeholders to 10 placeholders.
5. Pass capturedAt again as the final .run() argument so created_at is populated.
6. Find function upsertSyncState and its INSERT INTO crm_sync_destinations statement inside the if (!existing) branch.
7. Add the missing created_at and updated_at columns to that insert column list.
8. Expand the values tuple from 9 placeholders to 11 placeholders.
9. Append nowIso() and nowIso() as the final two .run() arguments.
10. Save the file, restart Mission Control if needed, then verify a new lead can be created without a null / NOT NULL SQL error.

Rules:
- change only what is required for this fix
- do not remove or overwrite existing CRM data
- after patching, tell me exactly what you changed and what you verified`

const RESEND_TEST_PROMPT = `Test whether Resend email sending is working in this Mission Control repo.

Tasks:
1. Check the environment files for RESEND_API_KEY and RESEND_FROM_EMAIL.
2. Confirm whether both values exist and are non-empty.
3. If either value is missing, stop and tell me exactly what is missing.
4. If both values exist, verify the CRM email settings are using the correct sender.
5. Send one safe test email to my own email address only.
6. Report whether the send request succeeded or failed.
7. If it failed, tell me the exact error and what needs to be fixed before I continue with CRM automations.

Rules:
- only send the test to my own email address
- do not send to any real lead
- do not change unrelated code
- tell me clearly whether Resend is working or not working`

const INSTAGRAM_DM_TRIAGE_PROMPT = `Use my installed Instagram agent and my CRM together.

Goal:
Read the last 20 Instagram DM conversations, identify which ones are actual leads, and add only the real leads into my CRM with useful information filled in.

Rules:
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

Important:
- Do not send any DMs.
- Do not post anything.
- This is read, qualify, and capture only.
- If anything blocks the CRM write, stop and tell me exactly what failed.`

const INBOUND_LEAD_CAPTURE_PROMPT = `Help me use my CRM for inbound leads that are already coming in from DMs, referrals, email, or WhatsApp.

Goal:
Create a clean workflow for capturing leads into the CRM so I stop losing track of people who are already interested.

Tasks:
1. Check how leads are currently created in this CRM.
2. Show me the minimum useful fields I should fill in every time.
3. Then create 3 realistic example lead records based on these sources:
   - one Instagram DM
   - one referral
   - one email inquiry
4. For each example, fill in:
   - name
   - source
   - business or context
   - what they want
   - current stage
   - next step
   - notes
5. After that, tell me the simplest operating rule for how I should use this CRM daily.

Rules:
- Optimize for a workflow I can really keep using.
- Keep the process lightweight.
- Do not add fake complexity or unnecessary fields.`

const LEAD_ENRICHMENT_PROMPT = `Use the tools from prior sessions to make one CRM lead more useful.

Goal:
Take one lead record and enrich it using the tools we already learned so the next follow-up is smarter and easier.

Tasks:
1. Pick one lead in my CRM that has thin information.
2. Use available tools such as web fetch, profile lookup, or website research to gather only high-value context.
3. Add useful notes back into the CRM, such as:
   - what they do
   - who they help
   - relevant offer or project context
   - any detail that would help me follow up intelligently
4. Then suggest the best next step for that lead.
5. Show me exactly what changed in the CRM.

Rules:
- Only use public information or information already in my systems.
- Do not invent facts.
- Keep the final CRM note concise and actionable.`

export default function Session9Guide() {
  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-16 pb-0">
        <div className="mb-10">
          <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
            Session Nine
          </p>
          <h1 className="gradient-text text-5xl font-extrabold leading-tight mb-5 pb-1">
            Joe&apos;s Magic CRM Installation
          </h1>
          <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-6">
            Open up a terminal first so you can copy and paste the Claude command, then use this session to install the
            All Sorted CRM module into your existing Mission Control setup, validate the live CRM routes, and get the
            sample data and email wiring ready for use.
          </p>
          <div className="mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5">
            <p className="text-sm font-semibold text-[#FCF4EB]">Why this matters</p>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#FCF4EB]/68">
              <p>
                A CRM is a place to track who your leads are, where each conversation stands, what needs to happen next,
                and which follow-ups should happen automatically instead of living only in your head or inbox.
              </p>
              <p>
                We are learning it because once your pipeline gets even a little busy, money leaks out through missed
                follow-ups, slow replies, forgotten notes, and leads that never get moved forward.
              </p>
              <p>
                A useful CRM gives you one working board for your leads, your stages, your automations, your messages,
                and your settings, so you can see what is happening and act on it quickly.
              </p>
              <p>
                The income upside is simple: better lead tracking means more conversations stay warm, more prospects get
                the right follow-up at the right time, and more of the people already interested in working with you
                actually convert.
              </p>
            </div>
          </div>
          <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-6">
            Need the computer-use setup and ghost-browser practice steps first? Use{' '}
            <a href="/resource-vault/automated-ghost-computer-use" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors">
              Automated Ghost Computer Use
            </a>{' '}
            in the Resource Vault.
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
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </summary>
            <div className="border-t border-white/[0.07] mx-5" />
            <ol className="px-6 py-5 space-y-3">
              {[
                { href: '#permissions', label: 'Claude Dangerously Skip Permissions' },
                { href: '#crm-install', label: 'Install The CRM Module' },
                { href: '#crm-use', label: 'Use The CRM' },
                { href: '#lead-capture-tests', label: 'Lead Capture Tests And Prompts' },
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

      <div className="max-w-3xl mx-auto px-6 py-10">
        <section id="permissions" className="mb-16">
          <div className="mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Start Here</span>
          <h2 className="text-3xl font-bold text-[#FCF4EB] mt-3">Claude Dangerously Skip Permissions</h2>
          </div>

          <StepCard number={1} title="Open up a terminal">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              In your open terminal, start Claude in the workshop project folder before you install the CRM.
            </p>
            <CodeBlock
              filename="Terminal"
              code={`claude --dangerously-skip-permissions`}
            />
            <ProTip type="warning" className="mt-4">
              Dangerously Skip Permissions is powerful. Use it only in the project folder you mean to edit.
            </ProTip>
          </StepCard>
        </section>

        <section id="crm-install" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Install</span>
            <h2 className="text-2xl font-bold text-[#FCF4EB]">Install The CRM Module Into Mission Control</h2>
          </div>

          <StepCard number={2} title="Download, install, and open the CRM with one prompt">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Use this exact installer prompt in Claude Code. The prompt handles both Mac and Windows, finds your
              Mission Control repo, downloads and extracts the package if needed, installs anything missing, tries to
              wire Resend if it already exists, imports the sample CRM data, starts the app if it is not running, and
              opens Mission Control inside the CRM in the browser when validation is done.
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={CRM_INSTALL_PROMPT}
              editable
            />
            <details className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.03]">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-[#FCF4EB]">
                If you&apos;re getting a null error, try this prompt.
              </summary>
              <div className="border-t border-white/[0.08] px-4 py-4">
                <CodeBlock
                  filename="CRM null-error fix prompt"
                  code={CRM_NULL_ERROR_PROMPT}
                  editable
                />
              </div>
            </details>
            <ProTip type="warning" className="mt-4">
              If you use Codex instead of Claude Code, use the <strong className="text-[#FCF4EB]">Copy Codex Only</strong>
              button below the prompt block. That button adapts the installer prompt for the Codex environment.
            </ProTip>
          </StepCard>

          <StepCard number={3} title="What success looks like">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Do not stop after files are copied. The install is only done when the live Mission Control runtime has the
              CRM in the nav, the pages load on port 3000, the sample data is visible, and the validation checks pass.
            </p>
            <div className="space-y-3">
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
                <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Must pass</p>
                <ul className="space-y-1 text-[#FCF4EB]/60 text-sm">
                  <li>`CRM` appears in the main Mission Control nav</li>
                  <li>`/app/crm`, `pipeline`, `templates`, `automations`, and `settings` load</li>
                  <li>Sample leads appear in the pipeline</li>
                  <li>Starter templates and automations are present</li>
                  <li>If Resend already existed, email is auto-wired</li>
                </ul>
              </div>
            </div>
          </StepCard>
        </section>

        <section id="crm-use" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Use It</span>
            <h2 className="text-2xl font-bold text-[#FCF4EB]">Use The CRM Right Away</h2>
          </div>

          <StepCard number={4} title="Start with the sample leads">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              The package installs Golden Claw sample CRM data so you are not staring at an empty board. That gives you
              real cards to move, sample templates to inspect, and sample automations to turn on when you are ready.
            </p>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">What is included</p>
              <ul className="space-y-1 text-[#FCF4EB]/60 text-sm">
                <li>50+ believable sample leads across different stages</li>
                <li>Starter email templates</li>
                <li>Starter automations installed but disabled by default</li>
                <li>`Joe Tester &lt;newyork1@gmail.com&gt;` as one live test lead for automation practice</li>
              </ul>
            </div>
          </StepCard>

          <StepCard number={5} title="Open Settings and change the three defaults">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Go into <strong className="text-[#FCF4EB]">CRM Settings</strong> and update the three values you will use
              right away:
            </p>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <ol className="space-y-2 text-[#FCF4EB]/60 text-sm">
                <li>1. Change <strong className="text-[#FCF4EB]">Default delay</strong></li>
                <li>2. Change <strong className="text-[#FCF4EB]">Email send from</strong></li>
                <li>3. Change <strong className="text-[#FCF4EB]">Send test email to</strong></li>
              </ol>
            </div>
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
              Then press <strong className="text-[#FCF4EB]">Save Settings</strong>. This gives your automation layer the
              correct timing and sender details before you start turning anything on.
            </p>
          </StepCard>

          <StepCard number={6} title="Move cards like a real pipeline">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Open the Pipeline view and drag cards from one column to another as if you are working real leads through a
              sales process. Drop each card exactly where you want it to sit in that column.
            </p>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">What to practice</p>
              <ul className="space-y-1 text-[#FCF4EB]/60 text-sm">
                <li>Move a lead from `Possible Candidate` to `Interested`</li>
                <li>Reorder cards inside the same column by dragging them higher or lower</li>
                <li>Notice which columns have automations attached and which do not</li>
              </ul>
            </div>
            <ProTip type="tip" className="mt-4">
              This is where the CRM becomes useful. You are not just storing names, you are moving people through a
              process that shows who needs attention next.
            </ProTip>
          </StepCard>

          <StepCard number={7} title="Create a new manual lead and fill it in">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Use the add button in the pipeline or contacts view to create a new manual lead. Add enough information so
              the lead is real and actionable instead of just being a blank card.
            </p>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Good fields to fill out</p>
              <ul className="space-y-1 text-[#FCF4EB]/60 text-sm">
                <li>Name</li>
                <li>Email</li>
                <li>Phone</li>
                <li>Primary project</li>
                <li>Next step</li>
                <li>Notes</li>
                <li>Business description</li>
              </ul>
            </div>
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
              Once the lead exists, move it to the right stage so you can see how a real pipeline starts to take shape.
            </p>
          </StepCard>

          <StepCard number={8} title="Run a quick Resend test first">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Before you start building automations, run a quick Claude Code check so you know whether Resend is already
              working in this Mission Control install. That lets you catch email problems before you waste time testing
              the pipeline.
            </p>
            <CodeBlock
              filename="Claude Code resend test prompt"
              code={RESEND_TEST_PROMPT}
              editable
            />
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
              If Claude reports that Resend is not working yet, fix that first. It is much easier to solve email setup
              before you start debugging templates and automation rules.
            </p>
          </StepCard>

          <StepCard number={9} title="Lead-capture test: read the last 20 Instagram DMs and add real leads">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Once the Instagram agent is installed, this is the first real sales workflow to practice. The point is not
              to automate outreach. The point is to review inbound conversations, identify actual opportunities, and get
              the right people into the CRM with useful notes.
            </p>
            <CodeBlock filename="Claude Code prompt" code={INSTAGRAM_DM_TRIAGE_PROMPT} editable />
          </StepCard>

          <StepCard number={10} title="Lead-capture test: create example inbound leads from different sources">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Not all leads start on Instagram. Use this prompt to practice the same CRM logic for referrals, email
              inquiries, and other inbound channels so your operating system is bigger than one platform.
            </p>
            <CodeBlock filename="Claude Code prompt" code={INBOUND_LEAD_CAPTURE_PROMPT} editable />
          </StepCard>

          <StepCard number={11} title="Lead-capture test: enrich one lead before follow-up">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              This ties Session 8 and Session 9 together. Use research and web fetch to make one CRM lead more
              actionable before you follow up.
            </p>
            <CodeBlock filename="Claude Code prompt" code={LEAD_ENRICHMENT_PROMPT} editable />
            <ProTip type="tip" className="mt-4">
              The CRM stores the lead, and your research tools make the next message or call sharper.
            </ProTip>
          </StepCard>
        </section>

        <section id="lead-capture-tests" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Tests</span>
            <h2 className="text-2xl font-bold text-[#FCF4EB]">Lead Capture Tests And Prompts</h2>
          </div>

          <StepCard number={12} title="Configure Resend ONLY">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              If it was not found automatically, email stays disabled until you add your own values. Open your Mission
              Control project&apos;s `.env.local` and add:
            </p>
            <CodeBlock
              filename="Environment values"
              code={`RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=hello@yourdomain.com`}
            />
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
              Then restart Mission Control, open CRM Settings, and confirm email sending is now available.
            </p>
          </StepCard>

          <StepCard number={13} title="Update your CRM Settings before testing">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Go back into <strong className="text-[#FCF4EB]">CRM Settings</strong> and make sure the defaults are set
              for a fast demo run using your own email.
            </p>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Change these settings now</p>
              <ol className="space-y-2 text-[#FCF4EB]/60 text-sm">
                <li>1. Set <strong className="text-[#FCF4EB]">Default delay</strong> to <strong className="text-[#FCF4EB]">0</strong> or <strong className="text-[#FCF4EB]">1</strong> minute for now.</li>
                <li>2. Set <strong className="text-[#FCF4EB]">Email send from</strong> to the address you want the demo emails to come from.</li>
                <li>3. Set <strong className="text-[#FCF4EB]">Send test email to</strong> to your own inbox.</li>
              </ol>
            </div>
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
              Save those settings before you continue. That makes the demo fast, and it ensures the test email goes to
              the inbox you are actually watching.
            </p>
          </StepCard>

          <StepCard number={14} title="Review a starter automation and queue flow">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Go to <strong className="text-[#FCF4EB]">Templates</strong> to review the starter copy, then go to
              <strong className="text-[#FCF4EB]"> Automations</strong> and enable one example email automation.
              Move a sample lead into the matching stage, approve it if needed, and confirm the message reaches the queue.
            </p>
            <ProTip type="tip" className="mt-4">
              The safest first test is to use the sample lead with a real inbox, then confirm the automation through the
              CRM Approval and Delivery Queue before trusting it on your own real leads.
            </ProTip>
          </StepCard>

          <StepCard number={15} title="Create a template">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Open <strong className="text-[#FCF4EB]">Templates</strong> and create a message you would actually want a
              new lead to receive. The template is the content the automation sends when a lead reaches the matching stage.
            </p>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">How to create it</p>
              <ol className="space-y-2 text-[#FCF4EB]/60 text-sm">
                <li>1. Click the button to add a new template.</li>
                <li>2. Give the template a clear name so you can recognize it later.</li>
                <li>3. Choose the channel you want to use, which for this demo should be email.</li>
                <li>4. Write a subject line and body that fit someone who just became interested.</li>
                <li>5. Save the template, then reopen it once to confirm the content saved correctly.</li>
              </ol>
            </div>
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
              Keep the copy simple. For the demo, one short follow-up email is enough as long as it is clearly saved and
              available in the template list.
            </p>
          </StepCard>

          <StepCard number={16} title="Create an automation">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Go to <strong className="text-[#FCF4EB]">Automations</strong> and create a rule that uses the template you
              just made. The automation connects a pipeline stage change to a specific outgoing message.
            </p>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Setup process</p>
              <ol className="space-y-2 text-[#FCF4EB]/60 text-sm">
                <li>1. Click to add a new automation.</li>
                <li>2. Name it something obvious, like `Interested follow-up`.</li>
                <li>3. Leave the project set to the pipeline you are testing.</li>
                <li>4. Set the destination stage to <strong className="text-[#FCF4EB]">Interested</strong>.</li>
                <li>5. Choose <strong className="text-[#FCF4EB]">Email</strong> as the channel.</li>
                <li>6. Select the template you created in the previous step.</li>
                <li>7. Save the automation and make sure it is enabled.</li>
              </ol>
            </div>
            <ProTip type="tip" className="mt-4">
              The automation is not useful until the stage, channel, and template all line up. Check those three settings
              before you move on.
            </ProTip>
          </StepCard>

          <StepCard number={17} title="Test the automation">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Create or use a test card that contains your own email address, then move that card into a column that has
              the automation attached to it.
            </p>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Exact test flow</p>
              <ol className="space-y-2 text-[#FCF4EB]/60 text-sm">
                <li>1. Make sure the test lead record contains your real email address.</li>
                <li>2. Open the Pipeline view.</li>
                <li>3. Drag that test card into the <strong className="text-[#FCF4EB]">Interested</strong> column.</li>
                <li>4. Use the <strong className="text-[#FCF4EB]">Interested</strong> column specifically, because the demo includes an automation for that stage.</li>
                <li>5. Check the Approval or Delivery Queue and confirm the message was generated.</li>
                <li>6. Make sure you actually receive the email in your inbox before treating the automation as working.</li>
              </ol>
            </div>
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
              If nothing happens, go back and verify the template exists, the automation is enabled, and the card was
              dropped into <strong className="text-[#FCF4EB]">Interested</strong> rather than a different stage. The test
              is only complete once the email reaches your inbox.
            </p>
          </StepCard>
        </section>
      </div>

      <p className="text-center text-xs text-white/20 pb-8">
        Using Codex instead of Claude Code?{' '}
        <a href="/session/2/guide-codex" className="underline hover:text-white/50 transition-colors">Codex version of this page</a>
      </p>

    </>
  )
}
