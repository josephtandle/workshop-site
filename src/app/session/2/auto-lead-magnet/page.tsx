'use client'

import Link from 'next/link'
import CodeBlock from '@/components/CodeBlock'

// ─── Full prompt constant ────────────────────────────────────────────────────
const PROMPT = `**YOUR WEBSITE:** https://yourwebsite.com

---

You are building a professional lead magnet PDF for the business at the URL above. Follow every step in order. Do not ask any questions.

---

**STEP 1 — CHECK FOR SAVED PROFILE**

Check if the file ~/business-profile.md exists and contains a profile for this exact website URL.

- If it exists and matches this URL: load it and skip to Step 3. Print: "Found your saved business profile. Skipping website scan."
- If it does not exist or is for a different URL: proceed to Step 2.

---

**STEP 2 — SCRAPE AND BUILD PROFILE**

Use WebFetch to read the website URL above. If the homepage is sparse, also fetch the About page and Services/Work page (try /about, /services, /work, /what-we-do). Extract:

Business info:
- Business name (from title tag, og:site_name, logo alt text, or h1)
- What they do and who they serve
- Industry vertical (coaching, agency, legal, wellness, SaaS, e-commerce, consulting, etc.)
- Their ideal client in specific terms
- Top 3 audience pain points (from problem copy, testimonials, FAQs)
- The transformation they promise
- Existing CTAs and offers
- Tone of voice (formal/casual, technical/plain)

Brand colors (scan in this order):
1. CSS custom properties: --primary, --brand, --accent, --color-*, --bg-*, --theme-*
2. Meta theme-color tag
3. Tailwind bg-[#hex] or text-[#hex] classes
4. Inline styles on buttons, headers, hero sections, navbars, CTAs
5. CSS rules in style blocks on .hero, .header, .btn, .cta, nav, button
6. SVG fill/stroke colors

Pick the 3 most important:
- brand_primary: dominant accent color (buttons, highlights, links)
- brand_dark: darkest background or header color
- brand_light: lightest tint or card background

Fallbacks if nothing found: primary #4F46E5, dark #1e1b4b, light #EEF2FF

Fonts (search in order):
1. Google Fonts link tags
2. @import url(fonts.googleapis.com) in style blocks
3. font-family on body, h1-h6, or prominent elements

If no fonts found, choose based on industry:
- Law, finance, real estate, luxury: Playfair Display + Source Sans 3
- Tech, SaaS, startup: Inter + Inter
- Coaching, consulting, personal brand: Sora + Inter
- Wellness, beauty, lifestyle: DM Sans + DM Sans
- Creative, design, agency: Space Grotesk + Inter
- Default: Sora + Inter

Save everything to ~/business-profile.md in this format:

# Business Profile
website: [URL]
generated: [today's date]

## Business
name: [name]
what: [one sentence]
vertical: [industry]
audience: [specific ideal client]
pain_points:
- [point 1]
- [point 2]
- [point 3]
transformation: [before] → [after]
cta: [main CTA]
tone: [casual/formal, etc.]

## Brand
primary: [hex]
dark: [hex]
light: [hex]
display_font: [heading font]
body_font: [body font]

## Lead Magnets Created

Print: "Business profile saved to ~/business-profile.md"

---

**STEP 3 — STRATEGY**

Choose the best lead magnet FORMAT:
- Checklist / Audit: when the audience needs to assess where they stand
- Cheat Sheet: when they need quick-reference info they will reuse
- Mini-Guide: when they need a step-by-step walkthrough
- Swipe File: when they need templates to copy and customize
- Template / Worksheet: when they need a fill-in-the-blank framework

Topic rules:
- Must be specific to this exact niche, not generic
- Must solve a real pain point from the profile
- Must be immediately actionable
- Title must be benefit-driven with a number, timeframe, or specificity marker

---

**STEP 4 — WRITE THE CONTENT**

Write 700 to 1000 words. Structure:
- Title and subtitle
- Intro: 2-3 sentences naming the reader's problem in their language
- 4 to 6 sections with headers and niche-specific actionable content
- Include 2-3 "Action step" callouts (one concrete task to do right now)

Rules:
- Second person throughout
- No filler phrases, no em dashes, no corporate buzzwords
- Every bullet must be specific enough to act on today
- Match the business's tone of voice
- Name the industry, the client type, the actual tools relevant to their world

---

**STEP 5 — BUILD THE PDF**

Run: npm install puppeteer

Write lead-magnet.html using the brand colors and fonts from the profile. The design must feel like a premium resource, not a blog post PDF.

Import both Google Fonts. Use display font for headings and labels, body font for content.

CSS variables at the top:
:root {
  --primary: [brand_primary];
  --dark: [brand_dark];
  --light: [brand_light];
}

COVER (min-height 520px, background: var(--dark), padding 56px 64px):
- Diagonal stripe texture: repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px)
- Large circle accent: .cover::after { content:''; position:absolute; top:-120px; right:-120px; width:420px; height:420px; border:1px solid rgba(255,255,255,0.06); border-radius:50%; }
- Business name: small uppercase label, background rgba(255,255,255,0.08), color #fff, 11px, letter-spacing 0.1em, padding 5px 14px, border-radius 20px
- Title: 42px display font 800, color #fff, margin-top 20px, line-height 1.15, max-width 560px
- Subtitle: 17px body font, color rgba(255,255,255,0.75), margin-top 16px
- Website URL: 12px, color rgba(255,255,255,0.4), margin-top auto, padding-top 48px

INTRO CALLOUT (background: var(--light), padding 40px 64px):
- Large quotation mark: ::before with content '"', font-size 72px, color var(--primary), opacity 0.3, line-height 0, display block, margin-bottom -16px
- Text: 17px display font, color var(--dark), font-style italic, line-height 1.8
- Left border: 3px solid var(--primary)

CONTENT SECTIONS (padding 32px 64px, border-bottom 1px solid #e5e7eb):
- Section number: 56px display font, font-weight 300, color var(--primary), opacity 0.18, position absolute, top 24px, left 64px, line-height 1
- Section header: position relative, z-index 1, font-size 21px, display font, font-weight 700, color var(--dark), margin-bottom 12px, padding-left: 0 (number is decorative, not affecting flow)
- Body: 15.5px body font, color #374151, line-height 1.8
- Bullet markers: color var(--primary)

ACTION STEP BOXES (appear at end of 2-3 sections):
- background: var(--dark), border-radius 8px, padding 14px 18px, margin-top 16px, display flex, gap 12px, align-items flex-start
- Badge: "Do this", background var(--primary), color #fff, font-size 10px, font-weight 700, uppercase, letter-spacing 0.08em, padding 3px 8px, border-radius 4px, flex-shrink 0, margin-top 2px
- Text: 13px body font, color rgba(255,255,255,0.85), line-height 1.6

SCORING GRID (for audit/checklist format, optional):
- 2x2 grid of score range cards
- Each card: background var(--light), border-radius 8px, padding 16px, border-left 3px solid var(--primary)
- Score label: 18px display font 700, color var(--primary)
- Description: 13px body font, color #374151

CTA BLOCK (background var(--dark), padding 56px 64px, position relative, overflow hidden):
- Circle decoration: ::after, 200px, border 1px solid rgba(255,255,255,0.08), border-radius 50%, position absolute, right -60px, top 50%, transform translateY(-50%)
- Headline: 24px display font 800, color #fff, line-height 1.25
- Body: 15px body font, color rgba(255,255,255,0.8), margin-top 12px
- Button: display inline-block, background #fff, color var(--dark), font-weight 700, padding 10px 24px, border-radius 24px, margin-top 24px, font-size 13px, display font

FOOTER (display flex, justify-content space-between, padding 14px 64px, margin-top 0, border-top 1px solid #e5e7eb):
- Left: business name, 12px display font 600, color var(--primary)
- Right: URL, 12px body font, color #9ca3af

Print CSS:
@media print {
  @page { size: A4; margin: 0; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}

Write render-pdf.js:
const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve('lead-magnet.html'), { waitUntil: 'networkidle0' });
  await page.pdf({ path: 'lead-magnet.pdf', format: 'A4', printBackground: true, margin: { top:'0', right:'0', bottom:'0', left:'0' } });
  await browser.close();
  console.log('PDF saved: lead-magnet.pdf');
})();

Run: node render-pdf.js && open lead-magnet.pdf

---

**STEP 6 — UPDATE PROFILE**

Append to the Lead Magnets Created section of ~/business-profile.md:
- [today's date]: [title] — [format]

---

**STEP 7 — REPORT**

Tell me: lead magnet title and format, brand colors found or fallbacks used, one sentence on why this lead magnet for this audience.`

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AutoLeadMagnetPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">

      {/* Back link */}
      <nav className="mb-10 text-sm flex items-center gap-2" style={{ color: 'rgba(252,244,235,0.4)' }}>
        <Link href="/" className="hover:text-[#7C69C7] transition-colors">All Sessions</Link>
        <span>/</span>
        <Link href="/session/2" className="hover:text-[#7C69C7] transition-colors">Session 2</Link>
        <span>/</span>
        <span style={{ color: 'rgba(252,244,235,0.6)' }}>Auto Lead Magnet PDF</span>
      </nav>

      {/* Header */}
      <div className="mb-14">
        <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#7C69C7' }}>
          Pre-Session Bonus
        </p>
        <h1 className="gradient-text text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Auto Lead Magnet PDF
        </h1>
        <p className="text-lg leading-relaxed max-w-2xl" style={{ color: 'rgba(252,244,235,0.6)' }}>
          Paste one prompt into Claude Code. Point it at your website. Get back a polished, print-ready lead magnet PDF in your brand colors, written specifically for your audience, not a template.
        </p>
      </div>

      {/* What it does — 3 feature cards */}
      <div className="mb-14">
        <div className="mb-6">
          <h2 className="gradient-text text-3xl md:text-4xl font-extrabold pb-1">
            What It Does
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white/[0.05] border border-white/[0.10] rounded-2xl p-6">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-4"
              style={{ background: 'rgba(252, 244, 235, 0.07)', border: '1px solid rgba(252, 244, 235, 0.12)' }}
            >
              ✦
            </div>
            <h3 className="text-lg font-bold text-[#FCF4EB] mb-2">Reads Your Website</h3>
            <p className="text-sm text-[#FCF4EB]/55 leading-relaxed">
              Claude fetches your homepage, extracts your brand colors, font, audience, and pain points. No manual input needed.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/[0.05] border border-white/[0.10] rounded-2xl p-6">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-4"
              style={{ background: 'rgba(252, 244, 235, 0.07)', border: '1px solid rgba(252, 244, 235, 0.12)' }}
            >
              ◆
            </div>
            <h3 className="text-lg font-bold text-[#FCF4EB] mb-2">Writes for Your Niche</h3>
            <p className="text-sm text-[#FCF4EB]/55 leading-relaxed">
              The content is specific to your industry and your ideal client. A chiropractor gets a chiropractic checklist. A marketing agency gets an agency-specific guide.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/[0.05] border border-white/[0.10] rounded-2xl p-6">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-4"
              style={{ background: 'rgba(252, 244, 235, 0.07)', border: '1px solid rgba(252, 244, 235, 0.12)' }}
            >
              ⬡
            </div>
            <h3 className="text-lg font-bold text-[#FCF4EB] mb-2">Renders a Real PDF</h3>
            <p className="text-sm text-[#FCF4EB]/55 leading-relaxed">
              A fully designed, print-ready PDF in your brand colors. Cover page, structured sections, action steps, and a CTA block, all generated automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Demo preview */}
      <div className="mb-14">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(252,244,235,0.4)' }}>
          Sample Output
        </p>
        <a
          href="https://workshop.mastermindshq.business/automation-audit-sample.html"
          target="_blank"
          rel="noopener noreferrer"
          className="group card-hover card-shimmer flex items-center gap-5 rounded-2xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderLeft: '3px solid #7C69C7',
          }}
        >
          <div
            className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'rgba(124,105,199,0.15)', border: '1px solid rgba(124,105,199,0.25)' }}
          >
            📄
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[#FCF4EB] mb-1 group-hover:text-white transition-colors">
              View Sample PDF
            </p>
            <p className="text-sm text-[#FCF4EB]/45 leading-relaxed">
              See what the output looks like for a real business. Opens in a new tab.
            </p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-[#7C69C7]">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* How to use — numbered steps */}
      <div className="mb-14">
        <div className="mb-6">
          <h2 className="gradient-text text-3xl md:text-4xl font-extrabold pb-1">
            How to Use It
          </h2>
        </div>

        <div className="space-y-10">

          {/* Step 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: 'rgba(124,105,199,0.20)', color: '#9D8FE0', border: '1px solid rgba(124,105,199,0.30)' }}
              >
                1
              </div>
              <h3 className="text-lg font-bold text-[#FCF4EB]">Open Terminal and Start Claude Code</h3>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(252,244,235,0.65)' }}>
              On Mac, press{' '}
              <code className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: 'rgba(255,255,255,0.08)', color: '#9D8FE0' }}>Cmd + Space</code>,
              type{' '}
              <code className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: 'rgba(255,255,255,0.08)', color: '#9D8FE0' }}>Terminal</code>,
              hit Enter.
            </p>
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', borderLeft: '2px solid #7C69C7' }}>
              <div className="flex items-center justify-between px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-xs font-mono" style={{ color: 'rgba(252,244,235,0.35)' }}>Terminal</span>
              </div>
              <pre className="px-4 py-3 text-sm font-mono" style={{ background: '#0d0d0d', color: '#9D8FE0' }}>claude --dangerously-skip-permissions</pre>
            </div>
          </div>

          {/* Step 2 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: 'rgba(124,105,199,0.20)', color: '#9D8FE0', border: '1px solid rgba(124,105,199,0.30)' }}
              >
                2
              </div>
              <h3 className="text-lg font-bold text-[#FCF4EB]">Edit Your URL and Paste the Prompt</h3>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(252,244,235,0.65)' }}>
              Change the website URL at the top to yours. You can also edit any part of the prompt before copying.
            </p>
            <CodeBlock editable code={PROMPT} filename="Lead Magnet Generator" />
          </div>

          {/* Step 3 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: 'rgba(124,105,199,0.20)', color: '#9D8FE0', border: '1px solid rgba(124,105,199,0.30)' }}
              >
                3
              </div>
              <h3 className="text-lg font-bold text-[#FCF4EB]">Wait About 2 Minutes</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(252,244,235,0.65)' }}>
              Claude will read your website, write your lead magnet, install what it needs, design the PDF, and open it automatically. The first run takes slightly longer because it downloads a headless browser. That only happens once.
            </p>
          </div>

        </div>
      </div>

      {/* Note from Joe */}
      <div className="mb-14">
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(124,105,199,0.08)',
            border: '1px solid rgba(124,105,199,0.25)',
            borderLeft: '3px solid #7C69C7',
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">💬</span>
            <div>
              <p className="text-sm font-bold mb-2" style={{ color: '#9D8FE0' }}>Note from Joe</p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(252,244,235,0.70)' }}>
                I only did a quick test on this, so feel free to change the prompt to fit you better and try again.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="mt-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link
          href="/session/2"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: 'rgba(252,244,235,0.4)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#7C69C7')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(252,244,235,0.4)')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Session 2
        </Link>
      </div>

    </main>
  )
}
