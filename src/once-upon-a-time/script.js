const {
  gsap,
  ScrollTrigger,
  gsap: { set, to },
  Splitting,
} = window

Splitting()
set('.blurb', { visibility: 'visible' })
gsap.registerPlugin(ScrollTrigger)
window.scrollTo(0, 0)

const NOSE = document.querySelector('.marionette__nose')
const CONTAINER = document.querySelector('.marionette__container')
const MOUTH = document.querySelector('.marionette__mouth')
set(CONTAINER, { transformOrigin: '90% 50%', scale: 0 })
set(MOUTH, { transformOrigin: '50% 50%', scale: 0.2 })
set('.marionette__pupil', { transformOrigin: '50% 50%', scale: 0.75 })

const INC = 100
const PADDING = 200

const BLURB_ONE = [...document.querySelectorAll('.blurb--one .word')]
const BLURB_TWO = [...document.querySelectorAll('.blurb--two .word')]
const BLURB_THREE = [...document.querySelectorAll('.blurb--three .word')]
const BLURB_FOUR = [...document.querySelectorAll('.blurb--four .word')]

const BUFF_ONE = PADDING
// Once upon a time
BLURB_ONE.forEach((word, index) => {
  to(word, {
    scrollTrigger: {
      scrub: true,
      start: () => BUFF_ONE + index * INC,
      end: () => BUFF_ONE + index * INC + INC,
    },
    opacity: 0,
  })
})
// There was a marionette
const BUFF_TWO = BLURB_ONE.length * INC + INC + PADDING
BLURB_TWO.forEach((word, index) => {
  to(word, {
    scrollTrigger: {
      scrub: true,
      start: () => BUFF_TWO + index * INC,
      end: () => BUFF_TWO + index * INC + INC,
    },
    opacity: 1,
  })
})
// Show the marionette
to(CONTAINER, {
  scale: 1,
  scrollTrigger: {
    scrub: true,
    start: () => BUFF_TWO,
    end: () => BUFF_TWO + BLURB_TWO.length * INC + INC,
  },
})

// Hide the marionette text
const BUFF_THREE = BUFF_TWO + BLURB_TWO.length * INC + INC + PADDING
BLURB_TWO.forEach((word, index) => {
  to(word, {
    scrollTrigger: {
      scrub: true,
      start: () => BUFF_THREE + index * INC,
      end: () => BUFF_THREE + index * INC + INC,
    },
    opacity: 0,
  })
})

// And they lied
const BUFF_FOUR = BUFF_THREE + BLURB_TWO.length * INC + INC
BLURB_THREE.forEach((word, index) => {
  to(word, {
    scrollTrigger: {
      scrub: true,
      start: () => BUFF_FOUR + index * INC,
      end: () => BUFF_FOUR + index * INC + INC,
    },
    opacity: 1,
  })
})
const BUFF_FIVE = BUFF_FOUR + BLURB_THREE.length * INC + INC + PADDING
to(NOSE, {
  width: '75vmin',
  scrollTrigger: {
    scrub: true,
    start: () => BUFF_FOUR,
    end: () => BUFF_FIVE + BLURB_FOUR.length * INC + INC,
  },
})
to(MOUTH, {
  scale: 1,
  scrollTrigger: {
    scrub: true,
    start: () => BUFF_FOUR,
    end: () => BUFF_FIVE + BLURB_FOUR.length * INC + INC,
  },
})

BLURB_FOUR.forEach((word, index) => {
  to(word, {
    opacity: 1,
    scrollTrigger: {
      scrub: true,
      start: () => BUFF_FIVE + index * INC,
      end: () => BUFF_FIVE + index * INC + INC,
    },
  })
})

const blink = EYES => {
  gsap.set(EYES, { scaleY: 1 })
  if (EYES.BLINK_TL) EYES.BLINK_TL.kill()
  EYES.BLINK_TL = new gsap.timeline({
    delay: Math.floor(Math.random() * 4) + 1,
    onComplete: () => blink(EYES),
  })
  EYES.BLINK_TL.to(EYES, {
    duration: 0.05,
    transformOrigin: '50% 50%',
    scaleY: 0,
    yoyo: true,
    repeat: 1,
  })
}
const EYES = document.querySelectorAll('.marionette__eye')
blink(EYES)

document.body.style.height = `${BUFF_FIVE +
  BLURB_FOUR.length * INC +
  INC +
  PADDING +
  window.innerHeight}px`
