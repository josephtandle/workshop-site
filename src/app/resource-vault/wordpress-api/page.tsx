import Link from 'next/link'
import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'
import StickyVideoPlayer from '@/components/StickyVideoPlayer'

export const metadata = {
  title: 'Download Your WordPress Site for Redesign',
  description: 'Connect Claude Code to your WordPress site and download your entire website for redesign. Get your API key in 5 minutes.',
}

export default function WordPressAPIPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* Page header */}
      <div className="mb-14">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Resource Vault
        </p>
        <h1 className="gradient-text text-4xl font-extrabold leading-tight mb-5 pb-1">
          Connect Claude Code to Your WordPress Site and Download Everything for a Redesign
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-8">
          Get your API key in 5 minutes. Then let Claude pull down every page, post, and image so you have everything you need to rebuild your site from scratch.
        </p>
        <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 border-t border-white/[0.08] pt-6">
          <span><span className="text-[#FCF4EB]/30 mr-2">Duration</span>~5 minutes</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Difficulty</span>Beginner</span>
        </div>
      </div>

      {/* Watch first */}
      <div className="mb-14">
        <p className="text-[#FCF4EB]/40 text-xs uppercase tracking-widest font-semibold mb-4">
          Watch first
        </p>
        <StickyVideoPlayer
          videoId="wswm6FN9Dh4"
          title="WordPress Application Passwords: How to Set Up and Use Them Safely"
        />
      </div>

      {/* Part A */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part A</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Get Your API Key</h2>
        </div>

        <StepCard number={1} title="What the WordPress API key is">
          <p>
            Most platforms call it an API key. WordPress calls the same thing an Application Password.
            Same idea, different name. It is a credential that lets outside tools like Claude Code
            connect to your site without using your main login password.
          </p>
          <p>
            No plugins needed. It is built into every WordPress site running version 5.6 or later
            (released in 2020). If your site is reasonably up to date, it is already there.
          </p>
          <p>
            <Link
              href="https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors underline underline-offset-2"
            >
              Read the official WordPress Application Passwords guide
            </Link>{' '}
            if you want more detail.
          </p>
        </StepCard>

        <StepCard number={2} title="Log into your WordPress dashboard">
          <p>
            Open your browser and go to your WordPress admin panel. Try adding{' '}
            <span className="font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">/wp-admin</span>{' '}
            to the end of your website address.
          </p>
          <CodeBlock
            filename="Your dashboard URL"
            code="https://yoursite.com/wp-admin"
          />
          <ProTip type="tip">
            Most WordPress sites use /wp-admin. If that does not work, check with your hosting provider
            or look for a login link at the bottom of your site&apos;s homepage.
          </ProTip>
        </StepCard>

        <StepCard number={3} title="Create your Application Password">
          <p>Follow these steps inside your WordPress dashboard:</p>
          <ol className="list-none space-y-3 mt-3">
            {[
              'In the left sidebar, go to Users. Click on your name, or click your profile picture at the top right and choose Profile.',
              'Scroll all the way down to the section called Application Passwords.',
              'In the field labeled "New Application Password Name," type: Claude Code',
              'Click the "Add New Application Password" button.',
              'Copy the password that appears. It includes spaces. Copy all of it.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: 'rgba(124, 105, 199, 0.15)',
                    color: '#9D8FE0',
                    border: '1px solid rgba(124, 105, 199, 0.30)',
                  }}
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <ProTip type="warning">
            WordPress shows this password exactly once. If you close the page or navigate away before
            copying it, you will need to delete it and create a new one.
          </ProTip>
        </StepCard>

        <StepCard number={4} title="Save your credentials">
          <p>
            Before moving to Claude Code, save your three pieces of information somewhere safe. A notes
            app, a text file, anywhere you can find them again.
          </p>
          <CodeBlock
            editable
            filename="Save these somewhere safe"
            code={`Site URL: https://[YOUR-SITE.COM]
Username: [YOUR-WORDPRESS-USERNAME]
Application Password: [PASTE-THE-PASSWORD-HERE]`}
          />
          <ProTip type="info">
            Your username is the name you use to log into WordPress, not your email address. You can
            find it at the top of the Users profile page after you log in.
          </ProTip>
        </StepCard>
      </section>

      {/* Part B */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part B</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Connect Claude Code</h2>
        </div>

        <StepCard number={5} title="Test your connection">
          <p>
            Open Claude Code and paste the prompt below. Fill in your site URL, username, and password
            from Step 4 before hitting Copy.
          </p>
          <CodeBlock
            editable
            filename="Paste into Claude Code"
            code={`Connect to my WordPress site. Here are my credentials:

Site URL: https://[YOUR-SITE.COM]
Username: [YOUR-WORDPRESS-USERNAME]
Application Password: [YOUR-APP-PASSWORD]

Test the connection and confirm you can see my site. List my 5 most recent posts and pages.`}
          />
        </StepCard>

        <StepCard number={6} title="Download your entire site">
          <p>
            Once the connection test works, use this prompt to pull down all your content. This is the
            main payoff. Claude already has your credentials from the previous step, so no placeholders
            to fill in here.
          </p>
          <CodeBlock
            filename="Paste into Claude Code"
            code={`Download all my WordPress content and save it locally:

1. All published pages — title, content, URL, and featured image
2. All published posts — title, content, date, categories, tags, and featured image
3. All media files — download every image to a ~/wordpress-backup/media/ folder
4. Save a summary to ~/wordpress-backup/site-overview.md listing everything

Organize everything inside a ~/wordpress-backup/ folder. Show me what you downloaded when done.`}
          />
          <ProTip type="info">
            This can take a few minutes on a large site. Claude will show you a summary when it
            finishes. You can run this again any time to get a fresh copy.
          </ProTip>
        </StepCard>
      </section>

      {/* Bonus */}
      <section>
        <div className="border-t border-white/[0.08] pt-16">

          <div
            className="rounded-2xl p-8 mb-10"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 195, 198, 0.14) 0%, rgba(124, 105, 199, 0.10) 100%)',
              border: '1px solid rgba(245, 195, 198, 0.22)',
            }}
          >
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
              style={{
                background: 'rgba(245, 195, 198, 0.18)',
                color: '#F5C3C6',
                border: '1px solid rgba(245, 195, 198, 0.30)',
              }}
            >
              Bonus
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#FCF4EB] leading-tight mb-3">
              Now you can manage your<br />whole site from Claude.
            </h2>
            <p className="text-[#FCF4EB]/50 text-base">
              Once Claude has your credentials, just ask it anything in plain English.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                label: 'Write a new blog post',
                prompt: 'Write a 600-word blog post about [your topic] and publish it as a draft on my WordPress site.',
              },
              {
                label: 'Update your About page',
                prompt: 'Update my About page on WordPress with this new bio: [paste your bio here].',
              },
              {
                label: 'Fix your SEO',
                prompt: 'Check my 5 most recent WordPress posts for missing SEO titles and meta descriptions. Add them based on what each post is about.',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5"
              >
                <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-2">
                  {item.label}
                </p>
                <p className="text-[#FCF4EB]/70 text-sm leading-relaxed font-mono bg-white/[0.04] rounded-lg p-3 mt-2">
                  {item.prompt}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </main>
  )
}
