'use client'

import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  editable?: boolean
}

export default function CodeBlock({ code, language, filename, editable }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [value, setValue] = useState(code)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editable ? value : code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: do nothing
    }
  }

  const rowCount = Math.max(6, value.split('\n').length + 2)

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-white/[0.08] border-l-2 border-l-[#7C69C7]">
      {/* Header bar — copy button always lives here */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
        <span className="text-xs text-[#FCF4EB]/40 font-mono">
          {filename ?? language ?? ''}
        </span>
        <div className="flex items-center gap-2">
          {editable && (
            <span
              className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(124, 105, 199, 0.15)',
                color: '#9D8FE0',
                border: '1px solid rgba(124, 105, 199, 0.25)',
              }}
            >
              Edit before copying
            </span>
          )}
          <button
          onClick={handleCopy}
          className="px-3 py-1 rounded-md text-xs font-medium
            bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.10]
            text-[#FCF4EB]/60 hover:text-[#FCF4EB]/90
            transition-all duration-150 select-none"
        >
          {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {editable ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={rowCount}
          spellCheck={false}
          className="w-full p-4 text-sm font-mono leading-relaxed text-[#FCF4EB]/80 outline-none resize-none"
          style={{ background: '#0d0d0d' }}
        />
      ) : (
        <pre
          className="overflow-x-auto whitespace-pre-wrap break-words p-4 text-sm font-mono leading-relaxed text-[#FCF4EB]/80 sm:whitespace-pre sm:break-normal"
          style={{ background: '#0d0d0d' }}
        >
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
