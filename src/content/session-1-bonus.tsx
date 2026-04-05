import Link from 'next/link'
import StepCard from '@/components/StepCard'
import ProTip from '@/components/ProTip'

function PriceCard({
  title,
  price,
  detail,
}: {
  title: string
  price: string
  detail: string
}) {
  return (
    <div className="rounded-2xl border border-white/[0.10] bg-white/[0.04] p-5">
      <p className="text-[#FCF4EB]/40 text-[10px] uppercase tracking-[0.2em] mb-2 font-semibold">
        {title}
      </p>
      <p className="text-2xl font-bold text-[#FCF4EB] mb-2">{price}</p>
      <p className="text-sm text-[#FCF4EB]/60 leading-relaxed">{detail}</p>
    </div>
  )
}

function SummaryCard({
  title,
  body,
  accent,
}: {
  title: string
  body: string
  accent: 'purple' | 'pink' | 'cream'
}) {
  const styles = {
    purple: 'border-[#7C69C7]/30 bg-[rgba(124,105,199,0.08)]',
    pink: 'border-[#F5C3C6]/30 bg-[rgba(245,195,198,0.08)]',
    cream: 'border-white/[0.12] bg-white/[0.04]',
  }

  return (
    <div className={`rounded-2xl border p-5 ${styles[accent]}`}>
      <p className="text-[#FCF4EB] font-semibold mb-2">{title}</p>
      <p className="text-sm text-[#FCF4EB]/65 leading-relaxed">{body}</p>
    </div>
  )
}

export default function Session1Bonus() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-16 pb-0">
        <nav className="mb-10 text-sm text-[#FCF4EB]/40 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#7C69C7] transition-colors">
            All Sessions
          </Link>
          <span>/</span>
          <Link href="/session/1" className="hover:text-[#7C69C7] transition-colors">
            Session 1
          </Link>
          <span>/</span>
          <span className="text-[#FCF4EB]/60">Bonus</span>
        </nav>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.10] bg-white/[0.04] px-6 py-10 sm:px-10 sm:py-12">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute -top-24 left-[-3rem] h-56 w-56 rounded-full opacity-20 blur-3xl"
              style={{ background: 'radial-gradient(circle, #7C69C7 0%, transparent 72%)' }}
            />
            <div
              className="absolute right-[-2rem] top-8 h-44 w-44 rounded-full opacity-20 blur-3xl"
              style={{ background: 'radial-gradient(circle, #F5C3C6 0%, transparent 72%)' }}
            />
          </div>

          <div className="relative">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">
                Session 1 Bonus
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-[#F5C3C6]/10 text-[#F5C3C6] border border-[#F5C3C6]/20">
                Optional
              </span>
            </div>
            <h1 className="gradient-text text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
              Dictate to Your Computer
            </h1>
            <p className="text-lg text-[#FCF4EB]/70 leading-relaxed max-w-3xl mb-8">
              This is the optional follow-along resource from Session 1. If you want to write faster,
              capture ideas out loud, or turn voice notes into content, start with MacWhisper on Mac,
              or use the built-in free dictation tools on Mac and Windows.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              <SummaryCard
                title="Fastest recommendation"
                body="If you are on a Mac, start with MacWhisper first. Free tier, fully offline, strong accuracy, and no subscription."
                accent="purple"
              />
              <SummaryCard
                title="Zero setup option"
                body="Need something right now? Use macOS Dictation or Windows Voice Typing. Both are already on your computer."
                accent="cream"
              />
              <SummaryCard
                title="Cross-platform power user"
                body="If you want real-time voice typing across apps on both Mac and Windows, Typeless and Whispersoft are the next step."
                accent="pink"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-16">
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">
              Section 1
            </span>
            <h2 className="text-2xl font-bold text-[#FCF4EB]">MacWhisper: Start Here on Mac</h2>
          </div>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-8 max-w-3xl">
            MacWhisper is the best place to start if you use a Mac. It runs locally on your machine,
            keeps your audio private, and the free version is strong enough for most people.
          </p>

          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <PriceCard title="Free Tier" price="Free" detail="Tiny, Base, and Small models with unlimited usage." />
            <PriceCard title="Pro Version" price="EUR59" detail="One-time purchase. Adds larger models, speaker detection, and more export options." />
            <PriceCard title="Student / NGO" price="EUR29" detail="Discounted Pro pricing via support@macwhisper.com." />
          </div>

          <div className="rounded-2xl border border-white/[0.10] bg-white/[0.04] p-6 mb-8">
            <p className="text-[#FCF4EB] font-semibold mb-3">Why it stands out</p>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              It uses Whisper locally on your Mac, which means audio does not need to leave your
              machine. That makes it strong for private notes, client calls, interviews, and raw idea
              capture. It also handles recorded files well, not just live dictation.
            </p>
            <a
              href="https://goodsnooze.gumroad.com/l/macwhisper"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#7C69C7] hover:text-[#9D8FE0] transition-colors"
            >
              Download MacWhisper
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <StepCard number={1} title="Download and install MacWhisper">
            <p>
              Visit{' '}
              <a
                href="https://goodsnooze.gumroad.com/l/macwhisper"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7C69C7] hover:underline"
              >
                goodsnooze.gumroad.com/l/macwhisper
              </a>{' '}
              and download the free version. Open the downloaded file, drag MacWhisper into your
              Applications folder, then launch it from Spotlight or Applications.
            </p>
          </StepCard>

          <StepCard number={2} title="Download a model and grant permissions">
            <p>
              On first launch, use the model downloader and choose <span className="text-[#FCF4EB] font-semibold">Small</span>{' '}
              for a good balance of speed and accuracy. When macOS asks for microphone access, click
              Allow. If you miss the prompt, go to System Settings, then Privacy &amp; Security, then
              Microphone, and enable MacWhisper there.
            </p>
          </StepCard>

          <StepCard number={3} title="Use it for files or live dictation">
            <p>
              Drag audio or video files into the app to transcribe them offline. For live dictation,
              click the microphone icon and speak directly into the app. Pro users can also capture
              system audio for calls, meetings, and videos playing on the Mac.
            </p>
          </StepCard>

          <div className="grid gap-4 md:grid-cols-2 mt-8">
            <SummaryCard
              title="Pros"
              body="Free tier with no hard usage cap, private on-device processing, one-time Pro purchase, and exports for TXT, SRT, VTT, DOCX, and PDF."
              accent="purple"
            />
            <SummaryCard
              title="Tradeoffs"
              body="Mac only, best on newer Apple Silicon Macs, and some advanced live-text workflows need extra setup."
              accent="cream"
            />
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">
              Section 2
            </span>
            <h2 className="text-2xl font-bold text-[#FCF4EB]">Free Built-In Dictation</h2>
          </div>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-8 max-w-3xl">
            If you do not want to install anything yet, both Mac and Windows already include dictation.
            The quality is lower than the dedicated tools, but for occasional writing it is completely fine.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.10] bg-white/[0.04] p-6">
              <p className="text-[#FCF4EB]/40 text-[10px] uppercase tracking-[0.2em] mb-3 font-semibold">
                Built-In Mac
              </p>
              <h3 className="text-xl font-bold text-[#FCF4EB] mb-3">macOS Dictation</h3>
              <ol className="space-y-3 text-sm text-[#FCF4EB]/70 leading-relaxed list-decimal list-inside">
                <li>Open System Settings and go to Keyboard.</li>
                <li>Turn Dictation on and choose your language.</li>
                <li>Confirm the right microphone is selected.</li>
                <li>Click into any text field and press the Fn or Globe key twice to start.</li>
                <li>Say punctuation out loud, like “comma”, “period”, or “new line”.</li>
              </ol>
            </div>

            <div className="rounded-2xl border border-white/[0.10] bg-white/[0.04] p-6">
              <p className="text-[#FCF4EB]/40 text-[10px] uppercase tracking-[0.2em] mb-3 font-semibold">
                Built-In Windows
              </p>
              <h3 className="text-xl font-bold text-[#FCF4EB] mb-3">Windows Voice Typing</h3>
              <ol className="space-y-3 text-sm text-[#FCF4EB]/70 leading-relaxed list-decimal list-inside">
                <li>Go to Settings, then Privacy &amp; Security, then Microphone, and confirm access is on.</li>
                <li>Click into any text field where you want words to appear.</li>
                <li>Press <span className="text-[#FCF4EB] font-semibold">Windows + H</span> to open Voice Typing.</li>
                <li>Click the microphone button and start speaking.</li>
                <li>In Windows 11, enable auto-punctuation from the toolbar settings if you want easier writing.</li>
              </ol>
            </div>
          </div>

          <ProTip type="info">
            Built-in tools are the fastest way to test whether dictation fits your workflow. If you end
            up using it every day, move to MacWhisper, Typeless, or Whispersoft later.
          </ProTip>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">
              Section 3
            </span>
            <h2 className="text-2xl font-bold text-[#FCF4EB]">Cross-Platform Options</h2>
          </div>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-8 max-w-3xl">
            If you want a tool that works on both Mac and Windows, the PDF recommended two stronger
            options: Typeless for polished cloud-based dictation, and Whispersoft for private local transcription.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#7C69C7]/20 bg-[rgba(124,105,199,0.08)] p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-xl font-bold text-[#FCF4EB]">Typeless</h3>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-[#7C69C7]/20 text-[#9D8FE0]">
                  Mac + Windows
                </span>
              </div>
              <p className="text-sm text-[#FCF4EB]/70 leading-relaxed mb-4">
                Best if you want hold-to-talk dictation that injects text directly into whatever app is
                currently focused.
              </p>
              <ul className="space-y-2 text-sm text-[#FCF4EB]/65 leading-relaxed mb-4">
                <li>Free plan: 10 hours per month</li>
                <li>Pro plan: $9 per month billed annually</li>
                <li>Needs internet because transcription happens in the cloud</li>
              </ul>
              <a
                href="https://www.typeless.com/?via=joe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#7C69C7] hover:text-[#9D8FE0] transition-colors"
              >
                Open Typeless
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="rounded-2xl border border-[#F5C3C6]/20 bg-[rgba(245,195,198,0.08)] p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-xl font-bold text-[#FCF4EB]">Whispersoft</h3>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-[#F5C3C6]/10 text-[#F5C3C6]">
                  Privacy First
                </span>
              </div>
              <p className="text-sm text-[#FCF4EB]/70 leading-relaxed mb-4">
                Best if you want local transcription and do not want audio sent to external servers.
              </p>
              <ul className="space-y-2 text-sm text-[#FCF4EB]/65 leading-relaxed mb-4">
                <li>Self-hosted Whisper is free if you are comfortable with setup</li>
                <li>Whispersoft app is a $29 one-time purchase</li>
                <li>Strong choice for sensitive content or privacy-heavy work</li>
              </ul>
              <a
                href="https://whispersoft.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#7C69C7] hover:text-[#9D8FE0] transition-colors"
              >
                Open Whispersoft
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="rounded-[2rem] border border-white/[0.10] bg-white/[0.04] p-6 sm:p-8">
            <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-[0.2em] mb-3 font-semibold">
              What to choose
            </p>
            <div className="space-y-4 text-[#FCF4EB]/70 leading-relaxed">
              <p>
                <span className="text-[#FCF4EB] font-semibold">Best overall on Mac:</span> MacWhisper.
                It is the cleanest starting point from the PDF and the strongest option for Session 1.
              </p>
              <p>
                <span className="text-[#FCF4EB] font-semibold">Best no-setup path:</span> use built-in
                Dictation on Mac or Voice Typing on Windows.
              </p>
              <p>
                <span className="text-[#FCF4EB] font-semibold">Best if you want voice typing in every app on both platforms:</span>{' '}
                Typeless.
              </p>
              <p>
                <span className="text-[#FCF4EB] font-semibold">Best if privacy matters most:</span>{' '}
                Whispersoft or self-hosted Whisper.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
