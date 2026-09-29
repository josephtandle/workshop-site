export function estimateAiLevel(text) {
  const rules = [
    [6, /\b(api|apis|bot|bots|webhook|webhooks|n8n|zapier|make\.com|integromat|python|script)\b/i, 'mentions APIs/bots/webhooks or automation tools'],
    [5, /\b(claude|opus|fable|sonnet|cursor|codex|claude code|lovable|bolt|replit)\b/i, 'mentions Claude/Opus/Fable/Sonnet/Cursor/Codex/Lovable/Bolt/Replit'],
    [3, /\b(chatgpt|chat gpt|chat-gpt|gpt|custom gpt|agent|agents|gemini|copilot|fathom|otter|fireflies|midjourney|canva ai|ai)\b/i, 'mentions using AI tools already'],
  ];
  for (const [level, pattern, note] of rules) {
    if (pattern.test(text ?? '')) return { level, note };
  }
  // No real evidence (no business-context signal, no chat/transcript note, no member
  // history hit). Leave it ungraded rather than guessing a level — a low default here
  // used to overwrite genuine self-reports (e.g. "self 7 / ours 1") every hour, since
  // the grading pass evaluates every confirmed row, not just ones lacking a self-report.
  return { level: null, note: 'no evidence to grade from; leaving ungraded until real signal appears' };
}
