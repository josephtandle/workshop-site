export function estimateAiLevel(text) {
  const rules = [
    [6, /\b(api|apis|bot|bots|webhook|webhooks|n8n|zapier|make\.com|integromat|python|script)\b/i, 'mentions APIs/bots/webhooks or automation tools'],
    [5, /\b(claude|opus|fable|sonnet|cursor|codex|agent|agents|gpt|custom gpt)\b/i, 'mentions Claude/Opus/Fable/Cursor/Codex or building agents'],
    [3, /\b(chatgpt|gemini|copilot|fathom|otter|fireflies|midjourney|canva ai|ai)\b/i, 'mentions using AI tools already'],
  ];
  for (const [level, pattern, note] of rules) {
    if (pattern.test(text ?? '')) return { level, note };
  }
  return { level: 1, note: 'no signal in sign-up; default for free-class attendees' };
}
