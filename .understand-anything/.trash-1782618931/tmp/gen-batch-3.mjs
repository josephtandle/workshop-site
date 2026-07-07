import fs from 'fs';

const OUT = '.understand-anything/intermediate/batch-3.json';
const importData = {
"src/app/bonus/auto-lead-magnet/page.tsx":["src/components/CodeBlock.tsx"],
"src/app/resource-vault/automated-ghost-computer-use/page.tsx":["src/components/CodeBlock.tsx","src/components/ProTip.tsx","src/components/StepCard.tsx"],
"src/app/resource-vault/connecting-to-google-sheets/page.tsx":["src/components/CodeBlock.tsx","src/components/ProTip.tsx","src/components/StepCard.tsx"],
"src/app/resource-vault/connecting-to-xero/page.tsx":["src/components/CodeBlock.tsx","src/components/ProTip.tsx","src/components/ScreenshotCard.tsx","src/components/StepCard.tsx"],
"src/app/resource-vault/eric-investor-pipeline/page.tsx":["src/components/CodeBlock.tsx","src/components/ProTip.tsx","src/components/StepCard.tsx"],
"src/app/resource-vault/how-to-stand-out-in-the-age-of-ai/page.tsx":["src/components/TianaSessionFooter.tsx","src/content/tiana-ai-positioning-workshop.tsx"],
"src/app/resource-vault/reza-website-control/page.tsx":["src/components/CodeBlock.tsx","src/components/ProTip.tsx","src/components/StepCard.tsx"],
"src/app/resource-vault/wordpress-api/page.tsx":["src/components/CodeBlock.tsx","src/components/ProTip.tsx","src/components/StepCard.tsx","src/components/StickyVideoPlayer.tsx"],
"src/app/session/10/instagram/page.tsx":["src/content/session-10-instagram-agent.tsx"],
"src/app/session/2/auto-lead-magnet/page 2.tsx":["src/components/CodeBlock.tsx"],
"src/app/session/2/auto-lead-magnet/page.tsx":["src/components/CodeBlock.tsx"],
"src/app/session/2/guide-codex/page.tsx":["src/content/session-2-guide-codex.tsx"],
"src/app/session/3/custom-domain/page.tsx":["src/components/CodeBlock.tsx","src/components/ProTip.tsx","src/components/StepCard.tsx"],
"src/app/session/3/homework/page.tsx":["src/components/CodeBlock.tsx","src/components/ProTip.tsx","src/components/StepCard.tsx","src/components/StickyVideoPlayer.tsx"],
"src/app/session/4/custom-domain/page.tsx":["src/components/CodeBlock.tsx","src/components/ProTip.tsx","src/components/StepCard.tsx"],
"src/app/session/4/homework/page.tsx":["src/components/CodeBlock.tsx","src/components/ProTip.tsx","src/components/StepCard.tsx","src/components/StickyVideoPlayer.tsx"],
"src/app/session/5/hook-writer/page.tsx":["src/components/CodeBlock.tsx"],
"src/app/session/7/descript/page 2.tsx":["src/content/session-7-descript-guide.tsx"],
"src/app/session/7/descript/page.tsx":["src/content/session-7-descript-guide.tsx"],
"src/app/session/7/guide/page.tsx":["src/content/session-7-guide.tsx"],
"src/app/session/8/guide/page.tsx":["src/content/session-8-guide.tsx"]
};

// file -> {comp, total, summary, tags, complexity}
const files = {
"src/app/bonus/auto-lead-magnet/page.tsx":{comp:"AutoLeadMagnetPage",start:222,total:449,summary:"Bonus workshop page presenting a step-by-step guide for building an automated lead magnet, rendering inline code snippets via the CodeBlock component.",tags:["nextjs","page","resource-guide","lead-magnet","automation"],complexity:"moderate"},
"src/app/resource-vault/automated-ghost-computer-use/page.tsx":{comp:"AutomatedGhostComputerUsePage",start:11,total:202,summary:"Resource vault guide page walking through automated 'ghost' computer-use browser automation, with step cards, pro tips, and code blocks.",tags:["nextjs","page","resource-vault","computer-use","automation"],complexity:"moderate"},
"src/app/resource-vault/connecting-to-google-sheets/page.tsx":{comp:"ConnectingToGoogleSheetsPage",start:12,total:630,summary:"Long resource vault tutorial for connecting an agent or app to Google Sheets, built from step cards, pro tips, and code examples.",tags:["nextjs","page","resource-vault","google-sheets","integration"],complexity:"complex"},
"src/app/resource-vault/connecting-to-xero/page.tsx":{comp:"ConnectingToXeroPage",start:13,total:591,summary:"Resource vault tutorial for connecting to the Xero accounting API, using step cards, screenshots, pro tips, and code blocks.",tags:["nextjs","page","resource-vault","xero","integration"],complexity:"complex"},
"src/app/resource-vault/eric-investor-pipeline/page.tsx":{comp:"EricInvestorPipelinePage",start:12,total:390,summary:"Resource vault case-study page documenting Eric's automated investor pipeline build, with step cards, pro tips, and code snippets.",tags:["nextjs","page","resource-vault","investor-pipeline","case-study"],complexity:"moderate"},
"src/app/resource-vault/how-to-stand-out-in-the-age-of-ai/page.tsx":{comp:"HowToStandOutDraftPage",start:24,total:59,summary:"Thin resource vault page that renders the Tiana AI positioning workshop content plus a session footer.",tags:["nextjs","page","resource-vault","positioning","content-wrapper"],complexity:"simple"},
"src/app/resource-vault/reza-website-control/page.tsx":{comp:"RezaWebsiteControlPage",start:12,total:311,summary:"Resource vault guide showing Reza's workflow for controlling a website with an agent, using step cards, pro tips, and code blocks.",tags:["nextjs","page","resource-vault","website-control","automation"],complexity:"moderate"},
"src/app/resource-vault/wordpress-api/page.tsx":{comp:"WordPressAPIPage",start:12,total:252,summary:"Resource vault tutorial for using the WordPress API, combining a sticky video player with step cards, pro tips, and code examples.",tags:["nextjs","page","resource-vault","wordpress","api-integration"],complexity:"moderate"},
"src/app/session/10/instagram/page.tsx":{comp:"Session10InstagramPage",start:9,total:52,summary:"Session 10 page that renders the Instagram agent content module for the workshop.",tags:["nextjs","page","session","instagram","content-wrapper"],complexity:"simple"},
"src/app/session/2/auto-lead-magnet/page 2.tsx":{comp:"AutoLeadMagnetPage",start:222,total:449,summary:"Duplicate Session 2 auto lead magnet guide page (backup copy) rendering the lead-magnet build walkthrough with code snippets.",tags:["nextjs","page","session","lead-magnet","duplicate"],complexity:"moderate"},
"src/app/session/2/auto-lead-magnet/page.tsx":{comp:"AutoLeadMagnetPage",start:222,total:449,summary:"Session 2 page presenting the step-by-step automated lead magnet build guide with inline CodeBlock snippets.",tags:["nextjs","page","session","lead-magnet","automation"],complexity:"moderate"},
"src/app/session/2/guide-codex/page.tsx":{comp:"Session2GuideCodexPage",start:9,total:56,summary:"Session 2 page that renders the Codex guide content module for the workshop.",tags:["nextjs","page","session","codex","content-wrapper"],complexity:"simple"},
"src/app/session/3/custom-domain/page.tsx":{comp:"CustomDomainPage",start:51,total:208,summary:"Session 3 guide for connecting a custom domain, defining a DnsRecord helper type and rendering DNS setup steps with code and pro tips.",tags:["nextjs","page","session","custom-domain","dns"],complexity:"moderate"},
"src/app/session/3/homework/page.tsx":{comp:"Session3Homework",start:65,total:465,summary:"Session 3 homework page with a sticky video player, DNS record helper, step cards, pro tips, and code examples for the assignment.",tags:["nextjs","page","session","homework","tutorial"],complexity:"complex"},
"src/app/session/4/custom-domain/page.tsx":{comp:"CustomDomainPage",start:51,total:208,summary:"Session 4 custom domain guide (mirrors Session 3) with a DnsRecord helper and DNS configuration steps, code, and pro tips.",tags:["nextjs","page","session","custom-domain","dns"],complexity:"moderate"},
"src/app/session/4/homework/page.tsx":{comp:"Session3Homework",start:65,total:465,summary:"Session 4 homework page (reuses the Session3Homework component) with sticky video, DNS helper, step cards, and code examples.",tags:["nextjs","page","session","homework","tutorial"],complexity:"complex"},
"src/app/session/5/hook-writer/page.tsx":{comp:"HookWriterPage",start:701,total:1210,summary:"Interactive Session 5 Hook Writer tool: client component with participant data, a form state model, name-card selector, editable fields, and copy-text generation for Instagram hook prompts.",tags:["nextjs","client-component","hook-writer","interactive-tool","instagram"],complexity:"complex"},
"src/app/session/7/descript/page 2.tsx":{comp:"Session7DescriptPage",start:10,total:56,summary:"Duplicate Session 7 Descript guide page (backup copy) rendering the Descript content module.",tags:["nextjs","page","session","descript","duplicate"],complexity:"simple"},
"src/app/session/7/descript/page.tsx":{comp:"Session7DescriptPage",start:10,total:56,summary:"Session 7 page that renders the Descript editing guide content module.",tags:["nextjs","page","session","descript","content-wrapper"],complexity:"simple"},
"src/app/session/7/guide/page.tsx":{comp:"Session7GuidePage",start:9,total:55,summary:"Session 7 page that renders the main Session 7 guide content module.",tags:["nextjs","page","session","guide","content-wrapper"],complexity:"simple"},
"src/app/session/8/guide/page.tsx":{comp:"Session8GuidePage",start:9,total:52,summary:"Session 8 page that renders the main Session 8 guide content module.",tags:["nextjs","page","session","guide","content-wrapper"],complexity:"simple"}
};

const nodes = [];
const edges = [];

for (const [path, info] of Object.entries(files)) {
  const fileId = `file:${path}`;
  nodes.push({
    id: fileId,
    type: "file",
    name: path.split('/').pop(),
    summary: info.summary,
    tags: info.tags,
    complexity: info.complexity,
    filePath: path
  });
  // page component function node
  const fnId = `function:${path}:${info.comp}`;
  nodes.push({
    id: fnId,
    type: "function",
    name: info.comp,
    summary: `Default-exported React component rendering the ${path.split('/').slice(-2).join('/')} workshop page.`,
    tags: ["react","component","page-export","nextjs"],
    complexity: info.complexity === "complex" ? "complex" : "moderate",
    lineRange: { start: info.start, end: info.total }
  });
  edges.push({ source: fileId, target: fnId, type: "contains", direction: "forward", weight: 1.0 });
  edges.push({ source: fileId, target: fnId, type: "exports", direction: "forward", weight: 0.8 });
  // imports
  for (const imp of importData[path] || []) {
    edges.push({ source: fileId, target: `file:${imp}`, type: "imports", direction: "forward", weight: 0.7 });
  }
}

// hook-writer helper functions
const hw = "src/app/session/5/hook-writer/page.tsx";
const hwFile = `file:${hw}`;
const helpers = [
  { name: "blankForm", start: 527, end: 534, summary: "Returns an empty FormState object with all hook-writer brand-voice fields initialized to empty strings.", tags:["helper","form-state","factory"], complexity:"simple" },
  { name: "participantToForm", start: 535, end: 552, summary: "Maps a Participant record onto a FormState, defaulting optional brand-voice fields to empty strings.", tags:["helper","mapping","form-state"], complexity:"simple" },
  { name: "buildCopyText", start: 553, end: 608, summary: "Builds the full copyable prompt text by combining the hook lab prompt with the user's brand-voice profile from the form.", tags:["helper","prompt-builder","text"], complexity:"moderate" },
  { name: "NameCard", start: 609, end: 667, summary: "Selectable participant name card component showing photo, display name, and selected state for the hook writer.", tags:["react","component","selector","ui"], complexity:"moderate" },
  { name: "Field", start: 668, end: 700, summary: "Reusable labeled input field component with placeholder, hint, and highlight support for the hook writer form.", tags:["react","component","form-field","ui"], complexity:"moderate" }
];
for (const h of helpers) {
  const id = `function:${hw}:${h.name}`;
  nodes.push({ id, type: "function", name: h.name, summary: h.summary, tags: h.tags, complexity: h.complexity, lineRange: { start: h.start, end: h.end } });
  edges.push({ source: hwFile, target: id, type: "contains", direction: "forward", weight: 1.0 });
  // HookWriterPage calls helpers
  edges.push({ source: `function:${hw}:HookWriterPage`, target: id, type: "calls", direction: "forward", weight: 0.8 });
}

fs.writeFileSync(OUT, JSON.stringify({ nodes, edges }, null, 2));
console.log("nodes", nodes.length, "edges", edges.length);
