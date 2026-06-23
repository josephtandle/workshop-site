import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'
import ScreenshotCard from '@/components/ScreenshotCard'

export const metadata = {
  title: 'Granting Someone Else Access to Your Meta Ads Manager',
  description:
    'A step-by-step guide for giving an agency or team member permission to manage your Meta (Facebook & Instagram) ads through Business Settings — without handing over your login.',
}

export default function MetaAdsAccessPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* Page header */}
      <div className="mb-14">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Resource Vault
        </p>
        <h1 className="gradient-text text-4xl font-extrabold leading-tight mb-5 pb-1">
          Granting Someone Else Access to Your Meta Ads Manager
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-8">
          This guide walks you through giving an agency or team member permission to manage your
          Meta Ads. Don&apos;t worry, it is simpler than it sounds. You stay the owner the whole
          time, and you can remove access whenever you want.
        </p>
        <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 border-t border-white/[0.08] pt-6">
          <span><span className="text-[#FCF4EB]/30 mr-2">Duration</span>~5&ndash;10 minutes</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Difficulty</span>Beginner</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Works best on</span>Desktop</span>
        </div>
      </div>

      <ScreenshotCard
        src="/screenshots/meta-ads-access/hero.png"
        alt="Meta Ads Manager"
        caption="Granting partner access happens inside Meta Business Settings."
      />

      {/* Before you start */}
      <ProTip type="info" title="Before you start">
        <p>Make sure you have:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><span className="text-[#FCF4EB]/90 font-medium">Admin access</span> to your Meta Business Suite</li>
          <li><span className="text-[#FCF4EB]/90 font-medium">A desktop computer</span> (this works best on desktop, not mobile)</li>
          <li><span className="text-[#FCF4EB]/90 font-medium">Access</span> to your Meta Ads Manager account</li>
          <li>The <span className="text-[#FCF4EB]/90 font-medium">Business Portfolio ID</span> of the agency or person you are granting access to</li>
        </ul>
      </ProTip>

      {/* Why this access */}
      <section className="my-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Context</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Why this access is needed</h2>
        </div>
        <p className="text-[#FCF4EB]/70 text-sm leading-relaxed mb-3">
          You are giving the agency permission to manage your Meta advertising account. This lets their
          team:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#FCF4EB]/70">
          <li>Create and optimize ad campaigns for you</li>
          <li>Monitor performance and make improvements</li>
          <li>Generate reports on your ad results</li>
          <li>Handle technical setup and troubleshooting</li>
        </ul>
        <ProTip type="tip">
          You stay the owner of everything. You are only granting permission to work on your behalf,
          and you can revoke access at any time from the same Partners screen.
        </ProTip>
      </section>

      {/* Part A — the steps */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part A</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Grant partner access</h2>
        </div>

        <StepCard number={1} title="Open Meta Business Suite">
          <p>Let&apos;s get started:</p>
          <ol className="list-decimal pl-5 space-y-1.5 mt-1">
            <li>Navigate to <span className="font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">business.facebook.com</span></li>
            <li>Log in with your Facebook / Instagram credentials</li>
            <li>Make sure you are in the correct Business Account (check the top-left corner)</li>
          </ol>
          <p>Once you are inside, it should look like the screenshot below.</p>
          <ScreenshotCard
            src="/screenshots/meta-ads-access/step1-business-suite.png"
            alt="Meta Business Suite home screen after logging in"
          />
        </StepCard>

        <StepCard number={2} title="Navigate to Business Settings">
          <p>Find the settings menu:</p>
          <p>
            Click the gear icon <span aria-hidden>⚙️</span> in the bottom-left corner of your screen.
          </p>
          <ScreenshotCard
            src="/screenshots/meta-ads-access/step2-business-settings.png"
            alt="The gear icon that opens Business Settings"
          />
        </StepCard>

        <StepCard number={3} title="Go to the Partners section">
          <p>Almost there:</p>
          <ol className="list-decimal pl-5 space-y-1.5 mt-1">
            <li>In the left sidebar, look for the <span className="text-[#FCF4EB]/90 font-medium">&quot;Users&quot;</span> section</li>
            <li>Click on <span className="text-[#FCF4EB]/90 font-medium">&quot;Partners&quot;</span></li>
            <li>You&apos;ll see a list of any existing partners (or it might be empty &mdash; that&apos;s okay!)</li>
          </ol>
          <ScreenshotCard
            src="/screenshots/meta-ads-access/step3-partners.png"
            alt="The Partners section under Users in Business Settings"
          />
        </StepCard>

        <StepCard number={4} title="Add the agency as a partner">
          <p>Time to connect them:</p>
          <ol className="list-decimal pl-5 space-y-1.5 mt-1">
            <li>Click the blue <span className="text-[#FCF4EB]/90 font-medium">&quot;Add&quot;</span> button (usually in the middle / top-right)</li>
            <li>Select <span className="text-[#FCF4EB]/90 font-medium">&quot;Give a partner access to your assets&quot;</span></li>
            <li>A popup will appear asking for a <span className="text-[#FCF4EB]/90 font-medium">Business Portfolio ID</span> &mdash; enter the ID the agency gave you</li>
          </ol>
          <CodeBlock
            editable
            filename="Business Portfolio ID (paste the one the agency gave you)"
            code={`[BUSINESS-PORTFOLIO-ID]`}
          />
          <ProTip type="tip">
            The Business Portfolio ID is a long string of numbers with no spaces or dashes. Ask whoever
            you are granting access to for their exact ID and paste it in as-is.
          </ProTip>
        </StepCard>

        <StepCard number={5} title="Select your ad account and assets">
          <p>Choose what they will manage:</p>
          <ol className="list-decimal pl-5 space-y-1.5 mt-1">
            <li>You&apos;ll see a list of all your assets (Ad Accounts, Pages, etc.)</li>
            <li>Find the section labeled <span className="text-[#FCF4EB]/90 font-medium">&quot;Ad Accounts&quot;</span></li>
            <li>Check the box next to the ad account(s) you want them to manage</li>
            <li>Do the same for Facebook Pages, Pixels, Instagram Accounts, Custom Conversions, and Datasets</li>
            <li>If you have multiple ad accounts, select all the ones you agreed on</li>
          </ol>
          <ScreenshotCard
            src="/screenshots/meta-ads-access/step5-select-assets.png"
            alt="Selecting ad accounts and assets to share with the partner"
          />
        </StepCard>

        <StepCard number={6} title="Choose the access level">
          <p>
            You&apos;ll assign permissions for each asset type (Facebook Pages, Ad Accounts, Instagram,
            Pixels, etc.). There are two tiers:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-1">
            <li><span className="text-[#FCF4EB]/90 font-medium">Partial Access</span> &mdash; they can do basic work but may need to ask you for things.</li>
            <li><span className="text-[#FCF4EB]/90 font-medium">Full Control</span> &mdash; they can handle everything independently: faster turnarounds, fewer interruptions.</li>
          </ul>
          <ProTip type="tip" title="Recommended">
            Grant <span className="text-[#FCF4EB]/90 font-medium">Full Control</span> for Ad Accounts,
            Pixels, and Datasets so campaigns can be optimized and issues fixed without delays. For
            Pages and Instagram accounts, choose what you are comfortable with &mdash; access to
            insights and content is usually the minimum that is helpful.
          </ProTip>
          <p>
            Think of it like hiring a contractor: Partial Access means you supervise each step, Full
            Control means you trust them to complete the job and check in on results. You can always
            adjust these later.
          </p>
        </StepCard>

        <StepCard number={7} title="Confirm and send the request">
          <p>Final step. Review your selections:</p>
          <ul className="list-none space-y-1.5 mt-1">
            <li>✓ Business Portfolio ID entered correctly</li>
            <li>✓ Ad account(s) selected</li>
            <li>✓ Access level chosen</li>
          </ul>
          <p>
            Click <span className="text-[#FCF4EB]/90 font-medium">&quot;Send Request&quot;</span> or{' '}
            <span className="text-[#FCF4EB]/90 font-medium">&quot;Assign Assets&quot;</span>. You should
            see a success message like &quot;Partner request sent.&quot;
          </p>
        </StepCard>
      </section>

      {/* Part B — after */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part B</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">After you send the request</h2>
        </div>

        <StepCard number={8} title="What happens next">
          <ul className="list-none space-y-2">
            <li><span aria-hidden>⏰</span> <span className="text-[#FCF4EB]/90 font-medium">Promptly</span> &mdash; the agency accepts your request and you get a notification from Meta.</li>
            <li><span aria-hidden>📧</span> <span className="text-[#FCF4EB]/90 font-medium">Within 24&ndash;48 hours</span> &mdash; they get into the account and audit it to find the next best steps.</li>
            <li><span aria-hidden>🚀</span> <span className="text-[#FCF4EB]/90 font-medium">From there</span> &mdash; they begin working on your campaigns or whatever the agreed scope of work looks like.</li>
          </ul>
        </StepCard>

        <StepCard number={9} title="Verify the connection worked">
          <p>Want to double-check? Here&apos;s how:</p>
          <ol className="list-decimal pl-5 space-y-1.5 mt-1">
            <li>Go back to <span className="text-[#FCF4EB]/90 font-medium">Business Settings &gt; Partners</span></li>
            <li>You should see the agency listed as a partner</li>
            <li>Click their name to see which assets they have access to</li>
            <li>The status should show <span className="text-[#FCF4EB]/90 font-medium">&quot;Active&quot;</span> &mdash; if it says &quot;Pending,&quot; they haven&apos;t accepted yet</li>
          </ol>
        </StepCard>
      </section>

      {/* Troubleshooting */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Help</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Troubleshooting common issues</h2>
        </div>

        <ProTip type="warning" title='"Business Portfolio ID not found"'>
          Double-check that you entered the ID exactly as the agency gave it to you &mdash; no spaces
          and no dashes. One wrong digit will cause this error.
        </ProTip>

        <ProTip type="warning" title='"You don&apos;t have permission to add partners"'>
          You need Admin access. Ask the account owner to either grant you admin rights or complete
          this process themselves.
        </ProTip>
      </section>

      {/* Need help */}
      <section>
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(124, 105, 199, 0.14) 0%, rgba(245, 195, 198, 0.10) 100%)',
            border: '1px solid rgba(124, 105, 199, 0.22)',
          }}
        >
          <p className="text-[#7C69C7] text-xs font-semibold uppercase tracking-widest mb-4">
            Need help?
          </p>
          <p className="text-[#FCF4EB]/75 text-sm leading-relaxed mb-3">
            If you get stuck at any point, reach out to the agency or team you are granting access to.
            When you contact them, it helps to include:
          </p>
          <ul className="space-y-2 text-[#FCF4EB]/75 text-sm leading-relaxed list-disc pl-5">
            <li>Which step you are on</li>
            <li>What error message you are seeing (if any)</li>
            <li>A screenshot, if possible</li>
          </ul>
        </div>
      </section>

    </main>
  )
}
