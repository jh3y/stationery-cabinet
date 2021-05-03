import debounce from 'https://cdn.skypack.dev/lodash/debounce'
const { gsap, Flip, ScrollTrigger } = window

console.info(debounce)

gsap.registerPlugin(Flip)
gsap.registerPlugin(ScrollTrigger)

gsap.set(window, {
  pageYOffset: 0,
})

// Use Flip to set initial positions on the grids.
const setFlips = () => {
  Flip.fit('.a', '.on-screen')
  Flip.fit('.b', '.off-screen--left .top-left')
  Flip.fit('.c', '.off-screen--left .bottom-left')
  Flip.fit('.d', '.off-screen--left .right-long')
  Flip.fit('.e', '.off-screen--left .right-long')
  Flip.fit('.f', '.off-screen--top')
  Flip.fit('.g', '.off-screen--right .left-long')
  Flip.fit('.h', '.off-screen--top')
  Flip.fit('.i', '.off-screen--left .right-long')
  Flip.fit('.j', '.off-screen--bottom')
  Flip.fit('.k', '.off-screen--left .right-long')
  Flip.fit('.l', '.off-screen--bottom .left-long')
  Flip.fit('.m', '.off-screen--bottom')
  Flip.fit('.n', '.off-screen--right .left-long')
  Flip.fit('.o', '.off-screen--top')
  Flip.fit('.p', '.off-screen--left .right-long')
}

const FLIP_OPTS = {
  duration: 0.5,
  ease: 'none',
}

const genFlips = () =>
  gsap
    .timeline({
      // repeat: -1,
      paused: true,
    })
    // First transition
    .add(
      gsap
        .timeline({
          delay: 1,
        })
        .add(Flip.fit('.a', '.off-screen--right', FLIP_OPTS))
        .add(Flip.fit('.b', '.on-screen .top-left', FLIP_OPTS), '<')
        .add(Flip.fit('.c', '.on-screen .bottom-left', FLIP_OPTS), '<')
        .add(Flip.fit('.d', '.on-screen .right-long', FLIP_OPTS), '<')
    )
    // Second Transition
    .add(
      gsap
        .timeline({
          delay: 1,
        })
        .add(Flip.fit('.b', '.on-screen', FLIP_OPTS))
        .add(Flip.fit('.c', '.off-screen--bottom', FLIP_OPTS), '<')
        .add(Flip.fit('.d', '.off-screen--right .left-long', FLIP_OPTS), '<')
    )
    // Third Transition - Getting .e and .f involved
    .add(
      gsap
        .timeline({
          delay: 1,
        })
        .add(Flip.fit('.b', '.on-screen .bottom-right', FLIP_OPTS))
        .add(Flip.fit('.e', '.on-screen .left-long', FLIP_OPTS), '<')
        .add(Flip.fit('.f', '.on-screen .top-right', FLIP_OPTS), '<')
    )
    // Fourth Transition - Reverse of Third
    .add(
      gsap
        .timeline({
          delay: 1,
        })
        .add(Flip.fit('.b', '.on-screen', FLIP_OPTS))
        .add(Flip.fit('.e', '.off-screen--left .right-long', FLIP_OPTS), '<')
        .add(Flip.fit('.f', '.off-screen--top', FLIP_OPTS), '<')
    )
    // Fifth Transition
    .add(
      gsap
        .timeline({
          delay: 1,
        })
        .add(Flip.fit('.b', '.on-screen .bottom-left', FLIP_OPTS))
        .add(Flip.fit('.g', '.on-screen .right-long', FLIP_OPTS), '<')
        .add(Flip.fit('.h', '.on-screen .top-left', FLIP_OPTS), '<')
    )
    // Sixth Transition - Reverse of Fifth
    .add(
      gsap
        .timeline({
          delay: 1,
        })
        .add(Flip.fit('.b', '.on-screen', FLIP_OPTS))
        .add(Flip.fit('.g', '.off-screen--right .left-long', FLIP_OPTS), '<')
        .add(Flip.fit('.h', '.off-screen--top', FLIP_OPTS), '<')
    )
    // Seventh Transition
    .add(
      gsap
        .timeline({
          delay: 1,
        })
        .add(Flip.fit('.b', '.on-screen .top-right', FLIP_OPTS))
        .add(Flip.fit('.i', '.on-screen .left-long', FLIP_OPTS), '<')
        .add(Flip.fit('.j', '.on-screen .bottom-right', FLIP_OPTS), '<')
    )
    // Eighth Transition
    .add(
      gsap
        .timeline({
          delay: 1,
        })
        .add(Flip.fit('.b', '.off-screen--top-right .bottom-left', FLIP_OPTS))
        .add(Flip.fit('.i', '.on-screen .top-right', FLIP_OPTS), '<')
        .add(Flip.fit('.j', '.off-screen--right', FLIP_OPTS), '<')
        .add(Flip.fit('.k', '.on-screen .left-long', FLIP_OPTS), '<')
        .add(Flip.fit('.l', '.on-screen .bottom-right', FLIP_OPTS), '<')
    )
    // Ninth Transition
    .add(
      gsap
        .timeline({
          delay: 1,
        })
        .add(Flip.fit('.i', '.on-screen', FLIP_OPTS))
        .add(Flip.fit('.k', '.off-screen--left .right-long', FLIP_OPTS), '<')
        .add(Flip.fit('.l', '.off-screen--bottom', FLIP_OPTS), '<')
    )
    // Tenth Transition
    .add(
      gsap
        .timeline({
          delay: 1,
        })
        .add(Flip.fit('.i', '.on-screen .top-left', FLIP_OPTS))
        .add(Flip.fit('.m', '.on-screen .bottom-left', FLIP_OPTS), '<')
        .add(Flip.fit('.n', '.on-screen .right-long', FLIP_OPTS), '<')
    )
    // Eleventh Transition
    .add(
      gsap
        .timeline({
          delay: 1,
        })
        .add(Flip.fit('.i', '.on-screen', FLIP_OPTS))
        .add(Flip.fit('.m', '.off-screen--bottom', FLIP_OPTS), '<')
        .add(Flip.fit('.n', '.off-screen--right .left-long', FLIP_OPTS), '<')
    )
    // Twelth Transition
    .add(
      gsap
        .timeline({
          delay: 1,
        })
        .add(Flip.fit('.i', '.on-screen .bottom-right', FLIP_OPTS))
        .add(Flip.fit('.o', '.on-screen .top-right', FLIP_OPTS), '<')
        .add(Flip.fit('.p', '.on-screen .left-long', FLIP_OPTS), '<')
    )
    // Thirteenth Transition
    .add(
      gsap
        .timeline({
          delay: 1,
        })
        .add(Flip.fit('.a', '.on-screen', FLIP_OPTS))
        .add(Flip.fit('.i', '.off-screen--left .bottom-right', FLIP_OPTS), '<')
        .add(Flip.fit('.o', '.off-screen--left .top-right', FLIP_OPTS), '<')
        .add(Flip.fit('.p', '.off-screen--left .left-long', FLIP_OPTS), '<')
    )

// const DURATION = 1
let MAIN
let LOOP_HEAD
let TRIGGER
let iteration = 0

setFlips()
MAIN = genFlips()
const START_TIME = 0
const END_TIME = MAIN.duration()

const PLAYHEAD = {
  position: 0,
}

const genLoop = () =>
  gsap.fromTo(
    MAIN,
    {
      totalTime: START_TIME,
    },
    {
      totalTime: END_TIME,
      duration: END_TIME * 2,
      repeat: -1,
      paused: true,
      ease: 'none',
    }
  )

LOOP_HEAD = genLoop()

const POSITION_WRAP = gsap.utils.wrap(0, LOOP_HEAD.duration())

const SCRUB = gsap.to(PLAYHEAD, {
  position: 0,
  paused: true,
  onUpdate: () => {
    LOOP_HEAD.totalTime(POSITION_WRAP(PLAYHEAD.position))
  },
  duration: 0.25,
  ease: 'none',
})

const WRAP = (iterationDelta, scrollTo) => {
  iteration += iterationDelta
  TRIGGER.scroll(scrollTo)
  TRIGGER.update()
}

const genTrigger = () =>
  ScrollTrigger.create({
    start: 0,
    end: '+=10000',
    pin: '.scene',
    scrub: 0.5,
    onUpdate: self => {
      const SCROLL = self.scroll()
      if (SCROLL > self.end - 1) {
        // Go forwards in time
        WRAP(1, 1)
      } else if (SCROLL < 1 && self.direction < 0) {
        // Go backwards in time
        WRAP(-1, self.end - 1)
      } else {
        SCRUB.vars.position = (iteration + self.progress) * LOOP_HEAD.duration()
        SCRUB.invalidate().restart()
      }
    },
  })

TRIGGER = genTrigger()

window.addEventListener(
  'resize',
  debounce(() => {
    MAIN.kill()
    setFlips()
    MAIN = genFlips()
    LOOP_HEAD.kill()
    LOOP_HEAD = genLoop()
    TRIGGER = genTrigger()
  }, 250)
)
