'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { label: 'Sessions',         href: '/'               },
  { label: 'Bonus Resources',  href: '/giveaways'      },
  { label: 'Resource Vault',   href: '/resource-vault' },
]

export default function TabNav() {
  const pathname = usePathname()

  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex items-end gap-0.5 sm:gap-1 border-b border-white/[0.08]">
        {TABS.map((tab) => {
          const isActive = active(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                relative flex-1 sm:flex-none min-w-0 px-2 sm:px-5 py-2.5 text-center text-xs sm:text-sm font-medium rounded-t-xl border-t border-l border-r
                transition-all duration-150 whitespace-nowrap translate-y-px
                ${isActive
                  ? 'bg-white/[0.06] border-white/[0.12] text-[#FCF4EB]'
                  : 'bg-transparent border-transparent text-[#FCF4EB]/40 hover:text-[#FCF4EB]/70 hover:bg-white/[0.03] hover:border-white/[0.06]'
                }
              `}
            >
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: '#151515' }}
                />
              )}
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
