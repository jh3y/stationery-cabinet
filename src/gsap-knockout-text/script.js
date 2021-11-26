import gsap from 'https://cdn.skypack.dev/gsap'

const ORIGINS = [
  '51% 50%',
  '53% 55%',
  '55% 55%',
  '55% 55%',
  '51% 55%',
  '51% 56%',
  '52% 56%',
  '55% 57%',
  '56% 55%',
  '52% 55%',
]

let CURRENT = 2
const TARGET_BRIGHTNESS = 10
const SPEED = 1.2
const SCALES = [250, 600, 350, 250, 250, 350, 350, 350, 300, 300]

// Weird how you can't access these by class or descendant?
const CLIPS = gsap.utils.toArray('text')
const ITEMS = gsap.utils.toArray('li')
const TAG = document.querySelector('.cybr-sldr__tag')

const RESET = () => {
  // Total nuke first.
  gsap.set(CLIPS, {
    clearProps: true,
  })
  // Then set everything up
  gsap.set(CLIPS, {
    scale: index => (index === CURRENT ? SCALES[index] ?? 300 : 0),
    transformOrigin: index => ORIGINS[index] ?? '55% 55%',
  })
  gsap.set(ITEMS, {
    filter: index => `brightness(${index === CURRENT ? 1 : TARGET_BRIGHTNESS})`,
  })
  TAG.innerText = `IMG.${(CURRENT + 1).toString().padStart(2, 0)}`
}

RESET()

window.addEventListener('resize', RESET)

const UPDATE = e => {
  const DIRECTION = e.currentTarget.getAttribute('data-direction')
  const NEW_INDEX = gsap.utils.wrap(
    0,
    ITEMS.length,
    CURRENT + parseInt(DIRECTION, 10)
  )
  // Run our animation to set the new picture reveals
  gsap
    .timeline({
      onComplete: () => {
        // Set the index
        CURRENT = NEW_INDEX
        TAG.innerText = `IMG.${(CURRENT + 1).toString().padStart(2, 0)}`
      },
    })
    .set(ITEMS[NEW_INDEX], {
      zIndex: 2,
    })
    .set(ITEMS[CURRENT], {
      zIndex: 1,
    })
    .set(ITEMS[NEW_INDEX], {
      filter: 'brightness(0)',
    })
    .to(ITEMS[NEW_INDEX], {
      // delay: SPEED * 0.0625,
      ease: 'power4.in',
      filter: 'brightness(1)',
    })
    .to(
      ITEMS[CURRENT],
      {
        // duration: 0.25,
        filter: `brightness(${TARGET_BRIGHTNESS})`,
      },
      0
    )
    .to(
      CLIPS[NEW_INDEX],
      {
        ease: 'power4.in',
        duration: SPEED,
        scale: SCALES[NEW_INDEX] ?? 300,
      },
      0
    )
    .to(
      document.documentElement,
      {
        '--lightness': 25,
        yoyo: true,
        repeat: 1,
        duration: SPEED * 0.5,
      },
      0
    )
    .set(CLIPS[CURRENT], {
      scale: 0,
    })
}

const NEXT = document.querySelector('[data-direction="1"]')
const PREV = document.querySelector('[data-direction="-1"]')
NEXT.addEventListener('click', UPDATE)
PREV.addEventListener('click', UPDATE)

gsap.set('.cybr-sldr', { display: 'block' })