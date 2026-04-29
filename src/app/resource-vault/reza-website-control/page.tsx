import Link from 'next/link'
import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'

export const metadata = {
  title: 'Reza Process to take control of his website',
  description:
    'First steps for Reza to find his website hosting, get the Git repo, authenticate Git, pull the project, and practice building a new lead magnet page.',
}

export default function RezaWebsiteControlPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-14">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Resource Vault
        </p>
        <h1 className="gradient-text text-4xl font-extrabold leading-tight mb-5 pb-1">
          Reza Process to take control of his website
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-8">
          Step 1 is not redesigning anything yet. First, get control of the hosting, get the code, and make sure you can safely run the website on your computer.
        </p>
        <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 border-t border-white/[0.08] pt-6">
          <span><span className="text-[#FCF4EB]/30 mr-2">For</span>Reza</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Goal</span>Own the website workflow</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Start here</span>Hosting and Git repo access</span>
        </div>
      </div>

      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part A</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Get the keys first</h2>
        </div>

        <StepCard number={1} title="Ask the designer where the website is hosted">
          <p>
            Before touching the design, find out where the live website is actually hosted. The Git repo is the code, but hosting is where the live website runs.
          </p>
          <CodeBlock
            editable
            filename="Message to send the designer"
            code={`Hey [NAME], I am getting set up to manage my website directly.

Can you send me:
1. Where the live website is hosted
2. The login or invite for that hosting account
3. The Git repo link for the website
4. Any notes on how the site is deployed
5. Any environment variables or setup instructions needed to run it locally

I do not need you to change anything yet. I just need access and context so I can safely take over the workflow.`}
          />
          <ProTip type="warning">
            Do not make changes to the live site until you know the host, the deployment flow, and whether the Git repo is connected to automatic deployment.
          </ProTip>
        </StepCard>

        <StepCard number={2} title="Get the Git repo from the designer">
          <p>
            Ask for the repository link, then make sure your GitHub account is added as a collaborator. If the repo is private, you will not be able to clone it until your account is authorized.
          </p>
          <CodeBlock
            filename="What the repo link usually looks like"
            code={`https://github.com/[designer-or-company]/[website-repo-name]`}
          />
          <p>
            Send Joe your GitHub username after you create the account. Joe can help authorize the right account and confirm the access path.
          </p>
        </StepCard>

        <StepCard number={3} title="Create your GitHub account">
          <p>
            If you do not already have one, create a GitHub account at{' '}
            <Link
              href="https://github.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2"
            >
              github.com/signup
            </Link>
            . Use an email you will keep long term.
          </p>
          <p>
            After the account is created, send Joe your GitHub username and the email on the account.
          </p>
        </StepCard>
      </section>

      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part B</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Set up Git in Claude Code</h2>
        </div>

        <StepCard number={4} title="Open Claude Code and install Git">
          <p>
            Open Claude Code and ask it to check whether Git is installed. If Git is missing, use the install command for your computer.
          </p>
          <CodeBlock
            codexPrompt
            filename="Prompt for Claude Code"
            code={`Check whether Git is installed on my computer.

Run:
git --version

If Git is not installed, tell me exactly which command to run for my operating system, then wait for me to run it.`}
          />
          <CodeBlock
            filename="Common install commands"
            code={`# Mac with Homebrew
brew install git gh

# Windows
winget install Git.Git GitHub.cli

# Check after installing
git --version
gh --version`}
          />
          <ProTip type="info">
            If you do not have Homebrew on Mac, install Git from git-scm.com or ask Claude Code to help install Homebrew first.
          </ProTip>
        </StepCard>

        <StepCard number={5} title="Tell Git who you are">
          <p>
            Git needs your name and email so every saved change has an author. Use the same email as your GitHub account if possible.
          </p>
          <CodeBlock
            editable
            filename="Run in Terminal"
            code={`git config --global user.name "Reza Khoshkam"
git config --global user.email "[YOUR-GITHUB-EMAIL]"`}
          />
        </StepCard>

        <StepCard number={6} title="Authenticate GitHub">
          <p>
            The cleanest way is to use GitHub CLI. It opens a browser login and connects your computer to GitHub.
          </p>
          <CodeBlock
            filename="Run in Terminal"
            code={`gh auth login`}
          />
          <p>
            Choose GitHub.com, HTTPS, and browser login unless Claude Code gives you a clear reason to choose something else.
          </p>
        </StepCard>

        <StepCard number={7} title="Pull the repo onto your computer">
          <p>
            Once the designer has shared the repo and your GitHub account has access, clone the repo.
          </p>
          <CodeBlock
            editable
            filename="Run in Terminal"
            code={`cd ~/Desktop
git clone https://github.com/[ACCOUNT]/[REPO-NAME].git
cd [REPO-NAME]`}
          />
          <CodeBlock
            codexPrompt
            filename="Prompt for Claude Code after cloning"
            code={`I just cloned my website repo. Please inspect it and tell me:

1. What platform/framework this website uses
2. How to install dependencies
3. How to run it locally
4. Whether it has environment variables I need
5. How it appears to deploy to the live website

Do not change files yet. Just inspect and summarize.`}
          />
        </StepCard>
      </section>

      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part C</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Practice safely before changing the live site</h2>
        </div>

        <StepCard number={8} title="Run the website locally">
          <p>
            After Claude Code identifies the project type, ask it to install dependencies and start the local development server.
          </p>
          <CodeBlock
            codexPrompt
            filename="Prompt for Claude Code"
            code={`Set this website up locally.

1. Install the dependencies using the package manager this repo expects.
2. Start the development server.
3. Give me the local URL to open in my browser.
4. If anything fails, explain the exact missing dependency or environment variable.`}
          />
          <ProTip type="warning">
            Local changes do not automatically mean the live website changed. That is good. Practice locally first, then deploy only when you know the flow.
          </ProTip>
        </StepCard>

        <StepCard number={9} title="Install the Web Design Arsenal from Session 2">
          <p>
            Go to the Session 2 resource and install the Web Design Arsenal. This gives Claude Code better design skills and the animation libraries needed for modern pages.
          </p>
          <p>
            Open:{' '}
            <Link
              href="/giveaways/web-design-arsenal"
              className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2"
            >
              Web Design Arsenal
            </Link>
          </p>
          <ProTip type="info">
            For Claude Code, follow the full install. If you are using Codex or Gemini CLI later, use the npm library install section only.
          </ProTip>
        </StepCard>

        <StepCard number={10} title="Create a practice page, not a homepage redesign">
          <p>
            Your first change should be a low-risk new page, like a lead magnet page. Do not start by changing the homepage, checkout flow, or navigation.
          </p>
          <CodeBlock
            editable
            codexPrompt
            filename="Prompt for Claude Code"
            code={`Create a new lead magnet page in this website.

Goal:
Build a page that offers a free resource called "[LEAD MAGNET TITLE]" for people interested in [AUDIENCE/PROBLEM].

Requirements:
1. Use the existing design system and components from this repo.
2. Do not change the homepage, navigation, checkout, or existing live pages.
3. Create the new page at a sensible route, such as /lead-magnet or /free-guide.
4. Include a strong headline, short explanation, 3 benefits, and a simple email capture section.
5. If the repo does not already have email capture wired up, leave the form as a visual placeholder and tell me what needs to be connected later.
6. Run the local build or typecheck after making changes.

Before editing, show me the files you plan to touch.`}
          />
        </StepCard>

        <StepCard number={11} title="Save the work on a branch">
          <p>
            A branch lets you experiment without mixing practice work into the main website. Ask Claude Code to create a branch before editing.
          </p>
          <CodeBlock
            filename="Run in Terminal"
            code={`git checkout -b reza-lead-magnet-practice`}
          />
          <CodeBlock
            filename="After the page works locally"
            code={`git status
git add .
git commit -m "Add practice lead magnet page"`}
          />
        </StepCard>

        <StepCard number={12} title="Do not deploy until the hosting path is clear">
          <p>
            Before pushing or deploying, confirm which service hosts the website and whether that service auto-deploys from GitHub. Common hosts include Vercel, Netlify, Cloudflare Pages, Shopify, Squarespace, Wix, WordPress, and traditional cPanel hosting.
          </p>
          <CodeBlock
            editable
            filename="Final deployment question for the designer"
            code={`One more question before I push changes:

Is this repo connected to automatic deployment?

If yes:
1. Which branch deploys to production?
2. Is there a preview/staging branch?
3. Which hosting platform handles deployment?
4. Are there environment variables I need in the host?

I want to make sure I do not accidentally publish practice changes to the live site.`}
          />
        </StepCard>
      </section>

      <section>
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(124, 105, 199, 0.14) 0%, rgba(245, 195, 198, 0.10) 100%)',
            border: '1px solid rgba(124, 105, 199, 0.22)',
          }}
        >
          <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-4">
            Done means
          </p>
          <ul className="space-y-3 text-[#FCF4EB]/75 text-sm leading-relaxed">
            <li>You know where the live website is hosted.</li>
            <li>You have access to the Git repo through your own GitHub account.</li>
            <li>Git and GitHub authentication work on your computer.</li>
            <li>The website runs locally.</li>
            <li>You have installed the Web Design Arsenal.</li>
            <li>You created a practice lead magnet page on a branch without touching the live site.</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
