export function buildSpeakHumanEmail({ speakHumanPageUrl, unsubscribeFooter }: {
  speakHumanPageUrl: string
  unsubscribeFooter: string
}): { subject: string; html: string } {
  const subject = 'Your Speak Human setup (no Terminal needed)'
  const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; background: #ffffff;">
        <p style="font-size: 13px; color: #999; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px;">Speak Human</p>

        <h1 style="font-size: 26px; font-weight: 800; line-height: 1.25; margin-bottom: 16px; color: #111;">
          Here&rsquo;s the Speak Human skill.
        </h1>

        <p style="font-size: 16px; color: #444; line-height: 1.7; margin-bottom: 20px;">
          It&rsquo;s free, it lives on my public GitHub, and it does one job really well. It takes writing that sounds stiff or AI-made and turns it into words you&rsquo;d actually say, without changing your facts, your numbers or what you meant.
        </p>

        <div style="background: #f5f0ff; border-left: 3px solid #8B79D4; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
          <p style="font-size: 14px; color: #333; margin: 0; line-height: 1.7;">
            <strong>How it works:</strong><br>
            1. It spots the tells: filler phrases, fake significance, over-polished words, em dashes, list-everything habits.<br>
            2. It keeps what&rsquo;s already good: names, numbers, real opinions, and the lines that already sound like you.<br>
            3. It rewrites only what needs it, in a natural voice or your own saved voice.
          </p>
        </div>

        <p style="font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 12px;">
          Setup takes about two minutes. Open Claude Code or Codex (the Claude desktop app works fine) and paste this into the chat. Not into Terminal, into the chat:
        </p>

        <pre style="background: #0f0f12; color: #f0eee6; padding: 20px; border-radius: 10px; font-size: 13px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; margin-bottom: 24px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">Install Speak Human from https://github.com/josephtandle/speak-human for the assistant I am using. Read the repository's INSTALL.md, install the current release in the right skills folder for this assistant, check it works, and tell me the version and where you installed it. Then help me try it on: Our team will utilize the new form starting Monday.</pre>

        <p style="font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 16px;">
          Your assistant does the download and setup, and asks permission along the way. No API key, no subscription.
        </p>

        <p style="margin-bottom: 24px;">
          <a href="${speakHumanPageUrl}"
             style="display: inline-block; background: #8B79D4; color: white; padding: 13px 26px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px;">
            Open the Speak Human page
          </a>
        </p>

        <p style="font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 16px;">
          Once it&rsquo;s in, just talk to it. Paste a draft and say <strong>&ldquo;Use Speak Human to make this sound like me.&rdquo;</strong> Want it to learn your style? Say <strong>&ldquo;Use Speak Human to build my voice&rdquo;</strong> and paste an email you wrote. Want a check without changes? Say <strong>&ldquo;Use Speak Human to check this without changing it.&rdquo;</strong> No flags or commands to remember.
        </p>

        <p style="font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 16px;">
          Using ChatGPT or claude.ai in the browser? Download speak-human.zip from <a href="https://github.com/josephtandle/speak-human/releases/latest" style="color:#8B79D4;">the latest release</a> and attach the SKILL.md file to your chat. It works for that conversation.
        </p>

        <p style="font-size: 15px; color: #444; line-height: 1.7; margin-bottom: 28px;">
          Hit reply and tell me what you&rsquo;re going to clean up first. I read every one.
        </p>

        <p style="font-size: 14px; color: #999; margin-top: 24px;">Joe Che</p>
        ${unsubscribeFooter}
      </div>
    `
  return { subject, html }
}
