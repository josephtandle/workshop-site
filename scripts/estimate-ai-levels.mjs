import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { estimateAiLevel } from './lib/estimate-ai-level.mjs';

// Injectable I/O keeps tests offline and away from real credentials and logs.
export async function runEstimateAiLevels(args = process.argv.slice(2), io = {}) {
  const fs = { appendFile, mkdir, readFile, ...io.fs };
  const env = { ...(io.env ?? process.env) };
  const request = io.fetch ?? globalThis.fetch;
  const print = io.print ?? console.log;
  const summary = { ts: new Date().toISOString(), live: args.includes('--live'), scanned: 0, estimated: 0, byLevel: {} };
  try {
    let slug;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--live') continue;
      if (args[i] === '--slug' && args[i + 1] && !args[i + 1].startsWith('--')) {
        slug = args[++i];
      } else {
        throw new Error(`Invalid argument: ${args[i]}. Usage: estimate-ai-levels.mjs [--slug <slug>] [--live]`);
      }
    }
    if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
      const contents = await fs.readFile(resolve(homedir(), '.myos/workspace/.env'), 'utf8');
      for (const line of contents.split(/\r?\n/)) {
        const match = line.match(/^\s*(SUPABASE_URL|SUPABASE_SECRET_KEY)\s*=\s*(.*?)\s*$/);
        if (!match || env[match[1]]) continue;
        let value = match[2];
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
        env[match[1]] = value;
      }
    }
    if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) throw new Error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY');
    const endpoint = `${env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/event_registrations`;
    const headers = { apikey: env.SUPABASE_SECRET_KEY, Authorization: `Bearer ${env.SUPABASE_SECRET_KEY}` };
    const eligibleUrl = () => {
      const url = new URL(endpoint);
      url.searchParams.set('status', 'eq.confirmed');
      url.searchParams.set('ai_level', 'is.null');
      url.searchParams.set('or', '(ai_level_source.is.null,ai_level_source.neq.self)');
      if (slug !== undefined) url.searchParams.set('event_slug', `eq.${JSON.stringify(slug)}`);
      return url;
    };
    const jsonRequest = async (url, options) => {
      const response = await request(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      return response.json();
    };
    // Gather every page before writing: PATCHes shrink the eligible result set.
    const rows = [];
    let offset = 0;
    while (true) {
      const url = eligibleUrl();
      url.searchParams.set('select', 'id,attendee_name,business_context,ai_level,ai_level_source');
      url.searchParams.set('order', 'id.asc');
      url.searchParams.set('limit', '1000');
      url.searchParams.set('offset', String(offset));
      const page = await jsonRequest(url, { headers });
      if (!Array.isArray(page)) throw new Error('Expected a registration array');
      summary.scanned += page.length;
      rows.push(...page);
      if (page.length === 0) break;
      offset += page.length;
    }
    for (const row of rows) {
      if (row.ai_level != null || row.ai_level_source === 'self') continue;
      const { level, note } = estimateAiLevel(row.business_context);
      print(`${String(row.attendee_name ?? '').replace(/[\r\n]/g, ' ')}\t${level}\t${note}`);
      if (summary.live) {
        const url = eligibleUrl();
        url.searchParams.set('id', `eq.${String(row.id)}`);
        const updated = await jsonRequest(url, {
          method: 'PATCH',
          headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=representation' },
          body: JSON.stringify({ ai_level: level, ai_level_source: 'estimate', ai_level_note: note, ai_level_set_at: new Date().toISOString() }),
        });
        if (!Array.isArray(updated)) throw new Error('Expected updated registration array');
        if (updated.length === 0) continue;
      }
      summary.estimated++;
      summary.byLevel[level] = (summary.byLevel[level] ?? 0) + 1;
    }
    return summary;
  } finally {
    await fs.mkdir('logs', { recursive: true });
    await fs.appendFile('logs/estimate-ai-levels.jsonl', `${JSON.stringify(summary)}\n`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runEstimateAiLevels().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
