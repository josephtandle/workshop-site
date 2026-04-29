'use client'

import { useState } from 'react'
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { copyWithConfetti } from '@/lib/copyWithConfetti'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  editable?: boolean
  codexPrompt?: boolean
}

function toCodexPrompt(prompt: string) {
  const codexPrompt = prompt
    .replace(/\bClaude Code\b/g, 'Codex')
    .replace(/\bClaude\b/g, 'Codex')
    .replace(/\bCLAUDE\.md\b/g, 'AGENTS.md')
    .replace(/\bclaude\.md\b/g, 'agents.md')

  if (/^\s*codex\s+--yolo\b/i.test(codexPrompt)) return codexPrompt

  return `codex --yolo\n\n${codexPrompt}`
}

type MagneticCopyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant: 'primary' | 'secondary'
}

function MagneticCopyButton({ children, className = '', variant, ...props }: MagneticCopyButtonProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const variantClass =
    variant === 'primary'
      ? 'copy-button-glass copy-button-primary'
      : 'copy-button-glass copy-button-secondary'

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 5
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 4
    setOffset({ x, y })
    props.onMouseMove?.(event)
  }

  const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
    setOffset({ x: 0, y: 0 })
    props.onMouseLeave?.(event)
  }

  return (
    <button
      {...props}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`px-3.5 py-1.5 text-xs font-semibold transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out select-none ${variantClass} ${className}`}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`, ...props.style }}
    >
      {children}
    </button>
  )
}

export default function CodeBlock({ code, language, filename, editable, codexPrompt }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [codexCopied, setCodexCopied] = useState(false)
  const [value, setValue] = useState(code)
  const showCodexCopy = codexPrompt ?? filename?.toLowerCase().includes('prompt') ?? false
  const copyLabel = showCodexCopy ? 'Copy Claude Code' : 'Copy'
  const copiedLabel = showCodexCopy ? 'Copied Claude Code!' : 'Copied!'

  const handleCopy = async (event: MouseEvent<HTMLButtonElement>) => {
    try {
      await copyWithConfetti(editable ? value : code, event)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: do nothing
    }
  }

  const handleCodexCopy = async (event: MouseEvent<HTMLButtonElement>) => {
    try {
      await copyWithConfetti(toCodexPrompt(editable ? value : code), event)
      setCodexCopied(true)
      setTimeout(() => setCodexCopied(false), 2000)
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
        <div className="flex flex-wrap items-center justify-end gap-2">
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
          <MagneticCopyButton onClick={handleCopy} variant="primary">
            {copied ? copiedLabel : copyLabel}
          </MagneticCopyButton>
        </div>
      </div>

      {editable ? (
        <div style={{ background: '#0d0d0d' }}>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={rowCount}
            spellCheck={false}
            className="w-full p-4 text-sm font-mono leading-relaxed text-[#FCF4EB]/80 outline-none resize-none"
            style={{ background: '#0d0d0d' }}
          />
          {showCodexCopy && (
            <div className="flex justify-end px-4 pt-3 pb-4 border-t border-white/[0.06]">
              <MagneticCopyButton onClick={handleCodexCopy} variant="secondary" className="py-1.5">
                {codexCopied ? 'Copied Codex!' : 'Copy Codex Only'}
              </MagneticCopyButton>
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: '#0d0d0d' }}>
          <pre
            className="overflow-x-auto whitespace-pre-wrap break-words p-4 text-sm font-mono leading-relaxed text-[#FCF4EB]/80 sm:whitespace-pre sm:break-normal"
          >
            <code>{code}</code>
          </pre>
          {showCodexCopy && (
            <div className="flex justify-end px-4 pt-3 pb-4 border-t border-white/[0.06]">
              <MagneticCopyButton onClick={handleCodexCopy} variant="secondary" className="py-1.5">
                {codexCopied ? 'Copied Codex!' : 'Copy Codex Only'}
              </MagneticCopyButton>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
