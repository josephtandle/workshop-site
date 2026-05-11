import Link from 'next/link'
import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'

export const metadata = {
  title: 'Connecting to Google Sheets',
  description:
    'Use Composio Connect to connect Claude Code to Google Sheets, then build Eric Horn’s CultureRoot investor outreach database step by step.',
}

export default function ConnectingToGoogleSheetsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-14">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Resource Vault
        </p>
        <h1 className="gradient-text text-4xl font-extrabold leading-tight mb-5 pb-1">
          Connecting to Google Sheets
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-8">
          This guide shows Eric Horn how to connect Claude Code to Google Sheets through Composio
          Connect, then use that setup to build a live investor research database for CultureRoot.
        </p>
        <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 border-t border-white/[0.08] pt-6">
          <span><span className="text-[#FCF4EB]/30 mr-2">Platform</span>Composio Connect</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">For</span>Eric Horn / CultureRoot</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Goal</span>Investor outreach database</span>
        </div>
      </div>

      <details className="mb-12 rounded-2xl overflow-hidden border border-white/[0.10] bg-[linear-gradient(145deg,rgba(124,105,199,0.07),rgba(255,255,255,0.03))] shadow-[0_8px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.07)]">
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
            { href: '#setup', label: 'Start Here — Claude Dangerously Skip Permissions' },
            { href: '#part-a', label: 'Part A — Connect Claude Code to Google Sheets with Composio' },
            { href: '#part-b', label: 'Part B — Build Eric Horn’s CultureRoot investor outreach database' },
            { href: '#part-c', label: 'Part C — What to watch on the free plan' },
          ].map((item, index) => (
            <li key={item.href}>
              <a href={item.href} className="group flex items-start gap-3 text-sm text-[#FCF4EB]/72 hover:text-[#FCF4EB] transition-colors">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-[rgba(124,105,199,0.32)] bg-[rgba(124,105,199,0.12)] text-[11px] font-semibold text-[#9D8FE0] group-hover:bg-[rgba(124,105,199,0.18)]">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{item.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </details>

      <section id="setup" className="mb-16">
        <div className="mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Start Here</span>
          <h2 className="text-3xl font-bold text-[#FCF4EB] mt-3">Claude Dangerously Skip Permissions</h2>
        </div>

        <StepCard number={1} title="Run Claude in the open terminal">
          <p>
            In Eric&apos;s open terminal, start Claude before you do any of the Google Sheets or Composio setup.
            This is the standard workshop starting point and keeps the rest of the guide consistent.
          </p>
          <CodeBlock
            filename="Terminal"
            code="claude --dangerously-skip-permissions"
          />
        </StepCard>
      </section>

      <section id="part-a" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part A</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Connect Claude Code to Google Sheets with Composio</h2>
        </div>

        <StepCard number={1} title="Create the Composio account">
          <p>
            Open{' '}
            <Link
              href="https://app.composio.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2"
            >
              app.composio.dev
            </Link>{' '}
            and create an account. This is the fastest setup path for Eric because Composio handles the
            Google OAuth flow without making him build his own Google Cloud credentials first.
          </p>
          <p>
            Also keep these reference pages open while you set it up:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <Link
                href="https://docs.composio.dev/docs/composio-connect"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2"
              >
                Composio Connect docs
              </Link>
            </li>
            <li>
              <Link
                href="https://docs.composio.dev/toolkits/googlesheets"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2"
              >
                Google Sheets toolkit docs
              </Link>
            </li>
          </ul>
          <ProTip type="info">
            The free plan currently includes 20,000 standard tool calls per month, which is more than
            enough for a normal investor research workflow.
          </ProTip>
        </StepCard>

        <StepCard number={2} title="Add Composio Connect to Claude Code">
          <p>
            Run both lines below in order. The first adds the MCP server. The second opens the MCP panel so
            you can confirm it is there.
          </p>
          <CodeBlock
            filename="Run in Terminal"
            code={`claude mcp add --transport http composio https://connect.composio.dev/mcp --scope user
/mcp`}
          />
          <ProTip type="warning">
            The Composio MCP registration is not reliably available inside the current Claude session. After
            you run this command, close the terminal window and start a fresh Claude session.
          </ProTip>
        </StepCard>

        <StepCard number={3} title="Close Terminal and reopen Claude in a fresh session">
          <p>
            After you add Composio, close the terminal window completely. Then open a new terminal window and
            start Claude again so the new MCP server is available in the fresh session.
          </p>
          <CodeBlock
            filename="Run in the new Terminal window"
            code="claude --dangerously-skip-permissions"
          />
        </StepCard>

        <StepCard number={4} title="Let Claude trigger the Composio login and Google Sheets auth">
          <p>
            You do not need to pre-connect Google Sheets in the Composio dashboard first. The normal flow is
            to add Composio to Claude Code, then let Claude request authorization when it actually needs Google
            Sheets. Composio should generate the OAuth link for you automatically.
          </p>
          <CodeBlock
            codexPrompt
            filename="Paste into Claude Code"
            code={`Use Composio to connect Google Sheets for this user.

If authorization is needed:
1. Generate the OAuth link
2. Open the link in my browser
3. Tell me that I need to click the link to connect to Google Sheets and that the link will expire in 10 minutes
4. Wait for me to complete the authorization

Do not create or edit any spreadsheets yet.`}
          />
          <ProTip type="tip">
            This is the most portable setup order because it works on any computer without requiring the user
            to hunt through the Composio dashboard UI first.
          </ProTip>
        </StepCard>

        <StepCard number={5} title="Finish the Google Sheets connection after you click the link">
          <p>
            Once you have clicked the Google authorization link in the browser, paste this next prompt into
            Claude so it completes the connection and confirms that Google Sheets is available.
          </p>
          <CodeBlock
            codexPrompt
            filename="Paste into Claude Code"
            code={`I clicked the Google Sheets authorization link and completed the browser flow.

Now:
1. Finish the Composio connection
2. Verify that Google Sheets is connected and available in this session
3. Tell me clearly whether it worked

Do not create or edit any spreadsheets yet.`}
          />
        </StepCard>

        <StepCard number={6} title="Verify the Google Sheets tools are available">
          <p>
            Before you try to create anything, have Claude inspect the connected tools and confirm that
            Google Sheets actions are reachable through Composio.
          </p>
          <CodeBlock
            codexPrompt
            filename="Paste into Claude Code"
            code={`Inspect the available tools and confirm whether Composio Connect is active in this environment.

Then tell me:
1. Whether Google Sheets tools are available through Composio
2. Whether web research tools are available for investor discovery and enrichment
3. What the best path is to create and update a Google Sheet from here

Do not create anything yet. Just verify the setup and summarize what you found.`}
          />
          <ProTip type="tip">
            If Claude can see Composio but not Google Sheets, return to the Composio dashboard and make
            sure the Google connection actually finished.
          </ProTip>
        </StepCard>
      </section>

      <section id="part-b" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest whitespace-nowrap">Part B</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Build Eric Horn&apos;s CultureRoot investor outreach database</h2>
        </div>

        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(124, 105, 199, 0.12) 0%, rgba(245, 195, 198, 0.08) 100%)',
            border: '1px solid rgba(124, 105, 199, 0.22)',
          }}
        >
          <p className="text-[#FCF4EB] font-semibold mb-2">What Eric is actually building</p>
          <p className="text-sm text-[#FCF4EB]/70 leading-relaxed">
            CultureRoot is a documentary startup focused on subcultures and the creator economy. Eric is
            raising a seed round and needs a repeatable way to identify angels and strategic investors who
            fit documentary media, creator tools, culture, travel, and next-generation production.
          </p>
        </div>

        <div className="webfetch-hero-glass rounded-2xl p-7 mb-7">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <span className="h-2 w-2 rounded-full bg-[#9D8FE0] shadow-[0_0_18px_rgba(157,143,224,0.75)]" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#FCF4EB]/42 font-semibold">
                WebFetch
              </span>
            </div>
            <p className="text-[#FCF4EB]/86 text-lg leading-relaxed mb-5">
              WebFetch is a workshop-grade internet toolkit. It gives Claude the ability to read pages,
              extract structured data, use a real browser when needed, and pull research into a usable form.
            </p>
            <p className="text-[#FCF4EB]/64 leading-relaxed">
              For Eric, this matters because the hard part is not creating the spreadsheet. The hard part is
              finding investor targets, understanding their thesis, and turning that research into a clean,
              repeatable workflow.
            </p>
          </div>
        </div>

        <StepCard number={5} title="Install WebFetch if it&apos;s not already installed">
          <p>
            Paste this into Claude Code only if WebFetch is not already available in Eric&apos;s environment.
            It installs the toolkit, checks the dependencies, and registers the skills in the workspace.
          </p>
          <CodeBlock
            editable
            codexPrompt
            filename="Paste into Claude Code"
            code={`Install WebFetch from GitHub and register its skills for this workspace.

Repository:
https://github.com/josephtandle/ultimate-web-fetch

Do the following carefully:
1. Detect whether I am on macOS, Windows, or Linux before choosing commands.
2. Use a normal persistent install, not an ephemeral npx-only run.
3. Resolve my home directory dynamically and install into a Tools/ultimate-web-fetch folder inside that home directory.
   Use ~ on macOS/Linux and $env:USERPROFILE or $HOME on Windows. Do not hard-code an absolute path.
4. Use PowerShell-safe commands on Windows and shell-safe commands on macOS/Linux.
5. If the folder already exists, pull the latest main branch. Otherwise clone the repo.
6. Run npm install inside the repo.
7. Run npx playwright install chromium.
8. Try to make the command available globally by running npm install -g . from inside the repo.
   If global npm install fails because of permissions, do not use sudo and do not force it. Use the local node src/index.js path instead.
9. Install all required dependencies for the operating system:
   - If FFmpeg or yt-dlp are missing, install them via Homebrew (macOS), winget (Windows), or the detected package manager (Linux).
   - On macOS, Homebrew-managed Python blocks pip installs due to PEP 668 — do not use --break-system-packages and do not pip install into the system Python.
     Instead, create a Python 3.12 virtualenv at ~/Tools/ultimate-web-fetch/.venv using:
     python3.12 -m venv ~/Tools/ultimate-web-fetch/.venv
     Install scrapling, browser-use, langchain-openai, and shot-scraper into it:
     ~/Tools/ultimate-web-fetch/.venv/bin/pip install scrapling browser-use langchain-openai shot-scraper
     Then run: ~/Tools/ultimate-web-fetch/.venv/bin/shot-scraper install
     Create a .env file in the repo root with these two lines. Resolve the home directory dynamically — do not hardcode the username:
     WEBFETCH_PYTHON=<resolved-home>/Tools/ultimate-web-fetch/.venv/bin/python3.12
     SHOT_SCRAPER_BIN=<resolved-home>/Tools/ultimate-web-fetch/.venv/bin/shot-scraper
   - On Windows or Linux, use a virtualenv in the same Tools/ultimate-web-fetch folder and create the same .env file with the correct resolved paths.
   - If admin permission is required for any step, explain exactly what I need to approve.
10. Run npm run check.
11. Run node src/index.js preflight from inside the repo directory — not the global webfetch command — so it reads the .env file.
12. After preflight, every line in the output must show "installed": true.
13. Test one fetch command. Prefer webfetch if the global command works; otherwise use node src/index.js:
    webfetch fetch https://example.com --format markdown
14. Find my workspace skills.md or SKILLS.md file. If neither exists, create SKILLS.md in the most appropriate workspace/root folder.
15. Append a section called "WebFetch" without deleting or rewriting any existing skills.
16. In that section, register these skills:
    - webfetch fetch: read a public webpage and return Markdown, text, JSON, or HTML
    - webfetch extract: pull specific elements with CSS selectors
    - webfetch screenshot: capture full-page or visible-page screenshots
    - webfetch pdf: save a page as a PDF
    - webfetch media: download public or authorized video/audio for offline analysis
    - webfetch batch: fetch multiple URLs from one manifest
    - webfetch cache: reuse recent fetches and clear cached pages when needed
    - webfetch preflight: verify local tools before a workshop or client task
17. Add usage examples for each skill using the correct command for my installation.
18. Do not store cookies, downloaded media, screenshots, cache files, or private tokens in skills.md or SKILLS.md.
19. Report exactly what changed, where WebFetch was installed, whether the global webfetch command works, and whether preflight passed.`}
          />
        </StepCard>

        <div className="webfetch-hero-glass rounded-2xl p-7 mb-7">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <span className="h-2 w-2 rounded-full bg-[#9D8FE0] shadow-[0_0_18px_rgba(157,143,224,0.75)]" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#FCF4EB]/42 font-semibold">
                What WebFetch Is
              </span>
            </div>
            <p className="text-[#FCF4EB]/86 text-lg leading-relaxed mb-5">
              WebFetch is an agent built by Joe Che which wraps some of the most useful web fetch tools
              together, allowing you to easily take things from the internet and bring them into Claude in a
              clean, usable form.
            </p>
            <p className="text-[#FCF4EB]/64 leading-relaxed">
              Think of it as a workshop-grade internet toolkit. It helps Claude choose the right method for
              the job: quick page reading when the site is simple, a real browser when the site is dynamic,
              media downloading when you are allowed to save a video, and explicit safety checks when cookies,
              private pages, or browser control are involved.
            </p>
          </div>
        </div>

        <p className="text-[#FCF4EB] font-semibold mb-4">This includes:</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {[
            {
              title: 'Scraping Data',
              desc: 'Pull page text, tables, links, prices, headlines, and repeated elements into structured output.',
            },
            {
              title: 'Grabbing Videos',
              desc: 'Download public or authorized video and audio for transcription, clipping, analysis, and archiving.',
            },
            {
              title: 'Moving Your Mouse and Clicking',
              desc: 'Have your computer move your mouse, click things for you, scroll pages, and reveal dynamic content when a real browser is required.',
            },
            {
              title: 'One WebFetch Package',
              desc: 'A compilation of multiple skills in one WebFetch workflow, so Claude can route the task instead of making you choose the tool by hand.',
            },
          ].map(({ title, desc }) => (
            <div key={title} className="webfetch-feature-card group rounded-xl p-5">
              <div className="relative z-10">
                <p className="text-[#FCF4EB] font-semibold text-base mb-2">{title}</p>
                <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 mb-4">
          <p className="text-[#FCF4EB] font-semibold mb-2">The engines underneath</p>
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
            WebFetch is a router. It looks at the job and chooses the best local engine instead of
            making you remember which tool fits which situation.
          </p>
        </div>

        <div className="space-y-4 mt-4 mb-10">
          <div className="bg-[linear-gradient(135deg,rgba(245,195,198,0.12),rgba(124,105,199,0.08))] border border-white/[0.10] rounded-xl p-5">
            <p className="text-[#FCF4EB] font-semibold text-sm mb-2">yt-dlp: The Media Retriever</p>
            <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
              yt-dlp is the media engine behind <strong className="text-[#FCF4EB]">webfetch media</strong>.
              It supports many common video, social, audio, education, news, and livestream sites including
              YouTube, Vimeo, TikTok, Instagram, X/Twitter, Reddit, Twitch, SoundCloud, Facebook, and many
              podcast or news video pages.
            </p>
            <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
              Use it for public or authorized video and audio downloads when Eric wants reference clips,
              transcription inputs, or offline review material.
            </p>
          </div>

          <div className="bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] border border-white/[0.09] rounded-xl p-5">
            <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Scrapling: The Fast Static Scraper</p>
            <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
              Scrapling is for pages that do not need a browser. It is usually faster than Playwright because
              it fetches and parses the page directly. Use it for blogs, docs, public articles, simple landing
              pages, and other pages where the useful content is already present in the HTML.
            </p>
          </div>

          <div className="bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] border border-white/[0.09] rounded-xl p-5">
            <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Playwright: The Real Browser Scraper</p>
            <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
              Playwright opens Chromium and lets the page run JavaScript before Claude reads it. Use this
              when a site loads content after the page opens, hides data behind tabs, needs scrolling, or has
              a modern app interface.
            </p>
          </div>

          <div className="bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] border border-white/[0.09] rounded-xl p-5">
            <p className="text-[#FCF4EB] font-semibold text-sm mb-2">browser-use: The Autonomous Browser Agent</p>
            <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
              browser-use is for multi-step web tasks where Claude needs to browse, decide, click through
              pages, compare results, or keep going until it finds something. It is more agentic than a
              normal fetch, so use it for research workflows rather than simple extraction.
            </p>
          </div>
        </div>

        <StepCard number={6} title="Create the Google Sheet and the core columns">
          <p>
            This first prompt creates the spreadsheet and gives it a structure that matches Eric&apos;s
            fundraising workflow rather than a generic CRM.
          </p>
          <CodeBlock
            codexPrompt
            filename="Paste into Claude Code"
            code={`Use Composio Google Sheets tools to create a new spreadsheet called "CultureRoot Investor Outreach Database".

Inside it:
1. Use the default first worksheet only
2. Add this header row exactly in this order:
   - Investor Name
   - Firm
   - Investor Type
   - Stage Fit
   - Geography
   - Thesis
   - Why They Fit CultureRoot
   - Relevant Media / Creator Investments
   - Warm Intro Path
   - Email
   - LinkedIn
   - Priority
   - Status
   - Next Move
   - Notes
3. Freeze the header row if the tool allows it
4. Return the spreadsheet URL when finished
5. Open it in my browser

Do not add investor rows yet.`}
          />
        </StepCard>

        <StepCard number={7} title="Find, add, and enrich the right investors in one prompt">
          <p>
            Eric does not need random investors. He needs angels and strategics who make sense for a
            documentary startup sitting at the intersection of media, creator economy, travel, culture,
            and AI-native production. This prompt handles the discovery, writes the best investors into the
            sheet, enriches them, and gives him a ready-to-review starting database.
          </p>
          <CodeBlock
            editable
            codexPrompt
            filename="Paste into Claude Code"
            code={`Use WebFetch, Composio Google Sheets tools, and any available research tools to build the first version of the "CultureRoot Investor Outreach Database".

Context:
- CultureRoot is a documentary startup focused on subcultures and the creator economy
- Eric Horn is raising a seed round
- The company is AI-native in how it approaches production workflows
- Diane Schutz brings Anthony Bourdain documentary production credibility

Task:
1. Identify [NUMBER] angel investors, seed funds, and strategic investors who are plausible fits for CultureRoot
2. Prioritize investors with evidence of interest in:
   - documentary media
   - creator economy
   - media and entertainment
   - travel, culture, or community-driven storytelling
   - next-generation production, creator tools, or AI-enabled media
3. Look for comparable companies and productions that may have taken outside investment, and use that to surface adjacent investors
4. Use search strategies such as:
   - documentary media startup investors
   - seed investors in creator economy media
   - investors in travel media startups
   - entertainment seed fund documentary
   - media venture fund creator economy
   - investors in companies similar to [INSERT COMPARABLES IF KNOWN]
5. Add the best investor targets directly into the "CultureRoot Investor Outreach Database" spreadsheet
6. Fill these columns for each investor:
   - Investor Name
   - Firm
   - Investor Type
   - Stage Fit
   - Geography
   - Thesis
   - Why They Fit CultureRoot
   - Relevant Media / Creator Investments
   - Priority
   - Status
   - Notes
7. Set Status = Profiled for rows you have researched well
8. Be conservative. If data is weak or unclear, leave cells blank instead of guessing
9. Open the spreadsheet in my browser when finished
10. Then summarize the strongest investor matches in chat

Use this editing guidance:
- [NUMBER] = how many investors to find in this batch
- keep the strongest matches first
- if the connection is weak, say so clearly in Notes`}
          />
          <ProTip type="tip">
            Start with a small batch like 10. Once the outputs are good, Eric can rerun the same prompt with
            a larger number or narrower investor criteria.
          </ProTip>
        </StepCard>

        <StepCard number={10} title="Generate Eric&apos;s outreach angles from the profiled investors">
          <p>
            Once the top investors are profiled, use Claude to turn that research into warm intro asks and
            direct outreach angles tailored to CultureRoot.
          </p>
          <CodeBlock
            codexPrompt
            filename="Paste into Claude Code"
            code={`Read the investors in the "CultureRoot Investor Outreach Database" spreadsheet whose Priority is "High" and Status is "Profiled".

For each high-priority investor:
1. Write a short outreach angle tailored to CultureRoot
2. Suggest whether Eric should pursue a warm intro, direct email, or LinkedIn message
3. Draft one concise first-touch message
4. Update these sheet columns:
   - Warm Intro Path
   - Next Move
   - Notes

Keep the messaging grounded in CultureRoot's strengths:
- documentary storytelling around subcultures and the creator economy
- AI-native production workflows
- Diane Schutz's Anthony Bourdain production credibility
- Eric Horn's enterprise and media systems background`}
          />
        </StepCard>
      </section>

      <section id="part-c">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part C</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">What to watch on the free plan</h2>
        </div>

        <StepCard number={9} title="Know what is free and what can become premium">
          <p>
            Composio&apos;s free tier includes 20,000 standard tool calls per month. That is likely plenty for
            Eric if he is mainly creating one sheet, updating rows in batches, and running targeted investor
            research sessions.
          </p>
          <p>
            The main thing to watch is premium-tool usage. Some search, scraping, and compute-heavy actions
            are tracked separately, so if you later build a much more aggressive automated discovery loop, that
            is the area most likely to hit limits first.
          </p>
          <p className="text-[#FCF4EB] font-semibold pt-2">Useful links:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <Link
                href="https://composio.dev/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2"
              >
                Composio pricing
              </Link>
            </li>
            <li>
              <Link
                href="https://docs.composio.dev/docs/composio-connect"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2"
              >
                Composio Connect docs
              </Link>
            </li>
            <li>
              <Link
                href="https://docs.composio.dev/toolkits/googlesheets"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2"
              >
                Google Sheets toolkit
              </Link>
            </li>
            <li>
              <Link
                href="https://docs.composio.dev/toolkits/premium-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2"
              >
                Premium tools
              </Link>
            </li>
          </ul>
          <ProTip type="warning">
            For Eric&apos;s first version, keep the workflow simple: connect Google Sheets, create the investor
            database, enrich in controlled batches, and only automate further if the workflow proves useful.
          </ProTip>
        </StepCard>
      </section>
    </main>
  )
}
