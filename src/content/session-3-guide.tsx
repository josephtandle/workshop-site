import StepCard from '@/components/StepCard';
import CodeBlock from '@/components/CodeBlock';
import ProTip from '@/components/ProTip';

function DnsRecord({
  type,
  host,
  ttl,
  valueLabel,
  value,
}: {
  type: string;
  host: string;
  ttl: string;
  valueLabel: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.10] overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-white/[0.08] bg-white/[0.03]">
        <div className="px-4 py-3">
          <p className="text-[#FCF4EB]/40 text-[10px] uppercase tracking-widest mb-1.5 font-semibold">Type</p>
          <p className="text-[#FCF4EB] font-mono text-sm font-semibold">{type}</p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[#FCF4EB]/40 text-[10px] uppercase tracking-widest mb-1.5 font-semibold">Host</p>
          <p className="text-[#FCF4EB] font-mono text-sm font-semibold">{host}</p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[#FCF4EB]/40 text-[10px] uppercase tracking-widest mb-1.5 font-semibold">TTL</p>
          <p className="text-[#FCF4EB] font-mono text-sm font-semibold">{ttl}</p>
        </div>
      </div>
      <div className="border-t border-white/[0.08] px-4 pt-4 pb-1 bg-white/[0.02]">
        <p className="text-[#FCF4EB]/40 text-[10px] uppercase tracking-widest mb-1 font-semibold">
          {valueLabel}
        </p>
        <p className="text-[#FCF4EB]/60 text-xs mb-2">Copy this and paste it into the Value field</p>
        <CodeBlock code={value} />
      </div>
    </div>
  );
}

export default function Session3Guide() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">

      {/* Page Header */}
      <div className="mb-14">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Session Three
        </p>
        <h1 className="text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
          Custom Domains &amp; Lead Magnets
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-8">
          By the end of this session, you will have a custom domain pointing to your site, a live lead
          capture page, a real database storing your subscribers, and an automated email delivering your
          resource the moment someone signs up.
        </p>

        <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 border-t border-white/[0.08] pt-6 mb-8">
          <span><span className="text-[#FCF4EB]/30 mr-2">Duration</span>~90 minutes</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Difficulty</span>Beginner</span>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
          <p className="text-[#FCF4EB]/50 text-xs uppercase tracking-widest mb-4 font-semibold">In This Session</p>
          <ol className="space-y-2">
            <li><a href="#custom-domain" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Part A — Custom Domain Setup</a></li>
            <li><a href="#lead-magnet" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Part B — Build Your Lead Magnet Page</a></li>
            <li><a href="#supabase" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Part C — Set Up Supabase</a></li>
            <li><a href="#wire-up" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Part D — Wire It All Together</a></li>
            <li><a href="#bonus" className="text-[#7C69C7] hover:text-[#9D8FE0] transition-colors text-sm">Bonus — Send Emails from Your Own Domain</a></li>
          </ol>
        </div>
      </div>

      {/* Part A */}
      <section id="custom-domain" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part A</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Custom Domain Setup</h2>
        </div>

        <StepCard number={1} title="Buy a domain">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-4">
            Go to <a href="https://porkbun.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">porkbun.com</a> and search your business name.
          </p>
          <div className="space-y-3 mb-5">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-1">.com — the gold standard</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                This is what everyone recognizes. If your .com is available, get it. It signals you
                are serious and is the most trusted extension worldwide. Typical price: $9 to $12 per year.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-1">.co, .io, .business — solid alternatives</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                If your .com is taken, these are the next best options. Common in the startup world.
                Same price range as .com.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-[#7C69C7]/30 rounded-xl p-4" style={{ background: 'rgba(124, 105, 199, 0.06)' }}>
              <p className="text-[#7C69C7] font-semibold text-sm mb-1">.site or .xyz — just for testing today</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                If you want to learn the process without committing to a domain yet, grab a .site
                or .xyz for $1 to $2 per year. Perfect for a practice run. You can always buy your
                real .com later and point it to the same site.
              </p>
            </div>
          </div>
          <ol className="space-y-2 text-[#FCF4EB]/70 list-decimal list-inside">
            <li>Search your business name and pick your extension</li>
            <li>Complete checkout</li>
            <li>Turn on auto-renew so you do not lose it accidentally</li>
          </ol>
          <ProTip type="tip" className="mt-4">
            Don&apos;t overthink the domain. You can always buy a better one later. The point today is to learn the process.
          </ProTip>
        </StepCard>

        <StepCard number={2} title="Add your domain to Vercel">
          <ol className="space-y-2 text-[#FCF4EB]/70 list-decimal list-inside">
            <li>Go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">vercel.com</a> and open your project</li>
            <li>Click <span className="text-[#FCF4EB]">Settings</span> then <span className="text-[#FCF4EB]">Domains</span></li>
            <li>Click &ldquo;Add Domain&rdquo;</li>
            <li>Type your domain exactly (for example: <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-sm text-[#FCF4EB]">yourdomain.com</code>)</li>
            <li>Add <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-sm text-[#FCF4EB]">www.yourdomain.com</code> as well if prompted</li>
            <li>Vercel will show you the DNS records to add. Keep this tab open.</li>
          </ol>
        </StepCard>

        <StepCard number={3} title="Configure DNS on your registrar or web host">
          <p className="text-[#FCF4EB]/50 text-xs font-semibold uppercase tracking-widest mb-5">Porkbun Example</p>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-5">
            You need to add two DNS records: one that points your root domain to Vercel, and one that
            points the www version. Both use the same fixed values for every Vercel project.
          </p>
          <p className="text-[#FCF4EB]/70 font-medium mb-4">First, get to the DNS editor on Porkbun:</p>
          <ol className="space-y-2 text-[#FCF4EB]/70 list-decimal list-inside mb-6">
            <li>Sign in to <a href="https://porkbun.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">porkbun.com</a></li>
            <li>Click <span className="text-[#FCF4EB]">Account</span> in the top menu</li>
            <li>Click <span className="text-[#FCF4EB]">Domain Management</span></li>
            <li>Find your domain and click <span className="text-[#FCF4EB]">DNS</span> next to it</li>
            <li>Delete any existing records where the Host is <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-sm text-[#FCF4EB]">@</code> or <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-sm text-[#FCF4EB]">www</code></li>
          </ol>
          <p className="text-[#FCF4EB]/70 font-medium mb-4">Then add these two records:</p>
          <div className="space-y-5">
            <div>
              <p className="text-[#FCF4EB] font-semibold mb-3">Record 1 of 2 — A Record</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-4">
                In the &ldquo;Add Record&rdquo; form, set Type to <span className="text-[#FCF4EB]">A</span>, Host to{' '}
                <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-sm text-[#FCF4EB]">@</code> (the @ means your root domain), TTL to{' '}
                <span className="text-[#FCF4EB]">600</span>, then copy the value below into the Answer field:
              </p>
              <DnsRecord type="A" host="@" ttl="600" valueLabel="Value / Answer" value="76.76.21.21" />
            </div>
            <div>
              <p className="text-[#FCF4EB] font-semibold mb-3">Record 2 of 2 — CNAME Record</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-4">
                Add a second record. Set Type to <span className="text-[#FCF4EB]">CNAME</span>, Host to{' '}
                <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-sm text-[#FCF4EB]">www</code>, TTL to{' '}
                <span className="text-[#FCF4EB]">600</span>, then copy the value below:
              </p>
              <DnsRecord type="CNAME" host="www" ttl="600" valueLabel="Value / Answer" value="cname.vercel-dns.com" />
            </div>
          </div>
          <p className="text-[#FCF4EB]/70 mt-4">Click Save after each record.</p>
          <ProTip type="warning" className="mt-4">
            These DNS values are the same for every Vercel project. If your domain already points to
            a live website like Wix or Squarespace, changing these records will take that site offline.
            Use a fresh domain for practice if you have an active site.
          </ProTip>
        </StepCard>

        <StepCard number={4} title="Verify it is working">
          <ol className="space-y-2 text-[#FCF4EB]/70 list-decimal list-inside">
            <li>Go back to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">Vercel</a>. It will show a green checkmark once DNS is ready.</li>
            <li>This usually takes 1 to 5 minutes. In rare cases up to 48 hours.</li>
            <li>Visit your domain. You should see your site with a padlock in the address bar.</li>
          </ol>
          <ProTip type="info" className="mt-4">
            Not working after 10 minutes? Clear your browser cache or try an incognito window.
          </ProTip>
        </StepCard>
      </section>

      {/* Part B */}
      <section id="lead-magnet" className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part B</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Build Your Lead Magnet Page</h2>
        </div>
        <p className="text-[#FCF4EB]/70 leading-relaxed mb-8">
          A lead magnet is a free resource you give people in exchange for their email. We will build a
          page where someone enters their name and email and automatically receives your resource. All
          of this happens without you doing anything.
        </p>

        <StepCard number={5} title="Open your terminal and start Claude Code">
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-5">First, open your terminal:</p>
          <div className="space-y-3 mb-6">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-3">Mac</p>
              <ul className="space-y-2 text-[#FCF4EB]/70 text-sm">
                <li><span className="text-[#FCF4EB]">Shortcut:</span> Press <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-sm text-[#FCF4EB]">Cmd + Space</code>, type <span className="text-[#FCF4EB]">Terminal</span>, press Enter</li>
                <li><span className="text-[#FCF4EB]">Through Finder:</span> Applications &rarr; Utilities &rarr; Terminal</li>
              </ul>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-[#FCF4EB] font-semibold text-sm mb-3">Windows</p>
              <ul className="space-y-2 text-[#FCF4EB]/70 text-sm">
                <li><span className="text-[#FCF4EB]">Shortcut:</span> Press the <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-sm text-[#FCF4EB]">Windows key</code>, type <span className="text-[#FCF4EB]">Command Prompt</span>, press Enter</li>
                <li><span className="text-[#FCF4EB]">Through Start:</span> Start &rarr; All Apps &rarr; Windows Tools &rarr; Command Prompt</li>
              </ul>
            </div>
          </div>
          <p className="text-[#FCF4EB]/70 mb-3">Navigate to your project folder, then run:</p>
          <CodeBlock filename="Terminal" code={`claude --dangerously-skip-permissions`} />
          <ProTip type="warning" className="mt-2">
            The first time you open Claude Code in a new folder, it will ask if you want to{' '}
            <span className="text-[#FCF4EB] font-semibold">Trust this folder</span>. Click Yes or
            press Enter. Without this, Claude cannot run commands.
          </ProTip>
          <ProTip type="tip" className="mt-3">
            The <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-sm">--dangerously-skip-permissions</code> flag
            lets Claude run commands without asking for approval each time. Much faster for workshops.
            Only use it in your own project folder.
          </ProTip>
        </StepCard>

        <StepCard number={6} title="Tell Claude to build your lead magnet page">
          <p className="text-[#FCF4EB]/70 mb-2">
            Edit the prompt below directly — replace the text in brackets with your own details.
            When you are done, hit Copy and paste it into Claude Code.
          </p>
          <ProTip type="tip" className="mb-2">
            Click anywhere in the box below to edit it. Replace every line in brackets before copying.
          </ProTip>
          <CodeBlock
            filename="Paste into Claude Code"
            editable
            code={`Build a lead magnet landing page at /lead-magnet for my Next.js site.

My offer:
Headline: [YOUR HEADLINE — for example: "The 5-Step System to Get 10 New Clients This Month"]
Description: [2 SENTENCES about what they get and why it's valuable]
Resource name: [for example: "Free Checklist", "Quick-Start Guide", or "Video Training"]

The page should have:
- A form with two fields: First Name and Email
- A submit button that says "Get My Free [RESOURCE NAME]"
- A loading spinner while the form is submitting
- A success message: "Check your inbox! Your [RESOURCE NAME] is on its way."
- An error message: "Something went wrong. Please try again."
- The form should POST to /api/subscribe with the first name and email
- Mobile responsive
- Match the dark theme and style of the rest of the site`}
          />
        </StepCard>

      </section>

      {/* Part C */}
      <section id="supabase" className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part C</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Set Up Supabase</h2>
        </div>
        <p className="text-[#FCF4EB]/70 leading-relaxed mb-8">
          Supabase is a free tool that stores your subscriber data. When someone fills out your form,
          their name and email get saved here automatically. You can log in any time and see your whole list.
        </p>

        <StepCard number={7} title="Create your Supabase project">
          <ol className="space-y-2 text-[#FCF4EB]/70 list-decimal list-inside">
            <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">supabase.com/dashboard</a> and click <span className="text-[#FCF4EB]">New Project</span></li>
            <li>Give it a name like your business name or &ldquo;my-leads&rdquo;</li>
            <li>Set a password and save it somewhere</li>
            <li>Pick the region closest to you</li>
            <li>Click &ldquo;Create new project&rdquo; and wait about one minute</li>
          </ol>
        </StepCard>

        <StepCard number={8} title="Create your API keys and give them to Claude">
          <ol className="space-y-2 text-[#FCF4EB]/70 list-decimal list-inside mb-4">
            <li>In your Supabase project, click the gear icon and go to <a href="https://supabase.com/dashboard/project/_/settings/api" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">Settings &gt; API Keys</a></li>
            <li>Click <span className="text-[#FCF4EB] font-semibold">Create new API Keys</span></li>
            <li>Copy your <span className="text-[#FCF4EB] font-semibold">Project URL</span> (looks like https://abcdef.supabase.co)</li>
            <li>Copy the <span className="text-[#FCF4EB] font-semibold">Publishable key</span> (starts with <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-sm text-[#FCF4EB]">sb_publishable_</code>)</li>
            <li>Go to Claude Code in your terminal and paste this with your values filled in:</li>
          </ol>
          <CodeBlock
            filename="Paste into Claude Code"
            editable
            code={`My Supabase URL is [PASTE YOUR PROJECT URL HERE]
My Supabase publishable key is [PASTE YOUR PUBLISHABLE KEY HERE]
Please always remember these.`}
          />
          <ProTip type="warning" className="mt-4">
            You only need the <span className="text-[#FCF4EB] font-semibold">publishable key</span>.
            Do not copy the secret key. The publishable key is the safe one for your website to use.
          </ProTip>
        </StepCard>

        <StepCard number={9} title="Get your Resend key and give it to Claude">
          <ol className="space-y-2 text-[#FCF4EB]/70 list-decimal list-inside mb-4">
            <li>Go to <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">resend.com</a> and sign in (create a free account if you have not yet)</li>
            <li>Click <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">API Keys</a> in the left sidebar</li>
            <li>Click <span className="text-[#FCF4EB]">Create API Key</span>, give it a name like &ldquo;lead-magnet&rdquo;, and click Create</li>
            <li>Copy the key immediately, then go back to Claude Code and paste this:</li>
          </ol>
          <CodeBlock
            filename="Paste into Claude Code"
            editable
            code={`My Resend API key is [PASTE YOUR RESEND KEY HERE]
Please always remember this.`}
          />
          <ProTip type="warning" className="mt-4">
            Copy the key before closing the modal. If you lose it, delete it and create a new one.
          </ProTip>
        </StepCard>

        <StepCard number={10} title="Tell Claude to set up the form backend and subscriber database">
          <p className="text-[#FCF4EB]/70 mb-4">
            Now that Claude has your Supabase credentials, tell it to set up everything your lead magnet
            form needs to work on the server side:
          </p>
          <CodeBlock
            filename="Paste into Claude Code"
            code={`Set up the backend for my lead magnet form using my Supabase credentials.

1. Create a database table to store my email subscribers. It should save their first name, email, which lead magnet they signed up for, and the date.
2. The same person should be able to sign up for different lead magnets and get each email.
3. The same person should not be able to sign up for the same lead magnet twice.
4. Make sure my website is allowed to save data to the table.
5. Set up the server side so that when someone submits their name and email through the lead magnet form, it saves them to the database.
6. Make sure both fields are filled in before saving anything.
7. Return a success message when it works and an error message when it does not.`}
          />
          <ProTip type="info" className="mt-4">
            The &ldquo;different lead magnets&rdquo; setup means if someone signs up for your free checklist
            today and your video training next week, they will get both emails. No duplicates, no
            missed deliveries.
          </ProTip>
        </StepCard>
      </section>

      {/* Part D */}
      <section id="wire-up" className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part D</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Wire It All Together</h2>
        </div>
        <p className="text-[#FCF4EB]/70 leading-relaxed mb-8">
          Claude has all your credentials. Now give it one command to connect everything, then
          two more to push it live.
        </p>

        <StepCard number={11} title="Tell Claude to set up the full integration">
          <CodeBlock
            filename="Paste into Claude Code"
            editable
            code={`Using my Supabase and Resend credentials, set up my email capture:

1. Install @supabase/supabase-js and resend
2. Create a .env.local file with all three keys
3. Update my /api/subscribe route to:
   - Save the subscriber's first name, email, and which lead magnet they signed up for
   - Send them the right welcome email through Resend
   - Greet them by first name in the email
   - Include a download button linking to [YOUR RESOURCE URL]
   - If they sign up for the same lead magnet twice, show success but do not email again
   - If they sign up for a different lead magnet later, send that email too`}
          />
        </StepCard>

        <StepCard number={12} title="Tell Claude to add your keys to Vercel">
          <p className="text-[#FCF4EB]/70 mb-4">
            Claude can add your environment variables to Vercel directly:
          </p>
          <CodeBlock
            filename="Paste into Claude Code"
            code={`Add my Supabase and Resend environment variables to my Vercel project.`}
          />
        </StepCard>

        <StepCard number={13} title="Tell Claude to deploy">
          <CodeBlock
            filename="Paste into Claude Code"
            code={`Deploy my website to production.`}
          />
          <ol className="mt-4 space-y-2 text-[#FCF4EB]/70 list-decimal list-inside">
            <li>Once deployed, visit your live site on your custom domain</li>
            <li>Submit the form with a real email address</li>
            <li>
              Confirm: a new row appears in the{' '}
              <a href="https://supabase.com/dashboard/project/_/editor" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">
                Supabase Table Editor
              </a>{' '}
              and an email lands in your inbox
            </li>
          </ol>
        </StepCard>
      </section>

      {/* Wrap-up */}
      <section className="mb-16">
        <div className="border-t border-white/[0.08] pt-12">
          <h2 className="text-2xl font-bold text-[#FCF4EB] mb-4">You just built something real.</h2>
          <p className="text-[#FCF4EB]/70 leading-relaxed mb-10">
            You have a custom domain, a live lead capture page, a real database, and automated email
            delivery. This is the foundation of every serious online business.
          </p>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 mb-8">
            <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">Support Each Other</p>
            <h3 className="text-xl font-bold text-[#FCF4EB] mb-3">Post in the Masterminds group</h3>
            <p className="text-[#FCF4EB]/70 leading-relaxed mb-6">
              Share your lead magnet link in the group and ask people to sign up and open your email.
              Every open counts toward your open rate, and a healthy open rate makes your list more
              valuable to every platform you ever send from.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#7C69C7] text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Join each other&apos;s email lists</p>
                  <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                    Find every lead magnet link posted in the group and sign up for all of them. Your
                    subscriber count goes up, theirs does too.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#7C69C7]/20 border border-[#7C69C7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#7C69C7] text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-[#FCF4EB] font-semibold text-sm mb-1">Reply to the welcome emails you receive</p>
                  <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                    Even a short reply like &ldquo;got it, looks great!&rdquo; tells email providers this is a
                    real conversation. It boosts the sender&apos;s deliverability for everyone they email from now on.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#7C69C7]/50 bg-[#7C69C7]/[0.08] rounded-xl p-6">
            <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-3">Challenge</p>
            <p className="text-[#FCF4EB]/80 leading-relaxed">
              Customize your welcome email with your own branding and tone, then get at least 5
              signups from real people before the next session.
            </p>
          </div>
        </div>
      </section>

      {/* Bonus */}
      <section id="bonus">
        <div className="border-t border-white/[0.08] pt-16">

          {/* Bonus hero header */}
          <div
            className="rounded-2xl p-8 mb-10"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 195, 198, 0.14) 0%, rgba(124, 105, 199, 0.10) 100%)',
              border: '1px solid rgba(245, 195, 198, 0.22)',
            }}
          >
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
              style={{ background: 'rgba(245, 195, 198, 0.18)', color: '#F5C3C6', border: '1px solid rgba(245, 195, 198, 0.30)' }}
            >
              Bonus
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#FCF4EB] leading-tight mb-3">
              Send Emails from<br />Your Own Domain
            </h2>
            <p className="text-[#FCF4EB]/50 text-base">
              Free on all Resend plans, including the free tier. No extra cost.
            </p>
          </div>

          <p className="text-[#FCF4EB]/70 leading-relaxed mb-8">
            Right now your emails come from <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-sm">onboarding@resend.dev</code>.
            With a few extra DNS records you can send from your own address like{' '}
            <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-sm">hello@yourdomain.com</code>.
            This looks far more professional and improves your deliverability. About 10 minutes and completely free.
          </p>

          <div className="space-y-4">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
              <p className="text-[#FCF4EB] font-semibold mb-2">Step 1 — Add your domain to Resend</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                Go to <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:underline">Resend &gt; Domains</a> and
                click <span className="text-[#FCF4EB]">Add Domain</span>. Enter your domain name and click Add.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
              <p className="text-[#FCF4EB] font-semibold mb-2">Step 2 — Add the DNS records Resend gives you</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">
                Resend will show you 3 to 4 DNS records (similar to what you did for Vercel). Go back
                to your registrar and add each one. These prove to email providers you own the domain.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
              <p className="text-[#FCF4EB] font-semibold mb-2">Step 3 — Tell Claude to update your from address</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
                Once Resend shows a green Verified badge, go to Claude Code and paste this:
              </p>
              <CodeBlock
                filename="Paste into Claude Code"
                editable
                code={`Update my welcome email to send from [YOUR NAME] <hello@yourdomain.com> instead of onboarding@resend.dev.`}
              />
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
              <p className="text-[#FCF4EB] font-semibold mb-2">Step 4 — Tell Claude Code to deploy</p>
              <p className="text-[#FCF4EB]/60 text-sm leading-relaxed mb-3">
                Once Claude has updated the code, tell it:
              </p>
              <CodeBlock
                filename="Paste into Claude Code"
                code={`Deploy my website to production.`}
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
