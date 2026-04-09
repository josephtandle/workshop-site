import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'
import StickyVideoPlayer from '@/components/StickyVideoPlayer'
import Link from 'next/link'

export const metadata = {
  title: 'Bonus: Verify Your Domain in Resend — Masterminds Workshop',
  description: 'Step-by-step guide to verify your custom domain in Resend so you can send emails to anyone from your own address.',
}

function DnsRecord({
  type,
  host,
  ttl,
  valueLabel,
  value,
  note,
  priority,
}: {
  type: string
  host: string
  ttl: string
  valueLabel: string
  value: string
  note?: string
  priority?: string
}) {
  return (
    <div className="rounded-xl border border-white/[0.10] overflow-hidden">
      <div className={`grid ${priority ? 'grid-cols-4' : 'grid-cols-3'} divide-x divide-white/[0.08] bg-white/[0.03]`}>
        <div className="px-4 py-3">
          <p className="text-[#FCF4EB]/40 text-[10px] uppercase tracking-widest mb-1.5 font-semibold">Type</p>
          <p className="text-[#FCF4EB] font-mono text-sm font-semibold">{type}</p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[#FCF4EB]/40 text-[10px] uppercase tracking-widest mb-1.5 font-semibold">Host / Name</p>
          <p className="text-[#FCF4EB] font-mono text-sm font-semibold">{host}</p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[#FCF4EB]/40 text-[10px] uppercase tracking-widest mb-1.5 font-semibold">TTL</p>
          <p className="text-[#FCF4EB] font-mono text-sm font-semibold">{ttl}</p>
        </div>
        {priority && (
          <div className="px-4 py-3">
            <p className="text-[#FCF4EB]/40 text-[10px] uppercase tracking-widest mb-1.5 font-semibold">Priority</p>
            <p className="text-[#FCF4EB] font-mono text-sm font-semibold">{priority}</p>
          </div>
        )}
      </div>
      <div className="border-t border-white/[0.08] px-4 pt-4 pb-1 bg-white/[0.02]">
        <p className="text-[#FCF4EB]/40 text-[10px] uppercase tracking-widest mb-1 font-semibold">
          {valueLabel}
        </p>
        <p className="text-[#FCF4EB]/60 text-xs mb-2">Copy this and paste it into the Value field</p>
        <CodeBlock code={value} />
        {note && (
          <p className="text-[#FCF4EB]/40 text-xs mt-2 mb-2">{note}</p>
        )}
      </div>
    </div>
  )
}

export default function Session3Homework() {
  return (
    <>
    <div className="max-w-5xl mx-auto px-6 py-16 pb-0">

      {/* Breadcrumb */}
      <nav className="mb-10 text-sm text-[#FCF4EB]/40 flex items-center gap-2">
        <Link href="/" className="hover:text-[#7C69C7] transition-colors">All Sessions</Link>
        <span>/</span>
        <Link href="/session/3" className="hover:text-[#7C69C7] transition-colors">Session 3</Link>
        <span>/</span>
        <span className="text-[#FCF4EB]/60">Homework</span>
      </nav>

      {/* Page Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Session 3</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-white/[0.06] text-[#FCF4EB]/40">
            Bonus
          </span>
        </div>
        <h1 className="text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
          How to Verify Your Custom Domain in Resend
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-8">
          Right now your lead magnet emails send from{' '}
          <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-sm">onboarding@resend.dev</code> and
          can only reach your own inbox. After this homework, your emails will come from your own
          domain and reach anyone. About 15 minutes.
        </p>

        {/* Before / After comparison */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
            <p className="text-red-400/80 text-xs font-semibold uppercase tracking-widest mb-3">Before (right now)</p>
            <ul className="space-y-3 text-[#FCF4EB]/60 text-sm leading-relaxed">
              <li className="flex gap-2 items-start">
                <span className="text-red-400/60 mt-0.5">&#x2717;</span>
                <span>Emails come from <code className="bg-white/[0.06] px-1 py-0.5 rounded text-xs">onboarding@resend.dev</code></span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-red-400/60 mt-0.5">&#x2717;</span>
                <span>Often lands in spam</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-red-400/60 mt-0.5">&#x2717;</span>
                <span>Can only send to your own email</span>
              </li>
            </ul>
          </div>
          <div className="bg-[#7C69C7]/[0.06] border border-[#7C69C7]/20 rounded-xl p-6">
            <p className="text-[#9D8FE0] text-xs font-semibold uppercase tracking-widest mb-3">After (15 minutes from now)</p>
            <ul className="space-y-3 text-[#FCF4EB]/70 text-sm leading-relaxed">
              <li className="flex gap-2 items-start">
                <span className="text-[#9D8FE0] mt-0.5">&#x2713;</span>
                <span>Emails come from <code className="bg-white/[0.06] px-1 py-0.5 rounded text-xs">hello@yourdomain.com</code></span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-[#9D8FE0] mt-0.5">&#x2713;</span>
                <span>Lands in the inbox</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-[#9D8FE0] mt-0.5">&#x2713;</span>
                <span>Can send to anyone</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
          <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest mb-3 font-semibold">What You Need Before Starting</p>
          <ul className="space-y-2 text-[#FCF4EB]/70 text-sm leading-relaxed">
            <li className="flex gap-2 items-start">
              <span className="text-[#FCF4EB]/30">1.</span>
              <span>A domain you own (the one you set up in the session, or any domain you control)</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-[#FCF4EB]/30">2.</span>
              <span>The ability to log in to your domain registrar (<a href="https://porkbun.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">Porkbun</a>, <a href="https://www.godaddy.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">GoDaddy</a>, <a href="https://www.namecheap.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">Namecheap</a>, <a href="https://www.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">Cloudflare</a>, <a href="https://www.wix.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">Wix</a>, etc.)</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-[#FCF4EB]/30">3.</span>
              <span>Claude Code open in your project folder</span>
            </li>
          </ul>
        </div>
      </div>

    </div>

    {/* Workshop Recording — sticky video player */}
    <div className="max-w-5xl mx-auto px-6 mb-14">
      <div className="mb-4">
        <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest font-semibold mb-1">Walkthrough Video</p>
        <p className="text-[#FCF4EB]/40 text-sm">Hit play and the video will stick to the top as you scroll.</p>
      </div>
      <StickyVideoPlayer videoId="4KrrQgQ83xk" title="How to Verify Resend Domain Verification" />
    </div>

    <div className="max-w-5xl mx-auto px-6 pb-16">

      {/* Step 1 */}
      <StepCard number={1} title="Ask Claude Code to get your DNS records">
        <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
          You do not need to go to the Resend dashboard. Claude Code can do everything for you.
          Open Claude Code in your project folder and paste this:
        </p>
        <CodeBlock
          filename="Paste into Claude Code"
          editable
          code={`Add my domain [YOUR DOMAIN — for example: mybusiness.com] to Resend using my Resend API key.

After you get the DNS records back, do the following:
1. Show me each DNS record in a clear table format (Type, Name, Value, Priority if applicable)
2. Tell me which records are the same for everyone and which are unique to me
3. Give me a direct link to my domain registrar's DNS settings page
4. Give me step-by-step instructions for adding each record in my registrar
5. Warn me not to delete my existing Vercel DNS records`}
        />
        <ProTip type="tip" className="mt-4">
          If Claude does not have your Resend API key, paste it in first:{' '}
          <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-xs">My Resend API key is re_xxxx</code>
        </ProTip>
        <p className="text-[#FCF4EB]/70 leading-relaxed mt-4">
          Claude will register your domain with Resend and give you back 3 DNS records along with
          instructions for your specific registrar. Follow those instructions to add each record.
        </p>
      </StepCard>

      {/* Step 2 */}
      <StepCard number={2} title="Understand the 3 records you need to add">
        <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
          Claude will show you 3 records. Here is what each one looks like and does so you
          know what you are pasting. You will add these in your registrar (Porkbun, GoDaddy, etc.)
          the same way you added DNS records for Vercel.
        </p>

        {/* Record 1 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[#7C69C7] text-xs font-bold">1</span>
            </div>
            <p className="text-[#FCF4EB] font-semibold">DKIM Record (TXT)</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#7C69C7]/15 text-[#9D8FE0] font-medium">Unique to you</span>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
            This proves to email providers that you own the domain. The value is a long string
            that Claude will give you. It is different for every person. Do not copy someone else&apos;s.
          </p>
          <DnsRecord
            type="TXT"
            host="resend._domainkey"
            ttl="Auto"
            valueLabel="Value (Claude will give you yours)"
            value="p=MIGf... (your unique key from Claude — do not use this example)"
            note="This is just an example. Copy the actual value Claude gives you."
          />
        </div>

        {/* Record 2 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[#7C69C7] text-xs font-bold">2</span>
            </div>
            <p className="text-[#FCF4EB] font-semibold">SPF Record (MX)</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-[#FCF4EB]/40 font-medium">Same for everyone</span>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
            This tells email providers which server is allowed to send email for your domain.
            These values are the same for everyone.
          </p>
          <DnsRecord
            type="MX"
            host="send"
            ttl="Auto"
            valueLabel="Value — copy this exactly"
            value="feedback-smtp.us-east-1.amazonses.com"
            priority="10"
          />
        </div>

        {/* Record 3 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[#7C69C7] text-xs font-bold">3</span>
            </div>
            <p className="text-[#FCF4EB] font-semibold">SPF Record (TXT)</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-[#FCF4EB]/40 font-medium">Same for everyone</span>
          </div>
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
            This is a second layer of verification. Also the same for everyone.
          </p>
          <DnsRecord
            type="TXT"
            host="send"
            ttl="Auto"
            valueLabel="Value — copy this exactly"
            value="v=spf1 include:amazonses.com ~all"
          />
        </div>

        <ProTip type="warning">
          Do not delete any of your existing DNS records (like the A and CNAME records from Vercel).
          You are adding 3 new records alongside the ones you already have.
        </ProTip>
      </StepCard>

      {/* Step 3 */}
      <StepCard number={3} title="Add the records in your registrar">
        <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
          Claude will give you step-by-step instructions for your specific registrar. If you need
          a refresher, click your registrar below for a walkthrough:
        </p>

        <div className="space-y-2 mb-6">
          {[
            {
              name: 'Porkbun',
              steps: 'Account > Domain Management > find your domain > DNS',
              link: 'https://kb.porkbun.com/article/54-how-to-edit-dns-records',
            },
            {
              name: 'GoDaddy',
              steps: 'My Products > Domains > click your domain > DNS > Manage',
              link: 'https://www.godaddy.com/help/manage-dns-records-680',
            },
            {
              name: 'Namecheap',
              steps: 'Domain List > Manage > Advanced DNS tab',
              link: 'https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/',
            },
            {
              name: 'Cloudflare',
              steps: 'Select your domain > DNS tab on the left',
              link: 'https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/',
            },
            {
              name: 'Wix',
              steps: 'Settings > Domains > click your domain > DNS Records',
              link: 'https://support.wix.com/en/article/managing-dns-records-in-your-wix-account',
            },
            {
              name: 'Squarespace Domains',
              steps: 'domains.squarespace.com > select domain > DNS tab',
              link: 'https://support.squarespace.com/hc/en-us/articles/213469948',
            },
            {
              name: 'Bluehost',
              steps: 'Domains > Zone Editor > select your domain',
              link: 'https://www.bluehost.com/help/article/dns-management-adding-or-editing-dns-entries',
            },
          ].map((r) => (
            <div key={r.name} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                <span className="text-[#FCF4EB] font-medium text-sm">{r.name}</span>
                <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] text-xs hover:underline whitespace-nowrap">
                  DNS walkthrough &rarr;
                </a>
              </div>
              <p className="text-[#FCF4EB]/50 text-xs leading-relaxed">{r.steps}</p>
            </div>
          ))}
        </div>

        <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
          For each record, you will fill in these fields in your registrar:
        </p>
        <ol className="space-y-3 text-[#FCF4EB]/70 text-sm list-decimal list-inside mb-4">
          <li><span className="text-[#FCF4EB] font-semibold">Type</span> — select TXT or MX from the dropdown</li>
          <li><span className="text-[#FCF4EB] font-semibold">Host / Name</span> — paste the host value (like <code className="bg-white/[0.06] px-1 py-0.5 rounded text-xs">resend._domainkey</code> or <code className="bg-white/[0.06] px-1 py-0.5 rounded text-xs">send</code>)</li>
          <li><span className="text-[#FCF4EB] font-semibold">Value / Answer</span> — paste the full value from the record card above</li>
          <li><span className="text-[#FCF4EB] font-semibold">TTL</span> — leave as Auto or set to 600</li>
          <li><span className="text-[#FCF4EB] font-semibold">Priority</span> — only needed for the MX record. Set it to <code className="bg-white/[0.06] px-1 py-0.5 rounded text-xs">10</code></li>
        </ol>
        <p className="text-[#FCF4EB]/70 text-sm">Click Save after each record. You should have 3 new records when you are done.</p>

        <ProTip type="info" className="mt-4">
          <span className="text-[#FCF4EB] font-semibold">Common mistake:</span> some registrars automatically
          append your domain to the Host field. If your registrar does this, enter just{' '}
          <code className="bg-white/[0.06] px-1 py-0.5 rounded text-xs">resend._domainkey</code> (not{' '}
          <code className="bg-white/[0.06] px-1 py-0.5 rounded text-xs">resend._domainkey.yourdomain.com</code>).
          The registrar adds the domain part for you.
        </ProTip>
      </StepCard>

      {/* Step 4 */}
      <StepCard number={4} title="Wait for verification (1 minute to a few hours)">
        <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
          DNS changes take time to spread across the internet. Usually 1 to 5 minutes, sometimes up to a few hours.
          You can ask Claude Code to check for you:
        </p>
        <CodeBlock
          filename="Paste into Claude Code"
          code={`Check if my domain is verified in Resend yet.`}
        />
        <p className="text-[#FCF4EB]/70 leading-relaxed mt-4 mb-4">
          You can also check yourself at{' '}
          <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">resend.com/domains</a>.
          Look for a green <span className="text-[#FCF4EB] font-semibold">Verified</span> badge next to your domain.
        </p>

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
          <p className="text-[#FCF4EB] font-semibold text-sm mb-2">Not verified after an hour?</p>
          <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-2">Ask Claude Code for help:</p>
          <CodeBlock
            filename="Paste into Claude Code"
            code={`My Resend domain verification is not working. Can you check what DNS records are currently set up for my domain and compare them to what Resend expects? Tell me what is wrong and how to fix it.`}
          />
        </div>
      </StepCard>

      {/* Step 5 */}
      <StepCard number={5} title="Update your email to send from your domain">
        <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
          Once verified, tell Claude Code to switch your email sender address:
        </p>
        <CodeBlock
          filename="Paste into Claude Code"
          editable
          code={`My domain is now verified in Resend. Update my welcome email to send from [YOUR NAME] <hello@[YOUR DOMAIN]> instead of onboarding@resend.dev. Then deploy to production.`}
        />
        <ProTip type="tip" className="mt-4">
          You can use any name and any address at your domain. Common choices:{' '}
          <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-xs">hello@</code>,{' '}
          <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-xs">joe@</code>, or{' '}
          <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-xs">team@</code>.
          You do not need to create a mailbox for this address. Resend sends on your behalf.
        </ProTip>
      </StepCard>

      {/* Step 6 */}
      <StepCard number={6} title="Test it with a real email">
        <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
          Make sure everything works end to end:
        </p>
        <ol className="space-y-3 text-[#FCF4EB]/70 list-decimal list-inside">
          <li>Go to your lead magnet page</li>
          <li>Submit the form with a <span className="text-[#FCF4EB] font-semibold">different email address</span> (not your Resend account email). Try a friend or family member&apos;s email, or a second email you own.</li>
          <li>Check that inbox. The email should arrive from <span className="text-[#FCF4EB] font-semibold">your domain</span>, not from <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">onboarding@resend.dev</code></li>
          <li>Make sure it lands in the <span className="text-[#FCF4EB] font-semibold">inbox</span>, not spam</li>
          <li>Check your{' '}
            <a href="https://supabase.com/dashboard/project/_/editor" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">
              Supabase Table Editor
            </a>{' '}
            to confirm the new subscriber row appeared
          </li>
        </ol>

        <div className="mt-6 bg-[#7C69C7]/[0.06] border border-[#7C69C7]/20 rounded-xl p-5">
          <p className="text-[#9D8FE0] text-xs font-semibold uppercase tracking-widest mb-2">You are done</p>
          <p className="text-[#FCF4EB]/70 text-sm leading-relaxed">
            Your lead magnet is fully functional. Anyone can sign up, and they will get an email
            from your own domain with your resource. Share your link and start collecting leads.
          </p>
        </div>
      </StepCard>

      {/* Already use another email service */}
      <div className="mt-12 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8">
        <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">Already Use Another Email Service?</p>
        <p className="text-[#FCF4EB]/70 text-sm leading-relaxed mb-4">
          If you already have an account with SendGrid, Brevo (formerly Sendinblue), Postmark, or another
          email provider, you can use that instead of Resend. The logic is the same. Just ask Claude Code:
        </p>
        <CodeBlock
          filename="Paste into Claude Code"
          editable
          code={`I want to use [SENDGRID / BREVO / POSTMARK] instead of Resend to send my lead magnet emails. My API key is [YOUR KEY]. Please swap out the Resend integration for [SERVICE NAME] and keep everything else the same.`}
        />
        <p className="text-[#FCF4EB]/50 text-xs mt-4 leading-relaxed">
          Claude will handle the code changes. You may still need to verify your domain in that
          service to avoid spam filters.
        </p>
      </div>

      {/* Back links */}
      <div className="mt-14 border-t border-white/[0.08] pt-8 flex flex-wrap gap-6">
        <Link
          href="/session/3/guide"
          className="inline-flex items-center gap-2 text-sm text-[#FCF4EB]/40 hover:text-[#7C69C7] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Session 3 Guide
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#FCF4EB]/40 hover:text-[#7C69C7] transition-colors"
        >
          All Sessions
        </Link>
      </div>
    </div>
    </>
  )
}
