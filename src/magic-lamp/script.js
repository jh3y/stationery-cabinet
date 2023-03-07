const {
  gsap,
  gsap: { registerPlugin, set, to, timeline },
  MorphSVGPlugin,
  Draggable,
} = window
registerPlugin(MorphSVGPlugin)

const AUDIO = {
  CLICK: new Audio('https://assets.codepen.io/605876/click.mp3'),
}

// Used to calculate distance of "tug"
let startX
let startY

const PROXY = document.createElement('div')

const CORDS = gsap.utils.toArray('.cords path')
const CORD_DURATION = 0.1
const HIT = document.querySelector('.lamp__hit')
const DUMMY_CORD = document.querySelector('.cord--dummy')
const ENDX = DUMMY_CORD.getAttribute('x2')
const ENDY = DUMMY_CORD.getAttribute('y2')
const RESET = () => {
  set(PROXY, {
    x: ENDX,
    y: ENDY,
  })
}
RESET()

const STATE = {
  ON: false,
}

gsap.set(['.cords', HIT], {
  x: -10,
})

gsap.set('.lamp__eye', {
  rotate: 180,
  transformOrigin: '50% 50%',
  yPercent: 50,
})

const CORD_TL = timeline({
  paused: true,
  onStart: () => {
    STATE.ON = !STATE.ON
    set(document.documentElement, { '--on': STATE.ON ? 1 : 0 })
    set(document.documentElement, { '--shade-hue': gsap.utils.random(0, 359) })
    set('.lamp__eye', {
      rotate: STATE.ON ? 0 : 180,
    })
    set([DUMMY_CORD, HIT], { display: 'none' })
    set(CORDS[0], { display: 'block' })
    AUDIO.CLICK.play()
  },
  onComplete: () => {
    set([DUMMY_CORD, HIT], { display: 'block' })
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
        y2: Math.max(400, this.y),
      },
    })
  },
  onRelease: function(e) {
    const DISTX = Math.abs(e.x - startX)
    const DISTY = Math.abs(e.y - startY)
    const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY)
    to(DUMMY_CORD, {
      attr: { x2: ENDX, y2: ENDY },
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
