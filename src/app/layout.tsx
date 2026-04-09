import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

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
      <body className="bg-[#151515] text-[#FCF4EB] min-h-screen font-sans antialiased">
        <SiteHeader />
        <div className="pt-16">{children}</div>
        <SiteFooter />
      </body>
    </html>
  )
}
