import gsap from 'https://cdn.skypack.dev/gsap'
const { registerPlugin } = gsap
const { MorphSVGPlugin } = window
registerPlugin(MorphSVGPlugin)

const ROTATION = 20
const LEFT = 'M199.816 386.138C298.5 267 324.5 211 336.624 10.261'
const RIGHT = 'M478.328 386.138C379.644 267 353.644 211 341.52 10.261'
const STRAIGHT = 'M339 411V11'

const COLORS = {
  BULB: 'hsl(55, 100%, 65%)',
  ON: 'hsl(0, 0%, 100%)',
  GLARE: 'hsla(0, 0%, 100%, 0.5)',
  CHORD: 'hsl(0, 0%, 50%)',
  OFF: 'hsl(0, 0%, 60%)',
  HOLDER: 'hsl(0, 0%, 40%)',
  HOLDER_STROKE: 'hsl(0, 0%, 45%)',
}

gsap.defaults({
  ease: 'none',
})

const BULBS = gsap.utils.toArray('.bulb')

gsap.set(BULBS, {
  xPercent: index => -200 + index * 100,
})

gsap.set('.bulb__holder', {
  fill: COLORS.HOLDER,
})
gsap.set('.bulb__holder-outline', {
  stroke: COLORS.HOLDER_STROKE,
})
gsap.set('.bulb__holder-shine', {
  fill: COLORS.GLARE,
})

const BULBERS = [
  BULBS[0].querySelector('.bulb__bulb'),
  BULBS[BULBS.length - 1].querySelector('.bulb__bulb'),
]
const CHORDS = [
  BULBS[0].querySelector('.bulb__chord'),
  BULBS[BULBS.length - 1].querySelector('.bulb__chord'),
]
const GLASSES = gsap.utils.toArray('.bulb__glass')
const FILAMENTS = gsap.utils.toArray('.bulb__filament')
const FLASHES = gsap.utils.toArray('.bulb__flash')

gsap.set([FILAMENTS, GLASSES], {
  stroke: COLORS.OFF,
})

gsap.set(BULBERS[0], {
  rotate: ROTATION,
  transformOrigin: '50% 0%',
})
gsap.set(CHORDS[0], {
  morphSVG: LEFT,
})
gsap.set(FLASHES, {
  scale: 0,
  transformOrigin: '50% 50%',
  fill: COLORS.BULB,
})
gsap.set('.bulb__glare', {
  stroke: COLORS.GLARE,
})

gsap.set(['.bulb__chord', '.bulb__fake-chord'], {
  stroke: COLORS.CHORD,
})

const SWING_SPEED = 0.4
const DELAY = 0.2

const SWING = gsap
  .timeline({
    paused: true,
  })
  .to(BULBERS[0], {
    rotate: 0,
    duration: SWING_SPEED,
  })
  .to(
    CHORDS[0],
    {
      morphSVG: STRAIGHT,
      duration: SWING_SPEED,
    },
    '<'
  )
  .to(BULBERS[1], {
    rotate: -ROTATION,
    duration: SWING_SPEED,
    delay: DELAY,
  })
  .to(
    CHORDS[1],
    {
      duration: SWING_SPEED,
      morphSVG: RIGHT,
    },
    '<'
  )

gsap.set(GLASSES[0], {
  fill: COLORS.BULB,
  stroke: COLORS.ON,
})
gsap.set(FILAMENTS[0], {
  stroke: COLORS.ON,
})
// Swinging is taken care of.
// Then sort out the bulb flashing.
const SWINGER = gsap.to(SWING, {
  totalTime: SWING.duration(),
  repeat: -1,
  yoyo: true,
  duration: 1,
  ease: 'power4.inOut',
})

// Handles flicking the end bulbs on and off.
const FLASHER = gsap
  .timeline({
    repeat: -1,
    yoyo: true,
    duration: 1,
  })
  .set(
    [GLASSES[0], FILAMENTS[0]],
    {
      fill: 'none',
      stroke: COLORS.OFF,
    },
    SWING_SPEED
  )
  .set(
    [GLASSES[GLASSES.length - 1], FILAMENTS[GLASSES.length - 1]],
    {
      fill: COLORS.BULB,
      stroke: COLORS.ON,
    },
    SWING_SPEED + DELAY
  )

// This last one handles the bulbs in the middle.
const OTHERS = GLASSES.filter(
  (g, idx) => idx !== 0 && idx !== GLASSES.length - 1
)
const OTHER_FILAMENTS = FILAMENTS.filter(
  (f, idx) => idx !== 0 && idx !== FILAMENTS.length - 1
)
const OTHER_FLASHES = FLASHES.filter(
  (f, idx) => idx !== 0 && idx !== FLASHES.length - 1
)

// When we go left, make sure it's 1 second
const FLASH_ON = gsap.timeline({
  repeat: -1,
  repeatDelay: 1,
  paused: true,
})
for (let o = 0; o < OTHERS.length; o++) {
  FLASH_ON.to(
    OTHERS[o],
    {
      fill: COLORS.BULB,
      stroke: COLORS.ON,
      repeat: 1,
      yoyo: true,
      duration: DELAY / 3,
    },
    SWING_SPEED + o * (DELAY / 3)
  )
  FLASH_ON.to(
    OTHER_FILAMENTS[o],
    {
      stroke: COLORS.ON,
      repeat: 1,
      yoyo: true,
      duration: DELAY / 3,
    },
    SWING_SPEED + o * (DELAY / 3)
  )
  FLASH_ON.fromTo(
    OTHER_FLASHES[o],
    {
      scale: 0,
      opacity: 1,
    },
    {
      scale: 2,
      opacity: 0,
      duration: 0.2,
    },
    SWING_SPEED + o * (DELAY / 3)
  )
  FLASH_ON.to(
    FLASHES[FLASHES.length - 1],
    {
      scale: 2,
      opacity: 0,
      duration: 0.2,
    },
    SWING_SPEED + DELAY
  )
}
// Flash off is going RTL
const FLASH_OFF = gsap.timeline({
  repeat: -1,
  repeatDelay: 1,
  paused: true,
})
for (let o = OTHERS.length - 1; o >= 0; o--) {
  FLASH_OFF.to(
    OTHERS[o],
    {
      fill: COLORS.BULB,
      stroke: COLORS.ON,
      repeat: 1,
      yoyo: true,
      duration: DELAY / 3,
    },
    SWING_SPEED + (OTHERS.length - o) * (DELAY / 3)
  )
  FLASH_OFF.to(
    OTHER_FILAMENTS[o],
    {
      stroke: COLORS.ON,
      repeat: 1,
      yoyo: true,
      duration: DELAY / 3,
    },
    SWING_SPEED + (OTHERS.length - o) * (DELAY / 3)
  )
  FLASH_OFF.fromTo(
    OTHER_FLASHES[o],
    {
      scale: 0,
      opacity: 1,
    },
    {
      scale: 2,
      opacity: 0,
      duration: 0.2,
    },
    SWING_SPEED + (OTHERS.length - o) * (DELAY / 3)
  )
  FLASH_OFF.to(
    FLASHES[0],
    {
      scale: 2,
      opacity: 0,
      duration: 0.2,
    },
    SWING_SPEED + DELAY
  )
}

const FLASH_LEFT = gsap.to(FLASH_ON, {
  totalTime: 1,
  repeat: -1,
  repeatDelay: 1,
  duration: 1,
})
const FLASH_RIGHT = gsap.to(FLASH_OFF, {
  totalTime: 1,
  repeat: -1,
  repeatDelay: 1,
  duration: 1,
  delay: 1,
})

gsap
  .timeline()
  .add(SWINGER, 0)
  .add(FLASHER, 0)
  .add(FLASH_LEFT, 0)
  .add(FLASH_RIGHT, 0)
  .timeScale(0.9)

gsap.set('.bulbs', {
  display: 'block',
})
