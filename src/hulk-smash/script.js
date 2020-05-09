const {
  gsap,
  Physics2DPlugin,
  gsap: { to, set, timeline },
} = window

// Register the plugin
gsap.registerPlugin(Physics2DPlugin)

const randomInRange = (min, max) =>
  Math.floor(Math.random() * max - min + 1) + min

const HULK = document.querySelector('.hulk')
const HULK_BACK = document.querySelector('.hulk__back')
const HULK_HEAD = document.querySelector('.hulk__head')
const HULK_EYES = [
  document.querySelector('.hulk__eye--left'),
  document.querySelector('.hulk__eye--right'),
]
const CRACKS = document.querySelector('.crack')
const FRAGMENT_CONTAINER = document.querySelector('.fragments')
const HULK_OPEN_MOUTH = document.querySelector('.hulk__mouth-scream')
const HULK_SMASH_ARMS = document.querySelector('.hulk__arms--smash-mode')
const HULK_FLIGHT_ARMS = document.querySelector('.hulk__arms--flight-mode')
const HULK_ARM_LEFT = document.querySelector('.hulk__arm--left')
const HULK_TORSO = document.querySelector('.hulk__torso')
const HULK_FOREARM_LEFT = document.querySelector('.hulk__forearm--left')
const HULK_ARM_RIGHT = document.querySelector('.hulk__arm--right')
const HULK_FOREARM_RIGHT = document.querySelector('.hulk__forearm--right')
const HULK_MOUTH = document.querySelector('.hulk__mouth')
const HULK_SWEAT = document.querySelector('.hulk__sweat')
const LIKE_BUTTON = document.querySelector('button')
const CONTAINER = document.querySelector('.smash')
const LIKE_LABEL = document.querySelector('.like-count')

const SIDES = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
}
const SOUNDS = {
  GRUNT: new Audio(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/grunt.mp3'
  ),
  LAND: new Audio(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/crash.mp3'
  ),
  // Baby roar
  JUMP: new Audio(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/baby-roar.mp3'
  ),
  // Adult?
  // JUMP: new Audio('https://freesound.org/data/previews/340/340162_4869949-lq.mp3')
  SMASHES: [
    new Audio(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/SmashOneNew.mp3'
    ),
    new Audio(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/SmashTwoNew.mp3'
    ),
  ],
}

const STATE = {
  READY: false,
  SMASHING: false,
  SIDE: SIDES.RIGHT,
  SMASHES: 0,
  LIKES: 0,
}

set(HULK, { transformOrigin: '50% 50%', scale: 0 })
set(HULK_SWEAT, { transformOrigin: '50% 0', scale: 0, opacity: 0, y: '-=5' })
set(HULK_EYES, { transformOrigin: '50% 50%' })
set(HULK_FOREARM_LEFT, { transformOrigin: '25% 25%' })
set(HULK_ARM_LEFT, { transformOrigin: '25% 25%' })
set([HULK_ARM_RIGHT, HULK_FOREARM_RIGHT], { transformOrigin: '75% 25%' })
set([HULK_BACK, HULK_MOUTH, HULK_SMASH_ARMS], { display: 'none' })

const JUMP_SPEED = 0.5
const LAND_LOOP_SPEED = 0.05
const WALK_OUT_TIME = 5
const WALK_OUT_SPEED = 3
const SMASH_SPEED = 0.05
const BLINK_SPEED = 0.05
const BREATHING_ROOM = 1
const CLOSE_EYES = 0.1

let walkOut
let breatheTimer

const RESET = () => {
  set([HULK_OPEN_MOUTH, HULK_HEAD, HULK_FLIGHT_ARMS], { display: 'block' })
  set([HULK_MOUTH], { display: 'none' })
}

const SIMMER_EYES = to(HULK_EYES, {
  duration: CLOSE_EYES,
  scaleY: 0.85,
  paused: true,
  onReverseComplete: () => set(HULK_EYES, { scaleY: 1 }),
})

const SWEAT_TL = new timeline({ paused: true, repeat: -1 })
  .to(HULK_SWEAT, { duration: 1, y: '+=10' }, 0)
  .to(HULK_SWEAT, { duration: 1, scale: 1 }, 0)
  .to(HULK_SWEAT, { duration: 0.5, opacity: 1 }, 0)
  .to(HULK_SWEAT, { duration: 0.5, opacity: 0 })

const HEAD_SHAKE_TL = new timeline({ paused: true, repeat: -1, yoyo: true }).to(
  HULK_HEAD,
  {
    y: '+=0.5',
    duration: 0.1,
  }
)
const BREATHE_TL = new timeline({ repeat: -1, yoyo: true }).to(HULK_TORSO, {
  duration: 1,
  y: '-=0.5',
})

const BUTTON_SMASH_TL = new timeline({ paused: true }).to(LIKE_BUTTON, {
  duration: SMASH_SPEED / 2,
  y: '+=10',
  repeat: 1,
  yoyo: true,
})

let BLINK_TL
let POUND_TL
const BLINK = () => {
  if (BLINK_TL) BLINK_TL.kill()
  set(HULK_EYES, { scaleY: 1 })
  BLINK_TL = new timeline({
    delay: randomInRange(1, 6),
    onComplete: () => BLINK(),
  }).to(HULK_EYES, {
    duration: BLINK_SPEED,
    scaleY: 0,
    repeat: 1,
    yoyo: true,
  })
}
BLINK()

const WALK_OUT = () => {
  return new timeline({
    onStart: () => {
      LIKE_BUTTON.setAttribute('disabled', true)
      SOUNDS.GRUNT.play()
    },
    onComplete: () => {
      STATE.READY = false
      LIKE_BUTTON.removeAttribute('disabled')
      RESET()
    },
  })
    .set(HULK_BACK, { display: 'block' })
    .set([HULK_HEAD, HULK_SMASH_ARMS], { display: 'none' })
    .set(HULK, { transformOrigin: '50% 100%' })
    .to(HULK, { scale: 0, duration: WALK_OUT_SPEED })
}

const startInactiveTimer = () => {
  if (walkOut) clearTimeout(walkOut)
  walkOut = setTimeout(WALK_OUT, WALK_OUT_TIME * 1000)
}

const JUMP = () => {
  // Set the state, disable the button
  LIKE_BUTTON.setAttribute('disabled', true)
  set(HULK_BACK, { display: 'none' })
  return new timeline({
    onStart: () => SOUNDS.JUMP.play(),
    onComplete: LAND,
  })
    .to(HULK, { scale: 1, duration: JUMP_SPEED }, 0)
    .to(
      HULK,
      { y: '-25vh', repeat: 1, yoyo: true, duration: JUMP_SPEED / 2 },
      0
    )
    .set(
      [HULK_FLIGHT_ARMS, HULK_OPEN_MOUTH],
      { display: 'none' },
      JUMP_SPEED * 0.85
    )
    .set([HULK_SMASH_ARMS, HULK_MOUTH], { display: 'block' }, JUMP_SPEED * 0.85)
}

const FRAGMENT_SPEED = 1
const FRAGMENT = () => {
  const NO_OF_FRAGMENTS = randomInRange(1, 5)
  for (let f = 0; f < NO_OF_FRAGMENTS; f++) {
    const FRAGMENT = document.createElement('span')
    FRAGMENT.className = 'fragment'
    FRAGMENT.style.setProperty('--x', randomInRange(10, 90))
    FRAGMENT.style.setProperty('--radius', randomInRange(0, 50))
    FRAGMENT.style.setProperty('--lightness', randomInRange(15, 60))
    FRAGMENT.style.setProperty('--size', randomInRange(5, 15))
    FRAGMENT.style.setProperty('--rotation', randomInRange(0, 360))
    FRAGMENT_CONTAINER.appendChild(FRAGMENT)

    new timeline({
      onComplete: () => FRAGMENT.remove(),
    })
      .to(FRAGMENT, {
        duration: FRAGMENT_SPEED,
        scale: 1,
        physics2D: {
          velocity: window.innerHeight * 0.25,
          angle: 'random(-180, 0)',
          gravity: `random(${window.innerHeight * 0.25}, ${window.innerHeight *
            0.5})`,
        },
      })
      .to(
        FRAGMENT,
        {
          opacity: 0,
          duration: 0.25,
        },
        FRAGMENT_SPEED - 0.25
      )
  }
}

const CANCEL_ACTION = () => {
  STATE.SMASHING = false
  // Set walk away
  startInactiveTimer()
  // Kill sweating timeline
  SWEAT_TL.pause()
  SWEAT_TL.time(0)
  // Reset headshake
  HEAD_SHAKE_TL.pause()
  HEAD_SHAKE_TL.time(0)
  STATE.SWEATING = false
  // Kill smash counter?
  STATE.SMASHES = 0
  // Reset blinking
  BLINK()
  // Reset arms
  set([HULK_ARM_LEFT, HULK_ARM_RIGHT, HULK_FOREARM_LEFT, HULK_FOREARM_RIGHT], {
    rotate: 0,
  })
  if (breatheTimer) clearTimeout(breatheTimer)
  breatheTimer = setTimeout(
    () => BREATHE_TL.timeScale(1),
    BREATHING_ROOM * 1000
  )
  // Open eyes back up
  SIMMER_EYES.reverse()
}

const POUND = () => {
  const ACTIVE_SIDE = STATE.SIDE
  const FOREARM =
    ACTIVE_SIDE === SIDES.LEFT ? HULK_FOREARM_LEFT : HULK_FOREARM_RIGHT
  const ARM = ACTIVE_SIDE === SIDES.LEFT ? HULK_ARM_LEFT : HULK_ARM_RIGHT
  const SMASH_SOUND =
    ACTIVE_SIDE === SIDES.LEFT ? SOUNDS.SMASHES[0] : SOUNDS.SMASHES[1]
  const COEFFICIENT = ACTIVE_SIDE === SIDES.LEFT ? -1 : 1
  set([HULK_ARM_LEFT, HULK_ARM_RIGHT, HULK_FOREARM_LEFT, HULK_FOREARM_RIGHT], {
    rotate: 0,
  })
  POUND_TL = new timeline({
    onStart: () => {
      STATE.SIDE = ACTIVE_SIDE === SIDES.LEFT ? SIDES.RIGHT : SIDES.LEFT
      STATE.SMASHES += 1
      if (STATE.SMASHES > 10 && !STATE.SWEATING) {
        STATE.SWEATING = true
        BREATHE_TL.timeScale(10)
        SWEAT_TL.play()
      }
    },
    onComplete: () => {
      SMASH_SOUND.play()
      set(
        [HULK_ARM_LEFT, HULK_ARM_RIGHT, HULK_FOREARM_LEFT, HULK_FOREARM_RIGHT],
        { rotate: 0 }
      )
      LIKE_LABEL.innerHTML = parseInt(LIKE_LABEL.innerHTML, 10) + 1
      BUTTON_SMASH_TL.restart()
      FRAGMENT()
      if (STATE.SMASHING) {
        POUND()
      }
    },
  })
    .to(
      ARM,
      {
        repeat: 1,
        yoyo: true,
        duration: SMASH_SPEED,
        rotate: 15 * COEFFICIENT,
      },
      0
    )
    .to(
      FOREARM,
      {
        repeat: 1,
        yoyo: true,
        duration: SMASH_SPEED,
        rotate: 25 * COEFFICIENT,
      },
      0
    )
  return POUND_TL
}

const ACTION = () => {
  if (!STATE.READY) {
    JUMP()
  }
  if (
    STATE.READY &&
    !STATE.SMASHING &&
    ((POUND_TL && POUND_TL.progress() === 1) || !POUND_TL)
  ) {
    STATE.SMASHING = true
    if (walkOut) clearTimeout(walkOut)
    if (BLINK_TL) {
      BLINK_TL.kill()
    }
    HEAD_SHAKE_TL.play()
    SIMMER_EYES.play()
    if (breatheTimer) clearTimeout(breatheTimer)
    BREATHE_TL.timeScale(6)
    LIKE_BUTTON.addEventListener('mouseup', CANCEL_ACTION)
    POUND()
  }
}

const LAND = () => {
  new timeline({
    repeat: 9,
    yoyo: true,
    onStart: () => {
      SOUNDS.LAND.play()
      set(CRACKS, { display: 'block' })
    },
    onComplete: () => {
      LIKE_BUTTON.removeAttribute('disabled')
      STATE.READY = true
      // Remove click and add mousedown listener
      LIKE_BUTTON.removeEventListener('click', ACTION)
      LIKE_BUTTON.addEventListener('mousedown', ACTION)
      // On land, start the inactivity timer in case we don't smash
      startInactiveTimer()
    },
  })
    .to(CONTAINER, {
      duration: LAND_LOOP_SPEED,
      y: '+=4',
      x: '-=2',
    })
    .to(CONTAINER, {
      duration: LAND_LOOP_SPEED,
      y: '-=2',
      x: '+=4',
    })
    .to(CONTAINER, {
      duration: LAND_LOOP_SPEED,
      y: '+=3',
      x: '-=1',
    })
    .to(CONTAINER, {
      duration: LAND_LOOP_SPEED,
      y: 0,
      x: 0,
    })
}

LIKE_BUTTON.addEventListener('click', ACTION)
