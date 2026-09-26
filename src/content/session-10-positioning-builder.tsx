'use client'

import { useEffect, useMemo, useState } from 'react'

type BuilderState = {
  clientSituation: string
  competitiveAlternative: string
  uniqueCapability: string
  idealPerson: string
  standAgainst: string
  notFor: string
  firstDraftWho: string
  firstDraftSituation: string
  firstDraftOutcome: string
  firstDraftMethod: string
  firstDraftAlternative: string
  specificityBroad: string
  specificityMoreSpecific: string
  specificityFeltOutcome: string
  refinedWho: string
  refinedSituation: string
  refinedOutcome: string
  refinedMethod: string
  refinedAlternative: string
  audienceAwareness: string
  contentAwareness: string
  awarenessGapIdea: string
  whereTheySpendTime: string
  searchLanguage: string
  recognitionContent: string
  marketType: string
  marketShift: string
}

const STORAGE_KEY = 'session-10-positioning-builder'

const DEFAULT_STATE: BuilderState = {
  clientSituation: '',
  competitiveAlternative: '',
  uniqueCapability: '',
  idealPerson: '',
  standAgainst: '',
  notFor: '',
  firstDraftWho: '',
  firstDraftSituation: '',
  firstDraftOutcome: '',
  firstDraftMethod: '',
  firstDraftAlternative: '',
  specificityBroad: '',
  specificityMoreSpecific: '',
  specificityFeltOutcome: '',
  refinedWho: '',
  refinedSituation: '',
  refinedOutcome: '',
  refinedMethod: '',
  refinedAlternative: '',
  audienceAwareness: '',
  contentAwareness: '',
  awarenessGapIdea: '',
  whereTheySpendTime: '',
  searchLanguage: '',
  recognitionContent: '',
  marketType: '',
  marketShift: '',
}

const awarenessOptions = [
  'Level 1 - Unaware',
  'Level 2 - Problem Aware',
  'Level 3 - Solution Aware',
  'Level 4 - Product Aware',
  'Level 5 - Most Aware',
]

function TextArea({
  value,
  onChange,
  rows = 4,
  placeholder = 'Write here',
}: {
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-white/[0.10] bg-white/[0.04] px-4 py-3 text-sm text-[#FCF4EB] placeholder:text-[#FCF4EB]/25 focus:outline-none focus:ring-2 focus:ring-[#7C69C7]/40"
    />
  )
}

function DraftLine({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="block text-sm text-[#FCF4EB]/55 mb-2">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-3 text-sm text-[#FCF4EB] placeholder:text-[#FCF4EB]/25 focus:outline-none focus:ring-2 focus:ring-[#7C69C7]/40"
      />
    </label>
  )
}

function OptionGrid({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {options.map((option) => {
        const active = value === option
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`text-left rounded-2xl border px-4 py-3 text-sm transition-colors ${
              active
                ? 'border-[#7C69C7]/50 bg-[#7C69C7]/15 text-[#FCF4EB]'
                : 'border-white/[0.10] bg-white/[0.03] text-[#FCF4EB]/60 hover:border-[#7C69C7]/35 hover:text-[#FCF4EB]/80'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[28px] border border-white/[0.10] bg-white/[0.04] p-6 sm:p-8">
      <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-[0.22em] mb-3">{eyebrow}</p>
      <h2 className="text-2xl font-bold text-[#FCF4EB] mb-6">{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  )
}

export default function Session10PositioningBuilder() {
  const [state, setState] = useState<BuilderState>(DEFAULT_STATE)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setState({ ...DEFAULT_STATE, ...JSON.parse(saved) })
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [loaded, state])

  const update = <K extends keyof BuilderState>(key: K, value: BuilderState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const savedMessage = useMemo(() => {
    if (!loaded) return 'Loading saved notes...'
    return 'Saved in this browser automatically.'
  }, [loaded])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-10">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Session 10 Workbook
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#FCF4EB] leading-tight mb-5">
          Positioning Statement Builder
        </h1>
        <p className="text-[#FCF4EB]/70 text-base sm:text-lg leading-relaxed max-w-3xl">
          Use this during the session to write and refine your first-draft positioning statement. Save it, refine it before Part 2,
          and bring the updated version back. It becomes Section 4 of your Brand Brain.
        </p>
        <p className="text-[#FCF4EB]/35 text-xs uppercase tracking-[0.22em] mt-4">{savedMessage}</p>
      </div>

      <div className="rounded-[28px] border border-[#F5C3C6]/25 bg-[linear-gradient(135deg,rgba(245,195,198,0.12),rgba(124,105,199,0.08))] p-6 sm:p-8 mb-10">
        <p className="text-[#F5C3C6] text-xs font-semibold uppercase tracking-[0.22em] mb-3">Important</p>
        <p className="text-[#FCF4EB]/78 leading-relaxed">
          Your first draft will be too broad. That is completely normal and expected. The goal today is not a perfect statement.
          It is a statement that is noticeably more specific than what you had when you walked in. You will refine it between sessions.
        </p>
      </div>

      <div className="space-y-8">
        <Section eyebrow="Section 1" title="Before You Write - The Foundation">
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">Your best-ever client&apos;s situation</p>
            <p className="text-sm text-[#FCF4EB]/60 mb-3">What situation were they in when they first found you? What had they already tried? What made them realise they needed to change?</p>
            <TextArea value={state.clientSituation} onChange={(value) => update('clientSituation', value)} rows={6} />
          </div>
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">The real competitive alternative</p>
            <p className="text-sm text-[#FCF4EB]/60 mb-3">What would that client have done if they had never found you? Be honest. Not hired a competitor. What they would actually have done.</p>
            <TextArea value={state.competitiveAlternative} onChange={(value) => update('competitiveAlternative', value)} rows={5} />
          </div>
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">What you offer that the alternative cannot</p>
            <TextArea value={state.uniqueCapability} onChange={(value) => update('uniqueCapability', value)} rows={4} />
          </div>
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">Who cares most intensely about that</p>
            <p className="text-sm text-[#FCF4EB]/60 mb-3">Not a broad category. A specific type of person in a specific situation.</p>
            <TextArea value={state.idealPerson} onChange={(value) => update('idealPerson', value)} rows={4} />
          </div>
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">What you stand against</p>
            <TextArea value={state.standAgainst} onChange={(value) => update('standAgainst', value)} rows={4} />
          </div>
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">Who you do not serve</p>
            <p className="text-sm text-[#FCF4EB]/60 mb-3">Complete this sentence: This offer is not for...</p>
            <TextArea value={state.notFor} onChange={(value) => update('notFor', value)} rows={3} />
          </div>
        </Section>

        <Section eyebrow="Section 2" title="Write Your Positioning Statement">
          <div className="rounded-2xl border border-white/[0.08] bg-black/20 px-5 py-4 text-sm text-[#FCF4EB]/78 whitespace-pre-wrap">
{`For [specific type of person]
who is currently [specific situation],

I help them [specific outcome]

by [specific method or approach]

that [real competitive alternative] cannot provide.`}
          </div>
          <div className="grid gap-4">
            <DraftLine label="For..." value={state.firstDraftWho} onChange={(value) => update('firstDraftWho', value)} />
            <DraftLine label="Who is currently..." value={state.firstDraftSituation} onChange={(value) => update('firstDraftSituation', value)} />
            <DraftLine label="I help them..." value={state.firstDraftOutcome} onChange={(value) => update('firstDraftOutcome', value)} />
            <DraftLine label="By..." value={state.firstDraftMethod} onChange={(value) => update('firstDraftMethod', value)} />
            <DraftLine label="That ... cannot provide" value={state.firstDraftAlternative} onChange={(value) => update('firstDraftAlternative', value)} />
          </div>
        </Section>

        <Section eyebrow="Section 3" title="The Specificity Test">
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">Question 1: Could your three nearest competitors say this word for word?</p>
            <TextArea value={state.specificityBroad} onChange={(value) => update('specificityBroad', value)} rows={3} placeholder="If yes, which part is still too broad?" />
          </div>
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">Question 2: Does this describe a specific person in a specific situation, or a category of people?</p>
            <TextArea value={state.specificityMoreSpecific} onChange={(value) => update('specificityMoreSpecific', value)} rows={3} placeholder="What would make it more specific?" />
          </div>
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">Question 3: Does the outcome describe something someone actually wants to feel, or a feature they would compare?</p>
            <TextArea value={state.specificityFeltOutcome} onChange={(value) => update('specificityFeltOutcome', value)} rows={3} placeholder="What is the felt outcome underneath the feature?" />
          </div>
        </Section>

        <Section eyebrow="Section 4" title="Your Refined Draft">
          <div className="grid gap-4">
            <DraftLine label="For..." value={state.refinedWho} onChange={(value) => update('refinedWho', value)} />
            <DraftLine label="Who is currently..." value={state.refinedSituation} onChange={(value) => update('refinedSituation', value)} />
            <DraftLine label="I help them..." value={state.refinedOutcome} onChange={(value) => update('refinedOutcome', value)} />
            <DraftLine label="By..." value={state.refinedMethod} onChange={(value) => update('refinedMethod', value)} />
            <DraftLine label="That ... cannot provide" value={state.refinedAlternative} onChange={(value) => update('refinedAlternative', value)} />
          </div>
        </Section>

        <Section eyebrow="Section 5" title="The Awareness Check">
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-3">Which awareness level is most of your current audience at when they first encounter your content?</p>
            <OptionGrid value={state.audienceAwareness} onChange={(value) => update('audienceAwareness', value)} options={awarenessOptions} />
          </div>
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-3">Which awareness level is most of your content currently speaking to?</p>
            <OptionGrid value={state.contentAwareness} onChange={(value) => update('contentAwareness', value)} options={awarenessOptions} />
          </div>
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">If those two answers are different, that is your content strategy gap.</p>
            <TextArea value={state.awarenessGapIdea} onChange={(value) => update('awarenessGapIdea', value)} rows={4} placeholder="What would one piece of content for the right awareness level look like?" />
          </div>
        </Section>

        <Section eyebrow="Section 6" title="Positioning to Lead Generation">
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">Where does your ideal client spend time before they know they need you?</p>
            <TextArea value={state.whereTheySpendTime} onChange={(value) => update('whereTheySpendTime', value)} rows={4} />
          </div>
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">What are they searching for in words they would actually use?</p>
            <TextArea value={state.searchLanguage} onChange={(value) => update('searchLanguage', value)} rows={4} />
          </div>
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">What content could you create that would make a Level 2 client feel understood?</p>
            <TextArea value={state.recognitionContent} onChange={(value) => update('recognitionContent', value)} rows={4} />
          </div>
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-3">Visible Market or Mental Market?</p>
            <OptionGrid
              value={state.marketType}
              onChange={(value) => update('marketType', value)}
              options={[
                'Visible Market - I lead with features, deliverables, and what is included',
                'Mental Market - I lead with identity, transformation, and who they become',
              ]}
            />
          </div>
          <div>
            <p className="text-[#FCF4EB] font-semibold mb-2">What one change would shift it toward the Mental Market?</p>
            <TextArea value={state.marketShift} onChange={(value) => update('marketShift', value)} rows={3} />
          </div>
        </Section>

        <Section eyebrow="Section 7" title="Between Now and Part 2">
          <div className="space-y-3 text-sm text-[#FCF4EB]/70 leading-relaxed">
            <p>Read your refined positioning statement aloud to one person who knows your work.</p>
            <p>Ask them:</p>
            <ul className="space-y-2">
              <li>- Does this sound like me?</li>
              <li>- Does it sound specific, like it was written for one person?</li>
              <li>- Would my best client recognise themselves in this?</li>
            </ul>
            <p>Based on their answers, make one more refinement and bring that version to Part 2.</p>
          </div>
        </Section>
      </div>
    </div>
  )
}
