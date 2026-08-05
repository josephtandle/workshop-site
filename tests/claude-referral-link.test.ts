/**
 * Joe's Claude referral link must stay on every account-acquisition link.
 *
 * Added 2026-08-05, mirroring the same guard in the members portal. Signups
 * through these links earn Joe referral credits, so a plain `https://claude.ai`
 * href silently costs money — nothing breaks, so nothing else would catch it.
 *
 * Deliberately exempt (a swap here would be a bug): /download, /install.sh,
 * /settings/*, and the `claude.ai/auth...` URL Claude Code prints in the
 * terminal, which session-2's troubleshooting copy quotes verbatim.
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

import { CLAUDE_REFERRAL_URL } from '../src/lib/claude-links'

const ROOT = join(import.meta.dirname, '..')
const SRC = join(ROOT, 'src')

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules') continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full)
  }
  return out
}

/** Signup-shaped hrefs: bare claude.ai, /upgrade, or the /claude-code marketing page. */
const SIGNUP_HREF = /href=["']https:\/\/claude\.ai\/?(upgrade|claude-code)?\/?["']/

test('the referral URL is the one Joe provided', () => {
  assert.equal(CLAUDE_REFERRAL_URL, 'https://claude.ai/referral/8U0OiPj7Dg')
})

test('no account-acquisition link bypasses the referral URL', () => {
  const offenders = walk(SRC)
    .filter((file) => {
      if (file.endsWith(join('lib', 'claude-links.ts'))) return false // the source of truth documents these
      return SIGNUP_HREF.test(readFileSync(file, 'utf8'))
    })
    .map((file) => relative(ROOT, file))

  assert.deepEqual(
    offenders,
    [],
    `These link to claude.ai for signup without the referral link, so Joe loses the credit.\n` +
    `Fix: import { CLAUDE_REFERRAL_URL } from '@/lib/claude-links' and use href={CLAUDE_REFERRAL_URL}.\n` +
    `(/download, /install.sh, /settings/* and the terminal auth URL are exempt.)\n` +
    offenders.join('\n')
  )
})

test('the exempt links are still intact (guards the guard)', () => {
  // If these vanish, the regex above got too greedy and is rewriting installer
  // and troubleshooting links into signup links.
  const guide4 = readFileSync(join(SRC, 'content', 'session-4-guide.tsx'), 'utf8')
  assert.ok(guide4.includes('https://claude.ai/download'), 'the phone app download link must stay /download')

  const guide2 = readFileSync(join(SRC, 'content', 'session-2-guide.tsx'), 'utf8')
  assert.ok(guide2.includes('https://claude.ai/install.sh'), 'the CLI installer command must stay install.sh')
  assert.ok(guide2.includes('https://claude.ai/auth'), 'the terminal auth URL in troubleshooting copy must stay verbatim')
})
