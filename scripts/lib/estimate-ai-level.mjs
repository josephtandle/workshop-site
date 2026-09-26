export function estimateAiLevel(text) {
  const rules = [
    [6, /\b(api|apis|bot|bots|webhook|webhooks|n8n|zapier|make\.com|integromat|python|script)\b/i, 'mentions APIs/bots/webhooks or automation tools'],
    [5, /\b(claude|opus|fable|sonnet|cursor|codex|claude code|lovable|bolt|replit)\b/i, 'mentions Claude/Opus/Fable/Sonnet/Cursor/Codex/Lovable/Bolt/Replit'],
    [3, /\b(chatgpt|chat gpt|chat-gpt|gpt|custom gpt|agent|agents|gemini|copilot|fathom|otter|fireflies|midjourney|canva ai|ai)\b/i, 'mentions using AI tools already'],
  ];
  for (const [level, pattern, note] of rules) {
    if (pattern.test(text ?? '')) return { level, note };
  }
  return { level: 1, note: 'no signal in sign-up; default for free-class attendees' };
}
