'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import MastermindReactionsSection from '@/components/sections/MastermindReactionsSection'
import GiveawayEmailModal from '@/components/giveaways/GiveawayEmailModal'

const MASTERMIND_URL = 'https://www.mastermindshq.business'
const MODAL_SESSION_KEY = 'giveaway-auto-modal-shown-intuition-quiz'

// ---------------------------------------------------------------------------
// Quiz data — scored 1-4 per option
// Frameworks: Klein (RPD), Kahneman (System 1/2), Gigerenzen (heuristics),
// Gladwell (thin-slicing), Peirce (The Intuitive Way)
// ---------------------------------------------------------------------------
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'When you get a strong gut feeling about a decision, you:',
    options: [
      { text: 'Push it aside and look for evidence first', score: 1 },
      { text: 'Notice it but usually override it with logic', score: 2 },
      { text: 'Weigh it alongside other inputs', score: 3 },
      { text: 'Act on it without needing more data', score: 4 },
    ],
  },
  {
    id: 2,
    question: 'How accurate are your first impressions of people?',
    options: [
      { text: 'Rarely — I need time to form a real read', score: 1 },
      { text: 'Sometimes, but I second-guess them', score: 2 },
      { text: 'More often right than wrong', score: 3 },
      { text: 'Almost always accurate from the first moment', score: 4 },
    ],
  },
  {
    id: 3,
    question: 'When a big decision needs to be made under pressure, you:',
    options: [
      { text: 'Freeze and look for more information', score: 1 },
      { text: 'Ask others what they think first', score: 2 },
      { text: 'Blend gut instinct with available facts', score: 3 },
      { text: 'Decide fast and move — the signal is clear', score: 4 },
    ],
  },
  {
    id: 4,
    question: 'After making a major decision, you:',
    options: [
      { text: 'Replay it obsessively wondering if it was right', score: 1 },
      { text: 'Revisit it frequently over the following days', score: 2 },
      { text: 'Check in occasionally but mostly move forward', score: 3 },
      { text: 'Commit and don\'t look back', score: 4 },
    ],
  },
  {
    id: 5,
    question: 'Can you tell the difference between fear and genuine intuition?',
    options: [
      { text: 'No — they feel identical to me', score: 1 },
      { text: 'It\'s blurry and hard to separate', score: 2 },
      { text: 'Usually yes, with some reflection', score: 3 },
      { text: 'Immediately and clearly — different registers', score: 4 },
    ],
  },
  {
    id: 6,
    question: 'When you walk into a room or meet someone for the first time:',
    options: [
      { text: 'I need context before I form any sense of things', score: 1 },
      { text: 'I occasionally notice a feeling, but I don\'t act on it', score: 2 },
      { text: 'I often pick up on the energy and pay attention to it', score: 3 },
      { text: 'It hits me before words are exchanged — always', score: 4 },
    ],
  },
  {
    id: 7,
    question: 'When you\'ve ignored a gut feeling in the past, what happened?',
    options: [
      { text: 'Things usually turned out fine anyway', score: 1 },
      { text: 'Mixed — sometimes fine, sometimes not', score: 2 },
      { text: 'I usually regretted ignoring it', score: 3 },
      { text: 'It always cost me something', score: 4 },
    ],
  },
  {
    id: 8,
    question: 'How do you make your best decisions?',
    options: [
      { text: 'Research, spreadsheets, and pros-and-cons lists', score: 1 },
      { text: 'Trusted advisors and peer input', score: 2 },
      { text: 'A deliberate blend of data and gut feeling', score: 3 },
      { text: 'Almost entirely from instinct — the logic follows', score: 4 },
    ],
  },
]

// ---------------------------------------------------------------------------
// Result levels (8 questions × max 4 = 32 pts, 5 bands of 5 each starting at 8)
// ---------------------------------------------------------------------------
const LEVELS = [
  {
    range: [8, 12] as [number, number],
    level: 1,
    label: 'Closed',
    color: '#9D8FE0',
    headline: 'Your intuition is whispering. You\'re not listening yet.',
    body: 'You\'re probably a strong analytical thinker who\'s been trained to distrust anything you can\'t prove. Gary Klein\'s research on expert decision-making found that the shift from novice to master isn\'t more data — it\'s learning to trust pattern recognition. That\'s the same thing your gut runs on. The signal is there. You\'ve just been conditioned to call it noise.',
    source: 'Research: Klein, Recognition-Primed Decision model (1999)',
  },
  {
    range: [13, 17] as [number, number],
    level: 2,
    label: 'Stirring',
    color: '#BDB3E8',
    headline: 'The signal is coming through. You just keep second-guessing it.',
    body: 'You notice the feeling — then you reach for data before you\'ll act on it. Kahneman called this the tension between System 1 (fast, intuitive) and System 2 (slow, analytical). You\'ve got both running. But System 2 is still drowning System 1 out. The only gap between here and the next level is trust, not more information.',
    source: 'Research: Kahneman, Thinking Fast and Slow (2011)',
  },
  {
    range: [18, 22] as [number, number],
    level: 3,
    label: 'Opening',
    color: '#E8C5C8',
    headline: 'You\'re starting to hear it — and occasionally, you listen.',
    body: 'You\'re in the most interesting stage. Intuition is contributing to your decisions, not running them. Malcolm Gladwell\'s thin-slicing research shows this is exactly where expert pattern recognition starts to consistently outperform deliberate analysis. You\'re building the library. Track your gut calls and your outcomes — the data will show you the signal is more reliable than you think.',
    source: 'Research: Gladwell, Blink (2005)',
  },
  {
    range: [23, 27] as [number, number],
    level: 4,
    label: 'Tuned In',
    color: '#F5C3C6',
    headline: 'You read rooms. You read people. You move before others see it.',
    body: 'Gerd Gigerenzen\'s work on heuristics shows that experts in high-uncertainty environments don\'t use more information than novices — they use less, but the right signals. You\'re doing this. The calibration is sharp. The next edge: learning when logic should override the gut rather than the other way around. That discernment is what separates good intuitive thinkers from exceptional ones.',
    source: 'Research: Gigerenzen, Gut Feelings (2007)',
  },
  {
    range: [28, 32] as [number, number],
    level: 5,
    label: 'Integrated',
    color: '#9D8FE0',
    headline: 'You\'re operating on a different signal layer.',
    body: 'System 1 and System 2 are no longer fighting — they\'re collaborating. Penney Peirce calls this "direct knowing": the gap between sensing and acting collapses. You move fast, you\'re rarely wrong about the things that matter, and you\'ve stopped apologizing for it. The work from here isn\'t developing the signal — it\'s learning to articulate it so others can follow the decision.',
    source: 'Research: Peirce, The Intuitive Way (1997)',
  },
]

function getLevel(score: number) {
  return LEVELS.find((l) => score >= l.range[0] && score <= l.range[1]) ?? LEVELS[0]
}

// ---------------------------------------------------------------------------
// Magnetic button hook
// ---------------------------------------------------------------------------
function useMagnet(strength = 0.3) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)
  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * strength
      const y = (e.clientY - rect.top - rect.height / 2) * strength
      el.style.transform = `translate(${x}px, ${y}px)`
      el.style.transition = 'transform 0.1s ease-out'
    },
    [strength],
  )
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
export default function IntuitionQuizPage() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<number[]>(
    Array(QUIZ_QUESTIONS.length).fill(-1),
  )
  const [quizComplete, setQuizComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [emailModalOpen, setEmailModalOpen] = useState(false)

  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const quizRef = useRef<HTMLDivElement>(null)

  // Load Cormorant Garamond font
  useEffect(() => {
    if (document.querySelector('link[data-font="cormorant"]')) return
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,600;1,700&display=swap'
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
      lenis = new Lenis({ duration: 1.1 }) as unknown as {
        raf: (t: number) => void
        destroy: () => void
      }
      const raf = (time: number) => {
        lenis!.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    })()
    return () => {
      if (lenis) lenis.destroy()
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Canvas falling particles
  useEffect(() => {
    const canvas = particleCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    type Particle = {
      x: number
      y: number
      r: number
      dx: number
      dy: number
      alpha: number
      color: string
    }
    const colors = ['#8B79D4', '#F5C3C6', '#9D8FE0', '#BDB3E8', '#FCF4EB']
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
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.y > canvas.height + 5) {
          p.y = -5
          p.x = Math.random() * canvas.width
        }
        if (p.x < -5) p.x = canvas.width + 5
        if (p.x > canvas.width + 5) p.x = -5
      })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Open email modal after quiz completion (once per session)
  useEffect(() => {
    if (!quizComplete) return
    if (typeof window === 'undefined') return
    if (window.sessionStorage.getItem(MODAL_SESSION_KEY)) return
    const t = setTimeout(() => {
      setEmailModalOpen(true)
      try {
        window.sessionStorage.setItem(MODAL_SESSION_KEY, '1')
      } catch { /* noop */ }
    }, 1800)
    return () => clearTimeout(t)
  }, [quizComplete])

  const handleStart = useCallback(() => {
    setQuizStarted(true)
    setTimeout(() => quizRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
  }, [])

  const handleSelectOption = useCallback(
    (idx: number) => {
      setSelectedOptions((prev) => {
        const next = [...prev]
        next[currentQuestion] = idx
        return next
      })
    },
    [currentQuestion],
  )

  const handleNext = useCallback(() => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion((q) => q + 1)
      setTimeout(() => quizRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
    } else {
      const total = selectedOptions.reduce((sum, optIdx, qIdx) => {
        if (optIdx === -1) return sum
        return sum + QUIZ_QUESTIONS[qIdx].options[optIdx].score
      }, 0)
      setScore(total)
      setQuizComplete(true)
      setTimeout(
        () => document.getElementById('quiz-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        200,
      )
    }
  }, [currentQuestion, selectedOptions])

  const handleRetake = useCallback(() => {
    setCurrentQuestion(0)
    setSelectedOptions(Array(QUIZ_QUESTIONS.length).fill(-1))
    setQuizComplete(false)
    setScore(0)
    setQuizStarted(true)
    setTimeout(() => quizRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
  }, [])

  const currentQ = QUIZ_QUESTIONS[currentQuestion]
  const currentSelected = selectedOptions[currentQuestion]
  const level = quizComplete ? getLevel(score) : null
  const progressPct = quizStarted
    ? Math.round(((quizComplete ? QUIZ_QUESTIONS.length : currentQuestion) / QUIZ_QUESTIONS.length) * 100)
    : 0

  return (
    <>
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
          box-shadow: 0 0 28px rgba(139,121,212,0.12), 0 0 0 1px rgba(139,121,212,0.18);
          border-color: rgba(139,121,212,0.22) !important;
        }
        .glow-btn { transition: box-shadow 0.2s ease, background-color 0.15s ease, transform 0.1s ease-out; }
        .glow-btn:hover { box-shadow: 0 0 32px rgba(139,121,212,0.45), 0 0 60px rgba(139,121,212,0.2); }
        .glow-btn-pink:hover { box-shadow: 0 0 32px rgba(245,195,198,0.5), 0 0 60px rgba(245,195,198,0.2); }
        .option-btn { transition: border-color 0.15s ease, background 0.15s ease; }
        .option-btn:hover:not(.option-selected) {
          border-color: rgba(139,121,212,0.35) !important;
          background: rgba(139,121,212,0.07) !important;
        }
      `}</style>

      <div className="min-h-screen bg-[#151515] text-[#FCF4EB] overflow-x-hidden">

        {/* Full-page falling particles */}
        <canvas
          ref={particleCanvasRef}
          className="fixed inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        />

        {/* ================================================================ */}
        {/* HERO                                                              */}
        {/* ================================================================ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-4 pt-6 sm:pt-8">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 mb-6 flex justify-center sm:absolute sm:top-10 sm:left-0 sm:right-0 sm:mb-0"
          >
            <div className="p-[1px] rounded-full bg-gradient-to-r from-[#8B79D4] to-[#F5C3C6] inline-block">
              <div className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#151515] flex items-center gap-1.5 sm:gap-2 whitespace-nowrap max-w-[92vw]">
                <span className="text-[#9D8FE0] text-[11px] sm:text-xs">✦</span>
                <span className="font-semibold text-[11px] sm:text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]">
                  Free
                </span>
                <span className="hidden sm:inline text-[#FCF4EB]/32 text-xs">from the</span>
                <a
                  href={MASTERMIND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FCF4EB]/60 text-[11px] sm:text-xs font-medium hover:text-[#FCF4EB]/90 transition-colors"
                >
                  <span className="sm:hidden">Mastermind</span>
                  <span className="hidden sm:inline">Business Automation Mastermind</span>
                </a>
                <span className="text-[#FCF4EB]/20 text-[11px] sm:text-xs">·</span>
                <span className="text-[#FCF4EB]/40 text-[11px] sm:text-xs">by Joe Che</span>
              </div>
            </div>
          </motion.div>

          {/* Aurora glow blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="aurora-a absolute top-[10%] left-[15%] w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] rounded-full opacity-[0.09]"
              style={{
                background: 'radial-gradient(circle, #8B79D4 0%, transparent 70%)',
                filter: 'blur(80px)',
              }}
            />
            <div
              className="aurora-b absolute top-[30%] right-[10%] w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] rounded-full opacity-[0.07]"
              style={{
                background: 'radial-gradient(circle, #F5C3C6 0%, transparent 70%)',
                filter: 'blur(90px)',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-3xl mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                paddingBottom: '0.05em',
              }}
            >
              What&apos;s Your Intuition Level?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mb-4"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 600,
                fontSize: 'clamp(1rem, 2.8vw, 1.9rem)',
                lineHeight: 1.2,
                color: '#FCF4EB',
              }}
            >
              8 questions. Backed by intuition research. Know where you really stand.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.5 }}
              className="text-[#FCF4EB]/55 text-base leading-relaxed max-w-xl mx-auto mb-8"
            >
              Most people either overestimate or completely underestimate their intuition.
              This quiz rates where you actually are across five evidence-based levels — from blocked to fully integrated.
            </motion.p>

            {!quizStarted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                <StartButton onClick={handleStart} />
              </motion.div>
            )}

            {quizStarted && !quizComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center justify-center gap-2 text-[#FCF4EB]/22 text-sm"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-bounce"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
                <span>Quiz below — {QUIZ_QUESTIONS.length - currentQuestion} questions left</span>
              </motion.div>
            )}
          </div>
        </section>

        {/* ================================================================ */}
        {/* QUIZ                                                              */}
        {/* ================================================================ */}
        <section ref={quizRef} className="max-w-2xl mx-auto px-5 pb-20">
          {quizStarted && !quizComplete && (
            <motion.div
              key={`q-${currentQuestion}`}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#FCF4EB]/30 text-xs uppercase tracking-widest">
                    Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <span className="text-[#9D8FE0] text-xs font-semibold">{progressPct}%</span>
                </div>
                <div className="h-[2px] bg-white/[0.07] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #8B79D4, #F5C3C6)' }}
                    initial={{ width: `${(currentQuestion / QUIZ_QUESTIONS.length) * 100}%` }}
                    animate={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question */}
              <h2 className="text-xl sm:text-2xl font-bold text-[#FCF4EB] mb-6 leading-snug">
                {currentQ.question}
              </h2>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`option-btn w-full text-left px-5 py-4 rounded-xl border ${
                      currentSelected === idx
                        ? 'option-selected border-[#8B79D4] bg-[#8B79D4]/14'
                        : 'border-white/[0.08] bg-white/[0.025]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                          currentSelected === idx
                            ? 'border-[#9D8FE0] bg-[#9D8FE0]'
                            : 'border-white/[0.20]'
                        }`}
                      >
                        {currentSelected === idx && (
                          <div className="w-2 h-2 rounded-full bg-[#151515]" />
                        )}
                      </div>
                      <span
                        className={`text-sm sm:text-base leading-snug ${
                          currentSelected === idx ? 'text-[#FCF4EB]' : 'text-[#FCF4EB]/65'
                        }`}
                      >
                        {option.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Next / See Results */}
              <NextButton
                onClick={handleNext}
                disabled={currentSelected === -1}
                isLast={currentQuestion === QUIZ_QUESTIONS.length - 1}
              />
            </motion.div>
          )}
        </section>

        {/* ================================================================ */}
        {/* RESULTS                                                           */}
        {/* ================================================================ */}
        {quizComplete && level && (
          <section id="quiz-result" className="max-w-2xl mx-auto px-5 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              {/* Score header */}
              <div className="text-center mb-10">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                  style={{
                    background: 'rgba(139,121,212,0.15)',
                    border: '1px solid rgba(139,121,212,0.25)',
                  }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#9D8FE0]">
                    Your Result
                  </span>
                </div>
                <div
                  className="text-7xl font-extrabold font-mono mb-1"
                  style={{ color: level.color }}
                >
                  {level.level}<span className="text-4xl text-[#FCF4EB]/20">/5</span>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: level.color }}>
                  {level.label}
                </div>
                <div className="text-[#FCF4EB]/30 text-sm">Score: {score} out of 32</div>
              </div>

              {/* Result card */}
              <div
                className="rounded-2xl overflow-hidden mb-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,121,212,0.08) 0%, rgba(245,195,198,0.05) 100%)',
                  border: '1px solid rgba(139,121,212,0.2)',
                }}
              >
                <div className="px-5 py-8 sm:px-8 sm:py-10">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#FCF4EB] mb-4 leading-snug">
                    {level.headline}
                  </h2>
                  <p className="text-[#FCF4EB]/62 leading-relaxed text-base mb-5">{level.body}</p>
                  <p className="text-[#FCF4EB]/22 text-xs">{level.source}</p>
                </div>
              </div>

              {/* Level spectrum */}
              <div className="mb-10">
                <div className="text-[#FCF4EB]/22 text-xs uppercase tracking-widest mb-4 text-center">
                  The Five Levels
                </div>
                <div className="space-y-2">
                  {LEVELS.map((l) => (
                    <div
                      key={l.level}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        l.level === level.level
                          ? 'border border-[#8B79D4]/30 bg-[#8B79D4]/10'
                          : 'border border-transparent bg-white/[0.02]'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          l.level === level.level
                            ? 'bg-[#8B79D4] text-[#FCF4EB]'
                            : 'bg-white/[0.05] text-[#FCF4EB]/25'
                        }`}
                      >
                        {l.level}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-semibold text-sm ${
                            l.level === level.level ? 'text-[#FCF4EB]' : 'text-[#FCF4EB]/30'
                          }`}
                        >
                          {l.label}
                        </div>
                        <div className="text-[#FCF4EB]/18 text-xs">
                          {l.range[0]}–{l.range[1]} points
                        </div>
                      </div>
                      {l.level === level.level && (
                        <div className="text-[#9D8FE0] text-xs font-semibold">← You</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Retake */}
              <div className="text-center">
                <button
                  onClick={handleRetake}
                  className="text-[#FCF4EB]/22 text-sm hover:text-[#FCF4EB]/50 transition-colors underline underline-offset-4"
                >
                  Retake the quiz
                </button>
              </div>
            </motion.div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TESTIMONIAL QUOTE                                                 */}
        {/* ================================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6 py-10"
        >
          <blockquote
            className="rounded-2xl px-5 py-8 sm:px-8 sm:py-10 text-center"
            style={{
              background: 'rgba(139,121,212,0.06)',
              border: '1px solid rgba(139,121,212,0.14)',
            }}
          >
            <p className="text-[#FCF4EB]/72 text-base sm:text-lg leading-relaxed italic mb-4">
              &ldquo;I always trusted my gut but never had language for it. Seeing Level 4 on paper made me stop second-guessing the decisions I already knew were right.&rdquo;
            </p>
            <cite className="text-[#FCF4EB]/28 text-sm not-italic">
              Sarah K. &mdash; Session 6 participant
            </cite>
          </blockquote>
        </motion.div>

        {/* ================================================================ */}
        {/* MASTERMIND CTA                                                    */}
        {/* ================================================================ */}
        <MastermindCTA />

        {/* ================================================================ */}
        {/* PARTICIPANT REACTIONS                                             */}
        {/* ================================================================ */}
        <MastermindReactionsSection />

        {/* Footer */}
        <div className="text-center pb-10 flex flex-col items-center gap-1.5">
          <a
            href={MASTERMIND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FCF4EB]/14 text-xs uppercase tracking-widest hover:text-[#FCF4EB]/35 transition-colors"
          >
            Business Automation Mastermind
          </a>
          <span className="text-[#FCF4EB]/10 text-xs">Created by Joe Che</span>
        </div>

      </div>

      <GiveawayEmailModal
        slug="intuition-quiz"
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        showCopiedBadge={false}
        headingOverride="Want the full intuition breakdown?"
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// Start Button
// ---------------------------------------------------------------------------
function StartButton({ onClick }: { onClick: () => void }) {
  const magnet = useMagnet(0.28)
  return (
    <button
      ref={magnet.ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      onMouseMove={magnet.onMouseMove}
      onMouseLeave={magnet.onMouseLeave}
      className="px-10 py-4 rounded-xl bg-[#8B79D4] hover:bg-[#6e5db8] text-[#FCF4EB] font-bold text-base active:scale-[0.98] glow-btn"
    >
      Take the Quiz
    </button>
  )
}

// ---------------------------------------------------------------------------
// Next / See Results button
// ---------------------------------------------------------------------------
function NextButton({
  onClick,
  disabled,
  isLast,
}: {
  onClick: () => void
  disabled: boolean
  isLast: boolean
}) {
  const magnet = useMagnet(0.28)
  return (
    <div className="flex justify-end">
      <button
        ref={magnet.ref as React.RefObject<HTMLButtonElement>}
        onClick={onClick}
        onMouseMove={magnet.onMouseMove}
        onMouseLeave={magnet.onMouseLeave}
        disabled={disabled}
        className={`px-8 py-3.5 rounded-xl font-bold text-base glow-btn ${
          disabled
            ? 'bg-white/[0.05] text-[#FCF4EB]/18 cursor-not-allowed'
            : 'bg-[#8B79D4] hover:bg-[#6e5db8] text-[#FCF4EB] active:scale-[0.98]'
        }`}
      >
        {isLast ? 'See My Results' : 'Next →'}
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mastermind CTA — purple-pink gradient, "Want to learn how to do this?"
// ---------------------------------------------------------------------------
function MastermindCTA() {
  const magnet = useMagnet(0.28)
  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, rgba(245,195,198,0.10) 0%, rgba(139,121,212,0.08) 100%)',
          border: '1px solid rgba(245,195,198,0.15)',
        }}
      >
        <div className="px-6 sm:px-14 pb-12 pt-8 text-center">
          <h2 className="text-2xl sm:text-5xl font-bold text-[#FCF4EB] mb-4">
            Want to learn how to do this?
          </h2>
          <p className="text-xl sm:text-3xl font-bold mb-5">
            <a
              href={MASTERMIND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D8FE0] to-[#F5C3C6] hover:opacity-80 transition-opacity"
            >
              Join the Business Automation Mastermind
            </a>
          </p>
          <p className="text-[#FCF4EB]/52 max-w-xl mx-auto mb-8 leading-relaxed text-base sm:text-lg">
            A small, focused group of business owners who meet weekly to build real things, fast
            -- leaving more time to serve clients and be with the people you love.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center mb-9">
            {['Small group, capped at 15', 'We meet weekly', 'Idea to live site in one session'].map(
              (item) => (
                <div key={item} className="flex items-center gap-2 text-[#FCF4EB]/58 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F5C3C6] flex-shrink-0" />
                  {item}
                </div>
              ),
            )}
          </div>
          <a
            ref={magnet.ref as React.RefObject<HTMLAnchorElement>}
            href={MASTERMIND_URL}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={magnet.onMouseMove}
            onMouseLeave={magnet.onMouseLeave}
            className="block sm:inline-block w-full sm:w-auto px-10 py-4 rounded-xl bg-[#F5C3C6] hover:bg-[#f0b8bc] text-[#151515] font-bold text-base active:scale-[0.98] glow-btn glow-btn-pink text-center"
          >
            Learn More
          </a>
        </div>
      </motion.div>
    </section>
  )
}
