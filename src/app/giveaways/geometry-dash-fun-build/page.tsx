'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'
import { copyWithConfetti } from '@/lib/copyWithConfetti'
import GiveawayEmailModal from '@/components/giveaways/GiveawayEmailModal'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MASTERMIND_URL   = 'https://www.mastermindshq.business'
const P5_EDITOR_URL    = 'https://editor.p5js.org'
const MANYCHAT_KEYWORD = 'dashgame'

const GAME_CODE = `// ============================================================
// GEOMETRY DASH CLONE — Your Build
// Made with p5.js · Paste into editor.p5js.org to play!
// ============================================================

// =============================================
// CHANGE THESE TO CUSTOMIZE YOUR GAME
// =============================================

// How the game feels
const GRAVITY      = 0.70;   // higher = heavier (try 0.5 or 1.2)
const JUMP_FORCE   = -13.5;  // more negative = higher jump (try -18)
const PLAYER_SPEED = 6.5;    // starting speed (try 9 for speed run)
const MAX_FALL     = 15;     // how fast the cube falls

// Your cube
const CUBE_SIZE    = 38;
const GROUND_Y     = 400;    // where the ground is

// Colors — change any hex code to any color you want!
const CUBE_COLOR   = '#FFD700';  // your cube (gold)
const SPIKE_COLOR  = '#FF3300';  // spikes
const PLAT_COLOR   = '#2244DD';  // platforms
const BG_START     = '#0d0020';  // sky color at start (dark purple)
const BG_END       = '#001830';  // sky color at end (dark blue)

// =============================================
// LEVEL DESIGN — add your own obstacles here!
// =============================================
// spike:    { type: 'spike', x: 700 }
// double:   { type: 'double', x: 900 }
// platform: { type: 'platform', x: 1400, yOff: -115, w: 120 }
//   yOff = how high above ground (negative). w = width.

const LEVEL_DEFS = [
  { type: 'spike',    x: 650 },
  { type: 'spike',    x: 850 },
  { type: 'spike',    x: 1050 },
  { type: 'double',   x: 1250 },
  { type: 'platform', x: 1520, yOff: -115, w: 130 },
  { type: 'spike',    x: 1760 },
  { type: 'double',   x: 1950 },
  { type: 'spike',    x: 2150 },
  { type: 'spike',    x: 2230 },
  { type: 'spike',    x: 2310 },
  { type: 'double',   x: 2500 },
  { type: 'platform', x: 2750, yOff: -120, w: 110 },
  { type: 'double',   x: 2960 },
  { type: 'spike',    x: 3160 },
  { type: 'double',   x: 3310 },
  { type: 'spike',    x: 3470 },
  { type: 'double',   x: 3620 },
  { type: 'spike',    x: 3760 },
  { type: 'double',   x: 3900 },
];

const LEVEL_LENGTH = 4400;

// =============================================
// GAME ENGINE
// =============================================
let worldX = 0, player, particles = [], gameState = 'playing', attempts = 1, jumpHeld = false, obstacles;

function setup() {
  createCanvas(800, 480);
  frameRate(60);
  obstacles = buildObstacles();
  resetPlayer();
}

function resetPlayer() {
  player = { x: 150, y: GROUND_Y - CUBE_SIZE, vy: 0, onGround: true, rotation: 0 };
}

function draw() {
  drawBG();
  if (gameState === 'playing') {
    updatePlayer();
    checkCollisions();
    if (worldX >= LEVEL_LENGTH) gameState = 'win';
  }
  updateParticles();
  drawGround();
  drawAllObstacles();
  drawPlayer();
  drawParticles();
  drawHUD();
  if (gameState === 'dead') drawDeathScreen();
  if (gameState === 'win')  drawWinScreen();
}

function drawBG() {
  let t = constrain(worldX / LEVEL_LENGTH, 0, 1);
  let top = lerpColor(color(BG_START), color(BG_END), t);
  let bot = lerpColor(color('#000010'), color('#002244'), t);
  for (let y = 0; y < height; y++) {
    stroke(lerpColor(top, bot, map(y, 0, height, 0, 1)));
    line(0, y, width, y);
  }
  stroke(255, 255, 255, 14); strokeWeight(0.5);
  let gx = (-worldX % 60 + 60) % 60;
  for (let x = gx; x < width; x += 60) line(x, GROUND_Y, x, height);
  for (let y = GROUND_Y; y < height; y += 60) line(0, y, width, y);
  strokeWeight(1);
}

function drawGround() {
  noStroke(); fill(20, 20, 50);
  rect(0, GROUND_Y, width, height - GROUND_Y);
  drawingContext.shadowBlur = 14; drawingContext.shadowColor = '#5566FF';
  stroke('#5566FF'); strokeWeight(2);
  line(0, GROUND_Y, width, GROUND_Y);
  drawingContext.shadowBlur = 0; strokeWeight(1);
}

function updatePlayer() {
  player.vy += GRAVITY; player.vy = min(player.vy, MAX_FALL); player.y += player.vy;
  if (player.y >= GROUND_Y - CUBE_SIZE) {
    player.y = GROUND_Y - CUBE_SIZE; player.vy = 0; player.onGround = true;
    player.rotation = round(player.rotation / 90) * 90;
    if (jumpHeld) doJump();
  } else { player.onGround = false; }
  if (!player.onGround) player.rotation += 7;
  worldX += PLAYER_SPEED + map(worldX, 0, LEVEL_LENGTH, 0, 3.5);
}

function doJump() {
  if (player.onGround) { player.vy = JUMP_FORCE; player.onGround = false; }
}

function drawPlayer() {
  push();
  translate(player.x + CUBE_SIZE / 2, player.y + CUBE_SIZE / 2);
  rotate(radians(player.rotation));
  drawingContext.shadowBlur = 20; drawingContext.shadowColor = CUBE_COLOR;
  fill(CUBE_COLOR); noStroke(); rectMode(CENTER);
  rect(0, 0, CUBE_SIZE, CUBE_SIZE, 5);
  drawingContext.shadowBlur = 0; fill(255, 255, 255, 90);
  rect(0, 0, CUBE_SIZE * 0.52, CUBE_SIZE * 0.52, 2);
  fill(CUBE_COLOR); rotate(PI / 4);
  rect(0, 0, CUBE_SIZE * 0.2, CUBE_SIZE * 0.2);
  pop(); rectMode(CORNER); drawingContext.shadowBlur = 0;
}

function buildObstacles() {
  let list = [];
  for (let def of LEVEL_DEFS) {
    let sz = def.size || 55;
    if (def.type === 'spike')  list.push(makeSpike(def.x, sz, GROUND_Y));
    if (def.type === 'double') { list.push(makeSpike(def.x, sz, GROUND_Y)); list.push(makeSpike(def.x + sz + 2, sz, GROUND_Y)); }
    if (def.type === 'platform') {
      let w = def.w || 120, ph = 18, py = GROUND_Y + (def.yOff || -100) - ph;
      list.push({ type:'platform', wx:def.x, drawY:py, w, h:ph, hx:def.x, hy:py, hw:w, hh:ph });
    }
  }
  return list;
}

function makeSpike(wx, sz, baseY) {
  return { type:'spike', wx, drawY:baseY-sz, size:sz, hx:wx-sz/2+10, hy:baseY-sz+12, hw:sz-20, hh:sz-12 };
}

function drawAllObstacles() {
  for (let obs of obstacles) {
    let sx = obs.wx - worldX;
    if (sx < -120 || sx > width + 120) continue;
    if (obs.type === 'spike')    drawSpike(sx, obs.drawY, obs.size);
    if (obs.type === 'platform') drawPlatform(sx, obs.drawY, obs.w, obs.h);
  }
}

function drawSpike(cx, y, sz) {
  drawingContext.shadowBlur = 14; drawingContext.shadowColor = '#FF4400';
  fill(SPIKE_COLOR); stroke('#FF7700'); strokeWeight(1.5);
  triangle(cx, y, cx - sz/2, y + sz, cx + sz/2, y + sz);
  stroke(255, 180, 50, 160); strokeWeight(1);
  line(cx, y, cx - sz/2, y + sz);
  strokeWeight(1); drawingContext.shadowBlur = 0;
}

function drawPlatform(sx, y, w, h) {
  drawingContext.shadowBlur = 10; drawingContext.shadowColor = '#4466FF';
  fill(PLAT_COLOR); stroke('#5577FF'); strokeWeight(1.5);
  rect(sx, y, w, h, 3);
  stroke('#88AAFF'); strokeWeight(2);
  line(sx + 3, y + 2, sx + w - 3, y + 2);
  strokeWeight(1); drawingContext.shadowBlur = 0;
}

function checkCollisions() {
  let px = player.x + 5, py = player.y + 5, pw = CUBE_SIZE - 10, ph = CUBE_SIZE - 10;
  for (let obs of obstacles) {
    let osx = obs.hx - worldX;
    if (osx + obs.hw < 0 || osx > width) continue;
    if (!aabb(px, py, pw, ph, osx, obs.hy, obs.hw, obs.hh)) continue;
    if (obs.type === 'spike') { triggerDeath(); return; }
    if (obs.type === 'platform') {
      let prevBot = py + ph - player.vy;
      if (player.vy > 0 && prevBot <= obs.hy + 3) {
        player.y = obs.hy - CUBE_SIZE; player.vy = 0; player.onGround = true;
        player.rotation = round(player.rotation / 90) * 90;
        if (jumpHeld) doJump();
      } else { triggerDeath(); return; }
    }
  }
}

function aabb(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx+bw && ax+aw > bx && ay < by+bh && ay+ah > by;
}

function triggerDeath() {
  gameState = 'dead';
  let cx = player.x + CUBE_SIZE/2, cy = player.y + CUBE_SIZE/2;
  for (let i = 0; i < 30; i++) {
    let a = random(TWO_PI), spd = random(2.5, 11);
    particles.push({ x:cx, y:cy, vx:cos(a)*spd, vy:sin(a)*spd-random(1,5),
      life:255, size:random(3,10), shape:random()>0.5?'rect':'tri',
      rot:random(TWO_PI), rs:random(-0.3,0.3), col:random([CUBE_COLOR,'#FFFFFF','#FFB300']) });
  }
}

function updateParticles() {
  for (let i = particles.length-1; i>=0; i--) {
    let p = particles[i];
    p.vy += 0.4; p.x += p.vx; p.y += p.vy; p.rot += p.rs; p.life -= 5;
    if (p.life <= 0) particles.splice(i,1);
  }
}

function drawParticles() {
  noStroke();
  for (let p of particles) {
    push(); translate(p.x, p.y); rotate(p.rot);
    let c = color(p.col); fill(red(c), green(c), blue(c), p.life);
    if (p.shape === 'rect') { rectMode(CENTER); rect(0,0,p.size,p.size); }
    else triangle(0,-p.size,-p.size/2,p.size/2,p.size/2,p.size/2);
    pop();
  }
  rectMode(CORNER);
}

function drawHUD() {
  let prog = constrain(worldX / LEVEL_LENGTH, 0, 1);
  noStroke(); fill(0,0,0,100); rect(40,10,width-80,15,7);
  fill(lerpColor(color('#00FFCC'), color('#FFDD00'), prog));
  drawingContext.shadowBlur = 8; drawingContext.shadowColor = '#00FFCC';
  rect(40,10,(width-80)*prog,15,7);
  drawingContext.shadowBlur = 0;
  fill(255,255,255,200); noStroke(); textSize(11); textAlign(CENTER,CENTER);
  text(floor(prog*100)+'%', width/2, 17);
  textAlign(LEFT,TOP); fill(255,255,255,100); textSize(11);
  text('Attempt '+attempts, 8, 30);
}

function drawDeathScreen() {
  if (particles.length > 8) return;
  fill(0,0,0,165); noStroke(); rect(0,0,width,height);
  fill('#FF5555'); textSize(52); textAlign(CENTER,CENTER);
  text(floor(constrain(worldX/LEVEL_LENGTH,0,1)*100)+'%', width/2, height/2-45);
  fill(255,255,255,210); textSize(16);
  text('Click or press SPACE to try again', width/2, height/2+12);
  fill(255,255,255,70); textSize(11);
  text('Attempt '+attempts, width/2, height/2+42);
}

function drawWinScreen() {
  fill(0,0,0,170); noStroke(); rect(0,0,width,height);
  fill('#FFD700'); textSize(56); textAlign(CENTER,CENTER);
  text('100%', width/2, height/2-55);
  fill('#FFFFFF'); textSize(24); text('LEVEL COMPLETE', width/2, height/2+5);
  fill(255,255,255,140); textSize(14);
  text('Click or press SPACE to play again', width/2, height/2+48);
}

function keyPressed()  { if (key===' '||keyCode===UP_ARROW) { jumpHeld=true;  handleAction(); } }
function keyReleased() { if (key===' '||keyCode===UP_ARROW)   jumpHeld=false; }
function mousePressed()  { jumpHeld=true;  handleAction(); }
function mouseReleased() { jumpHeld=false; }
function touchStarted()  { jumpHeld=true;  handleAction(); return false; }
function touchEnded()    { jumpHeld=false; return false; }

function handleAction() {
  if (gameState==='playing') { doJump(); return; }
  if (gameState==='dead' && particles.length<=8) { restart(); return; }
  if (gameState==='win') { restart(); return; }
}

function restart() {
  attempts++; worldX=0; particles=[]; gameState='playing'; resetPlayer();
}`

const STEP_SECTIONS = [
  {
    name: 'Physics and feel',
    count: 4,
    items: [
      { name: 'GRAVITY', desc: 'How fast the cube falls. Default 0.70. Try 0.5 for floaty Moon Physics. Try 1.2 for heavy tank mode.' },
      { name: 'JUMP_FORCE', desc: 'How high the cube jumps. Default -13.5. More negative = higher. Try -18 for jumps that go halfway up the screen.' },
      { name: 'PLAYER_SPEED', desc: 'How fast the level scrolls at the start. Default 6.5. Try 9 for a speed run. Try 4 to learn the level.' },
      { name: 'MAX_FALL', desc: 'Terminal velocity — how fast the cube falls maximum. Raise it for snappier falls. Lower it for floatier feel.' },
    ],
  },
  {
    name: 'Colors and style',
    count: 5,
    items: [
      { name: 'CUBE_COLOR', desc: "Your cube's color. Default '#FFD700' (gold). Try '#00FFFF' for cyan, '#FF00FF' for purple, '#FF4444' for red." },
      { name: 'SPIKE_COLOR', desc: "Spike color. Default '#FF3300' (orange-red). Try '#00FF88' for alien spikes, '#FFFFFF' for white ice spikes." },
      { name: 'PLAT_COLOR', desc: "Platform color. Default '#2244DD' (blue). Platforms glow whatever color you set here." },
      { name: 'BG_START', desc: "Sky color at the beginning of the level. Default '#0d0020' (deep purple). The sky transitions to BG_END as you progress." },
      { name: 'BG_END', desc: "Sky color at the end of the level. Default '#001830' (dark blue). Change both to create completely different vibes." },
    ],
  },
  {
    name: 'Level design',
    count: 3,
    items: [
      { name: 'spike', desc: "{ type: 'spike', x: 700 } — A single spike. x is how far from the start. Add more by copying this line with bigger x values." },
      { name: 'double', desc: "{ type: 'double', x: 900 } — Two spikes side by side. Much harder to jump over. Space them at least 200 apart from other obstacles." },
      { name: 'platform', desc: "{ type: 'platform', x: 1400, yOff: -115, w: 120 } — A floating platform. yOff controls height above ground (more negative = higher). w is the width." },
    ],
  },
]

// ---------------------------------------------------------------------------
// Magnetic button hook
// ---------------------------------------------------------------------------
function useMagnet(strength = 0.3) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
    el.style.transition = 'transform 0.1s ease-out'
  }, [strength])
  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0px, 0px)'
    el.style.transition = 'transform 0.4s ease-out'
  }, [])
  return { ref, onMouseMove, onMouseLeave }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function GeometryDashPage() {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(STEP_SECTIONS.map((s) => s.name)),
  )
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const statRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null])

  const toggleSection = useCallback((name: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }, [])

  // Load fonts
  useEffect(() => {
    if (document.querySelector('link[data-font="cormorant"]')) return
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,600;1,700&display=swap'
    link.rel = 'stylesheet'
    link.setAttribute('data-font', 'cormorant')
    document.head.appendChild(link)
  }, [])

  // Lenis smooth scroll
  useEffect(() => {
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null
    let rafId = 0
    ;(async () => {
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({ duration: 1.1 }) as unknown as { raf: (t: number) => void; destroy: () => void }
      const raf = (time: number) => { lenis!.raf(time); rafId = requestAnimationFrame(raf) }
      rafId = requestAnimationFrame(raf)
    })()
    return () => { if (lenis) lenis.destroy(); cancelAnimationFrame(rafId) }
  }, [])

  // Canvas falling particles
  useEffect(() => {
    const canvas = particleCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    type Particle = { x: number; y: number; r: number; dx: number; dy: number; alpha: number; color: string }
    const colors = ['#8B79D4', '#F5C3C6', '#9D8FE0', '#BDB3E8', '#FCF4EB', '#FFD700']
    const particles: Particle[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.4,
      dx: (Math.random() - 0.5) * 0.4,
      dy: Math.random() * 0.7 + 0.3,
      alpha: Math.random() * 0.22 + 0.05,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    let animId = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.y > canvas.height + 5) { p.y = -5; p.x = Math.random() * canvas.width }
        if (p.x < -5) p.x = canvas.width + 5
        if (p.x > canvas.width + 5) p.x = -5
      })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  // CountUp animated stats
  useEffect(() => {
    const values = [19, 250, 0]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const idx = statRefs.current.indexOf(el as HTMLSpanElement)
          if (idx === -1) return
          ;(async () => {
            const { CountUp } = await import('countup.js')
            const cu = new CountUp(el, values[idx], { duration: 2.4, separator: '' })
            if (!cu.error) cu.start()
          })()
          observer.unobserve(el)
        })
      },
      { threshold: 0.8 },
    )
    statRefs.current.forEach((r) => { if (r) observer.observe(r) })
    return () => observer.disconnect()
  }, [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Build a Geometry Dash Clone with p5.js',
    description: 'Copy the full game code, paste into editor.p5js.org, and play your own Geometry Dash clone in under 2 minutes.',
    author: { '@type': 'Person', name: 'Joe Che', url: 'https://www.mastermindshq.business' },
    publisher: { '@type': 'Organization', name: 'Business Automation Mastermind', url: 'https://www.mastermindshq.business' },
    step: [
      { '@type': 'HowToStep', name: 'Copy the game code', text: 'Copy the full p5.js game code from this page.', position: 1 },
      { '@type': 'HowToStep', name: 'Open editor.p5js.org', text: 'Go to editor.p5js.org, delete the starter code, and paste the game code.', position: 2 },
      { '@type': 'HowToStep', name: 'Click Play and make it yours', text: 'Hit the Play button. Use SPACE or click to jump. Then change colors, physics, and level design.', position: 3 },
    ],
    tool: [{ '@type': 'HowToTool', name: 'p5.js web editor (editor.p5js.org)' }],
    totalTime: 'PT2M',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        @keyframes aurora-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -40px) scale(1.1); }
          66%       { transform: translate(-20px, 25px) scale(0.93); }
        }
        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(-35px, 30px) scale(1.07); }
          70%       { transform: translate(45px, -15px) scale(0.96); }
        }
        .aurora-a { animation: aurora-drift 16s ease-in-out infinite; }
        .aurora-b { animation: aurora-drift-2 20s ease-in-out infinite; }
        .glow-card { transition: box-shadow 0.3s ease, border-color 0.3s ease; }
        .glow-card:hover {
          box-shadow: 0 0 28px rgba(124, 105, 199, 0.12), 0 0 0 1px rgba(124, 105, 199, 0.18);
          border-color: rgba(124, 105, 199, 0.22) !important;
        }
        .glow-btn { transition: box-shadow 0.2s ease, background-color 0.15s ease, transform 0.1s ease-out; }
        .glow-btn:hover { box-shadow: 0 0 32px rgba(124, 105, 199, 0.45), 0 0 60px rgba(124, 105, 199, 0.2); }
        .glow-btn-pink:hover { box-shadow: 0 0 32px rgba(245, 195, 198, 0.5), 0 0 60px rgba(245, 195, 198, 0.2); }
        .glow-btn-gold:hover { box-shadow: 0 0 32px rgba(255, 215, 0, 0.45), 0 0 60px rgba(255, 215, 0, 0.2); }
        .code-scroll { max-height: 420px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(124,105,199,0.3) transparent; }
        .code-scroll::-webkit-scrollbar { width: 4px; }
        .code-scroll::-webkit-scrollbar-track { background: transparent; }
        .code-scroll::-webkit-scrollbar-thumb { background: rgba(124,105,199,0.3); border-radius: 2px; }
      `}</style>

      <div className="min-h-screen bg-[#151515] text-[#FCF4EB] overflow-x-hidden">

        {/* Full-page falling particles */}
        <canvas ref={particleCanvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />

        {/* ================================================================ */}
        {/* SECTION 1: HERO                                                   */}
        {/* ================================================================ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-4 pt-6 sm:pt-8">

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 mb-6 flex justify-center sm:absolute sm:top-10 sm:left-0 sm:right-0 sm:mb-0"
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
              Free vibe code build from the{' '}
              <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#BDB3E8] transition-colors underline underline-offset-2 decoration-[#7C69C7]/40">
                Business Automation Mastermind
              </a>
            </span>
          </motion.div>

          {/* Aurora glow blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="aurora-a absolute top-[10%] left-[15%] w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] rounded-full opacity-[0.09]"
              style={{ background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)', filter: 'blur(80px)' }} />
            <div className="aurora-b absolute top-[30%] right-[10%] w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] rounded-full opacity-[0.07]"
              style={{ background: 'radial-gradient(circle, #8B79D4 0%, transparent 70%)', filter: 'blur(90px)' }} />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-2 sm:whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#9D8FE0]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic', fontWeight: 700,
                fontSize: 'clamp(1.8rem, 5.5vw, 3.8rem)',
                lineHeight: 1.2, letterSpacing: '-0.01em', paddingBottom: '0.05em',
              }}
            >
              Build Geometry Dash with p5.js
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mb-5 sm:whitespace-nowrap text-[#FCF4EB]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 600, fontSize: 'clamp(1.1rem, 3.2vw, 2.6rem)', lineHeight: 1.15,
              }}
            >
              Copy the code. Paste it. Play it. Then make it yours.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.6 }}
              className="text-[#FCF4EB]/55 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-6"
            >
              A fully working Geometry Dash clone built in p5.js. Spinning cube, physics, spikes, platforms, particle explosions, neon glow, and a progress bar. Paste the full code into the free p5.js editor and play in under 2 minutes. No install, no account, no tools. Then change the colors, the physics, and the level.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-6"
            >
              <span className="text-[#FCF4EB]/28 text-xs uppercase tracking-widest">Runs in</span>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] border border-[#7C69C7]/35">
                <span className="text-[#FFD700] text-sm">◆</span>
                <span className="text-[#FCF4EB]/75 text-sm font-medium">editor.p5js.org</span>
                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,215,0,0.12)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.25)' }}>
                  Free
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
                <span className="text-[#9D8FE0] text-sm">◇</span>
                <span className="text-[#FCF4EB]/75 text-sm font-medium">Any browser</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.0 }}
              className="flex items-center justify-center gap-2 text-[#FCF4EB]/22 text-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              <span>Scroll to get the full game code</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.15 }}
              className="mt-4 text-[#FCF4EB]/28 text-xs uppercase tracking-[0.22em]"
            >
              ManyChat keyword: {MANYCHAT_KEYWORD}
            </motion.p>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 2: HOW IT WORKS                                          */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB]">
              Up and running in 2 minutes.
            </h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { step: '01', title: 'Copy the code', body: 'Hit the big gold button below. The entire game — physics, level design, particles, glow effects — copies to your clipboard.' },
              { step: '02', title: 'Paste and play', body: 'Open editor.p5js.org, delete the starter code, paste, and click the Play button. Your Geometry Dash clone is running.' },
              { step: '03', title: 'Customize everything', body: 'Change colors, jump height, gravity, speed, and add your own spikes and platforms. Every setting is labeled at the top of the file.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7">
                <div className="text-4xl font-extrabold text-[#7C69C7]/20 mb-5 font-mono">{item.step}</div>
                <h3 className="text-[#FCF4EB] font-bold text-base mb-2">{item.title}</h3>
                <p className="text-[#FCF4EB]/44 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 3: MASTERMIND CTA                                        */}
        {/* ================================================================ */}
        <MastermindCTA />

        {/* ================================================================ */}
        {/* SECTION 4: PARTICIPANT REACTIONS                                 */}
        {/* ================================================================ */}
        <MastermindReactionsSection />

        {/* ================================================================ */}
        {/* SECTION 5: THE GAME CODE                                         */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-10">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/25">
                The Game Code
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#FCF4EB] mb-4">
                Copy. Paste. Play.
              </h2>
              <p className="text-[#FCF4EB]/45 max-w-xl mx-auto leading-relaxed">
                The full game code below. Go to{' '}
                <a href={P5_EDITOR_URL} target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:text-[#FFE055] transition-colors">
                  editor.p5js.org
                </a>
                , delete the starter code, paste this in, and click Play. Use SPACE or click to jump. The code is yours to change, break, and rebuild.
              </p>
            </div>

            {/* Code block */}
            <div className="my-6 rounded-xl overflow-hidden border border-white/[0.08] border-l-2 border-l-[#FFD700]">
              <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                <span className="text-xs text-[#FCF4EB]/40 font-mono">sketch.js — paste into editor.p5js.org</span>
                <InlineCopyButton text={GAME_CODE} onAfterCopy={() => setEmailModalOpen(true)} />
              </div>
              <div className="code-scroll">
                <pre className="p-5 text-xs font-mono leading-[1.7] text-[#FCF4EB]/72"
                  style={{ background: '#0d0d0d', whiteSpace: 'pre', overflowX: 'auto' }}>
                  <code>{GAME_CODE}</code>
                </pre>
              </div>
            </div>

            {/* Big copy button */}
            <GameCopyButton gameCode={GAME_CODE} onAfterCopy={() => setEmailModalOpen(true)} editorUrl={P5_EDITOR_URL} />

            <p className="text-[#FCF4EB]/20 text-[11px] text-center mt-5 max-w-md mx-auto leading-relaxed">
              Zero dependencies. Works in any modern browser. No account required.
            </p>
            <p className="text-[#FCF4EB]/20 text-[11px] text-center mt-3 max-w-md mx-auto leading-relaxed">
              Coming from Instagram or ManyChat? The giveaway keyword is <span className="font-bold uppercase text-[#FFD700]/75">{MANYCHAT_KEYWORD}</span>.
            </p>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 6: STATS                                                 */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 pt-6 pb-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { idx: 0, value: 19, label: 'obstacles in the default level', suffix: '' },
              { idx: 1, value: 250, label: 'lines of code — all yours to change', suffix: '+' },
              { idx: 2, value: 0, label: 'installs, accounts, or tools needed', suffix: '' },
            ].map((stat) => (
              <motion.div key={stat.idx} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: stat.idx * 0.08 }}
                className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 text-center">
                <div className="text-5xl font-extrabold mb-3 tabular-nums" style={{ fontFamily: 'monospace', color: '#FFD700' }}>
                  <span ref={(el) => { statRefs.current[stat.idx] = el }}>0</span>
                  {stat.suffix && <span className="text-3xl">{stat.suffix}</span>}
                </div>
                <p className="text-[#FCF4EB]/40 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 7: VIBE CODE INSTRUCTIONS                                */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 bg-[#7C69C7]/15 text-[#9D8FE0] border border-[#7C69C7]/25">
              Vibe Code Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
              Step-by-step. Copy. Change. See what happens.
            </h2>
            <p className="text-[#FCF4EB]/35 text-sm max-w-lg mx-auto">
              The best way to learn: change one thing, hit Play, see what it does. These steps take you from copy-paste to a custom level.
            </p>
          </motion.div>

          <div className="space-y-6">

            {/* Step 01 */}
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 space-y-5">
              <div className="flex items-start gap-5">
                <div className="text-4xl font-extrabold text-[#FFD700]/20 font-mono flex-shrink-0">01</div>
                <div className="flex-1">
                  <h3 className="text-[#FCF4EB] font-bold text-lg mb-2">Open the p5.js editor and paste the code</h3>
                  <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-4">
                    Go to <a href={P5_EDITOR_URL} target="_blank" rel="noopener noreferrer" className="text-[#FFD700] hover:text-[#FFE055] underline underline-offset-2">editor.p5js.org</a>. You&apos;ll see some starter code in the left panel. Select all of it and delete it. Then paste the game code you copied. Click the Play button (the triangle at the top). You should hear the game start and see the cube running.
                  </p>
                  <div className="rounded-xl overflow-hidden border border-white/[0.08] border-l-2 border-l-[#FFD700]">
                    <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                      <span className="text-xs text-[#FCF4EB]/40 font-mono">Where to go</span>
                      <InlineCopyButton text={P5_EDITOR_URL} />
                    </div>
                    <pre className="p-4 text-sm font-mono text-[#FFD700]/80" style={{ background: '#0d0d0d' }}>
                      <code>https://editor.p5js.org</code>
                    </pre>
                  </div>
                  <p className="text-[#FCF4EB]/28 text-xs mt-3">
                    Controls: SPACE or click to jump. Hold to keep jumping when you land.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 02 */}
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
              className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 space-y-5">
              <div className="flex items-start gap-5">
                <div className="text-4xl font-extrabold text-[#FFD700]/20 font-mono flex-shrink-0">02</div>
                <div className="flex-1">
                  <h3 className="text-[#FCF4EB] font-bold text-lg mb-2">Change your cube color</h3>
                  <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-4">
                    Near the top of the code, find the <code className="font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-xs text-[#FFD700]">CUBE_COLOR</code> line. Replace the hex code with any color. Hit Stop, then Play to see the change.
                  </p>
                  <div className="rounded-xl overflow-hidden border border-white/[0.08] border-l-2 border-l-[#9D8FE0]">
                    <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                      <span className="text-xs text-[#FCF4EB]/40 font-mono">Change this line</span>
                      <InlineCopyButton text={`const CUBE_COLOR   = '#00FFFF';  // try cyan`} />
                    </div>
                    <pre className="p-4 text-sm font-mono leading-relaxed text-[#FCF4EB]/80" style={{ background: '#0d0d0d' }}>
                      <code>{`const CUBE_COLOR   = '#00FFFF';  // cyan cube\nconst CUBE_COLOR   = '#FF00FF';  // magenta cube\nconst CUBE_COLOR   = '#FF4444';  // red cube\nconst CUBE_COLOR   = '#00FF88';  // neon green cube`}</code>
                    </pre>
                  </div>
                  <p className="text-[#FCF4EB]/28 text-xs mt-3">
                    The cube also glows whatever color you pick. Change SPIKE_COLOR and BG_START the same way.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 03 */}
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 space-y-5">
              <div className="flex items-start gap-5">
                <div className="text-4xl font-extrabold text-[#FFD700]/20 font-mono flex-shrink-0">03</div>
                <div className="flex-1">
                  <h3 className="text-[#FCF4EB] font-bold text-lg mb-2">Change how the game feels</h3>
                  <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-4">
                    Try these physics tweaks. Change one at a time — that is how you learn what each one does.
                  </p>
                  <div className="rounded-xl overflow-hidden border border-white/[0.08] border-l-2 border-l-[#9D8FE0]">
                    <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                      <span className="text-xs text-[#FCF4EB]/40 font-mono">Physics presets to try</span>
                      <InlineCopyButton text={`const GRAVITY = 0.4;   // floaty Moon Physics\nconst JUMP_FORCE = -18; // super high jumps\nconst PLAYER_SPEED = 9; // speed run mode`} />
                    </div>
                    <pre className="p-4 text-sm font-mono leading-relaxed text-[#FCF4EB]/80" style={{ background: '#0d0d0d' }}>
                      <code>{`// Moon Physics — floaty and slow\nconst GRAVITY      = 0.4;\nconst JUMP_FORCE   = -10;\n\n// Tank Mode — heavy and fast fall\nconst GRAVITY      = 1.3;\nconst JUMP_FORCE   = -15;\n\n// Speed Run — same physics, faster scroll\nconst PLAYER_SPEED = 9;\n\n// Super Jump — jump almost off screen\nconst JUMP_FORCE   = -20;`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 04 */}
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
              className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 space-y-5">
              <div className="flex items-start gap-5">
                <div className="text-4xl font-extrabold text-[#FFD700]/20 font-mono flex-shrink-0">04</div>
                <div className="flex-1">
                  <h3 className="text-[#FCF4EB] font-bold text-lg mb-2">Add your own obstacles</h3>
                  <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-4">
                    Find <code className="font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-xs text-[#9D8FE0]">LEVEL_DEFS</code> near the top. Add new lines using the formats below. The <code className="font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-xs">x</code> value is how far from the start (higher = later in the level).
                  </p>
                  <div className="rounded-xl overflow-hidden border border-white/[0.08] border-l-2 border-l-[#9D8FE0]">
                    <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                      <span className="text-xs text-[#FCF4EB]/40 font-mono">Obstacle formats — copy any of these</span>
                      <InlineCopyButton text={`{ type: 'spike', x: 400 },\n{ type: 'double', x: 500 },\n{ type: 'platform', x: 700, yOff: -110, w: 130 },`} />
                    </div>
                    <pre className="p-4 text-sm font-mono leading-relaxed text-[#FCF4EB]/80" style={{ background: '#0d0d0d' }}>
                      <code>{`// Single spike — easiest to jump\n{ type: 'spike',    x: 400 },\n\n// Two spikes side by side — harder!\n{ type: 'double',   x: 500 },\n\n// Floating platform — jump on top\n{ type: 'platform', x: 700, yOff: -110, w: 130 },\n//                           ^height   ^width\n\n// Big spike (size: controls spike size)\n{ type: 'spike',    x: 600, size: 80 },`}</code>
                    </pre>
                  </div>
                  <p className="text-[#FCF4EB]/28 text-xs mt-3">
                    Add <code className="font-mono bg-white/[0.08] px-1 rounded text-[10px]">{`{ type: 'spike', x: 300 }`}</code> near the start to test it right away. Increase x to push it further into the level.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 05 */}
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 space-y-5">
              <div className="flex items-start gap-5">
                <div className="text-4xl font-extrabold text-[#FFD700]/20 font-mono flex-shrink-0">05</div>
                <div className="flex-1">
                  <h3 className="text-[#FCF4EB] font-bold text-lg mb-2">Take it further with AI</h3>
                  <p className="text-[#FCF4EB]/55 text-sm leading-relaxed mb-4">
                    Once you have the basics working, paste this prompt into Claude Code or Codex to add new features. Describe what you want and AI will add the code.
                  </p>
                  <div className="rounded-xl overflow-hidden border border-white/[0.08] border-l-2 border-l-[#7C69C7]">
                    <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                      <span className="text-xs text-[#FCF4EB]/40 font-mono">Paste into Claude Code</span>
                      <InlineCopyButton text={`I built a Geometry Dash clone in p5.js. Here is the full code:\n\n[paste your code here]\n\nPlease add these features:\n1. Stars in the background that scroll at half speed (parallax effect)\n2. The cube changes color gradually as the level progresses\n3. A screen shake effect when the player dies\n4. A coin floating in the air at x=1800, y=300 — collect it for +1 score shown in the top right\nKeep all the existing physics and level design exactly the same.`} />
                    </div>
                    <pre className="p-4 text-sm font-mono leading-relaxed text-[#FCF4EB]/75" style={{ background: '#0d0d0d', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      <code>{`I built a Geometry Dash clone in p5.js. Here is the full code:\n\n[paste your code here]\n\nPlease add these features:\n1. Stars in the background that scroll at half speed\n   (parallax effect)\n2. The cube changes color gradually as the level\n   progresses (use lerpColor)\n3. A screen shake effect when the player dies\n4. A coin floating at x=1800 — collect it for +1 score\nKeep all existing physics and level design the same.`}</code>
                    </pre>
                  </div>
                  <p className="text-[#FCF4EB]/28 text-xs mt-3">
                    Replace <code className="font-mono bg-white/[0.08] px-1 rounded text-[10px]">[paste your code here]</code> with your actual code. AI will return a new version with the features added.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 8: WHAT'S IN THE CODE                                    */}
        {/* ================================================================ */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FCF4EB] mb-3">
              What is inside the code
            </h2>
            <p className="text-[#FCF4EB]/35 text-sm max-w-lg mx-auto">
              Every system you can break, change, and rebuild.
            </p>
          </motion.div>

          <div className="space-y-3">
            {STEP_SECTIONS.map((section, i) => {
              const isOpen = openSections.has(section.name)
              return (
                <motion.div key={section.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="glow-card bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden">
                  <button onClick={() => toggleSection(section.name)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.025] transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-[#FCF4EB] font-semibold text-sm sm:text-base">{section.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20 px-2 py-0.5 rounded-full">
                        {section.count}
                      </span>
                    </div>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9D8FE0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/[0.06] px-6 pb-5 pt-3">
                      <div className="grid gap-1 sm:grid-cols-2">
                        {section.items.map((item) => (
                          <div key={item.name} className="flex items-start gap-3 p-3 rounded-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] mt-[7px] flex-shrink-0" />
                            <div>
                              <span className="text-[#FFD700] text-sm font-mono font-medium">{item.name}</span>
                              <p className="text-[#FCF4EB]/34 text-xs leading-relaxed mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ================================================================ */}
        {/* P.S. NOTE                                                         */}
        {/* ================================================================ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6 pb-16 text-center">
          <p className="text-[#FCF4EB]/22 text-sm leading-relaxed italic">
            P.S. This build started as a demo for Parker, a 12-year-old learning to code. If a kid can paste this, change the colors, and add his own spikes in 20 minutes, so can you. The hardest part is the first copy and paste.
          </p>
        </motion.div>

        {/* Footer */}
        <div className="text-center pb-10">
          <a href={MASTERMIND_URL} target="_blank" rel="noopener noreferrer"
            className="text-[#FCF4EB]/14 text-xs uppercase tracking-widest hover:text-[#FCF4EB]/35 transition-colors">
            Business Automation Mastermind
          </a>
        </div>

      </div>
      <GiveawayEmailModal
        slug={MANYCHAT_KEYWORD}
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        headingOverride="Want the vibe code instructions by email too?"
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// Mastermind CTA
// ---------------------------------------------------------------------------
function MastermindCTA() {
  const magnet = useMagnet(0.28)
  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(245,195,198,0.10) 0%, rgba(124,105,199,0.08) 100%)', border: '1px solid rgba(245,195,198,0.15)' }}>
        <div className="px-6 sm:px-14 pb-12 pt-8 text-center">
          <h2 className="text-2xl sm:text-5xl font-bold text-[#FCF4EB] mb-4">Want to learn how to do this?</h2>
          <p className="text-xl sm:text-3xl font-bold mb-5">
            <a href="https://www.mastermindshq.business" target="_blank" rel="noopener noreferrer"
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6] hover:opacity-80 transition-opacity">
              Join the Business Automation Mastermind
            </a>
          </p>
          <p className="text-[#FCF4EB]/52 max-w-xl mx-auto mb-8 leading-relaxed text-base sm:text-lg">
            A small, focused group of business owners who meet weekly to build real things, fast -- leaving more time to serve clients and be with the people you love.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center mb-9">
            {['Small group, capped at 15', 'We meet weekly', 'Idea to live build in one session'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[#FCF4EB]/58 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F5C3C6] flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <a ref={magnet.ref as React.RefObject<HTMLAnchorElement>} href="https://www.mastermindshq.business"
            target="_blank" rel="noopener noreferrer" onMouseMove={magnet.onMouseMove} onMouseLeave={magnet.onMouseLeave}
            className="block sm:inline-block w-full sm:w-auto px-10 py-4 rounded-xl bg-[#F5C3C6] hover:bg-[#f0b8bc] text-[#151515] font-bold text-base active:scale-[0.98] glow-btn glow-btn-pink text-center">
            Learn More
          </a>
        </div>
      </motion.div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Inline copy button (code block header)
// ---------------------------------------------------------------------------
function InlineCopyButton({ text, onAfterCopy }: { text: string; onAfterCopy?: () => void }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await copyWithConfetti(text, event)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      onAfterCopy?.()
    } catch { /* noop */ }
  }, [text, onAfterCopy])
  return (
    <button onClick={handleCopy}
      className="px-3 py-1 rounded-md text-xs font-medium bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.10] text-[#FCF4EB]/60 hover:text-[#FCF4EB]/90 transition-all duration-150 select-none">
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Big game copy button
// ---------------------------------------------------------------------------
function GameCopyButton({ gameCode, onAfterCopy, editorUrl }: { gameCode: string; onAfterCopy?: () => void; editorUrl: string }) {
  const [copied, setCopied] = useState(false)
  const magnet = useMagnet(0.28)

  const handleCopy = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await copyWithConfetti(gameCode, event)
      setCopied(true)
      setTimeout(() => setCopied(false), 4000)
      onAfterCopy?.()
      window.open(editorUrl, '_blank', 'noopener,noreferrer')
    } catch { /* noop */ }
  }, [gameCode, onAfterCopy, editorUrl])

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <button ref={magnet.ref as React.RefObject<HTMLButtonElement>} onClick={handleCopy}
        onMouseMove={magnet.onMouseMove} onMouseLeave={magnet.onMouseLeave}
        className="block w-full sm:inline-block sm:w-auto px-10 py-4 rounded-xl bg-[#FFD700] hover:bg-[#e8c400] text-[#151515] font-bold text-base active:scale-[0.98] glow-btn glow-btn-gold text-center">
        {copied ? 'Copied! Paste it into editor.p5js.org' : 'Copy Game Code + Open Editor'}
      </button>
      {copied && (
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-[#FCF4EB]/40 text-xs text-center">
          The editor opened in a new tab. Delete the starter code, paste, and click Play.
        </motion.p>
      )}
    </div>
  )
}
