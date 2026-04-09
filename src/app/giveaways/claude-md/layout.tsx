import type { ReactNode } from 'react'

export const metadata = {
  title: 'Free CLAUDE.md Template',
  description: 'Stop repeating yourself to Claude. One file in your project root loads your rules, preferences, and context automatically every session.',
}

export default function ClaudeMdLayout({ children }: { children: ReactNode }) {
  return children
}
