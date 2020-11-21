const {
  gsap: {
    registerPlugin,
    set,
    to,
    timeline,
    delayedCall,
    utils: { random },
  },
  MorphSVGPlugin,
  Draggable,
} = window
registerPlugin(MorphSVGPlugin)

// Used to calculate distance of "tug"
let startX
let startY

const CORD_DURATION = 0.1
const INPUT = document.querySelector('#light-mode')
const ARMS = document.querySelectorAll('.bear__arm')
const PAW = document.querySelector('.bear__paw')
const CORDS = document.querySelectorAll('.toggle-scene__cord')
const HIT = document.querySelector('.toggle-scene__hit-spot')
const DUMMY = document.querySelector('.toggle-scene__dummy-cord')
const DUMMY_CORD = document.querySelector('.toggle-scene__dummy-cord line')
const PROXY = document.createElement('div')
const endY = DUMMY_CORD.getAttribute('y2')
const endX = DUMMY_CORD.getAttribute('x2')
// set init position
const RESET = () => {
  set(PROXY, {
    x: endX,
    y: endY,
  })
}

const AUDIO = {
  BEAR_LONG: new Audio('https://assets.codepen.io/605876/bear-groan-long.mp3'),
  BEAR_SHORT: new Audio(
    'https://assets.codepen.io/605876/bear-groan-short.mp3'
  ),
  DOOR_OPEN: new Audio('https://assets.codepen.io/605876/door-open.mp3'),
  DOOR_CLOSE: new Audio('https://assets.codepen.io/605876/door-close.mp3'),
  CLICK: new Audio('https://assets.codepen.io/605876/click.mp3'),
}
const STATE = {
  ON: false,
  ANGER: 0,
}
set(PAW, {
  transformOrigin: '50% 50%',
  xPercent: -30,
})
set('.bulb', { z: 10 })
set(ARMS, {
  xPercent: 10,
  rotation: -90,
  transformOrigin: '100% 50%',
  yPercent: -2,
  display: 'block',
})
const CONFIG = {
  ARM_DUR: 0.4,
  CLENCH_DUR: 0.1,
  BEAR_START: 40,
  BEAR_FINISH: -55,
  BEAR_ROTATE: -50,
  DOOR_OPEN: 25,
  INTRO_DELAY: 1,
  BEAR_APPEARANCE: 2,
  SLAM: 3,
  BROWS: 4,
}
set('.bear__brows', { display: 'none' })
set('.bear', {
  rotate: CONFIG.BEAR_ROTATE,
  xPercent: CONFIG.BEAR_START,
  transformOrigin: '50% 50%',
  scale: 0,
  display: 'block',
})

RESET()

const CORD_TL = () => {
  const TL = timeline({
    paused: false,
    onStart: () => {
      // Hook this up to localStorage for jhey.dev
      STATE.ON = !STATE.ON
      INPUT.checked = !STATE.ON
      set(document.documentElement, { '--on': STATE.ON ? 1 : 0 })
      set([DUMMY], { display: 'none' })
      set(CORDS[0], { display: 'block' })
      AUDIO.CLICK.play()
    },
    onComplete: () => {
      // BEAR_TL.restart()
      set([DUMMY], { display: 'block' })
      set(CORDS[0], { display: 'none' })
      RESET()
    },
  })
  for (let i = 1; i < CORDS.length; i++) {
    TL.add(
      to(CORDS[0], {
        morphSVG: CORDS[i],
        duration: CORD_DURATION,
        repeat: 1,
        yoyo: true,
      })
    )
  }
  return TL
}

/**
 * Mess around with the actial input toggling here.
 */
const BEAR_TL = () => {
  const ARM_SWING = STATE.ANGER > 4 ? 0.2 : CONFIG.ARM_DUR
  const SLIDE = STATE.ANGER > CONFIG.BROWS + 3 ? 0.2 : random(0.2, 0.6)
  const CLOSE_DELAY = STATE.ANGER >= CONFIG.INTRO_DELAY ? random(0.2, 2) : 0
  const TL = timeline({
    paused: false,
  })
    .to('.door', {
      onStart: () => AUDIO.DOOR_OPEN.play(),
      rotateY: 25,
      duration: 0.2,
    })
    .add(
      STATE.ANGER >= CONFIG.BEAR_APPEARANCE && Math.random() > 0.25
        ? to('.bear', {
            onStart: () => {
              if (Math.random() > 0.5) {
                delayedCall(random(0, 1.5), () => {
                  AUDIO[
                    STATE.ANGER >= CONFIG.BROWS && Math.random() > 0.5
                      ? 'BEAR_LONG'
                      : 'BEAR_SHORT'
                  ].play()
                })
              }
              set('.bear', { scale: 1 })
            },
            xPercent: CONFIG.BEAR_FINISH,
            repeat: 1,
            repeatDelay: 1,
            yoyo: true,
            duration: SLIDE,
          })
        : () => {}
    )
    .to(ARMS, {
      delay: CLOSE_DELAY,
      duration: ARM_SWING,
      rotation: 0,
      xPercent: 0,
      yPercent: 0,
    })
    .to(
      [PAW, '#knuckles'],
      {
        duration: CONFIG.CLENCH_DUR,
        xPercent: (_, target) => (target.id === 'knuckles' ? 10 : 0),
      },
      `>-${ARM_SWING * 0.5}`
    )
    .to(ARMS, {
      duration: ARM_SWING * 0.5,
      rotation: 5,
    })
    .to(ARMS, {
      rotation: -90,
      xPercent: 10,
      duration: ARM_SWING,
      onComplete: () => {
        to('.door', {
          onComplete: () => AUDIO.DOOR_CLOSE.play(),
          duration: 0.2,
          rotateY: 0,
        })
      },
    })
    .to(
      DUMMY_CORD,
      {
        duration: CONFIG.CLENCH_DUR,
        attr: {
          x2: parseInt(endX, 10) + 20,
          y2: parseInt(endY, 10) + 60,
        },
      },
      '<'
    )
    .to(
      DUMMY_CORD,
      {
        duration: CONFIG.CLENCH_DUR,
        attr: {
          x2: endX,
          y2: endY,
        },
      },
      '>'
    )
    .to(
      [PAW, '#knuckles'],
      {
        duration: CONFIG.CLENCH_DUR,
        xPercent: (_, target) => (target.id === 'knuckles' ? 0 : -28),
      },
      '<'
    )
    .add(() => CORD_TL(), '<')
  return TL
}

const IMPOSSIBLE_TL = () =>
  timeline({
    onStart: () => set(HIT, { display: 'none' }),
    onComplete: () => {
      set(HIT, { display: 'block' })
      if (Math.random() > 0) STATE.ANGER = STATE.ANGER + 1
      if (STATE.ANGER >= CONFIG.BROWS) set('.bear__brows', { display: 'block' })
    },
  })
    .add(CORD_TL())
    .add(BEAR_TL())

Draggable.create(PROXY, {
  trigger: HIT,
  type: 'x,y',
  onPress: e => {
    startX = e.x
    startY = e.y
    RESET()
  },
  onDrag: function() {
    set(DUMMY_CORD, {
      attr: {
        x2: this.x,
        y2: this.y,
      },
    })
  },
  onRelease: function(e) {
    const DISTX = Math.abs(e.x - startX)
    const DISTY = Math.abs(e.y - startY)
    const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY)
    to(DUMMY_CORD, {
      attr: { x2: endX, y2: endY },
      duration: CORD_DURATION,
      onComplete: () => {
        if (TRAVELLED > 50) {
          IMPOSSIBLE_TL()
        } else {
          RESET()
        }
      },
    })
  },
})
