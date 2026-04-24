import TabNav from '@/components/TabNav'

export const metadata = {
  title: 'Resource Vault',
  description: 'Request any resources from the workshop.',
}

export default function ResourceVaultPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-10 px-6">
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#7C69C7] font-semibold mb-4">
            Masterminds Workshop
          </p>
          <h1 className="gradient-text text-5xl md:text-6xl font-extrabold mb-5 leading-tight pb-1">
            Resource Vault
          </h1>
          <p className="text-lg text-[#FCF4EB]/60 max-w-xl mx-auto leading-relaxed">
            Everything I have built is available to you. Just ask.
          </p>
        </div>
      </section>

      {/* Tab nav */}
      <TabNav />

      {/* Content panel */}
      <section className="max-w-5xl mx-auto px-6 pt-0 pb-24">
        <div className="border border-t-0 border-white/[0.08] rounded-b-2xl overflow-hidden">
          <div className="px-8 py-12 sm:px-12 sm:py-16">

            {/* Main message */}
            <div className="max-w-2xl mb-12">
              <p className="text-[#FCF4EB]/80 text-base sm:text-lg leading-relaxed">
                Feel free to request any resources. I am happy to provide any available materials I have,
                even if they required significant time and money to build. If I have it, I am happy to
                give it to you. Just request it.
              </p>
            </div>

            {/* Featured resources */}
            <div className="mb-12">
              <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest font-semibold mb-5">
                Featured resources
              </p>
              <a
                href="/resource-vault/wordpress-api"
                className="block rounded-2xl p-6 transition-all hover:scale-[1.01] mb-4"
                style={{
                  background: 'rgba(124, 105, 199, 0.07)',
                  border: '1px solid rgba(124, 105, 199, 0.22)',
                }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                    style={{
                      background: 'rgba(124, 105, 199, 0.18)',
                      color: '#9D8FE0',
                      border: '1.5px solid rgba(124, 105, 199, 0.30)',
                    }}
                  >
                    ⬡
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#FCF4EB] font-semibold text-base mb-1">Download Your WordPress Site for Redesign</p>
                    <p className="text-[#FCF4EB]/45 text-xs mb-3">Step-by-step guide</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      Connect Claude Code to your WordPress site in 5 minutes, then let Claude pull down every page, post, and image so you have everything you need to rebuild from scratch.
                    </p>
                  </div>
                  <div
                    className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      background: 'rgba(124, 105, 199, 0.15)',
                      color: '#9D8FE0',
                      border: '1px solid rgba(124, 105, 199, 0.25)',
                    }}
                  >
                    View guide
                  </div>
                </div>
              </a>
              <a
                href="/coach-kit-onboarding-matrix.html"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl p-6 transition-all hover:scale-[1.01]"
                style={{
                  background: 'rgba(124, 105, 199, 0.07)',
                  border: '1px solid rgba(124, 105, 199, 0.22)',
                }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                    style={{
                      background: 'rgba(124, 105, 199, 0.18)',
                      color: '#9D8FE0',
                      border: '1.5px solid rgba(124, 105, 199, 0.30)',
                    }}
                  >
                    ◈
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#FCF4EB] font-semibold text-base mb-1">Coach Kit Onboarding Matrix</p>
                    <p className="text-[#FCF4EB]/45 text-xs mb-3">by Studio Solay</p>
                    <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                      An interactive AI priority matrix built for coaches. Map your weekly tasks by importance and time, then let the tool surface what to automate, augment, protect, or batch. Drag tasks around the matrix and export your action plan.
                    </p>
                  </div>
                  <div
                    className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      background: 'rgba(124, 105, 199, 0.15)',
                      color: '#9D8FE0',
                      border: '1px solid rgba(124, 105, 199, 0.25)',
                    }}
                  >
                    Open tool
                  </div>
                </div>
              </a>
            </div>

            {/* Example resources */}
            <div>
              <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest font-semibold mb-5">
                Examples of what you can request
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: '◈',
                    title: 'Pitch Decks',
                    desc: 'Real decks I have used or reviewed. Look them over, borrow the structure, adapt the framing.',
                    variant: 'purple' as const,
                  },
                  {
                    icon: '⬡',
                    title: 'Financial Models',
                    desc: 'Potential models and frameworks for thinking about revenue, costs, and growth projections.',
                    variant: 'pink' as const,
                  },
                  {
                    icon: '✦',
                    title: 'Training Guides',
                    desc: 'Step-by-step guides on topics I have built playbooks for over the years.',
                    variant: 'purple' as const,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl p-5"
                    style={{
                      background: item.variant === 'purple'
                        ? 'rgba(124, 105, 199, 0.07)'
                        : 'rgba(245, 195, 198, 0.07)',
                      border: item.variant === 'purple'
                        ? '1px solid rgba(124, 105, 199, 0.15)'
                        : '1px solid rgba(245, 195, 198, 0.15)',
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold mb-4"
                      style={{
                        background: item.variant === 'purple'
                          ? 'rgba(124, 105, 199, 0.18)'
                          : 'rgba(245, 195, 198, 0.12)',
                        color: item.variant === 'purple' ? '#9D8FE0' : '#F5C3C6',
                        border: item.variant === 'purple'
                          ? '1.5px solid rgba(124, 105, 199, 0.30)'
                          : '1.5px solid rgba(245, 195, 198, 0.25)',
                      }}
                    >
                      {item.icon}
                    </div>
                    <p className="text-[#FCF4EB] font-semibold text-sm mb-2">{item.title}</p>
                    <p className="text-[#FCF4EB]/45 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
