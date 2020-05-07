const {
  gsap: { set, timeline, to },
} = window

// 100 x to 57.75 y is the ratio for movement
const shift = distance => ({ x: distance, y: distance * -0.5775 })
const movementParams = shift(-622)
const jetParams = shift(50)

set('.dupe', { ...shift(-618) })
set('.blackbird__shadow', { transformOrigin: '50% 50%', scale: 0.75 })
set('.antennae__flash--higher', { transformOrigin: '50% 50%', x: 468, y: 705 })
set('.antennae__flash--lower', { transformOrigin: '50% 50%', x: 480, y: 720 })

const DRIFT_SPEED = 2
const LOWER_SPEED = 5
const SHIFT_SPEED = 2
const RAISE_SPEED = 4

document.querySelector('audio').volume = 0.5

new timeline({
  id: 'Landscape',
  repeat: -1,
}).to('.landscape', {
  x: `-=${movementParams.x}`,
  y: `-=${movementParams.y}`,
  duration: 0.35,
  ease: 'none',
})

new timeline({
  id: 'Blackbird',
  delay: Math.random() + 1,
  repeat: -1,
  yoyo: true,
  repeatDelay: Math.random() * 2 + 1,
})
  .to(
    ['.blackbird', '.blackbird__shadow'],
    {
      x: `+=${jetParams.x}`,
      y: `-=${jetParams.y}`,
      duration: DRIFT_SPEED,
      ease: 'Power2.easeInOut',
    },
    0
  )
  .to(
    ['.blackbird'],
    {
      x: `+=${100}`,
      y: `+=${200}`,
      duration: LOWER_SPEED,
      ease: 'Power2.easeInOut',
    },
    DRIFT_SPEED
  )
  .to(
    ['.blackbird__shadow'],
    {
      x: '+=100',
      scale: 0.9,
      opacity: 0.85,
      duration: LOWER_SPEED,
      ease: 'Power2.easeInOut',
    },
    DRIFT_SPEED
  )
  .to(
    ['.blackbird', '.blackbird__shadow'],
    {
      x: `-=${100}`,
      y: `-=${50}`,
      duration: SHIFT_SPEED,
      ease: 'Power2.easeInOut',
    },
    LOWER_SPEED + DRIFT_SPEED
  )
  // .to('.')

  .to(
    ['.blackbird__shadow'],
    {
      x: `-=${jetParams.x}`,
      y: `+=${jetParams.y + 50}`,
      scale: 0.75,
      opacity: 0.5,
      duration: RAISE_SPEED,
      ease: 'Power2.easeInOut',
    },
    LOWER_SPEED + DRIFT_SPEED + SHIFT_SPEED
  )
  .to(
    ['.blackbird'],
    {
      x: `-=${jetParams.x}`,
      y: `+=${jetParams.y - 150}`,
      duration: RAISE_SPEED,
      ease: 'Power2.easeInOut',
    },
    LOWER_SPEED + DRIFT_SPEED + SHIFT_SPEED
  )

to('.blackbird__body', {
  duration: 0.2,
  y: '+=2',
  repeat: -1,
  yoyo: true,
  ease: 'none',
})

// Antennae flash
new timeline({ repeat: -1 }).to('.antennae__flash', {
  scale: 1,
  stagger: 0.25,
  duration: 0.5,
})
// Color switching
const SWITCH_DELAY = 5
new timeline({
  delay: SWITCH_DELAY,
  repeat: -1,
  repeatDelay: SWITCH_DELAY,
  yoyo: true,
  ease: 'none',
})
  .to(document.documentElement, {
    duration: 1,
    '--blackbird-offset': 30,
    '--sky-lightness': 10,
    '--sky-saturation': 5,
    '--mountain-lightness': 20,
    '--ground-lightness': 15,
    '--tree-leaves-lightness': 15,
    '--tree-stump-lightness': 10,
    '--road-lightness': 10,
    '--road-alpha': 0.5,
    '--building-lightness': 40,
  })
  .to(document.documentElement, { duration: 0, '--glass-hue': 60 }, 0.5)

// GSDevTools.create()
