const {
  gsap: {
    set,
    to,
    timeline,
    registerPlugin,
    utils: { mapRange, clamp, random },
  },
  Draggable,
  InertiaPlugin,
} = window

registerPlugin(InertiaPlugin)

let shakeReset
let comparator
let INERT_COUNT = 0
let SHAKING = false
const BOUNDS = 800
const SHAKE_BOUND = 200
const ROTATE = 25
const SHAKE_THRESHOLD = 6
const SHAKE_TIMEOUT = 500
const BOO_TIMER = 2000
const TIMING = {
  TAILS: 1,
}

set('.ghost__tails--two', { xPercent: -100 })
// Move pupils across 2 and down 2 to center: x: '+=2', y: '+=2'
set(['.ghost__eyes', '.ghost__mouth-clip', '.ghost__mouth-group'], {
  transformOrigin: '50% 50%',
})
set('.ghost__pupil', { x: 0, y: 0, transformOrigin: '50% 50%' })
set(['.ghost__features--shook', '.ghost__boo-features'], { display: 'none' })
set('.ghost__tongue--shook', { yPercent: 50 })
set('.ghost__teeth', { scale: 1.15, transformOrigin: '50% 50%'})

const AUDIO = {
  PAC: new Audio('https://assets.codepen.io/605876/pac-out.mp3'),
  BOO: new Audio('https://assets.codepen.io/605876/boo.mp3')
}

AUDIO.BOO.volume = 0.5

const BLINK = () => {
  const delay = random(2, 6)
  timeline().to('.ghost__eyes', {
    delay,
    onComplete: () => BLINK(),
    scaleY: 0.1,
    repeat: 3,
    yoyo: true,
    duration: 0.05,
  })
}

let tailsTl

const checkReverseLoop = (tl = tailsTl) => {
  if (tl.reversed() && tl.totalTime() <= tl.duration()) {
    tl.totalTime(tl.totalTime() + tl.duration() * 100, true) //just shoot it out 100 cycles forward and suppress events
  }
}

tailsTl = timeline({
  repeat: -1,
  ease: 'none',
  onRepeat: checkReverseLoop,
})
  .to(
    '.ghost__tails',
    { duration: TIMING.TAILS, xPercent: 100, ease: 'none' },
    0
  )
  .to(
    '.ghost__tails--two',
    { duration: TIMING.TAILS, xPercent: 0, ease: 'none' },
    0
  )

BLINK()

let direction = 'left'
let ghosting = false
const GHOST_DRAG = document.querySelector('.ghost__drag')
let booTimer
GHOST_DRAG.addEventListener('dblclick', () => {
  if (!ghosting) {
    AUDIO.BOO.play()
    set('.ghost__boo-features', { display: 'block' })
    if (booTimer) clearTimeout(booTimer)
    booTimer = setTimeout(() => {
      set('.ghost__boo-features', { display: 'none' })
    }, BOO_TIMER)
  }
})

Draggable.create(GHOST_DRAG, {
  type: 'x,y',
  trigger: GHOST_DRAG,
  inertia: true,
  bounds: document.body,
  dragResistance: 0.25,
  onDrag: function() {
    set(GHOST_DRAG, {
      x: this.x,
      y: this.y,
    })
    const INE_X = InertiaPlugin.getVelocity(GHOST_DRAG, 'x')
    const MOM_X = clamp(-BOUNDS, BOUNDS, INE_X)
    const rotation = mapRange(-BOUNDS, BOUNDS, ROTATE, -ROTATE, MOM_X)

    to(GHOST_DRAG, {
      rotation,
      duration: 0.25,
    })
    to('.ghost__body-wrapper', {
      skewX: rotation * 0.5,
      duration: 0.25,
    })

    // Handle changing tails direction
    const currentDirection = this.getDirection()
    if (
      (currentDirection !== direction && currentDirection === 'left') ||
      currentDirection === 'right'
    ) {
      direction = currentDirection
      if (direction === 'right') {
        tailsTl.reverse()
        checkReverseLoop()
      } else tailsTl.play()
    }

    if (
      ((INE_X < -SHAKE_BOUND || INE_X > SHAKE_BOUND) && !SHAKING) ||
      (SHAKING && comparator(INE_X))
    ) {
      SHAKING = true
      INERT_COUNT += 1
      if (INERT_COUNT > 2) {
        set('.ghost__features--shook', { display: 'block' })
        set(['.ghost__eyes', '.ghost__mouth-group', '.ghost__boo-features'], { display: 'none' })
      }
      // Need to create a way of mapping the opposite
      if (INE_X < -SHAKE_BOUND) {
        // The next value must be INE_X > SHAKE_BOUND
        // Create a function
        comparator = val => val > SHAKE_BOUND
      } else {
        comparator = val => val < -SHAKE_BOUND
      }

      if (shakeReset) clearTimeout(shakeReset)
      shakeReset = setTimeout(() => {
        INERT_COUNT = 0
        SHAKING = false
        shakeReset = null
      }, SHAKE_TIMEOUT)
    }
  },
  onDragEnd: () => {
    set('.ghost__features--shook', { display: 'none' })
    set(['.ghost__eyes', '.ghost__mouth-group'], { display: 'block' })
    if (INERT_COUNT > SHAKE_THRESHOLD) {
      timeline({
        onStart: () => {
          ghosting = true
          AUDIO.PAC.play()
          set('.ghost__boo-features', { display: 'none' })
          set('.ghost__body', {
            fill: '#2121DE',
          })
        },
      })
        .to(document.documentElement, {
          '--light': 0,
        })
        .to(
          tailsTl,
          {
            timeScale: 2,
          },
          0
        )
      set(['.ghost__tongue', '.ghost__cheeks'], { display: 'none' })
      set(['.ghost__eyes', '.ghost__mouth'], { fill: 'yellow' })
      set('.ghost__mouth-group', { rotation: 180 })
    }

    // RESET
    to(GHOST_DRAG, {
      duration: 0.25,
      rotation: 0,
    })
    to('.ghost__body-wrapper', {
      skewX: 0,
      duration: 0.25,
    })
  },
})

AUDIO.PAC.addEventListener('ended', () => {
  timeline({
    onComplete: () => {
      ghosting = false
    }
  })
    .to(
      document.documentElement,
      {
        '--light': 10,
      },
      0
    )
    .to(
      tailsTl,
      {
        timeScale: 1,
      },
      0
    )
  set('.ghost__body', {
    fill: 'white',
  })
  set(['.ghost__tongue', '.ghost__cheeks'], { display: 'block' })
  set(['.ghost__eyes', '.ghost__mouth'], { fill: 'black' })
  set('.ghost__mouth-group', { rotation: 0 })
})
