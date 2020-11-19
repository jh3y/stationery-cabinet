const {
  gsap: { registerPlugin, set, to, timeline },
  MorphSVGPlugin,
  Draggable,
} = window
registerPlugin(MorphSVGPlugin)

// Used to calculate distance of "tug"
let startX
let startY
let endX
let endY

const AUDIO = {
  CLICK: new Audio('https://assets.codepen.io/605876/click.mp3'),
}
const STATE = {
  ON: false,
}
const CORD_DURATION = 0.1
const INPUT = document.querySelector('#light-mode')
const ARMS = document.querySelectorAll('.bear__arm')
const PAW = document.querySelector('.bear__paw')
const CORDS = document.querySelectorAll('.toggle-scene__cord')
const HIT = document.querySelector('.toggle-scene__hit-spot')
const DUMMY = document.querySelector('.toggle-scene__dummy-cord')
const DUMMY_CORD = document.querySelector('.toggle-scene__dummy-cord line')
const PROXY = document.createElement('div')
// set init position
const RESET = () => {
  set(PROXY, {
    x: DUMMY_CORD.getAttribute('x2'),
    y: DUMMY_CORD.getAttribute('y2'),
  })
}

RESET()

const CORD_TL = timeline({
  paused: true,
  onStart: () => {
    STATE.ON = !STATE.ON
    INPUT.checked = !INPUT.checked
    set(document.documentElement, { '--on': INPUT.checked ? 1 : 0 })
    // INPUT.checked = STATE.ON
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
    endX = DUMMY_CORD.getAttribute('x2')
    endY = DUMMY_CORD.getAttribute('y2')
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
// let TUG_TL
set(PAW, {
  xPercent: -30,
  // opacity: 0.1,
})
set(ARMS, {
  xPercent: 10,
  rotation: 90,
  transformOrigin: '100% 50%',
  yPercent: -2,
})

let holdX = DUMMY_CORD.getAttribute('x2')
let holdY = DUMMY_CORD.getAttribute('y2')
const TL = timeline({
  paused: true,
})
  .to(ARMS, {
    duration: 0.5,
    rotation: 0,
    xPercent: 0,
    yPercent: 0,
  })
  .to(
    PAW,
    {
      xPercent: 0,
      duration: 0.1,
    },
    '0.32'
  )
  .to(ARMS, {
    duration: 0.2,
    rotation: 5,
  })
  .to(ARMS, {
    rotation: -90,
    xPercent: 10,
  })
  .to(
    DUMMY_CORD,
    {
      duration: 0.15,
      attr: {
        x2: parseInt(holdX, 10) + 20,
        y2: parseInt(holdY, 10) + 60,
      },
    },
    '<'
  )
  .to(
    PAW,
    {
      duration: 0.1,
      xPercent: -28,
    },
    0.8
  )
  .to(
    DUMMY_CORD,
    {
      duration: 0.15,
      attr: {
        x2: holdX,
        y2: holdY,
      },
    },
    0.8
  )
  .to(
    CORDS[0],
    {
      onStart: () => {
        set(document.documentElement, { '--on': INPUT.checked ? 1 : 0 })
        set(DUMMY, { display: 'none' })
        set(CORDS[0], { display: 'block' })
        AUDIO.CLICK.play()
      },
      morphSVG: CORDS[1],
      duration: CORD_DURATION,
      repeat: 1,
      yoyo: true,
    },
    0.9
  )
  .to(CORDS[0], {
    morphSVG: CORDS[2],
    duration: CORD_DURATION,
    repeat: 1,
    yoyo: true,
  })
  .to(CORDS[0], {
    morphSVG: CORDS[3],
    duration: CORD_DURATION,
    repeat: 1,
    yoyo: true,
  })
  .to(CORDS[0], {
    morphSVG: CORDS[4],
    duration: CORD_DURATION,
    repeat: 1,
    yoyo: true,
    onComplete: () => {
      STATE.ON = !STATE.ON
      set(DUMMY, { display: 'block' })
      set(CORDS[0], { display: 'none' })
    },
  })
// GSDevTools.create()

INPUT.addEventListener('change', () => {
  if (INPUT.checked) {
    TL.restart()
  } else {
    TL.restart()
  }
  // if (INPUT.checked) {
  //   // Create the timeline
  //   TUG_TL = timeline({
  //     onStart: () => {
  //       set(DUMMY, { display: 'none' })
  //       set(CORDS[0], { display: 'block' })
  //     },
  //     onReverseComplete: () => {
  //       set(DUMMY, { display: 'block' })
  //       set(CORDS[0], { display: 'none' })
  //     },
  //     onComplete: () => {
  //       set(DUMMY, { display: 'block' })
  //       set(CORDS[0], { display: 'none' })
  //     },
  //   })
  //   for (let i = 1; i < CORDS.length; i++) {
  //     TUG_TL.add(
  //       to(CORDS[0], {
  //         morphSVG: CORDS[i],
  //         duration: CORD_DURATION,
  //         repeat: 1,
  //         yoyo: true,
  //       })
  //     )
  //   }
  // } else {
  //   set(DUMMY, { display: 'none' })
  //   set(CORDS[0], { display: 'block' })
  //   TUG_TL.reverse(0)
  // }
})
