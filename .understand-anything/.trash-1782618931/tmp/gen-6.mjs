import fs from 'fs'

const nodes = []
const edges = []
const E = (source, target, type, weight) => { if (source!==target) edges.push({source,target,type,direction:"forward",weight}) }

// ---- file metadata ----
const files = {
  "src/app/session/1/prep-codex/page 2.tsx": {sum:"Next.js route page for the Session 1 Codex-variant prep checklist; renders Session1PrepCodex content inside a breadcrumb/footer shell.", tags:["nextjs","route","session-prep","page"], cx:"low"},
  "src/app/session/1/prep-codex/page.tsx": {sum:"Next.js route page for the Session 1 Codex-variant prep checklist; renders Session1PrepCodex content inside a breadcrumb/footer shell.", tags:["nextjs","route","session-prep","page"], cx:"low"},
  "src/app/session/5/prep-hooks/page 2.tsx": {sum:"Next.js route page for the Session 5 hooks prep variant; renders Session4Prep content within the standard page shell.", tags:["nextjs","route","session-prep","page"], cx:"low"},
  "src/app/session/5/prep-hooks/page.tsx": {sum:"Next.js route page for the Session 5 hooks prep variant; renders Session4Prep content within the standard page shell.", tags:["nextjs","route","session-prep","page"], cx:"low"},
  "src/app/session/6/prep-hooks/page.tsx": {sum:"Next.js route page for the Session 6 hooks prep variant; renders Session4Prep content within the standard page shell.", tags:["nextjs","route","session-prep","page"], cx:"low"},
  "src/app/session/7/prep/page 2.tsx": {sum:"Next.js route page for the Session 7 prep checklist; renders Session7Prep content inside a breadcrumb/footer shell.", tags:["nextjs","route","session-prep","page"], cx:"low"},
  "src/app/session/7/prep/page.tsx": {sum:"Next.js route page for the Session 7 prep checklist; renders Session7Prep content inside a breadcrumb/footer shell.", tags:["nextjs","route","session-prep","page"], cx:"low"},
  "src/app/session/8/prep/page.tsx": {sum:"Next.js route page for the Session 8 prep checklist; renders Session8Prep content inside a breadcrumb/footer shell.", tags:["nextjs","route","session-prep","page"], cx:"low"},
  "src/app/session/[slug]/prep/page.tsx": {sum:"Dynamic Next.js route that maps a session slug to the matching prep content component, generating static params and metadata from the sessions registry.", tags:["nextjs","dynamic-route","session-prep","routing"], cx:"medium"},
  "src/components/ScreenshotCard.tsx": {sum:"Presentational figure component rendering a captioned screenshot image with rounded border styling.", tags:["react","component","ui","presentational"], cx:"low"},
  "src/content/session-1-prep-codex.tsx": {sum:"Client component for the Session 1 Codex-variant prep checklist with toggleable section cards, sticky welcome video, and confetti on completion.", tags:["react","client-component","session-prep","content"], cx:"high"},
  "src/content/session-1-prep.tsx": {sum:"Client component for the Session 1 prep checklist with toggleable section cards, sticky welcome video, and confetti on completion.", tags:["react","client-component","session-prep","content"], cx:"high"},
  "src/content/session-2-prep.tsx": {sum:"Client component for the Session 2 prep checklist with toggleable section cards and confetti on completion.", tags:["react","client-component","session-prep","content"], cx:"high"},
  "src/content/session-3-prep.tsx": {sum:"Client component for the Session 3 prep checklist (longest variant) with toggleable section cards and confetti on completion.", tags:["react","client-component","session-prep","content"], cx:"high"},
  "src/content/session-4-prep.tsx": {sum:"Client component for the Session 4 prep checklist with toggleable section cards and confetti on completion.", tags:["react","client-component","session-prep","content"], cx:"high"},
  "src/content/session-5-prep.tsx": {sum:"Client component for the Session 5 prep checklist with toggleable section cards, embedded screenshots, and confetti on completion.", tags:["react","client-component","session-prep","content"], cx:"high"},
  "src/content/session-6-prep.tsx": {sum:"Client component for the Session 6 prep checklist with toggleable section cards and confetti on completion.", tags:["react","client-component","session-prep","content"], cx:"high"},
  "src/content/session-7-prep.tsx": {sum:"Client component for the Session 7 prep checklist with toggleable section cards and confetti on completion.", tags:["react","client-component","session-prep","content"], cx:"high"},
  "src/content/session-8-prep.tsx": {sum:"Client component for the Session 8 prep checklist with toggleable section cards and confetti on completion.", tags:["react","client-component","session-prep","content"], cx:"medium"},
  "src/lib/celebrate.ts": {sum:"Utility that fires a two-burst canvas-confetti celebration in the brand palette, respecting reduced-motion preferences.", tags:["util","confetti","ui","animation"], cx:"low"},
}
for (const [fp, m] of Object.entries(files)) {
  nodes.push({id:`file:${fp}`, type:"file", name:fp.split('/').pop(), summary:m.sum, tags:m.tags, complexity:m.cx, filePath:fp})
}

// ---- function nodes ----
const fn = (fp,name,sl,el,sum,tags,cx) => {
  nodes.push({id:`function:${fp}:${name}`, type:"function", name, summary:sum, tags, complexity:cx, lineRange:`${sl}-${el}`})
  E(`file:${fp}`, `function:${fp}:${name}`, "contains", 1.0)
}
const exp = (fp,name) => E(`file:${fp}`, `function:${fp}:${name}`, "exports", 0.8)

// page route functions
const pageFns = [
  ["src/app/session/1/prep-codex/page 2.tsx","Session1PrepCodexPage",9,47],
  ["src/app/session/1/prep-codex/page.tsx","Session1PrepCodexPage",9,47],
  ["src/app/session/5/prep-hooks/page 2.tsx","Session5HookPrepPage",9,37],
  ["src/app/session/5/prep-hooks/page.tsx","Session5HookPrepPage",9,37],
  ["src/app/session/6/prep-hooks/page.tsx","Session6HookPrepPage",9,37],
  ["src/app/session/7/prep/page 2.tsx","Session7PrepPage",9,55],
  ["src/app/session/7/prep/page.tsx","Session7PrepPage",9,55],
  ["src/app/session/8/prep/page.tsx","Session8PrepPage",9,52],
]
for (const [fp,name,sl,el] of pageFns) {
  fn(fp,name,sl,el,`Default-exported Next.js page component that wraps the corresponding session prep content with breadcrumb navigation and a back-to-overview footer link.`,["nextjs","page-component","session-prep","ui"],"low")
  exp(fp,name)
}

// [slug] dynamic route functions
const slug = "src/app/session/[slug]/prep/page.tsx"
fn(slug,"generateStaticParams",26,28,"Returns the static slug params (sessions 1-7) for prerendering the dynamic prep route.",["nextjs","ssg","static-params","routing"],"low"); exp(slug,"generateStaticParams")
fn(slug,"generateMetadata",30,38,"Async metadata generator that derives page title and description from the resolved session, falling back to a generic prep title.",["nextjs","metadata","seo","routing"],"low"); exp(slug,"generateMetadata")
fn(slug,"SessionPrepPage",40,83,"Dynamic page component that resolves the slug to a session, 404s when missing or prep-less, and renders the mapped prep content with breadcrumb/footer chrome.",["nextjs","dynamic-route","page-component","session-prep"],"medium"); exp(slug,"SessionPrepPage")

// ScreenshotCard
fn("src/components/ScreenshotCard.tsx","ScreenshotCard",7,22,"Renders a captioned screenshot as a styled figure/figcaption block from src/alt/caption props.",["react","component","ui","presentational"],"low")
exp("src/components/ScreenshotCard.tsx","ScreenshotCard")

// celebrate
fn("src/lib/celebrate.ts","celebrate",3,22,"Fires a two-burst canvas-confetti celebration in the brand palette, disabled for reduced-motion users.",["util","confetti","animation","ui"],"low")
exp("src/lib/celebrate.ts","celebrate")

// content files: Checkbox, SectionCard, SessionXPrep
const content = [
  ["src/content/session-1-prep-codex.tsx","Session1PrepCodex",16,35,37,92,94,283],
  ["src/content/session-1-prep.tsx","Session1Prep",16,35,37,92,94,284],
  ["src/content/session-2-prep.tsx","Session2Prep",12,31,33,88,90,297],
  ["src/content/session-3-prep.tsx","Session3Prep",14,33,35,90,92,506],
  ["src/content/session-4-prep.tsx","Session4Prep",11,30,32,85,87,289],
  ["src/content/session-5-prep.tsx","Session5Prep",16,35,37,90,92,447],
  ["src/content/session-6-prep.tsx","Session6Prep",12,31,33,86,88,266],
  ["src/content/session-7-prep.tsx","Session7Prep",12,31,33,86,88,300],
  ["src/content/session-8-prep.tsx","Session8Prep",11,30,32,87,89,205],
]
for (const [fp,main,cbS,cbE,scS,scE,mS,mE] of content) {
  fn(fp,"Checkbox",cbS,cbE,"Accessible toggle button rendering a custom styled checkbox with a checkmark SVG when checked.",["react","component","checkbox","accessibility"],"low")
  fn(fp,"SectionCard",scS,scE,"Card wrapper for a numbered prep requirement with title, required/optional badge, content, and a mark-as-done toggle.",["react","component","section-card","ui"],"medium")
  fn(fp,main,mS,mE,`Default-exported client component tracking checkbox completion state for the prep checklist and firing confetti when all required items are done.`,["react","client-component","session-prep","state"],"high")
  exp(fp,main)
  // calls celebrate (all content files import & use it on completion)
  E(`function:${fp}:${main}`, `function:src/lib/celebrate.ts:celebrate`, "calls", 0.8)
}

// ---- imports (one per batchImportData path, ALL) ----
const imp = {
  "src/app/session/1/prep-codex/page 2.tsx":["src/content/session-1-prep-codex.tsx"],
  "src/app/session/1/prep-codex/page.tsx":["src/content/session-1-prep-codex.tsx"],
  "src/app/session/5/prep-hooks/page 2.tsx":["src/content/session-4-prep.tsx"],
  "src/app/session/5/prep-hooks/page.tsx":["src/content/session-4-prep.tsx"],
  "src/app/session/6/prep-hooks/page.tsx":["src/content/session-4-prep.tsx"],
  "src/app/session/7/prep/page 2.tsx":["src/content/session-7-prep.tsx"],
  "src/app/session/7/prep/page.tsx":["src/content/session-7-prep.tsx"],
  "src/app/session/8/prep/page.tsx":["src/content/session-8-prep.tsx"],
  "src/app/session/[slug]/prep/page.tsx":["src/content/session-1-prep.tsx","src/content/session-2-prep.tsx","src/content/session-3-prep.tsx","src/content/session-5-prep.tsx","src/content/session-6-prep.tsx","src/content/session-7-prep.tsx","src/lib/sessions.ts"],
  "src/components/ScreenshotCard.tsx":[],
  "src/content/session-1-prep-codex.tsx":["src/components/ProTip.tsx","src/components/StickyVideoPlayer.tsx","src/lib/celebrate.ts"],
  "src/content/session-1-prep.tsx":["src/components/ProTip.tsx","src/components/StickyVideoPlayer.tsx","src/lib/celebrate.ts"],
  "src/content/session-2-prep.tsx":["src/components/ProTip.tsx","src/lib/celebrate.ts"],
  "src/content/session-3-prep.tsx":["src/components/ProTip.tsx","src/lib/celebrate.ts"],
  "src/content/session-4-prep.tsx":["src/lib/celebrate.ts"],
  "src/content/session-5-prep.tsx":["src/components/ProTip.tsx","src/components/ScreenshotCard.tsx","src/lib/celebrate.ts"],
  "src/content/session-6-prep.tsx":["src/components/ProTip.tsx","src/lib/celebrate.ts"],
  "src/content/session-7-prep.tsx":["src/components/ProTip.tsx","src/lib/celebrate.ts"],
  "src/content/session-8-prep.tsx":["src/components/ProTip.tsx","src/lib/celebrate.ts"],
  "src/lib/celebrate.ts":[],
}
for (const [src,targets] of Object.entries(imp)) {
  for (const t of targets) E(`file:${src}`, `file:${t}`, "imports", 0.7)
}

const out = {nodes, edges}
const path = "/Users/myos/.myos/workspace/projects/mastermind/workshop-site/.understand-anything/intermediate/batch-6.json"
fs.writeFileSync(path, JSON.stringify(out,null,2))
console.log("nodes:", nodes.length, "edges:", edges.length)
// validation
const ids = new Set(nodes.map(n=>n.id))
let bad=0
for (const e of edges){ if(!e.source||!e.target||!e.type||e.direction!=="forward"||typeof e.weight!=="number"){bad++} }
console.log("malformed edges:", bad)
const empties = nodes.filter(n=>!n.summary||!n.tags||n.tags.length<3||n.tags.length>5).map(n=>n.id)
console.log("nodes bad summary/tags:", empties.length, empties.slice(0,5))
