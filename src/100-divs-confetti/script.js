const { gsap } = window
const SIZE_LOWER = 0.75
const SIZE_UPPER = 2.5
gsap.set('.confetti', {
  '--rotate': () => gsap.utils.random(-45, 45),
  '--hue': () => gsap.utils.random(0, 359),
  opacity: 0,
})
gsap.set('.confetti__content', {
  '--width': () => gsap.utils.random(SIZE_LOWER, SIZE_UPPER),
  '--height': () => gsap.utils.random(SIZE_LOWER, SIZE_UPPER),
  rotate: -60,
  xPercent: -50,
  yPercent: -50,
})

const CONFETTI = document.querySelectorAll('.confetti')
const STREAMER = new Audio('https://assets.codepen.io/605876/horn.mp3')
const genConfettiTL = () => {
  const TL = gsap.timeline({
    onStart: () => {
      STREAMER.currentTime = 0
      STREAMER.play()
    },
  })
  const VMIN = Math.min(window.innerHeight, window.innerWidth) / 100
  CONFETTI.forEach(piece => {
    const duration = gsap.utils.random(0.5, 3)
    const CONFETTI_TL = gsap
      .timeline()
      .to(piece, {
        opacity: 1,
        duration: duration * 0.25,
      })
      .to(
        piece,
        {
          ease: 'power3.out',
          duration,
          physics2D: {
            velocity: gsap.utils.random(25 * VMIN, 60 * VMIN),
            angle: gsap.utils.random(-80, -40),
            gravity: gsap.utils.random(25 * VMIN, 60 * VMIN),
          },
        },
        0
      )
      .to(
        piece.children,
        {
          rotateX: () => gsap.utils.random(0, 1080),
          rotateY: () => gsap.utils.random(0, 1080),
          rotateZ: () => gsap.utils.random(0, 1080),
          duration,
        },
        '<'
      )
      .to(
        piece,
        {
          opacity: 0,
          duration: duration * 0.25,
        },
        `>-${duration * 0.25}`
      )
    TL.add(CONFETTI_TL, 0)
  })
  return TL
}

const FIRE = () => {
  gsap.set('.confetti', {
    '--rotate': () => gsap.utils.random(-30, 30),
    '--hue': () => gsap.utils.random(0, 359),
  })
  gsap.set('.confetti__content', {
    '--radius': () => gsap.utils.random(0, 50),
    '--width': () => gsap.utils.random(SIZE_LOWER, SIZE_UPPER),
    '--height': () => gsap.utils.random(SIZE_LOWER, SIZE_UPPER),
  })
  gsap
    .timeline()
    .set('.confetti', { opacity: 1, x: 0, y: 0 })
    .set('.confetti__content', {
      rotate: -60,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      opacity: 1,
    })
    .to('.confetti__gun', {
      '--z': 0,
      duration: 0.1,
    })
    .add(genConfettiTL(), 0)
}

document.body.addEventListener('pointerup', () => {
  FIRE()
})

document.body.addEventListener('pointerdown', () => {
  gsap.to('.confetti__gun', {
    '--z': 20,
    duration: 0.1,
  })
})
