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

export const metadata: Metadata = {
  title: 'Masterminds Workshop',
  description: 'Live session guides for building real things with AI.',
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
