const {
  gsap: { timeline, to, set },
} = window

const CONFIG = {
  SPEED: {
    LOWER: 5,
    UPPER: 8,
  },
}

const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min
const JETS = []
let TL
let killTimer

const BTN = document.querySelector('button')
const MANDO = document.querySelector('.mando__container')
const SHOT = document.querySelector('.shot')
const SHOTS = document.querySelector('.shots')
const RIGHT_ARM = document.querySelector('.mando__right-arm')
const LEFT_ARM = document.querySelector('.mando__left-arm')
const BLASTS = [...document.querySelectorAll('.mando__jet-blast')]

set(MANDO, {
  x: Math.random() * window.innerWidth,
})
set(LEFT_ARM, { rotate: 30, transformOrigin: '10% 10%' })
set([RIGHT_ARM, SHOTS], { rotate: 80, transformOrigin: '10% 60%' })
set(BLASTS, { transformOrigin: '50% 50%' })
set(MANDO, { transformOrigin: '50% 50%', rotate: 30 })
// set(SHOTS, { rotate: '+=30'})
const getFlightMechanics = () => {
  const { x: xCurrent } = MANDO.getBoundingClientRect()
  const RES = {}
  if (xCurrent > window.innerWidth / 2) {
    RES.flip = true
    RES.angle = randomInRange(-110, -90)
  } else {
    RES.flip = false
    RES.angle = randomInRange(-90, -70)
  }
  RES.duration = randomInRange(CONFIG.SPEED.LOWER, CONFIG.SPEED.UPPER)
  return RES
}

set(['.mandalorian__jet-bubbles circle', '.mandalorian__jets rect'], {
  '--hue': () => randomInRange(10, 60),
  '--saturation': () => randomInRange(70, 100),
  '--lightness': () => randomInRange(50, 90),
})

const killJets = () => {
  JETS.forEach(jet => jet.kill())
  JETS.length = 0
  set('.mandalorian__flames', { display: 'none' })
}
const startJets = () => {
  if (JETS.length) killJets()
  set('.mandalorian__flames', { display: 'block' })
  BLASTS.forEach(blast => {
    const TWEEN = to(blast, {
      duration: 'random(0.05, 0.3)',
      delay: () => -Math.random(),
      repeat: -1,
      yoyo: true,
      transformOrigin: '50% 50%',
      scale: 'random(1, 6)',
    })
    JETS.push(TWEEN)
  })
}

const onTakeOff = duration => {
  // Reset the shots
  set(SHOT, { x: 0, opacity: 1 })
  // Disable the button to prevent spamming it
  BTN.setAttribute('disabled', true)
  // Start rockets
  /* eslint-disable */
  zzfx(
    ...[
      ,
      ,
      819,
      duration / 10,
      duration / 6,
      0.6,
      ,
      3.14,
      ,
      ,
      ,
      ,
      ,
      0.9,
      ,
      1.9,
      0.46,
    ]
  )
  /* eslint-enable */
  startJets()
  killTimer = setTimeout(() => killJets(), duration * 1000 * 0.4)
}

const onLand = () => {
  // Get bounds for mando, if he's out of the picture
  // Bring him in.
  let x = MANDO.getBoundingClientRect().x
  if (x > window.innerWidth && x > window.innerWidth / 2)
    x = randomInRange(window.innerWidth / 2, window.innerWidth)
  if (x < 0) x = randomInRange(0, window.innerWidth / 2)
  set(MANDO, { x, y: 0 })
  // Reenable the button
  BTN.removeAttribute('disabled')
  // Show the jetpack flames
  if (killTimer) clearTimeout(killTimer)
  set('.mandalorian__flames', { display: 'block' })
}

const fly = () => {
  const { angle, flip, duration } = getFlightMechanics()
  const shotDelay = Math.random() * (duration / 10) + duration / 10
  const flightAngle = randomInRange(0, 30)
  set(MANDO, {
    rotationY: flip ? 180 : 0,
    rotate: flip ? -flightAngle : flightAngle,
  })
  if (killTimer) clearTimeout(killTimer)
  set('.mandalorian__flames', { display: 'block' })
  TL = new timeline({
    onStart: () => onTakeOff(duration),
    onComplete: onLand,
  })
    .to(
      MANDO,
      {
        duration,
        onUpdate: () => {
          // If Mando is out of bounds, kill the timeline.
          const { top, left, width } = MANDO.getBoundingClientRect()
          if (
            top > window.innerHeight ||
            left < -(width * 1.5) ||
            left > window.innerWidth + width ||
            top < -(width * 1.5)
          ) {
            TL.progress(1)
          }
        },
        physics2D: {
          angle,
          velocity: randomInRange(window.innerHeight * 0.6, window.innerHeight),
          gravity: randomInRange(
            window.innerHeight * 0.25,
            window.innerHeight * 0.5
          ),
        },
      },
      0
    )
    .to(
      [RIGHT_ARM, SHOTS],
      {
        duration: 0.3,
        rotation: `-=${randomInRange(30, 90)}`,
        repeat: 1,
        yoyo: true,
        repeatDelay: shotDelay + 0.6,
      },
      0
    )
    .to(
      [LEFT_ARM],
      {
        duration: 0.3,
        rotation: randomInRange(0, 80),
        repeat: 1,
        yoyo: true,
        repeatDelay: shotDelay + 0.6,
      },
      0
    )
    .to(
      SHOT,
      {
        onStart: () => {
          /* eslint-disable */
          zzfx(
            ...[
              ,
              ,
              448,
              0.01,
              0.1,
              0.3,
              3,
              0.39,
              -0.5,
              ,
              ,
              ,
              ,
              ,
              0.2,
              0.1,
              0.08,
            ]
          )
          /* eslint-enable */
          // zzfx(...[, , 179, , 0.06, 0.47, 2, 2.19, 6.4, , , , , 1, , 0.3])
        },
        onComplete: () => set(SHOT, { x: 0 }),
        onRepeat: () => {
          /* eslint-disable */
          zzfx(
            ...[
              ,
              ,
              448,
              0.01,
              0.1,
              0.3,
              3,
              0.39,
              -0.5,
              ,
              ,
              ,
              ,
              ,
              0.2,
              0.1,
              0.08,
            ]
          )
          /* eslint-enable */
          // zzfx(...[, , 179, , 0.06, 0.47, 2, 2.19, 6.4, , , , , 1, , 0.3])
        },
        duration: 0.2,
        x: '+=50vw',
        opacity: 0,
        repeat: randomInRange(0, 2),
      },
      shotDelay
    )
}

BTN.addEventListener('click', fly)
