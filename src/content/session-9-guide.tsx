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

          <StepCard number={8} title="Configure Resend ONLY">
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

          <StepCard number={9} title="Turn on a starter automation and test it">
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
        </section>
      </div>

      <p className="text-center text-xs text-white/20 pb-8">
        Using Codex instead of Claude Code?{' '}
        <a href="/session/2/guide-codex" className="underline hover:text-white/50 transition-colors">Codex version of this page</a>
      </p>

    </>
  )
}
