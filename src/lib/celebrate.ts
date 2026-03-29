import confetti from 'canvas-confetti'

export function celebrate() {
  // First burst — center spread
  confetti({
    particleCount: 70,
    spread: 80,
    origin: { x: 0.5, y: 0.55 },
    colors: ['#7C69C7', '#F5C3C6', '#9D8FE0', '#FCF4EB', '#c4b8f5'],
    disableForReducedMotion: true,
  })
  // Second burst — slight delay, tighter
  setTimeout(() => {
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { x: 0.45, y: 0.6 },
      colors: ['#7C69C7', '#F5C3C6', '#FCF4EB'],
      disableForReducedMotion: true,
    })
  }, 120)
}
