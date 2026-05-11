import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'

export const metadata = {
  title: 'Automated Ghost Computer Use',
  description:
    'Set up Claude computer-use, grant the right permissions, and practice browser-driven QA workflows.',
}

export default function AutomatedGhostComputerUsePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-14">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Resource Vault
        </p>
        <h1 className="gradient-text text-4xl font-extrabold leading-tight mb-5 pb-1">
          Automated Ghost Computer Use
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-8">
          This guide shows how to turn on computer-use in Claude Code, grant the right desktop permissions,
          and start using it for browser-driven QA and automation tasks.
        </p>
        <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 border-t border-white/[0.08] pt-6">
          <span><span className="text-[#FCF4EB]/30 mr-2">Focus</span>Claude computer-use</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Use case</span>Ghost browser automation</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Goal</span>Clicks, forms, and QA workflows</span>
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
            { href: '#permissions', label: 'Claude Dangerously Skip Permissions' },
            { href: '#computer-use', label: 'Computer-Use Setup' },
            { href: '#practice', label: 'First Computer-Use Tasks' },
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

      <section id="permissions" className="mb-16">
        <div className="mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Start Here</span>
          <h2 className="text-3xl font-bold text-[#FCF4EB] mt-3">Claude Dangerously Skip Permissions</h2>
        </div>

        <StepCard number={1} title="Start Claude in Dangerously Skip Permissions">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Start the workshop in the project folder you intend to use. This keeps the live build moving without
            stopping for every small permission prompt.
          </p>
          <CodeBlock
            filename="Claude Code prompt"
            code={`Start Claude Code in Dangerously Skip Permissions for this workshop session.

Before making changes:
1. Confirm I am in the right project folder.
2. Tell me which folder you are working in.
3. Do not touch unrelated projects or personal files.
4. Pause and ask before deleting, overwriting, or moving anything outside this workshop project.`}
            editable
          />
          <ProTip type="warning" className="mt-4">
            Dangerously Skip Permissions is powerful. Use it only in the project folder you mean to edit.
          </ProTip>
        </StepCard>
      </section>

      <section id="computer-use" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Setup</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Computer-Use Setup</h2>
        </div>

        <StepCard number={2} title="Open the MCP server menu">
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

        <StepCard number={3} title="Grant macOS permissions">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            The first time you use computer-use, macOS will ask you to grant two permissions:
          </p>
          <div className="space-y-3 mb-4">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Accessibility</p>
              <p className="text-[#FCF4EB]/60 text-sm">
                Lets Claude click buttons, type into fields, and scroll through pages.
                Go to System Settings, Privacy and Security, Accessibility, and toggle on Terminal or your terminal app.
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

      <section id="practice" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Practice</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">First Computer-Use Tasks</h2>
        </div>

        <StepCard number={4} title="Test it with a simple task">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            With computer-use enabled, start a new Claude Code session and give it a simple instruction.
            This prompt asks Claude to open your browser and take a screenshot of a website:
          </p>
          <CodeBlock
            filename="Claude Code prompt"
            code={`Open Safari, go to [https://www.mindfulnessmode.com/what-is-consciousness-tom-campbell-part-1/], take a screenshot, and tell me what you see on the homepage.`}
            editable
          />
          <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
            Claude will open the browser, navigate to the URL, capture what is on screen, and describe it back to you.
            This is the foundation. Everything else builds on this.
          </p>
        </StepCard>

        <StepCard number={5} title="Try a form-filling task">
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

        <StepCard number={6} title="Test your own website">
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
    </main>
  )
}
