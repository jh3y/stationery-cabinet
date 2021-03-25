import gsap from 'https://cdn.skypack.dev/gsap'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.set('.box', {
  yPercent: -50,
  xPercent: 500,
})

const STAGGER = 0.1
const DURATION = 1
const OFFSET = 0
const BOXES = gsap.utils.toArray('.box')

const LOOP = gsap.timeline({
  paused: true,
  repeat: -1,
  ease: 'none',
})

const SHIFTS = [...BOXES, ...BOXES, ...BOXES]

SHIFTS.forEach((BOX, index) => {
  const BOX_TL = gsap
    .timeline()
    .set(BOX, {
      xPercent: 250,
      rotateY: -50,
      opacity: 0,
      scale: 0.5,
    })
    // Opacity && Scale
    .to(
      BOX,
      {
        opacity: 1,
        scale: 1,
        duration: 0.1,
      },
      0
    )
    .to(
      BOX,
      {
        opacity: 0,
        scale: 0.5,
        duration: 0.1,
      },
      0.9
    )
    // Panning
    .to(
      BOX,
      {
        xPercent: 50,
        duration: 0.35,
        ease: 'none',
      },
      0
    )
    .to(
      BOX,
      {
        xPercent: -50,
        duration: 0.15,
        z: 100,
        ease: 'none',
      },
      0.35
    )
    .to(
      BOX,
      {
        xPercent: -150,
        duration: 0.15,
        z: 0,
        ease: 'none',
      },
      0.5
    )
    .to(
      BOX,
      {
        xPercent: -350,
        duration: 0.35,
        ease: 'none',
      },
      0.65
    )
    // Rotations
    .fromTo(
      BOX,
      {
        rotateY: -50,
      },
      {
        rotateY: 50,
        immediateRender: false,
        duration: 1,
        ease: 'power4.inOut',
      },
      0
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
  pin: '.boxes',
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
  TRIGGER.scroll(SCROLL)
}

ScrollTrigger.addEventListener('scrollEnd', () =>
  scrollToPosition(SCRUB.vars.position)
)

const NEXT = () => scrollToPosition(SCRUB.vars.position - 1 / BOXES.length)
const PREV = () => scrollToPosition(SCRUB.vars.position + 1 / BOXES.length)

document.addEventListener('keydown', event => {
  if (event.keyCode === 37 || event.keyCode === 65) NEXT()
  if (event.keyCode === 39 || event.keyCode === 68) PREV()
})

document.querySelector('.next').addEventListener('click', NEXT)
document.querySelector('.prev').addEventListener('click', PREV)
