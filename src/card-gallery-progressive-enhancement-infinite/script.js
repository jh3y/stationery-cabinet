import gsap from 'https://cdn.skypack.dev/gsap'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap/ScrollTrigger'

const {
  to,
  registerPlugin,
  utils: { snap, toArray },
} = gsap
registerPlugin(ScrollTrigger)

const NEXT = document.querySelector('.gallery__next')
const PREV = document.querySelector('.gallery__prev')

const AUDIO = {
  WHOOSH: new Audio('https://assets.codepen.io/605876/whoosh-two.mp3'),
}

AUDIO.WHOOSH.volume = 0.5

const playWhoosh = () => {
  AUDIO.WHOOSH.currentTime = 0
  AUDIO.WHOOSH.play()
}

const SCRUB_TO = totalTime => {
  const PROGRESS = (totalTime - LOOP.duration() * iteration) / LOOP.duration()
  if (PROGRESS > 1) {
    wrapForward(TRIGGER)
  } else if (PROGRESS < 0) {
    wrapBackward(TRIGGER)
  } else {
    TRIGGER.scroll(TRIGGER.start + PROGRESS * (TRIGGER.end - TRIGGER.start))
  }
}

const BUILD_LOOP = (CARDS, SPACING) => {
  /**
   * number of EXTRA animations on either side of the
   * start/end to accommodate the seamless looping
   */
  const OVERLAP = Math.ceil(1 / SPACING)
  // The time on the rawSequence at which we'll start the seamless loop
  const START = CARDS.length * SPACING + 0.5
  // the spot at the end where we loop back to the START
  const LOOP_TIME = (CARDS.length + OVERLAP) * SPACING + 1
  // this is where all the "real" animations live
  const RAW = gsap.timeline({ paused: true })
  // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop
  const LOOP = gsap.timeline({
    paused: true,
    repeat: -1, // to accommodate infinite scrolling/looping
    onRepeat() {
      // works around a super rare edge case bug that's fixed GSAP 3.6.1
      // Not sure I need to worry about this then hopefully.
      // Although, I'd like to know what the issue is here.
      this._time === this._dur && (this._tTime += this._dur - 0.01)
    },
  })

  const L = CARDS.length + OVERLAP * 2
  let time = 0
  let i
  let index
  let item

  // set initial state of items
  // Here's where to use the state map for our positions.
  gsap.set(CARDS, { xPercent: 5000, opacity: 0, scale: 0 })

  /**
   * number of EXTRA animations on either side of the
   * start/end to accommodate the seamless looping
   */
  for (i = 0; i < L; i++) {
    index = i % CARDS.length
    item = CARDS[index]
    time = i * SPACING
    // This the actual animation timeline.
    // All cards start off at 0 scale and opacity to the right?
    // From what I can tell here, this is calculating all the positions by adding
    // a fromTo for every item
    // There are two fromTo because the properties have a different duration.
    // We want the cards to appear quicker.
    RAW.fromTo(
      item,
      { opacity: 0 },
      {
        opacity: 1,
        delay: 0.25,
        duration: 0.25,
        yoyo: true,
        ease: 'none',
        repeat: 1,
        immediateRender: false,
      },
      time
    )
      .fromTo(
        item,
        { scale: 0 },
        {
          scale: 1,
          // opacity: 1,
          zIndex: 100,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: 'none',
          immediateRender: false,
          onStart: () => {
            playWhoosh()
          },
        },
        time
      )
      .fromTo(
        item,
        { xPercent: 250 },
        { xPercent: -250, duration: 1, ease: 'none', immediateRender: false },
        time
      )
    // This is neat for a label jump trick which can be done with .scroll I think.
    i <= CARDS.length && LOOP.add('label' + i, time) // we don't really need these, but if you wanted to jump to key spots using labels, here ya go.
  }

  // here's where we set up the scrubbing of the playhead to make it appear seamless.
  RAW.time(START)
  LOOP.to(RAW, {
    time: LOOP_TIME,
    duration: LOOP_TIME - START,
    ease: 'none',
  }).fromTo(
    RAW,
    { time: OVERLAP * SPACING + 1 },
    {
      time: START,
      duration: START - (OVERLAP * SPACING + 1),
      immediateRender: false,
      ease: 'none',
    }
  )
  return LOOP
}

/**
 *  gets iterated when we scroll all the way to the end or start and wraps around
 *  allows us to smoothly continue the playhead scrubbing in the correct direction.
 *  */
let iteration = 0
const SPACING = 0.1 // Used as a stagger
const CARD_SNAP = snap(SPACING)
const CARDS = toArray('.card')
const LOOP = BUILD_LOOP(CARDS, SPACING)

// Scrub the playhead loop
const SCRUB = to(LOOP, {
  totalTime: 0,
  duration: 0.5,
  ease: 'power3',
  paused: true,
})

let TRIGGER
// when the ScrollTrigger reaches the end, loop back to the beginning seamlessly
// Increase the iteration and scroll back to 1
// Keep track of the fact that we're wrapping
const wrapForward = () => {
  iteration++
  TRIGGER.wrapping = true
  TRIGGER.scroll(TRIGGER.start + 1)
}

/**
 * to keep the playhead from stopping at the beginning, we jump ahead 10 iterations
 */
const wrapBackward = () => {
  iteration--
  if (iteration < 0) {
    // This makes sense because going lower than 0 will cause a halt
    iteration = 9
    // Bump the total time in the scrubber
    LOOP.totalTime(LOOP.totalTime() + LOOP.duration() * 10)
  }
  // Kepp track of being wrapped
  TRIGGER.wrapping = true
  // Scroll to the end with a little breathing room so we don't get trapped
  TRIGGER.scroll(TRIGGER.end - 1)
}

TRIGGER = ScrollTrigger.create({
  start: 0,
  end: '+=3000',
  horizontal: false,
  pin: '.gallery',
  onUpdate: self => {
    if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
      wrapForward(self)
    } else if (self.progress < 1e-5 && self.direction < 0 && !self.wrapping) {
      // 1e-5 === 0.00001 Fancy...
      wrapBackward(self)
    } else {
      SCRUB.vars.totalTime = CARD_SNAP(
        (iteration + self.progress) * LOOP.duration()
      )
      SCRUB.invalidate().restart()
      self.wrapping = false
    }
  },
})

// Hook up Next/Prev buttons.
NEXT.addEventListener('click', () => {
  SCRUB_TO(SCRUB.vars.totalTime + SPACING)
})
PREV.addEventListener('click', () => {
  SCRUB_TO(SCRUB.vars.totalTime - SPACING)
})
