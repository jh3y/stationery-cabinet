const {
  gsap: {
    registerPlugin,
    to,
    set,
    timeline,
    utils: { random },
  },
  MorphSVGPlugin,
} = window

registerPlugin(MorphSVGPlugin)

const SCREAM_DURATION = 0.02

set('.snake__mouth', {
  transformOrigin: '50% 50%',
  scale: 0.1,
})

set('.snake__brow', { display: 'none' })

set('.snake__rattle-lines', { xPercent: -1.5 })

set('.snake__motion-line', {
  display: 'none',
  transformOrigin: '50% 50%',
})

set('.snake__eye', { transformOrigin: '50% 50%' })

let BLINK_TL
const BLINK = () => {
  const delay = random(2, 6)
  BLINK_TL = timeline().to('.snake__eye', {
    delay,
    onComplete: () => BLINK(),
    scaleY: 0.1,
    repeat: 1,
    yoyo: true,
    duration: 0.05,
  })
}

BLINK()

const WIGGLE = timeline({ paused: true })
  .to('.snake__motion-line', {
    rotate: -10,
    repeat: -1,
    yoyo: true,
    duration: SCREAM_DURATION,
  })
  .to(
    '.snake__rattle-line',
    {
      rotate: -10,
      repeat: -1,
      yoyo: true,
      x: index => (index < 1 ? -1 : 1),
      duration: SCREAM_DURATION,
    },
    0
  )

const TIE_SHAKE = timeline({
  paused: true,
}).to('.snake__tie-drop', {
  repeat: -1,
  transformOrigin: '50% 0',
  rotate: -5,
  yoyo: true,
  duration: SCREAM_DURATION,
})

const RATTLE = timeline()
  .to(
    ['.snake__body', '.snake__body-outline'],
    {
      morphSVG: '#wiggle',
      repeat: -1,
      duration: 1,
      yoyo: true,
    },
    0
  )
  .to(
    '.snake__rattle',
    {
      transformOrigin: '50% 125%',
      rotation: -15,
      repeat: -1,
      yoyo: true,
      duration: 1,
    },
    0
  )

const BELLOW = repeat =>
  timeline({
    repeat,
    onStart: () => {
      set(['.snake__motion-line', '.snake__brow'], { display: 'block' })
      WIGGLE.play()
      TIE_SHAKE.play()
      to(RATTLE, { timeScale: 100, duration: 0.25 })
    },
    onComplete: () => {
      set(['.snake__motion-line', '.snake__brow'], { display: 'none' })
      WIGGLE.pause()
      TIE_SHAKE.pause()
      to(RATTLE, { timeScale: 1, duration: 0.25 })
    },
  })
    .to('.snake__mouth', {
      scale: 0.85,
      duration: SCREAM_DURATION,
    })
    .to('.snake__mouth', {
      scale: 1,
      duration: SCREAM_DURATION,
    })

const scream = () => {
  const repeat = random(20, 50)
  const delay = random(2, 6)
  timeline({
    delay,
    onStart: () => {
      BLINK_TL.pause()
    },
    onComplete: () => {
      BLINK_TL.play()
      scream()
    },
  })
    .to('.snake__mouth', { duration: SCREAM_DURATION, scale: 1 })
    .to(
      '.snake__head',
      { duration: SCREAM_DURATION, xPercent: -1, yPercent: 0.5 },
      0
    )
    .add(BELLOW(repeat))
    .to('.snake__mouth', { duration: 0.2, scale: 0.1 })
    .to(
      '.snake__head',
      { duration: SCREAM_DURATION, xPercent: 0, yPercent: 0 },
      '<'
    )
}

scream()
