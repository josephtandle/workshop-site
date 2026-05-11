import Link from 'next/link'
import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'

export const metadata = {
  title: 'Eric Horn Investor Pipeline: Activepieces + Google Sheets + WebFetch',
  description:
    'Step-by-step guide to connect Activepieces to Google Sheets, wire it into Claude Code, create Eric Horn’s investor spreadsheet, and enrich it with WebFetch.',
}

export default function EricInvestorPipelinePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-14">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Resource Vault
        </p>
        <h1 className="gradient-text text-4xl font-extrabold leading-tight mb-5 pb-1">
          Eric Horn Investor Pipeline:
          <br />
          Activepieces + Google Sheets + WebFetch
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-8">
          This is the cleanest version of the workflow: connect Google once, let Claude Code create
          the spreadsheet, and use WebFetch to research and enrich investors directly into the sheet.
        </p>
        <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 border-t border-white/[0.08] pt-6">
          <span><span className="text-[#FCF4EB]/30 mr-2">For</span>Eric Horn</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Goal</span>Investor research workflow</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Duration</span>~45 to 60 minutes</span>
        </div>
      </div>

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 sm:px-6 py-5 mb-12">
        <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-4">
          In This Guide
        </p>
        <ol className="space-y-2">
          {[
            { href: '#part-a', label: 'Part A — Set up Activepieces and connect Google' },
            { href: '#part-b', label: 'Part B — Connect Activepieces to Claude Code' },
            { href: '#part-c', label: 'Part C — Create Eric’s investor spreadsheet' },
            { href: '#part-d', label: 'Part D — Use WebFetch to enrich investors' },
            { href: '#part-e', label: 'Part E — What stays free and what to watch' },
          ].map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-sm text-[#FCF4EB]/70 hover:text-[#7C69C7] transition-colors">
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </div>

      <section id="part-a" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part A</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Set up Activepieces and connect Google</h2>
        </div>

        <StepCard number={1} title="Create the Activepieces account">
          <p>
            Open{' '}
            <Link
              href="https://cloud.activepieces.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2"
            >
              cloud.activepieces.com
            </Link>{' '}
            and create an account. This is the managed version, which is the easiest way to get Eric
            moving today.
          </p>
          <ProTip type="info">
            Do not self-host this for Eric right now. Self-hosting is useful later if this becomes core
            infrastructure, but it adds friction to the first setup.
          </ProTip>
        </StepCard>

        <StepCard number={2} title="Connect the Google Sheets account inside Activepieces">
          <p>
            Once inside Activepieces, go to the Google Sheets integration and connect Eric’s Google account.
            Approve the Google permissions so Activepieces can create and update spreadsheets on his behalf.
          </p>
          <p>
            The easiest page to use is the Google Sheets integration itself:
          </p>
          <CodeBlock
            filename="Open this in the browser"
            code="https://www.activepieces.com/pieces/google-sheets"
          />
          <ProTip type="warning">
            Make sure Eric connects the Google account that should actually own the investor spreadsheet.
            Do not connect a random personal account unless that is where he wants the file to live.
          </ProTip>
        </StepCard>

        <StepCard number={3} title="Turn on the MCP server and copy the server URL">
          <p>
            In Activepieces, go to <strong>Settings → MCP Server</strong>, turn it on, and copy the MCP
            server URL. Claude Code will use that URL to talk to Activepieces.
          </p>
          <CodeBlock
            filename="What you are looking for"
            code="An MCP server URL from Activepieces that looks like: https://[your-instance]/mcp"
          />
          <ProTip type="tip">
            Activepieces handles OAuth in the browser when Claude first needs it. That is why this path
            is easier than building raw Google OAuth credentials from scratch.
          </ProTip>
        </StepCard>
      </section>

      <section id="part-b" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part B</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Connect Activepieces to Claude Code</h2>
        </div>

        <StepCard number={4} title="Add the Activepieces MCP server in Claude Code">
          <p>
            Open Claude Code in the terminal and run this command. Replace the placeholder with Eric’s
            actual Activepieces MCP URL.
          </p>
          <CodeBlock
            editable
            filename="Run in Terminal"
            code={`claude mcp add --transport http activepieces [PASTE-ACTIVEPIECES-MCP-URL] --scope user`}
          />
          <p>
            After that, open the MCP panel inside Claude Code:
          </p>
          <CodeBlock
            filename="Inside Claude Code"
            code="/mcp"
          />
          <p>
            Claude should prompt for browser authentication if Activepieces needs it. Complete that login flow.
          </p>
        </StepCard>

        <StepCard number={5} title="Verify Claude can see both Activepieces and WebFetch">
          <p>
            Before creating anything, check that the two key capabilities are present: one tool path for
            spreadsheet actions and one tool path for investor research.
          </p>
          <CodeBlock
            codexPrompt
            filename="Paste into Claude Code"
            code={`Inspect the tools available in this environment and confirm two things for me before we continue:

1. Whether Activepieces MCP is connected and usable for Google Sheets actions
2. Whether WebFetch or equivalent browser research tools are available for web enrichment

Do not create or edit anything yet. Just verify what tools are available and summarize the result.`}
          />
          <ProTip type="warning">
            If Activepieces is connected but WebFetch is missing, stop and fix that first. The whole point
            of this workflow is that Claude can both research and write.
          </ProTip>
        </StepCard>
      </section>

      <section id="part-c" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part C</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Create Eric’s investor spreadsheet</h2>
        </div>

        <StepCard number={6} title="Create the spreadsheet and the Investors tab">
          <p>
            This prompt tells Claude to create the file, make the main worksheet, and set up a structure that
            matches Eric’s fundraising workflow.
          </p>
          <CodeBlock
            codexPrompt
            filename="Paste into Claude Code"
            code={`Use Activepieces Google Sheets tools to create a new spreadsheet called "CultureRoot Investor Pipeline".

Inside it:
1. Create a worksheet named "Investors"
2. Add this header row in order:
   - Investor Name
   - Firm
   - Investor Type
   - Stage Fit
   - Thesis
   - Why Fit for CultureRoot
   - Relevant Media / Creator Bets
   - Warm Intro Path
   - Email
   - LinkedIn
   - Priority
   - Status
   - Next Move
   - Notes
3. Freeze the header row if the sheet tool allows it
4. Return the spreadsheet URL when finished

Do not add investor rows yet.`}
          />
        </StepCard>

        <StepCard number={7} title="Seed the spreadsheet with the first investor names">
          <p>
            Start with a short list first. You can use summit attendees, LinkedIn connections, known angels,
            or specific investor names Joe wants Eric to target.
          </p>
          <CodeBlock
            editable
            codexPrompt
            filename="Paste into Claude Code"
            code={`Add these investor names as starter rows in the "Investors" worksheet of the "CultureRoot Investor Pipeline" spreadsheet.

Only fill these columns for now:
- Investor Name
- Firm
- Investor Type
- Priority
- Status

Use:
- Priority = High, Medium, or Low
- Status = Researching

Here is the starter list:
[PASTE INVESTOR NAMES AND FIRMS HERE]

Do not guess missing data yet. Leave unknown cells blank and confirm when the starter rows are in place.`}
          />
          <ProTip type="tip">
            Keep the first batch to 10 to 20 names. That is enough to prove the workflow without creating a cleanup problem.
          </ProTip>
        </StepCard>
      </section>

      <section id="part-d" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part D</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Use WebFetch to enrich investors</h2>
        </div>

        <StepCard number={8} title="Enrich the first 10 investors with web research">
          <p>
            This is the real engine. Claude reads the sheet, researches each investor, and writes the findings back.
          </p>
          <CodeBlock
            codexPrompt
            filename="Paste into Claude Code"
            code={`Read the first 10 investor rows from the "Investors" worksheet in the "CultureRoot Investor Pipeline" spreadsheet where Status = Researching.

For each investor:
1. Use WebFetch or the available web research tools to find:
   - current firm
   - investor type and stage fit
   - investment thesis
   - relevant media, creator economy, entertainment, travel, culture, or adjacent bets
   - email if confidently available
   - LinkedIn profile if confidently available
   - a short reason they may fit CultureRoot
   - a possible warm intro path if one is visible from public context or supplied notes
2. Write the findings back into the sheet
3. Set Status = Enriched
4. Keep Notes concise and factual

Do not hallucinate missing data. Leave cells blank if you cannot verify them.
When finished, summarize the 3 strongest-fit investors.`}
          />
        </StepCard>

        <StepCard number={9} title="Generate outreach angles from the enriched rows">
          <p>
            Once the rows are enriched, Claude can turn the research into practical messaging angles without
            sending anything yet.
          </p>
          <CodeBlock
            codexPrompt
            filename="Paste into Claude Code"
            code={`Look at the rows in the "Investors" worksheet where Status = Enriched and Priority = High.

For each one:
1. Write a short outreach angle in the "Next Move" column
2. Make the angle specific to that investor's thesis or portfolio
3. Keep it to one sentence, practical and non-hypey
4. Do not write a full email yet

Then give me the 5 best next moves in plain English in the chat.`}
          />
        </StepCard>

        <StepCard number={10} title="Batch the workflow for the next wave">
          <p>
            Once the first batch works, use the same structure for wave two. This keeps Eric out of random tab chaos.
          </p>
          <CodeBlock
            editable
            codexPrompt
            filename="Paste into Claude Code"
            code={`Take this next batch of investor names and append them to the "Investors" worksheet.

Starter list:
[PASTE NEXT BATCH HERE]

Set:
- Priority = Medium by default
- Status = Researching

Then enrich only the first 5 of the new rows using the same research standards as before.`}
          />
        </StepCard>
      </section>

      <section id="part-e">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part E</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">What stays free and what to watch</h2>
        </div>

        <StepCard number={11} title="How long Activepieces stays free for Eric">
          <p>
            As of May 10, 2026, the official Activepieces cloud pricing page shows:
          </p>
          <CodeBlock
            filename="Current official pricing summary"
            code={`Standard plan:
- Free
- then $5 per active flow per month
- 10 free active flows
- Unlimited runs
- AI agents
- Unlimited MCP servers
- Unlimited tables

Community Edition:
- Free and open source
- Self-hosted
- Core features only
- Needs technical skills`}
          />
          <p>
            Official sources:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <Link
                href="https://www.activepieces.com/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2"
              >
                Activepieces pricing
              </Link>
            </li>
            <li>
              <Link
                href="https://www.activepieces.com/docs/install/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2"
              >
                Activepieces self-hosted overview
              </Link>
            </li>
          </ul>
          <ProTip type="warning">
            The practical answer is: Eric should stay free as long as he stays within the included 10 free active
            flows on the cloud plan. But pricing can change, so treat this as the current policy, not a lifetime promise.
          </ProTip>
        </StepCard>

        <StepCard number={12} title="The clean recommendation">
          <p>
            For Eric right now, the best path is:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Use Activepieces cloud first because setup is easier.</li>
            <li>Keep the workflow small: one investor spreadsheet, one main worksheet, one research loop.</li>
            <li>Do not overbuild flows on day one.</li>
            <li>If this becomes a core part of his fundraising engine, revisit self-hosting later.</li>
          </ol>
          <ProTip type="info">
            The goal is not “become an Activepieces power user.” The goal is “give Eric a repeatable investor research machine.”
          </ProTip>
        </StepCard>
      </section>
    </main>
  )
}
