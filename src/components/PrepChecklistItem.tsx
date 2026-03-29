import React from 'react'

interface PrepChecklistItemProps {
  number: number
  title: string
  required?: boolean
  children: React.ReactNode
}

export default function PrepChecklistItem({
  number,
  title,
  required = true,
  children,
}: PrepChecklistItemProps) {
  return (
    <div className="bg-white/[0.05] border border-white/[0.10] rounded-2xl p-5 my-3">
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: 'rgba(124, 105, 199, 0.15)',
            color: '#7C69C7',
            border: '1.5px solid rgba(124, 105, 199, 0.30)',
          }}
        >
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h4 className="text-sm font-semibold text-[#FCF4EB] leading-snug">
              {title}
            </h4>
            {required ? (
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(245, 195, 198, 0.15)',
                  color: '#F5C3C6',
                  border: '1px solid rgba(245, 195, 198, 0.25)',
                }}
              >
                Required
              </span>
            ) : (
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(252, 244, 235, 0.08)',
                  color: 'rgba(252, 244, 235, 0.45)',
                  border: '1px solid rgba(252, 244, 235, 0.12)',
                }}
              >
                Optional
              </span>
            )}
          </div>
          <div className="text-sm text-[#FCF4EB]/60 leading-relaxed space-y-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
