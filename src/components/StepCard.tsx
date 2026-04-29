import React from 'react'

interface StepCardProps {
  number: number
  title: string
  children: React.ReactNode
}

export default function StepCard({ number, title, children }: StepCardProps) {
  return (
    <div className="group card-hover card-shimmer bg-white/[0.055] border border-white/[0.11] rounded-2xl p-6 my-4 backdrop-blur-sm">
      <div className="flex items-start gap-5">
        <div
          className="number-glow flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-base font-bold"
          style={{ background: 'rgba(124, 105, 199, 0.20)', color: '#7C69C7', border: '1.5px solid rgba(124, 105, 199, 0.35)' }}
        >
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[#FCF4EB] mb-3 leading-snug group-hover:text-white transition-colors duration-200">
            {title}
          </h3>
          <div className="text-sm text-[#FCF4EB]/70 leading-relaxed space-y-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
