import gsap from 'https://cdn.skypack.dev/gsap'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap/ScrollTrigger'
import Draggable from 'https://cdn.skypack.dev/gsap/Draggable'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(Draggable)

gsap.set('li', {
  yPercent: -50,
})

const STAGGER = 0.1
const DURATION = 1
const OFFSET = 0
const BOXES = gsap.utils.toArray('li')

const LOOP = gsap.timeline({
  paused: true,
  repeat: -1,
  ease: 'none',
})

const X_START = 200
const X_FINISH = -300
const Y_START = -150
const Y_FINISH = 150

const BEHAVIORS = new Array(BOXES.length)
  .fill()
  .map(() => [
    gsap.utils.random(-360, 360),
    gsap.utils.random(-360, 360),
    gsap.utils.random(Y_START, Y_FINISH),
    gsap.utils.random(-360, 360),
  ])

const HUES = [
  'hsl(20, 60%, 80%)',
  'hsl(35, 5%, 80%)',
  'hsl(240, 25%, 80%)',
  'hsl(45, 5%, 75%)',
  'hsl(320, 35%, 75%)',
  'hsl(160, 35%, 85%)',
  'hsl(42, 70%, 75%)',
  'hsl(10, 75%, 80%)',
  'hsl(90, 30%, 80%)',
  'hsl(330, 80%, 80%)',
  'hsl(106, 40%, 80%)',
  'hsl(0, 0%, 90%)',
  'hsl(50, 80%, 80%)',
  'hsl(20, 26%, 76%)',
  'hsl(30, 20%, 80%)',
  'hsl(90, 15%, 80%)',
]

const getScatterTL = (BOX, index) =>
  gsap
    .timeline()
    .set(BOX, {
      xPercent: 250,
      opacity: 0,
      filter: 'grayscale(1)',
      scale: 0.1,
      yPercent: () => BEHAVIORS[index % BOXES.length][2],
      rotateX: () => BEHAVIORS[index % BOXES.length][0],
      rotateY: () => BEHAVIORS[index % BOXES.length][1],
    })
    .to(
      BOX,
      {
        opacity: 1,
        scale: 0.5,
        duration: 0.1,
      },
      0
    )
    .to(
      BOX,
      {
        opacity: 0,
        scale: 0.1,
        duration: 0.1,
      },
      0.9
    )
    .to(
      BOX,
      {
        filter: 'grayScale(0)',
        repeat: 1,
        yoyo: true,
        duration: 0.1,
      },
      0.4
    )
    .fromTo(
      BOX,
      {
        rotateX: () => BEHAVIORS[index % BOXES.length][0],
        rotateY: () => BEHAVIORS[index % BOXES.length][1],
        rotate: () => BEHAVIORS[index % BOXES.length][2],
      },
      {
        immediateRender: false,
        rotateX: () => BEHAVIORS[index % BOXES.length][0] * -1,
        rotateY: () => BEHAVIORS[index % BOXES.length][1] * -1,
        rotate: () => BEHAVIORS[index % BOXES.length][2] * -1,
        duration: 1,
        ease: 'power1.inOut',
      },
      0
    )
    // Panning
    .fromTo(
      BOX,
      {
        xPercent: X_START,
      },
      {
        xPercent: X_FINISH,
        duration: 1,
        immediateRender: false,
        ease: 'power1.inOut',
      },
      0
    )
    .to(
      BOX,
      {
        yPercent: -50,
        duration: 0.5,
        immediateRender: false,
      },
      0
    )
    .to(
      BOX,
      {
        yPercent: () => (BEHAVIORS[index % BOXES.length][2] + 100) * -1,
        immediateRender: false,
        duration: 0.5,
      },
      0.5
    )
    // Scale && Z
    .to(
      BOX,
      {
        z: 100,
        scale: 1,
        duration: 0.1,
        repeat: 1,
        yoyo: true,
      },
      0.4
    )
    .fromTo(
      BOX,
      {
        zIndex: 1,
      },
      {
        zIndex: BOXES.length,
        repeat: 1,
        yoyo: true,
        ease: 'none',
        duration: 0.5,
        immediateRender: false,
      },
      0
    )
const getStraightTL = (BOX, index) =>
  gsap
    .timeline()
    .set(BOX, {
      xPercent: 250,
      opacity: 0,
      filter: 'grayscale(1)',
      scale: 0.1,
    })
    .to(
      BOX,
      {
        opacity: 1,
        scale: 0.5,
        duration: 0.1,
      },
      0
    )
    .to(
      BOX,
      {
        opacity: 0,
        scale: 0.1,
        duration: 0.1,
      },
      0.9
    )
    .to(
      BOX,
      {
        filter: 'grayScale(0)',
        repeat: 1,
        yoyo: true,
        duration: 0.1,
      },
      0.4
    )
    // Panning
    .fromTo(
      BOX,
      {
        xPercent: X_START,
      },
      {
        xPercent: X_FINISH,
        duration: 1,
        immediateRender: false,
        ease: 'power1.inOut',
      },
      0
    )
    // Scale && Z
    .to(
      BOX,
      {
        z: 100,
        scale: 1,
        duration: 0.1,
        repeat: 1,
        yoyo: true,
      },
      0.4
    )
    .fromTo(
      BOX,
      {
        zIndex: 1,
      },
      {
        zIndex: BOXES.length,
        repeat: 1,
        yoyo: true,
        ease: 'none',
        duration: 0.5,
        immediateRender: false,
      },
      0
    )
const getRotatingTL = (BOX, index) =>
  gsap
    .timeline()
    .set(BOX, {
      xPercent: 250,
      opacity: 0,
      filter: 'grayscale(1)',
      scale: 0.1,
      rotate: 360,
    })
    .to(
      BOX,
      {
        opacity: 1,
        scale: 0.5,
        duration: 0.1,
      },
      0
    )
    .to(
      BOX,
      {
        opacity: 0,
        scale: 0.1,
        duration: 0.1,
      },
      0.9
    )
    .to(
      BOX,
      {
        filter: 'grayScale(0)',
        repeat: 1,
        yoyo: true,
        duration: 0.1,
      },
      0.4
    )
    // Panning
    .fromTo(
      BOX,
      {
        xPercent: X_START,
        rotate: 360,
      },
      {
        xPercent: X_FINISH,
        duration: 1,
        immediateRender: false,
        ease: 'power1.inOut',
        rotate: -360,
      },
      0
    )
    // Scale && Z
    .to(
      BOX,
      {
        z: 100,
        scale: 1,
        duration: 0.1,
        repeat: 1,
        yoyo: true,
      },
      0.4
    )
    .fromTo(
      BOX,
      {
        zIndex: 1,
      },
      {
        zIndex: BOXES.length,
        repeat: 1,
        yoyo: true,
        ease: 'none',
        duration: 0.5,
        immediateRender: false,
      },
      0
    )
const getDiagonalTL = (BOX, index) =>
  gsap
    .timeline()
    .set(BOX, {
      xPercent: 250,
      yPercent: -250,
      opacity: 0,
      filter: 'grayscale(1)',
      scale: 0.1,
      rotate: 360,
    })
    .to(
      BOX,
      {
        opacity: 1,
        scale: 0.5,
        duration: 0.1,
      },
      0
    )
    .to(
      BOX,
      {
        opacity: 0,
        scale: 0.1,
        duration: 0.1,
      },
      0.9
    )
    .to(
      BOX,
      {
        filter: 'grayScale(0)',
        repeat: 1,
        yoyo: true,
        duration: 0.1,
      },
      0.4
    )
    // Panning
    .fromTo(
      BOX,
      {
        xPercent: X_START,
        yPercent: -150,
      },
      {
        xPercent: X_FINISH,
        duration: 1,
        yPercent: 50,
        immediateRender: false,
        ease: 'power1.inOut',
      },
      0
    )
    // Scale && Z
    .to(
      BOX,
      {
        z: 100,
        scale: 1,
        duration: 0.1,
        repeat: 1,
        yoyo: true,
      },
      0.4
    )
    .fromTo(
      BOX,
      {
        zIndex: 1,
      },
      {
        zIndex: BOXES.length,
        repeat: 1,
        yoyo: true,
        ease: 'none',
        duration: 0.5,
        immediateRender: false,
      },
      0
    )
const getDiagonalEaseTL = (BOX, index) =>
  gsap
    .timeline()
    .set(BOX, {
      xPercent: 250,
      yPercent: -250,
      opacity: 0,
      filter: 'grayscale(1)',
      scale: 0.1,
      rotate: 360,
    })
    .to(
      BOX,
      {
        opacity: 1,
        scale: 0.5,
        duration: 0.1,
      },
      0
    )
    .to(
      BOX,
      {
        opacity: 0,
        scale: 0.1,
        duration: 0.1,
      },
      0.9
    )
    .to(
      BOX,
      {
        filter: 'grayScale(0)',
        repeat: 1,
        yoyo: true,
        duration: 0.1,
      },
      0.4
    )
    // Panning
    .fromTo(
      BOX,
      {
        xPercent: X_START,
      },
      {
        xPercent: X_FINISH,
        duration: 1,
        immediateRender: false,
        ease: 'power1.inOut',
      },
      0
    )
    .fromTo(
      BOX,
      {
        yPercent: -150,
      },
      {
        yPercent: 50,
        ease: 'elastic.inOut',
        duration: 1,
        immediateRender: false,
      },
      0
    )
    // Scale && Z
    .to(
      BOX,
      {
        z: 100,
        scale: 1,
        duration: 0.1,
        repeat: 1,
        yoyo: true,
      },
      0.4
    )
    .fromTo(
      BOX,
      {
        zIndex: 1,
      },
      {
        zIndex: BOXES.length,
        repeat: 1,
        yoyo: true,
        ease: 'none',
        duration: 0.5,
        immediateRender: false,
      },
      0
    )

const SHIFTS = [...BOXES, ...BOXES, ...BOXES]
SHIFTS.forEach((BOX, index) => {
  // const BOX_TL = getScatterTL(BOX, index)
  // const BOX_TL = getStraightTL(BOX, index)
  // const BOX_TL = getRotatingTL(BOX, index)
  const BOX_TL = getDiagonalTL(BOX, index)
  // const BOX_TL = getDiagonalEaseTL(BOX, index)
  LOOP.add(BOX_TL, index * STAGGER)
})

const CYCLE_DURATION = STAGGER * BOXES.length
const START_TIME = CYCLE_DURATION + DURATION * 0.5 + OFFSET

const LOOP_HEAD = gsap.fromTo(
  LOOP,
  {
    totalTime: START_TIME,
  },
  {
    totalTime: `+=${CYCLE_DURATION}`,
    duration: 1,
    ease: 'none',
    repeat: -1,
    paused: true,
  }
)

const PLAYHEAD = {
  position: 0,
}

const POSITION_WRAP = gsap.utils.wrap(0, LOOP_HEAD.duration())

const SCRUB = gsap.to(PLAYHEAD, {
  position: 0,
  onUpdate: () => {
    LOOP_HEAD.totalTime(POSITION_WRAP(PLAYHEAD.position))
  },
  paused: true,
  duration: 0.25,
  ease: 'power3',
})

let iteration = 0
const TRIGGER = ScrollTrigger.create({
  start: 0,
  end: '+=2000',
  horizontal: false,
  pin: 'ul',
  onUpdate: self => {
    const SCROLL = self.scroll()
    if (SCROLL > self.end - 1) {
      // Go forwards in time
      WRAP(1, 1)
    } else if (SCROLL < 1 && self.direction < 0) {
      // Go backwards in time
      WRAP(-1, self.end - 1)
    } else {
      const NEW_POS = (iteration + self.progress) * LOOP_HEAD.duration()
      SCRUB.vars.position = NEW_POS
      SCRUB.invalidate().restart()
    }
  },
})

const WRAP = (iterationDelta, scrollTo) => {
  iteration += iterationDelta
  TRIGGER.scroll(scrollTo)
  TRIGGER.update()
}

const SNAP = gsap.utils.snap(1 / BOXES.length)

const progressToScroll = progress =>
  gsap.utils.clamp(
    1,
    TRIGGER.end - 1,
    gsap.utils.wrap(0, 1, progress) * TRIGGER.end
  )

const scrollToPosition = position => {
  const SNAP_POS = SNAP(position)
  const PROGRESS =
    (SNAP_POS - LOOP_HEAD.duration() * iteration) / LOOP_HEAD.duration()
  const SCROLL = progressToScroll(PROGRESS)
  if (PROGRESS >= 1 || PROGRESS < 0) return WRAP(Math.floor(PROGRESS), SCROLL)
  gsap.to(document.documentElement, {
    '--bg': HUES[PROGRESS * BOXES.length],
  })
  TRIGGER.scroll(SCROLL)
}

gsap.set(document.documentElement, {
  '--bg': HUES[0],
})

ScrollTrigger.addEventListener('scrollEnd', () =>
  scrollToPosition(SCRUB.vars.position)
)

const NEXT = () => scrollToPosition(SCRUB.vars.position - 1 / BOXES.length)
const PREV = () => scrollToPosition(SCRUB.vars.position + 1 / BOXES.length)

document.addEventListener('keydown', event => {
  if (event.code === 'ArrowLeft' || event.code === 'KeyA') NEXT()
  if (event.code === 'ArrowRight' || event.code === 'KeyD') PREV()
})

document.querySelector('ul').addEventListener('click', e => {
  const BOX = e.target.closest('li')
  if (BOX) {
    let TARGET = BOXES.indexOf(BOX)
    let CURRENT = gsap.utils.wrap(
      0,
      BOXES.length,
      Math.floor(BOXES.length * SCRUB.vars.position)
    )
    let BUMP = TARGET - CURRENT
    if (TARGET > CURRENT && TARGET - CURRENT > BOXES.length * 0.5) {
      BUMP = (BOXES.length - BUMP) * -1
    }
    if (CURRENT > TARGET && CURRENT - TARGET > BOXES.length * 0.5) {
      BUMP = BOXES.length + BUMP
    }
    scrollToPosition(SCRUB.vars.position + BUMP * (1 / BOXES.length))
  }
})

gsap.set(BOXES, { display: 'block' })

Draggable.create('.drag-proxy', {
  type: 'x',
  trigger: 'li',
  onPress() {
    this.startOffset = SCRUB.vars.position
  },
  onDrag() {
    SCRUB.vars.position = this.startOffset + (this.startX - this.x) * 0.001
    SCRUB.invalidate().restart() // same thing as we do in the ScrollTrigger's onUpdate
  },
  onDragEnd() {
    scrollToPosition(SCRUB.vars.position)
  },
})
