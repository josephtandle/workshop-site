import StepCard from '@/components/StepCard';
import CodeBlock from '@/components/CodeBlock';
import ProTip from '@/components/ProTip';
import StickyVideoPlayer from '@/components/StickyVideoPlayer';

export default function Session2Guide() {
  return (
    <>
    <div className="max-w-3xl mx-auto px-6 py-16 pb-0">

      {/* Page Header */}
      <div className="mb-10">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Session Two
        </p>
        <h1 className="text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
          Building Your First Website with AI
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-8">
          By the end of this session you will have a personal brand website live on the internet.
          No coding experience needed. You will describe what you want, and AI does the building.
        </p>

        <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 border-t border-white/[0.08] pt-6 mb-8">
          <span><span className="text-[#FCF4EB]/30 mr-2">Duration</span>~2 hours</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Difficulty</span>Beginner</span>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
          <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest mb-4 font-semibold">In This Session</p>
          <ol className="space-y-2">
            <li><a href="#part-a" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Part A — Set Up and Build Your Page</a></li>
            <li><a href="#part-b" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Part B — Add Visual Effects</a></li>
            <li><a href="#part-c" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Part C — Deploy and Make It Yours</a></li>
          </ol>
        </div>
      </div>
    </div>

    {/* Workshop Recording — sticky video player */}
    <div className="max-w-3xl mx-auto px-6 mb-14">
      <div className="mb-4">
        <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-1">Workshop Recording</p>
        <p className="text-[#FCF4EB]/40 text-sm">Follow along with the live session. Hit play and the video will stick to the top as you scroll.</p>
      </div>
      <StickyVideoPlayer
        videos={[
          { id: 'JU7S-w2r42k', label: 'Cohort 1 Video Replay' },
          { id: 'FWaVKo-Ua7s', label: 'Cohort 2 Video Replay' },
        ]}
        title="Session 2: Building Your First Website with AI"
      />
    </div>

    <div className="max-w-3xl mx-auto px-6 pb-16">
      {/* Part A */}
      <section id="part-a" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part A</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Set Up and Build Your Page</h2>
        </div>

        {/* Step 1: Install Claude Code */}
        <StepCard number={1} title="Install Claude Code">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-5">
            Claude Code is the AI tool you will use to build your website. It runs in your terminal
            and understands plain English. You tell it what you want, it writes all the code.
          </p>

          {/* How to open the terminal */}
          <p className="text-[#FCF4EB] font-semibold text-sm mb-3">First, open your terminal</p>
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
            The terminal is just a text window where you type instructions for your computer. It looks intimidating
            but you are only going to copy and paste into it. Here is how to open it:
          </p>

          <div className="space-y-3 mb-6">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Mac — two ways</p>
              <ul className="space-y-2 text-[#FCF4EB]/60 text-sm">
                <li className="flex gap-2">
                  <span className="text-[#7C69C7] flex-shrink-0">Option 1:</span>
                  <span>Press <span className="font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">Cmd + Space</span> to open Spotlight, type <span className="font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">Terminal</span>, then press Enter</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#7C69C7] flex-shrink-0">Option 2:</span>
                  <span>Open Finder, go to Applications, then open the Utilities folder, then open Terminal</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Windows — two ways</p>
              <ul className="space-y-2 text-[#FCF4EB]/60 text-sm">
                <li className="flex gap-2">
                  <span className="text-[#7C69C7] flex-shrink-0">Option 1:</span>
                  <span>Press the <span className="font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">Windows key</span>, type <span className="font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">Command Prompt</span>, then press Enter</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#7C69C7] flex-shrink-0">Option 2:</span>
                  <span>Press <span className="font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">Windows key + R</span>, type <span className="font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">cmd</span>, then press Enter</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Install command */}
          <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Install Claude Code</p>
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
            Copy the command below and paste it into your terminal. Then press Enter and wait for it to finish.
            You will see text moving across the screen. That is normal. It is done when you see the prompt symbol
            {' '}<span className="font-mono bg-white/[0.08] px-1 rounded text-xs">$</span> or <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">{'>'}</span> again.
          </p>
          <CodeBlock filename="Terminal" code={`curl -fsSL https://claude.ai/install.sh | bash`} />

          <ProTip type="info">
            This is the official installer from Anthropic. It downloads and installs everything Claude Code needs
            automatically. No other software required.
          </ProTip>

          {/* First run and login */}
          <p className="text-[#FCF4EB] font-semibold text-sm mb-2 mt-5">Run Claude Code for the first time</p>
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
            After the installer finishes, close and reopen your terminal. Then type:
          </p>
          <CodeBlock filename="Terminal" code={`claude`} />
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mt-3 mb-4">
            The first time you run it, Claude Code will walk you through a few screens:
          </p>
          <ol className="space-y-3 mb-4">
            <li className="flex gap-3 text-sm text-[#FCF4EB]/70">
              <span className="text-[#7C69C7] font-bold flex-shrink-0">1.</span>
              <span>It will ask you to accept the Terms of Service. Type <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">y</span> and press Enter</span>
            </li>
            <li className="flex gap-3 text-sm text-[#FCF4EB]/70">
              <span className="text-[#7C69C7] font-bold flex-shrink-0">2.</span>
              <span>Your browser will open automatically. If it does not, look for a link in the terminal and click it</span>
            </li>
            <li className="flex gap-3 text-sm text-[#FCF4EB]/70">
              <span className="text-[#7C69C7] font-bold flex-shrink-0">3.</span>
              <span>Log in with the same email and password you use at claude.ai. Click <strong className="text-[#FCF4EB]/90">Authorize</strong> when prompted</span>
            </li>
            <li className="flex gap-3 text-sm text-[#FCF4EB]/70">
              <span className="text-[#7C69C7] font-bold flex-shrink-0">4.</span>
              <span>Return to your terminal. You should see a welcome message and a blinking cursor ready for instructions</span>
            </li>
          </ol>

          <ProTip type="tip">
            You only need to log in once. After that, Claude Code remembers your account every time you open the terminal.
          </ProTip>

          {/* Always start with dangerously-skip-permissions */}
          <div className="mt-5 bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
            <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Always start Claude Code this way</p>
            <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
              Every time you open Claude Code, use this command instead of just typing <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">claude</span>.
              It skips the permission prompts so you are not clicking through confirmation screens every few seconds.
            </p>
            <CodeBlock filename="Terminal" code={`claude --dangerously-skip-permissions`} />
          </div>

          {/* Error dropdown */}
          <details className="mt-5 bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden group">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-[#FCF4EB]/70 hover:text-[#FCF4EB] transition-colors list-none">
              <span>If you are getting an error</span>
              <svg
                className="w-4 h-4 text-[#7C69C7] transition-transform group-open:rotate-180"
                viewBox="0 0 16 16" fill="none" aria-hidden="true"
              >
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="px-5 pb-5 pt-1 space-y-5 border-t border-white/[0.06]">

              <div>
                <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-3 mt-4">How to copy and paste in the terminal</p>
                <div className="space-y-3">
                  <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4">
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Mac</p>
                    <ul className="space-y-1.5 text-[#FCF4EB]/60 text-sm">
                      <li><strong className="text-[#FCF4EB]/80">To paste:</strong> Press <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">Cmd + V</span></li>
                      <li><strong className="text-[#FCF4EB]/80">To copy text from the terminal:</strong> Select it with your mouse, then press <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">Cmd + C</span></li>
                    </ul>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4">
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Windows</p>
                    <ul className="space-y-1.5 text-[#FCF4EB]/60 text-sm">
                      <li><strong className="text-[#FCF4EB]/80">To paste:</strong> Right-click anywhere in the terminal window and select Paste. Or press <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">Ctrl + V</span></li>
                      <li><strong className="text-[#FCF4EB]/80">To copy text from the terminal:</strong> Select it with your mouse, then right-click and select Copy. Or press <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">Ctrl + C</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-3 mt-4">How to read the terminal</p>
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 mb-5">
                  <p className="text-[#FCF4EB]/70 text-sm leading-relaxed mb-3">
                    The terminal is not just showing you an error — it is usually telling you exactly what to do next.
                    Before asking for help, read the last few lines carefully. You will often see something like:
                  </p>
                  <ul className="space-y-2 text-[#FCF4EB]/60 text-sm mb-3">
                    <li className="flex gap-2">
                      <span className="text-[#7C69C7] flex-shrink-0">&#8250;</span>
                      <span><span className="font-mono bg-white/[0.08] px-1 rounded text-xs">Try running: ...</span> followed by a command. It is giving you the exact fix. Copy that command and run it.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#7C69C7] flex-shrink-0">&#8250;</span>
                      <span><span className="font-mono bg-white/[0.08] px-1 rounded text-xs">Permission denied</span> or similar. Close and reopen terminal, then try the command again.</span>
                    </li>
                  </ul>
                  <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                    When the terminal gives you a suggested command, copy it and paste it into a <strong className="text-[#FCF4EB]/80">new terminal window</strong>.
                    Opening a fresh terminal clears any broken state and gives the command a clean environment to run in.
                    On Mac, press <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">Cmd + T</span> to open a new tab, or close and reopen Terminal. On Windows, just open a new Command Prompt window.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-3">Common errors and fixes</p>
                <div className="space-y-4">
                  <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4">
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">&ldquo;command not found: curl&rdquo;</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      This is very rare on modern systems. On Mac, open Terminal and it should already be available.
                      On Windows, make sure you are using Command Prompt or PowerShell, not an older terminal.
                    </p>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4">
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">&ldquo;command not found: claude&rdquo;</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      Close and reopen your terminal after installing. This is needed so your terminal picks up the new command.
                      If it still does not work, run the install command again.
                      If it still does not work after that, let us know in the group and we will help you live.
                    </p>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4">
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">&ldquo;Missing billing information&rdquo; or &ldquo;Subscription required&rdquo;</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      Claude Code requires a paid Claude plan (Pro, Max, Teams, or Enterprise). Log in at claude.ai and confirm your subscription is active.
                    </p>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4">
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">The browser did not open during login</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      Look in your terminal for a URL that starts with <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">https://claude.ai/auth...</span> Copy it and paste it into your browser manually.
                    </p>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4">
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Something else is going wrong</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      Copy the error text from your terminal (select it, then Cmd+C on Mac or right-click + Copy on Windows)
                      and paste it into the Masterminds group. We will sort it out together.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </details>
        </StepCard>

        {/* Step 3: Create project folder */}
        <StepCard number={2} title="Create your project folder and open Claude Code">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Open your terminal and start Claude Code with the command below. Then give Claude the plain-English
            instruction to set up your project folder.
          </p>
          <CodeBlock filename="Terminal" code={`claude --dangerously-skip-permissions`} />
          <p className="text-[#FCF4EB]/70 leading-relaxed mt-5 mb-3">
            Once Claude Code is running, paste this in:
          </p>
          <CodeBlock
            filename="Paste into Claude Code"
            code={`Create me a folder that I'm going to make my website in and go into that folder.`}
          />

          <ProTip type="tip" className="mt-4">
            When Claude Code asks &ldquo;Trust this folder?&rdquo; click <strong>Trust</strong>. This gives it
            permission to create and edit files inside your project. Do not skip this step.
          </ProTip>
        </StepCard>

        {/* Step 4: Add photo */}
        <StepCard number={3} title="Add your photo to the folder">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Before we build, move your photo into the project folder. Make sure it is named{' '}
            <span className="font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-sm">photo.jpg</span>.
          </p>
          <div className="space-y-3">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Mac</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                Open Finder. Go to your home folder. Drag{' '}
                <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">photo.jpg</span> into the{' '}
                <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">my-website</span> folder.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Windows</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                Open File Explorer. Go to{' '}
                <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">C:\Users\YourName</span>. Drag{' '}
                <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">photo.jpg</span> into the{' '}
                <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">my-website</span> folder.
              </p>
            </div>
          </div>
          <ProTip type="tip" className="mt-4">
            To rename a photo: right-click it, select Rename, type{' '}
            <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">photo.jpg</span>, press Enter. If
            Windows warns you about changing the extension, click Yes.
          </ProTip>
        </StepCard>

        {/* Bonus: Web Design Arsenal */}
        <div
          className="rounded-2xl p-8 sm:p-12 mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(245,195,198,0.12) 0%, rgba(124,105,199,0.10) 100%)',
            border: '1px solid rgba(245,195,198,0.20)',
          }}
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6 bg-[#F5C3C6]/15 text-[#F5C3C6] border border-[#F5C3C6]/25">
            Bonus
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#FCF4EB] mb-4 leading-tight">
            The Web Design Arsenal
          </h2>
          <p className="text-[#FCF4EB]/65 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
            Want to go further? This single prompt installs 24 of the best web design tools and animation libraries so your AI builds genuinely gorgeous websites from the start.
          </p>
          <CodeBlock
            filename="Paste into Claude Code"
            code={`Set up my professional web design toolkit so I can
build incredibly gorgeous websites fast.

Step 1 -- Install Claude Code design skills:
git clone https://github.com/anthropics/frontend-design ~/.claude/skills/frontend-design
git clone https://github.com/Koomook/claude-frontend-skills ~/.claude/skills/claude-frontend-skills
git clone https://github.com/greensock/gsap-skills ~/.claude/skills/gsap-skills
git clone https://github.com/Dammyjay93/interface-design ~/.claude/skills/interface-design
git clone https://github.com/Owl-Listener/designer-skills ~/.claude/skills/designer-skills
git clone https://github.com/freshtechbro/claudedesignskills ~/.claude/skills/claudedesignskills

Step 2 -- Install mobile-first and responsive skills:
git clone https://github.com/szilu/ux-designer-skill ~/.claude/skills/ux-designer
git clone https://github.com/HermeticOrmus/LibreUIUX-Claude-Code ~/.claude/skills/libreUIUX

Step 3 -- Install animation and effects libraries:
npm install gsap lenis framer-motion animejs \\
  @formkit/auto-animate split-type typed.js \\
  countup.js canvas-confetti tsparticles \\
  vanta three @barba/core scrollreveal aos vivus

Step 4 -- Confirm and quick-start:
When complete, show me a quick-start example:
add smooth scroll and an animated text reveal
to a hero section for a landing page.`}
          />
          <p className="text-[#FCF4EB]/35 text-xs mt-5 leading-relaxed">
            Run this from inside your website project folder. Every library links to its GitHub page on the{' '}
            <a href="https://workshop.mastermindshq.business/giveaways/web-design-arsenal" target="_blank" rel="noopener noreferrer" className="text-[#F5C3C6]/70 hover:text-[#F5C3C6] transition-colors underline">
              Web Design Arsenal page
            </a>{' '}
            where you can review everything before installing.
          </p>
        </div>

        {/* Step 5: Build the page */}
        <StepCard number={4} title="Build your personal brand page">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Fill in your own details below, replacing everything in brackets. Then copy and paste it
            into Claude Code.
          </p>
          <ProTip type="tip" className="mb-4">
            Click anywhere in the box to edit it. Replace every{' '}
            <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">[BRACKETED]</span> value with
            your own information before copying.
          </ProTip>
          <CodeBlock
            filename="Paste into Claude Code"
            editable
            code={`Build me a simple personal brand website as a single index.html file.

- Hero section with my name "[YOUR NAME]" and tagline "[YOUR TAGLINE]"
- Three service cards: [SERVICE 1], [SERVICE 2], [SERVICE 3]
- About section: "[YOUR BIO]"
- CTA button that says "[YOUR BUTTON TEXT]" linking to "[YOUR LINK]"
- Clean, modern design. Mobile responsive.

Use HTML, CSS, and vanilla JavaScript only.`}
          />
          <p className="text-[#FCF4EB]/70 leading-relaxed mt-5 mb-2">
            Once Claude finishes, open the file in your browser to see it:
          </p>
          <div className="space-y-2">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
              <p className="text-[#FCF4EB]/60 text-sm"><span className="text-[#FCF4EB] font-semibold">Mac:</span> In the terminal, type <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">open index.html</span> and press Enter</p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
              <p className="text-[#FCF4EB]/60 text-sm"><span className="text-[#FCF4EB] font-semibold">Windows:</span> In the terminal, type <span className="font-mono bg-white/[0.08] px-1 rounded text-xs">start index.html</span> and press Enter</p>
            </div>
          </div>
          <ProTip type="tip" className="mt-4">
            If anything looks wrong, just tell Claude in plain English what to fix. For example:{' '}
            &ldquo;Make the headline bigger&rdquo; or &ldquo;Change the background to white.&rdquo; You do not
            need to touch any code.
          </ProTip>
        </StepCard>
      </section>

      {/* Part B */}
      <section id="part-b" className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part B</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Add Visual Effects</h2>
        </div>
        <p className="text-[#FCF4EB]/70 leading-relaxed mb-8">
          Once your content looks right, these two prompts will transform it from a plain page into
          something that feels professional and polished. Paste each one exactly as written.
        </p>

        <StepCard number={5} title="Add scroll animations and glassmorphism">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Paste this exactly as written. No edits needed.
          </p>
          <CodeBlock
            filename="Paste into Claude Code"
            code={`Upgrade my website with these visual effects:

- Animated gradient mesh background in the hero that slowly shifts
- Glassmorphism service cards with a frosted glass effect
- Each section fades and slides in as you scroll down
- Nav bar fixed at the top with a glass blur effect
- Buttons lift and glow on hover

Use GSAP and ScrollTrigger via CDN for the scroll animations.
Keep all my content exactly as it is.`}
          />
        </StepCard>

        <StepCard number={6} title="Add pro-level interactions">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            When the previous effects are looking great, paste this to take it further. Paste exactly as written.
          </p>
          <CodeBlock
            filename="Paste into Claude Code"
            code={`Now add these pro effects:

1. Lenis smooth scroll
2. 3D card tilt on service cards
3. Magnetic buttons
4. Subtle film grain texture over the whole page
5. Stats section with 4 numbers that count up from zero on scroll — use my own numbers

Do not change any content or layout.`}
          />
          <ProTip type="tip" className="mt-4">
            No stats yet? No problem. Use numbers like years of experience, clients helped, hours saved
            per week, or an aspirational goal. Claude will use whatever you have in your page.
          </ProTip>
        </StepCard>
      </section>

      {/* Part C */}
      <section id="part-c" className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part C</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Deploy and Make It Yours</h2>
        </div>
        <p className="text-[#FCF4EB]/70 leading-relaxed mb-8">
          Your site is ready. Now put it on the internet, add your photo, and start customizing.
        </p>

        <StepCard number={7} title="Deploy to Vercel">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Tell Claude Code to deploy. It will handle everything including logging into{' '}
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">Vercel</a>{' '}
            and pushing your files live.
          </p>
          <CodeBlock
            filename="Paste into Claude Code"
            code={`Deploy my website to production.`}
          />
          <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
            A browser window may open asking you to log in to your{' '}
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">Vercel</a>{' '}
            account. Sign in and come back to the terminal. In about 30 seconds you will get a live URL
            that looks like:{' '}
            <span className="font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-sm">https://my-website-abc123.vercel.app</span>
          </p>
          <ProTip type="tip" className="mt-4">
            Copy that URL and keep it handy. You will share it in the group at the end.
          </ProTip>
        </StepCard>

        <StepCard number={8} title="Add your photo">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Tell Claude to place your photo on the page. Edit the file name below if yours is different.
          </p>
          <CodeBlock
            filename="Paste into Claude Code"
            editable
            code={`Add my photo to the website. The file is called [photo.jpg] and it's in the same folder as index.html.

Place it in the about section next to my bio. Style it with a rounded border and make it look great.`}
          />
          <p className="text-[#FCF4EB]/70 leading-relaxed mt-4 mb-2">
            Once it looks good, deploy again to update your live site:
          </p>
          <CodeBlock
            filename="Paste into Claude Code"
            code={`Deploy my website to production.`}
          />
        </StepCard>

        <StepCard number={9} title="Customize and explore">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Now it is yours. There are no wrong moves. Try asking Claude things like:
          </p>
          <ul className="space-y-2 text-[#FCF4EB]/70">
            <li className="flex gap-2">
              <span className="text-[#7C69C7] flex-shrink-0">&#8250;</span>
              <span>&ldquo;Change the colors to match my brand&rdquo;</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#7C69C7] flex-shrink-0">&#8250;</span>
              <span>&ldquo;Add a testimonials section&rdquo;</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#7C69C7] flex-shrink-0">&#8250;</span>
              <span>&ldquo;Make the hero headline bigger and bolder&rdquo;</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#7C69C7] flex-shrink-0">&#8250;</span>
              <span>&ldquo;Add a floating WhatsApp button in the bottom right&rdquo;</span>
            </li>
          </ul>
          <ProTip type="tip" className="mt-4">
            Every time you make a change you like, tell Claude{' '}
            &ldquo;Deploy my website to production&rdquo; to push it live. Your URL stays the same.
          </ProTip>
        </StepCard>
      </section>

      {/* Wrap-up */}
      <section className="mb-16">
        <div className="border-t border-white/[0.08] pt-12">
          <h2 className="text-2xl font-bold text-[#FCF4EB] mb-4">You just built something real.</h2>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-10">
            A live website on the internet, built by you, with no prior coding experience. This is
            exactly what it looks like to start building a real online presence with AI.
          </p>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 mb-8">
            <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">Support Each Other</p>
            <h3 className="text-xl font-bold text-[#FCF4EB] mb-3">Show the world what you built</h3>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-6">
              You just built a real website with AI. That is worth sharing. Do all three of these before the next session.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#7C69C7] text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Post your website in the Masterminds group</p>
                  <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                    Drop your live URL in the group chat. Click every link that gets posted and tell them
                    what stood out. Real feedback from real people means everything at this stage.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#7C69C7] text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Share it on your story</p>
                  <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                    Instagram, WhatsApp, Facebook — wherever your people are. Take a screenshot of your
                    live website and post it as a story with your link. You built this. Let people see it.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#7C69C7] text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Tag Joe so he can share it</p>
                  <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                    Tag{' '}
                    <a href="https://www.instagram.com/joe.che.official/" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline font-medium">@joe.che.official</a>
                    {' '}in your post or story. He wants to see what you built, celebrate it with you,
                    and share it with his audience so more people see your work.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#7C69C7]/50 bg-[#7C69C7]/[0.08] rounded-xl p-6">
            <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">Challenge</p>
            <p className="text-[#FCF4EB]/80 leading-relaxed">
              Share your live website URL in the Masterminds group before the next session.
            </p>
          </div>

        </div>
      </section>

      <p className="text-center text-xs text-white/20 pb-8">
        Using Codex instead of Claude Code?{' '}
        <a href="/session/2/guide-codex" className="underline hover:text-white/50 transition-colors">Codex version of this page</a>
      </p>

    </div>
    </>
  );
}
