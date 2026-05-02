'use client'

import type { ReactNode } from 'react'
import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'

type UseCaseIcon = 'reporting' | 'research' | 'form' | 'qa' | 'monitoring' | 'pricing'

function WebFetchUseCaseIcon({ type }: { type: UseCaseIcon }) {
  const paths: Record<UseCaseIcon, ReactNode> = {
    reporting: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 15v-4" />
        <path d="M12 15V8" />
        <path d="M16 15v-6" />
      </>
    ),
    research: (
      <>
        <circle cx="10.5" cy="10.5" r="5.5" />
        <path d="m15 15 5 5" />
        <path d="M8.5 10.5h4" />
      </>
    ),
    form: (
      <>
        <path d="M7 3h7l3 3v15H7z" />
        <path d="M14 3v4h4" />
        <path d="M10 11h5" />
        <path d="M10 15h5" />
      </>
    ),
    qa: (
      <>
        <path d="M9 3h6" />
        <path d="M10 3v5l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V3" />
        <path d="M8 15h8" />
      </>
    ),
    monitoring: (
      <>
        <path d="M5 5h14v11H5z" />
        <path d="M8 19h8" />
        <path d="M12 16v3" />
        <path d="M8 11h2l1.5-3 2 6 1.5-3h2" />
      </>
    ),
    pricing: (
      <>
        <path d="M12 2v20" />
        <path d="M17 6.5A4 4 0 0 0 12 5c-2.2 0-4 1.1-4 2.8s1.8 2.4 4 3.2 4 1.5 4 3.2S14.2 17 12 17a5 5 0 0 1-5-2" />
      </>
    ),
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {paths[type]}
      </g>
    </svg>
  )
}

export default function Session8Guide() {
  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-16 pb-0">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
            Section 8
          </p>
          <h1 className="gradient-text text-5xl font-extrabold leading-tight mb-5 pb-1">
            Safety and WebFetch
          </h1>
          <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-6">
            This session gives Claude a practical internet toolkit: fetch pages, scrape data, save visual proof,
            download authorized media, and use browser automation carefully. The goal is power with guardrails.
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

          {/* Table of Contents */}
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
                { href: '#setup',      label: 'Claude Dangerously Skip Permissions' },
                { href: '#install',    label: 'Install and Register WebFetch' },
                { href: '#part-a',     label: 'WebFetch' },
                { href: '#examples',   label: 'Using WebFetch Examples' },
                { href: '#tools',      label: 'Tools Inside WebFetch' },
                { href: '#use-cases',  label: 'WebFetch Real-World Use Cases' },
                { href: '#mlx-whisper',label: 'Local Whisper and Diarization' },
                { href: '#guarddog',   label: 'Installing GuardDog' },
                { href: '#virustotal', label: 'VirusTotal API Key' },
                { href: '#wrap-up',    label: 'Wrap-Up' },
              ].map(({ href, label }, i) => (
                <li key={href} className="flex items-center gap-3 group/item">
                  <span
                    className="number-glow flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold tabular-nums"
                    style={{ background: 'rgba(124,105,199,0.18)', color: '#9D8FE0', border: '1.5px solid rgba(124,105,199,0.30)' }}
                  >
                    {i + 1}
                  </span>
                  <a
                    href={href}
                    className="text-[#FCF4EB]/58 hover:text-[#9D8FE0] text-sm leading-snug transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </details>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <section id="setup" className="mb-16">
          <div className="mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Start Here</span>
            <h2 className="text-3xl font-bold text-[#FCF4EB] mt-3">Claude Dangerously Skip Permissions</h2>
          </div>

          <StepCard number={1} title="Run Claude in the open terminal">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              In your open terminal, start Claude in the workshop project folder before you install WebFetch.
            </p>
            <CodeBlock
              filename="Terminal"
              code={`claude --dangerously-skip-permissions`}
            />
          </StepCard>
        </section>

        {/* ====================================================
            INSTALL WEBFETCH
        ==================================================== */}
        <section id="install" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Install</span>
            <h2 className="text-2xl font-bold text-[#FCF4EB]">Install and Register WebFetch</h2>
          </div>

          <StepCard number={2} title="Install and register skills">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Paste this prompt into the Claude session you already opened. Claude will download the public GitHub repo,
              install the dependencies, verify the tool, and add the skill notes to your
              <strong className="text-[#FCF4EB]"> skills.md</strong> or <strong className="text-[#FCF4EB]">SKILLS.md</strong> file.
            </p>
            <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-4">
              Use <strong className="text-[#FCF4EB]">npm</strong> for the persistent install. Use
              <strong className="text-[#FCF4EB]"> npx</strong> only for one-time setup commands like installing
              Playwright's Chromium browser.
            </p>
            <CodeBlock
              filename="Claude Code prompt"
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
    The global webfetch preflight will not pick up the .env unless run from the repo directory.
12. After preflight, every line in the output must show "installed": true.
    If any tool still shows false, do not proceed — diagnose and fix it before continuing.
    "All core tools ready" in the status line is not enough; check each tool individually.
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
    Preferred command if global install worked: webfetch
    Fallback command if local path is needed: resolve the home-directory-relative path to the installed repo, then run node src/index.js.
18. Do not store cookies, downloaded media, screenshots, cache files, or private tokens in skills.md or SKILLS.md.
19. Report exactly what changed, where WebFetch was installed, whether the global webfetch command works, and whether preflight passed.

Make sure to install all of the required dependencies necessary to install everything.`}
              editable
            />
          </StepCard>
        </section>

        {/* ====================================================
            WEBFETCH
        ==================================================== */}
        <section id="part-a" className="mb-16">
          <div className="mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">WebFetch</span>
            <h2 className="text-3xl font-bold text-[#FCF4EB] mt-3">Take the Internet Apart</h2>
          </div>

          <div className="webfetch-hero-glass rounded-2xl p-7 mb-7">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <span className="h-2 w-2 rounded-full bg-[#9D8FE0] shadow-[0_0_18px_rgba(157,143,224,0.75)]" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#FCF4EB]/42 font-semibold">
                  Local Internet Toolkit
                </span>
              </div>
              <p className="text-[#FCF4EB]/86 text-lg leading-relaxed mb-5">
                WebFetch is an agent built by Joe Che which wraps some of the most useful web fetch
                tools together, allowing you to easily take things from the internet and bring them into Claude in a
                clean, usable form.
              </p>
              <p className="text-[#FCF4EB]/64 leading-relaxed">
                Think of it as a workshop-grade internet toolkit. It helps Claude choose the right method for the job:
                quick page reading when the site is simple, a real browser when the site is dynamic, media downloading
                when you are allowed to save a video, and explicit safety checks when cookies, private pages, or browser
                control are involved.
              </p>
            </div>
          </div>

          <p className="text-[#FCF4EB] font-semibold mb-4">This includes:</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: 'research' as const, title: 'Scraping Data', desc: 'Pull page text, tables, links, prices, headlines, and repeated elements into structured output.' },
              { icon: 'monitoring' as const, title: 'Grabbing Videos', desc: 'Download public or authorized video and audio for transcription, clipping, analysis, and archiving.' },
              { icon: 'form' as const, title: 'Moving Your Mouse and Clicking', desc: 'Have your computer move your mouse, click things for you, scroll pages, and reveal dynamic content when a real browser is required.' },
              { icon: 'pricing' as const, title: 'One WebFetch Package', desc: 'A compilation of multiple skills in one WebFetch workflow, so Claude can route the task instead of making you choose the tool by hand.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="webfetch-feature-card group rounded-xl p-5">
                <div className="relative z-10 flex items-start gap-4">
                  <div className="aspect-square w-14 rounded-xl flex items-center justify-center text-[#CFC5FF] bg-[#7C69C7]/18 group-hover:bg-[#7C69C7]/28 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_12px_30px_rgba(0,0,0,0.18)] transition-colors [&_svg]:h-7 [&_svg]:w-7">
                    <WebFetchUseCaseIcon type={icon} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#FCF4EB] font-semibold text-base mb-2">{title}</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            USING WEBFETCH EXAMPLES
        ==================================================== */}
        <section id="examples" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Examples</span>
            <h2 className="text-2xl font-bold text-[#FCF4EB]">Using WebFetch Examples</h2>
          </div>

          <StepCard number={3} title="Fetch a competitor's pricing page">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              WebFetch is instant market research. Give Claude a URL and it will read the page and analyze it for you:
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={`Using WebFetch, fetch the pricing page at [https://www.mastermindshq.business] and summarize:
- What plans do they offer and at what price?
- What is included in each plan?
- What are they emphasizing as their main selling points?
- What is missing that we offer?`}
              editable
            />
          </StepCard>

          <StepCard number={4} title="Research process before a sales call">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Before a call, have Claude pull together everything publicly available about the person or company:
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={`I have a sales call in 30 minutes with [Elon Musk] from [SpaceX].
Using WebFetch, research their public website and give me:
- What the company does in one sentence
- Who their likely customers are
- Any recent content or initiatives worth mentioning
- One smart question I could ask that shows I did my homework`}
              editable
            />
          </StepCard>

          <StepCard number={5} title="Download an Instagram video">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Use a public Instagram post as the class demo. Claude should still confirm authorization before
              using browser cookies or touching private media.
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={`Using WebFetch, download this Instagram [https://www.instagram.com/p/DXjFr6DE37Q/].`}
              editable
            />
            <ProTip type="warning" className="mt-4">
              This is usually against the terms of service for most companies and websites. While it is not illegal,
              things against terms of service can be dangerous to your account and could potentially be infringing on
              the rights of other creatives. Please use responsibly and wisely. I am not responsible for any negative
              consequences of using this. This is a tool, like having a knife in your house; it is a tool to be used wisely.
            </ProTip>
          </StepCard>
        </section>

        {/* ====================================================
            TOOLS INSIDE
        ==================================================== */}
        <section id="tools" className="mb-16">
          <div className="mt-8 mb-4">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Tool Stack</span>
            <h2 className="text-2xl font-bold text-[#FCF4EB] mt-3 mb-3">Tools Inside WebFetch</h2>
            <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
              These are the practical commands Claude can use after the tool is installed and registered in your
              skills file. Each one is meant for a different kind of web task.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {[
              {
                title: 'Fetch: Page Reader',
                desc: 'Reads a public webpage and gives Claude the useful content back as Markdown, text, JSON, or raw HTML. Use it for articles, pricing pages, landing pages, help docs, product pages, and competitor research.',
              },
              {
                title: 'Extract: Precision Puller',
                desc: 'Pulls a precise piece of a page with a CSS selector. Use it when you want every link, every headline, every price, all buttons, a table, or one repeated element instead of a full-page summary.',
              },
              {
                title: 'Screenshot: Visual Proof',
                desc: 'Captures a page visually. Use it for design QA, before-and-after checks, proof that a page rendered correctly, or when Claude needs to inspect layout rather than just text.',
              },
              {
                title: 'PDF: Permanent Record',
                desc: 'Saves a webpage as a PDF. Use it for client research archives, receipts, policy pages, references, or anything you want to preserve exactly as it appeared at the time.',
              },
              {
                title: 'Media: Video and Audio Capture',
                desc: 'Downloads public or authorized video/audio through yt-dlp for offline analysis, transcription, clipping, or reference. This is the command students will use for demos like public Reels, YouTube videos, podcast clips, or approved client media.',
              },
              {
                title: 'Batch: Many URLs at Once',
                desc: 'Runs the same fetch workflow across a list of URLs. Use it for competitor lists, source lists, lead research, content monitoring, or pulling many product pages into one research pass.',
              },
              {
                title: 'Cache: Faster Iteration',
                desc: 'Reuses recent fetches so Claude does not keep hitting the same page while you iterate. Clear the cache when a page changed or when you need a fresh read.',
              },
              {
                title: 'Preflight + Status: Readiness Check',
                desc: 'Checks whether the local install is healthy: Node, Playwright, optional Python tools, shot-scraper, and yt-dlp. Status shows what the agent is doing or what failed.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] border border-white/[0.10] rounded-xl p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
                <p className="text-[#FCF4EB] font-semibold text-sm mb-2">{title}</p>
                <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">{desc}</p>
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

          <div className="space-y-4 mt-4">
            <div className="bg-[linear-gradient(135deg,rgba(245,195,198,0.12),rgba(124,105,199,0.08))] border border-white/[0.10] rounded-xl p-5">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">yt-dlp: The Media Retriever</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
                yt-dlp is the media engine behind <strong className="text-[#FCF4EB]">webfetch media</strong>.
                It supports thousands of extractor targets, including many common video, social, audio, education,
                news, and livestream sites. Examples commonly supported by yt-dlp include YouTube, Vimeo, TikTok,
                Instagram, X/Twitter, Reddit, Twitch, SoundCloud, Facebook, and many podcast or news video pages.
              </p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
                What it can download: public media, direct video/audio URLs, many embedded players, subtitles when
                available, audio-only versions, and authenticated media only when you explicitly provide browser
                cookies and are allowed to access that content.
              </p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                What it cannot reliably download: DRM-protected streaming services, private posts you cannot access,
                paywalled content you are not authorized to use, expired or geo-blocked videos, and sites that changed
                their player after yt-dlp last updated. Even listed sites can break, so the honest test is to try the
                URL and keep yt-dlp updated.
              </p>
            </div>

            <div className="bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] border border-white/[0.09] rounded-xl p-5">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Playwright: The Real Browser Scraper</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                Playwright opens Chromium and lets the page run JavaScript before Claude reads it. Use this when a
                site loads content after the page opens, hides data behind tabs, needs scrolling, or has a modern app
                interface. It is heavier than a simple HTTP fetch, but it sees the page closer to how a real visitor
                sees it.
              </p>
            </div>

            <div className="bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] border border-white/[0.09] rounded-xl p-5">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Beautiful Soup: The HTML Surgeon</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                Beautiful Soup is a lightweight HTML parser. It does not act like a browser and it does not run the
                page. Use it after a page has already been fetched when you want to walk the HTML cleanly: find all
                links, pull headings, remove navigation, extract table rows, or isolate repeated elements.
              </p>
            </div>

            <div className="bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] border border-white/[0.09] rounded-xl p-5">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Scrapling: The Fast Static Scraper</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                Scrapling is for pages that do not need a browser. It is usually faster than Playwright because it
                fetches and parses the page directly. Use it for blogs, docs, public articles, simple landing pages,
                and other pages where the useful content is already present in the HTML.
              </p>
            </div>

            <div className="bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] border border-white/[0.09] rounded-xl p-5">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">shot-scraper: The Screenshot Specialist</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                shot-scraper is a screenshot specialist. Use it when you need repeatable screenshots, multiple
                viewport sizes, selector screenshots, JavaScript setup before capture, or a batch of screenshots
                from a YAML file.
              </p>
            </div>

            <div className="bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] border border-white/[0.09] rounded-xl p-5">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">browser-use: The Autonomous Browser Agent</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                browser-use is for multi-step web tasks where Claude needs to browse, decide, click through pages,
                compare results, or keep going until it finds something. It is more agentic than normal fetch, so use
                it for research workflows rather than simple extraction.
              </p>
            </div>

            <div className="bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] border border-white/[0.08] rounded-xl p-5">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">OpenCLI Adapters: Known-Site Shortcuts</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                OpenCLI adapters are meant to be deterministic shortcuts for sites with known structures. When an
                adapter exists, the tool can use that adapter instead of spending tokens or browser time figuring out
                the site. This is optional and currently sits at the bottom of the stack because the core workshop
                value comes from fetch, extraction, screenshots, PDFs, and yt-dlp media workflows.
              </p>
            </div>
          </div>
        </section>

        {/* ====================================================
            WEBFETCH REAL-WORLD USE CASES
        ==================================================== */}
        <section id="use-cases" className="mb-16">
          <div className="mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Example Real-World Cases</span>
            <h2 className="text-3xl font-bold text-[#FCF4EB] mt-3">WebFetch Real-World Use Cases</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              {
                icon: 'reporting' as const,
                title: 'Daily reporting',
                desc: 'Have Claude log into your analytics dashboard every morning, take a screenshot, and summarize the numbers in a WhatsApp message.',
              },
              {
                icon: 'research' as const,
                title: 'Lead research',
                desc: 'Paste a list of company names. Claude fetches each website and builds a one-line summary for each prospect.',
              },
              {
                icon: 'form' as const,
                title: 'Form automation',
                desc: 'You describe what you want to create. Claude opens your project management tool and fills in the form.',
              },
              {
                icon: 'qa' as const,
                title: 'QA testing',
                desc: 'Ship a new page on your site. Claude clicks through it as a real visitor and flags anything broken or confusing.',
              },
              {
                icon: 'monitoring' as const,
                title: 'Content monitoring',
                desc: 'Fetch your industry news sources every morning and get a 3-bullet briefing on what is worth knowing.',
              },
              {
                icon: 'pricing' as const,
                title: 'Pricing intelligence',
                desc: 'Fetch the pricing pages of 5 competitors and get a side-by-side breakdown with recommendations for your own pricing.',
              },
            ].map(({ icon, title, desc }, index) => (
              <div key={title} className="group bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] border border-white/[0.10] rounded-xl p-5 shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
                <div className="flex items-start gap-4 mb-4">
                  <div className="aspect-square w-14 rounded-xl flex items-center justify-center text-[#CFC5FF] bg-[#7C69C7]/18 group-hover:bg-[#7C69C7]/28 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_12px_30px_rgba(0,0,0,0.18)] transition-colors [&_svg]:h-7 [&_svg]:w-7">
                    <WebFetchUseCaseIcon type={icon} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#FCF4EB]/35 font-semibold mb-1">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <p className="text-[#FCF4EB] font-semibold text-sm">{title}</p>
                  </div>
                </div>
                <p className="text-[#FCF4EB]/58 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

        </section>

        {/* ====================================================
            LOCAL WHISPER
        ==================================================== */}
        <section id="mlx-whisper" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Local Audio</span>
            <h2 className="text-2xl font-bold text-[#FCF4EB]">Install Local Whisper and Diarization</h2>
          </div>

          <StepCard number={6} title="Install Whisper, model downloads, and diarization">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Use one Claude prompt to set up local transcription for your operating system. On Apple Silicon Macs,
              Claude should use MLX Whisper. On Windows, Linux, or Intel Macs, Claude should use faster-whisper.
              The setup installs two diarization options so you can choose what fits your recording.
            </p>
            <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-4">
              Diarization means speaker labels — Whisper transcribes the words, diarization identifies who said them.
              You have two options:
            </p>
            <ul className="space-y-2 mb-4 pl-1">
              <li className="flex items-start gap-2 text-sm text-[#FCF4EB]/60 leading-relaxed">
                <span className="text-[#7C69C7] mt-0.5">→</span>
                <span><strong className="text-[#FCF4EB]">simple-diarizer</strong> — fully local, no account needed, installs in one command. Best for short or medium recordings with a small number of speakers.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#FCF4EB]/60 leading-relaxed">
                <span className="text-[#7C69C7] mt-0.5">→</span>
                <span><strong className="text-[#FCF4EB]">pyannote.audio</strong> — more powerful for long recordings with many speakers. Requires a free Hugging Face account and accepting the model terms once. Sign up at huggingface.co — it is free.</span>
              </li>
            </ul>
            <CodeBlock
              filename="Claude Code prompt"
              code={`Install local Whisper transcription and both diarization options for this computer.

Do the following carefully:
1. Detect whether I am on macOS, Windows, or Linux.
2. Detect whether this Mac is Apple Silicon. Use MLX Whisper only on Apple Silicon Macs.
3. Resolve my home directory dynamically. Do not hard-code an absolute path.
4. Create a Tools folder inside my home directory and install into a local-whisper folder there.
   Use the correct home-directory-relative path for this operating system instead of an absolute path.
5. Create a Python virtual environment inside that folder.
6. Install FFmpeg if it is missing.
   On macOS, use Homebrew if available.
   On Windows, use winget or the official FFmpeg install command.
   On Linux, use the detected package manager.
7. Install simple-diarizer — the fully local option, no account required:
   pip install simple-diarizer
8. Install pyannote.audio — the more powerful option for long recordings with many speakers:
   pip install pyannote.audio torch torchaudio
   Note: pyannote requires a free Hugging Face account and accepting the model terms at huggingface.co.
   Install the package now. The speaker model download (step 13) will only work once the user has a token.
9. If this is an Apple Silicon Mac, also install:
   pip install mlx-whisper
10. If this is Windows, Linux, or an Intel Mac, install:
    pip install faster-whisper
11. Download the Whisper models now so class does not pause later.
    Apple Silicon MLX downloads:
    - mlx-community/whisper-tiny
    - mlx-community/whisper-large-v3-mlx
    Windows/Linux/Intel Mac faster-whisper downloads:
    - Systran/faster-whisper-small
    - Systran/faster-whisper-large-v3
12. Store downloaded models under a models folder inside the local-whisper folder.
13. If I already have a Hugging Face token and accepted the pyannote model terms, download pyannote/speaker-diarization-3.1 into the models folder.
    If I do not have a token yet, do not fail the install — tell me the package is ready and the speaker model download needs Hugging Face access.
14. Run import smoke tests for both simple_diarizer and pyannote.audio.
15. Create a short README or notes file inside the local-whisper folder with:
    - how to activate the environment on this operating system
    - the exact transcription command for this operating system
    - the simple-diarizer command for quick speaker labels
    - the pyannote command for detailed multi-speaker diarization
    - where the downloaded models are stored
16. Run smoke tests:
    - Python imports for the installed Whisper package
    - Python import for simple_diarizer
    - Python import for pyannote.audio
    - ffmpeg -version
17. Report what was installed, which Whisper backend was chosen, which models downloaded, whether simple-diarizer is ready, and whether pyannote is ready or waiting for Hugging Face access.`}
              editable
            />
          </StepCard>

          <StepCard number={7} title="Transcribe the downloaded video">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Point your local Whisper install at the media file you downloaded with WebFetch. Use the
              small model for a live demo, then switch to the larger model when quality matters. The exact command
              depends on whether your installer chose MLX Whisper or faster-whisper.
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={`Transcribe the Instagram video I downloaded with WebFetch.

Source Instagram URL:
[https://www.instagram.com/p/DXjFr6DE37Q/]

Handle the common paths for me:
1. Find the media file WebFetch downloaded for the source URL above.
2. Search the normal download locations first:
   - this project folder
   - my Downloads folder
   - any WebFetch output, media, downloads, or cache folder inside my home directory
3. If there is exactly one likely matching media file, use it.
4. If there are multiple likely files, show me the filenames, sizes, and modified times, then ask me to choose.
5. If no matching file exists, use WebFetch to download the source Instagram URL first, then continue.
6. Use the notes file created during the local-whisper install to choose the correct command for my operating system and Whisper backend.
7. First run the fast/small model for a live demo.
8. Then show me the command for the larger model.
9. Save the transcript and SRT file next to the media file.
10. For speaker labels, use simple-diarizer by default — it requires no account and works immediately.
    If the recording is long or has many speakers, use pyannote instead (only if the speaker model is already downloaded).
11. If neither diarizer is ready, transcribe without speaker labels and tell me exactly what is missing.
12. Finish by reporting the source URL, media file path, transcript path, SRT path, and whether speaker labels were created.`}
              editable
            />
          </StepCard>
        </section>

        {/* ====================================================
            INSTALLING GUARDDOG
        ==================================================== */}
        <section id="guarddog" className="mb-16">
          <div className="mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Safety Layer</span>
            <h2 className="text-3xl font-bold text-[#FCF4EB] mt-3">Installing GuardDog</h2>
          </div>

          <div className="webfetch-hero-glass rounded-2xl p-7 mb-6">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <span className="h-2 w-2 rounded-full bg-[#F5C3C6] shadow-[0_0_18px_rgba(245,195,198,0.62)]" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#FCF4EB]/42 font-semibold">
                  Package Safety Check
                </span>
              </div>
              <p className="text-[#FCF4EB]/84 text-lg leading-relaxed mb-5">
                GuardDog is a command-line safety tool that checks packages before you install or trust them. It is
                designed to spot risky patterns like credential harvesters, obfuscated scripts, suspicious install
                hooks, crypto miners, reverse shells, and other common supply-chain attacks.
              </p>
              <p className="text-[#FCF4EB]/64 leading-relaxed">
                This install is intentionally simple: one npm install command, then one setup command. It works as a
                one-click style install across platforms that support Node and npm, including macOS, Windows, and
                Linux. Students still get the commands in their own copy blocks so Claude Code users and Codex users
                can paste the safest version for their tool.
              </p>
            </div>
          </div>

          <StepCard number={8} title="Install GuardDog">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Use the Copy Claude Code button for Claude Code. Use the Copy Codex Only button for Codex. Both versions
              should install GuardDog, run setup, and confirm the command is ready before you use it to inspect packages.
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={`Install GuardDog and confirm it is ready to use on this computer.

Run these commands:
npm install -g github:josephtandle/guardog
guardog setup

After setup:
1. Confirm the guardog command is available.
2. Tell me where npm installed the global command.
3. Run a harmless version or help check if GuardDog supports one.
4. Explain how I should use GuardDog before installing unfamiliar packages.`}
              editable
            />
          </StepCard>

          <ProTip type="warning">
            GuardDog is a safety layer, not a guarantee. Use it before installing unfamiliar packages, but still read
            package names carefully, prefer trusted sources, and avoid running commands you do not understand.
          </ProTip>
        </section>

        {/* ====================================================
            VIRUSTOTAL
        ==================================================== */}
        <section id="virustotal" className="mb-16">
          <div className="mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Safety Layer</span>
            <h2 className="text-3xl font-bold text-[#FCF4EB] mt-3">Get Your VirusTotal API Key</h2>
          </div>

          <div className="webfetch-hero-glass rounded-2xl p-7 mb-6">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <span className="h-2 w-2 rounded-full bg-[#F5C3C6] shadow-[0_0_18px_rgba(245,195,198,0.62)]" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#FCF4EB]/42 font-semibold">
                  File and URL Scanner
                </span>
              </div>
              <p className="text-[#FCF4EB]/84 text-lg leading-relaxed mb-5">
                VirusTotal is a free online scanner that checks files, URLs, domains, and IP addresses against
                over 70 antivirus engines and security tools at once. Where GuardDog checks package code for
                suspicious patterns before you install, VirusTotal lets you scan the actual file or URL against
                the world&apos;s largest collective threat database.
              </p>
              <p className="text-[#FCF4EB]/64 leading-relaxed">
                The free API tier gives you <strong className="text-[#FCF4EB]">500 requests per day</strong> with
                a rate limit of <strong className="text-[#FCF4EB]">4 requests per minute</strong>. That is more
                than enough for personal use, client work, and workshop exercises. You only need a free account —
                no credit card required.
              </p>
            </div>
          </div>

          <StepCard number={9} title="Create a free VirusTotal account and get your API key">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Paste this into Claude to walk through the account setup and get your key saved somewhere useful.
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={`Help me get a free VirusTotal API key and set it up on this computer.

1. Open https://www.virustotal.com in my browser.
2. Tell me to click Sign In and create a free account if I do not already have one. No credit card is needed.
3. Once I confirm I am logged in, tell me to go to my profile (top-right avatar) and click API Key.
4. Tell me to copy the key shown there.
5. Save my API key to my environment by adding this line to my shell profile (~/.zshrc on macOS or ~/.bashrc on Linux):
   export VIRUSTOTAL_API_KEY="<my key>"
   Resolve the home directory dynamically. Do not hard-code a path.
6. Reload the shell profile so the key is available immediately.
7. Confirm the key is accessible by running: echo $VIRUSTOTAL_API_KEY
8. Remind me of the free tier limits: 500 requests per day, 4 requests per minute.
9. Show me one example scan command using curl so I can test the key is working:
   curl --request GET "https://www.virustotal.com/api/v3/urls/<encoded-url>" --header "x-apikey: $VIRUSTOTAL_API_KEY"
   Replace <encoded-url> with a base64-encoded version of https://example.com`}
              editable
            />
          </StepCard>

          <ProTip type="warning">
            Your API key is private. Do not paste it into prompts, commit it to a repo, or share it in screenshots.
            Saving it as an environment variable keeps it out of your code and chat history.
          </ProTip>
        </section>

        {/* ====================================================
            WRAP-UP
        ==================================================== */}
        <section id="wrap-up" className="mb-4">
          <div className="webfetch-hero-glass rounded-2xl p-8">
            <div className="relative z-10">
              <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Wrap-Up</span>
              <h2 className="gradient-text text-3xl font-extrabold mt-3 mb-4 pb-1">
                You have now unlocked the system.
              </h2>
              <div className="space-y-3 text-[#FCF4EB]/72 text-lg leading-relaxed">
                <p>We now have a system.</p>
                <p>We have our first line of defense to protect us.</p>
                <p>We have a way to easily get any information from the internet into your hands.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
