const {
  gsap: {
    to,
    set,
    timeline,
    registerPlugin,
    delayedCall,
    utils: { mapRange },
  },
  ScrollTrigger,
} = window

registerPlugin(ScrollTrigger)

const ELEVATOR = document.querySelector('.elevator')
const MAIN = document.querySelector('article')
const CONTAINER = document.querySelector('.elevator__container')
const FAKE_CURSOR = document.querySelector('.elevator__cursor')
const CURSOR_REFLECTION = document.querySelector('.elevator__cursor-reflection')
const CALL = document.querySelector('.elevator__call-button')
const UP = document.querySelector('.elevator__up-button')
const DOWN = document.querySelector('.elevator__down-button')

const SOUNDS = {
  DING: new Audio('https://assets.codepen.io/605876/elevator-door-ding.mp3'),
  TUNE: new Audio('https://assets.codepen.io/605876/elevator-theme-tune.mp3'),
}

const TIMEOUT = 10

SOUNDS.TUNE.loop = true

const STATE = {
  OPEN: false,
  DOORS_MOVING: false,
  ELEVATING: false,
}

let closer

set('.elevator__dial-dial', {
  transformOrigin: '50% 100%',
  rotate: 90,
  y: -0.5,
})

to('.elevator__dial-dial', {
  rotate: -90,
  scrollTrigger: {
    scrub: true,
    trigger: 'article',
    start: 'top top',
    end: 'bottom bottom',
  },
})

const doorOpener = () => {
  if (STATE.DOORS_MOVING || STATE.ELEVATING) return
  timeline({
    onStart: () => {
      SOUNDS.DING.play()
      if (closer) closer.kill()
      STATE.DOORS_MOVING = true
    },
    onComplete: () => {
      STATE.OPEN = !STATE.OPEN
      STATE.DOORS_MOVING = false
      CONTAINER.dataset.elevatorOpen = STATE.OPEN
      if (STATE.OPEN) closer = delayedCall(TIMEOUT, doorOpener)
    },
  })
    .to(
      '.elevator__door--left',
      { x: `${STATE.OPEN ? '+' : '-'}=16`, duration: 0.5 },
      0
    )
    .to(
      '.elevator__door--right',
      { x: `${STATE.OPEN ? '-' : '+'}=16`, duration: 0.5 },
      0
    )
}

CALL.addEventListener('click', doorOpener)

// -23 to 23
const updateCursorPos = e => {
  const BOUNDS = ELEVATOR.getBoundingClientRect()
  const x = mapRange(0, 100, -23, 26, ((e.x - BOUNDS.x) / BOUNDS.width) * 100)
  const y = mapRange(0, 100, -28, 18, ((e.y - BOUNDS.y) / BOUNDS.height) * 100)
  set(FAKE_CURSOR, { x, y })
  set(CURSOR_REFLECTION, { x: x + 0.00005, y: y - 0.00005 })
}
ELEVATOR.addEventListener('pointermove', updateCursorPos)
UP.addEventListener('pointermove', updateCursorPos)
DOWN.addEventListener('pointermove', updateCursorPos)

const PPS = 0.0025
const elevate = posFunc => () => {
  const pos = posFunc()
  const distance = Math.abs(pos.y - document.body.scrollTop)
  const duration = PPS * distance
  if (!STATE.OPEN || document.body.scrollTop === pos.y || STATE.ELEVATING)
    return
  timeline({
    onStart: () => {
      set('#cursor rect', { width: 32.81 })
      if (closer) closer.kill()
      STATE.ELEVATING = true
      document.body.dataset.elevatorElevating = true
      document.documentElement.style.setProperty('--cursor', 'none')
    },
    onComplete: () => {
      STATE.ELEVATING = false
      set('#cursor rect', { width: 38.81 })
      document.body.dataset.elevatorElevating = false
      document.documentElement.style.removeProperty('--cursor')
      closer = delayedCall(TIMEOUT, doorOpener)
    },
  })
    .to('.elevator__door--left', { x: `+=16`, duration: 0.5 }, 0)
    .to('.elevator__door--right', { x: `-=16`, duration: 0.5 }, 0)
    .to(window, {
      onStart: () => SOUNDS.TUNE.play(),
      onComplete: () => {
        SOUNDS.TUNE.pause()
        SOUNDS.DING.play()
      },
      scrollTo: pos,
      duration,
      ease: 'Power3.inOut',
    })
    .to('.elevator__door--left', { x: `-=16` }, duration + 0.5)
    .to('.elevator__door--right', { x: `+=16` }, duration + 0.5)
}
UP.addEventListener(
  'click',
  elevate(() => ({ y: 0, x: 0 }))
)
DOWN.addEventListener(
  'click',
  elevate(() => ({ y: MAIN.offsetHeight - document.body.offsetHeight, x: 0 }))
)
