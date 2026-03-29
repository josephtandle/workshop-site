import { sessions } from '@/lib/sessions'
import SessionCard from '@/components/SessionCard'
import Reveal from '@/components/Reveal'
import StaggerList, { StaggerItem } from '@/components/StaggerList'

export default function HomePage() {
  const sorted = [...sessions].reverse()

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden py-28 px-6">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
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

        <div className="relative max-w-3xl mx-auto text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-[#7C69C7] font-semibold mb-4">
              Masterminds Workshop
            </p>
          </Reveal>
          <Reveal delay={2}>
            <h1 className="gradient-text text-5xl md:text-6xl font-extrabold mb-5 leading-tight">
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

      {/* Sessions grid */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <StaggerList className="grid gap-4 md:grid-cols-2" staggerDelay={0.1}>
          {sorted.map((session) => (
            <StaggerItem key={session.slug}>
              <SessionCard {...session} />
            </StaggerItem>
          ))}
        </StaggerList>
      </section>
    </main>
  )
}
