'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import PageParticles from '@/components/PageParticles'

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/illy') {
    return <>{children}</>
  }

  return (
    <>
      <PageParticles />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="animate-float-slow absolute top-[-20%] left-[8%] w-[520px] h-[520px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #8B79D4 0%, transparent 70%)' }}
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
      <div className="relative z-10">
        <SiteHeader />
        <div className="pt-16">{children}</div>
        <SiteFooter />
      </div>
    </>
  )
}
