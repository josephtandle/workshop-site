import React from 'react'

type TipType = 'tip' | 'warning' | 'info'

interface ProTipProps {
  type?: TipType
  title?: string
  className?: string
  children: React.ReactNode
}

const typeStyles: Record<TipType, { border: string; bg: string; titleColor: string; defaultTitle: string }> = {
  tip: {
    border: 'border-l-[#8B79D4]',
    bg: 'bg-[rgba(139,121,212,0.08)]',
    titleColor: 'text-[#8B79D4]',
    defaultTitle: 'Pro Tip',
  },
  warning: {
    border: 'border-l-[#F5C3C6]',
    bg: 'bg-[rgba(245,195,198,0.08)]',
    titleColor: 'text-[#F5C3C6]',
    defaultTitle: 'Heads Up',
  },
  info: {
    border: 'border-l-[#FCF4EB]',
    bg: 'bg-[rgba(252,244,235,0.06)]',
    titleColor: 'text-[#FCF4EB]/80',
    defaultTitle: 'Note',
  },
}

export default function ProTip({ type = 'tip', title, className, children }: ProTipProps) {
  const styles = typeStyles[type]
  const displayTitle = title ?? styles.defaultTitle

  return (
    <div
      className={`protip-hover my-5 rounded-r-xl border-l-4 px-5 py-4 ${styles.border} ${styles.bg} ${className ?? ''}`}
    >
      <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${styles.titleColor}`}>
        {displayTitle}
      </p>
      <div className="text-sm text-[#FCF4EB]/70 leading-relaxed space-y-1">
        {children}
      </div>
    </div>
  )
}
