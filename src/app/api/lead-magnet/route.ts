import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { trackInsightEvent } from '@/lib/insight-to-fix'
import { buildUnsubscribeHeaders, buildUnsubscribeUrl } from '@/lib/list-unsubscribe'
import { isSuppressed } from '@/lib/email-suppressions'
import { withUtm } from '@/lib/utm'

const RESEND_API_KEY = process.env.RESEND_API_KEY

async function sendViaResend(email: string, source: string, idempotencyKey: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workshop.mastermindshq.business'
  const unsubscribeUrl = buildUnsubscribeUrl(email)
  // Omit the link entirely (rather than a dead/unverifiable href) when the
  // signing secret is missing, buildUnsubscribeUrl returns null in that case.
  const unsubscribeFooter = unsubscribeUrl
    ? `<p style="font-size: 12px; color: #bbb; margin-top: 8px;">Sent by Masterminds HQ. <a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe</a> any time.</p>`
    : `<p style="font-size: 12px; color: #bbb; margin-top: 8px;">Sent by Masterminds HQ.</p>`
  const macCleanerPageUrl = withUtm(`${siteUrl}/giveaways/maccleaner`, { campaign: 'lead-magnet', content: 'maccleaner-page' })
  const macCleanerInstallerUrl = withUtm(`${siteUrl}/downloads/maccleaner-installer.sh`, { campaign: 'lead-magnet', content: 'maccleaner-installer' })
  const guardogPageUrl = withUtm(`${siteUrl}/giveaways/guardog`, { campaign: 'lead-magnet', content: 'guardog-page' })
  const speakHumanPageUrl = withUtm(`${siteUrl}/giveaways/speak-human`, { campaign: 'lead-magnet', content: 'speak-human-page' })
  const speakHumanInstallCommand = 'git clone https://github.com/josephtandle/speak-human && cp -r speak-human/speak-human ~/.claude/skills/speak-human && rm -rf speak-human'

  let subject: string
  let html: string

  if (source === 'human' || source === 'speak-human') {
    subject = 'Your Speak Human install command'
    html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; background: #ffffff;">
        <p style="font-size: 13px; color: #999; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px;">Speak Human</p>

        <h1 style="font-size: 26px; font-weight: 800; line-height: 1.25; margin-bottom: 16px; color: #111;">
          Here&rsquo;s the Speak Human skill.
        </h1>

        <p style="font-size: 16px; color: #444; line-height: 1.7; margin-bottom: 20px;">
          It is a free Claude Code skill from Joe&rsquo;s public GitHub repo. It strips AI writing patterns, protects the lines that already sound real, and rewrites the synthetic parts in a human voice.
        </p>

        <div style="background: #f5f0ff; border-left: 3px solid #7C69C7; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
          <p style="font-size: 14px; color: #333; margin: 0; line-height: 1.7;">
            <strong>How it works:</strong><br>
            1. Detects AI tells: generic conclusions, fake significance, over-polished vocabulary, em dashes, list syndrome, and chatbot artifacts.<br>
            2. Marks what to keep: facts, names, numbers, strong opinions, and passages that already sound like you.<br>
            3. Rewrites only what needs rewriting, using a preset voice or your own saved voice profile.
          </p>
        </div>

        <p style="font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 12px;">
          Install it with this one command:
        </p>

        <pre style="background: #0f0f12; color: #f0eee6; padding: 20px; border-radius: 10px; font-size: 13px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; margin-bottom: 24px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">${speakHumanInstallCommand}</pre>

        <p style="margin-bottom: 24px;">
          <a href="${speakHumanPageUrl}"
             style="display: inline-block; background: #7C69C7; color: white; padding: 13px 26px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px;">
            Open the Speak Human page
          </a>
        </p>

        <p style="font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 16px;">
          After install, open Claude Code and type <code>/speak-human</code> followed by your text. Use <code>--mode detect</code> to diagnose, <code>--mode rewrite</code> to rewrite, or <code>--file path/to/file.md --mode edit</code> to clean a file in place.
        </p>

        <p style="font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 28px;">
          The ManyChat giveaway keyword is <strong>human</strong>. Hit reply and tell me what kind of copy you want it to clean up first. I read every one.
        </p>

        <p style="font-size: 14px; color: #999; margin-top: 24px;">Joe Che</p>
        ${unsubscribeFooter}
      </div>
    `
  } else if (source === 'all-sorted-overview') {
    subject = 'The All Sorted overview'
    html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; background: #ffffff;">
        <p style="font-size: 13px; color: #999; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px;">All Sorted</p>

        <h1 style="font-size: 26px; font-weight: 800; line-height: 1.25; margin-bottom: 16px; color: #111;">
          Here&rsquo;s the All Sorted overview.
        </h1>

        <p style="font-size: 16px; color: #444; line-height: 1.7; margin-bottom: 20px;">
          The full list of 30 things All Sorted does for your business is on the overview page. I&rsquo;d rather you read it where the design actually works.
        </p>

        <p style="margin-bottom: 24px;">
          <a href="${withUtm(`${siteUrl}/giveaways/all-sorted-overview`, { campaign: 'lead-magnet', content: 'all-sorted-overview' })}"
             style="display: inline-block; background: #7C69C7; color: white; padding: 13px 26px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px;">
            Open the overview
          </a>
        </p>

        <p style="font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 16px;">
          Short version: 157 agents, 57 skills, 45+ integrations, already configured. CRM, bookkeeping, voice transcription, content generation, social posting, strategic advisors. One installed system instead of 20 tabs.
        </p>

        <p style="font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 16px;">
          All Sorted opens to founding members soon. You&rsquo;re on the list. I&rsquo;ll write you when it&rsquo;s time.
        </p>

        <p style="font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 28px;">
          Hit reply and tell me what part of your business is the biggest mess right now. I read every one.
        </p>

        <p style="font-size: 14px; color: #999; margin-top: 24px;">Joe Che</p>
        ${unsubscribeFooter}
      </div>
    `
  } else if (source === 'guardog') {
    subject = 'Your GuardDog setup prompt'
    html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; background: #ffffff;">
        <p style="font-size: 13px; color: #999; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px;">GuardDog</p>

        <h1 style="font-size: 26px; font-weight: 800; line-height: 1.25; margin-bottom: 16px; color: #111;">
          Here&rsquo;s your GuardDog setup prompt.
        </h1>

        <p style="font-size: 16px; color: #444; line-height: 1.7; margin-bottom: 20px;">
          Paste this into Claude Code or Codex and it will install GuardDog, walk you through getting a free VirusTotal API key, and confirm everything works. About a minute end to end.
        </p>

        <pre style="background: #0f0f12; color: #f0eee6; padding: 20px; border-radius: 10px; font-size: 13px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; margin-bottom: 24px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">Set up GuardDog on this computer and get a free VirusTotal API key.

--- STEP 1: Install GuardDog ---

Run these commands in the terminal:
npm install -g github:josephtandle/guardog
guardog setup

After setup:
1. Confirm the guardog command is available globally.
2. Tell me where npm installed the global command.
3. Explain how I use GuardDog before installing unfamiliar packages.

--- STEP 2: Get a free VirusTotal API key ---

VirusTotal scans packages against 70+ antivirus engines. The free tier gives 500 requests per day at 4 requests per minute. No credit card required.

1. Open https://www.virustotal.com in my browser.
2. Create a free account if I do not already have one (click Sign In).
3. Once I confirm I am logged in, go to my profile icon (top-right) and click API Key.
4. Tell me to copy the key shown there.
5. Add the key to my shell profile. On macOS add to ~/.zshrc, on Linux add to ~/.bashrc:
   export VIRUSTOTAL_API_KEY="&lt;paste my key here&gt;"
   Resolve the home directory dynamically. Do not hard-code any paths.
6. Reload the shell profile so the key is active immediately.
7. Confirm the key loaded: echo $VIRUSTOTAL_API_KEY

--- STEP 3: Confirm everything works ---

Run: guardog analyze lodash npm
Show me the result and explain the verdict (SILENT, WHINE, or BARK).
Remind me to run guardog analyze &lt;package-name&gt; &lt;npm or pypi&gt; before installing any unfamiliar package.</pre>

        <p style="margin-bottom: 24px;">
          <a href="${guardogPageUrl}"
             style="display: inline-block; background: #7C69C7; color: white; padding: 13px 26px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px;">
            Open the GuardDog page
          </a>
        </p>

        <p style="font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 16px;">
          Lately I&rsquo;ve been building new free skills like this one almost every week. You&rsquo;ll get them as they drop. Real tools I&rsquo;m actually using in my own business, not theory.
        </p>

        <p style="font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 28px;">
          Hit reply and tell me what you&rsquo;re building. I read every one.
        </p>

        <p style="font-size: 14px; color: #999; margin-top: 24px;">Joe Che</p>
        ${unsubscribeFooter}
      </div>
    `
  } else if (source === 'maccleaner') {
    subject = 'Your MacCleaner installer'
    html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; background: #ffffff;">
        <p style="font-size: 13px; color: #999; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px;">MacCleaner</p>

        <h1 style="font-size: 28px; font-weight: 800; line-height: 1.2; margin-bottom: 16px; color: #111;">
          Your MacCleaner installer is ready.
        </h1>

        <p style="font-size: 16px; color: #444; line-height: 1.7; margin-bottom: 18px;">
          This is the safe version. The first run shows a preview only. Nothing destructive happens until you explicitly confirm the cleanup.
        </p>

        <div style="background: #f5f0ff; border-left: 3px solid #7C69C7; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
          <p style="font-size: 14px; color: #333; margin: 0; line-height: 1.7;">
            <strong>What it does:</strong><br>
            - previews cleanup first<br>
            - requires confirmation before deleting anything<br>
            - archives old iPhone backups to an external drive if one is available<br>
            - skips that archive step safely if no external drive is connected
          </p>
        </div>

        <p style="margin-bottom: 20px;">
          <a href="${macCleanerInstallerUrl}"
             style="display: inline-block; background: #7C69C7; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 16px;">
            Download the installer script
          </a>
        </p>

        <p style="font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 16px;">
          Want the walkthrough page too? It explains what gets cleaned, what gets skipped, and how the preview mode works.
        </p>

        <p style="margin-bottom: 28px;">
          <a href="${macCleanerPageUrl}" style="color: #7C69C7; font-weight: 600; text-decoration: none;">
            Open the MacCleaner guide
          </a>
        </p>

        <p style="font-size: 14px; color: #999; margin-top: 32px;">Joe Che</p>
        ${unsubscribeFooter}
      </div>
    `
  } else if (source === 'cult-brand-playbook') {
    subject = 'The Cult Brand Playbook'
    html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; background: #ffffff;">

        <p style="font-size: 13px; color: #999; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px;">The Cult Brand Playbook</p>

        <h1 style="font-size: 28px; font-weight: 800; line-height: 1.2; margin-bottom: 20px; color: #111;">
          Stop competing on features.<br>Start competing on identity.
        </h1>

        <p style="font-size: 16px; color: #444; line-height: 1.7; margin-bottom: 24px;">
          Most brands fight in the Visible Market: features, price, specs. It is a race to the bottom.
          The brands with the most devoted customers operate in the Mental Market: beliefs, identity, meaning.
          This playbook gives you the full system.
        </p>

        <div style="background: #f5f0ff; border-left: 3px solid #7C69C7; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 32px;">
          <p style="font-size: 14px; color: #333; margin: 0; line-height: 1.6;">
            <strong>Starbucks</strong> sells sophistication, not coffee.<br>
            <strong>Nike</strong> sells belief in personal greatness, not shoes.<br>
            <strong>Liquid Death</strong> sells rebellion against corporate wellness culture, not water.<br>
            None of them lead with specs. They lead with who you become when you buy.
          </p>
        </div>

        <h2 style="font-size: 20px; font-weight: 700; color: #111; margin-bottom: 16px;">The 7 Elements of a Cult Brand</h2>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; width: 32px; color: #7C69C7; font-weight: 700; font-size: 13px; vertical-align: top;">01</td>
            <td style="padding: 12px 8px; vertical-align: top;">
              <p style="margin: 0 0 4px; font-weight: 700; font-size: 15px; color: #111;">Shared Beliefs</p>
              <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">The manifesto that makes some people nod hard and others disagree. Disagreement is the signal. A belief that everyone agrees with is a platitude, not a position.</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #7C69C7; font-style: italic;">Your job: Complete the sentence "We believe that..." so that some people would push back.</p>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #7C69C7; font-weight: 700; font-size: 13px; vertical-align: top;">02</td>
            <td style="padding: 12px 8px; vertical-align: top;">
              <p style="margin: 0 0 4px; font-weight: 700; font-size: 15px; color: #111;">The Common Enemy</p>
              <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">Cult brands define themselves as much by what they oppose as what they stand for. The enemy creates unity. The enemy does not have to be a competitor. It can be a behavior, an institution, or a mindset.</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #7C69C7; font-style: italic;">Apple's enemy: IBM, corporate conformity. Liquid Death's enemy: plastic, boring wellness. CrossFit's enemy: complacency, globo gyms.</p>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #7C69C7; font-weight: 700; font-size: 13px; vertical-align: top;">03</td>
            <td style="padding: 12px 8px; vertical-align: top;">
              <p style="margin: 0 0 4px; font-weight: 700; font-size: 15px; color: #111;">Identity</p>
              <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">The most powerful thing you can sell is an answer to "who am I?" Watch how people describe themselves with cult brands. They say "I am a CrossFit person," not "I use CrossFit." The brand becomes part of their self-concept.</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #7C69C7; font-style: italic;">Your job: Write the identity sentence your customer feels. "When I use [brand], I am [identity]."</p>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #7C69C7; font-weight: 700; font-size: 13px; vertical-align: top;">04</td>
            <td style="padding: 12px 8px; vertical-align: top;">
              <p style="margin: 0 0 4px; font-weight: 700; font-size: 15px; color: #111;">Rituals</p>
              <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">Repeated behaviors that reinforce belonging. They can be product rituals (how you use it), community rituals (events, challenges), or language rituals (words only members use). They separate insiders from outsiders without a word.</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #7C69C7; font-style: italic;">CrossFit: posting your WOD time on the whiteboard. SoulCycle: the candle, the darkness. Harley: the group ride.</p>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #7C69C7; font-weight: 700; font-size: 13px; vertical-align: top;">05</td>
            <td style="padding: 12px 8px; vertical-align: top;">
              <p style="margin: 0 0 4px; font-weight: 700; font-size: 15px; color: #111;">Sacred Language</p>
              <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">Every tribe develops its own vocabulary. Shared language is a signal of belonging. Know the words, you are in. CrossFit calls it a "box," not a gym. Apple calls its stores "stores" but its support staff "Geniuses." The naming matters.</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #7C69C7; font-style: italic;">Your job: Replace 3 generic words in your brand vocabulary with brand-specific ones.</p>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; color: #7C69C7; font-weight: 700; font-size: 13px; vertical-align: top;">06</td>
            <td style="padding: 12px 8px; vertical-align: top;">
              <p style="margin: 0 0 4px; font-weight: 700; font-size: 15px; color: #111;">Symbols</p>
              <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">Visual and verbal badges that let members recognize each other. The Nike swoosh on your shoes. The Patagonia fleece in certain professional circles. Symbols are shorthand for belonging and signal "I am one of you" without a word spoken.</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #7C69C7; font-style: italic;">Your job: What is the one symbol your most devoted customers already use to signal membership?</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; color: #7C69C7; font-weight: 700; font-size: 13px; vertical-align: top;">07</td>
            <td style="padding: 12px 8px; vertical-align: top;">
              <p style="margin: 0 0 4px; font-weight: 700; font-size: 15px; color: #111;">Community</p>
              <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">Competitors can copy your product. They cannot copy your people. The brand is the origin. The community becomes the destination. The key distinction: are you building connections between customers, or only between customers and you? The latter is fragile. The former compounds.</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #7C69C7; font-style: italic;">Audience to fans to community to tribe. Each stage is harder to copy and more defensible.</p>
            </td>
          </tr>
        </table>

        <h2 style="font-size: 18px; font-weight: 700; color: #111; margin-bottom: 12px;">The 30-Day Sprint</h2>

        <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 8px;"><strong>Week 1: Diagnose.</strong> Write your current elevator pitch. Is it Visible Market or Mental Market? Find your 3 most devoted customers and ask: "What does this brand say about you?"</p>
        <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 8px;"><strong>Week 2: Build the foundation.</strong> Write your manifesto. Name your enemy (be specific). Write the identity sentence: "When I use [brand], I am [identity]."</p>
        <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 8px;"><strong>Week 3: Build the language.</strong> Replace 3 generic words with brand-specific vocabulary. Design one ritual. Identify or design one symbol.</p>
        <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 24px;"><strong>Week 4: Activate community.</strong> Find where your most devoted customers already gather. Create one touchpoint that connects customers to each other, not just to you. Start measuring advocacy, not just satisfaction.</p>

        <div style="background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 16px 20px; margin-bottom: 32px;">
          <p style="font-size: 13px; color: #666; margin: 0; line-height: 1.6;"><strong>The one-sentence version:</strong> Stop selling products. Start building a world that people want to live in.</p>
        </div>

        <p style="font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 8px;">
          If this resonates, come see what we are building at
          <a href="${withUtm('https://mastermindshq.business', { campaign: 'lead-magnet', content: 'cult-brand-playbook' })}" style="color: #7C69C7; font-weight: 600;">Masterminds HQ</a>.
          It is a live community of founders building real businesses with AI.
        </p>

        <p style="font-size: 14px; color: #999; margin-top: 32px;">Joe Che</p>
        ${unsubscribeFooter}
      </div>
    `
  } else if (source === 'web-design-arsenal') {
    subject = "You're on the list"
    html = `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
        <h1 style="font-size: 22px; margin-bottom: 16px;">You're on the list.</h1>
        <p style="font-size: 16px; line-height: 1.7; margin-bottom: 16px;">
          I'll let you know when new skills and resources drop.
        </p>
        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 24px; color: #444;">
          In the meantime, if you want to see what's possible when people use these tools in a live mastermind session,
          come check out what we're building at
          <a href="${withUtm('https://mastermindshq.business', { campaign: 'lead-magnet', content: 'web-design-arsenal' })}" style="color: #7C69C7; font-weight: 600;">mastermindshq.business</a>.
        </p>
        <p style="font-size: 14px; color: #999; margin-top: 32px;">Joe Che</p>
        ${unsubscribeFooter}
      </div>
    `
  } else {
    subject = 'Your free PDF: Un-Learning Success'
    html = `
      <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; color: #1a1a1a; margin-bottom: 16px;">
          Here's your copy of Un-Learning Success
        </h1>
        <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 24px;">
          17 real stories from a VIP dinner in Manhattan. Each person answered one question:
          "What did you have to un-learn about success?"
        </p>
        <a href="${withUtm(`${siteUrl}/unlearning-success.pdf`, { campaign: 'lead-magnet', content: 'unlearning-success-pdf' })}"
           style="display: inline-block; background: #7C69C7; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Download the PDF
        </a>
        <p style="font-size: 13px; color: #999; margin-top: 32px; line-height: 1.5;">
          ${unsubscribeUrl
            ? `Sent by Masterminds HQ. <a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe</a> any time.`
            : 'Sent by Masterminds HQ.'}
        </p>
      </div>
    `
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from: 'Joe Che <joe@mastermindshq.business>',
      to: [email],
      subject,
      html,
      headers: buildUnsubscribeHeaders(email),
    }),
  })

  if (!res.ok) throw new Error(`Resend error: ${res.status}`)
  return res.json()
}

// Map the giveaway page source to the CRM source key and giveaway label
const GIVEAWAY_SOURCE_MAP: Record<string, string> = {
  'maccleaner': 'giveaway-maccleaner',
  'cult-brand-playbook': 'giveaway-cult-brand-playbook',
  'web-design-arsenal': 'giveaway-web-design-arsenal',
  'lead-magnet': 'giveaway-unlearning-success',
  'claude-md': 'giveaway-claude-md',
  'benchmark': 'giveaway-benchmark',
  'anthropic-safety-checklist': 'giveaway-anthropic-checklist',
  'guardog': 'giveaway-guardog',
  'all-sorted-overview': 'giveaway-all-sorted-overview',
  'human': 'giveaway-speak-human',
  'speak-human': 'giveaway-speak-human',
}

async function ingestIntoCrm(email: string, source: string) {
  const crmSource = GIVEAWAY_SOURCE_MAP[source] ?? `giveaway-${source}`
  const crmBase = process.env.MISSION_CONTROL_URL ?? 'http://localhost:3000'
  const res = await fetch(`${crmBase}/api/crm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'ingest',
      email,
      source: crmSource,
      primary_project: 'mastermind',
      campaign: source,
    }),
  })
  if (!res.ok) throw new Error(`CRM ingest failed: ${res.status}`)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const { ok: rateLimitOk } = await checkRateLimit(`lead-magnet:${getClientIp(request)}`, 10, 60)
    if (!rateLimitOk) {
      return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
    }

    const { email, source = 'lead-magnet', journeyId = null } = await request.json()

    if (!email || typeof email !== 'string' || email.length > 256 || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    await trackInsightEvent('giveaway_lead_captured', {
      route: '/giveaways',
      email,
      sessionId: typeof journeyId === 'string' ? journeyId : null,
      properties: { source },
    })

    // Save to Supabase leads table (non-blocking)
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!
      )
      await supabase
        .from('leads')
        .upsert({ email, lead_source: source }, { onConflict: 'email' })
    } catch (dbErr) {
      console.error('Supabase error (non-blocking):', dbErr)
    }

    // Ingest into Mission Control CRM with giveaway tag (non-blocking)
    ingestIntoCrm(email, source).catch((err) =>
      console.error('CRM ingest error (non-blocking):', err)
    )

    // Marketing send: skip if this address is on the global suppression list
    // (isSuppressed fails closed on any read error, so a Supabase hiccup
    // suppresses rather than risks emailing an unsubscribed address).
    if (await isSuppressed(email)) {
      console.log(`lead-magnet: skipping suppressed address ${email} (source=${source})`)
      return NextResponse.json({ success: true, suppressed: true })
    }

    // Send confirmation via Resend
    const idempotencyKey = `lead-magnet/${source}/${email.trim().toLowerCase()}`
    await sendViaResend(email, source, idempotencyKey)
    await trackInsightEvent('initial_email_sent', {
      route: '/api/lead-magnet',
      email,
      sessionId: typeof journeyId === 'string' ? journeyId : null,
      properties: { source, email_type: 'lead_magnet_delivery' },
    })
    await trackInsightEvent('welcome_email_sent', {
      route: '/api/lead-magnet',
      email,
      sessionId: typeof journeyId === 'string' ? journeyId : null,
      properties: { source, email_type: 'lead_magnet_delivery' },
    })
    await trackInsightEvent('delivery_completed', {
      route: '/api/lead-magnet',
      email,
      sessionId: typeof journeyId === 'string' ? journeyId : null,
      properties: { source, delivery_type: 'lead_magnet' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead magnet error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
