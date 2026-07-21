// Jill onboarding page (MHQ design, self-contained fragment)
export const GUIDE_HTML = `<style>
  :root{
    --cream:#FCF4EB; --dark:#151515; --deep:#573D6F; --purple:#7C69C7;
    --lavender:#9D8FE0; --rose:#C4BAE0; --pink:#F5C3C6; --panel:#1D1B22; --panel2:#2B1F38;
    --disp:'Cormorant Garamond',Georgia,serif; --sans:'Plus Jakarta Sans',system-ui,sans-serif;
  }
  *{box-sizing:border-box}
  body{margin:0;background:linear-gradient(160deg,#0e0a17,#151515 40%,#1a1424);color:var(--cream);
       font-family:var(--sans);line-height:1.6;-webkit-font-smoothing:antialiased}
  .wrap{max-width:940px;margin:0 auto;padding:48px 24px 96px}
  header.hero{text-align:center;padding:32px 0 8px}
  .topbar{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin:28px 0 8px}
  .topbtn{display:flex;align-items:center;gap:10px;padding:16px 26px;border-radius:14px;font-weight:700;font-size:17px;
    text-decoration:none;color:#150f1f;background:linear-gradient(90deg,var(--pink),var(--lavender));
    box-shadow:0 8px 24px #7c69c755;transition:.15s}
  .topbtn:hover{transform:translateY(-2px);filter:brightness(1.06)}
  .topbtn.alt{background:linear-gradient(90deg,#7C69C7,#9D8FE0);color:#fff}
  .topbtn .emoji{font-size:20px}
  .kicker{letter-spacing:.28em;text-transform:uppercase;font-size:12px;color:var(--lavender);font-weight:600}
  h1{font-family:var(--disp);font-weight:600;font-size:clamp(40px,7vw,68px);margin:.15em 0 .1em;line-height:1.02;
     background:linear-gradient(90deg,var(--pink),var(--lavender),var(--purple));-webkit-background-clip:text;background-clip:text;color:transparent}
  .sub{color:var(--rose);font-size:18px;max-width:620px;margin:8px auto 0}
  h2{font-family:var(--disp);font-weight:600;font-size:32px;margin:56px 0 6px;color:var(--cream)}
  h2 .n{color:var(--purple);font-size:22px;vertical-align:middle;margin-right:12px;font-family:var(--sans);font-weight:700}
  .lead{color:var(--rose);margin:0 0 20px;font-size:16px}
  .card{background:linear-gradient(150deg,var(--panel),var(--panel2));border:1px solid #ffffff18;border-radius:16px;
        padding:22px 24px;margin:14px 0;box-shadow:0 8px 30px #0006}
  .card h3{margin:0 0 4px;font-size:19px;color:var(--cream)}
  .card p{margin:4px 0;color:#e9e0f5cc}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:640px){.grid{grid-template-columns:1fr}}
  a.btn{display:inline-block;margin-top:10px;padding:9px 16px;border-radius:999px;font-weight:600;font-size:14px;
        text-decoration:none;color:#150f1f;background:linear-gradient(90deg,var(--pink),var(--lavender));transition:.15s}
  a.btn:hover{filter:brightness(1.08);transform:translateY(-1px)}
  a.btn.ghost{background:transparent;color:var(--lavender);border:1px solid var(--purple)}
  .swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;margin:14px 0}
  .swatch{border-radius:12px;overflow:hidden;border:1px solid #ffffff18}
  .swatch .chip{height:64px}
  .swatch .label{padding:8px 10px;background:#00000040;font-size:12px}
  .swatch .label b{display:block;font-size:12.5px;color:var(--cream)}
  .swatch .label span{color:#c9bfe0aa;font-family:ui-monospace,monospace;font-size:11px}
  .logo-card{background:#0e0a17;border-radius:14px;padding:24px;text-align:center;border:1px solid #ffffff18}
  .logo-card.light{background:var(--cream)}
  .logo-card img{width:220px;max-width:100%;height:auto;display:block;margin:0 auto}
  .dl-row{display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap}
  a.btn.small{padding:6px 13px;font-size:12.5px;margin-top:0}
  .pill{display:inline-block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;
        padding:3px 10px;border-radius:999px;margin-left:8px;vertical-align:middle}
  .pill.now{background:#2ec26b22;color:#7ff0a8;border:1px solid #2ec26b55}
  .pill.soon{background:#f5c3c622;color:var(--pink);border:1px solid #f5c3c655}
  .pill.later{background:#9d8fe022;color:var(--lavender);border:1px solid #9d8fe055}
  ol.pri{counter-reset:p;list-style:none;padding:0;margin:0}
  ol.pri li{position:relative;padding:14px 18px 14px 56px;margin:10px 0;background:#ffffff08;border-radius:12px;border:1px solid #ffffff12}
  ol.pri li::before{counter-increment:p;content:counter(p);position:absolute;left:16px;top:14px;width:28px;height:28px;
     display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--pink));color:#150f1f;font-weight:800}
  ol.pri li b{color:var(--cream)}
  code{background:#00000055;border:1px solid #ffffff1a;border-radius:6px;padding:2px 7px;font-size:13px;color:var(--pink)}
  .foot{margin-top:64px;text-align:center;color:#b7a9d0aa;font-size:14px;border-top:1px solid #ffffff14;padding-top:24px}
  .tag{color:var(--lavender);font-weight:600}
</style>
<div class="wrap">
  <header class="hero">
    <div class="kicker">Masterminds HQ · Team</div>
    <h1>Welcome, Jill</h1>
    <p class="sub">Everything you need to get started, in one place. Work through it top to bottom. Anything marked <span class="tag">Later</span> can wait.</p>
    <div class="topbar">
      <a class="topbtn" href="http://mac-studio.tail781b6d.ts.net:3000/app/tasks" target="_blank" rel="noopener"><span class="emoji">📋</span> Your Task Board</a>
      <a class="topbtn alt" href="https://www.canva.com" target="_blank" rel="noopener"><span class="emoji">🎨</span> Open Canva</a>
    </div>
  </header>

  <h2><span class="n">✦</span>Your mission</h2>
  <p class="lead">What you are here to do, in one line.</p>
  <div class="card">
    <p>You are Joe's right hand for the things that keep Masterminds HQ visible and connected: cleaning up and sharpening Joe's presence, managing the community, and keeping the content and outreach engine moving. The goal is simple, take the busy work off Joe's plate so he can focus on serving members and growing the room.</p>
  </div>

  <h2><span class="n">1</span>Your first priorities</h2>
  <p class="lead">Start here. These are the things that matter this week.</p>
  <ol class="pri">
    <li><b>Clean up Joe's LinkedIn.</b> Make it read as one clear thing: the founder of Masterminds HQ who helps small business owners build AI systems. Full step-by-step SOP is linked below, you build a list first, Illy approves, then you delete. Never guess on deletions.</li>
    <li><b>Community management.</b> Start right away, alongside the LinkedIn cleanup. Keep the room warm, replies prompt, members feeling seen.</li>
    <li><b>Lead magnets.</b> Use the current lead magnets as they are for now. No new workshop to build.</li>
    <li><b>Onboarding and branding.</b> Get familiar with Joe's brand and voice so everything you touch sounds like him.</li>
  </ol>

  <h2><span class="n">2</span>Your tools and access</h2>
  <p class="lead">Get signed in to each of these. Passwords you need are in LastPass once you accept the invite.</p>
  <div class="grid">
    <div class="card">
      <h3>LastPass <span class="pill now">Do first</span></h3>
      <p>Your password vault. Accept the family invite Joe sent to your email, create your account, and you will get the shared logins you need in the <code>Shared-Content Team</code> folder.</p>
      <a class="btn" href="https://lastpass.com" target="_blank" rel="noopener">Open LastPass</a>
    </div>
    <div class="card">
      <h3>Member Portal <span class="pill now">Do first</span></h3>
      <p>Your learning hub. You are enrolled as a guest in Cohort 3, ramp up on the material any time. Sign in with Google using your Gmail, no password to set.</p>
      <a class="btn" href="https://portal.mastermindshq.business" target="_blank" rel="noopener">Open the Portal</a>
    </div>
    <div class="card">
      <h3>Canva <span class="pill now">Do first</span></h3>
      <p>Where you will create graphics and content. Set up your account, brand assets and templates get shared here.</p>
      <a class="btn" href="https://canva.com" target="_blank" rel="noopener">Open Canva</a>
    </div>
    <div class="card">
      <h3>Tuba <span class="pill soon">This week</span></h3>
      <p>Your content creation tool. Joe will get you set up and introduced so you can start creating.</p>
      <a class="btn ghost" href="#" onclick="return false">Access via Joe</a>
    </div>
    <div class="card">
      <h3>Terminal / MyOS <span class="pill later">Later</span></h3>
      <p>Remote access to Joe's system for building. Your setup instructions and key were emailed to you, follow them when you are ready. Mission Control opens in a browser once you are connected to Tailscale.</p>
      <a class="btn ghost" href="http://mac-studio.tail781b6d.ts.net:3000" target="_blank" rel="noopener">Mission Control</a>
    </div>
    <div class="card">
      <h3>Social accounts <span class="pill soon">This week</span></h3>
      <p>You will get delegated access to Joe's Instagram and LinkedIn through your own logins, no shared passwords. Joe is setting this up now.</p>
      <a class="btn ghost" href="https://www.linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
    </div>
  </div>

  <h2><span class="n">3</span>Your playbooks</h2>
  <p class="lead">Step-by-step guides for your main tasks. Follow them exactly, they are built to be stupid-proof.</p>
  <div class="card">
    <h3>LinkedIn Cleanup SOP</h3>
    <p>The full safe process for cleaning up Joe's profile: what to keep, what to flag, and the list-first-then-delete workflow so nothing is ever removed by accident. Illy approves each batch.</p>
    <a class="btn" href="/docs/jill-linkedin-cleanup-sop.md" target="_blank" rel="noopener">Open the SOP</a>
  </div>
  <div class="card">
    <h3>Community Management Brief</h3>
    <p>How to hold the room: tone, response times, and what to escalate to Joe. Coming to you this week as you get started.</p>
    <a class="btn ghost" href="#" onclick="return false">Brief in progress</a>
  </div>

  <h2><span class="n">4</span>Masterminds HQ branding</h2>
  <p class="lead">The Masterminds HQ logo and colors. Use these exactly, download whichever you need.</p>
  <div class="grid">
    <div class="logo-card">
      <img src="/brand/masterminds-logo-current-white.png" alt="Masterminds HQ logo, white">
      <p style="color:#c9bfe0cc;font-size:13px;margin-top:14px">White version, for dark backgrounds</p>
      <div class="dl-row">
        <a class="btn small" href="/brand/masterminds-logo-current-white.svg" download>SVG</a>
        <a class="btn small" href="/brand/masterminds-logo-current-white.png" download>PNG</a>
        <a class="btn small ghost" href="/brand/masterminds-logo-current-white-512.png" download>PNG 512</a>
      </div>
    </div>
    <div class="logo-card light">
      <img src="/brand/masterminds-logo-current-black.png" alt="Masterminds HQ logo, black">
      <p style="color:#573D6Fcc;font-size:13px;margin-top:14px">Black version, for light backgrounds</p>
      <div class="dl-row">
        <a class="btn small" href="/brand/masterminds-logo-current-black.svg" download>SVG</a>
        <a class="btn small" href="/brand/masterminds-logo-current-black.png" download>PNG</a>
        <a class="btn small ghost" href="/brand/masterminds-logo-current-black-512.png" download>PNG 512</a>
      </div>
    </div>
  </div>
  <p class="lead" style="margin-top:22px">Colors</p>
  <div class="swatches">
    <div class="swatch"><div class="chip" style="background:#7C69C7"></div><div class="label"><b>Purple</b><span>#7C69C7</span></div></div>
    <div class="swatch"><div class="chip" style="background:#9D8FE0"></div><div class="label"><b>Lavender</b><span>#9D8FE0</span></div></div>
    <div class="swatch"><div class="chip" style="background:#F5C3C6"></div><div class="label"><b>Pink</b><span>#F5C3C6</span></div></div>
    <div class="swatch"><div class="chip" style="background:#FCF4EB"></div><div class="label"><b>Cream</b><span>#FCF4EB</span></div></div>
    <div class="swatch"><div class="chip" style="background:#151515"></div><div class="label"><b>Dark</b><span>#151515</span></div></div>
    <div class="swatch"><div class="chip" style="background:#573D6F"></div><div class="label"><b>Deep purple</b><span>#573D6F</span></div></div>
  </div>
  <div class="card">
    <p><b>Fonts:</b> Cormorant Garamond for headlines, Plus Jakarta Sans for body text.</p>
    <p><b>Text on dark backgrounds is warm cream (#FCF4EB), never pure white</b> — that warmth is part of the brand.</p>
    <p><b>Never use gold, yellow, or orange.</b> Joe rejected both when tested. Purple, lavender, pink, cream, and dark only.</p>
  </div>

  <h2><span class="n">5</span>Wishwell branding</h2>
  <p class="lead">Wishwell (wishwell.gifts) is Joe's keepsake-book product, a separate brand from Masterminds HQ. Its own logo and colors, do not mix the two.</p>
  <div class="grid">
    <div class="logo-card light">
      <img src="/brand/wishwell/logo-black.png" alt="Wishwell logo, black">
      <p style="color:#37323dcc;font-size:13px;margin-top:14px">Black, for light backgrounds</p>
      <div class="dl-row">
        <a class="btn small ghost" href="/brand/wishwell/logo-black.png" download>PNG</a>
      </div>
    </div>
    <div class="logo-card">
      <img src="/brand/wishwell/logo-white.png" alt="Wishwell logo, white">
      <p style="color:#c9bfe0cc;font-size:13px;margin-top:14px">White, for dark backgrounds</p>
      <div class="dl-row">
        <a class="btn small" href="/brand/wishwell/logo-white.png" download>PNG</a>
      </div>
    </div>
    <div class="logo-card" style="background:#f4eee8">
      <img src="/brand/wishwell/logo-original-champagne.png" alt="Wishwell logo, original champagne">
      <p style="color:#37323dcc;font-size:13px;margin-top:14px">Original champagne, the signature version</p>
      <div class="dl-row">
        <a class="btn small ghost" href="/brand/wishwell/logo-original-champagne.png" download>PNG</a>
      </div>
    </div>
    <div class="logo-card" style="background:#37323d">
      <img src="/brand/wishwell/logo-white-on-black.png" alt="Wishwell logo lockup, white on black">
      <p style="color:#c9bfe0cc;font-size:13px;margin-top:14px">Lockup, white on black (self-contained badge)</p>
      <div class="dl-row">
        <a class="btn small" href="/brand/wishwell/logo-white-on-black.png" download>PNG</a>
      </div>
    </div>
    <div class="logo-card light">
      <img src="/brand/wishwell/logo-black-on-white.png" alt="Wishwell logo lockup, black on white">
      <p style="color:#37323dcc;font-size:13px;margin-top:14px">Lockup, black on white (self-contained badge)</p>
      <div class="dl-row">
        <a class="btn small ghost" href="/brand/wishwell/logo-black-on-white.png" download>PNG</a>
      </div>
    </div>
  </div>
  <p class="lead" style="margin-top:22px">Colors</p>
  <div class="swatches">
    <div class="swatch"><div class="chip" style="background:#fbf8f4"></div><div class="label"><b>Ivory</b><span>#fbf8f4</span></div></div>
    <div class="swatch"><div class="chip" style="background:#f4eee8"></div><div class="label"><b>Linen</b><span>#f4eee8</span></div></div>
    <div class="swatch"><div class="chip" style="background:#f0deda"></div><div class="label"><b>Blush</b><span>#f0deda</span></div></div>
    <div class="swatch"><div class="chip" style="background:#a3b49b"></div><div class="label"><b>Sage</b><span>#a3b49b</span></div></div>
    <div class="swatch"><div class="chip" style="background:#5f7256"></div><div class="label"><b>Sage deep</b><span>#5f7256</span></div></div>
    <div class="swatch"><div class="chip" style="background:#96525c"></div><div class="label"><b>Rose</b><span>#96525c</span></div></div>
    <div class="swatch"><div class="chip" style="background:#c2a878"></div><div class="label"><b>Champagne</b><span>#c2a878</span></div></div>
    <div class="swatch"><div class="chip" style="background:#37323d"></div><div class="label"><b>Ink</b><span>#37323d</span></div></div>
  </div>
  <div class="card">
    <p><b>Tone:</b> warm, wedding-grade, emotional. "They will hold proof of how loved they are." Not corporate, not a generic photo-book pitch.</p>
    <p><b>No em dashes, ever</b>, in anything written for Wishwell (same rule as Masterminds HQ).</p>
  </div>

  <h2><span class="n">6</span>Good to know</h2>
  <div class="grid">
    <div class="card">
      <h3>The free workshop</h3>
      <p>Joe runs a free workshop, "Ask an AI Expert." It is the top of the funnel for new members, good to know when you are managing the community.</p>
      <a class="btn ghost" href="https://a.mastermindshq.business/ai-expert" target="_blank" rel="noopener">See the workshop</a>
    </div>
    <div class="card">
      <h3>Joe's voice</h3>
      <p>Everything you write for Joe's audience should sound like him: warm, direct, generous, never pushy. He serves, he does not squeeze. When in doubt, ask.</p>
    </div>
  </div>

  <div class="foot">
    Questions? Message Joe any time. Welcome to the team, Jill. 🦄
  </div>
</div>`;
