'use client'

import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'

export default function Session7DescriptGuide() {
  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-16 pb-0">

        {/* Page Header */}
        <div className="mb-10">

          {/* Bonus hero card */}
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
              Bonus Segment
            </span>
            <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
              Session Seven
            </p>
            <h1 className="gradient-text text-5xl font-extrabold leading-tight mb-5 pb-1">
              Descript: Repurpose Long-Form Content into Short-Form Gold
            </h1>
            <p className="text-[#FCF4EB]/70 text-base leading-relaxed">
              This is the second half of Session 7. It is optional. Members who do not want to learn Descript can drop off after the task board section. By the end of this segment you will have taken one long-form recording and turned it into social-ready clips, captions, and reels using Descript&rsquo;s AI editing tools.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 mb-8">
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Duration ~45 minutes
            </span>
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 14l3-9 4 6 2-3 3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Beginner
            </span>
          </div>

          {/* What is Descript */}
          <p className="text-[#FCF4EB]/60 text-sm mb-8 leading-relaxed">
            Descript turns any long-form recording (podcast, webinar, client call, session recording) into social clips, reels, and short-form content. No video editing skills needed. The only thing you need is one piece of content.
          </p>

          {/* Session Prep */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 sm:px-6 py-5 mb-8">
            <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-3">
              Before This Segment
            </p>
            <ul className="space-y-2.5">
              <li className="flex gap-2 text-sm text-[#FCF4EB]/70 leading-relaxed">
                <span className="text-[#7C69C7] mt-0.5 flex-shrink-0">&#8226;</span>
                <span>One long-form video or audio file you want to repurpose: a past recording, podcast episode, webinar, or anything over 10 minutes.</span>
              </li>
              <li className="flex gap-2 text-sm text-[#FCF4EB]/70 leading-relaxed">
                <span className="text-[#7C69C7] mt-0.5 flex-shrink-0">&#8226;</span>
                <span>
                  A free Descript account, downloaded and installed.{' '}
                  <a
                    href="https://get.descript.com/ib44r8t9noyj"
                    target="_blank"
                    rel="noopener"
                    className="text-[#7C69C7] hover:underline"
                  >
                    Get the free version of Descript here.
                  </a>
                </span>
              </li>
              <li className="flex gap-2 text-sm text-[#FCF4EB]/70 leading-relaxed">
                <span className="text-[#7C69C7] mt-0.5 flex-shrink-0">&#8226;</span>
                <span>
                  Note: the free plan is enough for today. The paid plan is $12/month and unlocks Overdub (AI voice cloning), covered in Part D.
                </span>
              </li>
            </ul>
          </div>

          {/* Table of Contents */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 sm:px-6 py-5">
            <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-4">
              In This Segment
            </p>
            <ol className="space-y-2">
              {[
                { href: '#part-a', label: 'Part A: Import Your File' },
                { href: '#part-b', label: 'Part B: Studio Sound' },
                { href: '#part-c', label: 'Part C: Edit with Text, Not a Timeline' },
                { href: '#part-d', label: 'Part D: Overdub (Paid Plan)' },
                { href: '#part-e', label: 'Part E: AI Clip Suggestions' },
                { href: '#part-f', label: 'Part F: Captions' },
                { href: '#part-g', label: 'Part G: Resize for Social' },
                { href: '#part-h', label: 'Part H: Export' },
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
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part A: Import Your File
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Everything starts with a single long-form recording. Descript will transcribe it automatically as soon as you drop it in.
          </p>

          <StepCard number={1} title="Create a new project and import your file">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Open Descript. Click <strong className="text-[#FCF4EB]">New Project</strong> from the dashboard. Give it a name related to your recording.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Drag your video or audio file directly into the project window. You can also go to <strong className="text-[#FCF4EB]">File &gt; Import</strong> and select your file from there.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              Descript will begin transcribing automatically. This takes 1 to 5 minutes depending on the length of your file. Once it finishes, the full transcript appears as editable text in the left panel.
            </p>
            <ProTip type="info">
              Descript supports MP4, MOV, MP3, WAV, M4A, and most other common formats. You do not need to convert your file first.
            </ProTip>
          </StepCard>
        </section>

        {/* Part B */}
        <section id="part-b" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part B: Studio Sound
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Before you do anything else, apply Studio Sound. This single click makes any recording sound professional.
          </p>

          <StepCard number={2} title="Apply Studio Sound to your recording">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Click your clip in the timeline. On the right side of the screen, find the <strong className="text-[#FCF4EB]">Effects</strong> panel. Toggle on <strong className="text-[#FCF4EB]">Studio Sound</strong>.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              Descript&rsquo;s AI removes background noise, normalizes volume, and reduces room echo. The whole process takes about 10 seconds. The result sounds noticeably more polished, even on recordings made on a laptop mic or in a noisy room.
            </p>
            <ProTip type="tip">
              Studio Sound alone is worth downloading Descript. Run it on any recording you plan to share before you do anything else.
            </ProTip>
          </StepCard>
        </section>

        {/* Part C */}
        <section id="part-c" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part C: Edit with Text, Not a Timeline
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            The most powerful thing about Descript is that you edit your video by editing text. No dragging clips on a timeline. No scrubbing back and forth. If you can edit a document, you can edit a video in Descript.
          </p>

          <StepCard number={3} title="Navigate your recording by clicking words">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Click any word in the transcript and the playhead jumps directly to that moment in the video. This is how you navigate. No scrubbing needed.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              Highlight a section of text and hit <strong className="text-[#FCF4EB]">Delete</strong>. That section is removed from the video. It is exactly like deleting text in a document.
            </p>
          </StepCard>

          <StepCard number={4} title="Remove filler words and silences automatically">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Go to <strong className="text-[#FCF4EB]">Edit &gt; Remove Filler Words</strong>. Descript scans the transcript and removes every instance of &ldquo;um&rdquo;, &ldquo;uh&rdquo;, &ldquo;like&rdquo;, and &ldquo;you know&rdquo; in seconds. Review the list before confirming so you keep any intentional pauses.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              Then go to <strong className="text-[#FCF4EB]">Edit &gt; Remove Silences</strong>. This tightens the pacing of your recording by cutting out the long pauses between sentences. The result feels faster and more confident without any manual editing.
            </p>
            <ProTip type="tip">
              Run Remove Silences on any recording before you clip it. It makes every clip feel more punchy without changing anything you actually said.
            </ProTip>
          </StepCard>
        </section>

        {/* Part D */}
        <section id="part-d" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part D: Overdub
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Overdub lets you fix mistakes in your recording by typing. You type the correct word, and Descript speaks it in your voice. This requires the paid plan at $12/month and a one-time 15-minute voice training setup.
          </p>

          <StepCard number={5} title="Fix a mispronounced word without re-recording">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Find the word you want to fix in the transcript. Highlight it. Right-click and select <strong className="text-[#FCF4EB]">Overdub</strong>. Type the correct word. Descript generates the audio in your voice and replaces the original.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              The first time you use Overdub, Descript will guide you through a 15-minute voice training process where you read a series of sentences. You only do this once. After that, Overdub is available on all future projects.
            </p>
            <ProTip type="warning">
              Overdub requires the Descript paid plan. If you are on the free plan today, come back to this part after upgrading.{' '}
              <a
                href="https://get.descript.com/ib44r8t9noyj"
                target="_blank"
                rel="noopener"
                className="text-[#F5C3C6] hover:underline"
              >
                View Descript plans here.
              </a>
            </ProTip>
          </StepCard>
        </section>

        {/* Part E */}
        <section id="part-e" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part E: AI Clip Suggestions
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Descript can surface the best moments from your recording automatically. Use it as a shortlist, then apply your own judgment to pick the winner.
          </p>

          <StepCard number={6} title="Let Descript suggest your best clips">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Go to <strong className="text-[#FCF4EB]">Edit &gt; Detect Highlights</strong>, or look for the <strong className="text-[#FCF4EB]">Highlights</strong> tab in the right panel depending on your version of Descript.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Descript&rsquo;s AI scans the transcript and surfaces strong sound bites, emotional peaks, and quotable moments. These show up as highlighted sections in the transcript. Each one is a candidate clip.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              Use these as starting points, not final answers. The AI is looking for energy and specificity. You are looking for what your audience actually cares about.
            </p>
          </StepCard>

          <StepCard number={7} title="Pick the winner from the shortlist">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Before you create a clip, ask yourself these two questions:
            </p>
            <div className="space-y-3 mb-4">
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
                <p className="text-[#FCF4EB]/80 text-sm leading-relaxed">
                  &ldquo;What is the one sentence from this that would make someone want to watch the full thing?&rdquo;
                </p>
              </div>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
                <p className="text-[#FCF4EB]/80 text-sm leading-relaxed">
                  &ldquo;Is this a surprising insight, a strong opinion, or a personal story moment?&rdquo;
                </p>
              </div>
            </div>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              If the answer is yes to either question, that is your clip. The AI highlights give you a shortlist. Your judgment picks the winner.
            </p>
            <ProTip type="tip">
              The best short-form clips always come from moments where you said something you actually believe, not from a summary or a transition. Strong opinions, personal stories, and unexpected angles outperform polished explainers every time.
            </ProTip>
          </StepCard>
        </section>

        {/* Part F */}
        <section id="part-f" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part F: Captions
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Most people watch social video with the sound off. Captions are not optional. Descript generates them from your transcript in one click.
          </p>

          <StepCard number={8} title="Generate and style captions for your clip">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Open your clip sequence. In the right panel, click the <strong className="text-[#FCF4EB]">Captions</strong> tab, or go to <strong className="text-[#FCF4EB]">Edit &gt; Captions</strong>.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Click <strong className="text-[#FCF4EB]">Generate Captions</strong>. Descript pulls the captions directly from the transcript you already have. Review them for any errors and fix anything that was misheard.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              Style your captions: pick a font, set the size, choose a position (center or lower third), and add a highlight color for the active word. Bold, high-contrast captions with a word-by-word highlight perform best on mobile.
            </p>
            <ProTip type="info">
              When you export with captions burned in, they are permanently part of the video file. Anyone watching on any platform will see them, even with sound off.
            </ProTip>
          </StepCard>
        </section>

        {/* Part G */}
        <section id="part-g" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part G: Resize for Social
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Your long-form recording is probably 16:9 (widescreen). Social content needs to be vertical for Reels and TikTok, or square for feed posts. Descript handles the reframe for you.
          </p>

          <StepCard number={9} title="Switch your clip to vertical or square format">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              With your clip sequence open, go to <strong className="text-[#FCF4EB]">Timeline &gt; Aspect Ratio</strong> or <strong className="text-[#FCF4EB]">Edit &gt; Resize</strong>. Choose:
            </p>
            <div className="space-y-3 mb-4">
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-1">
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#7C69C7]/20 text-[#7C69C7] border border-[#7C69C7]/30">
                    9:16
                  </span>
                  <span className="text-[#FCF4EB]/70 text-sm">Instagram Reels, TikTok, YouTube Shorts</span>
                </div>
              </div>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-1">
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#7C69C7]/20 text-[#7C69C7] border border-[#7C69C7]/30">
                    1:1
                  </span>
                  <span className="text-[#FCF4EB]/70 text-sm">Instagram and LinkedIn feed posts</span>
                </div>
              </div>
            </div>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              Descript&rsquo;s auto-reframe tries to keep faces in the frame. Check the result and manually adjust the crop box if the framing looks off.
            </p>
            <ProTip type="tip">
              Always check the auto-reframe on your actual face. It works well most of the time, but if you are moving around during the recording it can drift. Drag the crop box to lock it on your face if needed.
            </ProTip>
          </StepCard>
        </section>

        {/* Part H */}
        <section id="part-h" className="mb-14">
          <div className="mb-6 pt-4">
            <h2 className="gradient-text text-3xl font-extrabold pb-1">
              Part H: Export
            </h2>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm mb-6 leading-relaxed">
            Export each clip as a separate file. Name them clearly so you know exactly what is in each one when you go to post.
          </p>

          <StepCard number={10} title="Export your clip as a video file">
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              With your clip sequence open, go to <strong className="text-[#FCF4EB]">File &gt; Export &gt; Export Video</strong>.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Use these settings for social video:
            </p>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5 mb-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#FCF4EB]/50">Format</span>
                  <span className="text-[#FCF4EB] font-mono">MP4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FCF4EB]/50">Codec</span>
                  <span className="text-[#FCF4EB] font-mono">H.264</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FCF4EB]/50">Resolution (vertical)</span>
                  <span className="text-[#FCF4EB] font-mono">1080 x 1920</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FCF4EB]/50">Captions</span>
                  <span className="text-[#FCF4EB] font-mono">Burned in</span>
                </div>
              </div>
            </div>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
              Name each file clearly before you save it. Use a format like{' '}
              <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">2026-04-27-clip-best-line.mp4</code>{' '}
              so you know exactly which recording it came from and what the clip is.
            </p>
            <p className="text-[#FCF4EB]/70 leading-relaxed">
              For audio-only clips (podcast snippets, quote cards), export as MP3 instead of MP4 using the same export menu.
            </p>
            <ProTip type="tip">
              Export each clip to a dedicated folder on your desktop or in a cloud folder you can access from your phone. You want to be able to post directly from there without hunting for files.
            </ProTip>
          </StepCard>
        </section>

        {/* Wrap-up */}
        <section className="mb-16">
          <div className="border-t border-white/[0.08] pt-12">
            <div className="mb-4">
              <h2 className="gradient-text text-3xl font-extrabold pb-1">One recording. Multiple clips. All done.</h2>
            </div>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-10">
              You now have a full workflow for turning any long-form recording into a library of social-ready clips. Import, clean, find the moments, clip, caption, resize, export. That is the whole loop. Every recording you make from here forward has multiple clips inside it.
            </p>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 mb-8">
              <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">Support Each Other</p>
              <h3 className="text-xl font-bold text-[#FCF4EB] mb-3">Post your first clip in the Masterminds group</h3>
              <p className="text-[#FCF4EB]/70 leading-relaxed mb-6">
                Run the full workflow on one recording this week and post a clip in the group. Even a rough first export counts. The group will give you feedback on what lands.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#7C69C7] text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Share your clip</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      Post the exported clip directly in the group. Tell everyone what recording it came from and which part of Descript you used to find it (AI highlight, manual pick, or something else).
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#7C69C7] text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Tell the group which feature surprised you</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      Studio Sound, text-based editing, auto-reframe, one-click captions: one of these will be the thing that makes you keep using Descript. Post which one.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#7C69C7] text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Watch each other&rsquo;s clips</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      Leave a one-sentence reaction on someone else&rsquo;s clip. Tell them if you would stop scrolling for it.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#7C69C7]/50 bg-[#7C69C7]/[0.08] rounded-xl p-6">
              <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">Challenge</p>
              <p className="text-[#FCF4EB]/80 leading-relaxed">
                Go back to any long-form recording you made in the last 90 days. Run it through Descript this week. Apply Studio Sound, remove filler words, cut three clips, add captions, and export. That is one week of content from a recording that was already done.
              </p>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
