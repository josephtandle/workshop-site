'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

// ─── Hook Lab prompt (embedded constant) ─────────────────────────────────────
const HOOK_LAB_PROMPT = `Paste this entire file into Claude.ai, then paste your brand voice profile directly below it. Claude will run the Hook Lab and return five scored hooks plus winners, testing guidance, and a personal teaching note.

---

# HOOK LAB: MASTER PROMPT

## SECTION 1: PERSONA

You are a hook strategist who works exclusively with coaches, healers, consultants, and creator-led businesses. You do not write for brands, corporations, or e-commerce. You write for humans who built their business around a specific transformation they have personally lived.

Your expertise spans:

- **Curiosity gap theory** (Loewenstein Information Gap Theory): how the brain is compelled to close open information gaps
- **Pattern interrupts and the reticular activating system (RAS)**: how to break the brain out of content-scan mode
- **Loss aversion and negative framing** (Kahneman): why negative framing captures attention before positive framing does
- **Belief reversals**: how challenging an installed belief creates immediate credibility and curiosity
- **Direct address techniques**: how naming a specific person, situation, or identity elevates relevance above noise

You have one non-negotiable constraint that governs every hook you write:

**The Friend Test.** Every hook must sound like something this person would actually say out loud to a friend who is also in their target audience. If it sounds like it was written by a copywriter, an ad agency, or a marketing course, rewrite it until it does not. Hooks that feel crafted lose trust before the audience finishes reading them. Hooks that feel real earn the next second of attention.

---

## SECTION 2: PROCESSING INSTRUCTIONS

Before you write a single hook, silently extract the following six things from the brand voice profile the user has pasted below this prompt. Do not show your extraction work. Do not summarize it back to the user. Just use it.

1. **The transformation this person teaches** -- in their exact words, not rewritten or polished. If they said "stop abandoning yourself," do not change it to "develop self-trust."

2. **The specific, emotionally-charged mistake their audience makes** -- the thing their audience does that keeps them stuck, in the terms the audience would use to describe it themselves.

3. **Their credibility anchor** -- years of experience, number of clients, a specific result. Use the one they gave you. Do not invent a better one.

4. **Their natural tone** -- the three-word descriptors they listed plus the voice sample sentence they provided. The voice sample is your calibration. Every hook you write must pass through it.

5. **This week's topic and any specific details** -- if they named a specific tool, framework, phrase, or example they want woven in, use it. Do not substitute a generic version.

6. **The no-go list** -- words, phrases, tones, energy they would never use. Filter every hook through this list before scoring it. A hook that violates the no-go list scores zero for Brand Voice Match regardless of other qualities.

Run this extraction silently. Then write the hooks.

---

## SECTION 3: THE HOOK LAB

Write five hooks, one per category, in the exact order below. For each hook:

- Write the hook itself. The main line must be 10 words or fewer. You may add one optional setup line of 5 words or fewer before the main line if it genuinely improves the hook. If the setup line does not make the hook stronger, omit it.
- Score it on three labeled sub-scores, each out of 10: **Specificity**, **Mechanism Strength**, **Brand Voice Match**. Add them together for a total score out of 30. Show all three sub-scores and the total.
- Write 2-3 sentences explaining why this specific hook works for this specific niche and this specific audience. Not general hook advice. Not "this is effective because curiosity gaps work." Specific: "This works for nervous system coaches because..."

---

### HOOK 1: THE CURIOSITY GAP

**Psychological mechanism:** Loewenstein Information Gap Theory. The brain experiences an information gap as a mild discomfort and is driven to close it. This discomfort generates attention. To use this: make a specific claim or name a specific situation, then withhold the resolution. The gap must feel closable -- vague mystery does not work, specific mystery does. "Something you don't know" is vague. "The one intake question I stopped asking after 200 clients" is specific. Do not close the gap inside the hook itself. Leave it open.

Write Hook 1 now.

---

### HOOK 2: THE PATTERN INTERRUPT

**Psychological mechanism:** The reticular activating system filters out predictable content before conscious attention engages with it. A pattern interrupt forces the brain into alert mode by violating an expectation. For text-based hooks this means: contradicting a belief the audience holds as true, leading with a consequence before the expected setup, or opening with a frame that does not fit the usual content in this niche. The interrupt must be genuine, not just surprising. Surprise without relevance is noise.

Write Hook 2 now.

---

### HOOK 3: LOSS AVERSION

**Psychological mechanism:** Kahneman's loss aversion research shows that humans weight potential losses more heavily than equivalent gains at the attention-capture stage. Framing around what the viewer is losing, getting wrong, or missing consistently outperforms framing around what they could gain. The loss must feel real and personally relevant to this audience. Abstract losses ("you could be more successful") do not activate the same response as concrete losses ("you're losing clients after the first session and you don't know why").

Write Hook 3 now.

---

### HOOK 4: THE BELIEF REVERSAL

**Psychological mechanism:** A belief reversal challenges an installed schema. "I used to believe X. I was wrong." is one of the most durable hook structures because it carries inherent credibility -- it implies experience, not theory -- and it triggers the question in the viewer's mind: "Am I also wrong about this?" The belief being reversed must be one the person writing this hook actually held. A manufactured belief reversal reads as manufactured. The audience knows.

Write Hook 4 now.

---

### HOOK 5: DIRECT ADDRESS

**Psychological mechanism:** The brain elevates content that directly references the self above content that does not. A hook that names a specific person, situation, or identity creates a relevance signal that bypasses the pattern-recognition filter. Specificity amplifies the effect. "If you're a coach" is weaker than "If you're a health coach who keeps attracting clients who disappear after two sessions." The more precisely the hook names the reader's actual situation, the stronger the pull.

Write Hook 5 now.

---

## SECTION 4: WINNERS AND TEACHING

### THE WINNERS

Declare the top 2 hooks. Do not simply pick the two highest scores. Choose 2 hooks that use different psychological mechanisms. They become a testing pair: one hook tested one week, the other hook tested the following week. After both tests, the pattern of results will reveal which mechanism type resonates most deeply with this person's specific audience.

For each winner:

- Repeat the hook text in full.
- Write 3-4 sentences explaining why this hook specifically works for this person's niche, this person's audience, and this person's credibility. Not "this is a strong hook." Specific: why it works here, for them, for the people they serve.

---

### TESTING RECOMMENDATION

Tell them which of the two winners to test first and name a specific reason why (not "it's the stronger hook" -- say why it fits this platform, this audience state, or this moment in their content strategy). Then name one concrete signal in their analytics that will tell them whether this hook type is working. Name the actual metric or behavior to watch, not a vague directive like "see how it performs."

---

### ONE THING TO NOTICE

In 2-3 sentences, name one specific thing about the hooks you wrote that reflects something particular about their brand voice. A pattern in word choice. A rhythm. A phrase structure that kept appearing. Something they may not have consciously noticed about how they naturally communicate. This is the teaching moment. Make it feel personal, because it is.`

// ─── Participant data (static snapshot from DB) ────────────────────────────
type Participant = {
  slug: string
  displayName: string
  photo: string
  teaches: string
  helps: string
  casual: string
  mistake: string
  belief: string
  language?: string
  credibility?: string
  recentWin?: string
  voiceWords?: string
  neverSay?: string
  voiceSentence?: string
}

const PARTICIPANTS: Participant[] = [
  {
    slug: 'aaqib',
    displayName: 'Aaqib',
    photo: '/mastermind-participants/aaiqb-hasnain.jpg',
    teaches: 'slow fashion rooted in cultural heritage and ethical craftsmanship — limited edition collections made with local artisans in Bali and beyond',
    helps: 'people who want to wear clothing that connects to living culture, not mass production',
    casual: "I'm a Dutch entrepreneur with roots across South Asia who traded seven years at Google for building something with soul — a slow fashion brand called HAYAQI that I run from Bali",
    mistake: 'treating content as a volume game instead of a cultural story',
    belief: 'more content leads to more sales',
    language: '"I want to wear something that actually means something." "I\'m tired of buying things that fall apart or were made by exploiting someone." "I want to support real artisans but I don\'t know where to find them." "I want fashion that reflects who I actually am, not just what\'s trending."',
    credibility: '7 years at Google leading marketing strategy for an entire country, now building HAYAQI from Bali with local artisan communities',
    recentWin: 'Opened our first physical store in Ubud -- add a specific sales or foot traffic number here',
    voiceWords: 'thoughtful, cross-cultural, precise',
    neverSay: '"fast fashion," "drop culture," "influencer collab," "mass market," "affordable luxury"',
    voiceSentence: 'I am constantly looking to integrate Western efficiency with Eastern wisdom.',
  },
  {
    slug: 'alex',
    displayName: 'Alex',
    photo: '/mastermind-participants/alex--feldman.jpg',
    teaches: 'creating meaningful impact through science, coaching, and intentional global community building',
    helps: 'scientists, adventurers, and global citizens who want their work to contribute to human flourishing at every scale',
    casual: "I'm a scientist and coach living adventurously around the world, figuring out how to make a real difference at scale",
    mistake: 'assuming that expertise alone is enough to build connection and community',
    belief: 'if your work is good enough, the right people will find you',
    language: '"I have all this knowledge but I don\'t know how to reach people." "I want my work to matter beyond my immediate circle." "I feel isolated doing good work in a vacuum." "I want real community, not just colleagues."',
    credibility: 'Researcher at Kyushu University, 7+ years living and working across multiple countries, trained Rapid Transformational Therapist',
    recentWin: 'Organized a cross-disciplinary co-working jam in Bali -- add a specific attendance or outcome number here',
    voiceWords: 'direct, intellectual, adventurous',
    neverSay: '"woo-woo," "manifest," "hustle," "crush it," "quantum leap"',
    voiceSentence: "I\'m a scientist and coach living adventurously around the world, figuring out how to make a real difference at scale.",
  },
  {
    slug: 'alla',
    displayName: 'Alla',
    photo: '/mastermind-participants/alla-demutska.jpg',
    teaches: 'trauma recovery and emotional regulation through embodied, evidence-based therapy that integrates somatic and mindfulness approaches',
    helps: 'women in the second half of life who are ready to reconnect with their vitality, voice, and self-authorship',
    casual: "I'm a clinical psychologist with a doctorate from Monash and 15 years working with trauma across Singapore, Hong Kong, and Australia — I believe healing isn't about fixing what's broken, it's about expanding your capacity to be fully human",
    mistake: 'treating healing as a practical problem to solve rather than a relational and somatic process',
    belief: 'therapy is about fixing what is broken',
    language: '"I\'ve tried therapy before and it didn\'t really work." "I keep repeating the same patterns no matter what I do." "I know what my issues are, I just can\'t seem to change." "I feel like something is broken in me." "I want to feel alive again, not just functional."',
    credibility: 'Clinical psychologist with a Doctorate from Monash University and 15 years working with trauma across Singapore, Hong Kong, and Australia',
    recentWin: 'Client transformation result to add here with a specific number',
    voiceWords: 'measured, warm, evidence-aware',
    neverSay: '"hustle," "high-vibe," "quantum healing," "manifest," "toxic positivity," "just heal yourself"',
    voiceSentence: 'Healing is not about fixing what is broken; it is about expanding our capacity to be fully human.',
  },
  {
    slug: 'daniel',
    displayName: 'Daniel',
    photo: '/mastermind-participants/daniel-holloway.png',
    teaches: 'AI-powered sales and marketing systems for agencies — results guaranteed or their money back',
    helps: 'agency owners who are doing personalized outreach manually and want a system that does it at scale with guaranteed results',
    casual: "I've built a team of 11, hit $145K revenue months, lost it all, rebuilt from Bali, and now I use AI to do what I couldn't do manually",
    mistake: 'doing personalized outreach manually when AI can handle it at scale',
    belief: 'growth requires a bigger team or more hours',
    language: '"My outreach isn\'t converting." "I\'m spending all day sending emails and barely getting replies." "I know personalization works but I can\'t scale it." "I need a repeatable system, not just hustle."',
    credibility: 'Built a team of 11 and hit $145K revenue months, rebuilt from zero, now offers results-guaranteed AI sales systems',
    recentWin: 'Cracked personalized AI email outreach system and landed a new client plus two promising opportunities in one week',
    voiceWords: 'direct, candid, results-focused',
    neverSay: '"authentic," "showing up," "being seen," "vulnerable," "on a journey"',
    voiceSentence: "I\'ve built a team of 11, hit $145K revenue months, lost it all, rebuilt from Bali, and now I use AI to do what I couldn\'t do manually.",
  },
  {
    slug: 'jasmine',
    displayName: 'Jasmine',
    photo: '/mastermind-participants/jasmine--oh.jpg',
    teaches: 'transformative experiences through music, movement, and expanded states of consciousness — including DJ training for the next generation of ceremony facilitators',
    helps: 'aspiring DJs and facilitators ready to guide transformative experiences through sound and embodiment',
    casual: "I'm a DJ, dance facilitator, and psychedelic therapist who creates spaces where people come home to themselves through sound and movement",
    mistake: 'posting content without a system to capture and nurture the audience they are building',
    belief: 'going viral is enough to build a business',
    language: '"I want to DJ but I don\'t know where to start." "I feel called to lead ceremony but I\'m not trained." "I want to create experiences that actually transform people." "How do I make music that moves people on a deeper level?"',
    credibility: 'Resident DJ aboard the Ritz-Carlton Yacht Collection, Music Director at Nihi Sumba, 6 years facilitating conscious events and ceremony globally',
    recentWin: 'Booking inquiry result to add here with a specific number',
    voiceWords: 'fluid, embodied, expansive',
    neverSay: '"professional," "corporate," "structured plan," "content strategy," "the algorithm"',
    voiceSentence: 'I create spaces where people can reconnect with themselves, awaken their inner vitality, and access profound healing and insight.',
  },
  {
    slug: 'jenny',
    displayName: 'Jenny',
    photo: '/mastermind-participants/jenny-jessen.jpg',
    teaches: "feminine healing arts, Tao Tantric practices, ritual work, and women's facilitation training through retreats, online courses, and the Institut für Feminine Heilkunst",
    helps: 'women ready to deepen their personal healing and learn to guide others through feminine embodiment and sacred practice',
    casual: "I lead international retreats, teacher trainings, and a German online school for women who want to embody their feminine wisdom and share it with others",
    mistake: 'separating the spiritual path from the professional one — treating them as if only one can be real',
    belief: 'deep healing work and a thriving business cannot coexist',
    language: '"I feel disconnected from my body and my feminine nature." "I want to go deeper but I don\'t know which tradition to trust." "I want to guide other women but I don\'t feel qualified yet." "I\'ve been doing the personal work for years and now I want to share it."',
    credibility: '8 years of study in cultural anthropology, energy medicine, and healing arts, founder of Institut fur Feminine Heilkunst, leading retreats across Greece, Portugal, India, Egypt, Germany, Italy, Mexico, and Bali',
    recentWin: 'New enrollment in 1-year training -- add a specific student result or cohort number here',
    voiceWords: 'feminine, ritualistic, empowering',
    neverSay: '"hustle," "grind," "productivity hack," "growth strategy," "scale fast"',
    voiceSentence: 'I lead international retreats and trainings for women who want to embody their feminine wisdom and share it with others.',
  },
  {
    slug: 'joe',
    displayName: 'Joe',
    photo: '/mastermind-participants/joe-che.jpeg',
    teaches: 'how to build AI-powered systems and automations that let a small business run without the founder in every seat. 30 years and 22 ventures taught me what actually creates freedom, and it is not working harder.',
    helps: 'coaches, healers, consultants, and creator-led businesses who are doing everything manually and want to use AI and automation to get their time back without having to become technical to do it',
    casual: "I've started 22 businesses over 30 years. Some flopped, some moved millions of dollars, all of them taught me the same thing: the business should not need you in every seat. That's what I help people build now.",
    mistake: 'building content and taking on clients without any systems behind it, so every new thing they create or sell requires them to personally show up and do all the work again from scratch',
    belief: 'AI and automation are for technical people, or for later once the business is bigger',
    language: '"I\'m not technical." "I keep saying I\'ll set up systems but I never get around to it." "I\'m doing everything myself and I\'m burning out." "I don\'t have time to learn all this." "I\'ll automate once things calm down." "I feel like I\'m always behind."',
    credibility: '30 years, 22 businesses. Trained 90,000+ people in NYC. Ventures that moved millions of dollars. Now running a fully autonomous AI operating system with 65 agents handling marketing, research, and operations.',
    recentWin: 'Built an AI operating system that runs 65+ agents autonomously, including the system that plans, prepares, and documents this entire Mastermind HQ program without manual input.',
    voiceWords: 'direct, experienced, warm',
    neverSay: '"hustle," "crush it," "grind," "game-changer," "unlock your potential," "level up," "high-vibe," "quantum," "manifest," "10x your business"',
    voiceSentence: "I've built 22 businesses, and the one thing none of them came with was a manual for how to stop being the most important part of them.",
  },
  {
    slug: 'johanna',
    displayName: 'Johanna',
    photo: '/mastermind-participants/johanna-bieber.png',
    teaches: 'embodied self-inquiry through somatic and trauma-informed practices — helping people access deeper layers of their inner experience',
    helps: 'people navigating the gap between who they are and how they relate, especially those juggling structure-heavy careers while doing deep inner work',
    casual: "I'm a demand planner turned embodiment coach, and I bring the same structured thinking I used in corporate life to helping people understand their nervous systems and relationship patterns",
    mistake: 'trying to shift relationship patterns through mindset work alone, without addressing what the body is holding',
    belief: 'mindset work is enough to change how we relate',
    language: '"I know what I need to change but I can\'t seem to actually change it." "My relationships keep following the same pattern." "I\'ve done all the therapy and journaling but nothing fully clicks." "I feel disconnected from my body and I don\'t know why."',
    credibility: 'Over a decade in corporate supply chain and operations, now a somatic and trauma-informed coach who bridges structured thinking with deep embodiment work',
    recentWin: 'Built two complete coaching offers in a single deep research session -- client transformation result to add with a specific number',
    voiceWords: 'structured, introspective, bridging',
    neverSay: '"just be yourself," "follow your heart," "you already have all the answers," "high-vibe"',
    voiceSentence: 'What makes my approach unique is that I naturally bridge structured business thinking with deep inner work and embodiment.',
  },
  {
    slug: 'marina',
    displayName: 'Marina',
    photo: '/mastermind-participants/marina--jaubert.jpg',
    teaches: 'building strategic relationships and partnerships through curated experiences that bring the right people into the same room',
    helps: 'founders and entrepreneurs in Bali who want meaningful connections that lead to real partnerships and outcomes',
    casual: "I'm a connector and event designer who creates private rooms where founders meet the right people and partnerships form naturally -- I run Ascend to Bali",
    mistake: 'networking in large groups and expecting meaningful partnerships to form',
    belief: 'you need a big audience to build real influence',
    language: '"I\'m networking constantly and nothing is sticking." "I meet a lot of people but no real partnerships come out of it." "I need the right introductions, not just more connections." "I want to be in the room where decisions are made."',
    credibility: 'Founder of Ascend to Bali, trusted connector in the Bali founder ecosystem with a track record of curated experiences where real partnerships form',
    recentWin: 'Referral commission earned from a successful connection -- add the partnership outcome or dollar amount here',
    voiceWords: 'polished, direct, warm',
    neverSay: '"networking event," "cold outreach," "growth hacking," "leads," "funnel"',
    voiceSentence: 'My passion is curating spaces that empower people and facilitate deep connection, designing private rooms where strategic relationships form quickly and partnerships follow naturally.',
  },
  {
    slug: 'miia',
    displayName: 'Miia',
    photo: '/mastermind-participants/miia-nern.jpg',
    teaches: 'astrology and how to become a working professional astrologer through online group training',
    helps: 'people who want to understand themselves and others through astrology and turn that knowledge into a livelihood',
    casual: "I'm 28, I create astrology content from Bali, and I've grown from 100 to 3,000 followers by going deep rather than chasing trends",
    mistake: 'creating content without building the client journey on the back end',
    belief: 'growing a following will automatically grow a coaching business',
    language: '"I\'ve always been drawn to astrology but I don\'t know if I can make money from it." "I read charts for friends for free but I feel weird charging." "I want to go deeper than reading memes about my sign." "How do I become a real astrologer?"',
    credibility: 'Professional astrologer based in Bali, grew from 100 to 3,000 followers by going deep rather than chasing trends',
    recentWin: 'Grew Instagram from 100 to 3,000 followers and launched first professional astrologer training -- add enrollment number here',
    voiceWords: 'conversational, specific, celestial',
    neverSay: '"manifestation," "law of attraction," "the universe has a plan," "vague cosmic signs," "star sign season"',
    voiceSentence: "I\'ve grown from 100 to 3,000 followers by going deep rather than chasing trends.",
  },
  {
    slug: 'pinamaria',
    displayName: 'Pina',
    photo: '/mastermind-participants/pina-maria-muckle.png',
    teaches: 'energy healing, Reiki, intuitive coaching, feminine embodiment, and dance activations through the Wealth Being Community',
    helps: 'women ready to reconnect with their wealth, joy, and feminine power through energy and embodiment practices',
    casual: "I'm a Reiki Master and intuitive coach who hosts a daily dance and embodiment community for women who are ready to stop dimming their light",
    mistake: 'perfecting the container instead of filling it with people',
    belief: 'more polish leads to more clients',
    language: '"I feel like I\'m meant for more but something is blocking me." "I want to step into my purpose but I keep playing small." "I give my energy to everyone else and have nothing left for myself." "I know I\'m meant to lead but I don\'t feel ready."',
    credibility: 'Reiki Master, intuitive coach, and divine guidance practitioner helping lightworkers step into their purpose and create dream relationships',
    recentWin: 'Community rebranded from HypnoDance to Welcome Home Dance instantly -- add a member growth or engagement number here',
    voiceWords: 'warm, feminine, energetic',
    neverSay: '"hustle," "toxic," "healing journey," "shadow work," "trauma dump"',
    voiceSentence: 'I host a daily dance and embodiment community for women who are ready to stop dimming their light.',
  },
  {
    slug: 'quincee',
    displayName: 'Quincee',
    photo: '/mastermind-participants/quincee-lark.jpg',
    teaches: 'somatic practices, breathwork, and yoga to liberate creative expression and reconnect artists with their creative life force',
    helps: 'artists who want to access their creativity as a sacred, embodied process rather than a grind',
    casual: "I'm a wilderness therapy and yoga-trained facilitator who guides artists into their bodies so they can stop struggling and start creating from a full well",
    mistake: 'treating creative blocks as a mindset problem rather than a body problem',
    belief: 'creativity comes from inspiration — and when inspiration is gone, you just wait',
    language: '"I feel creatively suffocated." "I used to make art all the time and now I can\'t start anything." "I sit down to create and my mind goes blank." "I feel disconnected from the work that used to light me up." "I don\'t know if I\'m even an artist anymore."',
    credibility: 'Wilderness therapy and yoga-trained facilitator, founder of Visionseed, creator of the Visionseed Oracle Deck and Creative Cohort',
    recentWin: 'Brand new photo shoot and fully refreshed digital presence -- add cohort enrollment or oracle deck sales number here',
    voiceWords: 'lyrical, embodied, grounded',
    neverSay: '"content," "algorithm," "hustle," "productivity," "creative output"',
    voiceSentence: 'My work lives at the intersection of art, somatics, spirituality, and healing.',
  },
  {
    slug: 'ronnie',
    displayName: 'Ronnie',
    photo: '/mastermind-participants/ronnie-ansara.JPG',
    teaches: 'hospitality and venue experiences through Electric Avenue Bali — a group of venues including Morabito Art Villa, Desa Eko, Tabu Supper Club, and Ours Restaurant',
    helps: 'people who want to be in the right room in Bali, with the right people, at the right time — and businesses who want to build their brand through unforgettable experiences',
    casual: "I'm the Managing Partner of Electric Avenue Bali — we run some of the most iconic venues on the island, and my job is making sure the people inside them have the time of their lives",
    mistake: 'building a hospitality or venue business on reputation alone with no way for the right people to find it online',
    belief: 'great experiences speak for themselves and do not need to be marketed',
    language: '"I want something truly extraordinary but I don\'t know who to trust to plan it." "Every time I try to do it myself, something falls flat." "I want an experience, not just a trip." "I need someone who actually knows the right people."',
    credibility: 'Over 20 years of Fortune 500 corporate experience, Managing Partner of Electric Avenue Bali operating some of the most iconic venues on the island',
    recentWin: 'Client experience result to add here with a specific outcome or number',
    voiceWords: 'assured, warm, experiential',
    neverSay: '"cheap," "budget," "deal," "affordable," "value for money"',
    voiceSentence: "I\'m the Managing Partner of Electric Avenue Bali -- we run some of the most iconic venues on the island, and my job is making sure the people inside them have the time of their lives.",
  },
  {
    slug: 'sophia',
    displayName: 'Sophia',
    photo: '/mastermind-participants/sophia-fox.png',
    teaches: 'emotional maturity, self-connection, and sovereign leadership for women through the Sisterhood OS global platform',
    helps: 'emotionally self-aware women who want deeper inner work without competition, performance, or losing themselves in the process',
    casual: "I created Sisterhood OS because I kept seeing high-achieving women who were doing everything right on the outside and still felt disconnected from themselves",
    mistake: 'joining communities that feel safe but never actually ask them to grow',
    belief: 'belonging requires fitting in',
    language: '"I\'m high-achieving on the outside but feel empty on the inside." "I\'ve outgrown my friendships but I don\'t know where to find women at my level." "Every women\'s community I join feels either too shallow or too chaotic." "I want to grow, not just belong."',
    credibility: 'Founder of Sisterhood OS, a global personal development platform for women, with 55 masterclass signups in approximately 4 days before running a single ad',
    recentWin: '55 masterclass signups in approximately 4 days with no paid ads',
    voiceWords: 'clear, empowering, elegant',
    neverSay: '"girl boss," "boss babe," "hustle," "tribe," "squad," "manifesting"',
    voiceSentence: 'I created Sisterhood OS because I kept seeing high-achieving women who were doing everything right on the outside and still felt disconnected from themselves.',
  },
  {
    slug: 'sundari',
    displayName: 'SunDari',
    photo: '/mastermind-participants/marci-loughmiller.jpg',
    teaches: 'identity evolution, embodiment, and full-life integration through private mentorship, immersive experiences, media, and publishing',
    helps: 'individuals and leaders ready to expand who they are and align how they live, lead, and create',
    casual: "I'm the Alchemist of Light -- I've worked globally for over two decades guiding people through the kind of transformation that isn't about adding more strategies, it's about becoming more of what was always there",
    mistake: 'optimizing identity at the surface level without integrating it in the body and in how they live',
    belief: 'transformation is about acquiring better strategies',
    language: '"I\'ve done every program and I still feel like something is missing." "I know who I want to be but I can\'t seem to live it." "I\'m successful by every external measure and still don\'t feel like myself." "I want a transformation that actually lasts."',
    credibility: 'Over two decades of global work in identity evolution, author of The Awakened Being, host of Divine Life Mastery Codes on Infynit TV',
    recentWin: 'Lead magnet completed and connected to GoHighLevel -- client transformation result to add with a specific number',
    voiceWords: 'expansive, authoritative, luminous',
    neverSay: '"mindset hack," "manifest," "hustle," "strategy session," "quick fix"',
    voiceSentence: "I guide people through the kind of transformation that isn\'t about adding more strategies, it\'s about becoming more of what was always there.",
  },
  {
    slug: 'tiyana',
    displayName: 'Tiyana',
    photo: '/mastermind-participants/tiyana-jovic.jpg',
    teaches: 'templewear and ritual living rooted in sacred feminine wisdom, tea ceremony, and conscious design',
    helps: 'women drawn to tea ceremony, sacred design, and the feminine path home to presence and devotion',
    casual: "I'm the founder of TI YA RA -- everything I make and offer is designed to invite women back into presence, devotion, and the temple of their own body",
    mistake: 'treating beauty and ritual as optional instead of as the foundation of a life well lived',
    belief: 'spirituality and a real life are separate things',
    language: '"I want to slow down but I don\'t know how." "I\'m drawn to ceremony but it feels inaccessible." "I want to dress with intention, not just for function." "I\'m looking for something sacred in my everyday life."',
    credibility: 'Over 15 years in plant-based wellness, embodied movement, and temple arts, founder of TI YA RA with a physical sanctuary boutique in Ubud and presence in Dubai',
    recentWin: 'Physical store open in Ubud and presence established in Dubai -- add a specific product or mentorship result here',
    voiceWords: 'devotional, slow, sensory',
    neverSay: '"trendy," "influencer," "content strategy," "fast," "drop," "collab"',
    voiceSentence: 'Everything I make and offer is designed to invite women back into presence, devotion, and the temple of their own body.',
  },
]

// ─── Form state type ──────────────────────────────────────────────────────────
type FormState = {
  teaches: string
  helps: string
  casual: string
  mistake: string
  belief: string
  language: string
  credibility: string
  recentWin: string
  voiceWords: string
  neverSay: string
  voiceSentence: string
  topic: string
  details: string
}

function blankForm(): FormState {
  return {
    teaches: '', helps: '', casual: '', mistake: '', belief: '',
    language: '', credibility: '', recentWin: '', voiceWords: '',
    neverSay: '', voiceSentence: '', topic: '', details: '',
  }
}

function participantToForm(p: Participant): FormState {
  return {
    teaches: p.teaches,
    helps: p.helps,
    casual: p.casual,
    mistake: p.mistake,
    belief: p.belief,
    language: p.language ?? '',
    credibility: p.credibility ?? '',
    recentWin: p.recentWin ?? '',
    voiceWords: p.voiceWords ?? '',
    neverSay: p.neverSay ?? '',
    voiceSentence: p.voiceSentence ?? '',
    topic: '',
    details: '',
  }
}

function buildCopyText(form: FormState): string {
  return `${HOOK_LAB_PROMPT}

---

# My Brand Voice Profile

What I teach, sell, or do:
${form.teaches}

Who I help:
${form.helps}

How I describe myself in conversation:
${form.casual}

The number one mistake my audience makes:
${form.mistake}

The belief my audience holds that I want to shift:
${form.belief}

The exact words my audience uses:
${form.language || '[Fill this in: the actual phrases your audience says]'}

Credibility anchor:
${form.credibility || '[Fill this in: years of experience, number of clients, or a specific result]'}

A recent win with specific numbers:
${form.recentWin || '[Fill this in: a recent result with a number attached]'}

Three words that describe how I naturally talk:
${form.voiceWords || '[Fill this in: three words]'}

What I would never say:
${form.neverSay || '[Fill this in: words or phrases that feel off-brand]'}

One sentence that sounds like me:
${form.voiceSentence || '[Fill this in: copy a real sentence from something you recently wrote]'}

This week's topic:
${form.topic || '[Fill this in: what are you posting about this week?]'}

Specific details to weave in:
${form.details || '[Optional: any numbers, tools, or examples to include]'}`
}

// ─── Name card (defined at module level to avoid scroll-jump on re-render) ────
type NameCardProps = {
  slug: string
  displayName: string
  photo: string
  isSelected: boolean
  onClick: () => void
}

function NameCard({ displayName, photo, isSelected, onClick }: NameCardProps) {
  const initials = displayName.slice(0, 2).toUpperCase()
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#7C69C7', '#9D8FE0', '#F5C3C6', '#FCF4EB'],
    })
    onClick()
  }
  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center gap-2 group"
    >
      <div
        className="w-16 h-16 rounded-full overflow-hidden transition-all"
        style={{
          border: isSelected ? '2px solid #9D8FE0' : '2px solid rgba(255,255,255,0.10)',
          boxShadow: isSelected ? '0 0 0 3px rgba(124,105,199,0.25)' : 'none',
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-sm font-bold"
            style={{ background: 'rgba(124,105,199,0.20)', color: '#9D8FE0' }}
          >
            {initials}
          </div>
        )}
      </div>
      <span
        className="text-xs font-medium text-center leading-tight transition-colors"
        style={{ color: isSelected ? '#9D8FE0' : 'rgba(252,244,235,0.55)' }}
      >
        {displayName}
      </span>
    </button>
  )
}

// ─── Field components (defined at module level to avoid scroll-jump) ──────────

type FieldProps = {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  highlight?: boolean
  hint?: string
}

function Field({ label, value, onChange, placeholder, highlight, hint }: FieldProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: highlight ? '#9D8FE0' : 'rgba(252,244,235,0.45)' }}>
          {label}
        </label>
        {highlight && (
          <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(124,105,199,0.18)', color: '#9D8FE0', border: '1px solid rgba(124,105,199,0.30)' }}>
            Fill this in
          </span>
        )}
      </div>
      {hint && <p className="text-xs mb-2" style={{ color: 'rgba(252,244,235,0.35)' }}>{hint}</p>}
      <textarea
        className="w-full rounded-lg px-3 py-2.5 text-sm leading-relaxed resize-y"
        style={{
          background: highlight ? 'rgba(124,105,199,0.08)' : 'rgba(255,255,255,0.04)',
          border: highlight ? '1px solid rgba(124,105,199,0.35)' : '1px solid rgba(255,255,255,0.10)',
          color: 'rgba(252,244,235,0.85)',
          minHeight: '72px',
          outline: 'none',
        }}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function HookWriterPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(blankForm())
  const [copied, setCopied] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load from localStorage or static data when participant is selected
  function selectParticipant(slug: string) {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(`hook-writer-${slug}`) : null
    if (saved) {
      try {
        setForm(JSON.parse(saved))
      } catch {
        const p = PARTICIPANTS.find(x => x.slug === slug)
        setForm(p ? participantToForm(p) : blankForm())
      }
    } else {
      const p = PARTICIPANTS.find(x => x.slug === slug)
      setForm(p ? participantToForm(p) : blankForm())
    }
    setSelected(slug)
  }

  // Debounced save to localStorage
  const saveToStorage = useCallback((slug: string, data: FormState) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(`hook-writer-${slug}`, JSON.stringify(data))
    }, 500)
  }, [])

  function updateField(field: keyof FormState, value: string) {
    const next = { ...form, [field]: value }
    setForm(next)
    if (selected) saveToStorage(selected, next)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildCopyText(form))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">

      {/* Breadcrumb */}
      <nav className="mb-10 text-sm flex items-center gap-2" style={{ color: 'rgba(252,244,235,0.4)' }}>
        <Link href="/" className="hover:text-[#7C69C7] transition-colors">All Sessions</Link>
        <span>/</span>
        <Link href="/session/5" className="hover:text-[#7C69C7] transition-colors">Session 5</Link>
        <span>/</span>
        <span style={{ color: 'rgba(252,244,235,0.6)' }}>Hook Writer: Part 1</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#7C69C7' }}>
          Session 5
        </p>
        <h1 className="gradient-text text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Hook Writer: Part 1
        </h1>
        <p className="text-lg leading-relaxed max-w-2xl" style={{ color: 'rgba(252,244,235,0.6)' }}>
          Click your name to load your profile. Fill in the highlighted fields. Hit Copy. Then paste everything into Claude.ai and hit send.
        </p>
      </div>

      {/* Understanding Hooks — educational section */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold mb-8" style={{ color: 'rgba(252,244,235,0.9)' }}>
          Understanding Hooks
        </h2>

        <div className="space-y-5">

          {/* 1. Curiosity Gap */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-lg font-bold mb-3" style={{ color: 'rgba(252,244,235,0.9)' }}>1. The Curiosity Gap</p>
            <p className="text-sm leading-relaxed mb-2" style={{ color: 'rgba(252,244,235,0.7)' }}>
              You open with a specific, intriguing claim and then deliberately withhold the answer. The viewer has to keep watching to close the gap you just opened.
            </p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(252,244,235,0.45)', fontStyle: 'italic' }}>
              Psychology: The brain experiences an open information gap as mild discomfort and is driven to resolve it. Specific mystery works. Vague mystery does not.
            </p>
            <div className="pl-4 space-y-1.5" style={{ borderLeft: '2px solid rgba(124,105,199,0.35)' }}>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.8)', fontStyle: 'italic' }}>"The one question I stopped asking after 200 clients."</p>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.8)', fontStyle: 'italic' }}>"There are three words I never use in a sales call."</p>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.8)', fontStyle: 'italic' }}>"What my most successful client did differently in week one."</p>
            </div>
          </div>

          {/* 2. Pattern Interrupt */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-lg font-bold mb-3" style={{ color: 'rgba(252,244,235,0.9)' }}>2. The Pattern Interrupt</p>
            <p className="text-sm leading-relaxed mb-2" style={{ color: 'rgba(252,244,235,0.7)' }}>
              You open with something that contradicts what the viewer expected to see. The brain snaps out of scroll mode and pays attention because something did not fit.
            </p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(252,244,235,0.45)', fontStyle: 'italic' }}>
              Psychology: The reticular activating system filters out predictable content automatically. A genuine contradiction forces the brain into alert mode before the viewer has consciously decided to watch.
            </p>
            <div className="pl-4 space-y-1.5" style={{ borderLeft: '2px solid rgba(124,105,199,0.35)' }}>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.8)', fontStyle: 'italic' }}>"Stop trying to find your niche. That is the wrong question."</p>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.8)', fontStyle: 'italic' }}>"The best session I ever ran, I cried the whole way through."</p>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.8)', fontStyle: 'italic' }}>"I charged less and signed more clients that same month."</p>
            </div>
          </div>

          {/* 3. Loss Aversion */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-lg font-bold mb-3" style={{ color: 'rgba(252,244,235,0.9)' }}>3. Loss Aversion</p>
            <p className="text-sm leading-relaxed mb-2" style={{ color: 'rgba(252,244,235,0.7)' }}>
              You name something the viewer is already losing, getting wrong, or missing. That lands harder than telling them what they could gain, because loss feels more urgent than opportunity.
            </p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(252,244,235,0.45)', fontStyle: 'italic' }}>
              Psychology: Kahneman's research shows humans weight potential losses more heavily than equivalent gains. A concrete, personally relevant loss activates attention faster than any promise of reward.
            </p>
            <div className="pl-4 space-y-1.5" style={{ borderLeft: '2px solid rgba(124,105,199,0.35)' }}>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.8)', fontStyle: 'italic' }}>"You are losing clients after session one and you do not know why."</p>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.8)', fontStyle: 'italic' }}>"Every week without a system is a week you are paying yourself last."</p>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.8)', fontStyle: 'italic' }}>"The content you posted last year is still working against you."</p>
            </div>
          </div>

          {/* 4. Belief Reversal */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-lg font-bold mb-3" style={{ color: 'rgba(252,244,235,0.9)' }}>4. The Belief Reversal</p>
            <p className="text-sm leading-relaxed mb-2" style={{ color: 'rgba(252,244,235,0.7)' }}>
              You name a belief you used to hold, then tell them you were wrong. Because you actually lived it, the viewer trusts what comes next, and they start wondering if they are also wrong.
            </p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(252,244,235,0.45)', fontStyle: 'italic' }}>
              Psychology: Challenging an installed belief signals lived experience, not theory. It triggers the question in the viewer's mind: "Am I also wrong about this?" That question is almost impossible to scroll past.
            </p>
            <div className="pl-4 space-y-1.5" style={{ borderLeft: '2px solid rgba(124,105,199,0.35)' }}>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.8)', fontStyle: 'italic' }}>"I used to think consistency was the answer. I was wrong."</p>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.8)', fontStyle: 'italic' }}>"I spent three years helping people heal the wrong thing entirely."</p>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.8)', fontStyle: 'italic' }}>"I believed niching down would shrink my audience. The opposite happened."</p>
            </div>
          </div>

          {/* 5. Direct Address */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-lg font-bold mb-3" style={{ color: 'rgba(252,244,235,0.9)' }}>5. Direct Address</p>
            <p className="text-sm leading-relaxed mb-2" style={{ color: 'rgba(252,244,235,0.7)' }}>
              You name the exact person you are talking to, describing their specific situation so precisely that they feel the hook was written for them alone. The more specific the description, the stronger the pull.
            </p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(252,244,235,0.45)', fontStyle: 'italic' }}>
              Psychology: The brain elevates content that directly references the self above content that does not. Specificity amplifies this effect. "If you're a coach" is far weaker than naming the exact situation the person is already living.
            </p>
            <div className="pl-4 space-y-1.5" style={{ borderLeft: '2px solid rgba(124,105,199,0.35)' }}>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.8)', fontStyle: 'italic' }}>"If you are a healer doing everything manually, this is for you."</p>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.8)', fontStyle: 'italic' }}>"This is for the coach who is fully booked and still not making enough."</p>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.8)', fontStyle: 'italic' }}>"If you have been posting for a year and your audience is not growing, watch this."</p>
            </div>
          </div>

        </div>

        {/* Bridge heading */}
        <h2 className="text-2xl font-bold mt-12 mb-4" style={{ color: 'rgba(252,244,235,0.9)' }}>
          Building Your Hook Writer
        </h2>
        <p className="text-base leading-relaxed max-w-2xl" style={{ color: 'rgba(252,244,235,0.65)' }}>
          Now that you know the five types, you are going to build a profile that tells Claude everything it needs to write hooks in your voice. Click your name below to load your pre-filled profile, then fill in the highlighted fields before hitting Copy.
        </p>
      </div>

      {/* Name picker */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'rgba(252,244,235,0.9)' }}>
          Who are you?
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {PARTICIPANTS.map(p => (
            <NameCard
              key={p.slug}
              slug={p.slug}
              displayName={p.displayName}
              photo={p.photo}
              isSelected={selected === p.slug}
              onClick={() => selectParticipant(p.slug)}
            />
          ))}
        </div>
      </div>

      {/* Form — only shown after a name is selected */}
      {selected && (
        <div className="space-y-8">

          {/* Section: About Your Business */}
          <div className="rounded-2xl p-6 space-y-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="mb-2">
              <h2 className="text-base font-bold mb-1" style={{ color: 'rgba(252,244,235,0.9)' }}>About Your Business</h2>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.4)' }}>Pre-filled from your profile. Edit anything that feels off.</p>
            </div>
            <Field label="What I teach, sell, or do" value={form.teaches} onChange={v => updateField('teaches', v)} />
            <Field label="Who I help" value={form.helps} onChange={v => updateField('helps', v)} />
            <Field label="How I describe myself in conversation" value={form.casual} onChange={v => updateField('casual', v)} placeholder="First person, casual — like you'd say it to someone at a dinner party" />
            <Field label="The number one mistake my audience makes" value={form.mistake} onChange={v => updateField('mistake', v)} />
            <Field label="The belief my audience holds that I want to shift" value={form.belief} onChange={v => updateField('belief', v)} />
          </div>

          {/* Section: Fill These In */}
          <div className="rounded-2xl p-6 space-y-5" style={{ background: 'rgba(124,105,199,0.05)', border: '1px solid rgba(124,105,199,0.20)' }}>
            <div className="mb-2">
              <h2 className="text-base font-bold mb-1" style={{ color: '#9D8FE0' }}>Fill These In</h2>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.4)' }}>These fields are what make the hooks sound like you. Take 5 minutes and fill them in before copying.</p>
            </div>
            <Field
              label="The exact words my audience uses"
              value={form.language}
              onChange={v => updateField('language', v)}
              placeholder={`e.g. "I feel stuck," "I keep attracting the wrong clients," "I know what to do but I don't do it"`}
              highlight
              hint="Their language, not yours. What do they actually say when they describe their problem?"
            />
            <Field
              label="My credibility anchor"
              value={form.credibility}
              onChange={v => updateField('credibility', v)}
              placeholder='e.g. "15 years of practice," "200 clients," "my revenue month went from $0 to $14K"'
              highlight
              hint="Years of experience, number of clients, or a specific result. One specific number beats a vague claim."
            />
            <Field
              label="A recent win with specific numbers"
              value={form.recentWin}
              onChange={v => updateField('recentWin', v)}
              placeholder='e.g. "My student went from 0 to 3 paying clients in 30 days"'
              highlight
              hint="Something that happened in the last few months. If you don't have one yet, leave this blank."
            />
            <Field
              label="Three words that describe how I naturally talk"
              value={form.voiceWords}
              onChange={v => updateField('voiceWords', v)}
              placeholder='e.g. "direct, warm, grounded" or "playful, precise, honest"'
              highlight
              hint="Don't overthink it. Give yourself 10 seconds. First instinct is usually right."
            />
            <Field
              label="What I would never say"
              value={form.neverSay}
              onChange={v => updateField('neverSay', v)}
              placeholder='e.g. "hustle," "crush it," "quantum," "high-vibe," "manifest your dreams"'
              highlight
              hint="Words or phrases that make you cringe when you hear other people in your niche say them."
            />
            <Field
              label="One sentence that sounds like me"
              value={form.voiceSentence}
              onChange={v => updateField('voiceSentence', v)}
              placeholder="Copy a real sentence from something you wrote recently. A caption, an email, anything."
              highlight
              hint="This is the most important field. It calibrates the tone for every hook. Take 3 minutes to find one."
            />
          </div>

          {/* Section: This Week */}
          <div className="rounded-2xl p-6 space-y-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="mb-2">
              <h2 className="text-base font-bold mb-1" style={{ color: 'rgba(252,244,235,0.9)' }}>This Week</h2>
              <p className="text-sm" style={{ color: 'rgba(252,244,235,0.4)' }}>What are you posting about? This changes every week.</p>
            </div>
            <Field
              label="Topic for this week"
              value={form.topic}
              onChange={v => updateField('topic', v)}
              placeholder="e.g. Why I stopped doing discovery calls, The one question I always ask new clients, What happened when I..."
              highlight
            />
            <Field
              label="Specific details to weave in"
              value={form.details}
              onChange={v => updateField('details', v)}
              placeholder="Optional: any tools, numbers, phrases, or examples you want included in the hooks"
            />
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="w-full py-4 rounded-2xl text-base font-bold transition-all"
            style={{
              background: copied
                ? 'rgba(124,105,199,0.25)'
                : 'linear-gradient(135deg, rgba(124,105,199,0.85) 0%, rgba(157,143,224,0.85) 100%)',
              border: copied ? '1px solid rgba(124,105,199,0.40)' : '1px solid rgba(157,143,224,0.50)',
              color: copied ? '#9D8FE0' : '#FCF4EB',
            }}
          >
            {copied ? 'Copied! Now paste into Claude.ai' : 'Copy Hook Lab Prompt + My Profile'}
          </button>

          <p className="text-center text-xs" style={{ color: 'rgba(252,244,235,0.25)' }}>
            Your edits are saved in this browser automatically.
          </p>
        </div>
      )}

      {/* Back link */}
      <div className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link
          href="/session/5"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: 'rgba(252,244,235,0.4)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#7C69C7')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(252,244,235,0.4)')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 8H3M7 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Session 5
        </Link>
      </div>

    </main>
  )
}
