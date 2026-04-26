import type { Metadata } from 'next'
import Reveal from '@/components/Reveal'
import GiveawayForm from './GiveawayForm'

export const metadata: Metadata = {
  title: 'The Cult Brand Playbook',
  description: 'The 7-element system behind Apple, Nike, and Supreme. Stop competing on features. Start competing on identity.',
  openGraph: {
    title: 'The Cult Brand Playbook — Free Guide',
    description: 'The 7-element system behind Apple, Nike, and Supreme. Stop competing on features. Start competing on identity.',
  },
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const ELEMENTS = [
  {
    number: '01',
    name: 'Shared Beliefs',
    teaser: 'The manifesto that makes some people nod hard and others disagree. Disagreement is the signal.',
    icon: '✦',
  },
  {
    number: '02',
    name: 'The Common Enemy',
    teaser: 'Every cult brand defines itself as much by what it opposes as what it stands for.',
    icon: '◈',
  },
  {
    number: '03',
    name: 'Identity',
    teaser: "The most powerful thing you can sell is an answer to 'who am I?' Watch how people describe themselves with cult brands. They say 'I am,' not 'I use.'",
    icon: '◎',
  },
  {
    number: '04',
    name: 'Rituals',
    teaser: 'Repeated behaviors that reinforce belonging. They separate insiders from outsiders without a single word.',
    icon: '⟳',
  },
  {
    number: '05',
    name: 'Sacred Language',
    teaser: "Every tribe develops its own vocabulary. Know the words, you're in. Don't, you're out.",
    icon: '⟡',
  },
  {
    number: '06',
    name: 'Symbols',
    teaser: 'Visual and verbal badges that let members recognize each other instantly across a crowded room.',
    icon: '◇',
  },
  {
    number: '07',
    name: 'Community',
    teaser: 'Competitors can copy your product. They cannot copy your people. This is the only moat that compounds.',
    icon: '⬡',
  },
]

const BRANDS = [
  { brand: 'Starbucks', visible: 'Coffee', mental: 'Sophistication' },
  { brand: 'Nike', visible: 'Shoes', mental: 'Greatness' },
  { brand: 'Liquid Death', visible: 'Canned water', mental: 'Rebellion' },
  { brand: 'Apple', visible: 'Computers', mental: 'Non-conformity' },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function CultBrandPlaybookPage() {
  return (
    <main className="min-h-screen">

      {/* Hero */}
      <section className="relative pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-purple/10 border border-purple/20 rounded-full px-4 py-1.5 mb-8">
              <span className="text-purple text-xs">✦</span>
              <span className="text-purple text-xs font-semibold tracking-widest uppercase">Free Playbook</span>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <h1 className="gradient-text text-5xl md:text-6xl font-extrabold leading-[1.08] pb-2 mb-6">
              Your competitors<br />are fighting<br />in the wrong arena.
            </h1>
          </Reveal>

          <Reveal delay={2}>
            <p className="text-cream/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              Most brands compete on features, price, and specs — the Visible Market.
              The brands with the most devoted customers compete on identity, belief, and meaning — the Mental Market.
              This playbook shows you how to move.
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 max-w-xl mx-auto">
              <GiveawayForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Two Markets */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-2xl font-bold text-cream text-center mb-3">
              They are not selling products. They are selling worlds.
            </h2>
            <p className="text-cream/50 text-center text-sm mb-10">Look at what premium brands actually sell.</p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BRANDS.map((item, i) => (
              <Reveal key={item.brand} delay={i + 1}>
                <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 text-center">
                  <p className="text-cream/40 text-xs mb-2">{item.brand}</p>
                  <div className="text-cream/25 text-xs line-through mb-1">{item.visible}</div>
                  <div className="text-purple font-semibold text-sm">{item.mental}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={5}>
            <div className="mt-6 bg-purple/10 border border-purple/20 rounded-xl p-5 text-center">
              <p className="text-cream/80 text-sm leading-relaxed">
                <span className="text-cream font-semibold">None of these brands lead with specs.</span>{' '}
                They lead with who you become when you buy. The Cult Brand Playbook teaches you to do the same.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-purple font-semibold text-center mb-3">
              What is inside
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-cream text-center mb-2">
              The 7 Elements of a Cult Brand
            </h2>
            <p className="text-cream/50 text-center text-sm mb-12">
              Found in every brand that achieves deep loyalty, from Apple to CrossFit to religious movements.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-4">
            {ELEMENTS.map((el, i) => (
              <Reveal key={el.number} delay={i + 1}>
                <div className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-purple/20 rounded-xl p-5 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-9 h-9 bg-purple/10 border border-purple/20 rounded-lg flex items-center justify-center">
                      <span className="text-purple text-sm">{el.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-purple/50 text-xs font-mono">{el.number}</span>
                        <span className="text-cream font-semibold text-sm">{el.name}</span>
                      </div>
                      <p className="text-cream/50 text-xs leading-relaxed">{el.teaser}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}

            {/* Bonus card */}
            <Reveal delay={8}>
              <div className="bg-purple/10 border border-purple/20 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-9 h-9 bg-purple/20 border border-purple/30 rounded-lg flex items-center justify-center">
                    <span className="text-purple text-sm">+</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-cream font-semibold text-sm">Bonus: The 30-Day Sprint</span>
                    </div>
                    <p className="text-cream/50 text-xs leading-relaxed">
                      A week-by-week action plan to diagnose where you are and build all 7 elements from scratch.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Repeat */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl font-extrabold text-cream mb-4">
              Get the playbook. It is free.
            </h2>
            <p className="text-cream/50 text-sm mb-8">
              The full 7-element framework with real examples from Nike, Apple, CrossFit, Liquid Death, and more.
              Delivered to your inbox right now.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
              <GiveawayForm />
            </div>
          </Reveal>
          <Reveal delay={2}>
            <p className="text-cream/25 text-xs mt-6">
              Built by{' '}
              <a href="https://mastermindshq.business" className="text-purple/60 hover:text-purple transition-colors">
                Masterminds HQ
              </a>
              . A community where founders build real businesses with AI.
            </p>
          </Reveal>
        </div>
      </section>

    </main>
  )
}
