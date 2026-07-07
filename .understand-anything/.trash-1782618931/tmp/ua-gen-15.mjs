import fs from 'fs';
const ex = JSON.parse(fs.readFileSync('/Users/myos/.myos/workspace/projects/mastermind/workshop-site/.understand-anything/tmp/ua-file-extract-results-15.json','utf8'));

// human-friendly label from a giveaway/lead-magnet slug path
const slugOf = p => p.split('/').slice(-2,-1)[0];

const nodes = [];
const edges = [];

const titleCase = s => s.split(/[-_]/).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');

for (const r of ex.results) {
  const p = r.path;
  if (r.language === 'css') {
    nodes.push({
      id:`file:${p}`, type:'file', name:'globals.css',
      summary:'Global stylesheet for the workshop marketing site: defines Tailwind layers, CSS custom properties (theme tokens, colors, fonts), base resets, and shared utility/animation classes used across all pages.',
      tags:['css','styles','global','theme','tailwind'], complexity:'medium', filePath:p
    });
    continue;
  }
  const isPage = p.endsWith('page.tsx');
  const slug = slugOf(p);
  const seg = p.includes('/lead-magnets/') ? 'lead magnet' : 'giveaway';
  if (isPage) {
    nodes.push({
      id:`file:${p}`, type:'file', name:`${slug}/page.tsx`,
      summary:`Next.js route page for the ${slug} ${seg}; re-exports the page component for this route segment.`,
      tags:['nextjs','page','route',seg.replace(' ','-'),slug], complexity:'low', filePath:p
    });
    continue;
  }
  // layout.tsx
  const fn = (r.functions||[])[0];
  const label = titleCase(slug);
  nodes.push({
    id:`file:${p}`, type:'file', name:`${slug}/layout.tsx`,
    summary:`Next.js App Router layout for the ${label} ${seg} route; exports page metadata (SEO title, description, OpenGraph/Twitter) and a layout component that renders child content.`,
    tags:['nextjs','layout','metadata','seo',seg.replace(' ','-')], complexity:'low', filePath:p
  });
  if (fn) {
    const fid = `function:${p}:${fn.name}`;
    nodes.push({
      id:fid, type:'function', name:fn.name,
      summary:`Default-exported App Router layout component for the ${label} ${seg} route; wraps and renders its children unchanged.`,
      tags:['nextjs','layout','component','react',seg.replace(' ','-')], complexity:'low',
      lineRange:`${fn.startLine}-${fn.endLine}`
    });
    edges.push({source:`file:${p}`, target:fid, type:'contains', direction:'forward', weight:1.0});
    edges.push({source:`file:${p}`, target:fid, type:'exports', direction:'forward', weight:0.8});
  }
}

const out = {nodes, edges};
fs.writeFileSync('/Users/myos/.myos/workspace/projects/mastermind/workshop-site/.understand-anything/intermediate/batch-15.json', JSON.stringify(out,null,2));
console.log('nodes',nodes.length,'edges',edges.length);
