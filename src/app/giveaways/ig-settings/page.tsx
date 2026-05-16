import Link from 'next/link'

const CHECKLIST = [
  {
    title: 'Make the account public',
    path: 'Profile -> Menu -> Account privacy',
    setting: 'Private account: Off',
    why: 'Public Reels can appear in Feed, Reels, Explore, audio pages, effect pages, hashtag pages, and shares. Private Reels are limited to approved followers.',
    source: 'https://www.facebook.com/help/instagram/1392551434468488?locale=en_GB',
  },
  {
    title: 'Use a professional account',
    path: 'Profile -> Menu -> Account type and tools',
    setting: 'Creator or Business account: On',
    why: 'Professional accounts unlock the dashboard, insights, and account-level performance signals. You need this to know what is growing and what is just getting posted.',
    source: 'https://www.facebook.com/help/instagram/257516379077270',
  },
  {
    title: 'Check recommendation eligibility',
    path: 'Profile -> Menu -> Account Status',
    setting: 'All recommendation and policy checks: Green',
    why: 'Account Status tells you whether your content may be eligible to be recommended. If this is not clean, growth tactics are secondary.',
    source: 'https://www.facebook.com/help/instagram/653964212890722?locale=en_GB',
  },
  {
    title: 'Protect originality',
    path: 'Account Status -> Recommendation checks',
    setting: 'Mostly original content over the last 30 days',
    why: 'Instagram is increasingly limiting recommendation reach for accounts that mostly repost unoriginal Reels, photos, or carousels. If you reuse content, add real commentary, edits, voiceover, or Collab/Repost properly.',
    source: 'https://www.digitalcameraworld.com/tech/social-media/two-years-later-instagram-is-finally-giving-photographers-the-same-protection-as-videographers-with-this-key-change',
  },
  {
    title: 'Allow remixing and reuse',
    path: 'Profile -> Menu -> Sharing and reuse',
    setting: 'Allow remixing/reuse for Reels and Posts: On',
    why: 'Remix and reuse let other creators build on your content. That can create distribution loops beyond your existing audience.',
    source: 'https://www.facebook.com/help/instagram/792438641600810?locale=en_GB',
  },
  {
    title: 'Allow downloads when the goal is spread',
    path: 'Profile -> Menu -> Sharing and reuse',
    setting: 'Allow people to download your Reels: On',
    why: 'If the goal is reach, downloads make it easier for people to share your Reel outside Instagram. Keep it off only for content you do not want redistributed.',
    source: 'https://techcrunch.com/2023/11/22/instagram-now-allows-anyone-to-download-public-reels/',
  },
  {
    title: 'Turn on highest quality uploads',
    path: 'Profile -> Menu -> Data usage and media quality',
    setting: 'Upload at highest quality: On, if available',
    why: 'This reduces the chance that Instagram sacrifices upload quality to save data. For Reels, export SDR, 30 fps, and 1080p/2K by default.',
    source: 'https://www.facebook.com/help/1631821640426723/',
  },
  {
    title: 'Keep comments, tags, and mentions open',
    path: 'Profile -> Menu -> Tags and mentions / Comments',
    setting: 'Allow comments, tags, mentions, and Collabs unless abuse forces limits',
    why: 'Growth needs interaction. Tags, Collabs, comments, and mentions create more surfaces where your content can be discovered.',
    source: 'https://www.facebook.com/help/instagram/788388387972460',
  },
]

const SETTINGS_SCREEN = [
  ['Account privacy', 'Private account off'],
  ['Account Status', 'Eligible for recommendations'],
  ['Sharing and reuse', 'Remix, reuse, downloads on'],
  ['Media quality', 'Highest quality uploads on'],
]

const DO_DONT = [
  ['Do', 'Post mostly original Reels, photos, and carousels.'],
  ['Do', 'Use Collab posts when another creator materially helped make the content.'],
  ['Do', 'Check Account Status before blaming the algorithm.'],
  ['Do not', 'Build the account on reposts with only captions, borders, or subtitles added.'],
  ['Do not', 'Turn off comments, mentions, remixing, or downloads by default if reach is the goal.'],
  ['Do not', 'Export every Reel in 4K HDR unless the source was made for that.'],
]

function PhoneMockup() {
  return (
    <div className="mx-auto w-full max-w-[360px] rounded-[2.4rem] border border-white/12 bg-[#070710] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
      <div className="rounded-[1.8rem] border border-white/10 bg-[#101018] p-4">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BDB3E8]">Instagram</p>
            <p className="mt-1 text-lg font-bold text-[#FCF4EB]">Settings</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-[#7C69C7]/28" />
        </div>
        <div className="space-y-3">
          {SETTINGS_SCREEN.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-semibold text-[#FCF4EB]">{label}</p>
              <p className="mt-1 text-xs leading-5 text-[#FCF4EB]/55">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-[#BDE7C0]/20 bg-[#BDE7C0]/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BDE7C0]">Goal state</p>
          <p className="mt-2 text-sm leading-6 text-[#FCF4EB]/75">Public, recommendable, remixable, measurable, and high-quality.</p>
        </div>
      </div>
    </div>
  )
}

function ScreenshotCard({
  number,
  title,
  path,
  setting,
  why,
  source,
}: {
  number: string
  title: string
  path: string
  setting: string
  why: string
  source: string
}) {
  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#7C69C7]/30 bg-[#7C69C7]/16 text-sm font-bold text-[#FCF4EB]">
          {number}
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-bold tracking-tight text-[#FCF4EB]">{title}</h3>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#BDB3E8]">{path}</p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-[#F5C3C6]/20 bg-[#F5C3C6]/8 p-4">
        <p className="text-sm font-semibold text-[#FCF4EB]">{setting}</p>
      </div>
      <p className="mt-4 text-sm leading-7 text-[#FCF4EB]/68">{why}</p>
      <a href={source} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.18em] text-[#BDB3E8]">
        Source
      </a>
    </article>
  )
}

export default function IgSettingsGiveawayPage() {
  return (
    <main className="overflow-hidden bg-[#0B0B12] text-[#FCF4EB]">
      <section className="relative px-6 pb-14 pt-20 md:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(124,105,199,0.26),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(245,195,198,0.18),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">Free Instagram Growth Checklist</p>
            <h1 className="mt-5 max-w-4xl text-[3rem] font-extrabold leading-[0.92] tracking-tight md:text-[5.2rem]">
              Fix the settings that quietly cap your reach.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#FCF4EB]/68">
              Before you chase hooks, hashtags, or another editing trick, make sure your Instagram account is public,
              recommendable, remixable, measurable, and uploading clean video.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#checklist" className="inline-flex min-w-[180px] items-center justify-center rounded-xl bg-[#7C69C7] px-5 py-4 text-sm font-bold text-white no-underline shadow-[0_16px_45px_rgba(124,105,199,0.32)]">
                Open checklist
              </a>
              <Link href="/giveaways" className="inline-flex min-w-[180px] items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] px-5 py-4 text-sm font-bold text-[#FCF4EB] no-underline">
                More resources
              </Link>
            </div>
          </div>
          <PhoneMockup />
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.035] px-6 py-7">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {[
            ['30 seconds', 'Check if your account is eligible to be recommended'],
            ['8 settings', 'The settings that matter before posting Reels'],
            ['1 default', 'SDR, 30 fps, 1080p/2K for Edits exports'],
          ].map(([stat, label]) => (
            <div key={stat} className="rounded-2xl border border-white/10 bg-[#0B0B12]/70 p-5">
              <p className="text-2xl font-bold text-[#FCF4EB]">{stat}</p>
              <p className="mt-2 text-sm leading-6 text-[#FCF4EB]/58">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="checklist" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">The Settings Pass</p>
          <h2 className="mt-4 text-[2.4rem] font-extrabold leading-[0.95] tracking-tight md:text-[4rem]">Run these before your next Reel.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {CHECKLIST.map((item, index) => (
            <ScreenshotCard key={item.title} number={String(index + 1).padStart(2, '0')} {...item} />
          ))}
        </div>
      </section>

      <section className="bg-[#11111A] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">Rules Of Thumb</p>
            <h2 className="mt-4 text-[2.4rem] font-extrabold leading-[0.95] tracking-tight md:text-[4rem]">What to do, and what not to waste time on.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {DO_DONT.map(([label, body]) => (
              <div key={body} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className={label === 'Do' ? 'text-sm font-bold uppercase tracking-[0.2em] text-[#BDE7C0]' : 'text-sm font-bold uppercase tracking-[0.2em] text-[#F5C3C6]'}>
                  {label}
                </p>
                <p className="mt-3 text-base leading-7 text-[#FCF4EB]/72">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#BDB3E8]">Comment Keyword</p>
        <h2 className="mt-4 text-[2.5rem] font-extrabold leading-[0.95] tracking-tight md:text-[4rem]">Comment IG SETTINGS to get the checklist.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#FCF4EB]/62">
          Use this before posting a new campaign, giveaway, founder story, or educational Reel.
        </p>
      </section>
    </main>
  )
}
