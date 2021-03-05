import gsap from 'https://cdn.skypack.dev/gsap'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap/ScrollTrigger'

const { registerPlugin, ticker } = gsap
registerPlugin(ScrollTrigger)

const CONFIG = {
  M1: 5,
  M2: 10,
  // M2: 6,
  C1: 8,
  // C1: 6,
  C2: 5,
  // C2: 6,
  CTHREE: 5,
  // CTHREE: 5,
  Q2: 7,
  QTWO2: 9,
  L1: 7,
  Q1: 8,
  Q3: 9,
  SHIFTER: 0,
  BUMPER: 0,
  LTWO: 9,
  QTWO1: 8,
  QTHREE3: 7,
  CTWO1: 14,
  // CTWO1: 14,
  CTWO2: 7,
  // CTWO2: 6,
  CTWO3: 10,
  // CTWO3: 6,
  CTHREE1: 15,
  // CTHREE1: 15,
  CTHREE2: 14,
  // CTHREE1: 15,
}

let POINTER = {
  x: 0,
  y: 0,
}

const getPath = () =>
  `M ${CONFIG.M1} ${CONFIG.M2}
   C 5 ${CONFIG.C1} ${CONFIG.C2} 7 7 7
   M 7 7
   L ${CONFIG.L1 + CONFIG.SHIFTER} 7
   Q ${CONFIG.Q1 + CONFIG.SHIFTER} ${CONFIG.Q2 - CONFIG.BUMPER} ${CONFIG.Q3 +
    CONFIG.SHIFTER} 7
   L 13 7
   C ${CONFIG.CTWO1} 7 15 ${CONFIG.CTWO2} 15 ${CONFIG.CTWO3}
   C ${CONFIG.CTHREE1} 9 ${CONFIG.CTHREE2} 9 13 9
   L ${CONFIG.LTWO + CONFIG.SHIFTER} 9
   Q ${CONFIG.QTWO1 + CONFIG.SHIFTER} ${CONFIG.QTWO2 -
    CONFIG.BUMPER} ${CONFIG.QTHREE3 + CONFIG.SHIFTER} 9
   L 7 9
   C 6 9 ${CONFIG.CTHREE} 9 5 ${CONFIG.M2}`

const pathSet = gsap.quickSetter('.stache__path', 'attr')

const BOUNDS = 50

const update = () => {
  const xPercent = gsap.utils.mapRange(
    0,
    window.innerWidth,
    -BOUNDS,
    BOUNDS,
    POINTER.x
  )
  const yPercent = gsap.utils.mapRange(
    0,
    window.innerHeight,
    -BOUNDS,
    BOUNDS,
    POINTER.y
  )
  gsap.set('.cowboy__pupil', { xPercent, yPercent })
  pathSet({ d: getPath() })
}

ticker.add(update)

gsap.set('.cowboy__brow', {
  yPercent: -500,
})

gsap.set('.cowboy__eye', {
  transformOrigin: '50% 50%',
})

// let blinkTween
const BLINK = () => {
  const delay = gsap.utils.random(1, 5)
  gsap.to('.cowboy__eye', {
    delay,
    scaleY: 0.1,
    repeat: 3,
    yoyo: true,
    duration: 0.05,
    onComplete: () => {
      BLINK()
    },
  })
}
BLINK()

document.addEventListener('pointermove', ({ x, y }) => {
  POINTER = { x, y }
})

const STACHE_TL = gsap
  .timeline({
    paused: true,
    // repeat: -1,
    // yoyo: true,
  })
  .to(CONFIG, {
    M2: 6,
    C1: 6,
    C2: 6,
    repeat: 1,
    duration: 1,
    yoyo: true,
  })
  .to(
    CONFIG,
    {
      BUMPER: 1,
    },
    '>-0.6'
  )
  .to(CONFIG, {
    SHIFTER: 4,
  })
  .to(CONFIG, {
    BUMPER: 0,
  })
  .to(
    CONFIG,
    {
      CTWO1: 14,
      CTWO2: 6,
      CTWO3: 6,
      CTHREE1: 15,
      CTHREE2: 15,
      duration: 1,
      repeat: 1,
      yoyo: true,
    },
    '>-0.6'
  )
  .timeScale(3)

const SCRUB = gsap.to(STACHE_TL, {
  totalTime: 0,
  duration: 0.5,
  ease: 'power3',
  paused: true,
})

document.documentElement.scrollTop = 2
ScrollTrigger.create({
  start: 1,
  end: 'bottom bottom',
  horizontal: false,
  trigger: 'body',
  scrub: 0.1,
  onLeaveBack: () => {
    document.body.scrollTop = document.documentElement.scrollTop =
      document.body.scrollHeight - 2
  },
  onLeave: () =>
    (document.body.scrollTop = document.documentElement.scrollTop = 2),
  onUpdate: self => {
    SCRUB.vars.totalTime = self.progress * STACHE_TL.duration()
    SCRUB.invalidate().restart()
  },
})

gsap.set('.scene', { display: 'flex' })
