import assert from 'node:assert/strict';
import test from 'node:test';
import { runEstimateAiLevels } from '../scripts/estimate-ai-levels.mjs';

test('live grading includes self reports, preserves existing grades and guards concurrent writes', async () => {
  const rows = [
    { id: 'self', status: 'confirmed', business_context: 'API', ai_level: 2, ai_level_source: 'self', ai_our_grade: null },
    { id: 'legacy', status: 'confirmed', business_context: 'Claude', ai_level: null, ai_level_source: null, ai_our_grade: null },
    { id: 'manual', status: 'confirmed', business_context: 'API', ai_level: 4, ai_level_source: 'self', ai_our_grade: 9 },
    { id: 'race', status: 'confirmed', business_context: 'AI', ai_level: 3, ai_level_source: 'self', ai_our_grade: null },
    { id: 'cancelled', status: 'cancelled', business_context: 'API', ai_level: null, ai_level_source: null, ai_our_grade: null },
  ];
  const patches: { url: URL; body: Record<string, unknown> }[] = [];
  const logs: string[] = [];
  const result = await runEstimateAiLevels(['--live', '--slug', 'free-class'], {
    env: { SUPABASE_URL: 'https://example.invalid', SUPABASE_SECRET_KEY: 'test-only' },
    print: () => {},
    fs: {
      readFile: async () => { throw new Error('Must not read credentials'); },
      mkdir: async () => {},
      appendFile: async (_path: string, line: string) => { logs.push(line); },
    },
    fetch: async (url: URL, options: RequestInit) => {
      assert.equal(url.searchParams.get('status'), 'eq.confirmed');
      assert.equal(url.searchParams.get('event_slug'), 'eq."free-class"');
      const grading = url.searchParams.get('ai_our_grade') === 'is.null';
      if (grading) {
        assert.equal(url.searchParams.has('ai_level'), false);
        assert.equal(url.searchParams.has('or'), false);
      }
      const eligible = rows.filter(row => row.status === 'confirmed' && (grading
        ? row.ai_our_grade === null
        : row.ai_level === null && row.ai_level_source !== 'self'));
      if (options.method !== 'PATCH') {
        return Response.json(eligible.slice(Number(url.searchParams.get('offset')), Number(url.searchParams.get('offset')) + 1));
      }
      const body = JSON.parse(String(options.body));
      assert.ok(Object.keys(body).every(key => !key.startsWith('ai_self_')));
      patches.push({ url, body });
      const row = eligible.find(row => `eq.${row.id}` === url.searchParams.get('id'));
      if (row?.id === 'race' && grading) {
        row.ai_our_grade = 8;
        return Response.json([]);
      }
      if (!row) return Response.json([]);
      Object.assign(row, body);
      return Response.json([row]);
    },
  });
  assert.equal(rows[0].ai_level, 2);
  assert.equal(rows[0].ai_level_source, 'self');
  assert.equal(rows[0].ai_our_grade, 6);
  assert.equal(rows[1].ai_level, 5);
  assert.equal(rows[1].ai_level_source, 'estimate');
  assert.equal(rows[1].ai_our_grade, 5);
  assert.equal(rows[2].ai_our_grade, 9);
  assert.equal(rows[3].ai_our_grade, 8);
  assert.equal(rows[4].ai_our_grade, null);
  const grades = patches.filter(({ body }) => 'ai_our_grade' in body);
  assert.equal(grades.length, 3);
  for (const { url, body } of grades) {
    assert.equal(url.searchParams.get('ai_our_grade'), 'is.null');
    assert.deepEqual(Object.keys(body).sort(), ['ai_our_grade', 'ai_our_grade_at', 'ai_our_grade_note', 'ai_our_grade_source']);
    assert.equal(body.ai_our_grade_source, 'estimate');
    assert.equal(typeof body.ai_our_grade_note, 'string');
    assert.equal(new Date(String(body.ai_our_grade_at)).toISOString(), body.ai_our_grade_at);
  }
  assert.equal(result.ourGraded, 2);
  assert.equal(result.estimated, 1);
  assert.deepEqual(JSON.parse(logs[0]), result);
});
