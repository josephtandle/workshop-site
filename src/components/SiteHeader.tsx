import Link from 'next/link'

export default function SiteHeader() {
  return (
    <header className="header-glow fixed top-0 left-0 right-0 z-50 bg-[rgba(21,21,21,0.75)] backdrop-blur-[12px] border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-base font-bold tracking-tight hover:opacity-90 transition-opacity">
          <span className="text-[#FCF4EB]">Masterminds HQ</span>
          <span className="text-[#7C69C7]"> Workshop</span>
        </Link>
        <a
          href="https://mastermindshq.business"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#FCF4EB]/40 hover:text-[#FCF4EB]/70 transition-colors duration-200"
        >
          mastermindshq.business
        </a>
      </div>
    </header>
  )
}
