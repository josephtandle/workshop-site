import Link from 'next/link'

interface SessionCardProps {
  slug: string
  number: number
  title: string
  description: string
  date: string
  hasGuide: boolean
  hasPrep: boolean
}

export default function SessionCard({
  slug,
  number,
  title,
  description,
  date,
  hasGuide,
  hasPrep,
}: SessionCardProps) {
  return (
    <Link
      href={`/session/${slug}`}
      className="group card-hover card-shimmer block bg-white/[0.05] border border-white/[0.10] rounded-2xl p-6"
    >
      <div className="flex items-start gap-4">
        {/* Number circle */}
        <div
          className="number-glow flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
          style={{
            background: 'rgba(124, 105, 199, 0.18)',
            color: '#7C69C7',
            border: '1.5px solid rgba(124, 105, 199, 0.35)',
          }}
        >
          {number}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-[#FCF4EB] leading-snug mb-1 group-hover:text-white transition-colors duration-200">
                {title}
              </h3>
              <p className="text-xs text-[#FCF4EB]/40 mb-3">{date}</p>
              <p className="text-sm text-[#FCF4EB]/60 leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 mt-1 text-[#FCF4EB]/25 group-hover:text-[#7C69C7] group-hover:translate-x-1 transition-all duration-200">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Badges */}
          {(hasGuide || hasPrep) && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {hasGuide && (
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full transition-all duration-200 group-hover:bg-[rgba(124,105,199,0.25)]"
                  style={{
                    background: 'rgba(124, 105, 199, 0.15)',
                    color: '#7C69C7',
                    border: '1px solid rgba(124, 105, 199, 0.25)',
                  }}
                >
                  Session Guide
                </span>
              )}
              {hasPrep && (
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(252, 244, 235, 0.07)',
                    color: 'rgba(252, 244, 235, 0.55)',
                    border: '1px solid rgba(252, 244, 235, 0.12)',
                  }}
                >
                  Prep Required
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
