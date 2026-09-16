// Auto-generated from projects/illy-onboarding/guide-v2/illy-guide.html (MHQ design)
export const GUIDE_HTML = `<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,500;1,600&display=swap');
:root{--dark:#151515;--panel:#1D1B22;--deep:#573D6F;--cream:#FCF4EB;--purple:#8B79D4;--lavender:#9D8FE0;--rose:#C4BAE0;--pink:#F5C3C6;
--sans:'Plus Jakarta Sans',system-ui,sans-serif;--disp:'Cormorant Garamond',Georgia,serif;}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--dark);color:var(--cream);font-family:var(--sans);-webkit-font-smoothing:antialiased;line-height:1.7;overflow-x:hidden}
::selection{background:var(--deep);color:var(--cream)}
.bg-fx{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:#151515}
.bg-fx .grid{position:absolute;inset:-40px;background-image:radial-gradient(rgba(139,121,212,.08) 1px,transparent 1px);background-size:28px 28px;animation:drift 14s linear infinite}
@keyframes drift{to{background-position:28px 28px}}
.orb{position:absolute;border-radius:50%;filter:blur(70px);opacity:.16}
.orb.a{width:520px;height:520px;top:-12%;left:6%;background:radial-gradient(circle,var(--purple),transparent 70%);animation:float 20s ease-in-out infinite}
.orb.b{width:440px;height:440px;bottom:-10%;right:3%;background:radial-gradient(circle,var(--pink),transparent 70%);animation:float 26s ease-in-out infinite reverse}
@keyframes float{0%,100%{transform:translate(0,0)}50%{transform:translate(24px,-30px)}}
header.hero{position:relative;z-index:1;text-align:center;padding:80px 24px 30px;background:radial-gradient(ellipse at 50% 0%,rgba(139,121,212,.14),transparent 62%)}
.eyebrow{font-size:.72rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:var(--purple);margin:0 0 16px}
header.hero h1{font-family:var(--disp);font-weight:600;font-size:clamp(2.4rem,6vw,4.2rem);line-height:1;margin:0 0 14px;background:linear-gradient(135deg,#FCF4EB 0%,#9D8FE0 35%,#F5C3C6 70%,#FCF4EB 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;padding-bottom:.12em}
header.hero .sub{font-family:var(--disp);font-style:italic;font-size:clamp(1.1rem,2.4vw,1.6rem);color:rgba(252,244,235,.6);margin:0}
/* sticky topbar with Contents dropdown (portal style) */
.topbar{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:10px 20px;background:rgba(21,21,21,.8);backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.06)}
.topbar .brand{font-family:var(--disp);font-size:1.05rem;color:var(--cream);font-weight:600}
.toc-wrap{position:relative}
.toc-btn{display:flex;align-items:center;gap:8px;border:1px solid transparent;border-radius:999px;padding:7px 16px;font-family:var(--sans);
  font-size:.85rem;color:rgba(252,244,235,.75);background:rgba(255,255,255,.04);cursor:pointer;transition:.2s}
.toc-btn:hover{border-color:rgba(255,255,255,.12);color:var(--cream)}
.toc-btn svg{transition:transform .2s}
.toc-btn[aria-expanded="true"] svg{transform:rotate(180deg)}
.toc-panel{position:absolute;right:0;margin-top:10px;width:260px;max-height:72vh;overflow-y:auto;
  background:rgba(29,27,34,.97);border:1px solid rgba(255,255,255,.10);border-radius:12px;
  box-shadow:0 22px 55px rgba(0,0,0,.45);backdrop-filter:blur(16px);padding:6px 0;display:none;z-index:40}
.toc-panel.open{display:block}
.toc-group{margin:8px 0 2px;padding:6px 16px 2px;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(252,244,235,.35)}
.toc-panel a{display:block;padding:9px 16px;font-size:.86rem;color:rgba(252,244,235,.68);text-decoration:none;transition:.15s}
.toc-panel a:hover{background:rgba(255,255,255,.05);color:var(--cream)}
.toc-panel a.active{color:var(--purple);font-weight:600}
main{position:relative;z-index:1;max-width:840px;margin:0 auto;padding:8px 22px 100px}
.chapter{position:relative;margin-top:30px;padding:34px 30px 30px;border-radius:20px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);backdrop-filter:blur(10px);scroll-margin-top:70px}
.chapter .accent-bar{position:absolute;left:0;top:22px;bottom:22px;width:3px;border-radius:3px}
.accent-purple .accent-bar{background:linear-gradient(to bottom,rgba(139,121,212,.7),transparent)}
.accent-lavender .accent-bar{background:linear-gradient(to bottom,rgba(157,143,224,.7),transparent)}
.accent-rose .accent-bar{background:linear-gradient(to bottom,rgba(196,186,224,.7),transparent)}
.chapter h1{font-family:var(--disp);font-weight:600;font-size:clamp(1.9rem,4vw,2.7rem);line-height:1.05;margin:.1em 0 .5em;background:linear-gradient(to right,#FCF4EB 0%,#BDB3E8 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;padding-bottom:.08em}
.chapter h2{font-family:var(--disp);font-weight:600;font-size:1.65rem;color:var(--lavender);margin:1.5em 0 .4em}
.chapter h3{font-weight:700;font-size:1.02rem;color:var(--rose);margin:1.4em 0 .35em}
p{color:rgba(252,244,235,.85);margin:0 0 1em}
strong{color:#fff;font-weight:700}
em{color:rgba(252,244,235,.72)}
a{color:var(--lavender);text-decoration:underline;text-underline-offset:2px}
a:hover{color:var(--purple)}
ul,ol{padding-left:1.3em;margin:0 0 1em}
li{margin:.3em 0;color:rgba(252,244,235,.82)}
code{background:rgba(139,121,212,.16);padding:1px 6px;border-radius:5px;font-size:.86em;font-family:ui-monospace,monospace;color:var(--lavender)}
pre{background:#0e0a17;border:1px solid rgba(255,255,255,.07);padding:14px 16px;border-radius:12px;overflow-x:auto}
pre code{background:none;color:rgba(252,244,235,.85)}
blockquote{border-left:3px solid var(--purple);margin:1.1em 0;padding:2px 16px;background:rgba(139,121,212,.1);border-radius:0 10px 10px 0;color:rgba(252,244,235,.75);font-style:italic}
hr{border:none;border-top:1px solid rgba(255,255,255,.1);margin:1.8em 0}
table{width:100%;border-collapse:collapse;margin:1.1em 0;font-size:.9rem;display:block;overflow-x:auto;border:1px solid rgba(255,255,255,.08);border-radius:14px}
thead tr{background:rgba(139,121,212,.16)}
th{font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(189,179,232,.85);text-align:left;padding:10px 14px}
td{padding:10px 14px;color:rgba(252,244,235,.82);border-top:1px solid rgba(255,255,255,.06);vertical-align:top}
tbody tr:hover{background:rgba(255,255,255,.03)}
/* staff cards with avatars */
.people-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin:1.2em 0}
.person{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px 20px}
.person-head{display:flex;align-items:center;gap:14px;margin-bottom:8px}
.avatar{width:52px;height:52px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid rgba(157,143,224,.35)}
.avatar-fallback{width:52px;height:52px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;
  background:rgba(139,121,212,.2);border:2px solid rgba(157,143,224,.35);color:var(--lavender);font-weight:700;font-size:1.05rem}
.person h3{margin:0 0 2px;color:var(--cream);font-size:1.05rem}
.person .role{color:var(--purple);font-size:.8rem;font-weight:600;margin:0}
.person p{font-size:.86rem;margin:.3em 0;color:rgba(252,244,235,.78)}
.person .ask{color:var(--lavender);font-size:.82rem;font-style:italic;margin-top:8px}
footer{position:relative;z-index:1;text-align:center;color:rgba(157,143,224,.6);font-size:.78rem;padding:26px;border-top:1px solid rgba(139,121,212,.2)}
@media(max-width:640px){.chapter{padding:26px 20px}.topbar .brand{display:none}}
</style>
<div class="bg-fx"><div class="grid"></div><div class="orb a"></div><div class="orb b"></div></div>
<header class="hero">
  <p class="eyebrow">Masterminds HQ, GTM, Sales and Marketing</p>
  <h1>Welcome, Illy</h1>
  <p class="sub">Start with Get Set Up, then The People, Cohort 4, and Meta Ads. Updated 2026-07-25.</p>
</header>
<div class="topbar">
  <span class="brand">Illy Onboarding</span>
  <div class="toc-wrap">
    <button class="toc-btn" aria-haspopup="menu" aria-expanded="false">Contents
      <svg width="11" height="11" viewBox="0 0 10 10" fill="none"><path d="M2 3.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="toc-panel" role="menu"><p class="toc-group">Get Started</p><a href="#start-here" data-sec="start-here" role="menuitem">Start Here</a><a href="#setup" data-sec="setup" role="menuitem">Get Set Up</a><p class="toc-group">Your Job</p><a href="#people" data-sec="people" role="menuitem">The People</a><a href="#cohort4" data-sec="cohort4" role="menuitem">Cohort 4 Plan</a><a href="#warm-leads" data-sec="warm-leads" role="menuitem">Your Warm Leads</a><a href="#engines" data-sec="engines" role="menuitem">MHQ Sales & Meta Ads</a><a href="#linkedin" data-sec="linkedin" role="menuitem">LinkedIn Update Guide</a><a href="#send-as-joe" data-sec="send-as-joe" role="menuitem">Sending as Joe</a><p class="toc-group">Go Deeper</p><a href="#strategy" data-sec="strategy" role="menuitem">The Strategy</a><a href="#state" data-sec="state" role="menuitem">State of MHQ</a><a href="#playbook" data-sec="playbook" role="menuitem">The Playbook</a><a href="#giveaways" data-sec="giveaways" role="menuitem">Giveaways</a><a href="#social" data-sec="social" role="menuitem">Social Channels</a><a href="#brand" data-sec="brand" role="menuitem">Brand</a><a href="#agents" data-sec="agents" role="menuitem">Your AI Team</a><a href="#reference" data-sec="reference" role="menuitem">Mission Control Map</a></div>
  </div>
</div>
<main><section id="start-here" class="chapter accent-purple" data-sec="start-here"><div class="accent-bar"></div><h1>Start Here: Your Mission and Operating Rules</h1>
<p>You are here to increase sales for Masterminds HQ. That is the job. Your mission has two horizons, and you run them at the same time.</p>
<p><strong>Right now: close the warm pool.</strong> Cohort 4 is already built, inbound is growing, and the room is accepting applicants. Joe personally works the hottest leads, the people one conversation from paying. You own the warm pool: everyone who has raised their hand, is interested, negotiating, or sitting on an offer. That pool lives in the CRM as the <code>strong_interest</code> and <code>negotiating_scholarship</code> segments, and your first step is a working session with Joe to walk every lead together and get the relationship context. Your Warm Leads is the chapter for this. Cohort 4 starts Monday, August 10, so this is the near-term clock.</p>
<p><strong>As fast as possible: open new channels and bring in your own people.</strong> The bigger goal is not just closing what Joe already warmed. It is opening the market through channels that generate new pipeline you source and close yourself, primarily LinkedIn and paid ads. Get those standing up now, in parallel with the warm work. Your Two Engines and The Playbook are where that lives. Closing the warm pool proves you can sell; opening new channels is how you scale past what Joe can hand you.</p>
<p>This is a GTM role, spanning sales and marketing. Treat activity, content, campaigns, systems, and team management as tools for the same two outcomes: close the warm pipeline, and build a new one you own.</p>
<h2>Your Team</h2>
<p>You manage Jill and Tooba.</p>
<ul>
<li>Jill is the VA. She can support Canva, carousels, videos, and LinkedIn and Instagram engagement.</li>
<li>Tooba is the video editor.</li>
</ul>
<p>Your standard for delegation is simple: write stupid-proof SOPs. If a task cannot be made clear enough to run reliably through an SOP, do not hand it off yet. Improve the process first, then delegate it.</p>
<h2>The Clock You Are Working Against</h2>
<p>You fly to Greece on July 22 or 23, six hours behind Bali. The first remote weekly check-in is expected around the week of August 3. Joe is fully offline from August 23 through September 10 for Burning Man. You are full-time and in person in Bali from September 14.</p>
<p>The practical implication: get the essential setup, priorities, ownership, and repeatable work moving before August 23. During Joe's offline window, work asynchronously from a clear operating system rather than waiting on approvals or direction that will not be available.</p>
<h3>While Joe is offline: your mandate</h3>
<p>Those 18 days are yours to run, not to pause. Three things should be moving the whole time:</p>
<ol>
<li><strong>Get the LinkedIn cleanup started and running through Jill.</strong> The plan and the SOP are built; your job is to keep her executing and review her batches.</li>
<li><strong>Get the project with Jill going.</strong> Onboard her into the work, hand her execution-ready tasks, and build the delegation rhythm so she is productive without you waiting on Joe.</li>
<li><strong>Work on sales for Meta.</strong> Keep the Meta engine and the paid-sales push advancing.</li>
</ol>
<p>Ronnie is your escalation point for anything urgent while Joe is away. The line to hold: you can decide anything inside this mandate, including closing warm leads at the listed prices, running the content and carousel pipeline, and directing Jill and Tooba. What waits for Joe is anything outside it, new pricing or discounts beyond the approved scholarship track, new deal slugs or checkout links, new paid spend, and any financial action (Ronnie approves those via Slack).</p>
<h2>How Joe Wants You to Operate</h2>
<h3>Choose speed and volume</h3>
<p>Run at 100 mph, not 20 mph. Joe prefers 20 to 30 times more output with occasional mistakes over perfect work delivered too slowly. You may be inclined toward perfectionism. Deliberately lean away from it when it slows useful work.</p>
<h3>Make each mistake once</h3>
<p>Mistakes are fine once. Do not repeat them. When something goes wrong, build a process that prevents recurrence. If that process fails, upgrade the process.</p>
<h3>Stop AI rabbit holes before they start</h3>
<p>Before building anything, ask two questions:</p>
<ol>
<li>How long will this take?</li>
<li>What will it actually do for me?</li>
</ol>
<p>Use those answers to stay on needle-moving work rather than getting lost in tools, experiments, or elaborate builds.</p>
<h3>Use the decision hierarchy</h3>
<p>For every task, make the decision in this order:</p>
<ol>
<li>Can myOS or an agent do it?</li>
<li>Can Jill or Tooba do it well, and is it worth the management overhead?</li>
<li>If neither applies, do it yourself.</li>
</ol>
<p>Delegation is not just assigning a task. It means giving the person a process that makes the expected result hard to misunderstand.</p>
<h3>Protect authenticity</h3>
<p>Anything AI must be obviously labelled AI. Never use AI to impersonate Joe on his main account. Real content comes from a real person. AI content is clearly marked as AI.</p>
<h3>Serve, do not squeeze</h3>
<p>Lead with value. Do not force email opt-ins on giveaways. Protect unsubscribe rates and domain reputation by delivering the giveaway's value without an email gate. Joe's operating philosophy is simple: serve people, do not squeeze them.</p>
<h2>Your Default Move</h2>
<p>When you are unsure what to do next, return to the mission: what is most likely to help fill Cohort 4 of Level 1 or increase sales? Move that forward quickly, make the process better when it breaks, and build the team around repeatable execution.</p></section><section id="setup" class="chapter accent-lavender" data-sec="setup"><div class="accent-bar"></div><h1>Get Set Up</h1>
<p>This is your first job, before any sales work. Do not overthink it. Most of your day happens in the browser, and the terminal is a short one-time setup that Joe does most of for you.</p>
<p><strong>If you do only three things first, do these.</strong> They are the mission-critical ones that unlock everything else:</p>
<ol>
<li><strong>LastPass</strong> (accept the invite, set up your vault)</li>
<li><strong>Tailscale</strong> (install on your phone and laptop, sign in)</li>
<li><strong>Your $20 Claude subscription</strong> (log in and buy the plan)</li>
</ol>
<p>Everything else below can follow once those three are done. The full steps are in order.</p>
<h2>Step 1: Accept the two invites (do this first)</h2>
<p>Before anything else, accept the two invites Joe sends you:</p>
<ol>
<li><strong>Tailscale, on your phone and your laptop.</strong> This is the very first thing. Tailscale is the private network that connects your devices to the Mac Studio. Accept the invite at your Google email, then install the Tailscale app on both your <strong>phone</strong> and your laptop and sign in on each with that same Google account. The phone matters: once it is on, Joe can send you the Mission Control link and you can open the whole dashboard from your phone, anywhere.</li>
<li><strong>LastPass.</strong> Accept the family-plan invite, set up your vault, and install the browser extension. This is where every shared login you need will live.</li>
</ol>
<p>These two are number one. Everything else depends on them, and Tailscale comes first.</p>
<h2>Step 2: Your work email</h2>
<p>Your work address is <strong>illy@mastermindshq.business</strong>. This is your identity for everything else, so log in early. Go to mail.google.com and sign in with that address using the temporary password Joe sends you directly over WhatsApp (never check it into this repo). Google makes you set your own password on the first login. Use this inbox for all work, and sign up for your work tools with it. Your Claude account in the next step uses this same Google account to sign in.</p>
<h2>Step 3: Your Claude account</h2>
<p>You work inside Claude every day. Joe has already created your Claude account on the free tier under your work email, so you do not sign up from scratch. You just log in and upgrade it to the work plan.</p>
<ol>
<li>Go to claude.ai and choose "Continue with Google," then sign in with your work email, illy@mastermindshq.business. There is no separate Claude password; it uses your Google account.</li>
<li>Buy the $20 per month plan (Claude Pro, which includes Claude Code), on your own card.</li>
<li>Send Joe the receipt and he reimburses you for it. Keep it on your own card and account, never a shared login, because shared-payment workarounds get accounts banned.</li>
<li>If we need more once you are up and running, we upgrade later.</li>
<li>Install Claude Code in your terminal and on your phone so you can work MyOS from anywhere.</li>
</ol>
<h2>Step 4: Get onto the network</h2>
<p>Sign in to Tailscale on your phone and laptop with the exact email the invite went to, because your access is tied to that address. After you sign in, your account may sit as pending until Joe approves you. Once he does, open the Tailscale app and confirm you can see <code>mac-studio</code> in your machine list. When it shows up on both devices, you are on the network.</p>
<h2>Step 5: Open Mission Control (this is where most of your work lives)</h2>
<p>Mission Control is the web dashboard for the whole system, and it is the main surface you work in every day: the CRM, tasks, content, giveaways, all of it. As long as Tailscale is connected, open this link in your browser, on your laptop or your phone:</p>
<pre><code>http://mac-studio.tail781b6d.ts.net:3000/app
</code></pre>
<p>Bookmark it on both. This is the same link Joe sends you once your phone is on Tailscale, so you can pull up Mission Control on the go. Every page in the directory has its own address of the form <code>http://mac-studio.tail781b6d.ts.net:3000/app/...</code>. If the name ever will not resolve, use <code>http://100.65.249.97:3000/app</code> instead. Once this loads, you are operational. The terminal in the next step is for driving the deeper system, and you do not need it to start.</p>
<h2>Step 6: Get into the terminal (Joe sets this up for you)</h2>
<p>Joe already sent you the key for this in a separate email, so there is nothing to generate and nothing to send back. Getting into the terminal is the one to knock out as soon as you can.</p>
<ol>
<li>Joe emailed you a password-protected zip, <code>illy-ssh-key.zip</code>, and sent the password to open it on WhatsApp. Unzip it, then move the key file inside into your <code>.ssh</code> folder on your laptop:</li>
</ol>
<p><code>mkdir -p ~/.ssh &amp;&amp; mv ~/Downloads/illy_myos ~/.ssh/illy_myos
   chmod 600 ~/.ssh/illy_myos</code></p>
<ol start="2">
<li>Add a shortcut so you never type the long address. Open <code>~/.ssh/config</code> (create it if it does not exist) and paste the block Joe sends with the key. It looks like this:</li>
</ol>
<p><code>Host illy illy1 illy2 illy3
     HostName mac-studio.tail781b6d.ts.net
     User myos
     IdentityFile ~/.ssh/illy_myos
     RequestTTY yes
     RemoteCommand $SSH_ORIGINAL_COMMAND</code></p>
<ol start="3">
<li>Connect:</li>
</ol>
<p><code>ssh illy</code></p>
<p>You land straight inside a personal, persistent workspace called a tmux session. You have four of them: <code>illy</code>, <code>illy1</code>, <code>illy2</code>, <code>illy3</code>. Open a specific one with <code>ssh illy2</code>. They stay alive between connections, so when you disconnect and come back your work is exactly where you left it. To step away without losing anything, press <code>Ctrl-b</code> then <code>d</code>. If the shortcut ever fails, the long form is <code>ssh myos@mac-studio.tail781b6d.ts.net illy</code>, or with the numeric address <code>ssh myos@100.65.249.97 illy</code>.</p>
<p>You have restricted access to certain financial pages, by design. They are not part of your work, and a few are listed in the Mission Control map so you know which ones to leave alone.</p>
<h2>Troubleshooting</h2>
<ul>
<li>Connection refused or permission denied: Tailscale may be off, or Joe has not finished switching on your key. Confirm Tailscale is on and <code>mac-studio</code> is visible, then check with Joe.</li>
<li>Host not found: use the numeric address <code>100.65.249.97</code> for both the terminal and the browser.</li>
<li>Dashboard will not load but the terminal works: try the numeric browser address <code>http://100.65.249.97:3000/app</code> and hard-refresh.</li>
</ul>
<h2>The rest of your setup</h2>
<p>Once you are in, finish these. The ones marked "Joe" arrive from him; you do your half when they land.</p>
<ul>
<li><strong>LinkedIn and Instagram access:</strong> your two priority channels. LinkedIn is a safe shared login through LastPass; Instagram is a Meta Business Manager seat, a ManyChat seat, and the shared account login. Full steps are in the Social Channels section.</li>
<li><strong>Work-only profile on your Mac:</strong> keep this role siloed from your personal browsing in its own macOS user profile.</li>
<li><strong>From Joe:</strong> Google Drive (the 0_MyOS folder, already shared), the social logins via LastPass, and your Slack user on the financial-approvals channel.</li>
<li><strong>From you, this week:</strong> record a short walkthrough video of the AI skills and tools you have built, and send it to Joe so he can gauge where to start. Casual is fine.</li>
</ul>
<h2>The pages you will use most</h2>
<p>You do not need the whole system on day one. These are the handful you will live in. The full map is in the Mission Control reference at the end.</p>
<table>
<thead>
<tr>
<th>Page</th>
<th>Path</th>
<th>For</th>
</tr>
</thead>
<tbody>
<tr>
<td>Daily Briefing</td>
<td><code>/app/daily-briefing</code></td>
<td>Your morning priorities</td>
</tr>
<tr>
<td>Task Board</td>
<td><code>/app/tasks</code></td>
<td>Your work, in "Human Must Do"</td>
</tr>
<tr>
<td>CRM</td>
<td><code>/app/crm</code></td>
<td>Your warm leads</td>
</tr>
<tr>
<td>WhatsApp-Joe</td>
<td><code>/app/whatsapp-chat</code></td>
<td>Warm sales conversations</td>
</tr>
<tr>
<td>Content Hub</td>
<td><code>/app/content-creation</code></td>
<td>Reels, hooks, clips</td>
</tr>
<tr>
<td>ManyChat Giveaways</td>
<td><code>/app/manychat-giveaways</code></td>
<td>Funnels</td>
</tr>
<tr>
<td>Instagram Analytics</td>
<td><code>/app/instagram-analytics</code></td>
<td>Performance</td>
</tr>
<tr>
<td>The People</td>
<td><code>/app/employees</code></td>
<td>Who is who on the team</td>
</tr>
</tbody>
</table>
<h2>Quick reference</h2>
<table>
<thead>
<tr>
<th>What</th>
<th>Where</th>
</tr>
</thead>
<tbody>
<tr>
<td>This guide</td>
<td>decks.mastermindshq.business/illy</td>
</tr>
<tr>
<td>Mission Control</td>
<td>http://mac-studio.tail781b6d.ts.net:3000/app</td>
</tr>
<tr>
<td>MHQ site</td>
<td>mastermindshq.business</td>
</tr>
<tr>
<td>Branded checkout</td>
<td>mastermindshq.business/api/mhq-checkout?deal=SLUG</td>
</tr>
<tr>
<td>Shared logins</td>
<td>LastPass vault</td>
</tr>
</tbody>
</table></section><section id="people" class="chapter accent-rose" data-sec="people"><div class="accent-bar"></div><h1>The People You Work With</h1>
<p>Masterminds HQ runs on a small, distributed team. You manage two of them directly, Jill and Tooba. Ronnie is your operational lifeline, especially while Joe is offline. The rest keep the wider business and Joe's life running so the marketing engine can focus. Here is who is who and what to go to each person for.</p>
<div class="people-grid">
<div class="person"><div class="person-head"><img class="avatar" src="data:image/jpeg;base64,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" alt="Illy"><div><h3>Illy</h3><p class="role">GTM owner ,  marketing, sales, growth (Mastermind first)</p></div></div><p>Greece → Bali (in person from Sep 14) (Greece (6h behind Bali))</p><p class="ask">This is you. GTM, sales and marketing for Masterminds HQ and Meta Ads.</p><p style="color:rgba(157,143,224,.7);font-size:.78rem">illy@mastermindshq.business</p></div>
<div class="person"><div class="person-head"><img class="avatar" src="data:image/jpeg;base64,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" alt="Ronnie"><div><h3>Ronnie</h3><p class="role">Right-hand / lead collaborator ,  ads project, VBS financial reviews</p></div></div><p>Canada (1 month, normally Bali)</p><p class="ask">Joe&#x27;s right-hand and the operations approval point while Joe is offline. Go to him for access, systems help, and anything that needs an operational decision.</p><p style="color:rgba(157,143,224,.7);font-size:.78rem">ransara@gmail.com · +6281337352665</p></div>
<div class="person"><div class="person-head"><img class="avatar" src="data:image/jpeg;base64,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" alt="Jill"><div><h3>Jill</h3><p class="role">Virtual Assistant ,  LinkedIn cleanup, community mgmt, lead magnets, branding</p></div></div><p>Philippines (GMT+8)</p><p><strong>Reports to you.</strong></p><p class="ask">Your VA. She handles Canva, carousels, video support, and LinkedIn and Instagram engagement. Hand her the LinkedIn cleanup and content execution once you have the plan.</p><p style="color:rgba(157,143,224,.7);font-size:.78rem">Villegas.verjill136@gmail.com · +639971806423</p></div>
<div class="person"><div class="person-head"><img class="avatar" src="data:image/jpeg;base64,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" alt="Tooba"><div><h3>Tooba</h3><p class="role">Video editor (full-time, hired via Upwork mid-2024)</p></div></div><p>Pakistan</p><p><strong>Reports to you.</strong></p><p class="ask">Your video editor (full-time). She cuts Reels, testimonial clips, and promos, and holds the ElevenLabs voice and avatar assets. Direct her creative to brand.</p><p style="color:rgba(157,143,224,.7);font-size:.78rem">tooba.daudali@gmail.com · +923197674288</p></div>
<div class="person"><div class="person-head"><span class="avatar avatar-fallback">AF</span><div><h3>Alex Feldman</h3><p class="role">Teaching Assistant</p></div></div><p></p><p class="ask">Teaching assistant. Supports the mastermind sessions.</p></div>
<div class="person"><div class="person-head"><span class="avatar avatar-fallback">JC</span><div><h3>Joe Che</h3><p class="role">Founder / Owner</p></div></div><p>Bali, Indonesia (GMT+8)</p><p class="ask">The boss. Your mission is his mission: increase sales for Masterminds HQ.</p></div>
<div class="person"><div class="person-head"><img class="avatar" src="data:image/jpeg;base64,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" alt="Made"><div><h3>Made</h3><p class="role">Personal / household assistant</p></div></div><p>Bali, Indonesia</p><p class="ask">Household and villa assistant in Bali. Not part of your marketing work.</p></div>
<div class="person"><div class="person-head"><img class="avatar" src="data:image/jpeg;base64,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" alt="Sri"><div><h3>Sri</h3><p class="role">Bookkeeper / tax accountant ,  PT Heliconia Cantik, Bloom, VBS</p></div></div><p>Indonesia (GMT+8)</p><p class="ask">Bookkeeper and accountant. Finance and tax, not something you will touch day to day.</p></div>
<div class="person"><div class="person-head"><img class="avatar" src="data:image/jpeg;base64,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" alt="Sri R."><div><h3>Sri R.</h3><p class="role">Airbnb / villa manager</p></div></div><p>Bali (GMT+8)</p><p class="ask">Manages Joe&#x27;s Bali villa. Not part of your marketing work.</p></div>
</div></section><section id="cohort4" class="chapter accent-purple" data-sec="cohort4"><div class="accent-bar"></div><h1>Cohort 4 Sales Plan</h1>
<blockquote>
<p>DRAFT FOR JOE'S REVIEW</p>
</blockquote>
<h2>Objective and operating rule</h2>
<p>Fill Cohort 4 of Joe Che's Business Automation Mastermind, Level 1, before it starts on Monday, August 10 at 07:30 Bali time. Level 1 is a 12-week implementation program with three bonus weeks.</p>
<p>The immediate priority is conversion, not new traffic. Your warm pool is the CRM strong_interest segment (18 people) plus negotiating_scholarship (4 people); work that segment as your warm list. Joe's "about eight warm people at about $1,800 each, or about $10,000 of potential revenue" is his shorthand for the highest-intent slice of that segment, not a separate roster.</p>
<p><strong>Your Phase A test.</strong> Per the employee record Joe set on July 17, your first measurable assignment is owning the Cohort 4 Scholarship Track sales cycle: working that warm segment plus new signups before the August 10 start. This is the thing Joe decides Phase B on. The "$1,800" framing and the "Scholarship Track ($150/month)" assignment are the same pool at two price points, not two groups. Lead with the Scholarship Track ($150/mo, cohort4-scholarship) as your Phase A assignment, then step up to Momentum for anyone who can pay more: momentum-upfront ($1,800 once) for full payers, momentum-monthly ($799/mo x3) for monthly payers. One named lead is already on record: <strong>Danielle Martinak</strong> (CRM, qualified, strong interest, confirmed hot lead from Joe on 2026-07-17). Start there.</p>
<p>Work in this order:</p>
<ol>
<li>Close the existing warm interest.</li>
<li>Activate alumni referrals.</li>
<li>Push the warm audience through LinkedIn, Instagram, ManyChat, and workshops.</li>
<li>Only expand beyond those channels if the first three are complete and the cohort still needs people.</li>
</ol>
<p>Joe wants LinkedIn to receive about 60 to 80% of effort and Instagram about 20 to 40%. TikTok is low priority. During the warm-up period, Joe wants second eyes on all content.</p>
<h2>Non-negotiable checkout rule</h2>
<p>Use a branded MHQ checkout URL, never a raw Stripe link:</p>
<p><code>https://mastermindshq.business/api/mhq-checkout?deal=&lt;slug&gt;</code></p>
<p>All four deal slugs below are current and approved as the Cohort 4 checkout source of truth. The "legacy" note in the July 9 offer ladder referred only to old raw Stripe links, not to these branded ?deal= routes. Use momentum-monthly and momentum-upfront freely with any warm prospect; use friend and cohort4-scholarship only for a specific person Joe names.</p>
<table>
<thead>
<tr>
<th>Deal slug</th>
<th>Price</th>
<th>Use only when</th>
<th>Branded checkout</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>momentum-monthly</code></td>
<td>$799/month for 3 months, anchored against $1,499/month</td>
<td>A warm prospect wants to pay monthly. Approved and open to any warm prospect.</td>
<td><a href="https://mastermindshq.business/api/mhq-checkout?deal=momentum-monthly">Open monthly checkout</a></td>
</tr>
<tr>
<td><code>momentum-upfront</code></td>
<td>$1,800 one time, described as Best Value and $599/month equivalent</td>
<td>A warm prospect is ready to pay upfront. This matches the approximately $1,800 price Joe described for the highest-intent warm people. Approved and open to any warm prospect.</td>
<td><a href="https://mastermindshq.business/api/mhq-checkout?deal=momentum-upfront">Open upfront checkout</a></td>
</tr>
<tr>
<td><code>friend</code></td>
<td>$999, then $299/month forever, coupon <code>iCB6zFJL</code></td>
<td>A direct friend guest or a person Joe specifically names. Named-person exception only, one at a time.</td>
<td><a href="https://mastermindshq.business/api/mhq-checkout?deal=friend">Open friend checkout</a></td>
</tr>
<tr>
<td><code>cohort4-scholarship</code></td>
<td>$150/month with a 12-month commitment</td>
<td>A scholarship recipient Joe selects. Do not promote this publicly to backfill paying seats.</td>
<td><a href="https://mastermindshq.business/api/mhq-checkout?deal=cohort4-scholarship">Open scholarship checkout</a></td>
</tr>
</tbody>
</table>
<h2>Tomorrow: build the warm-close board</h2>
<p>Starting Sunday, July 19, create one row for each of the approximately eight warm people. Do not begin broad promotion until every row has an owner and next action.</p>
<table>
<thead>
<tr>
<th>Field</th>
<th>What to record</th>
</tr>
</thead>
<tbody>
<tr>
<td>Name and contact channel</td>
<td>Pull from the CRM strong_interest and negotiating_scholarship segments (/app/crm); add the contact channel from WhatsApp, DMs, or calls.</td>
</tr>
<tr>
<td>Source and context</td>
<td>Why they expressed interest, when, and any relevant conversation context.</td>
</tr>
<tr>
<td>Deal approved</td>
<td>One approved deal slug from the table above.</td>
</tr>
<tr>
<td>Stage</td>
<td>Use the pipeline stages below.</td>
</tr>
<tr>
<td>Next action and due date</td>
<td>One specific action, not a vague follow-up.</td>
</tr>
<tr>
<td>Owner</td>
<td>Illy, Joe, or another named owner.</td>
</tr>
<tr>
<td>Outcome</td>
<td>Paid, declined, no response, or another factual outcome.</td>
</tr>
</tbody>
</table>
<h2>Warm-interest outreach sequence</h2>
<p>Use personal DMs or voice notes for pending prospects, following the approach used in the Cohort 3 fill plan. Make each message specific to the person and their prior context. Do not send a raw Stripe link.</p>
<ol>
<li><strong>Prepare:</strong> verify the person, their context, approved deal, and checkout URL. Lead with the Scholarship Track link (cohort4-scholarship) for the warm pool; use momentum-upfront for anyone ready to pay in full and momentum-monthly for monthly payers. If a person's context is missing, gather it from the CRM before sending rather than guessing.</li>
<li><strong>First message:</strong> send a short personal DM or voice note. State that Cohort 4 starts August 10 and ask whether they want help choosing a path or want the approved checkout link.</li>
<li><strong>Send the link only after interest:</strong> use the approved branded checkout URL for that deal. Record the exact slug sent and the time sent.</li>
<li><strong>Follow-up:</strong> if there is no reply, send one concise personal follow-up that asks for a clear yes, no, or question. Keep the next action and due date on the board.</li>
<li><strong>Decision support:</strong> if they have a question or a custom situation, route it to Joe while he is present. Do not invent pricing, scholarship terms, deadlines, or commitments.</li>
<li><strong>Close the loop:</strong> mark paid, declined, or nurture. For a paid person, run the standard onboarding recipe (confirmed-payment webhook, intake form by WhatsApp and email) and flag them for group-add. The Cohort 4 WhatsApp group does not exist yet; do not create it until Joe gives the go-ahead, and hold each paid member's group-add until it exists.</li>
</ol>
<p>Suggested first-message structure:</p>
<blockquote>
<p>Hey [name], you mentioned [specific context] about joining Joe's next Mastermind. Cohort 4 starts August 10. Do you want me to help you choose the right option, or send you the approved checkout link?</p>
</blockquote>
<h2>Handling objections</h2>
<p>When a warm lead pushes back, you are not overcoming them, you are helping them get clear. Lead with the same serve, do not squeeze posture Joe uses everywhere: short, warm, specific, and honest. Never invent a deadline, a price, or scarcity to force a close. Here are the objections you will hear most and a way to meet each one.</p>
<p><strong>It is too expensive, or I cannot afford it right now.</strong> Name it plainly, then reframe to the cost of staying as they are: most people felt the same before they saw what one system they built paid back. Ask what the current way of working is already costing them in time. If they are a genuine fit for the Scholarship Track, tell them it exists and that you can raise it with Joe, without promising terms or a spot.</p>
<p><strong>I have tried other courses and they did not work.</strong> Agree, then separate this from those. It is not a course you watch, it is a room of business owners building the real systems alongside you with feedback. You leave with something running, not more notes.</p>
<p><strong>How is this different from just using ChatGPT myself.</strong> ChatGPT is a tool. This is the operating system around it: the workflows, the delegation, the systems that make the tool run your business instead of you babysitting it. Plenty of people have the tool and still feel just as busy.</p>
<p><strong>Let me think about it.</strong> Do not push. Make the next step tiny: ask what is the one thing they would want to be sure of before it is a yes. That surfaces the real objection so you can answer it now rather than let them sit on a maybe.</p>
<p><strong>I do not have time to add another thing right now.</strong> That is the exact problem it solves. They do not have a time problem, they have a systems problem disguised as a time problem, and this is where they build the thing that gives the time back.</p>
<p><strong>Can I join a later cohort instead.</strong> Be honest, not pushy. This one starts August 10, and there is no next cohort scheduled yet. If timing is the only thing holding them, say so plainly and offer to keep them close for this one rather than have them wait with no date.</p>
<p>After any objection, end on the one concrete next step: send the approved checkout link, answer the remaining question, or route a custom situation to Joe. Never leave it hanging, and never invent pricing, deadlines, or urgency.</p>
<h2>Follow-up cadence</h2>
<p>One message is not a follow-up. Warm leads need a sequence, always personal, always logged on the warm-close board so you never double-message or lose track. The default rhythm per lead:</p>
<table>
<thead>
<tr>
<th>Touch</th>
<th>When</th>
<th>Channel</th>
<th>Content</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>Day 0</td>
<td>DM or voice note where they know you</td>
<td>Personal opener, the offer, one clear next step</td>
</tr>
<tr>
<td>2</td>
<td>Day 2 to 3</td>
<td>Same channel</td>
<td>Short nudge plus one piece of value: a result, a testimonial, or an answer to a likely objection</td>
</tr>
<tr>
<td>3</td>
<td>Day 5 to 6</td>
<td>Escalate the channel, DM to WhatsApp voice note</td>
<td>Warm personal check-in, still glad to help them choose</td>
</tr>
<tr>
<td>4</td>
<td>Day 8 to 9</td>
<td>WhatsApp or a quick call</td>
<td>Final direct nudge before the August 10 start</td>
</tr>
</tbody>
</table>
<p>Stop the moment they say no or ask you to stop, and move them to nurture rather than keep pushing. Route any custom situation to Joe while he is present.</p>
<h2>Warm-audience pushes</h2>
<h3>LinkedIn</h3>
<p>LinkedIn is the primary push. Its profile and content need cleanup before heavy posting, and no existing giveaways have been posted there yet.</p>
<ul>
<li>Build a short cleanup brief for Jill: identify off-brand or messy work, the profile changes needed, and the work that should be pinned. The current brand guidelines are the Brand chapter in this guide; no locked LinkedIn pin-list exists yet, so build one that pins the approved positioning, the strongest proof and testimonials, and the top wired Mastermind giveaways. Content gets Joe's second eyes during warm-up, and that is the approval.</li>
<li>After Joe approves the cleanup and first posts, publish the existing high-value giveaway inventory on LinkedIn. Do not create a new giveaway before reviewing the existing giveaway and ManyChat database.</li>
<li>Prioritize the free AI Capability Levels quiz (keyword LEVEL, wired live) as the flagship free assessment. Use it as a conversation opener and route qualified business owners toward Cohort 4 intake. Do not state specific level thresholds or "level X to Y in N days" as facts; test the follow-up with friendly people first before scaling.</li>
<li>Cross-post existing material where it costs little, while keeping most execution time on LinkedIn.</li>
<li>Label any AI content clearly as AI. Do not use AI to impersonate Joe on his main account.</li>
</ul>
<h3>Instagram and ManyChat</h3>
<p>Instagram is secondary. Use it to support the LinkedIn push and route warm interest into the approved Cohort 4 conversation.</p>
<ul>
<li>Review the giveaway and ManyChat database, then rate available giveaways for lead quality against the Level 1 ICP: conscious founders, coaches, artists, and creatives (purpose-driven, often non-technical, do not gate on revenue).</li>
<li>Use existing giveaways and the AI Capability Levels quiz to start conversations, then route qualified business-owner interest to the branded Cohort 4 checkout. That branded checkout is the intake destination for warm business-owner leads.</li>
<li>Do not ingest Instagram DMs until the Meta flow is inside Terms of Service.</li>
<li>A Meta Ads app exists (Marketing API) for the ads agent, but no approved Meta app for Instagram DM or message sending exists yet. Until a messaging app is submitted and approved (Joe is a verified business, roughly one month out), hold the hard guardrails: a maximum of 20 messages per day, human jitter, mimic Joe's sending patterns, and never ingest Instagram DMs.</li>
<li>Do not force giveaway email opt-in. The decision is made: Joe protects unsubscribe rate and domain reputation by serving rather than squeezing, so deliver giveaway value without a forced email gate.</li>
</ul>
<h3>Workshop and webinar play</h3>
<p>High-value giveaways and free, prerecorded, or live workshops are the strongest play described in the meeting notes. The suggested weekly live concept is a Q&amp;A on how to use AI to double your business.</p>
<ul>
<li>Choose one workshop or webinar path that Joe approves: live, prerecorded, or free workshop.</li>
<li>Give the confirmation page one next step only. For business-owner leads, the offer ladder says that next step should be Mastermind intake.</li>
<li>Keep the workshop focused on value. The "How to use AI to double your business" weekly Q&amp;A is an approved concept, not a scheduled event. Draft one value-first workshop plan with a single next step (Mastermind intake) and get Joe's sign-off before publishing or inviting anyone. Do not commit to a recurring cadence until after the first run is reviewed.</li>
<li>Do not use cold email in this sprint. The meeting notes place it after one to two months of domain warm-up.</li>
</ul>
<h3>Alumni referrals</h3>
<p>Run this immediately after the warm-interest board is live.</p>
<ul>
<li>Ask each alumni member who received real value for one specific referral by name, not a generic referral request.</li>
<li>Give alumni a short forwardable invitation and ask for an introduction.</li>
<li>Route referred people into the same warm-close board and use the same approved-deal process.</li>
<li>Do not publicly open scholarships to backfill paying seats. The Cohort 3 plan treated scholarships as pre-allocated for qualifying applicants selected by Joe.</li>
</ul>
<p>Suggested forwardable invitation:</p>
<blockquote>
<p>Hey, you know Joe's mastermind I'm in. He's opening Cohort 4 starting August 10. If you've been hitting a ceiling running everything yourself, I think it's the room for you. Want me to introduce you?</p>
</blockquote>
<h2>Calendar: July 19 to August 10</h2>
<p>Joe is present until August 23, then fully offline from August 23 to September 10. Use the time before August 10 to get decisions, approvals, link confirmation, and handoffs resolved. The first two Cohort 4 sessions occur while Joe is present.</p>
<table>
<thead>
<tr>
<th>Window</th>
<th>Primary outcome</th>
<th>Concrete work</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Sun Jul 19 to Sat Jul 25</strong></td>
<td>Every warm person has a verified next action.</td>
<td>Build and complete the warm-close board from the CRM strong_interest and negotiating_scholarship segments. Assign the approved deal slug per person: scholarship first, Momentum for those who can pay more. Send the first personal messages. Start a daily paid-seat and pending-lead report. Build the LinkedIn cleanup brief for Jill. Ask alumni for one named referral each.</td>
</tr>
<tr>
<td><strong>Sun Jul 26 to Sat Aug 1</strong></td>
<td>Warm conversions are actively moving and the first audience push is live.</td>
<td>Follow up on every warm row. Send approved branded checkout links only after interest. Complete the approved LinkedIn cleanup and begin posting existing giveaways. Review and rank giveaway and ManyChat inventory. Lock the workshop or webinar decision with Joe.</td>
</tr>
<tr>
<td><strong>Sun Aug 2 to Sat Aug 8</strong></td>
<td>Close remaining warm opportunities and prepare the cohort handoff.</td>
<td>Run the approved workshop or webinar and give it one Mastermind next step. Make a final personal outreach pass to warm people who engaged but did not enroll. Continue alumni introductions. Confirm paid members, onboarding needs, and the Cohort 4 WhatsApp-group plan with Joe.</td>
</tr>
<tr>
<td><strong>Sun Aug 9</strong></td>
<td>Launch readiness is factual and visible.</td>
<td>Reconcile paid seats, approved scholarships, friend guests, outstanding warm people, and new applications. Escalate every unresolved prospect or operational gap to Joe while he is still available.</td>
</tr>
<tr>
<td><strong>Mon Aug 10</strong></td>
<td>Cohort 4 begins at 07:30 Bali.</td>
<td>Stop treating the pipeline as a loose list. Hand off confirmed participant and onboarding information using the Joe-approved process. Keep the sales board current for late or future interest.</td>
</tr>
</tbody>
</table>
<h2>Daily scorecard</h2>
<p>Track these numbers every morning and include them in the end-of-day report:</p>
<ol>
<li>Paying seats sold.</li>
<li>Scholarship seats assigned.</li>
<li>Friend guests confirmed.</li>
<li>Outstanding warm people, out of the verified starting list.</li>
<li>New applications in the last 24 hours.</li>
<li>Warm conversations started today.</li>
<li>Approved checkout links sent today, by deal slug.</li>
<li>Paid conversions today, by deal slug.</li>
<li>Alumni referral introductions requested and received.</li>
<li>LinkedIn posts published and giveaway responses.</li>
<li>Instagram messages sent, capped at 20 per day until the Meta app is approved.</li>
</ol>
<p>If paying-seat sales stall for two consecutive days, escalate to the gap-close work: personal outreach to engaged warm people, alumni referral follow-up, and Joe's decision on the next honest action. Do not create fake urgency or invent a deadline.</p>
<h2>Pipeline stages</h2>
<p>Use one stage per person. Every person must also have a next action and due date.</p>
<ol>
<li><code>Unverified interest</code></li>
<li><code>Verified warm lead</code></li>
<li><code>First personal outreach sent</code></li>
<li><code>In conversation</code></li>
<li><code>Approved deal selected</code></li>
<li><code>Branded checkout sent</code></li>
<li><code>Paid</code></li>
<li><code>Onboarding handoff</code></li>
<li><code>Nurture later</code></li>
<li><code>Closed lost</code></li>
</ol>
<h2>Settled operating decisions</h2>
<ol>
<li>Work the CRM warm pool in <code>/app/crm</code>: <code>strong_interest</code> (18) plus <code>negotiating_scholarship</code> (4). The approximately eight warm people are the highest-intent slice, not a separate list.</li>
<li>There is no fixed numeric seat cap. Keep the room intentionally small, fill quality warm demand, and track paid, scholarship, and friend counts on the daily scorecard. Escalate the mix to Joe.</li>
<li>All four branded deal routes are approved. The legacy note applies only to old raw Stripe links.</li>
<li><code>friend</code> and <code>cohort4-scholarship</code> are exception deals for a specific person Joe names, one at a time. Never open scholarships publicly to backfill paying seats.</li>
<li>The branded Cohort 4 checkout is the intake destination. After payment, run the confirmed-payment webhook and send the intake form by WhatsApp and email. The WhatsApp group does not exist and must not be created until Joe gives the go-ahead.</li>
<li>Use the Brand chapter as the current guidelines. Pin approved positioning, the strongest proof or testimonials, and top wired Mastermind giveaways. Joe gives second eyes on content during warm-up.</li>
<li>Promote only active, wired-live ManyChat giveaways after verifying their live destination and connected flow. The <code>LEVEL</code> quiz is the live certification-funnel entry point and routes qualified business owners toward Cohort 4 intake.</li>
<li>No approved Meta app exists for Instagram DM sending. Maintain the 20-DM daily cap, human jitter, Joe-like patterns, and the no-ingestion rule while a compliant messaging app is pending.</li>
<li>The weekly Q&amp;A is an approved concept only. Draft one value-first workshop plan with Mastermind intake as the single next step and obtain Joe's sign-off before publishing or inviting anyone.</li>
<li>Do not force giveaway email opt-in.</li>
</ol></section><section id="warm-leads" class="chapter accent-lavender" data-sec="warm-leads"><div class="accent-bar"></div><h1>Your Warm Leads</h1>
<p>Welcome to the part of the pipeline that is yours to own.</p>
<p>Here is how the work splits. Joe personally closes the hottest leads, the people who are one conversation away from paying and who already have a direct line to him. You own the warm pool: the people who have raised their hand for the Mastermind, who are interested, negotiating, or sitting on an offer, but who need someone to walk alongside them and carry the conversation to a yes. This is the larger, higher-leverage group, and it is where your work moves the number.</p>
<p>Warm does not mean lukewarm. Almost everyone in your pool has already spoken with Joe, received a link, asked about price, or signed up on the waitlist. The relationship exists. Your job is to pick it up where it was left and move it forward. Closing this warm pool is your immediate job. Opening new channels to bring in your own people, covered in the Playbook and the Two Engines chapter, is where you go next and fast.</p>
<h2>Your first working session with Joe</h2>
<p>Before you send a single message, you and Joe sit down and walk through every warm lead together, one by one. This session exists for one reason: relationship context that is not written down anywhere.</p>
<p>The CRM tells you a person's status and their last message. It does not tell you that someone was referred by a mutual friend, that another person is waiting on their boss to approve the spend, or that a third has known Joe for years and is only quiet because life got busy. Joe carries that context in his head. The walkthrough is how it gets transferred to you.</p>
<p>For each lead, ask Joe:</p>
<ul>
<li>How do you know this person? Where did they first come in?</li>
<li>What has actually been said about price, timing, and fit?</li>
<li>What is the real reason they have not said yes yet?</li>
<li>What is the one thing that would move them?</li>
</ul>
<p>Take notes directly against each lead as you go. By the end of the session you should be able to open any name in your pool and know exactly what to say next. A full lead-by-lead brief has been prepared for this session, with relationship depth pulled from the message history, so you both start from the same page.</p>
<h2>How to work each status</h2>
<p>Your warm pool is sorted by status. Each status is a different distance from the finish line, and each is worked differently.</p>
<p><strong>Awaiting payment.</strong> These people have already said yes to a specific offer. There is a number and terms on the table, sometimes a payment link already sent. Your job is not to sell, it is to remove friction and get the payment in. Chase gently, resend the link, answer the last small question. If the terms were never fully nailed down, that is the first thing to close before you ask for money.</p>
<p><strong>Negotiating scholarship.</strong> These people want in and are working out how to afford it. The conversation is about finding a number and a structure that works for both sides, not about whether they want it. Learn their real budget, then bring a scholarship or payment-plan proposal that still clears the Mastermind rate. Watch for employer-funded angles, some are trying to get a boss to cover the cost.</p>
<p><strong>Strong interest.</strong> The biggest group and the widest range. Some have deep, years-long history and only need re-warming. Some are brand-new waitlist signups with nothing but an email. Some have received a link and gone quiet. Read the relationship depth before you write: a person with hundreds of messages back and forth is opened very differently from someone Joe messaged yesterday who has not replied. Your goal here is to qualify and move them toward a real offer conversation. Match the warmth of your opener to the warmth of the history.</p>
<p>A few practical reads that will save you time:</p>
<ul>
<li>If the history is mostly one-directional, with your side sending and little coming back, earn a reply before you push. One more warm, useful message, then park if it stays silent.</li>
<li>If someone asked about one-on-one support, that is a buying signal. Steer it toward the Mastermind and show them the fit.</li>
<li>If a long relationship has gone quiet for months, do not open cold. Reference the shared history first, then re-open the door.</li>
<li>A waitlist signup with no name is still a real lead. Reach out, get their name, and qualify from the start.</li>
</ul>
<h2>Where the leads live</h2>
<p>Everything is in the CRM, which you can open in Mission Control at <code>/app/crm</code> or read from the database at <code>~/.myos/workspace/data/crm.db</code>.</p>
<p>Your warm pool is the set of contacts on the mastermind project whose pipeline status is one of: awaiting_payment, negotiating_scholarship, or strong_interest. For each person, the detail you need is spread across a few places: the contact record holds name, phone, email, source, and notes; the communications log holds the message-by-message history of what has been said, including the exact links and offers that went out; the pipeline history shows how a lead moved from one status to the next.</p>
<p>When a lead looks thin, with no notes and no history, that is real information too. It means the context lives with Joe, not in the file, and it is exactly what your walkthrough session is for. Never fill a gap with a guess. If the data does not say it, ask.</p>
<h2>The rhythm of the work</h2>
<p>Walk the pool with Joe. Capture the context. Then work top-down: closest to the line first. The people awaiting payment are worth an hour today. The negotiations are worth a focused proposal this week. The strong-interest group is your steady, daily qualifying work.</p>
<p>This pool is warm because real relationships are already in it. Treat every name as a person Joe has a connection with, because that is what they are. Close it, and then turn your attention to filling the top of the funnel yourself.</p></section><section id="engines" class="chapter accent-rose" data-sec="engines"><div class="accent-bar"></div><h1>Your Two Engines: MHQ Sales and Meta Ads</h1>
<p>You run two engines for Joe. The first is Masterminds HQ sales: turning warm leads, workshop attendees, and your own outreach into paying members. The second is Meta Ads: building and running the paid campaigns that feed new people into that same funnel. This chapter gives you the exact links, the deal-by-deal breakdown, the current state of the ad account, and the hard rules you never cross.</p>
<h2>Part A: MHQ Sales</h2>
<h3>The one link pattern you always use</h3>
<p>Every Masterminds HQ payment goes through one branded checkout route:</p>
<pre><code>https://mastermindshq.business/api/mhq-checkout?deal=&lt;slug&gt;
</code></pre>
<p>You swap <code>&lt;slug&gt;</code> for the specific deal. That is the only link you ever send a prospect for payment. Never send a raw <code>buy.stripe.com</code> or <code>checkout.stripe.com</code> link. The branded route mints a fresh, correctly-branded checkout session every time someone opens it, shows the Masterminds HQ logo and pricing, and tags the payment so the member is onboarded automatically. A raw Stripe link shows the wrong company logo and skips that onboarding, so it is always a mistake.</p>
<p>If you ever need to point someone at the program itself rather than straight to payment, send them the homepage: <strong>https://mastermindshq.business</strong>. That is the sales page. It carries the story, the proof, the testimonials, and the pricing. Warm people who are close to ready get the checkout link. People who still need convincing get the homepage first, then the checkout link once they say yes.</p>
<h3>The deals, one by one</h3>
<p>These are the live Cohort 4 offers. Each slug drops straight into the link pattern above.</p>
<p><strong>Momentum Monthly, slug <code>momentum-monthly</code>.</strong> The 12-week program plus 3 bonus weeks, paid as three monthly payments of $799. This is the standard way most people join. Send this when someone wants to spread the cost.
<code>https://mastermindshq.business/api/mhq-checkout?deal=momentum-monthly</code></p>
<p><strong>Momentum Upfront, slug <code>momentum-upfront</code>.</strong> The exact same program, paid once at $1,800. Cheaper in total than three monthly payments, so this is your close for anyone who can pay in full. Lead with this when the person has the cash and wants the best price.
<code>https://mastermindshq.business/api/mhq-checkout?deal=momentum-upfront</code></p>
<p><strong>Friend rate, slug <code>friend</code>.</strong> The $999 per month Starter price with a permanent discount applied, so checkout shows $999 crossed out down to $299 per month, and they keep that rate for as long as they stay. This is a relationship deal, not a public one. Use it only for people Joe has named as friend-rate, never as a general discount.
<code>https://mastermindshq.business/api/mhq-checkout?deal=friend</code></p>
<p><strong>Scholarship track, slug <code>cohort4-scholarship</code>.</strong> $150 per month on a 12-month commitment. This is the access-first tier for people who genuinely cannot meet the standard price but are a strong fit. Reserve it for scholarship cases, not as a discount you offer to close a hesitant buyer.
<code>https://mastermindshq.business/api/mhq-checkout?deal=cohort4-scholarship</code></p>
<h3>How you get paid on these</h3>
<p>Your commission is a percentage of what the member actually pays, collected as they pay it. A member from Joe's warm list or from paid ads pays you 10 percent of every payment they make. A member you found and closed entirely through your own outreach pays you 15 percent. On a monthly payer, that is your cut every month they stay enrolled, and it stops if they leave, so the two of you rise and fall together. On an upfront payer, it is a single larger cut the month they pay. The warm list is written down before you start, so whose lead is whose is never in question, and a genuinely unclear case ties in your favor.</p>
<h3>How and when the money reaches you</h3>
<p>You are a contractor, not on payroll, and your commission is paid to you in Wise. Keep your own simple running tally as you close: which member, whether it was a warm or self-sourced close, and what percentage applies. That tally is what gets paid out, so keeping it yourself means a payout is never a guess, and if a payment ever looks short or missed you can raise it with Joe straight away with the receipts in hand.</p>
<h3>The second product you can sell</h3>
<p>There is also a standalone course, <strong>Meta Ads with Claude Code</strong>, slug <code>meta-ads-claude-code</code>. It is a $599 one-time payment for a 4-week course that teaches founders to run their own Meta ad campaigns through the same agent you use. Its own sales page lives at <code>https://mastermindshq.business/meta-ads-with-claude-code</code>, and the checkout is the usual pattern:
<code>https://mastermindshq.business/api/mhq-checkout?deal=meta-ads-claude-code</code></p>
<p>This one is a natural bridge: people who come in through the ads you run often want to learn the machine themselves, and this course is where you send them.</p>
<h2>Part B: Meta Ads</h2>
<p>Your second mandate is the paid engine. The goal is simple: run ads that put the right founders in front of the offer, then move them into the MHQ funnel you just learned. The mechanics below are already built and waiting.</p>
<h3>The current state of the ad account</h3>
<p>The account is live and set up. Here is what exists right now:</p>
<ul>
<li><strong>Ad account:</strong> <code>act_53375255</code>, under the name Joe Che.</li>
<li><strong>Business Manager:</strong> <code>joe.che.tandle</code>.</li>
<li><strong>Instagram identity for ads:</strong> <code>@joe.che.official</code>.</li>
<li><strong>Facebook Page:</strong> The Connection Map.</li>
<li><strong>The ads app:</strong> MyOS Ads, running on Marketing API v21.0.</li>
</ul>
<p>A full book-launch campaign is already built inside this account and sitting <strong>paused</strong>. Two ad sets, several creatives, and the ad copy are all staged and ready. Nothing is spending. It is waiting on three human decisions before it can run: the final go-live flip, the daily budget for each ad set, and a decision on whether to narrow the audiences, which are currently wider than ideal. That paused campaign is your starting material, not a blank page.</p>
<h3>The golden rule of this engine</h3>
<p><strong>Every object the agent creates is created paused. A human reviews it and flips it live. The agent never starts spend on its own.</strong> This is the single design decision that makes it safe to run a live ad account. You keep it. When you build a campaign, it lands paused. You review it against the checklist, you set a budget you can afford to lose for a week, and only then does it go live. The most expensive habit in advertising is panic-editing a fresh campaign on day two, so once a campaign is live and learning, you leave it alone for seven days and let it gather data.</p>
<h3>What to do first</h3>
<ol>
<li><strong>Read the paused book campaign.</strong> Pull it up in the agent, read the two ad sets, the targeting, and the creative copy. This is how Joe's real targeting works: one box for who the person is, one box for what they want, intersected so the audience is narrow. Understand it before you build your own.</li>
<li><strong>Draft offline before you touch Meta.</strong> The agent has an offline copilot. Describe an offer, an audience, a goal, a link, and a daily budget in plain English, and it produces a complete draft campaign as a local file with nothing touching Meta. Do your thinking here, where mistakes are free.</li>
<li><strong>Build small and paused, then activate small.</strong> When you build the real thing, everything lands paused. Run the launch checklist against it: right objective, right link, audience neither absurdly narrow nor broad, budget you can genuinely afford to lose. Then activate at ten to twenty dollars a day. Small on purpose.</li>
<li><strong>Read the numbers weekly, then scale the winner.</strong> After a campaign has run long enough to have data, pull the insights: spend, CTR, CPC per ad set. Scale the cheaper converter, pause the loser. That weekly rhythm is the whole job once ads are running.</li>
</ol>
<h3>The hard rules (never cross these)</h3>
<p>These are guardrails, not preferences. Treat every one as a hard stop.</p>
<ul>
<li><strong>Maximum 20 DMs per day.</strong> Do not exceed this ceiling on outbound direct messages, ever. Volume above this is what gets accounts flagged and killed.</li>
<li><strong>Human jitter on every send.</strong> Space messages out with natural, irregular gaps. Never fire them in a tight, evenly-timed burst. Machine-perfect timing is the signal platforms hunt for.</li>
<li><strong>Do not ingest Instagram DMs until you are inside the Terms of Service.</strong> No pulling, storing, or automating over IG direct messages until the proper approved path is in place. Stay on the compliant side of this line at all times.</li>
<li><strong>The Meta app takes roughly one month to approve.</strong> Plan around that timeline. Submit early, and do not build anything that depends on approval landing sooner.</li>
</ul>
<h3>The path to submitting the Meta app</h3>
<p>Advertising on your own ad account does not require Meta's full App Review, so the account can run ads once the app is in Live mode. Anything that reaches into messaging or data, however, needs the app submitted and approved, and that approval runs about a month, so you start it early and work in parallel while it processes. The path:</p>
<ol>
<li>The app is created under the "Create and manage ads with Marketing API" use case, which is what exposes the ads permissions in the first place.</li>
<li>To flip the app to Live mode, two public URLs must be in place in the app's Basic settings: a Privacy Policy URL and a User Data Deletion URL. Both exist as templates you can reuse.</li>
<li>Business verification at the Business Manager level unlocks higher limits and can take several days on its own. It is worth starting, but you never block a launch waiting on it. Run on the working account now and let verification catch up.</li>
<li>Submit the app for review as early as you can, then keep building the campaigns and the funnel while the roughly one-month clock runs.</li>
</ol>
<h3>How ads feed the MHQ funnel</h3>
<p>The two engines are one loop. Here is the full circuit:</p>
<p>An ad runs to the right founders. It sends them one of two ways. Either a link-click ad points straight to a sales page, or an engagement ad asks them to comment a keyword, which fires the ManyChat comment-to-DM flow and delivers the link privately. That flow is Instagram-only, so build it on the IG side. Either way, the person lands on a Masterminds HQ page. From there, the MHQ checkout links from Part A close the sale, and every member who came from paid ads pays you your 10 percent commission for as long as they stay. The ad spend fills the top of the funnel, the sales page and checkout convert, and your commission is the payoff at the bottom. The Meta Ads with Claude Code course sits alongside this as a second offer for the people who come in through the ads and then want to run the machine themselves.</p>
<h2>Your links table</h2>
<table>
<thead>
<tr>
<th>What it is</th>
<th>Link</th>
</tr>
</thead>
<tbody>
<tr>
<td>Masterminds HQ homepage (the sales page)</td>
<td>https://mastermindshq.business</td>
</tr>
<tr>
<td>Branded checkout route (swap the slug)</td>
<td>mastermindshq.business/api/mhq-checkout?deal=SLUG</td>
</tr>
<tr>
<td>Momentum Monthly, $799/mo x3</td>
<td>mastermindshq.business/api/mhq-checkout?deal=momentum-monthly</td>
</tr>
<tr>
<td>Momentum Upfront, $1,800 once</td>
<td>mastermindshq.business/api/mhq-checkout?deal=momentum-upfront</td>
</tr>
<tr>
<td>Friend rate, $999 to $299/mo</td>
<td>mastermindshq.business/api/mhq-checkout?deal=friend</td>
</tr>
<tr>
<td>Scholarship track, $150/mo</td>
<td>mastermindshq.business/api/mhq-checkout?deal=cohort4-scholarship</td>
</tr>
<tr>
<td>Meta Ads with Claude Code course, $599</td>
<td>mastermindshq.business/api/mhq-checkout?deal=meta-ads-claude-code</td>
</tr>
<tr>
<td>Meta Ads course sales page</td>
<td>mastermindshq.business/meta-ads-with-claude-code</td>
</tr>
</tbody>
</table></section><section id="linkedin" class="chapter accent-purple" data-sec="linkedin"><div class="accent-bar"></div><h2>LinkedIn: Update Guide</h2>
<p>MyOS has already ingested Joe's full LinkedIn export (March 2026) and turned it into this chapter, so you don't need to go find or read the raw export yourself. This chapter has two things: a prioritized list of what's actually wrong or stale on the live profile, and the full history underneath it for context so you're not guessing when you write anything for LinkedIn.</p>
<p>This feeds directly into the LinkedIn Cleanup SOP (<code>linkedin-cleanup-sop.md</code>, ask Joe if you don't have it yet). Use this chapter as the factual backbone: what to fix, what to keep, what to ask Joe about before touching.</p>
<p><strong>A general note on how to work with this system:</strong> anything you need to do this job, MyOS already knows. Ask it directly instead of hunting through docs. If it is not giving you good, accurate answers, that means something in the system needs fixing, not that you did something wrong, so flag it to Joe when that happens.</p>
<p><strong>On execution:</strong> if anything in this chapter is low-level, hands-on work rather than a judgment call, you can hand it to Jill. She has a task for this on her board.</p>
<h3>Fix These First (high confidence)</h3>
<ol>
<li><strong>"24+ Biz Entrepreneur" in the headline is stale.</strong> Update public copy to 26 companies (replacing 24); internal records note a real count of 35 companies, but 26 is the confirmed figure to publish publicly.</li>
<li><strong>Flagship venture is under the wrong name and has a broken date.</strong> LinkedIn lists "Business Automation Masterminds, Founder, March 2026, Present (1 month)." The current name is Masterminds HQ (the program itself is sometimes called the AI Business Mastermind). The "(1 month)" duration is wrong, this has been running much longer. Needs the real founding date and the current name.</li>
<li><strong>Rio App should no longer show "Present."</strong> Rio (the WhatsApp B2B app) shut down as of 2026-07-20. LinkedIn still lists it as an active role. Add an end date or remove the entry.</li>
<li><strong>Several active ventures show incorrect end dates.</strong> A cluster of roles all end around November 2025 or June 2023: Iron Amethyst, Glamp Nusa, Retreat Facilitator, Tierra Social, Lightning Society, Chaos Cooking, VEZA. Internal records say Tierra Social, VEZA, and Iron Amethyst Holdings are still active as of this writing. This looks like a bulk edit or reset that closed a batch of roles that shouldn't have closed. Worth checking each one with Joe rather than assuming they're all still live, since some genuinely may have ended.</li>
<li><strong>Iron Amethyst's description undersells it.</strong> LinkedIn describes it only as short-term rental management in NYC. Internal records describe Iron Amethyst Holdings as the umbrella company for the full portfolio of businesses, not just real estate. If it's still the active parent entity, the description should reflect that.</li>
<li><strong>The AI Operating System book is missing entirely.</strong> Joe is described elsewhere as a #1 bestselling author across three business and AI categories, but there's no book, no Featured section, and no publication entry anywhere on the profile. This is a real gap for someone landing on his page.</li>
<li><strong>Duplicate entry for Bali Beach Glamping Resort.</strong> Two overlapping "Partner" roles with different date ranges (Nov 2020, Present and May 2020, May 2024) for the same company. Looks like a LinkedIn data entry duplication. Needs to be merged into one clean entry.</li>
<li><strong>The summary line is thin.</strong> Currently just "Lifetime Entrepreneur and Community builder." The personal brand profile (ask Joe or check the brand-manager files) has a much stronger positioning statement that could replace this.</li>
</ol>
<h3>Open Questions for Joe</h3>
<ul>
<li>What is the real founding date of Masterminds HQ / the AI Business Mastermind, and what should the venture be called on LinkedIn?</li>
<li>What is the current, accurate company count? <em>(Resolved: 26 public-facing, 35 real internal count)</em></li>
<li>Of the ventures that show a November 2025 or June 2023 end date: which ones actually ended, and which are still active and were closed by mistake?</li>
<li>Should the AI Operating System book get its own Featured entry, a Publications entry, or both?</li>
<li>Is Iron Amethyst still the right name for the umbrella entity on LinkedIn, or should it read Iron Amethyst Holdings?</li>
</ul>
<h3>Full History (from the March 2026 export)</h3>
<p>Organized by era, not by LinkedIn's default order. Dates and details below are exactly what's on the current export, not corrected yet, use the section above to know what to change.</p>
<p><strong>Currently active on LinkedIn (needs review per above)</strong></p>
<table>
<thead>
<tr>
<th>Venture</th>
<th>Role</th>
<th>Dates (as listed)</th>
<th>Note</th>
</tr>
</thead>
<tbody>
<tr>
<td>Business Automation Masterminds</td>
<td>Founder</td>
<td>March 2026, Present (1 month)</td>
<td>Rename + fix date, see #2</td>
</tr>
<tr>
<td>Rio App</td>
<td>Co-Founder</td>
<td>Oct 2025, Present (6 months)</td>
<td>Shut down, needs end date, see #3</td>
</tr>
<tr>
<td>Heliconia Cantik</td>
<td>Founder</td>
<td>Jan 2021, Present</td>
<td>Bali real estate: fund, villas, consulting</td>
</tr>
<tr>
<td>The Connection Map</td>
<td>Founder</td>
<td>Jan 2023, Present</td>
<td>Relationship/connection framework, "Ikigirl," online courses</td>
</tr>
<tr>
<td>Iron Amethyst</td>
<td>Founder</td>
<td>June 2017, Nov 2025</td>
<td>Check if still active, see #4 and #5</td>
</tr>
<tr>
<td>Bali Beach Glamping Resort</td>
<td>Partner</td>
<td>Nov 2020, Present (+ duplicate entry)</td>
<td>Merge duplicate, see #7</td>
</tr>
</tbody>
</table>
<p><strong>Bali ventures, mostly wound down</strong></p>
<ul>
<li><strong>Glamp Nusa</strong> (Jan 2022, Nov 2025): Investor Lead, luxury clifftop resort, 40 tented villas, 28% ROI per annum, dividends paid within 2 weeks of opening.</li>
<li><strong>Bali Bloom Festival</strong> (Jan 2020, Jan 2024): world's first contributor-owned co-created festival, 1,500 global participants at peak, 120+ workshops.</li>
<li><strong>Bali Real Estate Fund</strong> (Jan 2021, June 2023): investment fund for short-term rental purchases, new construction, renovations, land banking.</li>
<li><strong>Bali Pro Visa</strong> (Jan 2021, Jan 2023): brick-and-mortar visa and business formation agency.</li>
<li><strong>Nuanu</strong> (Jan 2022, Feb 2023): Community Development Lead, 44-hectare creative city project, led a team of 4 on the largest known study of intentional communities worldwide.</li>
</ul>
<p><strong>NYC community era</strong></p>
<ul>
<li><strong>Lightning Society</strong> (Sept 2016, June 2023): co-living and event space in Bushwick, 17 residents, 500-person rooftop capacity, hundreds of events. Earlier NYC chapter: experiential events including "The Burlesquerade," a 1,200-person event Business Insider called "the best event NYC has ever seen."</li>
<li><strong>Chaos Cooking</strong> (Dec 2009, June 2023): one of the world's largest cooking communities, members and events in 52 countries and 750+ cities, was offered a TV series by Food Network and Discovery.</li>
<li><strong>Couchsurfing</strong> (Jan 2006, Jan 2011): Community Leader, early ambassador, founded the Couch Crash Festival, grew NYC meetups from a few dozen to tens of thousands.</li>
<li><strong>Disorient</strong> (2006, 2012): sound, visual art, and performance art collective.</li>
<li><strong>Tierra Social</strong> (Jan 2019, June 2023): real estate development and community-driven living, 14 properties in Tulum, Mexico.</li>
<li><strong>Circulate</strong> (Mar 2020, June 2022): community-based newsletter platform for content sharing.</li>
<li><strong>VEZA Life &amp; Business Accelerator</strong> (Jan 2023): high-level mastermind, past participants included the first employee of the Ethereum Foundation, a Hollywood director, and psychedelics and tantra experts.</li>
<li><strong>The Retreat</strong> (Oct 2019, June 2020): 40-person retreat property in Upstate New York, paused for COVID.</li>
<li><strong>WindUp</strong> (Jan 2018, Jan 2020): helped new entrepreneurs go from concept to income.</li>
</ul>
<p><strong>Sold or completed</strong></p>
<ul>
<li><strong>JuJu Vape</strong> (Dec 2018, July 2019): invented, patented, and sold a vaping device in 6 months.</li>
<li><strong>VRVR</strong> (Feb 2015, Nov 2017): virtual reality and 360-degree video production, developed early 360 video software and GoPro array syncing.</li>
</ul>
<p><strong>Foundational, pre-Bali</strong></p>
<ul>
<li><strong>NYIM Training</strong> (Jan 1999, May 2017, 18 years 5 months): New York's largest corporate business and software training company. Trained 90,000+ people, worked with Fortune 5 CEOs, the CIA, the FBI, and celebrities. Contracted to train all NY State and City University professors. This is Joe's deepest credibility anchor and should stay front and center.</li>
<li><strong>Onechord</strong> (Jan 1995, 2000): founded the largest online music community of the early internet era, hosted live music events across Buffalo, Syracuse, and Ithaca. Joe's first business with employees, started at 18.</li>
</ul>
<h3>Retreat Facilitation Highlights (separate line item on LinkedIn)</h3>
<p>Jan 2015, Nov 2025: I Am Creation Retreats (Dubai, Singapore, Bali), Unconventional Life, Angsbacka (Sweden), Ecstatica, Ozen, and many more.</p></section><section id="send-as-joe" class="chapter accent-lavender" data-sec="send-as-joe"><div class="accent-bar"></div><h2>Sending Email as Joe</h2>
<p>For anything that doesn't need to look like it came directly from Joe, use your own account and whatever's already set up for you. That covers most of what you'll send.</p>
<p>Sometimes though, something specifically needs to come from joe@mastermindshq.business, a member email, a partner follow-up, anything where it needs to look like it came directly from him.</p>
<p><strong>The process:</strong> ask Joe directly, or ask Claude/Uni to send it. Tell them exactly who it goes to and what it should say. It gets sent from Joe's own account.</p>
<p><strong>What not to do:</strong> don't try to set up your own way to send as Joe, and don't ask for delegate access or shared login credentials to his email. That's intentionally not how this works, it keeps his account fully his, with one clear place anything sent as him actually goes out from.</p>
<p>This is the standing process, not a one-time thing for right now. Use it any time.</p></section><section id="strategy" class="chapter accent-purple" data-sec="strategy"><div class="accent-bar"></div><h1>The Strategy: How Joe Thinks About Growth</h1>
<p>You were not hired to "do marketing." You were hired to increase sales. Everything in this chapter ladders up to that one number. Before you touch a single post, a giveaway, or a cold email, you need to understand how Joe thinks about growth, because his instincts here are specific, opinionated, and hard-won. Follow them and you will move fast in the right direction. Ignore them and you will produce a lot of motion that does not turn into revenue.</p>
<h2>The business you are selling</h2>
<p>Masterminds HQ sells one core thing: the <strong>Business Automation Mastermind</strong>. It is a done-with-you program. Founders join live weekly Zoom sessions and leave each session with something actually built and running in their business, and the systems they build still sound like them. That last part matters. The strongest promise in the whole business is not "learn AI." It is "you leave each session with something built, and it still sounds like you." That line converts. Lead with it.</p>
<p>The mastermind runs in cohorts. Cohort 3 has been live since June 2026. Your immediate money-maker is <strong>Cohort 4</strong>: it is already built, there is a warm pipeline of roughly 8 people at around $1,800 each, which is roughly $10,000 sitting there waiting to be closed. That warm money is your first job, not a cold-traffic campaign.</p>
<h2>The offer ladder, with real prices</h2>
<p>Joe has one offer ladder that everything flows through. Know it cold, because your job is to move people up it.</p>
<p><strong>Free entry (top of funnel):</strong>
- AI Agent giveaways (free AI agents on the MHQ giveaways page)
- Free workshops, live and pre-recorded, plus speaking gigs and in-person events
- Free soul-purpose mini-courses like Unblock and Unlock (~20 min)</p>
<p><strong>Low-ticket nurture (self-serve, warms the lead toward the core):</strong>
- The AI Agent Income Playbook book: <strong>$9.99</strong>, with a <strong>$20/mo</strong> drip subscription behind it
- AI Content Creation Lab: <strong>$97</strong>
- Build Kit (book + course + templates): <strong>$197</strong>
- A 1:1 hour with Joe (Implementation Hour / Mentorship Call): <strong>$450 to $499</strong></p>
<p><strong>The core offer (this is where the money is):</strong>
- <strong>Business Automation Mastermind.</strong> This is the one thing you sell first. Everything above this rung exists only to feed leads into it. This is the offer you quote a qualified business owner by default, using the branded checkout links in the Two Engines chapter.</p>
<p><strong>Ascension (upsell existing members):</strong>
- Mastermind Growth: <strong>$699/mo</strong> on a 6-month plan, or <strong>$3,600 upfront</strong>
- Mastermind Leader: <strong>$499/mo</strong> on a 12-month plan, or <strong>$5,400 upfront</strong> (longest commitment, lowest effective monthly)
- 6-hour One-on-One Consulting Package: <strong>$2,500</strong>
- Uncovering Your Soul Purpose: <strong>$999</strong> one-time or <strong>$333/mo x 3</strong>, a parallel life-design offer you cross-sell both directions</p>
<p><strong>Retention (post-graduation continuity):</strong>
- Alumni Circle: <strong>$97/mo</strong> founding rate, moving to <strong>$197/mo</strong>. It keeps the relationship and the revenue alive after the cohort ends.</p>
<p>There is also a side branch built on Joe's book, How to Build Your Own AI Operating System, which leads into Build With Joe and the All Sorted done-for-you install. That branch serves a different person, the technical DIY builder, not the business owner you are selling the mastermind to. Do not confuse the two ICPs. Book and builder go to Build With Joe. Business owner goes to the Mastermind.</p>
<h2>Who you are selling to</h2>
<p>Forget revenue brackets. The person you are selling to is defined by who they are, not what they earn. The mastermind's real audience is <strong>conscious founders, coaches, artists, and creatives</strong>: purpose-driven people running a business that is an expression of who they are, not a machine that eats them. Think transformational coaches, healers and wellness practitioners, embodiment and breathwork teachers, conscious-brand and creative founders, artists and makers with a real practice, values-led consultants. Most are solo or one to five people, non-technical by their own description, and very often neurodivergent or "neuro-spicy." The founder is the bottleneck, and everything depends on them.</p>
<p>A note on money, because the old version of this guide got it wrong. You will see "service founders" revenue brackets written in older docs. Those numbers are aspirational, not the truth. Plenty of the people who join, love it, and refer others are earlier-stage or on scholarship. Do not use revenue as your gate. Some traction and real clients help, but treat that as a soft preference, never a hard filter. If you disqualify on income you will screen out exactly the people this room was built for.</p>
<p>Joe has a special heart for women building soulful businesses, and the room reflects it: the cohorts run roughly four-to-one women. Honor that in the stories and faces you lead with. It is a heart, not a gate. The door stays open to everyone who fits the person above, and the men who join came through the same conscious, high-trust scene.</p>
<p>Match your language to who you are talking to. The pillar is always the same, only the word flexes: <strong>business</strong> for default small owners, <strong>ventures</strong> for bigger entrepreneurs, <strong>craft</strong> for artists, <strong>practice</strong> for healers and coaches. Speaking to a somatic coach about her "practice" and to an artist about her "craft" is how you sound like one of them instead of a marketer.</p>
<h3>The emotional job (sell this, not the feature list)</h3>
<p>They are not buying "learn AI." The job the mastermind gets hired to do is emotional. They want to feel less alone, get real accountability, be around peers at their own level, and finally make progress on the thing they have been stuck on for months. Underneath that sits one specific fear that every other AI teacher ignores and Joe resolves: <strong>"if I automate this, it will stop sounding like me, and the thing that makes my work mine will die."</strong> Their question is never "will this work," it is "will this make me generic." The promise that lands is "you leave each session with something built, and it still sounds like you." Lead with that, always.</p>
<h3>Who is a yes, and who is a no</h3>
<p>A yes sounds like someone who NEEDS this: "I'm drowning in admin," "leads are slipping," "everything depends on me," "I need to clone myself," "I want to systemize but I'm scared it'll lose my voice," "I'm not technical enough for this." That last one is a yes, not a no. Non-technical and ADHD founders are the core, not the exception.</p>
<p>A no is the person who SELLS what Joe teaches, or does not want what he offers: "I'm an automation consultant," "I help businesses systematize" is a hard no, you want the customer who needs it, never the vendor who sells it. Also out: anyone who wants AI to replace their voice rather than carry it; hype-chasers hunting shortcuts and passive income with no real practice behind them; big organizations chasing pure efficiency with no soul; and anyone who will not hear a hard, true thing. When a pre-traction person with nothing built yet shows up, they are not a no forever, point them to the book and the free workshops and invite them back when there is a real practice to build the system around.</p>
<p>Geographically, the target clusters in the digital-nomad and conscious-scene hubs: Bali first, then Thailand, Dubai, Lisbon, and the wider ring of Mexico, Costa Rica, Vietnam, and Malaysia.</p>
<p>For the full picture, read Joe's brand pages: the Personal Branding Guide at https://joe-che.com/brand/personal-brand (the "Who" section) and the master Brand Brain at https://joe-che.com/brand/brains/joe-che.</p>
<h2>How Joe thinks about growth</h2>
<p>Five principles run underneath every decision. Internalise them.</p>
<p><strong>1. One channel at a time, bullseye style.</strong> Joe runs the traction-channels method. You do not spread thin across ten platforms. You pick the single channel most likely to move the needle, you exhaust it, and only then do you move on. Right now that focus is LinkedIn, roughly 60 to 80 percent of effort, with Instagram secondary at 20 to 40 percent and TikTok a low-priority place you are free to fully AI. Cross-posting existing content costs nothing, so do it, but concentrate the real effort in one place. The current inner-circle traction bets are Bali Build Nights (an intimate in-person workshop with one live build in the room), aligned podcast guesting at scale, and a formal member referral program. Offline events are the bet most likely to move first, because they reproduce the exact warm-trust mechanic that already works.</p>
<p><strong>2. Grassroots before funnels.</strong> This business converts best on warm, high-trust contact. Referrals beat cold reach because they already carry the identity-shift value that a cold ad cannot. So the marketing job is not to spray cold reach, it is to manufacture warm trust at higher volume. You work the warm bank first: pending enrollments, the waitlist, alumni referrals, Joe's own network. Cold ads and new lead magnets are paused behind that. When Cohort 3 needed filling, the entire plan was "demand already exists, the job is converting the warm bank already built," and cold traffic only got touched if seats remained after the warm work was done. Build the grassroots motion first. The paid funnel comes later, after a domain warm-up and once the warm engine is humming.</p>
<p><strong>3. Serve, do not squeeze.</strong> Every giveaway is value, value, value, even if that means pointing people to a great GitHub repo Joe did not build. Joe refuses to force email opt-ins on giveaways because it hurts unsubscribe rates and domain reputation. He would rather protect the long-term trust and deliverability than grab a short-term email. You pushed back on this in your onboarding and he is trusting your call on the opt-in question, but the underlying instinct is the rule: give first, extract second. Warm trust is the asset. Do not burn it for a quick capture.</p>
<p><strong>4. Four needle-movers a day.</strong> Joe's strategist agent narrows his entire portfolio down to about four needle-moving tasks a day, and that discipline is deliberate. Before you build or chase anything, ask two questions: how long will this take, and what will it actually do for me. AI makes rabbit holes seductive, and Joe knows his own ADHD pull toward them. The antidote is ruthless prioritisation. Four things that move revenue beat forty things that feel productive.</p>
<p><strong>5. Move at 100 mph, fix the process not the mistake.</strong> Joe would rather you run at 100 mph with the occasional mistake and 20 to 30 times the output than crawl at 20 mph with none. He knows you lean perfectionist and he wants you to lean out of it. A mistake is fine, once. The rule is never make the same mistake twice: when one happens, build a process so it cannot recur, and if the process fails, upgrade the process. Volume plus a self-correcting system beats slow perfection.</p>
<p>Underneath all of this sits a delegation hierarchy for every task: can myOS or an agent do it, then can Jill or Tooba do it well and is it worth the management overhead, and only then do you do it yourself. If you cannot write a stupid-proof SOP for a task, do not hand it to a VA.</p>
<h2>How your sales work ladders into the bigger plan</h2>
<p>The revenue plan is not "get more traffic." The diagnosis Joe and his agents reached is that the constraint is <strong>conversion from warm demand, not top-of-funnel volume.</strong> The fastest revenue has consistently lived in demand already in hand: pending enrollments, members who never logged in, waitlist follow-up, and alumni referrals. The homepage needed better proof and a clearer call to action, "Apply for Cohort 4" instead of "Join Waitlist," a member proof story above the pricing, and the "I'm not technical and this still works for me" objection-breaker high on the page.</p>
<p>So your sales work sits at the exact pressure point of the whole plan. The sequence the business runs is: recover and classify existing demand, tighten the call to action and the confirmation layer, add proof, then run referral and nurture follow-up, and only then expand the funnel with new offers or cold ads. Your day-to-day job, filling cohorts from the warm bank and getting proof and referrals moving, is not a side task. It is the first three steps of the revenue plan. Everything else waits behind it.</p>
<p>The reporting rhythm reflects this. Your right-hand agent tracks what you do and auto-reports to Joe's Telegram at day's end, Joe reorders your task board each morning with the highest priority on top, and during a warm-up period he wants second eyes on content before it ships, with you taking over approvals fully as trust builds. That is the same graduated-trust path he ran with his email manager.</p>
<h2>The single most important thing you can do in your first 30 days</h2>
<p><strong>Close Cohort 4 from the warm bank before Joe goes offline.</strong></p>
<p>There is roughly $10,000 already sitting in the warm pipeline, about 8 people at around $1,800 each, in a program that is already built. Joe is about to be completely offline for around two weeks for Burning Man, so the setup and the outreach need to be working asynchronously before he leaves. This is grassroots-before-funnels, serve-don't-squeeze, and four-needle-movers-a-day all pointing at the same target.</p>
<p>Concretely, in your first 30 days:</p>
<ol>
<li>Work the Cohort 4 warm list personally. Voice notes and direct messages, not a blast email. Reference each person's specific situation. Classify every pending person and assign one next action to each.</li>
<li>Get the homepage call to action and proof right so the warm traffic that arrives actually converts: "Apply for Cohort 4," a member proof story above the pricing, the "and it still sounds like you" line near the promise.</li>
<li>Fire the alumni referral push. Ask each strong member for one specific person by name, with a forwardable message, never a vague "any referrals."</li>
</ol>
<p>Do not spend your first month building a cold-email machine, standing up new giveaways, or perfecting a content calendar. Those are real, and they come next. But the highest-leverage revenue in the building right now is warm, it is already in hand, and it has a two-week clock on it. Close the money that already exists first. That is exactly how Joe would spend the month, and it is the fastest way to prove your instinct matches his.</p></section><section id="state" class="chapter accent-lavender" data-sec="state"><div class="accent-bar"></div><h1>The Current State of Masterminds HQ</h1>
<h2>What Masterminds HQ Is</h2>
<p>Masterminds HQ is Joe Che's flagship live program: <strong>Joe Che's Business Automation Mastermind</strong>. It teaches small business owners how to build their own AI business system, replace themselves as the operator, and leave every session with something actually running. It is the immediate money-maker in the business, and driving sign-ups into it is the center of your role.</p>
<p>The ideal member is a conscious founder, coach, artist, or creative: a purpose-driven person running a business that is an expression of who they are. Most are solo or one to five people, non-technical by their own description, often neurodivergent. Do not gate on revenue. Everything you write, target, and pitch should speak to that person.</p>
<p>The program runs on Joe's own stack, not external SaaS. The public surfaces you need to know:</p>
<ul>
<li><strong>Main site:</strong> https://mastermindshq.business</li>
<li><strong>Workshop portal (members):</strong> https://workshop.mastermindshq.business</li>
<li><strong>Members portal (courses, magic-link login):</strong> portal.mastermindshq.business</li>
<li><strong>Intake form:</strong> https://mastermindshq.business/intake</li>
<li><strong>Business email / domain:</strong> joe@mastermindshq.business (mastermindshq.business, already warmed for deliverability)</li>
</ul>
<h2>How the Program Works</h2>
<p>There are two levels.</p>
<p><strong>Level 1</strong> is the core program every new member joins: a <strong>12-week live implementation program plus 3 signature bonus weeks, 15 weeks total</strong>. Sessions are weekly on Zoom, backed by a WhatsApp community group, the workshop portal, and a resource vault. Members do not just learn, they ship. The 12 core sessions run in this order:</p>
<ol>
<li>Claude Code and your first website</li>
<li>Lead magnets and your domain</li>
<li>Train your AI and HookLab</li>
<li>Alignment Mastermind</li>
<li>AI in your pocket</li>
<li>Mission Control</li>
<li>Safety and the web data collector</li>
<li>Magic CRM</li>
<li>Branding agent and offer clarity</li>
<li>Traction channels (the 16-channel method)</li>
<li>Instagram agent and lead capture</li>
<li>Graduation and the Level 2 path</li>
</ol>
<p><strong>Level 2</strong> is the deeper layer members move into after graduating Level 1. When you sell Cohort 4, you are selling Level 1, which is the entry point to the whole ladder.</p>
<p>The hero promise on the site is the tone to match in your marketing: <strong>"Have the idea. Build it tonight. Selling by sunrise."</strong> with the subhead <strong>"Build your AI business system in 12 weeks."</strong></p>
<h2>The Cohort Timeline</h2>
<p>Masterminds HQ runs in cohorts, small rooms that start together and move through the program as a group. Total membership across all cohorts is <strong>51 members</strong> as of July 17, 2026.</p>
<p><strong>Cohort 1</strong> started March 15, 2026, meeting Sundays at 5:00 PM Bali time. It has completed and is inactive now.</p>
<p><strong>Cohort 2</strong> started April 20, 2026, meeting Mondays at 7:30 AM Bali. It completed the full program on July 13, 2026, with <strong>15 graduates certified and delivered</strong>, and is inactive now. Those graduates and their certifications are live proof you can point marketing at.</p>
<p><strong>Cohort 3</strong> started June 22, 2026, meeting Mondays 7:00 to 9:00 PM Bali, running its 12 weeks through the end of August. It is active now.</p>
<p><strong>Cohort 4 is the one you are filling.</strong> It starts <strong>Monday, August 10, 2026 at 7:30 AM Bali</strong>, Zoom meeting ID 83809537342. The site is in <strong>accepting mode</strong>: the status eyebrow reads "Applications Now Open," the primary call to action is "Join Cohort 4," and the copy states plainly that Cohort 4 starts Monday, August 10, 2026 and the room stays intentionally small. This is a live, open-for-sale cohort. Note the timing: Sessions 1 and 2 happen with Joe present, then the cohort runs through his roughly two weeks offline in late August and early September, so the room needs to be built and set before he leaves.</p>
<h2>Pricing and the Deal Slugs</h2>
<p>Cohort 4 has four price points, all for the same 15-week Level 1 program:</p>
<table>
<thead>
<tr>
<th>Deal</th>
<th>Slug</th>
<th>Price</th>
</tr>
</thead>
<tbody>
<tr>
<td>Monthly</td>
<td><code>momentum-monthly</code></td>
<td>$799/mo x 3 (anchored against $1,499/mo)</td>
</tr>
<tr>
<td>Pay upfront (Best Value)</td>
<td><code>momentum-upfront</code></td>
<td>$1,800 one-time (works out to ~$599/mo)</td>
</tr>
<tr>
<td>Friend rate</td>
<td><code>friend</code></td>
<td>$999 crossed out to $299/mo forever</td>
</tr>
<tr>
<td>Scholarship track</td>
<td><code>cohort4-scholarship</code></td>
<td>$150/mo, 12-month commitment</td>
</tr>
</tbody>
</table>
<p>The friend rate is the standard $999/mo price with a forever coupon that takes it to $299, so the buyer sees the original crossed out. That "crossed-out original, real price below" treatment is how every promo at MHQ is built.</p>
<h2>The Branded Checkout Rule (Non-Negotiable)</h2>
<p><strong>Every payment link you ever share for a cohort or program goes through the branded checkout route:</strong></p>
<pre><code>https://mastermindshq.business/api/mhq-checkout?deal=&lt;slug&gt;
</code></pre>
<p>Drop in the slug for the price point you want, for example <code>?deal=momentum-upfront</code>. Never share a raw Stripe link (<code>buy.stripe.com/...</code> or <code>checkout.stripe.com/...</code>). The reason: the underlying Stripe account is branded "The Connection Map," so a raw link shows the wrong logo and breaks trust at the exact moment someone is about to pay. The branded route mints a fresh, correctly-branded checkout session on every visit, sets the metadata that auto-onboards the buyer into the right cohort, and applies any coupon. A raw link on a Masterminds surface is a bug, every time. When in doubt, the shape is always <code>mastermindshq.business/api/mhq-checkout?deal=&lt;slug&gt;</code>.</p>
<h2>The Enrollment Funnel and Where Leads Come From</h2>
<p>The path from stranger to paying member runs through Joe's own machine, and it is worth knowing end to end because this stack is also what the Mastermind teaches:</p>
<p><strong>Stranger, ManyChat keyword, giveaway or quiz page, lead lands in Supabase, syncs into the CRM, Stripe branded checkout, participants database, onboarding (WhatsApp group, calendar invite, portal magic link), certification.</strong></p>
<p>Leads enter mainly through <strong>lead magnets</strong>: the AI Capability Levels quiz and the AI Behavioral Use quiz, plus giveaway pages, all triggered by ManyChat keywords like LEVEL and BEHAVIOR. Those leads flow into Supabase, get synced into the CRM on a schedule, and surface as interest you can work. Calls and WhatsApp conversations also feed the CRM. When someone buys through the branded checkout, the Stripe metadata drops them into the participants database and kicks off onboarding automatically.</p>
<p>One of the biggest open opportunities sitting in front of you: none of Joe's existing high-value giveaways have been posted to LinkedIn yet. That inventory is untapped, and LinkedIn is the primary channel for filling the room.</p>
<h2>What "Filling Cohort 4" Looks Like Operationally</h2>
<p>Filling Cohort 4 means getting the maximum number of qualified founders through the branded checkout before August 10, and it starts with warm demand that already exists.</p>
<p><strong>Start with the warm pipeline.</strong> There are roughly <strong>8 people already lined up for Cohort 4 at around $1,800 each, about $10,000 in signups waiting to be closed.</strong> This is your first and warmest list. Work it directly and convert it before chasing colder traffic. These people have already raised their hand, so the job is to get each of them onto <code>mastermindshq.business/api/mhq-checkout?deal=momentum-upfront</code> (or the monthly slug if they need to spread payments) and enrolled.</p>
<p><strong>Then widen the funnel:</strong></p>
<ol>
<li><strong>Push the giveaways and quizzes onto LinkedIn</strong> to pull fresh leads into the ManyChat and Supabase pipeline. LinkedIn is the priority channel (roughly 60 to 80 percent of effort), Instagram secondary, TikTok low. The AI-level self-assessment funnel is the strongest play: let people check their AI level, then reach the ones in the target band with the "you're a level 3, be a level 15 in 90 days at 2 hours a week" message.</li>
<li><strong>Move CRM interest to checkout.</strong> As leads land and warm up, get qualified founders onto the branded checkout with the right deal slug. Match the offer to the person: upfront for buyers ready to commit, monthly to lower the entry barrier, scholarship for the right hardship case, friend rate where Joe extends it.</li>
<li><strong>Every payment auto-onboards.</strong> Once someone pays through the branded route, the metadata routes them into the cohort and triggers onboarding. Your job is to keep the top of the funnel full and the warm list moving, all the way to the sale.</li>
</ol>
<p>The scoreboard is simple: signups into Cohort 4 before it starts on August 10. The warm 8 come first, LinkedIn giveaways feed the rest, and every link you send is a branded <code>?deal=&lt;slug&gt;</code> checkout.</p></section><section id="playbook" class="chapter accent-rose" data-sec="playbook"><div class="accent-bar"></div><h1>How to Market the Joe Way</h1>
<p>Your job is to increase sales. The immediate commercial priority is filling Cohort 4 of Level 1. Work the warm pool in the CRM: the 18 people in <code>strong_interest</code> plus the four in <code>negotiating_scholarship</code>. Start with Danielle Martinak, a confirmed hot lead. Joe's reference to about eight people at about $1,800, roughly $10,000 in potential revenue, is shorthand for the highest-intent slice, not a separate roster. Cohort 4 is accepting, not a formal waitlist. Inbound is growing. Start with the work most likely to turn that existing demand into sign-ups.</p>
<h2>The operating standard</h2>
<p>Move fast and produce volume. Joe values a much higher pace, even when it includes occasional first-time mistakes. A mistake is acceptable once. When it happens, build a process that prevents it happening again. If that process fails, upgrade the process.</p>
<p>Before you build or launch anything, answer two questions:</p>
<ol>
<li>How long will this take?</li>
<li>What will it actually do for the business?</li>
</ol>
<p>Joe uses a strategist to narrow his own focus to about four needle-moving tasks per day. Apply the same limit to your own work only if Joe confirms it. Do not disappear into an AI rabbit hole or polish work that does not move sales.</p>
<p>Use this delegation order:</p>
<ol>
<li>Can myOS or an agent do it?</li>
<li>Can Jill do it well, and is the management overhead worth it?</li>
<li>Can the video editor do it well, and is the management overhead worth it?</li>
<li>If not, do it yourself.</li>
</ol>
<p>Anything you hand to a VA needs a simple, explicit SOP. If you cannot make the task clear enough to hand off, do not delegate it yet.</p>
<h2>Start with the offer, not the channel</h2>
<p>Every campaign needs a sharp ICP, a concrete outcome, and a guarantee. Do not promote a vague offer to a broad audience.</p>
<p>Before writing creative or choosing distribution, define:</p>
<ul>
<li><strong>ICP:</strong> exactly who the offer is for.</li>
<li><strong>Outcome:</strong> the specific result they can expect.</li>
<li><strong>Guarantee:</strong> the commitment that reduces their risk.</li>
</ul>
<p>Set the ICP, outcome, and guarantee in the campaign brief before launch, using the approved positioning statement and the audience segment you are working. Then run the offer free with friendly people first, learn from the response, and tighten the offer before scaling it. Start grassroots before building funnels.</p>
<p>The Level 1 ICP is conscious founders, coaches, artists, and creatives (purpose-driven, often non-technical, do not gate on revenue). Do not screen people out by revenue.</p>
<h2>Cohort 4 tracks and sensitive pricing</h2>
<p>The Scholarship Track is $150 per month, reserved for people with genuine financial need. Every scholarship goes through Joe's approval and personal vetting, so it is never something you promise or grant on your own. Send candidates to the dedicated scholarship page at https://mastermindshq.business/scholarships (the magic link that auto-unlocks it is https://mastermindshq.business/scholarships?key=ripple-impact ).</p>
<p>The Friend rate is strictly confidential and authorized only by Joe directly. Never quote it, publish it, or extend it yourself.</p>
<h2>Choose one bullseye channel</h2>
<p>Use the bullseye, or traction-channels, method: choose the one channel most likely to move the needle, work it hard, and exhaust it before moving significant effort to the next channel. Cross-posting content that already exists is worthwhile because it costs little, but concentrated effort wins.</p>
<p>For now, allocate effort like this:</p>
<ul>
<li><strong>LinkedIn: 60 to 80 percent.</strong> This is the primary platform.</li>
<li><strong>Instagram: 20 to 40 percent.</strong> This is secondary.</li>
<li><strong>TikTok: low priority.</strong> It is acceptable for it to be fully AI.</li>
</ul>
<p>Match the channel to the audience temperature:</p>
<ul>
<li>Send cold traffic to Amazon or another low-friction destination.</li>
<li>Send warm traffic to the owned website and WhatsApp.</li>
</ul>
<p>Do not treat every person as equally ready to buy. Reduce friction for cold audiences. Move warm audiences toward the owned relationship channels where the conversation can continue.</p>
<h2>Fix LinkedIn before you feed it</h2>
<p>LinkedIn needs a heavy cleanup before sustained posting investment. It has been left messy and off-brand. The goal is to make it compelling, optimised, and correctly pinned, then use it as the primary distribution engine.</p>
<p>Your sequence is:</p>
<ol>
<li>Audit the current profile and existing work.</li>
<li>Build a cleanup plan: what changes, why it changes, what should be pinned, and what assets are needed.</li>
<li>Turn the plan into clear tasks and SOPs for Jill.</li>
<li>Hand execution to Jill.</li>
<li>Review the completed cleanup, then invest in posting.</li>
</ol>
<p>You own the plan and quality bar. Jill should receive execution-ready work, not a vague request to make LinkedIn better.</p>
<p>There is a clear opportunity here: none of the existing giveaways have been posted on LinkedIn. Treat that as untapped inventory.</p>
<h2>Managing Jill and Tooba</h2>
<p>You manage two people, and your job is to hand them execution-ready work, not vague asks. The standard is Joe's: if you cannot write it as a stupid-proof SOP, improve the process before you delegate it.</p>
<p>The delegation template already exists. The LinkedIn cleanup SOP is the model for every task you hand Jill: it has an owner, a reviewer (you), a single decision rule, a batch-review sheet, and hard guardrails so nothing irreversible happens without your sign-off. Copy that shape for any new task. Jill executes, you approve in batches, you keep the quality bar.</p>
<p>Working with Tooba on video: give her a brief that states what the video is for, the hook, the length, the feel, and where the raw footage is. Set a turnaround, review the first cut, give one consolidated round of feedback, then approve the final. Cap it at two revision rounds before you jump on a quick call. Keep raw files and drafts in one known place so nothing gets lost.</p>
<p>The carousel pipeline end to end: you brief the Carousel Builder agent, it drafts fast, Jill polishes the design in Canva against the brand palette, you approve, and it posts to LinkedIn. Everyone knows their step and where the work lands.</p>
<p>Run a short weekly sync with each of them. Jill is in the Philippines (GMT+8) and Tooba is in Pakistan (GMT+5), and your own timezone moves from Greece to Bali, so lock a recurring window that survives the move. Keep the syncs specific: what shipped, what is stuck, what is next.</p>
<h2>Lead with value: giveaways plus workshops</h2>
<p>Joe's best-performing play is high-value giveaways paired with free, pre-recorded, or live workshops. The rule is simple: value, value, value. A useful giveaway does not need to be something Joe built from scratch. Sharing an excellent GitHub repository can be valuable if it helps the audience.</p>
<p>All giveaways run through the giveaways page at https://mastermindshq.business. The ManyChat giveaway flows deliver through the site, so every giveaway you promote should point back there.</p>
<p>Use high-value giveaways with a free, pre-recorded, or live workshop. <strong>How to use AI to double your business</strong> is an approved Q&amp;A concept, not a scheduled event. Draft one value-first workshop plan with a single next step, the Mastermind intake, and get Joe's sign-off before publishing or inviting anyone. Do not commit to a recurring cadence until the first run has been reviewed.</p>
<p>For every giveaway, apply the locked method by defining:</p>
<ul>
<li>the ICP and their immediate problem;</li>
<li>the practical value they receive before they pay anything;</li>
<li>the related workshop or next step;</li>
<li>the intended route based on temperature;</li>
<li>the sales connection to Cohort 4 or another approved offer.</li>
</ul>
<p>Review the giveaway and ManyChat database. Rate each giveaway for lead quality by level and ICP, then prioritise the ones that best support Cohort 4.</p>
<p>Do not force email opt-ins on giveaways. Protect unsubscribe rate and domain reputation by serving rather than squeezing. Deliver the giveaway value without a forced email gate.</p>
<h2>Make AI capability certification the flagship giveaway</h2>
<p>Prioritise the AI-capability self-assessment and certification funnel. The live entry point is the free AI Capability Levels quiz, keyword <code>LEVEL</code>. Use it as the flagship free assessment and a conversation opener, then route qualified business owners to Cohort 4 intake.</p>
<p>This is more than a lead magnet. It can become a standalone product, and people may share their certification on LinkedIn or Instagram. Use that sharing potential to strengthen distribution, but do not state specific level thresholds, certification mechanics, outcomes, or eligibility as facts.</p>
<p>The verified funnel structure is a free AI-level check followed by a message to qualified business owners and a route to Cohort 4 intake. Build it as follows:</p>
<ol>
<li>Define the target ICP from the qualified business-owner segment.</li>
<li>Map the free assessment, result, follow-up message, Cohort 4 intake, and approved offer.</li>
<li>Decide what is manual, agent-run, or delegated.</li>
<li>Test it with friendly people first.</li>
<li>Improve it from the response before pushing it broadly.</li>
</ol>
<h2>Keep AI content authentic</h2>
<p>Authenticity with AI content is non-negotiable. Clearly label anything AI as AI. Do not use AI to impersonate Joe on his main account. Real-person content is real-person content. AI content is visibly AI content.</p>
<p>This is compatible with using AI at scale, including fully AI TikTok. The standard is disclosure, not pretending.</p>
<h2>Run the daily reporting and priority loop</h2>
<p>At the start of each day, Joe reorders the task board so the highest priority is at the top. Work from that order. Your right-hand agent should track what you do and automatically send Joe an end-of-day report in Telegram. You will also have daily check-ins.</p>
<p>Send an end-of-day Telegram report tied to the work your right-hand agent tracks and the task-board priorities Joe has set.</p>
<p>Use the bullseye method when assessing channel work: exhaust the channel most likely to move the needle before moving significant effort to the next. Review channels, giveaways, and workshops weekly against the task-board priorities and results.</p>
<h2>Earn content approval authority</h2>
<p>During your warm-up period, Joe wants a second set of eyes on all content. Treat that as calibration, not friction. Learn the standard from the feedback, capture it in SOPs, and reduce repeat mistakes.</p>
<p>Approval authority should grow through graduated trust:</p>
<ol>
<li>Create content and send it for Joe's second eyes.</li>
<li>Apply feedback and document the pattern.</li>
<li>Use the documented standard consistently.</li>
<li>Take over approvals fully when Joe is comfortable.</li>
</ol>
<p>During the warm-up period, all content gets Joe's second eyes. That is the approval standard while you learn the voice and operating pattern.</p>
<h2>Your first marketing priorities</h2>
<ol>
<li>Build the high-level marketing plan for Joe: LinkedIn cleanup, Jill's tasks, secondary Instagram and YouTube work, prioritised Cohort 4 giveaways, and the later cold-email path.</li>
<li>Complete the LinkedIn cleanup plan and hand execution-ready tasks to Jill.</li>
<li>Audit the giveaway inventory for ICP fit and lead quality. Every giveaway routes through the giveaways page at https://mastermindshq.business.</li>
<li>Build and test the AI-capability certification funnel with friendly people.</li>
<li>Draft and test one value-first AI Q&amp;A workshop plan with Mastermind intake as the single next step. Get Joe's sign-off before publishing or inviting anyone, and do not set a recurring schedule until the first run has been reviewed.</li>
<li>Set up your right-hand agent and end-of-day Telegram reporting.</li>
</ol>
<p>Cold email is planned for later, after one to two months of domain warm-up. Build the path after the warm-up period. The Brand chapter in this guide is the current brand guideline: use the full approved positioning statement as public copy, stay inside the locked purple, lilac, and blush palette, and use Career and Connections as the pillars, with Communication under Connections.</p></section><section id="giveaways" class="chapter accent-purple" data-sec="giveaways"><div class="accent-bar"></div><h1>Lead Magnet and Giveaway Inventory</h1>
<h2>How the system works</h2>
<p>The basic path is:</p>
<p><code>comment keyword → ManyChat flow → lead</code></p>
<p>You promote a giveaway with a keyword. When someone comments that keyword, the connected ManyChat flow delivers the relevant link or next step. ManyChat data flows into the CRM with a tag. In the registry, <code>wired: live</code> means the ManyChat flow is connected. <code>status: draft</code> and <code>wired: not-wired</code> mean the entry is not live in this system.</p>
<p>Every giveaway lives on the giveaways page at https://mastermindshq.business. That is the public home for the giveaways, and any giveaway you promote should point back there.</p>
<p>The registry is an inventory of flow configuration, not a performance report. The audit found no individual giveaway signup or download counts. Treat the lead-quality ranking below as a reasoned ICP-fit ranking, not a conversion ranking.</p>
<h2>Complete registry by funnel tag</h2>
<p>The table below includes all 31 rows in <code>giveaways-dump.json</code>. “Lead-quality ranking” uses the supplied audit where the giveaway has a direct match. The audit’s grouped ranks are shown as ranges where several giveaways share one tier. “Not ranked in audit” means there was no direct matching entry in the audit.</p>
<h3>Career_Funnel</h3>
<table>
<thead>
<tr>
<th>Keyword</th>
<th>Giveaway</th>
<th>Status</th>
<th>Wired</th>
<th>Lead-quality ranking from audit</th>
</tr>
</thead>
<tbody>
<tr>
<td>BENCHMARK</td>
<td>AI Model Benchmark Comparison</td>
<td>active</td>
<td>live</td>
<td>9</td>
</tr>
<tr>
<td>BOOK</td>
<td>AI OS Book Amazon</td>
<td>active</td>
<td>live</td>
<td>Not ranked in audit</td>
</tr>
<tr>
<td>NO BAN</td>
<td>Anthropic Safety Checklist</td>
<td>active</td>
<td>live</td>
<td>9</td>
</tr>
<tr>
<td>MASTERMIND</td>
<td>Business Automation Mastermind</td>
<td>active</td>
<td>live</td>
<td>Not ranked in audit</td>
</tr>
<tr>
<td>ROUTING</td>
<td>Cross CLI Compatibility Routing</td>
<td>active</td>
<td>live</td>
<td>Not ranked in audit</td>
</tr>
<tr>
<td>FABLE</td>
<td>Fable Worth-It Audit</td>
<td>active</td>
<td>live</td>
<td>Not ranked in audit</td>
</tr>
<tr>
<td>SAFE</td>
<td>Guardog</td>
<td>active</td>
<td>live</td>
<td>8</td>
</tr>
<tr>
<td>IG SETTINGS</td>
<td>Instagram Settings Growth Checklist</td>
<td>active</td>
<td>live</td>
<td>12, bury</td>
</tr>
<tr>
<td>CLEAN</td>
<td>MacCleaner</td>
<td>active</td>
<td>live</td>
<td>8</td>
</tr>
<tr>
<td>MANYCHAT</td>
<td>Manychat Autoflow</td>
<td>active</td>
<td>live</td>
<td>Not ranked in audit</td>
</tr>
<tr>
<td>DALIO</td>
<td>Ray Dalio Council</td>
<td>active</td>
<td>live</td>
<td>7</td>
</tr>
<tr>
<td>SpeakHuman</td>
<td>SpeakHuman</td>
<td>active</td>
<td>live</td>
<td>8</td>
</tr>
<tr>
<td>DITCH</td>
<td>Squarespace Escape Kit</td>
<td>active</td>
<td>live</td>
<td>8</td>
</tr>
<tr>
<td>ALIVE</td>
<td>Staying Alive Mission Control</td>
<td>active</td>
<td>live</td>
<td>Not ranked in audit</td>
</tr>
<tr>
<td>web design</td>
<td>The 24 Best Skills and Effects</td>
<td>active</td>
<td>live</td>
<td>Not ranked in audit</td>
</tr>
<tr>
<td>COMPARE</td>
<td>The 5 Versions of Claude</td>
<td>active</td>
<td>live</td>
<td>9</td>
</tr>
<tr>
<td>LEVEL</td>
<td>The AI Capability Levels Quiz</td>
<td>active</td>
<td>live</td>
<td>Not ranked in audit</td>
</tr>
<tr>
<td>TOKOPEDIA</td>
<td>Tokopedia AI Shopping Agent</td>
<td>active</td>
<td>live</td>
<td>10</td>
</tr>
<tr>
<td>MD</td>
<td>Ultimate Claude.md file</td>
<td>active</td>
<td>live</td>
<td>6</td>
</tr>
<tr>
<td>VISUAL HOOKS</td>
<td>Understanding Visual Hooks</td>
<td>active</td>
<td>live</td>
<td>12, bury</td>
</tr>
<tr>
<td>UNLEARN</td>
<td>What 17 People Had to Un-Learn About Success</td>
<td>active</td>
<td>live</td>
<td>12, bury</td>
</tr>
<tr>
<td>BE HUMAN</td>
<td>Be Human</td>
<td>draft</td>
<td>not-wired</td>
<td>Not ranked in audit</td>
</tr>
<tr>
<td>EVOLVE</td>
<td>Evolver</td>
<td>draft</td>
<td>not-wired</td>
<td>Not ranked in audit</td>
</tr>
<tr>
<td>hooklab</td>
<td>HookLab</td>
<td>draft</td>
<td>not-wired</td>
<td>8</td>
</tr>
<tr>
<td>LOGO</td>
<td>Logo Maker Guide</td>
<td>draft</td>
<td>not-wired</td>
<td>12, bury</td>
</tr>
<tr>
<td>MARATHON</td>
<td>Marathon</td>
<td>draft</td>
<td>not-wired</td>
<td>Not ranked in audit, not live</td>
</tr>
<tr>
<td>FISH</td>
<td>Miro Fish</td>
<td>draft</td>
<td>not-wired</td>
<td>Not ranked in audit, not live</td>
</tr>
<tr>
<td>OVERSEE</td>
<td>OVERSEE</td>
<td>draft</td>
<td>not-wired</td>
<td>Not ranked in audit, not live</td>
</tr>
<tr>
<td>MAGIC</td>
<td>OpenClaw Magic Task Board</td>
<td>draft</td>
<td>not-wired</td>
<td>Not ranked in audit, not live</td>
</tr>
<tr>
<td>FILES</td>
<td>Openclaw Advanced File Browser</td>
<td>draft</td>
<td>not-wired</td>
<td>Not ranked in audit, not live</td>
</tr>
</tbody>
</table>
<h3>Alignment_Funnel</h3>
<table>
<thead>
<tr>
<th>Keyword</th>
<th>Giveaway</th>
<th>Status</th>
<th>Wired</th>
<th>Lead-quality ranking from audit</th>
</tr>
</thead>
<tbody>
<tr>
<td>BEHAVIOR</td>
<td>The AI Behavioral Use Quiz</td>
<td>active</td>
<td>live</td>
<td>Not ranked in audit</td>
</tr>
</tbody>
</table>
<h2>Top five for Mastermind leads</h2>
<p>The audit recommends featuring these five on Mastermind-facing surfaces, in this order:</p>
<ol>
<li><strong>All Sorted Overview:</strong> Nearly a direct pitch for an AI business OS, with the highest-intent audience and the shortest distance to a Mastermind sale.</li>
<li><strong>Intro to N8N:</strong> Explicitly targets non-technical founders, delivers a working automation, and points toward the Business Automation Mastermind.</li>
<li><strong>Advanced Infrastructure for Multi-Agent AI Operating Systems:</strong> Attracts serious builders and founders already thinking at the level the Mastermind teaches.</li>
<li><strong>Web Designer Agent Kit:</strong> Practical and immediately usable, with overlap among agency owners, freelancers, and founders who want to scale.</li>
<li><strong>The Cult Brand Playbook:</strong> Attracts founders thinking about positioning, making it a strong strategic fit for a Mastermind conversation.</li>
</ol>
<p>These five recommendations come from the ranked audit. They do not appear as named rows in the supplied 31-row ManyChat registry, so treat them as build-then-post targets. Before promoting any of them, verify a live destination and connected flow in <code>/app/manychat-giveaways</code>.</p>
<h2>Untapped LinkedIn inventory</h2>
<p>None of the existing giveaways have been posted to LinkedIn yet. That means the inventory has had zero LinkedIn distribution so far. The meeting notes identify this as a large untapped opportunity.</p>
<p>Start LinkedIn distribution with the active, wired live registry rows that fit the Mastermind audience, such as LEVEL, MASTERMIND, ALIVE, COMPARE, and DALIO. Treat the audit’s top five as build-then-post targets, and promote each only after you verify a live destination and connected flow in <code>/app/manychat-giveaways</code>. Point every post back to the giveaways page at https://mastermindshq.business.</p></section><section id="social" class="chapter accent-lavender" data-sec="social"><div class="accent-bar"></div><h1>Social Channels: LinkedIn and Instagram</h1>
<p>LinkedIn and Instagram are your two priority channels. LinkedIn carries roughly 60 to 80 percent of the effort, Instagram 20 to 40 percent. Before the strategy, here is exactly how you get access to each, because it is not a single password and the two accounts work very differently.</p>
<h2>Getting into LinkedIn (the safe way)</h2>
<p>LinkedIn has no delegated access for a personal profile, so to post and engage as Joe you log in as Joe. Joe sets this up so it is safe:</p>
<ol>
<li>Joe rotates his LinkedIn password to a fresh one used nowhere else, then shares it to you through LastPass. You use it by LastPass autofill.</li>
<li>Two-factor stays on. The first time you log in, tick "remember this device" and Joe passes you the one-time code once. After that LinkedIn trusts your device and stops asking.</li>
<li>Log in only from your dedicated work browser profile, so this session stays separate from your personal browsing.</li>
<li>Expect one bit of friction on the first login: because you are in a different country than Joe, LinkedIn may show a security challenge or send Joe a verification email to approve. Once your device is trusted it settles.</li>
</ol>
<p>Joe keeps control at all times through LinkedIn Settings, Sign in and security, "Where you're signed in," where he can see and revoke your session, and he can rotate the password to cut all access instantly.</p>
<p>What this login is for: posting, commenting, engaging, the profile cleanup, and outreach. That is most of your LinkedIn work, and none of it is automatable, so you do it by hand from this login. There is also a separate automated posting path through the MyOS LinkedIn agent, which posts through an approved connection without anyone's password; Joe re-authorizes that when it is needed.</p>
<h2>Getting into Instagram (@joe.che.official)</h2>
<p>Instagram is layered. You get three kinds of access, each for a different job, and only one of them is a password:</p>
<ol>
<li><strong>Meta Business Manager seat.</strong> Joe adds you as a user on his Business Manager with access to the @joe.che.official page and the ad account. This is the clean, terms-of-service-safe backbone for reading performance insights and running paid ads. No password sharing.</li>
<li><strong>ManyChat seat.</strong> Joe invites you as a team member in ManyChat. This is where the compliant comment-to-DM funnels and giveaways live. ManyChat is an approved Meta partner, so it is the safe way to automate any direct-message flow.</li>
<li><strong>The @joe.che.official login</strong>, shared through LastPass, for posting reels, feed, and stories natively and replying to comments. You post from the app or route content through the MyOS content tools.</li>
</ol>
<p>Your day-to-day Instagram lives on the Mission Control pages: performance on <code>/app/instagram-analytics</code>, funnels on <code>/app/manychat-giveaways</code>, and content on <code>/app/content-creation</code> and <code>/app/content-calendar</code>.</p>
<h3>The Instagram guardrails (hard rules)</h3>
<p>Instagram is the one place a wrong move can lose an account, so these are firm:</p>
<ul>
<li>Maximum 20 direct messages per day from the account, ever. The system tracks and caps this.</li>
<li>Every action carries human timing. Never fire messages or follows in a fast, even burst.</li>
<li>For any DM automation, use ManyChat, not raw sending. ManyChat is the approved path.</li>
<li>No bulk direct messages, no follow or unfollow at scale, no automated sending that a real person did not intend. These are the fastest way to get flagged.</li>
</ul>
<p>Note: @joe.che.official is the only Instagram wired into the system. The bare @joe.che handle is not connected to anything.</p>
<h2>The strategy</h2>
<p>Instagram is a secondary channel for Mastermind HQ. Allocate roughly 20 to 40 percent of social focus to it, while LinkedIn receives roughly 60 to 80 percent. Your goal is not to create a standalone Instagram strategy in isolation. Evaluate whether Instagram is supporting sales, especially the immediate priority of filling Cohort 4 of Level 1.</p>
<p>This is an evaluation framework, not a performance report. Use it to establish the baseline, find the useful assets and funnels, and decide what deserves continued effort once real data is available.</p>
<h2>What We Know</h2>
<ul>
<li>Instagram is a secondary channel. Keep effort concentrated on the channel that is most likely to move the needle, while using existing content for low-cost cross-posting where it fits.</li>
<li>High-value giveaways and free, pre-recorded, or live workshops are the strongest marketing plays discussed in the onboarding meeting.</li>
<li>ManyChat comment-keyword funnels are the engine behind the giveaway flow. Giveaway inventory exists in the giveaway and ManyChat database, and the system can auto-duplicate ManyChat automations.</li>
<li>The AI-capability self-assessment and certification funnel is a candidate giveaway. It can segment people by their assessed level and support targeted follow-up.</li>
<li>A Meta Ads app exists for the ads agent, but there is no approved Meta app for Instagram DM or message sending. The Instagram agent currently operates outside Meta's terms of service. Keep sending within the existing guardrails until a messaging app is submitted and approved.</li>
<li>Until sending is inside Meta's terms of service, keep the existing guardrails: no more than 20 messages per day, human-like timing variation, and patterns that mimic Joe's usual sending. Do not ingest Instagram DMs until the system is inside Meta's terms of service.</li>
</ul>
<h2>Data Gap: Establish the Baseline First</h2>
<p>There are no follower, reach, engagement, post-performance, DM, funnel, or conversion metrics on file in the local Instagram analytics sources. Do not infer performance from anecdote or from the existence of content and automations.</p>
<p>Your first measurement task is to complete a manual account audit and record the results in a simple working sheet. Once you are approved on the tailnet, open Mission Control at <code>http://mac-studio.tail781b6d.ts.net:3000</code> (fallback: <code>http://100.65.249.97:3000</code>) and confirm each documented surface by opening it. Pull real account and post-level data through the Meta API only after the messaging app is approved and account access is live.</p>
<p>At minimum, establish a baseline for follower count, reach, engagement, post format, profile actions, link activity, comment-keyword activity, DM outcomes, and leads or sales attributed to Instagram. Separate organic content results from giveaway and workshop funnel results so you can see what is actually creating qualified demand.</p>
<h2>Week 1 Evaluation Checklist</h2>
<ol>
<li>
<p><strong>Audit the profile against the brand.</strong> Review the bio, profile image, links, pinned content, highlights, calls to action, and visible positioning against the Brand chapter, which contains the current brand guidelines. Identify what is unclear, off-brand, or disconnected from the current sales priority before proposing changes.</p>
</li>
<li>
<p><strong>Review the top 20 posts manually.</strong> Record the post format, topic, call to action, comments, visible engagement signals, whether it is clearly real or clearly labelled AI, and whether it points to a relevant next step. Do not label a post a winner without real performance data.</p>
</li>
<li>
<p><strong>Map funnel keyword coverage against the giveaway database.</strong> List the active or available comment keywords, the giveaway or workshop each should trigger, the intended audience level or ICP, and the next step after delivery. Flag gaps where a useful giveaway has no Instagram keyword path, where a keyword has no clear offer, or where the automation does not support an appropriate follow-up.</p>
</li>
<li>
<p><strong>Check DM guardrail compliance.</strong> Review current sending behavior against the 20-message daily limit, human-like timing variation, and Joe's usual sending patterns. Confirm that Instagram DMs are not being ingested before legitimate Meta app access is in place. Escalate any risk immediately rather than trying to optimise an unsafe flow.</p>
</li>
<li>
<p><strong>Check the cost of cross-posting.</strong> For suitable existing content, compare the time required to adapt and publish it on Instagram with the available evidence of traction. Cross-posting is expected to be low cost, but do not let it displace the higher-priority LinkedIn effort or the work that directly supports Cohort 4 sales.</p>
</li>
</ol>
<h2>What to Deliver After the Evaluation</h2>
<p>Give Joe a short evidence-based view of three things: the current Instagram baseline, the highest-potential giveaway and comment-keyword paths, and the smallest set of improvements worth testing. Keep every performance claim tied to the data pull or to your documented manual audit. Mark dependencies on Meta approval, account access, current brand direction, or attribution explicitly.</p>
<hr />
<p>TikTok is a low-priority channel. Put concentrated social effort into LinkedIn first, with Instagram second. The discussed focus split is roughly 60-80% LinkedIn and 20-40% Instagram. This follows Joe's bullseye approach: focus on the channel most likely to move the needle, exhaust it, then move on.</p>
<p>TikTok is fine to run as fully AI content, but this does not relax the authenticity rule. Anything AI must be obviously labelled AI. Do not present AI as Joe on his main account. The AI Play G avatar exists for clearly AI hooks.</p>
<p>Keep the operating model deliberately light: cross-post existing content to TikTok, because cross-posting costs nothing, while keeping real effort concentrated on LinkedIn and Instagram. Do not create a separate TikTok content operation at this stage.</p>
<p>Use approved existing content as the source for reposts. During warm-up, every item gets Joe's second eyes before publishing. Label every AI-made repost clearly, and use the existing account access only after it is live and authorized.</p>
<p>Promote TikTok to a real channel only when it is the channel most likely to move the needle under the bullseye approach. The supplied sources do not define measurable promotion criteria.</p>
<p>Joe is the decision owner. Keep TikTok as a low-cost, clearly AI-labelled cross-posting surface with no dedicated budget and no primary role in driving Cohort 4 sign-ups. Review it during warm-up alongside other content, and promote it only when its documented qualified-demand results make it the strongest channel under the bullseye approach.</p></section><section id="brand" class="chapter accent-rose" data-sec="brand"><div class="accent-bar"></div><h1>Brand Guidelines Digest</h1>
<p>The full brand system lives at https://joe-che.com/brand (hub), with the deepest detail in the Personal Branding Guide https://joe-che.com/brand/personal-brand and the master Brand Brain https://joe-che.com/brand/brains/joe-che.</p>
<h2>The anchor</h2>
<p>Use this as the test for every piece of marketing:</p>
<blockquote>
<p>"I want my work and my relationships to feel like the real me, aligned and in service, not a performance of who I think I should be, and I refuse to trade my soul for efficiency."</p>
</blockquote>
<p>The work points to extraordinary alignment in careers and connections, with AI and systems that amplify the authentic self instead of stripping it.</p>
<h2>Positioning and onlyness</h2>
<p>Use the approved positioning statement exactly:</p>
<blockquote>
<p><strong>For</strong> purpose-driven founders and professionals</p>
<p><strong>who are currently</strong> feeling the distance between where they are (scattered, misaligned, running on scarcity, drowning in manual work, using AI daily and getting soulless output) and where they want to be (aligned, systemized, in service)</p>
<p><strong>I help them</strong> take brave steps toward extraordinary alignment in their careers and their connections, with systems that sound like them and finish the work</p>
<p><strong>by</strong> telling the truth about both sides of alignment, which I have lived, and handing them the personal AI operating system I actually run my own life on</p>
<p><strong>that</strong> no AI-business mentor, life coach, or business course can provide.</p>
</blockquote>
<p>The onlyness is lived infrastructure: Joe has trained 90,000+ people at the highest level, rebuilt his life from zero more than once, and built and daily lives inside the AI operating system he hands people. Advice-givers cannot copy lived infrastructure.</p>
<p>Use <strong>90,000+</strong> every time. Never use 80,000 or 80k. If you use a years-of-experience figure, the current figure is 30 years, not 29.</p>
<p>The short public line is provisional. Use the full approved positioning statement as public copy.</p>
<h2>Voice and email rules</h2>
<p>Write in one casual-warm, first-person, direct, low-BS voice. Do not switch between a personal and business voice. Let the rhythm move in waves: a medium sentence gives context, a short sentence lands the weight, and a longer sentence can pull back to the emotional or systemic truth. Short lines must be earned, not decorative.</p>
<p>Use specific facts and human context. Lead with the person or problem, not a credential. If you use a credibility stat, use one anchor stat as context and move past it. Name vulnerability directly and specifically, then move on. Own Joe's range. Do not apologize for it or explain it away.</p>
<p>Use gender-neutral public copy. Use invitations, not pressure. Before publishing, apply the Friend Test: would a tired, real person forward this to a friend?</p>
<p>Rules:</p>
<ul>
<li>No em dashes, ever. Use a comma, colon, or a rewrite.</li>
<li>Do not use hype vocabulary: “hustle,” “manifest,” “game-changing,” “revolutionary,” “synergy,” “leverage,” “seamless,” or “delve.”</li>
<li>Do not use exclamation points in serious content.</li>
<li>Do not use pressure CTAs such as “limited time” or “act now.”</li>
<li>In emails, do not use “honestly” or “the truth is.” Sign emails <strong>Joe Che</strong>.</li>
</ul>
<h2>Visual system</h2>
<p>Stay within the purple, lilac, and blush family. Use the supplied palette:</p>
<table>
<thead>
<tr>
<th>Use</th>
<th>Hex</th>
</tr>
</thead>
<tbody>
<tr>
<td>Purple</td>
<td><code>#8B79D4</code></td>
</tr>
<tr>
<td>Deep purple</td>
<td><code>#573D6F</code></td>
</tr>
<tr>
<td>Dark</td>
<td><code>#2B1F38</code></td>
</tr>
<tr>
<td>Cream</td>
<td><code>#FCF4EB</code></td>
</tr>
<tr>
<td>Blush</td>
<td><code>#F5C3C6</code></td>
</tr>
</tbody>
</table>
<p>The brand brain also lists lilac as <code>#9D8FE0</code>. Gold and orange are rejected.</p>
<p>Use the locked purple, lilac, blush, cream, and dark palette as the visual direction. Do not introduce gold or orange.</p>
<h2>AI authenticity</h2>
<p>Authenticity with AI content is sacred. AI and systems must amplify the authentic self, keep the person's voice, and finish real work without becoming generic or soulless.</p>
<ul>
<li>Label anything AI as AI clearly and obviously.</li>
<li>Do not impersonate Joe with AI on his main account.</li>
<li>Real means a real person. AI means clearly marked AI.</li>
<li>Do not position AI as a replacement for Joe's voice.</li>
</ul>
<h2>What not to do</h2>
<ul>
<li>Do not make Joe sound like an AI shortcut, passive-income, or hype promise.</li>
<li>Do not frame pure efficiency as the goal. The enemy is soulless efficiency that trades voice, range, and alignment for output.</li>
<li>Do not write guru language, guaranteed outcomes, or a step-by-step formula that promises certainty.</li>
<li>Do not use generic “soul purpose mentor” framing as the front door.</li>
<li>Do not force email opt-ins on giveaways. Protect unsubscribe rate and domain reputation by delivering the value without a forced email gate.</li>
<li>Do not publish a single total venture count. The source contains both 24+ and 26.</li>
<li>Use Career and Connections as the pillars, with Communication under Connections.</li>
<li>Do not quote a price or market a product as live without verification where the source marks its status or price as unconfirmed.</li>
</ul>
<h2>Pre-publish checklist</h2>
<ul>
<li>[ ] The content serves the anchor and supports alignment, not performance or soulless efficiency.</li>
<li>[ ] Any positioning language matches the approved statement exactly. Public copy uses the full approved positioning statement.</li>
<li>[ ] I used 90,000+, never 80,000 or 80k.</li>
<li>[ ] The copy is gender-neutral, direct, specific, human-first, and passes the Friend Test.</li>
<li>[ ] I removed em dashes, hype words, serious-content exclamation points, and pressure CTAs.</li>
<li>[ ] For email, I removed “honestly” and “the truth is,” and signed it Joe Che.</li>
<li>[ ] Any AI content is clearly labelled, does not impersonate Joe, and still sounds like a real person.</li>
<li>[ ] The visuals use the approved purple, lilac, blush, cream, and dark palette. No gold or orange appears.</li>
<li>[ ] I have not used an unresolved venture count, price, or product status.</li>
<li>[ ] During the warm-up period, the content has second eyes before it ships.</li>
</ul></section><section id="agents" class="chapter accent-purple" data-sec="agents"><div class="accent-bar"></div><h1>Your AI Team: The Agents You Will Actually Use</h1>
<p>MyOS runs about 165 agents. Web designers, lawyers, project managers, media renderers, a security dog that scans for threats every night, even a "professor" agent that teaches all the others while you sleep by running self-learning loops. You do not need to know all 165, and you never will. Most of them keep the machine running in the background so you never have to think about them.</p>
<p>This chapter is the part that matters for your job: the ten or so agents that exist to help you sell. Think of it less as a tool list and more as a team you have just been handed. Every one of them already knows Joe's brand, his voice, and his business. Your job is to know which teammate to tap for which problem.</p>
<p>One thing before the roster. You rarely summon these agents by digging through folders. You talk to <strong>Uni</strong>, Joe's orchestrating right-hand agent, or you work through Mission Control and Claude Code, and Uni routes the work to the right specialist. So when you read "reach for the Brand Manager," what you are really doing is asking for brand work and letting the system put the right agent on it. Name the outcome you want. The orchestration is handled for you.</p>
<p>Here is your team, grouped by the kind of work you will be doing.</p>
<h2>Content Creation: the agents that make the stuff</h2>
<p>This is the cluster you will lean on most, because your mandate is volume. Joe would rather you ship at a hundred miles an hour with the occasional mistake than crawl at twenty and never miss. These agents are how you hit that speed.</p>
<p><strong>Content Creation PM</strong> is the producer. It coordinates the whole creative pipeline: generated images, video clips, captions, and creative media. When you have a campaign and you need assets made rather than a single one-off file, this is the agent that takes the brief and orchestrates the specialists under it (image generators, video renderers, voice) so you are not stitching tools together by hand.
<em>When you need a batch of creative produced for a launch or a series, start here.</em></p>
<p><strong>HookLab</strong> is your scroll-stopper writer. It generates Instagram Reel and short-form hooks straight from Joe's brand voice, and it works two ways: reverse-engineer what already went viral, or start from the call to action and work backwards to the hook. Hooks are the single highest-leverage words in any piece of content, and this agent is built to produce them in volume so you can test many and keep the winners.
<em>When a Reel or post is dying in the first three seconds, or you need ten hook options fast, use HookLab.</em></p>
<p><strong>LinkedIn / Carousel agent</strong> builds carousel PDFs and handles LinkedIn content and posting. LinkedIn is your primary channel (roughly sixty to eighty percent of your effort), so this agent earns its keep quickly. Carousels are one of the best-performing formats on the platform, and this generates them rather than making you fight Canva slide by slide. Jill can execute the design polish, but this agent gives you the raw carousel fast.
<em>When you want a swipeable teaching carousel or need to push content to LinkedIn, this is the one.</em></p>
<p><strong>Video Editor</strong> is a shared consultant, not a button. It is the agent that decides, per job, which editing path to use: Descript, Palmier Pro, Remotion, the mastermind clip chain, or raw ffmpeg. It knows Joe's editing preferences and stewards every video process in the system. You do not need to learn five editing tools. You hand it the job and it picks the right one.
<em>When you have raw footage or a testimonial to cut and you are not sure how, ask the Video Editor.</em></p>
<p><strong>Blog Manager</strong> writes SEO-optimised blog posts for Joe's sites, already voiced correctly and ready to submit. It is the workhorse behind the auto-blogging you saw on the websites tour, and it plays into search visibility rather than social.
<em>When a site needs a fresh, ranking-friendly post, reach for the Blog Manager.</em></p>
<h2>Brand and Voice: the agents that keep it sounding like Joe</h2>
<p>Volume is worthless if it sounds like a robot. These two agents are the guardrails that let you move fast without going off-brand, which matters double here because authenticity is sacred to Joe. Anything obviously AI gets labelled AI. Anything meant to sound like Joe has to actually sound like Joe.</p>
<p><strong>Brand Manager</strong> builds and maintains "brand brains" for every project, scores content for brand drift, and runs a daily loop that absorbs new intelligence from testimonials and session summaries so the brand definition stays alive rather than frozen in a doc. Practically, it is a second set of eyes that can tell you when a caption has wandered off-brand before it goes out.
<em>When you want a piece of content checked for brand alignment, or you are defining positioning for a new campaign, use the Brand Manager.</em></p>
<p><strong>Speak Human (voice profile)</strong> is the rule, not just an agent: all public-facing writing runs through Joe's voice profile. Captions, emails, scripts, hooks, bios, DMs. There is a canonical profile the system reads automatically, and it bans the tells that give AI away (the word "honestly," the phrase "the truth is," and above all the em dash). Apply it and your writing stops reading as generated.
<em>When you write anything a real audience will see, run it through the voice layer first.</em></p>
<h2>Sales and CRM: the agents that find and warm the people</h2>
<p>Everything ladders up to sales, and the nearest money is Cohort 4. These agents are how you find prospects, understand them, and keep the pipeline honest.</p>
<p><strong>Growth Engine</strong> is your prospector. Every morning it scans Reddit, Stack Overflow, Twitter, and Quora for people who are actively describing a problem Joe's products solve, drafts humanised replies in his voice, and queues them in Mission Control for approval before anything posts. It is inbound-by-search: instead of shouting into a feed, you show up exactly where someone already asked for help.
<em>When you want a steady drip of warm, relevant conversations to enter, use the Growth Engine.</em></p>
<p><strong>Masterminds HQ PM</strong> is the brain of the business you are selling. It knows the cohort roster, the billing, the pipeline, and who is pending versus paid, all read live from the participants database rather than any doc that could go stale. When you need to know who is on the Cohort 4 waitlist, who paid, or who is sitting in "strong interest" and needs a nudge, this is the agent that knows.
<em>When you need the real state of the pipeline or the cohort, ask the Masterminds HQ PM.</em></p>
<p><strong>Apollo and Enrichment</strong> are your intelligence pair. Apollo pulls B2B lead data (finds people, enriches contacts, researches companies). Enrichment takes a name or handle and gathers the facts from Instagram, LinkedIn, a website, or an email so a lead stops being a blank row and becomes a person you can speak to specifically.
<em>When a lead needs context before you reach out, run it through enrichment first.</em></p>
<h2>Research and Strategy: the agents that tell you where to aim</h2>
<p>Speed pointed at the wrong target is just fast waste. Joe's whole method is picking the one channel that will move the needle, exhausting it, then moving on. These agents keep you aimed.</p>
<p><strong>The Strategist</strong> is the closest thing you have to a chief of staff. It watches every project from high altitude, runs a council of six world-class strategist personas each morning (offers, positioning, portfolio focus, timing, and a pre-mortem thinker who looks for what could go wrong), and hands out one short brief: the top three things to do today across everything, plus a churn radar, a money radar, and a gentle nudge when you are drifting into a rabbit hole. It is the same discipline that narrows Joe to about four needle-moving tasks a day.
<em>When you have twenty possible things to do and need the three that matter, read the Strategist's brief.</em></p>
<p><strong>Marketing PM and Meta Ads</strong> own paid acquisition and funnels. Marketing PM handles ad creative, funnels, and conversion strategy across products; Meta Ads manages the actual Facebook and Instagram campaigns, insights, and dashboards. You are ramping up on Meta ads anyway, so treat these as the agents that turn a budget into reach once your organic channel is proven.
<em>When you are ready to put money behind a proven message, reach for Marketing PM and Meta Ads.</em></p>
<p><strong>AEO PM and SEO Monitor</strong> cover being found. SEO Monitor pulls Google Search Console data and tracks how the sites are ranking; the AEO PM focuses on the newer game of AI-search visibility, getting Joe's content cited by the AI answer engines people now ask instead of Google. Together they tell you whether the content you are shipping is actually showing up.
<em>When you want to know if your content is getting discovered, check SEO Monitor and the AEO PM.</em></p>
<h2>How to think about all of this</h2>
<p>You have not been handed a manual to memorise. You have been handed a team that already knows the business. The move is always the same: name the outcome, and let the system route it. Need a hook, reach for HookLab. Need to know it sounds like Joe, run it through the voice layer. Need to know what to work on at all, read the Strategist.</p>
<p>The rest of the 165 keep the lights on so these dozen can help you do the one thing that matters, which is sell.</p></section><section id="reference" class="chapter accent-lavender" data-sec="reference"><div class="accent-bar"></div><h1>Mission Control: Every Page</h1>
<p>This is the full map of Mission Control, for when you want to go looking. You do not need to read it now. Your daily pages are in Get Set Up; this is the complete reference.</p>
<p>Base URL for every link: <code>http://mac-studio.tail781b6d.ts.net:3000</code> followed by the path.</p>
<h3>Daily drivers (start here)</h3>
<table>
<thead>
<tr>
<th>Page</th>
<th>Path</th>
<th>What it does</th>
</tr>
</thead>
<tbody>
<tr>
<td>The Genie</td>
<td><code>/app/genie</code></td>
<td>Plain-English command bar for the whole app. Type a wish, press Enter.</td>
</tr>
<tr>
<td>Daily Briefing</td>
<td><code>/app/daily-briefing</code></td>
<td>Morning executive summary: yesterday's wins, today's priorities, flagged messages.</td>
</tr>
<tr>
<td>Task Board</td>
<td><code>/app/tasks</code></td>
<td>Kanban board for work. "Human Must Do" is where the AI hands you things only a person can do.</td>
</tr>
<tr>
<td>CRM</td>
<td><code>/app/crm</code></td>
<td>Your warm-lead home: inbox, pipeline, contacts, labels.</td>
</tr>
<tr>
<td>WhatsApp-Joe</td>
<td><code>/app/whatsapp-chat</code></td>
<td>WhatsApp-style chat: conversation list plus live thread, reply from the browser.</td>
</tr>
<tr>
<td>Employees</td>
<td><code>/app/employees</code></td>
<td>Roster of everyone who works with Joe: role, status, contact, assignments.</td>
</tr>
<tr>
<td>File Browser</td>
<td><code>/app/projects</code></td>
<td>Navigate and view workspace files inline.</td>
</tr>
</tbody>
</table>
<h3>Masterminds HQ (the program you sell)</h3>
<table>
<thead>
<tr>
<th>Page</th>
<th>Path</th>
<th>What it does</th>
</tr>
</thead>
<tbody>
<tr>
<td>Masterminds HQ</td>
<td><code>/app/masterminds-hq</code></td>
<td>Program dashboard: content pipeline, strategy, reviews.</td>
</tr>
<tr>
<td>Participants</td>
<td><code>/app/masterminds-hq/participants</code></td>
<td>Member roster, cohorts, attendance. (Skip the Billing tab, that is finance.)</td>
</tr>
<tr>
<td>Quotes</td>
<td><code>/app/masterminds-hq/quotes</code></td>
<td>Testimonial-quality quotes pulled from transcripts.</td>
</tr>
<tr>
<td>Blog</td>
<td><code>/app/masterminds-hq/blog</code></td>
<td>Auto-generated blog posts through review, queue, publish.</td>
</tr>
<tr>
<td>Cold Outreach</td>
<td><code>/app/masterminds-hq/cold-outreach</code></td>
<td>Outreach campaigns by ICP and lead classification.</td>
</tr>
<tr>
<td>Favor Bank</td>
<td><code>/app/masterminds-hq/favor-bank</code></td>
<td>Scholarship trade deals: store credit, service hours, items.</td>
</tr>
<tr>
<td>Create Testimonials</td>
<td><code>/app/masterminds-hq/testimonials-process</code></td>
<td>Pipeline for collecting and cutting video testimonials.</td>
</tr>
<tr>
<td>Testimonials</td>
<td><code>/app/testimonials</code></td>
<td>Video testimonial database across all programs.</td>
</tr>
</tbody>
</table>
<h3>Content and social</h3>
<table>
<thead>
<tr>
<th>Page</th>
<th>Path</th>
<th>What it does</th>
</tr>
</thead>
<tbody>
<tr>
<td>Content Hub</td>
<td><code>/app/content-creation</code></td>
<td>Instagram production command center: reel sets, hooks, clips, giveaways.</td>
</tr>
<tr>
<td>Content Autopilot</td>
<td><code>/app/content-autopilot</code></td>
<td>Multi-platform posts (LinkedIn, IG, YouTube, TikTok) from one topic.</td>
</tr>
<tr>
<td>Carousel Builder</td>
<td><code>/app/carousel-builder</code></td>
<td>AI-generated Instagram and LinkedIn carousels.</td>
</tr>
<tr>
<td>LinkedIn</td>
<td><code>/app/linkedin</code></td>
<td>LinkedIn content pipeline: idea to draft to scheduled to published.</td>
</tr>
<tr>
<td>LinkedIn Images</td>
<td><code>/app/linkedin-images</code></td>
<td>Generate images for LinkedIn posts.</td>
</tr>
<tr>
<td>Meta Ads</td>
<td><code>/app/meta-ads</code></td>
<td>Facebook and Instagram ad campaign management.</td>
</tr>
<tr>
<td>Instagram Analytics</td>
<td><code>/app/instagram-analytics</code></td>
<td>Instagram account performance metrics.</td>
</tr>
<tr>
<td>ManyChat Giveaways</td>
<td><code>/app/manychat-giveaways</code></td>
<td>Run and track ManyChat giveaway campaigns.</td>
</tr>
<tr>
<td>Content Calendar</td>
<td><code>/app/content-calendar</code></td>
<td>Auto-drafts a weekly 5-day plan from feeds.</td>
</tr>
<tr>
<td>Canva</td>
<td><code>/app/canva</code></td>
<td>Canva design integration.</td>
</tr>
<tr>
<td>Descript</td>
<td><code>/app/descript</code></td>
<td>Descript editing and import.</td>
</tr>
<tr>
<td>Open Generative AI</td>
<td><code>/app/open-generative-ai</code></td>
<td>AI image studio: prompt, model, aspect ratio.</td>
</tr>
<tr>
<td>Postiz</td>
<td><code>/app/postiz</code></td>
<td>Social scheduling.</td>
</tr>
</tbody>
</table>
<h3>Growth, CRM, and outreach</h3>
<table>
<thead>
<tr>
<th>Page</th>
<th>Path</th>
<th>What it does</th>
</tr>
</thead>
<tbody>
<tr>
<td>Growth &amp; Outreach</td>
<td><code>/app/growth-engine</code></td>
<td>Reddit and Quora reply drafts, outreach approval queue, pipeline.</td>
</tr>
<tr>
<td>Connection Map</td>
<td><code>/app/crm/connection-map</code></td>
<td>Kanban pipeline for non-mastermind leads.</td>
</tr>
<tr>
<td>Apollo</td>
<td><code>/app/apollo</code></td>
<td>Apollo lead generation: search, enrichment, export.</td>
</tr>
<tr>
<td>WhatsApp Contacts</td>
<td><code>/app/whatsapp-chat/contacts</code></td>
<td>Alphabetical directory of WhatsApp contacts with labels.</td>
</tr>
<tr>
<td>Form Builder</td>
<td><code>/app/form-builder</code></td>
<td>Build surveys and forms, publish pages, collect responses.</td>
</tr>
</tbody>
</table>
<h3>Web, SEO, and domains</h3>
<table>
<thead>
<tr>
<th>Page</th>
<th>Path</th>
<th>What it does</th>
</tr>
</thead>
<tbody>
<tr>
<td>Websites</td>
<td><code>/app/websites</code></td>
<td>Central registry of all sites: hosting, status, credentials.</td>
</tr>
<tr>
<td>SEO</td>
<td><code>/app/seo</code></td>
<td>SEO command center: audits, fix queue, rankings.</td>
</tr>
<tr>
<td>AEO</td>
<td><code>/app/aeo</code></td>
<td>Answer Engine Optimization for AI answer engines.</td>
</tr>
<tr>
<td>Backlinks</td>
<td><code>/app/backlinks</code></td>
<td>Backlink outreach and competitor gap analysis.</td>
</tr>
</tbody>
</table>
<h3>System and orientation</h3>
<table>
<thead>
<tr>
<th>Page</th>
<th>Path</th>
<th>What it does</th>
</tr>
</thead>
<tbody>
<tr>
<td>System</td>
<td><code>/app/system</code></td>
<td>What the AI system can do and which agents run.</td>
</tr>
<tr>
<td>Office Space</td>
<td><code>/app/office</code></td>
<td>Real-time monitoring of every agent: status and current task.</td>
</tr>
<tr>
<td>Agent Org Chart</td>
<td><code>/app/agents-org</code></td>
<td>Hierarchy of agents by role and manager.</td>
</tr>
<tr>
<td>Memory</td>
<td><code>/app/memory</code></td>
<td>Search and browse the long-term memory bank.</td>
</tr>
<tr>
<td>Daily Summary</td>
<td><code>/app/daily-summary</code></td>
<td>AI journal of everything the system did, by date.</td>
</tr>
<tr>
<td>Installed Skills</td>
<td><code>/app/installed-skills</code></td>
<td>Catalog of installed Claude Code skills.</td>
</tr>
</tbody>
</table>
<h3>Restricted (certain financials)</h3>
<p>You have restricted access to some financial pages. They are not part of your work, listed only so you recognize them: Bank Accounts <code>/app/bank-accounts</code>, Stripe <code>/app/stripe</code>, CashClaw <code>/app/cashclaw</code>, Financials <code>/app/financials</code>, Invoice Reminders <code>/app/invoice-reminders</code>, Zoho Books <code>/app/zoho-books</code>, Scrooge <code>/app/scrooge</code>, and the Billing tab inside Participants. Polymarket surfaces are trading, not marketing, and are also outside your scope.</p></section></main>
<footer>Internal document. Please do not share outside the team. Questions go to Joe or Ronnie.</footer>
<script>
(function(){
  var btn=document.querySelector('.toc-btn'), panel=document.querySelector('.toc-panel'), wrap=document.querySelector('.toc-wrap');
  btn.addEventListener('click',function(e){e.stopPropagation();var open=panel.classList.toggle('open');btn.setAttribute('aria-expanded',open);});
  document.addEventListener('pointerdown',function(e){if(!wrap.contains(e.target)){panel.classList.remove('open');btn.setAttribute('aria-expanded','false');}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){panel.classList.remove('open');btn.setAttribute('aria-expanded','false');}});
  panel.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){panel.classList.remove('open');btn.setAttribute('aria-expanded','false');});});
  var links=[].slice.call(panel.querySelectorAll('a'));
  var secs=[].slice.call(document.querySelectorAll('section.chapter'));
  function onScroll(){var y=window.scrollY+120,cur=secs[0];for(var i=0;i<secs.length;i++){if(secs[i].offsetTop<=y)cur=secs[i];}
    var id=cur.getAttribute('data-sec');links.forEach(function(l){l.classList.toggle('active',l.getAttribute('data-sec')===id);});}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
</script>`;
