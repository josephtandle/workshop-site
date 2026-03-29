export default function SiteFooter() {
  return (
    <footer className="footer-glow border-t border-white/[0.06] mt-24 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-6">

        {/* Social icons */}
        <div className="flex items-center gap-5">
          <a
            href="https://www.instagram.com/joe.che.official/"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            aria-label="Instagram"
          >
            <div className="icon-hover w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.10] flex items-center justify-center group-hover:bg-white/[0.10] group-hover:border-white/[0.20] transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="#FCF4EB" strokeOpacity="0.7" strokeWidth="1.8"/>
                <circle cx="12" cy="12" r="4.5" stroke="#FCF4EB" strokeOpacity="0.7" strokeWidth="1.8"/>
                <circle cx="17.5" cy="6.5" r="1" fill="#FCF4EB" fillOpacity="0.7"/>
              </svg>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/joeche1/"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            aria-label="LinkedIn"
          >
            <div className="icon-hover w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.10] flex items-center justify-center group-hover:bg-white/[0.10] group-hover:border-white/[0.20] transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="4" stroke="#FCF4EB" strokeOpacity="0.7" strokeWidth="1.8"/>
                <path d="M7 10v7M7 7v.5" stroke="#FCF4EB" strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M11 17v-3.5c0-1.5 1-2.5 2.5-2.5S16 12 16 13.5V17" stroke="#FCF4EB" strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M11 10v7" stroke="#FCF4EB" strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
          </a>

          <a
            href="https://www.tiktok.com/@joe.che6"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            aria-label="TikTok"
          >
            <div className="icon-hover w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.10] flex items-center justify-center group-hover:bg-white/[0.10] group-hover:border-white/[0.20] transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" stroke="#FCF4EB" strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </a>
        </div>

        <p className="text-xs text-[#FCF4EB]/30">
          Copyright 2026, Masterminds HQ. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
