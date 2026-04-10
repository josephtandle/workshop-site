import Link from 'next/link'
import Reveal from '@/components/Reveal'
import StaggerList, { StaggerItem } from '@/components/StaggerList'
import PageParticles from '@/components/PageParticles'
import { giveaways } from '@/lib/giveaways'

export const metadata = {
  title: 'All Joe Che Giveaways',
  description: 'Free tools, templates, and guides from Joe Che and Masterminds HQ.',
}

const BADGE_STYLES = {
  purple: {
    background: 'rgba(124, 105, 199, 0.15)',
    color: '#7C69C7',
    border: '1px solid rgba(124, 105, 199, 0.25)',
  },
  pink: {
    background: 'rgba(245, 195, 198, 0.10)',
    color: '#F5C3C6',
    border: '1px solid rgba(245, 195, 198, 0.20)',
  },
}

export default function GiveawaysIndexPage() {
  return (
    <div className="relative">
      {/* Full-page particle canvas */}
      <PageParticles />

      {/* Full-page gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="animate-float-slow absolute top-[-20%] left-[8%] w-[520px] h-[520px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7C69C7 0%, transparent 70%)' }}
        />
        <div
          className="animate-float-slower absolute bottom-[-15%] right-[3%] w-[420px] h-[420px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #F5C3C6 0%, transparent 70%)' }}
        />
        <div
          className="animate-float-slow absolute top-[40%] right-[25%] w-[260px] h-[260px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #9D8FE0 0%, transparent 70%)', animationDelay: '3s' }}
        />
      </div>

      <main className="relative z-10">
        {/* Hero */}
        <section className="overflow-hidden py-28 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal delay={2}>
              <div className="mb-5">
                <h1 className="gradient-text text-5xl md:text-6xl font-extrabold leading-tight pb-1">
                  All Joe Che Giveaways
                </h1>
              </div>
            </Reveal>
            <Reveal delay={3}>
              <p className="text-lg text-[#FCF4EB]/60 max-w-xl mx-auto leading-relaxed">
                Free tools, templates, and guides.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Giveaways list */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="border border-white/[0.08] rounded-2xl overflow-hidden">
            <StaggerList staggerDelay={0.07}>
              {giveaways.map((item, i) => (
                <StaggerItem key={item.slug}>
                  <div className={i < giveaways.length - 1 ? 'border-b border-white/[0.06]' : ''}>
                    <Link href={`/giveaways/${item.slug}`} className="group block">
                      <div className="flex items-center gap-5 py-5 px-4 rounded-xl transition-colors duration-150 group-hover:bg-white/[0.04]">
                        {/* Icon */}
                        <div
                          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{
                            background: 'rgba(124, 105, 199, 0.18)',
                            color: '#7C69C7',
                            border: '1.5px solid rgba(124, 105, 199, 0.35)',
                          }}
                        >
                          {item.icon}
                        </div>

                        {/* Title + description */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="font-semibold text-sm leading-snug text-[#FCF4EB] group-hover:text-white transition-colors duration-150">
                              {item.title}
                            </span>
                            <span
                              className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                              style={BADGE_STYLES[item.badgeVariant]}
                            >
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs text-[#FCF4EB]/40 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        {/* Arrow */}
                        <div className="flex-shrink-0 text-[#FCF4EB]/20 group-hover:text-[#7C69C7] group-hover:translate-x-1 transition-all duration-200">
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                </StaggerItem>
              ))}
            </StaggerList>
          </div>
        </section>
      </main>
    </div>
  )
}
