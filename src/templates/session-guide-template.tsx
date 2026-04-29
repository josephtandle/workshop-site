/**
 * SESSION GUIDE TEMPLATE
 *
 * Use this as the starting point for every new session guide.
 * Search for all [FILL IN] markers and replace them before publishing.
 *
 * Rules (also in CLAUDE.md):
 * - Every session guide starts with "Claude Dangerously Skip Permissions"
 * - Any CodeBlock with [BRACKET] placeholders must have editable prop
 * - Put participant-editable variables in square brackets, such as [URL], [person name], or [company name]
 * - All external services must be linked (Vercel, Supabase, Resend, Porkbun, etc.)
 * - No em dashes anywhere — use "and", "then", or a period
 * - No raw code for participants to copy unless it requires zero customization
 * - Claude Code prompts in plain English only
 * - Prompts must be complete and respectful: handle missing files, multiple matches, operating systems, and previous-step failures
 * - Never use language that talks down to students, including "dummy-proof" in participant-facing copy
 * - Every prompt CodeBlock filename must include "prompt" so Copy Codex Only appears
 * - Every prompt CodeBlock shows Copy Claude Code for the exact Claude Code prompt beside it
 * - The Copy Codex Only button copies `codex --yolo`, a blank line, then the Codex wording of the same prompt
 * - Normal Copy is the primary flat dark-purple glass button; Copy Codex Only is secondary light gray
 * - Copy buttons should have a subtle magnetic hover effect that follows the pointer slightly without shifting layout
 * - Every copy action must use the shared copy helper so confetti starts from the clicked button
 * - Session guide visuals reuse the homepage language: particles, purple/rose glass, shimmer lines, glow borders, and polished hover states
 * - Step number indicators should use prominent circular badges that are larger than plain list numbering
 * - Bonus sections use the pink gradient hero card (see bottom of this file)
 * - Prep pages use session-3-prep.tsx as canonical template
 */

import StepCard from '@/components/StepCard';
import CodeBlock from '@/components/CodeBlock';
import ProTip from '@/components/ProTip';

export default function Session_FILL_IN_Guide() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">

      {/* ============================================================
          PAGE HEADER
          Fill in: session number, title, description
      ============================================================ */}
      <div className="mb-14">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Session [NUMBER]
        </p>
        <h1 className="text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
          [SESSION TITLE]
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-8">
          [ONE OR TWO SENTENCES: What will participants have built or accomplished by the end?]
        </p>

        <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 border-t border-white/[0.08] pt-6 mb-8">
          <span><span className="text-[#FCF4EB]/30 mr-2">Duration</span>[~X hours]</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Difficulty</span>Beginner</span>
        </div>

        {/* Table of contents — update anchors and labels to match your sections */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
          <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest mb-4 font-semibold">In This Session</p>
          <ol className="space-y-2">
            <li><a href="#part-a" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Part A — [TITLE]</a></li>
            <li><a href="#part-b" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Part B — [TITLE]</a></li>
            <li><a href="#part-c" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Part C — [TITLE]</a></li>
            {/* Add or remove parts as needed */}
            <li><a href="#bonus" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Bonus — [TITLE]</a></li>
          </ol>
        </div>
      </div>

      {/* ============================================================
          PART A
          Pattern: numbered steps inside <StepCard> components.
          Use ProTip type="tip" | "warning" | "info" for callouts.
      ============================================================ */}
      <section id="part-a" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part A</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">[PART TITLE]</h2>
        </div>

        <StepCard number={1} title="Claude Dangerously Skip Permissions">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Start the workshop by opening Claude Code in Dangerously Skip Permissions so you are not approving every small file edit during the build.
          </p>
          <CodeBlock
            filename="Claude Code prompt"
            code={`Start Claude Code in Dangerously Skip Permissions for this workshop session. Confirm you are in the right project folder before making changes.`}
          />
          <ProTip type="warning" className="mt-4">
            Only use this in the workshop project folder you intend to edit.
          </ProTip>
        </StepCard>

        <StepCard number={2} title="[STEP TITLE]">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            [INSTRUCTIONS — plain English, link all service names]
          </p>
          {/* Example: regular code block, no placeholders */}
          <CodeBlock filename="Terminal" code={`[COMMAND]`} />
          <ProTip type="tip" className="mt-4">
            [OPTIONAL TIP]
          </ProTip>
        </StepCard>

        <StepCard number={3} title="[STEP TITLE]">
          {/* Example: Claude Code prompt with NO placeholders — no editable needed */}
          <CodeBlock
            filename="Claude Code prompt"
            code={`[PLAIN ENGLISH INSTRUCTION FOR CLAUDE — no brackets, no placeholders]`}
          />
        </StepCard>

        <StepCard number={4} title="[STEP TITLE]">
          {/* Example: Claude Code prompt WITH placeholders — editable REQUIRED */}
          <p className="text-[#FCF4EB]/70 mb-2">
            Edit the prompt below, replace the text in brackets, then copy and paste into Claude Code:
          </p>
          <ProTip type="tip" className="mb-2">
            Click anywhere in the box to edit it before copying.
          </ProTip>
          <CodeBlock
            filename="Claude Code prompt"
            editable
            code={`[PROMPT WITH [PLACEHOLDER] VALUES THE USER MUST FILL IN]`}
          />
        </StepCard>
      </section>

      {/* ============================================================
          PART B — duplicate and rename as needed
      ============================================================ */}
      <section id="part-b" className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part B</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">[PART TITLE]</h2>
        </div>
        <p className="text-[#FCF4EB]/70 leading-relaxed mb-8">
          [OPTIONAL INTRO PARAGRAPH FOR THIS PART]
        </p>

        <StepCard number={5} title="[STEP TITLE]">
          <ol className="space-y-2 text-[#FCF4EB]/70 list-decimal list-inside">
            <li>[STEP]</li>
            <li>[STEP]</li>
          </ol>
        </StepCard>
      </section>

      {/* ============================================================
          PART C — duplicate and rename as needed
      ============================================================ */}
      <section id="part-c" className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part C</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">[PART TITLE]</h2>
        </div>

        <StepCard number={5} title="[STEP TITLE]">
          <p className="text-[#FCF4EB]/70 mb-4">[INSTRUCTIONS]</p>
        </StepCard>
      </section>

      {/* ============================================================
          WRAP-UP + SUPPORT EACH OTHER
          Keep this section. Update the challenge text.
      ============================================================ */}
      <section className="mb-16">
        <div className="border-t border-white/[0.08] pt-12">
          <h2 className="text-2xl font-bold text-[#FCF4EB] mb-4">You just built something real.</h2>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-10">
            [ONE OR TWO SENTENCES: What did they accomplish? Why does it matter?]
          </p>

          {/* Support each other — keep this block in every guide */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 mb-8">
            <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">Support Each Other</p>
            <h3 className="text-xl font-bold text-[#FCF4EB] mb-3">Post in the Masterminds group</h3>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-6">
              [WHAT TO SHARE AND WHY — e.g., share your live link, ask people to test it, etc.]
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#7C69C7] text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-[#FCF4EB] font-semibold text-sm mb-1">[ACTION 1]</p>
                  <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">[EXPLANATION]</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#7C69C7] text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-[#FCF4EB] font-semibold text-sm mb-1">[ACTION 2]</p>
                  <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">[EXPLANATION]</p>
                </div>
              </div>
            </div>
          </div>

          {/* Challenge box — keep this in every guide */}
          <div className="border border-[#7C69C7]/50 bg-[#7C69C7]/[0.08] rounded-xl p-6">
            <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">Challenge</p>
            <p className="text-[#FCF4EB]/80 leading-relaxed">
              [ONE SPECIFIC THING THEY SHOULD DO BEFORE THE NEXT SESSION]
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          BONUS SECTION
          Always use this exact hero card treatment.
          Pink gradient, large heading, free/paid note below title.
          Steps inside use plain bg-white/[0.04] cards.
      ============================================================ */}
      <section id="bonus">
        <div className="border-t border-white/[0.08] pt-16">

          {/* Bonus hero — DO NOT change this styling */}
          <div
            className="rounded-2xl p-8 mb-10"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 195, 198, 0.14) 0%, rgba(124, 105, 199, 0.10) 100%)',
              border: '1px solid rgba(245, 195, 198, 0.22)',
            }}
          >
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
              style={{ background: 'rgba(245, 195, 198, 0.18)', color: '#F5C3C6', border: '1px solid rgba(245, 195, 198, 0.30)' }}
            >
              Bonus
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#FCF4EB] leading-tight mb-3">
              [BONUS TITLE<br />CAN SPAN TWO LINES]
            </h2>
            <p className="text-[#FCF4EB]/50 text-base">
              [Free / paid note — e.g., "Free on all plans. No extra cost."]
            </p>
          </div>

          <p className="text-[#FCF4EB]/70 leading-relaxed mb-8">
            [INTRO: What is this bonus? Why should they do it? How long does it take?]
          </p>

          <div className="space-y-4">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
              <p className="text-[#FCF4EB] font-semibold mb-2">Step 1 — [TITLE]</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">[INSTRUCTIONS]</p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
              <p className="text-[#FCF4EB] font-semibold mb-2">Step 2 — [TITLE]</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">[INSTRUCTIONS]</p>
              {/* Example: editable code block inside bonus step */}
              <CodeBlock
                filename="Paste into Claude Code"
                editable
                code={`[PROMPT WITH [PLACEHOLDER] VALUES]`}
              />
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
              <p className="text-[#FCF4EB] font-semibold mb-2">Step 3 — Tell Claude Code to deploy</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
                Once Claude has updated the code, tell it:
              </p>
              <CodeBlock
                filename="Paste into Claude Code"
                code={`Deploy my website to production.`}
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
