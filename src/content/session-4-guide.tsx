'use client'

import StickyVideoPlayer from '@/components/StickyVideoPlayer'

export default function Session4Guide() {
  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-16 pb-0">
        <div className="mb-2">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Session 4</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#FCF4EB] leading-tight mb-4">
          Creating Your Second Brain and Putting It in Your Pocket
        </h1>
        <p className="text-[#FCF4EB]/60 text-lg leading-relaxed mb-8">
          Turn Claude from a generic assistant into a personalized orchestrator with memory and context. Build a structured second brain from your existing documents, transcripts, and notes. Then put it all in your pocket with remote control from your phone.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {['Claude.md Setup', 'Soul File', 'Brain Dump', 'Second Brain', 'Remote Control'].map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.06] text-[#FCF4EB]/60 border border-white/[0.10]">
              {tag}
            </span>
          ))}
        </div>

        <details className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden mb-10">
          <summary className="flex items-center justify-between px-6 py-5 cursor-pointer select-none">
            <span className="text-[#FCF4EB]/80 font-medium text-sm">On this page</span>
            <svg className="w-4 h-4 text-[#FCF4EB]/40" fill="none" viewBox="0 0 16 16">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <div className="border-t border-white/[0.07] mx-5" />
          <ol className="px-6 py-5 space-y-3">
            {[
              { href: '#recording', label: 'Session Recording' },
              { href: '#claude-md', label: 'Create Your Claude.md' },
              { href: '#soul-file', label: 'Create Your Soul File' },
              { href: '#brain-dump', label: 'The Brain Dump Workflow' },
              { href: '#remote-control', label: 'Remote Control from Your Phone' },
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

      <div className="max-w-3xl mx-auto px-6 mb-14" id="recording">
        <div className="mb-4">
          <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-1">Workshop Recording</p>
          <p className="text-[#FCF4EB]/40 text-sm">Follow along with the live session. Use the tabs to switch between cohorts. Hit play and the video will stick to the top as you scroll.</p>
        </div>
        <StickyVideoPlayer
          videos={[
            { id: 'FiBCvP7Y-xw', label: 'Cohort 1' },
            { id: 'dPaxfmIInzs', label: 'Cohort 2' },
          ]}
          title="Session 4: Creating Your Second Brain"
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <section id="claude-md" className="mb-16">
          <div className="mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part 1</span>
            <h2 className="text-3xl font-bold text-[#FCF4EB] mt-3">Create Your Claude.md</h2>
            <p className="text-[#FCF4EB]/60 mt-3 leading-relaxed">
              Claude.md is your operating instructions file. It tells Claude how to behave, what rules to follow, and what tools are available. Without it, Claude is a capable but contextless stranger.
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 mb-6">
            <p className="text-[#FCF4EB]/70 text-sm leading-relaxed mb-4">
              Open a terminal and run:
            </p>
            <pre className="bg-black/30 rounded-xl p-4 text-sm font-mono text-[#9D8FE0] overflow-x-auto">
              {'claude code'}
            </pre>
            <p className="text-[#FCF4EB]/50 text-sm mt-4">
              Once inside Claude Code, create or edit your Claude.md file. Use the giveaway template as a starting point, then customize it to match how you want Claude to work for you.
            </p>
          </div>

          <div className="bg-[#7C69C7]/10 border border-[#7C69C7]/20 rounded-2xl p-6">
            <p className="text-[#9D8FE0] text-sm font-semibold mb-2">Key principle</p>
            <p className="text-[#FCF4EB]/70 text-sm leading-relaxed">
              Claude.md is for operating behavior and rules. It defines how Claude works, not who it is. Keep it focused on instructions, not personality.
            </p>
          </div>
        </section>

        <section id="soul-file" className="mb-16">
          <div className="mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part 2</span>
            <h2 className="text-3xl font-bold text-[#FCF4EB] mt-3">Create Your Soul File</h2>
            <p className="text-[#FCF4EB]/60 mt-3 leading-relaxed">
              The soul file captures tone, style, and personality. It tells Claude who it is: whether you want an aggressive, autonomous assistant or something more cautious and question-driven.
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
            <p className="text-[#FCF4EB]/70 text-sm leading-relaxed">
              Create a file called <code className="text-[#9D8FE0]">soul.md</code> in your workspace. Include things like:
            </p>
            <ul className="mt-4 space-y-2 text-[#FCF4EB]/60 text-sm">
              <li className="flex gap-2"><span className="text-[#7C69C7]">-</span> Your preferred communication style (direct vs. explanatory)</li>
              <li className="flex gap-2"><span className="text-[#7C69C7]">-</span> How autonomous you want Claude to be</li>
              <li className="flex gap-2"><span className="text-[#7C69C7]">-</span> When to ask vs. when to act</li>
              <li className="flex gap-2"><span className="text-[#7C69C7]">-</span> Tone: professional, playful, or somewhere in between</li>
            </ul>
          </div>
        </section>

        <section id="brain-dump" className="mb-16">
          <div className="mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part 3</span>
            <h2 className="text-3xl font-bold text-[#FCF4EB] mt-3">The Brain Dump Workflow</h2>
            <p className="text-[#FCF4EB]/60 mt-3 leading-relaxed">
              Import your existing knowledge into Claude, organized as a structured second brain. A well-structured brain dump is essential: folder trees and index files dramatically improve retrieval quality and reduce token usage.
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 mb-6">
            <p className="text-[#FCF4EB]/70 text-sm leading-relaxed mb-3">What to include in your brain dump:</p>
            <ul className="space-y-2 text-[#FCF4EB]/60 text-sm">
              <li className="flex gap-2"><span className="text-[#7C69C7]">-</span> Email exports, document histories, and transcripts</li>
              <li className="flex gap-2"><span className="text-[#7C69C7]">-</span> Books, podcasts, and content you want Claude to reference</li>
              <li className="flex gap-2"><span className="text-[#7C69C7]">-</span> Your current projects and business context</li>
              <li className="flex gap-2"><span className="text-[#7C69C7]">-</span> Voice samples for future writing and marketing</li>
            </ul>
          </div>

          <div className="bg-[#7C69C7]/10 border border-[#7C69C7]/20 rounded-2xl p-6">
            <p className="text-[#9D8FE0] text-sm font-semibold mb-2">Structure matters</p>
            <p className="text-[#FCF4EB]/70 text-sm leading-relaxed">
              More data is not always better in raw form. Clean, merged, and sorted material retrieves better. Create an index file in each folder so Claude can navigate without searching blindly.
            </p>
          </div>
        </section>

        <section id="remote-control" className="mb-16">
          <div className="mb-8">
            <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part 4</span>
            <h2 className="text-3xl font-bold text-[#FCF4EB] mt-3">Remote Control from Your Phone</h2>
            <p className="text-[#FCF4EB]/60 mt-3 leading-relaxed">
              Once your second brain is set up locally, you can control it remotely from your phone using Claude Code's remote control feature.
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
            <p className="text-[#FCF4EB]/70 text-sm leading-relaxed mb-4">
              In your active Claude Code session, run:
            </p>
            <pre className="bg-black/30 rounded-xl p-4 text-sm font-mono text-[#9D8FE0] overflow-x-auto">
              {'/remote control'}
            </pre>
            <p className="text-[#FCF4EB]/50 text-sm mt-4">
              This only works when your computer is awake and the terminal session is live. Keep the machine on and logged in.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
