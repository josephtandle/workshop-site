'use client'

import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'

export default function Session8Guide() {
  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-16 pb-0">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
            Session Eight
          </p>
          <h1 className="gradient-text text-5xl font-extrabold leading-tight mb-5 pb-1">
            Claude Sees Your Screen and Reads the Web
          </h1>
          <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-6">
            By the end of this session Claude will be able to click, type, and scroll through any app on your computer.
            It will also be able to fetch any page on the internet and bring the data back to your conversation.
            Two capabilities. Both work in plain English. No code required.
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
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
            <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest mb-4 font-semibold">In This Session</p>
            <ol className="space-y-2">
              <li><a href="#part-a" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Part A: Enable Computer-Use</a></li>
              <li><a href="#part-b" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Part B: Your First Computer-Use Tasks</a></li>
              <li><a href="#part-c" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Part C: Web Fetch</a></li>
              <li><a href="#examples" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Real-World Examples</a></li>
            </ol>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* ====================================================
            PART A: ENABLE COMPUTER-USE
        ==================================================== */}
        <section id="part-a" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part A</span>
            <h2 className="text-2xl font-bold text-[#FCF4EB]">Enable Computer-Use</h2>
          </div>

          <StepCard number={1} title="Open the MCP server menu">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Start a Claude Code session in your terminal. Then type the following and press Enter:
            </p>
            <CodeBlock filename="Claude Code" code={`/mcp`} />
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
              A menu appears showing all available MCP servers. Scroll down until you find <strong className="text-[#FCF4EB]">computer-use</strong>.
              Select it and choose <strong className="text-[#FCF4EB]">Enable</strong>.
            </p>
            <ProTip type="tip" className="mt-4">
              MCP stands for Model Context Protocol. It is the system that gives Claude access to tools beyond
              the built-in ones. Computer-use is a built-in MCP server that ships with Claude Code but is off by default.
            </ProTip>
          </StepCard>

          <StepCard number={2} title="Grant macOS permissions">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              The first time you use computer-use, macOS will ask you to grant two permissions:
            </p>
            <div className="space-y-3 mb-4">
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
                <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Accessibility</p>
                <p className="text-[#FCF4EB]/60 text-sm">
                  Lets Claude click buttons, type into fields, and scroll through pages.
                  Go to System Settings, Privacy and Security, Accessibility, and toggle on Terminal (or your terminal app).
                </p>
              </div>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
                <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Screen Recording</p>
                <p className="text-[#FCF4EB]/60 text-sm">
                  Lets Claude see what is on your screen so it can navigate. Same path: System Settings,
                  Privacy and Security, Screen and System Audio Recording. Toggle on your terminal app.
                </p>
              </div>
            </div>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              After granting both permissions, you may need to restart Claude Code once. Then you are ready.
            </p>
            <ProTip type="warning" className="mt-4">
              These permissions are session-scoped. Claude will ask which apps it is allowed to control
              each session before touching them. You can press Escape at any time to stop it immediately.
            </ProTip>
          </StepCard>
        </section>

        {/* ====================================================
            PART B: FIRST TASKS
        ==================================================== */}
        <section id="part-b" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part B</span>
            <h2 className="text-2xl font-bold text-[#FCF4EB]">Your First Computer-Use Tasks</h2>
          </div>

          <StepCard number={3} title="Test it with a simple task">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              With computer-use enabled, start a new Claude Code session and give it a simple instruction.
              This prompt asks Claude to open your browser and take a screenshot of a website:
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={`Open Safari, go to [YOUR WEBSITE URL], take a screenshot, and tell me what you see on the homepage.`}
              editable
            />
            <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
              Claude will open the browser, navigate to the URL, capture what is on screen, and describe it back to you.
              This is the foundation. Everything else builds on this.
            </p>
          </StepCard>

          <StepCard number={4} title="Try a form-filling task">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Computer-use shines when an app has no API. Try having Claude fill in a form for you.
              This prompt works for any tool you use that has a web interface:
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={`Open [TOOL NAME, e.g. Notion / Airtable / your CRM], navigate to [PAGE OR SECTION], and create a new entry with the following details:

Name: [NAME]
Description: [DESCRIPTION]
Status: [STATUS]

Take a screenshot when it is done so I can confirm.`}
              editable
            />
            <ProTip type="tip" className="mt-4">
              Computer-use works best when you are specific. Tell Claude exactly where to go and exactly what to fill in.
              The more detail you give, the less it has to guess.
            </ProTip>
          </StepCard>

          <StepCard number={5} title="Test your own website">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              One of the most useful things computer-use can do is QA-test your site the way a real visitor would.
              Use this prompt to have Claude click through your sign-up flow and report any issues:
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={`Open [YOUR WEBSITE URL] in Safari. Act like a new visitor who wants to sign up.
Click through the entire sign-up flow from the homepage. Take screenshots at each step.
Report back: did anything look broken, confusing, or hard to find?`}
              editable
            />
          </StepCard>
        </section>

        {/* ====================================================
            PART C: WEB FETCH
        ==================================================== */}
        <section id="part-c" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part C</span>
            <h2 className="text-2xl font-bold text-[#FCF4EB]">Web Fetch</h2>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 mb-8">
            <p className="text-[#FCF4EB] font-semibold mb-2">What is Web Fetch?</p>
            <p className="text-[#FCF4EB]/70 text-sm leading-relaxed">
              Web Fetch is a built-in Claude Code tool that lets Claude retrieve any public webpage and read its content.
              No setup required. No installation. Just tell Claude to fetch a URL and it will pull in the text,
              links, and data from that page and use it in your conversation.
              Unlike computer-use, it does not open a visible browser window. It works silently in the background.
            </p>
          </div>

          <StepCard number={6} title="Fetch a competitor's pricing page">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Web Fetch is instant market research. Give Claude a URL and it will read the page and analyze it for you:
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={`Fetch the pricing page at [COMPETITOR URL] and summarize:
- What plans do they offer and at what price?
- What is included in each plan?
- What are they emphasizing as their main selling points?
- What is missing that we offer?`}
              editable
            />
          </StepCard>

          <StepCard number={7} title="Research a prospect before a sales call">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Before a call, have Claude pull together everything publicly available about the person or company:
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={`I have a sales call in 30 minutes with [NAME] from [COMPANY].
Fetch their website at [URL] and give me:
- What the company does in one sentence
- Who their likely customers are
- Any recent content or initiatives worth mentioning
- One smart question I could ask that shows I did my homework`}
              editable
            />
          </StepCard>

          <StepCard number={8} title="Build a content research pipeline">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Web Fetch can read multiple pages in one session. Use it to collect ideas across sources:
            </p>
            <CodeBlock
              filename="Claude Code prompt"
              code={`Fetch the following pages and find the 5 most interesting ideas, angles, or hooks relevant to [YOUR TOPIC OR AUDIENCE]:

[URL 1]
[URL 2]
[URL 3]

For each idea, write a one-sentence Instagram hook I could use.`}
              editable
            />
            <ProTip type="tip" className="mt-4">
              Web Fetch works on any public page: blog posts, news articles, product pages, job listings, conference agendas.
              If you can see it in a browser without logging in, Claude can read it.
            </ProTip>
          </StepCard>
        </section>

        {/* ====================================================
            REAL-WORLD EXAMPLES
        ==================================================== */}
        <section id="examples" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Examples</span>
            <h2 className="text-2xl font-bold text-[#FCF4EB]">Real-World Use Cases</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              {
                icon: '🖥',
                title: 'Daily reporting',
                desc: 'Have Claude log into your analytics dashboard every morning, take a screenshot, and summarize the numbers in a WhatsApp message.',
              },
              {
                icon: '🔍',
                title: 'Lead research',
                desc: 'Paste a list of company names. Claude fetches each website and builds a one-line summary for each prospect.',
              },
              {
                icon: '📋',
                title: 'Form automation',
                desc: 'You describe what you want to create. Claude opens your project management tool and fills in the form.',
              },
              {
                icon: '🧪',
                title: 'QA testing',
                desc: 'Ship a new page on your site. Claude clicks through it as a real visitor and flags anything broken or confusing.',
              },
              {
                icon: '📰',
                title: 'Content monitoring',
                desc: 'Fetch your industry news sources every morning and get a 3-bullet briefing on what is worth knowing.',
              },
              {
                icon: '💰',
                title: 'Pricing intelligence',
                desc: 'Fetch the pricing pages of 5 competitors and get a side-by-side breakdown with recommendations for your own pricing.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
                <div className="text-2xl mb-3">{icon}</div>
                <p className="text-[#FCF4EB] font-semibold text-sm mb-1">{title}</p>
                <p className="text-[#FCF4EB]/55 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <ProTip type="info">
            Computer-use and Web Fetch work together. Use Web Fetch to gather information from the internet,
            then use computer-use to act on it inside an app. Together they give Claude a complete loop:
            research, decide, execute.
          </ProTip>
        </section>

      </div>
    </>
  )
}
