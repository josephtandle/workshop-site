import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'
import ScreenshotCard from '@/components/ScreenshotCard'

export const metadata = {
  title: 'Granting Access to Google Ads',
  description:
    'A step-by-step guide for inviting an agency or team member to manage your Google Ads account at the Admin level — you stay the owner and can revoke access anytime.',
}

export default function GoogleAdsAccessPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* Page header */}
      <div className="mb-14">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Resource Vault
        </p>
        <h1 className="gradient-text text-4xl font-extrabold leading-tight mb-5 pb-1">
          Granting Access to Google Ads
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-8">
          This guide walks you through inviting an agency or team member to manage your Google Ads
          account. It is simpler than it sounds. Your account stays yours, you keep full ownership,
          and you can revoke access anytime.
        </p>
        <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 border-t border-white/[0.08] pt-6">
          <span><span className="text-[#FCF4EB]/30 mr-2">Duration</span>~3&ndash;5 minutes</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Difficulty</span>Beginner</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Works best on</span>Desktop</span>
        </div>
      </div>

      <ScreenshotCard
        src="/screenshots/google-ads-access/hero.png"
        alt="Google Ads"
        caption="Access is managed from the Admin → Access and security area of Google Ads."
      />

      {/* Before you start */}
      <ProTip type="info" title="Before you start">
        <p>Make sure you have:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><span className="text-[#FCF4EB]/90 font-medium">Admin access</span> to your Google Ads account</li>
          <li><span className="text-[#FCF4EB]/90 font-medium">A desktop computer</span> (this works best on desktop, not mobile)</li>
          <li>The <span className="text-[#FCF4EB]/90 font-medium">email address</span> associated with your Google Ads account</li>
          <li>The <span className="text-[#FCF4EB]/90 font-medium">email addresses</span> of the people you are inviting</li>
        </ul>
        <p className="mt-2">
          Not sure if you have admin access? Look for <span className="text-[#FCF4EB]/90 font-medium">&quot;Admin&quot;</span> in
          your account. If you can see it, you&apos;re good to go.
        </p>
      </ProTip>

      {/* Why this access */}
      <section className="my-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Context</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Why this access is needed</h2>
        </div>
        <p className="text-[#FCF4EB]/70 text-sm leading-relaxed mb-3">
          You are giving the agency permission to manage your Google Ads account. This lets their team:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#FCF4EB]/70">
          <li>Create and optimize ad campaigns for you</li>
          <li>Monitor performance and make improvements</li>
          <li>Generate reports on your ad results</li>
          <li>Handle technical setup and troubleshooting</li>
          <li>Manage billing and budgets efficiently</li>
        </ul>
        <ProTip type="tip">
          Your account stays yours. You maintain full ownership and can revoke access anytime &mdash;
          you are only giving permission to work on your behalf.
        </ProTip>
      </section>

      {/* Part A — the steps */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part A</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Invite the team and set access</h2>
        </div>

        <StepCard number={1} title="Sign in to Google Ads">
          <p>Let&apos;s get started:</p>
          <ol className="list-decimal pl-5 space-y-1.5 mt-1">
            <li>Go to <span className="font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">ads.google.com</span> in your web browser</li>
            <li>Sign in with your Google account credentials</li>
            <li>Make sure you are in the correct Google Ads account (check the account name / email in the top-left corner)</li>
          </ol>
          <ProTip type="tip">
            Have multiple accounts? Click the account name in the top-left and select the account you
            want the agency to manage.
          </ProTip>
        </StepCard>

        <StepCard number={2} title="Navigate to Admin settings">
          <p>Find the access management area:</p>
          <ol className="list-decimal pl-5 space-y-1.5 mt-1">
            <li>Click the <span className="text-[#FCF4EB]/90 font-medium">Admin</span> icon (wrench <span aria-hidden>🔧</span>) in the bottom-left corner</li>
            <li>Click <span className="text-[#FCF4EB]/90 font-medium">&quot;Access and security&quot;</span></li>
          </ol>
          <ProTip type="info" title="Older Google Ads layout?">
            If you don&apos;t see Admin in the bottom-left, look for the <span className="text-[#FCF4EB]/90 font-medium">&quot;Tools &amp; Settings&quot;</span> wrench
            icon in the top-right corner instead, then under the <span className="text-[#FCF4EB]/90 font-medium">&quot;Setup&quot;</span> column
            click <span className="text-[#FCF4EB]/90 font-medium">&quot;Access and security.&quot;</span>
          </ProTip>
        </StepCard>

        <StepCard number={3} title="Open the invite form">
          <p>Time to invite the team:</p>
          <ol className="list-decimal pl-5 space-y-1.5 mt-1">
            <li>Click the blue <span className="text-[#FCF4EB]/90 font-medium">&quot;+&quot;</span> (plus) button</li>
            <li>You&apos;ll see fields for <span className="text-[#FCF4EB]/90 font-medium">Email</span> and <span className="text-[#FCF4EB]/90 font-medium">Access level</span></li>
          </ol>
        </StepCard>

        <StepCard number={4} title="Enter the team's email addresses">
          <p>Add each person you want to grant access to. Enter the email the agency gave you:</p>
          <CodeBlock
            editable
            filename="Emails to invite (use the ones the agency gave you)"
            code={`teammate1@youragency.com
teammate2@youragency.com`}
          />
          <ProTip type="tip">
            You can add both emails at once by separating them with a comma, or add them one at a time.
            If you want a temporary invite, set an expiry under &quot;Access Expires&quot; &mdash; most
            agencies ask for at least 72 hours when doing an audit.
          </ProTip>
        </StepCard>

        <StepCard number={5} title="Set the access level to Admin">
          <p>
            After entering the email addresses, you&apos;ll see an access level option (a checkbox set
            in the newer layout, or an <span className="text-[#FCF4EB]/90 font-medium">&quot;Access level&quot;</span> dropdown
            in the older one). Select:
          </p>
          <p className="text-[#FCF4EB]/90 font-medium">Admin <span aria-hidden>✨</span></p>
          <ProTip type="info" title="Why Admin access?">
            Admin lets the agency create and edit campaigns, manage budgets and billing, access all
            performance data, make quick optimizations without delays, add tracking codes and
            integrations, and invite other team members if needed. This is the recommended level for
            full-service management.
          </ProTip>
        </StepCard>

        <StepCard number={6} title="Send the invitation">
          <p>Final step. Double-check everything:</p>
          <ul className="list-none space-y-1.5 mt-1">
            <li>✓ Both email addresses entered correctly</li>
            <li>✓ Access level set to &quot;Admin&quot;</li>
          </ul>
          <p>
            Click the blue <span className="text-[#FCF4EB]/90 font-medium">&quot;Send invitation&quot;</span> button.
            You should see a confirmation like &quot;Invite pending&quot; or &quot;Invitation sent.&quot;
          </p>
          <ProTip type="tip">
            <span aria-hidden>🎉</span> Done! You&apos;ve successfully sent the access invitations.
          </ProTip>
        </StepCard>
      </section>

      {/* Part B — after */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part B</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">After you send the invitation</h2>
        </div>

        <StepCard number={7} title="What happens next">
          <ul className="list-none space-y-2">
            <li><span aria-hidden>⏰</span> <span className="text-[#FCF4EB]/90 font-medium">Within 24 hours</span> &mdash; the agency accepts your invitations and you get a confirmation email from Google.</li>
            <li><span aria-hidden>📧</span> <span className="text-[#FCF4EB]/90 font-medium">Within 48 hours</span> &mdash; they confirm everything is set up.</li>
            <li><span aria-hidden>🚀</span> <span className="text-[#FCF4EB]/90 font-medium">From there</span> &mdash; they begin working on your campaigns, according to your project timeline.</li>
          </ul>
          <ProTip type="info">
            You&apos;ll receive emails from Google when each invitation is accepted. This is normal and
            means everything worked correctly.
          </ProTip>
        </StepCard>

        <StepCard number={8} title="Verify the connection worked">
          <p>Want to double-check? Here&apos;s how:</p>
          <ol className="list-decimal pl-5 space-y-1.5 mt-1">
            <li>Go back to <span className="text-[#FCF4EB]/90 font-medium">Admin &gt; Access and security</span></li>
            <li>You should see both invited email addresses listed</li>
            <li>Their access level should show <span className="text-[#FCF4EB]/90 font-medium">&quot;Admin&quot;</span></li>
            <li>Status should show <span className="text-[#FCF4EB]/90 font-medium">&quot;Active&quot;</span> once they accept</li>
          </ol>
          <ProTip type="tip">
            Status still says &quot;Pending&quot;? They haven&apos;t accepted yet &mdash; give it 24
            hours. If it&apos;s still pending after 48 hours, reach out to them.
          </ProTip>
        </StepCard>
      </section>

      {/* Troubleshooting */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Help</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Troubleshooting common issues</h2>
        </div>

        <ProTip type="warning" title='"Email address is already associated with this account"'>
          That means they already have access. Check your current users list under Access and security.
        </ProTip>

        <ProTip type="warning" title='"You don&apos;t have permission to invite users"'>
          You need Admin access yourself. Ask the account owner to either grant you admin rights or
          complete this process themselves.
        </ProTip>

        <ProTip type="warning" title='"Can&apos;t find Admin"'>
          Look for the wrench icon (<span aria-hidden>🔧</span>) &mdash; it&apos;s in the bottom-left in
          the newer layout, or the very top-right next to your profile picture in the older one.
        </ProTip>

        <ProTip type="warning" title='"Invalid email address"'>
          Double-check for typos. Make sure the email domain is spelled exactly right with no extra or
          missing characters.
        </ProTip>

        <ProTip type="warning" title='"Domain not allowed"'>
          In the same Access &amp; Security tab, go to <span className="text-[#FCF4EB]/90 font-medium">Security &rarr; Allowed Domain</span> and
          add the agency&apos;s email domain (for example <span className="font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">youragency.com</span>) as
          an allowed domain, then retry.
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
            If you get stuck at any point, reach out to the agency or team you are inviting. When you
            contact them, it helps to include:
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
