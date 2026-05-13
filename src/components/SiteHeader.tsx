'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function SiteHeader() {
  const pathname = usePathname()

  if (pathname?.match(/^\/events\/[^/]+$/)) {
    return null
  }

  return (
    <header className="header-glow fixed top-0 left-0 right-0 z-50 bg-[rgba(21,21,21,0.75)] backdrop-blur-[12px] border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <Image
            src="/favicon.ico"
            alt="Masterminds HQ"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-base font-bold tracking-tight">
            <span className="text-[#FCF4EB]">Masterminds HQ</span>
            <span className="text-[#7C69C7]"> Workshop</span>
          </span>
        </Link>
      </div>
    </header>
  )
}
