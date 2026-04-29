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
              <li><a href="#ultimate-web-fetch" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Cohort 1: Ultimate Web Fetch</a></li>
              <li><a href="#mlx-whisper" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Local Transcription with MLX Whisper</a></li>
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
            ULTIMATE WEB FETCH
        ==================================================== */}
        <section id="ultimate-web-fetch" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Cohort 1</span>
            <h2 className="text-2xl font-bold text-[#FCF4EB]">Install Ultimate Web Fetch</h2>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 mb-8">
            <p className="text-[#FCF4EB] font-semibold mb-2">What you are installing</p>
            <p className="text-[#FCF4EB]/70 text-sm leading-relaxed mb-4">
              Ultimate Web Fetch is the local MyOS webfetch agent packaged for the cohort: normal page fetch,
              CSS extraction, screenshots, PDFs, and optional media download through yt-dlp. It is different from
              Claude Code's built-in WebFetch tool because it runs as a local command on your machine.
            </p>
            <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
              Use it only on public pages or content you are allowed to access. Some platforms change download behavior often,
              so keep yt-dlp updated before class demos.
            </p>
          </div>

          <StepCard number={9} title="Use the public GitHub repo shape">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              If you publish this for the cohort, keep the public repo small and safe. The repo should be named
              <strong className="text-[#FCF4EB]"> Ultimate Web Fetch</strong> and avoid personal workspace paths,
              cookies, cached pages, downloaded media, browser profiles, and private environment files.
            </p>
            <CodeBlock
              filename="recommended public repo layout"
              code={`ultimate-web-fetch/
  README.md
  LICENSE
  package.json
  package-lock.json
  .gitignore
  src/
    index.js
    api.js
    router.js
    formatter.js
    cache.js
    politeness.js
    tools/
      playwright.js
      scrapling.js
      shot-scraper.js
      browser-use.js
      yt-dlp.js
  config/
    opencli-adapters.json
  examples/
    fetch-pricing.sh
    extract-headings.sh
    download-public-video.sh`}
            />
            <ProTip type="tip" className="mt-4">
              The public repo is ready at github.com/josephtandle/ultimate-web-fetch. It excludes local caches,
              screenshots, cookies, browser profiles, and private workspace files.
            </ProTip>
          </StepCard>

          <StepCard number={10} title="Install it locally">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              After the repo exists, participants can clone it, install the Node dependencies, install browser support,
              and install the optional media downloader.
            </p>
            <CodeBlock
              filename="Terminal"
              code={`git clone https://github.com/josephtandle/ultimate-web-fetch.git
cd ultimate-web-fetch
npm install
npx playwright install chromium

# Optional but recommended for video/audio examples
brew install yt-dlp ffmpeg

# Verify everything
node src/index.js preflight`}
              editable
            />
          </StepCard>

          <StepCard number={11} title="Download a short Instagram video">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Copy the URL of a public Reel or a video you are allowed to download. For logged-in or permissioned content,
              use browser cookies only from an account that has access.
            </p>
            <CodeBlock
              filename="Terminal"
              code={`mkdir -p ~/Downloads/webfetch-demo

node src/index.js media "https://www.instagram.com/reel/[REEL_ID]/" \\
  --output-dir ~/Downloads/webfetch-demo

# If the public URL needs your local browser session:
node src/index.js media "https://www.instagram.com/reel/[REEL_ID]/" \\
  --output-dir ~/Downloads/webfetch-demo \\
  --cookies-from-browser chrome \\
  --allow-browser-cookies`}
              editable
            />
            <ProTip type="warning" className="mt-4">
              Do not use this to bypass paywalls, private accounts, or platform rules. For class, use your own post,
              a participant-approved post, or a public test URL.
            </ProTip>
          </StepCard>

          <StepCard number={12} title="Fetch, extract, and translate content">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Use fetch for whole-page reading, extract for precise CSS selectors, and then ask Claude to translate
              or rewrite the result.
            </p>
            <CodeBlock
              filename="Terminal"
              code={`# Summarize a public page as Markdown
node src/index.js fetch "https://example.com" --format markdown

# Extract every link from a page
node src/index.js extract "https://example.com" --selector "a" --all --attr href

# Pull specific text, then translate it in Claude
node src/index.js fetch "https://example.com" \\
  --goal "Extract the main article text and any quoted claims" \\
  --format text`}
              editable
            />
            <CodeBlock
              filename="Claude Code prompt"
              code={`Use the fetched text above. Translate it into English, preserve names and numbers exactly, then give me:
- A literal translation
- A natural business-English version
- Three claims worth fact-checking`}
              editable
            />
          </StepCard>
        </section>

        {/* ====================================================
            MLX WHISPER
        ==================================================== */}
        <section id="mlx-whisper" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Local Audio</span>
            <h2 className="text-2xl font-bold text-[#FCF4EB]">Transcribe Locally with MLX Whisper</h2>
          </div>

          <StepCard number={13} title="Install MLX Whisper on Apple Silicon">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              MLX Whisper runs Whisper locally on Apple Silicon. Once the model is downloaded, transcription can run
              without sending the audio to a cloud transcription service.
            </p>
            <CodeBlock
              filename="Terminal"
              code={`brew install ffmpeg uv
mkdir -p ~/tools/mlx-whisper
cd ~/tools/mlx-whisper
uv venv
source .venv/bin/activate
uv pip install mlx-whisper huggingface_hub

# Smoke test
mlx_whisper --help`}
              editable
            />
          </StepCard>

          <StepCard number={14} title="Download a local model before class">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              The first run downloads the model automatically. For a smoother workshop, pre-download a small model
              for fast demos and a larger model for better accuracy.
            </p>
            <CodeBlock
              filename="Terminal"
              code={`source ~/tools/mlx-whisper/.venv/bin/activate

# Fast demo model
huggingface-cli download mlx-community/whisper-tiny \\
  --local-dir ~/.cache/myos/models/whisper-tiny

# Better accuracy, larger download
huggingface-cli download mlx-community/whisper-large-v3-mlx \\
  --local-dir ~/.cache/myos/models/whisper-large-v3-mlx`}
              editable
            />
          </StepCard>

          <StepCard number={15} title="Transcribe the downloaded video">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Point MLX Whisper at the media file you downloaded with Ultimate Web Fetch. Use the small model for
              a live demo, then switch to the larger model when quality matters.
            </p>
            <CodeBlock
              filename="Terminal"
              code={`source ~/tools/mlx-whisper/.venv/bin/activate

# Replace this with the actual file path printed by webfetch media
MEDIA_FILE="$HOME/Downloads/webfetch-demo/example.mp4"

mlx_whisper "$MEDIA_FILE" \\
  --model ~/.cache/myos/models/whisper-tiny \\
  --output-dir ~/Downloads/webfetch-demo \\
  --output-format txt

mlx_whisper "$MEDIA_FILE" \\
  --model ~/.cache/myos/models/whisper-large-v3-mlx \\
  --output-dir ~/Downloads/webfetch-demo \\
  --output-format srt`}
              editable
            />
          </StepCard>

          <StepCard number={16} title="Add diarization when you need speakers">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              MLX Whisper transcribes speech but does not label speakers by itself. For speaker labels, use pyannote.
              The most practical option is pyannote's hosted Precision-2 API; a local/community model is possible,
              but it needs a Hugging Face token, model access approval, and more setup.
            </p>
            <CodeBlock
              filename="Terminal"
              code={`source ~/tools/mlx-whisper/.venv/bin/activate
uv pip install pyannote.audio torch torchaudio

# Hosted diarization option
export PYANNOTEAI_API_KEY="[YOUR_PYANNOTE_API_KEY]"

python - <<'PY'
from pyannote.audio import Pipeline

pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-precision-2",
    token="[YOUR_PYANNOTE_API_KEY]",
)

output = pipeline("audio.wav")
for turn, speaker in output.speaker_diarization:
    print(f"{turn.start:.1f}\\t{turn.end:.1f}\\t{speaker}")
PY`}
              editable
            />
            <ProTip type="tip" className="mt-4">
              For most solo Instagram or TikTok clips, skip diarization. Use it for interviews, podcast clips,
              calls, and multi-speaker recordings.
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
