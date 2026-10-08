// Delivery emails for the two AI quiz giveaways (Instagram keywords LEVEL and
// BEHAVIOR, /giveaways/ai-levels-quiz and /giveaways/ai-behavior-quiz).
//
// Before 2026-10-08 both slugs had no template, so /api/lead-magnet failed
// closed: the email was saved and nothing was sent, including to people who
// gave their email in the ManyChat DM and were promised a copy in their inbox.
//
// Pretty-light letter format on purpose, same as the Token Diet and Free AI
// Tools emails: Georgia serif, styled text links, no buttons, no shaded boxes,
// no attachments, and a hand-written plain-text part. That shape reached Gmail
// Primary on a cold inbox; the purple-button shape went to spam.
//
// The quizzes themselves live on mastermindshq.business (the giveaway pages
// link out to them). Copy here matches those pages: the 0 to 40 ladder bands
// and the B0 to B10 behaviour bands are the same words the pages use.

import { withUtm } from './utm'

export const QUIZ_GIVEAWAY_SLUGS = ['ai-levels-quiz', 'ai-behavior-quiz'] as const
export type QuizGiveawaySlug = (typeof QUIZ_GIVEAWAY_SLUGS)[number]

export function isQuizGiveawaySource(source: string): source is QuizGiveawaySlug {
  return (QUIZ_GIVEAWAY_SLUGS as readonly string[]).includes(source)
}

export const LEVELS_QUIZ_URL = 'https://mastermindshq.business/ai-capability-levels'
export const BEHAVIOR_QUIZ_URL = 'https://mastermindshq.business/ai-behavioral-quiz'

const LINK_STYLE = 'color:#6f5cc4;font-weight:bold;'
const ITEM_STYLE = 'margin:0 0 10px;padding-left:14px;border-left:2px solid #d9d2ee;color:#3a3550;'
const LABEL_STYLE = 'color:#8B79D4;font-weight:bold;'
const MUTED = 'color:#6a6480;'

type Band = { label: string; line: string }

const LEVEL_BANDS: Band[] = [
  { label: '0 to 10, Exploring.', line: 'You are learning what AI can do and where it fits.' },
  { label: '11 to 20, Applying.', line: 'You use AI for useful work, but it is not repeatable yet.' },
  { label: '21 to 30, Integrating.', line: 'AI is part of how your work actually gets done.' },
  { label: '31 to 40, Compounding.', line: 'You are building systems that get better every time you use them.' },
]

const BEHAVIOR_BANDS: Band[] = [
  { label: 'B0, Avoidant.', line: 'AI is mostly outside your day, by choice or because you have not needed it yet.' },
  { label: 'B3, Testing.', line: 'You try it in small, useful moments and keep what is worth keeping.' },
  { label: 'B6, Embedded.', line: 'It is a normal part of your work and your thinking, with real benefits and real tradeoffs.' },
  { label: 'B9, Watchful.', line: 'This is where sleep can start slipping. A good moment to pause and check what the pace is asking of you.' },
]

function bandsHtml(bands: Band[]): string {
  return bands
    .map((b) => `<p style="${ITEM_STYLE}"><span style="${LABEL_STYLE}">${b.label}</span> ${b.line}</p>`)
    .join('\n        ')
}

function footerText(unsubscribeUrl: string | null): string {
  return unsubscribeUrl ? `Sent by Masterminds HQ. Unsubscribe any time: ${unsubscribeUrl}` : 'Sent by Masterminds HQ.'
}

export function buildQuizGiveawayEmail({
  source,
  unsubscribeFooter,
  unsubscribeUrl,
}: {
  source: QuizGiveawaySlug
  unsubscribeFooter: string
  unsubscribeUrl: string | null
}) {
  const mhqUrl = withUtm('https://mastermindshq.business', { campaign: 'lead-magnet', content: source })
  const levelsUrl = withUtm(LEVELS_QUIZ_URL, { campaign: 'lead-magnet', content: `${source}-levels-quiz` })
  const behaviorUrl = withUtm(BEHAVIOR_QUIZ_URL, { campaign: 'lead-magnet', content: `${source}-behavior-quiz` })

  if (source === 'ai-levels-quiz') {
    const subject = 'Your AI Capability Levels quiz'
    const html = `
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:#2a2536;max-width:560px;">
        <p>Hi,</p>
        <p>Here&rsquo;s the quiz you asked for: <a href="${levelsUrl}" style="${LINK_STYLE}">take the AI Capability Levels quiz</a>.</p>
        <p>It takes about two minutes. One yes or no question per level, and it keeps climbing until the evidence runs out, so you get an exact number from 0 to 40 instead of a vague label. Be honest with it. It rates what you have actually done, not what you are planning to do.</p>
        <p style="${MUTED}">A quick map so your number means something:</p>
        ${bandsHtml(LEVEL_BANDS)}
        <p style="margin-top:18px;">The jump that matters most is from asking AI questions to having it do real tasks for you. You don&rsquo;t need to code to make it.</p>
        <p>Once you have your level, hit reply and tell me the number. I read them all.</p>
        <p>If you want help climbing to the next level, that is what we do every week at <a href="${mhqUrl}" style="${LINK_STYLE}">Masterminds HQ</a>.</p>
        <p style="margin-top:20px;">Joe</p>
        ${unsubscribeFooter}
      </div>
    `
    const text = [
      'Hi,',
      '',
      `Here's the quiz you asked for: ${levelsUrl}`,
      '',
      'It takes about two minutes. One yes or no question per level, and it keeps climbing until the evidence runs out, so you get an exact number from 0 to 40 instead of a vague label. Be honest with it. It rates what you have actually done, not what you are planning to do.',
      '',
      'A quick map so your number means something:',
      ...LEVEL_BANDS.map((b) => `- ${b.label} ${b.line}`),
      '',
      "The jump that matters most is from asking AI questions to having it do real tasks for you. You don't need to code to make it.",
      '',
      'Once you have your level, hit reply and tell me the number. I read them all.',
      '',
      `If you want help climbing to the next level, that is what we do every week at Masterminds HQ (${mhqUrl}).`,
      '',
      'Joe',
      '',
      footerText(unsubscribeUrl),
    ].join('\n')
    return { subject, html, text }
  }

  const subject = 'Your AI Behavioral Use quiz'
  const html = `
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:#2a2536;max-width:560px;">
        <p>Hi,</p>
        <p>Here&rsquo;s the quiz you asked for: <a href="${behaviorUrl}" style="${LINK_STYLE}">take the AI Behavioral Use quiz</a>.</p>
        <p>Six questions, about two minutes. Answer honestly, nobody sees it but you.</p>
        <p>This one doesn&rsquo;t measure skill. It measures how hard you are running with AI, from B0 Avoidant to B10, and what that pace is costing you. Nobody wins by scoring high here. A steady B5 who protects their sleep will out-build an exhausted B9 every time.</p>
        <p style="${MUTED}">Where people tend to land:</p>
        ${bandsHtml(BEHAVIOR_BANDS)}
        <p style="margin-top:18px;">If you want the other half of the picture, what you can actually build with AI, take the <a href="${levelsUrl}" style="${LINK_STYLE}">AI Capability Levels quiz</a> too.</p>
        <p>Hit reply and tell me where you landed. I read them all.</p>
        <p>If you want to build with AI without it eating your evenings, that is what we work on every week at <a href="${mhqUrl}" style="${LINK_STYLE}">Masterminds HQ</a>.</p>
        <p style="margin-top:20px;">Joe</p>
        ${unsubscribeFooter}
      </div>
    `
  const text = [
    'Hi,',
    '',
    `Here's the quiz you asked for: ${behaviorUrl}`,
    '',
    'Six questions, about two minutes. Answer honestly, nobody sees it but you.',
    '',
    "This one doesn't measure skill. It measures how hard you are running with AI, from B0 Avoidant to B10, and what that pace is costing you. Nobody wins by scoring high here. A steady B5 who protects their sleep will out-build an exhausted B9 every time.",
    '',
    'Where people tend to land:',
    ...BEHAVIOR_BANDS.map((b) => `- ${b.label} ${b.line}`),
    '',
    `If you want the other half of the picture, what you can actually build with AI, take the AI Capability Levels quiz too: ${levelsUrl}`,
    '',
    'Hit reply and tell me where you landed. I read them all.',
    '',
    `If you want to build with AI without it eating your evenings, that is what we work on every week at Masterminds HQ (${mhqUrl}).`,
    '',
    'Joe',
    '',
    footerText(unsubscribeUrl),
  ].join('\n')
  return { subject, html, text }
}
