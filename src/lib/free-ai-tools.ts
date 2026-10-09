// Free AI Tools giveaway batch (2026-10-07, approved by Illy 2026-10-08).
// GENERATED from agents/repo-giveaways/data/batch-2026-10-07/*/setup-notes.md + picks.json
// by the free-ai-tools-pages session. Page copy and the delivery email both read
// from this table, so a fix here fixes both. One entry per /giveaways/<slug> page.

export type FreeAiToolLink = { label: string; url: string }

export type FreeAiTool = {
  slug: string
  keyword: string
  name: string
  tagline: string
  subline: string
  toolUrl: string
  primaryLabel: string
  intro: string
  steps: string[]
  howIUse: string[]
  goodToKnow: string
  links: FreeAiToolLink[]
  githubUrl: string
  stars: number
  license: string
  why: string
}

export const FREE_AI_TOOLS: FreeAiTool[] = [
  {
    "slug": "free-ai-claude-skills",
    "keyword": "SKILL",
    "name": "Claude Skills",
    "tagline": "Teach Claude your way of working once.",
    "subline": "Anthropic's free library of Claude skills: real Word, PowerPoint and Excel files, your brand on every one.",
    "toolUrl": "https://github.com/anthropics/skills",
    "primaryLabel": "Open the skill library",
    "intro": "Anthropic's own library of Claude skills. A skill is a short recipe that teaches Claude how to do one job your way, every time.",
    "steps": [
      "Open Claude (claude.ai or the desktop app) and go to Settings, then Capabilities.",
      "Turn on Skills. Many from this library are already there, ready to switch on.",
      "Ask Claude to use one, for example: \"Use the skill creator to make a skill for how I write client proposals.\""
    ],
    "howIUse": [
      "Start with three: the brand guidelines skill, the PowerPoint skill and the skill creator.",
      "When Claude gets something right, ask it to save that as a skill so it stays right."
    ],
    "goodToKnow": "You need a paid Claude plan to use skills. The library is made by Anthropic, the company behind Claude.",
    "links": [
      {
        "label": "The skill library",
        "url": "https://github.com/anthropics/skills"
      },
      {
        "label": "How to turn skills on (Anthropic help page)",
        "url": "https://support.claude.com/en/articles/12512180-using-skills-in-claude"
      }
    ],
    "githubUrl": "https://github.com/anthropics/skills",
    "stars": 179983,
    "license": "Apache-2.0 (document skills source-available)",
    "why": "Anthropic's own skill library: teach Claude your process once, get real Word/PowerPoint/Excel files and on-brand output."
  },
  {
    "slug": "free-ai-handy",
    "keyword": "HANDY",
    "name": "Handy",
    "tagline": "Talk instead of type. In any app.",
    "subline": "Hold a key, say it, let go. The words appear wherever your cursor is. Free, and it runs on your own computer.",
    "toolUrl": "https://handy.computer",
    "primaryLabel": "Download Handy",
    "intro": "A free app that types what you say. Hold a key, talk, let go, and the text appears wherever your cursor is.",
    "steps": [
      "Go to handy.computer and download the Mac or Windows version. Install it like any other app.",
      "Open it and allow the microphone and accessibility permissions it asks for. That's how it types for you.",
      "Pick your shortcut key in Settings. Then click into any text box, hold the key, talk, and let go."
    ],
    "howIUse": [
      "Use it for long AI prompts. You'll give the AI far more context, and the answers get better.",
      "Right after a call, talk out who, what, next step and deadline into your notes app."
    ],
    "goodToKnow": "It's free and open source, and the speech is turned into text on your own computer, not in the cloud. The first run downloads a speech model, so give it a minute.",
    "links": [
      {
        "label": "Download Handy",
        "url": "https://handy.computer"
      },
      {
        "label": "The code on GitHub",
        "url": "https://github.com/cjpais/Handy"
      }
    ],
    "githubUrl": "https://github.com/cjpais/Handy",
    "stars": 33081,
    "license": "MIT",
    "why": "Free offline voice-to-text: hold a key, talk, and the words appear in any app. Biggest daily time saver for non-typists."
  },
  {
    "slug": "free-ai-anythingllm",
    "keyword": "BRAIN",
    "name": "AnythingLLM",
    "tagline": "A private ChatGPT that has read your files.",
    "subline": "Drag in your course PDFs, SOPs and client notes, then ask questions and get answers with sources.",
    "toolUrl": "https://anythingllm.com/download",
    "primaryLabel": "Download AnythingLLM",
    "intro": "A free desktop app that turns your own files into an AI you can ask questions. Think of it as a private ChatGPT that has read your documents.",
    "steps": [
      "Download the desktop app for Mac or Windows and install it like any other app.",
      "When it asks which AI to use, pick the built-in one to keep everything on your computer, or paste in your Claude or OpenAI key for stronger answers.",
      "Make a workspace (for example \"My course\"), drag in your PDFs and docs, and start asking questions."
    ],
    "howIUse": [
      "Make one workspace per topic: course, clients, team how-tos. Answers stay cleaner.",
      "Ask it to show sources, then click through to check the answer against your own document."
    ],
    "goodToKnow": "Free and open source (MIT), made by Mintplex Labs. With the built-in AI your files never leave your computer. If you plug in a cloud AI, your questions go to that company.",
    "links": [
      {
        "label": "Download AnythingLLM",
        "url": "https://anythingllm.com/download"
      },
      {
        "label": "The code on GitHub",
        "url": "https://github.com/Mintplex-Labs/anything-llm"
      }
    ],
    "githubUrl": "https://github.com/Mintplex-Labs/anything-llm",
    "stars": 66781,
    "license": "MIT",
    "why": "Desktop app that lets you chat with your own course PDFs, SOPs and client notes, privately, with sources."
  },
  {
    "slug": "free-ai-stirling-pdf",
    "keyword": "PAPER",
    "name": "Stirling PDF",
    "tagline": "Every PDF tool you need, in one free app.",
    "subline": "Merge, compress, sign, redact and convert, without uploading client contracts to random websites.",
    "toolUrl": "https://stirlingpdf.com",
    "primaryLabel": "Download Stirling PDF",
    "intro": "One free app with 50+ PDF tools: merge, split, compress, convert, sign, redact (black out) and turn scans into text.",
    "steps": [
      "Go to stirlingpdf.com and download the desktop app for Mac or Windows.",
      "Install and open it like any other app.",
      "Drag a PDF in, pick a tool on the left (Merge, Compress, Sign, Redact) and save the result."
    ],
    "howIUse": [
      "Use Compress before you email big files. Most clients' inboxes will thank you.",
      "Use Redact before you share anything with bank details, ID numbers or health info."
    ],
    "goodToKnow": "Free for individual use. Teams and big companies have paid plans. Made by Stirling Tools, 94k stars, very actively updated.",
    "links": [
      {
        "label": "Download Stirling PDF",
        "url": "https://stirlingpdf.com"
      },
      {
        "label": "The code on GitHub",
        "url": "https://github.com/Stirling-Tools/Stirling-PDF"
      }
    ],
    "githubUrl": "https://github.com/Stirling-Tools/Stirling-PDF",
    "stars": 93701,
    "license": "MIT (core)",
    "why": "50+ PDF tools in one free desktop app (merge, compress, sign, redact, OCR) so client contracts stop going to random upload sites."
  },
  {
    "slug": "free-ai-buzz",
    "keyword": "CALLS",
    "name": "Buzz",
    "tagline": "Turn every call into text you can use.",
    "subline": "Free, offline transcription for calls, voice notes and videos, plus subtitle files for your reels.",
    "toolUrl": "https://chidiwilliams.github.io/buzz/",
    "primaryLabel": "Get Buzz",
    "intro": "A free app that turns recordings into text on your own computer: calls, voice notes, videos. It also makes subtitle files for reels.",
    "steps": [
      "Open the GitHub page and follow the download link for Mac or Windows (the files are hosted on SourceForge, which is the official link).",
      "Install it. If Windows shows a blue \"Windows protected your PC\" warning, that's normal for small free apps: click More info, then Run anyway. On a Mac, if it says the app can't be opened, right-click the app, choose Open, then click Open again.",
      "Open Buzz, drop in a recording, press start, then export as TXT (text) or SRT (subtitles)."
    ],
    "howIUse": [
      "Paste the transcript into Claude and ask: \"Pull out 5 post ideas and 3 quotes from this call.\"",
      "Export SRT files and drop them into CapCut or your editor for instant subtitles."
    ],
    "goodToKnow": "Free and open source (MIT). On Mac it needs an Apple chip (M1 or newer). Everything happens offline, nothing is uploaded.",
    "links": [
      {
        "label": "Buzz downloads and guide",
        "url": "https://chidiwilliams.github.io/buzz/"
      },
      {
        "label": "The code on GitHub",
        "url": "https://github.com/chidiwilliams/buzz"
      }
    ],
    "githubUrl": "https://github.com/chidiwilliams/buzz",
    "stars": 21862,
    "license": "MIT",
    "why": "Offline transcription of calls, voice notes and videos, with subtitle files and speaker labels; turns recordings into content."
  },
  {
    "slug": "free-ai-upscayl",
    "keyword": "SHARP",
    "name": "Upscayl",
    "tagline": "Blurry photo in, sharp photo out.",
    "subline": "Drag in a small or blurry image and AI makes it bigger and sharper. Free, and your photos stay on your computer.",
    "toolUrl": "https://upscayl.org",
    "primaryLabel": "Download Upscayl",
    "intro": "A free app that uses AI to make small or blurry images bigger and sharper.",
    "steps": [
      "Go to upscayl.org and download the Mac or Windows version. Install it like any other app.",
      "Open it and drag in a photo.",
      "Pick a model (the default is fine for photos), pick a save folder, and click Upscayl."
    ],
    "howIUse": [
      "Use batch mode to fix a whole folder of event photos at once.",
      "4x is usually plenty for Instagram. Go bigger only for print."
    ],
    "goodToKnow": "Free and open source. It needs a graphics chip: any Mac with an Apple chip (M1 or newer) works well, and most gaming or design PCs do too. Very old laptops may not. Photos never leave your computer.",
    "links": [
      {
        "label": "Download Upscayl",
        "url": "https://upscayl.org"
      },
      {
        "label": "The code on GitHub",
        "url": "https://github.com/upscayl/upscayl"
      }
    ],
    "githubUrl": "https://github.com/upscayl/upscayl",
    "stars": 50188,
    "license": "AGPL-3.0",
    "why": "Drag-and-drop AI photo upscaler: blurry headshots, old logos and event photos become usable for posts and ads."
  },
  {
    "slug": "free-ai-cal-com",
    "keyword": "SLOTS",
    "name": "Cal.com",
    "tagline": "One link. No more back and forth.",
    "subline": "A free booking page: people pick a time from your calendar and it books the call and sends the reminders.",
    "toolUrl": "https://cal.com",
    "primaryLabel": "Sign up at Cal.com",
    "intro": "A free booking page. You share one link, people pick an open time from your calendar, and it books the call and sends reminders.",
    "steps": [
      "Go to cal.com and sign up with your Google account (free plan, no card).",
      "Connect your calendar and Zoom or Google Meet when it asks.",
      "Make your first call type, for example \"20 minute discovery call\", add two questions, and copy your link."
    ],
    "howIUse": [
      "Add your link to your email signature and Instagram bio-link page.",
      "Ask one question on the booking form: \"What do you want help with?\" You'll walk in prepared."
    ],
    "goodToKnow": "The free plan is free forever for one person, with unlimited call types and reminders. Team features are paid. Made by Cal.com Inc. The open source version now lives on GitHub as Cal.diy and is meant for self-hosting; you don't need it.",
    "links": [
      {
        "label": "Sign up at Cal.com",
        "url": "https://cal.com"
      },
      {
        "label": "The open source edition on GitHub (for techies)",
        "url": "https://github.com/calcom/cal.diy"
      }
    ],
    "githubUrl": "https://github.com/calcom/cal.diy",
    "stars": 48907,
    "license": "hosted product; open source edition cal.diy is MIT",
    "why": "Free-forever booking page (born open source, 49k-star repo now cal.diy) (Calendly alternative) with reminders and time zones; ends the email back and forth on discovery calls."
  },
  {
    "slug": "free-ai-excalidraw",
    "keyword": "DRAW",
    "name": "Excalidraw",
    "tagline": "Explain anything in one picture.",
    "subline": "A free whiteboard in your browser with a hand-drawn look. No download, no account.",
    "toolUrl": "https://excalidraw.com",
    "primaryLabel": "Open Excalidraw",
    "intro": "A free whiteboard in your browser with a friendly hand-drawn look. No download and no account.",
    "steps": [
      "Go to excalidraw.com. That's the whole install.",
      "Draw with the boxes, arrows and text tools at the top. Keep it to 5 or 6 boxes.",
      "Click Share to draw live with a client, or Export to save it as an image for a post or slide."
    ],
    "howIUse": [
      "Three drawings worth making this week: your offer, your client journey from first hello to result, and your weekly process.",
      "Your drawing saves in your browser. Export a file if you want to keep it safe."
    ],
    "goodToKnow": "Free and open source (MIT), 134k stars, used by huge numbers of teams. There's an optional paid version (Excalidraw+) for teams, but you don't need it.",
    "links": [
      {
        "label": "Open Excalidraw",
        "url": "https://excalidraw.com"
      },
      {
        "label": "The code on GitHub",
        "url": "https://github.com/excalidraw/excalidraw"
      }
    ],
    "githubUrl": "https://github.com/excalidraw/excalidraw",
    "stars": 133628,
    "license": "MIT",
    "why": "No-signup browser whiteboard with a hand-drawn look: explain offers, funnels and processes in one picture, draw live with clients."
  },
  {
    "slug": "free-ai-documenso",
    "keyword": "INKED",
    "name": "Documenso",
    "tagline": "Contracts signed from a phone.",
    "subline": "A free, open source DocuSign alternative. Upload, drag a signature box, send.",
    "toolUrl": "https://documenso.com",
    "primaryLabel": "Sign up at Documenso",
    "intro": "An open source alternative to DocuSign. Upload a contract, mark where to sign, and send it. People sign from their phone or laptop.",
    "steps": [
      "Go to documenso.com and make a free account (no credit card).",
      "Upload your agreement as a PDF and drag a signature box onto the page.",
      "Add your client's name and email and click Send. You'll see when they've signed."
    ],
    "howIUse": [
      "Turn your coaching agreement into a ready-to-send PDF once, so every new client is one upload away.",
      "Send it right after the yes on the call, while the energy is high."
    ],
    "goodToKnow": "The free plan covers 5 documents a month with up to 10 signers each. More than that needs a paid plan. Made by Documenso Inc., open source.",
    "links": [
      {
        "label": "Sign up at Documenso",
        "url": "https://documenso.com"
      },
      {
        "label": "The code on GitHub",
        "url": "https://github.com/documenso/documenso"
      }
    ],
    "githubUrl": "https://github.com/documenso/documenso",
    "stars": 15350,
    "license": "AGPL-3.0",
    "why": "Open source DocuSign alternative with a free-forever plan (5 documents a month): coaching agreements, waivers and contracts signed from a phone."
  },
  {
    "slug": "free-ai-jan",
    "keyword": "LOCAL",
    "name": "Jan",
    "tagline": "ChatGPT style AI that never leaves your laptop.",
    "subline": "Runs fully offline on your own computer, for client info you would never paste online.",
    "toolUrl": "https://jan.ai",
    "primaryLabel": "Download Jan",
    "intro": "A free app that runs a ChatGPT style AI on your own computer. Once set up, it works with no internet and nothing leaves your laptop.",
    "steps": [
      "Go to jan.ai and download the Mac or Windows version. Install it like any other app.",
      "Open the Hub inside Jan and download one of the recommended small models. Jan shows which ones fit your computer.",
      "Start a new chat. Turn off your wifi once just to see it still works."
    ],
    "howIUse": [
      "Use it for anything private: client notes, contracts, health or money details.",
      "Local models are a bit less clever than the big online ones. Use Jan for private drafts, and the big ones for public stuff."
    ],
    "goodToKnow": "Free and open source (Apache 2.0). Needs 8GB of memory or more; 16GB is better. Models are big downloads (a few GB), so do it on good wifi.",
    "links": [
      {
        "label": "Download Jan",
        "url": "https://jan.ai"
      },
      {
        "label": "The code on GitHub",
        "url": "https://github.com/janhq/jan"
      }
    ],
    "githubUrl": "https://github.com/janhq/jan",
    "stars": 44836,
    "license": "Apache-2.0",
    "why": "Free ChatGPT-style app that runs AI fully offline on your own laptop: for client info you'd never paste online."
  }
]

const BY_SLUG: Record<string, FreeAiTool> = Object.fromEntries(FREE_AI_TOOLS.map((t) => [t.slug, t]))

export const FREE_AI_TOOL_SLUGS: readonly string[] = FREE_AI_TOOLS.map((t) => t.slug)

export function getFreeAiTool(slug: string): FreeAiTool {
  const tool = BY_SLUG[slug]
  if (!tool) throw new Error(`Unknown free AI tool slug: ${slug}`)
  return tool
}

export function isFreeAiToolSource(source: string): boolean {
  return Object.prototype.hasOwnProperty.call(BY_SLUG, source)
}

/** "179,983" style, for the GitHub star badge. */
export function formatStars(stars: number): string {
  return stars >= 1000 ? `${Math.round(stars / 1000)}k` : String(stars)
}
