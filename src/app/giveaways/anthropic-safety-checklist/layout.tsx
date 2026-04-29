import type { ReactNode } from 'react'

export const metadata = {
  title: 'Anthropic Ban Risk Audit Prompt',
  description: 'A thorough codebase audit prompt for checking Claude, profile switching, human operation, and API routing ban risk.',
}

export default function AnthropicSafetyLayout({ children }: { children: ReactNode }) {
  return children
}
