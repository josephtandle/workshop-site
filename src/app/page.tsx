import { sessions } from '@/lib/sessions'
import SessionCard from '@/components/SessionCard'
import Reveal from '@/components/Reveal'
import StaggerList, { StaggerItem } from '@/components/StaggerList'
import TabNav from '@/components/TabNav'

export const metadata = {
  title: 'Session Guides',
  description: 'Follow-along workshop references for the Masterminds cohort. Copy code, follow steps, and build real things.',
}

export default function HomePage() {
  const sorted = [...sessions].sort((a, b) => a.number - b.number)

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-10 px-6">
        <div className="relative max-w-3xl mx-auto text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-[#7C69C7] font-semibold mb-4">
              Masterminds Workshop
            </p>
          </Reveal>
          <Reveal delay={2}>
            <h1 className="gradient-text text-5xl md:text-6xl font-extrabold mb-5 leading-tight pb-1">
              Session Guides
            </h1>
          </Reveal>
          <Reveal delay={3}>
            <p className="text-lg text-[#FCF4EB]/60 max-w-xl mx-auto leading-relaxed">
              Follow-along references for each live workshop. Copy code, follow steps, build real things.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Tab nav */}
      <TabNav />

      {/* Sessions list */}
      <section className="max-w-5xl mx-auto px-6 pt-0 pb-24">
        <div className="border border-t-0 border-white/[0.08] rounded-b-2xl overflow-hidden">
          <StaggerList staggerDelay={0.07}>
            {sorted.map((session, i) => (
              <StaggerItem key={session.slug}>
                <div className={i < sorted.length - 1 ? 'border-b border-white/[0.06]' : ''}>
                  <SessionCard {...session} />
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      </section>
    </main>
  )
}
