const {
  gsap: { registerPlugin, set, to, timeline },
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
    x: DUMMY_CORD.getAttribute('x2'),
    y: DUMMY_CORD.getAttribute('y2'),
  })
}

const AUDIO = {
  CLICK: new Audio('https://assets.codepen.io/605876/click.mp3'),
}
const STATE = {
  ON: false,
}
set(PAW, {
  transformOrigin: '50% 50%',
  xPercent: -30,
})
set('.bulb', { z: 10 })
set(ARMS, {
  xPercent: 10,
  rotation: 90,
  transformOrigin: '100% 50%',
  yPercent: -2,
})

const CONFIG = {
  ARM_DUR: 0.4,
  CLENCH_DUR: 0.1,
}

RESET()

const CORD_TL = timeline({
  paused: true,
  onStart: () => {
    // Hook this up to localStorage for jhey.dev
    STATE.ON = !STATE.ON
    INPUT.checked = !STATE.ON
    set(document.documentElement, { '--on': STATE.ON ? 1 : 0 })
    set(DUMMY, { display: 'none' })
    set(CORDS[0], { display: 'block' })
    AUDIO.CLICK.play()
  },
  onComplete: () => {
    set(DUMMY, { display: 'block' })
    set(CORDS[0], { display: 'none' })
    RESET()
  },
})
for (let i = 1; i < CORDS.length; i++) {
  CORD_TL.add(
    to(CORDS[0], {
      morphSVG: CORDS[i],
      duration: CORD_DURATION,
      repeat: 1,
      yoyo: true,
    })
  )
}

Draggable.create(PROXY, {
  trigger: HIT,
  type: 'x,y',
  onPress: e => {
    startX = e.x
    startY = e.y
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
          CORD_TL.restart()
        } else {
          RESET()
        }
      },
    })
  },
})

/**
 * Mess around with the actial input toggling here.
 */
const BEAR_TL = timeline({
  paused: true,
})
  .to(ARMS, {
    duration: CONFIG.ARM_DUR,
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
    '>-0.2'
  )
  .to(ARMS, {
    duration: CONFIG.ARM_DUR * 0.5,
    rotation: 5,
  })
  .to(ARMS, {
    rotation: -90,
    xPercent: 10,
    duration: CONFIG.ARM_DUR,
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
  .add(() => CORD_TL.restart(), '<')

INPUT.addEventListener('change', () => {
  if (INPUT.checked) {
    BEAR_TL.restart()
  } else {
    BEAR_TL.restart()
  }
})
