import assert from 'node:assert/strict';
import test from 'node:test';
import { estimateAiLevel } from '../scripts/lib/estimate-ai-level.mjs';
import { runEstimateAiLevels } from '../scripts/estimate-ai-levels.mjs';

test('API or bot signal gets level 6', () => {
  assert.deepEqual(estimateAiLevel('With Telegram could use API/Bot'), {
    level: 6, note: 'mentions APIs/bots/webhooks or automation tools',
  });
});

test('specified examples, empty input, boundaries and rule priority', () => {
  for (const [text, level] of [
    ["I'm primarily working on opus but curious to learn more on fable", 5],
    ['Sending proposals to clients by email after zoom calls with fathom', 3],
    ['Chasing invoices', 1], [null, 1], ['', 1], ['maintain', 1], ['email', 1],
    ['use ai', 3], ['using ai', 3], ['ai recap', 3], ['ChatGPT', 3],
    ['Claude and APIs and AI', 6], ['AI with Cursor', 5], ['MAKE.COM', 6],
  ] as const) assert.equal(estimateAiLevel(text).level, level, String(text));
  assert.equal(estimateAiLevel('opus').note, 'mentions Claude/Opus/Fable/Sonnet/Cursor/Codex/Lovable/Bolt/Replit');
  assert.equal(estimateAiLevel('ai').note, 'mentions using AI tools already');
  assert.equal(estimateAiLevel(null).note, 'no signal in sign-up; default for free-class attendees');
});

test('general GPT and agent signals stay at level 3 while hands-on tools get level 5', () => {
  for (const [text, level] of [
    ['Using Chat GPT for brainstorming', 3],
    ['Creating operating system and ai agent.', 3],
    ['I use claude code extensively', 5],
    ['explored other tools such as Lovable', 5],
    ['chat-gpt', 3], ['gpt', 3], ['custom gpt', 3],
    ['I want an AI agent', 3], ['agent', 3], ['agents', 3],
    ['claude', 5], ['opus', 5], ['fable', 5], ['sonnet', 5],
    ['cursor', 5], ['codex', 5], ['bolt', 5], ['replit', 5],
    ['agents with Replit', 5], ['GPT with APIs', 6],
    ['agentic', 1], ['bolted', 1],
  ] as const) assert.equal(estimateAiLevel(text).level, level, String(text));
});

test('dry run paginates, filters, preserves self reports, prints and logs', async () => {
  const calls: URL[] = [];
  const lines: string[] = [];
  const logs: string[] = [];
  const pages = [
    [{ id: '1', attendee_name: 'Alice', business_context: 'API', ai_level: null, ai_level_source: null }],
    [{ id: '2', ai_level: null, ai_level_source: 'self' }, { id: '3', ai_level: 5 }],
    [],
  ];
  const result = await runEstimateAiLevels(['--slug', 'free-class'], {
    env: { SUPABASE_URL: 'https://example.invalid', SUPABASE_SECRET_KEY: 'test-only' },
    fetch: async (url: URL, options: RequestInit) => {
      assert.equal(options.method, undefined);
      calls.push(url);
      return Response.json(pages.shift());
    },
    print: (line: string) => lines.push(line),
    fs: {
      readFile: async () => { throw new Error('Must not read credentials'); },
      mkdir: async () => {},
      appendFile: async (path: string, line: string) => {
        assert.equal(path, 'logs/estimate-ai-levels.jsonl');
        logs.push(line);
      },
    },
  });
  assert.deepEqual(calls.map(url => url.searchParams.get('offset')), ['0', '1', '3']);
  for (const url of calls) {
    assert.equal(url.searchParams.get('status'), 'eq.confirmed');
    assert.equal(url.searchParams.get('ai_level'), 'is.null');
    assert.equal(url.searchParams.get('or'), '(ai_level_source.is.null,ai_level_source.neq.self)');
    assert.equal(url.searchParams.get('event_slug'), 'eq."free-class"');
  }
  assert.deepEqual(lines, ['Alice\t6\tmentions APIs/bots/webhooks or automation tools']);
  assert.equal(result.scanned, 3);
  assert.equal(result.estimated, 1);
  assert.deepEqual(result.byLevel, { 6: 1 });
  assert.equal(logs.length, 1);
  assert.deepEqual(JSON.parse(logs[0]), result);
});

test('HTTP failures include status and body and still append a run log', async () => {
  const logs: string[] = [];
  await assert.rejects(runEstimateAiLevels([], {
    env: { SUPABASE_URL: 'https://example.invalid', SUPABASE_SECRET_KEY: 'test-only' },
    fetch: async () => new Response('unavailable', { status: 503 }),
    fs: { mkdir: async () => {}, appendFile: async (_path: string, line: string) => logs.push(line) },
  }), /HTTP 503: unavailable/);
  assert.equal(logs.length, 1);
  assert.equal(JSON.parse(logs[0]).estimated, 0);
});
