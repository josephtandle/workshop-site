import React from 'react'

interface StepCardProps {
  number: number
  title: string
  children: React.ReactNode
}

export default function StepCard({ number, title, children }: StepCardProps) {
  return (
    <div className="group card-hover card-shimmer my-4 rounded-2xl border border-white/[0.11] bg-white/[0.055] p-4 backdrop-blur-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <div
          className="number-glow mx-auto flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold sm:mx-0 sm:h-11 sm:w-11 sm:text-base"
          style={{ background: 'rgba(124, 105, 199, 0.20)', color: '#7C69C7', border: '1.5px solid rgba(124, 105, 199, 0.35)' }}
        >
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="mb-3 text-base font-semibold leading-snug text-[#FCF4EB] transition-colors duration-200 group-hover:text-white sm:text-lg">
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
