import Link from 'next/link'

interface SessionCardProps {
  slug: string
  number: number
  title: string
  description: string
  date: string
  hasGuide: boolean
  hasPrep: boolean
  hasBonus: boolean
  hasWrapup?: boolean
}

export default function SessionCard({
  slug,
  number,
  title,
  description,
  hasGuide,
  hasPrep,
  hasBonus,
  hasWrapup,
}: SessionCardProps) {
  const hasContent = hasGuide || hasPrep || hasBonus || !!hasWrapup

  const inner = (
    <div className={`flex items-center gap-5 py-5 px-4 rounded-xl transition-colors duration-150 ${hasContent ? 'group-hover:bg-white/[0.04]' : ''}`}>
      {/* Number */}
      <div
        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
        style={{
          background: hasContent ? 'rgba(124, 105, 199, 0.18)' : 'rgba(252, 244, 235, 0.06)',
          color: hasContent ? '#7C69C7' : 'rgba(252, 244, 235, 0.30)',
          border: `1.5px solid ${hasContent ? 'rgba(124, 105, 199, 0.35)' : 'rgba(252, 244, 235, 0.10)'}`,
        }}
      >
        {number}
      </div>

      {/* Title + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className={`font-semibold text-sm leading-snug ${hasContent ? 'text-[#FCF4EB] group-hover:text-white transition-colors duration-150' : 'text-[#FCF4EB]/40'}`}>
            {title}
          </span>
          {/* Badges in order: Prep → Guide → Bonus */}
          {hasPrep && (
            <span
              className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(252, 244, 235, 0.07)',
                color: 'rgba(252, 244, 235, 0.45)',
                border: '1px solid rgba(252, 244, 235, 0.12)',
              }}
            >
              Prep
            </span>
          )}
          {hasGuide && (
            <span
              className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(124, 105, 199, 0.15)',
                color: '#7C69C7',
                border: '1px solid rgba(124, 105, 199, 0.25)',
              }}
            >
              Guide
            </span>
          )}
          {hasBonus && (
            <span
              className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(245, 195, 198, 0.10)',
                color: '#F5C3C6',
                border: '1px solid rgba(245, 195, 198, 0.20)',
              }}
            >
              Bonus
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-[#FCF4EB]/40 leading-relaxed line-clamp-2">{description}</p>
        )}
      </div>

      {/* Arrow — only when clickable */}
      {hasContent && (
        <div className="flex-shrink-0 text-[#FCF4EB]/20 group-hover:text-[#7C69C7] group-hover:translate-x-1 transition-all duration-200">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  )

  if (!hasContent) {
    return <div>{inner}</div>
  }

  return (
    <Link href={`/session/${slug}`} className="group block">
      {inner}
    </Link>
  )
}
