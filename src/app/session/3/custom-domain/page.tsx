import StepCard from '@/components/StepCard'
import ProTip from '@/components/ProTip'
import Link from 'next/link'
import CodeBlock from '@/components/CodeBlock'

export const metadata = {
  title: 'Add a Custom Domain to Vercel — Masterminds Workshop',
  description: 'Buy a domain, connect it to Vercel, and configure DNS so your site is live at your own address.',
}

function DnsRecord({
  type,
  host,
  ttl,
  valueLabel,
  value,
}: {
  type: string
  host: string
  ttl: string
  valueLabel: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-white/[0.10] overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-white/[0.08] bg-white/[0.03]">
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
      </div>
      <div className="border-t border-white/[0.08] px-4 pt-4 pb-1 bg-white/[0.02]">
        <p className="text-[#FCF4EB]/40 text-[10px] uppercase tracking-widest mb-1 font-semibold">
          {valueLabel}
        </p>
        <p className="text-[#FCF4EB]/60 text-xs mb-2">Copy this and paste it into the Value field</p>
        <CodeBlock code={value} />
      </div>
    </div>
  )
}

export default function CustomDomainPage() {
  return (
    <>
    <div className="max-w-3xl mx-auto px-6 py-16 pb-0">

      {/* Breadcrumb */}
      <nav className="mb-10 text-sm text-[#FCF4EB]/40 flex items-center gap-2">
        <Link href="/" className="hover:text-[#7C69C7] transition-colors">All Sessions</Link>
        <span>/</span>
        <Link href="/session/3" className="hover:text-[#7C69C7] transition-colors">Session 3</Link>
        <span>/</span>
        <span className="text-[#FCF4EB]/60">Custom Domain</span>
      </nav>

      {/* Page Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Session 3</span>
        </div>
        <h1 className="text-4xl font-bold text-[#FCF4EB] leading-tight mb-5">
          Add a Custom Domain to Vercel
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed">
          Buy a domain name, connect it to your Vercel project, and configure DNS so your site lives
          at your own address instead of a Vercel subdomain. About 15 minutes.
        </p>
      </div>

    </div>

    <div className="max-w-3xl mx-auto px-6 pb-16">

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

      <StepCard number={3} title="Configure DNS on your registrar">
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

      {/* Back links */}
      <div className="mt-14 border-t border-white/[0.08] pt-8 flex flex-wrap gap-6">
        <Link
          href="/session/3"
          className="inline-flex items-center gap-2 text-sm text-[#FCF4EB]/40 hover:text-[#7C69C7] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Session 3
        </Link>
        <Link
          href="/session/3/guide"
          className="inline-flex items-center gap-2 text-sm text-[#FCF4EB]/40 hover:text-[#7C69C7] transition-colors"
        >
          Session 3 Workshop Guide
        </Link>
      </div>

    </div>
    </>
  )
}
