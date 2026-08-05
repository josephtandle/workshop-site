/**
 * Joe's Claude referral link — single source of truth for this site.
 *
 * Every place the workshop site sends someone to GET or OPEN a Claude account
 * uses this, so signups are credited to Joe's referral. Added 2026-08-05.
 * Mirrors projects/mastermind/portal/src/lib/claude-links.ts (separate repo, so
 * the constant is duplicated rather than imported — keep the two in step).
 *
 * Use it for: "create an account", "upgrade to Pro", "open Claude", and the
 * giveaway pages that tell a cold reader to go get Claude Code.
 *
 * Do NOT use it for:
 *   - `https://claude.ai/download` — the desktop app installer, not an account.
 *   - `https://claude.ai/install.sh` — the CLI installer inside a code block.
 *   - `https://claude.ai/settings/...` — settings pages for existing users.
 *   - the `https://claude.ai/auth...` URL Claude Code prints in the terminal,
 *     quoted in troubleshooting copy as an example of what to look for.
 *     Rewriting that sends people to the wrong place mid-setup.
 */
export const CLAUDE_REFERRAL_URL = 'https://claude.ai/referral/8U0OiPj7Dg'
