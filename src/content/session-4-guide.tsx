'use client'

import { useState } from 'react'
import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'
import { celebrate } from '@/lib/celebrate'

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-checked={checked}
      role="checkbox"
      className={`flex-shrink-0 w-5 h-5 rounded border transition-all duration-150 flex items-center justify-center
        ${checked
          ? 'bg-[#7C69C7] border-[#7C69C7]'
          : 'bg-white/[0.04] border-white/20 hover:border-[#7C69C7]/60'
        }`}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4l2.5 2.5L9 1" stroke="#FCF4EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

const REVIEW_ITEMS = [
  { id: 'open-folder',  label: 'Open the brain_dump_map folder on my Desktop and browse what Claude created' },
  { id: 'read-index',   label: 'Open BRAIN_DUMP.md — the master index. It should feel like a summary of me' },
  { id: 'edit-cleanup', label: 'Edit or delete anything that does not feel right' },
]

export default function Session4Guide() {
  const [reviewChecked, setReviewChecked] = useState<Set<string>>(new Set())

  const toggleReview = (id: string) => {
    setReviewChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        celebrate()
      }
      return next
    })
  }

  const allReviewDone = reviewChecked.size === REVIEW_ITEMS.length

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-16 pb-0">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
            Session Four
          </p>
          <h1 className="text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
            Give Claude Code Your Brain
          </h1>
          <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-6">
            We are going to take everything you have ever told an AI and turn it into an organized
            folder that Claude Code can read. By the end of this session, Claude will know who you
            are, what you are building, and what matters to you.
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 mb-8">
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Duration ~60 minutes
            </span>
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 14l3-9 4 6 2-3 3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Beginner
            </span>
          </div>

          {/* Table of Contents */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 sm:px-6 py-5">
            <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-4">
              In This Session
            </p>
            <ol className="space-y-2">
              {[
                { href: '#part-a', label: 'Part A: Open Claude Code' },
                { href: '#part-b', label: 'Part B: Run your Brain Dump' },
                { href: '#part-c', label: 'Part C: Review, load context, and test it' },
              ].map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-[#FCF4EB]/70 hover:text-[#7C69C7] transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">

        {/* Part A */}
        <section id="part-a" className="mb-14">
          <h2 className="text-2xl font-bold text-[#FCF4EB] mb-6 pt-4">
            Part A: Open Claude Code
          </h2>

          <StepCard number={1} title="Open your Terminal">
            <div className="space-y-4">
              <div>
                <p className="text-[#FCF4EB]/90 font-medium mb-1">On a Mac:</p>
                <p>Press <strong className="text-[#FCF4EB]">Cmd+Space</strong>, type <strong className="text-[#FCF4EB]">Terminal</strong>, and press Enter.</p>
              </div>
              <div>
                <p className="text-[#FCF4EB]/90 font-medium mb-1">On a PC:</p>
                <p>Press the <strong className="text-[#FCF4EB]">Windows key</strong>, type <strong className="text-[#FCF4EB]">Command Prompt</strong>, and press Enter. Or press <strong className="text-[#FCF4EB]">Win+R</strong>, type <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">cmd</code>, and press Enter.</p>
              </div>
            </div>
          </StepCard>

          <StepCard number={2} title="Start Claude Code and skip permissions">
            <p className="mb-4">
              Type this command and press Enter:
            </p>

            <CodeBlock
              code="claude --dangerously-skip-permissions"
              language="terminal"
            />

            <p>
              This tells Claude it can create files and folders without asking for your
              approval at every step. The Brain Dump touches a lot of files, so without this,
              Claude will pause and ask you to confirm each one. We do not want that.
            </p>
          </StepCard>
        </section>

        {/* Part B */}
        <section id="part-b" className="mb-14">
          <h2 className="text-2xl font-bold text-[#FCF4EB] mb-2 pt-4">
            Part B: Run your Brain Dump
          </h2>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Fill in your URLs at the top, paste the prompt into Claude Code, and press Enter.
            Then join the group discussion. Claude will work in the background while we mastermind.
          </p>

          <StepCard number={3} title="Drag your export file into the window">
            <p className="mb-3">
              <a href="/session/4/prep" className="text-[#7C69C7] hover:underline font-medium">Before the session</a>, you were asked to export your conversation history from
              ChatGPT or Claude as a{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">.zip</code> file.
            </p>
            <p>
              Now simply drag that zip file directly into the Terminal window where Claude Code
              is running. That is it. Claude will see the file and know what to do with it.
            </p>

            <ProTip type="info">
              If you have both a ChatGPT export and a Claude export, drag both files in at the same time.
            </ProTip>
          </StepCard>

          <StepCard number={4} title="Paste and run the Brain Dump prompt">
            <p className="mb-4">
              Fill in your URLs at the top, then copy the whole thing and paste it into Claude Code.
            </p>

            <CodeBlock
              editable
              code={`# Fill this in before copying:
MY_URLS = [PASTE YOUR SOCIAL MEDIA AND WEBSITE URLS HERE, separated by commas — e.g. instagram.com/yourname, yourwebsite.com]

---

I've dragged in my files for you to create my brain dump. I want you to put them in a folder on my desktop.

Here is what I need you to do:

1. Unzip the file I dragged in and read through the conversations inside
2. Break the conversations into chunks of 50 at a time. Process each chunk one at a time. After each chunk, update a progress file called _progress.md in the brain_dump_map folder so we can pick up where we left off if anything gets cut off
3. Skip anything that is just me asking questions or looking things up. Only keep information that tells you something about me: my projects, businesses, clients, products, ideas, or goals
4. Create a folder called "brain_dump_map" on my Desktop. Inside it, create subfolders based on what you find — organize it in whatever way makes the most sense for the content
5. Save each useful piece as a clearly named .md file inside the right subfolder
6. In each subfolder, create a file called _index.md that lists every file with one sentence describing what is inside
7. At the root of brain_dump_map, create a file called BRAIN_DUMP.md with a 2-3 sentence summary of each section. This is my master index
8. Create a file for my online presence using MY_URLS. List each URL with a short description of what it is
9. Update my CLAUDE.md: add a section called "Personal Context" that:
   - States my brain_dump_map folder lives on my Desktop
   - Tells Claude to read BRAIN_DUMP.md at the start of every session involving my work or goals
   - Includes a Personal sub-section with a short paragraph about who I am and what I am building, based on what you found
10. When done, tell me what you found. Also remind me to back up brain_dump_map to Dropbox or Google Drive so I do not lose it — this is the foundation we will use in future sessions`}
            />

            <ProTip type="tip">
              If Claude stops mid-way, just say:
              <strong className="text-[#FCF4EB]"> &ldquo;Continue from where you left off. Check _progress.md.&rdquo;</strong>
              {' '}It will pick up exactly where it stopped.
            </ProTip>
          </StepCard>
        </section>

        {/* Part C */}
        <section id="part-c" className="mb-14">
          <h2 className="text-2xl font-bold text-[#FCF4EB] mb-2 pt-4">
            Part C: Review, load context, and test it
          </h2>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Once Claude finishes processing, work through the steps below.
          </p>

          {/* Step 5 — Review */}
          <StepCard number={5} title="Review your brain_dump_map">
            <p className="mb-4">
              Open the folder Claude just created and check what is in there.
            </p>

            <div className="bg-white/[0.05] border border-white/[0.10] rounded-2xl p-5 space-y-4 mb-4">
              {REVIEW_ITEMS.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-4 cursor-pointer group"
                >
                  <Checkbox
                    checked={reviewChecked.has(item.id)}
                    onChange={() => toggleReview(item.id)}
                  />
                  <span
                    className={`text-sm leading-relaxed transition-colors ${
                      reviewChecked.has(item.id)
                        ? 'text-[#FCF4EB]/40 line-through'
                        : 'text-[#FCF4EB]/70 group-hover:text-[#FCF4EB]/90'
                    }`}
                  >
                    {item.label}
                  </span>
                </label>
              ))}

              <div className="pt-3 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#FCF4EB]/40 text-xs">Progress</span>
                  <span className="text-[#FCF4EB]/40 text-xs">{reviewChecked.size} of {REVIEW_ITEMS.length}</span>
                </div>
                <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7C69C7] rounded-full transition-all duration-300"
                    style={{ width: `${(reviewChecked.size / REVIEW_ITEMS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {allReviewDone && (
              <div
                className="rounded-xl px-5 py-4 text-center"
                style={{ background: 'linear-gradient(135deg, rgba(124,105,199,0.20) 0%, rgba(245,195,198,0.15) 100%)', border: '1px solid rgba(124,105,199,0.30)' }}
              >
                <p className="text-base font-bold text-[#FCF4EB]">brain_dump_map looks good. On to the next step.</p>
              </div>
            )}
          </StepCard>

          {/* Step 6 — Load CLAUDE.md */}
          <StepCard number={6} title="Load your context">
            <p className="mb-4">
              The Brain Dump just updated your CLAUDE.md with a Personal Context section.
              Paste this prompt and Claude will read it right now, without needing to restart.
            </p>

            <CodeBlock code="Please read my CLAUDE.md file and use it as your context for the rest of this session." language="prompt" />

            <p>
              From now on, every time you open Claude Code it will load this automatically.
              You will not need to ask again.
            </p>
          </StepCard>

          {/* Step 7 — Test it */}
          <StepCard number={7} title="Ask Claude about yourself">
            <p className="mb-4">
              Now test it. These questions can only be answered if Claude properly read your
              Brain Dump. Try them one at a time and see what comes back.
            </p>

            <div className="space-y-3 mb-6">
              {[
                'Tell me about the projects I am currently working on.',
                'Tell me the things I am most curious about.',
                'Tell me my astrological sign.',
                'What was the last idea I got excited about?',
                'Who are my most important clients or collaborators?',
                'What should I focus on to move my business forward?',
              ].map((q) => (
                <CodeBlock key={q} code={q} language="prompt" />
              ))}
            </div>

            <p className="mb-3">
              Anything it does not know, let it ask you. Paste this prompt and Claude will
              interview you to fill in the gaps:
            </p>

            <CodeBlock
              editable
              code={`Look through my brain_dump_map and tell me what important information you are still missing about me. Then ask me those questions one at a time so you can fill in the gaps and build a more complete picture of who I am and what I am building.`}
            />
          </StepCard>

          {/* Move to cloud note */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 mt-6">
            <p className="text-[#FCF4EB]/70 text-sm leading-relaxed">
              <strong className="text-[#FCF4EB]">Back it up:</strong> Move brain_dump_map from your
              Desktop to Dropbox or Google Drive when you get home. We will use it again in a
              future session with All Sorted.
            </p>
          </div>
        </section>

      </div>
    </>
  )
}
