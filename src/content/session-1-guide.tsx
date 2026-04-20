import StickyVideoPlayer from '@/components/StickyVideoPlayer';

const YOUTUBE_ID = 'pLuuTqL89qY';

export default function Session1Guide() {
  return (
    <>
    <div className="max-w-3xl mx-auto px-6 py-16 pb-0">

      {/* Page Header */}
      <div className="mb-10">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Session One
        </p>
        <h1 className="text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
          Setting the Mastermind Container
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-8">
          Introductions, group agreements, and the mindset shift from employee to entrepreneur.
          We define what we are building together and why it matters.
        </p>

        <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 border-t border-white/[0.08] pt-6 mb-8">
          <span><span className="text-[#FCF4EB]/30 mr-2">Duration</span>~90 minutes</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Cohort</span>2</span>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
          <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest mb-4 font-semibold">What We Covered</p>
          <ul className="space-y-2">
            <li className="flex gap-2 text-sm text-[#FCF4EB]/70">
              <span className="text-[#7C69C7] flex-shrink-0">1.</span>
              <span>Introductions and what each member is building</span>
            </li>
            <li className="flex gap-2 text-sm text-[#FCF4EB]/70">
              <span className="text-[#7C69C7] flex-shrink-0">2.</span>
              <span>Group agreements and how the Mastermind works</span>
            </li>
            <li className="flex gap-2 text-sm text-[#FCF4EB]/70">
              <span className="text-[#7C69C7] flex-shrink-0">3.</span>
              <span>The mindset shift: building with AI as your co-founder</span>
            </li>
            <li className="flex gap-2 text-sm text-[#FCF4EB]/70">
              <span className="text-[#7C69C7] flex-shrink-0">4.</span>
              <span>What to expect over the next six sessions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    {/* Workshop Recording */}
    <div className="max-w-3xl mx-auto px-6 mb-14">
      <div className="mb-4">
        <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-1">Session Recording</p>
        <p className="text-[#FCF4EB]/40 text-sm">Watch the full session. Hit play and the video will stick to the top as you scroll.</p>
      </div>
      <StickyVideoPlayer videoId={YOUTUBE_ID} title="Cohort 2, Session 1: Setting the Mastermind Container" />
    </div>

    <div className="max-w-3xl mx-auto px-6 pb-16">

      {/* Next steps */}
      <section className="mb-16">
        <div className="border-t border-white/[0.08] pt-12">
          <h2 className="text-2xl font-bold text-[#FCF4EB] mb-4">Before Next Session</h2>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-10">
            Make sure your tools are set up and ready to go. Next session we start building.
          </p>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 mb-8">
            <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">Action Items</p>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#7C69C7] text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Complete the prep requirements</p>
                  <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                    Set up your Claude Pro account and Vercel account. Takes about 5 minutes.
                    Go to the <a href="/session/1/prep" className="text-[#7C69C7] hover:underline">Prep Requirements</a> page if you have not done this yet.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#7C69C7] text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Introduce yourself in the group</p>
                  <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                    If you have not already, drop a message in the Masterminds WhatsApp group with your name, what you do, and what you want to build.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#7C69C7]/50 bg-[#7C69C7]/[0.08] rounded-xl p-6">
            <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">Up Next</p>
            <p className="text-[#FCF4EB]/80 leading-relaxed">
              <a href="/session/2" className="text-[#7C69C7] hover:underline font-semibold">Session 2: Building Your First Web Page with AI</a>
              {' '}. You will go from zero to a live personal brand website in under two hours.
            </p>
          </div>

        </div>
      </section>

    </div>
    </>
  );
}
