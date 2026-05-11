import Link from 'next/link'
import StepCard from '@/components/StepCard'
import CodeBlock from '@/components/CodeBlock'
import ProTip from '@/components/ProTip'
import ScreenshotCard from '@/components/ScreenshotCard'

export const metadata = {
  title: 'Connecting to Xero',
  description:
    'Connect Claude Code to Xero using the simplest path, verify the API, feed sample data in the right format, and prove the connection works.',
}

export default function ConnectingToXeroPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-14">
        <p className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest mb-3">
          Resource Vault
        </p>
        <h1 className="gradient-text text-4xl font-extrabold leading-tight mb-5 pb-1">
          Connecting to Xero
        </h1>
        <p className="text-[#FCF4EB]/70 text-lg leading-relaxed mb-8">
          This guide is designed for non-technical operators who want to connect Claude Code to Xero,
          test the API, send a sample payload, and prove the integration works.
        </p>
        <div className="flex flex-wrap gap-6 text-sm text-[#FCF4EB]/50 border-t border-white/[0.08] pt-6">
          <span><span className="text-[#FCF4EB]/30 mr-2">Platform</span>Xero API</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">For</span>Anyone using Claude Code or Codex</span>
          <span><span className="text-[#FCF4EB]/30 mr-2">Goal</span>Connect, test, and send sample data</span>
        </div>
      </div>

      <details className="mb-12 rounded-2xl overflow-hidden border border-white/[0.10] bg-[linear-gradient(145deg,rgba(124,105,199,0.07),rgba(255,255,255,0.03))] shadow-[0_8px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.07)]">
        <summary className="flex items-center justify-between px-6 py-5 cursor-pointer select-none">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#9D8FE0] shadow-[0_0_12px_rgba(157,143,224,0.70)]" />
            <span className="text-xs uppercase tracking-[0.20em] text-[#FCF4EB]/65 font-semibold">Table of Contents</span>
          </div>
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(124,105,199,0.15)] border border-[rgba(124,105,199,0.28)] text-[#9D8FE0]">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </summary>

        <div className="border-t border-white/[0.07] mx-5" />

        <ol className="px-6 py-5 space-y-3">
          {[
            { href: '#setup', label: 'Start Here — Claude Dangerously Skip Permissions' },
            { href: '#part-a', label: 'Part A — Use a Xero Custom Connection' },
            { href: '#part-b', label: 'Part B — Create the Xero app with maximum scopes' },
            { href: '#part-c', label: 'Part C — Verify the API with a read test' },
            { href: '#part-d', label: 'Part D — Data format and sample write payloads' },
            { href: '#part-e', label: 'Part E — Prompt kits to prove the connection works' },
          ].map((item, index) => (
            <li key={item.href}>
              <a href={item.href} className="group flex items-start gap-3 text-sm text-[#FCF4EB]/72 hover:text-[#FCF4EB] transition-colors">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-[rgba(124,105,199,0.32)] bg-[rgba(124,105,199,0.12)] text-[11px] font-semibold text-[#9D8FE0] group-hover:bg-[rgba(124,105,199,0.18)]">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{item.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </details>

      <section id="setup" className="mb-16">
        <div className="mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Start Here</span>
          <h2 className="text-3xl font-bold text-[#FCF4EB] mt-3">Claude Dangerously Skip Permissions</h2>
        </div>

        <StepCard number={1} title="Start Claude in the open terminal first">
          <p>
            Start here before touching Xero, Mercury, Deel, or any finance prompt. This keeps the rest
            of the guide consistent and gives you the easiest copy-paste path.
          </p>
          <CodeBlock filename="Terminal" code="claude --dangerously-skip-permissions" />
          <ProTip type="tip">
            Prompt blocks on this page include the normal Claude copy plus a Codex-ready copy variant.
            The Codex button rewrites Claude wording automatically so the same workflow still works there.
          </ProTip>
        </StepCard>
      </section>

      <section id="part-a" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part A</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Use a Xero Custom Connection</h2>
        </div>

        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(124, 105, 199, 0.12) 0%, rgba(245, 195, 198, 0.08) 100%)',
            border: '1px solid rgba(124, 105, 199, 0.22)',
          }}
        >
          <p className="text-[#FCF4EB] font-semibold mb-2">Recommended connection type</p>
          <p className="text-sm text-[#FCF4EB]/70 leading-relaxed">
            For this setup, use a Xero Custom Connection. It is the best fit when you only need one
            organisation and want the most persistent machine-to-machine connection Xero supports.
          </p>
        </div>

        <StepCard number={1} title="This is the path you should use">
          <p>Use a Xero Custom Connection.</p>
          <p>Do not use standard OAuth for this guide.</p>
          <p>Do not spend time trying to find an API key. Xero does not support API keys.</p>
          <p><strong className="text-[#FCF4EB]">Purchase URL:</strong> <Link href="https://connect.xero.com/custom" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2">https://connect.xero.com/custom</Link></p>
          <p><strong className="text-[#FCF4EB]">Price:</strong> $5/month for the Custom Connection.</p>
        </StepCard>

        <StepCard number={2} title="Why this is the right choice">
          <p>Custom Connections are designed for single-organisation machine-to-machine integrations.</p>
          <p>They use the client credentials flow, so you do not need to manage refresh tokens.</p>
          <p>You can request new access tokens without user interaction whenever you need one.</p>
          <p>You also do not need the `xero-tenant-id` header for API calls on a Custom Connection.</p>
        </StepCard>

        <StepCard number={3} title="Use this prompt if you want Claude to explain the recommendation">
          <p>
            This prompt is only for explanation, not for choosing between multiple paths.
          </p>
          <CodeBlock
            codexPrompt
            filename="Paste into Claude Code"
            code={`Explain why a Xero Custom Connection is the correct setup for this project.

Assume:
1. We only need one Xero organisation
2. We want the most persistent machine-to-machine connection Xero supports
3. We want to read and write as much data as possible
4. We do not want a multi-organisation app

Explain:
1. Why Custom Connection is better than standard OAuth here
2. Why an API key is not available in Xero
3. Why client credentials is the best practical option
4. What the next 3 setup steps are`}
          />
        </StepCard>
      </section>

      <section id="part-b" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part B</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Create the Xero app with maximum scopes</h2>
        </div>

        <StepCard number={4} title="Create the app in Xero Developer">
          <p>Go to <Link href="https://developer.xero.com/" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2">developer.xero.com</Link> and sign in.</p>
          <p>Create a new app.</p>
          <p>Choose Custom Connection.</p>
          <p>Use the email address of the actual authorising user for that Xero organisation.</p>
          <p>If the organisation has not purchased the Custom Connection yet, buy it here first: <Link href="https://connect.xero.com/custom" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2">https://connect.xero.com/custom</Link></p>
        </StepCard>

        <ScreenshotCard
          src="/screenshots/xero-app-step-1.svg"
          alt="Screenshot of the first Xero app setup screen showing MyOS as app name, Custom connection selected, No selected for AI model use, and Yes selected for security requirements"
          caption="Match this screen exactly: MyOS, Custom connection, No for AI model use, and Yes for security requirements."
        />

        <StepCard number={5} title="Fill in the first Xero app screen exactly like this">
          <p><strong className="text-[#FCF4EB]">App name:</strong> Enter `MyOS`.</p>
          <p><strong className="text-[#FCF4EB]">Integration type:</strong> Select `Custom connection`.</p>
          <p><strong className="text-[#FCF4EB]">Will you use Xero data to train, fine-tune, adapt, or enhance an AI model?</strong> Choose `No`.</p>
          <p><strong className="text-[#FCF4EB]">Do you understand and agree to meet Xero&apos;s minimum security requirements?</strong> Choose `Yes`.</p>
          <CodeBlock
            filename="Copy these values for Screen 1"
            code={`App name:
MyOS

Integration type:
Custom connection

Will you use Xero data to train, fine-tune, adapt, or enhance an AI model?
No

Do you understand and agree to meet Xero's minimum security requirements?
Yes`}
          />
        </StepCard>

        <ScreenshotCard
          src="/screenshots/xero-app-step-2.svg"
          alt="Screenshot of the second Xero app setup screen showing the company or application URL filled as mastermindshq.business and the terms checkbox near the create app button"
          caption="Match this screen exactly: use mastermindshq.business as the company URL, check the terms box, then create the app."
        />

        <StepCard number={6} title="Fill in the second Xero app screen field by field">
          <p><strong className="text-[#FCF4EB]">Company or application URL:</strong> Enter `https://www.mastermindshq.business/`.</p>
          <p><strong className="text-[#FCF4EB]">OAuth 2.0 redirect URI:</strong> If Xero does not show a redirect field on your screen, skip it. This screenshot reflects that state.</p>
          <p><strong className="text-[#FCF4EB]">Terms and Conditions checkbox:</strong> Check it after reviewing the platform terms.</p>
          <p><strong className="text-[#FCF4EB]">Create app:</strong> Click `Create app` once everything is filled in.</p>
          <CodeBlock
            filename="Copy these values for Screen 2"
            code={`Company or application URL:
https://www.mastermindshq.business/

Terms and Conditions:
Check the box

Then click:
Create app`}
          />
        </StepCard>

        <StepCard number={7} title="Pick the maximum scopes you can get">
          <p>
            In this setup, do not optimize for minimum access. Optimize for full operational coverage.
          </p>
          <p>
            Select every Xero scope available to the app that is relevant to accounting, contacts,
            invoices, bills, bank data, files, assets, projects, settings, payroll, and any other
            write-capable areas shown in the UI.
          </p>
          <p>
            If Xero exposes a scope in the Custom Connection setup screen and it could plausibly help
            with creating, updating, reading, reconciling, or deleting data later, include it now.
          </p>
          <p>
            The authorizing user still needs the appropriate Xero permission level. Payroll endpoints
            require a payroll admin.
          </p>
        </StepCard>

        <ScreenshotCard
          src="/screenshots/xero-app-scopes.svg"
          alt="Screenshot of the Xero authorization scopes selector showing many checked accounting scopes and 40 scopes selected"
          caption="On the scopes screen, check every scope you can. Do not try to be selective here."
        />

        <StepCard number={8} title="What to do on the scopes screen">
          <p><strong className="text-[#FCF4EB]">Scopes:</strong> Check all available scopes.</p>
          <p><strong className="text-[#FCF4EB]">Do not curate them:</strong> This setup is intentionally broad so you can read, write, sync, test, and automate without coming back to re-authorize later.</p>
          <p><strong className="text-[#FCF4EB]">If you see a count like `40 scopes selected`:</strong> That is the right direction. The goal is full coverage.</p>
          <CodeBlock
            filename="Copy this instruction for the scopes screen"
            code={`On the Xero scopes screen:

Check every available scope.

Do not leave any unchecked unless Xero itself prevents it.

Goal:
- maximum read access
- maximum write access
- invoices
- bills
- contacts
- bank transactions
- attachments
- files
- payments
- journals
- payroll
- settings
- any other available Xero scopes`}
          />
        </StepCard>

        <StepCard number={9} title="Use this prompt to request the broadest scope set">
          <p>
            This prompt is for maximum-scope selection, not minimum-scope selection.
          </p>
          <CodeBlock
            editable
            codexPrompt
            filename="Paste into Claude Code"
            code={`I want the broadest Xero scope set available for a Custom Connection.

Planned jobs right now:
- read organisation info
- read chart of accounts
- read contacts
- read invoices and bills
- read bank transactions if available
- create and update invoices, bills, contacts, and other accounting records
- pull files and supporting finance data where available
- use payroll APIs if Xero exposes them for this org
- keep future automation flexible instead of narrowly scoped

Based on official Xero docs:
1. List every scope I should request for the broadest practical access
2. Separate them into:
   - definitely include now
   - include if available in this Xero region/org
3. Tell me which major areas each scope unlocks
4. Tell me exactly what to click/select in the Xero app setup UI

Do not optimize for least privilege here. Optimize for maximum useful coverage.`}
          />
        </StepCard>

        <StepCard number={10} title="Recommendation: use Custom Connection, not OAuth">
          <p>Use Custom Connection.</p>
          <p>Xero does not offer API keys.</p>
          <p>Custom Connection with client credentials is the most persistent option Xero supports for this use case.</p>
          <p>It is better than standard OAuth here because there are no refresh tokens to manage and no repeated user login flow for normal token renewal.</p>
        </StepCard>

        <StepCard number={11} title="Authorize the app from your email">
          <p>After you create the app and set the scopes, Xero sends an authorization email to the authorizing user.</p>
          <p>Open that email inbox.</p>
          <p>Find the Xero authorization message and click through the approval flow.</p>
          <p>The Custom Connection is not actually active until this email authorization step is completed.</p>
          <CodeBlock
            filename="What to do next"
            code={`After creating the Xero app:

1. Go to the email inbox of the authorizing user
2. Find the Xero authorization email
3. Open it
4. Approve / authorize the app
5. Return to Xero and confirm the Custom Connection is now active`}
          />
          <ProTip type="info">
            If the authorization email never arrives, first confirm the organisation purchased the Custom
            Connection subscription here:
            {' '}
            <Link href="https://connect.xero.com/custom" target="_blank" rel="noopener noreferrer" className="text-[#7C69C7] hover:text-[#9D8FE0] underline underline-offset-2">
              https://connect.xero.com/custom
            </Link>
            .
          </ProTip>
        </StepCard>

        <StepCard number={12} title="Save the credentials you will need">
          <p>Copy the client ID and client secret into a secure place.</p>
          <p>Only do this after the email authorization is complete.</p>
          <p>Once active, this connection will let you request fresh access tokens on demand with client credentials.</p>
          <ProTip type="warning">
            What people casually call the “Xero API key” in this workflow is really the app credential pair:
            `client_id` and `client_secret`. Xero does not provide a classic static API key for this.
          </ProTip>
        </StepCard>

        <StepCard number={13} title="Have Claude create a local test harness">
          <p>
            This prompt should generate the local `.env.example`, test script, and the exact variables
            you need to paste.
          </p>
          <CodeBlock
            editable
            codexPrompt
            filename="Paste into Claude Code"
            code={`Create a minimal local Xero API test setup in this workspace.

Assume:
- auth mode is CUSTOM CONNECTION
- I already have the client ID and client secret
- there is no redirect URI because we are not using standard OAuth

Do the following:
1. Create a .env.example with the exact variables needed
2. Create a real .env only if I explicitly confirm the secrets are ready
3. Generate a minimal Node.js test script that:
   - requests an access token
   - if needed, fetches the tenant/connection info
   - calls a simple Xero endpoint like Organisation or Invoices
   - prints a concise success/failure summary
4. Explain exactly where to paste each credential
5. Avoid logging secrets
6. Keep the script as small and readable as possible`}
          />
        </StepCard>
      </section>

      <section id="part-c" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part C</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Verify the API with a read test</h2>
        </div>

        <StepCard number={14} title="Run a read-only proof before attempting any writes">
          <p>First prove that the token works.</p>
          <p>For this Custom Connection flow, prove that token generation and a simple read endpoint both work.</p>
          <p>Do not try to write data until a simple read request succeeds.</p>
        </StepCard>

        <StepCard number={15} title="Use this prompt to run the verification flow">
          <p>
            This prompt should end with a clear success or failure summary, not vague OAuth advice.
          </p>
          <CodeBlock
            codexPrompt
            filename="Paste into Claude Code"
            code={`Now verify the Xero connection end to end.

Checklist:
1. Confirm the env variables are loaded correctly
2. Request an access token
3. If standard OAuth is in use, fetch the connected tenant information
4. Call a simple read endpoint first
5. Then call one finance-relevant endpoint such as:
   - Organisation
   - Accounts
   - Contacts
   - Invoices
6. Summarize:
   - what worked
   - what failed
   - what exact next step is needed

If an error happens, diagnose it precisely instead of giving generic OAuth advice.`}
          />
        </StepCard>

        <ProTip type="info">
          Xero uses OAuth 2.0, not API keys. Access tokens expire after 30 minutes. In standard
          OAuth, refresh tokens expire if unused for 60 days. These are current Xero platform rules
          from the official developer docs and FAQs.
        </ProTip>
      </section>

      <section id="part-d" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part D</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Data format and sample write payloads</h2>
        </div>

        <StepCard number={16} title="Understand the shape Xero expects before you send data">
          <p>
            Xero does not want random CSV columns or loose JSON blobs. It expects structured payloads
            that match the target object, such as a Contact or an Invoice.
          </p>
        </StepCard>

        <StepCard number={17} title="Starter contact payload format">
          <CodeBlock
            filename="contact-payload.json"
            language="json"
            code={`{
  "Name": "Sample Contact",
  "FirstName": "Sample",
  "LastName": "Contact",
  "EmailAddress": "sample@example.com",
  "Addresses": [
    {
      "AddressType": "POBOX",
      "AddressLine1": "123 Example St",
      "City": "New York",
      "Region": "NY",
      "PostalCode": "10001",
      "Country": "USA"
    }
  ]
}`}
          />
        </StepCard>

        <StepCard number={18} title="Starter invoice payload format">
          <p>
            This is the kind of structured JSON Claude should prepare before attempting a proof write.
          </p>
          <CodeBlock
            filename="invoice-payload.json"
            language="json"
            code={`{
  "Type": "ACCREC",
  "Contact": {
    "Name": "Sample Customer"
  },
  "Date": "2026-05-10",
  "DueDate": "2026-05-24",
  "Reference": "DEMO-001",
  "LineAmountTypes": "Exclusive",
  "LineItems": [
    {
      "Description": "Sample strategy package",
      "Quantity": 1,
      "UnitAmount": 1000,
      "AccountCode": "200",
      "TaxType": "OUTPUT"
    }
  ],
  "Status": "DRAFT"
}`}
          />
        </StepCard>

        <StepCard number={19} title="Use this prompt to inspect the live format before any write">
          <p>
            This prevents Claude from guessing wrong if the target organisation has specific tax types,
            account codes, or field requirements.
          </p>
          <CodeBlock
            codexPrompt
            filename="Paste into Claude Code"
            code={`Inspect the live Xero response shape before preparing any write payload.

Do the following:
1. Fetch a small sample from the most relevant endpoint for this task
2. Show me the exact fields that appear in the live response
3. Identify any required IDs, account codes, tax types, or enum values
4. Compare that with the sample payload I plan to send
5. Tell me what must be changed before a write call is attempted

Do not perform any write yet.`}
          />
        </StepCard>
      </section>

      <section id="part-e">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#7C69C7] text-sm font-semibold uppercase tracking-widest">Part E</span>
          <h2 className="text-2xl font-bold text-[#FCF4EB]">Prompt kits to prove the connection works</h2>
        </div>

        <StepCard number={20} title="Create a proof write without posting live data immediately">
          <p>First have Claude prepare the request body.</p>
          <p>Review it yourself.</p>
          <p>Only then let Claude send the write call.</p>
        </StepCard>

        <StepCard number={21} title="Use this prompt to prepare the proof payload">
          <CodeBlock
            editable
            codexPrompt
            filename="Paste into Claude Code"
            code={`Prepare a proof payload for Xero using the correct format for [CONTACT or INVOICE].

Requirements:
1. Reuse the working Xero auth setup in this workspace
2. Inspect live Xero data first if any required field values are unclear
3. Build a minimal valid payload
4. Save the payload to a local JSON file
5. Show me the final JSON before sending it
6. Do not send the write request until I approve`}
          />
        </StepCard>

        <StepCard number={22} title="Use this prompt to send the proof request and summarize the result">
          <CodeBlock
            editable
            codexPrompt
            filename="Paste into Claude Code"
            code={`Send the approved Xero proof payload now.

Requirements:
1. Use the local JSON payload file we just prepared
2. Send exactly one proof write request
3. Capture the response
4. Summarize:
   - whether it succeeded
   - the returned object ID or reference
   - any warnings
   - any fields Xero changed or normalized
5. Save a sample response file locally so I can inspect the exact working format later`}
          />
        </StepCard>

        <StepCard number={23} title="Use this prompt to build the next real automation">
          <CodeBlock
            editable
            codexPrompt
            filename="Paste into Claude Code"
            code={`Build the first real Xero automation in this workspace.

Target automation:
[CHOOSE ONE]
- daily invoice summary
- unpaid invoice report
- contacts sync
- bank transaction review queue
- monthly spend summary by account

Requirements:
1. Reuse the working Xero auth setup
2. Keep secrets in env files only
3. Use the exact live payload and response shapes already proven
4. Write the smallest clean script that solves the job
5. Add a README section explaining how to run it
6. If the script could mutate accounting data, stop and ask before enabling writes

At the end, summarize:
- files created or changed
- command to run
- expected output
- remaining risks`}
          />
        </StepCard>
      </section>
    </main>
  )
}
