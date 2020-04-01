const {
  MorphSVGPlugin,
  gsap: { to, timeline, set, registerPlugin },
} = window

const CONFIG = {
  SPEED: {
    CLOUD: 0.25,
  },
  COLORS: {
    CLOUD: {
      ON: 100,
      OFF: 65,
    },
  },
}

registerPlugin(MorphSVGPlugin)

const CLOUD_WRAPPER = document.querySelector(
  '.cloud__wrapper:not(.cloud__wrapper--baby)'
)
const CLOUD = document.querySelector('.cloud:not(.cloud--baby)')
const CLOUD_EYES = [
  ...document.querySelectorAll('.cloud:not(.cloud--baby) .cloud__eye'),
]
const BABY_EYES = [...document.querySelectorAll('.cloud--baby .cloud__eye')]
const CLOUD_MOUTHS = [...document.querySelectorAll('.cloud__mouth--sad path')]
const HAPPY_CLOUD_MOUTH_PATHS = [
  ...document.querySelectorAll('.cloud__mouth--happy path'),
]
const RAINBOW = document.querySelector('.rainbow')
const THRILLED_FACES = [...document.querySelectorAll('.cloud__face--thrilled')]
const FACES = [
  ...document.querySelectorAll('.cloud__face:not(.cloud__face--thrilled)'),
]
set(THRILLED_FACES, { display: 'none' })
set(CLOUD_WRAPPER, { transformOrigin: '135% 55%' })
set(CLOUD, {
  transformOrigin: '50% 50%',
})
set('.cloud--baby .cloud__eye path:nth-of-type(2)', {
  x: 2,
  transformOrigin: '50% 50% ',
})
set(CLOUD_MOUTHS, { morphSVG: index => CLOUD_MOUTHS[index] })
set(document.documentElement, {
  '--saturation': 0,
  '--lightness': 50,
  '--cloud-lightness': CONFIG.COLORS.CLOUD.OFF,
})

const CLOUD_TIMELINE = () =>
  new timeline({
    onStart: () => {
      // Make them smile
      set(CLOUD_MOUTHS, {
        morphSVG: index => HAPPY_CLOUD_MOUTH_PATHS[index],
      })
    },
  })
    // Traveling over the arc
    .add(
      to(CLOUD_WRAPPER, {
        duration: CONFIG.SPEED.CLOUD,
        rotate: 180,
      })
    )
    // Counter rotating the cloud
    .add(
      to(CLOUD, {
        duration: CONFIG.SPEED.CLOUD,
        rotate: -180,
      }),
      0
    )

set(RAINBOW, { transformOrigin: '50% 100%', rotate: 180 })
const RAINBOW_TL = () =>
  to(RAINBOW, {
    duration: CONFIG.SPEED.CLOUD,
    rotate: 360,
  })

const COLOR_TL = () =>
  to(document.documentElement, {
    duration: CONFIG.SPEED.CLOUD,
    '--cloud-lightness': 100,
    '--saturation': 80,
    '--lightness': 70,
  })

const BREATHE_TL = () =>
  new timeline().add(
    to('.cloud__body', {
      scale: 1.05,
      repeat: -1,
      yoyo: true,
      transformOrigin: '50% 50%',
      delay: 'random(0, -1, 0.1)',
      duration: 'random(1, 3, 0.1)',
    })
  )
// Breathe timeline
BREATHE_TL()

// Blinking TL
const BLINK_TL = eyes => {
  const delay = Math.random() * 10 + 2
  new timeline({
    delay,
    onComplete: () => BLINK_TL(eyes),
  }).add(
    to(eyes, {
      duration: 0.1,
      repeat: 1,
      yoyo: true,
      scaleY: 0,
      transformOrigin: '50% 50%',
    })
  )
}
BLINK_TL(CLOUD_EYES)
BLINK_TL(BABY_EYES)

const THRILLED_TL = (faceIndex, onComplete) => {
  const delay = Math.random() * 5 + 2
  return new timeline({
    delay,
    onComplete,
  })
    .add(
      to(FACES[faceIndex], {
        duration: 0,
        display: FACES[faceIndex].style.display === 'none' ? 'block' : 'none',
      }),
      0
    )
    .add(
      to(THRILLED_FACES[faceIndex], {
        duration: 0,
        display:
          THRILLED_FACES[faceIndex].style.display === 'block'
            ? 'none'
            : 'block',
      }),
      0
    )
}
let THRILLER_ONE
let THRILLER_TWO
// This is the daddy
const TOGGLE_TL = new timeline({
  paused: true,
  onComplete: () => {
    THRILLER_ONE = THRILLED_TL(0, () => (THRILLER_ONE = THRILLED_TL(0)))
    THRILLER_TWO = THRILLED_TL(1, () => (THRILLER_TWO = THRILLED_TL(1)))
  },
})

// Add the cloud timeline
TOGGLE_TL.add(COLOR_TL(), 0)
  .add(CLOUD_TIMELINE(), 0)
  .add(RAINBOW_TL(), 0)

// GSDevTools.create()

// Now we need a button
const BUTTON = document.querySelector('button')

BUTTON.addEventListener('click', () => {
  if (TOGGLE_TL.progress() !== 0 && TOGGLE_TL.reversed() !== true) {
    set(CLOUD_MOUTHS, {
      morphSVG: index => CLOUD_MOUTHS[index],
    })
    // Kill all randomized thrilled face timelines
    set(FACES, { display: 'block' })
    set(THRILLED_FACES, { display: 'none' })
    THRILLER_ONE.pause()
    THRILLER_ONE.seek(0)
    THRILLER_TWO.pause()
    THRILLER_TWO.seek(0)
    // Empty the Array
    TOGGLE_TL.reverse()
  } else {
    TOGGLE_TL.play()
  }
})

to('.rainbow__beam', {
  ease: 'Power0.easeNone',
  duration: 'random(0.5, 2, 0.1)',
  delay: 'random(0, 1, 0.1)',
  '--rainbow-lightness': 'random(50, 75, 1)',
  repeat: -1,
  yoyo: true,
})
