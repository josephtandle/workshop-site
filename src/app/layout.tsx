import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import PageParticles from '@/components/PageParticles'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
})

const BASE = 'https://workshop.mastermindshq.business'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'Masterminds Workshop',
    template: '%s — Masterminds Workshop',
  },
  description:
    'Live session guides, recordings, and resources for building real businesses with AI. Led by Joe Che.',
  openGraph: {
    type: 'website',
    siteName: 'Masterminds Workshop',
    url: BASE,
    title: 'Masterminds Workshop',
    description:
      'Live session guides, recordings, and resources for building real businesses with AI.',
    images: [{ url: '/hero-joe-creation-banner.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Masterminds Workshop',
    description:
      'Live session guides, recordings, and resources for building real businesses with AI.',
    images: ['/hero-joe-creation-banner.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init','1412328130577658');
        fbq('track','PageView');
      `}</Script>
      <body className="bg-[#151515] text-[#FCF4EB] min-h-screen font-sans antialiased">
        {/* Site-wide background: particles + gradient orbs */}
        <PageParticles />
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="animate-float-slow absolute top-[-20%] left-[8%] w-[520px] h-[520px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #7C69C7 0%, transparent 70%)' }}
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
      </body>
    </html>
  )
}
