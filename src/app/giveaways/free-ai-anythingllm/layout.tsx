import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const URL = 'https://workshop.mastermindshq.business/giveaways/free-ai-anythingllm'

export const metadata: Metadata = {
  title: 'AnythingLLM: A private ChatGPT that has read your files',
  description: 'A free desktop app that turns your own files into an AI you can ask questions. Think of it as a private ChatGPT that has read your documents. Free setup notes from Joe Che: 3 steps, tips and links.',
  keywords: ['AnythingLLM', 'free AI tools', 'open source', 'AI for small business', 'Joe Che', 'Business Automation Mastermind'],
  authors: [{ name: 'Joe Che', url: 'https://www.mastermindshq.business' }],
  robots: { index: true, follow: true },
  alternates: { canonical: URL },
  openGraph: {
    title: 'AnythingLLM: A private ChatGPT that has read your files',
    description: 'Drag in your course PDFs, SOPs and client notes, then ask questions and get answers with sources.',
    url: URL,
    siteName: 'Business Automation Mastermind Workshop',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnythingLLM: A private ChatGPT that has read your files',
    description: 'Drag in your course PDFs, SOPs and client notes, then ask questions and get answers with sources.',
    creator: '@joecheuk',
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
