const {
  gsap: { timeline, to, set },
} = window

const MANDO = document.querySelector('.mandalorian')
const BTN = document.querySelector('button')

const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

// Set an initial random position for MANDO
set(MANDO, {
  x: Math.random() * window.innerWidth,
})
const SHOT = document.querySelector('.shot')
const RIGHT_ARM = document.querySelector('.right__arm')
set(RIGHT_ARM, { rotate: -21, transformOrigin: '0% 30%' })

const BLASTER_BEAM = document.querySelector('.blaster__beam')
const BOUNDS = BLASTER_BEAM.getBoundingClientRect()
const CONTAINER = document.querySelector('.mando__container')
const CONTAINER_BOUNDS = CONTAINER.getBoundingClientRect()

set(SHOT, {
  y: BOUNDS.top - CONTAINER_BOUNDS.top,
  x: BOUNDS.left - CONTAINER_BOUNDS.left,
  width: BOUNDS.width,
  height: BOUNDS.height,
})
to(SHOT, {
  onStart: () => {
    // eslint-disable-next-line
    zzfx(...[, , 448, 0.01, 0.1, 0.3, 3, 0.39, -0.5, , , , , , 0.2, 0.1, 0.08])
  },
  onRepeat: () => {
    // eslint-disable-next-line
    zzfx(...[, , 448, 0.01, 0.1, 0.3, 3, 0.39, -0.5, , , , , , 0.2, 0.1, 0.08])
  },
  duration: 0.5,
  x: '+=100vw',
  repeat: 3,
})

const getFlightMechanics = () => {
  const { x: xCurrent } = MANDO.getBoundingClientRect()
  const RES = {}
  if (xCurrent > window.innerWidth / 2) {
    RES.angle = randomInRange(-120, -90)
  } else {
    RES.angle = randomInRange(-90, -60)
  }
  return RES
}

const fly = () => {
  const { angle } = getFlightMechanics()
  new timeline({
    onStart: () => {
      BTN.setAttribute('disabled', true)
    },
    onComplete: () => {
      // Get bounds for mando, if he's out of the picture
      // Bring him in.
      let x = MANDO.getBoundingClientRect().x
      if (x > window.innerWidth && x > window.innerWidth / 2)
        x = randomInRange(window.innerWidth / 2, window.innerWidth)
      if (x < 0) x = randomInRange(0, window.innerWidth / 2)
      set(MANDO, { x, y: 0 })
      BTN.removeAttribute('disabled')
    },
  }).to(MANDO, {
    duration: 2,
    physics2D: {
      velocity: window.innerHeight * 2,
      angle,
      gravity: window.innerHeight * 2,
    },
  })
}

BTN.addEventListener('click', fly)

// GSDevTools.create()
