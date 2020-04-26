const {
  gsap: { timeline, set },
  d3: { curveBasisClosed, curveStep, lineRadial },
} = window

// Elements
const DITTO = document.querySelector('.ditto')
const DITTO_PATH = document.querySelector('.ditto__path')
const DITTO_MOUTH = document.querySelector('.ditto__mouth')
const DITTO_BEAM = document.querySelector('.ditto__outline')
const POKEBALL_BEAM = document.querySelector('.pokeball__beam')
const DITTO_REAL = document.querySelector('.ditto__real')
const BUTTON = document.querySelector('button')
// Configurations
const CURVES = [curveBasisClosed, curveStep]
const DITTO_MOUTHS = [
  'M -40 -42.5 q 40 15 80 0', // Smile
  'M -40 -35 q -20 -0 80 0', // Straight
]
// Gonna say that Ditto has around 14 points
// Linear Radial goes 0 -> 360 CW from 12
const DEFAULT_POINTS = [
  [0, 100],
  [15, 120],
  [30, 130],
  [50, 95],
  [70, 140],
  [80, 150],
  [90, 130],
  [100, 90],
  [120, 160],
  [130, 170],
  [140, 160],
  [145, 130],
  [180, 150],
  [215, 130],
  [220, 160],
  [230, 180],
  [270, 80],
  [280, 160],
  [300, 190],
  [315, 80],
  [325, 140],
  [345, 160],
]

const SQUARE_POINTS = [
  [45, 150],
  [135, 150],
  [225, 150],
  [315, 150],
]

const SWAY = {
  X: 10,
  Y: 40,
}

// Utility function
const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min
// Return new points for Ditto body
// Maps the default points given some bounds
const getPoints = () => {
  if (Math.random() > 0.75) return SQUARE_POINTS
  const POINTS = DEFAULT_POINTS.map(point => [
    randomInRange(point[0] - SWAY.X, point[0] + SWAY.X),
    randomInRange(point[1] - SWAY.Y, point[1] + SWAY.Y),
  ])
  return POINTS
}
// Draws an outline for Ditto and determines whether
// he's smiling or what he color he is
const drawDitto = (
  points = DEFAULT_POINTS,
  curveBasis = curveBasisClosed,
  hue = 320
) => {
  const PATH = lineRadial().curve(curveBasis)(
    points.map(point => [point[0] * (Math.PI / 180), point[1]])
  )
  DITTO.style.setProperty('--hue', hue)
  DITTO_PATH.setAttribute(
    'd',
    PATH.charAt(PATH.length).toLowerCase() !== 'z' ? `${PATH}z` : PATH
  )
}

// Draw ditto initially, doesn't necessarily mean he's showing
drawDitto()

const STATE = {
  ACTIVE: false,
  DITTO_OUT: false,
  RAN: false,
}
const CONFIG = {
  POKEBALL_SPEED: 0.15,
}
set(DITTO_BEAM, { transformOrigin: '50% 50%', scale: 1.05, opacity: 0 })
set(POKEBALL_BEAM, { transformOrigin: '50% 100%', scaleY: 0 })
// Event binding
const onComplete = () => {
  BUTTON.removeAttribute('style')
  STATE.DITTO_OUT = !STATE.DITTO_OUT
  STATE.ACTIVE = false
}
const onStart = () => {
  STATE.ACTIVE = true
}
BUTTON.addEventListener('click', () => {
  if (STATE.ACTIVE) return
  if (STATE.RAN && !STATE.DITTO_OUT) {
    drawDitto(
      Math.random() > 0.5 ? DEFAULT_POINTS : getPoints(),
      Math.random() > 0.75 ? CURVES[1] : CURVES[0],
      Math.random() > 0.75 ? 180 : 320
    )
  }
  if (!STATE.RAN) STATE.RAN = true
  set(BUTTON, { '--level': 0, transformOrigin: '50% 100%', rotateX: -20 })
  if (STATE.DITTO_OUT) {
    new timeline({
      onStart,
      onComplete,
    })
      .set(POKEBALL_BEAM, { transformOrigin: '50% 100%', opacity: 1 })
      .to(DITTO_BEAM, { duration: CONFIG.POKEBALL_SPEED, opacity: 1 }, 0)
      .to(POKEBALL_BEAM, { duration: CONFIG.POKEBALL_SPEED, scaleY: 1 }, 0)
      .to(DITTO_REAL, { duration: CONFIG.POKEBALL_SPEED, opacity: 0 }, 0)
      .to(
        DITTO_BEAM,
        { duration: CONFIG.POKEBALL_SPEED, opacity: 0 },
        CONFIG.POKEBALL_SPEED
      )
      .to(
        POKEBALL_BEAM,
        { duration: CONFIG.POKEBALL_SPEED, scaleY: 0 },
        CONFIG.POKEBALL_SPEED
      )
  } else {
    new timeline({
      onStart,
      onComplete,
    })
      .to(POKEBALL_BEAM, { duration: CONFIG.POKEBALL_SPEED, scaleY: 1 }, 0)
      .to(DITTO_BEAM, { duration: CONFIG.POKEBALL_SPEED, opacity: 1 }, 0)
      .to(
        DITTO_BEAM,
        { duration: CONFIG.POKEBALL_SPEED, opacity: 0 },
        CONFIG.POKEBALL_SPEED
      )
      .to(
        DITTO_REAL,
        { duration: CONFIG.POKEBALL_SPEED, opacity: 1 },
        CONFIG.POKEBALL_SPEED
      )
      .to(
        POKEBALL_BEAM,
        {
          duration: CONFIG.POKEBALL_SPEED,
          opacity: 0,
          transformOrigin: '50% 0',
          scaleY: 0,
        },
        CONFIG.POKEBALL_SPEED
      )
  }
})

// Update his mouth
const smileOrNoSmile = () => {
  const MOUTH_INDEX = randomInRange(0, DITTO_MOUTHS.length - 1)
  DITTO_MOUTH.setAttribute('d', DITTO_MOUTHS[MOUTH_INDEX])
  setTimeout(smileOrNoSmile, randomInRange(4000, 10000))
}
smileOrNoSmile()

const EYES = document.querySelector('.ditto__eyes')
const blink = () => {
  set(EYES, { scaleY: 1 })
  if (EYES.BLINK_TL) EYES.BLINK_TL.kill()
  EYES.BLINK_TL = new timeline({
    delay: Math.floor(Math.random() * 4) + 1,
    onComplete: () => blink(EYES),
  }).to(EYES, {
    duration: 0.05,
    transformOrigin: '50% 50%',
    scaleY: 0,
    yoyo: true,
    repeat: 1,
  })
}
blink()
